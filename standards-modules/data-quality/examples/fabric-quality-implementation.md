# Fabric Quality Implementation Example

> Module: ISL-06 | Version: 1.0 | Type: Example

## Purpose

This document provides a fully worked example of implementing the ISL-06 data quality framework within Microsoft Fabric. It includes PySpark notebook patterns for quality rule execution, Great Expectations integration, native PySpark quality checks, medallion layer quality gates for bronze-to-silver and silver-to-gold transitions, Fabric notebook scheduling, quality results storage in Delta tables, and alerting via Azure Logic Apps. All code patterns are production-ready and designed for the Fabric Lakehouse environment.

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│  FABRIC WORKSPACE                                                     │
│                                                                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐           │
│  │  Bronze Layer │───►│ DQ Gate 1    │───►│  Silver Layer │          │
│  │  (Raw Data)   │    │ (Schema +    │    │  (Cleansed)  │          │
│  │              │    │  Row-Level)  │    │              │           │
│  └──────────────┘    └──────────────┘    └───────┬──────┘          │
│                                                   │                  │
│                                          ┌────────▼──────┐          │
│                                          │  DQ Gate 2    │          │
│                                          │  (Aggregate + │          │
│                                          │   Business)   │          │
│                                          └────────┬──────┘          │
│                                                   │                  │
│                                          ┌────────▼──────┐          │
│                                          │  Gold Layer   │          │
│                                          │  (Curated)    │          │
│                                          └──────────────┘           │
│                                                                       │
│  ┌──────────────────────────────────────────────┐                   │
│  │  Quality Results Lakehouse                    │                   │
│  │  - dq_rule_results (Delta)                    │                   │
│  │  - dq_failed_records (Delta)                  │                   │
│  │  - dq_scores (Delta)                          │                   │
│  │  - dq_sla_compliance (Delta)                  │                   │
│  └──────────────────────────────────────────────┘                   │
│                                                                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │  Power BI     │    │  Logic Apps   │    │  Fabric      │          │
│  │  Dashboard    │    │  (Alerts)     │    │  Pipeline    │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Quality Engine Notebook

### Notebook 1: ISL06_QualityEngine (Main Orchestrator)

```python
# Cell 1: Configuration and Imports
# ============================================================
from pyspark.sql import functions as F
from pyspark.sql import DataFrame
from pyspark.sql.types import *
from datetime import datetime, timedelta
import json
import hashlib
import requests

# Configuration
LAKEHOUSE_NAME = "quality_lakehouse"
RESULTS_TABLE = "dq_rule_results"
FAILED_RECORDS_TABLE = "dq_failed_records"
SCORES_TABLE = "dq_scores"
MAX_FAILED_SAMPLES = 1000
RUN_ID = f"dqrun_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"

# SLA Thresholds (loaded from config table in production)
SLA_THRESHOLDS = {
    "critical": {
        "completeness": 0.99, "accuracy": 0.98, "timeliness": 15,
        "consistency": 0.99, "validity": 0.995, "uniqueness": 0.999
    },
    "standard": {
        "completeness": 0.95, "accuracy": 0.95, "timeliness": 60,
        "consistency": 0.95, "validity": 0.98, "uniqueness": 0.99
    },
    "informational": {
        "completeness": 0.90, "accuracy": 0.90, "timeliness": 240,
        "consistency": 0.90, "validity": 0.95, "uniqueness": 0.95
    }
}

print(f"Quality Engine initialized. Run ID: {RUN_ID}")
```

```python
# Cell 2: Quality Rule Base Class
# ============================================================

class QualityRule:
    """Base class for all ISL-06 quality rules."""

    def __init__(self, rule_id, name, category, dimension, severity, threshold):
        self.rule_id = rule_id
        self.name = name
        self.category = category
        self.dimension = dimension
        self.severity = severity
        self.threshold = threshold

    def evaluate(self, df, **kwargs):
        """Override in subclass. Returns (score, details_dict, failed_df)."""
        raise NotImplementedError

    def to_result_row(self, dataset_name, score, details, passed, run_id):
        return {
            "run_id": run_id,
            "rule_id": self.rule_id,
            "rule_name": self.name,
            "category": self.category,
            "dimension": self.dimension,
            "severity": self.severity,
            "dataset_name": dataset_name,
            "score": float(score),
            "threshold": float(self.threshold),
            "passed": passed,
            "details": json.dumps(details),
            "evaluated_at": datetime.utcnow().isoformat()
        }
```

```python
# Cell 3: Schema Validation Rules Implementation
# ============================================================

class ColumnExistenceRule(QualityRule):
    """QR-S01: Validates all expected columns exist."""

    def __init__(self, expected_columns):
        super().__init__("QR-S01", "Column Existence", "Schema",
                         "validity", "Critical", 1.0)
        self.expected_columns = expected_columns

    def evaluate(self, df, **kwargs):
        actual = set(df.columns)
        expected = set(self.expected_columns)
        missing = expected - actual
        extra = actual - expected
        score = len(expected - missing) / len(expected) if expected else 1.0
        passed = len(missing) == 0
        details = {
            "expected_count": len(expected),
            "actual_count": len(actual),
            "missing_columns": list(missing),
            "extra_columns": list(extra)
        }
        return score, details, None


class NullableComplianceRule(QualityRule):
    """QR-S03: Validates non-nullable columns have no NULLs."""

    def __init__(self, non_nullable_columns):
        super().__init__("QR-S03", "Nullable Compliance", "Schema",
                         "validity", "Critical", 1.0)
        self.non_nullable_columns = non_nullable_columns

    def evaluate(self, df, **kwargs):
        violations = {}
        total_rows = df.count()
        for col_name in self.non_nullable_columns:
            if col_name in df.columns:
                null_count = df.filter(F.col(col_name).isNull()).count()
                if null_count > 0:
                    violations[col_name] = null_count

        total_checks = total_rows * len(self.non_nullable_columns)
        total_nulls = sum(violations.values())
        score = (total_checks - total_nulls) / total_checks if total_checks > 0 else 1.0
        passed = len(violations) == 0

        # Collect sample failed records
        failed_df = None
        if violations:
            conditions = [F.col(c).isNull() for c in violations.keys()]
            combined = conditions[0]
            for cond in conditions[1:]:
                combined = combined | cond
            failed_df = df.filter(combined).limit(MAX_FAILED_SAMPLES)

        return score, {"violations": violations}, failed_df


class PKUniquenessRule(QualityRule):
    """QR-S04: Validates primary key uniqueness."""

    def __init__(self, pk_columns):
        super().__init__("QR-S04", "PK Uniqueness", "Schema",
                         "uniqueness", "Critical", 1.0)
        self.pk_columns = pk_columns

    def evaluate(self, df, **kwargs):
        total = df.count()
        distinct = df.select(self.pk_columns).distinct().count()
        duplicates = total - distinct
        score = distinct / total if total > 0 else 1.0
        passed = duplicates == 0

        failed_df = None
        if duplicates > 0:
            dup_keys = df.groupBy(self.pk_columns).count() \
                .filter(F.col("count") > 1) \
                .limit(MAX_FAILED_SAMPLES)
            failed_df = dup_keys

        return score, {"total": total, "distinct": distinct, "duplicates": duplicates}, failed_df
```

```python
# Cell 4: Row-Level Rules Implementation
# ============================================================

class NullCheckRule(QualityRule):
    """QR-R01: Checks for NULL and null-equivalent values."""

    NULL_EQUIVALENTS = ['', 'N/A', 'NA', 'NULL', 'NONE', 'UNKNOWN', '-']

    def __init__(self, column_name, severity="Major"):
        super().__init__("QR-R01", f"Null Check ({column_name})", "Row-Level",
                         "completeness", severity, 0.95)
        self.column_name = column_name

    def evaluate(self, df, **kwargs):
        total = df.count()
        null_filter = (
            F.col(self.column_name).isNull() |
            F.trim(F.col(self.column_name).cast("string")).isin(self.NULL_EQUIVALENTS) |
            (F.trim(F.col(self.column_name).cast("string")) == "")
        )
        null_count = df.filter(null_filter).count()
        score = (total - null_count) / total if total > 0 else 1.0
        passed = score >= self.threshold
        failed_df = df.filter(null_filter).limit(MAX_FAILED_SAMPLES) if null_count > 0 else None
        return score, {"null_count": null_count, "total": total}, failed_df


class RangeCheckRule(QualityRule):
    """QR-R02: Validates numeric values within expected range."""

    def __init__(self, column_name, min_val, max_val):
        super().__init__("QR-R02", f"Range Check ({column_name})", "Row-Level",
                         "validity", "Major", 0.98)
        self.column_name = column_name
        self.min_val = min_val
        self.max_val = max_val

    def evaluate(self, df, **kwargs):
        non_null = df.filter(F.col(self.column_name).isNotNull())
        total = non_null.count()
        out_of_range_filter = (
            (F.col(self.column_name) < self.min_val) |
            (F.col(self.column_name) > self.max_val)
        )
        violations = non_null.filter(out_of_range_filter).count()
        score = (total - violations) / total if total > 0 else 1.0
        passed = score >= self.threshold
        failed_df = non_null.filter(out_of_range_filter).limit(MAX_FAILED_SAMPLES) \
            if violations > 0 else None
        return score, {"violations": violations, "total": total,
                       "min": self.min_val, "max": self.max_val}, failed_df


class EnumValidationRule(QualityRule):
    """QR-R04: Validates values against allowed enumeration."""

    def __init__(self, column_name, allowed_values):
        super().__init__("QR-R04", f"Enum Validation ({column_name})", "Row-Level",
                         "validity", "Major", 0.98)
        self.column_name = column_name
        self.allowed_values = allowed_values

    def evaluate(self, df, **kwargs):
        non_null = df.filter(F.col(self.column_name).isNotNull())
        total = non_null.count()
        invalid = non_null.filter(~F.col(self.column_name).isin(self.allowed_values)).count()
        score = (total - invalid) / total if total > 0 else 1.0
        passed = score >= self.threshold

        failed_df = None
        if invalid > 0:
            failed_df = non_null.filter(
                ~F.col(self.column_name).isin(self.allowed_values)
            ).limit(MAX_FAILED_SAMPLES)

        return score, {"invalid": invalid, "total": total,
                       "allowed": self.allowed_values}, failed_df
```

```python
# Cell 5: Aggregate Rules Implementation
# ============================================================

class FreshnessCheckRule(QualityRule):
    """QR-A05: Validates data freshness within expected window."""

    def __init__(self, timestamp_column, max_age_hours=24):
        super().__init__("QR-A05", f"Freshness Check ({timestamp_column})", "Aggregate",
                         "timeliness", "Critical", 1.0)
        self.timestamp_column = timestamp_column
        self.max_age_hours = max_age_hours

    def evaluate(self, df, **kwargs):
        latest = df.agg(F.max(self.timestamp_column)).collect()[0][0]
        if latest is None:
            return 0.0, {"message": "No records found"}, None

        age_hours = (datetime.utcnow() - latest).total_seconds() / 3600
        score = 1.0 if age_hours <= self.max_age_hours else 0.0
        passed = age_hours <= self.max_age_hours
        return score, {
            "latest_record": str(latest),
            "age_hours": round(age_hours, 2),
            "max_age_hours": self.max_age_hours
        }, None


class RowCountDeltaRule(QualityRule):
    """QR-A02: Validates row count change within threshold."""

    def __init__(self, max_delta_pct=20.0):
        super().__init__("QR-A02", "Row Count Delta", "Aggregate",
                         "completeness", "Major", 1.0)
        self.max_delta_pct = max_delta_pct

    def evaluate(self, df, **kwargs):
        prior_count = kwargs.get("prior_count", None)
        current_count = df.count()

        if prior_count is None or prior_count == 0:
            return 1.0, {"message": "No prior count; first run",
                         "current": current_count}, None

        pct_change = abs(current_count - prior_count) * 100.0 / prior_count
        score = 1.0 if pct_change <= self.max_delta_pct else 0.0
        passed = pct_change <= self.max_delta_pct
        return score, {
            "current": current_count,
            "prior": prior_count,
            "pct_change": round(pct_change, 2)
        }, None
```

```python
# Cell 6: Quality Gate Orchestrator
# ============================================================

class QualityGate:
    """Orchestrates quality rule execution for a dataset at a medallion transition."""

    def __init__(self, dataset_name, data_tier, gate_name):
        self.dataset_name = dataset_name
        self.data_tier = data_tier
        self.gate_name = gate_name
        self.rules = []
        self.results = []

    def add_rule(self, rule):
        self.rules.append(rule)
        return self

    def execute(self, df, **kwargs):
        """Execute all rules and return aggregated results."""
        print(f"\n{'='*60}")
        print(f"Quality Gate: {self.gate_name}")
        print(f"Dataset: {self.dataset_name} | Tier: {self.data_tier}")
        print(f"Rules to evaluate: {len(self.rules)}")
        print(f"{'='*60}")

        all_passed = True
        critical_failed = False
        results = []

        for rule in self.rules:
            try:
                score, details, failed_df = rule.evaluate(df, **kwargs)
                passed = score >= rule.threshold
                result = rule.to_result_row(
                    self.dataset_name, score, details, passed, RUN_ID
                )
                results.append(result)

                status = "PASS" if passed else "FAIL"
                print(f"  [{status}] {rule.rule_id} {rule.name}: "
                      f"{score:.4f} (threshold: {rule.threshold})")

                if not passed:
                    all_passed = False
                    if rule.severity == "Critical":
                        critical_failed = True

                # Store failed record samples
                if failed_df is not None and failed_df.count() > 0:
                    self._store_failed_records(rule, failed_df)

            except Exception as e:
                print(f"  [ERROR] {rule.rule_id} {rule.name}: {str(e)}")
                results.append(rule.to_result_row(
                    self.dataset_name, 0.0, {"error": str(e)}, False, RUN_ID
                ))
                all_passed = False

        self.results = results
        self._store_results(results)

        gate_passed = not critical_failed  # Gate passes if no Critical rules failed
        print(f"\nGate Result: {'PASSED' if gate_passed else 'BLOCKED'}")
        print(f"  Total: {len(results)} | Passed: {sum(1 for r in results if r['passed'])} | "
              f"Failed: {sum(1 for r in results if not r['passed'])}")

        return gate_passed, results

    def _store_results(self, results):
        """Persist rule results to Delta table."""
        schema = StructType([
            StructField("run_id", StringType(), False),
            StructField("rule_id", StringType(), False),
            StructField("rule_name", StringType(), False),
            StructField("category", StringType(), False),
            StructField("dimension", StringType(), False),
            StructField("severity", StringType(), False),
            StructField("dataset_name", StringType(), False),
            StructField("score", DoubleType(), False),
            StructField("threshold", DoubleType(), False),
            StructField("passed", BooleanType(), False),
            StructField("details", StringType(), True),
            StructField("evaluated_at", StringType(), False)
        ])
        results_df = spark.createDataFrame(results, schema)
        results_df.write.mode("append").format("delta").saveAsTable(
            f"{LAKEHOUSE_NAME}.{RESULTS_TABLE}"
        )

    def _store_failed_records(self, rule, failed_df):
        """Persist sample failed records to Delta table."""
        sample_df = failed_df.limit(MAX_FAILED_SAMPLES).withColumn(
            "run_id", F.lit(RUN_ID)
        ).withColumn(
            "rule_id", F.lit(rule.rule_id)
        ).withColumn(
            "dataset_name", F.lit(self.dataset_name)
        ).withColumn(
            "captured_at", F.current_timestamp()
        )
        sample_df.write.mode("append").format("delta").saveAsTable(
            f"{LAKEHOUSE_NAME}.{FAILED_RECORDS_TABLE}"
        )
```

```python
# Cell 7: Bronze-to-Silver Quality Gate Example
# ============================================================

# Load bronze data
bronze_orders = spark.table("bronze_lakehouse.raw_sales_orders")

# Define Quality Gate 1: Bronze -> Silver
gate_1 = QualityGate("sales_orders", "critical", "Bronze-to-Silver Gate")

# Add schema validation rules
gate_1.add_rule(ColumnExistenceRule([
    "order_id", "customer_id", "order_date", "ship_date",
    "total_amount", "status", "region"
]))
gate_1.add_rule(NullableComplianceRule(["order_id", "customer_id", "order_date"]))
gate_1.add_rule(PKUniquenessRule(["order_id"]))

# Add row-level rules
gate_1.add_rule(NullCheckRule("customer_id", "Critical"))
gate_1.add_rule(NullCheckRule("order_date", "Critical"))
gate_1.add_rule(NullCheckRule("total_amount", "Major"))
gate_1.add_rule(RangeCheckRule("total_amount", 0, 10000000))
gate_1.add_rule(EnumValidationRule("status", [
    "New", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"
]))

# Execute gate
gate_passed, results = gate_1.execute(bronze_orders)

if gate_passed:
    # Promote to silver layer
    print("\nPromoting data to Silver layer...")
    bronze_orders.write.mode("overwrite").format("delta").saveAsTable(
        "silver_lakehouse.sales_orders"
    )
    print("Silver promotion complete.")
else:
    print("\nBLOCKED: Data quality gate failed. Data NOT promoted to Silver.")
    # Trigger alert
    send_quality_alert(gate_1.results, "Bronze-to-Silver BLOCKED")
```

```python
# Cell 8: Silver-to-Gold Quality Gate Example
# ============================================================

# Load silver data
silver_orders = spark.table("silver_lakehouse.sales_orders")

# Define Quality Gate 2: Silver -> Gold
gate_2 = QualityGate("sales_orders", "critical", "Silver-to-Gold Gate")

# Aggregate rules
gate_2.add_rule(FreshnessCheckRule("order_date", max_age_hours=48))
gate_2.add_rule(RowCountDeltaRule(max_delta_pct=20))

# Execute with prior count from metadata
prior_count = spark.sql("""
    SELECT row_count FROM quality_lakehouse.dq_load_history
    WHERE dataset_name = 'sales_orders'
    ORDER BY load_timestamp DESC LIMIT 1
""").collect()
prior = prior_count[0][0] if prior_count else None

gate_passed, results = gate_2.execute(silver_orders, prior_count=prior)

if gate_passed:
    print("\nPromoting data to Gold layer...")
    # Gold layer transformations and write
    gold_orders = silver_orders.groupBy("region", "order_date").agg(
        F.count("order_id").alias("order_count"),
        F.sum("total_amount").alias("total_revenue")
    )
    gold_orders.write.mode("overwrite").format("delta").saveAsTable(
        "gold_lakehouse.sales_summary"
    )
    print("Gold promotion complete.")
else:
    print("\nBLOCKED: Silver-to-Gold gate failed.")
```

```python
# Cell 9: Score Calculation
# ============================================================

def calculate_dataset_scores(dataset_name, run_id):
    """Calculate dimension-level and composite scores for a dataset."""
    results_df = spark.table(f"{LAKEHOUSE_NAME}.{RESULTS_TABLE}") \
        .filter((F.col("run_id") == run_id) & (F.col("dataset_name") == dataset_name))

    # Average score by dimension
    dimension_scores = results_df.groupBy("dimension").agg(
        F.avg("score").alias("dimension_score"),
        F.count("*").alias("rule_count"),
        F.sum(F.when(F.col("passed"), 1).otherwise(0)).alias("rules_passed")
    ).collect()

    scores = {}
    for row in dimension_scores:
        scores[row["dimension"]] = row["dimension_score"]

    # Composite score (equal weighting)
    dimensions = ["completeness", "accuracy", "timeliness",
                  "consistency", "validity", "uniqueness"]
    active_dimensions = [d for d in dimensions if d in scores]
    composite = sum(scores.get(d, 1.0) for d in active_dimensions) / len(active_dimensions) \
        if active_dimensions else 1.0

    print(f"\nDataset Scores for {dataset_name}:")
    for dim in active_dimensions:
        print(f"  {dim}: {scores[dim]:.4f}")
    print(f"  COMPOSITE: {composite:.4f}")

    return scores, composite
```

```python
# Cell 10: Alert Integration via Logic Apps
# ============================================================

LOGIC_APP_URL = "https://<your-logic-app>.azurewebsites.net/api/dq-alert"

def send_quality_alert(results, gate_name):
    """Send quality alert to Logic App for routing."""
    failed_rules = [r for r in results if not r["passed"]]
    if not failed_rules:
        return

    alert_payload = {
        "alert_type": "quality_gate_failure",
        "gate_name": gate_name,
        "run_id": RUN_ID,
        "timestamp": datetime.utcnow().isoformat(),
        "failed_rules": [
            {
                "rule_id": r["rule_id"],
                "rule_name": r["rule_name"],
                "severity": r["severity"],
                "score": r["score"],
                "threshold": r["threshold"],
                "details": r["details"]
            }
            for r in failed_rules
        ],
        "summary": {
            "total_rules": len(results),
            "failed_count": len(failed_rules),
            "critical_failures": sum(1 for r in failed_rules if r["severity"] == "Critical")
        }
    }

    try:
        response = requests.post(
            LOGIC_APP_URL,
            json=alert_payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        print(f"Alert sent to Logic App: {response.status_code}")
    except Exception as e:
        print(f"Alert failed: {str(e)}")
        # Store alert for retry
        spark.createDataFrame([alert_payload]).write.mode("append") \
            .format("delta").saveAsTable(f"{LAKEHOUSE_NAME}.dq_alert_queue")
```

---

## Great Expectations Integration

### GE Context Setup for Fabric

```python
# Optional: Great Expectations integration for teams already using GE
# Cell: GE Setup
# ============================================================

import great_expectations as gx

# Initialize GE context within Fabric notebook
context = gx.get_context()

# Create Spark datasource pointing to Fabric Lakehouse
datasource = context.sources.add_or_update_spark(name="fabric_lakehouse")

# Add data assets for each table
orders_asset = datasource.add_dataframe_asset(name="sales_orders")

# Build expectations suite aligned with ISL-06 rules
suite = context.add_or_update_expectation_suite("isl06_sales_orders")

# Map ISL-06 rules to GE expectations
# QR-S01: Column existence
suite.add_expectation(
    gx.expectations.ExpectTableColumnsToMatchSet(
        column_set=["order_id", "customer_id", "order_date", "total_amount", "status"]
    )
)

# QR-S03: Nullable compliance
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToNotBeNull(column="order_id")
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToNotBeNull(column="customer_id")
)

# QR-S04: PK uniqueness
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeUnique(column="order_id")
)

# QR-R02: Range check
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeBetween(
        column="total_amount", min_value=0, max_value=10000000
    )
)

# QR-R04: Enum validation
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeInSet(
        column="status",
        value_set=["New", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"]
    )
)

# Run checkpoint
checkpoint = context.add_or_update_checkpoint(
    name="isl06_bronze_to_silver",
    validations=[{
        "batch_request": orders_asset.build_batch_request(dataframe=bronze_orders),
        "expectation_suite_name": "isl06_sales_orders"
    }]
)

result = checkpoint.run()
print(f"GE Checkpoint passed: {result.success}")
```

---

## Fabric Pipeline Configuration

### Pipeline: ISL06_QualityPipeline

```json
{
    "name": "ISL06_QualityPipeline",
    "activities": [
        {
            "name": "Execute_Bronze_Ingestion",
            "type": "PipelineActivity",
            "dependsOn": [],
            "pipeline": { "referenceName": "IngestBronzeData" }
        },
        {
            "name": "Execute_BronzeToSilver_QualityGate",
            "type": "NotebookActivity",
            "dependsOn": [{"activity": "Execute_Bronze_Ingestion", "conditions": ["Succeeded"]}],
            "notebook": { "referenceName": "ISL06_BronzeToSilver_Gate" },
            "parameters": {
                "dataset_name": "sales_orders",
                "data_tier": "critical"
            }
        },
        {
            "name": "Execute_SilverToGold_QualityGate",
            "type": "NotebookActivity",
            "dependsOn": [{"activity": "Execute_BronzeToSilver_QualityGate", "conditions": ["Succeeded"]}],
            "notebook": { "referenceName": "ISL06_SilverToGold_Gate" },
            "parameters": {
                "dataset_name": "sales_orders",
                "data_tier": "critical"
            }
        },
        {
            "name": "Calculate_Scores",
            "type": "NotebookActivity",
            "dependsOn": [{"activity": "Execute_SilverToGold_QualityGate", "conditions": ["Completed"]}],
            "notebook": { "referenceName": "ISL06_ScoreCalculation" }
        },
        {
            "name": "Alert_On_Gate_Failure",
            "type": "WebActivity",
            "dependsOn": [{"activity": "Execute_BronzeToSilver_QualityGate", "conditions": ["Failed"]}],
            "url": "https://<logic-app-url>/api/dq-alert",
            "method": "POST",
            "body": {
                "alert_type": "gate_failure",
                "pipeline": "@pipeline().Pipeline",
                "activity": "Execute_BronzeToSilver_QualityGate",
                "timestamp": "@utcnow()"
            }
        }
    ],
    "triggers": [
        {
            "name": "DailySchedule",
            "type": "ScheduleTrigger",
            "recurrence": {
                "frequency": "Day",
                "interval": 1,
                "startTime": "2025-01-01T06:00:00Z",
                "timeZone": "UTC"
            }
        }
    ]
}
```

---

## Quality Results Delta Table Setup

```sql
-- Create quality results tables in the quality lakehouse
-- Run once during initial setup

CREATE TABLE IF NOT EXISTS quality_lakehouse.dq_rule_results (
    run_id          STRING NOT NULL,
    rule_id         STRING NOT NULL,
    rule_name       STRING NOT NULL,
    category        STRING NOT NULL,
    dimension       STRING NOT NULL,
    severity        STRING NOT NULL,
    dataset_name    STRING NOT NULL,
    score           DOUBLE NOT NULL,
    threshold       DOUBLE NOT NULL,
    passed          BOOLEAN NOT NULL,
    details         STRING,
    evaluated_at    STRING NOT NULL
)
USING DELTA
PARTITIONED BY (dataset_name)
TBLPROPERTIES (
    'delta.autoOptimize.optimizeWrite' = 'true',
    'delta.autoOptimize.autoCompact' = 'true'
);

CREATE TABLE IF NOT EXISTS quality_lakehouse.dq_scores (
    score_id            STRING NOT NULL,
    dataset_name        STRING NOT NULL,
    domain_name         STRING NOT NULL,
    data_tier           STRING NOT NULL,
    score_date          DATE NOT NULL,
    completeness_score  DOUBLE,
    accuracy_score      DOUBLE,
    timeliness_score    DOUBLE,
    consistency_score   DOUBLE,
    validity_score      DOUBLE,
    uniqueness_score    DOUBLE,
    composite_score     DOUBLE,
    rag_status          STRING,
    trend_direction     STRING,
    created_timestamp   TIMESTAMP
)
USING DELTA
PARTITIONED BY (domain_name, score_date);

CREATE TABLE IF NOT EXISTS quality_lakehouse.dq_sla_compliance (
    compliance_id       STRING NOT NULL,
    dataset_name        STRING NOT NULL,
    data_tier           STRING NOT NULL,
    dimension           STRING NOT NULL,
    score               DOUBLE NOT NULL,
    sla_threshold       DOUBLE NOT NULL,
    sla_met             BOOLEAN NOT NULL,
    compliance_date     DATE NOT NULL,
    created_timestamp   TIMESTAMP
)
USING DELTA
PARTITIONED BY (compliance_date);
```

---

## Cross-References

| Reference | Module | Relationship |
|---|---|---|
| Quality Rule Library | ISL-06 | Rule definitions implemented in this notebook |
| Quality SLA Framework | ISL-06 | SLA thresholds used for pass/fail evaluation |
| Quality Monitoring Standards | ISL-06 | Monitoring architecture this implementation supports |
| Manufacturing Quality Rules | ISL-06 | Manufacturing-specific rule implementations |
| Quality Dashboard Spec | ISL-06 | Power BI dashboard consuming these Delta tables |
| ISL-05 Medallion Architecture | ISL-05 | Bronze/Silver/Gold layer quality gate pattern |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-01-15 | ISL Team | Initial release — Fabric quality implementation patterns |

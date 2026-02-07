# Quality Rule Library

> Module: ISL-06 | Version: 1.0 | Adaptation Effort: 4-8 hrs | Dependencies: ISL-02, ISL-03, ISL-04, ISL-05

## Purpose

This document provides the comprehensive library of 50+ pre-built data quality rules organized into four categories: Schema Validation (QR-S), Row-Level (QR-R), Aggregate (QR-A), and Business Rules (QR-B). Each rule includes a unique identifier, formal description, SQL/PySpark implementation pattern, severity classification, applicable quality dimensions, and default thresholds. This is the primary operational reference for implementing data quality checks within the ISL framework and represents the most critical component of ISL-06.

## Scope

### In Scope

- 10 Schema Validation rules (QR-S01 through QR-S10)
- 15 Row-Level rules (QR-R01 through QR-R15)
- 10 Aggregate rules (QR-A01 through QR-A10)
- 15 Business rules (QR-B01 through QR-B15) with manufacturing focus
- SQL and PySpark implementation patterns for each rule
- Severity classification and default thresholds
- Dimension mapping for each rule

### Out of Scope

- Dimension definitions (see Quality Dimension Definitions)
- SLA threshold values (see Quality SLA Framework)
- Monitoring and alerting configuration (see Quality Monitoring Standards)
- Remediation procedures (see Remediation Workflow)

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default Value | Client Value | Notes |
|---|---|---|---|
| `rule_prefix` | QR | | Prefix for rule identifiers |
| `null_equivalents` | `NULL, '', 'N/A', 'NA', 'null', 'NONE'` | | Platform-specific null representations |
| `default_schema_catalog` | `lakehouse_catalog` | | Default catalog for schema checks |
| `date_range_years_back` | 50 | | Max historical date range for date validation |
| `date_range_years_forward` | 5 | | Max future date range for date validation |
| `email_pattern` | RFC 5322 simplified | | Client-specific email validation regex |
| `phone_regions` | US, CA | | Supported phone number regions |
| `postal_code_countries` | US, CA | | Supported postal code formats |
| `row_count_delta_threshold` | 20% | | Default % change threshold for row count delta |
| `freshness_threshold_hours` | 24 | | Default hours for freshness check |
| `enable_business_rules` | true | | Toggle manufacturing business rules |
| `custom_rules_table` | `dq_custom_rules` | | Table for client-defined custom rules |

---

## Rule Severity Classification

| Severity | Definition | SLA Impact | Auto-Action |
|---|---|---|---|
| **Critical** | Rule failure blocks data from progressing to next medallion layer | Pipeline halt | Block promotion; alert immediately |
| **Major** | Rule failure degrades data quality significantly but does not block promotion | SLA breach likely | Alert; flag records; allow conditional promotion |
| **Minor** | Rule failure is informational; data quality is slightly reduced | No SLA impact | Log; include in daily digest |

---

## Category 1: Schema Validation Rules (QR-S01 through QR-S10)

Schema validation rules verify the structural integrity of datasets before any row-level processing begins. These rules execute first in the quality check pipeline.

### QR-S01: Column Existence Check

| Attribute | Value |
|---|---|
| **Rule ID** | QR-S01 |
| **Name** | Column Existence Check |
| **Category** | Schema Validation |
| **Dimension** | Validity |
| **Severity** | Critical |
| **Description** | Validates that all expected columns defined in the schema contract exist in the dataset. Missing columns indicate schema drift or upstream changes. |
| **Default Threshold** | 100% — all expected columns must be present |

```sql
-- SQL Implementation
SELECT ec.column_name AS missing_column
FROM expected_columns ec
LEFT JOIN information_schema.columns ic
    ON ic.table_name = '{table_name}'
    AND ic.column_name = ec.column_name
WHERE ic.column_name IS NULL;
-- Rule passes if result set is empty
```

```python
# PySpark Implementation
def qr_s01_column_existence(df, expected_columns):
    actual_columns = set(df.columns)
    missing = set(expected_columns) - actual_columns
    return len(missing) == 0, list(missing)
```

---

### QR-S02: Data Type Match

| Attribute | Value |
|---|---|
| **Rule ID** | QR-S02 |
| **Name** | Data Type Match |
| **Category** | Schema Validation |
| **Dimension** | Validity |
| **Severity** | Critical |
| **Description** | Validates that each column's data type matches the expected type defined in the schema contract. Type mismatches indicate upstream casting issues or schema evolution. |
| **Default Threshold** | 100% — all columns must match expected types |

```sql
-- SQL Implementation
SELECT ic.column_name, ic.data_type AS actual_type, ec.data_type AS expected_type
FROM information_schema.columns ic
JOIN expected_columns ec
    ON ic.column_name = ec.column_name
    AND ic.table_name = '{table_name}'
WHERE ic.data_type <> ec.data_type;
```

```python
# PySpark Implementation
def qr_s02_data_type_match(df, expected_schema):
    mismatches = []
    for field in expected_schema:
        if field.name in df.columns:
            actual_type = dict(df.dtypes).get(field.name)
            if actual_type != str(field.dataType):
                mismatches.append((field.name, actual_type, str(field.dataType)))
    return len(mismatches) == 0, mismatches
```

---

### QR-S03: Nullable Compliance

| Attribute | Value |
|---|---|
| **Rule ID** | QR-S03 |
| **Name** | Nullable Compliance |
| **Category** | Schema Validation |
| **Dimension** | Validity, Completeness |
| **Severity** | Critical |
| **Description** | Validates that columns defined as non-nullable do not contain NULL values. This is a schema-level enforcement of completeness for mandatory fields. |
| **Default Threshold** | 100% — non-nullable columns must have zero NULLs |

```sql
-- SQL Implementation (for each non-nullable column)
SELECT COUNT(*) AS null_count
FROM {table_name}
WHERE {non_nullable_column} IS NULL;
-- Rule passes if null_count = 0
```

```python
# PySpark Implementation
def qr_s03_nullable_compliance(df, non_nullable_columns):
    violations = {}
    for col_name in non_nullable_columns:
        null_count = df.filter(F.col(col_name).isNull()).count()
        if null_count > 0:
            violations[col_name] = null_count
    return len(violations) == 0, violations
```

---

### QR-S04: Primary Key Uniqueness

| Attribute | Value |
|---|---|
| **Rule ID** | QR-S04 |
| **Name** | Primary Key Uniqueness |
| **Category** | Schema Validation |
| **Dimension** | Uniqueness |
| **Severity** | Critical |
| **Description** | Validates that the defined primary key column(s) contain unique values with no duplicates. PK violations cause join fan-outs and aggregation errors. |
| **Default Threshold** | 100% uniqueness — zero duplicate keys |

```sql
-- SQL Implementation
SELECT {pk_columns}, COUNT(*) AS occurrence_count
FROM {table_name}
GROUP BY {pk_columns}
HAVING COUNT(*) > 1;
-- Rule passes if result set is empty
```

```python
# PySpark Implementation
def qr_s04_pk_uniqueness(df, pk_columns):
    total = df.count()
    distinct = df.select(pk_columns).distinct().count()
    duplicates = total - distinct
    return duplicates == 0, {"total": total, "distinct": distinct, "duplicates": duplicates}
```

---

### QR-S05: Foreign Key Validity

| Attribute | Value |
|---|---|
| **Rule ID** | QR-S05 |
| **Name** | Foreign Key Validity |
| **Category** | Schema Validation |
| **Dimension** | Consistency |
| **Severity** | Major |
| **Description** | Validates that foreign key values in the child table exist in the referenced parent table. Orphan foreign keys indicate referential integrity issues. |
| **Default Threshold** | >= 99% — allows for timing/eventual consistency |

```sql
-- SQL Implementation
SELECT child.{fk_column}, COUNT(*) AS orphan_count
FROM {child_table} child
LEFT JOIN {parent_table} parent
    ON child.{fk_column} = parent.{pk_column}
WHERE parent.{pk_column} IS NULL
    AND child.{fk_column} IS NOT NULL
GROUP BY child.{fk_column};
```

```python
# PySpark Implementation
def qr_s05_fk_validity(child_df, parent_df, fk_column, pk_column):
    parent_keys = parent_df.select(pk_column).distinct()
    orphans = child_df.filter(F.col(fk_column).isNotNull()) \
        .join(parent_keys, child_df[fk_column] == parent_keys[pk_column], "left_anti")
    orphan_count = orphans.count()
    total = child_df.filter(F.col(fk_column).isNotNull()).count()
    rate = (total - orphan_count) / total if total > 0 else 1.0
    return rate >= 0.99, {"orphan_count": orphan_count, "rate": round(rate, 4)}
```

---

### QR-S06: Column Count Validation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-S06 |
| **Name** | Column Count Validation |
| **Category** | Schema Validation |
| **Dimension** | Validity |
| **Severity** | Major |
| **Description** | Validates that the total number of columns in the dataset matches the expected count. Unexpected columns may indicate schema drift or uncontrolled additions. |
| **Default Threshold** | Exact match with expected column count |

```sql
-- SQL Implementation
SELECT COUNT(*) AS actual_column_count
FROM information_schema.columns
WHERE table_name = '{table_name}';
-- Compare with expected_column_count
```

```python
# PySpark Implementation
def qr_s06_column_count(df, expected_count):
    actual_count = len(df.columns)
    return actual_count == expected_count, {"expected": expected_count, "actual": actual_count}
```

---

### QR-S07: Partition Integrity

| Attribute | Value |
|---|---|
| **Rule ID** | QR-S07 |
| **Name** | Partition Integrity |
| **Category** | Schema Validation |
| **Dimension** | Completeness |
| **Severity** | Major |
| **Description** | Validates that expected partitions exist and contain data. Missing partitions indicate failed loads or pipeline issues for the affected time period. |
| **Default Threshold** | 100% of expected partitions present |

```sql
-- SQL Implementation
SELECT ep.partition_value AS missing_partition
FROM expected_partitions ep
LEFT JOIN (
    SELECT DISTINCT {partition_column} AS partition_value
    FROM {table_name}
) ap ON ep.partition_value = ap.partition_value
WHERE ap.partition_value IS NULL;
```

```python
# PySpark Implementation
def qr_s07_partition_integrity(df, partition_column, expected_partitions):
    actual = set(df.select(partition_column).distinct().rdd.flatMap(lambda x: x).collect())
    missing = set(expected_partitions) - actual
    return len(missing) == 0, list(missing)
```

---

### QR-S08: Index Coverage

| Attribute | Value |
|---|---|
| **Rule ID** | QR-S08 |
| **Name** | Index Coverage |
| **Category** | Schema Validation |
| **Dimension** | Validity |
| **Severity** | Minor |
| **Description** | Validates that required Z-ORDER or OPTIMIZE configurations are present for Delta tables. Proper indexing ensures query performance for quality checks themselves. |
| **Default Threshold** | All defined index columns are configured |

```python
# PySpark Implementation (Fabric Delta)
def qr_s08_index_coverage(table_path, expected_zorder_columns):
    history = spark.sql(f"DESCRIBE HISTORY '{table_path}'")
    latest_optimize = history.filter(
        F.col("operation") == "OPTIMIZE"
    ).orderBy(F.desc("timestamp")).first()
    if latest_optimize is None:
        return False, {"message": "No OPTIMIZE operation found in history"}
    return True, {"last_optimize": str(latest_optimize["timestamp"])}
```

---

### QR-S09: Schema Version Check

| Attribute | Value |
|---|---|
| **Rule ID** | QR-S09 |
| **Name** | Schema Version Check |
| **Category** | Schema Validation |
| **Dimension** | Consistency |
| **Severity** | Major |
| **Description** | Validates that the dataset schema matches the expected schema version from the schema registry or metadata catalog. Schema version mismatches indicate uncontrolled evolution. |
| **Default Threshold** | Exact match with registered schema version |

```python
# PySpark Implementation
def qr_s09_schema_version(df, schema_registry_version):
    current_schema_hash = hashlib.md5(str(df.schema).encode()).hexdigest()
    return current_schema_hash == schema_registry_version, {
        "expected": schema_registry_version,
        "actual": current_schema_hash
    }
```

---

### QR-S10: Reserved Word Check

| Attribute | Value |
|---|---|
| **Rule ID** | QR-S10 |
| **Name** | Reserved Word Check |
| **Category** | Schema Validation |
| **Dimension** | Validity |
| **Severity** | Minor |
| **Description** | Validates that column names do not use SQL/Spark reserved words that may cause query issues. Flags columns that require quoting or renaming. |
| **Default Threshold** | Zero columns using reserved words |

```python
# PySpark Implementation
RESERVED_WORDS = {'select', 'from', 'where', 'table', 'column', 'index', 'order',
                  'group', 'by', 'as', 'join', 'left', 'right', 'inner', 'outer',
                  'on', 'and', 'or', 'not', 'in', 'between', 'like', 'is', 'null',
                  'true', 'false', 'case', 'when', 'then', 'else', 'end', 'create',
                  'drop', 'alter', 'insert', 'update', 'delete', 'into', 'values',
                  'set', 'having', 'distinct', 'union', 'all', 'exists', 'limit'}

def qr_s10_reserved_word_check(df):
    violations = [c for c in df.columns if c.lower() in RESERVED_WORDS]
    return len(violations) == 0, violations
```

---

## Category 2: Row-Level Rules (QR-R01 through QR-R15)

Row-level rules validate individual records against field-level constraints. These rules execute after schema validation passes.

### QR-R01: Null Check

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R01 |
| **Name** | Null Check |
| **Category** | Row-Level |
| **Dimension** | Completeness |
| **Severity** | Critical (required fields), Minor (optional fields) |
| **Description** | Checks for NULL or null-equivalent values in specified columns. Extends QR-S03 by including null-equivalent detection (empty strings, placeholders). |
| **Default Threshold** | Per SLA Framework completeness thresholds |

```sql
-- SQL Implementation
SELECT {pk_columns}, {check_column}
FROM {table_name}
WHERE {check_column} IS NULL
   OR TRIM(CAST({check_column} AS STRING)) = ''
   OR UPPER(TRIM(CAST({check_column} AS STRING))) IN ('N/A', 'NA', 'NULL', 'NONE', 'UNKNOWN');
```

```python
# PySpark Implementation
def qr_r01_null_check(df, column_name, null_equivalents=None):
    if null_equivalents is None:
        null_equivalents = ['', 'N/A', 'NA', 'NULL', 'NONE', 'UNKNOWN']
    total = df.count()
    null_count = df.filter(
        F.col(column_name).isNull()
        | F.trim(F.col(column_name).cast("string")).isin(null_equivalents)
    ).count()
    rate = (total - null_count) / total if total > 0 else 1.0
    return rate, {"null_count": null_count, "total": total}
```

---

### QR-R02: Range Check

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R02 |
| **Name** | Range Check |
| **Category** | Row-Level |
| **Dimension** | Validity |
| **Severity** | Major |
| **Description** | Validates that numeric or date values fall within an expected minimum and maximum range. Out-of-range values indicate data entry errors or transformation issues. |
| **Default Threshold** | Per SLA Framework validity thresholds |

```sql
-- SQL Implementation
SELECT {pk_columns}, {check_column}
FROM {table_name}
WHERE {check_column} IS NOT NULL
  AND ({check_column} < {min_value} OR {check_column} > {max_value});
```

```python
# PySpark Implementation
def qr_r02_range_check(df, column_name, min_value, max_value):
    non_null = df.filter(F.col(column_name).isNotNull())
    total = non_null.count()
    out_of_range = non_null.filter(
        (F.col(column_name) < min_value) | (F.col(column_name) > max_value)
    ).count()
    rate = (total - out_of_range) / total if total > 0 else 1.0
    return rate, {"out_of_range": out_of_range, "total": total}
```

---

### QR-R03: Pattern Match

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R03 |
| **Name** | Pattern Match |
| **Category** | Row-Level |
| **Dimension** | Validity |
| **Severity** | Major |
| **Description** | Validates that string values match a specified regular expression pattern. Used for formatted fields such as codes, identifiers, and structured strings. |
| **Default Threshold** | Per SLA Framework validity thresholds |

```sql
-- SQL Implementation
SELECT {pk_columns}, {check_column}
FROM {table_name}
WHERE {check_column} IS NOT NULL
  AND NOT {check_column} RLIKE '{regex_pattern}';
```

```python
# PySpark Implementation
def qr_r03_pattern_match(df, column_name, regex_pattern):
    non_null = df.filter(F.col(column_name).isNotNull())
    total = non_null.count()
    non_matching = non_null.filter(~F.col(column_name).rlike(regex_pattern)).count()
    rate = (total - non_matching) / total if total > 0 else 1.0
    return rate, {"non_matching": non_matching, "total": total}
```

---

### QR-R04: Enumeration Validation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R04 |
| **Name** | Enumeration Validation |
| **Category** | Row-Level |
| **Dimension** | Validity |
| **Severity** | Major |
| **Description** | Validates that column values belong to a predefined set of allowed values (enumeration). Invalid enum values indicate data entry errors or unmapped source values. |
| **Default Threshold** | Per SLA Framework validity thresholds |

```sql
-- SQL Implementation
SELECT {pk_columns}, {check_column}
FROM {table_name}
WHERE {check_column} IS NOT NULL
  AND {check_column} NOT IN ({allowed_values});
```

```python
# PySpark Implementation
def qr_r04_enum_validation(df, column_name, allowed_values):
    non_null = df.filter(F.col(column_name).isNotNull())
    total = non_null.count()
    invalid = non_null.filter(~F.col(column_name).isin(allowed_values)).count()
    rate = (total - invalid) / total if total > 0 else 1.0
    return rate, {"invalid": invalid, "allowed_values": allowed_values}
```

---

### QR-R05: Date Range Validation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R05 |
| **Name** | Date Range Validation |
| **Category** | Row-Level |
| **Dimension** | Validity, Accuracy |
| **Severity** | Major |
| **Description** | Validates that date/timestamp values fall within a reasonable historical and future range. Extreme dates (e.g., 1900-01-01, 9999-12-31) typically indicate default/placeholder values. |
| **Default Threshold** | Per SLA Framework validity thresholds |

```sql
-- SQL Implementation
SELECT {pk_columns}, {date_column}
FROM {table_name}
WHERE {date_column} IS NOT NULL
  AND ({date_column} < DATE_ADD(CURRENT_DATE(), -{years_back} * 365)
       OR {date_column} > DATE_ADD(CURRENT_DATE(), {years_forward} * 365));
```

```python
# PySpark Implementation
def qr_r05_date_range(df, date_column, years_back=50, years_forward=5):
    from datetime import datetime, timedelta
    min_date = datetime.now() - timedelta(days=years_back * 365)
    max_date = datetime.now() + timedelta(days=years_forward * 365)
    non_null = df.filter(F.col(date_column).isNotNull())
    total = non_null.count()
    out_of_range = non_null.filter(
        (F.col(date_column) < F.lit(min_date)) | (F.col(date_column) > F.lit(max_date))
    ).count()
    rate = (total - out_of_range) / total if total > 0 else 1.0
    return rate, {"out_of_range": out_of_range}
```

---

### QR-R06: String Length Validation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R06 |
| **Name** | String Length Validation |
| **Category** | Row-Level |
| **Dimension** | Validity |
| **Severity** | Minor |
| **Description** | Validates that string field values are within expected minimum and maximum character lengths. Excessively short or long strings may indicate truncation or data concatenation issues. |
| **Default Threshold** | Per SLA Framework validity thresholds |

```sql
-- SQL Implementation
SELECT {pk_columns}, {check_column}, LENGTH({check_column}) AS actual_length
FROM {table_name}
WHERE {check_column} IS NOT NULL
  AND (LENGTH({check_column}) < {min_length} OR LENGTH({check_column}) > {max_length});
```

```python
# PySpark Implementation
def qr_r06_string_length(df, column_name, min_length, max_length):
    non_null = df.filter(F.col(column_name).isNotNull())
    total = non_null.count()
    violations = non_null.filter(
        (F.length(F.col(column_name)) < min_length) |
        (F.length(F.col(column_name)) > max_length)
    ).count()
    rate = (total - violations) / total if total > 0 else 1.0
    return rate, {"violations": violations}
```

---

### QR-R07: Numeric Precision Validation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R07 |
| **Name** | Numeric Precision Validation |
| **Category** | Row-Level |
| **Dimension** | Validity, Accuracy |
| **Severity** | Major |
| **Description** | Validates that numeric values conform to expected precision and scale (decimal places). Precision violations can cause rounding errors in financial or measurement calculations. |
| **Default Threshold** | Per SLA Framework validity thresholds |

```sql
-- SQL Implementation
SELECT {pk_columns}, {check_column},
    LENGTH(SPLIT(CAST({check_column} AS STRING), '\\.')[1]) AS actual_scale
FROM {table_name}
WHERE {check_column} IS NOT NULL
  AND LENGTH(SPLIT(CAST({check_column} AS STRING), '\\.')[1]) > {max_scale};
```

```python
# PySpark Implementation
def qr_r07_numeric_precision(df, column_name, max_precision, max_scale):
    non_null = df.filter(F.col(column_name).isNotNull())
    total = non_null.count()
    str_col = F.col(column_name).cast("string")
    violations = non_null.filter(
        F.length(F.split(str_col, "\\.").getItem(1)) > max_scale
    ).count()
    rate = (total - violations) / total if total > 0 else 1.0
    return rate, {"violations": violations}
```

---

### QR-R08: Email Format Validation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R08 |
| **Name** | Email Format Validation |
| **Category** | Row-Level |
| **Dimension** | Validity |
| **Severity** | Minor |
| **Description** | Validates that email address fields conform to a standard email format (simplified RFC 5322). |
| **Default Threshold** | >= 98% for fields classified as email |

```sql
-- SQL Implementation
SELECT {pk_columns}, {email_column}
FROM {table_name}
WHERE {email_column} IS NOT NULL
  AND NOT {email_column} RLIKE '^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$';
```

```python
# PySpark Implementation
EMAIL_PATTERN = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'

def qr_r08_email_format(df, column_name):
    return qr_r03_pattern_match(df, column_name, EMAIL_PATTERN)
```

---

### QR-R09: Phone Format Validation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R09 |
| **Name** | Phone Format Validation |
| **Category** | Row-Level |
| **Dimension** | Validity |
| **Severity** | Minor |
| **Description** | Validates that phone number fields conform to expected format patterns for configured regions. Supports US/CA formats by default. |
| **Default Threshold** | >= 95% for fields classified as phone |

```sql
-- SQL Implementation (US format)
SELECT {pk_columns}, {phone_column}
FROM {table_name}
WHERE {phone_column} IS NOT NULL
  AND NOT REGEXP_REPLACE({phone_column}, '[^0-9]', '') RLIKE '^1?[2-9][0-9]{9}$';
```

```python
# PySpark Implementation
def qr_r09_phone_format(df, column_name, pattern=r'^1?[2-9]\d{9}$'):
    non_null = df.filter(F.col(column_name).isNotNull())
    total = non_null.count()
    cleaned = non_null.withColumn("_phone_digits", F.regexp_replace(column_name, "[^0-9]", ""))
    invalid = cleaned.filter(~F.col("_phone_digits").rlike(pattern)).count()
    rate = (total - invalid) / total if total > 0 else 1.0
    return rate, {"invalid": invalid}
```

---

### QR-R10: Postal Code Validation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R10 |
| **Name** | Postal Code Validation |
| **Category** | Row-Level |
| **Dimension** | Validity |
| **Severity** | Minor |
| **Description** | Validates that postal/zip code fields conform to expected format for configured countries. Supports US (5 or 5+4) and Canadian (A1A 1A1) formats by default. |
| **Default Threshold** | >= 95% for fields classified as postal code |

```sql
-- SQL Implementation (US + Canada)
SELECT {pk_columns}, {postal_column}
FROM {table_name}
WHERE {postal_column} IS NOT NULL
  AND NOT (
    {postal_column} RLIKE '^[0-9]{5}(-[0-9]{4})?$'   -- US
    OR {postal_column} RLIKE '^[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]$'  -- Canada
  );
```

```python
# PySpark Implementation
US_POSTAL = r'^\d{5}(-\d{4})?$'
CA_POSTAL = r'^[A-Z]\d[A-Z] ?\d[A-Z]\d$'

def qr_r10_postal_code(df, column_name):
    non_null = df.filter(F.col(column_name).isNotNull())
    total = non_null.count()
    invalid = non_null.filter(
        ~(F.col(column_name).rlike(US_POSTAL) | F.upper(F.col(column_name)).rlike(CA_POSTAL))
    ).count()
    rate = (total - invalid) / total if total > 0 else 1.0
    return rate, {"invalid": invalid}
```

---

### QR-R11: Cross-Field Validation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R11 |
| **Name** | Cross-Field Validation |
| **Category** | Row-Level |
| **Dimension** | Consistency, Validity |
| **Severity** | Major |
| **Description** | Validates logical relationships between two or more fields within the same record. Examples: ship_date >= order_date, end_date >= start_date, total = quantity * unit_price. |
| **Default Threshold** | Per SLA Framework consistency thresholds |

```sql
-- SQL Implementation (example: date ordering)
SELECT {pk_columns}, order_date, ship_date
FROM {table_name}
WHERE order_date IS NOT NULL AND ship_date IS NOT NULL
  AND ship_date < order_date;
```

```python
# PySpark Implementation
def qr_r11_cross_field(df, condition_expr, description=""):
    """condition_expr: PySpark Column expression that returns True for valid records"""
    applicable = df.filter(F.lit(True))  # customize filter for applicable rows
    total = applicable.count()
    violations = applicable.filter(~condition_expr).count()
    rate = (total - violations) / total if total > 0 else 1.0
    return rate, {"violations": violations, "description": description}
```

---

### QR-R12: Calculated Field Validation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R12 |
| **Name** | Calculated Field Validation |
| **Category** | Row-Level |
| **Dimension** | Accuracy |
| **Severity** | Major |
| **Description** | Validates that calculated/derived fields match the result of recalculating from source values. Examples: line_total = quantity * unit_price, tax_amount = subtotal * tax_rate. |
| **Default Threshold** | Per SLA Framework accuracy thresholds, with configurable numeric tolerance |

```sql
-- SQL Implementation
SELECT {pk_columns}, line_total, (quantity * unit_price) AS expected_total,
    ABS(line_total - (quantity * unit_price)) AS delta
FROM {table_name}
WHERE ABS(line_total - (quantity * unit_price)) > {tolerance};
```

```python
# PySpark Implementation
def qr_r12_calculated_field(df, actual_col, expected_expr, tolerance=0.01):
    non_null = df.filter(F.col(actual_col).isNotNull())
    total = non_null.count()
    violations = non_null.filter(
        F.abs(F.col(actual_col) - expected_expr) > tolerance
    ).count()
    rate = (total - violations) / total if total > 0 else 1.0
    return rate, {"violations": violations}
```

---

### QR-R13: Duplicate Detection

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R13 |
| **Name** | Duplicate Detection |
| **Category** | Row-Level |
| **Dimension** | Uniqueness |
| **Severity** | Major |
| **Description** | Detects duplicate records based on configurable business key columns (beyond primary key). Identifies both exact and near-duplicate records within the dataset. |
| **Default Threshold** | Per SLA Framework uniqueness thresholds |

```sql
-- SQL Implementation
SELECT {business_key_columns}, COUNT(*) AS duplicate_count
FROM {table_name}
GROUP BY {business_key_columns}
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC;
```

```python
# PySpark Implementation
def qr_r13_duplicate_detection(df, business_key_columns):
    total = df.count()
    distinct = df.select(business_key_columns).distinct().count()
    uniqueness_rate = distinct / total if total > 0 else 1.0
    duplicates = total - distinct
    return uniqueness_rate, {"duplicates": duplicates, "total": total, "distinct": distinct}
```

---

### QR-R14: Orphan Record Detection

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R14 |
| **Name** | Orphan Record Detection |
| **Category** | Row-Level |
| **Dimension** | Consistency |
| **Severity** | Major |
| **Description** | Identifies records in a child table that reference non-existent parent records. More granular than QR-S05 by providing record-level detail and supporting multiple FK relationships. |
| **Default Threshold** | Per SLA Framework consistency thresholds |

```sql
-- SQL Implementation
SELECT c.{pk_columns}, c.{fk_column}
FROM {child_table} c
LEFT JOIN {parent_table} p ON c.{fk_column} = p.{parent_pk}
WHERE p.{parent_pk} IS NULL AND c.{fk_column} IS NOT NULL;
```

```python
# PySpark Implementation
def qr_r14_orphan_records(child_df, parent_df, fk_col, parent_pk):
    orphans = child_df.filter(F.col(fk_col).isNotNull()).join(
        parent_df.select(F.col(parent_pk).alias("_parent_key")).distinct(),
        child_df[fk_col] == F.col("_parent_key"),
        "left_anti"
    )
    orphan_count = orphans.count()
    total = child_df.filter(F.col(fk_col).isNotNull()).count()
    rate = (total - orphan_count) / total if total > 0 else 1.0
    return rate, {"orphan_count": orphan_count}
```

---

### QR-R15: Temporal Sequence Validation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-R15 |
| **Name** | Temporal Sequence Validation |
| **Category** | Row-Level |
| **Dimension** | Consistency, Validity |
| **Severity** | Major |
| **Description** | Validates that timestamps or dates within a record follow the expected chronological sequence. Examples: created_date <= modified_date <= closed_date. |
| **Default Threshold** | Per SLA Framework consistency thresholds |

```sql
-- SQL Implementation
SELECT {pk_columns}, created_date, modified_date, closed_date
FROM {table_name}
WHERE NOT (
    (modified_date IS NULL OR created_date <= modified_date)
    AND (closed_date IS NULL OR modified_date <= closed_date)
);
```

```python
# PySpark Implementation
def qr_r15_temporal_sequence(df, date_columns_ordered):
    """date_columns_ordered: list of columns that should be in ascending order"""
    conditions = []
    for i in range(len(date_columns_ordered) - 1):
        col_a = date_columns_ordered[i]
        col_b = date_columns_ordered[i + 1]
        conditions.append(
            (F.col(col_b).isNull()) | (F.col(col_a) <= F.col(col_b))
        )
    valid_condition = conditions[0]
    for c in conditions[1:]:
        valid_condition = valid_condition & c

    total = df.count()
    violations = df.filter(~valid_condition).count()
    rate = (total - violations) / total if total > 0 else 1.0
    return rate, {"violations": violations}
```

---

## Category 3: Aggregate Rules (QR-A01 through QR-A10)

Aggregate rules validate dataset-level properties such as row counts, distributions, and freshness. These rules execute after row-level checks complete.

### QR-A01: Row Count Threshold

| Attribute | Value |
|---|---|
| **Rule ID** | QR-A01 |
| **Name** | Row Count Threshold |
| **Category** | Aggregate |
| **Dimension** | Completeness |
| **Severity** | Critical |
| **Description** | Validates that the total row count meets a minimum expected threshold. Zero or abnormally low row counts indicate load failures or data loss. |
| **Default Threshold** | Minimum row count configurable per dataset (default: > 0) |

```sql
-- SQL Implementation
SELECT COUNT(*) AS actual_count
FROM {table_name};
-- Compare against expected minimum
```

```python
# PySpark Implementation
def qr_a01_row_count_threshold(df, min_rows=1):
    actual = df.count()
    return actual >= min_rows, {"actual": actual, "minimum": min_rows}
```

---

### QR-A02: Row Count Delta

| Attribute | Value |
|---|---|
| **Rule ID** | QR-A02 |
| **Name** | Row Count Delta |
| **Category** | Aggregate |
| **Dimension** | Completeness, Accuracy |
| **Severity** | Major |
| **Description** | Validates that the row count change between consecutive loads does not exceed a configurable percentage threshold. Sudden spikes or drops indicate load anomalies. |
| **Default Threshold** | Change <= 20% (configurable) |

```sql
-- SQL Implementation
WITH current_count AS (SELECT COUNT(*) AS cnt FROM {table_name}),
     prior_count AS (SELECT row_count AS cnt FROM dq_load_history
                     WHERE table_name = '{table_name}'
                     ORDER BY load_timestamp DESC LIMIT 1)
SELECT current_count.cnt AS current_rows,
       prior_count.cnt AS prior_rows,
       ABS(current_count.cnt - prior_count.cnt) * 100.0 / NULLIF(prior_count.cnt, 0) AS pct_change
FROM current_count, prior_count;
```

```python
# PySpark Implementation
def qr_a02_row_count_delta(current_count, prior_count, max_delta_pct=20.0):
    if prior_count == 0:
        return True, {"message": "No prior count available (first load)"}
    pct_change = abs(current_count - prior_count) * 100.0 / prior_count
    return pct_change <= max_delta_pct, {
        "current": current_count, "prior": prior_count, "pct_change": round(pct_change, 2)
    }
```

---

### QR-A03: Sum Reconciliation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-A03 |
| **Name** | Sum Reconciliation |
| **Category** | Aggregate |
| **Dimension** | Accuracy |
| **Severity** | Critical |
| **Description** | Validates that the sum of a numeric column matches an expected control total from the source system or a reconciliation target. Used for financial and quantity balancing. |
| **Default Threshold** | Delta <= 0.01 (configurable tolerance) |

```sql
-- SQL Implementation
SELECT SUM({amount_column}) AS actual_total
FROM {table_name}
WHERE {filter_conditions};
-- Compare: ABS(actual_total - expected_total) <= tolerance
```

```python
# PySpark Implementation
def qr_a03_sum_reconciliation(df, amount_column, expected_total, tolerance=0.01):
    actual_total = df.agg(F.sum(amount_column)).collect()[0][0] or 0
    delta = abs(actual_total - expected_total)
    return delta <= tolerance, {
        "actual": actual_total, "expected": expected_total, "delta": delta
    }
```

---

### QR-A04: Distribution Check

| Attribute | Value |
|---|---|
| **Rule ID** | QR-A04 |
| **Name** | Distribution Check |
| **Category** | Aggregate |
| **Dimension** | Accuracy, Validity |
| **Severity** | Major |
| **Description** | Validates that the statistical distribution of a column's values is consistent with historical patterns. Detects anomalous shifts in mean, median, standard deviation, or percentiles. |
| **Default Threshold** | Z-score of distribution statistics within +/- 3 standard deviations |

```python
# PySpark Implementation
def qr_a04_distribution_check(df, column_name, historical_mean, historical_stddev, sigma=3):
    stats = df.agg(
        F.mean(column_name).alias("current_mean"),
        F.stddev(column_name).alias("current_stddev"),
        F.min(column_name).alias("current_min"),
        F.max(column_name).alias("current_max")
    ).collect()[0]

    z_score = abs(stats["current_mean"] - historical_mean) / historical_stddev \
        if historical_stddev > 0 else 0
    return z_score <= sigma, {
        "current_mean": stats["current_mean"],
        "historical_mean": historical_mean,
        "z_score": round(z_score, 2)
    }
```

---

### QR-A05: Freshness Check

| Attribute | Value |
|---|---|
| **Rule ID** | QR-A05 |
| **Name** | Freshness Check |
| **Category** | Aggregate |
| **Dimension** | Timeliness |
| **Severity** | Critical |
| **Description** | Validates that the most recent record timestamp is within the expected freshness window. Stale data indicates pipeline delays or upstream system issues. |
| **Default Threshold** | Per SLA Framework timeliness thresholds |

```sql
-- SQL Implementation
SELECT MAX({timestamp_column}) AS latest_record,
       DATEDIFF(MINUTE, MAX({timestamp_column}), CURRENT_TIMESTAMP) AS age_minutes
FROM {table_name};
-- Rule passes if age_minutes <= threshold_minutes
```

```python
# PySpark Implementation
def qr_a05_freshness_check(df, timestamp_column, max_age_hours=24):
    from datetime import datetime, timedelta
    latest = df.agg(F.max(timestamp_column)).collect()[0][0]
    if latest is None:
        return False, {"message": "No records found"}
    age_hours = (datetime.now() - latest).total_seconds() / 3600
    return age_hours <= max_age_hours, {
        "latest_record": str(latest), "age_hours": round(age_hours, 2)
    }
```

---

### QR-A06: Gap Detection

| Attribute | Value |
|---|---|
| **Rule ID** | QR-A06 |
| **Name** | Gap Detection |
| **Category** | Aggregate |
| **Dimension** | Completeness |
| **Severity** | Major |
| **Description** | Detects gaps in sequential or time-series data. Identifies missing dates in daily data, missing sequence numbers, or unexpected time intervals. |
| **Default Threshold** | Zero gaps for critical datasets; configurable for others |

```sql
-- SQL Implementation (date gaps)
WITH date_range AS (
    SELECT EXPLODE(SEQUENCE(MIN({date_column}), MAX({date_column}), INTERVAL 1 DAY)) AS expected_date
    FROM {table_name}
)
SELECT dr.expected_date AS missing_date
FROM date_range dr
LEFT JOIN {table_name} t ON t.{date_column} = dr.expected_date
WHERE t.{date_column} IS NULL;
```

```python
# PySpark Implementation
def qr_a06_gap_detection(df, date_column, expected_frequency="daily"):
    from pyspark.sql import Window
    w = Window.orderBy(date_column)
    with_lag = df.select(date_column).distinct().orderBy(date_column) \
        .withColumn("prev_date", F.lag(date_column).over(w)) \
        .withColumn("gap_days", F.datediff(F.col(date_column), F.col("prev_date")))
    gaps = with_lag.filter(F.col("gap_days") > 1)
    gap_count = gaps.count()
    return gap_count == 0, {"gap_count": gap_count}
```

---

### QR-A07: Completeness Rate

| Attribute | Value |
|---|---|
| **Rule ID** | QR-A07 |
| **Name** | Completeness Rate |
| **Category** | Aggregate |
| **Dimension** | Completeness |
| **Severity** | Major |
| **Description** | Calculates the overall completeness rate across all required columns for the dataset. Provides a single aggregate completeness metric per the dimension definition. |
| **Default Threshold** | Per SLA Framework completeness thresholds by tier |

```python
# PySpark Implementation
def qr_a07_completeness_rate(df, required_columns, null_equivalents=None):
    if null_equivalents is None:
        null_equivalents = ['', 'N/A', 'NA', 'NULL', 'NONE']
    total_cells = df.count() * len(required_columns)
    null_cells = 0
    for col_name in required_columns:
        null_cells += df.filter(
            F.col(col_name).isNull() |
            F.trim(F.col(col_name).cast("string")).isin(null_equivalents)
        ).count()
    rate = (total_cells - null_cells) / total_cells if total_cells > 0 else 1.0
    return rate, {"total_cells": total_cells, "null_cells": null_cells}
```

---

### QR-A08: Uniqueness Rate

| Attribute | Value |
|---|---|
| **Rule ID** | QR-A08 |
| **Name** | Uniqueness Rate |
| **Category** | Aggregate |
| **Dimension** | Uniqueness |
| **Severity** | Major |
| **Description** | Calculates the overall uniqueness rate for the dataset based on defined business keys. Provides a single aggregate uniqueness metric per the dimension definition. |
| **Default Threshold** | Per SLA Framework uniqueness thresholds by tier |

```python
# PySpark Implementation
def qr_a08_uniqueness_rate(df, business_key_columns):
    total = df.count()
    distinct = df.select(business_key_columns).distinct().count()
    rate = distinct / total if total > 0 else 1.0
    return rate, {"total": total, "distinct": distinct, "duplicates": total - distinct}
```

---

### QR-A09: Referential Coverage

| Attribute | Value |
|---|---|
| **Rule ID** | QR-A09 |
| **Name** | Referential Coverage |
| **Category** | Aggregate |
| **Dimension** | Consistency |
| **Severity** | Major |
| **Description** | Measures the percentage of parent/reference table records that have at least one matching child record. Low coverage may indicate missing data loads for specific reference categories. |
| **Default Threshold** | >= 80% (configurable per relationship) |

```sql
-- SQL Implementation
SELECT COUNT(DISTINCT p.{pk_column}) AS referenced_parents,
       (SELECT COUNT(DISTINCT {pk_column}) FROM {parent_table}) AS total_parents
FROM {parent_table} p
INNER JOIN {child_table} c ON p.{pk_column} = c.{fk_column};
```

```python
# PySpark Implementation
def qr_a09_referential_coverage(parent_df, child_df, pk_column, fk_column, min_coverage=0.80):
    total_parents = parent_df.select(pk_column).distinct().count()
    referenced = parent_df.join(
        child_df.select(fk_column).distinct(),
        parent_df[pk_column] == child_df[fk_column], "inner"
    ).select(pk_column).distinct().count()
    rate = referenced / total_parents if total_parents > 0 else 1.0
    return rate >= min_coverage, {"coverage": round(rate, 4), "referenced": referenced, "total": total_parents}
```

---

### QR-A10: Cross-Table Balance

| Attribute | Value |
|---|---|
| **Rule ID** | QR-A10 |
| **Name** | Cross-Table Balance |
| **Category** | Aggregate |
| **Dimension** | Accuracy, Consistency |
| **Severity** | Critical |
| **Description** | Validates that aggregate values balance across related tables. Examples: sum of order line amounts = order header total; sum of inventory transactions = current inventory balance. |
| **Default Threshold** | Delta <= configurable tolerance (default: 0.01) |

```sql
-- SQL Implementation
SELECT h.order_id,
       h.order_total AS header_total,
       SUM(l.line_amount) AS lines_total,
       ABS(h.order_total - SUM(l.line_amount)) AS delta
FROM order_header h
JOIN order_lines l ON h.order_id = l.order_id
GROUP BY h.order_id, h.order_total
HAVING ABS(h.order_total - SUM(l.line_amount)) > {tolerance};
```

```python
# PySpark Implementation
def qr_a10_cross_table_balance(header_df, detail_df, join_key, header_total_col,
                                detail_amount_col, tolerance=0.01):
    detail_sums = detail_df.groupBy(join_key).agg(
        F.sum(detail_amount_col).alias("detail_total")
    )
    comparison = header_df.join(detail_sums, join_key)
    total = comparison.count()
    imbalanced = comparison.filter(
        F.abs(F.col(header_total_col) - F.col("detail_total")) > tolerance
    ).count()
    rate = (total - imbalanced) / total if total > 0 else 1.0
    return rate, {"imbalanced": imbalanced, "total": total}
```

---

## Category 4: Business Rules (QR-B01 through QR-B15)

Business rules validate domain-specific constraints that require manufacturing or industry knowledge. These rules are conditionally activated based on the client's industry context.

### QR-B01: BOM Hierarchy Integrity

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B01 |
| **Name** | BOM Hierarchy Integrity |
| **Category** | Business Rule |
| **Dimension** | Consistency, Validity |
| **Severity** | Critical |
| **Description** | Validates that Bill of Materials (BOM) hierarchies form valid tree structures with no circular references, no orphan components, and all parent items existing as valid products. |
| **Default Threshold** | 100% — no circular references or orphan components |

```sql
-- SQL Implementation (circular reference detection)
WITH RECURSIVE bom_tree AS (
    SELECT parent_item_id, child_item_id, 1 AS level,
           ARRAY(parent_item_id) AS path
    FROM bom
    UNION ALL
    SELECT b.parent_item_id, b.child_item_id, t.level + 1,
           ARRAY_UNION(t.path, ARRAY(b.parent_item_id))
    FROM bom b
    JOIN bom_tree t ON b.parent_item_id = t.child_item_id
    WHERE t.level < 20 AND NOT ARRAY_CONTAINS(t.path, b.child_item_id)
)
SELECT * FROM bom_tree WHERE level >= 20;  -- indicates possible circular reference
```

```python
# PySpark Implementation
def qr_b01_bom_integrity(bom_df, product_df):
    # Check for orphan parents (parent not in product master)
    orphan_parents = bom_df.join(
        product_df.select("item_id"),
        bom_df["parent_item_id"] == product_df["item_id"], "left_anti"
    ).count()
    # Check for orphan children
    orphan_children = bom_df.join(
        product_df.select("item_id"),
        bom_df["child_item_id"] == product_df["item_id"], "left_anti"
    ).count()
    # Check for self-references
    self_refs = bom_df.filter(F.col("parent_item_id") == F.col("child_item_id")).count()
    total_issues = orphan_parents + orphan_children + self_refs
    return total_issues == 0, {
        "orphan_parents": orphan_parents,
        "orphan_children": orphan_children,
        "self_references": self_refs
    }
```

---

### QR-B02: Work Order Status Transitions

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B02 |
| **Name** | Work Order Status Transitions |
| **Category** | Business Rule |
| **Dimension** | Validity, Consistency |
| **Severity** | Major |
| **Description** | Validates that work order status changes follow the defined state machine. Invalid transitions (e.g., Closed -> Created) indicate data integrity issues or system bypass. |
| **Default Threshold** | >= 99% of transitions are valid |

```python
# PySpark Implementation
VALID_TRANSITIONS = {
    'Created': ['Released', 'Cancelled'],
    'Released': ['In Progress', 'Cancelled', 'On Hold'],
    'On Hold': ['Released', 'Cancelled'],
    'In Progress': ['Completed', 'On Hold', 'Cancelled'],
    'Completed': ['Closed'],
    'Cancelled': [],
    'Closed': []
}

def qr_b02_wo_status_transitions(wo_history_df):
    w = Window.partitionBy("work_order_id").orderBy("change_timestamp")
    with_prev = wo_history_df.withColumn("prev_status", F.lag("status").over(w))
    transitions = with_prev.filter(F.col("prev_status").isNotNull())
    total = transitions.count()

    valid_trans_list = [(k, v) for k, vals in VALID_TRANSITIONS.items() for v in vals]
    valid_df = spark.createDataFrame(valid_trans_list, ["from_status", "to_status"])

    invalid = transitions.join(
        valid_df,
        (transitions["prev_status"] == valid_df["from_status"]) &
        (transitions["status"] == valid_df["to_status"]),
        "left_anti"
    ).count()
    rate = (total - invalid) / total if total > 0 else 1.0
    return rate, {"invalid_transitions": invalid, "total": total}
```

---

### QR-B03: Production Output Balance

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B03 |
| **Name** | Production Output Balance |
| **Category** | Business Rule |
| **Dimension** | Accuracy |
| **Severity** | Critical |
| **Description** | Validates that production output quantities balance: input material quantity = output product quantity + scrap quantity + WIP quantity (within tolerance). |
| **Default Threshold** | Balance within 2% tolerance |

```sql
-- SQL Implementation
SELECT work_order_id,
       input_qty,
       output_qty + scrap_qty + wip_qty AS total_output,
       ABS(input_qty - (output_qty + scrap_qty + wip_qty)) / NULLIF(input_qty, 0) * 100 AS pct_imbalance
FROM production_summary
WHERE ABS(input_qty - (output_qty + scrap_qty + wip_qty)) / NULLIF(input_qty, 0) > 0.02;
```

---

### QR-B04: Quality Inspection Thresholds

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B04 |
| **Name** | Quality Inspection Thresholds |
| **Category** | Business Rule |
| **Dimension** | Validity, Accuracy |
| **Severity** | Critical |
| **Description** | Validates that quality inspection measurements fall within specification limits (USL/LSL). Measurements outside limits should have corresponding disposition records. |
| **Default Threshold** | 100% of out-of-spec measurements have disposition records |

```sql
-- SQL Implementation
SELECT i.inspection_id, i.measurement_value, s.upper_spec_limit, s.lower_spec_limit
FROM quality_inspections i
JOIN specifications s ON i.characteristic_id = s.characteristic_id
WHERE (i.measurement_value > s.upper_spec_limit OR i.measurement_value < s.lower_spec_limit)
  AND NOT EXISTS (
      SELECT 1 FROM dispositions d WHERE d.inspection_id = i.inspection_id
  );
```

---

### QR-B05: Inventory Non-Negative Check

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B05 |
| **Name** | Inventory Non-Negative Check |
| **Category** | Business Rule |
| **Dimension** | Validity, Accuracy |
| **Severity** | Critical |
| **Description** | Validates that on-hand inventory quantities are non-negative. Negative inventory indicates transaction posting errors or timing issues. |
| **Default Threshold** | 100% of inventory records >= 0 |

```sql
-- SQL Implementation
SELECT item_id, warehouse_id, location_id, on_hand_qty
FROM inventory
WHERE on_hand_qty < 0;
```

```python
# PySpark Implementation
def qr_b05_inventory_non_negative(df, qty_column="on_hand_qty"):
    total = df.count()
    negative = df.filter(F.col(qty_column) < 0).count()
    rate = (total - negative) / total if total > 0 else 1.0
    return rate, {"negative_records": negative, "total": total}
```

---

### QR-B06: Cost Roll-Up Accuracy

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B06 |
| **Name** | Cost Roll-Up Accuracy |
| **Category** | Business Rule |
| **Dimension** | Accuracy |
| **Severity** | Critical |
| **Description** | Validates that parent item costs equal the sum of component costs multiplied by BOM quantities, plus routing (labor/overhead) costs. Discrepancies affect financial reporting. |
| **Default Threshold** | Delta <= 0.01 per unit |

```sql
-- SQL Implementation
SELECT p.item_id,
       p.standard_cost AS parent_cost,
       SUM(c.standard_cost * b.qty_per) + COALESCE(r.routing_cost, 0) AS calculated_cost,
       ABS(p.standard_cost - (SUM(c.standard_cost * b.qty_per) + COALESCE(r.routing_cost, 0))) AS delta
FROM products p
JOIN bom b ON p.item_id = b.parent_item_id
JOIN products c ON b.child_item_id = c.item_id
LEFT JOIN routing_costs r ON p.item_id = r.item_id
GROUP BY p.item_id, p.standard_cost, r.routing_cost
HAVING ABS(p.standard_cost - (SUM(c.standard_cost * b.qty_per) + COALESCE(r.routing_cost, 0))) > 0.01;
```

---

### QR-B07: Machine Downtime Validity

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B07 |
| **Name** | Machine Downtime Validity |
| **Category** | Business Rule |
| **Dimension** | Validity, Timeliness |
| **Severity** | Major |
| **Description** | Validates that machine downtime records have valid start/end times (end > start), duration matches the time difference, and reason codes are from the approved list. |
| **Default Threshold** | >= 99% of downtime records are valid |

```sql
-- SQL Implementation
SELECT downtime_id, machine_id, start_time, end_time, duration_minutes, reason_code
FROM machine_downtime
WHERE end_time <= start_time
   OR ABS(DATEDIFF(MINUTE, start_time, end_time) - duration_minutes) > 1
   OR reason_code NOT IN (SELECT code FROM downtime_reason_codes WHERE is_active = TRUE);
```

---

### QR-B08: Yield Calculation Accuracy

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B08 |
| **Name** | Yield Calculation Accuracy |
| **Category** | Business Rule |
| **Dimension** | Accuracy |
| **Severity** | Major |
| **Description** | Validates that reported yield percentages match recalculated yield from good output / total output. Yield is a key OEE component and must be accurate. |
| **Default Threshold** | Delta <= 0.1% (0.001) |

```sql
-- SQL Implementation
SELECT work_order_id, reported_yield,
       good_qty * 1.0 / NULLIF(total_output_qty, 0) AS calculated_yield,
       ABS(reported_yield - (good_qty * 1.0 / NULLIF(total_output_qty, 0))) AS delta
FROM production_output
WHERE ABS(reported_yield - (good_qty * 1.0 / NULLIF(total_output_qty, 0))) > 0.001;
```

---

### QR-B09: Lot Traceability Completeness

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B09 |
| **Name** | Lot Traceability Completeness |
| **Category** | Business Rule |
| **Dimension** | Completeness |
| **Severity** | Critical |
| **Description** | Validates that all production output records have valid lot/batch numbers and that lot genealogy (input lot to output lot) is complete. Required for regulatory recalls. |
| **Default Threshold** | 100% for regulated products; >= 99% for others |

```sql
-- SQL Implementation
SELECT po.production_id, po.output_lot_number
FROM production_output po
WHERE po.output_lot_number IS NULL
   OR po.output_lot_number = ''
   OR NOT EXISTS (
       SELECT 1 FROM lot_genealogy lg WHERE lg.output_lot = po.output_lot_number
   );
```

---

### QR-B10: Scheduled vs Actual Production Variance

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B10 |
| **Name** | Scheduled vs Actual Production Variance |
| **Category** | Business Rule |
| **Dimension** | Accuracy, Consistency |
| **Severity** | Major |
| **Description** | Validates that the variance between scheduled and actual production quantities is within acceptable limits. Excessive variance indicates planning or execution issues. |
| **Default Threshold** | Variance <= 15% |

```sql
-- SQL Implementation
SELECT work_order_id, scheduled_qty, actual_qty,
       ABS(scheduled_qty - actual_qty) * 100.0 / NULLIF(scheduled_qty, 0) AS variance_pct
FROM production_orders
WHERE status = 'Completed'
  AND ABS(scheduled_qty - actual_qty) * 100.0 / NULLIF(scheduled_qty, 0) > 15;
```

---

### QR-B11: Material Consumption Accuracy

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B11 |
| **Name** | Material Consumption Accuracy |
| **Category** | Business Rule |
| **Dimension** | Accuracy |
| **Severity** | Major |
| **Description** | Validates that actual material consumption per production order is within tolerance of the BOM-expected consumption (quantity per * output quantity). Excessive variance indicates waste or recording errors. |
| **Default Threshold** | Variance <= 10% |

```sql
-- SQL Implementation
SELECT wo.work_order_id, mc.item_id,
       mc.actual_qty AS consumed,
       b.qty_per * wo.output_qty AS expected,
       ABS(mc.actual_qty - (b.qty_per * wo.output_qty)) / NULLIF(b.qty_per * wo.output_qty, 0) * 100 AS variance_pct
FROM work_orders wo
JOIN material_consumption mc ON wo.work_order_id = mc.work_order_id
JOIN bom b ON wo.product_id = b.parent_item_id AND mc.item_id = b.child_item_id
WHERE ABS(mc.actual_qty - (b.qty_per * wo.output_qty)) / NULLIF(b.qty_per * wo.output_qty, 0) > 0.10;
```

---

### QR-B12: Shipping Weight Validation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B12 |
| **Name** | Shipping Weight Validation |
| **Category** | Business Rule |
| **Dimension** | Accuracy |
| **Severity** | Minor |
| **Description** | Validates that shipping weights are consistent with product master weights multiplied by shipped quantity. Large discrepancies indicate picking errors or master data issues. |
| **Default Threshold** | Variance <= 5% |

```sql
-- SQL Implementation
SELECT s.shipment_id, s.actual_weight,
       SUM(sl.qty_shipped * p.unit_weight) AS expected_weight
FROM shipments s
JOIN shipment_lines sl ON s.shipment_id = sl.shipment_id
JOIN products p ON sl.item_id = p.item_id
GROUP BY s.shipment_id, s.actual_weight
HAVING ABS(s.actual_weight - SUM(sl.qty_shipped * p.unit_weight))
       / NULLIF(SUM(sl.qty_shipped * p.unit_weight), 0) > 0.05;
```

---

### QR-B13: IoT Sensor Range Validation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B13 |
| **Name** | IoT Sensor Range Validation |
| **Category** | Business Rule |
| **Dimension** | Validity, Accuracy |
| **Severity** | Major |
| **Description** | Validates that IoT sensor readings fall within the operational range of the sensor. Readings outside sensor physical limits indicate sensor malfunction or data transmission errors. |
| **Default Threshold** | >= 99.9% of readings within sensor range |

```sql
-- SQL Implementation
SELECT sr.reading_id, sr.sensor_id, sr.value, s.min_range, s.max_range
FROM sensor_readings sr
JOIN sensors s ON sr.sensor_id = s.sensor_id
WHERE sr.value < s.min_range OR sr.value > s.max_range;
```

---

### QR-B14: Customer Order Promise Date Integrity

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B14 |
| **Name** | Customer Order Promise Date Integrity |
| **Category** | Business Rule |
| **Dimension** | Validity, Consistency |
| **Severity** | Major |
| **Description** | Validates that customer order promise dates are logically valid: promise_date >= order_date, promise_date falls on a business day, and promise_date is within configured lead time window. |
| **Default Threshold** | >= 99% of orders have valid promise dates |

```sql
-- SQL Implementation
SELECT order_id, order_date, promise_date
FROM customer_orders
WHERE promise_date < order_date
   OR DATEDIFF(DAY, order_date, promise_date) > {max_lead_time_days}
   OR DAYOFWEEK(promise_date) IN (1, 7);  -- Saturday, Sunday
```

---

### QR-B15: ERP/MES Reconciliation

| Attribute | Value |
|---|---|
| **Rule ID** | QR-B15 |
| **Name** | ERP/MES Reconciliation |
| **Category** | Business Rule |
| **Dimension** | Consistency, Accuracy |
| **Severity** | Critical |
| **Description** | Validates that production quantities and statuses reconcile between ERP (planning system) and MES (execution system). Discrepancies indicate integration failures or manual overrides. |
| **Default Threshold** | >= 99% reconciliation rate |

```sql
-- SQL Implementation
SELECT e.work_order_id,
       e.erp_output_qty, m.mes_output_qty,
       e.erp_status, m.mes_status
FROM erp_production e
JOIN mes_production m ON e.work_order_id = m.work_order_id
WHERE ABS(e.erp_output_qty - m.mes_output_qty) > {qty_tolerance}
   OR e.erp_status <> m.mes_status;
```

```python
# PySpark Implementation
def qr_b15_erp_mes_reconciliation(erp_df, mes_df, join_key="work_order_id",
                                    qty_tolerance=1):
    reconciled = erp_df.join(mes_df, join_key)
    total = reconciled.count()
    mismatched = reconciled.filter(
        (F.abs(F.col("erp_output_qty") - F.col("mes_output_qty")) > qty_tolerance) |
        (F.col("erp_status") != F.col("mes_status"))
    ).count()
    rate = (total - mismatched) / total if total > 0 else 1.0
    return rate, {"mismatched": mismatched, "total": total}
```

---

## Rule Summary Matrix

| Rule ID | Name | Category | Dimension(s) | Severity |
|---|---|---|---|---|
| QR-S01 | Column Existence | Schema | Validity | Critical |
| QR-S02 | Data Type Match | Schema | Validity | Critical |
| QR-S03 | Nullable Compliance | Schema | Validity, Completeness | Critical |
| QR-S04 | Primary Key Uniqueness | Schema | Uniqueness | Critical |
| QR-S05 | Foreign Key Validity | Schema | Consistency | Major |
| QR-S06 | Column Count | Schema | Validity | Major |
| QR-S07 | Partition Integrity | Schema | Completeness | Major |
| QR-S08 | Index Coverage | Schema | Validity | Minor |
| QR-S09 | Schema Version | Schema | Consistency | Major |
| QR-S10 | Reserved Word Check | Schema | Validity | Minor |
| QR-R01 | Null Check | Row-Level | Completeness | Critical/Minor |
| QR-R02 | Range Check | Row-Level | Validity | Major |
| QR-R03 | Pattern Match | Row-Level | Validity | Major |
| QR-R04 | Enumeration Validation | Row-Level | Validity | Major |
| QR-R05 | Date Range Validation | Row-Level | Validity, Accuracy | Major |
| QR-R06 | String Length | Row-Level | Validity | Minor |
| QR-R07 | Numeric Precision | Row-Level | Validity, Accuracy | Major |
| QR-R08 | Email Format | Row-Level | Validity | Minor |
| QR-R09 | Phone Format | Row-Level | Validity | Minor |
| QR-R10 | Postal Code | Row-Level | Validity | Minor |
| QR-R11 | Cross-Field Validation | Row-Level | Consistency, Validity | Major |
| QR-R12 | Calculated Field | Row-Level | Accuracy | Major |
| QR-R13 | Duplicate Detection | Row-Level | Uniqueness | Major |
| QR-R14 | Orphan Record | Row-Level | Consistency | Major |
| QR-R15 | Temporal Sequence | Row-Level | Consistency, Validity | Major |
| QR-A01 | Row Count Threshold | Aggregate | Completeness | Critical |
| QR-A02 | Row Count Delta | Aggregate | Completeness, Accuracy | Major |
| QR-A03 | Sum Reconciliation | Aggregate | Accuracy | Critical |
| QR-A04 | Distribution Check | Aggregate | Accuracy, Validity | Major |
| QR-A05 | Freshness Check | Aggregate | Timeliness | Critical |
| QR-A06 | Gap Detection | Aggregate | Completeness | Major |
| QR-A07 | Completeness Rate | Aggregate | Completeness | Major |
| QR-A08 | Uniqueness Rate | Aggregate | Uniqueness | Major |
| QR-A09 | Referential Coverage | Aggregate | Consistency | Major |
| QR-A10 | Cross-Table Balance | Aggregate | Accuracy, Consistency | Critical |
| QR-B01 | BOM Hierarchy Integrity | Business | Consistency, Validity | Critical |
| QR-B02 | Work Order Status Transitions | Business | Validity, Consistency | Major |
| QR-B03 | Production Output Balance | Business | Accuracy | Critical |
| QR-B04 | Quality Inspection Thresholds | Business | Validity, Accuracy | Critical |
| QR-B05 | Inventory Non-Negative | Business | Validity, Accuracy | Critical |
| QR-B06 | Cost Roll-Up Accuracy | Business | Accuracy | Critical |
| QR-B07 | Machine Downtime Validity | Business | Validity, Timeliness | Major |
| QR-B08 | Yield Calculation Accuracy | Business | Accuracy | Major |
| QR-B09 | Lot Traceability Completeness | Business | Completeness | Critical |
| QR-B10 | Scheduled vs Actual Variance | Business | Accuracy, Consistency | Major |
| QR-B11 | Material Consumption Accuracy | Business | Accuracy | Major |
| QR-B12 | Shipping Weight Validation | Business | Accuracy | Minor |
| QR-B13 | IoT Sensor Range | Business | Validity, Accuracy | Major |
| QR-B14 | Promise Date Integrity | Business | Validity, Consistency | Major |
| QR-B15 | ERP/MES Reconciliation | Business | Consistency, Accuracy | Critical |

---

## Fabric / Azure Implementation Guidance

| Component | Recommended Service | Notes |
|---|---|---|
| Rule execution engine | Fabric PySpark notebooks | One notebook per rule category or configurable engine |
| Rule configuration | Delta table (`dq_rule_config`) | Rule parameters, thresholds, active/inactive status |
| Results storage | Delta table (`dq_rule_results`) | Per-rule, per-run pass/fail with metrics |
| Failed record samples | Delta table (`dq_failed_records`) | Max 1000 samples per rule per run |
| Rule scheduling | Fabric pipelines | Schema rules first, then row-level, then aggregate |
| Great Expectations | Optional integration | GE checkpoints can wrap ISL rules for additional features |

### Rule Execution Order

```
Phase 1: Schema Validation (QR-S01 through QR-S10)
    ↓ (halt if Critical schema rules fail)
Phase 2: Row-Level Rules (QR-R01 through QR-R15)
    ↓ (parallel execution within phase)
Phase 3: Aggregate Rules (QR-A01 through QR-A10)
    ↓ (depends on row-level results)
Phase 4: Business Rules (QR-B01 through QR-B15)
    ↓ (conditional based on client configuration)
Phase 5: Score Calculation and SLA Evaluation
```

---

## Manufacturing Overlay [CONDITIONAL]

All QR-B (Business Rule) rules are part of the manufacturing overlay. Additionally:

- QR-B01 through QR-B06 are **mandatory** for manufacturing clients
- QR-B07 through QR-B15 are recommended and activated based on client scope
- Manufacturing clients should enable IoT-specific rules (QR-B13) for connected factory scenarios
- ERP-specific rule parameters (QR-B15) should be adapted for SAP, Epicor, or other ERP platforms

---

## Cross-References

| Reference | Module | Relationship |
|---|---|---|
| Quality Dimension Definitions | ISL-06 | Dimension mapping for each rule |
| Quality SLA Framework | ISL-06 | Thresholds that determine rule pass/fail |
| Quality Monitoring Standards | ISL-06 | Monitoring infrastructure for rule results |
| Remediation Workflow | ISL-06 | Triggered when rules fail |
| Manufacturing Quality Rules Example | ISL-06 | Concrete implementations for manufacturing |
| Fabric Quality Implementation Example | ISL-06 | PySpark notebook patterns for rule execution |
| ISL-03 Naming Conventions | ISL-03 | Naming for quality result tables and columns |
| ISL-05 Medallion Architecture | ISL-05 | Rules mapped to medallion layer quality gates |

## Compliance Alignment

| Framework | Relevance |
|---|---|
| ISO 8000 | Rules implement data quality measurement per ISO 8000 dimensions |
| DAMA DMBOK | Rule library supports data quality assessment and monitoring |
| SOX | Financial rules (QR-A03, QR-A10, QR-B06) support SOX controls |
| FDA 21 CFR Part 11 | Traceability rules (QR-B09) support regulatory compliance |
| ISO 9001 | Quality inspection rules (QR-B04) support QMS integration |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-01-15 | ISL Team | Initial release — 50 pre-built rules across 4 categories |

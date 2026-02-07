# Quality Dimension Definitions

> Module: ISL-06 | Version: 1.0 | Adaptation Effort: 2-3 hrs | Dependencies: ISL-02, ISL-04, ISL-05

## Purpose

This document provides formal definitions, measurement formulas, calculation methods, and operational guidance for the six core data quality dimensions used throughout the ISL framework. These dimensions form the foundation for all quality rules (ISL-06 Quality Rule Library), SLA thresholds (ISL-06 Quality SLA Framework), and quality scoring (ISL-06 Quality Scorecard Template). Consistent dimension definitions ensure that quality measurements are comparable across domains, datasets, and reporting periods.

## Scope

### In Scope

- Formal definitions for six data quality dimensions
- Measurement formulas expressed in SQL-like syntax for platform portability
- Calculation examples with sample data
- Edge case handling for each dimension
- Measurement frequency guidance by data tier
- Inter-dimension relationships and dependencies
- Dimension prioritization guidance by use case

### Out of Scope

- Specific quality rule implementations (see Quality Rule Library)
- SLA threshold values by tier (see Quality SLA Framework)
- Dashboard and reporting specifications (see Quality Scorecard Template)
- Tool-specific configuration (see Fabric Quality Implementation Example)

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default Value | Client Value | Notes |
|---|---|---|---|
| `primary_dimensions` | All 6 dimensions | | Subset if client scope is limited |
| `measurement_precision` | 4 decimal places | | Decimal precision for quality scores |
| `null_equivalents` | `NULL, '', 'N/A', 'n/a', 'NA', 'null', 'NONE'` | | Client-specific null representations |
| `duplicate_match_type` | Exact match | | Exact, fuzzy, or phonetic matching |
| `timeliness_clock_source` | UTC | | Timezone for timeliness calculations |
| `accuracy_reference_system` | Source system of record | | External reference for accuracy checks |
| `custom_dimensions` | None | | Any client-specific dimensions beyond the core 6 |
| `weighting_model` | Equal (1/6 each) | | Dimension weights for composite scoring |

---

## Dimension Overview

The ISL framework measures data quality across six orthogonal dimensions. Each dimension captures a distinct aspect of data fitness-for-use and is measured independently before being combined into composite quality scores per ISL-06 Quality Scorecard Template.

| # | Dimension | Definition Summary | Primary Question Answered |
|---|---|---|---|
| D1 | Completeness | Presence of required values | "Is the data here?" |
| D2 | Accuracy | Correctness relative to real-world truth | "Is the data right?" |
| D3 | Timeliness | Currency and availability within expected windows | "Is the data fresh?" |
| D4 | Consistency | Agreement across systems and datasets | "Does the data agree?" |
| D5 | Validity | Conformance to defined formats, ranges, and rules | "Is the data in the right shape?" |
| D6 | Uniqueness | Absence of unintended duplicate records | "Is there only one record per entity?" |

### Dimension Relationship Map

```
Completeness ──────► Accuracy (cannot assess accuracy of missing data)
     │                    │
     │                    ▼
     │              Consistency (accuracy across systems implies consistency)
     │                    │
     ▼                    ▼
Validity ◄──────── Timeliness (stale data may fail validity checks)
     │
     ▼
Uniqueness (duplicate detection requires valid key fields)
```

**Key dependency**: Completeness is the foundational dimension. A record missing required fields cannot be meaningfully assessed for accuracy, validity, or uniqueness. Quality rule evaluation should proceed in the order: Completeness, Validity, Accuracy, Consistency, Uniqueness, Timeliness.

---

## D1: Completeness

### Formal Definition

**Completeness** measures the degree to which all required data values are present and non-null for a given dataset, column, or record. A data element is considered complete if it contains a meaningful, non-null, non-placeholder value.

### Measurement Formula

```sql
-- Column-level completeness
completeness_rate = (
    COUNT(*) - COUNT(
        CASE WHEN column_value IS NULL
             OR TRIM(column_value) = ''
             OR UPPER(TRIM(column_value)) IN ('N/A', 'NA', 'NULL', 'NONE', 'UNKNOWN', '-')
        THEN 1
    END)
) / NULLIF(COUNT(*), 0)

-- Record-level completeness (all required fields present)
record_completeness = (
    COUNT(CASE WHEN all_required_fields_populated = TRUE THEN 1 END)
) / NULLIF(COUNT(*), 0)

-- Dataset-level completeness (expected vs actual row count)
dataset_completeness = actual_row_count / NULLIF(expected_row_count, 0)
```

### Calculation Example

| customer_id | first_name | last_name | email | phone |
|---|---|---|---|---|
| 1001 | Alice | Smith | alice@co.com | 555-0101 |
| 1002 | Bob | NULL | bob@co.com | N/A |
| 1003 | | Jones | NULL | 555-0103 |
| 1004 | Diana | Lee | diana@co.com | 555-0104 |

- `first_name` completeness: 3/4 = 75.00% (row 1003 has empty string)
- `last_name` completeness: 3/4 = 75.00% (row 1002 is NULL)
- `email` completeness: 3/4 = 75.00% (row 1003 is NULL)
- `phone` completeness: 3/4 = 75.00% (row 1002 is "N/A" placeholder)
- Record-level completeness (all 4 columns required): 2/4 = 50.00%

### Edge Cases

| Scenario | Treatment | Rationale |
|---|---|---|
| Default/placeholder values (e.g., "1900-01-01", "0", "TBD") | Configurable per column — default is **incomplete** | Placeholders mask missing data |
| Zero (0) in numeric fields | **Complete** unless column-specific override | Zero is a valid measurement value |
| Empty string vs NULL | Both treated as **incomplete** | Functionally equivalent in most platforms |
| Whitespace-only strings | **Incomplete** | No meaningful content |
| Optional fields | Excluded from completeness checks unless opted in | Only required fields affect completeness scores |
| Nested/array fields (JSON) | Complete if array has >= 1 element | Empty arrays are incomplete |

### Measurement Frequency

| Data Tier (ISL-04) | Measurement Frequency | Retention |
|---|---|---|
| Critical (Tier 3-4) | Every pipeline run (near real-time) | 13 months |
| Standard (Tier 2) | Daily | 6 months |
| Informational (Tier 1) | Weekly | 3 months |

---

## D2: Accuracy

### Formal Definition

**Accuracy** measures the degree to which data values correctly represent the real-world entities or events they describe. Accuracy assessment requires comparison against a trusted reference source, a validated business rule, or a domain-specific reasonableness check.

### Measurement Formula

```sql
-- Reference-based accuracy (comparison to source of truth)
accuracy_rate = (
    COUNT(CASE WHEN target.value = reference.value THEN 1 END)
) / NULLIF(COUNT(*), 0)

-- Tolerance-based accuracy (numeric fields within threshold)
accuracy_rate = (
    COUNT(CASE WHEN ABS(target.value - reference.value) <= tolerance THEN 1 END)
) / NULLIF(COUNT(*), 0)

-- Rule-based accuracy (business rule validation)
accuracy_rate = (
    COUNT(CASE WHEN business_rule_check(column_value) = TRUE THEN 1 END)
) / NULLIF(COUNT(*), 0)
```

### Calculation Example

| order_id | target_amount | reference_amount | tolerance | accurate? |
|---|---|---|---|---|
| 5001 | 1250.00 | 1250.00 | 0.01 | Yes |
| 5002 | 999.50 | 1000.00 | 0.01 | No (delta=0.50) |
| 5003 | 750.00 | 750.00 | 0.01 | Yes |
| 5004 | 320.15 | 320.10 | 0.10 | Yes (delta=0.05, within tolerance) |

Accuracy rate: 3/4 = 75.00%

### Accuracy Sub-Types

| Sub-Type | Description | Measurement Approach |
|---|---|---|
| Syntactic accuracy | Value format is correct | Pattern matching (regex) |
| Semantic accuracy | Value meaning is correct | Reference data comparison |
| Temporal accuracy | Value is correct as of a point in time | Bi-temporal comparison |
| Aggregation accuracy | Derived/calculated values are correct | Recalculation and comparison |

### Edge Cases

| Scenario | Treatment | Rationale |
|---|---|---|
| NULL in target | Excluded from accuracy (counted under completeness) | Cannot assess accuracy of missing data |
| NULL in reference | Record flagged, excluded from scoring | Reference gap, not a target quality issue |
| Floating-point precision | Use configurable tolerance (default: 0.01) | IEEE 754 rounding artifacts |
| Case sensitivity | Case-insensitive comparison by default | Unless domain requires case sensitivity |
| Leading/trailing whitespace | Trimmed before comparison | Whitespace is rarely meaningful |
| Temporal lag | Allow configurable grace period | Source and target may not sync instantaneously |

### Measurement Frequency

| Data Tier (ISL-04) | Measurement Frequency | Retention |
|---|---|---|
| Critical (Tier 3-4) | Every pipeline run | 13 months |
| Standard (Tier 2) | Daily | 6 months |
| Informational (Tier 1) | Weekly | 3 months |

---

## D3: Timeliness

### Formal Definition

**Timeliness** measures the degree to which data is available within the expected time window after the real-world event it represents. Timeliness encompasses both data freshness (age of the most recent record) and data punctuality (arrival within the expected delivery window).

### Measurement Formula

```sql
-- Freshness (age of most recent data)
data_age_minutes = DATEDIFF(MINUTE, MAX(event_timestamp), CURRENT_TIMESTAMP)
freshness_met = CASE WHEN data_age_minutes <= threshold_minutes THEN 1 ELSE 0 END

-- Punctuality (delivered within SLA window)
punctuality_rate = (
    COUNT(CASE WHEN actual_arrival_time <= expected_arrival_time THEN 1 END)
) / NULLIF(COUNT(*), 0)

-- Delivery delay (average latency)
avg_delay_minutes = AVG(
    DATEDIFF(MINUTE, event_timestamp, ingestion_timestamp)
)
```

### Calculation Example

| pipeline | expected_arrival | actual_arrival | on_time? | delay |
|---|---|---|---|---|
| SAP_Orders | 06:00 UTC | 05:45 UTC | Yes | -15 min |
| MES_Production | 06:00 UTC | 06:22 UTC | No | +22 min |
| IoT_Telemetry | Continuous (15 min) | 12 min lag | Yes | 12 min |
| HR_Headcount | 08:00 UTC | 07:58 UTC | Yes | -2 min |

Punctuality rate: 3/4 = 75.00%

### Timeliness Sub-Types

| Sub-Type | Definition | Metric |
|---|---|---|
| Freshness | Age of the newest record in the dataset | Minutes/hours since last record timestamp |
| Punctuality | Whether data arrived within the expected delivery window | Binary (on-time / late) per delivery |
| Throughput latency | Time between event occurrence and data availability | Average ingestion-to-availability lag |
| Processing latency | Time spent in transformation pipelines | Pipeline duration metrics |

### Edge Cases

| Scenario | Treatment | Rationale |
|---|---|---|
| Clock skew between systems | Normalize to UTC; allow 60-second tolerance | Distributed system clock drift |
| Daylight saving transitions | Use UTC internally; convert for display only | Avoids ambiguous local times |
| Backfill/reprocessing loads | Exclude from timeliness scoring or tag separately | Backfills are intentionally late |
| Zero-row deliveries | Mark as timely if pipeline ran on schedule | Empty result is still a valid delivery |
| Weekend/holiday schedules | Apply business calendar exceptions | Non-business days may have different SLAs |

### Measurement Frequency

| Data Tier (ISL-04) | Measurement Frequency | Retention |
|---|---|---|
| Critical (Tier 3-4) | Continuous / every pipeline run | 13 months |
| Standard (Tier 2) | Hourly or per-run | 6 months |
| Informational (Tier 1) | Daily | 3 months |

---

## D4: Consistency

### Formal Definition

**Consistency** measures the degree to which equivalent data values agree across datasets, systems, time periods, or related fields within the same record. Inconsistency indicates conflicting versions of the same fact, undermining trust in downstream analytics.

### Measurement Formula

```sql
-- Cross-system consistency
consistency_rate = (
    COUNT(CASE WHEN system_a.value = system_b.value THEN 1 END)
) / NULLIF(COUNT(*), 0)

-- Intra-record consistency (related fields agree)
intra_consistency = (
    COUNT(CASE WHEN field_relationship_check(field_a, field_b) = TRUE THEN 1 END)
) / NULLIF(COUNT(*), 0)

-- Temporal consistency (value does not contradict prior state)
temporal_consistency = (
    COUNT(CASE WHEN current_value_is_valid_transition(prev_value, curr_value) = TRUE THEN 1 END)
) / NULLIF(COUNT(*), 0)
```

### Calculation Example

| customer_id | erp_address | crm_address | match? |
|---|---|---|---|
| C-1001 | 123 Main St | 123 Main St | Yes |
| C-1002 | 456 Oak Ave | 456 Oak Avenue | Fuzzy match (Yes with normalization) |
| C-1003 | 789 Elm Dr | 100 Pine Rd | No |
| C-1004 | NULL | 222 Birch Ln | Excluded (completeness issue) |

Consistency rate (exact): 1/3 = 33.33% (excluding NULLs)
Consistency rate (normalized): 2/3 = 66.67%

### Consistency Sub-Types

| Sub-Type | Description | Example |
|---|---|---|
| Cross-system | Same entity matches across source systems | ERP address = CRM address |
| Intra-record | Related fields within a record are logically coherent | ship_date >= order_date |
| Temporal | Values change in valid state transitions over time | Order status: Open -> Shipped (valid), Shipped -> Open (invalid) |
| Referential | Foreign key values exist in the referenced table | product_id in orders exists in products |
| Format | Same data type/format is used for equivalent fields | Date formats consistent across all date columns |

### Edge Cases

| Scenario | Treatment | Rationale |
|---|---|---|
| Legitimate differences (e.g., currency conversion) | Exclude or apply transformation before comparison | Known transformations are not inconsistencies |
| Timing differences (eventual consistency) | Allow grace period (configurable, default: 1 hour) | Distributed systems have propagation delay |
| One side is NULL | Exclude from consistency; flag under completeness | Cannot compare to missing data |
| Fuzzy matching (abbreviations, typos) | Configurable — default is exact match | Fuzzy logic adds complexity and false positives |

### Measurement Frequency

| Data Tier (ISL-04) | Measurement Frequency | Retention |
|---|---|---|
| Critical (Tier 3-4) | Every pipeline run | 13 months |
| Standard (Tier 2) | Daily | 6 months |
| Informational (Tier 1) | Weekly | 3 months |

---

## D5: Validity

### Formal Definition

**Validity** measures the degree to which data values conform to defined syntactic rules, formats, ranges, controlled vocabularies, and business constraints. A valid value is one that falls within the accepted domain of the field as defined by schema, business rules, or regulatory requirements.

### Measurement Formula

```sql
-- Format validity (regex pattern match)
format_validity = (
    COUNT(CASE WHEN column_value RLIKE pattern THEN 1 END)
) / NULLIF(COUNT(*), 0)

-- Range validity (within min/max bounds)
range_validity = (
    COUNT(CASE WHEN column_value BETWEEN min_value AND max_value THEN 1 END)
) / NULLIF(COUNT(*), 0)

-- Enumeration validity (in allowed value list)
enum_validity = (
    COUNT(CASE WHEN column_value IN (allowed_values) THEN 1 END)
) / NULLIF(COUNT(*), 0)
```

### Calculation Example

| record_id | email | valid_format? | status | valid_enum? |
|---|---|---|---|---|
| R-001 | user@company.com | Yes | Active | Yes |
| R-002 | not-an-email | No | Active | Yes |
| R-003 | test@test.org | Yes | Paused | No (not in enum) |
| R-004 | a@b.co | Yes | Closed | Yes |

Format validity (`email`): 3/4 = 75.00%
Enum validity (`status`): 3/4 = 75.00%

### Validity Sub-Types

| Sub-Type | Description | Example |
|---|---|---|
| Format/syntactic | Conforms to expected pattern | Email matches RFC 5322 pattern |
| Range | Within numeric or date bounds | Temperature between -50 and 150 |
| Enumeration | Value is in an allowed set | Status in (Active, Inactive, Closed) |
| Type | Value is of the expected data type | Age is integer, not string |
| Length | Value meets min/max character length | Postal code is exactly 5 or 10 characters |
| Business rule | Value satisfies a domain-specific constraint | Discount % does not exceed 40% |

### Edge Cases

| Scenario | Treatment | Rationale |
|---|---|---|
| NULL values | Excluded from validity; counted under completeness | NULL is neither valid nor invalid — it is absent |
| Historical data with old enum values | Allow legacy values via version-aware enums | Standards evolve; old data may use deprecated values |
| Multi-format fields (e.g., international phone) | Apply locale-aware validation | One regex cannot cover all international formats |
| Free-text fields | Minimal validity (non-empty, within length) | Cannot apply strict format rules to free text |

### Measurement Frequency

| Data Tier (ISL-04) | Measurement Frequency | Retention |
|---|---|---|
| Critical (Tier 3-4) | Every pipeline run | 13 months |
| Standard (Tier 2) | Daily | 6 months |
| Informational (Tier 1) | Weekly | 3 months |

---

## D6: Uniqueness

### Formal Definition

**Uniqueness** measures the degree to which each real-world entity is represented exactly once within a dataset. A record is unique if no other record in the same dataset represents the same entity as determined by the defined uniqueness key(s). Uniqueness violations (duplicates) inflate counts, distort aggregations, and cause join fan-outs.

### Measurement Formula

```sql
-- Entity-level uniqueness
uniqueness_rate = (
    COUNT(DISTINCT uniqueness_key)
) / NULLIF(COUNT(*), 0)

-- Duplicate count
duplicate_records = COUNT(*) - COUNT(DISTINCT uniqueness_key)

-- Duplicate cluster analysis
SELECT uniqueness_key, COUNT(*) AS occurrence_count
FROM dataset
GROUP BY uniqueness_key
HAVING COUNT(*) > 1
ORDER BY occurrence_count DESC
```

### Calculation Example

| row_id | customer_id | first_name | last_name | unique? |
|---|---|---|---|---|
| 1 | C-1001 | Alice | Smith | Yes |
| 2 | C-1002 | Bob | Jones | Yes |
| 3 | C-1001 | Alice | Smith | No (duplicate of row 1) |
| 4 | C-1003 | Carol | Lee | Yes |
| 5 | C-1002 | Robert | Jones | No (duplicate of row 2, name variant) |

Uniqueness rate (by `customer_id`): 3/5 = 60.00%
Duplicate records: 2

### Uniqueness Sub-Types

| Sub-Type | Description | Detection Method |
|---|---|---|
| Exact duplicate | Identical values across all columns | Full-row hash comparison |
| Key duplicate | Same business key, potentially different attributes | Group by business key, count > 1 |
| Fuzzy duplicate | Near-identical records (typos, abbreviations) | Levenshtein distance, Soundex, Jaro-Winkler |
| Cross-source duplicate | Same entity loaded from multiple sources | Cross-system entity matching |
| Temporal duplicate | Same entity recorded multiple times for same period | Business key + effective date grouping |

### Edge Cases

| Scenario | Treatment | Rationale |
|---|---|---|
| Soft deletes creating apparent duplicates | Filter to active records before uniqueness check | Deleted records are not true duplicates |
| SCD Type 2 (multiple versions) | Uniqueness on business key + effective date range | Each version is intentionally distinct |
| Case differences in keys | Normalize case before comparison | "ABC" and "abc" are typically the same entity |
| Leading zeros in numeric keys | Normalize to consistent format | "001" and "1" are typically the same entity |
| NULL keys | Exclude from uniqueness; flag under completeness | NULL cannot be meaningfully compared |
| Composite keys | All key components must match to be a duplicate | Partial key matches are not duplicates |

### Measurement Frequency

| Data Tier (ISL-04) | Measurement Frequency | Retention |
|---|---|---|
| Critical (Tier 3-4) | Every pipeline run | 13 months |
| Standard (Tier 2) | Daily | 6 months |
| Informational (Tier 1) | Weekly | 3 months |

---

## Dimension Prioritization by Use Case

Different business contexts emphasize different quality dimensions. The following table provides default prioritization guidance that should be adapted to client needs.

| Use Case | Priority 1 | Priority 2 | Priority 3 | Rationale |
|---|---|---|---|---|
| Financial reporting | Accuracy | Completeness | Consistency | Regulatory accuracy requirements dominate |
| Real-time dashboards | Timeliness | Completeness | Accuracy | Stale data renders dashboards useless |
| Customer master data | Uniqueness | Accuracy | Completeness | Duplicates cause downstream fan-out |
| Regulatory compliance | Validity | Completeness | Accuracy | Format and value constraints are mandated |
| Production planning | Timeliness | Accuracy | Consistency | Decisions require current, correct data |
| Data science / ML | Completeness | Accuracy | Validity | Models require complete, accurate feature sets |
| IoT / telemetry | Timeliness | Completeness | Uniqueness | High-volume streaming prioritizes freshness |
| Master data management | Uniqueness | Consistency | Accuracy | Golden record deduplication is primary goal |

### Composite Quality Score

The composite quality score for a dataset is calculated as a weighted average of individual dimension scores:

```
Composite Score = (w1 * Completeness) + (w2 * Accuracy) + (w3 * Timeliness)
                + (w4 * Consistency) + (w5 * Validity) + (w6 * Uniqueness)

Where: w1 + w2 + w3 + w4 + w5 + w6 = 1.0
Default: w1 = w2 = w3 = w4 = w5 = w6 = 1/6 = 0.1667
```

Weights are configurable per domain and use case per the `weighting_model` adaptation parameter.

---

## Fabric / Azure Implementation Guidance

| Component | Recommended Service | Notes |
|---|---|---|
| Dimension calculation | PySpark notebooks in Fabric | Use DataFrame API for formula implementation |
| Results storage | Delta tables in Lakehouse | `dq_quality_scores` table per ISL-02 metadata standards |
| Historical trending | Delta table time travel | Retain history per measurement frequency table above |
| Alerting on threshold breach | Logic Apps or Power Automate | Trigger on quality score drops below SLA |
| Visualization | Power BI Direct Lake | Quality scorecard per ISL-06 Quality Scorecard Template |
| Scheduling | Fabric pipeline triggers | Align measurement frequency with pipeline schedules |

### PySpark Implementation Pattern

```python
from pyspark.sql import functions as F

def measure_completeness(df, column_name, null_equivalents=None):
    """Measure completeness for a single column per ISL-06 D1 definition."""
    if null_equivalents is None:
        null_equivalents = ['', 'N/A', 'NA', 'NULL', 'NONE', 'UNKNOWN', '-']

    total = df.count()
    incomplete = df.filter(
        F.col(column_name).isNull()
        | F.trim(F.col(column_name)).isin(null_equivalents)
        | (F.trim(F.col(column_name)) == '')
    ).count()

    return round((total - incomplete) / total, 4) if total > 0 else None
```

---

## Manufacturing Overlay [CONDITIONAL]

Manufacturing environments introduce domain-specific considerations for each dimension:

| Dimension | Manufacturing Consideration |
|---|---|
| Completeness | BOM structures must have all required component rows; partial BOMs fail completeness |
| Accuracy | Production quantities must reconcile with MES readings within tolerance |
| Timeliness | Shop floor IoT data must arrive within machine cycle time for real-time monitoring |
| Consistency | ERP planned quantity must match MES actual quantity within scheduling tolerance |
| Validity | Work order status transitions must follow defined state machine |
| Uniqueness | One production order per work order number; lot/serial numbers must be globally unique |

---

## Cross-References

| Reference | Module | Relationship |
|---|---|---|
| ISL-02 Metadata Standards | ISL-02 | Quality scores stored as metadata attributes |
| ISL-03 Naming Conventions | ISL-03 | Quality metric column and table naming |
| ISL-04 Data Classification | ISL-04 | Tier-based measurement frequency and thresholds |
| ISL-05 Medallion Architecture | ISL-05 | Quality gates at each medallion layer transition |
| Quality SLA Framework | ISL-06 | Threshold values per dimension per tier |
| Quality Rule Library | ISL-06 | Rule implementations organized by dimension |
| Quality Scorecard Template | ISL-06 | Composite scoring and visualization |

## Compliance Alignment

| Framework | Relevance |
|---|---|
| ISO 8000 | Data quality dimension definitions aligned with ISO 8000-8 |
| DAMA DMBOK | Dimensions map to DAMA data quality knowledge area |
| GDPR / CCPA | Accuracy and completeness support data subject rights |
| SOX | Financial data accuracy and completeness for internal controls |
| FDA 21 CFR Part 11 | Data integrity requirements for regulated manufacturing |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-01-15 | ISL Team | Initial release — six core dimensions defined |

# Quality Scorecard Template

> Module: ISL-06 | Version: 1.0 | Adaptation Effort: 2-3 hrs | Dependencies: ISL-02, ISL-04, ISL-06 Dimension Definitions, ISL-06 SLA Framework

## Purpose

This document defines the quality scorecard methodology for aggregating, weighting, and presenting data quality scores at multiple levels: enterprise, domain, dataset, and rule. It establishes RAG (Red/Amber/Green) status definitions, trend indicator calculations, drill-down structures, weighting methodologies, reporting templates, and executive summary formats. The scorecard provides a unified view of data quality health that supports both operational decision-making and strategic quality improvement.

## Scope

### In Scope

- Domain-level quality scoring methodology
- Enterprise-level aggregate scoring
- RAG status definitions with thresholds for each tier
- Trend indicators and calculation methods
- Drill-down structure from enterprise to rule level
- Dimension weighting methodology
- Reporting templates for operational and executive audiences
- Executive summary format and content

### Out of Scope

- Dimension definitions (see Quality Dimension Definitions)
- SLA threshold values (see Quality SLA Framework)
- Dashboard visual design and layout (see Quality Dashboard Specification Example)
- Monitoring infrastructure (see Quality Monitoring Standards)
- Rule-level implementations (see Quality Rule Library)

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default Value | Client Value | Notes |
|---|---|---|---|
| `scoring_scale` | 0-100% | | Percentage scale for quality scores |
| `default_weighting` | Equal (1/6 per dimension) | | Dimension weight model |
| `rag_thresholds_critical` | Green >= 99%, Amber >= 95%, Red < 95% | | RAG for Critical tier |
| `rag_thresholds_standard` | Green >= 95%, Amber >= 90%, Red < 90% | | RAG for Standard tier |
| `rag_thresholds_informational` | Green >= 90%, Amber >= 85%, Red < 85% | | RAG for Informational tier |
| `trend_window_days` | 30 | | Days for trend calculation |
| `domain_list` | Per ISL-04 classification | | Data domains for domain-level scoring |
| `executive_report_frequency` | Monthly | | Executive scorecard delivery |
| `minimum_rule_coverage` | 3 rules per dataset | | Minimum rules before scoring a dataset |
| `score_decimal_places` | 2 | | Display precision for scores |

---

## Scoring Hierarchy

### Four-Level Drill-Down Structure

```
Level 1: ENTERPRISE QUALITY SCORE
    │     Single composite score representing overall data quality health
    │
    ├──► Level 2: DOMAIN QUALITY SCORES
    │         │     One score per data domain (e.g., Sales, Manufacturing, Finance)
    │         │
    │         ├──► Level 3: DATASET QUALITY SCORES
    │         │         │     One score per dataset within the domain
    │         │         │
    │         │         └──► Level 4: RULE-LEVEL RESULTS
    │         │                       Individual pass/fail for each quality rule
    │         │
    │         └──► [Additional datasets...]
    │
    └──► [Additional domains...]
```

### Score Aggregation Flow

```
Rule Results (pass/fail per rule)
    │
    ▼ (aggregate by dimension)
Dimension Scores (per dataset)
    │
    ▼ (weighted average of dimensions)
Dataset Quality Score
    │
    ▼ (weighted average of datasets within domain)
Domain Quality Score
    │
    ▼ (weighted average of domains)
Enterprise Quality Score
```

---

## Level 4: Rule-Level Scoring

### Rule Score Calculation

Each quality rule produces a pass rate:

```
Rule Score = (records_passed / total_records_evaluated) * 100

For binary rules (pass/fail at dataset level):
    Rule Score = 100 if passed, 0 if failed
```

### Rule-to-Dimension Mapping

Rules are mapped to quality dimensions per the Quality Rule Library. A dimension score for a dataset is the average of all rule scores mapped to that dimension:

```
Dimension Score (dataset) = AVG(rule_scores for rules mapped to this dimension)
```

Example:

| Rule | Score | Dimension |
|---|---|---|
| QR-R01 (Null Check - customer_name) | 98.5% | Completeness |
| QR-R01 (Null Check - email) | 96.2% | Completeness |
| QR-A07 (Completeness Rate) | 97.8% | Completeness |
| **Completeness Dimension Score** | **97.5%** | (average of 98.5, 96.2, 97.8) |

---

## Level 3: Dataset Quality Score

### Dataset Score Calculation

```
Dataset Quality Score = SUM(dimension_score_i * dimension_weight_i) for i = 1 to 6

Where dimension weights sum to 1.0
```

### Dimension Weighting Models

| Model | Completeness | Accuracy | Timeliness | Consistency | Validity | Uniqueness | Use When |
|---|---|---|---|---|---|---|---|
| **Equal** (default) | 0.167 | 0.167 | 0.167 | 0.167 | 0.167 | 0.167 | No strong priority; general purpose |
| **Financial** | 0.15 | 0.25 | 0.15 | 0.20 | 0.15 | 0.10 | Financial reporting data |
| **Operational** | 0.20 | 0.15 | 0.25 | 0.15 | 0.15 | 0.10 | Real-time operational data |
| **Master Data** | 0.15 | 0.20 | 0.05 | 0.20 | 0.15 | 0.25 | Customer/product master data |
| **Regulatory** | 0.20 | 0.20 | 0.10 | 0.15 | 0.25 | 0.10 | Compliance-sensitive data |
| **IoT/Streaming** | 0.15 | 0.15 | 0.30 | 0.10 | 0.20 | 0.10 | High-volume streaming data |

### Dataset Score Example

| Dimension | Score | Weight (Equal) | Weighted Score |
|---|---|---|---|
| Completeness | 97.5% | 0.167 | 16.28% |
| Accuracy | 99.1% | 0.167 | 16.55% |
| Timeliness | 100.0% | 0.167 | 16.70% |
| Consistency | 98.3% | 0.167 | 16.42% |
| Validity | 99.7% | 0.167 | 16.65% |
| Uniqueness | 99.9% | 0.167 | 16.68% |
| **Dataset Score** | | | **99.28%** |

---

## Level 2: Domain Quality Score

### Domain Score Calculation

```
Domain Quality Score = SUM(dataset_score_j * dataset_weight_j) for j = 1 to N

Where N = number of datasets in the domain
```

### Dataset Weighting Within Domain

| Weighting Method | Description | Default |
|---|---|---|
| **Equal** | All datasets weighted equally | No |
| **Tier-based** (default) | Weight by ISL-04 data tier: Critical=3x, Standard=2x, Informational=1x | Yes |
| **Consumer-based** | Weight by number of downstream consumers | No |
| **Volume-based** | Weight by row count (proxy for business importance) | No |
| **Custom** | Client-defined weights per dataset | No |

### Tier-Based Weighting Example

| Dataset | Tier | Raw Score | Tier Weight | Weighted Contribution |
|---|---|---|---|---|
| Customer_Master | Critical (3-4) | 98.5% | 3 | 295.5 |
| Sales_Orders | Critical (3-4) | 97.2% | 3 | 291.6 |
| Sales_Returns | Standard (2) | 95.8% | 2 | 191.6 |
| Marketing_Campaigns | Informational (1) | 91.0% | 1 | 91.0 |
| **Domain Score** | | | **Sum weights: 9** | **869.7 / 9 = 96.63%** |

---

## Level 1: Enterprise Quality Score

### Enterprise Score Calculation

```
Enterprise Quality Score = SUM(domain_score_k * domain_weight_k) for k = 1 to M

Where M = number of data domains
```

### Domain Weighting

| Weighting Method | Description |
|---|---|
| **Equal** (default) | All domains weighted equally |
| **Business priority** | Client assigns weight based on business importance |
| **Dataset count** | Proportional to number of datasets per domain |
| **Composite** | Blend of business priority and dataset count |

---

## RAG Status Definitions

### RAG Thresholds by Data Tier

| Status | Color | Critical (Tier 3-4) | Standard (Tier 2) | Informational (Tier 1) |
|---|---|---|---|---|
| **Green** | Healthy | Score >= 99.0% | Score >= 95.0% | Score >= 90.0% |
| **Amber** | At Risk | 95.0% <= Score < 99.0% | 90.0% <= Score < 95.0% | 85.0% <= Score < 90.0% |
| **Red** | Critical | Score < 95.0% | Score < 90.0% | Score < 85.0% |

### RAG for Aggregate Scores (Domain and Enterprise)

Domain and enterprise scores use blended thresholds based on the predominant tier in the aggregation:

| Aggregate Level | Green | Amber | Red |
|---|---|---|---|
| Domain (majority Critical datasets) | >= 97% | >= 93% | < 93% |
| Domain (majority Standard datasets) | >= 95% | >= 90% | < 90% |
| Domain (majority Informational) | >= 90% | >= 85% | < 85% |
| Enterprise | >= 95% | >= 90% | < 90% |

### RAG Transition Rules

| Transition | Condition | Display |
|---|---|---|
| Green -> Amber | Score drops below Green threshold | Amber with downward arrow |
| Amber -> Red | Score drops below Amber threshold | Red with downward arrow |
| Red -> Amber | Score rises above Red threshold for 2 consecutive periods | Amber with upward arrow |
| Amber -> Green | Score rises above Amber threshold for 3 consecutive periods | Green with upward arrow |

Note: Upward transitions require sustained improvement (2-3 consecutive periods) to prevent status flapping.

---

## Trend Indicators

### Trend Calculation

```python
# 30-day rolling linear regression
slope = linear_regression_slope(daily_scores[-30:])

Trend Label:
  - "Improving" (up arrow):   slope > +0.001 AND p_value < 0.05
  - "Stable" (right arrow):   |slope| <= 0.001 OR p_value >= 0.05
  - "Degrading" (down arrow): slope < -0.001 AND p_value < 0.05
```

### Trend Display Conventions

| Indicator | Symbol | Color | Meaning |
|---|---|---|---|
| Strong improvement | Double up arrow | Dark green | Slope > +0.005, significant |
| Improving | Up arrow | Green | Slope > +0.001, significant |
| Stable | Right arrow | Gray | No significant trend |
| Degrading | Down arrow | Orange | Slope < -0.001, significant |
| Rapid degradation | Double down arrow | Red | Slope < -0.005, significant |

### Period-over-Period Comparison

| Comparison | Calculation | Display |
|---|---|---|
| Day-over-day | Today's score - yesterday's score | Delta with +/- sign |
| Week-over-week | This week's avg - prior week's avg | Delta with +/- sign |
| Month-over-month | This month's avg - prior month's avg | Delta with +/- sign |
| Quarter-over-quarter | This quarter's avg - prior quarter's avg | Delta with +/- sign |

---

## Reporting Templates

### Operational Scorecard (Daily)

| Section | Content |
|---|---|
| Header | Date, enterprise score, overall RAG status |
| Domain summary table | Domain name, score, RAG, trend, # breaches |
| Breach list | All active SLA breaches with severity |
| Top failing rules | Top 10 rules by failure count |
| Trend spark lines | 7-day mini trend per domain |

### Domain Scorecard (Weekly)

| Section | Content |
|---|---|
| Header | Domain name, period, domain score, RAG, trend |
| Dimension breakdown | Score per dimension with RAG and trend |
| Dataset heatmap | Datasets vs dimensions, color-coded cells |
| Week-over-week comparison | Deltas per dataset and dimension |
| Remediation status | Open items count and age |
| Top 5 issues | Highest-impact issues with status |

### Executive Scorecard (Monthly)

| Section | Content |
|---|---|
| Executive summary | 2-3 bullet points on quality health, key concerns, achievements |
| Enterprise score | Large KPI with RAG and trend |
| Domain comparison | Bar chart of domain scores with RAG coloring |
| Month-over-month trend | Line chart showing 6-month trend per domain |
| SLA compliance | % of datasets meeting SLA by tier |
| Top concerns | Top 3 quality risks with mitigation plans |
| Improvement trajectory | Progress against quarterly targets |
| Recommendations | 2-3 actionable recommendations for next period |

---

## Executive Summary Format

### Monthly Executive Summary Template

```
DATA QUALITY EXECUTIVE SUMMARY — {Month Year}

ENTERPRISE QUALITY SCORE: {score}% ({RAG}) | Trend: {trend_arrow}

KEY HIGHLIGHTS:
- {Positive highlight — e.g., "Manufacturing domain improved from 94.2% to 96.8%"}
- {Achievement — e.g., "Zero P1 incidents for the second consecutive month"}
- {Progress — e.g., "Rule coverage expanded to 87% of Critical-tier columns"}

KEY CONCERNS:
- {Concern — e.g., "Finance domain timeliness degraded due to SAP upgrade delays"}
- {Risk — e.g., "IoT data completeness trending downward (3-week declining trend)"}

SLA COMPLIANCE:
- Critical tier: {x}% of datasets meeting all SLAs ({delta} vs prior month)
- Standard tier: {x}% ({delta} vs prior month)
- Informational tier: {x}% ({delta} vs prior month)

ACTIONS:
- {Action 1 with owner and timeline}
- {Action 2 with owner and timeline}
- {Action 3 with owner and timeline}
```

---

## Score Storage Schema

### Quality Score Tables

```sql
-- Dataset-level scores (Level 3)
CREATE TABLE dq_dataset_scores (
    score_id            STRING,
    dataset_name        STRING,
    domain_name         STRING,
    data_tier           STRING,
    score_date          DATE,
    completeness_score  DECIMAL(6,4),
    accuracy_score      DECIMAL(6,4),
    timeliness_score    DECIMAL(6,4),
    consistency_score   DECIMAL(6,4),
    validity_score      DECIMAL(6,4),
    uniqueness_score    DECIMAL(6,4),
    composite_score     DECIMAL(6,4),
    weighting_model     STRING,
    rag_status          STRING,       -- 'Green', 'Amber', 'Red'
    trend_direction     STRING,       -- 'improving', 'stable', 'degrading'
    trend_slope         DECIMAL(8,6),
    rules_evaluated     INT,
    rules_passed        INT,
    rules_failed        INT,
    measurement_window  STRING,
    created_timestamp   TIMESTAMP
);

-- Domain-level scores (Level 2)
CREATE TABLE dq_domain_scores (
    score_id            STRING,
    domain_name         STRING,
    score_date          DATE,
    domain_score        DECIMAL(6,4),
    dataset_count       INT,
    datasets_green      INT,
    datasets_amber      INT,
    datasets_red        INT,
    rag_status          STRING,
    trend_direction     STRING,
    trend_slope         DECIMAL(8,6),
    created_timestamp   TIMESTAMP
);

-- Enterprise-level scores (Level 1)
CREATE TABLE dq_enterprise_scores (
    score_id            STRING,
    score_date          DATE,
    enterprise_score    DECIMAL(6,4),
    domain_count        INT,
    domains_green       INT,
    domains_amber       INT,
    domains_red         INT,
    sla_compliance_pct  DECIMAL(6,4),
    rag_status          STRING,
    trend_direction     STRING,
    created_timestamp   TIMESTAMP
);
```

---

## Fabric / Azure Implementation Guidance

| Component | Recommended Service | Notes |
|---|---|---|
| Score calculation | PySpark notebook | Triggered after quality rule execution |
| Score storage | Delta tables in Lakehouse | Tables per schema above |
| Scorecard dashboards | Power BI Direct Lake | Three-level dashboard hierarchy |
| Executive report | Power BI Paginated Report | Monthly PDF export |
| Email distribution | Power Automate | Scheduled distribution with embedded visuals |
| Score API | Fabric REST API / custom API | Expose scores to external systems |
| Historical analysis | Delta table time travel | Compare any two points in time |

---

## Manufacturing Overlay [CONDITIONAL]

| Scorecard Aspect | Manufacturing Adjustment |
|---|---|
| Additional domain | "Production" domain including WO, BOM, MES, IoT datasets |
| OEE integration | Quality dimension of OEE derived from quality scorecard |
| Shift-level scoring | Scores computed per production shift in addition to daily |
| Plant comparison | Multi-plant scorecards if client has multiple facilities |
| Supplier quality | Supplier data quality scores as a separate scorecard section |

---

## Cross-References

| Reference | Module | Relationship |
|---|---|---|
| Quality Dimension Definitions | ISL-06 | Dimension definitions underlying each score |
| Quality SLA Framework | ISL-06 | SLA thresholds that drive RAG status |
| Quality Rule Library | ISL-06 | Rules that generate the underlying data for scores |
| Quality Monitoring Standards | ISL-06 | Monitoring feeds score calculation triggers |
| Quality Dashboard Spec Example | ISL-06 | Power BI implementation of this scorecard |
| ISL-02 Metadata Standards | ISL-02 | Score metadata attributes |
| ISL-04 Data Classification | ISL-04 | Tier classification drives RAG thresholds and weighting |

## Compliance Alignment

| Framework | Relevance |
|---|---|
| ISO 8000 | Quality scorecards support data quality performance measurement |
| DAMA DMBOK | Data quality measurement and reporting framework |
| SOX | Quality scorecards for financial data support control monitoring |
| ITIL v4 | Service level reporting aligned with ITIL practices |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-01-15 | ISL Team | Initial release — four-level scorecard with RAG and trend support |

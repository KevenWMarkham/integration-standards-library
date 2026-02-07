# Quality Dashboard Specification Example

> Module: ISL-06 | Version: 1.0 | Type: Example

## Purpose

This document provides a fully worked Power BI dashboard specification for enterprise data quality monitoring. It includes page layouts, DAX measures, visual specifications, filter configurations, drill-through paths, RAG indicators, trend charts, and a sample data model for quality metrics. This specification implements the three-level dashboard hierarchy defined in ISL-06 Quality Monitoring Standards and the scoring methodology from ISL-06 Quality Scorecard Template.

## Data Model

### Star Schema for Quality Metrics

```
                    ┌─────────────────┐
                    │  dim_date        │
                    │  - date_key (PK) │
                    │  - full_date     │
                    │  - year          │
                    │  - quarter       │
                    │  - month         │
                    │  - week_number   │
                    │  - day_name      │
                    │  - is_business_day│
                    └────────┬────────┘
                             │
┌─────────────────┐  ┌──────┴──────────────┐  ┌─────────────────┐
│  dim_domain      │  │  fact_quality_scores │  │  dim_dataset     │
│  - domain_key    │──│  - date_key (FK)     │──│  - dataset_key   │
│  - domain_name   │  │  - domain_key (FK)   │  │  - dataset_name  │
│  - domain_owner  │  │  - dataset_key (FK)  │  │  - schema_name   │
│  - is_active     │  │  - dimension_key(FK) │  │  - data_tier     │
└─────────────────┘  │  - score             │  │  - refresh_freq  │
                     │  - threshold          │  │  - owner         │
                     │  - rag_status         │  │  - is_active     │
                     │  - trend_direction    │  └─────────────────┘
                     │  - rules_evaluated    │
                     │  - rules_passed       │  ┌─────────────────┐
                     │  - rules_failed       │  │  dim_dimension   │
                     └──────┬───────────────┘──│  - dimension_key │
                            │                   │  - dimension_name│
                     ┌──────┴──────────────┐   │  - display_order │
                     │  fact_rule_results   │   └─────────────────┘
                     │  - run_id            │
                     │  - date_key (FK)     │  ┌─────────────────┐
                     │  - dataset_key (FK)  │  │  dim_rule        │
                     │  - rule_key (FK)     │──│  - rule_key      │
                     │  - score             │  │  - rule_id       │
                     │  - threshold         │  │  - rule_name     │
                     │  - passed            │  │  - category      │
                     │  - severity          │  │  - severity      │
                     │  - details           │  │  - dimension_name│
                     └─────────────────────┘  └─────────────────┘

                     ┌─────────────────────┐
                     │  fact_sla_compliance │
                     │  - date_key (FK)     │
                     │  - dataset_key (FK)  │
                     │  - dimension_key(FK) │
                     │  - score             │
                     │  - sla_threshold     │
                     │  - sla_met           │
                     └─────────────────────┘

                     ┌─────────────────────┐
                     │  fact_alerts         │
                     │  - alert_id          │
                     │  - date_key (FK)     │
                     │  - dataset_key (FK)  │
                     │  - alert_level       │
                     │  - acknowledged      │
                     │  - resolved          │
                     │  - resolution_time   │
                     └─────────────────────┘
```

### Direct Lake Connection

```
Source: Fabric Lakehouse -> quality_lakehouse
Connection Mode: Direct Lake
Refresh: Automatic (on data change)
Tables loaded:
  - dq_scores -> fact_quality_scores
  - dq_rule_results -> fact_rule_results
  - dq_sla_compliance -> fact_sla_compliance
  - dq_alerts -> fact_alerts
  - dim_date (computed table)
  - dim_domain, dim_dataset, dim_dimension, dim_rule (dimension tables)
```

---

## DAX Measures

### Core Scoring Measures

```dax
// Enterprise Quality Score
Enterprise Quality Score =
VAR DomainScores =
    SUMMARIZE(
        fact_quality_scores,
        dim_domain[domain_name],
        "DomainScore", AVERAGE(fact_quality_scores[score])
    )
RETURN
    AVERAGEX(DomainScores, [DomainScore])

// Dataset Composite Score
Dataset Composite Score =
AVERAGEX(
    VALUES(dim_dimension[dimension_name]),
    CALCULATE(AVERAGE(fact_quality_scores[score]))
)

// Dimension Score
Dimension Score =
AVERAGE(fact_quality_scores[score])

// SLA Compliance Rate
SLA Compliance Rate =
DIVIDE(
    COUNTROWS(FILTER(fact_sla_compliance, fact_sla_compliance[sla_met] = TRUE())),
    COUNTROWS(fact_sla_compliance),
    0
)

// Rule Pass Rate
Rule Pass Rate =
DIVIDE(
    COUNTROWS(FILTER(fact_rule_results, fact_rule_results[passed] = TRUE())),
    COUNTROWS(fact_rule_results),
    0
)
```

### RAG Status Measures

```dax
// RAG Status (returns "Green", "Amber", or "Red")
RAG Status =
VAR CurrentScore = [Dataset Composite Score]
VAR Tier = SELECTEDVALUE(dim_dataset[data_tier])
RETURN
    SWITCH(
        TRUE(),
        // Critical tier
        Tier = "critical" && CurrentScore >= 0.99, "Green",
        Tier = "critical" && CurrentScore >= 0.95, "Amber",
        Tier = "critical", "Red",
        // Standard tier
        Tier = "standard" && CurrentScore >= 0.95, "Green",
        Tier = "standard" && CurrentScore >= 0.90, "Amber",
        Tier = "standard", "Red",
        // Informational tier
        Tier = "informational" && CurrentScore >= 0.90, "Green",
        Tier = "informational" && CurrentScore >= 0.85, "Amber",
        Tier = "informational", "Red",
        // Default
        "Gray"
    )

// RAG Color Code (for conditional formatting)
RAG Color =
SWITCH(
    [RAG Status],
    "Green", "#28A745",
    "Amber", "#FFC107",
    "Red", "#DC3545",
    "#6C757D"
)

// RAG Icon (Unicode)
RAG Icon =
SWITCH(
    [RAG Status],
    "Green", UNICHAR(9679),    // filled circle
    "Amber", UNICHAR(9651),    // triangle
    "Red", UNICHAR(9632),      // filled square
    UNICHAR(9675)              // empty circle
)
```

### Trend Measures

```dax
// Week-over-Week Change
WoW Change =
VAR CurrentWeek = [Dimension Score]
VAR PriorWeek =
    CALCULATE(
        [Dimension Score],
        DATEADD(dim_date[full_date], -7, DAY)
    )
RETURN
    CurrentWeek - PriorWeek

// Month-over-Month Change
MoM Change =
VAR CurrentMonth = [Dimension Score]
VAR PriorMonth =
    CALCULATE(
        [Dimension Score],
        DATEADD(dim_date[full_date], -1, MONTH)
    )
RETURN
    CurrentMonth - PriorMonth

// 30-Day Trend Direction
Trend Direction =
VAR Last30Days =
    FILTER(
        ALL(dim_date),
        dim_date[full_date] >= TODAY() - 30 &&
        dim_date[full_date] <= TODAY()
    )
VAR ScoreTable =
    ADDCOLUMNS(
        Last30Days,
        "DayIndex", DATEDIFF(MIN(dim_date[full_date]), dim_date[full_date], DAY),
        "DayScore", CALCULATE([Dimension Score])
    )
VAR AvgX = AVERAGEX(ScoreTable, [DayIndex])
VAR AvgY = AVERAGEX(ScoreTable, [DayScore])
VAR Slope =
    DIVIDE(
        SUMX(ScoreTable, ([DayIndex] - AvgX) * ([DayScore] - AvgY)),
        SUMX(ScoreTable, ([DayIndex] - AvgX) ^ 2)
    )
RETURN
    SWITCH(
        TRUE(),
        Slope > 0.001, "Improving",
        Slope < -0.001, "Degrading",
        "Stable"
    )

// Trend Arrow Unicode
Trend Arrow =
SWITCH(
    [Trend Direction],
    "Improving", UNICHAR(9650),     // up triangle
    "Degrading", UNICHAR(9660),     // down triangle
    "Stable", UNICHAR(9654),        // right triangle
    ""
)
```

### Operational Measures

```dax
// Active Breaches Count
Active Breaches =
COUNTROWS(
    FILTER(
        fact_sla_compliance,
        fact_sla_compliance[sla_met] = FALSE() &&
        fact_sla_compliance[compliance_date] = TODAY()
    )
)

// Mean Time to Resolve (hours)
MTTR Hours =
AVERAGEX(
    FILTER(fact_alerts, fact_alerts[resolved] = TRUE()),
    DATEDIFF(
        fact_alerts[alert_timestamp],
        fact_alerts[resolution_timestamp],
        HOUR
    )
)

// Failing Rules Count
Failing Rules Count =
CALCULATE(
    DISTINCTCOUNT(fact_rule_results[rule_key]),
    fact_rule_results[passed] = FALSE()
)

// Critical Failures
Critical Failures =
CALCULATE(
    COUNTROWS(fact_rule_results),
    fact_rule_results[passed] = FALSE(),
    fact_rule_results[severity] = "Critical"
)
```

---

## Page Specifications

### Page 1: Executive Overview (Level 1)

| Visual | Type | Position | Size | Data |
|---|---|---|---|---|
| Enterprise Score KPI | Card | Top left | 200x120 | `[Enterprise Quality Score]` formatted as % |
| RAG Indicator | Shape (circle) | Next to KPI | 40x40 | Conditional fill: `[RAG Color]` |
| Trend Arrow | Card | Next to RAG | 60x40 | `[Trend Arrow]` + `[Trend Direction]` |
| Domain Comparison | Clustered bar chart | Center | 500x300 | Axis: domain_name, Values: `[Dimension Score]`, Color: `[RAG Color]` |
| 30-Day Trend Line | Line chart | Right | 400x300 | Axis: full_date, Values: `[Enterprise Quality Score]`, with forecast line |
| SLA Compliance | Donut chart | Bottom left | 200x200 | Values: `[SLA Compliance Rate]` vs non-compliance |
| Active Incidents | Card | Bottom center | 150x80 | `[Active Breaches]` with conditional red if > 0 |
| Top 5 Issues | Table | Bottom right | 400x200 | Dataset, Dimension, Score, Severity, Trend |

**Filters**: Date range (default: last 30 days), Data tier (all)

### Page 2: Domain Detail (Level 2)

| Visual | Type | Position | Size | Data |
|---|---|---|---|---|
| Domain Selector | Slicer (dropdown) | Top | 300x40 | dim_domain[domain_name] |
| Domain Score KPI | Card | Top right | 200x120 | `[Dataset Composite Score]` for selected domain |
| Dataset x Dimension Heatmap | Matrix | Center | 600x350 | Rows: dataset_name, Columns: dimension_name, Values: `[Dimension Score]`, Background: `[RAG Color]` |
| Dimension Trend | Small multiples line chart | Right | 400x350 | One line chart per dimension, 30-day trend |
| Top Failing Rules | Table | Bottom left | 400x200 | Rule ID, Rule Name, Dataset, Score, Severity |
| SLA Status by Dataset | Table | Bottom right | 400x200 | Dataset, Tier, Each dimension score with RAG indicator |

**Filters**: Domain (from slicer), Date range, Data tier
**Drill-through**: Click dataset name to go to Page 3

### Page 3: Dataset Detail (Level 3)

| Visual | Type | Position | Size | Data |
|---|---|---|---|---|
| Dataset Name Header | Card | Top | 400x40 | Selected dataset name + tier badge |
| Dimension Gauges | Gauge (6 gauges) | Top row | 6 x (130x130) | One gauge per dimension: value, min (0), max (1), target (SLA threshold) |
| Rule Results Table | Table | Center | 700x250 | Rule ID, Name, Category, Score, Threshold, Passed, Severity |
| Score History | Line chart | Bottom left | 400x200 | 30-day score history per dimension |
| Failed Record Samples | Table | Bottom right | 400x200 | Top 20 failed records (from fact_failed_records if available) |

**Filters**: Dataset (from drill-through), Date range
**Drill-through source**: Page 2 dataset name
**Back button**: Returns to Page 2

### Page 4: Trend Analysis

| Visual | Type | Position | Size | Data |
|---|---|---|---|---|
| Date Range Selector | Slicer | Top | 300x40 | Date range (default: 90 days) |
| Enterprise Trend | Line chart | Top half | 700x250 | X: full_date, Y: `[Enterprise Quality Score]`, with trendline |
| Domain Trends | Line chart (multi-line) | Bottom left | 400x250 | X: full_date, Y: `[Dimension Score]`, Legend: domain_name |
| MoM Comparison | Clustered column chart | Bottom right | 350x250 | Current month vs prior month by domain |

### Page 5: SLA Compliance

| Visual | Type | Position | Size | Data |
|---|---|---|---|---|
| Compliance Summary | Multi-row card | Top | 600x100 | Critical compliance %, Standard compliance %, Informational compliance % |
| Compliance by Domain | Stacked bar chart | Center left | 400x300 | Domain by compliance status (Met / Breached) |
| Breach Timeline | Scatter chart | Center right | 400x300 | X: date, Y: score, Size: severity, Color: dimension |
| Active Exceptions | Table | Bottom | 700x150 | Dataset, Dimension, Normal SLA, Exception SLA, Start, End, Reason |

---

## Conditional Formatting Rules

### Score-Based Formatting

| Element | Condition | Format |
|---|---|---|
| Score values | >= Green threshold (tier-specific) | Green background (#28A745), white text |
| Score values | >= Amber threshold, < Green threshold | Amber background (#FFC107), black text |
| Score values | < Amber threshold | Red background (#DC3545), white text |
| Trend arrows | Improving | Green text (#28A745) |
| Trend arrows | Stable | Gray text (#6C757D) |
| Trend arrows | Degrading | Red text (#DC3545) |
| Severity badges | Critical | Red badge |
| Severity badges | Major | Orange badge |
| Severity badges | Minor | Yellow badge |

### Data Bar Formatting

| Column | Color | Direction |
|---|---|---|
| Quality scores | Gradient: Red (0%) to Green (100%) | Left to right |
| SLA compliance | Green for met, Red for breached | Left to right |
| Rule pass rate | Gradient: Red to Green | Left to right |

---

## Filter Configuration

### Global Filters (All Pages)

| Filter | Type | Default | Visible |
|---|---|---|---|
| Date range | Between | Last 30 days | Yes |
| Data tier | Multi-select | All tiers | Yes |
| Domain | Multi-select | All domains | Yes (synced with domain slicer) |
| Is Active | Single value | TRUE | Hidden |

### Page-Specific Filters

| Page | Filter | Type | Behavior |
|---|---|---|---|
| Page 2 | Domain | Single-select slicer | Controls all visuals on page |
| Page 3 | Dataset | Drill-through parameter | Set by drill-through from Page 2 |
| Page 4 | Date range | Extended range slicer | Default 90 days (override global) |
| Page 5 | Compliance status | Multi-select | Met / Breached / Warning |

---

## Drill-Through Paths

```
Page 1 (Executive)
    │
    ├──► Click domain bar ──► Page 2 (Domain Detail) for selected domain
    │
    └──► Click "Active Incidents" ──► Page 5 (SLA Compliance) filtered to breaches

Page 2 (Domain Detail)
    │
    ├──► Click dataset in heatmap ──► Page 3 (Dataset Detail) for selected dataset
    │
    └──► Click failing rule ──► Page 3 filtered to that rule's dataset

Page 3 (Dataset Detail)
    │
    └──► Back button ──► Page 2 (returns to domain context)

All Pages
    │
    └──► Click date range ──► Page 4 (Trend Analysis) with selected date context
```

---

## Report Distribution

| Audience | Format | Schedule | Method |
|---|---|---|---|
| Data Engineers | Live dashboard (app) | Real-time | Power BI App workspace |
| Data Stewards | Live dashboard + email | Daily digest at 07:00 UTC | Power BI subscription |
| Domain Leads | PDF snapshot of Page 2 | Weekly (Monday 08:00 UTC) | Power BI subscription |
| Executives | PDF snapshot of Page 1 | Monthly (3rd business day) | Power Automate email |
| Governance Council | Paginated report (all pages) | Quarterly | Power BI paginated export |

---

## Cross-References

| Reference | Module | Relationship |
|---|---|---|
| Quality Monitoring Standards | ISL-06 | Three-level dashboard hierarchy specification |
| Quality Scorecard Template | ISL-06 | Scoring methodology implemented in DAX |
| Quality SLA Framework | ISL-06 | RAG thresholds and SLA compliance logic |
| Fabric Quality Implementation | ISL-06 | Delta tables that feed the data model |
| ISL-04 Data Classification | ISL-04 | Tier-based filtering and RAG threshold selection |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-01-15 | ISL Team | Initial release — five-page Power BI dashboard specification |

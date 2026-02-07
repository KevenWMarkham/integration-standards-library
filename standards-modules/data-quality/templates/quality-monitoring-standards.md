# Quality Monitoring Standards

> Module: ISL-06 | Version: 1.0 | Adaptation Effort: 3-5 hrs | Dependencies: ISL-02, ISL-04, ISL-05, ISL-06 SLA Framework

## Purpose

This document defines the standards for continuous data quality monitoring, including dashboard requirements at executive, domain, and detail levels, KPI definitions, alerting thresholds and routing, trend analysis methods, regression detection, automated reporting cadence, monitoring infrastructure architecture, and integration with incident management. These standards ensure quality degradation is detected rapidly, communicated effectively, and routed to the correct resolution team.

## Scope

### In Scope

- Dashboard architecture and requirements (three-level hierarchy)
- Quality KPI definitions and calculation methods
- Alerting thresholds, channels, and routing logic
- Trend analysis and regression detection algorithms
- Automated reporting cadence and distribution
- Monitoring infrastructure architecture
- Integration with incident management systems

### Out of Scope

- Dimension definitions (see Quality Dimension Definitions)
- SLA threshold values (see Quality SLA Framework)
- Specific rule implementations (see Quality Rule Library)
- Remediation procedures (see Remediation Workflow)
- Power BI dashboard visual design (see Quality Dashboard Specification Example)

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default Value | Client Value | Notes |
|---|---|---|---|
| `dashboard_platform` | Power BI (Direct Lake) | | Reporting / BI platform |
| `alerting_platform` | Logic Apps + Teams | | Alert routing mechanism |
| `incident_management` | ServiceNow | | ITSM tool for incident tickets |
| `monitoring_retention_months` | 13 | | Months of monitoring data retained |
| `executive_dashboard_refresh` | 15 minutes | | Refresh rate for executive dashboard |
| `domain_dashboard_refresh` | 5 minutes | | Refresh rate for domain dashboard |
| `detail_dashboard_refresh` | Near real-time (1 min) | | Refresh rate for detail dashboard |
| `anomaly_detection_method` | Z-score (sigma = 3) | | Statistical method for anomaly detection |
| `trend_window_days` | 30 | | Rolling window for trend calculation |
| `alert_suppression_minutes` | 60 | | Suppress duplicate alerts within window |

---

## Dashboard Architecture

### Three-Level Dashboard Hierarchy

```
┌─────────────────────────────────────────────────────┐
│  Level 1: EXECUTIVE DASHBOARD                       │
│  Audience: C-suite, Data Governance Council          │
│  Focus: Enterprise-wide quality health               │
│  Refresh: 15 minutes                                 │
│  Key content: Composite scores, RAG status, trends   │
├─────────────────────────────────────────────────────┤
│  Level 2: DOMAIN DASHBOARD                          │
│  Audience: Domain Leads, Data Stewards               │
│  Focus: Domain-specific quality metrics              │
│  Refresh: 5 minutes                                  │
│  Key content: Per-dataset scores, SLA compliance,    │
│               top failing rules, exception status     │
├─────────────────────────────────────────────────────┤
│  Level 3: DETAIL DASHBOARD                          │
│  Audience: Data Engineers, Quality Analysts           │
│  Focus: Rule-level results, record-level failures    │
│  Refresh: Near real-time (1 minute)                  │
│  Key content: Rule pass/fail details, sample failed   │
│               records, root cause indicators          │
└─────────────────────────────────────────────────────┘
```

### Level 1: Executive Dashboard Requirements

| Component | Specification |
|---|---|
| Enterprise Quality Score | Single composite score (0-100%) with RAG indicator |
| Domain Comparison | Horizontal bar chart comparing domain scores |
| Trend Line | 30-day rolling quality score trend by domain |
| SLA Compliance Rate | % of datasets meeting SLA, by tier |
| Top 5 Issues | Highest-impact quality issues across the enterprise |
| Improvement Trajectory | Quarter-over-quarter improvement chart |
| Active Incidents | Count of open P1/P2 quality incidents |
| Exception Count | Number of active SLA exceptions |

### Level 2: Domain Dashboard Requirements

| Component | Specification |
|---|---|
| Domain Quality Score | Composite score for the selected domain |
| Dataset Heatmap | Matrix of datasets vs dimensions, color-coded by score |
| SLA Compliance Detail | Per-dataset, per-dimension SLA status (met/warning/breach) |
| Top Failing Rules | Top 10 rules by failure count within the domain |
| Trend by Dimension | 30-day trend line per dimension for the domain |
| Remediation Status | Open remediation items with status and SLA countdown |
| Exception List | Active exceptions for datasets in this domain |
| Freshness Monitor | Time since last successful data load per dataset |

### Level 3: Detail Dashboard Requirements

| Component | Specification |
|---|---|
| Rule Execution Results | Pass/fail/error status for each rule, each run |
| Failed Record Samples | Up to 100 sample records that failed each rule |
| Rule Execution Timeline | Gantt chart of rule execution times |
| Error Distribution | Breakdown of failures by error type/category |
| Column-Level Profile | Basic statistics (null %, distinct count, min, max) per column |
| Historical Comparison | Side-by-side current vs prior period metrics |
| Root Cause Indicators | Automated classification of likely failure causes |
| Data Lineage Context | Upstream/downstream impact of quality failures |

---

## KPI Definitions

### Primary Quality KPIs

| KPI | Definition | Formula | Target |
|---|---|---|---|
| Enterprise Quality Score (EQS) | Weighted average of all domain quality scores | `SUM(domain_score * domain_weight) / SUM(domain_weight)` | >= 95% |
| Domain Quality Score (DQS) | Weighted average of dataset scores within a domain | `SUM(dataset_score * dataset_weight) / SUM(dataset_weight)` | Varies by tier |
| Dataset Quality Score | Weighted average of dimension scores for a dataset | `SUM(dimension_score * dimension_weight) / SUM(dimension_weight)` | Per SLA Framework |
| SLA Compliance Rate | % of measurement periods where SLA is met | `COUNT(periods_met) / COUNT(total_periods)` | >= 95% |
| Rule Pass Rate | % of records passing all applicable quality rules | `COUNT(passed) / COUNT(evaluated)` | >= 98% |

### Operational Quality KPIs

| KPI | Definition | Formula | Target |
|---|---|---|---|
| Mean Time to Detect (MTTD) | Average time from quality degradation to alert | `AVG(alert_time - degradation_start_time)` | < 15 min (Critical) |
| Mean Time to Resolve (MTTR) | Average time from alert to quality restoration | `AVG(resolution_time - alert_time)` | < 4 hrs (Critical) |
| Recurring Issue Rate | % of issues that repeat within 30 days | `COUNT(recurring) / COUNT(total_issues)` | < 10% |
| False Positive Rate | % of alerts that are not actual quality issues | `COUNT(false_positives) / COUNT(total_alerts)` | < 5% |
| Rule Coverage | % of Critical-tier columns with at least one quality rule | `COUNT(covered_columns) / COUNT(total_critical_columns)` | 100% |
| Remediation Backlog | Count of open quality issues older than SLA | Direct count | 0 |
| Exception Utilization | % of datasets with active SLA exceptions | `COUNT(excepted_datasets) / COUNT(total_datasets)` | < 5% |

### Trend KPIs

| KPI | Definition | Calculation Period |
|---|---|---|
| Quality Trend Direction | Slope of the regression line for quality scores | 30-day rolling window |
| Week-over-Week Delta | Change in quality score vs prior week | 7-day comparison |
| Month-over-Month Delta | Change in quality score vs prior month | 30-day comparison |
| Improvement Velocity | Rate of quality improvement per quarter | 90-day regression slope |

---

## Alerting Standards

### Alert Severity Levels

| Level | Trigger Condition | Notification | Response SLA |
|---|---|---|---|
| INFO | Score within normal range but showing declining trend | Dashboard update only | No response required |
| WARNING | Score drops below warning threshold (per SLA Framework) | Teams channel + email | Per SLA Framework L1 |
| CRITICAL | Score drops below SLA target | Teams + email + PagerDuty (Critical tier) | Per SLA Framework L2 |
| INCIDENT | Score drops below severe degradation threshold | All channels + auto-ticket | Per SLA Framework L3 |

### Alert Routing Logic

```
IF data_tier = 'Critical' AND alert_level >= 'CRITICAL':
    route_to: PagerDuty on-call + Teams #dq-critical + domain_lead_email
    create_incident: YES (ServiceNow, Priority P1)

ELIF data_tier = 'Critical' AND alert_level = 'WARNING':
    route_to: Teams #dq-warnings + data_steward_email
    create_incident: NO

ELIF data_tier = 'Standard' AND alert_level >= 'CRITICAL':
    route_to: Teams #dq-critical + domain_lead_email
    create_incident: YES (ServiceNow, Priority P2)

ELIF data_tier = 'Standard' AND alert_level = 'WARNING':
    route_to: Teams #dq-warnings
    create_incident: NO

ELIF data_tier = 'Informational' AND alert_level >= 'CRITICAL':
    route_to: Teams #dq-warnings + data_steward_email
    create_incident: YES (ServiceNow, Priority P3)

ELSE:
    route_to: Teams #dq-info (log only)
    create_incident: NO
```

### Alert Suppression Rules

| Rule | Description |
|---|---|
| Duplicate suppression | Suppress identical alerts within `alert_suppression_minutes` window |
| Maintenance window suppression | Suppress all alerts during planned maintenance windows |
| Exception suppression | Suppress breach alerts for datasets with active SLA exceptions |
| Cascade suppression | If upstream pipeline fails, suppress downstream quality alerts |
| Flapping suppression | If score oscillates above/below threshold 3+ times in 1 hour, consolidate to single alert |

---

## Trend Analysis and Regression Detection

### Trend Analysis Method

Quality trends are calculated using a rolling window linear regression on daily quality scores.

```python
# Trend calculation (PySpark pseudocode)
from scipy import stats

def calculate_trend(daily_scores, window_days=30):
    """
    Returns: slope (positive = improving, negative = degrading)
             p_value (statistical significance)
             trend_label ('improving', 'stable', 'degrading')
    """
    x = range(len(daily_scores))  # day index
    y = daily_scores               # quality scores

    slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)

    if p_value > 0.05:
        return slope, p_value, 'stable'  # not statistically significant
    elif slope > 0.001:
        return slope, p_value, 'improving'
    elif slope < -0.001:
        return slope, p_value, 'degrading'
    else:
        return slope, p_value, 'stable'
```

### Trend Classification

| Trend Label | Criteria | Dashboard Indicator |
|---|---|---|
| Improving | Slope > +0.001 and p-value < 0.05 | Green up arrow |
| Stable | Slope between -0.001 and +0.001, or p-value >= 0.05 | Gray horizontal arrow |
| Degrading | Slope < -0.001 and p-value < 0.05 | Red down arrow |

### Regression Detection

A **regression** is a statistically significant, sudden drop in quality score. Regressions are detected using the following algorithm:

```
1. Calculate the mean and standard deviation of scores over the prior 30-day window
2. For each new score:
   a. Calculate Z-score = (new_score - mean) / std_dev
   b. If Z-score < -3.0: flag as REGRESSION
   c. If Z-score < -2.0: flag as ANOMALY (warning)
   d. Otherwise: NORMAL
3. On REGRESSION detection:
   a. Generate CRITICAL alert
   b. Identify recent pipeline changes (last 48 hours)
   c. Compare data profile (row count, null %, distinct counts) to prior run
   d. Auto-populate root cause analysis template
```

### Regression Alert Content

| Field | Description |
|---|---|
| Dataset | Affected dataset name |
| Dimension | Quality dimension where regression detected |
| Prior mean | 30-day average score before regression |
| Current score | Score that triggered the regression |
| Z-score | Standard deviations below the mean |
| Likely cause | Auto-detected: schema change, volume spike, upstream failure, unknown |
| Recent changes | Pipeline deployments in last 48 hours |
| Impact assessment | Downstream datasets and consumers affected |

---

## Automated Reporting

### Report Inventory

| Report | Frequency | Delivery | Audience | Format |
|---|---|---|---|---|
| Quality Pulse | Every pipeline run | Dashboard update | Data Engineers | Live dashboard |
| Daily Quality Digest | Daily (07:00 UTC) | Email + Teams | Stewards, Engineers | HTML email |
| Weekly Quality Summary | Monday (08:00 UTC) | Email + Teams | Domain Leads | PDF attachment |
| Monthly Quality Report | 3rd business day | Email + Teams | Executives | Paginated report |
| Quarterly Review Package | T-14 before review | Email | Governance Council | Slide deck + data |
| Ad-hoc Breach Report | On breach | Teams + Email | Per routing logic | Adaptive card |

### Daily Quality Digest Content

| Section | Content |
|---|---|
| Summary banner | Enterprise quality score, trend arrow, # breaches in last 24 hours |
| Breach table | All SLA breaches: dataset, dimension, score, SLA target, delta |
| Warnings table | All warnings: dataset, dimension, current score, warning threshold |
| Top 5 failing rules | Rules with highest failure counts |
| Remediation status | Open items with countdown timer |
| Tomorrow's risk | Datasets with degrading trends approaching SLA threshold |

### Monthly Quality Report Content

| Section | Content |
|---|---|
| Executive summary | 2-3 sentence overview of quality health |
| Enterprise scorecard | All domains, all dimensions, RAG status |
| Month-over-month comparison | Score deltas with variance explanation |
| SLA compliance | % compliance by domain and tier |
| Top issues | Top 10 quality issues with root cause and remediation status |
| Improvement actions | Progress on continuous improvement initiatives |
| Recommendations | Proposed actions for next month |

---

## Monitoring Infrastructure Architecture

### Architecture Diagram

```
┌──────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│  Source Systems   │────►│  Fabric Pipelines   │────►│  Lakehouse       │
│  (ERP, MES, IoT) │     │  (Ingestion)        │     │  (Bronze/Silver) │
└──────────────────┘     └─────────────────────┘     └────────┬─────────┘
                                                              │
                                                              ▼
                                                    ┌─────────────────────┐
                                                    │  Quality Engine     │
                                                    │  (PySpark Notebook) │
                                                    │  - Rule evaluation  │
                                                    │  - Score calculation│
                                                    │  - Trend analysis   │
                                                    └────────┬────────────┘
                                                              │
                         ┌────────────────────────────────────┼───────────────┐
                         │                                    │               │
                         ▼                                    ▼               ▼
              ┌─────────────────────┐           ┌──────────────────┐ ┌──────────────┐
              │  Quality Results    │           │  Alert Engine    │ │  Power BI    │
              │  (Delta Tables)     │           │  (Logic Apps)    │ │  (Dashboard) │
              │  - dq_rule_results  │           │  - Route alerts  │ │  - Executive │
              │  - dq_scores        │           │  - Suppress dups │ │  - Domain    │
              │  - dq_sla_history   │           │  - Create tickets│ │  - Detail    │
              └─────────────────────┘           └──────────────────┘ └──────────────┘
                                                        │
                                                        ▼
                                                ┌──────────────────┐
                                                │  ServiceNow      │
                                                │  (Incidents)     │
                                                └──────────────────┘
```

### Quality Results Data Model

| Table | Purpose | Retention |
|---|---|---|
| `dq_rule_results` | Per-rule, per-run pass/fail results | 13 months |
| `dq_failed_records` | Sample failed records (max 1000 per rule per run) | 3 months |
| `dq_scores` | Per-dataset, per-dimension quality scores | 13 months |
| `dq_sla_compliance` | Daily SLA compliance status per dataset | 13 months |
| `dq_alerts` | Alert history with acknowledgment and resolution | 13 months |
| `dq_trends` | Pre-computed trend metrics (slope, direction) | 13 months |
| `dq_sla_thresholds` | Active and historical SLA thresholds | Indefinite |
| `dq_exceptions` | Active and historical SLA exceptions | Indefinite |

---

## Integration with Incident Management

### Incident Creation Rules

| Condition | Ticket Priority | Auto-Assign To |
|---|---|---|
| Critical tier, L3 incident | P1 | On-call Data Engineer + Domain Lead |
| Critical tier, L2 critical (unresolved 2x SLA) | P2 | Domain Data Engineer |
| Standard tier, L3 incident | P2 | Domain Data Engineer |
| Standard tier, L2 critical (unresolved 2x SLA) | P3 | Data Quality Analyst |
| Informational tier, L3 incident | P3 | Data Quality Analyst |
| Regression detected (any tier) | P2 | Domain Data Engineer |

### Incident Ticket Content

| Field | Mapping |
|---|---|
| Title | `[DQ Breach] {dataset_name} - {dimension} below SLA` |
| Priority | Per creation rules above |
| Category | Data Quality |
| Subcategory | {dimension_name} |
| Assignment group | Per routing logic |
| Description | Auto-populated from breach notification content |
| Impact | Number of downstream datasets and consumers affected |
| Related CI | Dataset configuration item in CMDB |
| Runbook | Link to dimension-specific remediation runbook |

### Incident Lifecycle Integration

```
Alert Detected ──► Ticket Created ──► Assigned ──► In Progress ──► Resolved ──► Closed
                                                        │
                                                        ▼
                                                  Post-Mortem
                                                  (if P1/P2)
```

- Quality monitoring updates ticket status based on score recovery
- When quality score returns to SLA compliance, ticket is auto-updated with resolution evidence
- Closure requires manual confirmation that root cause is addressed
- P1/P2 incidents require post-mortem within 5 business days

---

## Fabric / Azure Implementation Guidance

| Component | Recommended Service | Configuration |
|---|---|---|
| Quality engine | Fabric PySpark notebooks | Triggered by pipeline completion events |
| Results storage | Fabric Lakehouse (Delta) | Tables per data model above |
| Alert engine | Azure Logic Apps | HTTP trigger from quality notebook |
| Notification | Logic Apps -> Teams, Email, PagerDuty | Adaptive cards for Teams |
| Incident creation | Logic Apps -> ServiceNow REST API | Auto-create via Table API |
| Dashboards | Power BI Direct Lake | Three-level hierarchy per requirements |
| Scheduling | Fabric pipeline triggers | Event-driven + scheduled backup runs |
| Trend computation | PySpark + Delta time travel | Daily batch computation of trends |

---

## Manufacturing Overlay [CONDITIONAL]

| Monitoring Aspect | Manufacturing Adjustment |
|---|---|
| Dashboard priority | Production quality dashboard (OEE, yield, scrap rate) as separate Level 2 view |
| Alert routing | Shop floor quality alerts route to Manufacturing Quality Manager |
| Timeliness monitoring | IoT data freshness monitored at 1-minute intervals |
| Shift-based reporting | Quality reports aligned to production shift boundaries (not calendar day) |
| MES integration | Quality alerts pushed to MES operator dashboards |
| Regulatory hold | Quality inspection failures trigger automatic production hold alerts |

---

## Cross-References

| Reference | Module | Relationship |
|---|---|---|
| Quality Dimension Definitions | ISL-06 | Defines the dimensions being monitored |
| Quality SLA Framework | ISL-06 | Provides thresholds for alerts and escalation |
| Quality Rule Library | ISL-06 | Rules whose results feed the monitoring system |
| Remediation Workflow | ISL-06 | Process triggered by monitoring alerts |
| Quality Scorecard Template | ISL-06 | Scoring methodology for dashboard KPIs |
| Quality Dashboard Spec Example | ISL-06 | Detailed Power BI dashboard design |
| ISL-04 Data Classification | ISL-04 | Tier classification drives alert routing |
| ISL-02 Metadata Standards | ISL-02 | Monitoring metadata storage standards |

## Compliance Alignment

| Framework | Relevance |
|---|---|
| ISO 8000 | Monitoring supports continuous data quality management |
| ITIL v4 | Event management, incident management, and monitoring practices |
| SOX | Continuous monitoring of financial data quality for internal controls |
| FDA 21 CFR Part 11 | Audit trail and monitoring for regulated data in manufacturing |
| DAMA DMBOK | Data quality operations monitoring and measurement |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-01-15 | ISL Team | Initial release — monitoring standards with three-level dashboard hierarchy |

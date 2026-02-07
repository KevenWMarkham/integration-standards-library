# Quality SLA Framework

> Module: ISL-06 | Version: 1.0 | Adaptation Effort: 3-5 hrs | Dependencies: ISL-02, ISL-04, ISL-05

## Purpose

This document establishes the Service Level Agreement (SLA) framework for data quality across all six dimensions defined in ISL-06 Quality Dimension Definitions. It defines per-dimension thresholds by ISL-04 data tier, escalation procedures from warning through critical to incident, exception handling, measurement windows, breach notification protocols, reporting cadence, continuous improvement targets, and the SLA review and adjustment process. This framework ensures that quality expectations are explicit, measurable, and enforceable.

## Scope

### In Scope

- Quality SLA thresholds for all six dimensions across three data tiers
- Escalation rules with tiered response (warning, critical, incident)
- SLA exception handling and temporary waiver processes
- Measurement window definitions and aggregation methods
- Breach notification and routing procedures
- SLA reporting cadence (daily, weekly, monthly)
- Continuous improvement targets and trajectory planning
- Periodic SLA review and adjustment process

### Out of Scope

- Dimension definitions (see Quality Dimension Definitions)
- Specific rule implementations (see Quality Rule Library)
- Dashboard and reporting design (see Quality Monitoring Standards)
- Remediation workflows for SLA breaches (see Remediation Workflow)

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default Value | Client Value | Notes |
|---|---|---|---|
| `sla_measurement_window` | 24-hour rolling | | Window for SLA calculation |
| `breach_notification_channel` | Email + Teams | | Notification method for breaches |
| `incident_management_tool` | ServiceNow | | ITSM integration target |
| `sla_review_cadence` | Quarterly | | How often SLAs are reviewed |
| `grace_period_new_sources` | 30 days | | Reduced enforcement for new integrations |
| `business_calendar` | Monday-Friday, 06:00-22:00 UTC | | Business hours for escalation timing |
| `executive_sponsor` | Data Office Lead | | Escalation endpoint for P1 incidents |
| `continuous_improvement_rate` | 1% per quarter | | Target improvement trajectory |
| `exception_approval_authority` | Data Steward (domain) | | Who approves SLA exceptions |
| `max_exception_duration` | 90 days | | Maximum temporary waiver period |

---

## SLA Threshold Definitions

### Primary SLA Table

The following table defines the target SLA thresholds for each quality dimension, segmented by ISL-04 data tier. These thresholds represent the minimum acceptable quality level for each tier.

| Dimension | Critical (Tier 3-4) | Standard (Tier 2) | Informational (Tier 1) |
|---|---|---|---|
| Completeness | >= 99.0% | >= 95.0% | >= 90.0% |
| Accuracy | >= 98.0% | >= 95.0% | >= 90.0% |
| Timeliness | <= 15 min delay | <= 1 hr delay | <= 4 hr delay |
| Consistency | >= 99.0% | >= 95.0% | >= 90.0% |
| Validity | >= 99.5% | >= 98.0% | >= 95.0% |
| Uniqueness | >= 99.9% | >= 99.0% | >= 95.0% |

### Warning Thresholds

Warning thresholds trigger proactive alerts before an SLA breach occurs. They are set at a buffer above the SLA target.

| Dimension | Critical (Tier 3-4) Warning | Standard (Tier 2) Warning | Informational (Tier 1) Warning |
|---|---|---|---|
| Completeness | < 99.5% | < 97.0% | < 93.0% |
| Accuracy | < 98.5% | < 97.0% | < 93.0% |
| Timeliness | > 10 min delay | > 45 min delay | > 3 hr delay |
| Consistency | < 99.5% | < 97.0% | < 93.0% |
| Validity | < 99.7% | < 98.5% | < 96.0% |
| Uniqueness | < 99.95% | < 99.5% | < 97.0% |

### Critical Thresholds

Critical thresholds indicate an immediate SLA breach requiring urgent attention.

| Dimension | Critical (Tier 3-4) Breach | Standard (Tier 2) Breach | Informational (Tier 1) Breach |
|---|---|---|---|
| Completeness | < 99.0% | < 95.0% | < 90.0% |
| Accuracy | < 98.0% | < 95.0% | < 90.0% |
| Timeliness | > 15 min delay | > 1 hr delay | > 4 hr delay |
| Consistency | < 99.0% | < 95.0% | < 90.0% |
| Validity | < 99.5% | < 98.0% | < 95.0% |
| Uniqueness | < 99.9% | < 99.0% | < 95.0% |

### Severe Degradation Thresholds

Severe degradation triggers an incident and executive escalation. Set at 5 percentage points below the SLA target (or double the timeliness SLA).

| Dimension | Critical (Tier 3-4) Severe | Standard (Tier 2) Severe | Informational (Tier 1) Severe |
|---|---|---|---|
| Completeness | < 94.0% | < 90.0% | < 85.0% |
| Accuracy | < 93.0% | < 90.0% | < 85.0% |
| Timeliness | > 30 min delay | > 2 hr delay | > 8 hr delay |
| Consistency | < 94.0% | < 90.0% | < 85.0% |
| Validity | < 94.5% | < 93.0% | < 90.0% |
| Uniqueness | < 94.9% | < 94.0% | < 90.0% |

---

## Escalation Rules

### Escalation Tiers

```
  Level 0: NORMAL          Score >= Warning Threshold
     │
     ▼ (score drops below warning threshold)
  Level 1: WARNING         Warning Threshold > Score >= SLA Target
     │                     Notification: Data Steward + Domain Team
     │                     Response: 4 business hours (Critical), 1 business day (Standard/Info)
     │
     ▼ (score drops below SLA target)
  Level 2: CRITICAL        SLA Target > Score >= Severe Threshold
     │                     Notification: Data Steward + Domain Lead + Data Office
     │                     Response: 1 business hour (Critical), 4 business hours (Standard), 1 day (Info)
     │
     ▼ (score drops below severe threshold)
  Level 3: INCIDENT        Score < Severe Threshold
                           Notification: Executive Sponsor + All stakeholders
                           Response: 30 minutes (Critical), 2 business hours (Standard), 4 hours (Info)
                           Action: Incident ticket created automatically
```

### Escalation Response Matrix

| Escalation Level | Critical Tier Response Time | Standard Tier Response Time | Informational Tier Response Time |
|---|---|---|---|
| L1 - Warning | 4 business hours | 1 business day | 2 business days |
| L2 - Critical | 1 business hour | 4 business hours | 1 business day |
| L3 - Incident | 30 minutes | 2 business hours | 4 business hours |

### Escalation Notification Routing

| Escalation Level | Notification Recipients | Channel |
|---|---|---|
| L1 - Warning | Data Steward, Domain Data Engineer | Teams channel, Email |
| L2 - Critical | L1 recipients + Domain Lead, Data Quality Manager | Teams channel, Email, PagerDuty (Critical tier only) |
| L3 - Incident | L2 recipients + Executive Sponsor, IT Operations | All channels + incident ticket auto-created |

### Auto-Escalation Rules

| Condition | Action |
|---|---|
| L1 Warning unacknowledged for 2x response time | Auto-escalate to L2 Critical |
| L2 Critical unacknowledged for 2x response time | Auto-escalate to L3 Incident |
| L3 Incident unresolved for 4 hours (Critical tier) | Escalate to CIO/CDO |
| Same dataset triggers L2+ for 3 consecutive periods | Flag as recurring; trigger root cause review |
| 5+ datasets in same domain breach simultaneously | Trigger domain-wide quality review |

---

## Exception Handling Process

### Temporary SLA Exceptions (Waivers)

Temporary waivers allow reduced SLA enforcement during planned activities such as data migrations, system upgrades, or new source onboarding.

| Step | Action | Owner | SLA |
|---|---|---|---|
| 1 | Submit exception request with justification | Requestor (Data Engineer / PM) | - |
| 2 | Review impact on downstream consumers | Data Steward | 2 business days |
| 3 | Approve or reject exception | Exception Approval Authority | 1 business day |
| 4 | Configure temporary threshold override | Data Quality Engineer | 4 business hours |
| 5 | Monitor during exception period | Data Steward | Ongoing |
| 6 | Auto-expire exception at end date | System (automated) | Automatic |
| 7 | Post-exception review and SLA restoration | Data Steward | 1 business day |

### Exception Request Template

| Field | Description |
|---|---|
| Dataset(s) affected | List of datasets requiring exception |
| Dimension(s) affected | Which quality dimensions are impacted |
| Current SLA | Existing threshold value |
| Requested temporary SLA | Reduced threshold for exception period |
| Start date | When the exception takes effect |
| End date | When the exception expires (max 90 days) |
| Justification | Business reason for the exception |
| Mitigation plan | Steps to restore normal quality levels |
| Downstream impact | Consumer teams and reports affected |
| Approval chain | Required approvers |

### Permanent SLA Adjustments

Permanent changes to SLA thresholds require a formal review process (see SLA Review and Adjustment Process below).

---

## SLA Measurement Windows

### Window Definitions

| Window Type | Definition | Use Case |
|---|---|---|
| Per-run | Measured each time the pipeline executes | Real-time quality checks |
| Rolling 24-hour | Average quality score over the prior 24 hours | Default SLA measurement |
| Daily | Quality score calculated once per calendar day at 00:00 UTC | Daily reporting |
| Weekly | Average of daily scores over the prior 7 days | Trend analysis |
| Monthly | Average of daily scores over the prior calendar month | Executive reporting |

### Aggregation Method

```
Daily SLA Score = AVERAGE(all per-run scores within the calendar day)

Weekly SLA Score = AVERAGE(daily scores for the 7-day period)

Monthly SLA Score = AVERAGE(daily scores for the calendar month)

SLA Compliance = (
    COUNT(days where Daily Score >= SLA Target)
) / total_days_in_period * 100
```

### SLA Compliance Levels

| Compliance Level | Definition | RAG Status |
|---|---|---|
| Full compliance | 100% of measurement periods meet SLA | Green |
| Substantial compliance | >= 95% of measurement periods meet SLA | Green |
| Partial compliance | >= 80% and < 95% of periods meet SLA | Amber |
| Non-compliance | < 80% of measurement periods meet SLA | Red |

---

## Breach Notification

### Notification Content

Each breach notification must include:

| Field | Description |
|---|---|
| Timestamp | When the breach was detected (UTC) |
| Dataset | Fully qualified dataset name |
| Domain | Data domain (per ISL-04 classification) |
| Dimension | Which quality dimension breached |
| Data tier | ISL-04 tier of the affected dataset |
| Current score | Measured quality score |
| SLA target | Expected threshold |
| Delta | Gap between current score and target |
| Escalation level | L1/L2/L3 |
| Trend | Improving, stable, or degrading |
| Suggested action | Automated recommendation based on breach type |
| Runbook link | Link to remediation runbook |

### Notification Channels

| Channel | Configuration | Latency |
|---|---|---|
| Microsoft Teams | Adaptive card to designated channel | < 2 minutes |
| Email | HTML email to distribution list | < 5 minutes |
| PagerDuty | Alert for Critical tier L2+ | < 1 minute |
| ServiceNow | Incident auto-created for L3 | < 5 minutes |
| Power BI | Dashboard refresh reflects breach | < 15 minutes |

---

## SLA Reporting Cadence

### Daily Quality Report

| Element | Details |
|---|---|
| Audience | Data Engineers, Data Stewards |
| Delivery | Automated email at 07:00 UTC; Teams notification |
| Content | Per-dataset scores vs SLA, breach list, top 5 failing rules |
| Format | Tabular summary with RAG indicators |

### Weekly Quality Summary

| Element | Details |
|---|---|
| Audience | Domain Leads, Data Quality Manager |
| Delivery | Every Monday at 08:00 UTC |
| Content | Weekly trends by domain, SLA compliance %, improvement actions status |
| Format | Power BI report with trend charts |

### Monthly Quality Executive Report

| Element | Details |
|---|---|
| Audience | Executive Sponsor, Data Governance Council |
| Delivery | 3rd business day of the month |
| Content | Enterprise quality scorecard, domain comparison, top issues, improvement trajectory |
| Format | Power BI paginated report + executive summary slide |

### Quarterly SLA Review Package

| Element | Details |
|---|---|
| Audience | Data Governance Council, Domain Leads |
| Delivery | 2 weeks before quarterly review meeting |
| Content | SLA compliance trends, exception usage, proposed adjustments, continuous improvement progress |
| Format | Presentation deck + supporting data |

---

## Continuous Improvement Targets

### Improvement Trajectory

Quality SLAs are not static. The framework mandates continuous improvement with the following default trajectory:

| Period | Target Improvement | Mechanism |
|---|---|---|
| Quarter 1 (Baseline) | Establish baseline measurements | Deploy monitoring; no enforcement |
| Quarter 2 | Achieve 80% SLA compliance | Enforce SLAs; focus on critical datasets |
| Quarter 3 | Achieve 90% SLA compliance; improve baselines by 1% | Expand coverage; remediate top issues |
| Quarter 4 | Achieve 95% SLA compliance; improve baselines by 1% | Mature automation; reduce manual intervention |
| Ongoing (per quarter) | Improve baselines by 1% per quarter | Tighten thresholds as quality matures |

### Improvement Tracking

| Metric | Calculation | Target |
|---|---|---|
| SLA compliance rate | % of measurement periods meeting SLA | Increase 5% per quarter until >= 95% |
| Mean time to detect (MTTD) | Average time from quality degradation to alert | Reduce 10% per quarter |
| Mean time to resolve (MTTR) | Average time from alert to SLA restoration | Reduce 10% per quarter |
| Recurring breach rate | % of breaches that are repeats of prior breaches | Reduce 15% per quarter |
| Exception utilization | % of datasets with active exceptions | Reduce to < 5% |
| Rule coverage | % of Critical tier columns with quality rules | Increase to 100% |

---

## SLA Review and Adjustment Process

### Quarterly Review Process

| Step | Action | Owner | Timing |
|---|---|---|---|
| 1 | Generate quarterly SLA review package | Data Quality Manager | T-14 days |
| 2 | Distribute package to reviewers | Data Quality Manager | T-12 days |
| 3 | Domain leads provide feedback and proposals | Domain Leads | T-5 days |
| 4 | Review meeting with Data Governance Council | Data Governance Council | T-0 |
| 5 | Approve/reject proposed adjustments | Executive Sponsor | T+2 days |
| 6 | Implement approved changes | Data Quality Engineer | T+5 days |
| 7 | Communicate changes to all stakeholders | Data Quality Manager | T+7 days |

### Adjustment Criteria

SLA thresholds may be adjusted when:

| Trigger | Direction | Required Evidence |
|---|---|---|
| Consistent overperformance (>= 3 months above target) | Tighten (raise threshold) | Statistical evidence of sustained performance |
| Chronic underperformance despite remediation | Loosen (lower threshold) temporarily | Root cause analysis showing systemic limitation |
| Business requirements change | Either direction | Documented business requirement change |
| New regulatory requirement | Tighten | Regulatory reference and compliance deadline |
| Source system change | Temporary loosening | Change request documentation and timeline |
| New data tier classification | Align to new tier | ISL-04 classification change approval |

### Adjustment Limits

- No threshold may be lowered below the Informational (Tier 1) SLA level
- Threshold tightening has no upper limit (aspirational excellence)
- All adjustments require Data Governance Council approval
- Changes take effect at the start of the next calendar month

---

## Fabric / Azure Implementation Guidance

| Component | Recommended Service | Notes |
|---|---|---|
| SLA threshold configuration | Delta table (`dq_sla_thresholds`) | Version-controlled threshold definitions |
| SLA score calculation | PySpark notebook | Compare quality scores against threshold table |
| Breach detection | Fabric pipeline with conditional activities | Evaluate SLA after each quality check run |
| Notifications | Logic Apps / Power Automate | Multi-channel notification routing |
| Incident creation | Logic Apps -> ServiceNow API | Auto-create tickets for L3 incidents |
| SLA dashboard | Power BI Direct Lake | Real-time compliance visualization |
| Exception management | Power Apps or SharePoint list | Workflow for exception requests and approvals |
| Historical SLA tracking | Delta table (`dq_sla_history`) | Retain 13 months of SLA compliance data |

### Threshold Configuration Table Schema

```sql
CREATE TABLE dq_sla_thresholds (
    threshold_id        STRING,
    dimension           STRING,       -- completeness, accuracy, timeliness, etc.
    data_tier           STRING,       -- critical, standard, informational
    level               STRING,       -- warning, critical, severe
    threshold_value     DECIMAL(6,4),
    threshold_operator  STRING,       -- '>=', '<=', '>', '<'
    effective_date      DATE,
    expiry_date         DATE,
    is_active           BOOLEAN,
    created_by          STRING,
    created_date        TIMESTAMP,
    modified_by         STRING,
    modified_date       TIMESTAMP
);
```

---

## Manufacturing Overlay [CONDITIONAL]

Manufacturing environments may require adjusted SLAs for specific data domains:

| Manufacturing Domain | Dimension Adjustments | Rationale |
|---|---|---|
| IoT / Telemetry | Timeliness: <= 5 min (Critical) | Machine monitoring requires near real-time data |
| BOM / Product Structure | Completeness: >= 99.5% (Critical) | Incomplete BOMs halt production planning |
| Quality Inspection | Accuracy: >= 99.5% (Critical) | Inspection data drives pass/fail decisions |
| Production Orders | Consistency: >= 99.5% (Critical) | ERP-MES consistency critical for scheduling |
| Inventory Transactions | Uniqueness: >= 99.99% (Critical) | Duplicate transactions inflate inventory counts |
| Cost Roll-Up | Accuracy: >= 99.0% (Critical) | Financial reporting accuracy requirements |

---

## Cross-References

| Reference | Module | Relationship |
|---|---|---|
| Quality Dimension Definitions | ISL-06 | Defines the dimensions that SLAs measure |
| Quality Rule Library | ISL-06 | Rules that generate the quality scores checked against SLAs |
| Quality Monitoring Standards | ISL-06 | Monitoring infrastructure that detects SLA breaches |
| Remediation Workflow | ISL-06 | Process triggered when SLAs are breached |
| Quality Scorecard Template | ISL-06 | Reporting format for SLA compliance |
| ISL-04 Data Classification | ISL-04 | Data tier definitions that drive SLA tier selection |
| ISL-02 Metadata Standards | ISL-02 | SLA metadata stored per ISL-02 schema |
| ISL-05 Medallion Architecture | ISL-05 | Quality gates at layer transitions enforce SLAs |

## Compliance Alignment

| Framework | Relevance |
|---|---|
| ISO 8000 | SLA framework supports data quality management system requirements |
| DAMA DMBOK | Aligns with data quality operations and service level management |
| ITIL v4 | SLA management, incident management, and continual improvement practices |
| SOX | Quality SLAs for financial data support internal control requirements |
| GDPR / CCPA | Data accuracy SLAs support data subject rights compliance |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-01-15 | ISL Team | Initial release — SLA framework with three-tier thresholds |

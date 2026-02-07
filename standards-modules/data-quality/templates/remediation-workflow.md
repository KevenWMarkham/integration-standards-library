# Remediation Workflow

> Module: ISL-06 | Version: 1.0 | Adaptation Effort: 2-4 hrs | Dependencies: ISL-04, ISL-06 SLA Framework, ISL-06 Monitoring Standards

## Purpose

This document defines the end-to-end remediation workflow for data quality issues, from detection through resolution and prevention. It covers issue classification, severity levels (P1 through P4), triage processes, root cause analysis, fix-forward versus fix-backward decision criteria, remediation SLAs by severity, post-mortem procedures, prevention mechanisms, remediation tracking, and recurring issue identification. The workflow ensures that quality issues are resolved systematically and that root causes are addressed to prevent recurrence.

## Scope

### In Scope

- Issue detection and classification taxonomy
- Severity levels (P1, P2, P3, P4) with clear criteria
- Triage process and decision tree
- Root cause analysis templates and methods
- Fix-forward vs fix-backward decision framework
- Remediation SLAs by severity level
- Post-mortem process for major incidents
- Prevention process and feedback loop
- Remediation tracking and metrics
- Recurring issue identification and escalation

### Out of Scope

- Quality rule definitions (see Quality Rule Library)
- SLA threshold configuration (see Quality SLA Framework)
- Monitoring and alerting setup (see Quality Monitoring Standards)
- Dashboard design (see Quality Scorecard Template)

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default Value | Client Value | Notes |
|---|---|---|---|
| `incident_management_tool` | ServiceNow | | ITSM platform for ticket tracking |
| `triage_team_structure` | Centralized DQ team | | Centralized or federated triage |
| `post_mortem_tool` | Confluence / SharePoint | | Documentation platform for post-mortems |
| `remediation_board` | Azure DevOps | | Tracking board for remediation items |
| `on_call_rotation` | Weekly rotation | | On-call schedule for P1/P2 triage |
| `business_hours` | Mon-Fri 06:00-22:00 UTC | | Hours for SLA calculation |
| `auto_rollback_enabled` | false | | Automatic rollback for Critical tier failures |
| `max_remediation_backlog` | 20 items | | Backlog threshold triggering escalation |
| `recurring_threshold` | 3 occurrences in 30 days | | When an issue is classified as recurring |
| `post_mortem_required_severity` | P1, P2 | | Severity levels requiring formal post-mortem |

---

## Issue Detection and Classification

### Detection Sources

| Source | Detection Method | Typical Latency |
|---|---|---|
| Automated quality rules | Pipeline-integrated rule execution | < 5 minutes after pipeline completion |
| SLA breach monitoring | Continuous SLA comparison | < 15 minutes |
| Regression detection | Statistical anomaly detection (Z-score) | < 15 minutes |
| Manual reporting | User-reported data issue via support ticket | Variable (hours to days) |
| Downstream consumer | Analytics or report produces unexpected results | Variable (hours to days) |
| External audit | Regulatory or internal audit finding | Days to weeks |

### Issue Classification Taxonomy

| Classification | Description | Examples |
|---|---|---|
| **Schema** | Structural changes in data format | Missing columns, type changes, unexpected columns |
| **Completeness** | Missing or null data | Null required fields, missing partitions, empty loads |
| **Accuracy** | Incorrect data values | Calculation errors, stale reference data, wrong mappings |
| **Timeliness** | Late data delivery | Pipeline delays, upstream system delays, scheduling failures |
| **Consistency** | Cross-system disagreement | ERP/MES mismatch, duplicate records, referential integrity |
| **Validity** | Format or constraint violations | Invalid dates, out-of-range values, bad enumerations |
| **Infrastructure** | Platform or service issues | Fabric capacity, storage failures, network issues |
| **Process** | Human error or procedural gap | Manual load errors, incorrect configuration, missed steps |

---

## Severity Levels

### Severity Definitions

| Severity | Name | Definition | Data Tier Impact | Business Impact |
|---|---|---|---|---|
| **P1** | Critical | Complete data quality failure blocking critical business processes | Critical tier (Tier 3-4) with SLA severe degradation | Revenue impact, regulatory risk, production stoppage |
| **P2** | High | Significant quality degradation affecting multiple consumers | Critical tier SLA breach OR Standard tier severe degradation | Reporting delays, decision-making impaired |
| **P3** | Medium | Quality degradation within a single domain or dataset | Standard tier SLA breach OR Informational tier severe degradation | Individual report or process affected |
| **P4** | Low | Minor quality issue with minimal business impact | Informational tier SLA breach or warning-level issues | Cosmetic, informational, or future risk |

### Severity Decision Matrix

```
                    ┌─────────────────────────────────────────┐
                    │         DATA TIER                       │
                    │  Critical    Standard    Informational  │
┌───────────────────┼─────────────────────────────────────────┤
│ Severe            │    P1           P2           P3         │
│ degradation       │                                         │
├───────────────────┼─────────────────────────────────────────┤
│ SLA breach        │    P2           P3           P4         │
│                   │                                         │
├───────────────────┼─────────────────────────────────────────┤
│ Warning           │    P3           P4           P4         │
│                   │                                         │
└───────────────────┴─────────────────────────────────────────┘
```

### Severity Override Conditions

| Condition | Override |
|---|---|
| Regulatory data affected (SOX, FDA, GDPR) | Escalate by 1 level (minimum P2) |
| Financial reporting period close (T-5 days) | Escalate by 1 level for financial data |
| Multiple domains affected simultaneously | Escalate by 1 level |
| Executive-reported issue | Minimum P2 |
| Recurring issue (3+ in 30 days) | Escalate by 1 level |

---

## Triage Process

### Triage Workflow

```
Issue Detected
    │
    ▼
┌─────────────────┐
│ 1. AUTO-CLASSIFY │ ◄── Automated: severity, classification, affected dataset
│    (< 2 min)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. AUTO-ASSIGN   │ ◄── Route to appropriate team based on classification + tier
│    (< 2 min)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────────┐
│ 3. TRIAGE REVIEW │────►│ Is it a false positive? │
│    (within SLA)  │     └──────────┬───────────┘
└────────┬────────┘                │
         │                    Yes ──► Close ticket; tune rule
         │                    No  ──┐
         ▼                          │
┌─────────────────┐                 │
│ 4. IMPACT ASSESS │ ◄──────────────┘
│                  │     Determine downstream impact, affected consumers
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────────┐
│ 5. FIX DECISION  │────►│ Fix-forward or         │
│                  │     │ fix-backward?          │
└────────┬────────┘     └──────────┬───────────┘
         │                         │
    Forward ──► Apply fix to next pipeline run
    Backward ──► Reprocess affected data
         │
         ▼
┌─────────────────┐
│ 6. EXECUTE FIX   │ ◄── Implement and verify remediation
│                  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 7. VERIFY & CLOSE│ ◄── Confirm quality scores restored; close ticket
│                  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 8. POST-MORTEM   │ ◄── P1/P2 only: formal root cause analysis
│    (if required) │
└─────────────────┘
```

### Triage SLAs

| Severity | Acknowledge | Triage Complete | Fix Implemented | Verified & Closed |
|---|---|---|---|---|
| P1 | 15 minutes | 1 hour | 4 hours | 8 hours |
| P2 | 1 hour | 4 hours | 1 business day | 2 business days |
| P3 | 4 hours | 1 business day | 3 business days | 5 business days |
| P4 | 1 business day | 3 business days | 10 business days | 15 business days |

---

## Root Cause Analysis

### Root Cause Analysis Template

| Section | Content |
|---|---|
| **Issue Summary** | One-sentence description of the quality issue |
| **Detection** | How was the issue detected? (rule, alert, manual report) |
| **Impact** | Datasets, consumers, reports, and business processes affected |
| **Timeline** | When did the issue start? When was it detected? When was it resolved? |
| **Root Cause** | The underlying technical or process failure |
| **Contributing Factors** | Additional factors that allowed the issue to occur or persist |
| **Immediate Fix** | What was done to restore quality? |
| **Prevention** | What changes will prevent recurrence? |
| **Action Items** | Specific tasks with owners and due dates |

### Root Cause Categories

| Category | Description | Examples | Typical Prevention |
|---|---|---|---|
| **Source system change** | Upstream system modified data format, values, or behavior | Schema change, new enum values, API change | Schema contracts, change management |
| **Pipeline defect** | Bug in ETL/ELT transformation logic | Incorrect join, wrong filter, casting error | Code review, integration testing |
| **Infrastructure failure** | Platform or service outage or degradation | Fabric capacity, storage throttling, network | Monitoring, capacity planning, redundancy |
| **Configuration error** | Incorrect parameter or threshold setting | Wrong connection string, bad threshold, wrong schedule | Configuration management, change review |
| **Data volume anomaly** | Unexpected change in data volume | Bulk load, purge, migration, seasonal spike | Volume monitoring, capacity planning |
| **Manual error** | Human mistake in data entry or operation | Wrong file uploaded, manual override, fat finger | Process controls, validation, automation |
| **Third-party issue** | External vendor or partner data problem | Vendor data quality degradation, API change | Vendor SLAs, inbound quality checks |
| **Reference data drift** | Lookup/reference data becomes stale or incorrect | Outdated mapping table, deprecated codes | Reference data governance, refresh schedule |

### 5 Whys Method

For P1 and P2 incidents, apply the 5 Whys analysis technique:

```
Problem: Customer orders from the last 24 hours have incorrect shipping costs.

Why 1: The shipping_cost field in the silver layer is NULL for 15% of orders.
Why 2: The bronze-to-silver transformation failed to map the new shipping carrier code.
Why 3: The shipping carrier added a new service level code not in our mapping table.
Why 4: There is no process to detect new carrier codes before they reach production.
Why 5: The inbound data contract does not include carrier code validation.

Root Cause: Missing inbound validation for reference data changes.
Prevention: Add QR-R04 (enum validation) for carrier codes; establish carrier code
            change notification process with shipping partner.
```

---

## Fix-Forward vs Fix-Backward Decision

### Decision Criteria

| Criterion | Fix-Forward | Fix-Backward (Reprocess) |
|---|---|---|
| **Data is still flowing** | Apply fix in next pipeline run | Reprocess from last known good state |
| **Historical data affected** | No — only future data impacted | Yes — prior loads contain errors |
| **Downstream consumers already used data** | Limited — consumers have not yet consumed | Extensive — reports/decisions already made |
| **Fix complexity** | Simple — config change or filter | Complex — requires reprocessing framework |
| **Time to implement** | < 1 hour | > 1 hour (depends on reprocessing volume) |
| **Data tier** | Standard or Informational | Critical |
| **Regulatory requirement** | No regulatory mandate to correct history | Regulatory requirement to correct history |

### Decision Matrix

```
                    ┌───────────────────────────────────────┐
                    │  Historical Data Affected?            │
                    │      No              Yes              │
┌───────────────────┼───────────────────────────────────────┤
│ Critical Tier     │  Fix-Forward      Fix-Backward        │
│                   │  + notify          + notify            │
├───────────────────┼───────────────────────────────────────┤
│ Standard Tier     │  Fix-Forward      Fix-Backward        │
│                   │                   (if < 7 days)       │
│                   │                   Fix-Forward          │
│                   │                   (if > 7 days)       │
├───────────────────┼───────────────────────────────────────┤
│ Informational     │  Fix-Forward      Fix-Forward          │
│ Tier              │                   + document gap       │
└───────────────────┴───────────────────────────────────────┘
```

### Reprocessing Procedure

| Step | Action | Owner |
|---|---|---|
| 1 | Identify affected date range and datasets | Data Engineer |
| 2 | Notify downstream consumers of planned reprocessing | Data Steward |
| 3 | Apply fix to pipeline code/configuration | Data Engineer |
| 4 | Execute reprocessing for affected date range | Data Engineer |
| 5 | Validate quality scores for reprocessed data | Data Quality Analyst |
| 6 | Confirm downstream consumers have refreshed | Data Steward |
| 7 | Update remediation ticket with evidence | Data Engineer |

---

## Post-Mortem Process

### Post-Mortem Requirements

| Severity | Post-Mortem Required | Timeline | Audience |
|---|---|---|---|
| P1 | Mandatory | Within 5 business days of resolution | Data Governance Council + all stakeholders |
| P2 | Mandatory | Within 10 business days of resolution | Domain Lead + affected stakeholders |
| P3 | Optional (recommended for recurring) | Within 15 business days | Domain team |
| P4 | Not required | N/A | N/A |

### Post-Mortem Document Structure

| Section | Content |
|---|---|
| 1. Executive Summary | 2-3 sentence overview suitable for leadership |
| 2. Incident Timeline | Chronological events from issue start to resolution |
| 3. Impact Assessment | Quantified impact (records affected, consumers impacted, duration) |
| 4. Root Cause Analysis | 5 Whys or fishbone analysis |
| 5. Resolution | What was done to fix the immediate issue |
| 6. What Went Well | Aspects of detection and response that worked effectively |
| 7. What Needs Improvement | Gaps in detection, response, or prevention |
| 8. Action Items | Specific prevention tasks with owner, due date, and priority |
| 9. Metrics | MTTD, MTTR, records affected, SLA downtime |

### Post-Mortem Meeting Agenda

| Time | Topic | Duration |
|---|---|---|
| 0:00 | Introduction and timeline review | 10 min |
| 0:10 | Impact discussion | 10 min |
| 0:20 | Root cause deep dive | 15 min |
| 0:35 | What went well / what needs improvement | 10 min |
| 0:45 | Action item review and assignment | 10 min |
| 0:55 | Next steps and close | 5 min |

---

## Prevention Process

### Prevention Feedback Loop

```
Post-Mortem Action Items
    │
    ├──► New Quality Rule ──► Add to Quality Rule Library (ISL-06)
    │
    ├──► SLA Adjustment ──► Update Quality SLA Framework (ISL-06)
    │
    ├──► Monitoring Enhancement ──► Update Quality Monitoring Standards (ISL-06)
    │
    ├──► Pipeline Fix ──► Code change + regression test
    │
    ├──► Process Change ──► Update runbook / documentation
    │
    └──► Training ──► Team education on root cause and prevention
```

### Prevention Categories

| Category | Description | Implementation |
|---|---|---|
| **Rule addition** | New quality rule to detect the issue proactively | Add to QR-library; deploy in next release |
| **Rule tuning** | Adjust existing rule threshold or logic | Update dq_rule_config table |
| **Schema contract** | Add or update schema validation | Update expected schema registry |
| **Pipeline hardening** | Add error handling, retry logic, or validation | Code change with tests |
| **Monitoring enhancement** | Add new alert or improve detection speed | Update monitoring configuration |
| **Process improvement** | Change operational procedures or add checkpoints | Update runbook documentation |
| **Vendor notification** | Establish change notification with external partner | Contract or SLA update |
| **Automation** | Replace manual step with automated process | New pipeline or tool implementation |

---

## Remediation Tracking

### Tracking Metrics

| Metric | Definition | Target |
|---|---|---|
| Open remediation items | Count of unresolved quality issues | < 20 at any time |
| Overdue items | Items past their remediation SLA | 0 |
| Average time to remediate | Mean time from detection to verified fix | P1: < 8 hrs, P2: < 2 days, P3: < 5 days |
| First-time fix rate | % of issues resolved without reopening | >= 90% |
| Prevention action completion | % of post-mortem action items completed on time | >= 80% |
| Backlog age | Average age of open items | < 5 business days |

### Remediation Board Structure

| Column | Description |
|---|---|
| **New** | Newly detected issues, not yet triaged |
| **Triaging** | Under triage — assessing severity and impact |
| **In Progress** | Actively being remediated |
| **Awaiting Verification** | Fix applied, awaiting quality score confirmation |
| **Resolved** | Verified and closed |
| **Blocked** | Cannot proceed due to external dependency |

### Escalation Triggers

| Condition | Escalation Action |
|---|---|
| P1 not acknowledged within 15 minutes | Page on-call manager |
| P2 not triaged within 4 hours | Notify domain lead |
| Any item exceeds remediation SLA by 50% | Escalate to next management level |
| Backlog exceeds 20 items | Escalate to Data Quality Manager; convene triage blitz |
| Same issue occurs 3 times in 30 days | Classify as recurring; mandatory post-mortem |
| Prevention action item overdue by 2 weeks | Escalate to action item owner's manager |

---

## Recurring Issue Identification

### Recurrence Detection

| Criteria | Classification |
|---|---|
| Same rule fails on same dataset 3+ times in 30 days | Recurring |
| Same root cause category for 5+ different issues in 30 days | Systemic |
| Same data source causes issues 3+ times in 30 days | Source-specific recurring |
| Same pipeline causes issues 3+ times in 30 days | Pipeline-specific recurring |

### Recurring Issue Response

| Step | Action | Owner | Timeline |
|---|---|---|---|
| 1 | Flag issue as recurring in tracking system | Automated detection | Immediate |
| 2 | Escalate severity by 1 level | Automated | Immediate |
| 3 | Assign dedicated owner for root cause investigation | Data Quality Manager | 1 business day |
| 4 | Conduct targeted root cause analysis | Assigned owner | 3 business days |
| 5 | Develop and implement permanent fix | Data Engineer | Per agreed timeline |
| 6 | Monitor for 30 days post-fix | Data Quality Analyst | 30 days |
| 7 | Close recurring classification if no recurrence | Data Quality Manager | After 30-day window |

---

## Fabric / Azure Implementation Guidance

| Component | Recommended Service | Notes |
|---|---|---|
| Issue tracking | ServiceNow or Azure DevOps | Incident tickets for P1/P2; work items for P3/P4 |
| Remediation board | Azure DevOps Boards | Kanban board with columns per tracking structure |
| Post-mortem documentation | SharePoint / Confluence | Structured templates with version history |
| Automated classification | Logic Apps | Parse quality alert payload; apply severity matrix |
| Auto-assignment | Logic Apps -> ServiceNow/DevOps API | Route based on classification + tier + domain |
| Recurrence detection | PySpark notebook (scheduled daily) | Query dq_alerts table for recurrence patterns |
| Reprocessing | Fabric pipelines with parameterized date range | Standardized reprocessing pipeline template |
| Prevention tracking | Azure DevOps work items | Link action items to post-mortem documents |

---

## Manufacturing Overlay [CONDITIONAL]

| Remediation Aspect | Manufacturing Adjustment |
|---|---|
| Severity escalation | Production-impacting issues auto-escalate to P1 |
| Triage routing | BOM/routing issues route to Manufacturing Engineering |
| Reprocessing priority | Production order data reprocessing takes precedence |
| Post-mortem | Quality inspection failures require CAPA (Corrective and Preventive Action) process |
| Regulatory hold | FDA-regulated data issues trigger regulatory hold procedures |
| Shift handoff | Open P1/P2 issues included in shift handoff communication |

---

## Cross-References

| Reference | Module | Relationship |
|---|---|---|
| Quality Rule Library | ISL-06 | Rules whose failures trigger remediation |
| Quality SLA Framework | ISL-06 | SLA breaches that define issue severity |
| Quality Monitoring Standards | ISL-06 | Detection and alerting that feeds triage |
| Quality Scorecard Template | ISL-06 | Remediation progress reflected in scores |
| ISL-04 Data Classification | ISL-04 | Data tier drives severity classification |
| ISL-05 Medallion Architecture | ISL-05 | Remediation may require medallion layer reprocessing |

## Compliance Alignment

| Framework | Relevance |
|---|---|
| ITIL v4 | Incident management, problem management, and continual improvement |
| ISO 8000 | Corrective action for data quality non-conformances |
| SOX | Remediation of financial data quality issues for control compliance |
| FDA 21 CFR Part 11 | CAPA process for data integrity issues in regulated manufacturing |
| ISO 9001 | Corrective and preventive action process integration |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-01-15 | ISL Team | Initial release — remediation workflow with P1-P4 severity model |

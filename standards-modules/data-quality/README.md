# ISL-06: Data Quality Standards

**Module ID:** ISL-06
**Target:** Data quality dimensions, measurement frameworks, SLA definitions, and remediation workflows
**Productivity Gain:** 50–60% reduction in data quality standards creation effort
**Build Effort:** Medium (30–50 hours)
**Reusability:** Global — with domain-specific quality rule libraries

---

## Overview

Data quality standards framework covering quality dimensions (completeness, accuracy, timeliness, consistency, validity, uniqueness), measurement methodologies, SLA thresholds, monitoring requirements, and remediation workflows. Pre-aligned to Fabric data quality features and common quality tools (Great Expectations, dbt tests, Informatica DQ).

Data quality is the most frequently under-specified standards deliverable — clients agree it's important but struggle to define concrete, measurable standards. This module provides an opinionated, production-ready framework with 50+ pre-built quality rules that practitioners adapt rather than invent.

---

## How It Works

### Step 1: Define Quality Dimensions
Establish the organization's quality measurement framework using the six core dimensions:

| Dimension | Definition | Measurement Method | Example |
|-----------|-----------|-------------------|---------|
| **Completeness** | Percentage of non-null values for required fields | `1 - (null_count / total_count)` | Customer email: 95% complete |
| **Accuracy** | Degree to which data correctly represents real-world entities | Cross-reference validation, business rule checks | Address matches postal database: 92% |
| **Timeliness** | Data available within defined SLA window | `delivery_time - expected_time` | Daily sales data available by 6:00 AM: 99.5% |
| **Consistency** | Same data values across systems and datasets | Cross-system comparison, referential integrity | Customer ID matches in CRM and ERP: 98% |
| **Validity** | Data conforms to defined formats, ranges, and business rules | Format validation, range checks, regex patterns | Email format valid: 99.8% |
| **Uniqueness** | No unintended duplicate records | Duplicate detection algorithms, key analysis | Customer records unique by SSN: 99.9% |

### Step 2: Establish SLA Thresholds
Configure per-dimension thresholds by data criticality tier:

| Data Tier | Completeness | Accuracy | Timeliness | Consistency | Validity | Uniqueness |
|-----------|-------------|----------|------------|-------------|----------|------------|
| **Critical** (Tier 3–4) | ≥99% | ≥98% | ≤15 min delay | ≥99% | ≥99.5% | ≥99.9% |
| **Standard** (Tier 2) | ≥95% | ≥95% | ≤1 hr delay | ≥95% | ≥98% | ≥99% |
| **Informational** (Tier 1) | ≥90% | ≥90% | ≤4 hr delay | ≥90% | ≥95% | ≥95% |

### Step 3: Deploy Quality Rules
Select and configure rules from the 50+ pre-built library:
- Schema validation rules (column presence, data types, constraints)
- Row-level rules (null checks, range checks, pattern matching)
- Cross-table rules (referential integrity, aggregate consistency)
- Business rules (domain-specific calculations, threshold checks)
- Temporal rules (freshness checks, sequence validation, gap detection)

### Step 4: Configure Monitoring & Alerting
Establish quality monitoring infrastructure:
- Dashboard requirements (executive scorecard, domain detail, trend analysis)
- Alert thresholds and escalation paths (warning → critical → incident)
- Trend analysis and regression detection
- Automated reporting cadence (daily operational, weekly management, monthly executive)

### Step 5: Define Remediation Workflow
Document the quality issue lifecycle:
- Issue detection and classification
- Root cause analysis templates
- Fix-forward vs. fix-backward decision criteria
- Remediation SLAs by severity
- Post-mortem and prevention process

---

## Template Inventory

| Template | File | Description | Adaptation Effort |
|----------|------|-------------|-------------------|
| Quality Dimension Definitions | `templates/quality-dimension-definitions.md` | Six core dimensions with measurement formulas, calculation examples, and edge case guidance | 2–3 hours |
| Quality SLA Framework | `templates/quality-sla-framework.md` | Per-dimension thresholds by data tier, escalation rules, exception handling process | 3–5 hours |
| Quality Rule Library | `templates/quality-rule-library.md` | 50+ pre-built rules covering nulls, duplicates, referential integrity, format validation, range checks, freshness | 4–8 hours |
| Quality Monitoring Standards | `templates/quality-monitoring-standards.md` | Dashboard requirements, alerting thresholds, trending analysis, executive reporting templates | 3–5 hours |
| Remediation Workflow | `templates/remediation-workflow.md` | Issue triage, RCA templates, fix-forward vs. fix-backward criteria, severity definitions, SLAs | 2–4 hours |
| Quality Scorecard Template | `templates/quality-scorecard-template.md` | Domain-level and enterprise-level scoring with RAG status, trend indicators, drill-down structure | 2–3 hours |

---

## Examples

| Example | File | Description |
|---------|------|-------------|
| Manufacturing Quality Rules | `examples/manufacturing-quality-rules.md` | Domain-specific quality rules for manufacturing data (BOM integrity, work order validation, production metrics accuracy) |
| Fabric Quality Implementation | `examples/fabric-quality-implementation.md` | PySpark notebook patterns for implementing quality rules in Fabric lakehouse (Great Expectations + Fabric native) |
| Quality Dashboard Spec | `examples/quality-dashboard-spec.md` | Power BI dashboard specification for enterprise data quality monitoring with sample measures and visuals |

---

## Pre-Built Quality Rule Library (Summary)

### Schema Validation Rules (10 rules)
| Rule ID | Rule Name | Description |
|---------|-----------|-------------|
| QR-S01 | Column Existence | Verify all expected columns present in dataset |
| QR-S02 | Data Type Match | Validate column data types match specification |
| QR-S03 | Nullable Compliance | Non-nullable columns contain no null values |
| QR-S04 | Primary Key Uniqueness | Primary key columns are unique and non-null |
| QR-S05 | Foreign Key Validity | Foreign keys reference valid parent records |
| QR-S06 | Column Count Match | Table column count matches expected schema |
| QR-S07 | Partition Integrity | Partitioned tables have valid partition values |
| QR-S08 | Index Coverage | Required indexes/Z-order columns present |
| QR-S09 | Schema Version | Schema matches expected version for pipeline stage |
| QR-S10 | Reserved Word Check | No column names use reserved keywords |

### Row-Level Rules (15 rules)
| Rule ID | Rule Name | Description |
|---------|-----------|-------------|
| QR-R01 | Null Check | Required fields are non-null |
| QR-R02 | Range Check | Numeric values within valid range |
| QR-R03 | Pattern Match | String values match expected regex pattern |
| QR-R04 | Enum Validation | Categorical values within allowed set |
| QR-R05 | Date Range | Date values within valid temporal range |
| QR-R06 | String Length | String values within min/max length |
| QR-R07 | Numeric Precision | Decimal precision within specification |
| QR-R08 | Email Format | Email addresses match valid format |
| QR-R09 | Phone Format | Phone numbers match expected format |
| QR-R10 | Postal Code | Postal/ZIP codes valid for country |
| QR-R11 | Cross-Field | Conditional field validation (if A then B required) |
| QR-R12 | Calculated Field | Derived values match calculation formula |
| QR-R13 | Duplicate Detection | No unintended duplicate records by key |
| QR-R14 | Orphan Record | No child records without valid parent |
| QR-R15 | Temporal Sequence | Date fields maintain valid chronological order |

### Aggregate Rules (10 rules)
| Rule ID | Rule Name | Description |
|---------|-----------|-------------|
| QR-A01 | Row Count Threshold | Table row count within expected range |
| QR-A02 | Row Count Delta | Load-over-load row count change within tolerance |
| QR-A03 | Sum Reconciliation | Aggregate sums match source system totals |
| QR-A04 | Distribution Check | Value distributions within expected statistical range |
| QR-A05 | Freshness Check | Most recent record timestamp within SLA window |
| QR-A06 | Gap Detection | No unexpected gaps in time-series data |
| QR-A07 | Completeness Rate | Overall non-null rate meets dimension threshold |
| QR-A08 | Uniqueness Rate | Duplicate rate below acceptable threshold |
| QR-A09 | Referential Coverage | Foreign key coverage percentage meets threshold |
| QR-A10 | Cross-Table Balance | Related tables maintain referential balance |

### Business Rules (15+ rules — domain-specific)
Pre-built for common manufacturing scenarios:
- BOM level integrity (parent-child hierarchy valid)
- Work order status transitions (valid state machine)
- Production output vs. input material balance
- Quality inspection pass/fail rate thresholds
- Inventory quantity non-negative
- Cost roll-up accuracy (BOM cost vs. actual cost)

---

## Impact Metrics

| Metric | Baseline (No Accelerator) | With Accelerator | Savings |
|--------|--------------------------|-------------------|---------|
| Hours to create DQ standards | 50–80 hrs | 20–35 hrs | 30–45 hrs |
| Time to first draft | 2–4 weeks | 3–5 days | 2–3 weeks |
| Rule coverage (common patterns) | 40–60% (custom rules only) | 80–90% (library + custom) | Comprehensive baseline |
| Time to production monitoring | 4–8 weeks post-standards | 1–2 weeks post-standards | Faster value realization |

---

## Dependencies

- **ISL-02 (Metadata & Lineage):** Quality scores stored as metadata; lineage enables root cause analysis
- **ISL-03 (Naming Conventions):** Quality rule naming follows enterprise conventions
- **ISL-04 (Data Classification):** Quality SLA thresholds vary by classification tier (higher standards for Tier 3/4)
- **ISL-05 (Integration Patterns):** Medallion architecture quality gates reference quality rules between layers
- **Synapse-to-Fabric Data Validation (ACC-05 in S2F):** Fabric-specific quality implementation aligned to migration validation framework

---

## Directory Structure

```
data-quality/
├── README.md              ← This file
├── templates/
│   ├── quality-dimension-definitions.md
│   ├── quality-sla-framework.md
│   ├── quality-rule-library.md
│   ├── quality-monitoring-standards.md
│   ├── remediation-workflow.md
│   └── quality-scorecard-template.md
└── examples/
    ├── manufacturing-quality-rules.md
    ├── fabric-quality-implementation.md
    └── quality-dashboard-spec.md
```

---

*Module Owner: DMTSP Data Engineering Practice | Build Priority: Sprint 2 (Weeks 3–4)*

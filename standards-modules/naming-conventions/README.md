# ISL-03: Naming Convention Standards

**Module ID:** ISL-03
**Target:** Enterprise-wide naming conventions for data assets, pipelines, APIs, and infrastructure
**Productivity Gain:** 55–65% reduction in naming standards creation effort
**Build Effort:** Low (20–30 hours)
**Reusability:** Global — universally applicable with minimal adaptation

---

## Overview

Standardized naming convention framework covering databases, tables, columns, pipelines, notebooks, APIs, storage accounts, and infrastructure resources. While conceptually simple, naming standards are a perennial source of inconsistency and rework — practitioners spend 30–50 hours per engagement debating and documenting conventions that follow well-established patterns.

This module provides the definitive naming standard that eliminates subjective debates and ensures consistency across all DMTSP engagement deliverables. Every other standards module (ISL-01 through ISL-06) references these naming conventions, making this the foundational module of the library.

---

## How It Works

### Step 1: Review Client Existing Conventions
Identify any existing naming standards, de facto patterns in current assets, or organizational preferences. Common findings:
- No formal standard (most common — 70% of engagements)
- Partial standard covering databases only
- Conflicting standards across teams/departments
- Inherited vendor naming from ERP or BI tools

### Step 2: Select Convention Set
Choose the appropriate convention tier:
- **Fabric-Native:** Optimized for Microsoft Fabric lakehouse/warehouse/pipeline naming
- **Azure-Full:** Covers all Azure resources (aligned to Cloud Adoption Framework)
- **Platform-Agnostic:** Generic conventions for multi-cloud or hybrid environments

### Step 3: Customize Client-Specific Elements
Adapt the following elements per engagement:
- Organization abbreviation codes
- Business domain taxonomy (aligned to client org structure)
- Environment identifiers (dev/test/staging/prod — or client's own naming)
- Approved abbreviation dictionary

### Step 4: Deliver with Enforcement Tooling
Package conventions with optional enforcement mechanisms:
- Azure Policy definitions for resource naming
- Fabric workspace naming validation scripts
- CI/CD pipeline naming linters
- Pre-commit hooks for code repository naming

---

## Template Inventory

| Template | File | Description | Adaptation Effort |
|----------|------|-------------|-------------------|
| Database & Schema Naming | `templates/database-schema-naming.md` | Environment prefixes, domain classification, medallion layer indicators (bronze/silver/gold), Fabric lakehouse/warehouse patterns | 1–2 hours |
| Table & View Naming | `templates/table-view-naming.md` | Entity naming, temporal indicators (snapshot/current/historical), fact/dimension prefixes, staging table patterns | 2–3 hours |
| Column Naming Standards | `templates/column-naming-standards.md` | Data type suffixes, boolean prefixes (`is_`, `has_`), date format indicators (`_dt`, `_ts`), surrogate key conventions (`_sk`, `_bk`) | 1–2 hours |
| Pipeline & Dataflow Naming | `templates/pipeline-dataflow-naming.md` | Source-target encoding, frequency indicators (daily/hourly/event), version tracking, orchestration hierarchy | 2–3 hours |
| API & Endpoint Naming | `templates/api-endpoint-naming.md` | Resource naming (plural nouns), collection vs. singleton, query parameter conventions, webhook and event naming | 1–2 hours |
| Infrastructure Resource Naming | `templates/infrastructure-resource-naming.md` | Azure resource naming (aligned to CAF), Fabric workspace/capacity naming, environment encoding, region indicators | 1–2 hours |
| Abbreviation Dictionary | `templates/abbreviation-dictionary.md` | Standardized abbreviations (3–5 chars), prohibited abbreviations, domain-specific terminology, conflict resolution rules | 1–2 hours |

---

## Examples

| Example | File | Description |
|---------|------|-------------|
| Fabric Naming Reference | `examples/fabric-naming-reference.md` | Complete naming reference for all Fabric artifact types with concrete examples |
| Manufacturing Domain Names | `examples/manufacturing-domain-names.md` | Domain taxonomy and abbreviation dictionary for manufacturing clients (SAP modules, Epicor entities, IoT domains) |

---

## Fabric-Specific Naming Patterns

These patterns are included in the templates and represent the recommended Fabric naming standard:

### Workspace Naming
```
ws_{domain}_{purpose}_{env}
```
- `ws_manufacturing_analytics_prod`
- `ws_finance_reporting_dev`
- `ws_shared_ingestion_test`

### Lakehouse Naming
```
lh_{domain}_{layer}_{env}
```
- `lh_manufacturing_bronze_prod`
- `lh_manufacturing_silver_prod`
- `lh_manufacturing_gold_prod`

### Warehouse Naming
```
wh_{domain}_{purpose}_{env}
```
- `wh_manufacturing_serving_prod`
- `wh_finance_analytics_prod`

### Pipeline Naming
```
pl_{source}_{target}_{frequency}_{version}
```
- `pl_sap_bronze_daily_v1`
- `pl_epicor_bronze_hourly_v2`
- `pl_iot_bronze_streaming_v1`

### Notebook Naming
```
nb_{domain}_{process}_{type}
```
- `nb_manufacturing_transform_silver`
- `nb_quality_validation_gold`
- `nb_shared_utilities_common`

### Semantic Model Naming
```
sm_{domain}_{audience}_{version}
```
- `sm_manufacturing_operations_v1`
- `sm_finance_executive_v2`

### Table Naming (Lakehouse/Warehouse)
```
{layer_prefix}_{domain}_{entity}_{temporal}
```
- `brz_sap_material_master_full`
- `slv_manufacturing_work_order_current`
- `gld_finance_revenue_daily_snapshot`
- `dim_product`
- `fct_production_output`

---

## Impact Metrics

| Metric | Baseline (No Accelerator) | With Accelerator | Savings |
|--------|--------------------------|-------------------|---------|
| Hours to create naming standards | 30–50 hrs | 10–18 hrs | 20–32 hrs |
| Time to first draft | 1–2 weeks | 1–2 days | 1+ week |
| Downstream naming inconsistencies | Frequent (causes rework in Phases 2–3) | Rare (enforced from Day 1) | 10–20 hrs additional savings |
| Team onboarding time | 2–3 days to understand naming | <1 day with clear reference | Faster ramp-up |

---

## Dependencies

- **All ISL modules (ISL-01 through ISL-06):** Every module references naming conventions — this is the foundational module
- **Synapse-to-Fabric Accelerators:** Migration naming patterns for Fabric artifacts directly consume ISL-03
- **ACC-01 (Manufacturing Data Architecture Blueprints):** Reference architecture diagrams use ISL-03 naming

---

## Directory Structure

```
naming-conventions/
├── README.md              ← This file
├── templates/
│   ├── database-schema-naming.md
│   ├── table-view-naming.md
│   ├── column-naming-standards.md
│   ├── pipeline-dataflow-naming.md
│   ├── api-endpoint-naming.md
│   ├── infrastructure-resource-naming.md
│   └── abbreviation-dictionary.md
└── examples/
    ├── fabric-naming-reference.md
    └── manufacturing-domain-names.md
```

---

*Module Owner: DMTSP Enterprise Architecture Practice | Build Priority: Sprint 1 (Weeks 1–2)*

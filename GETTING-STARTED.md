# ISL Accelerator — Getting Started Guide

> For DMTSP engagement teams deploying integration standards at client sites.

---

## What You Have

55 production-ready templates, examples, and patterns across 6 standards modules. Each template is 250–800+ lines of substantive content with `[ADAPTATION REQUIRED]` markers where you customize for each client. Examples show completed deliverables for manufacturing/Fabric scenarios.

---

## Step 1: Understand the Module Map

| Module | ID | What It Covers | Deploy When |
|--------|----|---------------|-------------|
| **Naming Conventions** | ISL-03 | Database, table, column, pipeline, API, infrastructure naming | Every engagement (foundational) |
| **Data Classification** | ISL-04 | 4-tier sensitivity model, Purview labels, handling rules, access control | Every engagement (foundational) |
| **API Governance** | ISL-01 | REST design, security (OWASP), versioning, lifecycle, rate limiting | Engagements with API/integration scope |
| **Data Quality** | ISL-06 | 6 dimensions, 50+ rules, SLAs, monitoring, remediation | Every engagement with data pipelines |
| **Metadata & Lineage** | ISL-02 | Business glossary, technical metadata, lineage, catalog governance | Engagements with Purview/catalog scope |
| **Integration Patterns** | ISL-05 | 8 patterns (ERP, IoT, API, events, MDM, medallion, files, reverse ETL) | Engagements with integration architecture |

**Deployment order matters.** ISL-03 and ISL-04 are foundational — deploy them first. All other modules reference their conventions.

```
Week 1-2:  ISL-03 (Naming) → ISL-04 (Classification)
Week 2-3:  ISL-01 (API) and/or ISL-06 (Quality)     — can run in parallel
Week 3-4:  ISL-02 (Metadata) and/or ISL-05 (Patterns) — can run in parallel
```

---

## Step 2: Assess Client Context

Before opening any templates, answer these questions:

| # | Question | Drives |
|---|----------|--------|
| 1 | What is the client's primary platform? (Fabric, Azure, multi-cloud) | ISL-03 naming patterns, ISL-05 implementation guidance |
| 2 | What ERP systems are in use? (SAP, Epicor, D365, Oracle) | ISL-03 abbreviations, ISL-05 ERP extract patterns |
| 3 | Does the client have IoT/OT data? | ISL-04 IoT classification, ISL-05 IoT ingestion pattern |
| 4 | Is the client subject to ITAR/EAR export controls? | ISL-04 Tier 4 ITAR overlay, ISL-01 ITAR API controls |
| 5 | What regulations apply? (SOX, GDPR, CCPA, HIPAA, PCI-DSS) | ISL-04 compliance matrix, ISL-06 SLA thresholds |
| 6 | Does the client have existing naming standards? | ISL-03 adaptation scope |
| 7 | What catalog platform is in use? (Purview, Collibra, Alation) | ISL-02 integration patterns |
| 8 | What is the governance maturity level? (Ad hoc → Managed) | Determines depth of each module deployment |

---

## Step 3: Customize Templates

Every template has `[ADAPTATION REQUIRED]` markers. Here's how to work through them:

### 3.1 Open the Client Context Table

Every template starts with a parameter table like this:

```markdown
## [ADAPTATION REQUIRED] Client Context

| Parameter | Default Value | Client Value | Notes |
|-----------|---------------|--------------|-------|
| Organization Code | `org` | `[CLIENT_ORG_CODE]` | 2-4 letter abbreviation |
| Primary ERP | SAP / Epicor | `[CLIENT_ERP]` | Drives abbreviation set |
```

Fill in the **Client Value** column for each parameter. This is the fastest way to customize.

### 3.2 Search for All Markers

In your editor, search across the module for `[ADAPTATION REQUIRED]` to find every customization point. Typical markers include:
- Client-specific domain codes (ISL-03)
- Client-specific source systems (ISL-03)
- Client tier names and examples (ISL-04)
- Client retention periods (ISL-04)
- Client API platform (ISL-01)
- Client quality thresholds (ISL-06)

### 3.3 Use Examples as Reference

While customizing templates, open the corresponding examples side-by-side:

| Template You're Editing | Reference Example |
|------------------------|-------------------|
| ISL-03 `abbreviation-dictionary.md` | ISL-03 `examples/manufacturing-domain-names.md` |
| ISL-04 `classification-tier-definitions.md` | ISL-04 `examples/manufacturing-classification.md` |
| ISL-04 `access-control-alignment.md` | ISL-04 `examples/fabric-security-model.md` |
| ISL-01 `api-design-standards.md` | ISL-01 `examples/manufacturing-api-standards.md` |
| ISL-06 `quality-rule-library.md` | ISL-06 `examples/manufacturing-quality-rules.md` |
| ISL-02 `technical-metadata-schema.md` | ISL-02 `examples/fabric-onelake-metadata.md` |
| ISL-05 `medallion-architecture.md` | ISL-05 `diagrams/fabric-integration-architecture.md` |

---

## Step 4: Module-by-Module Walkthrough

### ISL-03 Naming Conventions (Start Here)

**Time estimate:** 10–18 hours to adapt

1. **Start with** `templates/abbreviation-dictionary.md` — this is the foundation. Define the client's domain codes, source system abbreviations, and environment names.
2. **Then adapt** each naming template in order:
   - `database-schema-naming.md` — lakehouse/warehouse patterns
   - `table-view-naming.md` — fact/dim/staging prefixes
   - `column-naming-standards.md` — data type suffixes, audit columns
   - `pipeline-dataflow-naming.md` — pipeline/notebook/dataflow patterns
   - `api-endpoint-naming.md` — REST URL patterns, webhook naming
   - `infrastructure-resource-naming.md` — Azure CAF resource naming
3. **Distribute** `examples/fabric-naming-reference.md` as the quick-reference guide for developers.

### ISL-04 Data Classification (Second Priority)

**Time estimate:** 25–40 hours to adapt

1. **Start with** `templates/classification-tier-definitions.md` — confirm the 4-tier model with client stakeholders. This is the most political deliverable — get buy-in early.
2. **Then adapt** in order:
   - `sensitivity-labeling-standards.md` — map to client's Purview labels
   - `data-handling-requirements.md` — per-tier storage/transmission/sharing rules
   - `access-control-alignment.md` — Entra ID groups, Fabric workspace roles
   - `compliance-mapping-matrix.md` — map client's regulatory obligations
   - `classification-decision-tree.md` — adapt last (references all above)
3. **Use** `examples/purview-label-configuration.md` as your Purview setup runbook.

### ISL-01 API Governance

**Time estimate:** 20–35 hours to adapt

1. **Start with** `templates/api-design-standards.md` — RESTful patterns, error formats
2. **Then** `api-security-standards.md` — align to client's auth model (OAuth, API keys, mTLS)
3. **Then** `api-versioning-policy.md`, `api-lifecycle-governance.md`, `api-catalog-requirements.md`, `rate-limiting-policy.md`

### ISL-06 Data Quality

**Time estimate:** 20–35 hours to adapt

1. **Start with** `templates/quality-dimension-definitions.md` — confirm 6 dimensions with client
2. **Then** `quality-sla-framework.md` — set thresholds per data tier (references ISL-04)
3. **Then** `quality-rule-library.md` — select applicable rules from the 50+ pre-built library (this is the most valuable artifact)
4. **Then** `quality-monitoring-standards.md`, `remediation-workflow.md`, `quality-scorecard-template.md`
5. **Use** `examples/fabric-quality-implementation.md` for PySpark notebook patterns

### ISL-02 Metadata & Lineage

**Time estimate:** 30–50 hours to adapt

1. **Start with** `templates/business-glossary-standards.md` — term templates, ownership model
2. **Then** `technical-metadata-schema.md` — attribute schemas for all asset types
3. **Then** `data-lineage-requirements.md`, `data-catalog-governance.md`, `metadata-integration-patterns.md`, `lineage-visualization-standards.md`
4. **Use** `examples/purview-configuration-guide.md` as your Purview setup runbook

### ISL-05 Integration Patterns

**Time estimate:** 30–45 hours to select and adapt

1. **Start with** `patterns/medallion-architecture.md` — foundational for all Fabric work
2. **Use** `diagrams/pattern-decision-tree.md` to select which other patterns apply
3. **Adapt selected patterns** from: `erp-extract-load.md`, `iot-ot-ingestion.md`, `file-based-integration.md`, `api-gateway-integration.md`, `event-driven-architecture.md`, `master-data-synchronization.md`, `reverse-etl.md`
4. **Deliver** `diagrams/integration-landscape-overview.md` as the client's integration architecture view

---

## Step 5: Deliver to Client

### Package Structure

Deliver a customized copy with:
- All `[ADAPTATION REQUIRED]` markers filled in with client values
- Non-applicable modules/sections removed (e.g., ITAR sections for non-defense clients)
- Client branding applied (org name, logo in headers)
- Manufacturing Overlay sections included/excluded based on industry

### Handoff Checklist

- [ ] All `[ADAPTATION REQUIRED]` markers resolved (search confirms zero remaining)
- [ ] Client org code and domain taxonomy defined in ISL-03
- [ ] Classification tiers reviewed and approved by client stakeholders
- [ ] Quality rule library reviewed — inapplicable rules removed, client-specific rules added
- [ ] Cross-references verified (ISL-01 through ISL-06 links resolve)
- [ ] Examples customized or replaced with client-specific scenarios
- [ ] Purview/Fabric configuration validated against client's environment

---

## Repository Structure

```
integration-standards-library/
├── GETTING-STARTED.md              ← You are here
├── standards-modules/
│   ├── naming-conventions/         (ISL-03)
│   │   ├── templates/              7 templates
│   │   └── examples/               2 examples
│   ├── data-classification/        (ISL-04)
│   │   ├── templates/              6 templates
│   │   └── examples/               3 examples
│   ├── api-governance/             (ISL-01)
│   │   ├── templates/              6 templates
│   │   └── examples/               2 examples
│   ├── data-quality/               (ISL-06)
│   │   ├── templates/              6 templates
│   │   └── examples/               3 examples
│   ├── metadata-lineage/           (ISL-02)
│   │   ├── templates/              6 templates
│   │   └── examples/               3 examples
│   └── integration-patterns/       (ISL-05)
│       ├── patterns/               8 patterns
│       └── diagrams/               3 diagrams
└── design/                         Planning artifacts
```

---

## Quick Reference: Key Files

| Need | Go To |
|------|-------|
| Start a new engagement | This guide → Step 2 |
| Define client naming conventions | `naming-conventions/templates/abbreviation-dictionary.md` |
| Set up data classification | `data-classification/templates/classification-tier-definitions.md` |
| See what a completed deliverable looks like | Any file in an `examples/` folder |
| Find a specific quality rule | `data-quality/templates/quality-rule-library.md` (search by QR-xxx) |
| Choose integration patterns | `integration-patterns/diagrams/pattern-decision-tree.md` |
| Configure Purview | `data-classification/examples/purview-label-configuration.md` |
| Configure Fabric security | `data-classification/examples/fabric-security-model.md` |
| See all Fabric naming patterns | `naming-conventions/examples/fabric-naming-reference.md` |

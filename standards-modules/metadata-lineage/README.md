# ISL-02: Metadata & Data Lineage Framework

**Module ID:** ISL-02
**Target:** Enterprise metadata management, data lineage tracking, and data catalog standards
**Productivity Gain:** 60–70% reduction in metadata standards creation effort
**Build Effort:** High (60–80 hours)
**Reusability:** Global — highest reuse potential across portfolio

---

## Overview

Comprehensive metadata management framework covering business glossary standards, technical metadata schemas, data lineage capture requirements, and catalog governance. This is typically the most complex standards deliverable in Phase 4 and represents the highest per-engagement savings.

Metadata and lineage standards are foundational to every subsequent data initiative — without them, Fabric migrations, Power BI semantic models, and AI/ML pipelines operate without traceability. This module provides a complete, production-ready framework pre-aligned to Microsoft Purview, Fabric OneLake metadata models, and common catalog platforms (Collibra, Alation, Informatica).

---

## How It Works

### Step 1: Inventory Client Metadata Landscape
Catalog existing metadata sources, tools, and practices. Common patterns:
- Microsoft Purview (deployed but under-configured)
- Manual Excel-based data dictionaries
- Tribal knowledge with no formal documentation
- Partial lineage from ETL tool metadata (ADF, Informatica)

### Step 2: Assess Maturity Level
Use the Governance Maturity Assessment Framework (ACC-04) to determine starting point:
- **Level 1 (Ad Hoc):** No formal metadata management → deploy full framework
- **Level 2 (Reactive):** Some documentation exists → gap analysis and augmentation
- **Level 3 (Defined):** Policies exist but inconsistently enforced → standardize and automate
- **Level 4 (Managed):** Active governance → optimize and extend

### Step 3: Select & Adapt Templates
Configure templates based on:
- Catalog platform (Purview, Collibra, Alation, Informatica)
- Lineage granularity requirements (column-level, table-level, pipeline-level)
- Regulatory drivers (SOX requires financial data lineage, GDPR requires PII lineage)
- Industry-specific metadata extensions (IoT sensor registries, ERP cross-references)

### Step 4: Define Governance Operating Model
Establish roles, processes, and tooling:
- Data steward responsibilities and assignments
- Curation and approval workflows
- Quality scoring and certification processes
- Automated metadata ingestion schedules

### Step 5: Deliver with Adoption Roadmap
Package standards with phased adoption plan:
- Phase A: Technical metadata automation (low effort, high visibility)
- Phase B: Business glossary curation (medium effort, stakeholder engagement)
- Phase C: Lineage capture and visualization (high effort, regulatory value)

---

## Template Inventory

| Template | File | Description | Adaptation Effort |
|----------|------|-------------|-------------------|
| Business Glossary Standards | `templates/business-glossary-standards.md` | Term definition templates, ownership model, approval workflow, cross-domain disambiguation, synonym/homonym handling | 4–6 hours |
| Technical Metadata Schema | `templates/technical-metadata-schema.md` | Standard attributes for tables, columns, pipelines, reports — aligned to Purview/Unity Catalog/OpenMetadata | 6–10 hours |
| Data Lineage Requirements | `templates/data-lineage-requirements.md` | Capture granularity, automated vs. manual lineage, tool requirements, visualization standards | 4–6 hours |
| Data Catalog Governance | `templates/data-catalog-governance.md` | Curation workflow, quality scoring, stewardship assignments, search/discovery standards, certification process | 3–5 hours |
| Metadata Integration Patterns | `templates/metadata-integration-patterns.md` | Ingestion patterns for Purview, Collibra, Alation — connector configs, sync schedules, conflict resolution | 4–8 hours |
| Lineage Visualization Standards | `templates/lineage-visualization-standards.md` | Rendering requirements, impact analysis workflows, regulatory reporting lineage (SOX, GDPR), drill-down levels | 2–4 hours |

---

## Examples

| Example | File | Description |
|---------|------|-------------|
| Manufacturing Metadata Model | `examples/manufacturing-metadata-model.md` | Metadata standards for dual-ERP (SAP/Epicor) environment with IoT sensor registries, BOM lineage, and welding process data |
| Fabric OneLake Metadata | `examples/fabric-onelake-metadata.md` | Technical metadata schema specifically for Fabric lakehouses, warehouses, pipelines, and semantic models |
| Purview Configuration Guide | `examples/purview-configuration-guide.md` | Step-by-step Purview setup aligned to the metadata standards — collections, classifications, glossary import, lineage connectors |

---

## Impact Metrics

| Metric | Baseline (No Accelerator) | With Accelerator | Savings |
|--------|--------------------------|-------------------|---------|
| Hours to create metadata & lineage standards | 100–160 hrs | 30–50 hrs | 70–110 hrs |
| Time to first draft | 4–6 weeks | 1–2 weeks | 3–4 weeks |
| Coverage completeness (metadata attributes) | 60–75% (typical gaps) | 90–95% (pre-validated) | Significant quality gain |
| Regulatory audit readiness | 3–6 months post-delivery | Immediate upon adoption | Accelerated compliance |

---

## Manufacturing-Specific Extensions

These extensions are included as overlays within the templates and can be activated based on client context:

### IoT/OT Metadata Standards
- Telemetry stream metadata (sensor ID, frequency, unit of measure, calibration date)
- Edge device registry (device type, firmware version, location, connectivity status)
- OT system catalog (SCADA, PLC, DCS system metadata, protocol types)

### ERP Metadata Mapping
- SAP MDG ↔ Fabric cross-reference standards (material master, vendor master, customer master)
- Epicor ↔ Fabric mapping standards (BAQ definitions, BPM metadata, dashboard sources)
- Dual-ERP disambiguation rules (same entity, different systems, golden record identification)

### Product Data Management
- PLM/PDM integration metadata (part numbers, revision history, engineering change orders)
- Bill of Materials (BOM) lineage — multi-level BOM explosion and data flow tracking
- Quality data metadata (inspection results, SPC measurements, non-conformance reports)

---

## Dependencies

- **ISL-03 (Naming Conventions):** Metadata asset naming follows enterprise naming standards
- **ISL-04 (Data Classification):** Classification labels applied as metadata attributes
- **ISL-06 (Data Quality):** Quality scores stored as metadata; quality rules reference metadata schema
- **ACC-04 (Governance Maturity Assessment):** Maturity level determines metadata governance depth
- **ACC-05 (Microsoft Fabric Migration Toolkit):** Fabric-specific metadata patterns for OneLake taxonomy

---

## Directory Structure

```
metadata-lineage/
├── README.md              ← This file
├── templates/
│   ├── business-glossary-standards.md
│   ├── technical-metadata-schema.md
│   ├── data-lineage-requirements.md
│   ├── data-catalog-governance.md
│   ├── metadata-integration-patterns.md
│   └── lineage-visualization-standards.md
└── examples/
    ├── manufacturing-metadata-model.md
    ├── fabric-onelake-metadata.md
    └── purview-configuration-guide.md
```

---

*Module Owner: DMTSP Data Governance Practice | Build Priority: Sprint 3 (Weeks 5–8)*

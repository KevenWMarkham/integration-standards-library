# Integration Standards Library — DMTSP Accelerator Buildout

**Prepared by:** Keven Markham, VP Enterprise Transformation — DMTSP
**Date:** February 6, 2026
**Accelerator ID:** ACC-03 (Integration Standards Library)
**Status:** Buildout — Active Development

---

## Executive Summary

Enterprise Data Architecture & Integration Standards engagements are becoming a high-frequency pattern across the DMTSP account portfolio — particularly for industrial clients navigating dual-ERP environments, Microsoft Fabric migrations, and IoT/OT data convergence. Phase 4 (Standards Definition) consistently represents 500–700 hours of effort per engagement, with practitioners repeatedly building governance artifacts, naming conventions, and classification frameworks from scratch.

The **Integration Standards Library** is a reusable collection of pre-built integration standards modules covering API governance, metadata lineage, naming conventions, data classification, integration patterns, and data quality. Rather than authoring standards net-new on each engagement, practitioners adapt proven templates to client-specific context — reducing Phase 4 delivery effort by **30–40%** (150–200 hours per engagement) and improving consistency across the portfolio.

This accelerator directly supports the engagement framework used for clients such as Lincoln Electric, where the 4-phase architecture engagement (Discovery → Architecture → Roadmap → Standards) benefits from pre-validated standards artifacts that compress delivery timelines from 12–16 weeks to 9–12 weeks.

**Key Metrics:**
- **Per-engagement savings:** 150–200 hours (30–40% reduction in Phase 4)
- **Cross-phase impact:** 60–100 additional hours saved in Phases 1–3 through standards-informed discovery and architecture
- **Total engagement impact:** 210–300 hours saved across all phases
- **Build investment:** 200–300 hours of senior practitioner time
- **Payback:** Fully amortized by engagement 2; net positive from engagement 1

---

## Engagement Framework Context

The Integration Standards Library is designed to accelerate the standard 4-phase Enterprise Data Architecture engagement pattern:

| Phase | Description | Baseline Hours | Standards Library Impact | Accelerated Hours |
|-------|-------------|---------------|------------------------|-------------------|
| **P1** | Discovery & Assessment | 900–1,240 | Assessment templates, maturity scorecards | 780–1,060 |
| **P2** | Reference Architecture | 900–1,240 | Pattern library pre-populates integration layer design | 800–1,100 |
| **P3** | Roadmap Creation | 660–880 | Standards gaps pre-identified, roadmap items pre-drafted | 620–820 |
| **P4** | Standards Definition | 500–700 | Core accelerator — templates adapted vs. built from scratch | 350–500 |
| **PM** | Cross-Phase Governance | 648–864 | Standardized RACI, review cadences, approval workflows | 598–804 |
| | **Total** | **3,608–4,924** | | **3,148–4,284** |

**Net Savings: 460–640 hours ($92K–$128K at $200/hr blended rate)**

---

## Standards Module 1: API Governance Standards

**Module ID:** ISL-01
**Target:** API design, lifecycle management, and integration contract governance
**Build Effort:** Medium (40–60 hours)
**Reusability:** Global — applicable across all DMTSP engagements with API/integration scope

### Overview

Pre-built API governance framework covering design standards, versioning policies, security requirements, rate limiting, and lifecycle management. Provides a complete governance structure that practitioners customize to client technology stack (REST, GraphQL, event-driven) and organizational maturity.

### Module Contents

| Artifact | Description | Adaptation Effort |
|----------|-------------|-------------------|
| API Design Standards Document | RESTful design principles, naming conventions, HTTP method usage, error response formats, pagination patterns | 4–6 hours |
| API Versioning Policy | URL vs. header versioning, deprecation timelines, backward compatibility requirements | 2–3 hours |
| API Security Standards | OAuth 2.0/OIDC patterns, API key management, mTLS requirements, OWASP API Top 10 alignment | 4–8 hours |
| API Lifecycle Governance | Design review gates, publishing approval workflow, deprecation process, consumer notification SLAs | 3–5 hours |
| API Catalog Requirements | Metadata schema for API registry, discovery requirements, developer portal standards | 2–4 hours |
| Rate Limiting & Throttling Policy | Tier definitions, quota management, burst handling, consumer SLA tiers | 2–3 hours |

### Impact

- **Baseline effort (from scratch):** 80–120 hours to create API governance standards
- **With accelerator:** 20–35 hours to adapt templates to client context
- **Productivity gain:** 60–85 hours saved (55–70% reduction)
- **Quality improvement:** Standards pre-validated against OWASP, Microsoft API Guidelines, and industry best practices

### Client Adaptation Points

- Technology stack alignment (Azure API Management, MuleSoft, Apigee, Kong)
- Industry-specific compliance overlays (HIPAA, SOX, ITAR for manufacturing)
- Organizational maturity calibration (crawl/walk/run adoption tiers)
- Integration with existing API management tooling

---

## Standards Module 2: Metadata & Data Lineage Framework

**Module ID:** ISL-02
**Target:** Enterprise metadata management, data lineage tracking, and data catalog standards
**Build Effort:** High (60–80 hours)
**Reusability:** Global — highest reuse potential across portfolio

### Overview

Comprehensive metadata management framework covering business glossary standards, technical metadata schemas, data lineage capture requirements, and catalog governance. This is typically the most complex standards deliverable in Phase 4 and represents the highest per-engagement savings.

### Module Contents

| Artifact | Description | Adaptation Effort |
|----------|-------------|-------------------|
| Business Glossary Standards | Term definition templates, ownership model, approval workflow, cross-domain disambiguation rules | 4–6 hours |
| Technical Metadata Schema | Standard attributes for tables, columns, pipelines, reports — aligned to Microsoft Purview/Unity Catalog | 6–10 hours |
| Data Lineage Requirements | Capture granularity (column-level vs. table-level), automated vs. manual lineage, tool requirements | 4–6 hours |
| Data Catalog Governance | Curation workflow, quality scoring, stewardship assignments, search/discovery standards | 3–5 hours |
| Metadata Integration Patterns | Ingestion patterns for Purview, Collibra, Alation, Informatica — connector configurations and sync schedules | 4–8 hours |
| Lineage Visualization Standards | Rendering requirements, impact analysis workflows, regulatory reporting lineage (SOX, GDPR) | 2–4 hours |

### Impact

- **Baseline effort (from scratch):** 100–160 hours to create metadata & lineage standards
- **With accelerator:** 30–50 hours to adapt templates to client context
- **Productivity gain:** 70–110 hours saved (60–70% reduction)
- **Quality improvement:** Pre-aligned to Microsoft Purview taxonomy, Fabric OneLake metadata model, and common catalog platforms

### Manufacturing-Specific Extensions

- IoT/OT metadata standards (telemetry streams, sensor registries, edge device catalogs)
- ERP metadata mapping (SAP MDG ↔ Fabric, Epicor ↔ Fabric cross-reference standards)
- Product data management (PLM/PDM integration metadata, BOM lineage)
- Welding/manufacturing process data classification (real-time vs. batch, quality vs. operational)

---

## Standards Module 3: Naming Convention Standards

**Module ID:** ISL-03
**Target:** Enterprise-wide naming conventions for data assets, pipelines, APIs, and infrastructure
**Build Effort:** Low (20–30 hours)
**Reusability:** Global — universally applicable with minimal adaptation

### Overview

Standardized naming convention framework covering databases, tables, columns, pipelines, notebooks, APIs, storage accounts, and infrastructure resources. While conceptually simple, naming standards are a perennial source of inconsistency and rework — practitioners spend 30–50 hours per engagement debating and documenting conventions that follow well-established patterns.

### Module Contents

| Artifact | Description | Adaptation Effort |
|----------|-------------|-------------------|
| Database & Schema Naming | Environment prefixes, domain classification, medallion layer indicators (bronze/silver/gold) | 1–2 hours |
| Table & View Naming | Entity naming, temporal indicators, snapshot vs. current, fact/dimension prefixes | 2–3 hours |
| Column Naming Standards | Data type suffixes, boolean prefixes, date format indicators, surrogate key conventions | 1–2 hours |
| Pipeline & Dataflow Naming | Source-target encoding, frequency indicators, version tracking, orchestration hierarchy | 2–3 hours |
| API & Endpoint Naming | Resource naming, collection vs. singleton, query parameter conventions, webhook naming | 1–2 hours |
| Infrastructure Resource Naming | Azure resource naming (aligned to CAF), Fabric workspace/capacity naming, environment encoding | 1–2 hours |
| Abbreviation Dictionary | Standardized abbreviations, prohibited abbreviations, domain-specific terminology | 1–2 hours |

### Impact

- **Baseline effort (from scratch):** 30–50 hours to create naming convention standards
- **With accelerator:** 10–18 hours to adapt templates to client context
- **Productivity gain:** 20–32 hours saved (55–65% reduction)
- **Downstream benefit:** Consistent naming reduces confusion in Phases 1–3, saving an additional 10–20 hours in architecture and roadmap deliverables

### Fabric-Specific Naming Patterns

- Lakehouse naming: `lh_{domain}_{layer}_{env}` (e.g., `lh_manufacturing_gold_prod`)
- Warehouse naming: `wh_{domain}_{purpose}_{env}`
- Pipeline naming: `pl_{source}_{target}_{frequency}_{version}`
- Notebook naming: `nb_{domain}_{process}_{type}`
- Semantic model naming: `sm_{domain}_{audience}_{version}`

---

## Standards Module 4: Data Classification & Sensitivity Framework

**Module ID:** ISL-04
**Target:** Data classification tiers, sensitivity labeling, handling requirements, and compliance alignment
**Build Effort:** Medium (40–60 hours)
**Reusability:** Global — with industry-specific compliance overlays

### Overview

Data classification framework defining sensitivity tiers, labeling requirements, handling rules, and access control alignment. Pre-mapped to Microsoft Purview Information Protection labels and Azure security controls. Includes manufacturing-specific extensions for trade secrets, process IP, and export-controlled data (ITAR/EAR).

### Module Contents

| Artifact | Description | Adaptation Effort |
|----------|-------------|-------------------|
| Classification Tier Definitions | 4-tier model (Public, Internal, Confidential, Restricted) with clear criteria and examples | 3–5 hours |
| Sensitivity Labeling Standards | Microsoft Purview label taxonomy, auto-labeling rules, manual labeling guidelines | 4–6 hours |
| Data Handling Requirements | Per-tier rules for storage, transmission, sharing, retention, and disposal | 3–5 hours |
| Access Control Alignment | Role-based access patterns per classification tier, Entra ID group mapping, Fabric workspace RBAC | 4–8 hours |
| Compliance Mapping Matrix | Classification-to-regulation mapping (SOX, GDPR, CCPA, ITAR, HIPAA) with control requirements | 4–6 hours |
| Classification Decision Tree | Flowchart for data stewards to consistently classify new data assets | 2–3 hours |

### Impact

- **Baseline effort (from scratch):** 60–100 hours to create data classification standards
- **With accelerator:** 25–40 hours to adapt templates to client context
- **Productivity gain:** 35–60 hours saved (50–60% reduction)
- **Risk reduction:** Pre-validated compliance mappings reduce regulatory exposure and audit findings

### Manufacturing Industry Overlays

- **ITAR/EAR compliance:** Export-controlled technical data classification, access restrictions for non-US persons
- **Trade secret protection:** Welding process parameters, alloy compositions, proprietary manufacturing methods
- **IoT/OT data sensitivity:** Operational technology data classification (safety-critical vs. operational vs. analytical)
- **Supply chain data:** Vendor pricing, sourcing strategies, contractual terms classification

---

## Standards Module 5: Integration Pattern Library

**Module ID:** ISL-05
**Target:** Reusable integration architecture patterns for common enterprise data flows
**Build Effort:** High (60–80 hours)
**Reusability:** High — patterns are technology-agnostic with platform-specific implementation guides

### Overview

Library of pre-documented integration patterns covering ERP-to-lakehouse, IoT ingestion, API orchestration, event-driven architectures, and batch/real-time hybrid flows. Each pattern includes architecture diagrams, decision criteria, anti-patterns, and implementation guidance for Microsoft Fabric and Azure. Directly accelerates Phase 2 (Reference Architecture) and Phase 4 (Standards Definition).

### Module Contents

| Pattern | Description | Applicability |
|---------|-------------|---------------|
| ERP Extract & Load | Batch extraction from SAP/Epicor via ADF/Fabric pipelines, CDC patterns, delta detection | Universal — every manufacturing client |
| IoT/OT Ingestion | Real-time telemetry ingestion via Event Hubs/IoT Hub to Fabric lakehouse, edge processing patterns | Clients with connected devices, OT systems |
| API Gateway Integration | Request/response patterns, API composition, backend-for-frontend, service mesh integration | Clients with API-first strategy |
| Event-Driven Architecture | Event sourcing, CQRS, pub/sub patterns using Event Hubs/Service Bus with Fabric Eventstreams | Clients requiring real-time analytics |
| Master Data Synchronization | Golden record patterns, cross-system MDM, conflict resolution, bi-directional sync | Dual-ERP and multi-system clients |
| File-Based Integration | SFTP/ADLS drop zones, file validation, schema enforcement, error handling patterns | Legacy system integration |
| Medallion Architecture | Bronze/Silver/Gold layer standards, transformation rules, quality gates between layers | All Fabric-based architectures |
| Reverse ETL | Lakehouse-to-operational system patterns, API-based writeback, embedded analytics delivery | Clients requiring operational analytics |

### Impact

- **Phase 2 acceleration:** 40–60 hours saved by starting with pre-documented patterns vs. blank-page architecture
- **Phase 4 acceleration:** 20–30 hours saved with pre-defined integration standards per pattern
- **Total productivity gain:** 60–90 hours saved (35–45% reduction across Phases 2 and 4)
- **Quality improvement:** Patterns include anti-patterns and failure modes from prior engagements

### Decision Framework

Each pattern includes a decision matrix evaluating:
- Data volume and velocity requirements
- Latency tolerance (real-time, near-real-time, batch)
- Source system capabilities (API, CDC, file export)
- Security and compliance constraints
- Operational complexity and team skill requirements

---

## Standards Module 6: Data Quality Standards

**Module ID:** ISL-06
**Target:** Data quality dimensions, measurement frameworks, SLA definitions, and remediation workflows
**Build Effort:** Medium (30–50 hours)
**Reusability:** Global — with domain-specific quality rule libraries

### Overview

Data quality standards framework covering quality dimensions (completeness, accuracy, timeliness, consistency, validity, uniqueness), measurement methodologies, SLA thresholds, monitoring requirements, and remediation workflows. Pre-aligned to Fabric data quality features and common quality tools (Great Expectations, dbt tests, Informatica DQ).

### Module Contents

| Artifact | Description | Adaptation Effort |
|----------|-------------|-------------------|
| Quality Dimension Definitions | Six core dimensions with measurement methodologies and calculation formulas | 2–3 hours |
| Quality SLA Framework | Per-dimension thresholds by data tier (critical, standard, informational), escalation rules | 3–5 hours |
| Quality Rule Library | 50+ pre-built quality rules covering common data issues (nulls, duplicates, referential integrity, format validation) | 4–8 hours |
| Quality Monitoring Standards | Dashboard requirements, alerting thresholds, trending analysis, executive reporting templates | 3–5 hours |
| Remediation Workflow | Issue triage, root cause analysis templates, fix-forward vs. fix-backward decision criteria | 2–4 hours |
| Quality Scorecard Template | Domain-level and enterprise-level quality scoring with RAG status and trend indicators | 2–3 hours |

### Impact

- **Baseline effort (from scratch):** 50–80 hours to create data quality standards
- **With accelerator:** 20–35 hours to adapt templates to client context
- **Productivity gain:** 30–45 hours saved (50–60% reduction)
- **Downstream benefit:** Quality standards defined in Phase 4 reduce SIT/UAT rework in subsequent implementation phases

---

## Accelerator Summary

| Module | ID | Build Effort | Per-Engagement Savings | Reduction % | Reusability |
|--------|----|-------------|----------------------|-------------|-------------|
| API Governance Standards | ISL-01 | 40–60 hrs | 60–85 hrs | 55–70% | Global |
| Metadata & Lineage Framework | ISL-02 | 60–80 hrs | 70–110 hrs | 60–70% | Global |
| Naming Convention Standards | ISL-03 | 20–30 hrs | 20–32 hrs | 55–65% | Global |
| Data Classification Framework | ISL-04 | 40–60 hrs | 35–60 hrs | 50–60% | Global + Industry |
| Integration Pattern Library | ISL-05 | 60–80 hrs | 60–90 hrs | 35–45% | High |
| Data Quality Standards | ISL-06 | 30–50 hrs | 30–45 hrs | 50–60% | Global |
| **Total** | | **250–360 hrs** | **275–422 hrs** | **~50%** | |

---

## Investment & ROI

### Build Investment

| Item | Hours | Cost (at $250/hr senior rate) |
|------|-------|------------------------------|
| Standards Module Development (6 modules) | 200–300 | $50K–$75K |
| Manufacturing Industry Overlays | 30–40 | $7.5K–$10K |
| Peer Review & Quality Assurance | 20–30 | $5K–$7.5K |
| Template Formatting & Packaging | 10–15 | $2.5K–$3.75K |
| **Total Build Investment** | **260–385** | **$65K–$96K** |

### Per-Engagement ROI

| Metric | Value |
|--------|-------|
| Hours saved per engagement | 275–422 |
| Cost savings per engagement (at $200/hr blended) | $55K–$84K |
| Timeline compression | 3–4 weeks (12–16 wk → 9–12 wk) |
| Quality improvement | Pre-validated against industry standards and compliance frameworks |
| Payback period | 1–2 engagements (break-even at engagement 1 in best case) |

### Portfolio Impact (3-Year Projection)

| Year | Engagements | Cumulative Hours Saved | Cumulative Cost Impact |
|------|-------------|----------------------|----------------------|
| FY27 | 2–3 | 550–1,266 | $110K–$253K |
| FY28 | 4–6 | 1,650–3,798 | $330K–$760K |
| FY29 | 6–9 | 3,300–7,596 | $660K–$1.52M |

---

## Project Structure

This repository follows the DMTSP accelerator buildout pattern established in the [Synapse-to-Fabric Accelerator](../synapse-to-fabric/) project:

```
integration-standards-library/
├── Integration_Standards_Library_DMTSP_Buildout.md    ← This document
├── standards-modules/
│   ├── api-governance/                                ← ISL-01
│   │   ├── README.md
│   │   ├── templates/
│   │   └── examples/
│   ├── metadata-lineage/                              ← ISL-02
│   │   ├── README.md
│   │   ├── templates/
│   │   └── examples/
│   ├── naming-conventions/                            ← ISL-03
│   │   ├── README.md
│   │   ├── templates/
│   │   └── examples/
│   ├── data-classification/                           ← ISL-04
│   │   ├── README.md
│   │   ├── templates/
│   │   └── examples/
│   ├── integration-patterns/                          ← ISL-05
│   │   ├── README.md
│   │   ├── patterns/
│   │   └── diagrams/
│   ├── data-quality/                                  ← ISL-06
│   │   ├── README.md
│   │   ├── templates/
│   │   └── examples/
│   └── index.html                                     ← Web UI (sprint tracker)
└── index.html                                         ← Project landing page
```

---

## Risk Considerations

### Build Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Standards too generic — require heavy adaptation | Medium | Medium | Include manufacturing-specific overlays and concrete examples from prior engagements |
| Technology drift — standards reference outdated tooling | Low | High | Version standards with platform release alignment (Fabric GA cadence, Purview updates) |
| Practitioner adoption — teams build from scratch despite library | Medium | High | Embed in engagement kickoff process; mandate library review before Phase 4 start |
| Compliance gaps — missing regulatory requirements | Low | High | External review against NIST, ISO 27001, and industry-specific frameworks |

### Engagement Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Client has existing standards that conflict | Medium | Low | Discovery questions (Q18–Q22) identify existing policies; adapt rather than replace |
| Client organizational maturity too low for full standards adoption | Medium | Medium | Crawl/Walk/Run adoption tiers built into each module |
| Scope creep — standards expansion beyond agreed deliverables | High | Medium | Fixed module scope with clear "included/excluded" boundaries per SOW |

---

## Dependencies & Integration Points

- **Synapse-to-Fabric Accelerators:** Naming conventions (ISL-03) and integration patterns (ISL-05) directly referenced by Fabric migration engagements
- **Governance Maturity Assessment Framework (ACC-04):** Maturity scorecards inform which standards modules to prioritize per engagement
- **RFP Discovery Questionnaire Tool (ACC-02):** Questions Q18–Q22 (existing docs, assessments, standards) validate accelerator applicability and identify adaptation requirements
- **Manufacturing Data Architecture Blueprints (ACC-01):** Reference architectures consume integration patterns from ISL-05 and naming conventions from ISL-03
- **Microsoft Fabric Migration Toolkit (ACC-05):** Fabric-specific naming patterns and metadata standards align to OneLake taxonomy

---

## Next Steps

1. **Sprint 1 (Weeks 1–2):** Build ISL-03 (Naming Conventions) and ISL-04 (Data Classification) — lowest effort, highest standalone value
2. **Sprint 2 (Weeks 3–4):** Build ISL-01 (API Governance) and ISL-06 (Data Quality) — medium effort, broad applicability
3. **Sprint 3 (Weeks 5–8):** Build ISL-02 (Metadata & Lineage) and ISL-05 (Integration Patterns) — highest effort, deepest impact
4. **Sprint 4 (Weeks 9–10):** Manufacturing overlays, peer review, packaging, and pilot deployment on next engagement

---

*Prepared by Keven Markham, VP Enterprise Transformation — DMTSP | February 6, 2026 | CONFIDENTIAL — INTERNAL USE ONLY*

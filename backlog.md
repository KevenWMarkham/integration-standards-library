# Integration Standards Library — Reusable Product Backlog

**Version:** 1.0
**Author:** Keven Markham, VP Enterprise Transformation — DMTSP
**Date:** February 6, 2026
**Reusability:** Internal buildout — this backlog manages the one-time creation of the ISL accelerator. The resulting templates are then deployed globally across engagements.
**Related Documents:**
- [Roadmap](roadmap.md) — Strategic phases and rationale
- [Orchestrator](design/orchestrator_integration_standards.md) — Sprint-by-sprint execution plan
- [Buildout Recommendation](Integration_Standards_Library_DMTSP_Buildout.md) — Accelerator overview and ROI analysis

---

## Backlog Overview

| Metric | Value |
|--------|-------|
| Epics | 5 (E0–E4) |
| Stories | 18 |
| Total Build Scope | 6 modules, 39 templates, 16 examples |
| Total Build Hours | ~310–440 |
| Sprint Range | 0–4 |

### Priority Legend

| Priority | Meaning |
|----------|---------|
| **P0** | Blocker — must complete before any downstream module |
| **P1** | Critical — on the sprint critical path |
| **P2** | Important — needed for sprint completion |
| **P3** | Nice-to-have — can slip to next sprint if needed |

### Effort Scale

| Size | Hours | Example |
|------|-------|---------|
| XS | 1–8 | Abbreviation dictionary, single template |
| S | 9–20 | Naming conventions module, quality scorecard |
| M | 21–50 | API governance module, data quality module |
| L | 51–80 | Metadata/lineage framework, integration patterns |
| XL | 81+ | Full module + manufacturing overlays |

---

## Dependency Graph

```
E0: Discovery & Baseline (Sprint 0)
  │
  └──► E1: Foundation Modules (Sprint 1)
         │
         ├── ISL-03: Naming Conventions ◄── Foundation for all modules
         │     │
         │     └──► ISL-04: Data Classification ◄── References ISL-03 naming
         │
         └──► E2: Core Modules (Sprint 2)
                │
                ├── ISL-01: API Governance ◄── ISL-03, ISL-04
                │
                └── ISL-06: Data Quality ◄── ISL-03, ISL-04
                      │
                      └──► E3: Advanced Modules (Sprint 3)
                             │
                             ├── ISL-02: Metadata & Lineage ◄── ISL-03, ISL-04, ISL-06
                             │
                             └── ISL-05: Integration Patterns ◄── ISL-01, ISL-03, ISL-04, ISL-06
                                   │
                                   └──► E4: Packaging & Pilot (Sprint 4) ◄── All modules
```

---

## Epic E0: Discovery & Baseline

**Sprint:** 0 (Pre-Sprint, 1 week) | **Total Hours:** ~40 | **Roadmap:** [Phase 0](roadmap.md#4-phase-0-discovery--baseline)

### E0-S1: Prior Engagement Audit

| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Effort** | S (20 hrs) |
| **Sprint** | 0 |
| **Owner** | Lead Architect |
| **Depends On** | Access to 2–3 completed Phase 4 deliverables |
| **Acceptance Criteria** | Common patterns extracted; engagement-specific variations cataloged; actual hours documented per artifact type |

**Tasks:**

| ID | Task | Hours | Role |
|----|------|-------|------|
| E0-S1.T1 | Identify 2–3 completed Phase 4 deliverables for reference | 2 | Lead Architect |
| E0-S1.T2 | Extract common standards patterns (repeated across engagements) | 6 | Lead Architect |
| E0-S1.T3 | Catalog engagement-specific customizations (what varies) | 4 | Lead Architect |
| E0-S1.T4 | Document gaps and quality issues from prior deliverables | 4 | Sr Data Gov Specialist |
| E0-S1.T5 | Record actual hours spent per artifact type for baseline calibration | 4 | Lead Architect |

### E0-S2: Industry Standards Survey & Scope Lock

| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Effort** | S (20 hrs) |
| **Sprint** | 0 |
| **Owner** | Lead Architect, Sr Integration Architect |
| **Depends On** | E0-S1 (prior engagement audit complete) |
| **Acceptance Criteria** | External standards reviewed; template lists finalized per module; adaptation workflow defined; buildout scope locked |

**Tasks:**

| ID | Task | Hours | Role |
|----|------|-------|------|
| E0-S2.T1 | Review Microsoft REST API Guidelines and Fabric docs | 3 | Sr Integration Architect |
| E0-S2.T2 | Review OWASP API Security Top 10, DAMA DMBOK | 3 | Sr Data Gov Specialist |
| E0-S2.T3 | Review Azure CAF naming/governance, ISO 27001 classification | 3 | Lead Architect |
| E0-S2.T4 | Finalize template list per module (39 templates, 16 examples) | 4 | Lead Architect |
| E0-S2.T5 | Define adaptation workflow (how practitioners customize per engagement) | 4 | Lead Architect |
| E0-S2.T6 | Document acceptance criteria per module and lock scope | 3 | Lead Architect |

---

## Epic E1: Foundation Modules

**Sprint:** 1 (Weeks 1–2) | **Total Hours:** ~90 | **Roadmap:** [Phase 1](roadmap.md#5-phase-1-foundation-modules)

### E1-S1: ISL-03 Naming Convention Standards

| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Effort** | S (20–30 hrs) |
| **Sprint** | 1 |
| **Owner** | Sr Integration Architect |
| **Depends On** | E0 complete (scope locked) |
| **Acceptance Criteria** | 7 naming templates + 2 examples completed; Fabric-specific patterns validated; abbreviation dictionary seeded with 50+ entries |

**Tasks:**

| ID | Task | Hours | Role |
|----|------|-------|------|
| E1-S1.T1 | Draft database & schema naming template | 2 | Sr Integration Architect |
| E1-S1.T2 | Draft table & view naming template | 3 | Sr Integration Architect |
| E1-S1.T3 | Draft column naming standards template | 2 | Sr Integration Architect |
| E1-S1.T4 | Draft pipeline & dataflow naming template | 3 | Sr Integration Architect |
| E1-S1.T5 | Draft API & endpoint naming template | 2 | Sr Integration Architect |
| E1-S1.T6 | Draft infrastructure resource naming template (CAF-aligned) | 2 | Sr Integration Architect |
| E1-S1.T7 | Build abbreviation dictionary (50+ entries) | 3 | Technical Writer |
| E1-S1.T8 | Create Fabric naming reference example | 3 | Sr Integration Architect |
| E1-S1.T9 | Create manufacturing domain names example | 3 | Sr Integration Architect |
| E1-S1.T10 | Peer review all templates | 4 | Lead Architect |

### E1-S2: ISL-04 Data Classification Framework

| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Effort** | M (40–60 hrs) |
| **Sprint** | 1 |
| **Owner** | Sr Data Governance Specialist |
| **Depends On** | E1-S1 (naming conventions — classification tier naming follows ISL-03) |
| **Acceptance Criteria** | 6 classification templates + 3 examples completed; 4-tier model defined; Purview label taxonomy documented; compliance mapping covers SOX, GDPR, CCPA, ITAR, HIPAA |

**Tasks:**

| ID | Task | Hours | Role |
|----|------|-------|------|
| E1-S2.T1 | Draft classification tier definitions (4-tier model) | 5 | Sr Data Gov Specialist |
| E1-S2.T2 | Draft sensitivity labeling standards (Purview alignment) | 6 | Sr Data Gov Specialist |
| E1-S2.T3 | Draft data handling requirements (per-tier controls) | 5 | Sr Data Gov Specialist |
| E1-S2.T4 | Draft access control alignment (Entra ID, Fabric RBAC) | 6 | Sr Data Gov Specialist |
| E1-S2.T5 | Draft compliance mapping matrix (SOX, GDPR, CCPA, ITAR, HIPAA) | 6 | Sr Data Gov Specialist |
| E1-S2.T6 | Create classification decision tree flowchart | 3 | Sr Data Gov Specialist |
| E1-S2.T7 | Create manufacturing classification example (ITAR, trade secrets, IoT) | 5 | Sr Data Gov Specialist |
| E1-S2.T8 | Create Fabric security model example | 4 | Sr Integration Architect |
| E1-S2.T9 | Create Purview label configuration example | 4 | Sr Data Gov Specialist |
| E1-S2.T10 | Peer review all templates | 6 | Lead Architect |

---

## Epic E2: Core Modules

**Sprint:** 2 (Weeks 3–4) | **Total Hours:** ~100 | **Roadmap:** [Phase 2](roadmap.md#6-phase-2-core-modules)

### E2-S1: ISL-01 API Governance Standards

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Effort** | M (40–60 hrs) |
| **Sprint** | 2 |
| **Owner** | Sr Integration Architect |
| **Depends On** | E1-S1 (ISL-03 naming — API naming follows enterprise conventions); E1-S2 (ISL-04 classification — security standards reference classification tiers) |
| **Acceptance Criteria** | 6 API templates + 2 examples completed; OWASP API Top 10 cross-referenced; OAuth 2.0/OIDC patterns documented with Entra ID specifics |

**Tasks:**

| ID | Task | Hours | Role |
|----|------|-------|------|
| E2-S1.T1 | Draft API design standards template (REST, pagination, error formats) | 6 | Sr Integration Architect |
| E2-S1.T2 | Draft API versioning policy template | 3 | Sr Integration Architect |
| E2-S1.T3 | Draft API security standards template (OAuth 2.0, mTLS, OWASP) | 8 | Sr Integration Architect |
| E2-S1.T4 | Draft API lifecycle governance template (gates, deprecation, SLAs) | 5 | Sr Integration Architect |
| E2-S1.T5 | Draft API catalog requirements template | 4 | Sr Integration Architect |
| E2-S1.T6 | Draft rate limiting & throttling policy template | 3 | Sr Integration Architect |
| E2-S1.T7 | Create manufacturing API standards example | 5 | Sr Integration Architect |
| E2-S1.T8 | Create Fabric-native API patterns example | 4 | Sr Integration Architect |
| E2-S1.T9 | OWASP API Top 10 cross-reference audit | 4 | Lead Architect |
| E2-S1.T10 | Peer review all templates | 5 | Lead Architect |

### E2-S2: ISL-06 Data Quality Standards

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Effort** | M (30–50 hrs) |
| **Sprint** | 2 |
| **Owner** | Sr Data Governance Specialist |
| **Depends On** | E1-S1 (ISL-03 naming — quality rule naming); E1-S2 (ISL-04 classification — SLA thresholds vary by tier) |
| **Acceptance Criteria** | 6 quality templates + 3 examples completed; 50+ quality rules cataloged; SLA thresholds defined per classification tier |

**Tasks:**

| ID | Task | Hours | Role |
|----|------|-------|------|
| E2-S2.T1 | Draft quality dimension definitions template (6 dimensions) | 3 | Sr Data Gov Specialist |
| E2-S2.T2 | Draft quality SLA framework template (thresholds per tier) | 5 | Sr Data Gov Specialist |
| E2-S2.T3 | Build quality rule library (50+ rules: schema, row, aggregate, business) | 10 | Sr Data Gov Specialist |
| E2-S2.T4 | Draft quality monitoring standards template | 4 | Sr Data Gov Specialist |
| E2-S2.T5 | Draft remediation workflow template | 3 | Sr Data Gov Specialist |
| E2-S2.T6 | Draft quality scorecard template | 3 | Sr Data Gov Specialist |
| E2-S2.T7 | Create manufacturing quality rules example | 4 | Sr Data Gov Specialist |
| E2-S2.T8 | Create Fabric quality implementation example (PySpark notebooks) | 5 | Sr Integration Architect |
| E2-S2.T9 | Create quality dashboard spec example (Power BI) | 4 | Sr Data Gov Specialist |
| E2-S2.T10 | Peer review all templates | 5 | Lead Architect |

---

## Epic E3: Advanced Modules

**Sprint:** 3 (Weeks 5–8, double sprint) | **Total Hours:** ~160 | **Roadmap:** [Phase 3](roadmap.md#7-phase-3-advanced-modules)

### E3-S1: ISL-02 Metadata & Data Lineage Framework

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Effort** | L (60–80 hrs) |
| **Sprint** | 3 |
| **Owner** | Sr Data Governance Specialist |
| **Depends On** | E1-S1 (ISL-03 naming); E1-S2 (ISL-04 classification labels as metadata); E2-S2 (ISL-06 quality scores as metadata) |
| **Acceptance Criteria** | 6 metadata templates + 3 examples completed; Purview metadata schema aligned; lineage requirements cover column/table/pipeline levels; manufacturing extensions for IoT/ERP |

**Tasks:**

| ID | Task | Hours | Role |
|----|------|-------|------|
| E3-S1.T1 | Draft business glossary standards template | 6 | Sr Data Gov Specialist |
| E3-S1.T2 | Draft technical metadata schema template (Purview/OpenMetadata aligned) | 10 | Sr Data Gov Specialist |
| E3-S1.T3 | Draft data lineage requirements template | 6 | Sr Data Gov Specialist |
| E3-S1.T4 | Draft data catalog governance template | 5 | Sr Data Gov Specialist |
| E3-S1.T5 | Draft metadata integration patterns template (Purview, Collibra, Alation) | 8 | Sr Integration Architect |
| E3-S1.T6 | Draft lineage visualization standards template | 4 | Sr Data Gov Specialist |
| E3-S1.T7 | Create manufacturing metadata model example (IoT, ERP, BOM) | 6 | Sr Data Gov Specialist |
| E3-S1.T8 | Create Fabric OneLake metadata example | 5 | Sr Integration Architect |
| E3-S1.T9 | Create Purview configuration guide example | 5 | Sr Data Gov Specialist |
| E3-S1.T10 | Build manufacturing overlays (IoT/OT, ERP mapping, PLM/PDM) | 8 | Sr Data Gov Specialist |
| E3-S1.T11 | Peer review all templates | 7 | Lead Architect |

### E3-S2: ISL-05 Integration Pattern Library

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Effort** | L (60–80 hrs) |
| **Sprint** | 3 |
| **Owner** | Sr Integration Architect |
| **Depends On** | E2-S1 (ISL-01 API governance for API gateway pattern); E1-S1 (ISL-03 naming for all patterns); E2-S2 (ISL-06 quality gates for medallion pattern) |
| **Acceptance Criteria** | 8 integration patterns + 3 diagrams completed; each pattern includes architecture diagram, decision criteria, anti-patterns, and Fabric implementation guide; decision framework enables pattern selection |

**Tasks:**

| ID | Task | Hours | Role |
|----|------|-------|------|
| E3-S2.T1 | Draft ERP Extract & Load pattern (4 variants) | 6 | Sr Integration Architect |
| E3-S2.T2 | Draft IoT/OT Ingestion pattern (4 variants) | 6 | Sr Integration Architect |
| E3-S2.T3 | Draft API Gateway Integration pattern (4 variants) | 5 | Sr Integration Architect |
| E3-S2.T4 | Draft Event-Driven Architecture pattern (4 variants) | 6 | Sr Integration Architect |
| E3-S2.T5 | Draft Master Data Synchronization pattern (4 variants) | 6 | Sr Integration Architect |
| E3-S2.T6 | Draft File-Based Integration pattern (4 variants) | 4 | Sr Integration Architect |
| E3-S2.T7 | Draft Medallion Architecture pattern (3 layers) | 5 | Sr Integration Architect |
| E3-S2.T8 | Draft Reverse ETL pattern (4 variants) | 4 | Sr Integration Architect |
| E3-S2.T9 | Create integration landscape overview diagram | 5 | Sr Integration Architect |
| E3-S2.T10 | Create Fabric integration architecture diagram | 5 | Sr Integration Architect |
| E3-S2.T11 | Create pattern decision tree diagram | 4 | Sr Integration Architect |
| E3-S2.T12 | Build pattern selection decision framework | 4 | Lead Architect |
| E3-S2.T13 | Peer review all patterns and diagrams | 8 | Lead Architect |

---

## Epic E4: Packaging, Review & Pilot

**Sprint:** 4 (Weeks 9–10) | **Total Hours:** ~80 | **Roadmap:** [Phase 4](roadmap.md#8-phase-4-packaging-review--pilot)

### E4-S1: Manufacturing Overlays Consolidation

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Effort** | S (20 hrs) |
| **Sprint** | 4 |
| **Owner** | Sr Data Governance Specialist |
| **Depends On** | E3 complete (all 6 modules built) |
| **Acceptance Criteria** | Manufacturing overlays consolidated and enhanced across all applicable modules; ITAR/EAR, IoT/OT, ERP, supply chain coverage validated |

**Tasks:**

| ID | Task | Hours | Role |
|----|------|-------|------|
| E4-S1.T1 | Consolidate ITAR/EAR compliance overlay across ISL-04, ISL-01 | 4 | Sr Data Gov Specialist |
| E4-S1.T2 | Consolidate IoT/OT extensions across ISL-02, ISL-04, ISL-05 | 4 | Sr Data Gov Specialist |
| E4-S1.T3 | Consolidate ERP integration extensions across ISL-02, ISL-05 | 4 | Sr Integration Architect |
| E4-S1.T4 | Validate supply chain data classification (ISL-04) | 2 | Sr Data Gov Specialist |
| E4-S1.T5 | Cross-check manufacturing examples for consistency | 4 | Lead Architect |
| E4-S1.T6 | Fill gaps identified during cross-module review | 2 | Sr Data Gov Specialist |

### E4-S2: Peer Review & Quality Assurance

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Effort** | S (20 hrs) |
| **Sprint** | 4 |
| **Owner** | Lead Architect |
| **Depends On** | E4-S1 (manufacturing overlays consolidated) |
| **Acceptance Criteria** | Full cross-module review complete; ISL-03 naming used consistently; compliance alignment verified; all review comments resolved |

**Tasks:**

| ID | Task | Hours | Role |
|----|------|-------|------|
| E4-S2.T1 | Full cross-module review (naming consistency, terminology) | 6 | Lead Architect |
| E4-S2.T2 | Compliance alignment audit (OWASP, NIST, ISO 27001, DAMA) | 4 | Lead Architect |
| E4-S2.T3 | Cross-reference validation (all inter-module links correct) | 3 | Technical Writer |
| E4-S2.T4 | Spelling, grammar, and formatting audit | 3 | Technical Writer |
| E4-S2.T5 | Resolve all review comments and re-review | 4 | All |

### E4-S3: Packaging & Distribution

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Effort** | S (15 hrs) |
| **Sprint** | 4 |
| **Owner** | Technical Writer |
| **Depends On** | E4-S2 (review complete) |
| **Acceptance Criteria** | All module READMEs finalized; adaptation workflow documented; engagement kickoff guide created; v1.0 release tagged |

**Tasks:**

| ID | Task | Hours | Role |
|----|------|-------|------|
| E4-S3.T1 | Finalize all module README files with usage instructions | 4 | Technical Writer |
| E4-S3.T2 | Document adaptation workflow (step-by-step for practitioners) | 3 | Lead Architect |
| E4-S3.T3 | Create engagement kickoff integration guide | 3 | Lead Architect |
| E4-S3.T4 | Tag Git repository with v1.0 release | 1 | Sr Integration Architect |
| E4-S3.T5 | Configure distribution (artifact repository or SharePoint) | 2 | Sr Integration Architect |
| E4-S3.T6 | Publish release notes | 2 | Technical Writer |

### E4-S4: Pilot Deployment

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Effort** | S (20 hrs) |
| **Sprint** | 4+ (extends beyond Sprint 4 into engagement) |
| **Owner** | Lead Architect |
| **Depends On** | E4-S3 (packaging complete); pilot engagement identified |
| **Acceptance Criteria** | ISL deployed at pilot engagement; actual adaptation hours tracked; practitioner feedback collected; lessons learned documented |

**Tasks:**

| ID | Task | Hours | Role |
|----|------|-------|------|
| E4-S4.T1 | Identify pilot engagement and Phase 4 scope | 2 | Lead Architect |
| E4-S4.T2 | Assign ISL champion on engagement team | 1 | Lead Architect |
| E4-S4.T3 | Conduct ISL onboarding session for engagement team | 3 | Lead Architect |
| E4-S4.T4 | Monitor adaptation hours vs. estimated (ongoing) | 4 | Lead Architect |
| E4-S4.T5 | Collect practitioner feedback via structured survey | 4 | Technical Writer |
| E4-S4.T6 | Document lessons learned; plan v1.1 backlog items | 4 | Lead Architect |
| E4-S4.T7 | Incorporate feedback and release v1.1 | 2 | All |

---

## Summary

| Epic | Stories | Sprint(s) | Hours | Deliverables |
|------|---------|-----------|-------|-------------|
| E0: Discovery & Baseline | 2 | 0 | ~40 | Audit findings, scope lock |
| E1: Foundation Modules | 2 | 1 | ~90 | ISL-03 (7 templates, 2 examples), ISL-04 (6 templates, 3 examples) |
| E2: Core Modules | 2 | 2 | ~100 | ISL-01 (6 templates, 2 examples), ISL-06 (6 templates, 3 examples) |
| E3: Advanced Modules | 2 | 3 | ~160 | ISL-02 (6 templates, 3 examples), ISL-05 (8 patterns, 3 diagrams) |
| E4: Packaging & Pilot | 4 | 4 | ~80 | Overlays, review, packaging, pilot |
| **Total** | **12 stories** | **0–4** | **~470** | **39 templates, 16 examples, 3 diagrams** |

> Note: Total hours (~470) includes manufacturing overlays, peer review, packaging, and pilot deployment beyond the core module build effort (250–360 hrs). The difference accounts for quality assurance and deployment activities.

---

*Backlog derived from the [Roadmap](roadmap.md) and aligned with the [Buildout Recommendation](Integration_Standards_Library_DMTSP_Buildout.md). Each story maps to specific orchestrator tasks in the [execution plan](design/orchestrator_integration_standards.md).*

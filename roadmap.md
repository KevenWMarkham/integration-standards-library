# Integration Standards Library — Strategic Roadmap

**Version:** 1.0
**Author:** Keven Markham, VP Enterprise Transformation — DMTSP
**Date:** February 6, 2026
**Status:** Draft
**Related Documents:**
- [Backlog](backlog.md) — Epics, stories, and tasks derived from this roadmap
- [Orchestrator](design/orchestrator_integration_standards.md) — Sprint-by-sprint execution plan
- [Buildout Recommendation](Integration_Standards_Library_DMTSP_Buildout.md) — Accelerator overview and ROI analysis

---

## 1. Executive Summary

The **Integration Standards Library** (ACC-03) is a reusable collection of 6 pre-built standards modules that accelerate Phase 4 (Standards Definition) of Enterprise Data Architecture engagements. Rather than building governance artifacts from scratch at each client, practitioners adapt proven templates — reducing per-engagement standards effort by 30–40% (150–200 hours) and improving cross-portfolio consistency.

This roadmap defines a 4-sprint internal buildout (10 weeks) to take the library from concept to production-ready accelerator. Modules are sequenced by dependency and standalone value: foundational modules first (naming conventions, data classification), then core governance modules (API standards, data quality), then advanced frameworks (metadata/lineage, integration patterns), and finally manufacturing overlays and pilot deployment.

### Scope

| Module | ID | Build Hours | Sprint |
|--------|----|-------------|--------|
| Naming Convention Standards | ISL-03 | 20–30 | Sprint 1 |
| Data Classification Framework | ISL-04 | 40–60 | Sprint 1 |
| API Governance Standards | ISL-01 | 40–60 | Sprint 2 |
| Data Quality Standards | ISL-06 | 30–50 | Sprint 2 |
| Metadata & Data Lineage Framework | ISL-02 | 60–80 | Sprint 3 |
| Integration Pattern Library | ISL-05 | 60–80 | Sprint 3 |
| Manufacturing Overlays + Packaging | — | 60–80 | Sprint 4 |
| **Total** | | **310–440** | **4 sprints** |

### Hours Impact (Per Engagement)

| Metric | Hours |
|--------|-------|
| Base Hours (Phase 4 Standards Definition) | 500–700 |
| Accelerated Hours (with ISL) | 350–500 |
| Phase 4 Hours Saved | 150–200 |
| Cross-Phase Additional Savings (P1–P3) | 110–200 |
| **Total Per-Engagement Savings** | **260–400** |
| **Reduction** | **~35%** |

---

## 2. Scope & Module Inventory

### 2.1 Module Breakdown

| # | Module | ID | Templates | Examples | Build Hrs | Per-Engagement Savings | Reduction |
|---|--------|----|-----------|----------|-----------|----------------------|-----------|
| 1 | Naming Conventions | ISL-03 | 7 | 2 | 20–30 | 20–32 hrs | 55–65% |
| 2 | Data Classification | ISL-04 | 6 | 3 | 40–60 | 35–60 hrs | 50–60% |
| 3 | API Governance | ISL-01 | 6 | 2 | 40–60 | 60–85 hrs | 55–70% |
| 4 | Data Quality | ISL-06 | 6 | 3 | 30–50 | 30–45 hrs | 50–60% |
| 5 | Metadata & Lineage | ISL-02 | 6 | 3 | 60–80 | 70–110 hrs | 60–70% |
| 6 | Integration Patterns | ISL-05 | 8 patterns | 3 diagrams | 60–80 | 60–90 hrs | 35–45% |
| | **Total** | | **39 templates** | **16 examples** | **250–360** | **275–422 hrs** | **~50%** |

### 2.2 Out of Scope

The following are related accelerators but are **not** covered in this roadmap:

- Manufacturing Data Architecture Blueprints → ACC-01
- RFP Discovery Questionnaire Tool → ACC-02
- Governance Maturity Assessment Framework → ACC-04
- Microsoft Fabric Migration Toolkit → ACC-05
- Synapse-to-Fabric Migration Accelerators → Separate repository

### 2.3 Dependency Map

Modules must be built in dependency order — downstream modules reference upstream conventions:

```
ISL-03: Naming Conventions (Sprint 1)
  │
  ├──► ISL-04: Data Classification (Sprint 1)
  │       │
  │       ├──► ISL-01: API Governance (Sprint 2) ◄── ISL-03
  │       │
  │       ├──► ISL-06: Data Quality (Sprint 2) ◄── ISL-03
  │       │
  │       ├──► ISL-02: Metadata & Lineage (Sprint 3) ◄── ISL-03, ISL-06
  │       │
  │       └──► ISL-05: Integration Patterns (Sprint 3) ◄── ISL-03, ISL-01, ISL-06
  │
  └──► Manufacturing Overlays (Sprint 4) ◄── All modules
```

ISL-03 (Naming Conventions) is the foundational module — every other module references it. ISL-04 (Data Classification) is the second dependency — security tiers are referenced by API governance, quality SLAs, and metadata attributes.

---

## 3. Prerequisites & Dependencies

### 3.1 Internal Resources

- [ ] Lead Architect assigned — standards design authority, peer review (Sprint 0)
- [ ] Senior Data Governance Specialist assigned — classification, metadata, quality (Sprint 0)
- [ ] Senior Integration Architect assigned — API governance, integration patterns (Sprint 0)
- [ ] Prior engagement artifacts — access to 2–3 completed Phase 4 deliverables for reference (Sprint 0)

### 3.2 Reference Materials

- [ ] Microsoft Purview documentation — sensitivity labels, metadata schema, lineage capabilities
- [ ] Microsoft Fabric documentation — naming conventions, workspace RBAC, OneLake taxonomy
- [ ] Azure Cloud Adoption Framework — resource naming, tagging, governance best practices
- [ ] OWASP API Security Top 10 (2023) — API governance alignment
- [ ] Industry compliance frameworks — SOX, GDPR, ITAR, HIPAA control requirements

### 3.3 Tooling

- [ ] Git repository initialized — version control and collaboration (Complete)
- [ ] Markdown authoring environment — VS Code + Markdown Preview
- [ ] Diagram tooling — Mermaid, draw.io, or Lucidchart for architecture diagrams
- [ ] Review platform — GitHub PR reviews or SharePoint for stakeholder feedback

### 3.4 Team

| Role | Allocation | Sprint Capacity | Primary Modules |
|------|-----------|----------------|-----------------|
| Lead Architect | 50% | 35 hrs/sprint | All — design authority, review |
| Sr Data Governance Specialist | 75% | 50 hrs/sprint | ISL-02, ISL-04, ISL-06 |
| Sr Integration Architect | 75% | 50 hrs/sprint | ISL-01, ISL-03, ISL-05 |
| Technical Writer | 25% | 15 hrs/sprint | All — formatting, consistency, packaging |
| **Total** | | **150 hrs/sprint** | |

### 3.5 External Dependencies

- [ ] ACC-04 (Governance Maturity Assessment) — maturity tier definitions inform adoption tiers in each module (nice-to-have, not blocking)
- [ ] ACC-02 (RFP Discovery Questionnaire) — discovery questions Q18–Q22 inform adaptation workflows (nice-to-have)
- [ ] Lincoln Electric engagement kickoff — target pilot deployment of ISL at first live engagement (Sprint 4+)

---

## 4. Phase 0: Discovery & Baseline

**Sprint:** 0 (Pre-Sprint) | **Hours:** ~40 (1 week)
**Backlog Epic:** [E0](backlog.md#epic-e0-discovery--baseline)
**Orchestrator:** [Sprint 0](design/orchestrator_integration_standards.md#sprint-0--discovery--baseline)

### 4.1 Prior Engagement Audit

Review 2–3 completed Phase 4 deliverables from prior DMTSP engagements to extract:
- [ ] Common standards patterns (what gets built every time)
- [ ] Engagement-specific customizations (what varies per client)
- [ ] Gaps and quality issues (what was missed or under-specified)
- [ ] Time spent per standards artifact (actual hours for baseline calibration)

### 4.2 Industry Standards Survey

Review external standards frameworks for alignment:
- [ ] Microsoft REST API Guidelines
- [ ] Microsoft Fabric naming conventions and best practices
- [ ] Azure Cloud Adoption Framework naming and tagging
- [ ] OWASP API Security Top 10
- [ ] DAMA DMBOK — Data Management Body of Knowledge
- [ ] ISO 27001 / NIST 800-53 — data classification alignment

### 4.3 Module Scope Finalization

For each module, confirm:
- [ ] Template list finalized (artifacts to build)
- [ ] Example list finalized (client-specific adaptations to demonstrate)
- [ ] Adaptation workflow defined (how practitioners customize per engagement)
- [ ] Acceptance criteria agreed
- [ ] **Phase 0 Complete — Buildout scope locked**

---

## 5. Phase 1: Foundation Modules

**Sprint:** 1 (Weeks 1–2) | **Hours:** ~80
**Backlog Epic:** [E1](backlog.md#epic-e1-foundation-modules)
**Orchestrator:** [Sprint 1](design/orchestrator_integration_standards.md#sprint-1--foundation-modules)

Foundation modules are built first because every subsequent module depends on them. ISL-03 (Naming Conventions) establishes the vocabulary; ISL-04 (Data Classification) establishes the security framework.

### 5.1 ISL-03: Naming Convention Standards (Sprint 1)

| Deliverable | Description | Hours |
|-------------|-------------|-------|
| 7 naming templates | Database/schema, table/view, column, pipeline, API, infrastructure, abbreviation dictionary | 12–18 |
| 2 examples | Fabric naming reference, manufacturing domain names | 4–6 |
| Enforcement guidance | Azure Policy definitions, linting rules, pre-commit hooks | 4–6 |
| **Subtotal** | | **20–30** |

- [ ] All 7 templates drafted and peer-reviewed
- [ ] Fabric-specific naming patterns validated against current Fabric docs
- [ ] Abbreviation dictionary seeded with 50+ standard abbreviations
- [ ] 2 examples completed

### 5.2 ISL-04: Data Classification Framework (Sprint 1)

| Deliverable | Description | Hours |
|-------------|-------------|-------|
| 6 classification templates | Tier definitions, labeling, handling, access control, compliance mapping, decision tree | 20–35 |
| 3 examples | Manufacturing classification, Fabric security model, Purview label config | 10–15 |
| Manufacturing overlay | ITAR/EAR, trade secrets, IoT/OT sensitivity, supply chain | 10–15 |
| **Subtotal** | | **40–65** |

- [ ] 4-tier classification model (Public/Internal/Confidential/Restricted) defined
- [ ] Microsoft Purview label taxonomy documented
- [ ] Compliance mapping matrix covers SOX, GDPR, CCPA, ITAR, HIPAA
- [ ] Manufacturing industry overlay drafted
- [ ] **Phase 1 Complete — Foundation modules ready for downstream consumption**

---

## 6. Phase 2: Core Modules

**Sprint:** 2 (Weeks 3–4) | **Hours:** ~100
**Backlog Epic:** [E2](backlog.md#epic-e2-core-modules)
**Orchestrator:** [Sprint 2](design/orchestrator_integration_standards.md#sprint-2--core-modules)

Core modules build on the foundation and cover the two most universally applicable governance domains: API management and data quality.

### 6.1 ISL-01: API Governance Standards (Sprint 2)

| Deliverable | Description | Hours |
|-------------|-------------|-------|
| 6 API templates | Design standards, versioning, security, lifecycle, catalog, rate limiting | 24–38 |
| 2 examples | Manufacturing API standards, Fabric-native API patterns | 8–12 |
| OWASP alignment | Cross-reference each template against OWASP API Top 10 | 4–6 |
| **Subtotal** | | **36–56** |

- [ ] RESTful design standards aligned to Microsoft REST API Guidelines
- [ ] OAuth 2.0/OIDC security patterns documented with Azure AD/Entra ID specifics
- [ ] API lifecycle governance includes design review gates and deprecation process
- [ ] OWASP API Security Top 10 cross-reference complete

### 6.2 ISL-06: Data Quality Standards (Sprint 2)

| Deliverable | Description | Hours |
|-------------|-------------|-------|
| 6 quality templates | Dimensions, SLA framework, rule library, monitoring, remediation, scorecard | 18–32 |
| 3 examples | Manufacturing quality rules, Fabric quality implementation, dashboard spec | 8–12 |
| Quality rule library | 50+ pre-built rules across schema, row-level, aggregate, business categories | 8–12 |
| **Subtotal** | | **34–56** |

- [ ] 6 quality dimensions defined with measurement formulas
- [ ] SLA thresholds configured per data criticality tier (referencing ISL-04 classification)
- [ ] 50+ quality rules cataloged with implementation guidance
- [ ] Quality scorecard template includes RAG status and trend indicators
- [ ] **Phase 2 Complete — Core governance modules ready**

---

## 7. Phase 3: Advanced Modules

**Sprint:** 3 (Weeks 5–8, 2× sprint duration) | **Hours:** ~160
**Backlog Epic:** [E3](backlog.md#epic-e3-advanced-modules)
**Orchestrator:** [Sprint 3](design/orchestrator_integration_standards.md#sprint-3--advanced-modules)

Advanced modules are the most complex and provide the deepest per-engagement savings. Sprint 3 runs as a double sprint (4 weeks) to accommodate the higher build effort.

### 7.1 ISL-02: Metadata & Data Lineage Framework (Sprint 3)

| Deliverable | Description | Hours |
|-------------|-------------|-------|
| 6 metadata templates | Business glossary, technical metadata schema, lineage requirements, catalog governance, metadata integration, lineage visualization | 40–55 |
| 3 examples | Manufacturing metadata model, Fabric OneLake metadata, Purview config guide | 12–18 |
| Manufacturing overlay | IoT/OT metadata, ERP mapping, product data management | 8–12 |
| **Subtotal** | | **60–85** |

- [ ] Technical metadata schema aligned to Microsoft Purview and Fabric OneLake taxonomy
- [ ] Business glossary standards include ownership model and cross-domain disambiguation
- [ ] Data lineage requirements cover column-level, table-level, and pipeline-level granularity
- [ ] Manufacturing extensions cover IoT sensor registries, ERP cross-references, BOM lineage

### 7.2 ISL-05: Integration Pattern Library (Sprint 3)

| Deliverable | Description | Hours |
|-------------|-------------|-------|
| 8 integration patterns | ERP extract, IoT ingestion, API gateway, event-driven, MDM sync, file-based, medallion, reverse ETL | 40–55 |
| 3 architecture diagrams | Landscape overview, Fabric integration architecture, pattern decision tree | 12–18 |
| Decision framework | Pattern selection criteria (source, latency, volume, security) | 8–12 |
| **Subtotal** | | **60–85** |

- [ ] All 8 patterns documented with architecture diagrams, decision criteria, and anti-patterns
- [ ] Each pattern includes Fabric-specific implementation guidance
- [ ] Decision framework enables practitioners to select patterns based on client requirements
- [ ] Medallion architecture pattern cross-references ISL-03 (naming) and ISL-06 (quality gates)
- [ ] **Phase 3 Complete — All 6 standards modules built**

---

## 8. Phase 4: Packaging, Review & Pilot

**Sprint:** 4 (Weeks 9–10) | **Hours:** ~80
**Backlog Epic:** [E4](backlog.md#epic-e4-packaging--pilot)
**Orchestrator:** [Sprint 4](design/orchestrator_integration_standards.md#sprint-4--packaging--pilot)

### 8.1 Manufacturing Industry Overlays

Consolidate and enhance industry-specific extensions across all modules:
- [ ] ITAR/EAR compliance overlay finalized (ISL-04)
- [ ] IoT/OT metadata standards finalized (ISL-02)
- [ ] ERP integration patterns finalized (ISL-05)
- [ ] Manufacturing quality rules validated (ISL-06)
- [ ] Welding/process data classification completed (ISL-04)

### 8.2 Peer Review & Quality Assurance

External review of all 6 modules:
- [ ] Lead Architect conducts full cross-module review
- [ ] Cross-references validated (ISL-03 naming used consistently across all modules)
- [ ] Compliance alignment verified (OWASP, NIST, ISO 27001, DAMA)
- [ ] Spelling, grammar, and formatting audit
- [ ] All review comments resolved

### 8.3 Packaging & Distribution

Prepare the library for engagement deployment:
- [ ] Module README files finalized with usage instructions
- [ ] Adaptation workflow documented (step-by-step for practitioners)
- [ ] Engagement kickoff integration guide (how to introduce ISL in Sprint 0)
- [ ] Git repository tagged with v1.0 release
- [ ] Distribution via internal artifact repository or SharePoint

### 8.4 Pilot Deployment

Deploy ISL at the next available engagement (target: Lincoln Electric):
- [ ] Identify pilot engagement and Phase 4 scope
- [ ] Assign ISL champion on the engagement team
- [ ] Track actual adaptation hours vs. estimated hours
- [ ] Collect practitioner feedback on template quality and usability
- [ ] Document lessons learned and incorporate into v1.1
- [ ] **Phase 4 Complete — ISL v1.0 production-ready**

---

## 9. Risk Register

| ID | Risk | Probability | Impact | Mitigation | Phase |
|----|------|------------|--------|------------|-------|
| R1 | Standards too generic — heavy adaptation required per engagement | Medium | Medium | Include manufacturing-specific overlays and 2–3 concrete client examples per module | Phase 1–3 |
| R2 | Technology drift — Fabric/Purview features change before deployment | Low | High | Version-lock templates to current GA features; plan quarterly refresh cycle | Phase 3–4 |
| R3 | Practitioner adoption resistance — teams prefer building from scratch | Medium | High | Mandate library review at engagement kickoff; embed in Phase 4 SOW templates | Phase 4 |
| R4 | Compliance gaps — missing regulatory requirements | Low | High | External review against NIST, ISO 27001, OWASP, DAMA; legal review for ITAR | Phase 4 |
| R5 | Build team availability — key resources pulled to client work | High | Medium | Protect 75% allocation through Sprint 3; Sprint 4 can absorb slippage | Phase 1–3 |
| R6 | Cross-module inconsistency — naming/terminology drift between modules | Medium | Medium | ISL-03 naming conventions enforced as first deliverable; Lead Architect review gate | Phase 2–3 |
| R7 | Scope creep — modules expand beyond defined template lists | Medium | Low | Fixed template count per module; additional artifacts deferred to v1.1 | Phase 1–3 |
| R8 | Pilot engagement timing — no suitable engagement for pilot deployment | Low | Medium | Build pilot plan for 2 candidate engagements; deploy to whichever kicks off first | Phase 4 |

---

## 10. Success Criteria

### 10.1 Quantitative

- [ ] Module completeness — 6/6 modules with all templates and examples delivered
- [ ] Template count — 39 templates + 16 examples completed
- [ ] Build hours within estimate — within 15% of 310–440 hour budget
- [ ] Pilot engagement savings — Phase 4 hours reduced by ≥25% vs. baseline
- [ ] Practitioner satisfaction — ≥4/5 rating from pilot engagement team

### 10.2 Qualitative

- [ ] Cross-module consistency — naming conventions from ISL-03 used uniformly
- [ ] Compliance coverage — zero gaps identified in peer review against OWASP, NIST, DAMA
- [ ] Adaptation workflow clarity — new practitioner can deploy a module in <1 day
- [ ] Reusability validated — templates work for manufacturing and general enterprise clients
- [ ] Repository quality — clean git history, tagged release, documentation complete

---

## 11. Reference Standards & Frameworks

| # | Standard | Relevance | Module |
|---|----------|-----------|--------|
| 1 | Microsoft REST API Guidelines | API design standards baseline | ISL-01 |
| 2 | OWASP API Security Top 10 (2023) | API security standards | ISL-01 |
| 3 | Azure Cloud Adoption Framework | Resource naming, governance | ISL-03 |
| 4 | Microsoft Purview Documentation | Metadata schema, sensitivity labels, lineage | ISL-02, ISL-04 |
| 5 | Microsoft Fabric Documentation | Naming, RBAC, OneLake taxonomy | ISL-03, ISL-05 |
| 6 | DAMA DMBOK | Data management body of knowledge | ISL-02, ISL-06 |
| 7 | ISO 27001 / NIST 800-53 | Data classification controls | ISL-04 |
| 8 | ITAR/EAR Regulations | Export control data classification | ISL-04 |
| 9 | Great Expectations Documentation | Data quality rule implementation | ISL-06 |
| 10 | AsyncAPI Specification | Event-driven API standards | ISL-01, ISL-05 |

---

*This roadmap is based on the [Integration Standards Library Buildout Recommendation](Integration_Standards_Library_DMTSP_Buildout.md) and engagement framework data from the Lincoln Electric Accelerator Strategy. Re-baseline at Sprint 0 exit gate.*

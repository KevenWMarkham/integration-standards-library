# Integration Standards Library — Engagement Deployment Roadmap

**Version:** 2.0
**Author:** Keven Markham, VP Enterprise Transformation — DMTSP
**Date:** February 6, 2026
**Status:** Active — deployed globally
**Related Documents:**
- [Backlog](backlog.md) — Epics, stories, and tasks derived from this roadmap
- [Orchestrator](design/orchestrator_integration_standards.md) — Phase-by-phase engagement execution plan
- [Accelerator Overview](Integration_Standards_Library_DMTSP_Accelerator.md) — Accelerator overview and ROI analysis

---

## 1. Executive Summary

The **Integration Standards Library** (ACC-03) is a reusable collection of 6 pre-built standards modules that accelerate Phase 4 (Standards Definition) of Enterprise Data Architecture engagements. Rather than building governance artifacts from scratch at each client, engagement teams adapt proven templates — reducing per-engagement standards effort by 30–57% (200–400 hours) and improving cross-portfolio consistency.

This roadmap defines the standard engagement deployment sequence for the Integration Standards Library accelerator. Engagement teams follow this phased approach during Phase 4 (Standards Definition) to deploy pre-built standards modules, adapt them to client-specific requirements, and validate compliance alignment. The deployment sequence is organized by dependency and standalone value: accelerator setup and client assessment first (Phase 0), then foundation standards (naming conventions, data classification), then core governance standards (API governance, data quality), then advanced frameworks (metadata/lineage, integration patterns, manufacturing overlays), and finally cross-module validation and client handoff.

### Scope

| Module | ID | Engagement Deployment Hours | Phase |
|--------|----|----------------------------|-------|
| Accelerator Setup & Assessment | — | ~40 | Phase 0 |
| Naming Convention Standards | ISL-03 | ~30 | Phase 1 |
| Data Classification Framework | ISL-04 | ~30 | Phase 1 |
| API Governance Standards | ISL-01 | ~35 | Phase 2 |
| Data Quality Standards | ISL-06 | ~35 | Phase 2 |
| Metadata & Data Lineage Framework | ISL-02 | ~35 | Phase 3 |
| Integration Pattern Library | ISL-05 | ~35 | Phase 3 |
| Manufacturing Overlays | — | ~20 | Phase 3 |
| Validation & Handoff | — | ~40 | Phase 4 |
| **Total** | | **~300** | **5 phases** |

### Hours Impact (Per Engagement)

| Metric | Baseline (Without ISL) | Accelerated (With ISL) | Savings |
|--------|----------------------|----------------------|---------|
| Phase 0: Accelerator Setup & Assessment | 40–60 hrs | ~40 hrs | 0–20 hrs |
| Phase 1: Foundation Standards Deployment | 90–150 hrs | ~60 hrs | 30–90 hrs |
| Phase 2: Core Standards Deployment | 130–200 hrs | ~70 hrs | 60–130 hrs |
| Phase 3: Advanced Standards Deployment | 160–240 hrs | ~90 hrs | 70–150 hrs |
| Phase 4: Validation & Handoff | 60–80 hrs | ~40 hrs | 20–40 hrs |
| **Total Phase 4 (Standards Definition)** | **500–700 hrs** | **~300 hrs** | **200–400 hrs** |
| **Reduction** | | | **30–57%** |

---

## 2. Scope & Module Inventory

### 2.1 Module Breakdown

| # | Module | ID | Templates | Examples | Engagement Deployment Hrs | Baseline Hrs | Reduction |
|---|--------|----|-----------|----------|--------------------------|-------------|-----------|
| 1 | Naming Conventions | ISL-03 | 7 | 2 | ~15 | 20–32 hrs | 55–65% |
| 2 | Data Classification | ISL-04 | 6 | 3 | ~20 | 35–60 hrs | 50–60% |
| 3 | API Governance | ISL-01 | 6 | 2 | ~25 | 60–85 hrs | 55–70% |
| 4 | Data Quality | ISL-06 | 6 | 3 | ~20 | 30–45 hrs | 50–60% |
| 5 | Metadata & Lineage | ISL-02 | 6 | 3 | ~30 | 70–110 hrs | 60–70% |
| 6 | Integration Patterns | ISL-05 | 8 patterns | 3 diagrams | ~30 | 60–90 hrs | 35–45% |
| | **Total** | | **39 templates** | **16 examples** | **~140** | **275–422 hrs** | **~50%** |

> **Note:** Engagement Deployment Hours reflect the engagement team's effort to adapt ISL templates to the client's context. Baseline Hours reflect the effort required to build equivalent standards from scratch. The difference is the direct time savings the accelerator delivers per engagement.

### 2.2 Out of Scope

The following are related accelerators but are **not** deployed as part of the ISL engagement sequence:

- Manufacturing Data Architecture Blueprints — ACC-01
- RFP Discovery Questionnaire Tool — ACC-02
- Governance Maturity Assessment Framework — ACC-04
- Microsoft Fabric Migration Toolkit — ACC-05
- Synapse-to-Fabric Migration Accelerators — Separate repository

### 2.3 Engagement Deployment Dependency Map

Modules must be deployed in dependency order — downstream modules reference upstream conventions. Deploy in this sequence at each engagement:

```
Phase 0: Accelerator Setup & Assessment
  │
  └──► Phase 1: Foundation Standards Deployment
        │
        ├── ISL-03: Naming Conventions
        │     │
        │     └──► ISL-04: Data Classification
        │
        └──► Phase 2: Core Standards Deployment
              │
              ├── ISL-01: API Governance ◄── ISL-03, ISL-04
              │
              ├── ISL-06: Data Quality ◄── ISL-03, ISL-04
              │
              └──► Phase 3: Advanced Standards Deployment
                    │
                    ├── ISL-02: Metadata & Lineage ◄── ISL-03, ISL-04, ISL-06
                    │
                    ├── ISL-05: Integration Patterns ◄── ISL-03, ISL-01, ISL-06
                    │
                    ├── Manufacturing Overlays ◄── All modules
                    │
                    └──► Phase 4: Validation & Handoff ◄── All modules
```

ISL-03 (Naming Conventions) is the foundational module — every other module references it. ISL-04 (Data Classification) is the second dependency — security tiers are referenced by API governance, quality SLAs, and metadata attributes. This sequence ensures each module has its upstream dependencies in place before adaptation begins.

---

## 3. Engagement Prerequisites

### 3.1 Client Environment Access

- [ ] Client Microsoft Fabric workspace access provisioned — engagement team has Contributor or higher permissions
- [ ] Client Azure tenant access confirmed — Entra ID, Purview, and relevant Azure services accessible
- [ ] Client data landscape inventory available — source systems, data domains, integration points documented
- [ ] Client existing governance artifacts collected — any current naming conventions, data dictionaries, or standards documents
- [ ] Client security and compliance requirements documented — regulatory landscape (SOX, GDPR, ITAR, HIPAA, etc.)

### 3.2 Stakeholder Alignment

- [ ] Executive sponsor identified — client-side authority for standards adoption and enforcement
- [ ] Data Governance stakeholder identified — authority over classification, metadata, and quality standards
- [ ] Enterprise Architecture stakeholder identified — authority over API governance and integration patterns
- [ ] Security/Compliance stakeholder identified — authority over classification tiers and regulatory alignment
- [ ] Review and approval cadence agreed — weekly or bi-weekly checkpoint schedule confirmed with client

### 3.3 Engagement Team Assigned

- [ ] Engagement Lead assigned — owns delivery timeline, client communication, and escalation path
- [ ] Standards Architect assigned — standards design authority, cross-module consistency review
- [ ] Data Governance Consultant assigned — classification, metadata, quality module adaptation
- [ ] Integration Architect assigned — API governance, integration patterns, technical validation
- [ ] Client SMEs identified — 2–3 subject matter experts from client side for domain validation

### 3.4 Reference Materials

- [ ] Microsoft Purview documentation — sensitivity labels, metadata schema, lineage capabilities
- [ ] Microsoft Fabric documentation — naming conventions, workspace RBAC, OneLake taxonomy
- [ ] Azure Cloud Adoption Framework — resource naming, tagging, governance best practices
- [ ] OWASP API Security Top 10 (2023) — API governance alignment
- [ ] Industry compliance frameworks — SOX, GDPR, ITAR, HIPAA control requirements applicable to client

### 3.5 Tooling

- [ ] ISL repository cloned — engagement team has local copy of the Integration Standards Library
- [ ] Markdown authoring environment — VS Code + Markdown Preview
- [ ] Diagram tooling — Mermaid, draw.io, or Lucidchart for architecture diagrams
- [ ] Collaboration platform — SharePoint, Teams, or GitHub for client review and feedback

### 3.6 Engagement Team Allocation

| Role | Allocation | Weekly Capacity | Primary Modules |
|------|-----------|----------------|-----------------|
| Engagement Lead | 40% | 16 hrs/week | All — delivery management, client liaison, design authority |
| Standards Architect | 75% | 30 hrs/week | All — cross-module consistency, technical review |
| Data Governance Consultant | 75% | 30 hrs/week | ISL-02, ISL-04, ISL-06 — classification, metadata, quality |
| Integration Architect | 75% | 30 hrs/week | ISL-01, ISL-03, ISL-05 — API governance, naming, patterns |
| Client SMEs | 25% | 10 hrs/week | All — domain validation, acceptance review |
| **Total** | | **~116 hrs/week** | |

### 3.7 External Dependencies

- [ ] ACC-04 (Governance Maturity Assessment) — maturity tier definitions inform module adaptation depth (recommended, not blocking)
- [ ] ACC-02 (RFP Discovery Questionnaire) — discovery responses Q18–Q22 provide client context for adaptation (recommended, not blocking)

---

## 4. Phase 0: Accelerator Setup & Assessment

**Duration:** 1 week | **Engagement Deployment Hours:** ~40
**Baseline Equivalent:** 40–60 hrs

### 4.1 Deploy Accelerator Repository

Clone and configure the ISL repository for the engagement:
- [ ] Clone ISL repository into engagement workspace (Git or SharePoint)
- [ ] Create client-specific branch for adaptation tracking
- [ ] Configure folder structure for client deliverables
- [ ] Verify all 39 templates and 16 examples are intact and current version
- [ ] Set up review workflow (PR-based or document review, depending on client tooling)

### 4.2 Run Governance Maturity Assessment

Assess the client's current governance maturity to inform module adaptation depth:
- [ ] Conduct governance maturity assessment using ACC-04 framework (or lightweight alternative)
- [ ] Score client across governance maturity dimensions (policy, process, technology, organization, metrics)
- [ ] Classify client maturity tier: Foundational / Developing / Defined / Managed / Optimizing
- [ ] Document current-state governance artifacts already in place at the client
- [ ] Identify gaps between current state and target state

### 4.3 Score Client & Select Modules

Based on maturity assessment, determine deployment scope:
- [ ] Assign maturity score (1–5) per governance dimension
- [ ] Confirm which of the 6 ISL modules are in scope for this engagement
- [ ] Determine adaptation depth per module: light (score 3–4), moderate (score 2–3), or heavy (score 1–2)
- [ ] Flag any client-specific requirements not covered by ISL templates (custom extensions)
- [ ] Review client's existing standards — identify conflicts, overlaps, and gaps

### 4.4 Build Engagement Deployment Plan

- [ ] Finalize phase schedule with client stakeholders
- [ ] Confirm module selection and adaptation depth
- [ ] Identify industry-specific overlays needed (manufacturing, healthcare, financial services, etc.)
- [ ] Establish review cadence and approval gates with client
- [ ] Build adaptation checklist per module (what to keep as-is, what to modify, what to add)
- [ ] **Phase 0 Complete — Engagement deployment scope locked, client aligned**

---

## 5. Phase 1: Foundation Standards Deployment

**Duration:** 2 weeks | **Engagement Deployment Hours:** ~60
**Baseline Equivalent:** 90–150 hrs | **Savings:** 30–90 hrs

Foundation modules are deployed first because every subsequent module depends on them. ISL-03 (Naming Conventions) establishes the vocabulary the client will use across all standards. ISL-04 (Data Classification) establishes the security framework that governs access controls, API security tiers, and quality SLAs. Adapting these pre-built modules to the client context replaces the baseline effort of building them from scratch.

### 5.1 ISL-03: Naming Convention Standards

**Accelerated:** ~30 hrs | **Baseline:** 40–65 hrs | **Savings:** 10–35 hrs

| Deliverable | Description | Engagement Hrs |
|-------------|-------------|---------------|
| 7 naming templates adapted | Database/schema, table/view, column, pipeline, API, infrastructure, abbreviation dictionary — adapted to client naming context | 12–16 |
| 2 client-specific examples | Client Fabric naming reference, client domain-specific naming examples | 4–6 |
| Enforcement guidance adapted | Azure Policy definitions, linting rules, pre-commit hooks — configured for client environment | 4–6 |
| Client review & approval | Walk through standards with client SMEs, incorporate feedback, obtain sign-off | 3–5 |
| **Subtotal** | | **~30** |

- [ ] All 7 templates adapted to client naming conventions and terminology
- [ ] Client-specific abbreviation dictionary extended with client domain terms
- [ ] Fabric naming patterns validated against client's Fabric workspace configuration
- [ ] Enforcement rules configured for client's Azure environment
- [ ] Client stakeholder review and approval obtained

### 5.2 ISL-04: Data Classification Framework

**Accelerated:** ~30 hrs | **Baseline:** 50–85 hrs | **Savings:** 20–55 hrs

| Deliverable | Description | Engagement Hrs |
|-------------|-------------|---------------|
| 6 classification templates adapted | Tier definitions, labeling, handling, access control, compliance mapping, decision tree — mapped to client regulatory requirements | 12–16 |
| 3 client-specific examples | Client industry classification, Fabric security model for client, Purview label configuration | 6–8 |
| Compliance mapping adapted | Client-specific regulatory requirements mapped to classification tiers (SOX, GDPR, ITAR, HIPAA, etc.) | 5–7 |
| Client review & approval | Present classification framework to governance and compliance stakeholders, obtain sign-off | 3–5 |
| **Subtotal** | | **~30** |

- [ ] 4-tier classification model (Public/Internal/Confidential/Restricted) adapted to client data landscape
- [ ] Microsoft Purview label taxonomy configured for client's sensitivity labels
- [ ] Compliance mapping matrix covers all regulations applicable to the client
- [ ] Industry overlay applied if applicable (manufacturing ITAR/EAR, healthcare HIPAA, etc.)
- [ ] Client stakeholder review and approval obtained
- [ ] **Phase 1 Complete — Foundation standards deployed and approved by client**

---

## 6. Phase 2: Core Standards Deployment

**Duration:** 2 weeks | **Engagement Deployment Hours:** ~70
**Baseline Equivalent:** 130–200 hrs | **Savings:** 60–130 hrs

Core modules build on the foundation and cover the two most universally applicable governance domains: API management and data quality. These modules reference the naming conventions (ISL-03) and classification tiers (ISL-04) deployed in Phase 1.

### 6.1 ISL-01: API Governance Standards

**Accelerated:** ~35 hrs | **Baseline:** 65–100 hrs | **Savings:** 30–65 hrs

| Deliverable | Description | Engagement Hrs |
|-------------|-------------|---------------|
| 6 API templates adapted | Design standards, versioning, security, lifecycle, catalog, rate limiting — customized to client API landscape | 14–18 |
| 2 client-specific examples | Client-specific API standards, Fabric-native API patterns for client environment | 5–7 |
| OWASP alignment verified | Cross-reference each template against OWASP API Top 10 for client context | 3–4 |
| Security patterns adapted | OAuth 2.0/OIDC patterns configured for client's Azure AD/Entra ID setup | 3–4 |
| Client review & approval | Present API governance standards to integration and security stakeholders | 3–4 |
| **Subtotal** | | **~35** |

- [ ] RESTful design standards adapted to client's existing API conventions and tooling
- [ ] OAuth 2.0/OIDC security patterns configured for client's Azure AD/Entra ID tenant
- [ ] API lifecycle governance aligned with client's existing SDLC and change management process
- [ ] OWASP API Security Top 10 cross-reference validated for client's threat landscape
- [ ] Client stakeholder review and approval obtained

### 6.2 ISL-06: Data Quality Standards

**Accelerated:** ~35 hrs | **Baseline:** 65–100 hrs | **Savings:** 30–65 hrs

| Deliverable | Description | Engagement Hrs |
|-------------|-------------|---------------|
| 6 quality templates adapted | Dimensions, SLA framework, rule library, monitoring, remediation, scorecard — tailored to client data domains | 14–18 |
| 3 client-specific examples | Client-specific quality rules, Fabric quality implementation, dashboard spec | 5–7 |
| Quality rule library adapted | Pre-built rules selected and customized for client's critical data domains from 50+ rule library | 5–7 |
| Client review & approval | Present data quality framework to data governance and business stakeholders | 3–4 |
| **Subtotal** | | **~35** |

- [ ] 6 quality dimensions defined with measurement formulas relevant to client's data domains
- [ ] SLA thresholds configured per data criticality tier (referencing client-adapted ISL-04 classification)
- [ ] Quality rules selected and customized for client's most critical data assets
- [ ] Quality scorecard template configured with client-specific KPIs and reporting cadence
- [ ] Client stakeholder review and approval obtained
- [ ] **Phase 2 Complete — Core governance standards deployed and approved by client**

---

## 7. Phase 3: Advanced Standards Deployment

**Duration:** 3 weeks | **Engagement Deployment Hours:** ~90
**Baseline Equivalent:** 160–240 hrs | **Savings:** 70–150 hrs

Advanced modules are the most complex and deliver the deepest per-engagement savings. These modules have the most upstream dependencies (ISL-03, ISL-04, ISL-06, ISL-01) and require the most client-specific adaptation. Phase 3 runs for 3 weeks to accommodate the higher adaptation effort and the inclusion of industry-specific manufacturing overlays.

### 7.1 ISL-02: Metadata & Data Lineage Framework

**Accelerated:** ~35 hrs | **Baseline:** 55–85 hrs | **Savings:** 20–50 hrs

| Deliverable | Description | Engagement Hrs |
|-------------|-------------|---------------|
| 6 metadata templates adapted | Business glossary, technical metadata schema, lineage requirements, catalog governance, metadata integration, lineage visualization — mapped to client metadata landscape | 16–20 |
| 3 client-specific examples | Client metadata model, Fabric OneLake metadata for client, Purview configuration guide | 6–8 |
| Industry overlay applied | Client-specific industry metadata extensions (IoT/OT, ERP mapping, product data management) | 4–6 |
| Client review & approval | Present metadata and lineage framework to data architecture and governance stakeholders | 3–4 |
| **Subtotal** | | **~35** |

- [ ] Technical metadata schema aligned to client's Microsoft Purview and Fabric OneLake configuration
- [ ] Business glossary standards adapted with client's domain terminology and ownership model
- [ ] Data lineage requirements configured for client's column-level, table-level, and pipeline-level traceability needs
- [ ] Industry-specific metadata extensions applied (e.g., IoT sensor registries, ERP cross-references, BOM lineage for manufacturing)
- [ ] Client stakeholder review and approval obtained

### 7.2 ISL-05: Integration Pattern Library

**Accelerated:** ~35 hrs | **Baseline:** 55–85 hrs | **Savings:** 20–50 hrs

| Deliverable | Description | Engagement Hrs |
|-------------|-------------|---------------|
| 8 integration patterns adapted | ERP extract, IoT ingestion, API gateway, event-driven, MDM sync, file-based, medallion, reverse ETL — selected and adapted for client architecture | 16–20 |
| 3 architecture diagrams adapted | Client landscape overview, Fabric integration architecture for client, pattern decision tree | 6–8 |
| Decision framework configured | Pattern selection criteria calibrated to client's source systems, latency, volume, and security requirements | 4–6 |
| Client review & approval | Present integration patterns to integration and architecture stakeholders | 3–4 |
| **Subtotal** | | **~35** |

- [ ] Applicable patterns selected and adapted based on client's source systems and integration requirements
- [ ] Each deployed pattern includes client-specific Fabric implementation guidance and architecture diagrams
- [ ] Decision framework calibrated to client's technology stack and integration priorities
- [ ] Medallion architecture pattern cross-references client-adapted ISL-03 (naming) and ISL-06 (quality gates)
- [ ] Client stakeholder review and approval obtained

### 7.3 Manufacturing Overlays (If Applicable)

Consolidate and finalize industry-specific extensions across all modules:
- [ ] ITAR/EAR compliance overlay finalized (ISL-04)
- [ ] IoT/OT metadata standards finalized (ISL-02)
- [ ] ERP integration patterns finalized (ISL-05)
- [ ] Manufacturing quality rules validated (ISL-06)
- [ ] Welding/process data classification completed (ISL-04)
- [ ] All overlays reviewed with client manufacturing SMEs

**Subtotal:** ~20 hrs (included in Phase 3 total)

- [ ] **Phase 3 Complete — All advanced standards modules deployed, industry overlays applied**

---

## 8. Phase 4: Validation & Handoff

**Duration:** 1 week | **Engagement Deployment Hours:** ~40
**Baseline Equivalent:** 60–80 hrs | **Savings:** 20–40 hrs

### 8.1 Cross-Module Review

Validate consistency and completeness across all deployed modules:
- [ ] Cross-module naming consistency audit — ISL-03 naming conventions applied uniformly across all adapted modules
- [ ] Cross-references validated — classification tiers, quality dimensions, and metadata attributes aligned correctly
- [ ] Terminology consistency — client-specific terms used uniformly throughout all deliverables
- [ ] Gap analysis — confirm no regulatory or governance gaps in the adapted standards suite
- [ ] No orphan references — every cross-module reference resolves correctly in the client context

### 8.2 Compliance Audit

Verify standards alignment with applicable regulatory and industry frameworks:
- [ ] OWASP API Security Top 10 alignment verified (ISL-01)
- [ ] Data classification controls verified against client's applicable regulations (SOX, GDPR, ITAR, HIPAA, etc.)
- [ ] NIST 800-53 / ISO 27001 alignment confirmed where applicable
- [ ] DAMA DMBOK alignment verified for metadata and quality standards
- [ ] All compliance findings documented and resolved

### 8.3 Client Presentation & Sign-Off

Deliver the complete standards library to client stakeholders:
- [ ] Executive summary presentation prepared — scope, standards deployed, adoption roadmap
- [ ] Module-by-module walkthrough with client governance and technical teams
- [ ] Client feedback incorporated — final round of revisions
- [ ] Formal sign-off obtained from client executive sponsor and governance stakeholders
- [ ] Standards adoption plan agreed — how the client will operationalize the standards

### 8.4 Handoff & Knowledge Transfer

Transfer ownership of the adapted standards to the client's governance and implementation teams:
- [ ] All adapted standards documents delivered to client environment (SharePoint, Teams, Git, or client-preferred platform)
- [ ] Adoption roadmap provided — phased enforcement plan with milestones
- [ ] Enforcement guidance delivered — Azure Policy definitions, linting rules, Purview configurations
- [ ] Knowledge transfer session conducted with client governance team
- [ ] Standards maintenance guide provided — how to update, extend, and version standards over time
- [ ] Implementation team briefed on how to apply standards during Phase 5+ execution
- [ ] Engagement retrospective completed — hours tracked, lessons learned documented
- [ ] Lessons learned fed back into ISL master repository for continuous improvement
- [ ] **Phase 4 Complete — Standards library deployed, client handoff complete**

---

## 9. Engagement Delivery Risk Register

| ID | Risk | Probability | Impact | Mitigation | Phase |
|----|------|------------|--------|------------|-------|
| R1 | Client delays — stakeholder availability or review cycle delays push timeline | High | Medium | Build 2–3 day buffer per phase; establish review cadence in Phase 0; escalate early through Engagement Lead | Phase 1–4 |
| R2 | Scope creep — client requests standards beyond ISL module scope | High | Medium | Define scope boundaries in Phase 0; defer out-of-scope requests to follow-on engagement; document change requests formally; additional modules require SOW amendment | Phase 1–3 |
| R3 | Existing standards conflicts — client has partial standards that conflict with ISL templates | Medium | High | Run conflict analysis in Phase 0; adapt ISL modules to align with or supersede existing client standards; document reconciliation decisions | Phase 0–1 |
| R4 | Technology drift — Fabric/Purview features change during deployment | Low | Medium | Use current GA features only; document feature dependencies; plan for post-deployment refresh if needed | Phase 1–3 |
| R5 | Adoption resistance — client teams resist new standards enforcement | Medium | High | Engage client SMEs throughout deployment; demonstrate value with concrete examples; align enforcement with client incentive structures; include change management in handoff | Phase 2–4 |
| R6 | Engagement team availability — key team members pulled to other engagements | Medium | High | Protect 75% allocation through Phase 3; ensure cross-training so no single point of failure; escalate resource conflicts immediately | Phase 1–3 |
| R7 | Regulatory gaps — missing client-specific regulatory requirements in compliance mapping | Low | High | Conduct thorough regulatory landscape assessment in Phase 0; involve client legal/compliance team in ISL-04 review; validate with external compliance frameworks | Phase 1–2 |
| R8 | Cross-module inconsistency — terminology drift between adapted modules | Medium | Medium | ISL-03 naming conventions deployed first and enforced across all subsequent modules; Standards Architect reviews every module before client presentation | Phase 1–3 |
| R9 | Client data landscape complexity — more data domains or integration points than anticipated | Medium | Medium | Scope assessment in Phase 0 captures data landscape; prioritize highest-value domains first; defer edge cases to adoption roadmap | Phase 0–2 |
| R10 | Insufficient client SME engagement — client resources not available for domain validation | Medium | High | Confirm SME availability and allocation in Phase 0 prerequisites; schedule validation sessions 2 weeks in advance; provide asynchronous review options | Phase 1–3 |

---

## 10. Success Criteria

### 10.1 Client Outcomes

- [ ] Standards adopted — client governance team formally adopts deployed standards for ongoing enforcement
- [ ] Module completeness — all selected ISL modules adapted, reviewed, and approved by client stakeholders
- [ ] Compliance alignment — zero unresolved gaps identified in compliance audit against applicable regulatory frameworks
- [ ] Adoption roadmap delivered — client has a clear, phased plan for standards enforcement post-engagement
- [ ] Client satisfaction — engagement NPS score of 8/10 or higher, or satisfaction rating of 4/5 or higher

### 10.2 Engagement Efficiency

- [ ] Hours saved vs. baseline — engagement deployment hours at least 30% below baseline estimate (minimum 200 hours saved)
- [ ] Phase 4 completion within budget — actual hours within 15% of ~300 hour accelerated estimate
- [ ] Timeline adherence — deployment completed within 9-week phase schedule (plus or minus 1 week)
- [ ] Rework minimized — fewer than 2 major revision cycles per module after initial client review

### 10.3 Quality & Consistency

- [ ] Cross-module consistency — naming conventions from ISL-03 applied uniformly across all deployed modules
- [ ] Compliance coverage — zero gaps identified in Phase 4 compliance audit
- [ ] Adaptation workflow validated — engagement team confirms ISL templates reduced adaptation effort vs. building from scratch
- [ ] Client-specific extensions documented — any custom additions are structured for potential backport to the ISL master repository
- [ ] Knowledge transfer effective — client governance team can independently maintain and extend the deployed standards

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

*This roadmap defines the standard engagement deployment sequence for the [Integration Standards Library Accelerator](Integration_Standards_Library_DMTSP_Accelerator.md). Engagement teams follow this phased approach during Phase 4 (Standards Definition) to deploy pre-built standards modules and reduce standards definition effort by 200–400 hours (30–57%) per engagement. Re-baseline module selection and adaptation estimates at Phase 0 exit gate based on client-specific assessment results.*

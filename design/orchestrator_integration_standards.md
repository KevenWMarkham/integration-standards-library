# Integration Standards Library — Engagement Sprint Orchestrator

**Version:** 2.0
**Author:** Keven Markham, VP Enterprise Transformation — DMTSP
**Date:** February 6, 2026
**Execution Model:** Phase 4 Accelerated Delivery
**Reusability:** Global — deployed at every Enterprise Data Architecture engagement
**Related Documents:**
- [Roadmap](../roadmap.md) — Strategic phases, prerequisites, risk register
- [Backlog](../backlog.md) — Epics, stories, acceptance criteria
- [Accelerator Overview](../Integration_Standards_Library_DMTSP_Accelerator.md) — Accelerator overview and ROI analysis

---

## Team Allocation Matrix

**Sprint Cadence:** 1–2 week sprints | **Team Capacity:** Varies by engagement | **4 Roles (engagement + client)**

| Role | Sprint 0 | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 |
|------|----------|----------|----------|----------|----------|
| Engagement Lead (1x30) | 20 | 12 | 12 | 15 | 25 |
| Integration Architect (1x40) | 8 | 20 | 35 | 45 | 5 |
| Data Governance Lead (1x40) | 8 | 25 | 20 | 25 | 8 |
| Client Stakeholder (1x10) | 4 | 3 | 3 | 5 | 2 |
| **Sprint Subtotal** | **40** | **60** | **70** | **90** | **40** |

> The engagement team deploys ISL modules at the client site, adapting each module to the client's environment, compliance posture, and technology stack. The Client Stakeholder role ensures alignment with organizational standards and provides domain context throughout. Hour allocations are guidelines — adjust per engagement complexity.

---

## Sprint Timeline

```
Sprint 0 ──── Sprint 1 ──── Sprint 2 ──── Sprint 3 ──── Sprint 4
Setup &       Foundation    Core          Advanced      Validation
Assessment    Deployment    Deployment    Deployment    & Handoff

              ISL-03 ────►  ISL-01 ────►  ISL-02 ────►
              ISL-04 ────►  ISL-06 ────►  ISL-05 ────►  Sign-off
                                                         Handoff

Week 0        Week 1-2      Week 3-4      Week 5-7      Week 8
40 hrs        60 hrs        70 hrs        90 hrs        40 hrs
```

> Total accelerated delivery: ~300 hours across 8 weeks. Baseline without accelerator: 500–750 hours across 14–20 weeks. ISL modules provide pre-authored templates, examples, and compliance mappings — the engagement team adapts and deploys them rather than authoring from scratch.

---

## Sprint 0 — Accelerator Setup & Assessment

**Duration:** 1 week | **Total Hours:** 40
**Backlog Epic:** [E0](../backlog.md#epic-e0-setup--assessment)
**Baseline without Accelerator:** 60–80 hrs for discovery and scoping

### Entry Criteria

- [ ] Engagement SOW signed and project kickoff complete
- [ ] Client environment access provisioned (Azure tenant, Fabric workspace, Purview instance)
- [ ] ISL v1.0 available in DMTSP engagement repository
- [ ] Engagement team assigned (Engagement Lead, Integration Architect, Data Governance Lead)
- [ ] Client Stakeholder identified and availability confirmed

### Exit Criteria

- [ ] ISL deployed to engagement workspace
- [ ] Client maturity assessment complete across all 6 domains
- [ ] Module selection locked based on engagement scope and SOW deliverables
- [ ] Adaptation checklist customized for client environment
- [ ] Engagement-specific acceptance criteria defined and client-approved
- [ ] Client stakeholders aligned on sprint plan and deliverables

### Tasks

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S0-T1 | Deploy ISL v1.0 to engagement workspace and validate module integrity | 2 | Integration Architect | E0-S1.T1 |
| S0-T2 | Conduct client maturity assessment interviews (data governance, integration, metadata) | 6 | Engagement Lead | E0-S1.T2 |
| S0-T3 | Score client across 6 ISL domains (API governance, metadata, naming, classification, quality, integration) | 4 | Data Governance Lead | E0-S1.T3 |
| S0-T4 | Inventory client technology stack (Azure services, Fabric workspaces, APIM, Purview, Entra ID) | 4 | Integration Architect | E0-S1.T4 |
| S0-T5 | Select ISL modules per engagement scope and SOW deliverables | 3 | Engagement Lead | E0-S1.T5 |
| S0-T6 | Customize adaptation checklist for each selected module | 4 | Data Governance Lead | E0-S1.T6 |
| S0-T7 | Identify client compliance requirements (SOX, GDPR, CCPA, ITAR, HIPAA, industry-specific) | 4 | Data Governance Lead | E0-S1.T7 |
| S0-T8 | Map client organizational taxonomy (domains, business units, data owners) | 3 | Engagement Lead | E0-S1.T8 |
| S0-T9 | Define engagement-specific acceptance criteria with client stakeholders | 4 | Engagement Lead | E0-S1.T9 |
| S0-T10 | Conduct scope alignment workshop with client leadership | 4 | Client Stakeholder | E0-S1.T10 |
| S0-T11 | Finalize sprint plan, resource commitments, and communication cadence | 2 | Engagement Lead | E0-S1.T11 |

### Role Assignment Matrix — Sprint 0

| Role | Tasks | Total |
|------|-------|-------|
| Engagement Lead | S0-T2, T5, T8, T9, T11 | 18 |
| Integration Architect | S0-T1, T4 | 6 |
| Data Governance Lead | S0-T3, T6, T7 | 12 |
| Client Stakeholder | S0-T10 (+ participation in T2, T9) | 4 |
| | **Sprint Total** | **40** |

### Milestones

| ID | Milestone | Criteria | Day |
|----|-----------|----------|-----|
| M0.1 | ISL Deployed | ISL v1.0 deployed to engagement workspace; module integrity validated | Day 1 |
| M0.2 | Assessment Complete | Client scored across 6 domains; technology stack inventoried; compliance requirements identified | Day 3 |
| M0.3 | **Scope Locked** | **Module selection finalized; adaptation checklist customized; acceptance criteria client-approved; sprint plan confirmed** | Day 5 |

### Blockers to Escalate

- Client environment access not provisioned → Escalate to Client Stakeholder and engagement PMO
- Client Stakeholder unavailable for assessment interviews → Escalate to Engagement Lead; reschedule within 48 hrs
- ISL v1.0 not available or modules corrupted → Escalate to DMTSP Practice Lead for latest release

---

## Sprint 1 — Foundation Standards Deployment

**Duration:** 2 weeks | **Total Hours:** 60
**Backlog Epic:** [E1](../backlog.md#epic-e1-foundation-deployment)
**Baseline without Accelerator:** 90–150 hrs → **Accelerated: ~60 hrs**

### Entry Criteria

- [ ] M0.3 Scope Locked achieved
- [ ] Adaptation checklist customized for ISL-03 and ISL-04
- [ ] Client domain taxonomy documented (from S0-T8)
- [ ] Client compliance requirements identified (from S0-T7)
- [ ] Client Fabric environment accessible

### Exit Criteria

- [ ] ISL-03 naming conventions adapted to client's Fabric/Azure environment
- [ ] ISL-04 classification tiers adapted to client's compliance requirements
- [ ] Purview sensitivity labels mapped to client's taxonomy
- [ ] Client review workshop conducted; feedback incorporated
- [ ] Foundation standards client-approved and ready for downstream consumption in Sprint 2

### Tasks — ISL-03: Naming Convention Adaptation

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S1-T1 | Adapt database and schema naming templates to client domain taxonomy | 3 | Integration Architect | E1-S1.T1 |
| S1-T2 | Customize table, view, and column naming standards to client data model conventions | 3 | Integration Architect | E1-S1.T2 |
| S1-T3 | Adapt pipeline and dataflow naming templates to client's Fabric workspace structure | 2 | Integration Architect | E1-S1.T3 |
| S1-T4 | Adapt API and endpoint naming templates to client's APIM or gateway configuration | 2 | Integration Architect | E1-S1.T4 |
| S1-T5 | Customize infrastructure resource naming to client's Azure subscription and resource group hierarchy | 2 | Integration Architect | E1-S1.T5 |
| S1-T6 | Extend abbreviation dictionary with client-specific domain terms and acronyms | 2 | Integration Architect | E1-S1.T6 |
| S1-T7 | Validate naming conventions against current Fabric documentation and Azure resource naming limits | 2 | Integration Architect | E1-S1.T7 |

### Tasks — ISL-04: Data Classification Adaptation

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S1-T8 | Adapt 4-tier classification definitions to client's data sensitivity landscape | 4 | Data Governance Lead | E1-S2.T1 |
| S1-T9 | Map Purview sensitivity labels to client's existing labeling taxonomy | 4 | Data Governance Lead | E1-S2.T2 |
| S1-T10 | Customize data handling requirements per client compliance posture (SOX, GDPR, CCPA, HIPAA, ITAR) | 5 | Data Governance Lead | E1-S2.T3 |
| S1-T11 | Adapt access control alignment to client's Entra ID groups and Fabric RBAC model | 4 | Data Governance Lead | E1-S2.T4 |
| S1-T12 | Customize compliance mapping matrix to client's regulatory obligations | 4 | Data Governance Lead | E1-S2.T5 |
| S1-T13 | Adapt classification decision tree to client data domains and sensitivity patterns | 2 | Data Governance Lead | E1-S2.T6 |

### Tasks — Client Review & Alignment

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S1-T14 | Prepare foundation standards review package for client presentation | 2 | Engagement Lead | E1-S3.T1 |
| S1-T15 | Conduct ISL-03 naming convention review workshop with client data stewards | 3 | Engagement Lead | E1-S3.T2 |
| S1-T16 | Conduct ISL-04 classification review workshop with client compliance team | 3 | Engagement Lead | E1-S3.T3 |
| S1-T17 | Incorporate client feedback into ISL-03 and ISL-04 deliverables | 3 | Integration Architect, Data Governance Lead | E1-S3.T4 |
| S1-T18 | Client sign-off on foundation standards | 1 | Client Stakeholder | E1-S3.T5 |

### Role Assignment Matrix — Sprint 1

| Role | ISL-03 Tasks | ISL-04 Tasks | Review Tasks | Total |
|------|-------------|-------------|-------------|-------|
| Integration Architect | S1-T1 through T7 | — | S1-T17 (partial) | 18 |
| Data Governance Lead | — | S1-T8 through T13 | S1-T17 (partial) | 25 |
| Engagement Lead | — | — | S1-T14, T15, T16 | 8 |
| Client Stakeholder | — | — | S1-T18 (+ participation in T15, T16) | 3 |
| | | | **Sprint Total** | **54** |

> Buffer of ~6 hrs for rework cycles, follow-up questions from client workshops, and cross-team coordination.

### Milestones

| ID | Milestone | Criteria | Sprint Day |
|----|-----------|----------|------------|
| M1.1 | ISL-03 Adaptation Complete | All naming templates customized to client Fabric/Azure environment | Day 5 |
| M1.2 | ISL-04 Adaptation Complete | All classification templates customized to client compliance posture | Day 7 |
| M1.3 | Client Review Workshop — Foundation | ISL-03 and ISL-04 reviewed with client stakeholders; feedback collected | Day 8 |
| M1.4 | Feedback Incorporated | Client feedback resolved and incorporated into deliverables | Day 9 |
| M1.5 | **Foundation Deployed** | **ISL-03 + ISL-04 client-approved; foundation standards active and committed** | Day 10 |

---

## Sprint 2 — Core Standards Deployment

**Duration:** 2 weeks | **Total Hours:** 70
**Backlog Epic:** [E2](../backlog.md#epic-e2-core-deployment)
**Baseline without Accelerator:** 130–200 hrs → **Accelerated: ~70 hrs**

### Entry Criteria

- [ ] M1.5 Foundation Deployed achieved
- [ ] ISL-03 naming conventions available for reference (ISL-01 API naming references them)
- [ ] ISL-04 classification tiers available for cross-reference (ISL-06 quality SLAs reference them)
- [ ] Client API landscape documented (existing APIs, gateway platform, authentication patterns)
- [ ] Client data quality pain points and priority data domains documented

### Exit Criteria

- [ ] ISL-01 API governance adapted to client's technology stack and security model
- [ ] ISL-06 data quality standards adapted to client's data landscape
- [ ] OWASP API Top 10 cross-reference validated for client's API patterns
- [ ] Quality SLA thresholds configured per client classification tiers (from ISL-04)
- [ ] Client review conducted; core standards client-approved

### Tasks — ISL-01: API Governance Adaptation

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S2-T1 | Adapt API design standards to client technology stack (APIM, MuleSoft, Kong, or other gateway) | 5 | Integration Architect | E2-S1.T1 |
| S2-T2 | Customize API versioning policy to client's release cadence and consumer agreements | 3 | Integration Architect | E2-S1.T2 |
| S2-T3 | Adapt API security standards to client's Entra ID configuration (OAuth 2.0/OIDC flows) | 6 | Integration Architect | E2-S1.T3 |
| S2-T4 | Customize API lifecycle governance to client's SDLC and deployment pipeline | 4 | Integration Architect | E2-S1.T4 |
| S2-T5 | Adapt API catalog requirements to client's developer portal or service catalog tooling | 3 | Integration Architect | E2-S1.T5 |
| S2-T6 | Configure rate limiting and throttling policies per client's API consumer tiers | 3 | Integration Architect | E2-S1.T6 |
| S2-T7 | Conduct OWASP API Top 10 cross-reference validation against adapted standards | 4 | Integration Architect | E2-S1.T7 |

### Tasks — ISL-06: Data Quality Adaptation

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S2-T8 | Adapt quality dimension definitions to client's data landscape and priority domains | 3 | Data Governance Lead | E2-S2.T1 |
| S2-T9 | Configure quality SLA thresholds per client classification tiers (from ISL-04) | 4 | Data Governance Lead | E2-S2.T2 |
| S2-T10 | Customize quality rule library to client's source systems and known data quality issues | 5 | Data Governance Lead | E2-S2.T3 |
| S2-T11 | Adapt quality monitoring standards to client's Fabric workspace and pipeline architecture | 3 | Data Governance Lead | E2-S2.T4 |
| S2-T12 | Customize remediation workflow to client's incident management and ticketing process | 2 | Data Governance Lead | E2-S2.T5 |
| S2-T13 | Configure quality scorecard for client's executive reporting requirements and KPIs | 2 | Data Governance Lead | E2-S2.T6 |

### Tasks — Client Review & Alignment

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S2-T14 | Prepare core standards review package for client presentation | 2 | Engagement Lead | E2-S3.T1 |
| S2-T15 | Conduct ISL-01 API governance review workshop with client architecture team | 3 | Engagement Lead | E2-S3.T2 |
| S2-T16 | Conduct ISL-06 quality standards review workshop with client data stewards | 3 | Engagement Lead | E2-S3.T3 |
| S2-T17 | Incorporate client feedback into ISL-01 and ISL-06 deliverables | 3 | Integration Architect, Data Governance Lead | E2-S3.T4 |
| S2-T18 | Client sign-off on core standards | 1 | Client Stakeholder | E2-S3.T5 |

### Role Assignment Matrix — Sprint 2

| Role | ISL-01 Tasks | ISL-06 Tasks | Review Tasks | Total |
|------|-------------|-------------|-------------|-------|
| Integration Architect | S2-T1 through T7 | — | S2-T17 (partial) | 30 |
| Data Governance Lead | — | S2-T8 through T13 | S2-T17 (partial) | 21 |
| Engagement Lead | — | — | S2-T14, T15, T16 | 8 |
| Client Stakeholder | — | — | S2-T18 (+ participation in T15, T16) | 3 |
| | | | **Sprint Total** | **62** |

> Buffer of ~8 hrs for OWASP remediation findings, rework cycles, and coordination between API governance and quality teams.

### Milestones

| ID | Milestone | Criteria | Sprint Day |
|----|-----------|----------|------------|
| M2.1 | ISL-01 Adaptation Complete | All API governance templates customized to client technology stack | Day 5 |
| M2.2 | ISL-06 Adaptation Complete | All quality templates customized; SLA thresholds configured per classification tiers | Day 6 |
| M2.3 | OWASP Cross-Reference Pass | ISL-01 validated against OWASP API Top 10 for client's API patterns | Day 7 |
| M2.4 | Client Review Workshop — Core | ISL-01 and ISL-06 reviewed with client stakeholders; feedback collected | Day 8 |
| M2.5 | Feedback Incorporated | Client feedback resolved and incorporated into deliverables | Day 9 |
| M2.6 | **Core Deployed** | **ISL-01 + ISL-06 client-approved; core standards active and committed** | Day 10 |

---

## Sprint 3 — Advanced Standards Deployment

**Duration:** 3 weeks | **Total Hours:** 90
**Backlog Epic:** [E3](../backlog.md#epic-e3-advanced-deployment)
**Baseline without Accelerator:** 160–240 hrs → **Accelerated: ~90 hrs**

> Three-week sprint due to the complexity of ISL-02 (Metadata & Lineage) and ISL-05 (Integration Patterns), which require deep adaptation to client's pipeline architecture, source systems, and catalog environment. Manufacturing overlays (ITAR/EAR, IoT/OT, ERP) are applied during this sprint if the engagement scope includes industrial or manufacturing clients.

### Entry Criteria

- [ ] M2.6 Core Deployed achieved
- [ ] ISL-01 API governance available (ISL-05 API gateway pattern references it)
- [ ] ISL-06 quality standards available (ISL-05 medallion pattern references quality gates)
- [ ] ISL-03 naming and ISL-04 classification available (referenced throughout ISL-02 and ISL-05)
- [ ] Client's pipeline architecture and source systems documented
- [ ] Client's Purview/catalog environment accessible (or configuration documented)

### Exit Criteria

- [ ] ISL-02 metadata schema adapted to client's Purview/catalog environment
- [ ] ISL-05 integration patterns adapted to client's source systems and pipeline architecture
- [ ] Manufacturing overlays applied if applicable (ITAR/EAR, IoT/OT, ERP)
- [ ] All inter-module cross-references validated in client context
- [ ] Client review conducted; advanced standards client-approved
- [ ] **All 6 standards modules deployed at client**

### Tasks — ISL-02: Metadata & Data Lineage Adaptation

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S3-T1 | Adapt business glossary standards to client's domain vocabulary and term ownership model | 4 | Data Governance Lead | E3-S1.T1 |
| S3-T2 | Customize technical metadata schema to client's Purview configuration and custom attribute types | 6 | Data Governance Lead | E3-S1.T2 |
| S3-T3 | Adapt data lineage requirements to client's Fabric pipeline architecture and data flows | 4 | Data Governance Lead | E3-S1.T3 |
| S3-T4 | Customize data catalog governance to client's stewardship model and approval workflows | 3 | Data Governance Lead | E3-S1.T4 |
| S3-T5 | Adapt metadata integration patterns to client's source system connectors and Purview scanning | 5 | Integration Architect | E3-S1.T5 |
| S3-T6 | Configure lineage visualization standards for client's Purview instance and reporting needs | 3 | Data Governance Lead | E3-S1.T6 |

### Tasks — ISL-05: Integration Pattern Adaptation

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S3-T7 | Adapt ERP Extract & Load pattern to client's ERP system (SAP, Oracle, Dynamics, etc.) | 5 | Integration Architect | E3-S2.T1 |
| S3-T8 | Adapt IoT/OT Ingestion pattern to client's industrial data sources and sensor architecture | 4 | Integration Architect | E3-S2.T2 |
| S3-T9 | Customize API Gateway Integration pattern to client's gateway configuration and service mesh | 4 | Integration Architect | E3-S2.T3 |
| S3-T10 | Adapt Event-Driven Architecture pattern to client's messaging infrastructure (Event Hubs, Service Bus, Kafka) | 4 | Integration Architect | E3-S2.T4 |
| S3-T11 | Customize Master Data Synchronization pattern to client's MDM tooling and master data domains | 4 | Integration Architect | E3-S2.T5 |
| S3-T12 | Adapt File-Based Integration pattern to client's file transfer and SFTP landscape | 3 | Integration Architect | E3-S2.T6 |
| S3-T13 | Customize Medallion Architecture pattern to client's lakehouse layer definitions and quality gates | 4 | Integration Architect | E3-S2.T7 |
| S3-T14 | Adapt Reverse ETL pattern to client's operational system writeback requirements | 3 | Integration Architect | E3-S2.T8 |
| S3-T15 | Generate client-specific integration landscape diagram | 4 | Integration Architect | E3-S2.T9 |
| S3-T16 | Customize pattern decision framework for client's integration selection criteria | 3 | Integration Architect | E3-S2.T10 |

### Tasks — Manufacturing Overlays (Conditional)

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S3-T17 | Apply ITAR/EAR compliance overlay to ISL-04 classification and ISL-01 API security | 3 | Data Governance Lead | E3-S3.T1 |
| S3-T18 | Apply IoT/OT data overlay to ISL-02 metadata and ISL-05 ingestion patterns | 3 | Integration Architect | E3-S3.T2 |
| S3-T19 | Apply ERP integration overlay to ISL-02 lineage and ISL-05 extract patterns | 2 | Integration Architect | E3-S3.T3 |

### Tasks — Client Review & Alignment

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S3-T20 | Prepare advanced standards review package for client presentation | 2 | Engagement Lead | E3-S4.T1 |
| S3-T21 | Conduct ISL-02 metadata review workshop with client data governance team | 3 | Engagement Lead | E3-S4.T2 |
| S3-T22 | Conduct ISL-05 integration patterns review workshop with client architecture team | 3 | Engagement Lead | E3-S4.T3 |
| S3-T23 | Incorporate client feedback into ISL-02 and ISL-05 deliverables | 4 | Integration Architect, Data Governance Lead | E3-S4.T4 |
| S3-T24 | Client sign-off on advanced standards and manufacturing overlays | 3 | Client Stakeholder | E3-S4.T5 |

### Week-by-Week Execution Plan (Sprint 3)

| Week | ISL-02 Focus | ISL-05 Focus | Overlays | Key Deliverables |
|------|-------------|-------------|----------|------------------|
| Week 5 | S3-T1 through T4 (glossary, metadata schema, lineage, catalog) | S3-T7 through T10 (ERP, IoT, API gateway, event-driven) | — | 4 metadata templates + 4 patterns adapted |
| Week 6 | S3-T5, T6 (metadata integration, lineage viz) | S3-T11 through T16 (MDM, file, medallion, reverse ETL, diagrams, decision framework) | S3-T17 through T19 | All templates + patterns adapted; overlays applied |
| Week 7 | — | — | — | S3-T20 through T24: Client review, feedback, sign-off |

### Role Assignment Matrix — Sprint 3

| Role | ISL-02 Tasks | ISL-05 Tasks | Overlays | Review Tasks | Total |
|------|-------------|-------------|----------|-------------|-------|
| Integration Architect | S3-T5 | S3-T7 through T16 | S3-T18, T19 | S3-T23 (partial) | 49 |
| Data Governance Lead | S3-T1 through T4, T6 | — | S3-T17 | S3-T23 (partial) | 22 |
| Engagement Lead | — | — | — | S3-T20, T21, T22 | 8 |
| Client Stakeholder | — | — | — | S3-T24 (+ participation in T21, T22) | 5 |
| | | | | **Sprint Total** | **84** |

> Buffer of ~6 hrs for cross-module validation, manufacturing overlay complexity, and rework from client workshops.

### Milestones

| ID | Milestone | Criteria | Sprint Day |
|----|-----------|----------|------------|
| M3.1 | ISL-02 Adaptation Complete | All metadata templates customized to client Purview/catalog environment | Day 7 |
| M3.2 | ISL-05 Adaptation Complete | All integration patterns customized to client source systems and architecture | Day 10 |
| M3.3 | Manufacturing Overlays Applied | ITAR/EAR, IoT/OT, ERP overlays applied across affected modules (if in scope) | Day 11 |
| M3.4 | Client Review Workshop — Advanced | ISL-02 and ISL-05 reviewed with client stakeholders; feedback collected | Day 13 |
| M3.5 | Feedback Incorporated | Client feedback resolved and incorporated into deliverables | Day 14 |
| M3.6 | **All 6 Modules Deployed** | **ISL-01 through ISL-06 adapted, overlays applied, client-approved** | Day 15 |

---

## Sprint 4 — Validation & Handoff

**Duration:** 1 week | **Total Hours:** 40
**Backlog Epic:** [E4](../backlog.md#epic-e4-validation--handoff)
**Baseline without Accelerator:** 60–80 hrs → **Accelerated: ~40 hrs**

### Entry Criteria

- [ ] M3.6 All 6 Modules Deployed achieved
- [ ] All module adaptations committed to engagement repository
- [ ] Client implementation team identified for handoff
- [ ] Final presentation scheduled with client leadership

### Exit Criteria

- [ ] Cross-module consistency review complete with zero open issues
- [ ] Compliance alignment audit passed (OWASP, NIST, ISO 27001, DAMA)
- [ ] Final presentation delivered and client sign-off obtained
- [ ] Implementation team handoff complete with knowledge transfer session
- [ ] Lessons learned documented and submitted to ISL feedback loop
- [ ] **Engagement integration standards package complete and accepted**

### Tasks — Cross-Module Validation

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S4-T1 | Cross-module consistency review (naming, terminology, cross-references across all 6 modules) | 4 | Engagement Lead | E4-S1.T1 |
| S4-T2 | Validate inter-module dependencies (ISL-04 tiers in ISL-06 SLAs, ISL-03 names in ISL-01, ISL-01 security in ISL-05, etc.) | 3 | Integration Architect | E4-S1.T2 |
| S4-T3 | Compliance alignment audit — OWASP API Top 10 final validation | 2 | Integration Architect | E4-S1.T3 |
| S4-T4 | Compliance alignment audit — NIST, ISO 27001, DAMA DMBOK mapping verification | 3 | Data Governance Lead | E4-S1.T4 |
| S4-T5 | Resolve any open issues from validation reviews | 3 | Engagement Lead | E4-S1.T5 |

### Tasks — Final Client Presentation & Sign-off

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S4-T6 | Prepare final deliverable package (all 6 adapted modules, compliance matrix, implementation guide) | 3 | Engagement Lead | E4-S2.T1 |
| S4-T7 | Prepare executive summary presentation for client leadership | 3 | Engagement Lead | E4-S2.T2 |
| S4-T8 | Deliver final presentation to client leadership and data governance council | 3 | Engagement Lead | E4-S2.T3 |
| S4-T9 | Obtain formal client sign-off on integration standards package | 2 | Client Stakeholder | E4-S2.T4 |

### Tasks — Implementation Team Handoff & Knowledge Transfer

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S4-T10 | Prepare handoff documentation (adaptation decisions, client-specific configurations, known constraints) | 3 | Engagement Lead | E4-S3.T1 |
| S4-T11 | Conduct knowledge transfer session with client implementation team | 3 | Engagement Lead | E4-S3.T2 |
| S4-T12 | Walk through integration patterns and decision framework with implementation architects | 2 | Integration Architect | E4-S3.T3 |
| S4-T13 | Walk through governance workflows, classification rules, and escalation paths with data stewards | 2 | Data Governance Lead | E4-S3.T4 |

### Tasks — Lessons Learned & ISL Feedback Loop

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S4-T14 | Document engagement lessons learned (adaptation efficiency, client pain points, process improvements) | 2 | Engagement Lead | E4-S4.T1 |
| S4-T15 | Submit ISL feedback (template gaps, improvement suggestions, new patterns identified at client) | 2 | Engagement Lead | E4-S4.T2 |

### Role Assignment Matrix — Sprint 4

| Role | Validation | Presentation | Handoff | Feedback | Total |
|------|-----------|-------------|---------|----------|-------|
| Engagement Lead | S4-T1, T5 | S4-T6, T7, T8 | S4-T10, T11 | S4-T14, T15 | 26 |
| Integration Architect | S4-T2, T3 | — | S4-T12 | — | 7 |
| Data Governance Lead | S4-T4 | — | S4-T13 | — | 5 |
| Client Stakeholder | — | S4-T9 | (participation in T11) | — | 2 |
| | | | | **Sprint Total** | **40** |

### Milestones

| ID | Milestone | Criteria | Day |
|----|-----------|----------|-----|
| M4.1 | Validation Complete | Cross-module review and compliance audit passed; zero open issues | Day 2 |
| M4.2 | Client Sign-off | Final presentation delivered; formal sign-off obtained from client leadership | Day 3 |
| M4.3 | Handoff Complete | Implementation team knowledge transfer delivered; handoff documentation provided | Day 4 |
| M4.4 | **Engagement Standards Complete** | **All deliverables accepted; lessons learned submitted to ISL feedback loop** | Day 5 |

---

## Cross-Sprint Metrics

### Module Progress Tracker — Baseline vs. Accelerated

| Module | ID | Sprint | Baseline Hours | Accelerated Hours | Savings |
|--------|----|--------|---------------|-------------------|---------|
| Naming Conventions | ISL-03 | Sprint 1 | 20–35 | ~16 | 40–55% |
| Data Classification | ISL-04 | Sprint 1 | 30–50 | ~23 | 45–55% |
| API Governance | ISL-01 | Sprint 2 | 50–80 | ~28 | 45–65% |
| Data Quality | ISL-06 | Sprint 2 | 40–60 | ~19 | 50–68% |
| Metadata & Lineage | ISL-02 | Sprint 3 | 60–90 | ~25 | 58–72% |
| Integration Patterns | ISL-05 | Sprint 3 | 70–100 | ~38 | 46–62% |
| Manufacturing Overlays | — | Sprint 3 | 20–35 | ~8 | 60–77% |
| Setup & Assessment | — | Sprint 0 | 60–80 | ~40 | 33–50% |
| Validation & Handoff | — | Sprint 4 | 40–60 | ~40 | 0–33% |
| **Total** | | | **500–750** | **~300** | **~50–60%** |

### Cumulative Hours Burn

| Sprint | Duration | Accelerated Hours | Cumulative | Baseline Equivalent | Time Saved |
|--------|----------|-------------------|-----------|--------------------|-----------|
| 0 | 1 week | 40 | 40 | 60–80 | 20–40 hrs |
| 1 | 2 weeks | 60 | 100 | 150–230 | 50–130 hrs |
| 2 | 2 weeks | 70 | 170 | 280–430 | 110–260 hrs |
| 3 | 3 weeks | 90 | 260 | 440–670 | 180–410 hrs |
| 4 | 1 week | 40 | 300 | 500–750 | 200–450 hrs |

### Sprint Savings Summary

| Sprint | Phase | Baseline | Accelerated | Savings % |
|--------|-------|----------|-------------|-----------|
| Sprint 0 | Setup & Assessment | 60–80 hrs | 40 hrs | 33–50% |
| Sprint 1 | Foundation Deployment | 90–150 hrs | 60 hrs | 33–60% |
| Sprint 2 | Core Deployment | 130–200 hrs | 70 hrs | 46–65% |
| Sprint 3 | Advanced Deployment | 160–240 hrs | 90 hrs | 44–63% |
| Sprint 4 | Validation & Handoff | 60–80 hrs | 40 hrs | 33–50% |
| **Total** | | **500–750 hrs** | **~300 hrs** | **~50–60%** |

### Milestone Summary

| ID | Milestone | Sprint | Day | Status |
|----|-----------|--------|-----|--------|
| M0.1 | ISL Deployed | 0 | 1 | |
| M0.2 | Assessment Complete | 0 | 3 | |
| M0.3 | **Scope Locked** | 0 | 5 | |
| M1.1 | ISL-03 Adaptation Complete | 1 | 5 | |
| M1.2 | ISL-04 Adaptation Complete | 1 | 7 | |
| M1.3 | Client Review Workshop — Foundation | 1 | 8 | |
| M1.4 | Feedback Incorporated | 1 | 9 | |
| M1.5 | **Foundation Deployed** | 1 | 10 | |
| M2.1 | ISL-01 Adaptation Complete | 2 | 5 | |
| M2.2 | ISL-06 Adaptation Complete | 2 | 6 | |
| M2.3 | OWASP Cross-Reference Pass | 2 | 7 | |
| M2.4 | Client Review Workshop — Core | 2 | 8 | |
| M2.5 | Feedback Incorporated | 2 | 9 | |
| M2.6 | **Core Deployed** | 2 | 10 | |
| M3.1 | ISL-02 Adaptation Complete | 3 | 7 | |
| M3.2 | ISL-05 Adaptation Complete | 3 | 10 | |
| M3.3 | Manufacturing Overlays Applied | 3 | 11 | |
| M3.4 | Client Review Workshop — Advanced | 3 | 13 | |
| M3.5 | Feedback Incorporated | 3 | 14 | |
| M3.6 | **All 6 Modules Deployed** | 3 | 15 | |
| M4.1 | Validation Complete | 4 | 2 | |
| M4.2 | Client Sign-off | 4 | 3 | |
| M4.3 | Handoff Complete | 4 | 4 | |
| M4.4 | **Engagement Standards Complete** | 4 | 5 | |

> 24 milestones across 5 sprints. Each milestone has defined criteria and a target day within its sprint. Track status as: Pending, In Progress, Complete, or Blocked.

---

## Appendix A: Adaptation Checklist (Per Module)

Use this checklist at each engagement to track adaptation progress per module. Complete during the sprint in which the module is deployed.

### ISL-03: Naming Conventions (Sprint 1)

- [ ] Map client Azure subscription and resource group hierarchy
- [ ] Document client Fabric workspace naming conventions (existing, if any)
- [ ] Adapt database and schema naming templates to client domain taxonomy
- [ ] Customize table, view, and column naming to client data model conventions
- [ ] Adapt pipeline and dataflow naming to client orchestration patterns
- [ ] Customize API and endpoint naming to client service conventions
- [ ] Extend abbreviation dictionary with client-specific domain terms and acronyms
- [ ] Validate all naming conventions against Azure resource naming limits
- [ ] Validate against current Fabric documentation
- [ ] Generate client-specific naming reference examples

### ISL-04: Data Classification (Sprint 1)

- [ ] Inventory client's existing classification scheme (if any)
- [ ] Map 4-tier classification model to client's data sensitivity landscape
- [ ] Identify applicable compliance regulations (SOX, GDPR, CCPA, HIPAA, ITAR, industry-specific)
- [ ] Map Purview sensitivity labels to client's existing labeling taxonomy
- [ ] Customize data handling requirements per compliance posture
- [ ] Align access controls with client's Entra ID groups and Fabric RBAC model
- [ ] Customize compliance mapping matrix to client's regulatory obligations
- [ ] Adapt classification decision tree to client data domains and sensitivity patterns
- [ ] Generate client-specific classification examples

### ISL-01: API Governance (Sprint 2)

- [ ] Identify client's API gateway platform (APIM, MuleSoft, Kong, AWS API Gateway, etc.)
- [ ] Document client's Entra ID configuration for OAuth 2.0/OIDC flows
- [ ] Adapt API design standards to client technology stack and conventions
- [ ] Customize versioning policy to client's release cadence and consumer agreements
- [ ] Adapt security standards to client's authentication and authorization patterns
- [ ] Customize lifecycle governance to client's SDLC and deployment pipeline
- [ ] Adapt catalog requirements to client's developer portal or service catalog
- [ ] Configure rate limiting and throttling per client's API consumer tiers
- [ ] Validate OWASP API Top 10 coverage for client's API patterns
- [ ] Generate client-specific API governance examples

### ISL-06: Data Quality (Sprint 2)

- [ ] Identify client's priority data domains for quality monitoring
- [ ] Map quality SLA thresholds to ISL-04 classification tiers
- [ ] Customize quality rule library to client's source systems and known data issues
- [ ] Adapt quality monitoring standards to client's Fabric pipeline architecture
- [ ] Customize remediation workflow to client's incident management and ticketing process
- [ ] Configure quality scorecard for client's executive reporting requirements and KPIs
- [ ] Generate client-specific quality rules examples

### ISL-02: Metadata & Data Lineage (Sprint 3)

- [ ] Document client's Purview instance configuration and custom attribute types
- [ ] Adapt business glossary standards to client's domain vocabulary and term ownership model
- [ ] Customize technical metadata schema to client's Fabric lakehouse/warehouse structure
- [ ] Adapt lineage requirements to client's source-to-target data flows
- [ ] Customize catalog governance to client's stewardship model and approval workflows
- [ ] Adapt metadata integration patterns to client's source system connectors and Purview scanning
- [ ] Configure lineage visualization for client's Purview instance and reporting needs
- [ ] Generate client-specific metadata model examples

### ISL-05: Integration Patterns (Sprint 3)

- [ ] Inventory client's source systems (ERP, CRM, IoT/OT, file-based, SaaS, etc.)
- [ ] Document client's messaging infrastructure (Event Hubs, Service Bus, Kafka, etc.)
- [ ] Adapt ERP Extract & Load pattern to client's ERP system
- [ ] Adapt IoT/OT Ingestion pattern to client's industrial data sources (if applicable)
- [ ] Customize API Gateway Integration pattern to client's gateway configuration
- [ ] Adapt Event-Driven Architecture pattern to client's messaging infrastructure
- [ ] Customize Master Data Synchronization pattern to client's MDM tooling
- [ ] Adapt File-Based Integration pattern to client's file transfer and SFTP landscape
- [ ] Customize Medallion Architecture pattern to client's lakehouse layer definitions
- [ ] Adapt Reverse ETL pattern to client's operational system writeback requirements
- [ ] Generate client-specific integration landscape diagram
- [ ] Customize pattern decision framework for client's integration selection criteria

### Manufacturing Overlays (Sprint 3, Conditional)

- [ ] Determine applicability of manufacturing overlays based on client industry
- [ ] Apply ITAR/EAR compliance overlay to ISL-04 classification and ISL-01 API security
- [ ] Apply IoT/OT data overlay to ISL-02 metadata and ISL-05 ingestion patterns
- [ ] Apply ERP integration overlay to ISL-02 lineage and ISL-05 extract patterns
- [ ] Validate supply chain classification within ISL-04 for client context
- [ ] Cross-check manufacturing examples across all affected modules

---

## Appendix B: Escalation Procedures

| Issue | First Response | Escalation Path | SLA |
|-------|---------------|-----------------|-----|
| Client Stakeholder unavailable for scheduled review | Reschedule within sprint buffer; adjust task sequence to non-blocking work | Engagement Lead → Client PMO → Executive Sponsor | 48 hrs |
| Client compliance conflict (adapted standards conflict with client regulatory interpretation) | Document both positions with rationale; propose compromise | Data Governance Lead + Client Compliance Officer → joint resolution session | 48 hrs |
| Scope change request (client requests additional modules or deeper customization beyond SOW) | Assess impact to sprint plan, hours, and timeline | Engagement Lead → SOW change order process → Client Sponsor approval | 1 week |
| Client environment access delayed or revoked | Work on non-environment-dependent tasks; escalate access request | Integration Architect → Client IT → Client PMO | 24 hrs |
| Inter-module dependency conflict in client context | Document conflict and proposed resolution options | Engagement Lead makes binding call; Client Stakeholder validates | 24 hrs |
| Client rejects adapted standard after workshop (fundamental disagreement) | Schedule follow-up working session; identify specific objections | Engagement Lead + relevant specialist → propose alternative approach | 24 hrs |
| Manufacturing overlay not applicable but client requests industry-specific adaptation | Assess level of effort for custom overlay beyond ISL templates | Engagement Lead → DMTSP Practice Lead for custom overlay approval and resourcing | 48 hrs |
| ISL template gap discovered (client need not covered by existing templates) | Document gap; create engagement-specific supplement | Engagement Lead → submit to ISL feedback loop for v1.x inclusion | Non-blocking |
| Engagement team member unavailable mid-sprint | Redistribute tasks within remaining team members | Engagement Lead → DMTSP resource manager → backfill or extend sprint timeline | 24 hrs |
| Fabric/Purview feature gap (template assumes capability client environment lacks) | Document gap; adapt template to available capabilities | Integration Architect → flag for ISL library update in next release | Non-blocking |

---

*This orchestrator defines the sprint-by-sprint process for deploying the Integration Standards Library at client engagements. The engagement team adapts pre-authored ISL modules to the client's environment rather than authoring from scratch, delivering ~50–60% time savings across a typical 8-week delivery. All task IDs cross-reference the backlog using the pattern E{epic}-S{story}.T{task}. Re-baseline at Sprint 0 exit gate (M0.3 Scope Locked). Lessons learned feed back into the ISL for continuous improvement across engagements.*

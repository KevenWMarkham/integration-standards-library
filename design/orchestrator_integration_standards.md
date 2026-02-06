# Integration Standards Library — Reusable Sprint Orchestrator

**Version:** 1.0
**Author:** Keven Markham, VP Enterprise Transformation — DMTSP
**Date:** February 6, 2026
**Execution Model:** Internal Accelerator Buildout
**Reusability:** One-time buildout — the resulting library is the reusable asset deployed globally.
**Related Documents:**
- [Roadmap](../roadmap.md) — Strategic phases, prerequisites, risk register
- [Backlog](../backlog.md) — Epics, stories, acceptance criteria
- [Buildout Recommendation](../Integration_Standards_Library_DMTSP_Buildout.md) — Accelerator overview and ROI analysis

---

## Team Allocation Matrix

**Sprint Cadence:** 2-week sprints (Sprint 3 is a double sprint — 4 weeks) | **Team Capacity:** 150 hrs/sprint | **4 FTEs (part-time)**

| Role | Sprint 0 | Sprint 1 | Sprint 2 | Sprint 3 (×2) | Sprint 4 |
|------|----------|----------|----------|---------------|----------|
| Lead Architect (1×35) | 20 | 15 | 14 | 24 | 30 |
| Sr Data Gov Specialist (1×50) | 8 | 45 | 39 | 65 | 18 |
| Sr Integration Architect (1×50) | 9 | 22 | 42 | 62 | 12 |
| Technical Writer (1×15) | 3 | 8 | 5 | 9 | 20 |
| **Sprint Subtotal** | **40** | **90** | **100** | **160** | **80** |

> Sprint 3 is a 4-week double sprint due to the complexity of ISL-02 (Metadata & Lineage) and ISL-05 (Integration Patterns). All other sprints are standard 2-week sprints.

---

## Sprint Timeline

```
Sprint 0 ──── Sprint 1 ──── Sprint 2 ──── Sprint 3 (double) ──── Sprint 4
Discovery     Foundation    Core          Advanced                 Packaging
& Baseline    Modules       Modules       Modules                  & Pilot

ISL-03 ────►  ISL-01 ────►  ISL-02 ────────►
ISL-04 ────►  ISL-06 ────►  ISL-05 ────────►  MFG Overlays
                                               Review
                                               v1.0 Release

Week 0        Week 1-2      Week 3-4      Week 5-8               Week 9-10
40 hrs        90 hrs        100 hrs       160 hrs                80 hrs
```

---

## Sprint 0 — Discovery & Baseline

**Duration:** 1 week | **Total Hours:** 40
**Backlog Epic:** [E0](../backlog.md#epic-e0-discovery--baseline)

### Entry Criteria

- [ ] Build team assigned (Lead Architect, Sr Data Gov, Sr Integration Architect, Technical Writer)
- [ ] Access to 2–3 completed Phase 4 engagement deliverables
- [ ] Reference standards documentation available (Microsoft, OWASP, DAMA, NIST)
- [ ] Git repository initialized with project structure (Complete)

### Exit Criteria

- [ ] Prior engagement patterns extracted and documented
- [ ] External standards surveyed and alignment points identified
- [ ] Template lists finalized for all 6 modules (39 templates, 16 examples)
- [ ] Adaptation workflow defined
- [ ] Buildout scope locked — no template additions after Sprint 0 exit

### Tasks

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S0-T1 | Identify and access 2–3 completed Phase 4 deliverables | 2 | Lead Architect | E0-S1.T1 |
| S0-T2 | Extract common standards patterns across engagements | 6 | Lead Architect | E0-S1.T2 |
| S0-T3 | Catalog engagement-specific customizations | 4 | Lead Architect | E0-S1.T3 |
| S0-T4 | Document gaps and quality issues in prior deliverables | 4 | Sr Data Gov | E0-S1.T4 |
| S0-T5 | Record actual hours per artifact for baseline calibration | 4 | Lead Architect | E0-S1.T5 |
| S0-T6 | Review Microsoft REST API Guidelines, Fabric docs | 3 | Sr Integration Arch | E0-S2.T1 |
| S0-T7 | Review OWASP, DAMA DMBOK, ISO/NIST | 6 | Sr Data Gov, Lead Arch | E0-S2.T2–T3 |
| S0-T8 | Finalize template lists per module | 4 | Lead Architect | E0-S2.T4 |
| S0-T9 | Define adaptation workflow | 4 | Lead Architect | E0-S2.T5 |
| S0-T10 | Document acceptance criteria and lock scope | 3 | Lead Architect | E0-S2.T6 |

### Milestones

| ID | Milestone | Criteria | Day |
|----|-----------|----------|-----|
| M0.1 | Engagement Audit Complete | Patterns extracted from 2–3 prior deliverables | Day 3 |
| M0.2 | Standards Survey Complete | External frameworks reviewed and alignment points noted | Day 4 |
| M0.3 | **Scope Locked** | Template lists finalized; adaptation workflow defined; no additions | Day 5 |

### Blockers to Escalate

- Prior engagement deliverables not accessible → Escalate to DMTSP Practice Lead
- Build team member unavailable → Escalate to resource manager; minimum viable: Lead Architect + 1 specialist

---

## Sprint 1 — Foundation Modules

**Duration:** 2 weeks | **Total Hours:** 90
**Backlog Epic:** [E1](../backlog.md#epic-e1-foundation-modules)

### Entry Criteria

- [ ] M0.3 Scope Locked achieved
- [ ] Template lists confirmed for ISL-03 (7 templates) and ISL-04 (6 templates)
- [ ] Reference materials organized and accessible

### Exit Criteria

- [ ] ISL-03: 7 naming templates + 2 examples completed and peer-reviewed
- [ ] ISL-04: 6 classification templates + 3 examples completed and peer-reviewed
- [ ] ISL-03 naming conventions validated against current Fabric documentation
- [ ] ISL-04 compliance mapping covers SOX, GDPR, CCPA, ITAR, HIPAA
- [ ] Foundation modules ready for downstream consumption in Sprint 2

### Tasks — ISL-03: Naming Convention Standards

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S1-T1 | Draft database & schema naming template | 2 | Sr Integration Arch | E1-S1.T1 |
| S1-T2 | Draft table & view naming template | 3 | Sr Integration Arch | E1-S1.T2 |
| S1-T3 | Draft column naming standards template | 2 | Sr Integration Arch | E1-S1.T3 |
| S1-T4 | Draft pipeline & dataflow naming template | 3 | Sr Integration Arch | E1-S1.T4 |
| S1-T5 | Draft API & endpoint naming template | 2 | Sr Integration Arch | E1-S1.T5 |
| S1-T6 | Draft infrastructure resource naming template | 2 | Sr Integration Arch | E1-S1.T6 |
| S1-T7 | Build abbreviation dictionary (50+ entries) | 3 | Technical Writer | E1-S1.T7 |
| S1-T8 | Create Fabric naming reference example | 3 | Sr Integration Arch | E1-S1.T8 |
| S1-T9 | Create manufacturing domain names example | 3 | Sr Integration Arch | E1-S1.T9 |
| S1-T10 | Peer review ISL-03 templates | 4 | Lead Architect | E1-S1.T10 |

### Tasks — ISL-04: Data Classification Framework

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S1-T11 | Draft classification tier definitions (4-tier model) | 5 | Sr Data Gov | E1-S2.T1 |
| S1-T12 | Draft sensitivity labeling standards (Purview) | 6 | Sr Data Gov | E1-S2.T2 |
| S1-T13 | Draft data handling requirements | 5 | Sr Data Gov | E1-S2.T3 |
| S1-T14 | Draft access control alignment (Entra ID, Fabric RBAC) | 6 | Sr Data Gov | E1-S2.T4 |
| S1-T15 | Draft compliance mapping matrix | 6 | Sr Data Gov | E1-S2.T5 |
| S1-T16 | Create classification decision tree flowchart | 3 | Sr Data Gov | E1-S2.T6 |
| S1-T17 | Create manufacturing classification example | 5 | Sr Data Gov | E1-S2.T7 |
| S1-T18 | Create Fabric security model example | 4 | Sr Integration Arch | E1-S2.T8 |
| S1-T19 | Create Purview label configuration example | 4 | Sr Data Gov | E1-S2.T9 |
| S1-T20 | Peer review ISL-04 templates | 6 | Lead Architect | E1-S2.T10 |

### Role Assignment Matrix — Sprint 1

| Role | ISL-03 Tasks | ISL-04 Tasks | Total |
|------|-------------|-------------|-------|
| Sr Integration Architect | S1-T1 through T6, T8, T9 | S1-T18 | 24 |
| Sr Data Gov Specialist | — | S1-T11 through T17, T19 | 41 |
| Lead Architect | S1-T10 | S1-T20 | 10 |
| Technical Writer | S1-T7 | — | 3 |
| | | **Sprint Total** | **78** |

> Buffer of ~12 hrs for rework, clarification, and cross-team coordination.

### Milestones

| ID | Milestone | Criteria | Sprint Day |
|----|-----------|----------|------------|
| M1.1 | ISL-03 Drafts Complete | 7 naming templates in draft | Day 5 |
| M1.2 | ISL-04 Drafts Complete | 6 classification templates in draft | Day 7 |
| M1.3 | ISL-03 Peer Review Pass | All ISL-03 templates approved by Lead Architect | Day 8 |
| M1.4 | ISL-04 Peer Review Pass | All ISL-04 templates approved by Lead Architect | Day 9 |
| M1.5 | **Foundation Complete** | **ISL-03 + ISL-04 finalized; examples complete** | Day 10 |

---

## Sprint 2 — Core Modules

**Duration:** 2 weeks | **Total Hours:** 100
**Backlog Epic:** [E2](../backlog.md#epic-e2-core-modules)

### Entry Criteria

- [ ] M1.5 Foundation Complete achieved
- [ ] ISL-03 naming conventions available for reference
- [ ] ISL-04 classification tiers available for cross-reference

### Exit Criteria

- [ ] ISL-01: 6 API templates + 2 examples completed and peer-reviewed
- [ ] ISL-06: 6 quality templates + 3 examples completed and peer-reviewed
- [ ] ISL-01 OWASP API Top 10 cross-reference complete
- [ ] ISL-06 quality rule library contains 50+ rules
- [ ] ISL-06 SLA thresholds aligned to ISL-04 classification tiers

### Tasks — ISL-01: API Governance Standards

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S2-T1 | Draft API design standards template | 6 | Sr Integration Arch | E2-S1.T1 |
| S2-T2 | Draft API versioning policy template | 3 | Sr Integration Arch | E2-S1.T2 |
| S2-T3 | Draft API security standards template (OWASP-aligned) | 8 | Sr Integration Arch | E2-S1.T3 |
| S2-T4 | Draft API lifecycle governance template | 5 | Sr Integration Arch | E2-S1.T4 |
| S2-T5 | Draft API catalog requirements template | 4 | Sr Integration Arch | E2-S1.T5 |
| S2-T6 | Draft rate limiting & throttling policy template | 3 | Sr Integration Arch | E2-S1.T6 |
| S2-T7 | Create manufacturing API standards example | 5 | Sr Integration Arch | E2-S1.T7 |
| S2-T8 | Create Fabric-native API patterns example | 4 | Sr Integration Arch | E2-S1.T8 |
| S2-T9 | OWASP API Top 10 cross-reference audit | 4 | Lead Architect | E2-S1.T9 |
| S2-T10 | Peer review ISL-01 templates | 5 | Lead Architect | E2-S1.T10 |

### Tasks — ISL-06: Data Quality Standards

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S2-T11 | Draft quality dimension definitions template | 3 | Sr Data Gov | E2-S2.T1 |
| S2-T12 | Draft quality SLA framework template | 5 | Sr Data Gov | E2-S2.T2 |
| S2-T13 | Build quality rule library (50+ rules) | 10 | Sr Data Gov | E2-S2.T3 |
| S2-T14 | Draft quality monitoring standards template | 4 | Sr Data Gov | E2-S2.T4 |
| S2-T15 | Draft remediation workflow template | 3 | Sr Data Gov | E2-S2.T5 |
| S2-T16 | Draft quality scorecard template | 3 | Sr Data Gov | E2-S2.T6 |
| S2-T17 | Create manufacturing quality rules example | 4 | Sr Data Gov | E2-S2.T7 |
| S2-T18 | Create Fabric quality implementation example | 5 | Sr Integration Arch | E2-S2.T8 |
| S2-T19 | Create quality dashboard spec example | 4 | Sr Data Gov | E2-S2.T9 |
| S2-T20 | Peer review ISL-06 templates | 5 | Lead Architect | E2-S2.T10 |

### Role Assignment Matrix — Sprint 2

| Role | ISL-01 Tasks | ISL-06 Tasks | Total |
|------|-------------|-------------|-------|
| Sr Integration Architect | S2-T1 through T8 | S2-T18 | 43 |
| Sr Data Gov Specialist | — | S2-T11 through T17, T19 | 36 |
| Lead Architect | S2-T9, T10 | S2-T20 | 14 |
| Technical Writer | — | — | 0 |
| | | **Sprint Total** | **93** |

> Buffer of ~7 hrs for rework and coordination. Technical Writer available for formatting support if needed.

### Milestones

| ID | Milestone | Criteria | Sprint Day |
|----|-----------|----------|------------|
| M2.1 | ISL-01 Drafts Complete | 6 API templates in draft | Day 5 |
| M2.2 | ISL-06 Rule Library Complete | 50+ quality rules cataloged | Day 6 |
| M2.3 | ISL-06 Drafts Complete | 6 quality templates in draft | Day 7 |
| M2.4 | OWASP Cross-Reference Pass | ISL-01 validated against OWASP Top 10 | Day 8 |
| M2.5 | ISL-01 Peer Review Pass | All ISL-01 templates approved | Day 9 |
| M2.6 | **Core Complete** | **ISL-01 + ISL-06 finalized; examples complete** | Day 10 |

---

## Sprint 3 — Advanced Modules (Double Sprint)

**Duration:** 4 weeks | **Total Hours:** 160
**Backlog Epic:** [E3](../backlog.md#epic-e3-advanced-modules)

> Double sprint due to the highest-complexity modules. ISL-02 (Metadata & Lineage) and ISL-05 (Integration Patterns) each require 60–80 hours and benefit from the extra time for thorough architecture diagrams and cross-module validation.

### Entry Criteria

- [ ] M2.6 Core Complete achieved
- [ ] ISL-01 API governance available (ISL-05 API gateway pattern references it)
- [ ] ISL-06 quality standards available (ISL-05 medallion pattern references quality gates)
- [ ] ISL-03 naming and ISL-04 classification available (referenced throughout)

### Exit Criteria

- [ ] ISL-02: 6 metadata templates + 3 examples completed and peer-reviewed
- [ ] ISL-05: 8 integration patterns + 3 diagrams completed and peer-reviewed
- [ ] Manufacturing extensions complete for both modules
- [ ] All inter-module cross-references validated
- [ ] **All 6 standards modules complete**

### Tasks — ISL-02: Metadata & Data Lineage Framework (Weeks 1–3)

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S3-T1 | Draft business glossary standards template | 6 | Sr Data Gov | E3-S1.T1 |
| S3-T2 | Draft technical metadata schema template | 10 | Sr Data Gov | E3-S1.T2 |
| S3-T3 | Draft data lineage requirements template | 6 | Sr Data Gov | E3-S1.T3 |
| S3-T4 | Draft data catalog governance template | 5 | Sr Data Gov | E3-S1.T4 |
| S3-T5 | Draft metadata integration patterns template | 8 | Sr Integration Arch | E3-S1.T5 |
| S3-T6 | Draft lineage visualization standards template | 4 | Sr Data Gov | E3-S1.T6 |
| S3-T7 | Create manufacturing metadata model example | 6 | Sr Data Gov | E3-S1.T7 |
| S3-T8 | Create Fabric OneLake metadata example | 5 | Sr Integration Arch | E3-S1.T8 |
| S3-T9 | Create Purview configuration guide example | 5 | Sr Data Gov | E3-S1.T9 |
| S3-T10 | Build manufacturing overlays (IoT/OT, ERP, PLM) | 8 | Sr Data Gov | E3-S1.T10 |
| S3-T11 | Peer review ISL-02 templates | 7 | Lead Architect | E3-S1.T11 |

### Tasks — ISL-05: Integration Pattern Library (Weeks 1–3)

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S3-T12 | Draft ERP Extract & Load pattern | 6 | Sr Integration Arch | E3-S2.T1 |
| S3-T13 | Draft IoT/OT Ingestion pattern | 6 | Sr Integration Arch | E3-S2.T2 |
| S3-T14 | Draft API Gateway Integration pattern | 5 | Sr Integration Arch | E3-S2.T3 |
| S3-T15 | Draft Event-Driven Architecture pattern | 6 | Sr Integration Arch | E3-S2.T4 |
| S3-T16 | Draft Master Data Synchronization pattern | 6 | Sr Integration Arch | E3-S2.T5 |
| S3-T17 | Draft File-Based Integration pattern | 4 | Sr Integration Arch | E3-S2.T6 |
| S3-T18 | Draft Medallion Architecture pattern | 5 | Sr Integration Arch | E3-S2.T7 |
| S3-T19 | Draft Reverse ETL pattern | 4 | Sr Integration Arch | E3-S2.T8 |
| S3-T20 | Create integration landscape overview diagram | 5 | Sr Integration Arch | E3-S2.T9 |
| S3-T21 | Create Fabric integration architecture diagram | 5 | Sr Integration Arch | E3-S2.T10 |
| S3-T22 | Create pattern decision tree diagram | 4 | Sr Integration Arch | E3-S2.T11 |
| S3-T23 | Build pattern selection decision framework | 4 | Lead Architect | E3-S2.T12 |
| S3-T24 | Peer review ISL-05 patterns and diagrams | 8 | Lead Architect | E3-S2.T13 |

### Week-by-Week Execution Plan (Sprint 3)

| Week | ISL-02 Focus | ISL-05 Focus | Key Deliverables |
|------|-------------|-------------|------------------|
| Week 5 | S3-T1 through T4 (glossary, metadata schema, lineage, catalog) | S3-T12 through T15 (ERP, IoT, API, event-driven) | 4 templates + 4 patterns in draft |
| Week 6 | S3-T5, T6 (metadata integration, lineage viz) | S3-T16 through T19 (MDM, file, medallion, reverse ETL) | 6 templates + 8 patterns in draft |
| Week 7 | S3-T7 through T10 (examples, mfg overlays) | S3-T20 through T22 (diagrams) | All examples + diagrams |
| Week 8 | S3-T11 (peer review) | S3-T23, T24 (decision framework, peer review) | Peer review complete |

### Role Assignment Matrix — Sprint 3

| Role | ISL-02 Tasks | ISL-05 Tasks | Total |
|------|-------------|-------------|-------|
| Sr Data Gov Specialist | S3-T1 through T4, T6, T7, T9, T10 | — | 51 |
| Sr Integration Architect | S3-T5, T8 | S3-T12 through T22 | 69 |
| Lead Architect | S3-T11 | S3-T23, T24 | 19 |
| Technical Writer | — | — | 0 |
| | | **Sprint Total** | **139** |

> Buffer of ~21 hrs across the 4-week sprint for rework, cross-module validation, and coordination.

### Milestones

| ID | Milestone | Criteria | Sprint Day |
|----|-----------|----------|------------|
| M3.1 | ISL-02 Drafts Complete | 6 metadata templates in draft | Day 10 |
| M3.2 | ISL-05 Patterns Complete | 8 patterns in draft | Day 10 |
| M3.3 | Examples & Diagrams Complete | All ISL-02 examples + ISL-05 diagrams | Day 15 |
| M3.4 | ISL-02 Peer Review Pass | All metadata templates approved | Day 18 |
| M3.5 | ISL-05 Peer Review Pass | All patterns and diagrams approved | Day 19 |
| M3.6 | **All 6 Modules Complete** | **ISL-01 through ISL-06 finalized** | Day 20 |

---

## Sprint 4 — Packaging, Review & Pilot

**Duration:** 2 weeks | **Total Hours:** 80
**Backlog Epic:** [E4](../backlog.md#epic-e4-packaging--pilot)

### Entry Criteria

- [ ] M3.6 All 6 Modules Complete achieved
- [ ] All module drafts committed to repository
- [ ] Pilot engagement candidate identified

### Exit Criteria

- [ ] Manufacturing overlays consolidated across all modules
- [ ] Full cross-module review complete with zero open comments
- [ ] v1.0 release tagged in Git repository
- [ ] Pilot engagement onboarding scheduled
- [ ] **ISL v1.0 production-ready**

### Tasks — Manufacturing Overlays

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S4-T1 | Consolidate ITAR/EAR overlay (ISL-04, ISL-01) | 4 | Sr Data Gov | E4-S1.T1 |
| S4-T2 | Consolidate IoT/OT extensions (ISL-02, ISL-04, ISL-05) | 4 | Sr Data Gov | E4-S1.T2 |
| S4-T3 | Consolidate ERP integration extensions (ISL-02, ISL-05) | 4 | Sr Integration Arch | E4-S1.T3 |
| S4-T4 | Validate supply chain classification (ISL-04) | 2 | Sr Data Gov | E4-S1.T4 |
| S4-T5 | Cross-check manufacturing examples | 4 | Lead Architect | E4-S1.T5 |
| S4-T6 | Fill identified gaps | 2 | Sr Data Gov | E4-S1.T6 |

### Tasks — Peer Review & QA

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S4-T7 | Full cross-module review (naming, terminology, consistency) | 6 | Lead Architect | E4-S2.T1 |
| S4-T8 | Compliance alignment audit (OWASP, NIST, ISO, DAMA) | 4 | Lead Architect | E4-S2.T2 |
| S4-T9 | Cross-reference validation (inter-module links) | 3 | Technical Writer | E4-S2.T3 |
| S4-T10 | Spelling, grammar, formatting audit | 3 | Technical Writer | E4-S2.T4 |
| S4-T11 | Resolve review comments and re-review | 4 | All | E4-S2.T5 |

### Tasks — Packaging & Distribution

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S4-T12 | Finalize all module README files | 4 | Technical Writer | E4-S3.T1 |
| S4-T13 | Document adaptation workflow | 3 | Lead Architect | E4-S3.T2 |
| S4-T14 | Create engagement kickoff integration guide | 3 | Lead Architect | E4-S3.T3 |
| S4-T15 | Tag Git repository with v1.0 release | 1 | Sr Integration Arch | E4-S3.T4 |
| S4-T16 | Configure distribution channel | 2 | Sr Integration Arch | E4-S3.T5 |
| S4-T17 | Publish release notes | 2 | Technical Writer | E4-S3.T6 |

### Tasks — Pilot Deployment

| ID | Task | Hours | Role | Backlog Ref |
|----|------|-------|------|-------------|
| S4-T18 | Identify pilot engagement and Phase 4 scope | 2 | Lead Architect | E4-S4.T1 |
| S4-T19 | Assign ISL champion on engagement team | 1 | Lead Architect | E4-S4.T2 |
| S4-T20 | Conduct ISL onboarding session | 3 | Lead Architect | E4-S4.T3 |

> Pilot monitoring tasks (E4-S4.T4–T7) extend beyond Sprint 4 into the engagement timeline.

### Role Assignment Matrix — Sprint 4

| Role | Overlays | Review/QA | Packaging | Pilot | Total |
|------|----------|-----------|-----------|-------|-------|
| Lead Architect | S4-T5 | S4-T7, T8, T11 | S4-T13, T14 | S4-T18, T19, T20 | 30 |
| Sr Data Gov Specialist | S4-T1, T2, T4, T6 | S4-T11 | — | — | 16 |
| Sr Integration Architect | S4-T3 | S4-T11 | S4-T15, T16 | — | 9 |
| Technical Writer | — | S4-T9, T10 | S4-T12, T17 | — | 12 |
| | | | | **Sprint Total** | **67** |

> Buffer of ~13 hrs for unexpected review feedback, rework, and pilot preparation.

### Milestones

| ID | Milestone | Criteria | Sprint Day |
|----|-----------|----------|------------|
| M4.1 | Overlays Consolidated | Manufacturing extensions finalized across modules | Day 4 |
| M4.2 | Review Complete | Cross-module review pass; zero open comments | Day 7 |
| M4.3 | v1.0 Tagged | Git release tagged; release notes published | Day 9 |
| M4.4 | **ISL v1.0 Production-Ready** | **Packaging complete; pilot onboarding scheduled** | Day 10 |

---

## Cross-Sprint Metrics

### Module Progress Tracker

| Module | ID | Templates | Examples | Sprint 0 | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 |
|--------|----|-----------|----------|----------|----------|----------|----------|----------|
| Naming Conventions | ISL-03 | 7 | 2 | — | 9 ✓ | — | — | — |
| Data Classification | ISL-04 | 6 | 3 | — | 9 ✓ | — | — | — |
| API Governance | ISL-01 | 6 | 2 | — | — | 8 ✓ | — | — |
| Data Quality | ISL-06 | 6 | 3 | — | — | 9 ✓ | — | — |
| Metadata & Lineage | ISL-02 | 6 | 3 | — | — | — | 9 ✓ | — |
| Integration Patterns | ISL-05 | 8 | 3 | — | — | — | 11 ✓ | — |
| Mfg Overlays | — | — | — | — | — | — | — | ✓ |
| **Cumulative Artifacts** | | **39** | **16** | **0** | **18** | **35** | **55** | **55 + overlays** |

### Cumulative Hours Burn

| Sprint | Duration | Sprint Hours | Cumulative | % of ~470 Budget |
|--------|----------|-------------|-----------|-----------------|
| 0 | 1 week | 40 | 40 | 9% |
| 1 | 2 weeks | 90 | 130 | 28% |
| 2 | 2 weeks | 100 | 230 | 49% |
| 3 | 4 weeks | 160 | 390 | 83% |
| 4 | 2 weeks | 80 | 470 | 100% |

### Milestone Summary

| ID | Milestone | Sprint | Day | Status |
|----|-----------|--------|-----|--------|
| M0.1 | Engagement Audit Complete | 0 | 3 | |
| M0.2 | Standards Survey Complete | 0 | 4 | |
| M0.3 | **Scope Locked** | 0 | 5 | |
| M1.1 | ISL-03 Drafts Complete | 1 | 5 | |
| M1.2 | ISL-04 Drafts Complete | 1 | 7 | |
| M1.3 | ISL-03 Peer Review Pass | 1 | 8 | |
| M1.4 | ISL-04 Peer Review Pass | 1 | 9 | |
| M1.5 | **Foundation Complete** | 1 | 10 | |
| M2.1 | ISL-01 Drafts Complete | 2 | 5 | |
| M2.2 | ISL-06 Rule Library Complete | 2 | 6 | |
| M2.3 | ISL-06 Drafts Complete | 2 | 7 | |
| M2.4 | OWASP Cross-Reference Pass | 2 | 8 | |
| M2.5 | ISL-01 Peer Review Pass | 2 | 9 | |
| M2.6 | **Core Complete** | 2 | 10 | |
| M3.1 | ISL-02 Drafts Complete | 3 | 10 | |
| M3.2 | ISL-05 Patterns Complete | 3 | 10 | |
| M3.3 | Examples & Diagrams Complete | 3 | 15 | |
| M3.4 | ISL-02 Peer Review Pass | 3 | 18 | |
| M3.5 | ISL-05 Peer Review Pass | 3 | 19 | |
| M3.6 | **All 6 Modules Complete** | 3 | 20 | |
| M4.1 | Overlays Consolidated | 4 | 4 | |
| M4.2 | Review Complete | 4 | 7 | |
| M4.3 | v1.0 Tagged | 4 | 9 | |
| M4.4 | **ISL v1.0 Production-Ready** | 4 | 10 | |

---

## Appendix A: Template & Example Checklist

### ISL-03: Naming Conventions (Sprint 1)
- [ ] `templates/database-schema-naming.md`
- [ ] `templates/table-view-naming.md`
- [ ] `templates/column-naming-standards.md`
- [ ] `templates/pipeline-dataflow-naming.md`
- [ ] `templates/api-endpoint-naming.md`
- [ ] `templates/infrastructure-resource-naming.md`
- [ ] `templates/abbreviation-dictionary.md`
- [ ] `examples/fabric-naming-reference.md`
- [ ] `examples/manufacturing-domain-names.md`

### ISL-04: Data Classification (Sprint 1)
- [ ] `templates/classification-tier-definitions.md`
- [ ] `templates/sensitivity-labeling-standards.md`
- [ ] `templates/data-handling-requirements.md`
- [ ] `templates/access-control-alignment.md`
- [ ] `templates/compliance-mapping-matrix.md`
- [ ] `templates/classification-decision-tree.md`
- [ ] `examples/manufacturing-classification.md`
- [ ] `examples/fabric-security-model.md`
- [ ] `examples/purview-label-configuration.md`

### ISL-01: API Governance (Sprint 2)
- [ ] `templates/api-design-standards.md`
- [ ] `templates/api-versioning-policy.md`
- [ ] `templates/api-security-standards.md`
- [ ] `templates/api-lifecycle-governance.md`
- [ ] `templates/api-catalog-requirements.md`
- [ ] `templates/rate-limiting-policy.md`
- [ ] `examples/manufacturing-api-standards.md`
- [ ] `examples/fabric-native-api-patterns.md`

### ISL-06: Data Quality (Sprint 2)
- [ ] `templates/quality-dimension-definitions.md`
- [ ] `templates/quality-sla-framework.md`
- [ ] `templates/quality-rule-library.md`
- [ ] `templates/quality-monitoring-standards.md`
- [ ] `templates/remediation-workflow.md`
- [ ] `templates/quality-scorecard-template.md`
- [ ] `examples/manufacturing-quality-rules.md`
- [ ] `examples/fabric-quality-implementation.md`
- [ ] `examples/quality-dashboard-spec.md`

### ISL-02: Metadata & Lineage (Sprint 3)
- [ ] `templates/business-glossary-standards.md`
- [ ] `templates/technical-metadata-schema.md`
- [ ] `templates/data-lineage-requirements.md`
- [ ] `templates/data-catalog-governance.md`
- [ ] `templates/metadata-integration-patterns.md`
- [ ] `templates/lineage-visualization-standards.md`
- [ ] `examples/manufacturing-metadata-model.md`
- [ ] `examples/fabric-onelake-metadata.md`
- [ ] `examples/purview-configuration-guide.md`

### ISL-05: Integration Patterns (Sprint 3)
- [ ] `patterns/erp-extract-load.md`
- [ ] `patterns/iot-ot-ingestion.md`
- [ ] `patterns/api-gateway-integration.md`
- [ ] `patterns/event-driven-architecture.md`
- [ ] `patterns/master-data-synchronization.md`
- [ ] `patterns/file-based-integration.md`
- [ ] `patterns/medallion-architecture.md`
- [ ] `patterns/reverse-etl.md`
- [ ] `diagrams/integration-landscape-overview.md`
- [ ] `diagrams/fabric-integration-architecture.md`
- [ ] `diagrams/pattern-decision-tree.md`

---

## Appendix B: Escalation Procedures

| Issue | First Response | Escalation Path | SLA |
|-------|---------------|-----------------|-----|
| Build team member pulled to client work | Redistribute tasks within remaining team | DMTSP Practice Lead → protect allocation | 24 hrs |
| Template scope disagreement | Lead Architect decision | DMTSP VP → final authority | 48 hrs |
| External standards conflict | Document both options with rationale | Lead Architect makes binding call | 24 hrs |
| Peer review blocker (fundamental rework needed) | Schedule working session to resolve | Lead Architect + module owner pair | 8 hrs |
| Pilot engagement not available | Identify secondary candidate engagement | DMTSP account leads → next suitable account | 1 week |
| Fabric/Purview documentation gap | Document current state + known gap | Flag for quarterly refresh in v1.1 | Non-blocking |

---

*This orchestrator aligns with the [Roadmap](../roadmap.md) phases and [Backlog](../backlog.md) epics. All task IDs cross-reference the backlog using the pattern E{epic}-S{story}.T{task}. Re-baseline at Sprint 0 exit gate (M0.3 Scope Locked).*

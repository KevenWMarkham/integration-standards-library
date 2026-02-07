# API Lifecycle Governance

> Module: ISL-01 | Version: 1.0 | Adaptation Effort: 3-5 hrs | Dependencies: ISL-03, ISL-04

## Purpose

This document establishes the governance framework for the complete API lifecycle, from initial design through retirement. It defines the stages, review gates, approval workflows, and operational responsibilities that ensure APIs are consistently designed, securely built, properly documented, and gracefully retired.

All APIs must follow this governance process regardless of whether they are internally developed, partner-facing, or wrapper APIs for existing systems (SAP, Epicor, IoT platforms).

## Scope

### In Scope

- All RESTful HTTP APIs exposed through the API gateway (APIM)
- Internal microservice APIs
- ERP wrapper APIs (SAP RFC/BAPI, Epicor REST)
- IoT telemetry and device management APIs
- Fabric-integrated data APIs
- Third-party API consumption governance
- API product management and ownership

### Out of Scope

- Internal library/package APIs (covered under software development standards)
- Database stored procedure interfaces
- File-based integrations (covered under ISL-06)

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default | Client Value | Notes |
|-----------|---------|--------------|-------|
| API Governance Board | Architecture Review Board (ARB) | _________________ | Primary approval authority |
| Design Review Required | Yes (all APIs) | _________________ | Mandatory design review gate |
| Security Review Required | Yes (Tier 2+ APIs) | _________________ | Per ISL-04 classification |
| API Product Owner Role | Integration Architect | _________________ | Who owns the API product |
| API Developer Role | Integration Developer | _________________ | Who builds and maintains |
| API Registry Platform | Azure API Management + API Catalog | _________________ | API inventory platform |
| Developer Portal | APIM Developer Portal | _________________ | Consumer-facing documentation |
| CI/CD Platform | Azure DevOps Pipelines | _________________ | Build and deploy platform |
| SLA Review Cadence | Quarterly | _________________ | SLA performance review frequency |
| Deprecation Authority | API Governance Board | _________________ | Who approves deprecation |
| Incident Management | ServiceNow / Azure Boards | _________________ | Incident tracking platform |
| Change Advisory Board (CAB) | Required for production changes | _________________ | Change management authority |

## Lifecycle Stages

### Stage Overview

```
 DESIGN ──> REVIEW ──> BUILD ──> TEST ──> PUBLISH ──> MONITOR ──> DEPRECATE ──> RETIRE
   │          │          │        │         │           │            │            │
   │     Design Gate  Security  Quality  Publish    Operations  Deprecation   Removal
   │     Review       Gate      Gate     Approval   Monitoring  Announcement  Execution
   │                                                  │
   │                                              Incident
   │                                              Management
   └──────────────────────────────────────────────────┘
                     (Feedback Loop)
```

### Stage 1: Design

| Aspect | Requirement |
|--------|-------------|
| **Trigger** | Business need or integration requirement identified |
| **Activities** | Define API scope and consumers. Create OpenAPI 3.1 specification draft. Identify data classification tier (ISL-04). Define resource model and endpoints. Document authentication requirements. Identify dependencies (upstream/downstream). Define SLA targets. |
| **Artifacts** | OpenAPI 3.1 specification (draft). API design document. Data flow diagram. Consumer impact assessment (if modifying existing API). |
| **Duration** | 1-5 business days (varies by complexity) |
| **Exit Criteria** | OpenAPI spec completed and ready for design review |
| **Responsible** | API Product Owner + API Developer |

### Stage 2: Review

| Aspect | Requirement |
|--------|-------------|
| **Trigger** | Design artifacts completed and submitted for review |
| **Activities** | Design review gate (see Design Review Gates below). Security review (Tier 2+ APIs). Naming convention review (ISL-03 compliance). Cross-reference review (dependencies, catalog impact). |
| **Artifacts** | Review checklist completed. Security assessment report (Tier 2+). Approved OpenAPI specification. Review meeting minutes. |
| **Duration** | 2-5 business days |
| **Exit Criteria** | All review gates passed; approval recorded |
| **Responsible** | API Governance Board + Security Team |

### Stage 3: Build

| Aspect | Requirement |
|--------|-------------|
| **Trigger** | Design review approved |
| **Activities** | Implement API endpoints per approved OpenAPI spec. Configure APIM policies (security, rate limiting, transformation). Implement input validation and error handling. Set up logging and monitoring. Write unit tests and integration tests. Create consumer documentation. |
| **Artifacts** | API implementation code. APIM policy configuration. Unit test suite (minimum 80% coverage). Integration test suite. Consumer documentation draft. |
| **Duration** | 5-20 business days (varies by complexity) |
| **Exit Criteria** | Implementation complete, all tests passing, documentation drafted |
| **Responsible** | API Developer |

### Stage 4: Test

| Aspect | Requirement |
|--------|-------------|
| **Trigger** | Build complete, deployed to test environment |
| **Activities** | Execute API contract tests (OpenAPI compliance). Run security tests (OWASP Top 10 scan). Performance/load testing against SLA targets. Consumer acceptance testing (with pilot consumers). Penetration testing (Tier 3+ APIs). Error scenario testing. |
| **Artifacts** | Test execution report. Security scan results. Performance test results. Consumer acceptance sign-off. Defect list and resolution status. |
| **Duration** | 3-10 business days |
| **Exit Criteria** | All test criteria met, no critical/high defects open |
| **Responsible** | QA Team + API Developer + Pilot Consumers |

### Stage 5: Publish

| Aspect | Requirement |
|--------|-------------|
| **Trigger** | Testing complete, all gates passed |
| **Activities** | Submit change request to CAB (if required). Register API in catalog with complete metadata. Deploy to production APIM. Publish documentation to developer portal. Configure production monitoring and alerting. Notify registered consumers (for updates). Open for consumer onboarding. |
| **Artifacts** | Change request approved. Catalog entry complete. Production deployment confirmation. Developer portal documentation live. Monitoring dashboard configured. Consumer notification sent. |
| **Duration** | 1-3 business days |
| **Exit Criteria** | API live in production, discoverable in catalog, monitoring active |
| **Responsible** | API Product Owner + Platform Team |

### Stage 6: Monitor

| Aspect | Requirement |
|--------|-------------|
| **Trigger** | API published to production (ongoing) |
| **Activities** | Monitor availability and latency against SLA. Track error rates and anomalies. Monitor consumer usage patterns. Review rate limit utilization. Generate usage reports for API product management. Periodic SLA review (quarterly). Security monitoring (Defender for APIs). |
| **Artifacts** | Monthly usage reports. SLA performance dashboards. Anomaly investigation records. Quarterly SLA review documents. |
| **Duration** | Continuous |
| **Exit Criteria** | N/A (continuous until deprecation) |
| **Responsible** | Platform Team + API Product Owner |

### Stage 7: Deprecate

| Aspect | Requirement |
|--------|-------------|
| **Trigger** | New version published, business decision, or API no longer needed |
| **Activities** | Submit deprecation request to API Governance Board. Announce deprecation to all consumers (see Versioning Policy). Add deprecation headers to API responses. Publish migration guide (if successor exists). Block new consumer onboarding. Monitor migration progress. Conduct direct outreach to non-migrated consumers. |
| **Artifacts** | Deprecation approval record. Consumer notification log. Migration guide published. Migration progress tracking. |
| **Duration** | 6 months minimum (per Versioning Policy) |
| **Exit Criteria** | All consumers migrated or acknowledged, sunset date reached |
| **Responsible** | API Product Owner + Consumer Relationship Management |

### Stage 8: Retire

| Aspect | Requirement |
|--------|-------------|
| **Trigger** | Sunset date reached, all consumers migrated |
| **Activities** | Final consumer notification (7-day warning). Remove API from developer portal. Configure 410 Gone response in APIM. Remove backend resources (after data retention period). Archive API documentation and OpenAPI spec. Update catalog entry to "Retired" status. Post-retirement traffic monitoring (30 days). |
| **Artifacts** | Retirement confirmation. Archive of API documentation. Catalog entry updated. Post-retirement traffic report. |
| **Duration** | 1-5 business days (plus 30-day monitoring) |
| **Exit Criteria** | API fully retired, resources cleaned up, no residual traffic |
| **Responsible** | Platform Team + API Product Owner |

## Design Review Gates

### Design Review Checklist

All APIs must pass the following design review checklist before proceeding to the Build stage:

| Category | Check Item | Required For |
|----------|-----------|--------------|
| **OpenAPI Spec** | Valid OpenAPI 3.1 specification provided | All APIs |
| **OpenAPI Spec** | All endpoints, parameters, and schemas documented | All APIs |
| **OpenAPI Spec** | Request/response examples included | All APIs |
| **Naming** | Resource names comply with ISL-03 conventions | All APIs |
| **Naming** | URL paths use plural nouns, kebab-case | All APIs |
| **Naming** | Field names use snake_case | All APIs |
| **Design Standards** | HTTP methods used correctly (ISL-01 API Design Standards) | All APIs |
| **Design Standards** | Error responses use RFC 7807 format | All APIs |
| **Design Standards** | Pagination implemented for collections | All APIs |
| **Design Standards** | Idempotency keys for POST/PATCH operations | All APIs |
| **Security** | Authentication method defined and appropriate for tier | All APIs |
| **Security** | Authorization scopes/roles defined | All APIs |
| **Security** | Data classification tier identified (ISL-04) | All APIs |
| **Security** | Input validation rules defined for all parameters | All APIs |
| **Security** | OWASP API Top 10 assessment completed | Tier 2+ |
| **Security** | ITAR controls specified (if applicable) | ITAR APIs |
| **Versioning** | Version strategy documented | All APIs |
| **Versioning** | Backward compatibility impact assessed | Updates only |
| **Rate Limiting** | Consumer tier and rate limits defined | All APIs |
| **Documentation** | Consumer onboarding guide drafted | All APIs |
| **Dependencies** | Upstream/downstream dependencies mapped | All APIs |
| **SLA** | Availability, latency, throughput targets defined | All APIs |
| **Monitoring** | Logging and alerting requirements defined | All APIs |

### Security Review Gate

Required for all Tier 2 and above APIs (per ISL-04 classification):

| Check Item | Tier 2 | Tier 3 | Tier 4 (ITAR) |
|-----------|--------|--------|----------------|
| OAuth 2.0 flow validated | Required | Required | Required |
| Authorization model reviewed | Required | Required | Required |
| Input validation schema reviewed | Required | Required | Required |
| OWASP API Top 10 assessment | Required | Required | Required |
| Penetration test plan approved | Recommended | Required | Required |
| Data flow diagram (with classification) | Required | Required | Required |
| mTLS configuration reviewed | Recommended | Required | Required |
| ITAR compliance verification | N/A | N/A | Required |
| Geo-restriction configuration | N/A | Recommended | Required |
| Audit logging configuration reviewed | Required | Required | Required |
| Incident response plan reviewed | Recommended | Required | Required |

## Publishing Approval Workflow

### Approval Matrix

| API Type | Approvers Required | SLA for Approval |
|----------|-------------------|------------------|
| Internal (Tier 1) | API Product Owner + Team Lead | 2 business days |
| Internal (Tier 2) | API Product Owner + Security Lead | 3 business days |
| Partner-Facing (Tier 2+) | API Governance Board | 5 business days |
| External / Public (Any Tier) | API Governance Board + CISO | 5 business days |
| ITAR-Controlled (Tier 4) | API Governance Board + CISO + Legal | 10 business days |

### Approval Workflow

```
Developer submits ──> Product Owner review ──> Security review ──> Governance Board
   publish request         (1 day)              (1-2 days)          (2-3 days)
                                                                        │
                                                                   ┌────┴────┐
                                                                Approved  Rejected
                                                                   │         │
                                                              Deploy to   Return with
                                                              production  feedback
```

## SLA Definitions

### Standard SLA Tiers

| SLA Tier | Availability | Latency (p95) | Latency (p99) | Throughput | Use Case |
|----------|-------------|---------------|---------------|------------|----------|
| **Platinum** | 99.99% | < 100ms | < 250ms | 10,000 req/s | Core business-critical APIs |
| **Gold** | 99.95% | < 250ms | < 500ms | 5,000 req/s | Important business APIs |
| **Silver** | 99.9% | < 500ms | < 1,000ms | 1,000 req/s | Standard business APIs |
| **Bronze** | 99.5% | < 1,000ms | < 2,000ms | 200 req/s | Non-critical, internal APIs |

### SLA Measurement

| Metric | Measurement Method | Tool |
|--------|-------------------|------|
| Availability | Synthetic monitoring (5-minute intervals) | Azure Monitor / Application Insights |
| Latency | Server-side response time distribution | Application Insights |
| Error rate | 5xx errors / total requests | APIM Analytics |
| Throughput | Requests per second (sustained) | APIM Analytics + Load Testing |

### SLA Review Process

| Frequency | Activity | Participants |
|-----------|----------|-------------|
| Weekly | Review SLA dashboards, identify trends | Platform Team |
| Monthly | SLA compliance report, consumer impact analysis | API Product Owner + Platform Team |
| Quarterly | Formal SLA review, capacity planning, tier adjustments | API Governance Board |
| Annually | SLA framework review, benchmark against industry standards | API Governance Board + Executive Sponsor |

## Consumer Onboarding Process

### Onboarding Steps

| Step | Activity | Responsible | Duration |
|------|----------|-------------|----------|
| 1 | Consumer submits access request via developer portal | Consumer | — |
| 2 | API Product Owner reviews request (business justification) | Product Owner | 1 day |
| 3 | Security review for Tier 2+ APIs | Security Team | 1-2 days |
| 4 | Consumer receives API credentials (subscription key, OAuth app registration) | Platform Team | 1 day |
| 5 | Consumer completes integration in sandbox environment | Consumer | Variable |
| 6 | Consumer confirms production readiness | Consumer | — |
| 7 | Production access granted | Platform Team | 1 day |
| 8 | Consumer added to notification distribution list | Platform Team | Same day |

### Consumer Registration Requirements

| Data Point | Required | Purpose |
|-----------|----------|---------|
| Application name | Yes | Identification in monitoring |
| Application owner (name, email) | Yes | Communication and incident response |
| Business justification | Yes | Access control governance |
| Expected usage volume | Yes | Capacity planning and rate limit assignment |
| Data classification acknowledgment | Tier 2+ | Security compliance |
| ITAR certification | Tier 4 | Export control compliance |
| Technical contact | Yes | Incident resolution |
| Preferred notification channel | Yes | Deprecation and change notifications |

## Change Management

### Change Categories

| Category | Description | Approval | Lead Time |
|----------|-------------|----------|-----------|
| **Standard** | Pre-approved, low-risk changes (bug fixes, minor patches) | Auto-approved via CI/CD | Same day |
| **Normal** | Non-breaking changes (new endpoints, optional fields) | API Product Owner | 3 business days |
| **Major** | Breaking changes requiring new version | API Governance Board | Per versioning policy |
| **Emergency** | Critical production fix (security patch, outage resolution) | Verbal approval + retrospective | Immediate |

### Change Request Template

| Field | Description |
|-------|-------------|
| Change ID | Auto-generated identifier |
| API Name/Version | Affected API and version |
| Change Type | Standard / Normal / Major / Emergency |
| Description | What is being changed and why |
| Impact Assessment | Consumers affected, breaking/non-breaking |
| Rollback Plan | How to revert if issues occur |
| Testing Evidence | Test results supporting the change |
| Deployment Window | Proposed deployment date/time |
| Approvers | Required approvals per change category |
| Post-Deployment Validation | Steps to verify successful deployment |

## Incident Management for APIs

### Severity Levels

| Severity | Definition | Response SLA | Resolution SLA |
|----------|-----------|-------------|----------------|
| **SEV-1 (Critical)** | Complete API outage affecting production consumers | 15 minutes | 4 hours |
| **SEV-2 (High)** | Partial outage or significant performance degradation | 30 minutes | 8 hours |
| **SEV-3 (Medium)** | Intermittent errors or minor performance issues | 2 hours | 24 hours |
| **SEV-4 (Low)** | Cosmetic issues, documentation errors | 1 business day | 5 business days |

### Incident Response Process

| Step | Activity | Responsible | Timing |
|------|----------|-------------|--------|
| 1 | Incident detected (monitoring alert or consumer report) | Platform Team | Automated or report |
| 2 | Severity assessment and triage | On-call Engineer | Within response SLA |
| 3 | Incident communication to affected consumers | API Product Owner | Within 30 min of SEV-1/2 |
| 4 | Investigation and diagnosis | API Developer + Platform Team | Per resolution SLA |
| 5 | Resolution or workaround implemented | API Developer | Per resolution SLA |
| 6 | Consumer notification of resolution | API Product Owner | Within 1 hour of resolution |
| 7 | Post-incident review (SEV-1/2) | All stakeholders | Within 5 business days |
| 8 | Corrective action implementation | API Developer | Per post-incident review |

### Consumer Notification During Incidents

| Severity | Notification Timing | Channel |
|----------|-------------------|---------|
| SEV-1 | Immediately, then every 30 minutes until resolved | Email, status page, direct contact for critical consumers |
| SEV-2 | Within 30 minutes, then every hour until resolved | Email, status page |
| SEV-3 | Within 2 hours, daily updates if ongoing | Email, status page |
| SEV-4 | As part of regular changelog | Developer portal |

## Fabric / Azure Implementation Guidance

### Azure DevOps Pipeline Integration

- API CI/CD pipelines must include OpenAPI spec linting (e.g., Spectral) in the build stage.
- APIM deployment should use Infrastructure-as-Code (Bicep/ARM/Terraform).
- Policy files should be source-controlled alongside API implementation.
- Automated API contract tests must run in the release pipeline before production deployment.

### APIM Lifecycle Features

- Use APIM Products to group APIs by business domain or consumer tier.
- Use APIM Subscriptions for consumer access management.
- Use APIM Named Values (Key Vault backed) for environment-specific configuration.
- Use APIM Diagnostic settings to stream logs to Log Analytics and Sentinel.

### Fabric-Specific Governance

- Fabric REST API consumption must follow the same onboarding process.
- Fabric workspace APIs (lakehouse, warehouse) must be cataloged in the API registry.
- Fabric Data Factory web activity API calls must be reviewed during pipeline governance.
- Power BI embed token generation APIs must follow the security review gate.

## Manufacturing Overlay [CONDITIONAL]

### ERP API Lifecycle Considerations

| ERP System | Lifecycle Consideration |
|------------|----------------------|
| SAP S/4HANA | RFC/BAPI wrapper APIs must be re-validated after SAP Support Packs and upgrades. Custom RFC changes trigger the full change management process. SAP transport correlation with API version changes must be documented. |
| Epicor Kinetic | Epicor version upgrades must trigger wrapper API regression testing. BAQ changes affecting API contracts require consumer notification. Epicor cloud update schedules must be factored into API maintenance windows. |

### IoT API Lifecycle

- IoT telemetry APIs have extended deprecation timelines (12 months) due to firmware constraints.
- Device provisioning API changes must coordinate with IoT Hub DPS configuration.
- Sensor data schema changes must go through the full review process.

### ITAR API Governance

- ITAR APIs require Legal team sign-off at design review and publishing gates.
- ITAR API access reviews must occur quarterly (see ISL-04).
- ITAR API incident response must include export control officer notification.
- ITAR API retirement must ensure data retention compliance before resource cleanup.

## Cross-References

| Document | Relationship |
|----------|-------------|
| ISL-01: API Design Standards | Design stage inputs and review checklist |
| ISL-01: API Security Standards | Security review gate requirements |
| ISL-01: API Versioning Policy | Deprecation and retirement timelines |
| ISL-01: API Catalog Requirements | Catalog registration at publish stage |
| ISL-01: Rate Limiting Policy | Consumer tier assignment during onboarding |
| ISL-03: Naming Conventions | Naming review gate |
| ISL-04: Security by Tier | Data classification driving review requirements |

## Compliance Alignment

| Standard | Alignment |
|----------|-----------|
| NIST SP 800-53 (CM, SA, SI) | Configuration management, system acquisition, system integrity |
| ISO 27001 (A.12, A.14) | Operations security, system development security |
| ITIL v4 | Service lifecycle, change management, incident management |
| OWASP API Security Top 10 | Security review gate content |
| SOC 2 Type II (CC6, CC7, CC8) | Logical access, system operations, change management |
| ITAR (22 CFR 120-130) | Export control governance requirements |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial release |
| — | — | — | Reserved for client adaptation |

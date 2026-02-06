# ISL-01: API Governance Standards

**Module ID:** ISL-01
**Target:** API design, lifecycle management, and integration contract governance
**Productivity Gain:** 55–70% reduction in API standards creation effort
**Build Effort:** Medium (40–60 hours)
**Reusability:** Global — applicable across all DMTSP engagements with API/integration scope

---

## Overview

Pre-built API governance framework covering design standards, versioning policies, security requirements, rate limiting, and lifecycle management. Provides a complete governance structure that practitioners customize to client technology stack (REST, GraphQL, event-driven) and organizational maturity.

This module eliminates the blank-page problem in Phase 4 (Standards Definition) by providing battle-tested API governance artifacts that have been validated against OWASP API Security Top 10, Microsoft REST API Guidelines, and industry best practices from prior DMTSP engagements.

---

## How It Works

### Step 1: Assess Client API Landscape
Review client's existing API inventory, technology stack, and organizational maturity. Use discovery questions Q18–Q22 from the RFP Discovery Questionnaire Tool (ACC-02) to identify existing policies that may conflict or complement.

### Step 2: Select Applicable Templates
Choose from the template library based on client context:
- REST-first vs. event-driven vs. hybrid architecture
- Azure-native (APIM) vs. multi-cloud (MuleSoft, Apigee, Kong)
- Maturity tier: Crawl (basic standards) / Walk (enforced governance) / Run (automated compliance)

### Step 3: Adapt to Client Context
Customize templates with client-specific details:
- Organization name, team structure, approval chains
- Technology platform bindings (e.g., Azure API Management policies)
- Industry compliance overlays (SOX, ITAR, HIPAA)
- Naming conventions aligned to ISL-03

### Step 4: Review & Validate
Conduct peer review against:
- OWASP API Security Top 10 (2023)
- Microsoft REST API Guidelines
- Client's existing security policies and compliance requirements

### Step 5: Deliver & Enable
Package standards with adoption guidance, training materials, and enforcement tooling configuration (API linting rules, CI/CD gate policies).

---

## Template Inventory

| Template | File | Description | Adaptation Effort |
|----------|------|-------------|-------------------|
| API Design Standards | `templates/api-design-standards.md` | RESTful design principles, HTTP method usage, error response formats, pagination, filtering, sorting | 4–6 hours |
| API Versioning Policy | `templates/api-versioning-policy.md` | URL vs. header versioning, deprecation timelines, backward compatibility, migration guidance | 2–3 hours |
| API Security Standards | `templates/api-security-standards.md` | OAuth 2.0/OIDC patterns, API key management, mTLS, CORS, input validation, OWASP alignment | 4–8 hours |
| API Lifecycle Governance | `templates/api-lifecycle-governance.md` | Design review gates, publishing approval workflow, deprecation process, consumer notification SLAs | 3–5 hours |
| API Catalog Requirements | `templates/api-catalog-requirements.md` | Metadata schema for API registry, discovery requirements, developer portal standards | 2–4 hours |
| Rate Limiting & Throttling | `templates/rate-limiting-policy.md` | Tier definitions, quota management, burst handling, consumer SLA tiers | 2–3 hours |

---

## Examples

| Example | File | Description |
|---------|------|-------------|
| Manufacturing API Standards | `examples/manufacturing-api-standards.md` | Adapted API governance for manufacturing client with SAP/Epicor integration, IoT telemetry APIs, and ITAR compliance overlay |
| Fabric-Native API Patterns | `examples/fabric-native-api-patterns.md` | API standards specifically for Microsoft Fabric REST APIs, OneLake endpoints, and Fabric Data Factory web activities |

---

## Impact Metrics

| Metric | Baseline (No Accelerator) | With Accelerator | Savings |
|--------|--------------------------|-------------------|---------|
| Hours to create API governance standards | 80–120 hrs | 20–35 hrs | 60–85 hrs |
| Time to first draft | 3–4 weeks | 3–5 days | 2–3 weeks |
| Compliance coverage gaps (typical) | 15–25% | <5% | Significant risk reduction |
| Practitioner skill requirement | Senior Architect | Senior Engineer + review | Lower barrier to quality |

---

## Client Adaptation Points

- **Technology stack:** Azure API Management, MuleSoft, Apigee, Kong, AWS API Gateway
- **Authentication model:** OAuth 2.0, API keys, mTLS, SAML federation
- **Industry compliance:** SOX (financial data APIs), ITAR (defense/manufacturing), HIPAA (health data), GDPR (PII)
- **Organizational maturity:** Crawl (document-only) → Walk (enforced gates) → Run (automated policy-as-code)
- **API style:** REST, GraphQL, gRPC, event-driven (AsyncAPI), SOAP (legacy)

---

## Dependencies

- **ISL-03 (Naming Conventions):** API and endpoint naming standards consumed from naming conventions module
- **ISL-04 (Data Classification):** Security requirements per classification tier inform API security standards
- **ACC-04 (Governance Maturity Assessment):** Maturity level determines which governance artifacts to include
- **ACC-02 (RFP Discovery Questionnaire):** Questions Q18–Q22 validate existing API policies and identify gaps

---

## Directory Structure

```
api-governance/
├── README.md              ← This file
├── templates/
│   ├── api-design-standards.md
│   ├── api-versioning-policy.md
│   ├── api-security-standards.md
│   ├── api-lifecycle-governance.md
│   ├── api-catalog-requirements.md
│   └── rate-limiting-policy.md
└── examples/
    ├── manufacturing-api-standards.md
    └── fabric-native-api-patterns.md
```

---

*Module Owner: DMTSP Enterprise Architecture Practice | Build Priority: Sprint 2 (Weeks 3–4)*

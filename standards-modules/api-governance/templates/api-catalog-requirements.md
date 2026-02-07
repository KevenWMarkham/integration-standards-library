# API Catalog Requirements

> Module: ISL-01 | Version: 1.0 | Adaptation Effort: 2-4 hrs | Dependencies: ISL-03, ISL-04

## Purpose

This document establishes the requirements for the organization's API catalog — the authoritative registry of all APIs developed, consumed, and managed within the client environment. The API catalog serves as the single source of truth for API discovery, documentation, consumer management, and lifecycle tracking.

A well-maintained API catalog is a critical defense against shadow APIs (OWASP API9:2023 — Improper Inventory Management) and supports the full API lifecycle governance process.

## Scope

### In Scope

- API registry metadata schema and required fields
- API discovery and search requirements
- Developer portal standards and documentation
- API classification and tagging taxonomy
- Consumer registration and tracking
- Usage analytics and health monitoring
- Dependency mapping between APIs
- Integration with Azure API Management (APIM)

### Out of Scope

- API design or implementation details (covered in API Design Standards)
- Security policy implementation (covered in API Security Standards)
- Rate limiting configuration details (covered in Rate Limiting Policy)
- Third-party API marketplace procurement

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default | Client Value | Notes |
|-----------|---------|--------------|-------|
| Catalog Platform | Azure APIM Developer Portal + Custom Registry | _________________ | Primary catalog platform |
| Developer Portal URL | `https://developer.{domain}` | _________________ | Consumer-facing portal |
| API Registry Storage | Azure SQL + APIM native | _________________ | Metadata storage backend |
| Discovery Method | Portal search + tags + browse | _________________ | How consumers find APIs |
| Documentation Standard | OpenAPI 3.1 + Markdown guides | _________________ | Documentation format |
| Analytics Platform | APIM Analytics + Application Insights | _________________ | Usage tracking platform |
| Health Monitoring | Azure Monitor + Application Insights | _________________ | Health check platform |
| Notification Service | Email + Developer Portal announcements | _________________ | Consumer notification |
| Catalog Review Cadence | Monthly | _________________ | Catalog hygiene review |
| Shadow API Detection | Defender for APIs | _________________ | Undocumented API discovery |

## API Registry Metadata Schema

### Required Metadata Fields

Every API registered in the catalog must include the following metadata:

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `api_id` | String (UUID) | Yes | Unique identifier for the API | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| `api_name` | String | Yes | Human-readable API name (ISL-03 compliant) | `Work Orders API` |
| `api_slug` | String | Yes | URL-safe identifier (kebab-case) | `work-orders-api` |
| `version` | String | Yes | Current version (semver) | `1.2.0` |
| `major_version` | Integer | Yes | URL path version number | `1` |
| `status` | Enum | Yes | Lifecycle status | `active` |
| `description` | String | Yes | API purpose and summary (50-200 words) | Full description text |
| `owner_team` | String | Yes | Owning team or department | `Manufacturing Integration Team` |
| `owner_contact` | String | Yes | Primary owner email | `mfg-integration@example.com` |
| `technical_contact` | String | Yes | Technical lead email | `john.doe@example.com` |
| `openapi_spec_url` | URL | Yes | Link to OpenAPI 3.1 specification | `https://api.example.com/v1/work-orders/openapi.json` |
| `base_url` | URL | Yes | Production base URL | `https://api.example.com/v1/work-orders` |
| `sandbox_url` | URL | Recommended | Sandbox/test base URL | `https://api-sandbox.example.com/v1/work-orders` |
| `documentation_url` | URL | Yes | Developer portal documentation link | `https://developer.example.com/docs/work-orders` |
| `sla_tier` | Enum | Yes | SLA tier (Platinum/Gold/Silver/Bronze) | `Gold` |
| `data_classification` | Enum | Yes | ISL-04 data tier | `Tier 2 - Internal` |
| `authentication_method` | Enum | Yes | Primary auth method | `OAuth 2.0 - Client Credentials` |
| `rate_limit_tier` | Enum | Yes | Consumer rate limit tier | `Standard` |
| `created_date` | DateTime | Yes | Date API was first registered | `2025-01-15T00:00:00Z` |
| `last_updated` | DateTime | Yes | Date of last metadata update | `2025-03-15T00:00:00Z` |
| `published_date` | DateTime | Conditional | Date API was published to production | `2025-02-01T00:00:00Z` |
| `deprecated_date` | DateTime | Conditional | Date deprecation was announced | `null` |
| `sunset_date` | DateTime | Conditional | Date API will be removed | `null` |
| `tags` | Array[String] | Yes | Classification tags | `["manufacturing", "erp", "sap"]` |
| `consumer_count` | Integer | Auto | Number of registered consumers | `12` |
| `upstream_dependencies` | Array[String] | Yes | APIs this API depends on | `["sap-material-master-api"]` |
| `downstream_consumers` | Array[String] | Auto | APIs that depend on this API | `["production-dashboard-api"]` |
| `apim_product` | String | Yes | APIM product association | `Manufacturing APIs` |
| `source_system` | String | Conditional | Backend system (if wrapper) | `SAP S/4HANA` |
| `itar_controlled` | Boolean | Yes | ITAR classification flag | `false` |

### Lifecycle Status Values

| Status | Description | Visible in Portal | Accepts New Consumers |
|--------|-------------|-------------------|-----------------------|
| `draft` | Design/development in progress | No | No |
| `review` | Under governance review | No | No |
| `beta` | Published for limited testing | Yes (beta badge) | By invitation only |
| `active` | Published and fully operational | Yes | Yes |
| `deprecated` | Announced for sunset | Yes (deprecated badge) | No |
| `sunset` | Past deprecation, approaching removal | Yes (sunset badge) | No |
| `retired` | Removed from service | No (archived) | No |

### Metadata Schema — JSON Representation

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "api_id", "api_name", "api_slug", "version", "major_version",
    "status", "description", "owner_team", "owner_contact",
    "technical_contact", "openapi_spec_url", "base_url",
    "documentation_url", "sla_tier", "data_classification",
    "authentication_method", "rate_limit_tier", "created_date",
    "last_updated", "tags", "apim_product", "itar_controlled"
  ],
  "properties": {
    "api_id": { "type": "string", "format": "uuid" },
    "api_name": { "type": "string", "maxLength": 100 },
    "api_slug": { "type": "string", "pattern": "^[a-z0-9-]+$" },
    "version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" },
    "major_version": { "type": "integer", "minimum": 1 },
    "status": {
      "type": "string",
      "enum": ["draft", "review", "beta", "active", "deprecated", "sunset", "retired"]
    },
    "description": { "type": "string", "minLength": 50, "maxLength": 2000 },
    "owner_team": { "type": "string" },
    "owner_contact": { "type": "string", "format": "email" },
    "technical_contact": { "type": "string", "format": "email" },
    "openapi_spec_url": { "type": "string", "format": "uri" },
    "base_url": { "type": "string", "format": "uri" },
    "sandbox_url": { "type": "string", "format": "uri" },
    "documentation_url": { "type": "string", "format": "uri" },
    "sla_tier": { "type": "string", "enum": ["Platinum", "Gold", "Silver", "Bronze"] },
    "data_classification": {
      "type": "string",
      "enum": ["Tier 1 - Public", "Tier 2 - Internal", "Tier 3 - Confidential", "Tier 4 - Restricted"]
    },
    "authentication_method": { "type": "string" },
    "rate_limit_tier": { "type": "string", "enum": ["Free", "Basic", "Standard", "Premium"] },
    "tags": { "type": "array", "items": { "type": "string" }, "minItems": 1 },
    "itar_controlled": { "type": "boolean" }
  }
}
```

## Discovery Requirements

### Search Capabilities

The API catalog must support the following search and discovery mechanisms:

| Capability | Requirement | Priority |
|-----------|-------------|----------|
| Full-text search | Search across API name, description, tags, and documentation | Required |
| Tag-based browsing | Browse APIs by classification tags | Required |
| Category browsing | Browse by business domain (Manufacturing, Finance, HR, etc.) | Required |
| Status filtering | Filter by lifecycle status (active, deprecated, etc.) | Required |
| Owner filtering | Filter by owning team | Required |
| Data tier filtering | Filter by ISL-04 data classification | Required |
| SLA tier filtering | Filter by SLA tier | Recommended |
| Source system filtering | Filter by backend system (SAP, Epicor, etc.) | Recommended |
| Dependency search | Find APIs that depend on or are depended upon by a given API | Recommended |
| Recently added | List newly published APIs | Required |
| Most popular | List most-consumed APIs | Recommended |
| Recently updated | List recently modified APIs | Required |

### Classification Tag Taxonomy

All APIs must be tagged using the following standardized taxonomy:

| Tag Category | Tags | Description |
|-------------|------|-------------|
| **Domain** | `manufacturing`, `finance`, `hr`, `supply-chain`, `quality`, `logistics`, `sales`, `engineering` | Business domain |
| **System** | `sap`, `epicor`, `fabric`, `power-bi`, `iot`, `mes`, `custom` | Source/backend system |
| **Type** | `crud`, `query`, `event`, `ingestion`, `reporting`, `orchestration` | API functional type |
| **Data** | `master-data`, `transactional`, `telemetry`, `reference-data`, `analytics` | Data category |
| **Audience** | `internal`, `partner`, `public`, `iot-device` | Intended consumer audience |
| **Compliance** | `itar`, `sox`, `hipaa`, `pci` | Regulatory compliance tags |
| **Technology** | `rest`, `graphql`, `odata`, `webhook` | Protocol/technology |

## Developer Portal Standards

### Portal Requirements

| Feature | Requirement | Priority |
|---------|-------------|----------|
| API documentation (auto-generated from OpenAPI) | Required | P0 |
| Interactive "Try It" console | Required | P0 |
| Code samples (C#, Python, JavaScript, PowerShell) | Required | P1 |
| Authentication setup guide | Required | P0 |
| Getting started tutorial per API | Required | P1 |
| SDK downloads (if available) | Recommended | P2 |
| Changelog per API | Required | P1 |
| Status page integration | Required | P1 |
| Consumer self-service subscription | Required | P0 |
| Rate limit dashboard (per consumer) | Recommended | P2 |
| Error code reference | Required | P1 |
| FAQ / troubleshooting guide | Recommended | P2 |
| API versioning and migration guides | Required | P1 |
| Contact support form | Required | P1 |

### Documentation Standards

Every API published in the developer portal must include:

| Document | Content | Format |
|----------|---------|--------|
| **Overview** | API purpose, target audience, key features | Markdown |
| **Getting Started** | Authentication setup, first API call walkthrough | Markdown + code |
| **API Reference** | Auto-generated from OpenAPI spec (endpoints, parameters, schemas) | OpenAPI 3.1 |
| **Code Samples** | Complete request/response examples in multiple languages | Code blocks |
| **Error Reference** | All possible error codes with descriptions and resolution | Table |
| **Rate Limits** | Consumer tier limits, headers, handling 429 responses | Table + code |
| **Changelog** | Version history with all changes categorized | Keep a Changelog |
| **Migration Guide** | Version migration instructions (when applicable) | Markdown |
| **SLA Information** | Availability, latency, throughput guarantees | Table |

### Code Sample Requirements

Code samples must be provided in the following languages at minimum:

```csharp
// C# (.NET) - Using HttpClient
using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", accessToken);
client.DefaultRequestHeaders.Add("X-Request-ID", Guid.NewGuid().ToString());

var response = await client.GetAsync(
    "https://api.example.com/v1/work-orders?status=open&limit=10");
var content = await response.Content.ReadAsStringAsync();
```

```python
# Python - Using requests
import requests
import uuid

headers = {
    "Authorization": f"Bearer {access_token}",
    "X-Request-ID": str(uuid.uuid4()),
    "Accept": "application/json"
}

response = requests.get(
    "https://api.example.com/v1/work-orders",
    params={"status": "open", "limit": 10},
    headers=headers
)
data = response.json()
```

```javascript
// JavaScript - Using fetch
const response = await fetch(
  'https://api.example.com/v1/work-orders?status=open&limit=10',
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-Request-ID': crypto.randomUUID(),
      'Accept': 'application/json'
    }
  }
);
const data = await response.json();
```

```powershell
# PowerShell - Using Invoke-RestMethod
$headers = @{
    "Authorization" = "Bearer $accessToken"
    "X-Request-ID"  = [System.Guid]::NewGuid().ToString()
    "Accept"        = "application/json"
}

$response = Invoke-RestMethod `
    -Uri "https://api.example.com/v1/work-orders?status=open&limit=10" `
    -Headers $headers `
    -Method GET
```

## Consumer Registration and Tracking

### Consumer Metadata

| Field | Required | Description |
|-------|----------|-------------|
| `consumer_id` | Yes | Unique consumer identifier (UUID) |
| `application_name` | Yes | Consuming application name |
| `owner_name` | Yes | Application owner name |
| `owner_email` | Yes | Application owner email |
| `team` | Yes | Owning team/department |
| `subscribed_apis` | Yes | List of API subscriptions |
| `subscription_tier` | Yes | Rate limit tier (Free/Basic/Standard/Premium) |
| `apim_subscription_key` | Auto | APIM subscription key reference (not value) |
| `oauth_app_registration` | Conditional | Azure AD app registration ID |
| `registered_date` | Auto | Date of first registration |
| `last_active_date` | Auto | Date of last API call |
| `monthly_call_volume` | Auto | Average monthly API calls |
| `notification_preference` | Yes | Email, webhook, or both |
| `itar_cleared` | Conditional | US Person verification status |

### Consumer Lifecycle

| Event | Catalog Action | Notification |
|-------|---------------|-------------|
| New consumer registered | Create consumer record, assign subscription | Welcome email with getting started guide |
| Consumer subscribes to new API | Update subscriptions list | Subscription confirmation |
| Consumer unsubscribes | Remove API subscription | Unsubscribe confirmation |
| Consumer inactive (90 days) | Flag for review | Inactivity warning email |
| Consumer inactive (180 days) | Escalate to owner | Final warning before access review |
| API deprecated | Notify all consumers | Deprecation notice with migration guide |
| API retired | Remove subscriptions | Retirement notice |

## Usage Analytics

### Required Analytics

| Metric | Granularity | Retention | Purpose |
|--------|------------|-----------|---------|
| Total requests per API | Hourly, daily, monthly | 12 months | Usage tracking |
| Requests per consumer | Hourly, daily, monthly | 12 months | Consumer analytics |
| Response time distribution | Hourly (p50, p95, p99) | 6 months | Performance monitoring |
| Error rate per API | Hourly, daily | 6 months | Quality monitoring |
| Error rate per consumer | Daily | 6 months | Consumer health |
| Status code distribution | Daily | 6 months | Behavior analysis |
| Top consumers by volume | Daily | 12 months | Capacity planning |
| Endpoint popularity | Daily | 12 months | API product management |
| Authentication failures | Hourly | 3 months | Security monitoring |
| Rate limit hits per consumer | Hourly | 3 months | Tier management |
| Geographic distribution | Daily | 6 months | Performance and compliance |
| Bandwidth consumption | Daily | 6 months | Cost management |

### Analytics Dashboard Requirements

| Dashboard | Audience | Refresh Rate |
|-----------|----------|-------------|
| API Health Overview | Platform Team | Real-time (5 min) |
| Consumer Usage Summary | API Product Owner | Hourly |
| SLA Compliance | API Governance Board | Daily |
| Security Events | Security Team | Real-time |
| Capacity Planning | Platform Team | Daily |
| Consumer Onboarding Funnel | API Product Owner | Weekly |

## Health Status Monitoring

### Health Status in Catalog

Each API entry in the catalog must display real-time health status:

| Status | Indicator | Criteria |
|--------|-----------|----------|
| Operational | Green | Availability > 99.9%, error rate < 1%, latency within SLA |
| Degraded | Yellow | Availability > 99%, error rate 1-5%, latency within 2x SLA |
| Partial Outage | Orange | Some endpoints unavailable or error rate 5-25% |
| Major Outage | Red | Availability < 95% or error rate > 25% |
| Maintenance | Blue | Scheduled maintenance window |
| Unknown | Gray | Health check not configured or unreachable |

### Health Check Integration

```
API Catalog ──> Health Check Endpoint ──> Status Aggregation ──> Display
                  /health/ready              Azure Monitor          Portal
```

- Each registered API must expose a `/health/ready` endpoint (per API Design Standards).
- Azure Monitor synthetic tests poll health endpoints every 5 minutes.
- Health status is aggregated and displayed in the catalog entry.
- Status page integration provides historical uptime data.

## Dependency Mapping

### Dependency Requirements

| Requirement | Description |
|-------------|-------------|
| Upstream dependencies | Document all APIs and services this API depends on |
| Downstream consumers | Track all applications consuming this API (auto-populated) |
| Dependency visualization | Provide dependency graph visualization in the catalog |
| Impact analysis | When an API status changes, show downstream impact |
| Circular dependency detection | Flag and warn on circular API dependencies |
| External dependency tracking | Track dependencies on third-party APIs (SAP, Epicor, etc.) |

### Dependency Map Example

```
                    ┌──────────────────┐
                    │  SAP S/4HANA     │
                    │  (External)      │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ SAP Material     │
                    │ Master API (v1)  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───────┐ ┌───▼──────────┐ ┌▼──────────────┐
     │ Work Orders    │ │ BOM          │ │ Inventory     │
     │ API (v1)       │ │ API (v1)     │ │ API (v1)      │
     └────────┬───────┘ └──────────────┘ └───────────────┘
              │
     ┌────────▼───────┐
     │ Production     │
     │ Dashboard App  │
     │ (Consumer)     │
     └────────────────┘
```

## Fabric / Azure Implementation Guidance

### APIM Developer Portal Configuration

- Enable the built-in APIM Developer Portal for consumer-facing documentation.
- Customize the portal with organization branding and navigation.
- Configure self-service subscription workflows.
- Enable the interactive "Try It" console with sandbox environment credentials.
- Integrate Application Insights for portal usage analytics.

### APIM as API Registry

- Use APIM's API inventory as the primary registry.
- Supplement with custom metadata stored in Azure SQL or Cosmos DB for fields APIM does not natively support.
- Use APIM Tags for classification taxonomy.
- Use APIM Products for consumer tier management.
- Use APIM Subscriptions for consumer tracking.

### Defender for APIs — Shadow API Detection

- Enable Microsoft Defender for APIs on all APIM instances.
- Configure alerts for undocumented API traffic (APIs receiving requests but not registered in catalog).
- Review shadow API alerts weekly and either register or block undocumented endpoints.
- Integrate Defender findings into the monthly catalog review process.

### Fabric API Cataloging

- Fabric REST APIs consumed by the organization must be registered in the catalog.
- OneLake data endpoints must be cataloged with appropriate classification tags.
- Fabric Data Factory pipeline API integrations must be tracked as dependencies.
- Power BI REST API usage patterns must be documented and cataloged.

## Manufacturing Overlay [CONDITIONAL]

### ERP API Catalog Entries

| API Category | Required Metadata | Special Considerations |
|-------------|-------------------|----------------------|
| SAP RFC Wrappers | Source RFC/BAPI name, SAP module, transport number | Tag with SAP module (MM, PP, SD, etc.) |
| Epicor BAQ Wrappers | Source BAQ ID, Epicor module | Tag with Epicor module |
| MES Integration | MES platform, plant code, production line | Tag with plant/line identifiers |
| IoT Telemetry | Device type, sensor type, data frequency | Tag with device categories |

### ITAR API Catalog Requirements

- ITAR-controlled APIs must be flagged with the `itar` classification tag.
- ITAR API documentation must not be publicly accessible in the developer portal.
- ITAR API catalog entries must include export control classification number (ECCN) or USML category.
- Access to ITAR API catalog entries must be restricted to US Person verified users.
- ITAR API consumer registration must include US Person verification step.

## Catalog Hygiene and Governance

### Monthly Catalog Review

| Review Item | Action |
|------------|--------|
| APIs with no consumers (90+ days) | Review for deprecation candidacy |
| APIs with outdated documentation | Flag for documentation refresh |
| APIs with missing metadata fields | Notify owner for completion |
| Shadow API alerts | Review and resolve (register or block) |
| Deprecated APIs past sunset date | Execute retirement process |
| Consumer accounts inactive 180+ days | Review and potentially revoke |
| SLA compliance exceptions | Escalate to API Governance Board |
| Dependency map accuracy | Validate and update dependencies |

## Cross-References

| Document | Relationship |
|----------|-------------|
| ISL-01: API Design Standards | Health check endpoint format, documentation patterns |
| ISL-01: API Security Standards | Authentication methods, ITAR requirements |
| ISL-01: API Versioning Policy | Version metadata, deprecation status tracking |
| ISL-01: API Lifecycle Governance | Lifecycle stages mapped to catalog status |
| ISL-01: Rate Limiting Policy | Consumer tier metadata |
| ISL-03: Naming Conventions | API naming, slug formatting, tag naming |
| ISL-04: Security by Tier | Data classification metadata |

## Compliance Alignment

| Standard | Alignment |
|----------|-----------|
| OWASP API Security Top 10 (API9:2023) | Improper Inventory Management — catalog addresses this directly |
| NIST SP 800-53 (CM-8, PM-5) | Information system component inventory, system inventory |
| ISO 27001 (A.8.1) | Inventory of assets |
| Microsoft REST API Guidelines | Developer portal and documentation standards |
| OpenAPI Specification 3.1 | API specification format requirement |
| SOC 2 Type II (CC6.1) | Logical access security — consumer registration |
| ITAR (22 CFR 120-130) | Export control inventory and access requirements |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial release |
| — | — | — | Reserved for client adaptation |

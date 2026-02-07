# API Versioning Policy

> Module: ISL-01 | Version: 1.0 | Adaptation Effort: 2-3 hrs | Dependencies: ISL-03, ISL-04

## Purpose

This document establishes the API versioning policy for all APIs developed, consumed, or managed within the client environment. Consistent versioning ensures backward compatibility, predictable consumer impact during changes, and orderly deprecation of obsolete API versions.

All API version changes must follow this policy and pass through the change management gates defined in the API Lifecycle Governance template.

## Scope

### In Scope

- All RESTful HTTP APIs exposed through the API gateway
- Wrapper APIs for ERP systems (SAP, Epicor)
- IoT telemetry and device management APIs
- Fabric-integrated APIs and data access endpoints
- Internal service-to-service APIs
- Partner and third-party-facing APIs

### Out of Scope

- Database schema versioning (covered under data governance standards)
- Application deployment versioning (covered under DevOps standards)
- SDK/client library versioning (follows semantic versioning independently)

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default | Client Value | Notes |
|-----------|---------|--------------|-------|
| Versioning Strategy | URL Path (recommended) | _________________ | URL Path / Header / Query Param |
| Version Format | `v{major}` (e.g., `v1`, `v2`) | _________________ | URL path version format |
| Internal Version Format | Semantic (e.g., `1.2.3`) | _________________ | Internal tracking version |
| Max Active Versions | 2 | _________________ | Concurrent supported versions |
| Deprecation Notice Period | 6 months minimum | _________________ | Time from announcement to sunset |
| Sunset Grace Period | 3 months minimum | _________________ | Time from sunset to removal |
| Consumer Migration SLA | 90 days after sunset announcement | _________________ | Consumer action deadline |
| Breaking Change Approval | Architecture Review Board | _________________ | Approval authority |
| Changelog Format | Keep a Changelog (keepachangelog.com) | _________________ | Changelog standard |
| Version Header Name | `API-Version` | _________________ | If header-based versioning is used |

## Versioning Strategy

### Recommended: URL Path Versioning

URL path versioning is the recommended strategy for all APIs because it is explicit, visible, cacheable, and widely understood.

**Format:**

```
https://api.{domain}/v{major}/{resource}
```

**Examples:**

```
https://api.example.com/v1/work-orders
https://api.example.com/v2/work-orders
https://api.example.com/v1/sap/materials
```

### Strategy Comparison

| Strategy | Format | Pros | Cons | Recommendation |
|----------|--------|------|------|----------------|
| URL Path | `/v1/resource` | Explicit, cacheable, simple routing | URL proliferation, breaks REST purists | **Recommended** |
| Header | `API-Version: 1` | Clean URLs, content negotiation | Not visible in logs/bookmarks, caching complexity | Acceptable for internal |
| Query Param | `?api-version=1` | Simple to add | Pollutes query string, caching issues | Not recommended |
| Media Type | `Accept: application/vnd.api.v1+json` | Pure content negotiation | Complex, low adoption | Not recommended |

### Version Number Rules

| Rule | Standard | Example |
|------|----------|---------|
| Public URL version | Major version only | `v1`, `v2` |
| Internal tracking | Semantic versioning (semver) | `1.0.0`, `1.1.0`, `2.0.0` |
| Major version increment | Breaking changes only | `v1` to `v2` |
| Minor version increment | Backward-compatible additions | `1.0.0` to `1.1.0` |
| Patch version increment | Backward-compatible bug fixes | `1.1.0` to `1.1.1` |
| Pre-release versions | Suffix with stage identifier | `2.0.0-beta.1`, `2.0.0-rc.1` |
| Starting version | Always `v1` (never `v0`) | `v1` |

### Semantic Versioning for Internal APIs

While the public URL only exposes the major version, all APIs must track changes using semantic versioning internally:

```
MAJOR.MINOR.PATCH[-PRERELEASE]

Examples:
  1.0.0       — Initial release (URL: /v1)
  1.1.0       — Added new optional field (URL: /v1, no consumer impact)
  1.1.1       — Bug fix in validation (URL: /v1, no consumer impact)
  1.2.0       — Added new endpoint (URL: /v1, no consumer impact)
  2.0.0-beta  — Breaking change in beta (URL: /v2-beta)
  2.0.0       — Breaking change released (URL: /v2)
```

## Breaking vs. Non-Breaking Changes

### Breaking Changes (Require Major Version Increment)

The following changes are considered breaking and require a new major version:

| Change Type | Example | Impact |
|-------------|---------|--------|
| Remove an endpoint | DELETE `/v1/legacy-orders` | Consumers lose access |
| Remove a response field | Remove `plant_name` from response | Consumer parsing breaks |
| Rename a response field | `plant_code` renamed to `facility_code` | Consumer parsing breaks |
| Change a field's data type | `quantity` from `integer` to `string` | Consumer deserialization breaks |
| Add a required request field | New required field `priority` | Existing requests become invalid |
| Change URL structure | `/v1/work-orders` to `/v1/manufacturing-orders` | Consumer URLs break |
| Change authentication method | API key to OAuth 2.0 | Consumer auth breaks |
| Change error response format | Custom format to RFC 7807 | Consumer error handling breaks |
| Reduce rate limits below existing tier | 1000 req/min to 100 req/min | Consumer workflows disrupted |
| Change pagination format | Offset to cursor only | Consumer pagination breaks |
| Remove an enum value | Remove `pending` from status enum | Consumer logic breaks |
| Change field semantics | `quantity` from "ordered" to "shipped" | Consumer business logic breaks |

### Non-Breaking Changes (Minor or Patch Version)

The following changes are non-breaking and do not require a new major version:

| Change Type | Example | Version Impact |
|-------------|---------|---------------|
| Add a new endpoint | New `/v1/quality-holds` | Minor increment |
| Add an optional response field | New `estimated_completion` field | Minor increment |
| Add an optional request field | New optional `notes` field | Minor increment |
| Add a new enum value | Add `on_hold` to status enum | Minor increment |
| Increase rate limits | 100 req/min to 500 req/min | Minor increment |
| Improve error messages | More descriptive error details | Patch increment |
| Fix a bug | Correct calculation logic | Patch increment |
| Performance improvement | Faster response times | Patch increment |
| Add a new query filter | New `?priority=high` filter | Minor increment |
| Add pagination support | Add pagination to existing endpoint | Minor increment |
| Relax input validation | Accept wider date formats | Minor increment |

### Gray Area — Evaluate Case-by-Case

| Change | Guidance |
|--------|----------|
| Tightening input validation | Generally breaking; consider deprecation period with warnings first |
| Adding a required header | Breaking if header was not previously sent by consumers |
| Changing default sort order | Breaking if consumers rely on implicit order; document and announce |
| Changing default page size | Breaking if consumers hardcoded pagination logic |

## Deprecation Process

### Deprecation Timeline

```
Phase 1: Announcement          Phase 2: Sunset           Phase 3: Removal
|========================|========================|===================|
  6 months minimum              3 months minimum        Immediate or
  (new version available)       (deprecated but active) scheduled removal
```

### Deprecation Phase Details

| Phase | Duration | Actions |
|-------|----------|---------|
| **1. Announcement** | 6 months minimum | Publish deprecation notice in API catalog. Add `Sunset` header to all responses. Add `Deprecation` header. Notify all registered consumers via email and developer portal. Publish migration guide. New version is available and stable. |
| **2. Sunset** | 3 months minimum | API remains functional but returns `Warning` header. API documentation marked as deprecated. New consumer onboarding blocked for deprecated version. Usage monitoring intensified. Direct consumer outreach for non-migrated consumers. |
| **3. Removal** | Scheduled date | API returns `410 Gone` with migration information. OpenAPI spec removed from developer portal. APIM routing removed. DNS/gateway entries cleaned up. Post-removal monitoring for residual traffic. |

### Deprecation Headers

All deprecated API versions must include the following headers in every response:

```http
HTTP/1.1 200 OK
Sunset: Sat, 15 Mar 2026 00:00:00 GMT
Deprecation: Thu, 15 Sep 2025 00:00:00 GMT
Link: </v2/work-orders>; rel="successor-version"
Warning: 299 - "This API version is deprecated. Migrate to v2 by 2026-03-15. See https://portal.example.com/migration/v1-to-v2"
```

| Header | RFC | Purpose |
|--------|-----|---------|
| `Sunset` | RFC 8594 | Date when the API will be removed |
| `Deprecation` | Draft RFC | Date when deprecation was announced |
| `Link` (successor) | RFC 8288 | URL of the replacement version |
| `Warning` (299) | RFC 7234 | Human-readable deprecation message |

### APIM Deprecation Policy

```xml
<outbound>
    <set-header name="Sunset" exists-action="override">
        <value>Sat, 15 Mar 2026 00:00:00 GMT</value>
    </set-header>
    <set-header name="Deprecation" exists-action="override">
        <value>Thu, 15 Sep 2025 00:00:00 GMT</value>
    </set-header>
    <set-header name="Link" exists-action="append">
        <value>&lt;/v2/work-orders&gt;; rel="successor-version"</value>
    </set-header>
    <set-header name="Warning" exists-action="override">
        <value>299 - "This API version is deprecated. Migrate to v2 by 2026-03-15."</value>
    </set-header>
</outbound>
```

### 410 Gone Response (Post-Removal)

After removal, the old version endpoint must return a helpful `410 Gone` response:

```json
{
  "type": "https://api.example.com/problems/api-removed",
  "title": "API Version Removed",
  "status": 410,
  "detail": "API v1 was removed on 2026-03-15. Please migrate to v2.",
  "instance": "/v1/work-orders",
  "migrationGuide": "https://portal.example.com/migration/v1-to-v2",
  "successorVersion": "/v2/work-orders"
}
```

## Consumer Migration Guidance

### Migration Communication Plan

| Milestone | Timing | Communication Channel | Audience |
|-----------|--------|----------------------|----------|
| Deprecation announcement | Day 0 | Email, developer portal, API catalog | All registered consumers |
| Migration guide published | Day 0 + 7 | Developer portal, documentation | All consumers |
| Monthly migration status | Monthly | Email summary | Non-migrated consumers |
| 90-day warning | 90 days before sunset | Direct email + in-person for critical consumers | Non-migrated consumers |
| 30-day warning | 30 days before sunset | Direct email, API response warning header | Non-migrated consumers |
| 7-day final warning | 7 days before sunset | Direct email, phone contact for critical | Non-migrated consumers |
| Sunset confirmation | Sunset date | Email confirmation | All consumers |

### Migration Guide Requirements

Every major version change must include a published migration guide containing:

| Section | Required Content |
|---------|-----------------|
| Change summary | List of all breaking changes with rationale |
| Endpoint mapping | Old endpoint to new endpoint mapping table |
| Field mapping | Old field names to new field names mapping table |
| Request changes | Before/after request examples |
| Response changes | Before/after response examples |
| Authentication changes | Any changes to auth flow (if applicable) |
| Error handling changes | New error codes or format changes |
| Timeline | Key dates (deprecation, sunset, removal) |
| Support contacts | Who to contact for migration assistance |
| Testing guidance | How to test against the new version (sandbox/staging) |

### Version Negotiation

When a consumer does not specify a version (if the API supports header-based negotiation as a secondary mechanism):

| Scenario | Behavior |
|----------|----------|
| No version specified | Route to latest stable version |
| Explicitly requested version exists | Route to requested version |
| Requested version is deprecated | Route to version with deprecation headers |
| Requested version is removed | Return 410 Gone with migration info |
| Requested version never existed | Return 404 Not Found |

## Multiple Active Version Management

### Maximum Active Versions

| Rule | Standard |
|------|----------|
| Maximum concurrent major versions | 2 (current + previous) |
| Exception process | Architecture Review Board approval for 3+ versions |
| Beta/RC versions | Do not count toward the maximum (separate lifecycle) |
| ERP-tied versions | May require extended support; documented exception required |

### Version Routing in APIM

```xml
<!-- APIM configuration for multiple active versions -->
<inbound>
    <choose>
        <when condition="@(context.Request.Url.Path.StartsWith("/v1/"))">
            <set-backend-service base-url="https://api-backend-v1.example.com" />
        </when>
        <when condition="@(context.Request.Url.Path.StartsWith("/v2/"))">
            <set-backend-service base-url="https://api-backend-v2.example.com" />
        </when>
        <otherwise>
            <return-response>
                <set-status code="404" reason="Not Found" />
                <set-body>{"type":"not-found","title":"API version not found","status":404}</set-body>
            </return-response>
        </otherwise>
    </choose>
</inbound>
```

## API Changelog Requirements

### Changelog Format

All APIs must maintain a changelog following the Keep a Changelog format (keepachangelog.com):

```markdown
# Changelog — Work Orders API

## [2.0.0] - 2025-09-15
### Breaking Changes
- Changed `plant_code` field from string to object with `code` and `name` properties.
- Removed deprecated `legacy_id` field from response.
- Authentication changed from API key to OAuth 2.0 only.

### Added
- New `/v2/work-orders/{id}/history` endpoint for change tracking.
- Added `estimated_completion` field to work order response.

### Migration
- See migration guide: https://portal.example.com/migration/v1-to-v2

## [1.2.0] - 2025-06-01
### Added
- Added `priority` optional field to work order creation.
- Added `?status=in:open,pending` filter operator.

### Fixed
- Corrected pagination total count for filtered queries.

## [1.1.0] - 2025-03-15
### Added
- Added cursor-based pagination support.
- Added `fields` query parameter for sparse fieldsets.

## [1.0.0] - 2025-01-15
### Added
- Initial release of Work Orders API.
- CRUD operations for work orders.
- Offset-based pagination.
- Filtering by status, plant_code, and date range.
```

### Changelog Publication

| Requirement | Standard |
|-------------|----------|
| Location | Developer portal and API catalog entry |
| Update timing | Published before or concurrent with version release |
| Format | Keep a Changelog (Markdown) |
| Granularity | Entry for every minor and major version |
| Categories | Added, Changed, Deprecated, Removed, Fixed, Security |
| Audience | All registered consumers and internal stakeholders |

## Fabric / Azure Implementation Guidance

### APIM Versioning Features

- Use APIM's built-in versioning feature to manage API versions.
- Configure version sets that group related versions.
- Use APIM revisions for non-breaking changes within a version.
- Apply version-specific policies (e.g., deprecation headers only on v1).

### APIM Revisions vs. Versions

| Concept | Purpose | Use Case |
|---------|---------|----------|
| **Version** | Major API changes | Breaking changes, new major version |
| **Revision** | Non-breaking changes within a version | Bug fixes, new optional fields, policy updates |

- Revisions allow testing changes before making them current.
- Revisions can be accessed via `?rev=2` query parameter during testing.
- Only the current revision is exposed to consumers by default.

### Fabric API Versioning Considerations

- Fabric REST APIs use their own versioning scheme — wrap with APIM for consistent versioning.
- OneLake API versions are managed by Microsoft; document which version your integration targets.
- Fabric Data Factory pipeline activities should reference specific API versions in their configurations.

## Manufacturing Overlay [CONDITIONAL]

### ERP-Specific Versioning Considerations

| Consideration | Guidance |
|---------------|----------|
| SAP S/4HANA upgrades | Major SAP upgrades may necessitate new API version if RFC/BAPI signatures change |
| Epicor version upgrades | Epicor REST API changes must be absorbed by the wrapper; expose as new version if breaking |
| Dual ERP operation | During ERP migration periods, maintain version compatibility for both systems |
| SAP custom RFC changes | Custom RFC modifications trigger API versioning review |

### IoT API Versioning

- IoT device firmware may not support rapid version migration.
- Maintain extended deprecation timelines for IoT APIs (12 months minimum announcement).
- Support at least 2 active IoT API versions to accommodate firmware update cycles.
- Use header-based version negotiation as secondary mechanism for IoT devices that cannot update URL paths.

## Cross-References

| Document | Relationship |
|----------|-------------|
| ISL-01: API Design Standards | URL structure and resource naming |
| ISL-01: API Security Standards | Authentication changes in new versions |
| ISL-01: API Lifecycle Governance | Change management and review gates |
| ISL-01: API Catalog Requirements | Version metadata in catalog |
| ISL-01: Rate Limiting Policy | Rate limit changes across versions |
| ISL-03: Naming Conventions | Version naming format |
| ISL-04: Security by Tier | Security requirement escalation across versions |

## Compliance Alignment

| Standard | Alignment |
|----------|-----------|
| RFC 8594 (Sunset Header) | Deprecation signaling in HTTP headers |
| RFC 8288 (Web Linking) | Link header for successor version |
| RFC 7234 (HTTP Caching) | Warning header for deprecation notices |
| Microsoft REST API Guidelines | URL path versioning recommendation |
| OpenAPI Specification 3.1 | Version metadata in API specification |
| Semantic Versioning 2.0 | Internal version tracking format |
| ISO 27001 (A.14.2) | Change management for secure systems |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial release |
| — | — | — | Reserved for client adaptation |

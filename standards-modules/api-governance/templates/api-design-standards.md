# API Design Standards

> Module: ISL-01 | Version: 1.0 | Adaptation Effort: 4-6 hrs | Dependencies: ISL-03, ISL-04

## Purpose

This document establishes the RESTful API design standards for all integration endpoints developed, consumed, or managed within the client environment. These standards ensure consistency, discoverability, and interoperability across all API surfaces, whether internally developed, partner-facing, or sourced from third-party platforms such as SAP, Epicor, or IoT telemetry systems.

All APIs must conform to these design principles prior to publishing in the API catalog (see ISL-01 API Catalog Requirements) and must pass design review gates defined in the API Lifecycle Governance template.

## Scope

### In Scope

- All RESTful HTTP APIs developed for internal and external consumption
- Wrapper APIs exposing legacy system functionality (SAP RFC/BAPI, Epicor BAQ)
- IoT telemetry ingestion APIs and device management endpoints
- Microsoft Fabric REST API integrations and OneLake data access patterns
- Azure API Management (APIM) hosted endpoints
- Power Platform custom connectors

### Out of Scope

- GraphQL APIs (covered under separate guidance if adopted)
- gRPC service-to-service communication (covered under ISL-07 if applicable)
- WebSocket/SignalR real-time protocols (referenced but not fully specified here)
- File transfer protocols (SFTP, AS2) covered under ISL-06

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default | Client Value | Notes |
|-----------|---------|--------------|-------|
| Base URL Pattern | `https://api.{domain}/{version}/{resource}` | _________________ | Must align with ISL-03 naming |
| API Gateway | Azure API Management (APIM) | _________________ | Primary gateway platform |
| Default Page Size | 100 | _________________ | Maximum items per page |
| Max Page Size | 1000 | _________________ | Hard upper limit |
| Default Response Format | `application/json` | _________________ | Primary content type |
| Supported Formats | JSON, JSON:API | _________________ | List all supported |
| Date/Time Format | ISO 8601 (UTC) | _________________ | `YYYY-MM-DDTHH:mm:ssZ` |
| Max Request Body Size | 10 MB | _________________ | Per-request limit |
| Max Bulk Operation Size | 100 items | _________________ | Per-batch limit |
| Async Operation Timeout | 300 seconds | _________________ | Long-running operation max |
| ERP System | SAP S/4HANA + Epicor Kinetic | _________________ | Primary ERP platforms |
| ITAR Compliance Required | No | _________________ | Yes/No |
| Manufacturing MES Platform | None | _________________ | e.g., Ignition, AVEVA |

## Resource Naming Conventions

All API resource naming must conform to ISL-03 Naming Conventions. The following rules apply specifically to API resource paths.

### URI Structure

```
https://api.{domain}/v{major}/{resource-collection}/{resource-id}/{sub-resource}
```

### Naming Rules

| Rule | Correct | Incorrect | Rationale |
|------|---------|-----------|-----------|
| Use plural nouns for collections | `/orders` | `/order` | Consistency with REST semantics |
| Use kebab-case for multi-word resources | `/purchase-orders` | `/purchaseOrders`, `/purchase_orders` | URL readability |
| Use lowercase only | `/work-orders` | `/Work-Orders`, `/WORK-ORDERS` | Case sensitivity avoidance |
| No verbs in resource paths | `/orders` (POST to create) | `/createOrder` | HTTP method conveys action |
| No trailing slashes | `/orders` | `/orders/` | Canonical URL consistency |
| No file extensions | `/orders/123` | `/orders/123.json` | Content negotiation via headers |
| Nest sub-resources logically | `/orders/123/line-items` | `/order-line-items?orderId=123` | Relationship clarity |
| Limit nesting to 3 levels | `/plants/5/lines/A/stations` | `/plants/5/lines/A/stations/1/sensors/T1/readings` | Use filtering for deep queries |

### Resource Naming Examples — Manufacturing Context

| Resource | Endpoint | Description |
|----------|----------|-------------|
| Work Orders | `/v1/work-orders` | Production work order management |
| Bill of Materials | `/v1/bills-of-materials` | BOM structure and components |
| Quality Inspections | `/v1/quality-inspections` | QC inspection records |
| Equipment | `/v1/equipment/{id}/sensors` | Equipment sensor telemetry |
| Production Runs | `/v1/production-runs` | Batch/run tracking |
| Inventory Lots | `/v1/inventory-lots` | Lot-tracked inventory |
| Shipping Notices | `/v1/advance-ship-notices` | ASN documents |
| SAP Materials | `/v1/sap/materials` | SAP material master wrapper |
| Epicor Parts | `/v1/epicor/parts` | Epicor part master wrapper |

## HTTP Methods

### Standard Method Usage

| Method | Usage | Idempotent | Safe | Request Body | Typical Status |
|--------|-------|------------|------|-------------|----------------|
| GET | Retrieve resource(s) | Yes | Yes | No | 200 OK |
| POST | Create resource / trigger action | No | No | Yes | 201 Created |
| PUT | Full resource replacement | Yes | No | Yes | 200 OK |
| PATCH | Partial resource update | No* | No | Yes | 200 OK |
| DELETE | Remove resource | Yes | No | Optional | 204 No Content |
| HEAD | Retrieve headers only | Yes | Yes | No | 200 OK |
| OPTIONS | Retrieve allowed methods | Yes | Yes | No | 204 No Content |

*PATCH may be made idempotent using JSON Merge Patch (RFC 7396) rather than JSON Patch (RFC 6902).

### Method Selection Decision Tree

1. **Retrieving data?** Use GET. Never use POST for data retrieval unless query complexity exceeds URL length limits (2048 characters).
2. **Creating a new resource?** Use POST to the collection endpoint. Return 201 with Location header.
3. **Replacing an entire resource?** Use PUT. Client must send the complete resource representation.
4. **Updating specific fields?** Use PATCH with JSON Merge Patch (`application/merge-patch+json`).
5. **Removing a resource?** Use DELETE. Return 204 No Content on success.
6. **Triggering a process/action?** Use POST to an action sub-resource (e.g., `/orders/123/submit`).

### Idempotency Requirements

All non-idempotent operations (POST, non-merge PATCH) must support the `Idempotency-Key` header pattern:

```http
POST /v1/work-orders HTTP/1.1
Content-Type: application/json
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000

{
  "material_number": "MAT-001",
  "quantity": 500,
  "plant_code": "P100"
}
```

- The server must store the idempotency key and result for a minimum of 24 hours.
- Duplicate requests with the same key must return the original response (status code and body).
- Idempotency keys must be UUID v4 format.

## HTTP Status Codes

### Success Codes (2xx)

| Code | Usage | When to Use |
|------|-------|-------------|
| 200 OK | Successful retrieval or update | GET, PUT, PATCH responses |
| 201 Created | Resource created | POST when a new resource is created; include Location header |
| 202 Accepted | Async operation initiated | Long-running operations; include status polling URL |
| 204 No Content | Successful with no body | DELETE, PUT/PATCH when no body is returned |

### Redirection Codes (3xx)

| Code | Usage | When to Use |
|------|-------|-------------|
| 301 Moved Permanently | Resource permanently relocated | API versioning migration (old version to new) |
| 304 Not Modified | Conditional GET cache hit | When ETag/If-None-Match matches |

### Client Error Codes (4xx)

| Code | Usage | When to Use |
|------|-------|-------------|
| 400 Bad Request | Malformed request syntax | Invalid JSON, missing required fields |
| 401 Unauthorized | Authentication required or failed | Missing/expired/invalid token |
| 403 Forbidden | Authenticated but insufficient permissions | Valid token but lacks required scope/role |
| 404 Not Found | Resource does not exist | Invalid resource ID or path |
| 405 Method Not Allowed | HTTP method not supported | PUT on a read-only resource; include Allow header |
| 409 Conflict | State conflict | Duplicate creation, concurrent update conflict |
| 415 Unsupported Media Type | Wrong Content-Type | Sending XML when only JSON accepted |
| 422 Unprocessable Entity | Validation failure | Syntactically correct but semantically invalid |
| 429 Too Many Requests | Rate limit exceeded | Include Retry-After header (see Rate Limiting Policy) |

### Server Error Codes (5xx)

| Code | Usage | When to Use |
|------|-------|-------------|
| 500 Internal Server Error | Unexpected server failure | Unhandled exceptions (never expose stack traces) |
| 502 Bad Gateway | Upstream service failure | SAP/Epicor backend unavailable |
| 503 Service Unavailable | Planned/unplanned downtime | Include Retry-After header |
| 504 Gateway Timeout | Upstream timeout | ERP query exceeded timeout threshold |

## Error Response Format (RFC 7807 Problem Details)

All error responses must conform to RFC 7807 Problem Details for HTTP APIs.

### Standard Error Schema

```json
{
  "type": "https://api.example.com/problems/validation-error",
  "title": "Validation Error",
  "status": 422,
  "detail": "The work order request contains invalid field values.",
  "instance": "/v1/work-orders",
  "traceId": "00-abcdef1234567890abcdef1234567890-abcdef1234567890-01",
  "timestamp": "2025-03-15T14:30:00Z",
  "errors": [
    {
      "field": "quantity",
      "code": "RANGE_EXCEEDED",
      "message": "Quantity must be between 1 and 999999.",
      "rejectedValue": -5
    },
    {
      "field": "plant_code",
      "code": "INVALID_REFERENCE",
      "message": "Plant code 'P999' does not exist in the master data.",
      "rejectedValue": "P999"
    }
  ]
}
```

### Error Response Requirements

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | URI reference identifying the problem type |
| `title` | Yes | Human-readable summary (must not change between occurrences) |
| `status` | Yes | HTTP status code (integer) |
| `detail` | Yes | Human-readable explanation specific to this occurrence |
| `instance` | Yes | URI reference identifying the specific occurrence |
| `traceId` | Yes | W3C Trace Context trace ID for correlation |
| `timestamp` | Yes | ISO 8601 timestamp of when the error occurred |
| `errors` | Conditional | Array of field-level validation errors (for 400/422) |

### Security Constraints on Error Responses

- Never expose internal stack traces, database queries, or server paths in error responses.
- Never expose internal system identifiers (SAP client numbers, database connection strings).
- Use generic messages for 500 errors: "An internal error occurred. Please contact support with trace ID: {traceId}."
- For 401/403, do not reveal whether a resource exists (avoid "you don't have access to order 123" — use "resource not found or access denied").

## Request and Response Headers

### Required Request Headers

| Header | Required For | Value/Format | Description |
|--------|-------------|--------------|-------------|
| `Authorization` | All authenticated | `Bearer {token}` | OAuth 2.0 access token |
| `Content-Type` | POST, PUT, PATCH | `application/json` | Request body format |
| `Accept` | All | `application/json` | Expected response format |
| `X-Request-ID` | All | UUID v4 | Client-generated correlation ID |
| `X-Correlation-ID` | Cross-system | UUID v4 | End-to-end business correlation |
| `Idempotency-Key` | POST, PATCH | UUID v4 | Prevents duplicate processing |

### Required Response Headers

| Header | Required For | Value/Format | Description |
|--------|-------------|--------------|-------------|
| `Content-Type` | All with body | `application/json` | Response body format |
| `X-Request-ID` | All | Echo request value | Correlation echo |
| `X-Correlation-ID` | All | Echo or generate | Cross-system tracing |
| `Location` | 201 Created | Resource URI | URL of newly created resource |
| `ETag` | GET (single) | `"version-hash"` | Concurrency control |
| `X-RateLimit-Limit` | All | Integer | Rate limit ceiling |
| `X-RateLimit-Remaining` | All | Integer | Remaining requests |
| `X-RateLimit-Reset` | All | Unix timestamp | Rate limit reset time |
| `Retry-After` | 429, 503 | Seconds or date | When to retry |
| `Sunset` | Deprecated APIs | ISO 8601 date | Deprecation date (RFC 8594) |

### Content Negotiation

The API must support content negotiation via the `Accept` header. The default response format is `application/json`.

```http
GET /v1/work-orders/123 HTTP/1.1
Accept: application/json
```

If an unsupported media type is requested, return `406 Not Acceptable` with a list of supported types.

## Pagination

All collection endpoints that may return unbounded result sets must support pagination. Three patterns are supported depending on use case.

### Offset-Based Pagination (Default)

Suitable for relatively static data sets and UI-driven browsing.

```http
GET /v1/work-orders?offset=20&limit=10
```

**Response envelope:**

```json
{
  "data": [ ... ],
  "pagination": {
    "offset": 20,
    "limit": 10,
    "totalCount": 253,
    "hasMore": true
  },
  "links": {
    "self": "/v1/work-orders?offset=20&limit=10",
    "first": "/v1/work-orders?offset=0&limit=10",
    "prev": "/v1/work-orders?offset=10&limit=10",
    "next": "/v1/work-orders?offset=30&limit=10",
    "last": "/v1/work-orders?offset=250&limit=10"
  }
}
```

### Cursor-Based Pagination (Recommended for Large/Dynamic Sets)

Suitable for feeds, event streams, and large data sets where offset-based would be inefficient.

```http
GET /v1/sensor-readings?cursor=eyJpZCI6MTAwMH0&limit=50
```

**Response envelope:**

```json
{
  "data": [ ... ],
  "pagination": {
    "limit": 50,
    "hasMore": true,
    "nextCursor": "eyJpZCI6MTA1MH0",
    "prevCursor": "eyJpZCI6OTUwfQ"
  },
  "links": {
    "self": "/v1/sensor-readings?cursor=eyJpZCI6MTAwMH0&limit=50",
    "next": "/v1/sensor-readings?cursor=eyJpZCI6MTA1MH0&limit=50"
  }
}
```

### Keyset-Based Pagination

Suitable for time-series data and audit logs. Uses a deterministic sort key.

```http
GET /v1/audit-logs?after=2025-03-15T00:00:00Z&limit=100
```

### Pagination Rules

| Rule | Requirement |
|------|-------------|
| Default page size | 100 items (configurable per client context) |
| Maximum page size | 1000 items (hard limit) |
| Page size parameter | `limit` (not `pageSize`, `per_page`, etc.) |
| Include total count | Required for offset; optional for cursor/keyset |
| Stable ordering | All paginated responses must have deterministic sort order |
| Empty pages | Return empty `data` array, not 404 |

## Filtering, Sorting, and Field Selection

### Filtering

Use query parameters for filtering. Follow a consistent pattern across all endpoints.

```http
GET /v1/work-orders?status=open&plant_code=P100&created_after=2025-01-01
```

**Filter operators (for complex filtering):**

| Operator | Query Format | Example |
|----------|-------------|---------|
| Equals | `?field=value` | `?status=open` |
| Not equals | `?field=!value` | `?status=!closed` |
| Greater than | `?field=gt:value` | `?quantity=gt:100` |
| Less than | `?field=lt:value` | `?quantity=lt:1000` |
| Greater or equal | `?field=gte:value` | `?due_date=gte:2025-01-01` |
| Less or equal | `?field=lte:value` | `?due_date=lte:2025-12-31` |
| Contains | `?field=contains:value` | `?description=contains:urgent` |
| In list | `?field=in:val1,val2` | `?status=in:open,pending` |
| Between | `?field=between:a,b` | `?quantity=between:100,500` |

### Sorting

```http
GET /v1/work-orders?sort=due_date,-priority
```

- Use comma-separated field names.
- Prefix with `-` for descending order.
- Default sort must be deterministic (typically by primary key or created timestamp).

### Field Selection (Sparse Fieldsets)

Allow consumers to request only the fields they need to reduce payload size:

```http
GET /v1/work-orders?fields=id,status,due_date,plant_code
```

- If `fields` is not specified, return the full representation.
- Invalid field names should be silently ignored (not error).
- Nested fields use dot notation: `fields=id,line_items.material_number`.

## HATEOAS (Hypermedia Links)

APIs should include relevant hypermedia links in responses to aid discoverability. Full HATEOAS compliance is recommended for public-facing APIs and optional for internal service-to-service APIs.

### Link Format

```json
{
  "id": "WO-2025-001",
  "status": "open",
  "links": {
    "self": { "href": "/v1/work-orders/WO-2025-001", "method": "GET" },
    "update": { "href": "/v1/work-orders/WO-2025-001", "method": "PATCH" },
    "submit": { "href": "/v1/work-orders/WO-2025-001/submit", "method": "POST" },
    "line-items": { "href": "/v1/work-orders/WO-2025-001/line-items", "method": "GET" },
    "plant": { "href": "/v1/plants/P100", "method": "GET" }
  }
}
```

### HATEOAS Requirements

| API Type | HATEOAS Level | Requirement |
|----------|---------------|-------------|
| External / Partner | Full | All navigable links, action links |
| Internal / Consumer-facing | Minimal | `self`, `next`/`prev` for collections |
| Service-to-Service | Optional | `self` link only if included |

## Bulk Operations

For scenarios requiring batch processing (e.g., bulk inventory updates, mass work order creation), the API must support bulk operations.

### Bulk Request Format

```http
POST /v1/work-orders/bulk HTTP/1.1
Content-Type: application/json
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000

{
  "operations": [
    { "method": "POST", "body": { "material_number": "MAT-001", "quantity": 100 } },
    { "method": "POST", "body": { "material_number": "MAT-002", "quantity": 200 } },
    { "method": "POST", "body": { "material_number": "MAT-003", "quantity": 150 } }
  ]
}
```

### Bulk Response Format

```json
{
  "results": [
    { "status": 201, "body": { "id": "WO-001", "status": "created" } },
    { "status": 201, "body": { "id": "WO-002", "status": "created" } },
    { "status": 422, "body": { "type": "...", "title": "Validation Error", "status": 422, "detail": "..." } }
  ],
  "summary": {
    "total": 3,
    "succeeded": 2,
    "failed": 1
  }
}
```

### Bulk Operation Rules

| Rule | Requirement |
|------|-------------|
| Maximum batch size | 100 items per request (configurable) |
| Atomicity | Non-atomic by default; each operation independent |
| Atomic option | Support `"atomic": true` header — all-or-nothing |
| Partial failure | Return 207 Multi-Status with per-item results |
| Idempotency | Required for all bulk operations |
| Timeout | Bulk requests must complete within 60 seconds or use async pattern |

## Asynchronous Operations (202 Accepted Pattern)

Long-running operations (report generation, large data imports, ERP sync operations) must use the async pattern.

### Async Request Flow

1. Client submits request.
2. Server returns `202 Accepted` with status endpoint.
3. Client polls status endpoint or receives webhook callback.
4. On completion, status endpoint provides result or download link.

### 202 Accepted Response

```json
{
  "operationId": "op-550e8400-e29b-41d4-a716-446655440000",
  "status": "accepted",
  "message": "SAP material sync initiated. Estimated completion: 120 seconds.",
  "links": {
    "status": { "href": "/v1/operations/op-550e8400", "method": "GET" },
    "cancel": { "href": "/v1/operations/op-550e8400/cancel", "method": "POST" }
  }
}
```

### Operation Status Response

```json
{
  "operationId": "op-550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "progress": 100,
  "createdAt": "2025-03-15T14:00:00Z",
  "completedAt": "2025-03-15T14:02:15Z",
  "result": {
    "recordsProcessed": 1500,
    "recordsSucceeded": 1498,
    "recordsFailed": 2,
    "resultUrl": "/v1/operations/op-550e8400/result"
  }
}
```

### Async Operation Statuses

| Status | Description |
|--------|-------------|
| `accepted` | Operation received, not yet started |
| `running` | Operation in progress |
| `completed` | Operation finished successfully |
| `failed` | Operation finished with errors |
| `cancelled` | Operation was cancelled by client |
| `timed_out` | Operation exceeded maximum duration |

## Health Check Endpoints

All APIs must expose health check endpoints for monitoring and orchestration.

### Standard Health Endpoints

| Endpoint | Purpose | Authentication |
|----------|---------|----------------|
| `/health` | Basic liveness check | None (public) |
| `/health/ready` | Readiness check (dependencies) | API key or internal |
| `/health/live` | Liveness probe (Kubernetes) | None (internal) |

### Health Response Format

```json
{
  "status": "healthy",
  "version": "1.2.3",
  "timestamp": "2025-03-15T14:30:00Z",
  "checks": {
    "database": { "status": "healthy", "responseTime": "12ms" },
    "sap_connection": { "status": "healthy", "responseTime": "85ms" },
    "redis_cache": { "status": "degraded", "responseTime": "250ms", "message": "High latency detected" }
  }
}
```

### Health Status Values

| Status | Meaning | HTTP Code |
|--------|---------|-----------|
| `healthy` | All systems operational | 200 |
| `degraded` | Operational with issues | 200 |
| `unhealthy` | Critical failure | 503 |

## Fabric / Azure Implementation Guidance

### Azure API Management (APIM)

- Use APIM as the centralized gateway for all APIs.
- Apply design standards via APIM policies (inbound, backend, outbound, on-error).
- Configure named values for environment-specific base URLs.
- Use APIM products to map to consumer tiers (see Rate Limiting Policy).
- Enable Application Insights integration for tracing.

### APIM Policy — Standard Headers

```xml
<inbound>
    <set-header name="X-Request-ID" exists-action="skip">
        <value>@(context.RequestId.ToString())</value>
    </set-header>
    <set-header name="X-Correlation-ID" exists-action="skip">
        <value>@(context.Request.Headers.GetValueOrDefault("X-Correlation-ID", context.RequestId.ToString()))</value>
    </set-header>
</inbound>
<outbound>
    <set-header name="X-Request-ID" exists-action="override">
        <value>@(context.Request.Headers.GetValueOrDefault("X-Request-ID", ""))</value>
    </set-header>
    <set-header name="Content-Type" exists-action="override">
        <value>application/json</value>
    </set-header>
</outbound>
```

### Microsoft Fabric Integration

- Use Fabric REST APIs via service principal authentication.
- OneLake endpoints follow ADLS Gen2 URI conventions: `https://onelake.dfs.fabric.microsoft.com/{workspace}/{lakehouse}/Files/`.
- Fabric Data Factory web activities can call external APIs — apply the same design standards to called endpoints.
- For Fabric Warehouse/Lakehouse query APIs, standard pagination patterns apply.

### Error Handling in APIM

```xml
<on-error>
    <set-status code="@((int)context.LastError.Source.StatusCode)" reason="@(context.LastError.Reason)" />
    <set-body>@{
        return new JObject(
            new JProperty("type", "https://api.example.com/problems/gateway-error"),
            new JProperty("title", context.LastError.Reason),
            new JProperty("status", (int)context.LastError.Source.StatusCode),
            new JProperty("detail", context.LastError.Message),
            new JProperty("instance", context.Request.Url.Path),
            new JProperty("traceId", context.RequestId.ToString()),
            new JProperty("timestamp", DateTime.UtcNow.ToString("o"))
        ).ToString();
    }</set-body>
</on-error>
```

## Manufacturing Overlay [CONDITIONAL]

This section applies when the client environment includes manufacturing operations, ERP systems, or IoT/OT infrastructure.

### SAP Integration API Wrappers

- Wrap SAP RFC/BAPI calls behind standard REST endpoints.
- Map SAP return structures to RFC 7807 error format.
- Translate SAP IDOC segments to JSON resource representations.
- Apply ISL-03 naming to SAP field names (e.g., `MATNR` becomes `material_number`).
- Respect SAP transaction boundaries — POST operations should map to SAP commit work units.

### Epicor REST API Alignment

- Epicor Kinetic exposes native REST APIs — wrap BAQ endpoints for standardized consumption.
- Map Epicor `odata`-style pagination to the standard offset/cursor patterns.
- Normalize Epicor error responses to RFC 7807 format.

### IoT Telemetry API Design

- High-throughput ingestion endpoints should use bulk POST operations.
- Sensor data must include ISO 8601 timestamps with millisecond precision.
- Device management APIs follow the standard CRUD pattern.
- Telemetry GET endpoints must support time-range filtering with `start_time`/`end_time` parameters.
- Consider event-driven patterns (Event Hub, Event Grid) for real-time telemetry; REST APIs serve as query/retrieval layer.

### ITAR-Compliant API Patterns

- Endpoints handling ITAR-controlled data must enforce US Person verification at the API gateway level.
- ITAR APIs must include `X-ITAR-Classification` response header.
- All ITAR API requests must be logged to an immutable audit store with 5-year retention.
- Geo-fencing: ITAR APIs must reject requests originating from embargoed countries.
- See ISL-04 Security Classification Tier 4 for additional requirements.

## Cross-References

| Document | Relationship |
|----------|-------------|
| ISL-01: API Security Standards | Authentication, authorization, and OWASP alignment |
| ISL-01: API Versioning Policy | Version numbering and deprecation |
| ISL-01: API Lifecycle Governance | Design review gates and publishing workflow |
| ISL-01: API Catalog Requirements | Metadata and registration standards |
| ISL-01: Rate Limiting Policy | Throttling headers and consumer tiers |
| ISL-03: Naming Conventions | Resource naming, field naming, URL patterns |
| ISL-04: Security by Tier | Data classification and security requirements |

## Compliance Alignment

| Standard | Alignment |
|----------|-----------|
| Microsoft REST API Guidelines | Resource naming, error format, pagination patterns |
| RFC 7807 (Problem Details) | Error response format |
| RFC 8594 (Sunset Header) | API deprecation signaling |
| RFC 7396 (JSON Merge Patch) | PATCH operation format |
| OWASP API Security Top 10 (2023) | Input validation, error disclosure, rate limiting |
| OpenAPI Specification 3.1 | API contract definition format |
| NIST SP 800-53 (AC, AU) | Access control and audit requirements |
| ISO 27001 (A.9, A.14) | Access management and system acquisition security |
| ITAR (22 CFR 120-130) | Export-controlled data API requirements |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial release |
| — | — | — | Reserved for client adaptation |

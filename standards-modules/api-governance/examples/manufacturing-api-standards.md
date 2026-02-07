# Manufacturing API Standards — Completed Example

> Module: ISL-01 | Version: 1.0 | Type: Example

## Purpose

This document provides a fully completed example of API governance standards applied to a manufacturing environment. It demonstrates how the ISL-01 API Governance templates are adapted for a discrete manufacturing company running SAP S/4HANA and Epicor Kinetic, with IoT telemetry from shop floor sensors and MES integration for production tracking.

This example covers: SAP integration APIs, Epicor REST API wrappers, IoT telemetry ingestion, MES integration, ITAR-compliant API patterns, quality inspection APIs, and production scheduling APIs.

**Client Profile:**
- Industry: Discrete manufacturing (aerospace components)
- ERP: SAP S/4HANA (primary), Epicor Kinetic (acquired division)
- MES: Ignition by Inductive Automation
- IoT: Azure IoT Hub with 2,500 sensors across 4 plants
- ITAR: Required for defense contract product lines
- API Gateway: Azure API Management (Premium tier)

## SAP Integration APIs

### SAP Material Master API

**Endpoint:** `https://api.acme-mfg.com/v1/sap/materials`

| Attribute | Value |
|-----------|-------|
| Source System | SAP S/4HANA (RFC: BAPI_MATERIAL_GETLIST, BAPI_MATERIAL_GET_DETAIL) |
| Data Classification | Tier 2 — Internal |
| Authentication | OAuth 2.0 Client Credentials |
| SLA Tier | Gold (99.95% availability, < 250ms p95) |
| Rate Limit Tier | Standard (100 req/sec) |
| Owner | SAP Integration Team (sap-integration@acme-mfg.com) |

**Endpoints:**

```
GET    /v1/sap/materials                    — List materials (paginated)
GET    /v1/sap/materials/{material_number}  — Get material detail
POST   /v1/sap/materials                    — Create material (triggers BAPI_MATERIAL_SAVEDATA)
PATCH  /v1/sap/materials/{material_number}  — Update material fields
GET    /v1/sap/materials/{material_number}/bom  — Get bill of materials
GET    /v1/sap/materials/{material_number}/stock — Get stock overview per plant
```

**Example Request — List Materials:**

```http
GET /v1/sap/materials?plant_code=1000&material_type=FERT&limit=25 HTTP/1.1
Host: api.acme-mfg.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
X-Request-ID: 7c4a8d09-ca72-4d12-8265-3f1c6a9b7e42
Accept: application/json
```

**Example Response:**

```json
{
  "data": [
    {
      "material_number": "MAT-100234",
      "description": "Titanium Bracket Assembly — P/N TB-4420",
      "material_type": "FERT",
      "material_group": "AERO-STRUCT",
      "plant_code": "1000",
      "base_unit": "EA",
      "weight": 2.45,
      "weight_unit": "KG",
      "itar_controlled": true,
      "created_date": "2023-06-15",
      "last_modified": "2025-02-28T14:30:00Z",
      "links": {
        "self": { "href": "/v1/sap/materials/MAT-100234", "method": "GET" },
        "bom": { "href": "/v1/sap/materials/MAT-100234/bom", "method": "GET" },
        "stock": { "href": "/v1/sap/materials/MAT-100234/stock", "method": "GET" }
      }
    }
  ],
  "pagination": {
    "offset": 0,
    "limit": 25,
    "totalCount": 1247,
    "hasMore": true
  },
  "links": {
    "self": "/v1/sap/materials?plant_code=1000&material_type=FERT&offset=0&limit=25",
    "next": "/v1/sap/materials?plant_code=1000&material_type=FERT&offset=25&limit=25"
  }
}
```

### SAP Work Order API

**Endpoint:** `https://api.acme-mfg.com/v1/sap/work-orders`

| Attribute | Value |
|-----------|-------|
| Source System | SAP S/4HANA (RFC: BAPI_ALM_ORDER_GET_DETAIL, CO_XT_ORDER_CREATE) |
| Data Classification | Tier 2 — Internal |
| Authentication | OAuth 2.0 Client Credentials |
| SLA Tier | Platinum (99.99% availability, < 100ms p95) |
| Rate Limit Tier | Premium (500 req/sec) |

**Endpoints:**

```
GET    /v1/sap/work-orders                         — List work orders
GET    /v1/sap/work-orders/{order_number}           — Get work order detail
POST   /v1/sap/work-orders                         — Create work order
PATCH  /v1/sap/work-orders/{order_number}           — Update work order
POST   /v1/sap/work-orders/{order_number}/release   — Release work order for production
POST   /v1/sap/work-orders/{order_number}/confirm   — Confirm work order completion
GET    /v1/sap/work-orders/{order_number}/operations — Get operations/routing steps
```

## Epicor Integration APIs

### Epicor Part Master API

**Endpoint:** `https://api.acme-mfg.com/v1/epicor/parts`

| Attribute | Value |
|-----------|-------|
| Source System | Epicor Kinetic (BAQ: zPart-GetList, REST: /api/v1/Erp.BO.PartSvc) |
| Data Classification | Tier 2 — Internal |
| Authentication | OAuth 2.0 Client Credentials |
| SLA Tier | Silver (99.9% availability, < 500ms p95) |
| Rate Limit Tier | Standard (100 req/sec) |
| Owner | Epicor Integration Team (epicor-integration@acme-mfg.com) |

**Endpoints:**

```
GET    /v1/epicor/parts                   — List parts (paginated)
GET    /v1/epicor/parts/{part_number}     — Get part detail
POST   /v1/epicor/parts                   — Create part
PATCH  /v1/epicor/parts/{part_number}     — Update part fields
GET    /v1/epicor/parts/{part_number}/revisions — Get part revisions
GET    /v1/epicor/parts/{part_number}/bom — Get bill of materials
```

**Example — Epicor Error Mapped to RFC 7807:**

```json
{
  "type": "https://api.acme-mfg.com/problems/epicor-validation-error",
  "title": "Epicor Validation Error",
  "status": 422,
  "detail": "Part number format does not match Epicor division requirements.",
  "instance": "/v1/epicor/parts",
  "traceId": "00-3f1c6a9b7e42abcdef-01",
  "timestamp": "2025-03-15T10:15:00Z",
  "errors": [
    {
      "field": "part_number",
      "code": "EPICOR_PART_FORMAT",
      "message": "Part number must follow format: DIV-XXXX-YYY where DIV is the 3-letter division code.",
      "rejectedValue": "12345"
    }
  ],
  "epicorContext": {
    "boMethod": "Erp.BO.PartSvc/Update",
    "epicorErrorCode": "Part.PartNum.InvalidFormat"
  }
}
```

### Epicor Job API (BAQ Wrapper)

**Endpoint:** `https://api.acme-mfg.com/v1/epicor/jobs`

**Endpoints:**

```
GET    /v1/epicor/jobs                        — List production jobs (BAQ: zJob-GetList)
GET    /v1/epicor/jobs/{job_number}            — Get job detail (BAQ: zJob-GetByID)
POST   /v1/epicor/jobs                        — Create job (Erp.BO.JobEntrySvc)
PATCH  /v1/epicor/jobs/{job_number}            — Update job
POST   /v1/epicor/jobs/{job_number}/release    — Release to production
GET    /v1/epicor/jobs/{job_number}/operations — Get job operations
GET    /v1/epicor/jobs/{job_number}/materials  — Get job materials
```

## IoT Telemetry APIs

### Sensor Data Ingestion API

**Endpoint:** `https://api.acme-mfg.com/v1/telemetry/readings`

| Attribute | Value |
|-----------|-------|
| Source | Azure IoT Hub (2,500 sensors across 4 plants) |
| Data Classification | Tier 2 — Internal |
| Authentication | mTLS (device certificates) + OAuth 2.0 (service-to-service) |
| SLA Tier | Platinum (99.99% availability, < 50ms p95) |
| Rate Limit | 10,000 msg/sec aggregate; 10 msg/sec per device |
| Owner | IoT Platform Team (iot-platform@acme-mfg.com) |

**Endpoints:**

```
POST   /v1/telemetry/readings                — Submit sensor reading(s)
POST   /v1/telemetry/readings/bulk           — Submit batch readings (up to 100)
GET    /v1/telemetry/readings                — Query readings (time-range required)
GET    /v1/telemetry/readings/latest/{device_id} — Get latest reading for device
```

**Example — Bulk Telemetry Submission:**

```http
POST /v1/telemetry/readings/bulk HTTP/1.1
Host: api.acme-mfg.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: application/json
X-Request-ID: a8c3d19e-ff72-4b12-9a65-2e1d6b8c4f01
Idempotency-Key: f47ac10b-58cc-4372-a567-0e02b2c3d479

{
  "readings": [
    {
      "device_id": "SENSOR-P1-L3-TEMP-001",
      "plant_code": "P100",
      "line_code": "L3",
      "sensor_type": "temperature",
      "value": 185.7,
      "unit": "fahrenheit",
      "timestamp": "2025-03-15T14:30:00.123Z",
      "quality": "good"
    },
    {
      "device_id": "SENSOR-P1-L3-VIBR-002",
      "plant_code": "P100",
      "line_code": "L3",
      "sensor_type": "vibration",
      "value": 2.3,
      "unit": "mm_per_sec",
      "timestamp": "2025-03-15T14:30:00.125Z",
      "quality": "good"
    },
    {
      "device_id": "SENSOR-P1-L3-PRES-003",
      "plant_code": "P100",
      "line_code": "L3",
      "sensor_type": "pressure",
      "value": 145.2,
      "unit": "psi",
      "timestamp": "2025-03-15T14:30:00.127Z",
      "quality": "good"
    }
  ]
}
```

### Device Management API

**Endpoint:** `https://api.acme-mfg.com/v1/devices`

```
GET    /v1/devices                           — List registered devices
GET    /v1/devices/{device_id}               — Get device details
POST   /v1/devices                           — Register new device
PATCH  /v1/devices/{device_id}               — Update device metadata
DELETE /v1/devices/{device_id}               — Decommission device
GET    /v1/devices/{device_id}/telemetry     — Get device telemetry history
POST   /v1/devices/{device_id}/commands      — Send command to device
GET    /v1/devices/{device_id}/health        — Get device health status
```

## MES Integration APIs

### Production Run API

**Endpoint:** `https://api.acme-mfg.com/v1/production-runs`

| Attribute | Value |
|-----------|-------|
| Source System | Ignition MES |
| Data Classification | Tier 2 — Internal |
| Authentication | OAuth 2.0 Client Credentials + mTLS |
| SLA Tier | Platinum (99.99% availability) |
| Rate Limit Tier | Premium (500 req/sec) |

**Endpoints:**

```
GET    /v1/production-runs                         — List production runs
GET    /v1/production-runs/{run_id}                — Get run detail
POST   /v1/production-runs                         — Start new production run
PATCH  /v1/production-runs/{run_id}                — Update run status
POST   /v1/production-runs/{run_id}/complete       — Complete production run
GET    /v1/production-runs/{run_id}/output          — Get run output/yield
GET    /v1/production-runs/{run_id}/downtime-events — Get downtime events for run
POST   /v1/production-runs/{run_id}/quality-holds   — Place run on quality hold
```

## ITAR-Compliant API Patterns

### ITAR Material API

**Endpoint:** `https://api.acme-mfg.com/v1/itar/materials`

| Attribute | Value |
|-----------|-------|
| Data Classification | Tier 4 — Restricted (ITAR) |
| Authentication | OAuth 2.0 + MFA + mTLS |
| Authorization | RBAC + ABAC (US Person verification, plant access) |
| SLA Tier | Gold |
| Rate Limit Tier | Premium (reduced: 50 req/sec) |
| TLS | TLS 1.3 mandatory |
| Geo-Restriction | US-only (APIM IP filtering) |
| Audit Logging | Full (request + response body, immutable, 5-year retention) |

**APIM Policy — ITAR Enforcement:**

```xml
<inbound>
    <!-- Verify US Person claim -->
    <validate-jwt header-name="Authorization" failed-validation-httpcode="403">
        <required-claims>
            <claim name="itar_cleared" match="all">
                <value>true</value>
            </claim>
            <claim name="country" match="all">
                <value>US</value>
            </claim>
        </required-claims>
    </validate-jwt>

    <!-- Geo-fence: US-only IP addresses -->
    <ip-filter action="allow">
        <address-range from="US-IP-START" to="US-IP-END" />
    </ip-filter>

    <!-- Add ITAR audit headers -->
    <set-header name="X-ITAR-Classification" exists-action="override">
        <value>USML Category VIII</value>
    </set-header>
    <set-header name="X-ITAR-Audit-ID" exists-action="override">
        <value>@(Guid.NewGuid().ToString())</value>
    </set-header>

    <!-- Log full request for ITAR audit -->
    <log-to-eventhub logger-id="itar-audit-logger">
        @{
            return new JObject(
                new JProperty("auditType", "ITAR_API_ACCESS"),
                new JProperty("timestamp", DateTime.UtcNow.ToString("o")),
                new JProperty("subject", context.User.Id),
                new JProperty("endpoint", context.Request.Url.Path),
                new JProperty("method", context.Request.Method),
                new JProperty("sourceIp", context.Request.IpAddress),
                new JProperty("itarClassification", "USML-VIII"),
                new JProperty("traceId", context.RequestId.ToString())
            ).ToString();
        }
    </log-to-eventhub>
</inbound>
```

**ITAR Response Headers:**

```http
HTTP/1.1 200 OK
X-ITAR-Classification: USML Category VIII
X-ITAR-Audit-ID: 9a3b5c7d-e1f2-4a5b-8c9d-0e1f2a3b4c5d
X-ITAR-Warning: This data is subject to ITAR export controls (22 CFR 120-130).
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Quality Inspection APIs

### Quality Inspection API

**Endpoint:** `https://api.acme-mfg.com/v1/quality-inspections`

**Endpoints:**

```
GET    /v1/quality-inspections                          — List inspections
GET    /v1/quality-inspections/{inspection_id}          — Get inspection detail
POST   /v1/quality-inspections                          — Create inspection record
PATCH  /v1/quality-inspections/{inspection_id}          — Update inspection
POST   /v1/quality-inspections/{inspection_id}/approve  — Approve inspection
POST   /v1/quality-inspections/{inspection_id}/reject   — Reject (create NCR)
GET    /v1/quality-inspections/{inspection_id}/measurements — Get inspection measurements
```

**Example — Quality Inspection Result:**

```json
{
  "inspection_id": "QI-2025-003421",
  "work_order": "WO-2025-001234",
  "material_number": "MAT-100234",
  "lot_number": "LOT-2025-0315-A",
  "plant_code": "P100",
  "inspection_type": "incoming",
  "status": "completed",
  "result": "conditional_accept",
  "inspector": "jsmith@acme-mfg.com",
  "inspection_date": "2025-03-15T10:30:00Z",
  "measurements": [
    {
      "characteristic": "outer_diameter",
      "nominal": 25.4,
      "tolerance_upper": 25.45,
      "tolerance_lower": 25.35,
      "actual": 25.42,
      "unit": "mm",
      "result": "pass"
    },
    {
      "characteristic": "surface_roughness",
      "nominal": 0.8,
      "tolerance_upper": 1.0,
      "tolerance_lower": 0.0,
      "actual": 0.95,
      "unit": "um_ra",
      "result": "pass_marginal"
    }
  ],
  "disposition": {
    "action": "conditional_accept",
    "conditions": ["Re-inspect surface roughness after 24hr cure"],
    "ncr_number": null,
    "approver": "quality-lead@acme-mfg.com"
  },
  "links": {
    "self": { "href": "/v1/quality-inspections/QI-2025-003421", "method": "GET" },
    "work_order": { "href": "/v1/sap/work-orders/WO-2025-001234", "method": "GET" },
    "material": { "href": "/v1/sap/materials/MAT-100234", "method": "GET" }
  }
}
```

## Production Scheduling APIs

### Schedule API

**Endpoint:** `https://api.acme-mfg.com/v1/production-schedules`

```
GET    /v1/production-schedules                          — List schedules
GET    /v1/production-schedules/{schedule_id}            — Get schedule detail
POST   /v1/production-schedules                          — Create schedule
PATCH  /v1/production-schedules/{schedule_id}            — Update schedule
POST   /v1/production-schedules/{schedule_id}/publish    — Publish schedule to shop floor
GET    /v1/production-schedules/{schedule_id}/work-orders — Get scheduled work orders
GET    /v1/production-schedules/capacity                  — Get capacity overview
```

## Security Configuration Summary

| API | Auth Method | Rate Tier | TLS | mTLS | ITAR | Audit Level |
|-----|-----------|-----------|-----|------|------|-------------|
| SAP Materials | OAuth 2.0 CC | Standard | 1.2+ | No | Per material | Standard |
| SAP Work Orders | OAuth 2.0 CC | Premium | 1.2+ | Yes | Per order | Standard |
| Epicor Parts | OAuth 2.0 CC | Standard | 1.2+ | No | No | Standard |
| Epicor Jobs | OAuth 2.0 CC | Standard | 1.2+ | No | No | Standard |
| IoT Telemetry | mTLS + OAuth | Premium | 1.2+ | Yes | No | Basic |
| IoT Devices | OAuth 2.0 CC | Standard | 1.2+ | Yes | No | Standard |
| MES Production | OAuth 2.0 CC + mTLS | Premium | 1.2+ | Yes | No | Standard |
| ITAR Materials | OAuth 2.0 + MFA + mTLS | Premium | 1.3 | Yes | Yes | Full (5yr) |
| Quality Inspections | OAuth 2.0 CC | Standard | 1.2+ | No | Per inspection | Standard |
| Production Schedules | OAuth 2.0 CC | Standard | 1.2+ | No | No | Standard |

## Cross-References

| Document | Usage in This Example |
|----------|----------------------|
| ISL-01: API Design Standards | Endpoint design, error format, pagination |
| ISL-01: API Security Standards | OAuth 2.0, mTLS, ITAR security patterns |
| ISL-01: API Versioning Policy | All APIs use URL path versioning (v1) |
| ISL-01: API Lifecycle Governance | All APIs registered and monitored |
| ISL-01: API Catalog Requirements | Catalog metadata populated for each API |
| ISL-01: Rate Limiting Policy | Per-tier rate limits applied |
| ISL-03: Naming Conventions | Resource naming, field naming |
| ISL-04: Security by Tier | Data classification driving security requirements |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial example — Acme Manufacturing |

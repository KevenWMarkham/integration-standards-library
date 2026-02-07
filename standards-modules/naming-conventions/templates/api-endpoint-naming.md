# API & Endpoint Naming Standards
> Module: ISL-03 | Version: 1.0 | Adaptation Effort: 1-2 hrs | Dependencies: ISL-01 API Governance, ISL-03 Abbreviation Dictionary

## Purpose

This standard defines naming conventions for all API endpoints, webhooks, event messages, and integration interfaces across the data platform. Consistent API naming eliminates ambiguity for consuming developers, accelerates onboarding, and enables automated API governance tooling. These conventions apply to RESTful APIs, GraphQL schemas, webhook registrations, event/message channels, and AsyncAPI specifications.

Every API surface published by the data platform — whether internal or partner-facing — must conform to these patterns. Engagement teams customize the domain and versioning sections for each client; the structural rules are non-negotiable.

**When to use this standard:**
- Designing new RESTful API endpoints for data access or ingestion
- Creating webhook registrations for event-driven integrations
- Defining event/message schemas for Event Hub, Service Bus, or Event Grid
- Building GraphQL schemas for flexible query interfaces
- Naming AsyncAPI channels for streaming integrations
- Reviewing or migrating existing API surfaces during platform modernization

**Key principles:**
- URL paths use lowercase hyphen-delimited segments (kebab-case)
- Query parameters use snake_case
- Resource names are plural nouns (collections) or singular (singletons)
- Verbs belong in HTTP methods, never in URL paths
- Versioning is explicit and mandatory
- Internal naming (webhooks, events, messages) follows snake_case with structured prefixes

---

## Scope

### In Scope
- RESTful API resource and endpoint naming
- URL structure patterns including versioning, nesting, and query parameters
- HTTP method alignment and idempotency expectations
- Webhook naming conventions
- Event and message naming for asynchronous integrations
- GraphQL type, field, query, and mutation naming
- AsyncAPI channel and operation naming
- API versioning strategies (URL path vs. header)

### Out of Scope
- API authentication and authorization mechanisms (see ISL-01 API Governance)
- Rate limiting and throttling configuration (see ISL-01 API Governance)
- Payload schema design and data types (see ISL-01 API Governance)
- Network routing and API gateway configuration (see ISL-03 Infrastructure Resource Naming)
- SDK and client library naming (language-specific, not governed here)

---

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default Value | Client Value | Notes |
|-----------|---------------|--------------|-------|
| API Base Domain | `api.{client}.com` | `[CLIENT_API_DOMAIN]` | Production API base URL |
| API Path Prefix | `/api` | `[CONFIRM_OR_OVERRIDE]` | Root path segment before version |
| Versioning Strategy | URL path (`/v1/`) | `[URL_PATH or HEADER]` | See Section 7 for tradeoffs |
| Current API Version | `v1` | `[CLIENT_CURRENT_VERSION]` | Active major version |
| Domain Segments | ISL-03 domains (mfg, fin, scm, etc.) | `[CONFIRM_OR_EXTEND]` | Used in webhook/event naming |
| Authentication Scheme | OAuth 2.0 / API Key | `[CLIENT_AUTH_SCHEME]` | Impacts header naming |
| Rate Limit Header Prefix | `X-RateLimit-` | `[CONFIRM_OR_OVERRIDE]` | Custom rate limit headers |
| GraphQL Enabled | No | `[YES_OR_NO]` | Whether GraphQL conventions apply |
| Event Broker | Azure Event Hub / Service Bus | `[CLIENT_EVENT_BROKER]` | Drives event channel naming |
| Webhook Delivery | Platform-managed | `[PLATFORM_OR_CUSTOM]` | Webhook registration model |

---

## 1. RESTful URL Structure

### 1.1 Base URL Pattern

```
https://{base_domain}/api/v{major_version}/{resource}
```

| Segment | Convention | Example |
|---------|-----------|---------|
| Protocol | Always HTTPS | `https://` |
| Base domain | Lowercase, hyphen-delimited | `api.contoso-mfg.com` |
| Path prefix | `/api` (fixed) | `/api` |
| Version | `/v{major}` — integer, no minor/patch | `/v1`, `/v2` |
| Resource | Plural noun, lowercase, hyphen-delimited | `/work-orders`, `/production-lines` |
| Resource ID | Path parameter after resource | `/work-orders/{work_order_id}` |
| Sub-resource | Nested plural noun under parent ID | `/work-orders/{work_order_id}/operations` |

### 1.2 URL Hierarchy Rules

| Level | Pattern | Example |
|-------|---------|---------|
| Collection | `/{resource}` | `/api/v1/work-orders` |
| Singleton | `/{resource}/{id}` | `/api/v1/work-orders/wo-20250115-001` |
| Sub-collection | `/{resource}/{id}/{sub-resource}` | `/api/v1/work-orders/wo-20250115-001/operations` |
| Sub-singleton | `/{resource}/{id}/{sub-resource}/{sub_id}` | `/api/v1/work-orders/wo-20250115-001/operations/10` |
| Maximum nesting | 3 levels deep (resource/id/sub/id/sub) | Beyond 3 levels, flatten or use query filters |

### 1.3 Resource Naming Rules

| Rule | Correct | Incorrect | Rationale |
|------|---------|-----------|-----------|
| Plural nouns for collections | `/customers` | `/customer` | Collections are inherently plural |
| Singular for singleton resources | `/customers/{id}/profile` | `/customers/{id}/profiles` | One profile per customer |
| Lowercase only | `/work-orders` | `/Work-Orders`, `/WorkOrders` | Case sensitivity causes bugs |
| Hyphens for multi-word resources | `/work-orders` | `/work_orders`, `/workorders` | Hyphens are the URL standard (RFC 3986) |
| No trailing slashes | `/customers` | `/customers/` | Trailing slashes create duplicate routes |
| No file extensions | `/customers` | `/customers.json` | Content negotiation uses Accept headers |
| No verbs in paths | `/work-orders` | `/get-work-orders` | HTTP method provides the verb |
| Business terms, not system codes | `/materials` | `/mara-records` | API consumers are not SAP consultants |

---

## 2. HTTP Method Alignment

### 2.1 Method-to-Operation Mapping

| HTTP Method | Operation | Idempotent | Request Body | Success Code | Example |
|-------------|-----------|------------|-------------|-------------|---------|
| `GET` | Read / Retrieve | Yes | No | `200 OK` | `GET /api/v1/work-orders` |
| `POST` | Create | No | Yes | `201 Created` | `POST /api/v1/work-orders` |
| `PUT` | Replace (full) | Yes | Yes | `200 OK` | `PUT /api/v1/work-orders/{id}` |
| `PATCH` | Update (partial) | No | Yes (partial) | `200 OK` | `PATCH /api/v1/work-orders/{id}` |
| `DELETE` | Remove | Yes | No | `204 No Content` | `DELETE /api/v1/work-orders/{id}` |
| `HEAD` | Check existence | Yes | No | `200 OK` | `HEAD /api/v1/work-orders/{id}` |
| `OPTIONS` | Discover methods | Yes | No | `204 No Content` | `OPTIONS /api/v1/work-orders` |

### 2.2 Collection vs. Singleton Operations

| Operation | Method + Path | Description |
|-----------|--------------|-------------|
| List all | `GET /work-orders` | Returns paginated collection |
| Create one | `POST /work-orders` | Creates a single resource |
| Get one | `GET /work-orders/{id}` | Returns a single resource |
| Replace one | `PUT /work-orders/{id}` | Full replacement of a resource |
| Update one | `PATCH /work-orders/{id}` | Partial update of a resource |
| Delete one | `DELETE /work-orders/{id}` | Removes a single resource |
| Bulk create | `POST /work-orders/batch` | Creates multiple resources |
| Bulk delete | `POST /work-orders/batch-delete` | Removes multiple resources (POST, not DELETE, because body is required) |

### 2.3 Action Endpoints (RPC-Style Exceptions)

Some operations do not map cleanly to CRUD. Use a verb sub-resource **only** for these cases:

| Pattern | Example | When to Use |
|---------|---------|-------------|
| `POST /{resource}/{id}/{action}` | `POST /work-orders/{id}/release` | State transitions |
| `POST /{resource}/{id}/{action}` | `POST /work-orders/{id}/close` | Lifecycle events |
| `POST /{resource}/{id}/{action}` | `POST /inspections/{id}/approve` | Approval workflows |
| `POST /{resource}/{action}` | `POST /reports/generate` | Asynchronous operations |
| `POST /{resource}/{id}/{action}` | `POST /shipments/{id}/cancel` | Cancellation |

**Rule:** Action endpoints always use `POST`. The action verb appears as the **final** path segment. Limit action endpoints to state transitions and operations that cannot be expressed as resource creation or update.

---

## 3. Query Parameter Conventions

### 3.1 Query Parameter Naming

| Rule | Convention | Example |
|------|-----------|---------|
| Case | snake_case | `?order_status=open` |
| Multi-word | Underscore-delimited | `?created_after=2025-01-01` |
| Boolean | Positive phrasing, no `is_` prefix in query params | `?active=true` |
| Arrays | Comma-separated or repeated key | `?status=open,closed` or `?status=open&status=closed` |
| Nested filters | Dot notation | `?filter.plant_code=P001` |

### 3.2 Standard Query Parameters

| Parameter | Purpose | Type | Example |
|-----------|---------|------|---------|
| `page` | Page number (1-based) | integer | `?page=2` |
| `limit` | Items per page (max 100) | integer | `?limit=25` |
| `offset` | Number of items to skip | integer | `?offset=50` |
| `sort` | Sort field(s), prefix `-` for descending | string | `?sort=-created_at,name` |
| `fields` | Sparse fieldset (selected fields only) | string | `?fields=id,name,status` |
| `filter` | General filter prefix | string | `?filter[status]=open` |
| `search` | Full-text search term | string | `?search=bearing+assembly` |
| `expand` | Include related resources inline | string | `?expand=operations,materials` |
| `created_after` | Filter by creation date (lower bound) | ISO 8601 | `?created_after=2025-01-01T00:00:00Z` |
| `created_before` | Filter by creation date (upper bound) | ISO 8601 | `?created_before=2025-12-31T23:59:59Z` |
| `updated_since` | Filter by last modification date | ISO 8601 | `?updated_since=2025-06-01T00:00:00Z` |
| `status` | Filter by resource status | string | `?status=active` |
| `domain` | Filter by business domain | string | `?domain=mfg` |
| `include_deleted` | Include soft-deleted resources | boolean | `?include_deleted=true` |

### 3.3 Pagination Response Envelope

```json
{
  "data": [ ],
  "pagination": {
    "page": 2,
    "limit": 25,
    "total_count": 342,
    "total_pages": 14,
    "has_next": true,
    "has_previous": true
  },
  "links": {
    "self": "/api/v1/work-orders?page=2&limit=25",
    "first": "/api/v1/work-orders?page=1&limit=25",
    "last": "/api/v1/work-orders?page=14&limit=25",
    "next": "/api/v1/work-orders?page=3&limit=25",
    "previous": "/api/v1/work-orders?page=1&limit=25"
  }
}
```

---

## 4. Webhook Naming Conventions

### 4.1 Webhook Registration Name Pattern

```
wh_{source}_{event}_{version}
```

| Segment | Convention | Example Values |
|---------|-----------|---------------|
| `wh_` | Fixed prefix | Always `wh_` |
| `{source}` | Source system or domain abbreviation (from ISL-03 abbreviation dictionary) | `sap`, `epic`, `iot`, `mfg`, `fin` |
| `{event}` | Event descriptor in snake_case | `work_order_created`, `inspection_completed` |
| `{version}` | Version identifier | `v1`, `v2` |

### 4.2 Webhook Examples

| Webhook Name | Source | Event | Description |
|-------------|--------|-------|-------------|
| `wh_sap_work_order_created_v1` | SAP | Work order creation | Fires when a new work order is created in SAP PP |
| `wh_sap_work_order_status_changed_v1` | SAP | Work order status change | Fires on status transitions (REL, TECO, CLSD) |
| `wh_sap_material_master_updated_v1` | SAP | Material master update | Fires when material master data changes |
| `wh_sap_goods_receipt_posted_v1` | SAP | Goods receipt posting | Fires when GR is posted against a PO |
| `wh_epic_job_released_v1` | Epicor | Job release | Fires when a job is released to production |
| `wh_epic_part_created_v1` | Epicor | Part creation | Fires when a new part is added to the master |
| `wh_iot_threshold_breached_v1` | IoT | Threshold breach | Fires when a sensor reading exceeds threshold |
| `wh_iot_device_offline_v1` | IoT | Device offline | Fires when a device stops reporting |
| `wh_qms_inspection_completed_v1` | QMS | Inspection complete | Fires when a quality inspection is finalized |
| `wh_qms_ncr_created_v1` | QMS | NCR creation | Fires when a non-conformance report is opened |
| `wh_fin_invoice_approved_v1` | Finance | Invoice approval | Fires when an invoice passes approval workflow |
| `wh_scm_purchase_order_confirmed_v1` | SCM | PO confirmation | Fires when a purchase order is confirmed by vendor |

### 4.3 Webhook URL Callback Pattern

```
https://{base_domain}/api/v1/webhooks/{webhook_name}/callback
```

Example: `https://api.contoso-mfg.com/api/v1/webhooks/wh_sap_work_order_created_v1/callback`

---

## 5. Event & Message Naming Conventions

### 5.1 Event Name Pattern

```
evt_{domain}_{entity}_{action}
```

| Segment | Convention | Example Values |
|---------|-----------|---------------|
| `evt_` | Fixed prefix for events | Always `evt_` |
| `{domain}` | Business domain abbreviation | `mfg`, `fin`, `scm`, `qms`, `sal` |
| `{entity}` | Business entity in snake_case | `work_order`, `material`, `customer` |
| `{action}` | Past-tense verb describing what happened | `created`, `updated`, `deleted`, `released`, `completed` |

### 5.2 Event Examples

| Event Name | Domain | Entity | Action | Description |
|-----------|--------|--------|--------|-------------|
| `evt_mfg_work_order_created` | Manufacturing | Work Order | Created | New work order created |
| `evt_mfg_work_order_released` | Manufacturing | Work Order | Released | Work order released to production |
| `evt_mfg_work_order_completed` | Manufacturing | Work Order | Completed | Work order marked complete |
| `evt_mfg_production_output_recorded` | Manufacturing | Production Output | Recorded | Production quantities confirmed |
| `evt_mfg_equipment_downtime_started` | Manufacturing | Equipment Downtime | Started | Equipment went offline |
| `evt_mfg_equipment_downtime_ended` | Manufacturing | Equipment Downtime | Ended | Equipment back online |
| `evt_scm_purchase_order_created` | Supply Chain | Purchase Order | Created | New PO issued |
| `evt_scm_goods_receipt_posted` | Supply Chain | Goods Receipt | Posted | Inventory received |
| `evt_scm_inventory_adjusted` | Supply Chain | Inventory | Adjusted | Stock adjustment posted |
| `evt_fin_invoice_posted` | Finance | Invoice | Posted | Invoice posted to GL |
| `evt_fin_payment_received` | Finance | Payment | Received | Payment received from customer |
| `evt_qms_inspection_failed` | Quality | Inspection | Failed | Inspection did not pass criteria |
| `evt_qms_ncr_opened` | Quality | NCR | Opened | Non-conformance report created |
| `evt_sal_sales_order_placed` | Sales | Sales Order | Placed | New customer order received |
| `evt_sal_shipment_dispatched` | Sales | Shipment | Dispatched | Order shipped to customer |
| `evt_iot_sensor_threshold_breached` | IoT | Sensor | Threshold Breached | Reading exceeded configured limit |

### 5.3 Message Queue / Topic Naming

| Broker | Naming Pattern | Example |
|--------|---------------|---------|
| Azure Event Hub | `evh-{domain}-{entity}-{env}` | `evh-mfg-work-order-prd` |
| Azure Service Bus Topic | `sbt-{domain}-{entity}-{action}` | `sbt-mfg-work-order-created` |
| Azure Service Bus Queue | `sbq-{domain}-{purpose}-{env}` | `sbq-scm-po-processing-prd` |
| Azure Service Bus Subscription | `sbs-{consumer}-{filter}` | `sbs-analytics-all-events` |
| Azure Event Grid Topic | `egt-{domain}-{scope}-{env}` | `egt-mfg-shop-floor-prd` |
| Azure Event Grid Subscription | `egs-{consumer}-{filter}` | `egs-lakehouse-bronze-ingest` |

---

## 6. GraphQL Naming Conventions

### 6.1 Type System Naming

| Element | Case Convention | Example |
|---------|----------------|---------|
| Object types | PascalCase | `WorkOrder`, `ProductionLine`, `Material` |
| Input types | PascalCase with `Input` suffix | `CreateWorkOrderInput`, `UpdateMaterialInput` |
| Enum types | PascalCase | `WorkOrderStatus`, `InspectionResult` |
| Enum values | SCREAMING_SNAKE_CASE | `IN_PROGRESS`, `COMPLETED`, `ON_HOLD` |
| Interface types | PascalCase with `able` suffix or descriptive | `Trackable`, `Auditable`, `Node` |
| Union types | PascalCase | `SearchResult`, `TimelineEvent` |
| Scalar types | PascalCase | `DateTime`, `EmailAddress`, `URL` |

### 6.2 Field Naming

| Element | Case Convention | Example |
|---------|----------------|---------|
| Object fields | camelCase | `workOrderId`, `productName`, `createdAt` |
| Arguments | camelCase | `first`, `after`, `filterBy`, `sortOrder` |
| Connection fields | camelCase with `Connection` suffix | `workOrdersConnection` |
| Edge fields | Standard: `node`, `cursor` | `node`, `cursor` |
| Boolean fields | Prefixed with `is`, `has`, `can` | `isActive`, `hasOperations`, `canEdit` |

### 6.3 Query and Mutation Naming

| Operation | Pattern | Example |
|-----------|---------|---------|
| Get single | `{entity}` (camelCase) | `workOrder(id: ID!)` |
| Get list | `{entities}` (camelCase, plural) | `workOrders(first: Int, after: String)` |
| Create | `create{Entity}` | `createWorkOrder(input: CreateWorkOrderInput!)` |
| Update | `update{Entity}` | `updateWorkOrder(id: ID!, input: UpdateWorkOrderInput!)` |
| Delete | `delete{Entity}` | `deleteWorkOrder(id: ID!)` |
| Custom action | `{verb}{Entity}` | `releaseWorkOrder(id: ID!)`, `approveInspection(id: ID!)` |
| Bulk operation | `{verb}{Entities}` | `deleteWorkOrders(ids: [ID!]!)` |

### 6.4 Subscription Naming

| Operation | Pattern | Example |
|-----------|---------|---------|
| Entity created | `on{Entity}Created` | `onWorkOrderCreated` |
| Entity updated | `on{Entity}Updated` | `onWorkOrderUpdated` |
| Custom event | `on{Event}` | `onThresholdBreached`, `onProductionComplete` |

---

## 7. API Versioning Strategy

### 7.1 URL Path Versioning (Default)

```
/api/v{major}/{resource}
```

| Aspect | Specification |
|--------|--------------|
| Version segment | `/v1`, `/v2` — major version only |
| Placement | After `/api`, before resource path |
| Incrementing | Major version increments on breaking changes only |
| Parallel support | Maximum 2 concurrent major versions (current + previous) |
| Deprecation window | Minimum 6 months notice before retiring a version |

**Advantages:** Explicit, easily discoverable, simple routing, cache-friendly.

### 7.2 Header Versioning (Alternative)

```
Accept: application/vnd.{client}.v{major}+json
```

Example: `Accept: application/vnd.contoso.v1+json`

| Aspect | Specification |
|--------|--------------|
| Header | `Accept` with vendor media type |
| Default | If no version header is sent, use latest stable version |
| Placement | In request headers, not URL |

**Advantages:** Clean URLs, more RESTful in theory. **Disadvantages:** Harder to discover, cannot be bookmarked, complicates caching.

### 7.3 Version Selection Guidance

| Criterion | URL Path Versioning | Header Versioning |
|-----------|-------------------|-------------------|
| Developer experience | Easier to understand and test | Requires header tooling knowledge |
| API gateway routing | Simple path-based routing | Requires header inspection |
| Browser testability | Can test in browser address bar | Requires API client (Postman, curl) |
| Caching | Path-based cache keys work naturally | Requires Vary header configuration |
| Recommendation | **Default choice for data platform APIs** | Consider only for mature API programs |

---

## 8. AsyncAPI Channel Naming

### 8.1 Channel Name Pattern

```
{domain}/{entity}/{action}/{version}
```

| Segment | Convention | Example |
|---------|-----------|---------|
| Domain | Lowercase domain abbreviation | `mfg`, `scm`, `fin` |
| Entity | Lowercase hyphen-delimited entity | `work-order`, `purchase-order` |
| Action | Past-tense verb, lowercase | `created`, `updated`, `released` |
| Version | `v{major}` | `v1` |

### 8.2 AsyncAPI Channel Examples

| Channel | Protocol | Description |
|---------|----------|-------------|
| `mfg/work-order/created/v1` | AMQP | Work order creation events |
| `mfg/work-order/released/v1` | AMQP | Work order release events |
| `mfg/production-output/recorded/v1` | AMQP | Production output confirmations |
| `scm/purchase-order/approved/v1` | AMQP | PO approval events |
| `scm/goods-receipt/posted/v1` | AMQP | Goods receipt postings |
| `fin/invoice/posted/v1` | AMQP | Invoice posting events |
| `iot/sensor-reading/received/v1` | MQTT | Raw sensor telemetry |
| `iot/alert/triggered/v1` | MQTT | Threshold alert events |
| `qms/inspection/completed/v1` | AMQP | Inspection completion events |

---

## 9. Concrete API Endpoint Examples

### 9.1 Manufacturing Domain API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/work-orders` | List all work orders with pagination |
| `POST` | `/api/v1/work-orders` | Create a new work order |
| `GET` | `/api/v1/work-orders/{id}` | Get a specific work order |
| `PATCH` | `/api/v1/work-orders/{id}` | Update work order fields |
| `DELETE` | `/api/v1/work-orders/{id}` | Cancel/delete a work order |
| `POST` | `/api/v1/work-orders/{id}/release` | Release work order to production |
| `POST` | `/api/v1/work-orders/{id}/close` | Close a completed work order |
| `GET` | `/api/v1/work-orders/{id}/operations` | List operations for a work order |
| `POST` | `/api/v1/work-orders/{id}/operations` | Add an operation to a work order |
| `GET` | `/api/v1/work-orders/{id}/operations/{op_id}` | Get a specific operation |
| `PATCH` | `/api/v1/work-orders/{id}/operations/{op_id}` | Update an operation |
| `GET` | `/api/v1/work-orders/{id}/materials` | List material requirements |
| `GET` | `/api/v1/production-lines` | List production lines |
| `GET` | `/api/v1/production-lines/{id}/output` | Get output for a production line |
| `POST` | `/api/v1/production-output` | Record production output |
| `GET` | `/api/v1/equipment` | List equipment/assets |
| `GET` | `/api/v1/equipment/{id}/downtime-events` | Get downtime events for equipment |
| `POST` | `/api/v1/equipment/{id}/downtime-events` | Record a downtime event |
| `GET` | `/api/v1/oee-metrics?line_id={id}&date={date}` | Get OEE metrics filtered by line and date |

### 9.2 Supply Chain Domain API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/purchase-orders` | List purchase orders |
| `POST` | `/api/v1/purchase-orders` | Create a purchase order |
| `GET` | `/api/v1/purchase-orders/{id}` | Get a specific purchase order |
| `GET` | `/api/v1/purchase-orders/{id}/line-items` | List PO line items |
| `POST` | `/api/v1/purchase-orders/{id}/approve` | Approve a purchase order |
| `GET` | `/api/v1/materials` | List materials |
| `GET` | `/api/v1/materials/{id}` | Get material details |
| `GET` | `/api/v1/materials/{id}/inventory-levels` | Get current inventory for a material |
| `GET` | `/api/v1/inventory-movements?material_id={id}&date_from={date}` | List inventory transactions |
| `POST` | `/api/v1/goods-receipts` | Post a goods receipt |
| `GET` | `/api/v1/vendors` | List vendors |
| `GET` | `/api/v1/vendors/{id}/scorecards` | Get vendor performance scorecards |

### 9.3 Quality Management Domain API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/inspections` | List inspections |
| `POST` | `/api/v1/inspections` | Create an inspection |
| `GET` | `/api/v1/inspections/{id}` | Get inspection details |
| `POST` | `/api/v1/inspections/{id}/approve` | Approve an inspection |
| `POST` | `/api/v1/inspections/{id}/reject` | Reject an inspection |
| `GET` | `/api/v1/inspections/{id}/measurements` | List inspection measurements |
| `POST` | `/api/v1/inspections/{id}/measurements` | Record a measurement |
| `GET` | `/api/v1/non-conformance-reports` | List NCRs |
| `POST` | `/api/v1/non-conformance-reports` | Create an NCR |
| `POST` | `/api/v1/non-conformance-reports/{id}/close` | Close an NCR |

### 9.4 Finance Domain API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/invoices` | List invoices |
| `GET` | `/api/v1/invoices/{id}` | Get invoice details |
| `POST` | `/api/v1/invoices/{id}/approve` | Approve an invoice |
| `GET` | `/api/v1/cost-centers` | List cost centers |
| `GET` | `/api/v1/gl-postings?period={period}&cost_center={cc}` | Query GL postings |

---

## 10. Anti-Patterns and Prohibited Patterns

| Anti-Pattern | Example (Wrong) | Why It Is Wrong | Correct Alternative |
|-------------|----------------|-----------------|-------------------|
| Verbs in URL paths | `GET /api/v1/getWorkOrders` | HTTP method already provides the verb | `GET /api/v1/work-orders` |
| Singular collection names | `GET /api/v1/work-order` | Collections are plural | `GET /api/v1/work-orders` |
| CamelCase in URLs | `/api/v1/workOrders` | URLs are case-insensitive by convention; mixed case causes confusion | `/api/v1/work-orders` |
| Underscores in URL paths | `/api/v1/work_orders` | URL paths use hyphens, not underscores | `/api/v1/work-orders` |
| Trailing slashes | `/api/v1/work-orders/` | Creates duplicate routes, SEO issues | `/api/v1/work-orders` |
| File extensions in URLs | `/api/v1/work-orders.json` | Content negotiation uses Accept header | `/api/v1/work-orders` |
| Deeply nested resources (4+) | `/api/v1/plants/{id}/lines/{id}/stations/{id}/sensors/{id}/readings` | Unreadable, tight coupling | Flatten: `/api/v1/sensor-readings?station_id={id}` |
| CRUD in URL | `POST /api/v1/work-orders/create` | `POST` already means create | `POST /api/v1/work-orders` |
| Mixed pluralization | `/api/v1/work-orders/{id}/material` (singular sub-resource for collection) | Inconsistent | `/api/v1/work-orders/{id}/materials` |
| Version in query params | `/api/work-orders?version=1` | Version is structural, not a filter | `/api/v1/work-orders` |
| PascalCase query params | `?OrderStatus=open` | Query params must be snake_case | `?order_status=open` |
| Exposing database IDs | `/api/v1/work-orders/47382` (auto-increment) | Security risk, leaks volume info | Use business keys or UUIDs |
| No versioning | `/api/work-orders` | Breaking changes cannot be managed | `/api/v1/work-orders` |
| HTTP method misuse | `GET /api/v1/work-orders/{id}/delete` | GET must be safe and idempotent | `DELETE /api/v1/work-orders/{id}` |
| Inconsistent webhook names | `webhook_sap_wo_create`, `wh-SAP-WO-Created` | No standard structure | `wh_sap_work_order_created_v1` |
| Inconsistent event names | `MfgWorkOrderCreated`, `mfg.wo.created` | No standard structure | `evt_mfg_work_order_created` |
| Abbreviations in URL paths | `/api/v1/wo` | URL paths should be readable | `/api/v1/work-orders` |
| Generic resource names | `/api/v1/data`, `/api/v1/items` | Not self-documenting | Use specific business entities |

---

## 11. Response Header Naming

### 11.1 Standard Response Headers

| Header | Purpose | Example Value |
|--------|---------|--------------|
| `X-Request-Id` | Unique request correlation ID | `req-a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| `X-Correlation-Id` | End-to-end trace correlation | `corr-f8e7d6c5-b4a3-2190-fedc-ba0987654321` |
| `X-RateLimit-Limit` | Rate limit ceiling | `1000` |
| `X-RateLimit-Remaining` | Remaining requests in window | `847` |
| `X-RateLimit-Reset` | Window reset timestamp (epoch) | `1705430400` |
| `X-Total-Count` | Total items matching query | `342` |
| `X-Api-Version` | API version served | `v1` |

### 11.2 Custom Header Naming Rules

| Rule | Convention |
|------|-----------|
| Prefix | `X-{ClientPrefix}-` for client-specific headers |
| Case | PascalCase with hyphens (HTTP convention) |
| No underscores | Headers use hyphens, not underscores |
| Limit custom headers | Maximum 5 custom headers per response |

---

## Fabric / Azure Implementation Guidance

### API Management (APIM) Naming

| Component | Pattern | Example |
|-----------|---------|---------|
| APIM instance | `apim-{workload}-{domain}-{env}-{region}-{instance}` | `apim-data-mfg-prd-eus-001` |
| API name in APIM | `{domain}-{entity}-api-{version}` | `mfg-work-orders-api-v1` |
| API operation ID | `{method}_{entity}_{qualifier}` | `get_work_orders`, `post_work_order_release` |
| Product name | `{audience}-{domain}-{tier}` | `internal-mfg-standard`, `partner-scm-premium` |
| Named value | `nv-{purpose}-{qualifier}` | `nv-backend-url-mfg-prd` |
| Policy fragment | `pf-{purpose}` | `pf-jwt-validation`, `pf-rate-limit-standard` |

### Function App API Naming

| Component | Pattern | Example |
|-----------|---------|---------|
| Function App | `func-{workload}-{domain}-{env}-{region}-{instance}` | `func-api-mfg-prd-eus-001` |
| HTTP trigger function | `{http_method}_{entity}_{action}` | `get_work_orders`, `post_production_output` |
| Timer trigger function | `timer_{domain}_{purpose}` | `timer_mfg_sync_daily` |
| Event trigger function | `evt_{domain}_{entity}_{action}` | `evt_mfg_work_order_created` |

### Event Hub / Service Bus Naming

| Component | Pattern | Example |
|-----------|---------|---------|
| Event Hub namespace | `evhns-{workload}-{domain}-{env}-{region}-{instance}` | `evhns-data-mfg-prd-eus-001` |
| Event Hub instance | `evh-{domain}-{entity}-{env}` | `evh-mfg-work-order-prd` |
| Consumer group | `cg-{consumer}-{purpose}` | `cg-lakehouse-bronze-ingest` |
| Service Bus namespace | `sbns-{workload}-{domain}-{env}-{region}-{instance}` | `sbns-integ-mfg-prd-eus-001` |
| Service Bus topic | `sbt-{domain}-{entity}-{action}` | `sbt-mfg-work-order-created` |
| Service Bus queue | `sbq-{domain}-{purpose}-{env}` | `sbq-scm-po-processing-prd` |

---

## Manufacturing Overlay

### Shop Floor API Considerations

Manufacturing APIs often have additional requirements due to real-time shop floor integration:

| Concern | Standard | Example |
|---------|----------|---------|
| Real-time sensor data | Use streaming endpoints or WebSocket naming | `wss://api.contoso-mfg.com/v1/streams/sensor-readings` |
| OPC-UA integration | Event naming includes equipment hierarchy | `evt_iot_line_{line_id}_station_{station_id}_reading` |
| SCADA webhook | Source indicates SCADA system | `wh_scada_plc_alarm_triggered_v1` |
| MES integration | Bi-directional API for work order dispatch | `POST /api/v1/work-orders/{id}/dispatch-to-mes` |
| Production confirmations | Batch confirmation endpoint | `POST /api/v1/production-confirmations/batch` |
| OEE data exposure | Calculated metric endpoints | `GET /api/v1/oee-metrics?line_id={id}&shift={shift}` |

### ITAR/Export Control API Naming

For defense and regulated manufacturing, API endpoints handling controlled data include classification markers in metadata headers (not in URLs):

| Header | Purpose | Example |
|--------|---------|---------|
| `X-Data-Classification` | Data sensitivity level | `itar`, `ear`, `cui`, `public` |
| `X-Export-Control` | Export control indicator | `true` |
| `X-Access-Jurisdiction` | Jurisdiction requirement | `us-persons-only` |

**Rule:** Classification markers appear in response headers, never in URL paths. URL paths remain clean and business-oriented.

---

## Cross-References

| Reference | Module | Relevance |
|-----------|--------|-----------|
| API Governance Standards | ISL-01 `templates/api-design-standards.md` | API design patterns, authentication, error handling |
| API Versioning Policy | ISL-01 `templates/api-versioning-policy.md` | Deprecation timelines, backward compatibility |
| Abbreviation Dictionary | ISL-03 `templates/abbreviation-dictionary.md` | Domain, entity, and system abbreviations used in webhook/event names |
| Infrastructure Resource Naming | ISL-03 `templates/infrastructure-resource-naming.md` | APIM, Function App, Event Hub resource naming |
| Database & Schema Naming | ISL-03 `templates/database-schema-naming.md` | Schema names that back API resources |
| Table & View Naming | ISL-03 `templates/table-view-naming.md` | Table names that API endpoints expose |
| Integration Pattern Library | ISL-05 `templates/pattern-catalog.md` | Integration patterns that use these API naming conventions |
| Data Classification | ISL-04 `templates/classification-tier-definitions.md` | Classification levels used in API headers |

---

## Compliance Alignment

| Standard | Relevance | How This Template Aligns |
|----------|-----------|--------------------------|
| Azure API Management Best Practices | API naming in APIM | Sections 9, Fabric/Azure guidance adopt APIM naming conventions |
| OpenAPI Specification 3.x | RESTful API documentation | Endpoint patterns align with OAS path and operation conventions |
| AsyncAPI Specification 2.x | Event-driven API documentation | Section 8 follows AsyncAPI channel naming structure |
| Microsoft REST API Guidelines | Enterprise REST conventions | Sections 1-3 align with Microsoft's published REST guidelines |
| RFC 3986 | URI syntax | URL structure follows RFC 3986 (lowercase, hyphens, no trailing slash) |
| OWASP API Security Top 10 | Secure API design | Anti-patterns address security concerns (exposed DB IDs, method misuse) |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | ISL Architecture Team | Initial release — comprehensive API & endpoint naming standards |

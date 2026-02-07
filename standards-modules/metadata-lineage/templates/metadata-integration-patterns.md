# Metadata Integration Patterns

> Module: ISL-02 | Version: 1.0 | Adaptation Effort: 4-8 hrs | Dependencies: ISL-03, ISL-04, ISL-05

## Purpose

This document defines the standard patterns for integrating metadata across multiple platforms, tools, and repositories within the enterprise data estate. As organizations typically operate multiple metadata-producing systems (catalogs, ETL tools, BI platforms, ERPs), a coherent integration strategy is essential to avoid metadata silos, resolve conflicts, and maintain a single source of truth for metadata.

These patterns cover connector configuration, synchronization schedules, conflict resolution, API-based metadata exchange, event-driven metadata updates, and bi-directional metadata flows between platforms such as Microsoft Purview, Collibra, Alation, and custom metadata stores.

## Scope

### In Scope

- Purview connector configuration for all supported data sources
- Third-party metadata platform integration (Collibra, Alation, Informatica)
- Metadata synchronization schedules and orchestration
- Conflict resolution when multiple tools disagree on metadata values
- Metadata API patterns (REST, GraphQL) for programmatic access
- Bi-directional metadata flows between platforms
- Event-driven metadata update patterns
- Metadata bridge architecture for heterogeneous environments
- Custom metadata ingestion for unsupported sources

### Out of Scope

- Metadata schema definitions (covered in ISL-02 Technical Metadata Schema)
- Business glossary content (covered in ISL-02 Business Glossary Standards)
- Data lineage capture mechanisms (covered in ISL-02 Data Lineage Requirements)
- Data pipeline design patterns (covered in ISL-05 Integration Patterns)
- Platform installation and infrastructure provisioning

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default | Client Value | Notes |
|-----------|---------|--------------|-------|
| Primary Metadata Catalog | Microsoft Purview | _________________ | System of record for metadata |
| Secondary Metadata Tools | None | _________________ | e.g., Collibra, Alation, Informatica |
| Metadata API Gateway | Azure API Management | _________________ | API exposure point |
| ERP Metadata Sources | SAP S/4HANA, Epicor Kinetic | _________________ | ERP metadata extraction |
| BI Platform | Power BI (Fabric) | _________________ | Report/model metadata |
| Data Platforms | Fabric, Azure SQL, ADLS Gen2 | _________________ | Technical metadata sources |
| IoT Platform | Azure IoT Hub | _________________ | Device/sensor metadata |
| Sync Frequency (Production) | Daily | _________________ | Metadata sync cadence |
| Sync Frequency (Non-Prod) | Weekly | _________________ | Non-prod cadence |
| Conflict Resolution Authority | Purview (primary) | _________________ | Which system wins conflicts |
| Event Bus | Azure Event Grid | _________________ | Metadata event distribution |
| Metadata API Authentication | OAuth 2.0 (Client Credentials) | _________________ | API auth method |
| Custom Connector Budget | Up to 3 custom connectors | _________________ | Custom development scope |

## Metadata Integration Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                 Metadata Consumers                       │
│  [Data Catalog UI] [BI Reports] [Governance Dashboards] │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              Metadata API Layer (APIM)                    │
│  [REST API] [GraphQL API] [Event Subscriptions]          │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│          Primary Metadata Catalog (Purview)               │
│  [Asset Registry] [Glossary] [Classifications]           │
│  [Lineage Graph]  [Collections] [Policies]               │
└────┬──────────┬──────────┬──────────┬───────────────────┘
     │          │          │          │
┌────▼───┐ ┌───▼────┐ ┌───▼───┐ ┌───▼────────────────┐
│Fabric  │ │Azure   │ │Power  │ │Custom Connectors   │
│Scanner │ │SQL     │ │BI     │ │[SAP] [Epicor] [IoT]│
│        │ │Scanner │ │Scanner│ │[MES] [File Shares]  │
└────────┘ └────────┘ └───────┘ └────────────────────┘
```

### Integration Patterns Summary

| Pattern | Description | Use Case | Complexity |
|---------|-------------|----------|------------|
| Native Scanner | Purview built-in source scan | Fabric, Azure SQL, ADLS, Power BI | Low |
| REST API Push | Source system pushes metadata to Purview via API | Custom apps, CI/CD pipelines | Medium |
| REST API Pull | Orchestrator pulls metadata from source and writes to Purview | SAP, Epicor, legacy systems | Medium |
| Event-Driven | Metadata changes trigger events consumed by subscribers | Real-time sync, notifications | Medium-High |
| Bi-Directional Sync | Two-way metadata synchronization between platforms | Purview <-> Collibra | High |
| Bridge/Adapter | Middleware translates between metadata schemas | Heterogeneous environments | High |
| Bulk Import/Export | Batch metadata load via files (CSV, JSON) | Initial migration, periodic reconciliation | Low |

## Purview Connector Configuration

### Native Purview Connectors

| Source Type | Connector | Scan Type | Lineage Support | Configuration |
|-------------|-----------|-----------|----------------|---------------|
| Fabric Lakehouse | Fabric scanner | Full / Incremental | Yes (table-level) | Enable in Purview Fabric integration |
| Fabric Warehouse | Fabric scanner | Full / Incremental | Yes (table-level) | Enable in Purview Fabric integration |
| Fabric Data Factory | Fabric lineage connector | Lineage only | Yes (pipeline + table) | Automatic with Fabric scan |
| Power BI | Power BI scanner | Full | Yes (dataset to report) | Enable Power BI metadata scanning in admin portal |
| Azure SQL Database | Azure SQL connector | Full / Incremental | Yes (table-level) | Register source, configure credentials |
| Azure Data Lake Gen2 | ADLS Gen2 connector | Full / Incremental | No (file-level only) | Register storage account, configure scan rule |
| Azure Synapse Analytics | Synapse connector | Full | Yes (pipeline + table) | Connect Synapse workspace |
| Azure Cosmos DB | Cosmos DB connector | Full | No | Register account, configure scan |
| SQL Server (on-prem) | SQL Server connector | Full / Incremental | No | Requires Self-Hosted Integration Runtime |
| SAP S/4HANA | SAP S/4HANA connector | Full | Limited | Requires SAP .NET connector + SHIR |
| SAP ECC | SAP ECC connector | Full | Limited | Requires SAP .NET connector + SHIR |

### Purview Scan Configuration Standards

| Parameter | Standard | Rationale |
|-----------|----------|-----------|
| Scan Rule Set | ISL-02 Custom Rule Set | Includes all ISL-04 classifications |
| Classification Rules | Enable all system + custom classification rules | PII, PHI, financial, ITAR detection |
| Scan Trigger | Scheduled (per sync frequency in client context) | Consistent metadata freshness |
| Scan Scope | All schemas except system schemas | Avoid cataloging sys, INFORMATION_SCHEMA |
| Resource Set Pattern | Enable for ADLS/OneLake partitioned data | Group partitioned files as single asset |
| Lineage Extraction | Enable wherever supported | Foundational for impact analysis |
| Credential Type | Managed Identity (preferred) or Key Vault | Security best practice |
| Network Access | Private endpoint where available | Per ISL-04 security requirements |

### Purview Collection Hierarchy

```
Root Collection (Enterprise)
├── Production
│   ├── Finance
│   ├── Operations
│   │   ├── SAP
│   │   └── Epicor
│   ├── Supply Chain
│   ├── Quality
│   ├── Sales & Marketing
│   └── IoT & OT
├── Pre-Production
│   ├── UAT
│   └── Development
├── Shared Services
│   ├── Master Data
│   └── Reference Data
└── Archived
```

## Third-Party Metadata Platform Integration

### Collibra Integration Patterns

| Pattern | Direction | Mechanism | Use Case |
|---------|-----------|-----------|----------|
| Glossary Sync | Collibra -> Purview | Collibra REST API export -> Transform -> Purview REST API import | Collibra as glossary authority |
| Glossary Sync | Purview -> Collibra | Purview REST API export -> Transform -> Collibra REST API import | Purview as glossary authority |
| Asset Sync | Purview -> Collibra | Purview Atlas API -> Transform -> Collibra Import API | Technical metadata to business catalog |
| Lineage Sync | Purview -> Collibra | Purview Lineage API -> Transform -> Collibra Lineage API | Unified lineage view |
| Classification Sync | Purview -> Collibra | Purview Classifications -> Map -> Collibra Data Categories | Unified classification |
| Stewardship Sync | Collibra -> Purview | Collibra Responsibilities -> Map -> Purview Contacts | Ownership alignment |

### Alation Integration Patterns

| Pattern | Direction | Mechanism | Use Case |
|---------|-----------|-----------|----------|
| Catalog Sync | Alation -> Purview | Alation API -> Transform -> Purview REST API | Alation as discovery layer |
| Glossary Sync | Alation -> Purview | Alation Glossary API -> Transform -> Purview Glossary API | Term synchronization |
| Query Log Sync | Alation -> Custom Store | Alation Query Log API -> Fabric Lakehouse | Query pattern metadata |
| Trust Flag Sync | Alation -> Purview | Alation Endorsement -> Map -> Purview Certification | Trust indicators |

### Integration Connector Template

For any third-party platform integration, the following connector specification must be documented.

| Attribute | Description | Example |
|-----------|-------------|---------|
| Connector Name | Descriptive name | purview-to-collibra-glossary-sync |
| Source Platform | Metadata source | Microsoft Purview |
| Target Platform | Metadata target | Collibra |
| Direction | Unidirectional or bidirectional | Unidirectional (Purview -> Collibra) |
| Data Exchanged | Metadata types synced | Glossary terms + relationships |
| Source API | API endpoint used | Purview: GET /glossary/terms |
| Target API | API endpoint used | Collibra: POST /assets |
| Schema Mapping | Field-level mapping document | See mapping table |
| Authentication | Auth mechanism for both | OAuth 2.0 CC for both platforms |
| Sync Schedule | Frequency | Daily at 02:00 UTC |
| Conflict Resolution | Resolution approach | Purview is authority for technical metadata; Collibra for business metadata |
| Error Handling | Failure behavior | Retry 3x with 5-min backoff; alert on persistent failure |
| Monitoring | Health check approach | Success/fail metrics in Azure Monitor + alerting |

## Metadata Synchronization Schedules

### Standard Sync Schedule

| Source | Target | Content | Frequency | Window | Priority |
|--------|--------|---------|-----------|--------|----------|
| Fabric Workspaces | Purview | Technical metadata + lineage | Daily 01:00-03:00 UTC | 2 hours | Critical |
| Azure SQL Databases | Purview | Technical metadata | Daily 01:00-03:00 UTC | 2 hours | Critical |
| ADLS Gen2 / OneLake | Purview | File metadata + classifications | Daily 03:00-05:00 UTC | 2 hours | High |
| Power BI (Fabric) | Purview | Report + dataset metadata | Daily 05:00-06:00 UTC | 1 hour | High |
| SAP S/4HANA | Purview | Table + field metadata | Weekly (Sunday 00:00 UTC) | 4 hours | Medium |
| Epicor Kinetic | Purview | Table + field metadata | Weekly (Sunday 04:00 UTC) | 4 hours | Medium |
| IoT Device Registry | Purview (custom) | Sensor/device metadata | Daily 06:00-07:00 UTC | 1 hour | Medium |
| Glossary Terms | All platforms | Business glossary sync | On-change + daily reconciliation | 30 minutes | High |
| Classifications | All platforms | Classification labels sync | On-change + daily reconciliation | 30 minutes | High |

### Sync Orchestration

| Requirement | Standard |
|-------------|----------|
| Orchestration Platform | Fabric Data Factory (preferred) or Azure Data Factory |
| Dependency Management | Scans must complete before enrichment pipelines run |
| Parallelism | Independent source scans may run in parallel |
| Retry Policy | 3 retries with exponential backoff (1 min, 5 min, 15 min) |
| Timeout | Individual scan: 4 hours max; full sync window: 8 hours max |
| Alerting | Failures alert via Teams channel + email within 15 minutes |
| Logging | All sync operations logged to central audit store |
| Reconciliation | Weekly reconciliation report comparing source vs. catalog counts |

## Conflict Resolution

### Conflict Types

| Conflict Type | Description | Example |
|--------------|-------------|---------|
| Attribute Disagreement | Two platforms have different values for the same attribute | Purview says owner is "Alice"; Collibra says "Bob" |
| Schema Mismatch | Metadata schema differences between platforms | Purview has 47 columns; source system shows 49 |
| Classification Conflict | Different classification labels applied | Auto-scan says "PII"; manual review says "Non-PII" |
| Glossary Term Conflict | Same asset linked to different terms | Purview links to "Revenue"; Collibra links to "Net Sales" |
| Lineage Disagreement | Different lineage paths recorded | Automated lineage shows path A; manual documentation shows path B |
| Freshness Conflict | Different last-updated timestamps | Scan shows stale; pipeline log shows fresh |

### Conflict Resolution Rules

| Rule | Priority | Description |
|------|----------|-------------|
| R1: Primary System Authority | 1 | The designated primary system (default: Purview) is authoritative for technical metadata |
| R2: Business System Authority | 2 | The business metadata system (default: Purview glossary or Collibra) is authoritative for business metadata |
| R3: Most Recent Wins | 3 | When no authority is designated, the most recently updated value wins |
| R4: Human Override | 4 | Manual steward decisions override automated values (documented with justification) |
| R5: Automated Trumps Stale Manual | 5 | Automated scan results override manual entries older than 90 days |
| R6: Escalation | 6 | Unresolvable conflicts escalate to data governance committee |

### Conflict Resolution Matrix

| Attribute Category | Authority System | Override Allowed | Escalation Path |
|-------------------|-----------------|-----------------|-----------------|
| Technical metadata (schema, types, counts) | Purview (automated scan) | No (scan is truth) | Data Engineering |
| Business descriptions | Purview glossary / Collibra | Yes (steward override) | Domain Data Steward |
| Data ownership | HR system -> Purview | Yes (domain owner override) | Data Governance |
| Classification / sensitivity | Purview (auto-classify) | Yes (steward can upgrade, not downgrade) | Security Team |
| Lineage (automated) | Purview (connector) | No (connector is truth) | Data Engineering |
| Lineage (manual) | Manual documentation | Yes (steward update) | Domain Data Steward |
| Quality scores | ISL-06 quality engine | No (computed) | Data Quality Team |

## Metadata API Patterns

### REST API Standards

All metadata APIs must conform to ISL-01 API Design Standards. The following endpoints represent the standard metadata API surface.

**Asset Metadata API:**

```
GET    /v1/metadata/assets                        — Search/list assets
GET    /v1/metadata/assets/{asset_id}             — Get asset detail
PATCH  /v1/metadata/assets/{asset_id}             — Update asset metadata
GET    /v1/metadata/assets/{asset_id}/columns     — Get asset columns
GET    /v1/metadata/assets/{asset_id}/lineage     — Get asset lineage
GET    /v1/metadata/assets/{asset_id}/quality     — Get asset quality scores
POST   /v1/metadata/assets/search                 — Advanced search (POST for complex queries)
```

**Glossary API:**

```
GET    /v1/metadata/glossary/terms                — List glossary terms
GET    /v1/metadata/glossary/terms/{term_id}      — Get term detail
POST   /v1/metadata/glossary/terms                — Create term
PATCH  /v1/metadata/glossary/terms/{term_id}      — Update term
GET    /v1/metadata/glossary/terms/{term_id}/assets — Get assets linked to term
```

**Lineage API:**

```
GET    /v1/metadata/lineage/{asset_id}/upstream   — Backward lineage
GET    /v1/metadata/lineage/{asset_id}/downstream — Forward lineage
GET    /v1/metadata/lineage/{asset_id}/impact     — Full impact analysis
POST   /v1/metadata/lineage                       — Register manual lineage
```

### GraphQL API Pattern

For clients requiring flexible metadata queries, a GraphQL endpoint may be provided.

```graphql
type Query {
  asset(id: ID!): Asset
  searchAssets(filter: AssetFilter!, limit: Int, offset: Int): AssetConnection
  glossaryTerm(id: ID!): GlossaryTerm
  lineage(assetId: ID!, direction: LineageDirection!, depth: Int): LineageGraph
}

type Asset {
  id: ID!
  name: String!
  type: AssetType!
  description: String
  owner: Contact
  steward: Contact
  classification: ClassificationTier
  qualityScore: Float
  columns: [Column]
  glossaryTerms: [GlossaryTerm]
  upstreamLineage: [LineageEdge]
  downstreamLineage: [LineageEdge]
  tags: [String]
  certificationStatus: CertificationStatus
  lastRefresh: DateTime
}

enum LineageDirection {
  UPSTREAM
  DOWNSTREAM
  BOTH
}
```

### API Authentication and Authorization

| Requirement | Standard |
|-------------|----------|
| Authentication | OAuth 2.0 Client Credentials for service-to-service; Authorization Code for user-facing |
| Authorization | RBAC aligned with Purview collections; read access for all authenticated users |
| Rate Limiting | 100 requests/sec (standard); 500 requests/sec (premium) |
| API Gateway | Azure API Management with Purview backend |
| Audit Logging | All metadata API calls logged with user identity and operation |

## Event-Driven Metadata Updates

### Metadata Event Types

| Event Type | Trigger | Payload | Subscribers |
|-----------|---------|---------|-------------|
| asset.discovered | New asset detected by scan | Asset ID, type, source, timestamp | Catalog admin, domain steward |
| asset.updated | Asset metadata changed | Asset ID, changed fields, old/new values | Asset subscribers, lineage consumers |
| asset.certified | Asset certification granted | Asset ID, certifier, certification date | All catalog users (broadcast) |
| asset.decertified | Asset certification revoked | Asset ID, reason, decertifier | Asset consumers, domain owner |
| asset.deprecated | Asset marked as deprecated | Asset ID, replacement asset, deprecation date | All asset consumers |
| glossary.term.created | New glossary term added | Term ID, name, domain | Domain stewards |
| glossary.term.approved | Term approved and published | Term ID, name, approver | All glossary subscribers |
| lineage.updated | Lineage graph changed | Affected asset IDs, edge changes | Impact analysis subscribers |
| classification.changed | Data classification updated | Asset ID, old/new classification | Security team, data owners |
| quality.score.changed | Quality score changed significantly | Asset ID, old/new score, threshold | Data steward, quality team |

### Event Bus Configuration

| Parameter | Standard |
|-----------|----------|
| Event Bus Platform | Azure Event Grid (default) or Azure Service Bus |
| Event Schema | CloudEvents v1.0 specification |
| Delivery Guarantee | At-least-once delivery |
| Retry Policy | 3 retries over 24 hours |
| Dead Letter | Events undeliverable after retries sent to dead-letter queue |
| Subscription Filtering | Topic-based + attribute-based filtering |
| Event Retention | 7 days in Event Grid; 14 days in dead-letter |

### Event Payload Example (CloudEvents)

```json
{
  "specversion": "1.0",
  "type": "com.company.metadata.asset.certified",
  "source": "/metadata/purview",
  "id": "evt-7c4a8d09-ca72-4d12-8265-3f1c6a9b7e42",
  "time": "2025-03-15T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {
    "assetId": "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
    "assetName": "gold_lakehouse.production.fact_work_order",
    "assetType": "TABLE",
    "certificationStatus": "CERTIFIED",
    "certifiedBy": "john.smith@company.com",
    "certificationDate": "2025-03-15T10:30:00Z",
    "qualityScore": 96.5,
    "previousStatus": "ENRICHED"
  }
}
```

## Bi-Directional Metadata Flows

### Bi-Directional Sync Architecture

| Component | Purpose |
|-----------|---------|
| Change Detection | Monitor both platforms for metadata changes (polling or event) |
| Conflict Detection | Compare changed attributes against conflict rules |
| Conflict Resolution | Apply resolution rules or queue for manual review |
| Transform | Map between source and target metadata schemas |
| Apply | Write resolved metadata to target platform |
| Audit | Log all sync operations with source, target, old/new values |

### Bi-Directional Sync Rules

| Rule | Standard |
|------|----------|
| Sync Direction | Identify per-attribute which system is authoritative |
| Change Window | Detect changes within the sync interval (default: 24 hours) |
| Merge Strategy | Last-writer-wins with authority override |
| Conflict Queue | Unresolvable conflicts queued for manual steward review |
| Conflict SLA | Manual conflicts resolved within 5 business days |
| Audit Trail | Full history of all sync operations retained for 1 year |
| Rollback | Ability to revert last sync operation within 24 hours |

## Fabric / Azure Implementation Guidance

### Purview REST API Usage

- Use Purview Data Map REST API for asset CRUD operations.
- Use Purview Catalog REST API for search and discovery.
- Use Purview Glossary REST API for term management.
- Use Purview Lineage REST API for lineage queries.
- Authenticate using Azure AD managed identity or service principal.
- Deploy API facade via Azure API Management for rate limiting and monitoring.

### Fabric Metadata Pipeline

- Build Fabric Data Factory pipelines for custom metadata extraction (SAP, Epicor, IoT).
- Use Fabric Notebooks for metadata transformation and enrichment logic.
- Store intermediate metadata in a dedicated metadata lakehouse.
- Use Purview REST API as the final write target for all metadata.
- Schedule metadata pipelines after data pipelines complete (dependency chain).

### Monitoring and Observability

| Component | Monitoring Approach |
|-----------|-------------------|
| Purview Scans | Azure Monitor diagnostics + Purview scan status API |
| Metadata Pipelines | Fabric pipeline monitoring + alerting |
| API Health | APIM analytics + Azure Monitor |
| Event Delivery | Event Grid metrics + dead-letter monitoring |
| Sync Reconciliation | Weekly automated comparison report |
| Conflict Backlog | Power BI dashboard on conflict queue |

## Manufacturing Overlay [CONDITIONAL]

### SAP Metadata Extraction

| Metadata Type | SAP Source | Extraction Method | Frequency |
|--------------|-----------|-------------------|-----------|
| Table Metadata | ABAP Dictionary (DD02L, DD03L) | RFC via ADF | Weekly |
| Field Metadata | Data Elements (DD04L) | RFC via ADF | Weekly |
| Domain Values | Domains (DD07L) | RFC via ADF | Weekly |
| Transaction Codes | TSTC | RFC via ADF | Monthly |
| Authorization Objects | TOBJ | RFC via ADF | Monthly |
| BOM Structures | STPO/STAS | RFC via ADF | Weekly |
| Routing/Operations | PLPO | RFC via ADF | Weekly |

### Epicor Metadata Extraction

| Metadata Type | Epicor Source | Extraction Method | Frequency |
|--------------|--------------|-------------------|-----------|
| Table Schema | Information_Schema | REST API / SQL | Weekly |
| BAQ Definitions | BAQ Designer Export | REST API | Weekly |
| BO Methods | Erp.BO metadata | REST API discovery | Monthly |
| Dashboard Metadata | Dashboard XML exports | File extraction | Monthly |
| Custom Fields | UD field definitions | REST API | Weekly |

### IoT Device Registry Sync

| Attribute | Source | Target | Sync Method |
|-----------|--------|--------|-------------|
| Device ID | IoT Hub Device Twin | Purview custom asset | REST API push |
| Device Type | IoT Hub Device Twin | Purview classification | REST API push |
| Location | IoT Hub Device Twin tags | Purview custom attribute | REST API push |
| Calibration Data | Maintenance system | Purview custom attribute | Scheduled sync |
| Sensor Schema | IoT Hub message routing | Purview schema asset | Event-driven |

## Cross-References

| Document | Relationship |
|----------|-------------|
| ISL-01: API Design Standards | Metadata API design follows ISL-01 patterns |
| ISL-02: Technical Metadata Schema | Schema being integrated across platforms |
| ISL-02: Business Glossary Standards | Glossary terms synchronized across tools |
| ISL-02: Data Lineage Requirements | Lineage metadata integrated across platforms |
| ISL-02: Data Catalog Governance | Catalog enrichment driven by integrated metadata |
| ISL-03: Naming Conventions | Asset naming consistency across platforms |
| ISL-04: Data Classification | Classification labels synchronized |
| ISL-05: Integration Patterns | Metadata pipeline design patterns |

## Compliance Alignment

| Standard | Alignment |
|----------|-----------|
| DAMA DMBOK2 (Ch. 10) | Metadata management — integration and interoperability |
| ISO 11179 | Metadata registry interoperability |
| OpenMetadata Specification | Open standard for metadata exchange |
| Apache Atlas API | Type system and entity model for metadata |
| W3C DCAT | Data catalog vocabulary for metadata exchange |
| CloudEvents Specification | Event-driven metadata update format |
| NIST SP 800-53 (CM-8) | Component inventory — metadata integration for asset management |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial release |
| -- | -- | -- | Reserved for client adaptation |

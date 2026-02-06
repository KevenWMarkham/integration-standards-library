# ISL-05: Integration Pattern Library

**Module ID:** ISL-05
**Target:** Reusable integration architecture patterns for common enterprise data flows
**Productivity Gain:** 35–45% reduction across Phases 2 and 4
**Build Effort:** High (60–80 hours)
**Reusability:** High — patterns are technology-agnostic with platform-specific implementation guides

---

## Overview

Library of pre-documented integration patterns covering ERP-to-lakehouse, IoT ingestion, API orchestration, event-driven architectures, and batch/real-time hybrid flows. Each pattern includes architecture diagrams, decision criteria, anti-patterns, and implementation guidance for Microsoft Fabric and Azure.

This module has dual impact: it accelerates Phase 2 (Reference Architecture) by providing pre-built integration layer designs, and it accelerates Phase 4 (Standards Definition) by documenting the governance standards that accompany each pattern. Unlike templates that are customized per engagement, these patterns are reference architectures that are selected and composed.

---

## How It Works

### Step 1: Map Client Integration Landscape
Inventory all integration points from discovery:
- Source systems (ERPs, CRMs, IoT platforms, SaaS applications)
- Target systems (Fabric lakehouse/warehouse, Power BI, operational systems)
- Data flow characteristics (volume, velocity, variety, latency requirements)
- Existing integration tooling (ADF, SSIS, Informatica, MuleSoft, custom)

### Step 2: Pattern Selection
Match integration requirements to pre-built patterns using the decision framework:
- What is the source system type? (ERP, IoT, API, file, database)
- What is the latency requirement? (real-time, near-real-time, batch, on-demand)
- What is the data volume? (MB, GB, TB per load)
- What are the security constraints? (network isolation, encryption, classification tier)

### Step 3: Compose Architecture
Combine selected patterns into a cohesive integration architecture:
- Layer patterns vertically (ingestion → transformation → serving)
- Connect patterns horizontally (source A → pattern 1, source B → pattern 2)
- Apply cross-cutting concerns (error handling, monitoring, retry logic)

### Step 4: Document Integration Standards
For each selected pattern, extract the governance standards:
- Configuration requirements and guardrails
- Monitoring and alerting thresholds
- Error handling and retry policies
- Security and access control requirements
- Performance benchmarks and SLA definitions

### Step 5: Deliver Pattern Catalog
Package as a living reference that persists beyond the engagement:
- Pattern selection guide (decision tree)
- Per-pattern architecture diagrams and documentation
- Anti-pattern warnings with real-world failure examples
- Implementation checklists per platform (Fabric, Azure, hybrid)

---

## Pattern Inventory

### Pattern 1: ERP Extract & Load
**File:** `patterns/erp-extract-load.md`
**Applicability:** Universal — every manufacturing client
**Source Systems:** SAP, Epicor, Oracle EBS, Dynamics 365

| Variant | Description | Use When |
|---------|-------------|----------|
| Full Load | Complete table extraction on schedule | Initial migration, small reference tables |
| Incremental (Timestamp) | Delta extraction based on modified date | Tables with reliable timestamp columns |
| Incremental (CDC) | Change Data Capture via transaction log | High-volume tables requiring near-real-time sync |
| Watermark | High-watermark pattern for append-only data | Event/transaction tables with sequential keys |

**Key Standards:**
- Extraction window scheduling (avoid peak ERP hours)
- Data type mapping (ERP-native → Fabric Delta Lake)
- Error handling for schema drift (new columns, type changes)
- Reconciliation requirements (row counts, checksums)

---

### Pattern 2: IoT/OT Ingestion
**File:** `patterns/iot-ot-ingestion.md`
**Applicability:** Clients with connected devices, SCADA, PLC, or OT systems
**Source Systems:** Kepware, Apriso, OSIsoft PI, Azure IoT Hub, custom MQTT

| Variant | Description | Use When |
|---------|-------------|----------|
| Streaming | Real-time telemetry via Event Hubs → Fabric Eventstream | Sub-second latency requirements |
| Micro-Batch | Buffered ingestion at 1–15 minute intervals | Near-real-time analytics, cost optimization |
| Edge Aggregation | Pre-aggregation at edge before cloud ingestion | High-frequency sensors, bandwidth constraints |
| Store & Forward | Local buffering with eventual cloud sync | Intermittent connectivity, remote facilities |

**Key Standards:**
- Telemetry schema standardization (timestamp, device_id, metric, value, unit)
- Dead-letter handling for malformed messages
- Backpressure and throttling policies
- Edge-to-cloud security (device certificates, message signing)

---

### Pattern 3: API Gateway Integration
**File:** `patterns/api-gateway-integration.md`
**Applicability:** Clients with API-first strategy or third-party SaaS integration
**Platforms:** Azure API Management, MuleSoft, Apigee, Kong

| Variant | Description | Use When |
|---------|-------------|----------|
| Request/Response | Synchronous API calls with data transformation | Real-time data retrieval, transactional operations |
| API Composition | Aggregating multiple backend APIs into single response | Backend-for-frontend, mobile/web consumers |
| Webhook Receiver | Inbound event-driven notifications from SaaS platforms | Salesforce, ServiceNow, Workday event subscriptions |
| API Polling | Scheduled polling of external APIs for data extraction | APIs without webhook support, rate-limited endpoints |

**Key Standards:**
- Aligned to ISL-01 (API Governance Standards)
- Circuit breaker and retry patterns
- Response caching policies
- API versioning and deprecation lifecycle

---

### Pattern 4: Event-Driven Architecture
**File:** `patterns/event-driven-architecture.md`
**Applicability:** Clients requiring real-time analytics, operational alerting, or event sourcing
**Platforms:** Azure Event Hubs, Service Bus, Fabric Eventstreams, Kafka

| Variant | Description | Use When |
|---------|-------------|----------|
| Pub/Sub | Topic-based message distribution to multiple consumers | Multiple downstream systems need same events |
| Event Sourcing | Immutable event log as system of record | Audit requirements, temporal queries, replay capability |
| CQRS | Separate read/write models with event synchronization | High-read workloads with complex query requirements |
| Saga/Choreography | Distributed transaction coordination via events | Cross-system business processes without central orchestrator |

**Key Standards:**
- Event schema standards (CloudEvents specification alignment)
- Exactly-once vs. at-least-once delivery guarantees
- Partitioning and ordering strategies
- Dead-letter queue management and alerting

---

### Pattern 5: Master Data Synchronization
**File:** `patterns/master-data-synchronization.md`
**Applicability:** Dual-ERP and multi-system clients
**Source Systems:** SAP MDG, Epicor, Salesforce, custom MDM

| Variant | Description | Use When |
|---------|-------------|----------|
| Golden Record (Hub) | Central MDM hub as authoritative source | Clear system-of-record, centralized governance |
| Coexistence | Bi-directional sync with conflict resolution | No single system-of-record, gradual consolidation |
| Registry | Virtual golden record with references to source systems | Minimal data movement, federated ownership |
| Consolidation | Periodic merge from multiple sources into analytics hub | Analytics-only use case, no operational writeback |

**Key Standards:**
- Match/merge rules and survivorship logic
- Cross-reference key mapping tables
- Conflict resolution hierarchy
- Synchronization frequency and SLA definitions

---

### Pattern 6: File-Based Integration
**File:** `patterns/file-based-integration.md`
**Applicability:** Legacy system integration, vendor data exchange, regulatory reporting
**Platforms:** ADLS, OneLake, SFTP, Azure Blob Storage

| Variant | Description | Use When |
|---------|-------------|----------|
| Drop Zone | File landing area with automated pickup and processing | Vendor file feeds, legacy system exports |
| Schema-on-Read | Flexible ingestion with validation at transformation layer | Diverse file formats, evolving schemas |
| Schema-on-Write | Strict validation at ingestion with rejection handling | Regulated data, quality-critical feeds |
| Archive & Process | Long-term storage with on-demand reprocessing capability | Compliance archives, historical data loading |

**Key Standards:**
- File naming conventions (aligned to ISL-03)
- Schema validation and rejection handling
- File lifecycle management (landing → processing → archive → purge)
- Encryption requirements for files at rest and in transit

---

### Pattern 7: Medallion Architecture
**File:** `patterns/medallion-architecture.md`
**Applicability:** All Fabric-based architectures
**Platforms:** Microsoft Fabric Lakehouse, Delta Lake

| Layer | Purpose | Key Standards |
|-------|---------|---------------|
| Bronze | Raw data preservation, source-system fidelity | No transformation, append-only, full audit trail |
| Silver | Cleansed, conformed, business-ready data | Deduplication, type standardization, null handling, SCD logic |
| Gold | Aggregated, business-specific, consumption-ready | Star schema, pre-aggregated metrics, semantic model alignment |

**Key Standards:**
- Layer transition rules (what transformations happen where)
- Quality gates between layers (ISL-06 validation rules)
- Naming conventions per layer (ISL-03)
- Retention policies per layer
- Access control per layer (ISL-04 classification alignment)

---

### Pattern 8: Reverse ETL
**File:** `patterns/reverse-etl.md`
**Applicability:** Clients requiring operational analytics, data activation, or lakehouse-to-app sync
**Platforms:** Fabric Data Factory, custom APIs, Census/Hightouch

| Variant | Description | Use When |
|---------|-------------|----------|
| API Writeback | Lakehouse data pushed to operational systems via APIs | CRM enrichment, ERP updates, master data sync |
| Embedded Analytics | Pre-computed metrics served to operational applications | Dashboard embedding, in-app reporting |
| Data Activation | Audience/segment data pushed to marketing/CX platforms | Customer segmentation, campaign targeting |
| Alert/Notification | Threshold-based notifications triggered from analytics | Operational alerting, quality monitoring |

**Key Standards:**
- Write conflict resolution (lakehouse vs. operational system)
- Idempotency requirements for writeback operations
- Rate limiting and throttling for target system protection
- Rollback and recovery procedures

---

## Architecture Diagrams

| Diagram | File | Description |
|---------|------|-------------|
| Integration Landscape Overview | `diagrams/integration-landscape-overview.md` | High-level view of all 8 patterns in a typical manufacturing environment |
| Fabric Integration Architecture | `diagrams/fabric-integration-architecture.md` | Microsoft Fabric-specific integration architecture with all patterns mapped to Fabric services |
| Decision Tree | `diagrams/pattern-decision-tree.md` | Flowchart for selecting the right pattern based on source, latency, volume, and security requirements |

---

## Impact Metrics

| Metric | Baseline (No Accelerator) | With Accelerator | Savings |
|--------|--------------------------|-------------------|---------|
| Phase 2 architecture design hours | 120–180 hrs | 80–120 hrs | 40–60 hrs |
| Phase 4 integration standards hours | 60–90 hrs | 40–60 hrs | 20–30 hrs |
| Total hours saved | — | — | 60–90 hrs |
| Architecture quality (pattern coverage) | 60–80% of integration points | 90–100% | Comprehensive coverage |
| Anti-pattern avoidance | Learned through failures | Pre-documented | Reduced rework risk |

---

## Dependencies

- **ISL-01 (API Governance):** Pattern 3 (API Gateway) references API governance standards
- **ISL-03 (Naming Conventions):** All patterns use ISL-03 naming for artifacts (pipelines, tables, files)
- **ISL-04 (Data Classification):** Security constraints per pattern aligned to classification tiers
- **ISL-06 (Data Quality):** Quality gates between medallion layers reference data quality rules
- **ACC-01 (Manufacturing Data Architecture Blueprints):** Blueprints compose these patterns into client-specific architectures
- **ACC-05 (Microsoft Fabric Migration Toolkit):** Migration patterns build on ERP Extract & Load and Medallion Architecture

---

## Directory Structure

```
integration-patterns/
├── README.md              ← This file
├── patterns/
│   ├── erp-extract-load.md
│   ├── iot-ot-ingestion.md
│   ├── api-gateway-integration.md
│   ├── event-driven-architecture.md
│   ├── master-data-synchronization.md
│   ├── file-based-integration.md
│   ├── medallion-architecture.md
│   └── reverse-etl.md
└── diagrams/
    ├── integration-landscape-overview.md
    ├── fabric-integration-architecture.md
    └── pattern-decision-tree.md
```

---

*Module Owner: DMTSP Enterprise Architecture Practice | Build Priority: Sprint 3 (Weeks 5–8)*

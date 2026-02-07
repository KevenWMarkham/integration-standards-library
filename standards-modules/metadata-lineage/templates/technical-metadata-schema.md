# Technical Metadata Schema

> Module: ISL-02 | Version: 1.0 | Adaptation Effort: 6-10 hrs | Dependencies: ISL-03, ISL-04, ISL-06

## Purpose

This document defines the standard technical metadata attributes that must be captured, maintained, and cataloged for every data asset within the enterprise data estate. A consistent technical metadata schema enables automated discovery, impact analysis, data quality assessment, and regulatory compliance across all platforms including Microsoft Fabric, Azure SQL, SAP, Epicor, and IoT data stores.

Technical metadata is the structural and operational information that describes how data is stored, processed, moved, and consumed. This schema provides the canonical attribute set for each asset type, ensuring all metadata catalogs (Purview, Unity Catalog, custom registries) capture a consistent and comparable set of information.

## Scope

### In Scope

- Metadata attributes for tables, views, and materialized views
- Metadata attributes for columns and fields
- Metadata attributes for data pipelines and ETL/ELT processes
- Metadata attributes for reports, dashboards, and visualizations
- Metadata attributes for semantic models and datasets
- Metadata attributes for files and unstructured data objects
- Metadata attributes for APIs and service endpoints
- Metadata attributes for streaming sources and event hubs
- Attribute taxonomy and data type standardization
- Mapping to Purview, Unity Catalog, and OpenMetadata schemas

### Out of Scope

- Business glossary term definitions (covered in ISL-02 Business Glossary Standards)
- Data quality rule specifications (covered in ISL-06 Data Quality Framework)
- Security classification definitions (covered in ISL-04 Data Classification)
- Physical infrastructure metadata (server specs, network topology)
- Application-level metadata (UI configurations, user preferences)

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default | Client Value | Notes |
|-----------|---------|--------------|-------|
| Primary Metadata Catalog | Microsoft Purview | _________________ | Central metadata store |
| Secondary Catalog | None | _________________ | e.g., Collibra, Alation |
| Data Platforms | Fabric, Azure SQL, ADLS Gen2 | _________________ | All platforms in scope |
| ERP Systems | SAP S/4HANA, Epicor Kinetic | _________________ | ERP metadata sources |
| IoT Platform | Azure IoT Hub | _________________ | Sensor/device registry |
| BI Platform | Power BI (Fabric) | _________________ | Reporting layer |
| Metadata Refresh Frequency | Daily | _________________ | Catalog scan cadence |
| Asset ID Format | Auto-generated (Purview GUID) | _________________ | Per ISL-03 naming |
| Custom Attribute Prefix | ISL_ | _________________ | Namespace for extensions |
| Row Count Threshold for Large Table | 10,000,000 | _________________ | Triggers special handling |
| Freshness SLA (Critical Assets) | 24 hours | _________________ | Max age before stale |
| Classification Auto-Apply | Yes | _________________ | Auto-classify PII/PHI |
| Quality Score Integration | Yes (ISL-06) | _________________ | Link DQ scores to assets |

## Asset Type: Tables and Views

### Standard Attributes

| # | Attribute | Data Type | Required | Description | Example |
|---|-----------|-----------|----------|-------------|---------|
| 1 | asset_id | String (GUID) | Yes | Unique identifier in metadata catalog | 3f2504e0-4f89-11d3-9a0c-0305e82c3301 |
| 2 | asset_type | Enum | Yes | Type of table asset | TABLE, VIEW, MATERIALIZED_VIEW, EXTERNAL_TABLE |
| 3 | fully_qualified_name | String | Yes | Full path: server.database.schema.object | fabricsql.sales_dw.dbo.dim_customer |
| 4 | server_name | String | Yes | Host server or service | fabricsql.database.windows.net |
| 5 | database_name | String | Yes | Database or lakehouse name | sales_dw |
| 6 | schema_name | String | Yes | Schema namespace | dbo |
| 7 | object_name | String | Yes | Table or view name | dim_customer |
| 8 | display_name | String | No | Human-friendly name | Customer Dimension |
| 9 | description | String | Yes | Business description (50-500 chars) | Master customer dimension containing all active and historical customer records sourced from SAP and Epicor |
| 10 | row_count | Integer | Yes | Approximate row count | 1,247,350 |
| 11 | size_bytes | Long | Yes | Storage size in bytes | 2,147,483,648 |
| 12 | column_count | Integer | Yes | Number of columns | 47 |
| 13 | created_date | DateTime | Yes | Object creation timestamp | 2025-01-15T08:30:00Z |
| 14 | modified_date | DateTime | Yes | Last DDL modification | 2025-03-01T14:22:00Z |
| 15 | last_data_refresh | DateTime | Yes | Last data load/update | 2025-03-15T06:00:00Z |
| 16 | freshness_status | Enum | Yes (computed) | FRESH, STALE, UNKNOWN | FRESH |
| 17 | data_owner | String (email) | Yes | Business data owner | john.smith@company.com |
| 18 | data_steward | String (email) | Yes | Technical data steward | jane.doe@company.com |
| 19 | classification_tier | Enum | Yes | ISL-04 security tier | TIER_2_INTERNAL |
| 20 | contains_pii | Boolean | Yes | Contains personally identifiable info | true |
| 21 | contains_phi | Boolean | Yes | Contains protected health info | false |
| 22 | itar_controlled | Boolean | Conditional | ITAR-restricted data | false |
| 23 | quality_score | Decimal | Yes | ISL-06 composite quality score (0-100) | 94.5 |
| 24 | source_system | String | Yes | Originating system | SAP S/4HANA |
| 25 | ingestion_pattern | Enum | Yes | How data arrives | BATCH_DAILY, BATCH_HOURLY, STREAMING, CDC, MANUAL |
| 26 | lakehouse_zone | Enum | Yes | Medallion layer | BRONZE, SILVER, GOLD, PLATINUM |
| 27 | glossary_terms | Array[String] | No | Linked business glossary term IDs | [GT-00142, GT-00089] |
| 28 | tags | Array[String] | No | Free-form discovery tags | [customer, master-data, sap] |
| 29 | certification_status | Enum | Yes | Catalog certification | CERTIFIED, UNCERTIFIED, DEPRECATED |
| 30 | partition_columns | Array[String] | No | Partition key columns | [load_date, region_code] |
| 31 | clustering_columns | Array[String] | No | Clustering/sort key columns | [customer_id] |
| 32 | retention_days | Integer | No | Data retention period | 2555 (7 years) |
| 33 | refresh_schedule | String (CRON) | No | Expected refresh schedule | 0 6 * * * (daily at 6 AM UTC) |
| 34 | upstream_assets | Array[String] | No | Source table/pipeline asset IDs | [asset-id-1, asset-id-2] |
| 35 | downstream_assets | Array[String] | No | Consuming assets | [asset-id-5, asset-id-6] |

### Freshness Calculation

| Freshness Status | Condition |
|-----------------|-----------|
| FRESH | last_data_refresh within refresh_schedule + tolerance (default 2 hours) |
| STALE | last_data_refresh exceeds refresh_schedule + tolerance |
| UNKNOWN | No refresh_schedule defined or last_data_refresh is NULL |

## Asset Type: Columns and Fields

### Standard Attributes

| # | Attribute | Data Type | Required | Description | Example |
|---|-----------|-----------|----------|-------------|---------|
| 1 | column_id | String (GUID) | Yes | Unique column identifier | 7a3b5c9d-e1f2-4a5b-8c9d-0e1f2a3b4c5d |
| 2 | parent_asset_id | String (GUID) | Yes | Reference to parent table/view | 3f2504e0-4f89-11d3-9a0c-0305e82c3301 |
| 3 | column_name | String | Yes | Physical column name | customer_email_address |
| 4 | display_name | String | No | Human-friendly name | Customer Email Address |
| 5 | ordinal_position | Integer | Yes | Column order (1-based) | 12 |
| 6 | data_type | String | Yes | Physical data type | NVARCHAR(255) |
| 7 | logical_data_type | Enum | Yes | Standardized logical type | EMAIL, TEXT, INTEGER, DECIMAL, DATE, DATETIME, BOOLEAN, IDENTIFIER, CODE, PHONE, ADDRESS, URL, JSON, BINARY |
| 8 | max_length | Integer | Conditional | Max character/byte length | 255 |
| 9 | precision | Integer | Conditional | Numeric precision | 18 |
| 10 | scale | Integer | Conditional | Numeric scale | 2 |
| 11 | is_nullable | Boolean | Yes | Allows NULL values | true |
| 12 | default_value | String | No | Column default expression | GETDATE() |
| 13 | is_primary_key | Boolean | Yes | Part of primary key | false |
| 14 | is_foreign_key | Boolean | Yes | References another table | false |
| 15 | foreign_key_reference | String | Conditional | Referenced table.column | dim_region.region_id |
| 16 | is_computed | Boolean | Yes | Computed/derived column | false |
| 17 | computation_logic | String | Conditional | Formula or derivation | unit_price * quantity * (1 - discount_pct) |
| 18 | description | String | Yes | Business description | Email address of the customer, sourced from SAP KNA1-SMTP_ADDR |
| 19 | pii_classification | Enum | Yes | PII sub-type | NONE, DIRECT_PII, INDIRECT_PII, SENSITIVE_PII, PHI |
| 20 | sensitivity_label | String | Conditional | Purview sensitivity label | Confidential - PII |
| 21 | classification_tags | Array[String] | No | Auto-detected classifications | [Microsoft.PersonalData.EmailAddress] |
| 22 | glossary_term_id | String | No | Linked business glossary term | GT-00203 |
| 23 | business_rule | String | No | Business rule or constraint | Must be valid RFC 5322 email format |
| 24 | sample_values | Array[String] | No | Representative (non-PII) values | [user@example.com, admin@example.com] |
| 25 | null_percentage | Decimal | No | Percentage of null values | 3.2 |
| 26 | distinct_count | Long | No | Count of distinct values | 1,150,432 |
| 27 | min_value | String | No | Minimum observed value | 2019-01-01 |
| 28 | max_value | String | No | Maximum observed value | 2025-03-15 |
| 29 | pattern | String | No | Regex pattern for validation | ^[\\w.-]+@[\\w.-]+\\.\\w{2,}$ |
| 30 | source_column | String | No | Original source system column | SAP: KNA1-SMTP_ADDR |
| 31 | transformation_applied | String | No | Transformation from source | TRIM + LOWER + NULL-if-blank |
| 32 | masking_rule | String | Conditional | Dynamic data masking rule | partial(2,"XXX",2) — shows first 2 and last 2 chars |

### Logical Data Type Taxonomy

| Logical Type | Description | Common Physical Types | PII Risk |
|-------------|-------------|----------------------|----------|
| IDENTIFIER | Unique identifier / surrogate key | INT, BIGINT, UNIQUEIDENTIFIER, VARCHAR | Low |
| CODE | Coded value (status, type, category) | VARCHAR, CHAR, TINYINT | Low |
| TEXT | Free-text description or name | VARCHAR, NVARCHAR, TEXT | Medium |
| EMAIL | Email address | VARCHAR, NVARCHAR | High (Direct PII) |
| PHONE | Phone/fax number | VARCHAR | High (Direct PII) |
| ADDRESS | Physical/mailing address | VARCHAR, NVARCHAR | High (Direct PII) |
| SSN | Social Security Number | CHAR(9), VARCHAR | Critical (Sensitive PII) |
| INTEGER | Whole number | INT, BIGINT, SMALLINT, TINYINT | Low |
| DECIMAL | Decimal/monetary value | DECIMAL, NUMERIC, FLOAT, MONEY | Low |
| DATE | Calendar date without time | DATE | Low |
| DATETIME | Date and time combined | DATETIME2, DATETIMEOFFSET | Low |
| BOOLEAN | True/false flag | BIT, BOOLEAN | Low |
| URL | Web address | VARCHAR, NVARCHAR | Low |
| JSON | Semi-structured JSON content | NVARCHAR(MAX), JSON | Varies |
| BINARY | Binary/blob data | VARBINARY, IMAGE | Varies |
| GEOSPATIAL | Geographic coordinates | GEOGRAPHY, GEOMETRY | Medium |

## Asset Type: Data Pipelines

### Standard Attributes

| # | Attribute | Data Type | Required | Description | Example |
|---|-----------|-----------|----------|-------------|---------|
| 1 | pipeline_id | String (GUID) | Yes | Unique pipeline identifier | p-8c3d19e0-ff72-4b12-9a65 |
| 2 | pipeline_name | String | Yes | Pipeline name per ISL-03 | pl_sap_material_master_daily |
| 3 | display_name | String | No | Human-friendly name | SAP Material Master Daily Load |
| 4 | description | String | Yes | Business purpose description | Extracts material master records from SAP S/4HANA and loads to Bronze lakehouse |
| 5 | platform | Enum | Yes | Pipeline execution platform | FABRIC_DATA_FACTORY, ADF, SYNAPSE, DATABRICKS, CUSTOM |
| 6 | workspace_name | String | Conditional | Fabric workspace name | prod-data-engineering |
| 7 | source_systems | Array[String] | Yes | Source system identifiers | [SAP S/4HANA, Epicor Kinetic] |
| 8 | source_objects | Array[String] | Yes | Source tables/files/APIs | [SAP.MARA, SAP.MARC, SAP.MAKT] |
| 9 | target_systems | Array[String] | Yes | Target system identifiers | [Fabric Lakehouse - Bronze] |
| 10 | target_objects | Array[String] | Yes | Target tables/files | [bronze_lakehouse.sap.material_master] |
| 11 | schedule_type | Enum | Yes | Trigger type | SCHEDULED, EVENT_DRIVEN, MANUAL, TUMBLING_WINDOW |
| 12 | schedule_expression | String | Conditional | CRON or trigger definition | 0 6 * * * (daily at 6 AM UTC) |
| 13 | last_run_start | DateTime | Yes | Most recent execution start | 2025-03-15T06:00:12Z |
| 14 | last_run_end | DateTime | Yes | Most recent execution end | 2025-03-15T06:14:38Z |
| 15 | last_run_status | Enum | Yes | Most recent run status | SUCCEEDED, FAILED, CANCELLED, IN_PROGRESS, QUEUED |
| 16 | last_run_duration_sec | Integer | Yes | Duration in seconds | 866 |
| 17 | last_run_rows_read | Long | Yes | Rows read from source | 1,247,350 |
| 18 | last_run_rows_written | Long | Yes | Rows written to target | 1,247,350 |
| 19 | last_run_rows_error | Long | Yes | Rows with errors | 0 |
| 20 | error_message | String | Conditional | Last error details (if failed) | null |
| 21 | average_duration_sec | Integer | No | Rolling 30-day average runtime | 842 |
| 22 | success_rate_30d | Decimal | No | 30-day success percentage | 99.7 |
| 23 | data_owner | String (email) | Yes | Pipeline business owner | data-engineering@company.com |
| 24 | developer | String (email) | Yes | Pipeline developer | jane.doe@company.com |
| 25 | sla_completion_time | String | No | Required completion time (UTC) | 07:00 UTC |
| 26 | retry_policy | String | No | Retry configuration | 3 retries, 5-minute backoff |
| 27 | alerting_config | String | No | Alert channel for failures | Teams: #data-pipeline-alerts |
| 28 | dependency_pipelines | Array[String] | No | Pipelines that must complete first | [pl_sap_plant_master_daily] |
| 29 | integration_pattern | Enum | No | Per ISL-05 classification | BATCH_EXTRACT, CDC, API_PULL, EVENT_STREAM |
| 30 | change_capture_method | Enum | Conditional | CDC mechanism | TIMESTAMP, CT_TABLE, CDC_LOG, FULL_REFRESH |

## Asset Type: Reports and Dashboards

### Standard Attributes

| # | Attribute | Data Type | Required | Description | Example |
|---|-----------|-----------|----------|-------------|---------|
| 1 | report_id | String (GUID) | Yes | Unique report identifier | r-4a5b8c9d-0e1f-2a3b-4c5d |
| 2 | report_name | String | Yes | Report name | Monthly Production Efficiency Dashboard |
| 3 | report_type | Enum | Yes | Artifact type | POWER_BI_REPORT, POWER_BI_DASHBOARD, PAGINATED_REPORT, EXCEL_REPORT |
| 4 | workspace_name | String | Yes | Fabric workspace | prod-manufacturing-analytics |
| 5 | description | String | Yes | Business purpose | Executive dashboard showing OEE, yield, and cycle time metrics across all plants |
| 6 | dataset_ids | Array[String] | Yes | Underlying datasets/models | [sm-production-efficiency-model] |
| 7 | data_owner | String (email) | Yes | Business report owner | ops-director@company.com |
| 8 | developer | String (email) | Yes | Report developer | bi-analyst@company.com |
| 9 | refresh_schedule | String | Yes | Data refresh cadence | Every 4 hours (6 AM - 10 PM UTC) |
| 10 | last_refresh | DateTime | Yes | Most recent data refresh | 2025-03-15T14:00:00Z |
| 11 | page_count | Integer | No | Number of report pages | 8 |
| 12 | visual_count | Integer | No | Number of visuals | 32 |
| 13 | rls_enabled | Boolean | Yes | Row-level security active | true |
| 14 | rls_roles | Array[String] | Conditional | RLS role names | [PlantManager, RegionalDirector, Executive] |
| 15 | consumer_count | Integer | No | Unique viewers (30 days) | 47 |
| 16 | view_count_30d | Integer | No | Total views (30 days) | 312 |
| 17 | certification_status | Enum | Yes | Report certification | CERTIFIED, UNCERTIFIED, DEPRECATED |
| 18 | sensitivity_label | String | Yes | Information protection label | Confidential |
| 19 | endorsement | Enum | No | Fabric endorsement level | PROMOTED, CERTIFIED, NONE |
| 20 | contains_export_data | Boolean | No | Allows data export | true |

## Asset Type: Semantic Models

### Standard Attributes

| # | Attribute | Data Type | Required | Description | Example |
|---|-----------|-----------|----------|-------------|---------|
| 1 | model_id | String (GUID) | Yes | Unique model identifier | sm-9a3b5c7d-e1f2-4a5b |
| 2 | model_name | String | Yes | Semantic model name | Production Efficiency Model |
| 3 | workspace_name | String | Yes | Fabric workspace | prod-manufacturing-analytics |
| 4 | description | String | Yes | Business purpose | Star schema model covering production runs, equipment OEE, quality metrics, and yield analysis |
| 5 | storage_mode | Enum | Yes | Model storage mode | IMPORT, DIRECT_LAKE, DIRECT_QUERY, COMPOSITE |
| 6 | table_count | Integer | Yes | Number of model tables | 12 |
| 7 | measure_count | Integer | Yes | Number of DAX measures | 45 |
| 8 | relationship_count | Integer | Yes | Number of relationships | 15 |
| 9 | calculated_column_count | Integer | No | Calculated columns | 8 |
| 10 | calculation_group_count | Integer | No | Calculation groups | 2 |
| 11 | model_size_bytes | Long | No | In-memory model size | 524,288,000 |
| 12 | refresh_schedule | String | Yes | Refresh cadence | Every 4 hours |
| 13 | last_refresh | DateTime | Yes | Most recent refresh | 2025-03-15T14:00:00Z |
| 14 | last_refresh_duration_sec | Integer | No | Refresh duration | 180 |
| 15 | source_lakehouse | String | Yes | Primary data source | gold_lakehouse |
| 16 | source_tables | Array[String] | Yes | Source lakehouse tables | [fact_production_run, dim_equipment, dim_product, dim_plant, dim_date] |
| 17 | data_owner | String (email) | Yes | Model business owner | analytics-lead@company.com |
| 18 | developer | String (email) | Yes | Model developer | bi-engineer@company.com |
| 19 | rls_enabled | Boolean | Yes | Row-level security | true |
| 20 | ols_enabled | Boolean | Yes | Object-level security | false |
| 21 | endorsement | Enum | Yes | Fabric endorsement | CERTIFIED |
| 22 | downstream_reports | Array[String] | No | Reports using this model | [r-monthly-prod-dashboard, r-plant-scorecard] |
| 23 | gateway_connection | String | Conditional | On-premises gateway | gateway-plant-p100 |

## Asset Type: Files and Unstructured Data

### Standard Attributes

| # | Attribute | Data Type | Required | Description | Example |
|---|-----------|-----------|----------|-------------|---------|
| 1 | file_id | String (GUID) | Yes | Unique file asset identifier | f-2a3b4c5d-6e7f-8a9b |
| 2 | file_path | String | Yes | Full storage path | abfss://bronze@onelake.dfs.fabric.microsoft.com/sap_extracts/materials/2025/03/15/materials_full.parquet |
| 3 | file_name | String | Yes | File name | materials_full.parquet |
| 4 | file_format | Enum | Yes | Format type | PARQUET, DELTA, CSV, JSON, AVRO, ORC, XML, PDF, IMAGE |
| 5 | file_size_bytes | Long | Yes | File size | 134,217,728 |
| 6 | row_count | Long | Conditional | Row count (structured files) | 1,247,350 |
| 7 | compression | Enum | No | Compression type | SNAPPY, GZIP, ZSTD, NONE |
| 8 | created_date | DateTime | Yes | File creation date | 2025-03-15T06:14:38Z |
| 9 | modified_date | DateTime | Yes | Last modification | 2025-03-15T06:14:38Z |
| 10 | source_system | String | Yes | Originating system | SAP S/4HANA |
| 11 | producing_pipeline | String | No | Pipeline that created this file | pl_sap_material_master_daily |
| 12 | lakehouse_zone | Enum | Yes | Medallion layer | BRONZE |
| 13 | partition_path | String | No | Partition key values in path | year=2025/month=03/day=15 |
| 14 | schema_version | String | No | Schema version for the file | v2.3 |
| 15 | classification_tier | Enum | Yes | ISL-04 security tier | TIER_2_INTERNAL |
| 16 | retention_days | Integer | No | Retention period | 2555 |
| 17 | checksum | String | No | File integrity hash | SHA256:a1b2c3d4e5f6... |

## Asset Type: APIs and Service Endpoints

### Standard Attributes

| # | Attribute | Data Type | Required | Description | Example |
|---|-----------|-----------|----------|-------------|---------|
| 1 | api_id | String (GUID) | Yes | Unique API identifier | api-5c7d9e1f-2a3b-4c5d |
| 2 | api_name | String | Yes | API name | SAP Material Master API |
| 3 | base_url | String | Yes | API base URL | https://api.company.com/v1/sap/materials |
| 4 | api_version | String | Yes | Current version | v1 |
| 5 | api_type | Enum | Yes | Protocol type | REST, GRAPHQL, ODATA, SOAP, GRPC |
| 6 | description | String | Yes | Business purpose | Provides CRUD access to SAP material master records |
| 7 | openapi_spec_url | String | Conditional | OpenAPI spec location | https://api.company.com/v1/sap/materials/openapi.json |
| 8 | authentication_type | Enum | Yes | Auth mechanism | OAUTH2_CC, OAUTH2_AUTH_CODE, API_KEY, MTLS, BASIC |
| 9 | data_owner | String (email) | Yes | API business owner | sap-integration@company.com |
| 10 | sla_tier | Enum | Yes | Service level | PLATINUM, GOLD, SILVER, BRONZE |
| 11 | rate_limit | String | Yes | Requests per second | 100 req/sec |
| 12 | data_classification | Enum | Yes | Highest data tier exposed | TIER_2_INTERNAL |
| 13 | consumer_count | Integer | No | Registered consumers | 8 |
| 14 | avg_daily_calls | Long | No | Average daily invocations | 12,500 |
| 15 | avg_latency_ms | Integer | No | Average response time | 125 |
| 16 | availability_30d | Decimal | No | 30-day uptime percentage | 99.97 |
| 17 | source_systems | Array[String] | Yes | Backend data systems | [SAP S/4HANA] |
| 18 | gateway | String | No | API gateway platform | Azure API Management |

## Asset Type: Streaming Sources

### Standard Attributes

| # | Attribute | Data Type | Required | Description | Example |
|---|-----------|-----------|----------|-------------|---------|
| 1 | stream_id | String (GUID) | Yes | Unique stream identifier | es-7d9e1f2a-3b4c-5d6e |
| 2 | stream_name | String | Yes | Stream name | IoT Sensor Telemetry Stream |
| 3 | platform | Enum | Yes | Streaming platform | EVENT_HUB, KAFKA, FABRIC_EVENTSTREAM, IOT_HUB, KINESIS |
| 4 | namespace | String | Conditional | Event Hub namespace | iot-telemetry-prod |
| 5 | topic_name | String | Yes | Topic or Event Hub name | sensor-readings |
| 6 | partition_count | Integer | Yes | Number of partitions | 32 |
| 7 | consumer_groups | Array[String] | No | Active consumer groups | [fabric-ingest, monitoring-alerts, archive] |
| 8 | schema_type | Enum | Yes | Message schema format | AVRO, JSON, PROTOBUF, CSV |
| 9 | schema_registry_url | String | Conditional | Schema registry location | https://schema-registry.company.com |
| 10 | avg_throughput_msg_sec | Long | No | Average messages per second | 2,500 |
| 11 | avg_message_size_bytes | Integer | No | Average message payload size | 512 |
| 12 | retention_hours | Integer | Yes | Message retention period | 168 (7 days) |
| 13 | source_system | String | Yes | Originating system | Azure IoT Hub (2,500 sensors) |
| 14 | data_owner | String (email) | Yes | Stream business owner | iot-platform@company.com |
| 15 | classification_tier | Enum | Yes | ISL-04 security tier | TIER_2_INTERNAL |

## Master Attribute Taxonomy

The following taxonomy classifies all metadata attributes into standardized categories for consistent cataloging across asset types.

| Category | Description | Attribute Examples |
|----------|-------------|-------------------|
| Identity | Unique identification | asset_id, fully_qualified_name, asset_type |
| Descriptive | Human-readable information | display_name, description, tags |
| Structural | Physical structure details | data_type, column_count, row_count, size_bytes |
| Operational | Runtime and execution | last_run_status, schedule, duration, freshness |
| Ownership | Accountability | data_owner, data_steward, developer |
| Lineage | Data flow relationships | upstream_assets, downstream_assets, source_system |
| Security | Access and classification | classification_tier, pii_classification, rls_enabled |
| Quality | Data quality metrics | quality_score, null_percentage, distinct_count |
| Governance | Lifecycle and certification | certification_status, retention_days, glossary_term_id |
| Platform | Technology-specific | workspace_name, lakehouse_zone, storage_mode |

## Metadata Completeness Scoring

Every cataloged asset receives a metadata completeness score based on attribute population.

### Scoring Formula

```
Completeness Score = (Populated Required Attributes / Total Required Attributes) * 70
                   + (Populated Optional Attributes / Total Optional Attributes) * 30
```

### Completeness Tiers

| Tier | Score Range | Status | Action Required |
|------|------------|--------|-----------------|
| Gold | 90-100 | Fully enriched | Maintain via regular review |
| Silver | 70-89 | Adequately enriched | Fill remaining optional attributes |
| Bronze | 50-69 | Minimally enriched | Priority enrichment within 30 days |
| Incomplete | 0-49 | Under-documented | Immediate enrichment required |

### Target Completeness by Asset Criticality

| Asset Criticality | Gold Tier | Silver Tier | Bronze Tier |
|-------------------|-----------|-------------|-------------|
| Critical (SOX, regulatory) | Required | -- | -- |
| High (customer-facing) | Target | Minimum | -- |
| Medium (internal analytics) | Target | Target | Minimum |
| Low (exploratory, sandbox) | -- | Target | Minimum |

## Fabric / Azure Implementation Guidance

### Purview Technical Metadata Mapping

- Configure Purview scans for all registered data sources (Fabric, Azure SQL, ADLS Gen2, SAP, Epicor).
- Map ISL-02 standard attributes to Purview built-in and custom type definitions.
- Use Purview classifications for automated PII/PHI detection per the column PII classification taxonomy.
- Configure Purview sensitivity labels aligned to ISL-04 classification tiers.
- Enable Purview lineage connectors for ADF, Fabric Data Factory, and Synapse pipelines.

### Fabric-Specific Metadata

- Use Fabric REST APIs to extract workspace, lakehouse, warehouse, and semantic model metadata.
- Configure Purview to scan Fabric workspaces for automatic asset discovery.
- Map Fabric endorsement levels (Promoted, Certified) to ISL-02 certification_status.
- Extract Power BI metadata (reports, dashboards, datasets) via Fabric Admin APIs.
- Capture Fabric capacity and workspace assignments as platform metadata.

### Metadata Refresh Architecture

| Source | Method | Frequency | Target |
|--------|--------|-----------|--------|
| Fabric Lakehouses | Purview scan | Daily | Purview catalog |
| Fabric Warehouses | Purview scan | Daily | Purview catalog |
| Fabric Pipelines | Purview lineage connector | Real-time | Purview catalog |
| Fabric Semantic Models | Admin API + Purview | Daily | Purview catalog |
| Power BI Reports | Admin API + Purview | Daily | Purview catalog |
| Azure SQL Databases | Purview scan | Daily | Purview catalog |
| ADLS Gen2 / OneLake | Purview scan | Daily | Purview catalog |
| SAP S/4HANA | Custom connector / API | Weekly | Purview catalog |
| Epicor Kinetic | Custom connector / API | Weekly | Purview catalog |
| IoT Hub Devices | Azure IoT Hub REST API | Daily | Custom registry + Purview |

## Manufacturing Overlay [CONDITIONAL]

### SAP-Specific Metadata Extensions

| Attribute | Description | SAP Source | Example |
|-----------|-------------|-----------|---------|
| sap_client | SAP client number | System config | 100 |
| sap_table_name | SAP physical table | Data dictionary | MARA |
| sap_field_name | SAP field name | Data dictionary | MATNR |
| sap_data_element | SAP data element | ABAP dictionary | MATNR |
| sap_domain | SAP domain | ABAP dictionary | MATNR |
| sap_check_table | Foreign key check table | ABAP dictionary | T001W |
| sap_module | SAP functional module | Classification | MM (Materials Management) |

### Epicor-Specific Metadata Extensions

| Attribute | Description | Epicor Source | Example |
|-----------|-------------|--------------|---------|
| epicor_table | Epicor database table | Schema | Part |
| epicor_field | Epicor field name | Schema | PartNum |
| epicor_bo | Business Object name | REST API | Erp.BO.PartSvc |
| epicor_baq | BAQ identifier | BAQ designer | zPart-GetList |
| epicor_company | Company identifier | System config | ACME |

### IoT Sensor Metadata Extensions

| Attribute | Description | Example |
|-----------|-------------|---------|
| device_id | IoT Hub device identifier | SENSOR-P1-L3-TEMP-001 |
| sensor_type | Measurement category | temperature, vibration, pressure, flow |
| measurement_unit | Engineering unit | celsius, mm/s, psi, l/min |
| sampling_rate_hz | Data collection frequency | 10 |
| accuracy_class | Sensor accuracy specification | Class A (IEC 60751) |
| calibration_date | Last calibration date | 2025-02-01 |
| calibration_due | Next calibration due | 2025-08-01 |
| plant_code | Manufacturing plant | P100 |
| line_code | Production line | L3 |
| equipment_id | Parent equipment | CNC-P1-L3-001 |

## Cross-References

| Document | Relationship |
|----------|-------------|
| ISL-02: Business Glossary Standards | Glossary terms linked to technical metadata |
| ISL-02: Data Lineage Requirements | Lineage captured at technical metadata level |
| ISL-02: Data Catalog Governance | Catalog curation uses technical metadata schema |
| ISL-02: Metadata Integration Patterns | Sync technical metadata across platforms |
| ISL-03: Naming Conventions | Object naming standards for all assets |
| ISL-04: Data Classification | Security classification tiers applied to assets |
| ISL-05: Integration Patterns | Pipeline metadata by integration pattern |
| ISL-06: Data Quality Framework | Quality scores as metadata attributes |

## Compliance Alignment

| Standard | Alignment |
|----------|-----------|
| DAMA DMBOK2 (Ch. 10, 12) | Technical metadata and data architecture documentation |
| ISO 11179 | Metadata registry attribute standards |
| Apache Atlas Type System | Asset type modeling approach |
| OpenMetadata Schema | Column-level metadata attributes |
| W3C PROV-O | Lineage and provenance metadata |
| GDPR (Art. 30) | Processing records require technical metadata |
| SOX (Section 302/404) | Financial data asset documentation |
| NIST SP 800-53 (CM-8) | Information system component inventory |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial release |
| -- | -- | -- | Reserved for client adaptation |

# Fabric OneLake Metadata — Completed Example

> Module: ISL-02 | Version: 1.0 | Type: Example

## Purpose

This document provides a fully completed example of the ISL-02 Technical Metadata Schema applied to a Microsoft Fabric environment. It demonstrates the metadata model for all Fabric artifact types — lakehouses, warehouses, pipelines, notebooks, semantic models, Eventstreams, and reports — as deployed for a manufacturing data platform on OneLake.

**Client Profile:**
- Platform: Microsoft Fabric (F64 capacity, 3 production workspaces)
- Storage: OneLake with medallion architecture (Bronze/Silver/Gold)
- Ingestion: Fabric Data Factory pipelines + Eventstreams
- Transformation: Fabric Notebooks (PySpark)
- Serving: Fabric Semantic Models (Direct Lake)
- Reporting: Power BI reports in Fabric workspaces
- Metadata Catalog: Microsoft Purview (connected to Fabric)

## Fabric Workspace Metadata

### Production Workspaces

| Attribute | Workspace 1 | Workspace 2 | Workspace 3 |
|-----------|-------------|-------------|-------------|
| workspace_id | ws-a1b2c3d4-e5f6-7890 | ws-b2c3d4e5-f6a7-8901 | ws-c3d4e5f6-a7b8-9012 |
| workspace_name | prod-data-engineering | prod-data-analytics | prod-iot-streaming |
| display_name | Production Data Engineering | Production Data Analytics | Production IoT Streaming |
| description | Bronze and Silver zone data processing. Contains lakehouses, pipelines, and notebooks for data ingestion and transformation from SAP, Epicor, and manual sources. | Gold zone serving layer. Contains Gold lakehouse, Fabric warehouse, semantic models, and Power BI reports. | Real-time IoT data ingestion. Contains Eventstreams, KQL databases, and Bronze IoT lakehouse. |
| capacity_name | fabric-prod-f64 | fabric-prod-f64 | fabric-prod-f64 |
| capacity_sku | F64 | F64 | F64 |
| region | East US 2 | East US 2 | East US 2 |
| admin_group | data-engineering-admins@acme-mfg.com | analytics-admins@acme-mfg.com | iot-platform-admins@acme-mfg.com |
| contributor_group | data-engineering-team@acme-mfg.com | analytics-team@acme-mfg.com | iot-platform-team@acme-mfg.com |
| viewer_group | data-consumers@acme-mfg.com | all-employees@acme-mfg.com | operations-team@acme-mfg.com |
| git_integration | Azure DevOps (main branch) | Azure DevOps (main branch) | Azure DevOps (main branch) |
| environment | Production | Production | Production |
| item_count | 47 | 32 | 18 |

## Fabric Lakehouse Metadata

### Bronze Lakehouse

| Attribute | Value |
|-----------|-------|
| item_id | lh-d4e5f6a7-b8c9-0d1e |
| item_type | LAKEHOUSE |
| item_name | bronze_lakehouse |
| display_name | Bronze Lakehouse |
| workspace | prod-data-engineering |
| description | Landing zone for all raw data extracts. Contains SAP, Epicor, MES, and manual source data in Delta format. Partitioned by source system and extraction date. Retention: 90 days for raw files, indefinite for Delta tables. |
| onelake_path | abfss://prod-data-engineering@onelake.dfs.fabric.microsoft.com/bronze_lakehouse |
| sql_endpoint | bronze-lakehouse-xxxxx.datawarehouse.fabric.microsoft.com |
| table_count | 87 |
| total_size_gb | 450 |
| delta_tables | 87 |
| file_folders | 12 (staging, archive, rejected, manual-uploads, schemas) |
| default_schema | dbo |
| custom_schemas | sap_master, sap_production, sap_finance, sap_quality, epicor_master, epicor_production, iot, mes, manual |
| data_owner | data-engineering-lead@acme-mfg.com |
| last_modified | 2025-03-15T08:45:00Z |
| purview_registered | Yes (scan daily at 01:00 UTC) |
| endorsement | PROMOTED |

### Silver Lakehouse

| Attribute | Value |
|-----------|-------|
| item_id | lh-e5f6a7b8-c9d0-1e2f |
| item_type | LAKEHOUSE |
| item_name | silver_lakehouse |
| display_name | Silver Lakehouse |
| workspace | prod-data-engineering |
| description | Conformed and cleansed data layer. Contains standardized, deduplicated, and enriched data organized into domain-specific schemas. Source for Gold zone aggregation and serving. |
| onelake_path | abfss://prod-data-engineering@onelake.dfs.fabric.microsoft.com/silver_lakehouse |
| table_count | 62 |
| total_size_gb | 280 |
| custom_schemas | master, production, finance, quality, supply_chain, welding, iot_aggregated |
| data_owner | data-engineering-lead@acme-mfg.com |
| endorsement | PROMOTED |

### Gold Lakehouse

| Attribute | Value |
|-----------|-------|
| item_id | lh-f6a7b8c9-d0e1-2f3a |
| item_type | LAKEHOUSE |
| item_name | gold_lakehouse |
| display_name | Gold Lakehouse |
| workspace | prod-data-analytics |
| description | Analytics-ready serving layer. Contains star schema dimensional models optimized for Power BI Direct Lake semantic models. All Gold tables are certified and quality-scored. |
| onelake_path | abfss://prod-data-analytics@onelake.dfs.fabric.microsoft.com/gold_lakehouse |
| table_count | 38 |
| total_size_gb | 120 |
| custom_schemas | master, production, finance, quality, supply_chain, product |
| data_owner | analytics-lead@acme-mfg.com |
| endorsement | CERTIFIED |

## Fabric Warehouse Metadata

### Analytics Warehouse

| Attribute | Value |
|-----------|-------|
| item_id | wh-a7b8c9d0-e1f2-3a4b |
| item_type | WAREHOUSE |
| item_name | analytics_warehouse |
| display_name | Analytics Warehouse |
| workspace | prod-data-analytics |
| description | Fabric Warehouse for complex analytical queries, ad-hoc analysis, and cross-domain joins that are not well-served by Direct Lake. Contains materialized views and stored procedures for recurring analytical patterns. |
| sql_endpoint | analytics-warehouse-xxxxx.datawarehouse.fabric.microsoft.com |
| table_count | 15 |
| view_count | 28 |
| stored_procedure_count | 12 |
| total_size_gb | 85 |
| data_owner | analytics-lead@acme-mfg.com |
| endorsement | CERTIFIED |

**Key Warehouse Objects:**

| Object Name | Type | Description | Source |
|-------------|------|-------------|--------|
| vw_production_oee_daily | View | Daily OEE by equipment, line, plant | Joins gold.production + gold.master tables |
| vw_quality_trend_weekly | View | Weekly quality metrics by product family | Joins gold.quality + gold.product tables |
| vw_inventory_aging | View | Inventory aging buckets with valuation | Joins gold.supply_chain + gold.master tables |
| sp_refresh_oee_summary | Proc | Refreshes materialized OEE summary | Runs daily after Gold pipeline |
| sp_generate_sox_reconciliation | Proc | Produces SOX reconciliation report | Runs monthly for finance team |
| mat_inventory_valuation | Table | Materialized inventory valuation by plant | sp_refresh_inventory_valuation |

## Fabric Pipeline Metadata

### SAP Material Master Pipeline

| Attribute | Value |
|-----------|-------|
| item_id | pl-b8c9d0e1-f2a3-4b5c |
| item_type | PIPELINE |
| item_name | pl_sap_material_master_daily |
| display_name | SAP Material Master Daily Extract |
| workspace | prod-data-engineering |
| description | Extracts material master records from SAP S/4HANA tables MARA, MARC, MAKT, and MARM via RFC connector. Loads to Bronze lakehouse sap_master schema. Full refresh daily. |
| source_systems | SAP S/4HANA (RFC) |
| target_objects | bronze_lakehouse.sap_master.material_master |
| schedule_type | SCHEDULED |
| schedule_expression | 0 6 * * * (daily at 6 AM UTC) |
| last_run_start | 2025-03-15T06:00:12Z |
| last_run_end | 2025-03-15T06:14:38Z |
| last_run_status | SUCCEEDED |
| last_run_duration_sec | 866 |
| last_run_rows_read | 287,450 |
| last_run_rows_written | 287,450 |
| last_run_rows_error | 0 |
| success_rate_30d | 100.0 |
| average_duration_sec | 842 |
| data_owner | sap-integration@acme-mfg.com |
| developer | data-engineer-1@acme-mfg.com |
| alerting_config | Teams: #sap-pipeline-alerts |

### Pipeline Inventory

| Pipeline Name | Source | Target Zone | Schedule | Avg Duration | Success Rate |
|--------------|--------|-------------|----------|-------------|-------------|
| pl_sap_material_master_daily | SAP (MARA/MARC/MAKT) | Bronze | Daily 06:00 | 14 min | 100% |
| pl_sap_production_orders_daily | SAP (AFKO/AFPO) | Bronze | Daily 06:15 | 22 min | 99.7% |
| pl_sap_financial_postings_daily | SAP (BKPF/BSEG) | Bronze | Daily 05:00 | 45 min | 99.3% |
| pl_sap_quality_inspections_daily | SAP (QMEL/QMFE) | Bronze | Daily 06:30 | 8 min | 100% |
| pl_epicor_part_master_daily | Epicor (Part REST API) | Bronze | Daily 06:00 | 11 min | 99.7% |
| pl_epicor_jobs_daily | Epicor (JobHead REST API) | Bronze | Daily 06:15 | 18 min | 99.3% |
| pl_mes_production_runs_daily | Ignition MES (SQL) | Bronze | Daily 05:30 | 25 min | 98.7% |
| pl_manual_uploads_check | ADLS Manual Upload Zone | Bronze | Hourly | 2 min | 100% |
| pl_bronze_to_silver_master | Bronze lakehouses | Silver | Daily 07:00 | 35 min | 99.7% |
| pl_bronze_to_silver_transactions | Bronze lakehouses | Silver | Daily 07:30 | 55 min | 99.0% |
| pl_silver_to_gold_dimensions | Silver lakehouse | Gold | Daily 08:00 | 20 min | 99.7% |
| pl_silver_to_gold_facts | Silver lakehouse | Gold | Daily 08:30 | 40 min | 99.3% |

## Fabric Notebook Metadata

### Bronze-to-Silver Material Transform

| Attribute | Value |
|-----------|-------|
| item_id | nb-c9d0e1f2-a3b4-5c6d |
| item_type | NOTEBOOK |
| item_name | nb_bronze_to_silver_material_master |
| display_name | Material Master: Bronze to Silver Transform |
| workspace | prod-data-engineering |
| description | PySpark notebook that reads SAP and Epicor material/part bronze tables, applies data quality checks, standardizes column names per ISL-03, deduplicates, maps to unified schema, and writes to Silver lakehouse. Includes SCD Type 2 logic for tracking historical changes. |
| language | PySpark (Python) |
| spark_pool | starter-pool (Medium, 8 nodes) |
| source_tables | bronze_lakehouse.sap_master.material_master, bronze_lakehouse.epicor_master.part_master |
| target_tables | silver_lakehouse.master.stg_material_sap, silver_lakehouse.master.stg_material_epicor, silver_lakehouse.master.material_xref |
| average_duration_sec | 420 |
| developer | data-engineer-1@acme-mfg.com |
| last_execution | 2025-03-15T07:05:00Z |
| version_control | Azure DevOps: main/notebooks/bronze_to_silver/nb_material_master.py |

### Notebook Inventory

| Notebook Name | Purpose | Source Zone | Target Zone | Avg Duration |
|--------------|---------|-------------|-------------|-------------|
| nb_bronze_to_silver_material_master | Unify SAP+Epicor materials | Bronze | Silver | 7 min |
| nb_bronze_to_silver_work_orders | Unify SAP+Epicor work orders | Bronze | Silver | 12 min |
| nb_bronze_to_silver_financial | Cleanse financial postings | Bronze | Silver | 18 min |
| nb_bronze_to_silver_quality | Standardize QC inspections | Bronze | Silver | 5 min |
| nb_bronze_to_silver_iot_aggregate | Aggregate sensor telemetry (1-min windows) | Bronze | Silver | 15 min |
| nb_bronze_to_silver_welding | Aggregate weld run parameters | Bronze | Silver | 8 min |
| nb_silver_to_gold_dim_material | Build material dimension (SCD2) | Silver | Gold | 6 min |
| nb_silver_to_gold_dim_customer | Build customer dimension (SCD2) | Silver | Gold | 4 min |
| nb_silver_to_gold_fact_production | Build production run fact | Silver | Gold | 10 min |
| nb_silver_to_gold_fact_oee | Calculate OEE metrics | Silver | Gold | 8 min |
| nb_silver_to_gold_fact_quality | Build quality inspection fact | Silver | Gold | 5 min |
| nb_data_quality_checks | Run ISL-06 quality rules | All zones | Quality metrics | 12 min |

## Fabric Semantic Model Metadata

### Production Efficiency Model

| Attribute | Value |
|-----------|-------|
| item_id | sm-d0e1f2a3-b4c5-6d7e |
| item_type | SEMANTIC_MODEL |
| item_name | sm_production_efficiency |
| display_name | Production Efficiency Model |
| workspace | prod-data-analytics |
| description | Star schema semantic model covering production runs, equipment OEE, quality metrics, and yield analysis across all 5 plants. Powers the Production Dashboard and Executive Scorecard. |
| storage_mode | DIRECT_LAKE |
| table_count | 12 |
| measure_count | 45 |
| relationship_count | 15 |
| calculated_column_count | 8 |
| calculation_group_count | 2 (Time Intelligence, Comparison) |
| model_size_bytes | 524,288,000 (500 MB) |
| refresh_schedule | Every 4 hours (6 AM - 10 PM UTC) |
| last_refresh | 2025-03-15T14:00:00Z |
| last_refresh_duration_sec | 45 |
| source_lakehouse | gold_lakehouse |
| source_tables | fact_production_run, fact_oee, fact_quality_inspection, fact_weld_run, dim_material, dim_equipment, dim_plant, dim_production_line, dim_date, dim_shift, dim_work_order, dim_operator |
| data_owner | ops-director@acme-mfg.com |
| developer | bi-engineer-1@acme-mfg.com |
| rls_enabled | true |
| rls_roles | PlantManager (filtered by plant_code), RegionalDirector (filtered by region), Executive (all data) |
| ols_enabled | false |
| endorsement | CERTIFIED |
| downstream_reports | [rpt_production_dashboard, rpt_executive_scorecard, rpt_plant_scorecard] |

**Model Tables:**

| Table | Type | Source | Row Count | Relationships |
|-------|------|--------|-----------|---------------|
| fact_production_run | Fact | gold.production.fact_production_run | 3,180,000 | -> dim_material, dim_equipment, dim_plant, dim_date, dim_shift, dim_work_order |
| fact_oee | Fact | gold.production.fact_oee | 2,400,000 | -> dim_equipment, dim_plant, dim_date, dim_shift |
| fact_quality_inspection | Fact | gold.quality.fact_inspection | 12,450,000 | -> dim_material, dim_date |
| fact_weld_run | Fact | silver.welding.fact_weld_run | 45,200,000 | -> dim_material, dim_equipment, dim_date |
| dim_material | Dimension | gold.master.dim_material | 412,850 | (referenced by all facts) |
| dim_equipment | Dimension | gold.master.dim_equipment | 2,800 | (referenced by production + OEE) |
| dim_plant | Dimension | gold.master.dim_plant | 5 | (referenced by all facts) |
| dim_production_line | Dimension | gold.master.dim_production_line | 45 | (referenced by production) |
| dim_date | Dimension | gold.master.dim_date | 3,652 | (referenced by all facts) |
| dim_shift | Dimension | gold.master.dim_shift | 12 | (referenced by production + OEE) |
| dim_work_order | Dimension | gold.production.dim_work_order | 850,000 | (referenced by production) |
| dim_operator | Dimension | gold.master.dim_operator | 1,200 | (referenced by production) |

**Key DAX Measures:**

| Measure | DAX Expression | Description |
|---------|---------------|-------------|
| OEE % | `[Availability %] * [Performance %] * [Quality %]` | Overall Equipment Effectiveness |
| Availability % | `DIVIDE([Planned Run Time] - [Downtime], [Planned Run Time])` | Equipment availability ratio |
| Performance % | `DIVIDE([Actual Output], [Theoretical Output])` | Performance efficiency ratio |
| Quality % | `DIVIDE([Good Units], [Total Units Produced])` | First pass quality ratio |
| Yield % | `DIVIDE([Good Output Qty], [Input Qty])` | Production yield percentage |
| Cycle Time Avg | `AVERAGE(fact_production_run[cycle_time_seconds])` | Average cycle time in seconds |
| Scrap Rate % | `DIVIDE([Scrap Qty], [Total Produced Qty])` | Scrap percentage |

## Fabric Eventstream Metadata

### IoT Telemetry Eventstream

| Attribute | Value |
|-----------|-------|
| item_id | es-e1f2a3b4-c5d6-7e8f |
| item_type | EVENTSTREAM |
| item_name | es_iot_sensor_telemetry |
| display_name | IoT Sensor Telemetry Stream |
| workspace | prod-iot-streaming |
| description | Real-time sensor telemetry ingestion from Azure IoT Hub. Receives approximately 2,500 messages/second from temperature, vibration, pressure, and flow sensors. Routes to Bronze lakehouse and KQL database for real-time alerting. |
| source | Azure IoT Hub (iot-hub-prod-eastus2) |
| source_consumer_group | fabric-eventstream |
| destinations | bronze_lakehouse.iot.sensor_telemetry_raw (Delta), kql_realtime_monitoring |
| avg_throughput_msg_sec | 2,500 |
| avg_message_size_bytes | 512 |
| schema_format | JSON |
| data_owner | iot-platform-lead@acme-mfg.com |
| developer | iot-engineer-1@acme-mfg.com |

**Eventstream Message Schema:**

```json
{
  "device_id": "SENSOR-P1-L3-TEMP-001",
  "plant_code": "P100",
  "line_code": "L3",
  "sensor_type": "temperature",
  "value": 185.7,
  "unit": "celsius",
  "quality": "good",
  "timestamp": "2025-03-15T14:30:00.123Z"
}
```

## OneLake Folder Hierarchy

### Complete OneLake Structure

```
onelake.dfs.fabric.microsoft.com/
├── prod-data-engineering/
│   ├── bronze_lakehouse.Lakehouse/
│   │   ├── Tables/
│   │   │   ├── sap_master/
│   │   │   │   ├── material_master/          (Delta - 287K rows)
│   │   │   │   ├── plant_master/             (Delta - 5 rows)
│   │   │   │   ├── vendor_master/            (Delta - 12K rows)
│   │   │   │   └── customer_master/          (Delta - 45K rows)
│   │   │   ├── sap_production/
│   │   │   │   ├── order_header/             (Delta - 850K rows)
│   │   │   │   ├── order_item/               (Delta - 3.2M rows)
│   │   │   │   └── routing_operations/       (Delta - 5.4M rows)
│   │   │   ├── sap_finance/
│   │   │   │   ├── journal_header/           (Delta - 15M rows)
│   │   │   │   └── journal_line/             (Delta - 65M rows)
│   │   │   ├── epicor_master/
│   │   │   │   ├── part_master/              (Delta - 143K rows)
│   │   │   │   ├── customer/                 (Delta - 28K rows)
│   │   │   │   └── vendor/                   (Delta - 8K rows)
│   │   │   ├── epicor_production/
│   │   │   │   ├── job_header/               (Delta - 620K rows)
│   │   │   │   └── job_operation/            (Delta - 2.8M rows)
│   │   │   ├── iot/
│   │   │   │   ├── sensor_registry/          (Delta - 2.5K rows)
│   │   │   │   └── sensor_telemetry_raw/     (Delta - 8.6B rows, partitioned)
│   │   │   └── mes/
│   │   │       ├── production_run/           (Delta - 3.2M rows)
│   │   │       ├── downtime_event/           (Delta - 890K rows)
│   │   │       └── cycle_count/              (Delta - 125M rows)
│   │   └── Files/
│   │       ├── staging/                      (temporary landing)
│   │       ├── archive/                      (processed raw files)
│   │       ├── rejected/                     (failed validations)
│   │       ├── manual-uploads/               (user-uploaded files)
│   │       └── schemas/                      (schema definition files)
│   └── silver_lakehouse.Lakehouse/
│       └── Tables/
│           ├── master/                       (unified dimensions staging)
│           ├── production/                   (production facts staging)
│           ├── finance/                      (financial data staging)
│           ├── quality/                      (quality data staging)
│           ├── supply_chain/                 (supply chain staging)
│           ├── welding/                      (weld run aggregations)
│           └── iot_aggregated/               (sensor 1-min aggregates)
├── prod-data-analytics/
│   ├── gold_lakehouse.Lakehouse/
│   │   └── Tables/
│   │       ├── master/                       (dim_material, dim_customer, dim_vendor, dim_plant, dim_equipment, dim_date)
│   │       ├── production/                   (fact_production_run, fact_oee, dim_work_order)
│   │       ├── finance/                      (fact_gl_balance, fact_journal_entry)
│   │       ├── quality/                      (fact_inspection, fact_weld_quality)
│   │       ├── supply_chain/                 (fact_purchase_order, fact_goods_receipt, fact_shipment)
│   │       └── product/                      (dim_bom_header, dim_bom_component)
│   └── analytics_warehouse.Warehouse/
│       └── (views, stored procedures, materialized tables)
└── prod-iot-streaming/
    ├── bronze_iot_lakehouse.Lakehouse/       (real-time landing)
    └── kql_realtime_monitoring.KQLDatabase/  (real-time alerting)
```

## Purview Scanning of Fabric Assets

### Scan Configuration

| Setting | Value |
|---------|-------|
| Purview Account | purview-acme-prod |
| Fabric Connection | Managed identity (Purview -> Fabric) |
| Scan Name | scan-fabric-production-daily |
| Scope | All 3 production workspaces |
| Scan Rule Set | ISL-02-Fabric-Custom (includes all ISL-04 classification rules) |
| Schedule | Daily at 01:00 UTC |
| Classification | Auto-classify enabled (PII, PHI, Financial, ITAR) |
| Lineage | Enabled for pipelines, notebooks (via OpenLineage), semantic models |
| Resource Set | Enabled (groups partitioned Delta files as single asset) |

### Purview Discovery Results

| Asset Type | Count Discovered | Enriched | Certified |
|-----------|-----------------|----------|-----------|
| Lakehouse Tables | 187 | 165 (88%) | 38 (Gold only) |
| Warehouse Tables | 15 | 15 (100%) | 12 (80%) |
| Warehouse Views | 28 | 28 (100%) | 28 (100%) |
| Pipelines | 12 | 12 (100%) | 12 (100%) |
| Notebooks | 12 | 10 (83%) | 8 (67%) |
| Semantic Models | 4 | 4 (100%) | 4 (100%) |
| Reports | 15 | 12 (80%) | 10 (67%) |
| Eventstreams | 2 | 2 (100%) | 2 (100%) |
| Total | 275 | 248 (90%) | 114 (41%) |

## Cross-References

| Document | Usage in This Example |
|----------|----------------------|
| ISL-02: Technical Metadata Schema | All Fabric asset metadata follows ISL-02 schema |
| ISL-02: Data Catalog Governance | Purview curation workflow applied to Fabric assets |
| ISL-02: Data Lineage Requirements | Pipeline and notebook lineage captured per ISL-02 |
| ISL-02: Metadata Integration Patterns | Purview Fabric connector configuration shown |
| ISL-03: Naming Conventions | Workspace, lakehouse, pipeline, table naming per ISL-03 |
| ISL-04: Data Classification | Auto-classification applied via Purview scans |
| ISL-05: Integration Patterns | Pipeline patterns aligned to ISL-05 |
| ISL-06: Data Quality Framework | Quality scores referenced on asset metadata |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial example — Fabric OneLake metadata for Acme Manufacturing |

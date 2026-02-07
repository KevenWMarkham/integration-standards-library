# Pipeline & Dataflow Naming Standards
> Module: ISL-03 | Version: 1.0 | Adaptation Effort: 2-3 hrs | Dependencies: ISL-03 abbreviation-dictionary, ISL-05 Integration Patterns

## Purpose

This standard defines deterministic, self-documenting naming patterns for pipelines, notebooks, dataflows, and all orchestration artifacts across Microsoft Fabric Data Factory, Fabric notebooks, and Azure Data Factory. Pipeline and dataflow names are critical operational identifiers -- operations teams monitor them in run history, engineers debug them during failures, and governance tools catalog them for lineage tracking. A clear naming convention at this level enables immediate identification of what a pipeline does, what data it moves, how often it runs, and which version is deployed.

## Scope

### In Scope
- Pipeline naming patterns for Fabric Data Factory and Azure Data Factory
- Notebook naming patterns for Fabric Spark notebooks
- Dataflow naming patterns for Fabric Dataflow Gen2
- Orchestration hierarchy: master pipelines, child pipelines, and utility pipelines
- Activity naming conventions within pipelines
- Frequency and schedule indicators
- Version tracking conventions
- Source-target encoding using the abbreviation dictionary
- Fabric Data Factory specific patterns (linked services, datasets, triggers)
- Anti-patterns and prohibited naming practices

### Out of Scope
- Pipeline design patterns and architecture (see ISL-05 Integration Patterns)
- Pipeline parameterization and configuration (operational concern, not naming)
- Monitoring and alerting configuration (see ISL-06 Metadata & Lineage)
- Database, table, and column naming (see other ISL-03 templates)
- Infrastructure resource naming for Data Factory instances (see `templates/infrastructure-resource-naming.md`)

---

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default Value | Client Value | Notes |
|-----------|---------------|--------------|-------|
| Primary Orchestration Tool | Fabric Data Factory | `[CONFIRM_OR_OVERRIDE]` | Some clients use Azure Data Factory or Synapse Pipelines |
| Notebook Runtime | Fabric Spark | `[CONFIRM_OR_OVERRIDE]` | Some clients use Synapse Spark or Databricks |
| Source System Abbreviations | SAP, Epicor, IoT Hub | `[CLIENT_SOURCES]` | Map client source systems to abbreviation dictionary |
| Target Environment Naming | Fabric lakehouse/warehouse | `[CONFIRM_OR_OVERRIDE]` | Some clients target Azure SQL or Synapse |
| Frequency Vocabulary | daily, hourly, event, streaming, adhoc | `[CONFIRM_OR_OVERRIDE]` | Confirm schedule terminology with client ops team |
| Version Tracking Strategy | `_v1`, `_v2` suffix | `[CONFIRM_OR_OVERRIDE]` | Some clients prefer semantic versioning in metadata |
| Maximum Pipeline Name Length | 80 characters (recommended) | `[CONFIRM_OR_OVERRIDE]` | Platform max varies: Fabric 256, ADF 260 |
| Pipeline Folder Structure | By domain, then by layer | `[CONFIRM_OR_OVERRIDE]` | Folder hierarchy within Data Factory |
| Master Pipeline Naming | `pl_master_{domain}_{frequency}` | `[CONFIRM_OR_OVERRIDE]` | Some clients prefer `orch_` prefix |
| Naming Linter Integration | Pre-commit hook (Python) | `[CONFIRM_OR_OVERRIDE]` | CI/CD naming enforcement mechanism |

---

## 1. Pipeline Naming

### 1.1 Standard Pipeline Pattern

```
pl_{source}_{target}_{frequency}_{version}
```

### 1.2 Pattern Components

| Segment | Description | Allowed Values | Required |
|---------|-------------|----------------|----------|
| `pl` | Resource type prefix -- pipeline | Fixed literal | Yes |
| `{source}` | Source system or domain | From abbreviation dictionary (e.g., `sap`, `epicor`, `iot`, `sf`) | Yes |
| `{target}` | Target layer or system | `bronze`, `silver`, `gold`, `warehouse`, `archive`, or system abbreviation | Yes |
| `{frequency}` | Execution frequency | `daily`, `hourly`, `event`, `streaming`, `adhoc`, `nr`, `wkly`, `mthly` | Yes |
| `{version}` | Version identifier | `v1`, `v2`, `v3`, etc. | Yes |

### 1.3 Pipeline Examples

| Pipeline Name | Source | Target | Frequency | Version | Description |
|--------------|--------|--------|-----------|---------|-------------|
| `pl_sap_bronze_daily_v1` | SAP | Bronze lakehouse | Daily | v1 | Daily full/delta extract from SAP to bronze |
| `pl_sap_bronze_hourly_v1` | SAP | Bronze lakehouse | Hourly | v1 | Hourly CDC extract from SAP to bronze |
| `pl_epicor_bronze_daily_v1` | Epicor | Bronze lakehouse | Daily | v1 | Daily extract from Epicor to bronze |
| `pl_epicor_bronze_daily_v2` | Epicor | Bronze lakehouse | Daily | v2 | Updated Epicor extract with new entities |
| `pl_iot_bronze_streaming_v1` | IoT Hub | Bronze lakehouse | Streaming | v1 | Real-time sensor data ingestion |
| `pl_sf_bronze_daily_v1` | Salesforce | Bronze lakehouse | Daily | v1 | Daily Salesforce CRM data extract |
| `pl_bronze_silver_daily_v1` | Bronze | Silver lakehouse | Daily | v1 | Bronze-to-silver cleansing pipeline |
| `pl_silver_gold_daily_v1` | Silver | Gold lakehouse | Daily | v1 | Silver-to-gold business logic pipeline |
| `pl_gold_warehouse_daily_v1` | Gold | Warehouse | Daily | v1 | Gold-to-warehouse dimensional load |
| `pl_file_bronze_event_v1` | File/SFTP | Bronze lakehouse | Event | v1 | Event-triggered file ingestion |
| `pl_api_bronze_hourly_v1` | REST API | Bronze lakehouse | Hourly | v1 | Hourly API polling extraction |
| `pl_d365_bronze_daily_v1` | Dynamics 365 | Bronze lakehouse | Daily | v1 | Daily D365 finance extract |
| `pl_pisvr_bronze_nr_v1` | OSIsoft PI | Bronze lakehouse | Near-real-time | v1 | Near-real-time historian data ingestion |
| `pl_shrpt_bronze_wkly_v1` | SharePoint | Bronze lakehouse | Weekly | v1 | Weekly SharePoint document metadata extract |
| `pl_bronze_archive_mthly_v1` | Bronze | Archive storage | Monthly | v1 | Monthly bronze data archival |
| `pl_sap_warehouse_adhoc_v1` | SAP | Warehouse | Ad-hoc | v1 | On-demand SAP data reload |

### 1.4 Multi-Source Pipeline Naming

When a pipeline extracts from multiple sources within the same system, use the system abbreviation:

| Pipeline Name | Description |
|--------------|-------------|
| `pl_sap_bronze_daily_v1` | All SAP module extracts (MM, PP, FI, SD) in one orchestrated pipeline |
| `pl_epicor_bronze_daily_v1` | All Epicor module extracts in one pipeline |

When a pipeline extracts from a specific module, append the module:

| Pipeline Name | Description |
|--------------|-------------|
| `pl_sap_mm_bronze_daily_v1` | SAP Materials Management only |
| `pl_sap_fi_bronze_daily_v1` | SAP Finance only |
| `pl_sap_pp_bronze_daily_v1` | SAP Production Planning only |

---

## 2. Notebook Naming

### 2.1 Standard Notebook Pattern

```
nb_{domain}_{process}_{type}
```

### 2.2 Pattern Components

| Segment | Description | Allowed Values | Required |
|---------|-------------|----------------|----------|
| `nb` | Resource type prefix -- notebook | Fixed literal | Yes |
| `{domain}` | Business domain or scope | From domain taxonomy (e.g., `mfg`, `fin`, `scm`, `shared`) | Yes |
| `{process}` | Process or transformation name | Descriptive process name (e.g., `transform`, `validate`, `cleanse`, `enrich`) | Yes |
| `{type}` | Target layer or notebook type | `bronze`, `silver`, `gold`, `utility`, `common`, `test`, `model`, `explore`, `migrate` | Yes |

### 2.3 Notebook Examples

| Notebook Name | Domain | Process | Type | Description |
|--------------|--------|---------|------|-------------|
| `nb_mfg_transform_silver` | Manufacturing | Transform | Silver | Manufacturing bronze-to-silver transformations |
| `nb_mfg_oee_calc_gold` | Manufacturing | OEE calculation | Gold | OEE metric calculation from silver to gold |
| `nb_mfg_spc_analysis_gold` | Manufacturing | SPC analysis | Gold | Statistical process control analysis |
| `nb_mfg_bom_explosion_gold` | Manufacturing | BOM explosion | Gold | Recursive BOM explosion processing |
| `nb_fin_transform_silver` | Finance | Transform | Silver | Finance data cleansing and conforming |
| `nb_fin_reconcile_gold` | Finance | Reconciliation | Gold | Financial data reconciliation logic |
| `nb_scm_transform_silver` | Supply Chain | Transform | Silver | Supply chain data transformations |
| `nb_scm_inventory_calc_gold` | Supply Chain | Inventory calculation | Gold | Inventory position and aging calculations |
| `nb_qms_validate_silver` | Quality | Validation | Silver | Quality inspection data validation |
| `nb_iot_transform_silver` | IoT | Transform | Silver | Sensor data transformation and normalization |
| `nb_iot_anomaly_detect_model` | IoT | Anomaly detection | Model | IoT anomaly detection ML model execution |
| `nb_scm_demand_forecast_model` | Supply Chain | Demand forecasting | Model | ML demand forecasting model training |
| `nb_qms_defect_analysis_explore` | Quality | Defect analysis | Explore | Exploratory defect data analysis |
| `nb_shared_dedup_utility` | Shared | Deduplication | Utility | Reusable deduplication logic |
| `nb_shared_hash_gen_utility` | Shared | Hash generation | Utility | Reusable row hash generation |
| `nb_shared_scd_merge_utility` | Shared | SCD merge | Utility | Reusable SCD Type 2 merge logic |
| `nb_shared_dq_check_utility` | Shared | Data quality check | Utility | Reusable data quality validation framework |
| `nb_shared_date_dim_common` | Shared | Date dimension | Common | Enterprise date dimension generation |
| `nb_shared_schema_evolve_utility` | Shared | Schema evolution | Utility | Delta table schema evolution handler |
| `nb_shared_data_profile_utility` | Shared | Data profiling | Utility | Reusable data profiling functions |
| `nb_mfg_integration_test` | Manufacturing | Integration test | Test | Manufacturing pipeline integration tests |
| `nb_fin_gl_migration_migrate` | Finance | GL migration | Migrate | One-time GL data migration script |

---

## 3. Dataflow Naming

### 3.1 Standard Dataflow Pattern

```
df_{domain}_{process}_{layer}
```

### 3.2 Pattern Components

| Segment | Description | Allowed Values | Required |
|---------|-------------|----------------|----------|
| `df` | Resource type prefix -- dataflow | Fixed literal | Yes |
| `{domain}` | Business domain | From domain taxonomy | Yes |
| `{process}` | Transformation process | Descriptive process name (e.g., `cleanse`, `conform`, `enrich`, `aggregate`, `merge`) | Yes |
| `{layer}` | Target medallion layer | `bronze`, `silver`, `gold` | Yes |

### 3.3 Dataflow Examples

| Dataflow Name | Domain | Process | Layer | Description |
|--------------|--------|---------|-------|-------------|
| `df_mfg_cleanse_silver` | Manufacturing | Cleanse | Silver | Manufacturing data cleansing dataflow |
| `df_mfg_enrich_gold` | Manufacturing | Enrich | Gold | Manufacturing data enrichment for gold |
| `df_fin_cleanse_silver` | Finance | Cleanse | Silver | Finance data cleansing and validation |
| `df_fin_aggregate_gold` | Finance | Aggregate | Gold | Financial aggregation for reporting |
| `df_scm_cleanse_silver` | Supply Chain | Cleanse | Silver | Supply chain data cleansing |
| `df_scm_inventory_gold` | Supply Chain | Inventory | Gold | Inventory position calculation dataflow |
| `df_sal_cleanse_silver` | Sales | Cleanse | Silver | Sales data cleansing and conforming |
| `df_sal_forecast_gold` | Sales | Forecast | Gold | Sales forecast calculation dataflow |
| `df_hcm_cleanse_silver` | Human Capital | Cleanse | Silver | HR data cleansing and masking |
| `df_shared_conform_silver` | Shared | Conform | Silver | Cross-domain key conforming |
| `df_shared_reference_silver` | Shared | Reference | Silver | Reference data standardization |
| `df_iot_validate_silver` | IoT | Validate | Silver | Sensor data validation against thresholds |
| `df_qms_defect_classify_gold` | Quality | Defect classification | Gold | Quality defect classification dataflow |

---

## 4. Orchestration Hierarchy

Pipelines are organized into a three-tier hierarchy for maintainability and reuse.

### 4.1 Hierarchy Levels

| Level | Prefix Pattern | Purpose | Description |
|-------|---------------|---------|-------------|
| Master | `pl_master_{domain}_{frequency}` | Top-level orchestrator | Coordinates all child pipelines for a domain/frequency; contains no data movement logic |
| Child | `pl_{source}_{target}_{frequency}_{version}` | Data movement | Individual extraction, transformation, or load pipeline |
| Utility | `pl_util_{function}_{version}` | Reusable operations | Shared utility pipelines (cleanup, notification, validation) |

### 4.2 Master Pipeline Examples

| Pipeline Name | Description |
|--------------|-------------|
| `pl_master_mfg_daily` | Orchestrates all daily manufacturing pipelines (SAP extract, transform, load) |
| `pl_master_mfg_hourly` | Orchestrates all hourly manufacturing pipelines (CDC, near-real-time) |
| `pl_master_fin_daily` | Orchestrates all daily finance pipelines |
| `pl_master_scm_daily` | Orchestrates all daily supply chain pipelines |
| `pl_master_iot_streaming` | Orchestrates all streaming IoT pipelines |
| `pl_master_shared_daily` | Orchestrates all daily cross-domain reference data pipelines |
| `pl_master_all_daily` | Top-level orchestrator for all daily pipelines across all domains |
| `pl_master_bronze_daily` | Layer-oriented orchestrator: all daily bronze ingestion |
| `pl_master_silver_daily` | Layer-oriented orchestrator: all daily silver transformations |
| `pl_master_gold_daily` | Layer-oriented orchestrator: all daily gold aggregations |

### 4.3 Utility Pipeline Examples

| Pipeline Name | Description |
|--------------|-------------|
| `pl_util_cleanup_stg_v1` | Cleans up staging tables after successful pipeline execution |
| `pl_util_notify_failure_v1` | Sends failure notification via email, Teams, or PagerDuty |
| `pl_util_notify_success_v1` | Sends success notification with run metrics |
| `pl_util_validate_row_count_v1` | Validates row counts between source and target |
| `pl_util_archive_bronze_v1` | Archives aged bronze data to cold storage |
| `pl_util_refresh_watermark_v1` | Updates pipeline watermark control table |
| `pl_util_schema_drift_check_v1` | Detects and reports schema drift in source systems |
| `pl_util_recon_source_target_v1` | Runs source-to-target reconciliation checks |

### 4.4 Orchestration Execution Flow

```
pl_master_mfg_daily
  +-- pl_sap_bronze_daily_v1           (extract SAP to bronze)
  +-- pl_epicor_bronze_daily_v1        (extract Epicor to bronze)
  +-- pl_util_validate_row_count_v1    (validate bronze row counts)
  +-- nb_mfg_transform_silver          (notebook: bronze to silver)
  +-- pl_util_validate_row_count_v1    (validate silver row counts)
  +-- nb_mfg_oee_calc_gold             (notebook: silver to gold)
  +-- pl_gold_warehouse_daily_v1       (load gold to warehouse)
  +-- pl_util_notify_success_v1        (success notification)
  +-- pl_util_cleanup_stg_v1           (cleanup staging tables)
```

---

## 5. Activity Naming Within Pipelines

Activities within a pipeline use a prefix that indicates the operation type, followed by a descriptive name.

### 5.1 Activity Prefix Conventions

| Prefix | Activity Type | Description | Example |
|--------|--------------|-------------|---------|
| `copy_` | Copy Data | Data copy from source to target | `copy_sap_material_master` |
| `xfrm_` | Transformation | Data transformation logic | `xfrm_cleanse_customer` |
| `val_` | Validation | Data quality validation | `val_row_count_check` |
| `merge_` | Merge / Upsert | Merge into target table | `merge_material_silver` |
| `lookup_` | Lookup | Reference data lookup | `lookup_pipeline_watermark` |
| `exec_` | Execute | Execute notebook or stored procedure | `exec_nb_mfg_transform` |
| `wait_` | Wait | Delay or wait for condition | `wait_source_file_ready` |
| `if_` | Condition | Conditional branching | `if_delta_records_exist` |
| `foreach_` | Iteration | Loop over collection | `foreach_sap_table` |
| `set_` | Set Variable | Variable assignment | `set_current_watermark` |
| `filter_` | Filter | Filter activity results | `filter_changed_records` |
| `switch_` | Switch | Multi-branch routing | `switch_source_type` |
| `fail_` | Fail | Explicit failure handling | `fail_invalid_config` |
| `log_` | Logging | Audit log insertion | `log_pipeline_start` |
| `notify_` | Notification | Send notification | `notify_team_on_failure` |
| `delete_` | Delete | Delete data or files | `delete_stg_tables` |
| `archive_` | Archive | Move to archive storage | `archive_processed_files` |
| `web_` | Web Activity | HTTP calls for APIs or webhooks | `web_trigger_downstream` |
| `script_` | Script | Execute SQL script | `script_merge_dimension` |

### 5.2 Activity Naming Examples

| Activity Name | Pipeline | Description |
|--------------|----------|-------------|
| `copy_sap_material_master` | `pl_sap_bronze_daily_v1` | Copy material master from SAP to bronze |
| `copy_sap_work_order_header` | `pl_sap_bronze_daily_v1` | Copy work order headers from SAP |
| `copy_sap_gl_line_item` | `pl_sap_bronze_daily_v1` | Copy GL line items from SAP |
| `lookup_last_watermark` | `pl_sap_bronze_daily_v1` | Look up last successful extract timestamp |
| `set_current_watermark` | `pl_sap_bronze_daily_v1` | Set current run watermark |
| `foreach_sap_table` | `pl_sap_bronze_daily_v1` | Iterate over configured SAP table list |
| `val_row_count_bronze` | `pl_sap_bronze_daily_v1` | Validate extracted row counts |
| `exec_nb_mfg_transform` | `pl_bronze_silver_daily_v1` | Execute manufacturing transform notebook |
| `merge_material_silver` | `pl_bronze_silver_daily_v1` | Merge material data into silver table |
| `merge_work_order_silver` | `pl_bronze_silver_daily_v1` | Merge work order data into silver |
| `xfrm_calculate_oee` | `pl_silver_gold_daily_v1` | Calculate OEE metrics |
| `xfrm_aggregate_production` | `pl_silver_gold_daily_v1` | Aggregate production output |
| `if_delta_records_exist` | `pl_sap_bronze_hourly_v1` | Check if CDC returned changed records |
| `log_pipeline_start` | `pl_master_mfg_daily` | Log pipeline execution start to audit table |
| `log_pipeline_end` | `pl_master_mfg_daily` | Log pipeline execution end to audit table |
| `notify_ops_on_failure` | `pl_master_mfg_daily` | Send failure alert to operations team |
| `delete_stg_sap_material` | `pl_util_cleanup_stg_v1` | Clean up SAP material staging table |
| `archive_bronze_30day` | `pl_util_archive_bronze_v1` | Archive bronze data older than 30 days |

---

## 6. Frequency Indicators

Frequency indicators encode the execution schedule into the pipeline name.

| Indicator | Meaning | Typical Schedule | Use Case |
|-----------|---------|-----------------|----------|
| `streaming` | Continuous real-time | Always running | IoT sensor ingestion, event streams |
| `nr` | Near-real-time (1-15 min) | Every 1-15 minutes | CDC replication, high-priority feeds |
| `hourly` | Hourly | Every 1-4 hours | Frequent transactional updates |
| `daily` | Daily | Once per day (typically overnight) | Most common batch frequency |
| `wkly` | Weekly | Once per week | Periodic summaries, weekly reports |
| `mthly` | Monthly | Once per month | Monthly close, period-end processing |
| `qtrly` | Quarterly | Once per quarter | Quarterly reporting, compliance |
| `yrly` | Yearly | Once per year | Annual processing, archival |
| `event` | Event-triggered | On file arrival or API event | File-based ingestion, webhook triggers |
| `adhoc` | On-demand | Manual trigger only | Data reloads, backfills, one-time extracts |

**Rules:**
- Every pipeline must include a frequency indicator -- this is not optional
- Use the most specific frequency available (e.g., `hourly` not `frequent`)
- Streaming pipelines should use `streaming`, not `rt` or `realtime`
- When a pipeline runs at multiple frequencies, create separate pipelines per frequency
- Master pipelines use the unabbreviated form of common frequencies (`daily`, `hourly`, `streaming`)

---

## 7. Version Tracking

### 7.1 Version Suffix Convention

```
_v{n}
```

Where `{n}` is a positive integer starting at 1.

| Rule | Specification |
|------|--------------|
| Format | `_v1`, `_v2`, `_v3`, etc. |
| Starting version | Always `_v1` |
| Increment | Increment by 1 for each breaking change |
| Non-breaking changes | Do not increment version for parameter changes, bug fixes, or performance tuning |
| Breaking changes | Increment version for schema changes, source changes, or logic changes |
| Deprecation | Keep old version pipeline with `[DEPRECATED]` in description; do not delete immediately |
| Maximum active versions | 2 concurrent versions (current + previous for rollback) |
| No zero-padding | Use `v1`, not `v01` or `v001` |

### 7.2 When to Increment Version

| Change Type | Increment Version? | Example |
|-------------|-------------------|---------|
| New source table added | Yes | `pl_sap_bronze_daily_v1` to `pl_sap_bronze_daily_v2` |
| Target schema changed | Yes | Column additions/removals in target table |
| Source connection changed | Yes | SAP ECC to S/4HANA migration |
| Pipeline logic rewrite | Yes | Complete transformation logic change |
| Bug fix in existing logic | No | Fix null handling in existing transformation |
| Performance optimization | No | Parallelism tuning, partition optimization |
| Parameter value change | No | Watermark date update, batch size change |
| Schedule change | No | Moving from 6am to 4am execution |

### 7.3 Version Transition Example

```
Phase 1 (Initial deployment):
  pl_sap_bronze_daily_v1    <-- ACTIVE

Phase 2 (Schema change -- new tables added):
  pl_sap_bronze_daily_v1    <-- DEPRECATED (kept for rollback)
  pl_sap_bronze_daily_v2    <-- ACTIVE

Phase 3 (Stable -- remove deprecated):
  pl_sap_bronze_daily_v2    <-- ACTIVE (v1 archived/deleted)
```

---

## 8. Source-Target Encoding

Pipeline names encode the source and target using abbreviations from the ISL-03 abbreviation dictionary.

### 8.1 Source System Abbreviations (Common)

| Abbreviation | System | Notes |
|-------------|--------|-------|
| `sap` | SAP (all modules) | SAP ECC, S/4HANA |
| `epic` | Epicor (all modules) | Epicor Kinetic, Prophet 21 |
| `d365` | Dynamics 365 | D365 F&O, D365 BC |
| `sf` | Salesforce | CRM, Marketing Cloud |
| `orcl` | Oracle | Oracle EBS, JD Edwards |
| `pisvr` | OSIsoft PI | Historian / time-series |
| `iot` | Azure IoT Hub | IoT device telemetry |
| `mqtt` | MQTT Broker | IoT messaging protocol |
| `file` | File-based source | CSV, Excel, JSON, Parquet from SFTP or blob |
| `api` | REST API | Generic API source |
| `shrpt` | SharePoint | Document and list data |
| `svcnw` | ServiceNow | ITSM data |
| `wday` | Workday | HR and finance data |
| `kepw` | Kepware | OPC-UA / OT gateway data |

### 8.2 Target Abbreviations

| Abbreviation | Target | Notes |
|-------------|--------|-------|
| `bronze` | Bronze lakehouse | Raw ingestion layer |
| `silver` | Silver lakehouse | Cleansed / conformed layer |
| `gold` | Gold lakehouse | Business-ready layer |
| `warehouse` | Fabric warehouse | Dimensional model serving layer |
| `archive` | Archive storage | Cold storage / compliance retention |
| `sqldb` | Azure SQL Database | Operational database target |
| `adls` | Azure Data Lake Storage | File-based target |
| `export` | External system | Outbound data delivery |

---

## 9. Fabric Data Factory Specific Patterns

### 9.1 Linked Service Naming

```
ls_{system}_{environment}
```

| Linked Service Name | System | Environment | Description |
|--------------------|--------|-------------|-------------|
| `ls_sap_prd` | SAP | Production | SAP production connection |
| `ls_sap_dev` | SAP | Development | SAP development connection |
| `ls_epicor_prd` | Epicor | Production | Epicor production connection |
| `ls_adls_bronze_prd` | ADLS | Production | Bronze lakehouse storage connection |
| `ls_fabric_wh_prd` | Fabric WH | Production | Fabric warehouse connection |
| `ls_keyvault_prd` | Key Vault | Production | Key Vault for secret retrieval |

### 9.2 Dataset Naming

```
ds_{system}_{entity}_{format}
```

| Dataset Name | System | Entity | Format | Description |
|-------------|--------|--------|--------|-------------|
| `ds_sap_material_master_odata` | SAP | Material Master | OData | SAP material master via OData |
| `ds_sap_work_order_rfc` | SAP | Work Order | RFC | SAP work order via RFC call |
| `ds_epicor_job_head_rest` | Epicor | Job Head | REST | Epicor job header via REST API |
| `ds_bronze_material_delta` | Bronze | Material | Delta | Bronze lakehouse Delta table |
| `ds_file_invoice_csv` | File | Invoice | CSV | Invoice CSV file on SFTP/blob |
| `ds_file_inventory_parquet` | File | Inventory | Parquet | Inventory data in Parquet format |

### 9.3 Trigger Naming

```
tr_{schedule_or_event}_{domain}_{frequency}
```

| Trigger Name | Type | Description |
|-------------|------|-------------|
| `tr_schedule_mfg_daily` | Schedule | Daily schedule trigger for manufacturing pipelines |
| `tr_schedule_mfg_hourly` | Schedule | Hourly schedule trigger for manufacturing |
| `tr_schedule_fin_daily` | Schedule | Daily schedule trigger for finance pipelines |
| `tr_event_file_arrival_bronze` | Event | Blob storage event trigger for file arrival |
| `tr_event_iot_message_bronze` | Event | Event Hub trigger for IoT message arrival |
| `tr_tumbling_sap_cdc_hourly` | Tumbling window | Hourly tumbling window for SAP CDC |

### 9.4 Spark Job Definition Naming

```
sj_{domain}_{process}_{type}_{version}
```

| Spark Job Name | Description |
|---------------|-------------|
| `sj_mfg_transform_silver_v1` | Manufacturing silver transformation Spark job |
| `sj_iot_anomaly_detect_v1` | IoT anomaly detection Spark job |
| `sj_shared_data_quality_v1` | Shared data quality validation Spark job |
| `sj_fin_gl_reconcile_v1` | Financial GL reconciliation Spark job |

### 9.5 Eventstream Naming

```
es_{source}_{domain}_{event_type}
```

| Eventstream Name | Description |
|-----------------|-------------|
| `es_iothub_mfg_telemetry` | IoT Hub manufacturing telemetry stream |
| `es_eventhub_mfg_equipment_alert` | Equipment alert event stream |
| `es_kafka_scm_order_event` | Supply chain order event stream |
| `es_custom_qms_inspection_result` | Quality inspection result stream |

### 9.6 Pipeline Folder Structure

Organize pipelines into folders by domain and orchestration level:

```
Pipelines/
+-- _master/
|   +-- pl_master_all_daily
|   +-- pl_master_mfg_daily
|   +-- pl_master_fin_daily
+-- _utility/
|   +-- pl_util_cleanup_stg_v1
|   +-- pl_util_notify_failure_v1
|   +-- pl_util_validate_row_count_v1
+-- manufacturing/
|   +-- bronze/
|   |   +-- pl_sap_bronze_daily_v1
|   |   +-- pl_epicor_bronze_daily_v1
|   +-- silver/
|   |   +-- pl_bronze_silver_daily_v1
|   +-- gold/
|       +-- pl_silver_gold_daily_v1
+-- finance/
|   +-- bronze/
|   |   +-- pl_sap_fi_bronze_daily_v1
|   +-- silver/
|       +-- pl_fin_bronze_silver_daily_v1
+-- supply_chain/
    +-- bronze/
    |   +-- pl_sap_mm_bronze_daily_v1
    +-- silver/
        +-- pl_scm_bronze_silver_daily_v1
```

---

## 10. Error Handling Pipeline Naming

Error handling pipelines follow a consistent suffix pattern to distinguish them from normal data flow pipelines.

| Suffix | Purpose | Description |
|--------|---------|-------------|
| `_error` | Error handler | Catches and logs errors from the parent pipeline |
| `_retry` | Retry logic | Implements retry logic with exponential backoff |
| `_dead_letter` | Dead letter processing | Processes records that failed after all retries |
| `_alert` | Alerting | Sends notifications on failure |
| `_cleanup` | Cleanup | Cleans up partial loads on failure |

### Error Handling Examples

| Pipeline Name | Purpose | Triggered By |
|--------------|---------|-------------|
| `pl_sap_bronze_daily_v1_error` | Log SAP extraction errors | `pl_sap_bronze_daily_v1` failure |
| `pl_sap_bronze_daily_v1_retry` | Retry failed SAP extraction | `pl_sap_bronze_daily_v1` failure |
| `pl_master_mfg_daily_alert` | Alert manufacturing team on failure | `pl_master_mfg_daily` failure |
| `pl_iot_bronze_streaming_v1_dead_letter` | Process undeliverable IoT messages | Message processing failure |
| `pl_bronze_silver_daily_v1_cleanup` | Clean partial silver loads | `pl_bronze_silver_daily_v1` failure |
| `pl_shared_error_handler_v1` | Generic reusable error handler | Any pipeline failure |
| `pl_shared_alert_dispatch_v1` | Generic alert dispatcher | Called by error handlers |

---

## 11. Character Rules and Constraints

| Rule | Specification |
|------|--------------|
| Case | Lowercase only |
| Delimiter | Underscore (`_`) only |
| Allowed characters | `a-z`, `0-9`, `_` |
| Leading character | Must begin with a letter (the prefix satisfies this) |
| Maximum length -- Fabric Pipeline | 256 characters |
| Maximum length -- Azure Data Factory Pipeline | 260 characters |
| Maximum length -- Fabric Notebook | 256 characters |
| Recommended practical length | 30-80 characters |
| SQL reserved words | Avoid as any segment |
| Spaces | Prohibited -- never use spaces in pipeline or notebook names |

---

## 12. Complete Examples Table

| # | Artifact Name | Type | Source | Target | Frequency | Description |
|---|--------------|------|--------|--------|-----------|-------------|
| 1 | `pl_sap_bronze_daily_v1` | Pipeline | SAP | Bronze | Daily | SAP full/delta extract to bronze |
| 2 | `pl_epicor_bronze_daily_v1` | Pipeline | Epicor | Bronze | Daily | Epicor daily extract |
| 3 | `pl_iot_bronze_streaming_v1` | Pipeline | IoT Hub | Bronze | Streaming | Real-time sensor ingestion |
| 4 | `pl_sf_bronze_daily_v1` | Pipeline | Salesforce | Bronze | Daily | CRM data extract |
| 5 | `pl_file_bronze_event_v1` | Pipeline | SFTP/Blob | Bronze | Event | File arrival triggered ingestion |
| 6 | `pl_bronze_silver_daily_v1` | Pipeline | Bronze | Silver | Daily | Bronze to silver transformation |
| 7 | `pl_silver_gold_daily_v1` | Pipeline | Silver | Gold | Daily | Silver to gold aggregation |
| 8 | `pl_gold_warehouse_daily_v1` | Pipeline | Gold | Warehouse | Daily | Gold to warehouse dim load |
| 9 | `pl_master_mfg_daily` | Master pipeline | -- | -- | Daily | Manufacturing daily orchestrator |
| 10 | `pl_master_all_daily` | Master pipeline | -- | -- | Daily | Enterprise daily orchestrator |
| 11 | `pl_util_cleanup_stg_v1` | Utility pipeline | -- | -- | -- | Staging table cleanup |
| 12 | `pl_util_notify_failure_v1` | Utility pipeline | -- | -- | -- | Failure notification |
| 13 | `pl_sap_bronze_daily_v1_error` | Error pipeline | -- | -- | -- | SAP extraction error handler |
| 14 | `pl_sap_bronze_daily_v1_retry` | Retry pipeline | -- | -- | -- | SAP extraction retry handler |
| 15 | `nb_mfg_transform_silver` | Notebook | -- | Silver | -- | Manufacturing transformation |
| 16 | `nb_mfg_oee_calc_gold` | Notebook | -- | Gold | -- | OEE calculation |
| 17 | `nb_shared_scd_merge_utility` | Notebook | -- | -- | -- | Reusable SCD merge logic |
| 18 | `nb_shared_dq_check_utility` | Notebook | -- | -- | -- | Data quality validation framework |
| 19 | `df_mfg_cleanse_silver` | Dataflow | -- | Silver | -- | Manufacturing cleansing dataflow |
| 20 | `df_fin_aggregate_gold` | Dataflow | -- | Gold | -- | Finance aggregation dataflow |
| 21 | `df_shared_conform_silver` | Dataflow | -- | Silver | -- | Cross-domain key conforming |
| 22 | `tr_schedule_mfg_daily` | Trigger | -- | -- | Daily | Manufacturing daily trigger |
| 23 | `tr_event_file_arrival_bronze` | Trigger | -- | -- | Event | File arrival event trigger |
| 24 | `ls_sap_prd` | Linked service | SAP | -- | -- | SAP production connection |
| 25 | `ds_sap_material_master_odata` | Dataset | SAP | -- | -- | SAP material master dataset |

---

## 13. Anti-Patterns and Prohibited Patterns

| Anti-Pattern | Example | Why It Is Wrong | Correct Alternative |
|-------------|---------|-----------------|-------------------|
| No prefix | `sap_to_bronze_daily` | Missing `pl_` prefix; not identifiable as pipeline | `pl_sap_bronze_daily_v1` |
| PascalCase | `PL_SAP_Bronze_Daily_V1` | Inconsistent with snake_case standard | `pl_sap_bronze_daily_v1` |
| Spaces in names | `SAP Extract Daily` | Breaks scripting, requires escaping | `pl_sap_bronze_daily_v1` |
| No version | `pl_sap_bronze_daily` | Missing version indicator; ambiguous during upgrades | `pl_sap_bronze_daily_v1` |
| No frequency | `pl_sap_bronze_v1` | Missing frequency; unclear when it runs | `pl_sap_bronze_daily_v1` |
| Date stamps | `pl_sap_bronze_20250115_v1` | Creates proliferation, breaks automation | Use parameters for dates |
| Project names | `pl_project_phoenix_sap_v1` | Projects end; data pipelines persist | `pl_sap_bronze_daily_v1` |
| Personal names | `pl_john_test_pipeline` | Not sustainable or discoverable | Use `sbx` environment for dev |
| Ambiguous abbreviations | `pl_s_b_d_v1` | Unreadable; abbreviations not in dictionary | `pl_sap_bronze_daily_v1` |
| Mixed delimiters | `pl-sap_bronze.daily_v1` | Inconsistent, error-prone | `pl_sap_bronze_daily_v1` |
| Generic names | `pipeline1`, `copy_data`, `my_pipeline` | Not self-documenting | Use full naming pattern |
| Activity names without prefix | `material_master` (activity) | Ambiguous operation type | `copy_sap_material_master` |
| Notebook without domain | `nb_transform_silver` | Missing domain context | `nb_mfg_transform_silver` |
| Semantic versioning | `pl_sap_bronze_daily_v1.2.3` | Overly complex for pipeline names | `pl_sap_bronze_daily_v2` |
| Encoding environment in name | `pl_sap_bronze_daily_v1_prd` | Environment is workspace-level, not pipeline-level | `pl_sap_bronze_daily_v1` (in `ws_mfg_ingestion_prd`) |
| Encoding credentials | `pl_sap_password123_bronze` | Security risk; never encode secrets | Use Key Vault references |
| Too many segments | `pl_sap_mm_material_master_to_lh_mfg_bronze_daily_full_v1` | Exceeds readability | `pl_sap_mm_bronze_daily_v1` |
| Generic activities | `Activity1`, `Copy1`, `Script1` | Unreadable in run monitoring | `copy_sap_material_master` |

---

## Fabric / Azure Implementation Guidance

### Pipeline Naming in Fabric Data Factory

Fabric Data Factory pipelines are scoped to a workspace. Since the workspace name already encodes domain and environment (e.g., `ws_mfg_ingestion_prd`), the pipeline name does not repeat these segments. The pipeline name focuses on source, target, frequency, and version.

### Pipeline Naming in Azure Data Factory

Azure Data Factory pipelines exist within a factory instance. The factory name encodes environment and region per CAF conventions (e.g., `adf-data-mfg-prd-eus-001`). Pipeline naming follows the same `pl_{source}_{target}_{frequency}_{version}` pattern.

### CI/CD Integration

Pipeline definitions stored in Git (ARM templates or Fabric deployment pipelines) must use the same naming conventions. Validate names during pull request review using the naming linter:

```python
import re

VALID_PIPELINE_PREFIXES = ['pl']
VALID_NOTEBOOK_PREFIXES = ['nb']
VALID_DATAFLOW_PREFIXES = ['df']
VALID_FREQUENCIES = [
    'streaming', 'nr', 'hourly', 'daily', 'wkly', 'mthly',
    'qtrly', 'yrly', 'event', 'adhoc'
]
VERSION_PATTERN = r'_v\d+$'

def validate_pipeline_name(name: str) -> tuple[bool, str]:
    """Validate a pipeline name against ISL-03 naming standards."""
    if not re.match(r'^[a-z][a-z0-9_]{1,255}$', name):
        return False, "Must be lowercase alphanumeric with underscores"
    parts = name.split('_')
    if parts[0] == 'pl':
        if parts[1] == 'master':
            return True, "Valid master pipeline"
        if parts[1] == 'util':
            if not re.search(VERSION_PATTERN, name):
                return False, "Utility pipelines require version suffix"
            return True, "Valid utility pipeline"
        if not re.search(VERSION_PATTERN, name):
            return False, "Pipeline requires version suffix (_v1, _v2)"
        return True, "Valid pipeline"
    elif parts[0] == 'nb':
        if len(parts) < 4:
            return False, "Notebook must follow nb_{domain}_{process}_{type}"
        return True, "Valid notebook"
    elif parts[0] == 'df':
        if len(parts) < 4:
            return False, "Dataflow must follow df_{domain}_{process}_{layer}"
        return True, "Valid dataflow"
    return False, f"Invalid prefix '{parts[0]}'"
```

### Naming Enforcement in Pull Requests

Add a pre-merge check in your CI/CD pipeline (GitHub Actions, Azure DevOps) that:

1. Scans for new or renamed pipeline JSON definitions
2. Extracts the pipeline name from the definition
3. Validates against the naming pattern using the linter above
4. Blocks merge if validation fails
5. Reports the specific violation and correct alternative

---

## Manufacturing Overlay [CONDITIONAL]

### Manufacturing-Specific Pipeline Patterns

Manufacturing engagements frequently require specialized pipeline patterns for MES integration, IoT data ingestion, and quality system feeds. Include this section when the client domain includes manufacturing.

| Pipeline Name | Source | Target | Description |
|--------------|--------|--------|-------------|
| `pl_sap_pp_bronze_daily_v1` | SAP PP | Bronze | Production Planning module extract |
| `pl_sap_pm_bronze_daily_v1` | SAP PM | Bronze | Plant Maintenance module extract |
| `pl_sap_qm_bronze_daily_v1` | SAP QM | Bronze | Quality Management module extract |
| `pl_apriso_bronze_hourly_v1` | Apriso MES | Bronze | MES shop floor data near-real-time |
| `pl_pisvr_bronze_nr_v1` | OSIsoft PI | Bronze | Process historian near-real-time |
| `pl_kepw_bronze_streaming_v1` | Kepware OPC-UA | Bronze | OPC-UA sensor data streaming |
| `pl_mqtt_bronze_streaming_v1` | MQTT Broker | Bronze | MQTT IoT message streaming |
| `nb_mfg_oee_calc_gold` | Silver | Gold | OEE calculation notebook |
| `nb_mfg_spc_analysis_gold` | Silver | Gold | SPC control chart analysis |
| `nb_mfg_takt_variance_gold` | Silver | Gold | Takt time variance calculation |
| `nb_iot_anomaly_detect_model` | Silver | Gold | Equipment anomaly detection ML |
| `df_mfg_scrap_analysis_gold` | Silver | Gold | Scrap and rework analysis dataflow |

### OT/IT Integration Pipeline Considerations

- IoT and OT source pipelines typically run at `streaming` or `nr` frequency
- MES integration pipelines require careful watermark tracking due to shop floor system availability windows
- SCADA data pipelines may require custom connectors -- name the source using the system abbreviation from the abbreviation dictionary
- Equipment telemetry pipelines should be isolated in dedicated workspaces for performance isolation
- For ITAR-controlled manufacturing data, pipeline workspace isolation must align with ISL-04 Data Classification and ISL-05 Security Patterns

---

## Cross-References

| Reference | Module | Relevance |
|-----------|--------|-----------|
| Abbreviation Dictionary | ISL-03 `templates/abbreviation-dictionary.md` | Source system, frequency, and operation abbreviations |
| Database & Schema Naming | ISL-03 `templates/database-schema-naming.md` | Target database/lakehouse naming for pipeline destinations |
| Table & View Naming | ISL-03 `templates/table-view-naming.md` | Target table naming for pipeline load targets |
| Column Naming Standards | ISL-03 `templates/column-naming-standards.md` | Column naming for pipeline-generated audit columns |
| Infrastructure Resource Naming | ISL-03 `templates/infrastructure-resource-naming.md` | Data Factory instance, linked service, and storage naming |
| Integration Patterns | ISL-05 | Pipeline architecture patterns, error handling, retry logic |
| Metadata & Lineage | ISL-06 | Pipeline run logging, lineage tracking, catalog registration |
| Data Quality Standards | ISL-02 | Validation pipeline and rejection pipeline patterns |
| API Governance | ISL-01 | API-triggered pipeline patterns and webhook naming |

---

## Compliance Alignment

| Standard | Relevance | How This Template Aligns |
|----------|-----------|--------------------------|
| DAMA DMBOK | Data integration naming governance | Pipeline naming follows DMBOK data integration naming principles |
| Azure CAF | Cloud Adoption Framework naming | Pipeline infrastructure naming aligns with CAF resource conventions |
| NIST SP 800-53 | Security control requirements | Pipeline audit logging patterns support NIST AU-3, AU-6, AU-12 controls |
| ISO 27001 | Information security management | Pipeline naming and logging support A.12.4 logging and monitoring requirements |
| OWASP | Application security | Pipeline names avoid exposing sensitive connection or credential information |
| SOX | Financial data controls | Pipeline naming enables audit trail for financial data processing compliance |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | DMTSP Architecture | Initial release -- pipeline, notebook, dataflow, and orchestration naming standards with Fabric Data Factory patterns |

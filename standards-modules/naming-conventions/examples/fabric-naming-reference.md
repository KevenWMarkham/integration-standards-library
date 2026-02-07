# Fabric Naming Quick-Reference Guide
> Module: ISL-03 | Version: 1.0 | Type: Example

## Purpose

This document is the master naming reference for all Microsoft Fabric artifact types. It provides concrete, production-ready naming examples for every artifact in a Fabric-based data platform deployment. Use this as a quick-reference card during development, code reviews, and governance audits. Every name follows ISL-03 conventions: lowercase snake_case, environment-suffixed, domain-encoded, and self-documenting.

---

## 1. Workspaces

Pattern: `ws_{domain}_{purpose}_{env}`

| Workspace Name | Domain | Purpose | Env | Description |
|---|---|---|---|---|
| `ws_mfg_analytics_prd` | Manufacturing | Analytics | Production | Manufacturing analytical workloads |
| `ws_mfg_analytics_dev` | Manufacturing | Analytics | Development | Dev environment for manufacturing analytics |
| `ws_mfg_ingestion_prd` | Manufacturing | Ingestion | Production | Manufacturing data ingestion pipelines |
| `ws_fin_reporting_prd` | Finance | Reporting | Production | Financial reporting artifacts |
| `ws_fin_reporting_tst` | Finance | Reporting | Test | QA for financial reports |
| `ws_scm_analytics_prd` | Supply Chain | Analytics | Production | Supply chain analytical workloads |
| `ws_qms_analytics_prd` | Quality | Analytics | Production | Quality management analytics |
| `ws_iot_streaming_prd` | IoT | Streaming | Production | Real-time IoT data processing |
| `ws_shared_integration_prd` | Shared | Integration | Production | Cross-domain integration pipelines |
| `ws_hcm_reporting_prd` | Human Capital | Reporting | Production | HR and workforce reporting |
| `ws_sal_analytics_prd` | Sales | Analytics | Production | Sales analytics and forecasting |
| `ws_analytics_executive_prd` | Analytics | Executive | Production | Executive-level cross-domain dashboards |

---

## 2. Lakehouses

Pattern: `lh_{domain}_{layer}_{env}`

| Lakehouse Name | Domain | Layer | Env | Description |
|---|---|---|---|---|
| `lh_mfg_bronze_prd` | Manufacturing | Bronze | Production | Raw manufacturing source data |
| `lh_mfg_silver_prd` | Manufacturing | Silver | Production | Cleansed manufacturing data |
| `lh_mfg_gold_prd` | Manufacturing | Gold | Production | Business-ready manufacturing metrics |
| `lh_mfg_bronze_dev` | Manufacturing | Bronze | Development | Dev raw manufacturing ingestion |
| `lh_fin_bronze_prd` | Finance | Bronze | Production | Raw financial data from SAP FI/CO |
| `lh_fin_silver_prd` | Finance | Silver | Production | Cleansed and conformed financial data |
| `lh_fin_gold_prd` | Finance | Gold | Production | Financial KPIs and aggregates |
| `lh_scm_bronze_prd` | Supply Chain | Bronze | Production | Raw procurement and logistics data |
| `lh_scm_silver_tst` | Supply Chain | Silver | Test | QA for supply chain transformations |
| `lh_iot_bronze_prd` | IoT | Bronze | Production | Raw sensor and telemetry data |
| `lh_iot_silver_prd` | IoT | Silver | Production | Processed and validated telemetry |
| `lh_shared_bronze_prd` | Shared | Bronze | Production | Cross-domain master and reference data |
| `lh_analytics_gold_prd` | Analytics | Gold | Production | Enterprise analytical gold layer |

---

## 3. Warehouses

Pattern: `wh_{domain}_{purpose}_{env}`

| Warehouse Name | Domain | Purpose | Env | Description |
|---|---|---|---|---|
| `wh_mfg_serving_prd` | Manufacturing | Serving | Production | Star schema for manufacturing reporting |
| `wh_mfg_analytics_dev` | Manufacturing | Analytics | Development | Dev ad-hoc manufacturing analytics |
| `wh_fin_reporting_prd` | Finance | Reporting | Production | Financial reporting dimensional model |
| `wh_fin_reporting_stg` | Finance | Reporting | Staging | UAT for financial reporting warehouse |
| `wh_scm_serving_prd` | Supply Chain | Serving | Production | Supply chain dimensional model |
| `wh_sal_serving_prd` | Sales | Serving | Production | Sales star schema |
| `wh_analytics_serving_prd` | Analytics | Serving | Production | Enterprise-wide cross-domain warehouse |
| `wh_shared_staging_prd` | Shared | Staging | Production | Cross-domain staging and conforming |

---

## 4. Pipelines

Pattern: `pl_{source}_{target}_{frequency}_{version}`

### ERP Source Pipelines (SAP)

| Pipeline Name | Source | Target | Frequency | Description |
|---|---|---|---|---|
| `pl_sap_bronze_daily_v1` | SAP (all modules) | Bronze | Daily | Daily full/delta extract from SAP |
| `pl_sap_fi_bronze_daily_v1` | SAP FI | Bronze | Daily | SAP financial postings daily extract |
| `pl_sap_pp_bronze_daily_v1` | SAP PP | Bronze | Daily | SAP production planning daily extract |
| `pl_sap_mm_bronze_daily_v1` | SAP MM | Bronze | Daily | SAP materials management daily extract |
| `pl_sap_qm_bronze_daily_v1` | SAP QM | Bronze | Daily | SAP quality management daily extract |
| `pl_sap_pm_bronze_daily_v1` | SAP PM | Bronze | Daily | SAP plant maintenance daily extract |

### ERP Source Pipelines (Epicor)

| Pipeline Name | Source | Target | Frequency | Description |
|---|---|---|---|---|
| `pl_epicor_bronze_hourly_v1` | Epicor (all modules) | Bronze | Hourly | Hourly CDC extract from Epicor |
| `pl_epicor_prod_bronze_hourly_v2` | Epicor Production | Bronze | Hourly | Epicor production module hourly extract |
| `pl_epicor_inv_bronze_daily_v1` | Epicor Inventory | Bronze | Daily | Epicor inventory module daily extract |

### IoT and Streaming Pipelines

| Pipeline Name | Source | Target | Frequency | Description |
|---|---|---|---|---|
| `pl_iot_bronze_streaming_v1` | IoT Hub | Bronze | Streaming | Real-time sensor data ingestion |
| `pl_historian_bronze_hourly_v1` | OSIsoft PI | Bronze | Hourly | Historian tag data hourly extract |
| `pl_scada_bronze_event_v1` | SCADA | Bronze | Event-driven | SCADA event-triggered ingestion |

### File-Based Pipelines

| Pipeline Name | Source | Target | Frequency | Description |
|---|---|---|---|---|
| `pl_sftp_bronze_daily_v1` | SFTP server | Bronze | Daily | Daily flat file ingestion from SFTP |
| `pl_sharepoint_bronze_weekly_v1` | SharePoint | Bronze | Weekly | Weekly Excel/CSV pulls from SharePoint |
| `pl_blob_bronze_event_v1` | Blob Storage | Bronze | Event-driven | Event-triggered blob file processing |

### Transformation Pipelines

| Pipeline Name | Source | Target | Frequency | Description |
|---|---|---|---|---|
| `pl_bronze_silver_daily_v1` | Bronze | Silver | Daily | Daily bronze-to-silver transformation |
| `pl_silver_gold_daily_v1` | Silver | Gold | Daily | Daily silver-to-gold aggregation |
| `pl_silver_warehouse_daily_v1` | Silver | Warehouse | Daily | Daily warehouse load from silver |

---

## 5. Notebooks

Pattern: `nb_{domain}_{process}_{type}`

| Notebook Name | Domain | Process | Type | Description |
|---|---|---|---|---|
| `nb_mfg_transform_silver` | Manufacturing | Transform | Silver | Bronze-to-silver manufacturing transforms |
| `nb_mfg_aggregate_gold` | Manufacturing | Aggregate | Gold | Silver-to-gold manufacturing rollups |
| `nb_fin_transform_silver` | Finance | Transform | Silver | Financial data cleansing and conforming |
| `nb_qms_validate_silver` | Quality | Validate | Silver | Quality data validation rules |
| `nb_iot_transform_silver` | IoT | Transform | Silver | Sensor data cleansing and outlier removal |
| `nb_iot_anomaly_detection` | IoT | Anomaly | Detection | ML-based anomaly detection on sensor data |
| `nb_shared_master_data_conform` | Shared | Master Data | Conform | Cross-source master data matching |
| `nb_shared_utilities_common` | Shared | Utilities | Common | Reusable helper functions and UDFs |
| `nb_shared_data_quality_check` | Shared | Data Quality | Check | Generic DQ rule execution framework |
| `nb_analytics_oee_calculation` | Analytics | OEE | Calculation | OEE metric computation notebook |

---

## 6. Dataflows

Pattern: `df_{source_or_domain}_{target_or_purpose}_{qualifier}`

| Dataflow Name | Description |
|---|---|
| `df_sap_material_master_bronze` | SAP material master ingestion to bronze |
| `df_sap_vendor_master_bronze` | SAP vendor master ingestion to bronze |
| `df_epicor_customer_bronze` | Epicor customer data to bronze |
| `df_sharepoint_budget_bronze` | SharePoint budget files to bronze |
| `df_excel_forecast_bronze` | Excel-based sales forecast to bronze |
| `df_silver_product_conform` | Product master conforming in silver |
| `df_silver_customer_dedup` | Customer deduplication in silver |
| `df_gold_finance_summary` | Financial summary aggregation to gold |

---

## 7. Semantic Models

Pattern: `sm_{domain}_{audience}_{version}`

| Semantic Model Name | Domain | Audience | Description |
|---|---|---|---|
| `sm_mfg_operations_v1` | Manufacturing | Operations | Shop floor KPIs and production metrics |
| `sm_mfg_executive_v1` | Manufacturing | Executive | Executive manufacturing summary |
| `sm_fin_management_v1` | Finance | Management | Management financial reporting model |
| `sm_fin_executive_v2` | Finance | Executive | Executive financial dashboard model |
| `sm_scm_operations_v1` | Supply Chain | Operations | Procurement and logistics metrics |
| `sm_sal_management_v1` | Sales | Management | Sales performance and pipeline model |
| `sm_analytics_enterprise_v1` | Analytics | Enterprise | Cross-domain enterprise KPI model |

---

## 8. Reports

Pattern: `rpt_{domain}_{subject}_{audience}`

| Report Name | Domain | Subject | Audience | Description |
|---|---|---|---|---|
| `rpt_mfg_production_output_ops` | Manufacturing | Production Output | Operations | Daily production output by line |
| `rpt_mfg_oee_dashboard_ops` | Manufacturing | OEE | Operations | OEE performance dashboard |
| `rpt_mfg_scrap_analysis_quality` | Manufacturing | Scrap Analysis | Quality | Scrap and rework root cause analysis |
| `rpt_fin_trial_balance_mgmt` | Finance | Trial Balance | Management | Monthly trial balance report |
| `rpt_fin_budget_variance_exec` | Finance | Budget Variance | Executive | Budget vs. actual variance analysis |
| `rpt_scm_inventory_aging_ops` | Supply Chain | Inventory Aging | Operations | Inventory aging and turns analysis |
| `rpt_sal_pipeline_forecast_mgmt` | Sales | Pipeline Forecast | Management | Sales pipeline and forecast report |
| `rpt_analytics_executive_scorecard` | Analytics | Executive Scorecard | Executive | Cross-domain KPI scorecard |

---

## 9. Eventstreams

Pattern: `es_{source}_{event_type}_{qualifier}`

| Eventstream Name | Source | Event Type | Description |
|---|---|---|---|
| `es_iothub_sensor_telemetry` | IoT Hub | Sensor Telemetry | Real-time sensor readings from IoT Hub |
| `es_scada_equipment_event` | SCADA | Equipment Event | Equipment start/stop/fault events |
| `es_erp_order_change` | ERP | Order Change | CDC events from ERP order tables |
| `es_mes_production_signal` | MES | Production Signal | Production line signals from MES |

---

## 10. KQL Databases

Pattern: `kql_{domain}_{purpose}_{env}`

| KQL Database Name | Domain | Purpose | Description |
|---|---|---|---|
| `kql_iot_telemetry_prd` | IoT | Telemetry | Real-time sensor data exploration |
| `kql_mfg_equipment_events_prd` | Manufacturing | Equipment Events | Equipment event log analytics |
| `kql_shared_audit_log_prd` | Shared | Audit Log | Platform audit and diagnostics |

---

## 11. Tables Within Lakehouses

### Bronze Tables

Pattern: `brz_{source}_{entity}_{temporal}`

| Table Name | Source | Entity | Temporal | Description |
|---|---|---|---|---|
| `brz_sap_material_master_full` | SAP | Material Master | Full | Complete material master extract |
| `brz_sap_work_order_header_delta` | SAP | Work Order Header | Delta | CDC work order headers |
| `brz_sap_work_order_operation_delta` | SAP | Work Order Operation | Delta | CDC work order operations |
| `brz_sap_gl_line_item_delta` | SAP | GL Line Item | Delta | CDC general ledger postings |
| `brz_sap_purchase_order_delta` | SAP | Purchase Order | Delta | CDC purchase orders |
| `brz_sap_bill_of_material_full` | SAP | Bill of Material | Full | Full BOM extract |
| `brz_sap_routing_full` | SAP | Routing | Full | Full routing extract |
| `brz_epicor_job_head_delta` | Epicor | Job Head | Delta | CDC Epicor job headers |
| `brz_epicor_job_oper_delta` | Epicor | Job Oper | Delta | CDC Epicor job operations |
| `brz_epicor_part_master_full` | Epicor | Part Master | Full | Full Epicor part master |
| `brz_iot_sensor_reading` | IoT Hub | Sensor Reading | Append | Streaming sensor telemetry |
| `brz_iot_equipment_event` | SCADA | Equipment Event | Append | Equipment event stream |
| `brz_file_invoice_csv` | SFTP | Invoice CSV | Full | Flat file invoice ingestion |

### Silver Tables

Pattern: `slv_{domain}_{entity}_{temporal}`

| Table Name | Domain | Entity | Temporal | Description |
|---|---|---|---|---|
| `slv_mfg_work_order_current` | Manufacturing | Work Order | Current | Latest version of each work order |
| `slv_mfg_work_order_historical` | Manufacturing | Work Order | Historical | Full work order history |
| `slv_mfg_work_order_operation_current` | Manufacturing | Work Order Operation | Current | Current operations per work order |
| `slv_mfg_bill_of_material_current` | Manufacturing | Bill of Material | Current | Current BOM structures |
| `slv_mfg_routing_current` | Manufacturing | Routing | Current | Current routings |
| `slv_fin_gl_line_item_current` | Finance | GL Line Item | Current | Validated GL postings |
| `slv_scm_purchase_order_current` | Supply Chain | Purchase Order | Current | Cleansed purchase orders |
| `slv_scm_material_current` | Supply Chain | Material | Current | Conformed material master |
| `slv_qms_inspection_lot_current` | Quality | Inspection Lot | Current | Validated inspection records |
| `slv_iot_sensor_reading_latest` | IoT | Sensor Reading | Latest | Latest reading per sensor |
| `slv_shared_customer_current` | Shared | Customer | Current | Deduplicated customer master |
| `slv_shared_vendor_current` | Shared | Vendor | Current | Cleansed vendor master |

### Gold Tables

Pattern: `gld_{domain}_{entity}_{temporal}`

| Table Name | Domain | Entity | Temporal | Description |
|---|---|---|---|---|
| `gld_mfg_production_summary_daily_snapshot` | Manufacturing | Production Summary | Daily Snapshot | Daily production output aggregates |
| `gld_mfg_oee_metric_daily_snapshot` | Manufacturing | OEE Metric | Daily Snapshot | OEE by line and shift |
| `gld_mfg_scrap_rate_daily_snapshot` | Manufacturing | Scrap Rate | Daily Snapshot | Scrap and rework rates |
| `gld_fin_revenue_daily_snapshot` | Finance | Revenue | Daily Snapshot | Daily revenue aggregates |
| `gld_fin_trial_balance_monthly_snapshot` | Finance | Trial Balance | Monthly Snapshot | Monthly trial balance |
| `gld_scm_inventory_position_daily_snapshot` | Supply Chain | Inventory Position | Daily Snapshot | Daily inventory levels |
| `gld_qms_defect_rate_weekly_snapshot` | Quality | Defect Rate | Weekly Snapshot | Weekly defect rate by product |
| `gld_sal_pipeline_forecast_weekly_snapshot` | Sales | Pipeline Forecast | Weekly Snapshot | Weekly sales forecast |

### Fact Tables (Warehouse Presentation Schema)

Pattern: `fct_{entity}_{qualifier}`

| Table Name | Grain | Description |
|---|---|---|
| `fct_production_output` | Work order + operation + shift | Production quantity and cost per operation |
| `fct_sales_order` | Order line item | Sales transactions |
| `fct_purchase_order` | PO line item | Procurement transactions |
| `fct_gl_posting` | GL line item | General ledger entries |
| `fct_quality_inspection` | Inspection lot + characteristic | Quality measurement results |
| `fct_sensor_reading` | Sensor + timestamp | IoT sensor measurements |
| `fct_equipment_downtime` | Equipment + event | Downtime duration and causes |
| `fct_inventory_movement` | Material + movement type | Stock movements |
| `fct_maintenance_order` | Maintenance order | Maintenance cost and schedule |

### Dimension Tables (Warehouse Presentation Schema)

Pattern: `dim_{entity}`

| Table Name | SCD Type | Description |
|---|---|---|
| `dim_date` | Static | Enterprise calendar with fiscal periods |
| `dim_time` | Static | Time-of-day with shift mapping |
| `dim_product` | Type 2 | Product master with version history |
| `dim_material` | Type 2 | Material master from SAP/Epicor |
| `dim_customer` | Type 2 | Customer master with address history |
| `dim_vendor` | Type 2 | Vendor/supplier master |
| `dim_plant` | Type 1 | Plant and facility reference |
| `dim_equipment` | Type 2 | Equipment and asset master |
| `dim_work_center` | Type 1 | Work center capacity and attributes |
| `dim_cost_center` | Type 1 | Cost center hierarchy |
| `dim_employee` | Type 2 | Employee reference |
| `dim_shift` | Static | Shift schedule definitions |
| `dim_uom` | Static | Unit of measure conversions |

---

## 12. Schemas Within Warehouses

Standard schemas deployed in every Fabric warehouse:

| Schema | Purpose | Example Objects |
|---|---|---|
| `raw` | External table landing zone | External tables pointing to lakehouse files |
| `staging` | Pre-merge intermediate tables | `staging.stg_sap_material_merge` |
| `cleansed` | Post-validation, pre-business-logic | `cleansed.slv_work_order_validated` |
| `conformed` | Cross-domain shared dimensions | `conformed.dim_product`, `conformed.dim_date` |
| `presentation` | Star schema facts and dimensions | `presentation.fct_production_output`, `presentation.dim_plant` |
| `audit` | Pipeline metadata and run tracking | `audit.pipeline_run_log`, `audit.data_quality_result` |
| `security` | RLS filter tables | `security.rls_plant_access`, `security.rls_region_filter` |
| `archive` | Deprecated or retired objects | `archive.fct_sales_order_v1` |
| `sandbox` | Analyst ad-hoc exploration | `sandbox.analyst_temp_query` |

Multi-domain warehouse schemas:

| Schema | Description |
|---|---|
| `mfg_presentation` | Manufacturing facts and dimensions |
| `fin_presentation` | Finance facts and dimensions |
| `scm_presentation` | Supply chain facts and dimensions |
| `shared_conformed` | Enterprise conformed dimensions |
| `shared_reference` | Cross-domain reference tables |

---

## Cross-References

- **ISL-03 Database and Schema Naming** -- `templates/database-schema-naming.md` -- Patterns and rules for lakehouse, warehouse, and schema naming
- **ISL-03 Table and View Naming** -- `templates/table-view-naming.md` -- Table prefix conventions, temporal indicators, and dimensional model naming
- **ISL-03 Column Naming Standards** -- `templates/column-naming-standards.md` -- Column suffixes, key conventions, and audit columns
- **ISL-03 Manufacturing Domain Names** -- `examples/manufacturing-domain-names.md` -- Complete abbreviation dictionary for manufacturing clients
- **ISL-04 Data Classification** -- Domain taxonomy governance and sensitivity tagging
- **ISL-05 Security Patterns** -- Schema-level and RLS naming patterns

---

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-06-15 | DMTSP Enterprise Architecture | Initial release with all Fabric artifact types |

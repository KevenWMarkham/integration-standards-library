# Manufacturing Domain Naming Reference -- Dual-ERP Client
> Module: ISL-03 | Version: 1.0 | Type: Example

## Purpose

This document provides the complete domain taxonomy, abbreviation dictionary, and full-stack naming examples for a multi-site discrete manufacturer running SAP for financials and corporate functions alongside Epicor for shop-floor production management. It serves as a client-ready reference that maps every business domain, ERP module, manufacturing entity, and IoT/OT system to standardized ISL-03 naming conventions. All names shown are production-final examples with no placeholders.

---

## 1. Organization Profile

**Client type:** Multi-site discrete manufacturer (automotive components)
**Headcount:** 4,500 employees across 6 plants
**Primary ERP:** SAP ECC 6.0 -- financials, procurement, quality, HR, plant maintenance
**Production ERP:** Epicor Kinetic -- production scheduling, shop floor control, inventory
**IoT/OT systems:** Allen-Bradley PLCs, Kepware OPC-UA gateway, OSIsoft PI historian, Cognex vision systems
**MES:** Epicor Advanced MES
**Cloud platform:** Microsoft Fabric on Azure (East US primary, West US DR)

---

## 2. Domain Taxonomy

The complete domain taxonomy maps every functional area to a standardized short code used across all Fabric artifacts.

| Domain Code | Full Name | Description | Primary Systems | Data Steward Role |
|---|---|---|---|---|
| `mfg` | Manufacturing | Production orders, shop floor execution, output tracking | Epicor Production, MES | VP Manufacturing |
| `fin` | Finance | General ledger, accounts payable/receivable, fixed assets, treasury | SAP FI, SAP CO | CFO / Controller |
| `scm` | Supply Chain | Procurement, warehousing, logistics, demand planning | SAP MM, SAP WM, Epicor Inventory | VP Supply Chain |
| `qms` | Quality | Incoming inspection, in-process QC, final inspection, CAPA, SPC | SAP QM, Epicor Quality | Quality Director |
| `mnt` | Maintenance | Preventive/predictive maintenance, work orders, spare parts | SAP PM, Epicor Maintenance | Maintenance Manager |
| `sal` | Sales | Customer orders, pricing, quotations, CRM | SAP SD, Epicor CRM | VP Sales |
| `hcm` | Human Capital | HR master data, payroll, time and attendance, training | SAP HR | CHRO |
| `iot` | IoT / OT | Sensor telemetry, PLC signals, SCADA events, historian tags | IoT Hub, OSIsoft PI, Kepware | OT Engineering Manager |
| `eng` | Engineering | CAD/CAM data, engineering change orders, product lifecycle | Epicor Engineering, PLM | Engineering Director |
| `shared` | Shared | Master data, reference data, cross-domain calendars | MDM, multiple sources | Data Governance Lead |
| `analytics` | Analytics | Cross-domain KPIs, executive dashboards, ML models | Fabric, Power BI | Analytics Director |
| `cost` | Costing | Standard costing, variance analysis, activity-based costing | SAP CO, Epicor Job Costing | Cost Accounting Manager |

---

## 3. SAP Module Abbreviations

These abbreviations are used within pipeline names and bronze table names to identify the SAP source module.

| Abbreviation | SAP Module | Full Name | Key Tables/Transactions | Example Entities |
|---|---|---|---|---|
| `sap_fi` | FI | Financial Accounting | BKPF, BSEG, SKA1 | GL postings, chart of accounts |
| `sap_co` | CO | Controlling | COSS, COSP, CSKS | Cost center postings, internal orders |
| `sap_mm` | MM | Materials Management | MARA, MARC, EKPO | Material master, purchase orders |
| `sap_sd` | SD | Sales and Distribution | VBAK, VBAP, LIKP | Sales orders, deliveries |
| `sap_pp` | PP | Production Planning | AFKO, AFPO, AFVC | Production orders, operations |
| `sap_qm` | QM | Quality Management | QALS, QAVE, QAMV | Inspection lots, results |
| `sap_pm` | PM | Plant Maintenance | AUFK, AFIH, EQUI | Maintenance orders, equipment |
| `sap_hr` | HR | Human Resources | PA0001, PA0002, PA0008 | Employee master, payroll |
| `sap_wm` | WM | Warehouse Management | LQUA, LTBK, LAGP | Quants, transfer orders, bins |
| `sap_ewm` | EWM | Extended Warehouse Mgmt | /SCWM/ORDIM, /SCWM/AQUA | Warehouse tasks, stock |

---

## 4. Epicor Module Abbreviations

These abbreviations identify Epicor Kinetic source modules in pipeline and bronze table names.

| Abbreviation | Module | Full Name | Key BAQs/Tables | Example Entities |
|---|---|---|---|---|
| `epc_prod` | Production | Production Management | JobHead, JobOper, JobMtl | Jobs, operations, material issues |
| `epc_inv` | Inventory | Inventory Management | PartBin, PartTran, InvTrans | On-hand, transactions, bins |
| `epc_qual` | Quality | Quality Assurance | InspResult, InspPlan, NCR | Inspection results, non-conformances |
| `epc_mnt` | Maintenance | Maintenance Management | EquipMaint, MaintReq | Equipment records, work requests |
| `epc_eng` | Engineering | Engineering | ECORev, PartRev, BOMHead | ECOs, revisions, BOMs |
| `epc_sch` | Scheduling | Advanced Scheduling | SchedResource, SchedOper | Finite scheduling, resource allocation |
| `epc_crm` | CRM | Customer Relationship | CustCnt, QuoteHed | Contacts, quotations |
| `epc_cost` | Costing | Job Costing | JobCost, LaborDtl | Job costs, labor details |

---

## 5. Manufacturing Entity Names

Standardized entity names for manufacturing business objects, mapped from both ERP source-system names to a single canonical name.

| Canonical Entity | SAP Source Table | Epicor Source Table | Bronze Name | Silver Name |
|---|---|---|---|---|
| work_order | AFKO (order header) | JobHead | `brz_sap_pp_work_order_header` / `brz_epc_prod_job_head` | `slv_mfg_work_order_current` |
| work_order_operation | AFVC (routing operation) | JobOper | `brz_sap_pp_work_order_operation` / `brz_epc_prod_job_oper` | `slv_mfg_work_order_operation_current` |
| work_order_material | RESB (reservation) | JobMtl | `brz_sap_pp_work_order_material` / `brz_epc_prod_job_mtl` | `slv_mfg_work_order_material_current` |
| bill_of_material | STKO/STPO (BOM header/item) | BOMHead/BOMOper | `brz_sap_pp_bom_header` / `brz_epc_eng_bom_head` | `slv_mfg_bill_of_material_current` |
| routing | PLKO/PLPO (routing header/oper) | PartOpr | `brz_sap_pp_routing_header` / `brz_epc_eng_part_oper` | `slv_mfg_routing_current` |
| work_center | CRHD (work center header) | Resource | `brz_sap_pp_work_center` / `brz_epc_prod_resource` | `slv_mfg_work_center_current` |
| material | MARA/MARC (material master) | Part | `brz_sap_mm_material_master` / `brz_epc_inv_part_master` | `slv_shared_material_current` |
| quality_inspection | QALS/QAVE (insp lot/result) | InspResult | `brz_sap_qm_inspection_lot` / `brz_epc_qual_insp_result` | `slv_qms_inspection_current` |
| non_conformance | QMIH (quality notification) | NCR | `brz_sap_qm_notification` / `brz_epc_qual_ncr` | `slv_qms_non_conformance_current` |
| equipment | EQUI (equipment master) | Equip | `brz_sap_pm_equipment` / `brz_epc_mnt_equipment` | `slv_mnt_equipment_current` |
| maintenance_order | AUFK/AFIH (maint order) | MaintReq | `brz_sap_pm_maint_order` / `brz_epc_mnt_maint_req` | `slv_mnt_maintenance_order_current` |

---

## 6. IoT and OT Domain Names

Naming conventions for operational technology systems, sensors, and telemetry data.

### Source System Abbreviations

| Abbreviation | System | Description | Data Characteristics |
|---|---|---|---|
| `iothub` | Azure IoT Hub | Cloud IoT gateway | JSON telemetry, MQTT/AMQP |
| `opcua` | OPC-UA Gateway | Kepware OPC-UA server | Tag-value pairs, 1-second polling |
| `pi` | OSIsoft PI | Process historian | Time-series tags, compressed archive |
| `plc` | PLC | Allen-Bradley programmable logic controllers | Register values, binary signals |
| `scada` | SCADA | Supervisory control system | Alarm events, setpoints, process values |
| `mes` | MES | Epicor Advanced MES | Production counts, cycle times, labor |
| `vision` | Vision System | Cognex vision inspection | Pass/fail results, defect images |

### IoT Entity Names

| Entity | Description | Bronze Table | Silver Table |
|---|---|---|---|
| `sensor_reading` | Continuous sensor measurement (temp, pressure, vibration) | `brz_iothub_sensor_reading` | `slv_iot_sensor_reading_latest` |
| `equipment_event` | Discrete machine event (start, stop, fault, alarm) | `brz_scada_equipment_event` | `slv_iot_equipment_event_current` |
| `tag_value` | Historian tag snapshot | `brz_pi_tag_value` | `slv_iot_tag_value_current` |
| `plc_register` | PLC register state capture | `brz_opcua_plc_register` | `slv_iot_plc_register_latest` |
| `production_count` | MES production counter | `brz_mes_production_count` | `slv_iot_production_count_current` |
| `vision_result` | Vision system inspection result | `brz_vision_inspection_result` | `slv_qms_vision_result_current` |
| `energy_meter` | Energy consumption meter reading | `brz_iothub_energy_meter` | `slv_iot_energy_meter_latest` |

### IoT Gold Aggregations

| Gold Table | Description |
|---|---|
| `gld_iot_sensor_hourly_avg` | Hourly average sensor readings by equipment |
| `gld_iot_equipment_availability_daily_snapshot` | Daily equipment availability percentage |
| `gld_iot_energy_consumption_daily_snapshot` | Daily energy consumption by line and plant |
| `gld_iot_alarm_frequency_daily_snapshot` | Daily alarm counts and frequency by equipment |

---

## 7. Shop Floor Terminology Abbreviations

Approved abbreviations for manufacturing-specific terms used in table names, column names, and metric names.

| Abbreviation | Full Term | Context | Example Usage |
|---|---|---|---|
| `oee` | Overall Equipment Effectiveness | KPI | `gld_mfg_oee_metric_daily_snapshot` |
| `takt` | Takt Time | Production rate | `takt_time_dur` (column) |
| `wip` | Work in Process | Inventory status | `gld_mfg_wip_position_daily_snapshot` |
| `fpy` | First Pass Yield | Quality metric | `fpy_pct` (column) |
| `spc` | Statistical Process Control | Quality method | `gld_qms_spc_chart_data` |
| `mtbf` | Mean Time Between Failures | Reliability metric | `mtbf_dur` (column) |
| `mttr` | Mean Time to Repair | Maintenance metric | `mttr_dur` (column) |
| `bom` | Bill of Materials | Engineering structure | `slv_mfg_bill_of_material_current` |
| `ecn` | Engineering Change Notice | Change management | `slv_eng_ecn_current` |
| `eco` | Engineering Change Order | Change management | `slv_eng_eco_current` |
| `ncr` | Non-Conformance Report | Quality event | `slv_qms_non_conformance_current` |
| `capa` | Corrective and Preventive Action | Quality process | `slv_qms_capa_current` |
| `ppap` | Production Part Approval Process | Quality launch | `slv_qms_ppap_submission_current` |
| `fmea` | Failure Mode and Effects Analysis | Risk analysis | `gld_qms_fmea_risk_score` |
| `rma` | Return Merchandise Authorization | Customer returns | `slv_sal_rma_current` |
| `mrp` | Material Requirements Planning | Planning | `gld_scm_mrp_recommendation` |
| `dnc` | Direct Numerical Control | CNC program delivery | Not used in data naming (OT only) |
| `cmm` | Coordinate Measuring Machine | Metrology | `brz_vision_cmm_measurement` |
| `cpk` | Process Capability Index | Quality statistic | `cpk_val` (column) |
| `uom` | Unit of Measure | Universal | `base_uom_cd` (column) |
| `sku` | Stock Keeping Unit | Inventory | `sku_cd` (column) |

---

## 8. Full-Stack Naming Walkthrough

This section traces a complete naming chain from Fabric workspace down to individual columns for two representative data flows.

### Flow A: SAP Financial Data (GL Postings)

```
Workspace:      ws_fin_reporting_prd
Lakehouse:      lh_fin_bronze_prd
Pipeline:       pl_sap_fi_bronze_daily_v1
Bronze table:   brz_sap_fi_gl_line_item_delta
  Columns:      company_cd, gl_account_cd, cost_center_cd, posting_dt,
                debit_amt, credit_amt, currency_cd, document_num,
                fiscal_yr, fiscal_mo, ingested_ts, source_file_nm,
                batch_id, pipeline_run_id

Notebook:       nb_fin_transform_silver
Silver table:   slv_fin_gl_line_item_current
  Columns:      gl_line_item_sk, gl_line_item_bk, company_cd,
                gl_account_cd, cost_center_cd, posting_dt,
                debit_amt, credit_amt, local_currency_cd,
                document_num, fiscal_yr, fiscal_mo, is_reversed,
                created_ts, modified_ts, row_hash, source_system,
                pipeline_run_id

Lakehouse:      lh_fin_gold_prd
Notebook:       nb_fin_aggregate_gold
Gold table:     gld_fin_trial_balance_monthly_snapshot
  Columns:      snapshot_dt, company_cd, gl_account_cd,
                gl_account_nm, cost_center_cd, cost_center_nm,
                period_debit_amt, period_credit_amt, ytd_debit_amt,
                ytd_credit_amt, balance_amt, fiscal_yr, fiscal_mo,
                created_ts, pipeline_run_id

Warehouse:      wh_fin_reporting_prd
Schema:         presentation
Fact table:     presentation.fct_gl_posting
  Columns:      gl_posting_sk, gl_line_item_bk, date_sk,
                gl_account_sk, cost_center_sk, company_sk,
                debit_amt, credit_amt, balance_amt,
                is_reversed, created_ts, modified_ts, row_hash,
                source_system, pipeline_run_id

Dimension:      presentation.dim_gl_account
Dimension:      presentation.dim_cost_center
Semantic Model: sm_fin_management_v1
Report:         rpt_fin_trial_balance_mgmt
```

### Flow B: Epicor Production Data (Work Orders to OEE)

```
Workspace:      ws_mfg_analytics_prd
Lakehouse:      lh_mfg_bronze_prd
Pipeline:       pl_epicor_prod_bronze_hourly_v2
Bronze table:   brz_epc_prod_job_head_delta
  Columns:      job_num, part_num, order_qty, produced_qty,
                start_dt, due_dt, job_status_cd, plant_cd,
                ingested_ts, source_file_nm, batch_id,
                pipeline_run_id

Bronze table:   brz_epc_prod_job_oper_delta
  Columns:      job_num, oper_seq_num, resource_group_cd,
                resource_cd, est_setup_dur, est_prod_dur,
                actual_setup_dur, actual_prod_dur, qty_completed,
                scrap_qty, ingested_ts, batch_id, pipeline_run_id

Notebook:       nb_mfg_transform_silver
Silver table:   slv_mfg_work_order_current
  Columns:      work_order_sk, work_order_bk, part_bk,
                order_qty, produced_qty, scrap_qty, start_dt,
                due_dt, completion_dt, status_cd, plant_cd,
                is_complete, is_on_hold, created_ts, modified_ts,
                row_hash, source_system, pipeline_run_id

Silver table:   slv_mfg_work_order_operation_current
  Columns:      work_order_oper_sk, work_order_bk, oper_seq_num,
                work_center_bk, setup_time_dur, run_time_dur,
                qty_completed, scrap_qty, yield_pct, status_cd,
                is_complete, created_ts, modified_ts, row_hash,
                source_system, pipeline_run_id

Lakehouse:      lh_mfg_gold_prd
Notebook:       nb_analytics_oee_calculation
Gold table:     gld_mfg_oee_metric_daily_snapshot
  Columns:      snapshot_dt, plant_cd, plant_nm, line_cd,
                line_nm, work_center_cd, work_center_nm,
                availability_pct, performance_pct, quality_pct,
                oee_pct, planned_run_dur, actual_run_dur,
                downtime_dur, ideal_cycle_dur, actual_cycle_dur,
                total_qty, good_qty, defect_qty, fpy_pct,
                created_ts, pipeline_run_id

Warehouse:      wh_mfg_serving_prd
Schema:         presentation
Fact table:     presentation.fct_production_output
Dimension:      presentation.dim_product
Dimension:      presentation.dim_equipment
Dimension:      presentation.dim_work_center
Dimension:      presentation.dim_plant
Dimension:      presentation.dim_shift
Semantic Model: sm_mfg_operations_v1
Report:         rpt_mfg_oee_dashboard_ops
```

---

## 9. Azure Resource Names (CAF-Aligned)

Infrastructure resources for this client use hyphen-delimited Azure Cloud Adoption Framework patterns.

| Resource | Pattern | Example | Description |
|---|---|---|---|
| Resource Group | `rg-{workload}-{domain}-{env}-{region}-{instance}` | `rg-data-mfg-prd-eus-001` | Manufacturing data platform resource group |
| Storage Account | `st{workload}{domain}{env}{region}{instance}` | `stdatamfgprdeus001` | Manufacturing data lake storage (no hyphens) |
| Key Vault | `kv-{workload}-{domain}-{env}-{region}-{instance}` | `kv-data-mfg-prd-eus-001` | Secrets for manufacturing pipelines |
| SQL Database | `sqldb-{workload}-{domain}-{env}-{region}-{instance}` | `sqldb-erp-fin-prd-eus-001` | SAP financial database |
| IoT Hub | `iot-{workload}-{domain}-{env}-{region}-{instance}` | `iot-telemetry-mfg-prd-eus-001` | Shop floor IoT gateway |
| Event Hub NS | `evhns-{workload}-{domain}-{env}-{region}-{instance}` | `evhns-streaming-iot-prd-eus-001` | IoT event streaming namespace |
| Fabric Capacity | `fc-{workload}-{env}-{region}-{instance}` | `fc-dataplatform-prd-eus-001` | Fabric capacity for production |
| Log Analytics | `log-{workload}-{env}-{region}-{instance}` | `log-dataplatform-prd-eus-001` | Platform monitoring workspace |

---

## 10. Domain-Specific Column Naming

Manufacturing columns follow ISL-03 column naming standards. Key domain-specific columns by category:

| Column Name | Suffix/Prefix | Category | Description |
|---|---|---|---|
| `produced_qty` | `_qty` | Production | Good units produced |
| `scrap_qty` | `_qty` | Production | Scrapped units |
| `rework_qty` | `_qty` | Production | Reworked units |
| `setup_time_dur` | `_dur` | Production | Setup/changeover duration in minutes |
| `run_time_dur` | `_dur` | Production | Production run duration in minutes |
| `cycle_time_dur` | `_dur` | Production | Actual cycle time per unit in seconds |
| `takt_time_dur` | `_dur` | Production | Target takt time per unit in seconds |
| `labor_cost_amt` | `_amt` | Production | Labor cost for the operation |
| `oee_pct` | `_pct` | Quality/KPI | Overall Equipment Effectiveness |
| `availability_pct` | `_pct` | Quality/KPI | OEE availability component |
| `performance_pct` | `_pct` | Quality/KPI | OEE performance component |
| `fpy_pct` | `_pct` | Quality/KPI | First pass yield percentage |
| `cpk_val` | `_val` | Quality/KPI | Process capability index |
| `measured_val` | `_val` | Inspection | Inspection measured value |
| `downtime_dur` | `_dur` | Maintenance | Downtime duration in minutes |
| `mtbf_dur` | `_dur` | Maintenance | Mean time between failures in hours |
| `mttr_dur` | `_dur` | Maintenance | Mean time to repair in hours |
| `reading_val` | `_val` | IoT | Sensor reading value |
| `vibration_val` | `_val` | IoT | Vibration amplitude measurement |
| `temperature_val` | `_val` | IoT | Temperature measurement |
| `is_complete` | `is_` | Boolean | Work order or operation is finished |
| `is_reworked` | `is_` | Boolean | Unit was reworked |
| `is_scrapped` | `is_` | Boolean | Unit was scrapped |
| `is_backflush` | `is_` | Boolean | Material consumed via backflushing |
| `is_lot_tracked` | `is_` | Boolean | Material uses lot/batch tracking |
| `has_bom` | `has_` | Boolean | Product has a bill of materials |
| `has_routing` | `has_` | Boolean | Product has a production routing |
| `should_inspect` | `should_` | Boolean | Incoming material requires QC inspection |
| `was_expedited` | `was_` | Boolean | Work order was expedited |

---

## Cross-References

- **ISL-03 Fabric Naming Reference** -- `examples/fabric-naming-reference.md` -- Complete Fabric artifact naming examples across all types
- **ISL-03 Database and Schema Naming** -- `templates/database-schema-naming.md` -- Lakehouse, warehouse, and schema patterns
- **ISL-03 Table and View Naming** -- `templates/table-view-naming.md` -- Table prefix conventions and temporal indicators
- **ISL-03 Column Naming Standards** -- `templates/column-naming-standards.md` -- Column suffix and prefix rules
- **ISL-04 Data Classification** -- Domain taxonomy governance and data sensitivity classification
- **ISL-06 Metadata and Lineage** -- Catalog registration naming for manufacturing entities

---

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-06-15 | DMTSP Enterprise Architecture | Initial release for dual-ERP manufacturing client profile |

# Table & View Naming Standards
> Module: ISL-03 | Version: 1.0 | Adaptation Effort: 2-3 hrs | Dependencies: ISL-03 abbreviation-dictionary, ISL-03 database-schema-naming, ISL-04 Data Classification

## Purpose

This standard defines deterministic, self-documenting naming patterns for tables, views, materialized views, and temporary objects across Microsoft Fabric lakehouses, Fabric warehouses, and Azure SQL databases. Table and view names are the most frequently referenced identifiers in any data platform -- analysts write queries against them, pipelines load into them, reports bind to them, and governance tools catalog them. A clear naming convention at this level eliminates ambiguity, accelerates onboarding, and enables automated governance enforcement.

## Scope

### In Scope
- Entity naming patterns for all table types: facts, dimensions, bridges, staging, reference, control, and audit
- Medallion layer table prefixes (bronze, silver, gold)
- Temporal indicator suffixes for snapshot, current, historical, and periodic tables
- View and materialized view naming conventions
- Staging table patterns for merge, upsert, and CDC workflows
- Character constraints and maximum length rules
- Anti-patterns and prohibited naming practices

### Out of Scope
- Column-level naming conventions (see `templates/column-naming-standards.md`)
- Database and schema naming (see `templates/database-schema-naming.md`)
- Pipeline and dataflow artifact naming (see `templates/pipeline-dataflow-naming.md`)
- Physical storage layout (Delta table partitioning, file organization)
- Data modeling methodology (star schema design decisions are outside naming scope)

---

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default Value | Client Value | Notes |
|-----------|---------------|--------------|-------|
| Entity Casing Convention | snake_case (lowercase) | `[CONFIRM_OR_OVERRIDE]` | All table/view names must be lowercase |
| Singular vs. Plural | Singular nouns | `[CONFIRM_OR_OVERRIDE]` | Some clients have strong plural preferences |
| Medallion Layer Prefixes | `brz_`, `slv_`, `gld_` | `[CONFIRM_OR_OVERRIDE]` | Three-letter abbreviations for table prefixes |
| Dimensional Model Prefixes | `fct_`, `dim_`, `brg_`, `agg_` | `[CONFIRM_OR_OVERRIDE]` | Standard Kimball-aligned prefixes |
| Maximum Table Name Length | 80 characters (recommended) | `[CONFIRM_OR_OVERRIDE]` | Platform max is 128-256 depending on target |
| Primary ERP System | SAP / Epicor | `[CLIENT_ERP]` | Drives bronze-layer source naming |
| Domain Taxonomy | Manufacturing-centric | `[CLIENT_DOMAINS]` | From ISL-04 Data Classification |
| Staging Table Retention | Pipeline run lifetime | `[CONFIRM_OR_OVERRIDE]` | Some clients persist staging for debugging |
| View Prefix Convention | `vw_`, `mvw_` | `[CONFIRM_OR_OVERRIDE]` | Prefix for standard and materialized views |
| Legacy Migration Mapping | Not applicable | `[CLIENT_LEGACY_MAP]` | Document old-to-new table name mappings |

---

## 1. Entity Naming Rules

### 1.1 Singular vs. Plural

| Rule | Example (Correct) | Example (Incorrect) |
|------|-------------------|---------------------|
| Use singular nouns for entities | `customer`, `work_order`, `product` | `customers`, `work_orders`, `products` |
| Use singular for fact tables | `fct_production_output` | `fct_production_outputs` |
| Use singular for dimension tables | `dim_product` | `dim_products` |
| Use plural only for collection views | `vw_active_customers` | `vw_active_customer` |

### 1.2 Business Domain Alignment

Table names must reflect the business entity, not the source system field name. Use full business terms from the approved glossary, not source-system abbreviations.

| Source System Name | Correct Table Name | Rationale |
|-------------------|--------------------|-----------|
| `MARA` (SAP) | `material` | Business term, not SAP table code |
| `AFKO` (SAP) | `work_order` | Business term, not SAP table code |
| `VBAK` (SAP) | `sales_order` | Business term, not SAP table code |
| `JobHead` (Epicor) | `work_order` | Standardized across ERP sources |
| `PORel` (Epicor) | `purchase_order_release` | Full business term |
| `PartBin` (Epicor) | `inventory_location` | Business term, not Epicor-specific |

### 1.3 Multi-Word Entities

- Separate words with underscores
- Keep entity names to 2-4 words maximum
- Use the abbreviation dictionary for approved short forms when names exceed 4 words

| Entity Name | Status | Notes |
|-------------|--------|-------|
| `work_order` | Approved | Two words, clear meaning |
| `bill_of_material` | Approved | Three words, standard term |
| `purchase_order_line_item` | Approved | Four words, acceptable |
| `customer_ship_to_address_detail` | Too long | Shorten to `customer_ship_addr` |

---

## 2. Medallion Layer Prefixes

Every table within a lakehouse must carry a layer prefix indicating its position in the medallion architecture.

| Prefix | Layer | Purpose | Typical Transformations |
|--------|-------|---------|------------------------|
| `brz_` | Bronze (raw) | Raw ingestion | Source-faithful copy, minimal or no transformation |
| `slv_` | Silver (cleansed) | Cleansed / conformed | Data type casting, null handling, deduplication, key conforming |
| `gld_` | Gold (business) | Business-ready | Business logic, aggregation, enrichment, calculated fields |

### 2.1 Bronze Layer Naming Pattern

```
brz_{source_system}_{entity}_{qualifier}
```

| Table Name | Source | Description |
|-----------|--------|-------------|
| `brz_sap_material_master` | SAP MM | Raw material master extract |
| `brz_sap_work_order_header` | SAP PP | Raw work order headers |
| `brz_sap_work_order_operation` | SAP PP | Raw work order operations |
| `brz_sap_purchase_order` | SAP MM | Raw purchase order extract |
| `brz_sap_gl_line_item` | SAP FI | Raw general ledger postings |
| `brz_epicor_job_head` | Epicor | Raw job header data |
| `brz_epicor_job_oper` | Epicor | Raw job operations |
| `brz_epicor_part_master` | Epicor | Raw part master data |
| `brz_iot_sensor_reading` | IoT Hub | Raw sensor telemetry |
| `brz_iot_equipment_event` | SCADA | Raw equipment events |
| `brz_api_customer_payload` | REST API | Raw API response payloads |
| `brz_file_invoice_csv` | SFTP | Raw flat file ingestion |

### 2.2 Silver Layer Naming Pattern

```
slv_{entity}_{temporal}
```

| Table Name | Source Layer | Description |
|-----------|-------------|-------------|
| `slv_material` | Bronze | Cleansed material master, conformed keys |
| `slv_work_order` | Bronze | Deduplicated, typed work orders |
| `slv_work_order_operation` | Bronze | Validated operations with FK to work order |
| `slv_purchase_order` | Bronze | Cleansed purchase orders |
| `slv_gl_line_item` | Bronze | Validated GL postings |
| `slv_customer` | Bronze | Deduplicated customer records |
| `slv_vendor` | Bronze | Cleansed vendor master |
| `slv_product` | Bronze | Conformed product data from multiple sources |
| `slv_sensor_reading` | Bronze | Validated, typed sensor readings |
| `slv_equipment` | Bronze | Cleansed equipment master |
| `slv_employee` | Bronze | Validated employee records |
| `slv_plant` | Bronze | Plant/facility reference data |

### 2.3 Gold Layer Naming Pattern

```
gld_{entity_or_metric}_{temporal}
```

| Table Name | Source Layer | Description |
|-----------|-------------|-------------|
| `gld_production_summary` | Silver | Daily production output aggregates |
| `gld_oee_metric` | Silver | OEE calculations by line/shift |
| `gld_inventory_position` | Silver | Current inventory levels |
| `gld_financial_summary` | Silver | Monthly financial aggregations |
| `gld_customer_lifetime_value` | Silver | Calculated CLV metrics |
| `gld_vendor_scorecard` | Silver | Vendor performance metrics |
| `gld_quality_defect_rate` | Silver | Defect rate by product/line |
| `gld_sales_forecast` | Silver | Sales forecast aggregations |
| `gld_equipment_utilization` | Silver | Equipment utilization metrics |
| `gld_energy_consumption` | Silver | Energy usage aggregations |

---

## 3. Dimensional Model Prefixes

Within the gold layer or warehouse presentation schema, dimensional model tables use these standard prefixes.

| Prefix | Type | Purpose | Description |
|--------|------|---------|-------------|
| `fct_` | Fact | Measures and metrics | Quantitative, event-based, additive measures at a defined grain |
| `dim_` | Dimension | Descriptive attributes | Slowly changing or static descriptive reference data |
| `brg_` | Bridge | Many-to-many resolution | Resolves M:N relationships between facts and dimensions |
| `agg_` | Aggregate | Pre-aggregated facts | Performance-optimized rollups for common query patterns |
| `ref_` | Reference | Lookup / code table | Static or rarely changing reference and code tables |
| `ctl_` | Control | Pipeline metadata | Watermarks, configuration, run control parameters |
| `aud_` | Audit | Audit / tracking | Change tracking, audit logs, compliance records |

### 3.1 Fact Table Examples

| Table Name | Grain | Key Measures | Description |
|-----------|-------|-------------|-------------|
| `fct_production_output` | Work order + operation + shift | quantity_produced, scrap_qty, cycle_time | Production output events |
| `fct_sales_order` | Order line item | order_qty, unit_price, line_amt | Sales transactions |
| `fct_purchase_order` | PO line item | order_qty, unit_cost, line_amt | Purchase transactions |
| `fct_gl_posting` | GL line item | debit_amt, credit_amt | General ledger postings |
| `fct_quality_inspection` | Inspection lot + characteristic | measured_value, defect_qty | Quality inspection results |
| `fct_sensor_reading` | Sensor + timestamp | reading_value, signal_quality | IoT sensor measurements |
| `fct_equipment_downtime` | Equipment + event | downtime_minutes, event_count | Equipment downtime events |
| `fct_inventory_movement` | Material + movement type | movement_qty, movement_amt | Inventory transactions |
| `fct_maintenance_order` | Maintenance order | actual_cost, planned_cost | Maintenance work orders |
| `fct_shipping` | Delivery + item | shipped_qty, weight, volume | Shipping/logistics events |

### 3.2 Dimension Table Examples

| Table Name | Type | Key Attributes | Description |
|-----------|------|---------------|-------------|
| `dim_date` | Static | calendar_dt, fiscal_year, fiscal_period | Enterprise date dimension |
| `dim_time` | Static | hour, minute, shift_nm | Time-of-day dimension |
| `dim_product` | SCD Type 2 | product_cd, product_nm, product_category | Product master |
| `dim_material` | SCD Type 2 | material_cd, material_nm, material_group | Material master |
| `dim_customer` | SCD Type 2 | customer_cd, customer_nm, customer_region | Customer master |
| `dim_vendor` | SCD Type 2 | vendor_cd, vendor_nm, vendor_region | Vendor/supplier master |
| `dim_plant` | SCD Type 1 | plant_cd, plant_nm, plant_country | Plant/facility reference |
| `dim_equipment` | SCD Type 2 | equipment_cd, equipment_nm, equipment_type | Equipment/asset master |
| `dim_employee` | SCD Type 2 | employee_id, employee_nm, department | Employee reference |
| `dim_cost_center` | SCD Type 1 | cost_center_cd, cost_center_nm | Cost center hierarchy |
| `dim_work_center` | SCD Type 1 | work_center_cd, work_center_nm, capacity | Work center reference |
| `dim_shift` | Static | shift_cd, shift_nm, start_tm, end_tm | Shift schedule |

### 3.3 Bridge, Aggregate, Reference, Control, and Audit Table Examples

| Table Name | Prefix | Description |
|-----------|--------|-------------|
| `brg_product_material` | `brg_` | M:N relationship between products and materials (BOM explosion) |
| `brg_customer_hierarchy` | `brg_` | Customer hierarchy with multiple parent paths |
| `brg_gl_account_hierarchy` | `brg_` | GL account rollup paths |
| `brg_employee_skill` | `brg_` | M:N mapping between employees and skill certifications |
| `agg_production_daily` | `agg_` | Daily production aggregates by plant and product |
| `agg_sales_monthly` | `agg_` | Monthly sales aggregates by customer and product |
| `agg_inventory_weekly` | `agg_` | Weekly inventory position snapshots |
| `agg_oee_shift` | `agg_` | OEE metrics aggregated by shift |
| `ref_country` | `ref_` | ISO country codes and names |
| `ref_currency` | `ref_` | ISO currency codes and exchange rate type |
| `ref_uom` | `ref_` | Unit of measure lookup |
| `ref_status_code` | `ref_` | Standardized status codes across domains |
| `ref_material_group` | `ref_` | Material group classification hierarchy |
| `ctl_pipeline_watermark` | `ctl_` | High-watermark tracking for incremental loads |
| `ctl_pipeline_config` | `ctl_` | Pipeline configuration parameters and feature flags |
| `ctl_data_quality_threshold` | `ctl_` | Quality rule thresholds and tolerance settings |
| `ctl_schedule_config` | `ctl_` | Schedule definitions and run windows |
| `aud_pipeline_run` | `aud_` | Pipeline execution audit log with status and duration |
| `aud_data_change` | `aud_` | Record-level change audit trail |
| `aud_access_log` | `aud_` | Data access audit for compliance |
| `aud_schema_change` | `aud_` | Schema evolution tracking |

---

## 4. Temporal Indicators

Temporal suffixes indicate how the table handles time and history.

| Suffix | Meaning | Description | Example |
|--------|---------|-------------|---------|
| `_current` | Current state | Latest version of each record; overwrites | `slv_work_order_current` |
| `_historical` | Full history | All versions retained, append-only | `slv_work_order_historical` |
| `_snapshot` | Point-in-time capture | Periodic full snapshots | `gld_inventory_snapshot` |
| `_daily` | Daily grain | Daily-level aggregation or snapshot | `gld_production_daily` |
| `_weekly` | Weekly grain | Weekly-level aggregation or snapshot | `agg_inventory_weekly` |
| `_monthly` | Monthly grain | Monthly-level aggregation or snapshot | `gld_financial_monthly` |
| `_daily_snapshot` | Daily snapshot | Daily point-in-time full capture | `gld_inventory_daily_snapshot` |
| `_weekly_snapshot` | Weekly snapshot | Weekly point-in-time full capture | `gld_ar_aging_weekly_snapshot` |
| `_monthly_snapshot` | Monthly snapshot | Monthly point-in-time full capture | `gld_financial_monthly_snapshot` |
| `_scd_type1` | SCD Type 1 | Overwrite; no history retained | `dim_plant_scd_type1` |
| `_scd_type2` | SCD Type 2 | Versioned with effective dates | `dim_customer_scd_type2` |
| `_full` | Full extract | Complete source extract (no delta) | `brz_sap_material_master_full` |
| `_delta` | Delta / CDC | Change data capture increments | `brz_sap_gl_line_item_delta` |
| `_latest` | Latest per key | Deduplicated to most recent per business key | `slv_sensor_reading_latest` |

**Rules:**
- Temporal suffixes are optional for bronze tables (bronze is typically append-only by default)
- Silver tables should indicate `_current` or `_historical` when both variants exist
- Gold tables should indicate snapshot frequency when applicable
- Dimensional tables use `_scd_type1` or `_scd_type2` only when both types exist for the same entity; otherwise, the SCD type is documented in metadata, not the name

---

## 5. Staging and Temporary Table Patterns

Staging tables support pipeline execution workflows including merge, upsert, CDC, and deduplication operations.

| Prefix | Purpose | Lifetime | Description |
|--------|---------|----------|-------------|
| `stg_` | Pipeline staging | Pipeline run | Intermediate tables used during pipeline execution for merge/upsert |
| `raw_` | Raw landing zone | Persistent | Source-format landing tables (alternative to `brz_` in some architectures) |
| `tmp_` | Temporary processing | Session/job | Temporary tables for in-flight calculations; dropped after job completes |
| `wrk_` | Working/scratch | Pipeline run | Working tables for multi-step transformations |
| `rej_` | Rejected records | Persistent | Records that failed validation (linked to ISL-02 Data Quality) |
| `quarantine_` | Quarantine | Persistent | Records under review, not yet validated or approved |

### 5.1 Staging Table Examples for Merge/Upsert Workflows

| Table Name | Workflow | Description |
|-----------|----------|-------------|
| `stg_sap_material_merge` | Merge | Staging table for material master upsert into silver |
| `stg_epicor_job_transform` | Transform | Staging table for Epicor job transformation before merge |
| `stg_customer_dedup` | Deduplication | Staging table for customer deduplication processing |
| `stg_inventory_snapshot_prep` | Snapshot | Staging table for daily inventory snapshot preparation |
| `stg_gl_posting_reconcile` | Reconciliation | Staging table for GL posting source-target reconciliation |
| `stg_sensor_reading_validate` | Validation | Staging table for sensor data quality validation |

### 5.2 Rejection and Quarantine Examples

| Table Name | Description |
|-----------|-------------|
| `rej_sap_gl_posting` | GL postings that failed validation rules |
| `rej_iot_sensor_reading` | Sensor readings outside valid range |
| `rej_customer_invalid_address` | Customer records with invalid address data |
| `quarantine_customer_duplicate` | Possible duplicate customers pending manual review |
| `quarantine_vendor_sanctions_check` | Vendors pending sanctions list screening |

---

## 6. View Naming

### 6.1 View Type Prefixes

| Prefix | Type | Purpose | Description |
|--------|------|---------|-------------|
| `vw_` | Standard view | Consumption / security | Logical view for query consumers; no physical storage |
| `mvw_` | Materialized view | Performance optimization | Physically stored view, periodically refreshed |

### 6.2 View Naming Pattern

```
vw_{purpose_or_audience}_{entity}_{qualifier}
mvw_{aggregation}_{entity}_{qualifier}
```

### 6.3 Standard View Examples

| View Name | Base Table(s) | Purpose |
|-----------|--------------|---------|
| `vw_active_customer` | `dim_customer` | Filters to active customers only |
| `vw_current_inventory` | `gld_inventory_daily_snapshot` | Latest inventory position across all warehouses |
| `vw_open_work_order` | `fct_production_output`, `dim_date` | In-progress work orders not yet completed |
| `vw_sales_ytd` | `fct_sales_order`, `dim_date` | Year-to-date sales aggregation |
| `vw_rls_customer_region` | `dim_customer` | Row-level security filter by customer region |
| `vw_rls_plant_access` | `dim_plant` | Row-level security filter by plant assignment |
| `vw_finance_trial_balance` | `fct_gl_posting`, `dim_cost_center` | Trial balance for finance team consumption |
| `vw_production_dashboard` | `fct_production_output`, `dim_product` | Production dashboard data source |
| `vw_quality_defect_pareto` | `fct_quality_inspection` | Pareto analysis for quality defect reporting |
| `vw_vendor_performance` | `fct_purchase_order`, `dim_vendor` | Vendor on-time delivery and quality score |
| `vw_equipment_maintenance_due` | `fct_maintenance_order`, `dim_equipment` | Equipment with upcoming preventive maintenance |
| `vw_overdue_purchase_order` | `fct_purchase_order`, `dim_date` | Purchase orders past their expected receipt date |

### 6.4 Materialized View Examples

| View Name | Base Table(s) | Purpose |
|-----------|--------------|---------|
| `mvw_daily_production_summary` | `fct_production_output` | Materialized daily production rollup |
| `mvw_monthly_revenue` | `fct_sales_order` | Materialized monthly revenue aggregation |
| `mvw_inventory_abc_class` | `gld_inventory_position` | Materialized ABC inventory classification |
| `mvw_oee_weekly_trend` | `fct_production_output`, `dim_equipment` | Materialized weekly OEE trend by equipment |
| `mvw_vendor_spend_quarterly` | `fct_purchase_order`, `dim_vendor` | Materialized quarterly vendor spend rollup |

---

## 7. Character Rules and Constraints

| Rule | Specification |
|------|--------------|
| Case | Lowercase only |
| Delimiter | Underscore (`_`) only |
| Allowed characters | `a-z`, `0-9`, `_` |
| Leading character | Must begin with a letter (the prefix satisfies this) |
| Maximum length -- Fabric Lakehouse table | 256 characters |
| Maximum length -- Fabric Warehouse table | 128 characters |
| Maximum length -- Azure SQL table/view | 128 characters |
| Recommended practical length | 30-80 characters |
| SQL reserved words | Prohibited as table or view names |
| Plural vs. singular | Singular for tables; plural allowed for collection views |

---

## 8. Complete Examples Table

The following table provides 25+ concrete naming examples spanning all table types and layers.

| # | Table/View Name | Type | Layer/Schema | Domain | Description |
|---|----------------|------|-------------|--------|-------------|
| 1 | `brz_sap_material_master_full` | Bronze table | Bronze | Manufacturing | Full extract of SAP material master |
| 2 | `brz_sap_gl_line_item_delta` | Bronze table | Bronze | Finance | CDC delta extract from SAP GL |
| 3 | `brz_iot_sensor_reading` | Bronze table | Bronze | IoT | Raw telemetry from IoT Hub |
| 4 | `brz_epicor_job_head` | Bronze table | Bronze | Manufacturing | Raw Epicor job headers |
| 5 | `slv_material_current` | Silver table | Silver | Manufacturing | Current version of cleansed material |
| 6 | `slv_work_order_historical` | Silver table | Silver | Manufacturing | Full history of work orders |
| 7 | `slv_customer` | Silver table | Silver | Sales | Deduplicated customer master |
| 8 | `slv_sensor_reading_latest` | Silver table | Silver | IoT | Latest reading per sensor |
| 9 | `gld_production_daily` | Gold table | Gold | Manufacturing | Daily production output aggregates |
| 10 | `gld_oee_metric` | Gold table | Gold | Manufacturing | OEE by line and shift |
| 11 | `gld_inventory_daily_snapshot` | Gold table | Gold | Supply Chain | Daily inventory position snapshot |
| 12 | `gld_financial_monthly_snapshot` | Gold table | Gold | Finance | Monthly financial close snapshot |
| 13 | `fct_production_output` | Fact table | Presentation | Manufacturing | Production event fact at operation grain |
| 14 | `fct_sales_order` | Fact table | Presentation | Sales | Sales order line fact |
| 15 | `fct_quality_inspection` | Fact table | Presentation | Quality | Inspection lot results |
| 16 | `dim_product` | Dimension table | Presentation | Shared | Product master SCD Type 2 |
| 17 | `dim_customer` | Dimension table | Presentation | Sales | Customer master SCD Type 2 |
| 18 | `dim_date` | Dimension table | Presentation | Shared | Enterprise date/calendar dimension |
| 19 | `brg_product_material` | Bridge table | Presentation | Manufacturing | Product-to-material BOM explosion |
| 20 | `agg_sales_monthly` | Aggregate table | Presentation | Sales | Monthly sales rollup |
| 21 | `ref_country` | Reference table | Conformed | Shared | ISO country codes |
| 22 | `ref_uom` | Reference table | Conformed | Shared | Unit of measure lookup |
| 23 | `ctl_pipeline_watermark` | Control table | Audit | Shared | Incremental load watermarks |
| 24 | `aud_pipeline_run` | Audit table | Audit | Shared | Pipeline execution log |
| 25 | `stg_sap_material_merge` | Staging table | Staging | Manufacturing | Merge staging for material upsert |
| 26 | `rej_iot_sensor_reading` | Rejection table | Staging | IoT | Sensor readings failing quality rules |
| 27 | `vw_active_customer` | Standard view | Presentation | Sales | Active-only customer filter view |
| 28 | `vw_rls_plant_access` | Security view | Security | Shared | Row-level security by plant |
| 29 | `mvw_daily_production_summary` | Materialized view | Presentation | Manufacturing | Materialized daily production rollup |

---

## 9. Naming Decision Tree

Use this decision tree when creating a new table or view.

```
1. What layer / schema?
   +-- Lakehouse (medallion)
   |   +-- Raw ingestion? --> brz_{source}_{entity}_{qualifier}
   |   +-- Cleansed / conformed? --> slv_{entity}_{temporal}
   |   +-- Business-ready / aggregated? --> gld_{entity}_{temporal}
   +-- Warehouse (dimensional)
   |   +-- Measures at a grain? --> fct_{entity}
   |   +-- Descriptive attributes? --> dim_{entity}
   |   +-- M:N resolver? --> brg_{entity_a}_{entity_b}
   |   +-- Pre-aggregated rollup? --> agg_{entity}_{frequency}
   |   +-- Lookup / code table? --> ref_{entity}
   |   +-- Pipeline control data? --> ctl_{purpose}
   |   +-- Audit / compliance log? --> aud_{purpose}
   +-- Staging / temporary?
       +-- Merge/upsert staging? --> stg_{source}_{entity}_{operation}
       +-- Rejected records? --> rej_{source}_{entity}
       +-- Quarantined records? --> quarantine_{entity}_{reason}

2. Add temporal suffix (if applicable):
   +-- _current, _historical, _snapshot, _daily, _monthly

3. Validate:
   +-- Lowercase? Snake_case? Under 80 chars? No reserved words?
   +-- Prefix from approved list? Entity from business glossary?
```

---

## 10. Anti-Patterns and Prohibited Patterns

| Anti-Pattern | Example | Why It Is Wrong | Correct Alternative |
|-------------|---------|-----------------|-------------------|
| PascalCase table names | `FactSalesOrder` | Inconsistent with snake_case standard | `fct_sales_order` |
| Plural entity names | `fct_sales_orders` | Convention is singular nouns | `fct_sales_order` |
| No prefix | `sales_order` | Ambiguous -- fact? dimension? staging? | `fct_sales_order` or `stg_sales_order` |
| Source system codes as names | `AFKO` or `MARA` | Not self-documenting to non-SAP users | `work_order`, `material` |
| Encoded dates in table names | `fct_sales_20250101` | Creates table proliferation, breaks automation | Use partitioning instead |
| Spaces in names | `Sales Order` | Requires bracket quoting, breaks scripting | `sales_order` |
| Leading underscores | `_temp_table` | Ambiguous, platform-specific meaning | `tmp_table` |
| Hungarian notation | `tblSalesOrder` | Mixes casing, non-standard prefix | `fct_sales_order` |
| Overly abbreviated | `fct_prd_out` | Unreadable; abbreviations not in dictionary | `fct_production_output` |
| Inconsistent layer prefixes | `bronze_material` | Must use standard three-letter prefix `brz_` | `brz_sap_material_master` |
| No layer prefix in lakehouse | `material_master` | Ambiguous -- which layer? | `slv_material` |
| Mixing fact/dim in one table | `sales_order_with_customer` | Violates dimensional modeling separation | Separate `fct_sales_order` and `dim_customer` |
| SQL reserved words | `order`, `group`, `select` | Causes query syntax errors | `sales_order`, `material_group`, `selection_criteria` |
| Using `dbo` schema | `dbo.FactSales` | Default schema signals no governance | `presentation.fct_sales_order` |
| Personal names in tables | `john_test_fact` | Not sustainable, not discoverable | Use `sbx` environment sandbox |
| Mixed delimiters | `brz-sap_material.master` | Inconsistent, error-prone | `brz_sap_material_master` |

---

## Fabric / Azure Implementation Guidance

### Delta Table Naming in Fabric Lakehouses

Fabric lakehouses store tables as Delta Lake format. Table names map directly to Delta table folder names in OneLake storage. This means:

- Table names must comply with both SQL naming rules and file system naming rules
- Avoid special characters that may conflict with file system paths
- Table names are case-insensitive in Fabric SQL but case-preserving in OneLake storage -- always use lowercase to prevent ambiguity

### Fabric Warehouse Table Naming

Fabric warehouses support T-SQL DDL. Tables must be created within an explicit schema (never use `dbo`):

```sql
-- Correct: explicit schema
CREATE TABLE presentation.fct_production_output ( ... );
CREATE TABLE presentation.dim_product ( ... );
CREATE TABLE audit.aud_pipeline_run ( ... );

-- Incorrect: default dbo schema
CREATE TABLE dbo.fct_production_output ( ... );
```

### View Deployment in Fabric

Views in Fabric warehouses are created using standard T-SQL. Naming must follow the `vw_` / `mvw_` convention:

```sql
CREATE VIEW presentation.vw_active_customer AS
SELECT * FROM presentation.dim_customer WHERE is_current = 1 AND is_active = 1;
```

### Naming Validation Script (Python)

```python
import re

VALID_TABLE_PREFIXES = [
    'brz', 'slv', 'gld', 'fct', 'dim', 'brg', 'agg',
    'ref', 'ctl', 'aud', 'stg', 'raw', 'tmp', 'wrk', 'rej', 'quarantine'
]
VALID_VIEW_PREFIXES = ['vw', 'mvw']
VALID_TEMPORALS = [
    'current', 'historical', 'snapshot', 'daily', 'weekly', 'monthly',
    'daily_snapshot', 'weekly_snapshot', 'monthly_snapshot',
    'scd_type1', 'scd_type2', 'full', 'delta', 'latest'
]

def validate_table_name(name: str) -> tuple[bool, str]:
    """Validate a table name against the ISL-03 naming standard."""
    if not re.match(r'^[a-z][a-z0-9_]{1,255}$', name):
        return False, "Name must be lowercase alphanumeric with underscores, starting with a letter"
    parts = name.split('_')
    prefix = parts[0]
    if prefix not in VALID_TABLE_PREFIXES and prefix not in VALID_VIEW_PREFIXES:
        return False, f"Invalid prefix '{prefix}'. Must be one of: {VALID_TABLE_PREFIXES + VALID_VIEW_PREFIXES}"
    if len(name) > 80:
        return False, f"Name exceeds recommended 80 characters (length: {len(name)})"
    return True, "Valid"
```

---

## Manufacturing Overlay [CONDITIONAL]

### Manufacturing-Specific Table Patterns

Manufacturing engagements frequently require these specialized table patterns. Include this section when the client domain includes manufacturing, production, or industrial operations.

| Table Name | Type | Description |
|-----------|------|-------------|
| `fct_production_output` | Fact | Production output at work order + operation grain |
| `fct_equipment_downtime` | Fact | Equipment downtime events with reason codes |
| `fct_quality_inspection` | Fact | Inspection results with measured values |
| `fct_scrap_event` | Fact | Scrap and rework events with root cause |
| `dim_equipment` | Dimension | Equipment/asset master with specifications |
| `dim_work_center` | Dimension | Work center capacity and scheduling |
| `dim_shift` | Dimension | Shift schedule definitions |
| `dim_defect_code` | Dimension | Quality defect classification codes |
| `gld_oee_metric` | Gold | Overall Equipment Effectiveness by line/shift |
| `gld_takt_time_variance` | Gold | Takt time variance analysis |
| `gld_wip_aging` | Gold | Work-in-progress aging report data |
| `gld_spc_control_limit` | Gold | Statistical process control limits and violations |
| `ref_machine_type` | Reference | Machine type classification |
| `ref_defect_category` | Reference | Defect category hierarchy |
| `ctl_mes_integration_watermark` | Control | MES integration watermark tracking |

### ITAR / Export Control Naming Considerations

For defense and aerospace manufacturing clients, tables containing ITAR or export-controlled data must include classification indicators at the schema level (not the table name). Table names themselves do not encode sensitivity -- this is handled by ISL-04 Data Classification metadata tags and ISL-05 Security Patterns schema-level isolation.

---

## Cross-References

| Reference | Module | Relevance |
|-----------|--------|-----------|
| Database & Schema Naming | ISL-03 `templates/database-schema-naming.md` | Database and schema context for table placement |
| Column Naming Standards | ISL-03 `templates/column-naming-standards.md` | Column-level naming within these tables |
| Abbreviation Dictionary | ISL-03 `templates/abbreviation-dictionary.md` | Approved abbreviation codes for entity names |
| Pipeline & Dataflow Naming | ISL-03 `templates/pipeline-dataflow-naming.md` | Pipeline names that load these tables |
| Data Classification | ISL-04 | Domain taxonomy alignment, sensitivity classification |
| Data Quality Standards | ISL-02 | Validation table and rejection table naming patterns |
| Security Patterns | ISL-05 | Schema-level access control, RLS view patterns |
| Metadata & Lineage | ISL-06 | Table registration and cataloging requirements |

---

## Compliance Alignment

| Standard | Relevance | How This Template Aligns |
|----------|-----------|--------------------------|
| DAMA DMBOK | Data modeling naming governance | Entity naming rules follow DMBOK naming principles for clarity and consistency |
| ISO 11179 | Metadata registry naming conventions | Table prefixes and entity naming follow ISO 11179 object-class + property patterns |
| Azure CAF | Cloud Adoption Framework naming | Table/view naming integrates with CAF resource naming hierarchy |
| NIST SP 800-53 | Security control naming | Audit and control table patterns support NIST audit trail requirements (AU-3, AU-12) |
| ISO 27001 | Information security management | Audit table patterns (`aud_`) support A.12.4 logging and monitoring controls |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | DMTSP Architecture | Initial release -- table and view naming standards with medallion, dimensional, staging, and view patterns |

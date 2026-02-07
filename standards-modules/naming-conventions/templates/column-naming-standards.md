# Column Naming Standards
> Module: ISL-03 | Version: 1.0 | Adaptation Effort: 1-2 hrs | Dependencies: ISL-03 abbreviation-dictionary, ISL-04 Data Classification

## Purpose

This standard defines deterministic, self-documenting naming patterns for columns across all table types in Microsoft Fabric lakehouses, Fabric warehouses, and Azure SQL databases. Column names are the most granular level of the naming hierarchy and the most frequently encountered by analysts, engineers, and data consumers. Consistent column naming enables self-documenting schemas where the data type, business meaning, and role of every column are immediately apparent from its name alone.

This standard mandates suffixes that encode data type intent, prefixes for boolean and key columns, a complete set of audit column definitions, reserved column names, and standard column ordering conventions.

## Scope

### In Scope
- Data type suffix conventions (_dt, _ts, _tm, _amt, _qty, _pct, _cnt, _rate, and others)
- Boolean column prefixes (is_, has_, can_, should_, was_)
- Key column conventions (_sk, _bk, _nk, _id, _fk)
- Audit column definitions and placement rules
- Standard metadata columns required on every table
- Reserved column names that must not be overridden
- Column ordering conventions within tables
- Anti-patterns and prohibited naming practices

### Out of Scope
- Table and view naming (see `templates/table-view-naming.md`)
- Physical data type selection (storage types are platform-specific)
- Column-level security policies (see ISL-05 Security Patterns)
- Data quality rule definitions on columns (see ISL-02 Data Quality)

---

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default Value | Client Value | Notes |
|-----------|---------------|--------------|-------|
| Column Casing Convention | snake_case (lowercase) | `[CONFIRM_OR_OVERRIDE]` | All column names must be lowercase |
| Maximum Column Name Length | 128 characters | `[CONFIRM_OR_OVERRIDE]` | Recommended practical length 20-50 characters |
| Boolean Prefix Convention | `is_`, `has_`, `can_`, `should_`, `was_` | `[CONFIRM_OR_OVERRIDE]` | Some clients prefer `is_` exclusively |
| Surrogate Key Strategy | Auto-increment BIGINT | `[CONFIRM_OR_OVERRIDE]` | Alternative: hash-based surrogate keys |
| Audit Column Set | Standard 7 columns | `[CONFIRM_OR_OVERRIDE]` | Some clients require additional compliance columns |
| Date/Time Suffix Convention | `_dt`, `_ts`, `_tm` | `[CONFIRM_OR_OVERRIDE]` | Some legacy systems use `_date`, `_datetime` |
| Amount Precision | DECIMAL(19,4) | `[CONFIRM_OR_OVERRIDE]` | Confirm with client finance team |
| Quantity Precision | DECIMAL(18,6) | `[CONFIRM_OR_OVERRIDE]` | Manufacturing may need higher precision |
| Hash Algorithm for row_hash | SHA-256 | `[CONFIRM_OR_OVERRIDE]` | Confirm with client security requirements |
| Source System Column Mapping | Provided per engagement | `[CLIENT_MAPPING_DOC]` | Link to source-to-target mapping document |

---

## 1. Base Column Naming Rules

| Rule | Description | Example (Correct) | Example (Incorrect) |
|------|-------------|-------------------|---------------------|
| Lowercase only | No uppercase characters | `customer_nm` | `Customer_Name` |
| Snake_case delimiters | Underscores between words | `order_qty` | `orderQty`, `order-qty` |
| No abbreviations unless approved | Full words unless in abbreviation dictionary | `quantity` or `qty` (approved) | `qnty`, `quant` |
| Business terms over technical terms | Use the business meaning | `revenue_amt` | `field_47`, `col_revenue` |
| No table name prefix | Do not repeat the table name | `product_nm` (in `dim_product`) | `product_product_nm` |
| No data type encoding | Do not encode physical types | `created_dt` | `created_date_datetime2` |
| No ordinal numbering | Do not use numeric suffixes for ordering | `address_line_1` | `addr1`, `address_01` |
| Singular form | Use singular nouns | `category_cd` | `categories_cd` |
| Meaningful names | Names must convey business meaning | `order_status_cd` | `status`, `type`, `value` |
| No leading underscores | Platform-reserved in many systems | `internal_id` | `_internal_id` |

---

## 2. Data Type Suffix Conventions

Suffixes encode the semantic data type of the column -- not the physical storage type, but the business meaning.

### 2.1 Identifier and Key Suffixes

| Suffix | Meaning | Physical Type Guidance | Examples |
|--------|---------|----------------------|----------|
| `_id` | System-generated identifier | INT, BIGINT, UNIQUEIDENTIFIER | `order_id`, `batch_id`, `transaction_id` |
| `_sk` | Surrogate key (dimensional) | BIGINT | `product_sk`, `customer_sk`, `date_sk` |
| `_bk` | Business key (natural source key) | VARCHAR, NVARCHAR | `product_bk`, `customer_bk`, `vendor_bk` |
| `_nk` | Natural key (human-readable) | VARCHAR, NVARCHAR | `material_nk`, `employee_nk`, `plant_nk` |
| `_fk` | Foreign key (explicit FK marker) | Matches referenced PK type | `parent_order_fk`, `supervisor_fk` |

### 2.2 Descriptive Suffixes

| Suffix | Meaning | Physical Type Guidance | Examples |
|--------|---------|----------------------|----------|
| `_cd` | Code (short coded value) | VARCHAR(10-50) | `status_cd`, `country_cd`, `currency_cd`, `uom_cd` |
| `_nm` | Name (human-readable label) | VARCHAR, NVARCHAR | `product_nm`, `customer_nm`, `plant_nm` |
| `_desc` | Description (longer text) | NVARCHAR(MAX) | `product_desc`, `defect_desc`, `order_desc` |
| `_txt` | Free-form text / notes | NVARCHAR(MAX) | `comment_txt`, `note_txt`, `reason_txt` |
| `_url` | URL / URI | VARCHAR | `document_url`, `image_url`, `api_url` |
| `_path` | File or directory path | VARCHAR | `file_path`, `blob_path`, `storage_path` |
| `_json` | JSON content | NVARCHAR(MAX) | `payload_json`, `config_json`, `metadata_json` |
| `_xml` | XML content | XML, NVARCHAR(MAX) | `message_xml`, `response_xml` |

### 2.3 Date and Time Suffixes

| Suffix | Meaning | Physical Type | Format Example | Column Examples |
|--------|---------|--------------|----------------|-----------------|
| `_dt` | Date (no time component) | DATE | `2025-03-15` | `order_dt`, `ship_dt`, `due_dt`, `birth_dt` |
| `_ts` | Timestamp (date + time) | DATETIME2, TIMESTAMP | `2025-03-15T14:30:00.000Z` | `created_ts`, `modified_ts`, `event_ts` |
| `_tm` | Time only (no date) | TIME | `14:30:00` | `shift_start_tm`, `shift_end_tm`, `scheduled_tm` |
| `_yr` | Year | INT or SMALLINT | `2025` | `fiscal_yr`, `calendar_yr`, `model_yr` |
| `_mo` | Month | INT or SMALLINT | `3` | `fiscal_mo`, `calendar_mo` |
| `_wk` | Week number | INT or SMALLINT | `12` | `fiscal_wk`, `calendar_wk` |

### 2.4 Numeric / Measure Suffixes

| Suffix | Meaning | Physical Type Guidance | Examples |
|--------|---------|----------------------|----------|
| `_amt` | Monetary amount | DECIMAL(19,4) | `order_amt`, `revenue_amt`, `cost_amt`, `budget_amt` |
| `_qty` | Quantity (countable units) | DECIMAL(18,6) or INT | `order_qty`, `scrap_qty`, `on_hand_qty`, `shipped_qty` |
| `_pct` | Percentage / ratio | DECIMAL(9,6) | `defect_pct`, `yield_pct`, `discount_pct`, `tax_pct` |
| `_cnt` | Count (calculated integer) | INT, BIGINT | `order_cnt`, `defect_cnt`, `employee_cnt`, `line_item_cnt` |
| `_rate` | Rate (per unit measure) | DECIMAL | `hourly_rate`, `exchange_rate`, `production_rate` |
| `_num` | Number (non-key, non-qty) | VARCHAR or INT | `invoice_num`, `lot_num`, `serial_num`, `po_num` |
| `_val` | Value (non-monetary numeric) | DECIMAL | `reading_val`, `score_val`, `weight_val` |
| `_wt` | Weight | DECIMAL | `gross_wt`, `net_wt`, `tare_wt` |
| `_len` | Length / dimension | DECIMAL | `product_len`, `cable_len` |
| `_vol` | Volume | DECIMAL | `tank_vol`, `container_vol` |
| `_dur` | Duration | INT, DECIMAL | `cycle_dur`, `downtime_dur`, `lead_time_dur` |

### 2.5 Technical / Metadata Suffixes

| Suffix | Meaning | Physical Type Guidance | Examples |
|--------|---------|----------------------|----------|
| `_hash` | Hash value | VARBINARY, VARCHAR(64) | `row_hash`, `content_hash`, `password_hash` |
| `_ver` | Version number | INT, VARCHAR | `schema_ver`, `record_ver`, `api_ver` |
| `_seq` | Sequence number | INT, BIGINT | `line_seq`, `step_seq`, `batch_seq` |

---

## 3. Boolean Column Prefixes

Boolean columns use a prefix that forms a readable true/false question.

| Prefix | Usage | Examples |
|--------|-------|----------|
| `is_` | State or status condition | `is_active`, `is_deleted`, `is_current`, `is_approved`, `is_taxable` |
| `has_` | Possession or existence | `has_warranty`, `has_hazmat`, `has_attachment`, `has_children`, `has_bom` |
| `can_` | Permission or capability | `can_backorder`, `can_expedite`, `can_substitute`, `can_split` |
| `should_` | Recommendation or rule | `should_reorder`, `should_inspect`, `should_archive`, `should_review` |
| `was_` | Historical state | `was_returned`, `was_reworked`, `was_expedited`, `was_rejected` |

**Rules:**
- Boolean columns must use one of these approved prefixes
- Physical type: BIT (SQL Server/Synapse), BOOLEAN (Spark/Fabric Lakehouse)
- Never use `_flag`, `_flg`, or `_yn` suffixes -- use boolean prefixes instead
- Never store "Y"/"N" or "1"/"0" strings -- use native boolean types

### 3.1 Boolean Column Examples

| Column Name | Description | Domain |
|-------------|-------------|--------|
| `is_active` | Whether the record is currently active | Universal |
| `is_current` | Whether this is the current SCD version | Dimensional modeling |
| `is_deleted` | Soft delete indicator | Universal |
| `is_approved` | Whether the record has been approved | Workflow |
| `is_taxable` | Whether the item is subject to tax | Finance |
| `is_hazardous` | Whether the material is classified as hazardous | Manufacturing |
| `is_serialized` | Whether the product requires serial tracking | Manufacturing |
| `is_lot_tracked` | Whether the material uses lot tracking | Manufacturing |
| `is_backflush` | Whether the material is consumed via backflushing | Manufacturing |
| `is_on_hold` | Whether the record is on administrative hold | Universal |
| `has_warranty` | Whether the product has an active warranty | Sales |
| `has_bom` | Whether the product has a bill of materials | Manufacturing |
| `has_routing` | Whether the product has a production routing | Manufacturing |
| `has_attachment` | Whether the record has associated documents | Universal |
| `can_backorder` | Whether the item allows backorders | Supply Chain |
| `can_substitute` | Whether an alternative material can be used | Manufacturing |
| `can_split` | Whether the order line can be split across shipments | Supply Chain |
| `should_reorder` | Whether the item has hit reorder point | Inventory |
| `should_inspect` | Whether incoming material requires QC inspection | Quality |
| `was_reworked` | Whether the unit was reworked | Manufacturing |
| `was_returned` | Whether the item was returned by customer | Sales |
| `was_expedited` | Whether the order was expedited | Supply Chain |

---

## 4. Key Column Conventions

### 4.1 Surrogate Keys (_sk)

| Convention | Rule |
|------------|------|
| Naming | `{entity}_sk` -- always matches the dimension table entity name |
| Type | BIGINT, auto-incrementing or hash-based |
| Usage | Primary key of dimension tables; foreign key in fact tables |
| Example in dim table | `dim_product.product_sk` (PK) |
| Example in fact table | `fct_sales_order.product_sk` (FK referencing `dim_product`) |

### 4.2 Business Keys (_bk)

| Convention | Rule |
|------------|------|
| Naming | `{entity}_bk` -- the primary business identifier from the source system |
| Type | VARCHAR, preserving source system format |
| Usage | Source-system primary identifier, used for matching and deduplication |
| Example | `dim_product.product_bk` = "MAT-001234" (SAP material number) |

### 4.3 Natural Keys (_nk)

| Convention | Rule |
|------------|------|
| Naming | `{entity}_nk` -- a meaningful, human-readable identifier |
| Type | VARCHAR |
| Usage | When the key has inherent business meaning (e.g., ISO country code) |
| Example | `dim_country.country_nk` = "US", `dim_currency.currency_nk` = "USD" |

### 4.4 Foreign Key Naming

| Convention | Pattern | Example |
|------------|---------|---------|
| FK to dimension | `{referenced_entity}_sk` | `fct_sales_order.product_sk` references `dim_product.product_sk` |
| FK column name matches PK | Same name in both tables | `customer_sk` in both `dim_customer` and `fct_sales_order` |
| Role-playing dimensions | `{role}_{entity}_sk` | `order_date_sk`, `ship_date_sk`, `due_date_sk` (all reference `dim_date`) |
| Self-referencing FK | `parent_{entity}_sk` | `dim_employee.parent_employee_sk` for org hierarchy |

### 4.5 Key Examples Table

| Table | Column | Key Type | References | Description |
|-------|--------|----------|------------|-------------|
| `dim_product` | `product_sk` | Surrogate (PK) | -- | Auto-generated surrogate key |
| `dim_product` | `product_bk` | Business | -- | Source system product code |
| `dim_customer` | `customer_sk` | Surrogate (PK) | -- | Auto-generated surrogate key |
| `dim_customer` | `customer_bk` | Business | -- | Source system customer ID |
| `dim_date` | `date_sk` | Surrogate (PK) | -- | Integer date key (YYYYMMDD) |
| `fct_sales_order` | `sales_order_sk` | Surrogate (PK) | -- | Fact table surrogate key |
| `fct_sales_order` | `product_sk` | Foreign | `dim_product.product_sk` | Product dimension FK |
| `fct_sales_order` | `customer_sk` | Foreign | `dim_customer.customer_sk` | Customer dimension FK |
| `fct_sales_order` | `order_date_sk` | Foreign (role) | `dim_date.date_sk` | Order date role-playing FK |
| `fct_sales_order` | `ship_date_sk` | Foreign (role) | `dim_date.date_sk` | Ship date role-playing FK |
| `fct_sales_order` | `due_date_sk` | Foreign (role) | `dim_date.date_sk` | Due date role-playing FK |
| `fct_production_output` | `production_output_sk` | Surrogate (PK) | -- | Fact table surrogate key |
| `fct_production_output` | `product_sk` | Foreign | `dim_product.product_sk` | Product dimension FK |
| `fct_production_output` | `equipment_sk` | Foreign | `dim_equipment.equipment_sk` | Equipment dimension FK |
| `fct_production_output` | `shift_sk` | Foreign | `dim_shift.shift_sk` | Shift dimension FK |
| `fct_production_output` | `production_date_sk` | Foreign (role) | `dim_date.date_sk` | Production date FK |

---

## 5. Audit Columns

Every table must include a standard set of audit columns. These columns enable lineage tracking, change detection, and compliance.

### 5.1 Required Audit Columns (All Tables)

| Column Name | Type | Description | Populated By |
|-------------|------|-------------|-------------|
| `created_ts` | DATETIME2 / TIMESTAMP | Timestamp when the record was first inserted (UTC) | Pipeline |
| `modified_ts` | DATETIME2 / TIMESTAMP | Timestamp when the record was last updated (UTC) | Pipeline |
| `created_by` | VARCHAR(256) | Identity that created the record | Pipeline service principal or user |
| `modified_by` | VARCHAR(256) | Identity that last modified the record | Pipeline service principal or user |
| `row_hash` | VARCHAR(64) | SHA-256 hash of non-key, non-audit columns for change detection | Pipeline |
| `source_system` | VARCHAR(100) | Source system identifier (from abbreviation dictionary) | Pipeline |
| `pipeline_run_id` | VARCHAR(100) | Pipeline execution run ID for lineage | Pipeline orchestrator |

### 5.2 Additional Audit Columns (SCD Type 2 Dimensions)

| Column Name | Type | Description | Populated By |
|-------------|------|-------------|-------------|
| `is_current` | BIT / BOOLEAN | Whether this is the current active version | Pipeline SCD logic |
| `effective_from_dt` | DATE | Date this version became effective | Pipeline SCD logic |
| `effective_to_dt` | DATE | Date this version was superseded (9999-12-31 for current) | Pipeline SCD logic |
| `version_num` | INT | Incrementing version counter | Pipeline SCD logic |

### 5.3 Additional Audit Columns (Bronze Layer)

| Column Name | Type | Description | Populated By |
|-------------|------|-------------|-------------|
| `ingested_ts` | DATETIME2 / TIMESTAMP | Timestamp of data ingestion into bronze (UTC) | Ingestion pipeline |
| `source_file_nm` | VARCHAR(500) | Source file name or API endpoint | Ingestion pipeline |
| `source_file_path` | VARCHAR(1000) | Full path to source file in storage | Ingestion pipeline |
| `batch_id` | VARCHAR(100) | Batch identifier for the ingestion run | Ingestion pipeline |

### 5.4 Additional Audit Columns (Soft Delete)

| Column Name | Type | Description | Populated By |
|-------------|------|-------------|-------------|
| `is_deleted` | BIT / BOOLEAN | Soft delete indicator; TRUE means logically deleted | Pipeline or application |
| `deleted_ts` | DATETIME2 / TIMESTAMP | Timestamp when the record was soft deleted | Pipeline or application |
| `deleted_by` | VARCHAR(256) | Identity that performed the soft delete | Pipeline or application |

---

## 6. Reserved Column Names

The following column names are reserved and must be used exactly as specified when the column serves the indicated purpose. Teams must not create alternative names for these concepts.

| Reserved Column Name | Purpose | Required On | Notes |
|---------------------|---------|-------------|-------|
| `created_ts` | Record creation timestamp | All tables | Never use `insert_ts`, `create_date`, `date_created` |
| `modified_ts` | Record modification timestamp | All tables | Never use `update_ts`, `last_modified`, `changed_date` |
| `created_by` | Creator identity | All tables | Never use `insert_by`, `creator`, `added_by` |
| `modified_by` | Modifier identity | All tables | Never use `updated_by`, `changer`, `last_user` |
| `row_hash` | Change detection hash | All tables | Never use `hash_value`, `checksum`, `record_hash` |
| `source_system` | Source system identifier | All tables | Never use `src_system`, `origin`, `data_source` |
| `pipeline_run_id` | Pipeline run identifier | All tables | Never use `run_id`, `execution_id`, `job_id` |
| `is_current` | SCD current version flag | SCD Type 2 dims | Never use `current_flag`, `active_ind`, `is_latest` |
| `effective_from_dt` | SCD effective start | SCD Type 2 dims | Never use `valid_from`, `start_date`, `begin_dt` |
| `effective_to_dt` | SCD effective end | SCD Type 2 dims | Never use `valid_to`, `end_date`, `expire_dt` |
| `is_deleted` | Soft delete indicator | Tables with soft delete | Never use `deleted_flag`, `is_removed`, `active_yn` |
| `ingested_ts` | Bronze ingestion timestamp | Bronze tables | Never use `load_ts`, `landing_ts`, `extract_ts` |
| `batch_id` | Ingestion batch identifier | Bronze tables | Never use `load_id`, `run_batch`, `extract_batch` |
| `version_num` | SCD version counter | SCD Type 2 dims | Never use `version`, `ver`, `revision` |

---

## 7. Standard Metadata Columns Every Table Should Have

### 7.1 Minimum Required Set (All Tables)

Every table, regardless of type, must include these columns:

```
created_ts          DATETIME2       -- UTC record creation timestamp
modified_ts         DATETIME2       -- UTC record last modification timestamp
created_by          VARCHAR(256)    -- creator identity
modified_by         VARCHAR(256)    -- modifier identity
row_hash            VARCHAR(64)     -- SHA-256 change detection hash
source_system       VARCHAR(100)    -- source system code
pipeline_run_id     VARCHAR(100)    -- pipeline execution run ID
```

### 7.2 Extended Set (Bronze Tables)

Bronze tables add ingestion tracking columns:

```
-- all columns from 7.1, plus:
ingested_ts         DATETIME2       -- UTC ingestion timestamp
source_file_nm      VARCHAR(500)    -- source file or endpoint name
source_file_path    VARCHAR(1000)   -- full source file path
batch_id            VARCHAR(100)    -- ingestion batch identifier
```

### 7.3 Extended Set (SCD Type 2 Dimensions)

SCD Type 2 dimensions add versioning columns:

```
-- all columns from 7.1, plus:
is_current          BIT             -- current version flag
effective_from_dt   DATE            -- version effective start
effective_to_dt     DATE            -- version effective end (9999-12-31 for current)
version_num         INT             -- incrementing version counter
```

---

## 8. Column Ordering Convention

Columns within a table must follow this standard ordering. This ensures consistency across all tables and makes schema reviews efficient.

| Order | Category | Description | Example Columns |
|-------|----------|-------------|-----------------|
| 1 | Surrogate key | Table's primary surrogate key | `product_sk` |
| 2 | Business key(s) | Source system identifiers | `product_bk`, `product_nk` |
| 3 | Foreign keys | References to dimension tables | `category_sk`, `vendor_sk`, `date_sk` |
| 4 | Core attributes | Primary business attributes | `product_nm`, `product_desc` |
| 5 | Codes and classifications | Coded values and categories | `status_cd`, `type_cd`, `category_cd` |
| 6 | Measures | Numeric business measures | `order_amt`, `order_qty`, `yield_pct` |
| 7 | Booleans | Boolean indicators | `is_active`, `has_warranty`, `can_backorder` |
| 8 | Dates and times | Business dates and timestamps | `order_dt`, `due_dt`, `ship_dt` |
| 9 | SCD columns | Slowly changing dimension metadata | `is_current`, `effective_from_dt`, `effective_to_dt`, `version_num` |
| 10 | Ingestion columns | Bronze-layer ingestion metadata | `ingested_ts`, `source_file_nm`, `batch_id` |
| 11 | Audit columns | Pipeline and lineage metadata | `created_ts`, `modified_ts`, `row_hash`, `source_system`, `pipeline_run_id` |

---

## 9. Complete Column Examples by Table Type

### 9.1 Fact Table: `fct_production_output`

| # | Column | Type | Suffix/Prefix | Category | Description |
|---|--------|------|--------------|----------|-------------|
| 1 | `production_output_sk` | BIGINT | `_sk` | Surrogate key | Surrogate primary key |
| 2 | `work_order_bk` | VARCHAR(50) | `_bk` | Business key | Work order business key |
| 3 | `product_sk` | BIGINT | `_sk` | Foreign key | FK to dim_product |
| 4 | `equipment_sk` | BIGINT | `_sk` | Foreign key | FK to dim_equipment |
| 5 | `plant_sk` | BIGINT | `_sk` | Foreign key | FK to dim_plant |
| 6 | `shift_sk` | BIGINT | `_sk` | Foreign key | FK to dim_shift |
| 7 | `production_date_sk` | BIGINT | `_sk` | Foreign key | FK to dim_date (role-playing) |
| 8 | `operation_num` | VARCHAR(10) | `_num` | Core attribute | Operation sequence number |
| 9 | `work_center_cd` | VARCHAR(20) | `_cd` | Code | Work center code |
| 10 | `quantity_produced_qty` | DECIMAL(18,6) | `_qty` | Measure | Good units produced |
| 11 | `scrap_qty` | DECIMAL(18,6) | `_qty` | Measure | Scrapped units |
| 12 | `rework_qty` | DECIMAL(18,6) | `_qty` | Measure | Reworked units |
| 13 | `cycle_time_dur` | DECIMAL(10,2) | `_dur` | Measure | Actual cycle time (minutes) |
| 14 | `setup_time_dur` | DECIMAL(10,2) | `_dur` | Measure | Setup/changeover time (minutes) |
| 15 | `labor_cost_amt` | DECIMAL(19,4) | `_amt` | Measure | Labor cost |
| 16 | `material_cost_amt` | DECIMAL(19,4) | `_amt` | Measure | Material cost consumed |
| 17 | `yield_pct` | DECIMAL(9,6) | `_pct` | Measure | Yield percentage |
| 18 | `is_reworked` | BIT | `is_` | Boolean | Whether the output was reworked |
| 19 | `production_start_ts` | DATETIME2 | `_ts` | Date/time | Production start timestamp |
| 20 | `production_end_ts` | DATETIME2 | `_ts` | Date/time | Production end timestamp |
| 21 | `created_ts` | DATETIME2 | `_ts` | Audit | Record created timestamp |
| 22 | `modified_ts` | DATETIME2 | `_ts` | Audit | Record last modified timestamp |
| 23 | `created_by` | VARCHAR(256) | -- | Audit | Created by identity |
| 24 | `modified_by` | VARCHAR(256) | -- | Audit | Modified by identity |
| 25 | `row_hash` | VARCHAR(64) | `_hash` | Audit | Change detection hash |
| 26 | `source_system` | VARCHAR(100) | -- | Audit | Source system identifier |
| 27 | `pipeline_run_id` | VARCHAR(100) | `_id` | Audit | Pipeline run identifier |

### 9.2 Dimension Table: `dim_product` (SCD Type 2)

| # | Column | Type | Suffix/Prefix | Category | Description |
|---|--------|------|--------------|----------|-------------|
| 1 | `product_sk` | BIGINT | `_sk` | Surrogate key | Surrogate primary key |
| 2 | `product_bk` | VARCHAR(50) | `_bk` | Business key | Source system product code |
| 3 | `product_nk` | VARCHAR(50) | `_nk` | Natural key | Human-readable product number |
| 4 | `product_nm` | NVARCHAR(200) | `_nm` | Core attribute | Product name |
| 5 | `product_desc` | NVARCHAR(1000) | `_desc` | Core attribute | Product description |
| 6 | `product_category_cd` | VARCHAR(20) | `_cd` | Code | Product category code |
| 7 | `product_category_nm` | NVARCHAR(100) | `_nm` | Code | Product category name |
| 8 | `product_group_cd` | VARCHAR(20) | `_cd` | Code | Product group code |
| 9 | `product_type_cd` | VARCHAR(20) | `_cd` | Code | Product type code |
| 10 | `base_uom_cd` | VARCHAR(10) | `_cd` | Code | Base unit of measure |
| 11 | `standard_cost_amt` | DECIMAL(19,4) | `_amt` | Measure | Standard cost |
| 12 | `list_price_amt` | DECIMAL(19,4) | `_amt` | Measure | List price |
| 13 | `gross_wt` | DECIMAL(18,6) | `_wt` | Measure | Gross weight |
| 14 | `net_wt` | DECIMAL(18,6) | `_wt` | Measure | Net weight |
| 15 | `weight_uom_cd` | VARCHAR(10) | `_cd` | Code | Weight unit of measure |
| 16 | `is_active` | BIT | `is_` | Boolean | Whether the product is active |
| 17 | `is_serialized` | BIT | `is_` | Boolean | Whether serialized |
| 18 | `is_lot_tracked` | BIT | `is_` | Boolean | Whether lot tracked |
| 19 | `has_bom` | BIT | `has_` | Boolean | Whether has BOM |
| 20 | `has_routing` | BIT | `has_` | Boolean | Whether has production routing |
| 21 | `is_current` | BIT | `is_` | SCD | Current version flag |
| 22 | `effective_from_dt` | DATE | `_dt` | SCD | SCD effective start date |
| 23 | `effective_to_dt` | DATE | `_dt` | SCD | SCD effective end date |
| 24 | `version_num` | INT | `_num` | SCD | SCD version number |
| 25 | `created_ts` | DATETIME2 | `_ts` | Audit | Record created timestamp |
| 26 | `modified_ts` | DATETIME2 | `_ts` | Audit | Record modified timestamp |
| 27 | `created_by` | VARCHAR(256) | -- | Audit | Created by identity |
| 28 | `modified_by` | VARCHAR(256) | -- | Audit | Modified by identity |
| 29 | `row_hash` | VARCHAR(64) | `_hash` | Audit | Change detection hash |
| 30 | `source_system` | VARCHAR(100) | -- | Audit | Source system identifier |
| 31 | `pipeline_run_id` | VARCHAR(100) | `_id` | Audit | Pipeline run identifier |

### 9.3 Reference Table: `ref_country`

| # | Column | Type | Suffix/Prefix | Description |
|---|--------|------|--------------|-------------|
| 1 | `country_cd` | VARCHAR(3) | `_cd` | ISO 3166-1 alpha-3 country code |
| 2 | `country_nm` | NVARCHAR(100) | `_nm` | Country name (English) |
| 3 | `country_alpha2_cd` | VARCHAR(2) | `_cd` | ISO 3166-1 alpha-2 code |
| 4 | `region_nm` | NVARCHAR(100) | `_nm` | Geographic region name |
| 5 | `is_active` | BIT | `is_` | Whether the country is active |
| 6 | `created_ts` | DATETIME2 | `_ts` | Record created timestamp |
| 7 | `modified_ts` | DATETIME2 | `_ts` | Record modified timestamp |

---

## 10. Anti-Patterns and Prohibited Patterns

| Anti-Pattern | Example | Why It Is Wrong | Correct Alternative |
|-------------|---------|-----------------|-------------------|
| CamelCase columns | `OrderQuantity` | Inconsistent with snake_case standard | `order_qty` |
| Spaces in names | `Order Quantity` | Requires quoting, breaks scripting | `order_qty` |
| Prefixing with table name | `product_product_nm` | Redundant; context is the table | `product_nm` |
| Using `_flag` for booleans | `active_flag` | Non-standard; use boolean prefix | `is_active` |
| Using "Y"/"N" strings | `active_yn = 'Y'` | Not a boolean; wastes storage | `is_active = TRUE` |
| Generic names | `value`, `type`, `name`, `status` | Ambiguous without context | `reading_val`, `order_type_cd` |
| Ordinal suffixes | `address_1`, `address_2` | Fragile, not extensible | `address_line_1` or normalize |
| Data type in name | `created_date_datetime2` | Physical type may change | `created_dt` |
| Abbreviations not in dictionary | `cust_ordr_qty` | Unreadable, non-standard | Use approved abbreviations |
| Leading underscores | `_internal_id` | Platform-reserved in many systems | `internal_id` |
| All-caps | `CUSTOMER_NAME` | Inconsistent with lowercase standard | `customer_nm` |
| No suffix on amounts | `total_price` | Ambiguous -- qty? pct? amt? | `total_price_amt` |
| No suffix on dates | `order_date` | Ambiguous -- date or timestamp? | `order_dt` or `order_ts` |
| Inconsistent key naming | `product_id` and `product_key` | Pick one convention | `product_sk` or `product_bk` |
| Encoding nullability | `optional_customer_nm` | Nullability is a schema property | `customer_nm` |
| SQL reserved words | `order`, `group`, `select` | Causes syntax errors | `sales_order`, `material_group` |
| Suffixing with `_flag` or `_ind` | `delete_flag`, `active_ind` | Non-standard boolean pattern | `is_deleted`, `is_active` |
| Duplicate suffixes | `order_amount_amt` | Redundant suffix | `order_amt` |
| Mixed suffix styles | `order_date` and `ship_dt` | Inconsistent suffix convention | `order_dt` and `ship_dt` |

---

## Fabric / Azure Implementation Guidance

### Column Naming in Fabric Lakehouses (Delta Tables)

Fabric lakehouses use Delta Lake format backed by Apache Spark. Column naming considerations:

- Spark is case-sensitive by default, but Delta Lake normalizes to case-insensitive. Always use lowercase to prevent ambiguity.
- Delta Lake supports column names with spaces and special characters, but this standard prohibits them for cross-platform compatibility.
- Column rename operations in Delta Lake use `ALTER TABLE ... RENAME COLUMN` -- ensure pipelines reference column names consistently.

### Column Naming in Fabric Warehouses (T-SQL)

Fabric warehouses use T-SQL DDL. Example column definitions following this standard:

```sql
CREATE TABLE presentation.fct_production_output (
    -- surrogate key
    production_output_sk    BIGINT          NOT NULL,
    -- business key
    work_order_bk           VARCHAR(50)     NOT NULL,
    -- foreign keys
    product_sk              BIGINT          NOT NULL,
    equipment_sk            BIGINT          NOT NULL,
    plant_sk                BIGINT          NOT NULL,
    shift_sk                BIGINT          NOT NULL,
    production_date_sk      BIGINT          NOT NULL,
    -- measures
    quantity_produced_qty   DECIMAL(18,6)   NULL,
    scrap_qty               DECIMAL(18,6)   NULL,
    yield_pct               DECIMAL(9,6)    NULL,
    labor_cost_amt          DECIMAL(19,4)   NULL,
    -- booleans
    is_reworked             BIT             NOT NULL DEFAULT 0,
    -- dates
    production_start_ts     DATETIME2       NULL,
    production_end_ts       DATETIME2       NULL,
    -- audit
    created_ts              DATETIME2       NOT NULL,
    modified_ts             DATETIME2       NOT NULL,
    created_by              VARCHAR(256)    NOT NULL,
    modified_by             VARCHAR(256)    NOT NULL,
    row_hash                VARCHAR(64)     NOT NULL,
    source_system           VARCHAR(100)    NOT NULL,
    pipeline_run_id         VARCHAR(100)    NOT NULL
);
```

### Column Name Validation Script (Python)

```python
import re

VALID_SUFFIXES = [
    '_id', '_sk', '_bk', '_nk', '_fk', '_cd', '_nm', '_desc', '_txt',
    '_amt', '_qty', '_pct', '_cnt', '_rate', '_num', '_val', '_wt',
    '_len', '_vol', '_dur', '_dt', '_ts', '_tm', '_yr', '_mo', '_wk',
    '_url', '_path', '_json', '_xml', '_hash', '_ver', '_seq', '_rt'
]
VALID_BOOLEAN_PREFIXES = ['is_', 'has_', 'can_', 'should_', 'was_']
RESERVED_COLUMNS = [
    'created_ts', 'modified_ts', 'created_by', 'modified_by',
    'row_hash', 'source_system', 'pipeline_run_id'
]

def validate_column_name(name: str) -> tuple[bool, str]:
    """Validate a column name against ISL-03 column naming standards."""
    if not re.match(r'^[a-z][a-z0-9_]{0,127}$', name):
        return False, "Must be lowercase alphanumeric with underscores, starting with a letter"
    if name.upper() in SQL_RESERVED_WORDS:
        return False, f"'{name}' is a SQL reserved word"
    return True, "Valid"
```

---

## Manufacturing Overlay [CONDITIONAL]

### Manufacturing-Specific Column Patterns

Manufacturing engagements frequently require specialized columns for production, quality, and equipment tracking. Include these patterns when the client domain includes manufacturing.

| Column Name | Type | Suffix | Used In | Description |
|-------------|------|--------|---------|-------------|
| `oee_pct` | DECIMAL(9,6) | `_pct` | `gld_oee_metric` | Overall Equipment Effectiveness percentage |
| `availability_pct` | DECIMAL(9,6) | `_pct` | `gld_oee_metric` | Equipment availability component of OEE |
| `performance_pct` | DECIMAL(9,6) | `_pct` | `gld_oee_metric` | Equipment performance component of OEE |
| `quality_pct` | DECIMAL(9,6) | `_pct` | `gld_oee_metric` | Quality rate component of OEE |
| `takt_time_dur` | DECIMAL(10,2) | `_dur` | `fct_production_output` | Target takt time in seconds |
| `actual_cycle_dur` | DECIMAL(10,2) | `_dur` | `fct_production_output` | Actual cycle time in seconds |
| `downtime_dur` | DECIMAL(10,2) | `_dur` | `fct_equipment_downtime` | Downtime duration in minutes |
| `downtime_reason_cd` | VARCHAR(20) | `_cd` | `fct_equipment_downtime` | Equipment downtime reason code |
| `defect_type_cd` | VARCHAR(20) | `_cd` | `fct_quality_inspection` | Defect classification code |
| `upper_spec_limit_val` | DECIMAL(18,6) | `_val` | `fct_quality_inspection` | Upper specification limit |
| `lower_spec_limit_val` | DECIMAL(18,6) | `_val` | `fct_quality_inspection` | Lower specification limit |
| `measured_val` | DECIMAL(18,6) | `_val` | `fct_quality_inspection` | Actual measured value |
| `is_in_spec` | BIT | `is_` | `fct_quality_inspection` | Whether measurement is within specification |
| `is_reworkable` | BIT | `is_` | `fct_quality_inspection` | Whether the defect can be reworked |
| `spindle_speed_rpm` | DECIMAL(10,2) | `_rpm` | `fct_sensor_reading` | Spindle speed in RPM |
| `furnace_temp` | DECIMAL(10,2) | `_temp` | `fct_sensor_reading` | Furnace temperature |
| `pressure_psi` | DECIMAL(10,2) | `_psi` | `fct_sensor_reading` | System pressure in PSI |

### ITAR / Export Control Column Considerations

For defense manufacturing clients, sensitive measurement and specification columns must be tagged with ISL-04 Data Classification metadata. Column names themselves do not encode sensitivity levels -- classification is handled through metadata tags and ISL-05 column-level masking policies.

---

## Cross-References

| Reference | Module | Relevance |
|-----------|--------|-----------|
| Table & View Naming | ISL-03 `templates/table-view-naming.md` | Table context for column placement |
| Abbreviation Dictionary | ISL-03 `templates/abbreviation-dictionary.md` | Approved abbreviation codes for column names |
| Database & Schema Naming | ISL-03 `templates/database-schema-naming.md` | Schema context for table and column organization |
| Pipeline & Dataflow Naming | ISL-03 `templates/pipeline-dataflow-naming.md` | Pipeline names that populate these columns |
| Data Classification | ISL-04 | Column-level sensitivity classification (PII, PHI, financial) |
| Data Quality Standards | ISL-02 | Data quality validation column patterns and rejection indicators |
| Security Patterns | ISL-05 | Column-level masking, encryption, and RLS patterns |
| Metadata & Lineage | ISL-06 | Column-level lineage tracking requirements |

---

## Compliance Alignment

| Standard | Relevance | How This Template Aligns |
|----------|-----------|--------------------------|
| DAMA DMBOK | Data modeling attribute naming governance | Column naming rules follow DMBOK principles for clarity and consistency |
| ISO 11179 | Metadata registry naming conventions | Column suffixes follow ISO 11179 object-class + property + representation patterns |
| NIST SP 800-53 | Security control requirements | Audit columns support NIST AU-3 (content of audit records) and AU-12 (audit generation) |
| ISO 27001 | Information security management | Audit column set supports A.12.4 logging and A.18.1 compliance requirements |
| OWASP | Application security naming | Column naming avoids information leakage through overly descriptive security column names |
| GDPR / CCPA | Privacy compliance | PII columns identified through naming convention suffixes, enabling automated discovery |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | DMTSP Architecture | Initial release -- column naming standards with suffix conventions, boolean prefixes, key patterns, audit columns, and ordering rules |

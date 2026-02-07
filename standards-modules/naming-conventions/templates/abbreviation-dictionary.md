# Abbreviation Dictionary
> Module: ISL-03 | Version: 1.0 | Adaptation Effort: 1–2 hrs | Dependencies: None (foundational reference)

## Purpose

This dictionary defines the **approved set of abbreviations** used across all naming conventions in the Integration Standards Library. Every abbreviation used in database names, table names, column names, pipeline names, API endpoints, and infrastructure resource names **must** appear in this dictionary. Unapproved abbreviations are prohibited — if a new abbreviation is needed, it must be submitted through the change request process defined in this document.

Consistent abbreviations eliminate ambiguity, improve searchability, and ensure that names are self-documenting across the entire data platform.

## Scope

### In Scope
- Standard abbreviations for business domains, data entities, technical components, and infrastructure
- Abbreviation length rules and formatting conventions
- Conflict resolution procedures for ambiguous abbreviations
- Change request process for new abbreviations

### Out of Scope
- Full naming patterns for specific artifact types (see individual naming templates)
- Client-specific organizational unit names (adapted per engagement)
- Vendor product abbreviations not related to data platform naming

---

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default Value | Client Value | Notes |
|-----------|---------------|--------------|-------|
| Organization Code | `org` | `[CLIENT_ORG_CODE]` | 2–4 letter organization abbreviation |
| Industry Vertical | Manufacturing | `[CLIENT_INDUSTRY]` | Determines which domain extensions to include |
| Primary ERP System | SAP / Epicor | `[CLIENT_ERP]` | Drives ERP-specific abbreviation set |
| Naming Case Convention | snake_case (lowercase) | `[CONFIRM_OR_OVERRIDE]` | All abbreviations stored lowercase |
| Abbreviation Length Range | 2–6 characters | `[CONFIRM_OR_OVERRIDE]` | Minimum 2, maximum 6 characters |
| Approval Authority | Data Governance Council | `[CLIENT_AUTHORITY]` | Body that approves new abbreviations |

---

## 1. Abbreviation Rules

### 1.1 General Rules

| Rule | Specification | Example |
|------|---------------|---------|
| Character set | Lowercase letters only (`a-z`) | `mfg`, not `MFG` or `Mfg` |
| Length | 2–6 characters | `id` (2), `shared` (6) |
| Preferred length | 3–4 characters | `mfg`, `fin`, `scm`, `qty` |
| No vowel-stripping | Do not arbitrarily remove vowels | `prod` not `prd` for "product" (but `prd` for "production environment") |
| No digits | Abbreviations contain letters only | `rev` not `r3v` |
| No underscores | Abbreviations are atomic tokens | `wo` not `w_o` |
| Uniqueness | Every abbreviation maps to exactly one meaning | No duplicates across categories |

### 1.2 Context Disambiguation

Some abbreviations have different meanings depending on context. These are resolved by **position** in the naming pattern:

| Abbreviation | Meaning in Environment Position | Meaning in Entity Position |
|-------------|--------------------------------|---------------------------|
| `prd` | Production (environment) | — (not used as entity) |
| `stg` | Staging (environment) | Staging (data layer) |
| `dev` | Development (environment) | — (not used as entity) |

### 1.3 Prohibited Abbreviations

The following abbreviations are **permanently prohibited** due to ambiguity or conflict:

| Prohibited | Reason | Use Instead |
|-----------|--------|-------------|
| `tmp` | Ambiguous: temporary or template? | `temp` (temporary), `tmpl` (template) |
| `dat` | Ambiguous: data or date? | `data` (data), `dt` (date suffix) |
| `no` | Ambiguous: number or negation? | `num` (number) |
| `int` | Ambiguous: integer, internal, or integration? | `intgr` (integer), `intl` (internal), `integ` (integration) |
| `del` | Ambiguous: delete or delivery? | `dlvry` (delivery), use `is_deleted` flag for deletion |
| `rec` | Ambiguous: record or received? | `rcvd` (received), avoid for record |
| `res` | Ambiguous: resource, result, or reserved? | `rsrc` (resource), `rslt` (result) |
| `proc` | Ambiguous: process or procedure? | `prc` (process), `sproc` (stored procedure) |

---

## 2. Environment Abbreviations

| Abbreviation | Full Name | Description |
|-------------|-----------|-------------|
| `dev` | Development | Active development and experimentation |
| `tst` | Test / QA | Quality assurance and integration testing |
| `stg` | Staging / UAT | User acceptance testing, pre-production |
| `prd` | Production | Live production workloads |
| `sbx` | Sandbox | Isolated experimentation, no SLA |
| `dr` | Disaster Recovery | Failover and recovery environment |

---

## 3. Business Domain Abbreviations

### 3.1 Core Domains

| Abbreviation | Full Domain | Description | Typical Sources |
|-------------|-------------|-------------|-----------------|
| `mfg` | Manufacturing | Production, shop floor, work orders | SAP PP, Epicor Production, MES |
| `fin` | Finance | General ledger, accounts, reporting | SAP FI/CO, Epicor Finance |
| `scm` | Supply Chain | Procurement, logistics, warehousing | SAP MM/WM, Epicor Inventory |
| `qms` | Quality Management | Quality management, inspections | SAP QM, Epicor Quality |
| `mnt` | Maintenance | Equipment maintenance, PM schedules | SAP PM, Epicor Maintenance |
| `sal` | Sales | Orders, customers, pricing | SAP SD, Epicor CRM |
| `hcm` | Human Capital | HR, payroll, workforce | SAP HR, Epicor HCM |
| `iot` | IoT / OT | Sensors, telemetry, SCADA | Azure IoT Hub, OSIsoft PI |
| `shared` | Shared / Cross-Domain | Reference data, master data | MDM, multiple sources |
| `analytics` | Analytics | Cross-domain analytical assets | Multiple upstream domains |
| `eng` | Engineering | Product engineering, R&D, PLM | Teamcenter, SolidWorks PDM |
| `whs` | Warehousing | Warehouse management, logistics | SAP WM/EWM, Epicor WMS |
| `plng` | Planning | Demand planning, MRP, S&OP | SAP APO, Epicor Planning |

### 3.2 [ADAPTATION REQUIRED] Client-Specific Domains

| Abbreviation | Full Domain | Description | Sources |
|-------------|-------------|-------------|---------|
| `[DOMAIN_1]` | `[FULL_NAME]` | `[DESCRIPTION]` | `[SOURCES]` |
| `[DOMAIN_2]` | `[FULL_NAME]` | `[DESCRIPTION]` | `[SOURCES]` |
| `[DOMAIN_3]` | `[FULL_NAME]` | `[DESCRIPTION]` | `[SOURCES]` |

---

## 4. Medallion Layer Abbreviations

| Abbreviation | Full Name | Used In | Description |
|-------------|-----------|---------|-------------|
| `bronze` | Bronze Layer | Lakehouse names | Raw ingestion, source-faithful |
| `silver` | Silver Layer | Lakehouse names | Cleansed, conformed, validated |
| `gold` | Gold Layer | Lakehouse names | Business-ready, aggregated |
| `brz` | Bronze | Table prefixes | Short form for table names |
| `slv` | Silver | Table prefixes | Short form for table names |
| `gld` | Gold | Table prefixes | Short form for table names |

---

## 5. Resource Type Prefixes

### 5.1 Fabric Resources

| Prefix | Resource Type | Example |
|--------|--------------|---------|
| `ws` | Workspace | `ws_mfg_analytics_prd` |
| `lh` | Lakehouse | `lh_mfg_bronze_prd` |
| `wh` | Warehouse | `wh_mfg_serving_prd` |
| `pl` | Pipeline | `pl_sap_bronze_daily_v1` |
| `nb` | Notebook | `nb_mfg_transform_silver` |
| `df` | Dataflow | `df_mfg_cleanse_silver` |
| `sm` | Semantic Model | `sm_mfg_operations_v1` |
| `rpt` | Report | `rpt_mfg_production_daily` |
| `es` | Eventstream | `es_iot_telemetry_bronze` |
| `kql` | KQL Database | `kql_iot_realtime_prd` |
| `ev` | Environment | `ev_mfg_spark_prd` |
| `ml` | ML Model | `ml_mfg_quality_predict_v1` |

### 5.2 Azure Resources (CAF-Aligned)

| Prefix | Resource Type | Example |
|--------|--------------|---------|
| `rg` | Resource Group | `rg-data-mfg-prd-eus-001` |
| `sqldb` | Azure SQL Database | `sqldb-erp-mfg-prd-eus-001` |
| `sqls` | Azure SQL Server | `sqls-data-mfg-prd-eus-001` |
| `syndp` | Synapse Dedicated Pool | `syndp-edw-mfg-prd-eus-001` |
| `synsp` | Synapse Spark Pool | `synsp-etl-mfg-prd-eus-001` |
| `synw` | Synapse Workspace | `synw-data-mfg-prd-eus-001` |
| `st` | Storage Account | `stdatamfgprdeus001` |
| `adf` | Data Factory | `adf-data-mfg-prd-eus-001` |
| `kv` | Key Vault | `kv-data-mfg-prd-eus-001` |
| `apim` | API Management | `apim-data-mfg-prd-eus-001` |
| `func` | Function App | `func-data-mfg-prd-eus-001` |
| `evh` | Event Hub | `evh-iot-mfg-prd-eus-001` |
| `evhns` | Event Hub Namespace | `evhns-iot-mfg-prd-eus-001` |
| `sb` | Service Bus | `sb-integ-mfg-prd-eus-001` |
| `sbns` | Service Bus Namespace | `sbns-integ-mfg-prd-eus-001` |
| `log` | Log Analytics Workspace | `log-data-mfg-prd-eus-001` |
| `appi` | Application Insights | `appi-data-mfg-prd-eus-001` |
| `cr` | Container Registry | `crdatamfgprdeus001` |
| `aks` | AKS Cluster | `aks-data-mfg-prd-eus-001` |
| `pbi` | Power BI Workspace | `pbi-mfg-operations-prd` |

---

## 6. Data Entity Abbreviations

### 6.1 Table Type Prefixes

| Prefix | Entity Type | Description |
|--------|------------|-------------|
| `fct` | Fact Table | Measures/metrics at a grain |
| `dim` | Dimension Table | Descriptive attributes |
| `brg` | Bridge Table | Many-to-many relationship resolver |
| `stg` | Staging Table | Temporary landing before merge |
| `ref` | Reference Table | Lookup / code table |
| `ctl` | Control Table | Pipeline metadata / watermarks |
| `aud` | Audit Table | Change tracking / audit log |
| `tmp` | — | **PROHIBITED** — see Section 1.3 |
| `vw` | View | Standard view |
| `mvw` | Materialized View | Materialized / indexed view |

### 6.2 Common Entity Names

| Abbreviation | Full Name | Domain Context |
|-------------|-----------|----------------|
| `cust` | Customer | Sales, Finance |
| `vend` | Vendor / Supplier | Supply Chain, Finance |
| `prod` | Product | Manufacturing, Sales |
| `matl` | Material | Manufacturing, Supply Chain |
| `wo` | Work Order | Manufacturing |
| `po` | Purchase Order | Supply Chain |
| `so` | Sales Order | Sales |
| `inv` | Inventory | Supply Chain, Warehousing |
| `invc` | Invoice | Finance |
| `gl` | General Ledger | Finance |
| `emp` | Employee | Human Capital |
| `equip` | Equipment | Maintenance, Manufacturing |
| `bom` | Bill of Materials | Manufacturing, Engineering |
| `rte` | Routing | Manufacturing |
| `insp` | Inspection | Quality Management |
| `ncr` | Non-Conformance Report | Quality Management |
| `wc` | Work Center | Manufacturing |
| `cc` | Cost Center | Finance |
| `dept` | Department | Human Capital, Shared |
| `loc` | Location | Shared |
| `uom` | Unit of Measure | Shared |
| `curr` | Currency | Finance, Shared |
| `addr` | Address | Shared |
| `cntct` | Contact | Sales, Shared |
| `ship` | Shipment | Supply Chain, Sales |
| `rcpt` | Receipt | Supply Chain, Finance |
| `pmt` | Payment | Finance |
| `acct` | Account | Finance |
| `proj` | Project | Shared |
| `cal` | Calendar | Shared |
| `shift` | Shift | Manufacturing |

---

## 7. Column Suffix Abbreviations

| Suffix | Data Type / Purpose | Example |
|--------|-------------------|---------|
| `_id` | Surrogate / system identifier | `customer_id` |
| `_sk` | Surrogate key (dimensional) | `product_sk` |
| `_bk` | Business key (natural key) | `material_bk` |
| `_cd` | Code value | `status_cd` |
| `_nm` | Name / description (short) | `customer_nm` |
| `_desc` | Description (long text) | `product_desc` |
| `_dt` | Date (date only, no time) | `order_dt` |
| `_ts` | Timestamp (date + time) | `created_ts` |
| `_tm` | Time (time only) | `shift_start_tm` |
| `_amt` | Amount (monetary) | `invoice_amt` |
| `_qty` | Quantity | `order_qty` |
| `_pct` | Percentage | `defect_pct` |
| `_rate` | Rate / ratio | `exchange_rate` |
| `_cnt` | Count | `line_item_cnt` |
| `_flg` | Flag (boolean-like) | `active_flg` |
| `_ind` | Indicator (boolean-like) | `deleted_ind` |
| `_url` | URL | `document_url` |
| `_path` | File or resource path | `blob_path` |
| `_json` | JSON content | `payload_json` |
| `_hash` | Hash value | `row_hash` |
| `_ver` | Version number | `schema_ver` |
| `_seq` | Sequence number | `line_seq` |
| `_wt` | Weight | `net_wt` |
| `_vol` | Volume | `container_vol` |
| `_len` | Length / dimension | `part_len` |
| `_temp` | Temperature | `furnace_temp` |
| `_psi` | Pressure | `system_psi` |
| `_rpm` | Rotations per minute | `spindle_rpm` |

---

## 8. Frequency / Schedule Abbreviations

| Abbreviation | Frequency | Used In |
|-------------|-----------|---------|
| `rt` | Real-time / streaming | Pipeline names |
| `nr` | Near-real-time (1–15 min) | Pipeline names |
| `hrly` | Hourly | Pipeline names |
| `daily` | Daily | Pipeline names |
| `wkly` | Weekly | Pipeline names |
| `mthly` | Monthly | Pipeline names |
| `qtrly` | Quarterly | Pipeline names |
| `yrly` | Yearly / Annual | Pipeline names |
| `adhoc` | On-demand | Pipeline names |
| `event` | Event-triggered | Pipeline names |

---

## 9. Region Abbreviations

| Abbreviation | Azure Region | Full Name |
|-------------|-------------|-----------|
| `eus` | East US | East US |
| `eus2` | East US 2 | East US 2 |
| `wus` | West US | West US |
| `wus2` | West US 2 | West US 2 |
| `cus` | Central US | Central US |
| `ncus` | North Central US | North Central US |
| `scus` | South Central US | South Central US |
| `weu` | West Europe | West Europe |
| `neu` | North Europe | North Europe |
| `uksth` | UK South | UK South |
| `ukwst` | UK West | UK West |
| `sea` | Southeast Asia | Southeast Asia |
| `eas` | East Asia | East Asia |
| `aue` | Australia East | Australia East |
| `ause` | Australia Southeast | Australia Southeast |
| `jpe` | Japan East | Japan East |
| `jpw` | Japan West | Japan West |
| `cac` | Canada Central | Canada Central |
| `cae` | Canada East | Canada East |

### [ADAPTATION REQUIRED] Client Region Selection

| Parameter | Value |
|-----------|-------|
| Primary Region | `[CLIENT_PRIMARY_REGION]` |
| Secondary Region | `[CLIENT_SECONDARY_REGION]` |
| DR Region | `[CLIENT_DR_REGION]` |

---

## 10. Pipeline Operation Abbreviations

| Abbreviation | Operation | Description |
|-------------|-----------|-------------|
| `ext` | Extract | Data extraction from source |
| `load` | Load | Data loading to target |
| `xfrm` | Transform | Data transformation |
| `val` | Validate | Data validation / quality check |
| `merge` | Merge | Upsert / SCD merge operation |
| `arch` | Archive | Data archival |
| `purge` | Purge | Data deletion / cleanup |
| `recon` | Reconcile | Source-target reconciliation |
| `enrich` | Enrich | Data enrichment from external sources |
| `dedup` | Deduplicate | Duplicate removal |
| `mask` | Mask | Data masking / anonymization |
| `agg` | Aggregate | Data aggregation |
| `snap` | Snapshot | Point-in-time snapshot |

---

## 11. Source System Abbreviations

### 11.1 ERP Systems

| Abbreviation | System | Notes |
|-------------|--------|-------|
| `sap` | SAP (all modules) | SAP ECC, S/4HANA |
| `epic` | Epicor (all modules) | Epicor Kinetic, Prophet 21 |
| `d365` | Dynamics 365 | D365 F&O, D365 BC |
| `orcl` | Oracle | Oracle EBS, JD Edwards |
| `ifs` | IFS | IFS Applications |
| `sage` | Sage | Sage X3, Sage Intacct |

### 11.2 Other Source Systems

| Abbreviation | System | Notes |
|-------------|--------|-------|
| `sf` | Salesforce | CRM, Marketing Cloud |
| `svcnw` | ServiceNow | ITSM, CMDB |
| `wday` | Workday | HR, Finance |
| `shrpt` | SharePoint | Document management |
| `teams` | Microsoft Teams | Collaboration data |
| `azmon` | Azure Monitor | Infrastructure monitoring |
| `pisvr` | OSIsoft PI | Historian / time-series |
| `kepw` | Kepware | OPC-UA / OT gateway |
| `mqtt` | MQTT Broker | IoT messaging |
| `iothub` | Azure IoT Hub | IoT device management |
| `apriso` | Apriso/DELMIA | MES system |
| `plex` | Plex | Cloud MES |

### 11.3 [ADAPTATION REQUIRED] Client-Specific Sources

| Abbreviation | System | Description |
|-------------|--------|-------------|
| `[SRC_1]` | `[SYSTEM_NAME]` | `[DESCRIPTION]` |
| `[SRC_2]` | `[SYSTEM_NAME]` | `[DESCRIPTION]` |
| `[SRC_3]` | `[SYSTEM_NAME]` | `[DESCRIPTION]` |

---

## 12. Conflict Resolution Process

### 12.1 Conflict Types

| Type | Description | Resolution |
|------|-------------|------------|
| **Homonym** | Same abbreviation, different meaning | Add qualifying context to one usage |
| **Synonym** | Different abbreviations, same meaning | Choose one; deprecate others |
| **Ambiguity** | Abbreviation unclear without context | Lengthen to 4–5 characters for clarity |

### 12.2 Resolution Steps

1. **Check this dictionary** — if the abbreviation exists, use it as defined
2. **Check the prohibited list** — if prohibited, use the approved alternative
3. **Check for conflicts** — search existing abbreviations for overlaps
4. **Submit change request** — if a new abbreviation is needed:
   - Proposed abbreviation (2–6 characters)
   - Full meaning
   - Category (domain, entity, operation, etc.)
   - Justification for why an existing abbreviation doesn't work
   - Sponsoring data steward
5. **Governance review** — Data Governance Council reviews within 5 business days
6. **Publication** — Approved abbreviations are added to this dictionary and communicated to all teams

### 12.3 Change Request Template

```
Abbreviation Change Request
============================
Date: [DATE]
Requestor: [NAME]
Sponsor: [DATA_STEWARD]

Proposed Abbreviation: [ABBREV]
Full Meaning: [FULL_NAME]
Category: [DOMAIN | ENTITY | OPERATION | SYSTEM | OTHER]
Justification: [WHY_NEEDED]
Conflicts Checked: [NONE | DESCRIBE_CONFLICTS]
Proposed Resolution: [IF_CONFLICT_EXISTS]
```

---

## Fabric / Azure Implementation Guidance

### Naming Validation in CI/CD

Fabric and Azure naming can be validated at deployment time using:

1. **Azure Policy** — Enforce resource naming patterns via `deny` policies
2. **Fabric REST API** — Pre-validate workspace and artifact names before creation
3. **Pre-commit hooks** — Validate naming in infrastructure-as-code (Bicep, Terraform) before merge
4. **Pipeline naming linter** — Custom Python/PowerShell script that validates pipeline names against this dictionary

### Example Azure Policy (Naming Enforcement)

```json
{
  "if": {
    "allOf": [
      { "field": "type", "equals": "Microsoft.Sql/servers/databases" },
      { "not": { "field": "name", "match": "sqldb-???-???-???-???-###" } }
    ]
  },
  "then": { "effect": "deny" }
}
```

### Example Pre-Commit Validation (Python)

```python
import re

VALID_PREFIXES = ['lh', 'wh', 'ws', 'pl', 'nb', 'df', 'sm', 'rpt', 'es', 'kql']
VALID_ENVS = ['dev', 'tst', 'stg', 'prd', 'sbx', 'dr']
VALID_DOMAINS = ['mfg', 'fin', 'scm', 'qms', 'mnt', 'sal', 'hcm', 'iot', 'shared', 'analytics']

def validate_fabric_name(name: str) -> bool:
    """Validate a Fabric artifact name against the abbreviation dictionary."""
    parts = name.split('_')
    if len(parts) < 3:
        return False
    if parts[0] not in VALID_PREFIXES:
        return False
    if parts[-1] not in VALID_ENVS:
        return False
    if parts[1] not in VALID_DOMAINS:
        return False
    if not re.match(r'^[a-z][a-z0-9_]{1,127}$', name):
        return False
    return True
```

---

## Manufacturing Overlay

### Additional Manufacturing Abbreviations

| Abbreviation | Full Name | Context |
|-------------|-----------|---------|
| `oee` | Overall Equipment Effectiveness | Manufacturing KPI |
| `takt` | Takt Time | Production rate metric |
| `wip` | Work In Progress | Manufacturing inventory |
| `fpy` | First Pass Yield | Quality metric |
| `spc` | Statistical Process Control | Quality measurement |
| `cmm` | Coordinate Measuring Machine | Metrology |
| `plc` | Programmable Logic Controller | OT equipment |
| `scada` | SCADA System | OT control |
| `mes` | Manufacturing Execution System | Shop floor system |
| `andon` | Andon (alert system) | Production alerts |
| `kanban` | Kanban | Pull system scheduling |
| `poka` | Poka-Yoke | Error-proofing |
| `gemba` | Gemba | Shop floor / workplace |
| `kaizen` | Kaizen | Continuous improvement |

### ITAR/Export Control Abbreviations

| Abbreviation | Full Name | Context |
|-------------|-----------|---------|
| `itar` | ITAR-Controlled | Export control classification |
| `ear` | EAR-Controlled | Export control classification |
| `cui` | Controlled Unclassified Info | Federal classification |
| `fouo` | For Official Use Only | Government classification |

---

## Cross-References

| Reference | Module | Relevance |
|-----------|--------|-----------|
| Database & Schema Naming | ISL-03 `templates/database-schema-naming.md` | Uses environment, domain, and layer abbreviations |
| Table & View Naming | ISL-03 `templates/table-view-naming.md` | Uses entity and table type abbreviations |
| Column Naming Standards | ISL-03 `templates/column-naming-standards.md` | Uses column suffix abbreviations |
| Pipeline & Dataflow Naming | ISL-03 `templates/pipeline-dataflow-naming.md` | Uses source, operation, and frequency abbreviations |
| API & Endpoint Naming | ISL-03 `templates/api-endpoint-naming.md` | Uses domain and entity abbreviations |
| Infrastructure Resource Naming | ISL-03 `templates/infrastructure-resource-naming.md` | Uses resource type prefixes and region codes |
| Data Classification | ISL-04 `templates/classification-tier-definitions.md` | Domain taxonomy alignment |
| Integration Patterns | ISL-05 | Pattern naming references abbreviation dictionary |
| Data Quality Rules | ISL-06 `templates/quality-rule-library.md` | Quality rule naming follows abbreviation conventions |

---

## Compliance Alignment

| Standard | Relevance | How This Template Aligns |
|----------|-----------|--------------------------|
| Azure CAF | Azure resource naming conventions | Section 5.2 adopts CAF resource prefixes |
| DAMA DMBOK | Data architecture naming governance | Sections 1, 12 implement DMBOK naming governance principles |
| ISO 11179 | Metadata registry naming | Entity abbreviations follow ISO 11179 naming conventions |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | DMTSP Architecture | Initial release — comprehensive abbreviation dictionary |

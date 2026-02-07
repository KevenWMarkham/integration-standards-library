# Database & Schema Naming Standards
> ISL-03 | Integration Standards Library | v1.0

**Module:** ISL-03 — Naming Convention Standards
**Purpose:** Defines naming patterns for databases, lakehouses, warehouses, and schemas across Microsoft Fabric, Azure SQL, and Synapse environments
**Adaptation Effort:** 1–2 hours
**Dependencies:** ISL-04 (Data Classification — domain taxonomy alignment), ISL-06 (Metadata & Lineage — catalog registration names)

---

## 1. Overview

Database and schema names are the outermost layer of the data naming hierarchy. Incorrect or inconsistent naming at this level cascades into every downstream artifact — tables, views, pipelines, reports, and access policies all reference these names. This standard establishes deterministic, collision-free naming patterns that encode environment, domain, medallion layer, and purpose directly into the name.

**When to use this standard:**
- Provisioning any new Fabric lakehouse or warehouse
- Creating Azure SQL databases or Synapse dedicated pools
- Defining schema structures within any warehouse or database
- Migrating from legacy naming to standardized naming

**Key principles:**
- Names are lowercase, underscore-delimited (snake_case)
- Names encode context: a reader should know the environment, domain, and layer from the name alone
- No special characters beyond underscores; no leading digits
- Maximum 128 characters for database/lakehouse names; maximum 128 characters for schema names

---

## 2. Environment Prefix Conventions

Every database-level artifact must encode its environment. Environment prefixes are appended as suffixes in Fabric patterns (to keep domain as the primary grouping) or as standalone segments in Azure resource names.

| Environment | Suffix Code | Full Name | Description |
|-------------|-------------|-----------|-------------|
| Development | `dev` | Development | Active development and experimentation |
| Test | `tst` | Test / QA | Quality assurance and integration testing |
| Staging | `stg` | Staging / UAT | User acceptance testing, pre-production |
| Production | `prd` | Production | Live production workloads |
| Sandbox | `sbx` | Sandbox | Isolated experimentation, no SLA |
| Disaster Recovery | `dr` | Disaster Recovery | Failover and recovery environment |

**Rules:**
- Always use the three-letter abbreviation, never the full word
- Environment suffix is always the last segment of the name
- Sandbox environments must never contain production data (enforced by ISL-04 Data Classification)
- Disaster recovery artifacts mirror production names with `dr` suffix

---

## 3. Domain Classification Encoding

Domain segments identify the business area that owns or primarily consumes the data asset. Domain codes must be drawn from the organization's approved domain taxonomy (see ISL-04 Data Classification for taxonomy governance).

| Domain Code | Full Domain | Description | Typical Sources |
|-------------|-------------|-------------|-----------------|
| `mfg` | Manufacturing | Production, shop floor, work orders | SAP PP, Epicor Production, MES |
| `fin` | Finance | General ledger, accounts, reporting | SAP FI/CO, Epicor Finance |
| `scm` | Supply Chain | Procurement, logistics, warehousing | SAP MM/WM, Epicor Inventory |
| `qms` | Quality | Quality management, inspections | SAP QM, Epicor Quality |
| `mnt` | Maintenance | Equipment maintenance, PM schedules | SAP PM, Epicor Maintenance |
| `sal` | Sales | Orders, customers, pricing | SAP SD, Epicor CRM |
| `hcm` | Human Capital | HR, payroll, workforce | SAP HR, Epicor HCM |
| `iot` | IoT / OT | Sensors, telemetry, SCADA | Azure IoT Hub, OSIsoft PI |
| `shared` | Shared / Cross-Domain | Reference data, master data | MDM, multiple sources |
| `analytics` | Analytics | Cross-domain analytical assets | Multiple upstream domains |

**Rules:**
- Use 2–6 character abbreviations from the approved abbreviation dictionary (see `templates/abbreviation-dictionary.md`)
- When data spans multiple domains, use `shared` or `analytics`
- Never encode organizational unit names (departments change); encode functional domains instead

---

## 4. Medallion Layer Indicators

The medallion architecture (bronze/silver/gold) is the standard lakehouse pattern. Layer indicators must appear in lakehouse and table names.

| Layer | Code | Purpose | Data Characteristics |
|-------|------|---------|---------------------|
| Bronze | `bronze` | Raw ingestion | Source-faithful, append-only, minimal transformation |
| Silver | `silver` | Cleansed / Conformed | Deduplicated, typed, validated, conformed keys |
| Gold | `gold` | Business-ready | Aggregated, business logic applied, consumption-ready |

**Rules:**
- Lakehouse names use the full word (`bronze`, `silver`, `gold`) for clarity
- Table prefixes within lakehouses use abbreviated forms (`brz_`, `slv_`, `gld_`) — see `templates/table-view-naming.md`
- One lakehouse per domain per layer per environment (no multi-layer lakehouses)

---

## 5. Fabric Lakehouse Naming

### Pattern
```
lh_{domain}_{layer}_{env}
```

### Components

| Segment | Description | Allowed Values | Required |
|---------|-------------|----------------|----------|
| `lh` | Resource type prefix — lakehouse | Fixed literal | Yes |
| `{domain}` | Business domain code | From approved domain taxonomy | Yes |
| `{layer}` | Medallion layer | `bronze`, `silver`, `gold` | Yes |
| `{env}` | Environment code | `dev`, `tst`, `stg`, `prd`, `sbx` | Yes |

### Examples

| Lakehouse Name | Domain | Layer | Environment | Description |
|---------------|--------|-------|-------------|-------------|
| `lh_mfg_bronze_prd` | Manufacturing | Bronze | Production | Raw manufacturing data ingestion |
| `lh_mfg_silver_prd` | Manufacturing | Silver | Production | Cleansed manufacturing data |
| `lh_mfg_gold_prd` | Manufacturing | Gold | Production | Business-ready manufacturing metrics |
| `lh_mfg_bronze_dev` | Manufacturing | Bronze | Development | Dev environment for manufacturing ingestion |
| `lh_fin_bronze_prd` | Finance | Bronze | Production | Raw financial data ingestion |
| `lh_fin_silver_prd` | Finance | Silver | Production | Cleansed financial data |
| `lh_fin_gold_prd` | Finance | Gold | Production | Financial reporting data |
| `lh_scm_bronze_prd` | Supply Chain | Bronze | Production | Raw supply chain data |
| `lh_scm_silver_tst` | Supply Chain | Silver | Test | QA for supply chain transformations |
| `lh_iot_bronze_prd` | IoT | Bronze | Production | Raw sensor/telemetry data |
| `lh_iot_silver_prd` | IoT | Silver | Production | Processed telemetry data |
| `lh_shared_bronze_prd` | Shared | Bronze | Production | Cross-domain reference/master data |
| `lh_qms_silver_stg` | Quality | Silver | Staging | UAT for quality management |
| `lh_analytics_gold_prd` | Analytics | Gold | Production | Cross-domain analytical models |

---

## 6. Fabric Warehouse Naming

### Pattern
```
wh_{domain}_{purpose}_{env}
```

### Components

| Segment | Description | Allowed Values | Required |
|---------|-------------|----------------|----------|
| `wh` | Resource type prefix — warehouse | Fixed literal | Yes |
| `{domain}` | Business domain code | From approved domain taxonomy | Yes |
| `{purpose}` | Functional purpose | `serving`, `analytics`, `reporting`, `staging`, `archive` | Yes |
| `{env}` | Environment code | `dev`, `tst`, `stg`, `prd`, `sbx` | Yes |

### Examples

| Warehouse Name | Domain | Purpose | Environment | Description |
|---------------|--------|---------|-------------|-------------|
| `wh_mfg_serving_prd` | Manufacturing | Serving | Production | Star schema for manufacturing reports |
| `wh_mfg_analytics_prd` | Manufacturing | Analytics | Production | Ad-hoc analytics on manufacturing data |
| `wh_fin_reporting_prd` | Finance | Reporting | Production | Financial reporting warehouse |
| `wh_fin_serving_dev` | Finance | Serving | Development | Dev environment for finance serving layer |
| `wh_scm_serving_prd` | Supply Chain | Serving | Production | Supply chain dimensional model |
| `wh_shared_staging_prd` | Shared | Staging | Production | Cross-domain staging warehouse |
| `wh_analytics_serving_prd` | Analytics | Serving | Production | Enterprise-wide analytics warehouse |
| `wh_iot_analytics_tst` | IoT | Analytics | Test | QA for IoT analytics queries |
| `wh_hcm_reporting_stg` | Human Capital | Reporting | Staging | UAT for HR reporting |
| `wh_sal_serving_prd` | Sales | Serving | Production | Sales dimensional model |

---

## 7. Schema Naming Within Warehouses

Schemas organize objects within a warehouse by functional purpose or data layer. Every warehouse must define schemas explicitly — never rely on the `dbo` default schema.

### Pattern
```
{purpose}  OR  {domain}_{purpose}
```

### Standard Schema Names

| Schema Name | Purpose | When to Use |
|-------------|---------|-------------|
| `raw` | Raw ingested data | External tables, COPY INTO targets |
| `staging` | Intermediate staging | Pre-merge staging tables |
| `cleansed` | Validated and typed data | Post-validation, pre-business-logic |
| `conformed` | Conformed dimensions and keys | Shared reference data |
| `presentation` | Business-ready consumption | Star schema facts/dimensions |
| `audit` | Pipeline metadata and logging | Audit tables, run history |
| `security` | Row-level security, masking | RLS filter tables |
| `archive` | Historical/deprecated objects | Retained for compliance |
| `sandbox` | Ad-hoc exploration | Analyst scratch space |

### Multi-Domain Warehouse Schemas

When a warehouse contains data from multiple domains, prefix the schema with the domain code:

| Schema Name | Description |
|-------------|-------------|
| `mfg_presentation` | Manufacturing facts and dimensions |
| `fin_presentation` | Finance facts and dimensions |
| `scm_presentation` | Supply chain facts and dimensions |
| `shared_conformed` | Cross-domain conformed dimensions |
| `shared_reference` | Enterprise reference data |

**Rules:**
- Schema names are lowercase snake_case
- Maximum of 15 schemas per warehouse (if you need more, consider splitting the warehouse)
- The `dbo` schema must remain empty — it is reserved and unused
- Every warehouse must have an `audit` schema for pipeline run tracking
- Grant permissions at the schema level, not the object level (aligns with ISL-05 Security Patterns)

---

## 8. Azure SQL Database Naming

For Azure SQL Database (single database or elastic pool), use the following pattern when Fabric is not the primary platform.

### Pattern
```
sqldb-{workload}-{domain}-{env}-{region}-{instance}
```

### Examples

| Database Name | Workload | Domain | Env | Region | Description |
|--------------|----------|--------|-----|--------|-------------|
| `sqldb-erp-mfg-prd-eus-001` | ERP | Manufacturing | Production | East US | Production manufacturing ERP database |
| `sqldb-erp-fin-prd-eus-001` | ERP | Finance | Production | East US | Production finance ERP database |
| `sqldb-api-shared-prd-eus-001` | API | Shared | Production | East US | Shared API backend database |
| `sqldb-erp-mfg-dev-eus-001` | ERP | Manufacturing | Development | East US | Dev manufacturing database |
| `sqldb-rpt-sal-prd-wus-001` | Reporting | Sales | Production | West US | Sales reporting database |
| `sqldb-mdm-shared-prd-eus-001` | MDM | Shared | Production | East US | Master data management database |
| `sqldb-iot-mfg-prd-eus-001` | IoT | Manufacturing | Production | East US | IoT data database |

**Rules:**
- Follows Azure Cloud Adoption Framework (CAF) naming convention
- Hyphen-delimited (not underscores — Azure resource names use hyphens)
- Instance number is zero-padded three digits (`001`, `002`)
- Cross-reference `templates/infrastructure-resource-naming.md` for full Azure resource naming

---

## 9. Synapse Dedicated SQL Pool Naming

### Pattern
```
syndp-{workload}-{domain}-{env}-{region}-{instance}
```

### Examples

| Pool Name | Description |
|-----------|-------------|
| `syndp-edw-analytics-prd-eus-001` | Production enterprise data warehouse |
| `syndp-edw-mfg-prd-eus-001` | Production manufacturing data warehouse |
| `syndp-edw-analytics-dev-eus-001` | Development analytics warehouse |
| `syndp-ods-shared-prd-eus-001` | Operational data store |

**Note:** For new deployments, Fabric warehouses are preferred over Synapse dedicated pools. Use Synapse naming only for legacy or hybrid environments.

---

## 10. Anti-Patterns and Prohibited Patterns

The following patterns are prohibited. Engagement teams must identify and remediate these during assessment.

| Anti-Pattern | Example | Why It Is Wrong | Correct Alternative |
|-------------|---------|-----------------|-------------------|
| Using `dbo` as active schema | `dbo.FactSales` | Default schema signals no governance | `presentation.fct_sales` |
| PascalCase or camelCase | `ManufacturingBronze` | Inconsistent with snake_case standard | `mfg_bronze` |
| Spaces in names | `Manufacturing Bronze` | Requires bracket quoting, causes scripting errors | `mfg_bronze` |
| Full environment words | `lh_mfg_bronze_production` | Inconsistent, wastes characters | `lh_mfg_bronze_prd` |
| Abbreviations not in dictionary | `lh_mnfctrng_brz_p` | Unreadable, ambiguous | `lh_mfg_bronze_prd` |
| Personal names | `john_test_db` | Not sustainable, not discoverable | `lh_shared_bronze_sbx` |
| Date stamps in DB names | `lh_mfg_bronze_20250115` | Creates proliferation, breaks automation | Use versioning or partitioning instead |
| Encoding project names | `lh_project_alpha_bronze_prd` | Projects end; domains persist | `lh_mfg_bronze_prd` |
| Mixed delimiters | `lh-mfg_bronze.prd` | Inconsistent, error-prone | `lh_mfg_bronze_prd` |
| No environment indicator | `lh_mfg_bronze` | Ambiguous — which environment? | `lh_mfg_bronze_prd` |
| Numeric-only segments | `lh_01_02_03` | Meaningless, not self-documenting | `lh_mfg_bronze_prd` |
| Exceeding character limits | 130+ character names | Hits platform limits, truncation risk | Keep under 80 characters |

---

## 11. Character Rules and Constraints

| Rule | Specification |
|------|--------------|
| Case | Lowercase only |
| Delimiter | Underscore (`_`) only |
| Allowed characters | `a-z`, `0-9`, `_` |
| Leading character | Must start with a letter (the prefix satisfies this) |
| Maximum length — Fabric Lakehouse | 128 characters |
| Maximum length — Fabric Warehouse | 128 characters |
| Maximum length — Azure SQL Database | 128 characters |
| Maximum length — Schema | 128 characters |
| Recommended practical length | 40–80 characters |
| Reserved words | Do not use SQL reserved words as any segment |

---

## 12. Naming Decision Tree

Use this decision tree when creating a new database-level artifact:

```
1. What platform?
   ├── Microsoft Fabric
   │   ├── Is it for raw/staged data? → Lakehouse: lh_{domain}_{layer}_{env}
   │   └── Is it for serving/analytics? → Warehouse: wh_{domain}_{purpose}_{env}
   ├── Azure SQL Database
   │   └── sqldb-{workload}-{domain}-{env}-{region}-{instance}
   └── Synapse Dedicated Pool
       └── syndp-{workload}-{domain}-{env}-{region}-{instance}

2. What domain?
   └── Use approved domain code from abbreviation dictionary

3. What environment?
   └── dev | tst | stg | prd | sbx | dr

4. Validate:
   └── Lowercase? Snake_case? Under 80 chars? No reserved words?
```

---

## Adaptation Guide

> **For engagement teams:** Customize the sections below for each client.

- [ ] Review client's existing database naming conventions and document deviations from this standard
- [ ] Define client-specific domain taxonomy codes (Section 3) aligned with their organizational structure
- [ ] Confirm environment naming matches client's SDLC (some clients use `qa` instead of `tst`, or `uat` instead of `stg`)
- [ ] Validate Fabric workspace-to-lakehouse mapping strategy with the client's Fabric admin team
- [ ] Determine if client requires additional schema categories beyond the standard set (Section 7)
- [ ] Identify legacy databases that need renaming and create a migration plan with the client
- [ ] Confirm Azure region codes match the client's deployment regions
- [ ] Add client-specific anti-patterns discovered during assessment to Section 10

---

## References

- **ISL-03 Abbreviation Dictionary** — `templates/abbreviation-dictionary.md` — Approved abbreviation codes for all segments
- **ISL-03 Table & View Naming** — `templates/table-view-naming.md` — Object naming within databases
- **ISL-03 Infrastructure Resource Naming** — `templates/infrastructure-resource-naming.md` — Azure resource naming (CAF-aligned)
- **ISL-04 Data Classification** — Domain taxonomy and data sensitivity levels
- **ISL-05 Security Patterns** — Schema-level access control patterns
- **ISL-06 Metadata & Lineage** — Catalog registration naming requirements
- **Microsoft Fabric Documentation** — Lakehouse and warehouse naming constraints
- **Azure Cloud Adoption Framework** — Resource naming and tagging conventions
- **DAMA DMBOK** — Data architecture naming governance principles

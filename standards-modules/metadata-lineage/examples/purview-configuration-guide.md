# Purview Configuration Guide — Completed Example

> Module: ISL-02 | Version: 1.0 | Type: Example

## Purpose

This document provides a step-by-step configuration guide for deploying Microsoft Purview as the enterprise metadata catalog for a manufacturing client. It demonstrates the complete setup process from collection hierarchy creation through source registration, scan configuration, glossary import, classification rules, lineage connectors, and access policies — all aligned to the ISL-02 Metadata & Data Lineage Framework.

**Client Profile:**
- Industry: Discrete manufacturing (aerospace components)
- Purview Account: purview-acme-prod (East US 2)
- Azure Subscription: acme-prod-data-platform
- ERP: SAP S/4HANA (3 plants) + Epicor Kinetic (2 plants)
- Data Platform: Microsoft Fabric (F64 capacity)
- IoT: Azure IoT Hub (2,500 sensors)
- ITAR: Required for defense product lines
- Compliance: SOX, GDPR, ITAR

## Step 1: Create Collections Hierarchy

Collections organize assets, control access, and mirror the business domain taxonomy defined in ISL-02.

### Collection Structure

```
Acme Manufacturing (Root Collection)
├── Production
│   ├── Finance
│   │   ├── SAP Finance (FI/CO)
│   │   └── Financial Reporting
│   ├── Operations
│   │   ├── SAP Production (PP/PM)
│   │   ├── Epicor Production
│   │   ├── MES (Ignition)
│   │   └── IoT & Sensors
│   ├── Supply Chain
│   │   ├── SAP Materials (MM)
│   │   ├── Epicor Purchasing
│   │   └── Logistics
│   ├── Quality
│   │   ├── SAP Quality (QM)
│   │   ├── Epicor Quality
│   │   └── NDT & CMM
│   ├── Sales & Marketing
│   │   ├── SAP Sales (SD)
│   │   └── Epicor Order Management
│   └── Shared / Master Data
│       ├── Material Master (Cross-ERP)
│       ├── Customer Master (Cross-ERP)
│       ├── Vendor Master (Cross-ERP)
│       └── Reference Data
├── Pre-Production
│   ├── UAT
│   └── Development
├── Fabric Workspaces
│   ├── prod-data-engineering
│   ├── prod-data-analytics
│   └── prod-iot-streaming
└── Archived
```

### Collection Creation Steps

| Step | Action | Configuration |
|------|--------|---------------|
| 1 | Navigate to Purview Data Map > Collections | Open Purview governance portal |
| 2 | Create root collection "Acme Manufacturing" | Set as root; assign CDO as collection admin |
| 3 | Create "Production" sub-collection | Parent: Root; assign data governance lead as admin |
| 4 | Create domain sub-collections under Production | Finance, Operations, Supply Chain, Quality, Sales & Marketing, Shared |
| 5 | Create source-system sub-collections under each domain | SAP Finance, Epicor Production, etc. |
| 6 | Create "Pre-Production" collection | Parent: Root; restrict access to dev/test teams |
| 7 | Create "Fabric Workspaces" collection | Parent: Root; one sub-collection per workspace |
| 8 | Create "Archived" collection | Parent: Root; read-only access for all users |

### Collection Access Assignments

| Collection | Role | Group | Scope |
|-----------|------|-------|-------|
| Root (Acme Manufacturing) | Collection Admin | data-governance-admins | Full administration |
| Root | Data Reader | all-employees | Browse all cataloged assets |
| Production > Finance | Data Curator | finance-data-stewards | Curate finance assets |
| Production > Operations | Data Curator | operations-data-stewards | Curate operations assets |
| Production > Supply Chain | Data Curator | supply-chain-data-stewards | Curate supply chain assets |
| Production > Quality | Data Curator | quality-data-stewards | Curate quality assets |
| Production > Operations > IoT | Data Curator | iot-platform-team | Curate IoT assets |
| Fabric Workspaces | Data Source Admin | data-engineering-team | Register and scan Fabric |
| Pre-Production | Data Reader | dev-team | Read-only access to non-prod metadata |

## Step 2: Register Data Sources

### Source Registration Inventory

| # | Source Name | Source Type | Connection | Collection | Credential |
|---|-----------|------------|------------|-----------|------------|
| 1 | Fabric Workspace: prod-data-engineering | Microsoft Fabric | Fabric tenant integration | Fabric Workspaces > prod-data-engineering | Managed identity |
| 2 | Fabric Workspace: prod-data-analytics | Microsoft Fabric | Fabric tenant integration | Fabric Workspaces > prod-data-analytics | Managed identity |
| 3 | Fabric Workspace: prod-iot-streaming | Microsoft Fabric | Fabric tenant integration | Fabric Workspaces > prod-iot-streaming | Managed identity |
| 4 | SAP S/4HANA | SAP S/4HANA | RFC connection via SHIR | Production > Operations > SAP Production | Key Vault secret (SAP service user) |
| 5 | Epicor Kinetic DB | SQL Server | SQL connection via SHIR | Production > Operations > Epicor Production | Key Vault secret (Epicor read-only user) |
| 6 | Azure SQL: reference-data | Azure SQL Database | Service endpoint | Production > Shared > Reference Data | Managed identity |
| 7 | ADLS Gen2: manual-uploads | ADLS Gen2 | Service endpoint | Production > Shared | Managed identity |
| 8 | Power BI Tenant | Power BI | Admin API | Fabric Workspaces | Managed identity (Power BI admin) |

### Registration Steps (Fabric Example)

| Step | Action | Detail |
|------|--------|--------|
| 1 | Navigate to Data Map > Sources > Register | Click "Register" button |
| 2 | Select source type "Microsoft Fabric" | From Azure source category |
| 3 | Configure connection | Tenant: acme-mfg.onmicrosoft.com |
| 4 | Select workspaces to include | prod-data-engineering, prod-data-analytics, prod-iot-streaming |
| 5 | Assign to collection | Fabric Workspaces |
| 6 | Set credential | Managed Identity (Purview MSI) |
| 7 | Test connection | Verify connectivity success |
| 8 | Save registration | Source appears in Data Map |

### Registration Steps (SAP S/4HANA)

| Step | Action | Detail |
|------|--------|--------|
| 1 | Install Self-Hosted Integration Runtime (SHIR) | On a Windows VM with network access to SAP |
| 2 | Install SAP .NET Connector 3.0 | Required for RFC communication |
| 3 | Register source type "SAP S/4HANA" | In Purview Data Map |
| 4 | Configure SAP connection | Application Server: sap-prod-01.acme-mfg.local; System Number: 00; Client: 100 |
| 5 | Configure credential | Key Vault reference: kv-purview-prod/sap-scan-user |
| 6 | Select SHIR | shir-purview-sap-01 |
| 7 | Assign to collection | Production > Operations > SAP Production |
| 8 | Test connection | Verify RFC connectivity |

## Step 3: Configure Scans

### Scan Rule Set: ISL-02-Manufacturing

Create a custom scan rule set that includes all ISL-04 classification rules plus manufacturing-specific patterns.

**Included Classification Rules:**

| Classification | Type | Pattern / Rule | Auto-Apply |
|---------------|------|---------------|------------|
| Microsoft.PersonalData.Name | System | Built-in NER | Yes |
| Microsoft.PersonalData.EmailAddress | System | Built-in regex | Yes |
| Microsoft.PersonalData.PhoneNumber | System | Built-in regex | Yes |
| Microsoft.PersonalData.US.SSN | System | Built-in regex | Yes |
| Microsoft.Financial.CreditCardNumber | System | Built-in regex | Yes |
| ISL.ITAR.Controlled | Custom | Column name contains "itar" or "export_control" or "usml" | Yes |
| ISL.Manufacturing.MaterialNumber | Custom | Column name matches "material_number" or "matnr" or "part_num" | Yes |
| ISL.Manufacturing.LotNumber | Custom | Column name matches "lot_number" or "batch_number" or "charg" | Yes |
| ISL.Manufacturing.SerialNumber | Custom | Column name matches "serial_number" or "sernr" | Yes |
| ISL.Financial.SOX | Custom | Table tagged with "sox" or in finance schema | Yes |
| ISL.PII.DirectIdentifier | Custom | Columns classified as Direct PII | Yes |
| ISL.PII.IndirectIdentifier | Custom | Columns classified as Indirect PII | Yes |

### Scan Configurations

**Scan: Fabric Production Workspaces**

| Setting | Value |
|---------|-------|
| Scan Name | scan-fabric-production-daily |
| Source | Microsoft Fabric (all 3 prod workspaces) |
| Scan Rule Set | ISL-02-Manufacturing |
| Scope | All lakehouses, warehouses, semantic models, pipelines |
| Trigger | Recurring: Daily at 01:00 UTC |
| Scan Level | Full (initial), Incremental (subsequent) |
| Classification | Enabled (auto-apply ISL-02-Manufacturing rules) |
| Lineage Extraction | Enabled |
| Resource Set | Enabled (for partitioned Delta tables) |

**Scan: SAP S/4HANA**

| Setting | Value |
|---------|-------|
| Scan Name | scan-sap-weekly |
| Source | SAP S/4HANA |
| Scan Rule Set | ISL-02-Manufacturing |
| Scope | Selected modules: FI, CO, MM, PP, PM, QM, SD |
| Excluded Tables | System tables (SY*, T000, USR*) |
| Trigger | Recurring: Weekly, Sunday 00:00 UTC |
| Classification | Enabled |
| Lineage Extraction | Limited (SAP connector) |

**Scan: Epicor Kinetic Database**

| Setting | Value |
|---------|-------|
| Scan Name | scan-epicor-weekly |
| Source | Epicor Kinetic DB (SQL Server) |
| Scan Rule Set | ISL-02-Manufacturing |
| Scope | All Erp schema tables; exclude Ice, Sys schemas |
| Trigger | Recurring: Weekly, Sunday 04:00 UTC |
| Classification | Enabled |
| Lineage Extraction | Via SQL view definitions |

**Scan: Power BI Tenant**

| Setting | Value |
|---------|-------|
| Scan Name | scan-powerbi-daily |
| Source | Power BI Tenant |
| Scan Rule Set | Default (Power BI) |
| Scope | All production workspaces |
| Trigger | Recurring: Daily at 05:00 UTC |
| Include Metadata | Reports, dashboards, datasets, dataflows |
| Lineage Extraction | Enabled (dataset to report) |

### Scan Schedule Summary

```
00:00 UTC ─ scan-sap-weekly (Sunday only, 4-hour window)
01:00 UTC ─ scan-fabric-production-daily (2-hour window)
03:00 UTC ─ scan-adls-manual-uploads-daily (1-hour window)
04:00 UTC ─ scan-epicor-weekly (Sunday only, 4-hour window)
05:00 UTC ─ scan-powerbi-daily (1-hour window)
06:00 UTC ─ scan-azure-sql-reference-daily (30-minute window)
06:30 UTC ─ [All scans complete; enrichment pipelines may begin]
```

## Step 4: Import Glossary Terms

### Glossary Import Process

| Step | Action | Detail |
|------|--------|--------|
| 1 | Create glossary term template | Add ISL-02 custom attributes (ISL_Term_ID, ISL_Sub_Domain, ISL_Source_Of_Record, etc.) |
| 2 | Prepare CSV import file | Use Purview glossary CSV template format |
| 3 | Validate CSV format | Ensure all required columns populated, no duplicates |
| 4 | Navigate to Glossary > Import Terms | Select the prepared CSV file |
| 5 | Map CSV columns to Purview attributes | Map ISL-02 attributes to custom template fields |
| 6 | Execute import | Monitor import progress |
| 7 | Verify imported terms | Spot-check 10% of terms for accuracy |
| 8 | Set term statuses | Bulk-update approved terms from "Draft" to "Approved" |

### Initial Glossary Import Summary

| Domain | Terms Imported | Status | Steward |
|--------|---------------|--------|---------|
| Finance | 85 | Approved | finance-data-steward@acme-mfg.com |
| Operations | 120 | Approved | operations-data-steward@acme-mfg.com |
| Supply Chain | 95 | Approved | supply-chain-data-steward@acme-mfg.com |
| Quality | 65 | Approved | quality-data-steward@acme-mfg.com |
| Sales & Marketing | 45 | Approved | sales-data-steward@acme-mfg.com |
| IoT & Manufacturing | 40 | Approved | iot-data-steward@acme-mfg.com |
| Cross-Domain | 30 | Approved | data-governance-lead@acme-mfg.com |
| Total | 480 | -- | -- |

### Sample CSV Import Format

```csv
Name,Definition,Status,Experts,Stewards,ISL_Term_ID,ISL_Sub_Domain,ISL_Source_Of_Record,ISL_Regulatory_Relevance,ISL_Abbreviation,ISL_Counterpart_SAP,ISL_Counterpart_Epicor,Parent Term
Material Number,"Unique identifier assigned to a raw material, component, or finished product within the enterprise inventory system",Approved,materials-management@acme-mfg.com,operations-data-steward@acme-mfg.com,GT-00001,Inventory Management,SAP S/4HANA (MM),SOX,MATNR,MARA-MATNR,Part.PartNum,
Bill of Materials,"A hierarchical list specifying the components and quantities required to manufacture one unit of a finished product",Approved,engineering-lead@acme-mfg.com,operations-data-steward@acme-mfg.com,GT-00089,Product Structure,SAP S/4HANA (PP),,BOM,CS01-STLNR,ECORev.GroupSeq,Product Structure
OEE,"Overall Equipment Effectiveness: a metric calculated as Availability x Performance x Quality measuring manufacturing productivity",Approved,ops-director@acme-mfg.com,operations-data-steward@acme-mfg.com,GT-00110,Production,,,,Custom calculation,Custom calculation,Production Metrics
```

### Post-Import Linking

After importing glossary terms, link them to cataloged data assets.

| Activity | Method | Volume |
|----------|--------|--------|
| Link terms to Gold tables | Manual curation in Purview UI | 38 Gold tables |
| Link terms to Gold columns | Bulk update via Purview REST API | 450+ column-to-term links |
| Link terms to semantic model measures | Manual curation | 45 measures across 4 models |
| Link terms to report fields | Manual curation | Priority reports only (top 15) |
| Validate cross-ERP term mappings | Steward review | 50 dual-ERP terms verified |

## Step 5: Set Up Classifications

### Custom Classification Rules

| Classification Name | Rule Type | Pattern | Applies To |
|--------------------|-----------|---------|------------|
| ISL.ITAR.Controlled | Column Name Pattern | Regex: `(?i)(itar|export_control|usml|defense_article)` | Column names |
| ISL.Manufacturing.WeldProcedure | Column Name Pattern | Regex: `(?i)(weld_proc|wps_number|welding_spec)` | Column names |
| ISL.Manufacturing.MaterialNumber | Column Name Pattern | Regex: `(?i)(material_number|matnr|part_num|part_number)` | Column names |
| ISL.Manufacturing.LotBatch | Column Name Pattern | Regex: `(?i)(lot_number|batch_number|charg|lot_num)` | Column names |
| ISL.Manufacturing.SerialNumber | Column Name Pattern | Regex: `(?i)(serial_number|sernr|serial_num)` | Column names |
| ISL.Financial.SOXCritical | Column Name Pattern | Regex: `(?i)(revenue|net_income|gross_profit|total_assets|account_balance)` | Column names |
| ISL.Financial.BankAccount | Data Pattern | Regex: `\b\d{8,17}\b` (with context: column name contains "bank" or "account") | Column data |
| ISL.PII.EmployeeBadge | Column Name Pattern | Regex: `(?i)(badge_number|employee_badge|operator_id|inspector_id)` | Column names |

### Classification Creation Steps

| Step | Action |
|------|--------|
| 1 | Navigate to Purview Data Map > Classifications > Custom |
| 2 | Click "New Classification" |
| 3 | Enter classification name (e.g., ISL.ITAR.Controlled) |
| 4 | Add description (e.g., "Identifies columns containing ITAR-controlled data indicators") |
| 5 | Create associated classification rule |
| 6 | Select rule type: Column Name Pattern or Data Pattern |
| 7 | Enter regex pattern |
| 8 | Test pattern against sample data |
| 9 | Add rule to ISL-02-Manufacturing scan rule set |
| 10 | Save and enable |

### Classification-to-ISL-04 Tier Mapping

| Classification(s) Detected | ISL-04 Tier | Automated Action |
|---------------------------|-------------|-----------------|
| Microsoft.PersonalData.US.SSN | Tier 3 — Confidential | Apply sensitivity label; restrict access |
| ISL.ITAR.Controlled | Tier 4 — Restricted | Apply ITAR label; restrict to US Persons; enable full audit |
| Microsoft.PersonalData.EmailAddress + .Name | Tier 2 — Internal (PII flagged) | Apply PII sensitivity label |
| ISL.Financial.SOXCritical | Tier 2 — Internal (SOX flagged) | Apply SOX tag; require certification |
| No classification detected | Tier 1 — Public (review) | Queue for steward review |

## Step 6: Enable Lineage Connectors

### Lineage Connector Configuration

| Connector | Source | Configuration Steps |
|-----------|--------|-------------------|
| Fabric Data Factory | Fabric pipelines | Automatically enabled when Fabric workspace is scanned with lineage option |
| Fabric Notebooks | Spark notebooks | Install OpenLineage Spark listener; configure Purview endpoint in notebook environment |
| Power BI | Semantic models + reports | Enabled via Power BI admin portal metadata scanning; lineage captured automatically |
| Azure Data Factory | ADF pipelines (if used) | Connect ADF to Purview via Purview account setting in ADF Studio |
| SAP S/4HANA | SAP table-to-pipeline | Limited automatic lineage; supplement with manual lineage documentation |
| Manual Lineage | Non-instrumented flows | Use Purview REST API (POST /lineage) to register manual lineage edges |

### OpenLineage Configuration for Fabric Notebooks

```python
# Add to notebook initialization cell for lineage capture
# Fabric Notebook: nb_bronze_to_silver_material_master

spark.conf.set("spark.openlineage.transport.type", "http")
spark.conf.set("spark.openlineage.transport.url", "https://purview-acme-prod.purview.azure.com/openlineage")
spark.conf.set("spark.openlineage.transport.auth.type", "azure_token")
spark.conf.set("spark.openlineage.namespace", "fabric-prod-data-engineering")
spark.conf.set("spark.openlineage.parentFacet.job.namespace", "fabric-prod-data-engineering")
spark.conf.set("spark.openlineage.parentFacet.job.name", "nb_bronze_to_silver_material_master")

# This enables automatic column-level lineage capture for Spark read/write operations
```

### Manual Lineage Registration (SAP Example)

For SAP data flows where automated lineage is not available, register lineage via the Purview REST API.

**API Call: Register SAP-to-Bronze Lineage**

```json
POST https://purview-acme-prod.purview.azure.com/catalog/api/atlas/v2/entity
Authorization: Bearer {token}
Content-Type: application/json

{
  "entity": {
    "typeName": "Process",
    "attributes": {
      "qualifiedName": "lineage://sap-material-master-to-bronze",
      "name": "SAP Material Master Extract (RFC)",
      "description": "Daily RFC extraction of SAP MARA/MARC/MAKT tables to Bronze lakehouse"
    },
    "relationshipAttributes": {
      "inputs": [
        {
          "typeName": "sap_s4hana_table",
          "uniqueAttributes": {
            "qualifiedName": "sap://acme-prod/100/MARA"
          }
        },
        {
          "typeName": "sap_s4hana_table",
          "uniqueAttributes": {
            "qualifiedName": "sap://acme-prod/100/MARC"
          }
        },
        {
          "typeName": "sap_s4hana_table",
          "uniqueAttributes": {
            "qualifiedName": "sap://acme-prod/100/MAKT"
          }
        }
      ],
      "outputs": [
        {
          "typeName": "azure_datalake_gen2_path",
          "uniqueAttributes": {
            "qualifiedName": "https://onelake.dfs.fabric.microsoft.com/prod-data-engineering/bronze_lakehouse/Tables/sap_master/material_master"
          }
        }
      ]
    }
  }
}
```

### Lineage Verification Checklist

| Lineage Path | Method | Verified |
|-------------|--------|----------|
| Fabric Pipeline -> Bronze Lakehouse tables | Automatic (Fabric connector) | Yes |
| Fabric Notebook -> Silver Lakehouse tables | OpenLineage (Spark listener) | Yes |
| Fabric Notebook -> Gold Lakehouse tables | OpenLineage (Spark listener) | Yes |
| Gold Lakehouse -> Semantic Models | Automatic (Power BI connector) | Yes |
| Semantic Models -> Power BI Reports | Automatic (Power BI connector) | Yes |
| SAP tables -> Bronze Lakehouse | Manual (Purview REST API) | Yes |
| Epicor tables -> Bronze Lakehouse | Manual (Purview REST API) | Yes |
| IoT Hub -> Eventstream -> Bronze | Manual (Purview REST API) | Yes |
| MES (Ignition) -> Bronze Lakehouse | Manual (Purview REST API) | Yes |

## Step 7: Configure Access Policies

### Purview Data Access Policies

| Policy Name | Scope | Action | Principals | Condition |
|-------------|-------|--------|------------|-----------|
| AllEmployees-ReadCatalog | Root collection | Read catalog metadata | All Employees group | None |
| FinanceStewards-CurateFinance | Production > Finance | Curate (edit metadata) | Finance Data Stewards group | Collection: Finance |
| OperationsStewards-CurateOps | Production > Operations | Curate (edit metadata) | Operations Data Stewards group | Collection: Operations |
| QualityStewards-CurateQuality | Production > Quality | Curate (edit metadata) | Quality Data Stewards group | Collection: Quality |
| DataEngineers-ManageSources | Fabric Workspaces | Source admin + scan | Data Engineering Team group | Collection: Fabric |
| ITARRestricted-NoExport | ITAR-classified assets | Deny export/download | Non-US-Persons group | Classification: ISL.ITAR.Controlled |
| Auditors-ReadAll | Root collection | Read all metadata + lineage | External Auditors group | Time-limited (quarterly) |
| GlossaryEditors-ManageTerms | Root collection glossary | Create/edit glossary terms | All Data Stewards group | None |

### Sensitivity Label Configuration

| Label | ISL-04 Tier | Visual Marking | Encryption | Access Restriction |
|-------|------------|---------------|------------|-------------------|
| Public | Tier 1 | "PUBLIC" watermark | No | None |
| Internal | Tier 2 | "INTERNAL" footer | No | Authenticated users only |
| Confidential | Tier 3 | "CONFIDENTIAL" header + footer | Yes (AIP) | Named groups only |
| Restricted — ITAR | Tier 4 | "ITAR RESTRICTED" header + footer + watermark | Yes (AIP, double-key) | US Persons only, full audit |
| Restricted — PII | Tier 3+ | "CONFIDENTIAL — PII" header | Yes (AIP) | Data owners + stewards + approved consumers |

## Post-Configuration Validation

### Validation Checklist

| # | Check | Expected Result | Status |
|---|-------|----------------|--------|
| 1 | All collections created per ISL-02 taxonomy | 25+ collections matching domain hierarchy | Pass |
| 2 | All data sources registered | 8 sources registered and tested | Pass |
| 3 | All scan schedules active | 6 scans scheduled (daily + weekly) | Pass |
| 4 | Initial scans completed successfully | All scans report "Completed" status | Pass |
| 5 | Assets discovered match expected counts | 275+ assets discovered across all sources | Pass |
| 6 | Classification rules applied correctly | Sample of 20 PII columns correctly classified | Pass |
| 7 | ITAR classifications applied | ITAR columns flagged in SAP and Bronze tables | Pass |
| 8 | Glossary terms imported | 480 terms imported across 7 domains | Pass |
| 9 | Glossary terms linked to assets | 38 Gold tables linked to relevant terms | Pass |
| 10 | Lineage visible for Fabric pipelines | End-to-end lineage from Bronze to Reports | Pass |
| 11 | Manual lineage registered for SAP/Epicor | SAP and Epicor source lineage visible | Pass |
| 12 | Access policies enforced | Non-ITAR users cannot view ITAR-classified metadata detail | Pass |
| 13 | Sensitivity labels applied to classified assets | Labels auto-applied based on classification | Pass |
| 14 | Search returns relevant results | Search for "material" returns relevant tables, terms, and reports | Pass |
| 15 | Catalog browsable by domain taxonomy | Domain-based navigation working in Purview portal | Pass |

## Ongoing Maintenance Schedule

| Activity | Frequency | Owner | Duration |
|----------|-----------|-------|----------|
| Monitor daily scan results | Daily | Data Engineering | 15 min |
| Review scan failures and remediate | As needed | Data Engineering | 30 min per failure |
| Enrich newly discovered assets | Weekly | Domain Stewards | 2-4 hours |
| Review and certify Gold zone assets | Quarterly | Domain Data Owners | 4-8 hours per domain |
| Refresh glossary terms | Quarterly | Domain Stewards | 2-4 hours per domain |
| Verify lineage accuracy | Quarterly | Data Engineering | 4 hours |
| Update classification rules | Semi-annually | Data Governance | 2 hours |
| Full Purview health check | Annually | Data Platform Team | 8 hours |
| Purview capacity and cost review | Quarterly | Platform Admin | 1 hour |

## Cross-References

| Document | Usage in This Example |
|----------|----------------------|
| ISL-02: Business Glossary Standards | Glossary import follows ISL-02 term template |
| ISL-02: Technical Metadata Schema | Scan captures ISL-02 standard attributes |
| ISL-02: Data Lineage Requirements | Lineage connectors configured per ISL-02 |
| ISL-02: Data Catalog Governance | Curation workflow applied post-scan |
| ISL-02: Metadata Integration Patterns | Purview connector patterns applied |
| ISL-02: Lineage Visualization Standards | Purview lineage view configured per ISL-02 |
| ISL-03: Naming Conventions | Collection and scan naming per ISL-03 |
| ISL-04: Data Classification | Classification rules mapped to ISL-04 tiers |
| ISL-06: Data Quality Framework | Quality scores linked to cataloged assets |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial example — Purview setup for Acme Manufacturing |

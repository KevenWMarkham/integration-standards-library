# Infrastructure Resource Naming Standards
> Module: ISL-03 | Version: 1.0 | Adaptation Effort: 1-2 hrs | Dependencies: ISL-03 Abbreviation Dictionary, ISL-04 Data Classification

## Purpose

This standard defines naming conventions for all infrastructure resources across Azure cloud services and Microsoft Fabric. Consistent infrastructure naming enables automated governance, simplifies cost allocation, accelerates incident response, and ensures that any engineer can identify a resource's purpose, owner, environment, and region from its name alone.

These conventions align with the Azure Cloud Adoption Framework (CAF) naming conventions and extend them with data-platform-specific patterns for Fabric workspaces, capacities, lakehouses, and related artifacts. Every resource provisioned — whether through the Azure portal, Bicep, Terraform, or CLI — must conform to these patterns.

**When to use this standard:**
- Provisioning any Azure resource (resource groups, storage accounts, key vaults, etc.)
- Creating Fabric workspaces, capacities, or artifacts
- Defining naming in infrastructure-as-code templates (Bicep, Terraform, ARM)
- Designing subscription and management group hierarchies
- Establishing tagging taxonomies for cost management and governance
- Reviewing or migrating existing infrastructure during platform modernization

**Key principles:**
- Azure resources use hyphen-delimited lowercase names following CAF prefixes
- Fabric resources use snake_case with underscore delimiters
- Storage accounts and container registries are alphanumeric only (Azure constraint)
- Every resource name encodes: resource type, workload, domain, environment, region, and instance
- Tags supplement names with metadata that cannot fit in the name itself

---

## Scope

### In Scope
- Azure resource naming patterns aligned to Cloud Adoption Framework
- Microsoft Fabric workspace, capacity, and artifact naming
- Resource group organization strategy
- Tag taxonomy and mandatory tag requirements
- Subscription and management group naming
- Network resource naming (VNets, subnets, NSGs, etc.)
- Naming validation via Azure Policy
- Storage account naming (special constraints)

### Out of Scope
- Azure resource configuration and sizing (see infrastructure architecture docs)
- Network topology and connectivity design (see network architecture docs)
- Identity and access management naming (see ISL-01 API Governance for service principals)
- Application code deployment naming (language-specific, not governed here)
- Third-party SaaS resource naming (vendor-controlled)

---

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default Value | Client Value | Notes |
|-----------|---------------|--------------|-------|
| Organization Code | `org` | `[CLIENT_ORG_CODE]` | 2-4 letter organization abbreviation |
| Primary Azure Region | `eus` (East US) | `[CLIENT_PRIMARY_REGION]` | See ISL-03 abbreviation dictionary for region codes |
| Secondary Azure Region | `wus2` (West US 2) | `[CLIENT_SECONDARY_REGION]` | DR/failover region |
| Environment Set | dev, tst, stg, prd, sbx, dr | `[CONFIRM_OR_OVERRIDE]` | Active environment abbreviations |
| Subscription Model | Single subscription per environment | `[SINGLE_OR_MULTI]` | Impacts subscription naming |
| Domain Set | mfg, fin, scm, qms, mnt, sal, shared | `[CONFIRM_OR_EXTEND]` | Business domains from ISL-03 dictionary |
| Fabric Capacity SKU | F64 | `[CLIENT_FABRIC_SKU]` | Impacts capacity naming |
| Tagging Authority | Data Governance Council | `[CLIENT_TAG_AUTHORITY]` | Who approves tag taxonomy changes |
| Cost Center Structure | Department-based | `[CLIENT_CC_STRUCTURE]` | Drives cost-center tag values |
| Data Classification Tiers | Public, Internal, Confidential, Restricted | `[CONFIRM_OR_OVERRIDE]` | From ISL-04 Data Classification |

---

## 1. Azure Resource Naming Pattern

### 1.1 General Pattern

```
{resource_type_prefix}-{workload}-{domain}-{env}-{region}-{instance}
```

| Segment | Description | Convention | Example |
|---------|-------------|-----------|---------|
| `{resource_type_prefix}` | CAF-aligned resource type abbreviation | Lowercase, from Section 3 table | `rg`, `kv`, `st`, `adf` |
| `{workload}` | Workload or application name | Lowercase, hyphen-delimited, 2-10 chars | `data`, `api`, `web`, `etl` |
| `{domain}` | Business domain abbreviation | From ISL-03 abbreviation dictionary | `mfg`, `fin`, `scm`, `shared` |
| `{env}` | Environment abbreviation | From ISL-03 abbreviation dictionary | `dev`, `tst`, `stg`, `prd` |
| `{region}` | Azure region abbreviation | From ISL-03 abbreviation dictionary | `eus`, `wus2`, `weu` |
| `{instance}` | Instance number | Three-digit zero-padded | `001`, `002`, `010` |

### 1.2 Segment Rules

| Rule | Specification |
|------|--------------|
| Delimiter | Hyphen (`-`) for Azure resources; underscore (`_`) for Fabric resources |
| Case | All lowercase |
| Maximum length | Varies by resource type (see Section 3 for constraints) |
| Instance numbering | Start at `001`; increment for additional instances of the same type/scope |
| Omit optional segments | If a segment is not applicable, omit it entirely (do not use placeholder) |
| No trailing hyphens | Name must not end with a hyphen or underscore |

---

## 2. Microsoft Fabric Resource Naming

### 2.1 Fabric Workspace Naming

```
ws_{domain}_{purpose}_{env}
```

| Segment | Description | Example Values |
|---------|-------------|---------------|
| `ws_` | Fixed prefix for workspace | Always `ws_` |
| `{domain}` | Business domain abbreviation | `mfg`, `fin`, `scm`, `shared`, `analytics` |
| `{purpose}` | Workspace purpose or function | `bronze`, `silver`, `gold`, `sandbox`, `ml`, `reporting` |
| `{env}` | Environment abbreviation | `dev`, `tst`, `stg`, `prd`, `sbx` |

### 2.2 Fabric Workspace Examples

| Workspace Name | Domain | Purpose | Environment | Description |
|---------------|--------|---------|-------------|-------------|
| `ws_mfg_bronze_prd` | Manufacturing | Bronze ingestion | Production | Raw manufacturing data ingestion |
| `ws_mfg_silver_prd` | Manufacturing | Silver cleansing | Production | Cleansed manufacturing data |
| `ws_mfg_gold_prd` | Manufacturing | Gold business-ready | Production | Business-ready manufacturing analytics |
| `ws_mfg_sandbox_dev` | Manufacturing | Sandbox exploration | Development | Developer experimentation |
| `ws_fin_bronze_prd` | Finance | Bronze ingestion | Production | Raw financial data ingestion |
| `ws_fin_gold_prd` | Finance | Gold business-ready | Production | Business-ready financial analytics |
| `ws_scm_silver_prd` | Supply Chain | Silver cleansing | Production | Cleansed supply chain data |
| `ws_shared_reference_prd` | Shared | Reference data | Production | Cross-domain reference/master data |
| `ws_analytics_reporting_prd` | Analytics | Reporting | Production | Cross-domain reporting workspace |
| `ws_analytics_ml_prd` | Analytics | Machine learning | Production | ML model development and serving |
| `ws_shared_governance_prd` | Shared | Governance | Production | Data quality, lineage, catalog |
| `ws_mfg_bronze_dev` | Manufacturing | Bronze ingestion | Development | Dev environment for manufacturing bronze |
| `ws_mfg_silver_tst` | Manufacturing | Silver cleansing | Test | Test environment for silver transforms |

### 2.3 Fabric Capacity Naming

```
cap_{org}_{tier}_{env}_{region}
```

| Capacity Name | Description |
|--------------|-------------|
| `cap_org_f64_prd_eus` | Production F64 capacity, East US |
| `cap_org_f32_dev_eus` | Development F32 capacity, East US |
| `cap_org_f16_tst_eus` | Test F16 capacity, East US |
| `cap_org_f64_prd_wus2` | Production F64 capacity, West US 2 (DR) |
| `cap_org_f8_sbx_eus` | Sandbox F8 capacity, East US |

### 2.4 Fabric Artifact Naming

| Artifact | Prefix | Pattern | Example |
|----------|--------|---------|---------|
| Lakehouse | `lh_` | `lh_{domain}_{layer}_{env}` | `lh_mfg_bronze_prd` |
| Warehouse | `wh_` | `wh_{domain}_{purpose}_{env}` | `wh_mfg_serving_prd` |
| Pipeline | `pl_` | `pl_{source}_{layer}_{frequency}_{version}` | `pl_sap_bronze_daily_v1` |
| Notebook | `nb_` | `nb_{domain}_{purpose}_{qualifier}` | `nb_mfg_transform_silver` |
| Dataflow | `df_` | `df_{domain}_{purpose}_{qualifier}` | `df_mfg_cleanse_silver` |
| Semantic Model | `sm_` | `sm_{domain}_{subject}_{version}` | `sm_mfg_operations_v1` |
| Report | `rpt_` | `rpt_{domain}_{subject}_{qualifier}` | `rpt_mfg_production_daily` |
| Eventstream | `es_` | `es_{source}_{purpose}_{layer}` | `es_iot_telemetry_bronze` |
| KQL Database | `kql_` | `kql_{domain}_{purpose}_{env}` | `kql_iot_realtime_prd` |
| Spark Environment | `ev_` | `ev_{domain}_{runtime}_{env}` | `ev_mfg_spark_prd` |
| ML Model | `ml_` | `ml_{domain}_{purpose}_{version}` | `ml_mfg_quality_predict_v1` |
| Data Activator Reflex | `rx_` | `rx_{domain}_{trigger}_{qualifier}` | `rx_mfg_threshold_alert` |

---

## 3. Azure Resource Type Prefix Table

### 3.1 Compute Resources

| Prefix | Resource Type | Max Length | Special Constraints | Example |
|--------|--------------|-----------|-------------------|---------|
| `vm` | Virtual Machine | 64 | Alphanumeric, hyphens | `vm-data-mfg-prd-eus-001` |
| `vmss` | VM Scale Set | 64 | Alphanumeric, hyphens | `vmss-data-mfg-prd-eus-001` |
| `aks` | AKS Cluster | 63 | Alphanumeric, hyphens | `aks-data-mfg-prd-eus-001` |
| `func` | Function App | 60 | Alphanumeric, hyphens | `func-api-mfg-prd-eus-001` |
| `app` | App Service | 60 | Alphanumeric, hyphens | `app-web-mfg-prd-eus-001` |
| `asp` | App Service Plan | 40 | Alphanumeric, hyphens | `asp-data-mfg-prd-eus-001` |
| `cr` | Container Registry | 50 | **Alphanumeric only, no hyphens** | `crdatamfgprdeus001` |
| `ci` | Container Instance | 63 | Alphanumeric, hyphens | `ci-etl-mfg-prd-eus-001` |

### 3.2 Data & Analytics Resources

| Prefix | Resource Type | Max Length | Special Constraints | Example |
|--------|--------------|-----------|-------------------|---------|
| `st` | Storage Account | 24 | **Alphanumeric only, no hyphens, 3-24 chars** | `stdatamfgprdeus001` |
| `adf` | Data Factory | 63 | Alphanumeric, hyphens, start with letter | `adf-data-mfg-prd-eus-001` |
| `sqldb` | Azure SQL Database | 128 | Alphanumeric, hyphens | `sqldb-erp-mfg-prd-eus-001` |
| `sqls` | Azure SQL Server | 63 | Lowercase alphanumeric, hyphens | `sqls-data-mfg-prd-eus-001` |
| `syndp` | Synapse Dedicated Pool | 60 | Alphanumeric, hyphens | `syndp-edw-mfg-prd-eus-001` |
| `synsp` | Synapse Spark Pool | 15 | **Alphanumeric only, start with letter** | `synspmfgprd001` |
| `synw` | Synapse Workspace | 50 | Lowercase alphanumeric, hyphens | `synw-data-mfg-prd-eus-001` |
| `cosmos` | Cosmos DB Account | 44 | Lowercase alphanumeric, hyphens | `cosmos-data-mfg-prd-eus-001` |
| `redis` | Azure Cache for Redis | 63 | Alphanumeric, hyphens | `redis-cache-mfg-prd-eus-001` |
| `srch` | Azure Cognitive Search | 60 | Lowercase alphanumeric, hyphens | `srch-data-mfg-prd-eus-001` |
| `dbw` | Databricks Workspace | 64 | Alphanumeric, hyphens | `dbw-data-mfg-prd-eus-001` |
| `adx` | Azure Data Explorer | 22 | Lowercase alphanumeric | `adxdatamfgprdeus001` |

### 3.3 Integration Resources

| Prefix | Resource Type | Max Length | Special Constraints | Example |
|--------|--------------|-----------|-------------------|---------|
| `apim` | API Management | 50 | Alphanumeric, hyphens | `apim-data-mfg-prd-eus-001` |
| `evh` | Event Hub | 256 | Alphanumeric, hyphens, periods | `evh-mfg-work-order-prd` |
| `evhns` | Event Hub Namespace | 50 | Alphanumeric, hyphens | `evhns-data-mfg-prd-eus-001` |
| `sb` | Service Bus Queue/Topic | 260 | Alphanumeric, hyphens, periods | `sb-integ-mfg-prd-eus-001` |
| `sbns` | Service Bus Namespace | 50 | Alphanumeric, hyphens | `sbns-integ-mfg-prd-eus-001` |
| `logic` | Logic App | 80 | Alphanumeric, hyphens | `logic-integ-mfg-prd-eus-001` |
| `egt` | Event Grid Topic | 50 | Alphanumeric, hyphens | `egt-mfg-events-prd-eus-001` |
| `egs` | Event Grid Subscription | 64 | Alphanumeric, hyphens | `egs-lakehouse-ingest-001` |

### 3.4 Security & Monitoring Resources

| Prefix | Resource Type | Max Length | Special Constraints | Example |
|--------|--------------|-----------|-------------------|---------|
| `kv` | Key Vault | 24 | Alphanumeric, hyphens, 3-24 chars | `kv-data-mfg-prd-eus-001` |
| `id` | Managed Identity | 128 | Alphanumeric, hyphens | `id-data-mfg-prd-eus-001` |
| `log` | Log Analytics Workspace | 63 | Alphanumeric, hyphens | `log-data-mfg-prd-eus-001` |
| `appi` | Application Insights | 260 | Alphanumeric, hyphens | `appi-data-mfg-prd-eus-001` |
| `ag` | Action Group | 12 | Alphanumeric only | `agdatamfgprd` |
| `alert` | Alert Rule | 260 | Alphanumeric, hyphens | `alert-cpu-high-mfg-prd-001` |

### 3.5 Network Resources

| Prefix | Resource Type | Max Length | Special Constraints | Example |
|--------|--------------|-----------|-------------------|---------|
| `vnet` | Virtual Network | 64 | Alphanumeric, hyphens | `vnet-data-mfg-prd-eus-001` |
| `snet` | Subnet | 80 | Alphanumeric, hyphens | `snet-data-mfg-prd-eus-001` |
| `nsg` | Network Security Group | 80 | Alphanumeric, hyphens | `nsg-data-mfg-prd-eus-001` |
| `pip` | Public IP Address | 80 | Alphanumeric, hyphens | `pip-apim-mfg-prd-eus-001` |
| `nic` | Network Interface | 80 | Alphanumeric, hyphens | `nic-vm-mfg-prd-eus-001` |
| `lb` | Load Balancer | 80 | Alphanumeric, hyphens | `lb-web-mfg-prd-eus-001` |
| `afw` | Azure Firewall | 80 | Alphanumeric, hyphens | `afw-hub-prd-eus-001` |
| `afd` | Azure Front Door | 64 | Alphanumeric, hyphens | `afd-web-mfg-prd-001` |
| `agw` | Application Gateway | 80 | Alphanumeric, hyphens | `agw-api-mfg-prd-eus-001` |
| `rt` | Route Table | 80 | Alphanumeric, hyphens | `rt-data-mfg-prd-eus-001` |
| `pe` | Private Endpoint | 64 | Alphanumeric, hyphens | `pe-st-mfg-prd-eus-001` |
| `pls` | Private Link Service | 80 | Alphanumeric, hyphens | `pls-api-mfg-prd-eus-001` |
| `dnsz` | Private DNS Zone | 63 | Alphanumeric, hyphens, periods | `privatelink.blob.core.windows.net` |
| `bas` | Bastion | 80 | Alphanumeric, hyphens | `bas-hub-prd-eus-001` |

---

## 4. Resource Group Naming and Organization

### 4.1 Resource Group Naming Pattern

```
rg-{workload}-{domain}-{env}-{region}-{instance}
```

### 4.2 Resource Group Organization Strategy

| Strategy | Pattern | When to Use |
|----------|---------|-------------|
| By workload + environment | `rg-data-mfg-prd-eus-001` | Default: group resources by workload and environment |
| By resource lifecycle | `rg-network-hub-prd-eus-001` | Shared infrastructure with different lifecycle |
| By team ownership | `rg-team-analytics-prd-eus-001` | When team boundaries drive resource grouping |

### 4.3 Resource Group Examples

| Resource Group Name | Contents | Owner |
|--------------------|----------|-------|
| `rg-data-mfg-prd-eus-001` | Manufacturing data platform (ADF, storage, SQL) | Data Engineering |
| `rg-data-mfg-dev-eus-001` | Manufacturing data platform (development) | Data Engineering |
| `rg-data-fin-prd-eus-001` | Finance data platform resources | Data Engineering |
| `rg-data-shared-prd-eus-001` | Shared data services (Key Vault, Log Analytics) | Platform Team |
| `rg-fabric-mfg-prd-eus-001` | Fabric capacity and gateway resources for manufacturing | Data Engineering |
| `rg-network-hub-prd-eus-001` | Hub networking (VNet, Firewall, Bastion) | Network Team |
| `rg-network-spoke-data-prd-eus-001` | Data platform spoke networking | Network Team |
| `rg-apim-shared-prd-eus-001` | API Management shared instance | Integration Team |
| `rg-monitor-shared-prd-eus-001` | Monitoring (Log Analytics, App Insights, alerts) | Platform Team |
| `rg-security-shared-prd-eus-001` | Security resources (Key Vaults, managed identities) | Security Team |
| `rg-data-mfg-prd-wus2-001` | Manufacturing DR resources (secondary region) | Data Engineering |

---

## 5. Subscription and Management Group Naming

### 5.1 Management Group Naming

```
mg-{org}-{purpose}
```

| Management Group | Purpose | Description |
|-----------------|---------|-------------|
| `mg-org-root` | Tenant root | Top-level management group |
| `mg-org-platform` | Platform services | Shared infrastructure, networking, security |
| `mg-org-landing-zones` | Application landing zones | Workload subscriptions |
| `mg-org-sandbox` | Sandbox | Isolated experimentation subscriptions |
| `mg-org-decommissioned` | Decommissioned | Subscriptions being retired |

### 5.2 Subscription Naming

```
sub-{org}-{workload}-{env}
```

| Subscription Name | Environment | Contents |
|------------------|-------------|----------|
| `sub-org-data-prd` | Production | All production data platform resources |
| `sub-org-data-dev` | Development | Development data platform resources |
| `sub-org-data-tst` | Test | Test/QA data platform resources |
| `sub-org-platform-prd` | Production | Shared platform services (networking, monitoring) |
| `sub-org-sandbox` | Sandbox | Developer experimentation (budget-capped) |
| `sub-org-connectivity` | Shared | Hub networking, DNS, ExpressRoute |
| `sub-org-identity` | Shared | Azure AD, managed identities |

---

## 6. Tag Taxonomy

### 6.1 Mandatory Tags

Every Azure resource must have the following tags. Resources without mandatory tags will be flagged by Azure Policy (see Section 9).

| Tag Key | Purpose | Allowed Values | Example |
|---------|---------|---------------|---------|
| `environment` | Deployment environment | `dev`, `tst`, `stg`, `prd`, `sbx`, `dr` | `prd` |
| `domain` | Business domain | ISL-03 domain abbreviations | `mfg` |
| `owner` | Team or individual responsible | Email address or team alias | `data-engineering@contoso.com` |
| `cost-center` | Financial cost allocation | Client cost center codes | `CC-4500-MFG` |
| `data-classification` | Data sensitivity level | `public`, `internal`, `confidential`, `restricted` | `confidential` |
| `project` | Project or initiative code | Client project codes | `PRJ-2025-DATA-PLATFORM` |
| `created-by` | Provisioning method | `manual`, `bicep`, `terraform`, `pipeline` | `bicep` |
| `created-date` | Resource creation date | ISO 8601 date | `2025-01-15` |

### 6.2 Recommended Tags

| Tag Key | Purpose | Example |
|---------|---------|---------|
| `application` | Application or workload name | `data-platform` |
| `tier` | Service tier (frontend, backend, data) | `data` |
| `sla` | Service level agreement tier | `99.9`, `99.99` |
| `backup-policy` | Backup schedule identifier | `daily-30d`, `weekly-52w` |
| `auto-shutdown` | Scheduled shutdown (dev/test) | `true` |
| `shutdown-time` | Auto-shutdown time (UTC) | `19:00` |
| `disaster-recovery` | DR tier | `active-active`, `active-passive`, `backup-only` |
| `compliance` | Compliance requirement | `sox`, `hipaa`, `itar`, `gdpr` |
| `maintenance-window` | Preferred maintenance window | `sun-02:00-06:00-utc` |

### 6.3 Tag Naming Rules

| Rule | Specification |
|------|--------------|
| Key case | Lowercase with hyphens (kebab-case) |
| Value case | Lowercase where possible |
| Maximum key length | 512 characters (Azure limit) |
| Maximum value length | 256 characters (Azure limit) |
| Maximum tags per resource | 50 (Azure limit) |
| No special characters in keys | Letters, digits, hyphens, underscores only |
| Prohibited tag keys | Do not use `name`, `type`, `location` (Azure reserved) |

---

## 7. Storage Account Naming (Special Constraints)

Azure Storage accounts have the most restrictive naming rules in Azure. They require special handling.

### 7.1 Storage Account Constraints

| Constraint | Specification |
|-----------|--------------|
| Allowed characters | **Lowercase letters and digits only** (no hyphens, no underscores) |
| Length | 3-24 characters |
| Global uniqueness | Name must be globally unique across all of Azure |
| Starting character | Must start with a letter |

### 7.2 Storage Account Naming Pattern

```
st{workload}{domain}{env}{region}{instance}
```

**Note:** Because hyphens are not allowed, all segments are concatenated without delimiters. Keep segment abbreviations as short as possible to fit within 24 characters.

### 7.3 Storage Account Examples

| Storage Account Name | Length | Workload | Domain | Env | Region | Instance |
|---------------------|--------|----------|--------|-----|--------|----------|
| `stdatamfgprdeus001` | 19 | data | mfg | prd | eus | 001 |
| `stdatamfgdeveus001` | 19 | data | mfg | dev | eus | 001 |
| `stdatafinprdeus001` | 19 | data | fin | prd | eus | 001 |
| `stdatascmprdeus001` | 19 | data | scm | prd | eus | 001 |
| `stdatashrdprdeus001` | 20 | data | shrd | prd | eus | 001 |
| `stetlmfgprdeus001` | 18 | etl | mfg | prd | eus | 001 |
| `stbkpmfgprdeus001` | 18 | bkp | mfg | prd | eus | 001 |
| `stdlmfgprdeus001` | 17 | dl (data lake) | mfg | prd | eus | 001 |
| `stdatamfgprdwus2001` | 20 | data | mfg | prd | wus2 | 001 |

### 7.4 Storage Container Naming

Storage containers within a storage account follow a more relaxed pattern (hyphens allowed, 3-63 chars):

```
{purpose}-{domain}-{qualifier}
```

| Container Name | Purpose | Description |
|---------------|---------|-------------|
| `raw-mfg-sap` | Raw ingestion | Raw SAP manufacturing data |
| `raw-mfg-epicor` | Raw ingestion | Raw Epicor manufacturing data |
| `raw-fin-sap` | Raw ingestion | Raw SAP financial data |
| `curated-mfg-silver` | Curated data | Silver-layer manufacturing data |
| `curated-mfg-gold` | Curated data | Gold-layer manufacturing data |
| `archive-mfg-2024` | Archive | Archived manufacturing data from 2024 |
| `config-pipeline` | Configuration | Pipeline configuration files |
| `logs-adf` | Logging | Data Factory diagnostic logs |
| `backup-sql-daily` | Backup | Daily SQL backup exports |

---

## 8. Network Resource Naming Examples

### 8.1 Hub-Spoke Network Topology

| Resource | Name | Description |
|----------|------|-------------|
| Hub VNet | `vnet-hub-prd-eus-001` | Central hub virtual network |
| Hub Firewall | `afw-hub-prd-eus-001` | Azure Firewall in hub |
| Hub Bastion | `bas-hub-prd-eus-001` | Azure Bastion for secure access |
| Hub Route Table | `rt-hub-default-prd-eus-001` | Default route table in hub |
| Data Spoke VNet | `vnet-spoke-data-prd-eus-001` | Data platform spoke VNet |
| Data Subnet - Default | `snet-data-default-prd-eus-001` | Default subnet for data services |
| Data Subnet - Private Endpoints | `snet-data-pe-prd-eus-001` | Subnet for private endpoints |
| Data Subnet - Integration | `snet-data-integ-prd-eus-001` | Subnet for integration runtimes |
| Data NSG | `nsg-data-default-prd-eus-001` | NSG for data subnet |
| PE NSG | `nsg-data-pe-prd-eus-001` | NSG for private endpoint subnet |
| Data Spoke Route Table | `rt-spoke-data-prd-eus-001` | Route table for data spoke |

### 8.2 Private Endpoint Naming

```
pe-{target_resource_type}-{target_name_short}-{instance}
```

| Private Endpoint | Target Resource | Description |
|-----------------|----------------|-------------|
| `pe-st-datamfgprd-001` | `stdatamfgprdeus001` | PE for manufacturing storage account |
| `pe-kv-datamfgprd-001` | `kv-data-mfg-prd-eus-001` | PE for manufacturing key vault |
| `pe-sql-datamfgprd-001` | `sqls-data-mfg-prd-eus-001` | PE for manufacturing SQL server |
| `pe-evhns-datamfgprd-001` | `evhns-data-mfg-prd-eus-001` | PE for Event Hub namespace |
| `pe-sbns-integmfgprd-001` | `sbns-integ-mfg-prd-eus-001` | PE for Service Bus namespace |

---

## 9. Naming Validation with Azure Policy

### 9.1 Resource Name Pattern Enforcement

```json
{
  "properties": {
    "displayName": "Enforce resource naming convention",
    "description": "Requires resources to follow the ISL-03 naming convention pattern",
    "mode": "All",
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.Resources/subscriptions/resourceGroups"
          },
          {
            "not": {
              "field": "name",
              "match": "rg-???*-???-???-???-###"
            }
          }
        ]
      },
      "then": {
        "effect": "deny"
      }
    }
  }
}
```

### 9.2 Mandatory Tag Enforcement

```json
{
  "properties": {
    "displayName": "Require mandatory tags on resource groups",
    "description": "Enforces the ISL-03 mandatory tag taxonomy on all resource groups",
    "mode": "All",
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.Resources/subscriptions/resourceGroups"
          },
          {
            "anyOf": [
              { "field": "tags['environment']", "exists": "false" },
              { "field": "tags['domain']", "exists": "false" },
              { "field": "tags['owner']", "exists": "false" },
              { "field": "tags['cost-center']", "exists": "false" },
              { "field": "tags['data-classification']", "exists": "false" }
            ]
          }
        ]
      },
      "then": {
        "effect": "deny"
      }
    }
  }
}
```

### 9.3 Tag Value Enforcement

```json
{
  "properties": {
    "displayName": "Enforce valid environment tag values",
    "description": "Restricts environment tag to approved ISL-03 environment abbreviations",
    "mode": "All",
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "tags['environment']",
            "exists": "true"
          },
          {
            "not": {
              "field": "tags['environment']",
              "in": ["dev", "tst", "stg", "prd", "sbx", "dr"]
            }
          }
        ]
      },
      "then": {
        "effect": "deny"
      }
    }
  }
}
```

### 9.4 Storage Account Name Enforcement

```json
{
  "properties": {
    "displayName": "Enforce storage account naming convention",
    "description": "Requires storage accounts to start with 'st' prefix per ISL-03",
    "mode": "All",
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.Storage/storageAccounts"
          },
          {
            "not": {
              "field": "name",
              "like": "st*"
            }
          }
        ]
      },
      "then": {
        "effect": "deny"
      }
    }
  }
}
```

---

## 10. Concrete Infrastructure Naming Examples

### 10.1 Complete Manufacturing Data Platform

| Resource Type | Resource Name | Description |
|--------------|--------------|-------------|
| Resource Group | `rg-data-mfg-prd-eus-001` | Manufacturing data platform resource group |
| Storage Account | `stdatamfgprdeus001` | Primary data lake storage |
| Storage Account (ETL) | `stetlmfgprdeus001` | ETL staging storage |
| Key Vault | `kv-data-mfg-prd-eus-001` | Secrets and connection strings |
| Data Factory | `adf-data-mfg-prd-eus-001` | Data orchestration and ingestion |
| SQL Server | `sqls-data-mfg-prd-eus-001` | Azure SQL logical server |
| SQL Database | `sqldb-erp-mfg-prd-eus-001` | ERP staging database |
| Event Hub Namespace | `evhns-data-mfg-prd-eus-001` | Event streaming namespace |
| Event Hub | `evh-mfg-work-order-prd` | Work order event stream |
| Event Hub | `evh-iot-sensor-data-prd` | IoT sensor telemetry stream |
| Service Bus Namespace | `sbns-integ-mfg-prd-eus-001` | Integration messaging namespace |
| Log Analytics | `log-data-mfg-prd-eus-001` | Centralized logging |
| Application Insights | `appi-data-mfg-prd-eus-001` | Application performance monitoring |
| API Management | `apim-data-mfg-prd-eus-001` | API gateway |
| Function App | `func-api-mfg-prd-eus-001` | API backend functions |
| Managed Identity | `id-data-mfg-prd-eus-001` | Platform managed identity |
| VNet (spoke) | `vnet-spoke-data-prd-eus-001` | Data platform spoke network |
| Subnet (default) | `snet-data-default-prd-eus-001` | Default data subnet |
| Subnet (PE) | `snet-data-pe-prd-eus-001` | Private endpoint subnet |
| NSG | `nsg-data-default-prd-eus-001` | Network security group |

### 10.2 Complete Fabric Environment

| Artifact Type | Name | Description |
|--------------|------|-------------|
| Capacity | `cap_org_f64_prd_eus` | Production Fabric capacity |
| Workspace | `ws_mfg_bronze_prd` | Bronze ingestion workspace |
| Workspace | `ws_mfg_silver_prd` | Silver cleansing workspace |
| Workspace | `ws_mfg_gold_prd` | Gold analytics workspace |
| Workspace | `ws_shared_governance_prd` | Data governance workspace |
| Lakehouse | `lh_mfg_bronze_prd` | Bronze lakehouse |
| Lakehouse | `lh_mfg_silver_prd` | Silver lakehouse |
| Lakehouse | `lh_mfg_gold_prd` | Gold lakehouse |
| Warehouse | `wh_mfg_serving_prd` | Dimensional model warehouse |
| Pipeline | `pl_sap_bronze_daily_v1` | SAP daily bronze ingestion |
| Pipeline | `pl_epicor_bronze_daily_v1` | Epicor daily bronze ingestion |
| Pipeline | `pl_iot_bronze_streaming_v1` | IoT real-time bronze ingestion |
| Pipeline | `pl_mfg_silver_daily_v1` | Manufacturing silver transformation |
| Pipeline | `pl_mfg_gold_daily_v1` | Manufacturing gold aggregation |
| Notebook | `nb_mfg_transform_silver` | Silver transformation notebook |
| Notebook | `nb_mfg_oee_calculation` | OEE metric calculation notebook |
| Dataflow | `df_mfg_cleanse_silver` | Manufacturing data cleansing |
| Semantic Model | `sm_mfg_operations_v1` | Manufacturing operations model |
| Report | `rpt_mfg_production_daily` | Daily production report |
| Report | `rpt_mfg_oee_dashboard` | OEE dashboard |
| Eventstream | `es_iot_telemetry_bronze` | IoT telemetry ingestion stream |
| KQL Database | `kql_iot_realtime_prd` | Real-time IoT analytics |

---

## 11. Anti-Patterns and Prohibited Patterns

| Anti-Pattern | Example (Wrong) | Why It Is Wrong | Correct Alternative |
|-------------|----------------|-----------------|-------------------|
| No resource type prefix | `manufacturing-data-prd` | Cannot identify resource type at a glance | `rg-data-mfg-prd-eus-001` |
| PascalCase resource names | `RG-Data-Mfg-Prd` | Azure names should be lowercase | `rg-data-mfg-prd-eus-001` |
| Underscores in Azure names | `rg_data_mfg_prd` | Azure CAF uses hyphens, not underscores | `rg-data-mfg-prd-eus-001` |
| Hyphens in Fabric names | `ws-mfg-bronze-prd` | Fabric uses snake_case with underscores | `ws_mfg_bronze_prd` |
| Hyphens in storage accounts | `st-data-mfg-prd` | Storage accounts prohibit hyphens | `stdatamfgprdeus001` |
| Missing environment segment | `rg-data-mfg-eus-001` | Cannot distinguish dev from prd | `rg-data-mfg-prd-eus-001` |
| Missing region segment | `rg-data-mfg-prd-001` | Cannot identify region for DR | `rg-data-mfg-prd-eus-001` |
| Full words instead of abbreviations | `rg-data-manufacturing-production-eastus-001` | Too long, exceeds limits | `rg-data-mfg-prd-eus-001` |
| Cryptic abbreviations | `rg-d-m-p-e-1` | Not self-documenting | `rg-data-mfg-prd-eus-001` |
| Team names in resources | `rg-johns-team-stuff` | Not durable; team names change | `rg-data-mfg-dev-eus-001` |
| Date stamps in names | `rg-data-mfg-20250115` | Does not encode environment or region | `rg-data-mfg-prd-eus-001` |
| No instance number | `rg-data-mfg-prd-eus` | Cannot accommodate multiple instances | `rg-data-mfg-prd-eus-001` |
| Mixed casing in tags | `Environment`, `DOMAIN`, `Owner` | Tags should be lowercase kebab-case | `environment`, `domain`, `owner` |
| Missing mandatory tags | (no tags on resource) | Blocks cost allocation and governance | Apply all 8 mandatory tags |
| Generic workspace names | `ws_test`, `ws_my_workspace` | Not self-documenting | `ws_mfg_bronze_dev` |
| Environment in wrong position | `prd_ws_mfg_bronze` | Environment must be the final segment for Fabric | `ws_mfg_bronze_prd` |
| Exceeding storage name length | `stdatamanufacturingproduction001` (33 chars) | Storage accounts max 24 chars | `stdatamfgprdeus001` (19 chars) |

---

## Fabric / Azure Implementation Guidance

### Infrastructure-as-Code Naming Validation

#### Bicep Naming Validation

```bicep
@description('Environment abbreviation')
@allowed(['dev', 'tst', 'stg', 'prd', 'sbx', 'dr'])
param environment string

@description('Business domain abbreviation')
@allowed(['mfg', 'fin', 'scm', 'qms', 'mnt', 'sal', 'hcm', 'shared'])
param domain string

@description('Azure region abbreviation')
@allowed(['eus', 'eus2', 'wus', 'wus2', 'cus', 'weu', 'neu'])
param region string

@description('Instance number')
@minValue(1)
@maxValue(999)
param instance int = 1

var instanceFormatted = padLeft(string(instance), 3, '0')
var resourceGroupName = 'rg-data-${domain}-${environment}-${region}-${instanceFormatted}'
var storageAccountName = 'stdata${domain}${environment}${region}${instanceFormatted}'
var keyVaultName = 'kv-data-${domain}-${environment}-${region}-${instanceFormatted}'
```

#### Terraform Naming Module

```hcl
variable "environment" {
  type        = string
  description = "Environment abbreviation"
  validation {
    condition     = contains(["dev", "tst", "stg", "prd", "sbx", "dr"], var.environment)
    error_message = "Environment must be one of: dev, tst, stg, prd, sbx, dr."
  }
}

variable "domain" {
  type        = string
  description = "Business domain abbreviation"
  validation {
    condition     = contains(["mfg", "fin", "scm", "qms", "mnt", "sal", "hcm", "shared"], var.domain)
    error_message = "Domain must be a valid ISL-03 domain abbreviation."
  }
}

locals {
  resource_group_name  = "rg-data-${var.domain}-${var.environment}-${var.region}-${format("%03d", var.instance)}"
  storage_account_name = "stdata${var.domain}${var.environment}${var.region}${format("%03d", var.instance)}"
  key_vault_name       = "kv-data-${var.domain}-${var.environment}-${var.region}-${format("%03d", var.instance)}"
}
```

### Fabric REST API Workspace Validation

```python
import re

VALID_DOMAINS = ['mfg', 'fin', 'scm', 'qms', 'mnt', 'sal', 'hcm', 'iot', 'shared', 'analytics']
VALID_ENVS = ['dev', 'tst', 'stg', 'prd', 'sbx', 'dr']
VALID_WS_PURPOSES = ['bronze', 'silver', 'gold', 'sandbox', 'ml', 'reporting', 'governance', 'reference']

FABRIC_WS_PATTERN = re.compile(r'^ws_[a-z]+_[a-z]+_[a-z]+$')

def validate_workspace_name(name: str) -> tuple[bool, str]:
    """Validate a Fabric workspace name against ISL-03 naming conventions."""
    if not FABRIC_WS_PATTERN.match(name):
        return False, f"Workspace name '{name}' does not match pattern ws_{{domain}}_{{purpose}}_{{env}}"

    parts = name.split('_')
    if len(parts) != 4:
        return False, f"Expected 4 segments (ws, domain, purpose, env), got {len(parts)}"

    _, domain, purpose, env = parts

    if domain not in VALID_DOMAINS:
        return False, f"Domain '{domain}' not in approved list: {VALID_DOMAINS}"

    if purpose not in VALID_WS_PURPOSES:
        return False, f"Purpose '{purpose}' not in approved list: {VALID_WS_PURPOSES}"

    if env not in VALID_ENVS:
        return False, f"Environment '{env}' not in approved list: {VALID_ENVS}"

    return True, "Valid"
```

---

## Manufacturing Overlay

### Manufacturing-Specific Infrastructure

| Resource | Name | Purpose |
|----------|------|---------|
| IoT Hub | `iot-mfg-prd-eus-001` | Shop floor device management |
| Event Hub (IoT) | `evh-iot-sensor-telemetry-prd` | High-throughput sensor telemetry |
| Event Hub (SCADA) | `evh-iot-scada-events-prd` | SCADA alarm and event streaming |
| Stream Analytics | `asa-iot-mfg-prd-eus-001` | Real-time sensor data processing |
| Time Series Insights | `tsi-iot-mfg-prd-eus-001` | Time-series data exploration |
| Digital Twins | `dt-mfg-prd-eus-001` | Factory digital twin |
| Storage (IoT) | `stiotmfgprdeus001` | IoT telemetry cold storage |

### ITAR/Export Control Infrastructure

For regulated manufacturing environments, infrastructure naming includes compliance indicators in tags (not in resource names):

| Tag Key | Purpose | Example Value |
|---------|---------|--------------|
| `compliance` | Regulatory compliance requirement | `itar`, `ear`, `cmmc` |
| `data-sovereignty` | Data residency requirement | `us-only`, `eu-only` |
| `encryption-required` | Encryption mandate | `at-rest-and-in-transit` |
| `access-restriction` | Access control requirement | `us-persons-only` |

**Rule:** Compliance designations appear in resource tags, not in resource names. This prevents leaking security posture through naming.

---

## Cross-References

| Reference | Module | Relevance |
|-----------|--------|-----------|
| Abbreviation Dictionary | ISL-03 `templates/abbreviation-dictionary.md` | Domain, environment, region, and resource type abbreviations |
| Database & Schema Naming | ISL-03 `templates/database-schema-naming.md` | Database names that map to Azure SQL/Fabric resources |
| Table & View Naming | ISL-03 `templates/table-view-naming.md` | Table naming within lakehouses and warehouses |
| API & Endpoint Naming | ISL-03 `templates/api-endpoint-naming.md` | API naming for APIM, Function Apps, Event Hubs |
| Pipeline & Dataflow Naming | ISL-03 `templates/pipeline-dataflow-naming.md` | Pipeline artifact naming within Fabric workspaces |
| Data Classification | ISL-04 `templates/classification-tier-definitions.md` | Classification tiers used in resource tagging |
| Integration Patterns | ISL-05 `templates/pattern-catalog.md` | Infrastructure patterns for integration workloads |
| Azure Cloud Adoption Framework | Microsoft CAF | Foundational reference for Azure resource naming |

---

## Compliance Alignment

| Standard | Relevance | How This Template Aligns |
|----------|-----------|--------------------------|
| Azure Cloud Adoption Framework (CAF) | Azure resource naming conventions | Sections 1, 3 adopt CAF resource type prefixes and naming patterns |
| Azure Well-Architected Framework | Operational excellence pillar | Consistent naming supports operational observability |
| DAMA DMBOK | Data architecture governance | Tag taxonomy and naming governance follow DMBOK principles |
| ISO 27001 | Information security management | Tag-based data classification supports security controls |
| SOX Compliance | Financial reporting controls | Cost-center tagging enables SOX-compliant cost allocation |
| NIST 800-171 / CMMC | Controlled unclassified information | Manufacturing overlay addresses CUI handling in infrastructure naming |

---

## Adaptation Guide

> **For engagement teams:** Customize the sections below for each client.

- [ ] Replace `org` with client organization code in all capacity and subscription names
- [ ] Confirm primary and secondary Azure regions and update region abbreviations
- [ ] Validate the environment set (some clients skip staging, others add perf/load)
- [ ] Map client's existing resource names to ISL-03 patterns and create a migration plan
- [ ] Extend the domain list with client-specific domains if needed
- [ ] Review storage account naming to ensure global uniqueness (add org code if needed)
- [ ] Confirm subscription model (single vs. multi) and adjust subscription naming
- [ ] Validate tag taxonomy with client's finance team (cost-center values)
- [ ] Confirm data classification tiers align with ISL-04 and client security policy
- [ ] Deploy Azure Policy definitions for naming and tag enforcement
- [ ] Validate Fabric workspace structure with client's analytics team
- [ ] Review network naming with client's network/security team
- [ ] Add client-specific anti-patterns discovered during assessment

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | ISL Architecture Team | Initial release — comprehensive infrastructure resource naming standards |

# Data Lineage Requirements

> Module: ISL-02 | Version: 1.0 | Adaptation Effort: 4-6 hrs | Dependencies: ISL-03, ISL-04, ISL-05, ISL-06

## Purpose

This document defines the requirements for capturing, storing, visualizing, and governing data lineage across the enterprise data estate. Data lineage provides the ability to trace the origin, movement, and transformation of data from source systems through intermediate processing layers to consumption endpoints. Comprehensive lineage is essential for impact analysis, root cause investigation, regulatory compliance, and trust in data assets.

Data lineage must be captured at multiple granularity levels — from high-level system-to-system flows down to column-level transformations — and must integrate with the metadata catalog (Purview or equivalent) to provide a unified view of the data landscape.

## Scope

### In Scope

- Lineage granularity levels (system, pipeline, table, column)
- Automated lineage capture from supported platforms (Purview, ADF, Fabric)
- Manual lineage documentation for non-instrumented flows
- Lineage storage model and schema
- Impact analysis workflows (forward and backward tracing)
- Regulatory lineage requirements (SOX, GDPR)
- Lineage quality and completeness metrics
- Lineage capture by integration pattern (aligned to ISL-05)
- Cross-system lineage (ERP-to-lakehouse-to-report)

### Out of Scope

- Lineage visualization UI design (covered in ISL-02 Lineage Visualization Standards)
- Business process lineage (BPMN / business workflow)
- Application code dependency analysis (covered in DevOps tooling)
- Network-level data flow monitoring

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default | Client Value | Notes |
|-----------|---------|--------------|-------|
| Lineage Platform | Microsoft Purview | _________________ | Primary lineage tool |
| Minimum Lineage Granularity | Table-level | _________________ | Column-level recommended for critical assets |
| Automated Lineage Sources | Fabric, ADF, Azure SQL | _________________ | Platforms with native connectors |
| Manual Lineage Required | Yes (for non-instrumented) | _________________ | ERP, manual processes |
| Lineage Retention Period | 3 years | _________________ | Historical lineage retention |
| Regulatory Drivers | SOX, GDPR | _________________ | Compliance requirements |
| ERP Systems | SAP S/4HANA, Epicor Kinetic | _________________ | Require manual/custom lineage |
| IoT Data Sources | Azure IoT Hub | _________________ | Sensor-to-lakehouse lineage |
| Impact Analysis SLA | 4 hours | _________________ | Time to produce impact report |
| Lineage Completeness Target | 90% of critical assets | _________________ | Coverage goal |
| Cross-System Lineage Required | Yes | _________________ | End-to-end tracing |
| Column-Level Lineage | Required for Gold/Platinum zones | _________________ | Medallion layer threshold |

## Lineage Granularity Levels

### Level Definitions

| Level | Granularity | Description | Use Case | Required For |
|-------|-------------|-------------|----------|-------------|
| L1 — System | System-to-system | Shows data flow between source and target systems | Architecture overview, vendor management | All assets |
| L2 — Pipeline | Pipeline-level | Shows which pipelines move data between specific objects | Operational monitoring, scheduling dependencies | All pipelines |
| L3 — Table/Object | Table-to-table | Shows source-target mapping at the table/file level | Impact analysis, change management | All tables in Silver+ zones |
| L4 — Column | Column-to-column | Shows field-level mapping and transformations | Root cause analysis, PII tracing, regulatory | Critical/SOX/PII assets |

### Granularity Requirements by Asset Classification

| Asset Classification | L1 System | L2 Pipeline | L3 Table | L4 Column |
|---------------------|:---------:|:----------:|:--------:|:---------:|
| SOX-Critical Financial | Required | Required | Required | Required |
| PII/GDPR Subject Data | Required | Required | Required | Required |
| ITAR Controlled | Required | Required | Required | Required |
| Gold/Platinum Zone | Required | Required | Required | Required |
| Silver Zone | Required | Required | Required | Recommended |
| Bronze Zone | Required | Required | Recommended | Optional |
| Sandbox/Exploratory | Recommended | Optional | Optional | Optional |

### Lineage Detail at Each Level

**L1 — System-Level Lineage:**

```
[SAP S/4HANA] ---> [Azure Data Factory] ---> [Fabric Lakehouse (Bronze)]
[Epicor Kinetic] ---> [Azure Data Factory] ---> [Fabric Lakehouse (Bronze)]
[IoT Hub] ---> [Fabric Eventstream] ---> [Fabric Lakehouse (Bronze)]
[Fabric Lakehouse (Bronze)] ---> [Fabric Notebooks] ---> [Fabric Lakehouse (Silver)]
[Fabric Lakehouse (Silver)] ---> [Fabric Notebooks] ---> [Fabric Lakehouse (Gold)]
[Fabric Lakehouse (Gold)] ---> [Fabric Semantic Model] ---> [Power BI Reports]
```

**L4 — Column-Level Lineage Example:**

```
SAP.KNA1.NAME1 ──> bronze.sap_customer.customer_name ──> silver.dim_customer.customer_name
                    [TRIM + UPPER]                         [COALESCE with Epicor]

SAP.KNA1.SMTP_ADDR ──> bronze.sap_customer.email_raw ──> silver.dim_customer.email_address
                        [no transform]                     [LOWER + TRIM + validate_email()]
```

## Automated Lineage Capture

### Supported Automated Lineage Sources

| Platform | Lineage Connector | Granularity | Configuration |
|----------|------------------|-------------|---------------|
| Microsoft Fabric Data Factory | Purview native connector | L2-L3 (table) | Enable lineage in Purview Fabric scan |
| Azure Data Factory (V2) | Purview ADF connector | L2-L3 (table) | Connect ADF to Purview via managed identity |
| Fabric Notebooks (Spark) | Purview OpenLineage | L3-L4 (column) | Install OpenLineage Spark listener |
| Fabric Warehouse/Lakehouse | Purview scan + lineage | L3 (table) | Enable lineage in Purview scan rule |
| Fabric Semantic Models | Purview Power BI connector | L3 (table) | Enable Purview Power BI scan |
| Power BI Reports | Purview Power BI connector | L3 (table) | Part of Power BI scan |
| Azure SQL Database | Purview scan | L3 (table) | Enable lineage in scan configuration |
| Azure Synapse Analytics | Purview Synapse connector | L2-L4 | Connect Synapse workspace to Purview |
| Databricks | Purview/Unity Catalog | L3-L4 | Configure Unity Catalog lineage |

### Automated Lineage Configuration Requirements

| Requirement | Standard |
|-------------|----------|
| Scan Frequency | Lineage scans must run at least daily for production workspaces |
| Credential Management | Use managed identities or Azure Key Vault for scan credentials |
| Lineage Lag Tolerance | Maximum 24 hours between pipeline execution and lineage availability |
| Failed Scan Alerting | Alert data governance team on scan failures within 1 hour |
| Scan Scope | All production and pre-production workspaces must be scanned |
| Exclusions | Sandbox and personal workspaces may be excluded (document exceptions) |

### Lineage Capture by Integration Pattern (ISL-05)

| Integration Pattern | Lineage Capture Method | Expected Granularity | Notes |
|--------------------|----------------------|---------------------|-------|
| Batch Extract (Full) | ADF/Fabric pipeline connector | L2-L3 | Automatic via Purview |
| Batch Extract (Incremental) | ADF/Fabric pipeline connector | L2-L3 | Automatic via Purview |
| CDC (Change Data Capture) | ADF CDC connector + manual enrichment | L2-L3 | CDC logic may need manual L4 |
| API Pull | Manual lineage documentation | L2-L3 | No native connector |
| Event Stream (Real-Time) | Eventstream + manual enrichment | L2-L3 | Custom lineage for transformations |
| File Drop (SFTP/Blob) | Manual lineage documentation | L1-L2 | No automated connector |
| Direct Query | Purview scan (view definitions) | L3-L4 | SQL views parsed for lineage |
| Manual Data Entry | Manual lineage documentation | L1-L2 | Forms, spreadsheets |

## Manual Lineage Documentation

For data flows that cannot be captured automatically, manual lineage documentation is required.

### Manual Lineage Template

| Attribute | Required | Description | Example |
|-----------|----------|-------------|---------|
| lineage_id | Yes | Unique lineage record ID | LIN-00342 |
| source_system | Yes | Origin system name | SAP S/4HANA (PP Module) |
| source_object | Yes | Source table/file/API | SAP Table: AFKO (Production Order Header) |
| source_columns | Conditional | Source column list (for L4) | AUFNR, MATNR, GAMNG, GSTRP |
| target_system | Yes | Destination system | Fabric Lakehouse (Bronze) |
| target_object | Yes | Target table/file | bronze.sap_production.order_header |
| target_columns | Conditional | Target column list (for L4) | order_number, material_number, planned_qty, start_date |
| transformation | Yes | Description of transformation | Direct extract via RFC; AUFNR mapped to order_number, date format converted from SAP internal to ISO 8601 |
| integration_pattern | Yes | ISL-05 pattern reference | Batch Extract (Full Refresh) |
| pipeline_name | Conditional | Pipeline if applicable | pl_sap_production_orders_daily |
| frequency | Yes | Data flow frequency | Daily at 06:00 UTC |
| data_owner | Yes | Accountable business owner | production-data@company.com |
| documented_by | Yes | Person documenting | jane.doe@company.com |
| documentation_date | Yes | Date documented | 2025-03-15 |
| last_verified | Yes | Date last verified accurate | 2025-03-15 |
| verification_method | Yes | How accuracy was confirmed | Pipeline execution logs + row count reconciliation |

### Manual Lineage Scenarios

| Scenario | Why Manual | Documentation Approach |
|----------|-----------|----------------------|
| SAP RFC/BAPI extracts | No native Purview SAP lineage connector | Document source RFC, tables, field mappings |
| Epicor BAQ extracts | No native Purview Epicor connector | Document BAQ definition, source tables, field mappings |
| Excel/CSV file uploads | No automated discovery | Document file format, column mappings, upload process |
| External vendor feeds | Third-party data with no connector | Document feed specification, delivery method, field mappings |
| IoT sensor-to-hub flows | Limited connector granularity | Document sensor registry, message schema, hub configuration |
| Manual data corrections | Human-in-the-loop processes | Document correction workflow, affected tables/columns |
| Legacy system interfaces | Old integrations without modern tooling | Document interface specs, flat file layouts, FTP details |

## Lineage Storage Model

### Lineage Graph Schema

The lineage model follows a directed acyclic graph (DAG) structure with the following node and edge types.

**Node Types:**

| Node Type | Description | Example |
|-----------|-------------|---------|
| SYSTEM | Source or target system | SAP S/4HANA |
| DATABASE | Database or lakehouse | bronze_lakehouse |
| SCHEMA | Schema or namespace | sap_production |
| TABLE | Table or view | order_header |
| COLUMN | Individual column | order_number |
| PIPELINE | Data pipeline | pl_sap_production_orders_daily |
| ACTIVITY | Pipeline activity | Copy_AFKO_to_Bronze |
| REPORT | BI report | Monthly Production Dashboard |
| SEMANTIC_MODEL | Power BI dataset | Production Efficiency Model |
| FILE | Data file | orders_20250315.parquet |
| STREAM | Event stream | sensor-telemetry-stream |

**Edge Types:**

| Edge Type | Description | Example |
|-----------|-------------|---------|
| PRODUCES | Pipeline produces an asset | Pipeline -> Table |
| CONSUMES | Pipeline/report reads from asset | Report -> Semantic Model |
| DERIVES_FROM | Column derived from source column(s) | target.col -> source.col |
| CONTAINS | Parent contains child | Database -> Schema -> Table -> Column |
| DEPENDS_ON | Execution dependency | Pipeline A -> Pipeline B |
| TRANSFORMS | Transformation relationship with logic | source.col --(UPPER+TRIM)--> target.col |

### Lineage Metadata per Edge

| Attribute | Required | Description |
|-----------|----------|-------------|
| edge_id | Yes | Unique edge identifier |
| source_node_id | Yes | Origin node reference |
| target_node_id | Yes | Destination node reference |
| edge_type | Yes | Relationship type (from edge types above) |
| transformation_logic | Conditional | SQL, DAX, Spark, or description of transformation |
| capture_method | Yes | AUTOMATED or MANUAL |
| captured_date | Yes | When this lineage was recorded |
| last_verified | Yes | When this lineage was last confirmed accurate |
| confidence | Yes | HIGH (automated), MEDIUM (verified manual), LOW (unverified manual) |

## Impact Analysis Workflows

### Forward Impact Analysis ("What does this feed?")

Used when a source system or table is changing and you need to assess downstream effects.

**Workflow:**

1. **Identify Source**: Select the changing asset (table, column, or system).
2. **Trace Forward**: Follow all downstream edges in the lineage graph.
3. **Enumerate Impacts**: List all affected downstream assets at each level.
4. **Classify Impact Severity**: Rate each impact based on the downstream asset's criticality.
5. **Generate Report**: Produce an impact analysis report for change management review.
6. **Notify Stakeholders**: Alert owners and stewards of all affected downstream assets.

**Impact Severity Classification:**

| Severity | Criteria | Response Required |
|----------|----------|-------------------|
| Critical | SOX-critical reports, regulatory submissions, customer-facing | Change Advisory Board (CAB) review required |
| High | Executive dashboards, cross-department analytics | Data owner approval required |
| Medium | Department-level reports, internal analytics | Data steward notification |
| Low | Exploratory notebooks, sandbox assets | Informational notification |

### Backward Impact Analysis ("Where does this come from?")

Used when investigating data quality issues or understanding data provenance.

**Workflow:**

1. **Identify Target**: Select the asset with the quality issue or question.
2. **Trace Backward**: Follow all upstream edges in the lineage graph.
3. **Enumerate Sources**: List all contributing source assets and transformations.
4. **Identify Transformation Points**: Document each transformation that could introduce the issue.
5. **Root Cause Isolation**: Use lineage to narrow the source of the defect.
6. **Generate Provenance Report**: Document the full data provenance chain.

### Impact Analysis SLA

| Analysis Type | Scope | Target SLA |
|--------------|-------|------------|
| Single table forward | One table, all downstream | 1 hour |
| Single column forward | One column, all downstream | 2 hours |
| System-level forward | Entire source system change | 4 hours |
| Single table backward | One table to all sources | 1 hour |
| Data quality root cause | Defect through full lineage chain | 4 hours |
| Regulatory lineage report | Full SOX/GDPR flow documentation | 8 hours |

## Regulatory Lineage Requirements

### SOX Financial Lineage

| Requirement | Standard |
|-------------|----------|
| Scope | All data assets contributing to financial statements and SEC filings |
| Granularity | Column-level lineage required for all SOX-critical data elements |
| Documentation | Full lineage documentation with transformation logic |
| Retention | 7 years (per SOX record retention requirements) |
| Auditability | External auditors must be able to trace any financial figure to source |
| Change Tracking | All lineage changes must be versioned with change date and reason |
| Certification | Lineage for SOX assets must be certified quarterly by data owners |
| Reconciliation | Row counts and aggregates must reconcile across lineage chain |

### GDPR Data Subject Lineage

| Requirement | Standard |
|-------------|----------|
| Scope | All data assets containing personal data of EU/EEA data subjects |
| Granularity | Column-level lineage for all PII columns |
| Purpose Tracking | Each processing step must document the legal basis and purpose |
| Retention Mapping | Lineage must identify retention periods at each processing stage |
| Deletion Tracing | Lineage must support "right to be forgotten" — identify all locations of subject data |
| Cross-Border Flows | Document all data transfers across geographic boundaries |
| Third-Party Sharing | Document all data flows to/from third-party processors |
| DPIA Integration | Lineage feeds Data Protection Impact Assessments |

### Regulatory Lineage Certification

| Activity | Frequency | Owner | Output |
|----------|-----------|-------|--------|
| SOX lineage walkthrough | Quarterly | Finance Data Owner + External Audit | Certified lineage report |
| GDPR data map refresh | Semi-annually | DPO + Data Governance | Updated Article 30 records |
| ITAR data flow review | Annually | Compliance Officer | Certified ITAR data flow diagram |
| Full regulatory lineage audit | Annually | CDO + Internal Audit | Compliance attestation |

## Lineage Quality and Completeness Metrics

### Lineage KPIs

| Metric | Formula | Target | Measurement Frequency |
|--------|---------|--------|----------------------|
| Lineage Coverage | (Assets with lineage / Total cataloged assets) * 100 | 90% | Monthly |
| Column-Level Coverage | (Critical assets with L4 lineage / Total critical assets) * 100 | 95% | Monthly |
| Automated Lineage Rate | (Auto-captured lineage edges / Total lineage edges) * 100 | 80% | Monthly |
| Lineage Freshness | (Lineage records verified within 90 days / Total records) * 100 | 85% | Monthly |
| Lineage Confidence Score | Average confidence across all lineage edges | > 0.85 (HIGH) | Monthly |
| Impact Analysis SLA Met | (Analyses completed within SLA / Total analyses) * 100 | 95% | Monthly |
| Manual Lineage Backlog | Count of assets requiring manual lineage documentation | < 50 | Weekly |
| Broken Lineage Rate | (Lineage chains with gaps / Total lineage chains) * 100 | < 5% | Monthly |

### Lineage Quality Rules

| Rule | Description | Severity |
|------|-------------|----------|
| No Orphan Nodes | Every table in Silver+ zones must have at least one upstream edge | High |
| No Dead Ends | Every Gold zone table must have at least one downstream consumer | Medium |
| Transformation Documented | L4 edges must include transformation logic | High (for critical) |
| Owner Assigned | Every lineage chain must have an accountable data owner | High |
| Verified Within 90 Days | Manual lineage must be re-verified quarterly | Medium |
| Consistent Grain | Lineage granularity must be consistent within a regulatory scope | High |

## Fabric / Azure Implementation Guidance

### Purview Lineage Configuration

- Enable Purview Data Map for all production data sources.
- Configure Purview lineage connectors for Fabric Data Factory, ADF, and Synapse.
- Enable OpenLineage integration for Fabric Notebooks (Spark).
- Configure Purview Power BI scanning with lineage enabled.
- Use Purview collections to organize lineage by domain and environment.

### Fabric-Specific Lineage

- Fabric Data Factory pipelines produce automatic lineage in Purview when connected.
- Fabric Notebooks require OpenLineage Spark listener for automated column-level lineage.
- Fabric Dataflows Gen2 produce lineage visible in the Fabric lineage view.
- Fabric Semantic Models produce lineage from lakehouse/warehouse tables to model tables and measures.
- Power BI reports produce lineage from semantic models to report visuals.

### Lineage API Access

- Use Purview REST API (GET /lineage/{guid}) for programmatic lineage queries.
- Use Purview Atlas API for bulk lineage extraction and custom reporting.
- Build custom lineage ingestion for non-supported sources using Purview REST API (POST /lineage).
- Integrate lineage queries into change management workflows via Power Automate.

## Manufacturing Overlay [CONDITIONAL]

### ERP-to-Lakehouse Lineage

| Source | Extraction | Landing | Processing | Consumption |
|--------|-----------|---------|-----------|-------------|
| SAP AFKO (Order Header) | RFC via ADF | bronze.sap_production.order_header | silver.production.fact_work_order | Gold production model |
| SAP AFPO (Order Item) | RFC via ADF | bronze.sap_production.order_item | silver.production.fact_work_order_line | Gold production model |
| SAP MARA (Material) | RFC via ADF | bronze.sap_master.material | silver.master.dim_material | Gold production model |
| Epicor JobHead | REST via ADF | bronze.epicor_production.job_header | silver.production.fact_work_order | Gold production model |
| Epicor Part | REST via ADF | bronze.epicor_master.part | silver.master.dim_material | Gold production model |

### BOM Lineage

Bill of Materials lineage must trace the complete product structure across systems.

| BOM Level | SAP Source | Epicor Source | Unified Target |
|-----------|-----------|---------------|---------------|
| Finished Good | CS01/STPO | MOM Header | gold.product.dim_bom_header |
| Assembly | CS01/STPO (child) | MOM Detail | gold.product.dim_bom_component |
| Component | CS01/STPO (leaf) | MOM Detail (leaf) | gold.product.dim_bom_component |
| Raw Material | MARA (ROH type) | Part (type=M) | gold.product.dim_bom_component |

### IoT Sensor Data Lineage

```
[Physical Sensor] --> [IoT Hub] --> [Eventstream] --> [Bronze Lakehouse]
     |                    |              |                    |
  Device ID          Message Route   Stream Job         Raw Parquet
  Sensor Type        Protocol       Transform           Files
  Plant/Line         Topic          Aggregate           Partitioned by
  Calibration                       Window              date/sensor_type
```

### Welding Process Data Lineage

| Data Element | Source | Path | Destination |
|-------------|--------|------|-------------|
| Weld Parameters | Weld Controller PLC | OPC-UA -> IoT Hub -> Eventstream | bronze.welding.weld_parameters |
| Wire Feed Speed | Weld Controller | PLC Tag -> IoT Hub -> Bronze | silver.welding.fact_weld_run |
| Arc Voltage | Weld Controller | PLC Tag -> IoT Hub -> Bronze | silver.welding.fact_weld_run |
| Travel Speed | Weld Controller | PLC Tag -> IoT Hub -> Bronze | silver.welding.fact_weld_run |
| Weld QC Result | MES / QC Station | Manual Entry -> API -> Bronze | silver.quality.fact_weld_inspection |
| X-Ray / NDT | NDT Equipment | File Export -> SFTP -> Bronze | silver.quality.fact_ndt_inspection |

## Cross-References

| Document | Relationship |
|----------|-------------|
| ISL-02: Technical Metadata Schema | Lineage captured between cataloged metadata assets |
| ISL-02: Business Glossary Standards | Glossary terms annotate lineage nodes |
| ISL-02: Lineage Visualization Standards | Visual representation of lineage data |
| ISL-02: Data Catalog Governance | Lineage completeness as catalog quality metric |
| ISL-02: Metadata Integration Patterns | Lineage sync across metadata platforms |
| ISL-03: Naming Conventions | Asset naming used in lineage node identification |
| ISL-04: Data Classification | Classification drives lineage granularity requirements |
| ISL-05: Integration Patterns | Lineage capture approach per integration pattern |
| ISL-06: Data Quality Framework | Quality scores annotated on lineage nodes |

## Compliance Alignment

| Standard | Alignment |
|----------|-----------|
| DAMA DMBOK2 (Ch. 8) | Data integration and interoperability — lineage requirements |
| ISO 8000-61 | Data quality — data provenance |
| W3C PROV-DM | Provenance data model |
| SOX (Section 302/404) | Financial data traceability requirements |
| GDPR (Art. 30, 35) | Records of processing and DPIA data flow requirements |
| BCBS 239 | Risk data aggregation lineage (if financial services) |
| NIST SP 800-53 (AU-3) | Audit and accountability — content of audit records |
| ITAR (22 CFR 120-130) | Export-controlled data flow traceability |
| OpenLineage Specification | Open standard for lineage event capture |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial release |
| -- | -- | -- | Reserved for client adaptation |

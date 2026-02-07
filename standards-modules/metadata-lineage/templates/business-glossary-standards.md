# Business Glossary Standards

> Module: ISL-02 | Version: 1.0 | Adaptation Effort: 4-6 hrs | Dependencies: ISL-03, ISL-04, ISL-06

## Purpose

This document establishes the standards for defining, governing, and maintaining a business glossary across the enterprise data landscape. A well-managed business glossary ensures that all stakeholders share a common understanding of business terminology, reduces ambiguity in reporting and analytics, and provides a critical metadata layer linking technical assets to business meaning.

The business glossary serves as the authoritative source for business term definitions and is foundational to data literacy, data catalog enrichment, and regulatory compliance. All terms defined under this standard must be registered in the enterprise metadata catalog (Microsoft Purview or equivalent) and linked to technical assets per ISL-02 Technical Metadata Schema.

## Scope

### In Scope

- Business term definition standards and templates
- Term ownership and stewardship assignments
- Approval workflow for term lifecycle management
- Cross-domain disambiguation and conflict resolution
- Synonym, homonym, and abbreviation handling
- Glossary governance cadence and quality criteria
- Microsoft Purview glossary alignment and integration
- Term hierarchy, categorization, and taxonomy structure
- Manufacturing-specific terminology extensions

### Out of Scope

- Technical metadata attribute definitions (covered in ISL-02 Technical Metadata Schema)
- Data classification taxonomy (covered in ISL-04 Data Classification)
- Data quality rule definitions (covered in ISL-06 Data Quality Framework)
- Master data management (MDM) entity resolution
- Ontology and semantic web standards (OWL, RDF)

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default | Client Value | Notes |
|-----------|---------|--------------|-------|
| Glossary Platform | Microsoft Purview | _________________ | Primary glossary tool |
| Maximum Term Definition Length | 500 characters | _________________ | Concise but complete |
| Minimum Term Definition Length | 50 characters | _________________ | Prevents stub entries |
| Approval Workflow Levels | 2 (steward + owner) | _________________ | Number of approvals |
| Review Cadence | Quarterly | _________________ | Scheduled review cycle |
| Primary Business Domains | Finance, Operations, Supply Chain, Quality, Sales | _________________ | Domain taxonomy |
| ERP Systems | SAP S/4HANA + Epicor Kinetic | _________________ | Source of many terms |
| Manufacturing Glossary Required | Yes | _________________ | Include MFG overlay |
| Regulatory Requirements | SOX, GDPR | _________________ | Compliance drivers |
| Default Term Language | English (US) | _________________ | Primary language |
| Multi-Language Support | No | _________________ | Localization required? |
| Maximum Synonyms Per Term | 10 | _________________ | Practical limit |
| Term ID Format | Auto-generated (GT-XXXXX) | _________________ | Per ISL-03 naming |

## Term Definition Template

Every business glossary term must be defined using the following standard template. All required fields must be populated before a term can advance beyond draft status.

### Required Attributes

| Attribute | Description | Required | Example |
|-----------|-------------|----------|---------|
| Term ID | Unique identifier, auto-generated | Yes (system) | GT-00142 |
| Term Name | Canonical business name | Yes | Finished Goods Inventory |
| Definition | Clear, unambiguous business definition | Yes | The total quantity and value of completed products that have passed final quality inspection and are available for sale or shipment to customers. |
| Business Domain | Primary domain classification | Yes | Supply Chain |
| Sub-Domain | Secondary classification within domain | No | Inventory Management |
| Data Owner | Business executive accountable for the term | Yes | VP of Supply Chain |
| Data Steward | Day-to-day responsible person | Yes | Supply Chain Data Analyst |
| Status | Current lifecycle stage | Yes (system) | Approved |
| Effective Date | Date term became/becomes active | Yes | 2025-01-15 |
| Source of Record | Authoritative system for this concept | Yes | SAP S/4HANA (MM module) |
| Sensitivity Classification | Per ISL-04 data classification | Yes | Tier 2 - Internal |

### Optional Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| Synonyms | Alternate accepted names | FG Inventory, Finished Stock |
| Abbreviations | Standard abbreviations | FGI |
| Related Terms | Links to associated terms | Raw Material Inventory, Work-in-Process |
| Antonyms | Opposite or contrasting terms | Raw Materials |
| Parent Term | Hierarchical parent | Inventory |
| Child Terms | Hierarchical children | Finished Goods On-Hand, Finished Goods In-Transit |
| Business Rules | Rules governing this concept | FGI must pass QC inspection before inclusion |
| Regulatory Relevance | Applicable regulations | SOX (financial reporting), Customs (export) |
| KPI Association | Related metrics | Inventory Turnover Ratio, Days of Supply |
| Example Values | Illustrative data values | 15,000 EA of Part MAT-100234 at Plant P100 |
| Counterpart Terms (ERP) | Equivalent fields in source systems | SAP: LABST (Unrestricted Stock), Epicor: PartOnHandQty |
| Notes | Additional context or caveats | Excludes consignment stock held at customer sites |
| Last Reviewed Date | Most recent review date | 2025-06-30 |
| Next Review Date | Scheduled next review | 2025-09-30 |

### Definition Quality Criteria

Every term definition must meet the following quality standards before approval.

| Criterion | Requirement | Bad Example | Good Example |
|-----------|-------------|-------------|--------------|
| Clarity | Understandable by non-technical business users | "LABST field in MM" | "The quantity of completed products available for sale" |
| Completeness | Covers the full meaning without relying on assumed knowledge | "Inventory that is finished" | "Completed products that have passed final QC and are available for sale or shipment" |
| Uniqueness | Not a duplicate of an existing term | (duplicate of "Completed Inventory") | (checked against glossary, no duplicates found) |
| Conciseness | Between 50 and 500 characters | "Inventory." | 50-500 characters with complete meaning |
| Non-Circular | Does not use the term itself in the definition | "Finished Goods Inventory is inventory of finished goods" | "Completed products that have passed final quality inspection..." |
| Positive Framing | States what the term IS, not what it is NOT | "Not raw materials and not WIP" | "Completed products available for sale" |
| System-Agnostic | Does not reference specific system fields | "The LABST value in SAP table MARD" | "Total unrestricted stock quantity" (system mapping is separate) |
| Sourced | Includes authoritative source reference | (no source) | Source: APICS Dictionary, 16th Edition |

## Ownership Model

### Role Definitions

| Role | Responsibility | Typical Title | Scope |
|------|---------------|---------------|-------|
| Glossary Program Owner | Overall governance of the glossary program, funding, executive sponsorship | CDO / VP of Data Management | Enterprise-wide |
| Domain Data Owner | Accountable for all terms within a business domain; approves definitions | VP / Director of business unit | Single domain |
| Domain Data Steward | Creates, maintains, and reviews term definitions; resolves conflicts | Data Analyst / Business Analyst | Single domain |
| Subject Matter Expert (SME) | Provides domain expertise for definition accuracy | Process Engineer / Business Lead | Specific terms |
| Glossary Administrator | Platform administration, access control, bulk operations | Data Platform Engineer | Technical platform |
| Term Consumer | Uses terms for reporting, analysis, or development; may propose new terms | Any employee | Read access |

### RACI Matrix for Glossary Operations

| Activity | Program Owner | Domain Owner | Domain Steward | SME | Administrator | Consumer |
|----------|:------------:|:------------:|:--------------:|:---:|:-------------:|:--------:|
| Propose new term | I | I | R | C | I | C |
| Draft definition | I | I | R | C | - | - |
| Review definition | I | A | R | C | - | I |
| Approve definition | I | A | R | - | - | - |
| Resolve cross-domain conflict | A | C | R | C | - | - |
| Deprecate term | I | A | R | C | I | I |
| Quarterly review | A | R | R | C | I | - |
| Platform configuration | I | - | - | - | R | - |
| Bulk import/export | I | A | C | - | R | - |

## Approval Workflow

### Term Lifecycle States

```
  [Proposed] --> [Draft] --> [Under Review] --> [Approved] --> [Active]
                    |              |                              |
                    v              v                              v
                [Rejected]    [Rejected]                    [Deprecated]
                    |              |                              |
                    v              v                              v
                [Revised]     [Revised]                     [Archived]
```

### State Definitions

| State | Description | Who Can Transition | Next States |
|-------|-------------|-------------------|-------------|
| Proposed | New term submitted by any user | Any authenticated user | Draft, Rejected |
| Draft | Steward is actively defining the term | Domain Steward | Under Review, Rejected |
| Under Review | Definition complete, awaiting approval | Domain Steward (submit) | Approved, Rejected |
| Approved | Domain Owner has approved the definition | Domain Owner | Active |
| Active | Term is published and visible to all consumers | System (automatic) | Deprecated, Under Review (for edits) |
| Deprecated | Term is no longer recommended for use; replacement identified | Domain Owner | Archived |
| Archived | Term is retained for historical reference only | Glossary Administrator | (terminal) |
| Rejected | Term was not approved; feedback provided | Domain Owner / Steward | Revised |
| Revised | Previously rejected term updated with feedback | Domain Steward | Under Review |

### Approval Rules

| Rule | Requirement |
|------|-------------|
| Minimum Approvals | At least 1 steward review + 1 owner approval |
| Review SLA | Steward review within 5 business days of submission |
| Approval SLA | Owner approval within 10 business days of steward review |
| Rejection Feedback | All rejections must include written feedback (minimum 50 characters) |
| Cross-Domain Review | Terms used across 2+ domains require approval from all affected domain owners |
| Conflict Escalation | Unresolved conflicts escalate to Glossary Program Owner within 15 business days |
| Bulk Approval | Batches of up to 25 terms may be approved together if from the same domain and steward |
| Emergency Terms | Critical regulatory or compliance terms may use expedited 48-hour approval |

### Approval Workflow Automation

| Trigger | Action | Platform |
|---------|--------|----------|
| Term submitted | Notify assigned steward via email/Teams | Power Automate / Purview workflow |
| Steward review complete | Notify domain owner for approval | Power Automate / Purview workflow |
| Term approved | Publish to glossary, notify subscribers | Purview API + Power Automate |
| Term rejected | Notify submitter with feedback | Power Automate |
| Review SLA breach | Escalate to program owner | Power Automate scheduled flow |
| Term deprecated | Notify all linked asset owners | Purview API + Power Automate |

## Cross-Domain Disambiguation

When the same term name is used with different meanings across business domains, disambiguation is required.

### Disambiguation Process

1. **Detection**: Automated duplicate detection on term name submission (fuzzy match threshold: 85% similarity).
2. **Assessment**: Stewards from affected domains convene to determine if definitions genuinely differ.
3. **Resolution Options**:

| Option | When to Use | Example |
|--------|-------------|---------|
| Merge | Definitions are effectively the same | "Customer" in Sales and "Customer" in Finance merged to single enterprise term |
| Qualify | Same word, legitimately different meanings | "Yield" (Finance: investment return) vs. "Yield" (Manufacturing: production output ratio) |
| Rename | One usage is non-standard | "Order" (Sales: customer order) remains; "Order" (Warehouse: pick sequence) renamed to "Pick Sequence" |
| Hierarchy | One is a parent/child of the other | "Inventory" (parent) with children: "Raw Material Inventory", "WIP Inventory", "Finished Goods Inventory" |

### Qualified Term Naming Convention

When disambiguation requires qualification, use the following pattern per ISL-03 naming:

```
{Term Name} ({Domain})
```

**Examples:**

| Original Term | Domain 1 | Domain 2 | Resolution |
|---------------|----------|----------|------------|
| Yield | Manufacturing: Yield (Manufacturing) | Finance: Yield (Finance) | Qualified by domain |
| Cycle Time | Production: Cycle Time (Production) | Logistics: Cycle Time (Logistics) | Qualified by domain |
| Lot | Manufacturing: Production Lot | Sales: Sales Lot | Renamed for clarity |
| Run | Production: Production Run | Finance: (colloquial) | Only Production term formalized |

## Synonym and Homonym Handling

### Synonym Registry

| Rule | Standard |
|------|----------|
| Canonical Term | Every concept has exactly one canonical (preferred) term name |
| Synonym Limit | Maximum 10 synonyms per canonical term |
| Synonym Source | Document where each synonym is commonly used (system, department, region) |
| Search Inclusion | All synonyms must be indexed for glossary search |
| Reporting | Reports and dashboards must use the canonical term only |
| Synonym Display | Synonyms displayed as "Also known as" on term detail page |

### Synonym Template

| Canonical Term | Synonym | Source / Context | Status |
|---------------|---------|-----------------|--------|
| Finished Goods Inventory | FG Inventory | Common abbreviation | Accepted |
| Finished Goods Inventory | Completed Stock | Epicor legacy terminology | Accepted |
| Finished Goods Inventory | FERT Stock | SAP material type code | Accepted (technical) |
| Finished Goods Inventory | Done Goods | Colloquial / informal | Rejected |

### Homonym Registry

Homonyms (same spelling, different meanings) require explicit disambiguation entries.

| Term | Meaning 1 | Domain 1 | Meaning 2 | Domain 2 | Resolution |
|------|-----------|----------|-----------|----------|------------|
| Plant | Manufacturing facility | Operations | Living organism for grounds | Facilities | Qualify: Plant (Operations), Plant (Facilities) |
| Cell | Manufacturing work cell | Production | Spreadsheet cell | IT/Analytics | Qualify: Cell (Production), Cell (Analytics) |
| Run | Production execution | Manufacturing | Report execution | Analytics | Qualify: Production Run, Report Run |
| Batch | Production batch | Manufacturing | Data processing batch | IT | Qualify: Production Batch, Processing Batch |
| Lead | Sales prospect | Sales | Metal element (Pb) | Materials | Context-dependent; rarely ambiguous |

## Glossary Governance

### Review Cadence

| Review Type | Frequency | Scope | Participants | Output |
|-------------|-----------|-------|-------------|--------|
| Domain Review | Quarterly | All active terms in one domain | Domain owner + steward + 2 SMEs | Updated definitions, deprecated terms |
| Cross-Domain Alignment | Semi-annually | Cross-domain terms and conflicts | All domain stewards + program owner | Resolved conflicts, merged terms |
| Full Glossary Audit | Annually | Entire glossary | Program owner + all stewards | Coverage report, quality scores, roadmap |
| New Term Sprint | Monthly | Proposed terms backlog | Relevant stewards | Batch approval of new terms |
| Stale Term Review | Quarterly | Terms not reviewed in 12+ months | Domain steward | Review date updates or deprecations |

### Glossary Quality Metrics

| Metric | Target | Measurement | Frequency |
|--------|--------|-------------|-----------|
| Term Coverage | 90% of critical data assets linked | (Assets with glossary links / Total critical assets) | Monthly |
| Definition Completeness | 100% of active terms meet quality criteria | Automated quality check | Weekly |
| Approval Cycle Time | < 15 business days (propose to active) | Average workflow duration | Monthly |
| Stale Term Rate | < 10% of terms unreviewed > 12 months | (Stale terms / Active terms) | Quarterly |
| Cross-Domain Conflict Rate | < 5% of terms with unresolved conflicts | (Conflicted terms / Active terms) | Quarterly |
| Consumer Adoption | 80% of report developers use glossary | Survey + usage analytics | Semi-annually |
| Synonym Completeness | 95% of terms with known synonyms documented | (Terms with synonyms / Terms needing synonyms) | Quarterly |
| Orphaned Term Rate | < 5% of terms with no linked data assets | (Unlinked terms / Active terms) | Monthly |

## Purview Glossary Alignment

### Purview Glossary Term Mapping

| ISL-02 Attribute | Purview Glossary Field | Notes |
|-----------------|----------------------|-------|
| Term ID | Name (or custom attribute) | Purview auto-generates GUID; use ISL ID as custom attribute |
| Term Name | Name | Must be unique within Purview glossary |
| Definition | Definition | Rich text supported in Purview |
| Business Domain | (Custom attribute) | Map to Purview collection hierarchy |
| Data Owner | Experts | Purview "Experts" field (Azure AD reference) |
| Data Steward | Stewards | Purview "Stewards" field (Azure AD reference) |
| Status | Status | Purview supports: Draft, Approved, Expired, Alert |
| Synonyms | (Custom attribute or related terms) | Use Purview related terms with "Synonym" relationship |
| Related Terms | Related Terms | Purview native related terms feature |
| Parent Term | Parent Term | Purview native hierarchy support |
| Sensitivity Classification | (Linked classification) | Map to Purview sensitivity labels |
| Source of Record | Resources | Link to Purview registered data sources |

### Purview Custom Attributes for ISL-02

The following custom attributes must be added to the Purview glossary term template to support full ISL-02 compliance.

| Custom Attribute | Type | Required | Purpose |
|-----------------|------|----------|---------|
| ISL_Term_ID | String | Yes | ISL-02 term identifier (GT-XXXXX) |
| ISL_Sub_Domain | String | No | Sub-domain classification |
| ISL_Source_Of_Record | String | Yes | Authoritative source system |
| ISL_Regulatory_Relevance | String | No | Applicable regulations |
| ISL_Abbreviation | String | No | Standard abbreviation |
| ISL_Counterpart_SAP | String | No | SAP field/table reference |
| ISL_Counterpart_Epicor | String | No | Epicor field reference |
| ISL_Review_Date | Date | Yes | Last review date |
| ISL_Next_Review | Date | Yes | Next scheduled review |

### Purview Glossary Import/Export

| Operation | Method | Format | Frequency |
|-----------|--------|--------|-----------|
| Initial Load | Purview UI bulk import or REST API | CSV (Purview template) | One-time |
| Incremental Updates | Purview REST API (POST /glossaryTerms) | JSON | As terms are approved |
| Full Export (Backup) | Purview REST API (GET /glossary) | JSON | Weekly |
| Cross-Platform Sync | Custom integration (ADF/Fabric pipeline) | JSON via REST API | Daily |

## Term Hierarchy and Categorization

### Domain Taxonomy (Default)

```
Enterprise Glossary
├── Finance
│   ├── Accounting
│   ├── Treasury
│   ├── Financial Planning
│   └── Tax
├── Operations
│   ├── Production
│   ├── Maintenance
│   ├── Facilities
│   └── Safety
├── Supply Chain
│   ├── Procurement
│   ├── Inventory Management
│   ├── Logistics
│   └── Warehouse
├── Quality
│   ├── Quality Control
│   ├── Quality Assurance
│   └── Compliance
├── Sales & Marketing
│   ├── Sales
│   ├── Marketing
│   └── Customer Service
├── Human Resources
│   ├── Workforce Management
│   ├── Compensation
│   └── Talent
└── Information Technology
    ├── Data Management
    ├── Application Services
    └── Infrastructure
```

### Hierarchy Rules

| Rule | Standard |
|------|----------|
| Maximum Depth | 4 levels (Domain > Sub-Domain > Category > Term) |
| Single Parent | Each term has exactly one parent in the hierarchy |
| Cross-Reference | Terms may reference terms in other domains via "Related Terms" |
| Domain Assignment | Every term must belong to exactly one primary domain |
| Sub-Domain Optional | Sub-domain classification is recommended but not required |
| Inheritance | Child terms do not automatically inherit parent definitions |

## Fabric / Azure Implementation Guidance

### Purview Glossary Configuration

- Enable Purview glossary within the governance portal for centralized term management.
- Configure collection hierarchy to mirror the ISL-02 domain taxonomy.
- Create custom term templates with ISL-02 extended attributes.
- Enable workflow approvals mapped to the ISL-02 approval states.
- Configure Purview Data Catalog search to index all glossary synonyms.

### Fabric Integration

- Link Fabric semantic model measures and columns to Purview glossary terms.
- Use Fabric Data Factory metadata-driven pipelines to sync glossary terms from source systems.
- Configure Purview scanning of Fabric workspaces to auto-discover assets for glossary linking.
- Embed glossary term links in Power BI report documentation fields.

### Automation Patterns

- Use Power Automate flows to manage glossary approval workflows when Purview native workflows are insufficient.
- Deploy Azure Functions for custom glossary quality checks (definition length, duplicate detection, stale term identification).
- Use Purview REST API for programmatic glossary management in CI/CD pipelines.

## Manufacturing Overlay [CONDITIONAL]

This section applies when the client operates manufacturing facilities with ERP, MES, or IoT systems.

### Manufacturing Term Categories

| Category | Description | Examples |
|----------|-------------|---------|
| BOM / Product Structure | Terms related to bills of materials and product configuration | BOM Level, Component Quantity, Phantom Assembly |
| Production Operations | Shop floor execution terminology | Cycle Time, Takt Time, Setup Time, Run Rate |
| Quality & Inspection | QC/QA terminology | First Article Inspection, Cpk, Control Limit, NCR |
| Inventory & Warehousing | Material handling terminology | Safety Stock, Reorder Point, ABC Classification |
| Equipment & Maintenance | Asset management terminology | MTBF, MTTR, PM Schedule, Downtime Category |
| IoT / Sensor Data | Telemetry and OT terminology | Setpoint, Process Variable, Alarm Threshold |
| Welding / Process | Welding-specific terminology | Wire Feed Speed, Arc Voltage, Weld Bead, Heat Input |

### Dual-ERP Term Mapping

| Business Term | SAP Equivalent | Epicor Equivalent | Canonical Definition |
|---------------|---------------|-------------------|---------------------|
| Work Order | Production Order (AUFNR) | Job (JobNum) | An authorization to manufacture a specified quantity of a product |
| Bill of Materials | BOM (STLNR via CS01) | Method of Manufacturing (MOM) | Hierarchical list of components and quantities needed to produce a product |
| Material Number | Material (MATNR) | Part Number (PartNum) | Unique identifier for a raw material, component, or finished product |
| Plant | Plant (WERKS) | Site (SiteID) | A physical manufacturing or distribution facility |
| Storage Location | Storage Location (LGORT) | Warehouse (WarehouseCode) | A specific area within a plant where inventory is stored |
| Routing | Routing (PLNTY/PLNNR) | Job Operations (OprSeq) | Sequence of manufacturing steps to produce a product |

## Cross-References

| Document | Relationship |
|----------|-------------|
| ISL-02: Technical Metadata Schema | Technical attributes linked to glossary terms |
| ISL-02: Data Catalog Governance | Glossary terms used in catalog enrichment |
| ISL-02: Data Lineage Requirements | Glossary terms annotate lineage nodes |
| ISL-03: Naming Conventions | Term ID format, naming standards for terms |
| ISL-04: Data Classification | Sensitivity classification for terms |
| ISL-06: Data Quality Framework | Quality scores as metadata on glossary coverage |

## Compliance Alignment

| Standard | Alignment |
|----------|-----------|
| DAMA DMBOK2 (Ch. 10) | Business glossary as metadata management foundation |
| ISO 11179 | Metadata registry and data element naming |
| GDPR (Art. 30) | Records of processing require consistent terminology |
| SOX (Section 302/404) | Financial term consistency for internal controls |
| DCAM (EDM Council) | Data management capability — business glossary domain |
| ISO 8000 | Data quality vocabulary alignment |
| NIST SP 800-53 (PM-5) | Information system inventory terminology |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial release |
| -- | -- | -- | Reserved for client adaptation |

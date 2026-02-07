# Data Catalog Governance

> Module: ISL-02 | Version: 1.0 | Adaptation Effort: 3-5 hrs | Dependencies: ISL-03, ISL-04, ISL-06

## Purpose

This document defines the governance framework for the enterprise data catalog, establishing standards for asset curation, enrichment, certification, and ongoing maintenance. A well-governed data catalog enables data discovery, builds trust in data assets, and supports self-service analytics by ensuring that cataloged assets are accurate, complete, and current.

The data catalog is the central interface through which data consumers discover, evaluate, and request access to data assets. Without structured governance, catalogs become stale, unreliable, and underutilized. This standard ensures the catalog remains a trusted, living inventory of the enterprise data estate.

## Scope

### In Scope

- Asset curation workflow (discovery through certification)
- Catalog quality scoring and enrichment standards
- Stewardship assignment model for catalog maintenance
- Search and discovery standards (tags, classifications, descriptions)
- Certification process and criteria
- Catalog KPIs and operational metrics
- Catalog platform requirements and configuration
- User adoption strategies and enablement
- Integration with business glossary and data lineage

### Out of Scope

- Metadata schema definitions (covered in ISL-02 Technical Metadata Schema)
- Business term definitions (covered in ISL-02 Business Glossary Standards)
- Data lineage capture (covered in ISL-02 Data Lineage Requirements)
- Data access request and provisioning workflows (covered in ISL-04)
- Data quality rule implementation (covered in ISL-06)

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default | Client Value | Notes |
|-----------|---------|--------------|-------|
| Catalog Platform | Microsoft Purview | _________________ | Primary catalog tool |
| Catalog Scope | All production data assets | _________________ | What gets cataloged |
| Auto-Discovery Enabled | Yes | _________________ | Automated scanning |
| Scan Frequency | Daily (production), Weekly (non-prod) | _________________ | Discovery cadence |
| Enrichment SLA (Critical) | 5 business days after discovery | _________________ | Time to enrich |
| Enrichment SLA (Standard) | 15 business days after discovery | _________________ | Time to enrich |
| Certification Authority | Domain Data Owners | _________________ | Who certifies assets |
| Target Catalog Coverage | 95% of production assets | _________________ | Coverage goal |
| Target Enrichment Rate | 80% of cataloged assets at Silver+ | _________________ | Enrichment goal |
| Stewardship Model | Domain-based | _________________ | Steward assignment |
| User Adoption Target | 60% of analysts using catalog monthly | _________________ | Adoption goal |
| Review Cadence | Quarterly | _________________ | Governance review cycle |

## Asset Curation Workflow

### Curation Lifecycle

```
[Discovered] --> [Registered] --> [Enriched] --> [Validated] --> [Certified]
                                      |               |              |
                                      v               v              v
                                 [Enrichment    [Validation     [Decertified]
                                  Needed]        Failed]             |
                                      |               |              v
                                      v               v         [Deprecated]
                                 [Re-Enrich]    [Re-Validate]       |
                                                                    v
                                                               [Archived]
```

### Curation State Definitions

| State | Description | Entry Criteria | Exit Criteria | Responsible |
|-------|-------------|---------------|---------------|-------------|
| Discovered | Asset detected by automated scan | Purview scan identifies new asset | Steward assigns ownership | System (automated) |
| Registered | Asset acknowledged and ownership assigned | Data owner and steward assigned | Minimum metadata populated | Catalog Administrator |
| Enriched | Business context and metadata added | Description, glossary links, tags, classification populated | Passes enrichment quality check | Domain Data Steward |
| Validated | Technical accuracy verified | Row counts, schema, lineage, quality scores confirmed | No validation failures | Data Engineer + Steward |
| Certified | Asset approved for trusted consumption | Domain owner approves, all quality gates passed | Periodic recertification (quarterly) | Domain Data Owner |
| Decertified | Certification revoked due to quality issue | Quality score drops below threshold or schema change | Issue resolved and recertified | Domain Data Owner |
| Deprecated | Asset no longer recommended for use | Replacement identified and communicated | Retention period expires | Domain Data Owner |
| Archived | Asset retained for historical reference only | Past retention period, no active consumers | Permanent (read-only) | Catalog Administrator |

### Curation SLAs

| Transition | SLA (Critical Assets) | SLA (Standard Assets) | Escalation |
|------------|----------------------|----------------------|------------|
| Discovered -> Registered | 1 business day | 3 business days | Auto-notify catalog admin |
| Registered -> Enriched | 5 business days | 15 business days | Auto-notify domain steward |
| Enriched -> Validated | 3 business days | 10 business days | Auto-notify data engineer |
| Validated -> Certified | 2 business days | 5 business days | Auto-notify domain owner |
| Decertified -> Recertified | 5 business days | 15 business days | Escalate to data governance |

## Catalog Quality Scoring

### Enrichment Quality Score

Each cataloged asset receives an enrichment quality score based on the completeness and accuracy of its metadata.

| Quality Dimension | Weight | Scoring Criteria |
|------------------|--------|-----------------|
| Description Quality | 20% | Score 0: No description; Score 50: < 50 chars; Score 100: 50-500 chars, business-meaningful |
| Ownership Assigned | 15% | Score 0: No owner; Score 50: Owner only; Score 100: Owner + steward assigned |
| Classification Applied | 15% | Score 0: No classification; Score 100: ISL-04 tier assigned + PII flags |
| Glossary Terms Linked | 15% | Score 0: No terms; Score 50: Partial; Score 100: All relevant columns linked |
| Tags Applied | 10% | Score 0: No tags; Score 50: 1-2 tags; Score 100: 3+ relevant tags |
| Lineage Documented | 10% | Score 0: No lineage; Score 50: L1-L2; Score 100: L3+ per requirements |
| Quality Score Linked | 10% | Score 0: No quality metrics; Score 100: ISL-06 quality score populated |
| Technical Accuracy | 5% | Score 0: Stale/incorrect schema; Score 100: Schema matches actual |

### Quality Score Tiers

| Tier | Score Range | Badge | Catalog Display | Action |
|------|------------|-------|----------------|--------|
| Platinum | 95-100 | Platinum Certified | Gold star + "Trusted" label | Maintain via quarterly review |
| Gold | 80-94 | Certified | Green check + "Certified" | Minor enrichment to reach Platinum |
| Silver | 60-79 | Enriched | Yellow triangle + "Enriched" | Priority enrichment within 30 days |
| Bronze | 40-59 | Registered | Orange circle + "Registered" | Enrichment required within 60 days |
| Unscored | 0-39 | Discovered | Red flag + "Needs Attention" | Immediate steward assignment |

### Minimum Quality for Certification

| Asset Criticality | Minimum Score | Required Dimensions at 100% |
|-------------------|--------------|---------------------------|
| SOX-Critical | 95 (Platinum) | Description, Ownership, Classification, Lineage, Quality Score |
| Customer-Facing | 80 (Gold) | Description, Ownership, Classification |
| Internal Analytics | 60 (Silver) | Description, Ownership |
| Exploratory | 40 (Bronze) | Description |

## Stewardship Assignments

### Stewardship Model

| Model | Description | When to Use |
|-------|-------------|-------------|
| Domain-Based (Default) | One steward per business domain responsible for all assets in that domain | Organizations with clear domain boundaries |
| Source-System-Based | One steward per source system (SAP steward, Epicor steward) | Strong source system orientation |
| Zone-Based | Stewards assigned by medallion zone (Bronze, Silver, Gold) | Engineering-centric organizations |
| Hybrid | Combination of domain + zone | Large organizations with complex data estates |

### Stewardship RACI by Zone

| Activity | Bronze Zone Steward | Silver Zone Steward | Gold Zone Steward | Domain Data Owner |
|----------|:------------------:|:------------------:|:-----------------:|:-----------------:|
| Asset registration | R | - | - | I |
| Source metadata capture | R | I | - | I |
| Business enrichment | C | R | C | A |
| Glossary term linking | - | R | R | A |
| Quality score validation | C | R | C | A |
| Lineage documentation | R | R | C | A |
| Certification approval | - | - | C | A |
| Deprecation decision | I | I | C | A |

### Stewardship Capacity Planning

| Steward Type | Recommended Asset Load | Time Allocation | Skillset |
|-------------|----------------------|-----------------|----------|
| Full-Time Steward | 200-500 assets | 100% data stewardship | Business domain + data literacy |
| Part-Time Steward | 50-200 assets | 25-50% data stewardship | Business domain + basic catalog skills |
| Technical Steward | 100-300 assets (technical only) | 50% stewardship | Data engineering + catalog platform |
| Community Steward | 10-50 assets | 5-10% stewardship | Subject matter expert + basic catalog |

## Search and Discovery Standards

### Mandatory Discovery Metadata

Every cataloged asset must have the following metadata populated to ensure effective search and discovery.

| Metadata Element | Purpose | Example |
|-----------------|---------|---------|
| Display Name | Human-readable asset name | "Customer Master Dimension" |
| Description | Business-context description (50-500 chars) | "Unified customer dimension combining SAP KNA1 and Epicor Customer records with SCD Type 2 history" |
| Domain Tags | Business domain classification | [Supply Chain, Inventory] |
| Source System Tags | Originating system | [SAP, Epicor] |
| Zone Tags | Medallion architecture layer | [Gold] |
| Sensitivity Tags | Data classification | [Internal, Contains-PII] |
| Glossary Terms | Linked business terms | [Customer, Account, Ship-To] |
| Certification Badge | Trust indicator | Certified / Uncertified |
| Data Owner | Accountable person | john.smith@company.com |
| Last Refresh Date | Data currency indicator | 2025-03-15T06:00:00Z |

### Tagging Taxonomy

| Tag Category | Purpose | Controlled Vocabulary | Example Tags |
|-------------|---------|----------------------|-------------|
| Domain | Business domain classification | Per ISL-02 domain taxonomy | finance, operations, supply-chain, quality |
| Source System | Data origin | Registered source systems | sap, epicor, iot-hub, manual |
| Data Zone | Medallion layer | bronze, silver, gold, platinum | gold |
| Sensitivity | Security classification | Per ISL-04 tiers | public, internal, confidential, restricted |
| Data Type | Conceptual data category | master-data, transaction, reference, metric | master-data |
| Update Frequency | Refresh cadence | real-time, hourly, daily, weekly, monthly | daily |
| Compliance | Regulatory scope | sox, gdpr, itar, hipaa | sox, gdpr |
| Use Case | Primary consumption scenario | reporting, analytics, ml, operational | reporting |

### Tagging Rules

| Rule | Standard |
|------|----------|
| Minimum Tags | Every asset must have at least 3 tags (domain + source + zone) |
| Tag Format | Lowercase, kebab-case, per ISL-03 naming |
| No Duplicates | Same tag must not appear twice on an asset |
| Controlled Vocabulary | Only tags from the approved taxonomy (above) may be used |
| Custom Tags | Custom tags require steward approval and taxonomy registration |
| Tag Review | Tag taxonomy reviewed quarterly for relevance |

### Search Configuration

| Feature | Requirement |
|---------|-------------|
| Full-Text Search | Searches across name, description, tags, glossary terms, column names |
| Faceted Filtering | Filter by domain, source system, zone, sensitivity, certification status |
| Synonym Search | Glossary synonyms must be indexed for search |
| Relevance Ranking | Certified assets ranked higher; recently updated ranked higher |
| Saved Searches | Users can save and share frequent search queries |
| Browse by Domain | Hierarchical browsing by domain taxonomy |
| Browse by Lineage | Navigate from any asset to upstream/downstream via lineage |

## Certification Process

### Certification Criteria

An asset may be certified only when all of the following criteria are met.

| Criterion | Requirement | Verified By |
|-----------|-------------|-------------|
| Metadata Completeness | Enrichment quality score >= minimum for asset criticality | Automated scoring |
| Description Quality | Business description meets ISL-02 quality criteria | Steward review |
| Ownership Current | Data owner and steward are active employees | HR system check |
| Classification Applied | ISL-04 classification tier and PII flags assigned | Automated + steward |
| Lineage Documented | Lineage meets minimum granularity per ISL-02 requirements | Steward + engineer review |
| Quality Score Available | ISL-06 quality score populated and above threshold | Automated scoring |
| Schema Accurate | Physical schema matches catalog metadata | Automated scan comparison |
| No Open Issues | No unresolved data quality incidents against this asset | Issue tracker check |

### Certification Workflow

1. **Steward Nomination**: Data steward nominates asset for certification after enrichment.
2. **Automated Pre-Check**: System validates all automated criteria (scores, schema, lineage).
3. **Peer Review**: A second steward or SME reviews the enrichment quality.
4. **Owner Approval**: Domain data owner reviews and approves certification.
5. **Certification Published**: Asset receives certification badge visible in catalog.
6. **Notification**: All subscribers and consumers notified of certification.

### Recertification Requirements

| Trigger | Action Required |
|---------|----------------|
| Quarterly scheduled review | Steward confirms metadata accuracy; owner reaffirms certification |
| Schema change detected | Automatic decertification; steward must re-enrich and recertify |
| Quality score drops below threshold | Automatic decertification; quality issue must be resolved |
| Data owner change | New owner must review and reaffirm within 10 business days |
| Source system migration | Full recertification required after migration validation |
| Consumer complaint | Steward investigates; decertify if issue confirmed |

## Catalog KPIs

### Operational Metrics

| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| Catalog Coverage | (Cataloged production assets / Total known production assets) * 100 | 95% | Monthly |
| Enrichment Rate | (Assets at Silver+ quality / Total cataloged assets) * 100 | 80% | Monthly |
| Certification Rate | (Certified assets / Total Gold+ zone assets) * 100 | 70% | Monthly |
| Discovery Freshness | (Assets with scan < 7 days / Total cataloged assets) * 100 | 95% | Weekly |
| Ownership Coverage | (Assets with owner + steward / Total cataloged assets) * 100 | 98% | Monthly |
| Description Coverage | (Assets with description 50+ chars / Total cataloged assets) * 100 | 90% | Monthly |
| Tag Coverage | (Assets with 3+ tags / Total cataloged assets) * 100 | 85% | Monthly |
| Glossary Linkage | (Assets with glossary term links / Total Silver+ assets) * 100 | 70% | Monthly |
| Stale Asset Rate | (Assets unreviewed > 6 months / Total cataloged assets) * 100 | < 10% | Monthly |
| Curation SLA Compliance | (Assets curated within SLA / Total new assets) * 100 | 90% | Monthly |

### Adoption Metrics

| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| Monthly Active Users | Unique users accessing catalog in 30 days | 60% of analysts | Monthly |
| Search Queries per Month | Total catalog search queries | Trending upward | Monthly |
| Assets Viewed per Session | Average assets viewed per user session | > 3 | Monthly |
| Data Access Requests via Catalog | Access requests initiated from catalog | > 50% of total requests | Monthly |
| Glossary Term Views | Unique glossary terms viewed per month | Trending upward | Monthly |
| User Satisfaction (NPS) | Net promoter score from catalog user survey | > 30 | Quarterly |

## Catalog Platform Requirements

### Core Platform Capabilities

| Capability | Requirement | Priority |
|-----------|-------------|----------|
| Automated Discovery | Scan and register assets from all supported sources | Must Have |
| Metadata Storage | Store all ISL-02 technical metadata attributes | Must Have |
| Business Glossary | Native glossary with term-to-asset linking | Must Have |
| Data Lineage | Visual lineage with drill-down capability | Must Have |
| Search and Browse | Full-text search with faceted filtering | Must Have |
| Classification | Automated and manual data classification | Must Have |
| Certification | Asset certification workflow with badges | Must Have |
| Access Management | Role-based access to catalog features | Must Have |
| API Access | REST API for programmatic catalog operations | Must Have |
| Workflow Automation | Approval workflows for curation and certification | Should Have |
| Usage Analytics | Track catalog usage and adoption metrics | Should Have |
| Collaboration | Comments, ratings, and Q&A on assets | Should Have |
| Data Profiling | Automated column-level statistics | Should Have |
| Custom Attributes | Extend metadata schema with custom fields | Must Have |
| Bulk Operations | Batch update metadata across multiple assets | Should Have |
| Notifications | Alert subscriptions for asset changes | Should Have |

## User Adoption Strategies

### Adoption Playbook

| Phase | Duration | Activities | Success Metric |
|-------|----------|-----------|----------------|
| Awareness | Weeks 1-4 | Executive announcement, demo sessions, email campaign | 80% of analysts aware of catalog |
| Onboarding | Weeks 3-8 | Hands-on training, quick-start guides, office hours | 50% of analysts logged in |
| Integration | Weeks 6-16 | Embed catalog links in BI tools, require catalog for access requests | 40% monthly active users |
| Habit Formation | Weeks 12-24 | Gamification (enrichment leaderboards), success stories, champions network | 60% monthly active users |
| Sustainability | Ongoing | Quarterly reviews, continuous improvement, new feature rollouts | Stable 60%+ MAU |

### Adoption Enablers

| Enabler | Description |
|---------|-------------|
| Executive Sponsorship | CDO/CIO publicly endorses catalog as the data discovery starting point |
| Catalog-First Policy | New data access requests require catalog search before ad-hoc requests |
| BI Tool Integration | Embed catalog links in Power BI report descriptions and tooltips |
| Slack/Teams Integration | Catalog search bot in collaboration channels |
| Onboarding Integration | Include catalog training in new analyst onboarding |
| Gamification | Monthly enrichment leaderboards, stewardship recognition |
| Champions Network | Data catalog champions in each department for peer support |
| Feedback Loop | Monthly catalog improvement suggestions reviewed by governance team |

## Fabric / Azure Implementation Guidance

### Purview Data Catalog Configuration

- Deploy Purview account in the production Azure subscription.
- Configure collections hierarchy to mirror the ISL-02 domain taxonomy.
- Register all production data sources (Fabric workspaces, Azure SQL, ADLS Gen2, SAP, Epicor).
- Configure scan rules with ISL-02 required classifications.
- Enable automated scanning on the defined schedule (daily production, weekly non-prod).
- Create custom type definitions for ISL-02 extended attributes.
- Configure glossary term templates with ISL-02 custom attributes.

### Fabric Integration Points

- Enable Purview hub within Fabric for seamless catalog access from Fabric workspaces.
- Configure Fabric endorsement levels to align with ISL-02 certification tiers.
- Use Fabric Data Factory to build metadata enrichment pipelines.
- Leverage Power BI scanner API for report and semantic model metadata extraction.
- Integrate Purview search into Power BI via the Purview integration feature.

### Automation Opportunities

| Process | Automation Approach | Platform |
|---------|-------------------|----------|
| New asset notification | Purview event trigger -> Power Automate -> Teams | Power Automate |
| Enrichment reminders | Scheduled flow checking SLA compliance | Power Automate |
| Quality score calculation | Fabric notebook computing enrichment scores | Fabric Notebooks |
| Stale asset detection | Scheduled scan comparing last_refresh to SLA | Fabric Pipeline + Purview API |
| Certification expiry alerts | Quarterly timer checking certification dates | Power Automate |
| Usage analytics dashboard | Purview audit logs -> Fabric Lakehouse -> Power BI | Fabric + Power BI |

## Manufacturing Overlay [CONDITIONAL]

### Manufacturing Catalog Extensions

| Extension | Description | Additional Metadata |
|-----------|-------------|-------------------|
| ERP Asset Registry | SAP/Epicor tables, BAPIs, BAQs cataloged as data assets | ERP module, transaction code, authorization object |
| IoT Sensor Registry | Physical sensors cataloged with technical metadata | Sensor type, location, calibration date, accuracy class |
| MES Data Objects | MES tables and interfaces cataloged | MES module, production line, data frequency |
| Quality System Assets | QMS data stores cataloged | Inspection type, compliance standard, retention requirement |
| BOM Data Assets | Bill of materials structures cataloged across systems | BOM type, product family, ERP source |

### Dual-ERP Catalog Challenges

| Challenge | Resolution |
|-----------|-----------|
| Same concept, different names | Unified glossary with dual-ERP synonym mapping |
| Overlapping data domains | Domain steward mediates; unified Gold layer is authority |
| Different refresh cadences | Catalog shows per-system freshness; unified view shows latest |
| Different data quality levels | ISL-06 scores computed per system; composite score for unified |
| Cross-ERP lineage | Manual lineage documenting unified Gold layer derivation |

## Cross-References

| Document | Relationship |
|----------|-------------|
| ISL-02: Business Glossary Standards | Glossary terms linked to catalog assets |
| ISL-02: Technical Metadata Schema | Metadata attributes captured in catalog |
| ISL-02: Data Lineage Requirements | Lineage accessible from catalog assets |
| ISL-02: Metadata Integration Patterns | Multi-platform catalog sync |
| ISL-02: Lineage Visualization Standards | Visual lineage from catalog interface |
| ISL-03: Naming Conventions | Asset naming and tagging standards |
| ISL-04: Data Classification | Classification drives catalog enrichment requirements |
| ISL-06: Data Quality Framework | Quality scores displayed in catalog |

## Compliance Alignment

| Standard | Alignment |
|----------|-----------|
| DAMA DMBOK2 (Ch. 10) | Metadata management — data catalog as metadata delivery |
| DCAM (EDM Council) | Data management capability model — catalog governance domain |
| ISO 8000 | Data quality — catalog as quality management interface |
| SOX (Section 302/404) | Certified assets support internal control documentation |
| GDPR (Art. 30) | Catalog as records of processing activities inventory |
| NIST SP 800-53 (PM-5) | Information system inventory — catalog as asset registry |
| COBIT 2019 (APO03) | Enterprise architecture — data asset management |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial release |
| -- | -- | -- | Reserved for client adaptation |

# Manufacturing Data Classification — Complete Worked Example
> Module: ISL-04 | Version: 1.0 | Type: Example

## Purpose

This example presents a fully completed data classification scheme for a multi-site discrete manufacturer with ITAR-regulated defense contracts. The client operates dual ERP systems (SAP S/4HANA and Epicor Kinetic), maintains IoT-connected production lines across four facilities, and supplies components to both commercial aerospace and U.S. Department of Defense prime contractors.

---

## 1. Client Profile

| Attribute | Detail |
|-----------|--------|
| Industry | Discrete manufacturing — precision machined components |
| Facilities | 4 sites (2 domestic, 1 Mexico, 1 Canada) |
| Employees | 2,800 |
| ERP Systems | SAP S/4HANA (financials, procurement, quality) and Epicor Kinetic (production, shop floor) |
| Defense Revenue | 35% of total revenue from ITAR-regulated contracts |
| IoT Platform | Ignition SCADA with Azure IoT Hub edge gateways |
| Compliance Drivers | ITAR (22 CFR 120-130), EAR (15 CFR 730-774), SOX, NIST SP 800-171, CMMC Level 2 |
| Microsoft Stack | Microsoft 365 E5, Microsoft Fabric, Purview Information Protection, Azure |

---

## 2. Tier 1 — Public Data

Data approved for unrestricted distribution. Disclosure causes no competitive, financial, or legal harm.

| # | Data Element | Source System | Domain | Rationale |
|---|-------------|---------------|--------|-----------|
| 1 | Published product catalog with standard specifications | Website CMS | Marketing | Distributed to customers and trade shows |
| 2 | Company annual report (10-K) | SEC EDGAR | Finance | SEC-mandated public filing |
| 3 | Published safety data sheets (SDS) | EHS system | EHS | OSHA-mandated public availability |
| 4 | Press releases and investor announcements | PR platform | Communications | Intended for media and public |
| 5 | Public job postings | Workday Recruiting | HR | Posted on external job boards |
| 6 | Published ISO 9001/AS9100 certifications | Quality system | Quality | Shared with customers as qualification evidence |
| 7 | Facility addresses and general phone numbers | Corporate website | General | Publicly listed contact information |
| 8 | Published patent documents (post-grant) | USPTO | Legal/IP | Public record after patent grant |
| 9 | Trade show presentation materials | Marketing | Marketing | Presented at public industry events |
| 10 | Open-source tooling contributions | GitHub | Engineering | Licensed under MIT/Apache for public use |
| 11 | Published sustainability and ESG reports | Corporate website | Corporate | Voluntary public disclosure |
| 12 | OSHA injury rate statistics (public filings) | OSHA 300A | EHS | Regulatory posting requirement |
| 13 | Published DFARS/FAR clause references | Government websites | Contracts | Publicly available federal regulations |
| 14 | General company history and leadership bios | Corporate website | Communications | Marketing content for public consumption |
| 15 | Published API documentation for customer portal | Developer portal | IT | Available to registered external developers |
| 16 | Standard material certifications (publicly available alloys) | Material suppliers | Engineering | Common industry specifications (e.g., AMS 5643) |

**Handling:** Any approved platform, no special encryption, unrestricted sharing, all authenticated users, standard retention.

---

## 3. Tier 2 — Internal Data

Data for internal use by employees and authorized contractors. Not approved for external distribution.

| # | Data Element | Source System | Domain | Rationale |
|---|-------------|---------------|--------|-----------|
| 1 | Internal organizational charts | Workday | HR | Internal structure, not competitively sensitive |
| 2 | Production shift schedules | Epicor Kinetic | Manufacturing | Routine operational scheduling |
| 3 | General equipment maintenance schedules | Epicor Kinetic (PM module) | Manufacturing | Standard preventive maintenance data |
| 4 | Internal training materials and SOPs (non-IP) | SharePoint | HR/Operations | General process docs without trade secrets |
| 5 | Meeting minutes (routine operational) | Teams/SharePoint | General | Standard operational records |
| 6 | Internal project plans and timelines | Azure DevOps | PMO | Operational project tracking |
| 7 | Aggregated production volume reports (non-granular) | Epicor Kinetic | Manufacturing | High-level throughput metrics |
| 8 | IT system architecture documentation (general) | SharePoint | IT | System landscape references, non-security |
| 9 | Employee directory (name, title, business email) | Entra ID | HR | Basic business contact information |
| 10 | Internal newsletter and communications | SharePoint/Viva | Communications | Employee-facing content |
| 11 | Facility floor plans (non-ITAR areas) | Facilities system | Facilities | General office and non-restricted layout |
| 12 | Corporate travel and expense policies | SharePoint | Finance | Internal guidelines |
| 13 | Internal knowledge base articles | SharePoint/Confluence | IT/Operations | Self-service troubleshooting docs |
| 14 | Non-financial KPI dashboards (OEE, uptime) | Power BI | Operations | Aggregated operational metrics |
| 15 | Approved vendor list (non-strategic vendors) | SAP MM | Procurement | Standard supplier information |
| 16 | General IT service catalog | ServiceNow | IT | Available internal services listing |
| 17 | Internal event and holiday calendars | Outlook/SharePoint | General | Scheduling information |
| 18 | Aggregated scrap rate reports by facility | Epicor Kinetic | Quality | Non-granular quality trend data |

**Handling:** Approved enterprise platforms, AES-256 platform default, internal sharing only, annual access reviews.

---

## 4. Tier 3 — Confidential Data

Data restricted to authorized personnel with demonstrated business need-to-know.

| # | Data Element | Source System | Sub-Class | Rationale |
|---|-------------|---------------|-----------|-----------|
| 1 | Customer names, addresses, contact details | SAP SD | PII | GDPR/CCPA regulated personal data |
| 2 | Employee home addresses, phone numbers, DOB | Workday | PII | Employee personal data |
| 3 | Quarterly financial results (pre-release) | SAP FI | Financial | SOX controls, insider trading prevention |
| 4 | Customer pricing agreements and discount schedules | SAP SD | Customer | Contractual, competitive leverage |
| 5 | Vendor contract terms and negotiated pricing | SAP MM | Business | NDA-protected, negotiation leverage |
| 6 | Strategic business plans and market roadmaps | SharePoint | Business | Competitive advantage if disclosed |
| 7 | Employee performance reviews and ratings | Workday | PII | Privacy-sensitive personnel records |
| 8 | Customer complaints and CAPA records | SAP QM | Customer | Contractual, reputational risk |
| 9 | IT vulnerability scan results | Tenable/Qualys | Technical | Exploitable if disclosed to threat actors |
| 10 | Internal audit findings and remediation plans | Audit system | Financial | Regulatory exposure, reputational |
| 11 | Department budget forecasts | SAP FI-CO | Financial | Pre-decisional financial data |
| 12 | Non-conformance reports (NCRs) with root cause | SAP QM | Technical | Reveals process weaknesses |
| 13 | Sales pipeline, forecasts, and win/loss analysis | Salesforce/SAP | Business | Competitive intelligence risk |
| 14 | Employee benefits enrollment and health plan selections | Workday | PII | Contains health plan and dependent info |
| 15 | Detailed network architecture and firewall rules | IT documentation | Technical | Security exposure if disclosed |
| 16 | Customer order history, volumes, and backlog | SAP SD / Epicor | Customer | Contractual, competitive intelligence |
| 17 | Bill of materials for commercial products | Epicor Kinetic | Technical | Proprietary product structure |
| 18 | Production yield rates by product line | Epicor Kinetic | Technical | Competitive, process efficiency insight |
| 19 | Supplier quality scorecards and audit results | SAP QM | Business | NDA-protected evaluation data |
| 20 | IoT sensor data — operational (production rates, cycle times) | Azure IoT Hub | Technical | Reveals production capability and capacity |
| 21 | IoT sensor data — safety system activation logs | Ignition SCADA | Technical | Safety incident history exposure |

**Handling:** AES-256 with service-managed keys, need-to-know access, MFA required, quarterly access reviews, certified disposal.

---

## 5. Tier 4 — Restricted Data

Data of the highest sensitivity. Access limited to named individuals with just-in-time provisioning.

| # | Data Element | Source System | Sub-Class | Rationale |
|---|-------------|---------------|-----------|-----------|
| 1 | ITAR-controlled technical drawings and 3D models | Epicor / Windchill PLM | ITAR | Federal export control law; criminal penalties |
| 2 | ITAR defense contract technical data packages | Document management | ITAR | USML-controlled defense articles |
| 3 | Proprietary welding parameters (pulse, gas ratios, travel speeds) | Epicor Kinetic | Trade Secret | Core process IP; years of development |
| 4 | Proprietary alloy compositions and heat treatment recipes | R&D database | Trade Secret | Competitive differentiation |
| 5 | CNC machine programs with proprietary toolpaths | Epicor Kinetic | Trade Secret | Equipment-specific optimization IP |
| 6 | Proprietary surface treatment and coating formulations | R&D database | Trade Secret | Key competitive advantage |
| 7 | Social Security Numbers (SSN) | Workday | Sensitive PII | Identity theft risk; regulated |
| 8 | Employee bank account and routing numbers | Workday Payroll | Sensitive PII | Financial fraud risk |
| 9 | Employee health and medical records (FMLA, ADA) | Workday | Sensitive PII | HIPAA-adjacent; state privacy laws |
| 10 | M&A target evaluations and acquisition deal terms | SharePoint (isolated) | Executive | Material non-public information |
| 11 | Board meeting minutes (pre-approval) | SharePoint (isolated) | Executive | Fiduciary, strategic decisions |
| 12 | Attorney-client privileged communications | Outlook/SharePoint | Legal Privilege | Attorney-client privilege protection |
| 13 | Encryption keys, certificates, service principal secrets | Azure Key Vault | Trade Secret | Total compromise if leaked |
| 14 | Penetration test reports and red team findings | Security platform | Trade Secret | Detailed exploitable vulnerability info |
| 15 | Executive compensation details | Workday | Executive | Contractual, competitively sensitive |
| 16 | ECCN-classified technical data (EAR Category 1-9) | PLM / Document Mgmt | ITAR | Export Administration Regulations |
| 17 | Pre-filing patent applications and invention disclosures | Legal system | Trade Secret | Loss of patent rights if disclosed |
| 18 | IoT edge device credentials and gateway certificates | Azure IoT Hub | Trade Secret | Factory floor compromise if exposed |
| 19 | Defense contract pricing models and TINA data | SAP PS / Excel | ITAR | Truth in Negotiations Act |
| 20 | Proprietary quality inspection algorithms | Epicor Kinetic QC | Trade Secret | Differentiating QC methodology |

**Handling:** AES-256 CMK via Key Vault HSM, named individuals with JIT/PIM, FIDO2 MFA, monthly recertification, crypto-shred disposal.

---

## 6. ITAR Overlay

### 6.1 ITAR-Designated Data

| Data Element | USML Category | ITAR Control Basis |
|-------------|---------------|-------------------|
| Defense component technical drawings | Category XII(d) | Technical data for defense article |
| Manufacturing process specs for defense parts | Category XII(e) | Technical data related to manufacture |
| Defense contract TDPs | Category XII(d) | Government-furnished technical data |
| Test/inspection reports for defense components | Category XII(f) | Defense article qualification results |
| CNC programs for defense parts | Category XII(e) | Software for defense article production |
| Defense contract pricing and TINA data | N/A (FMS) | Foreign Military Sales pricing data |

### 6.2 US Person Access Requirements

All ITAR-controlled data requires verification that the accessor is a "US Person" (22 CFR 120.62): US citizen, permanent resident, or protected person. Implementation uses Entra ID custom attribute `itarUSPerson = true`, conditional access policy `CA-ITAR-USPerson`, annual re-verification aligned to I-9 cycles, and Empowered Official (VP Compliance) approval for all access requests. Mexico and Canada facility employees are excluded by default.

### 6.3 Physical and Logical Separation

| Control | Implementation |
|---------|---------------|
| Dedicated Fabric workspace | `ws_restricted_itar_engineering` — isolated from commercial workspaces |
| Dedicated Azure subscription | Separate subscription with independent RBAC |
| Network isolation | Private endpoints only; ExpressRoute from domestic facilities |
| Data residency | Azure US regions only (East US 2, West US 2); geo-replication disabled |
| Cross-workspace sharing | Blocked via Purview DLP |
| Audit logging | 7-year retention; tamper-evident; dedicated ITAR audit workspace |

---

## 7. Trade Secret Protection

| Trade Secret | Business Value | Protection Measures |
|-------------|---------------|---------------------|
| Welding parameters (pulse frequency, amperage, gas ratios) | 40% faster cycle time; $15M+ annual advantage | Named-individual access; CMK encryption; numbered copies; NDA |
| Proprietary alloy compositions (7 formulations) | Unique corrosion resistance; 12 years R&D | Encrypted R&D vault; 6 named metallurgists; physical backup |
| CNC toolpath optimization algorithms | 25% material waste reduction | Isolated repository; no export; developer access logged |
| Surface treatment chemical process (3 formulations) | Only domestic MIL-SPEC source; $8M revenue line | Offline vault with encrypted digital backup; 4 named chemists |
| Quality inspection neural network model | 99.7% defect detection accuracy | Isolated storage; inference API only; no model export |
| Heat treatment profiles (22 recipes) | Critical metallurgical properties | ITAR-isolated workspace; heat treat engineering team only |

---

## 8. IoT/OT Data Classification

| IoT Data Category | Tier | Purview Label | Examples |
|-------------------|------|---------------|----------|
| Safety-Critical | 3/4 | Confidential\Technical or HC — Trade Secret | E-stop logs, safety interlocks, gas detection, fire suppression |
| Operational | 2/3 | Internal\General or Confidential\Technical | Cycle times, spindle speeds, production counts, machine state |
| Analytical/Aggregated | 1/2 | Public or Internal\General | Monthly OEE trends, facility energy, aggregated scrap rates |
| Edge Credentials | 4 | HC — Trade Secret | IoT Hub connection strings, gateway certs, SCADA passwords |

**Decision rules:** Safety system data is minimum Tier 3. Proprietary process parameters are Tier 4. Machine-level capacity data is Tier 3. Facility-level aggregates are Tier 2. Device credentials are always Tier 4.

---

## 9. Supply Chain Data Classification

| Data Element | Tier | Purview Label | Rationale |
|-------------|------|---------------|-----------|
| Vendor master data (name, address, contact) | 2 | Internal\General | Basic vendor reference data |
| Vendor negotiated pricing and discounts | 3 | Confidential\Business | Competitive leverage; NDA-protected |
| Supplier quality audit results | 3 | Confidential\Business | NDA-protected evaluation data |
| Strategic sourcing plans | 3 | Confidential\Business | Competitive sourcing intelligence |
| Sole-source dependency analysis | 3 | Confidential\Business | Supply chain risk exposure |
| Logistics carrier rates and routing | 2 | Internal\General | Standard shipping data |
| Inbound material certs (standard alloys) | 2 | Internal\General | Industry-standard material specs |
| Inbound material certs (proprietary alloys) | 4 | HC — Trade Secret | Reveals proprietary composition |
| Supplier ITAR compliance certifications | 4 | HC — ITAR | Reveals defense supply chain structure |

---

## 10. ERP Data Classification by Module

| Module | Default Tier | Key Data Elements | Rationale |
|--------|-------------|-------------------|-----------|
| SAP FI (Financial Accounting) | 3 | GL, AP/AR, bank statements, tax | SOX-controlled financial data |
| SAP CO (Controlling) | 3 | Cost centers, profit centers, internal orders | Pre-decisional financial allocations |
| SAP MM (Materials Management) | 2-3 | POs (Tier 2), vendor pricing (Tier 3) | Pricing is confidential |
| SAP SD (Sales & Distribution) | 3 | Customer orders, pricing, delivery | Customer PII and contractual pricing |
| SAP QM (Quality Management) | 3 | Inspections, NCRs, CAPA | Process weakness disclosure risk |
| SAP PS (Project System) | 2-3 | Project plans (Tier 2), defense WBS (Tier 4/ITAR) | Defense projects require ITAR overlay |
| SAP HR/HCM | 3-4 | Employee records (Tier 3), SSN/medical (Tier 4) | PII ranges from standard to sensitive |
| SAP PM (Plant Maintenance) | 2 | Maintenance orders, equipment master | Routine operational data |
| SAP PP (Production Planning) | 2 | Production orders, MRP, capacity | Operational planning, not IP |
| Epicor Job Management | 2-3 | Job travelers (Tier 2), process params (Tier 4/TS) | IP params are trade secret |
| Epicor Shop Floor Control | 2-3 | Labor tracking (Tier 2), cycle data (Tier 3) | Granular cycle data reveals capability |
| Epicor Quality Assurance | 3 | Inspections, first article reports | Quality reveals process capability |
| Epicor Bill of Materials | 3-4 | Commercial BOM (Tier 3), proprietary BOM (Tier 4) | Proprietary compositions are trade secrets |
| Epicor Engineering | 3-4 | Commercial drawings (Tier 3), defense (Tier 4/ITAR) | ITAR overlay applies to defense work |

---

## 11. Cross-Domain Classification Conflicts

| Conflict Scenario | Resolution | Applied Tier |
|-------------------|-----------|-------------|
| Customer order references ITAR part numbers | Highest tier wins | Tier 4 — ITAR |
| Employee record contains SSN column | Column-level OLS | Tier 3 table / Tier 4 column |
| Production report includes proprietary cycle times | Separate into two reports | Tier 2 summary / Tier 4 detail |
| Quality NCR references ITAR part | Highest tier wins | Tier 4 — ITAR |
| Power BI report blends Tier 2 and Tier 3 sources | Highest source tier | Tier 3 |
| IoT stream mixes safety and operational data | Split at ingestion | Tier 3 safety / Tier 2 operational |
| BOM has standard and proprietary materials | Row-level RLS | Tier 3 default / Tier 4 proprietary rows |

**Principles:** (1) Classify at the higher tier when in doubt. (2) Prefer splitting data by tier over mixed-tier containers. (3) Use OLS and RLS when splitting is impractical. (4) ITAR always elevates the entire container.

---

## 12. Complete Data Handling Summary

| Dimension | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|-----------|--------|--------|--------|--------|
| **Purview Label** | Public | Internal\General | Confidential\{sub} | HC\{sub} |
| **Encryption at Rest** | Platform default | AES-256 (service key) | AES-256 (service key) | AES-256 (CMK/HSM) |
| **Encryption in Transit** | TLS 1.2 | TLS 1.2 | TLS 1.2+ required | TLS 1.3; VPN/ER |
| **Sharing — Internal** | Unrestricted | All employees | Role-based, need-to-know | Named individuals, JIT |
| **Sharing — External** | Unrestricted | DLP warns | DLP blocks + alert | Prohibited + SOC alert |
| **Access Reviews** | None | Annual | Quarterly | Monthly |
| **MFA** | Optional | Required (SSO) | Required (per session) | FIDO2 |
| **Power BI Export** | All formats | All formats | PDF only (watermarked) | Blocked |
| **Disposal** | Standard delete | Standard delete | Certified disposal | Crypto-shred |
| **Audit Log Retention** | 90 days | 180 days | 1 year | 7 years |

---

## Cross-References

- **ISL-04 Classification Tier Definitions** — foundational tier model adapted for this client
- **ISL-04 Sensitivity Labeling Standards** — Purview label taxonomy applied to this classification
- **ISL-04 Data Handling Requirements** — per-tier handling rules referenced in Section 12
- **ISL-02 Metadata & Lineage** — classification labels stored as metadata in Purview Data Catalog
- **ISL-03 Naming Conventions** — tier encoding in naming (e.g., `ws_restricted_itar_engineering`)
- **ISL-06 Data Quality** — quality SLA thresholds vary by tier

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Data Governance Lead | Initial classification scheme for manufacturing client |
| 1.0 | 2025-01-15 | Cybersecurity Lead | ITAR overlay review and approval |
| 1.0 | 2025-01-15 | VP of Compliance (Empowered Official) | ITAR classification sign-off |

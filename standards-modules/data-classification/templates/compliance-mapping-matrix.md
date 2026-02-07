# Compliance Mapping Matrix
> ISL-04 | Integration Standards Library | v1.0

**Module:** ISL-04 — Data Classification & Sensitivity Framework
**Purpose:** Map regulatory and compliance requirements to classification tiers, defining per-regulation control requirements, audit obligations, penalty structures, overlap analysis, evidence collection, and gap analysis templates
**Adaptation Effort:** 4-6 hours
**Dependencies:** ISL-01 (API security controls for data-in-transit), ISL-03 (naming conventions for compliance-scoped assets), ISL-04 classification-tier-definitions (tier model), ISL-04 access-control-alignment (tier-based access controls)

---

## 1. Purpose

Organizations operating in regulated industries are subject to multiple, overlapping compliance frameworks that impose specific requirements on how data is classified, protected, accessed, retained, and audited. Without a systematic mapping between these regulations and the data classification model, organizations risk either (1) compliance gaps where regulatory requirements are not fully addressed by the classification controls, or (2) redundant controls where the same regulatory requirement is addressed multiple times across different initiatives, wasting resources.

This standard provides a master compliance mapping matrix that links every relevant regulation to the ISL-04 4-tier classification model, identifies the specific controls required per regulation per tier, defines audit and evidence requirements, analyzes regulatory overlaps, and provides a gap analysis template for engagement teams.

Use this standard when:
- Establishing a new data classification program in a regulated industry
- Conducting compliance gap analysis during platform migration to Fabric/Azure
- Preparing for regulatory audits (SOX, GDPR, ITAR, HIPAA, PCI-DSS)
- Evaluating how data classification controls satisfy multiple regulatory frameworks simultaneously
- Designing evidence collection and audit readiness programs
- Onboarding new regulatory obligations (e.g., new state privacy law, new export control determination)

---

## 2. Scope

### 2.1 In Scope

- Master compliance matrix covering SOX, GDPR, CCPA/CPRA, ITAR/EAR, HIPAA, PCI-DSS, NIST 800-171
- Per-regulation data type identification and minimum classification tier mapping
- Specific control requirements per regulation per tier
- Audit and reporting obligations per regulation
- Penalties and consequences for non-compliance
- Regulatory overlap analysis for multi-regulation data assets
- ISL control-to-regulation traceability matrix
- Evidence collection requirements for audit readiness
- Manufacturing-specific ITAR/EAR detailed requirements
- Compliance calendar for periodic reviews and certifications
- Gap analysis template for engagement teams
- Data residency and cross-border transfer rules

### 2.2 Out of Scope

- Legal interpretation of specific regulations (engagement legal counsel required)
- Jurisdiction-specific variations beyond US federal and EU (e.g., country-specific GDPR implementations)
- Industry-specific regulations not listed (e.g., FERPA, GLBA, FedRAMP) — add via adaptation
- Contractual compliance obligations (NDA, MSA, DPA) — engagement-specific
- Certification body selection and audit scheduling — client procurement

---

## 3. [ADAPTATION REQUIRED] Client Context

> Customize the following parameters for each engagement. Identify which regulations apply to the client and remove non-applicable sections.

| Parameter | Default Value | Client Value | Notes |
|-----------|--------------|-------------|-------|
| **Applicable Regulations** | SOX, GDPR, CCPA, ITAR, HIPAA, PCI-DSS, NIST 800-171 | ___________ | Remove non-applicable; add client-specific |
| **Primary Industry** | Manufacturing (defense/aerospace) | ___________ | Drives regulatory profile |
| **Geographic Scope** | US + EU operations | ___________ | Determines privacy law applicability |
| **Public Company (SOX)** | Yes | ___________ | If No, remove SOX section |
| **ITAR/EAR Applicable** | Yes | ___________ | If No, remove ITAR/EAR sections |
| **Healthcare Data Processed** | Limited (employee benefits) | ___________ | If No, reduce HIPAA scope |
| **Payment Card Processing** | Yes (customer payments) | ___________ | If No, remove PCI-DSS section |
| **Government Contracts (CUI)** | Yes (NIST 800-171) | ___________ | If No, remove NIST 800-171 section |
| **Audit Cycle** | Annual external audit + quarterly internal | ___________ | Adjust compliance calendar |
| **Compliance Team Size** | 3-5 FTE | ___________ | Affects evidence collection feasibility |
| **GRC Platform** | ServiceNow GRC | ___________ | Evidence repository and workflow tool |
| **External Auditor** | Big 4 firm | ___________ | May have specific evidence format requirements |

---

## 4. Master Compliance Matrix

### 4.1 Regulation-to-Tier Summary

| Regulation | Applicable Data Types | Minimum Tier | Primary ISL-04 Controls | Key Penalty Risk |
|-----------|----------------------|-------------|------------------------|-----------------|
| **SOX** | Financial data, internal controls, audit trails | Tier 3 (Confidential — Financial) | Encryption, access control, audit logging, retention | Criminal penalties up to 20 years; fines up to $5M individual |
| **GDPR** | Personal data of EU residents (PII) | Tier 3 (Confidential — PII) | Consent, access control, encryption, right to erasure, breach notification | Up to 4% global annual revenue or EUR 20M |
| **CCPA/CPRA** | Personal information of CA residents | Tier 3 (Confidential — PII) | Consumer rights, opt-out, access control, data inventory | $7,500 per intentional violation; private right of action for breaches |
| **ITAR** | Defense articles, technical data, defense services | Tier 4 (Restricted — ITAR) | US Person access, physical/logical isolation, export control, logging | Criminal: up to $1M and 20 years; civil: up to $500K per violation |
| **EAR** | Dual-use items, commercial items with military application | Tier 3-4 (depends on ECCN) | License determination, access control, end-use monitoring | Criminal: up to $1M and 20 years; civil: up to $300K per violation |
| **HIPAA** | Protected Health Information (PHI) | Tier 4 (Restricted — Sensitive PII) | Encryption, minimum necessary access, audit trail, breach notification | Up to $1.5M per violation category per year; criminal penalties |
| **PCI-DSS** | Cardholder data (CHD), sensitive authentication data (SAD) | Tier 4 (Restricted — Sensitive PII) | Encryption, network segmentation, access control, monitoring | Fines $5K-$100K/month; loss of card processing privileges |
| **NIST 800-171** | Controlled Unclassified Information (CUI) | Tier 3-4 (depends on CUI category) | 110 security requirements across 14 families | Loss of government contracts; False Claims Act liability |

### 4.2 Tier Applicability by Regulation

| Regulation | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Primary Data Types |
|-----------|--------|--------|--------|--------|-------------------|
| **SOX** | — | Partial (internal controls) | Primary | Primary | Financial data, audit trails, internal controls |
| **GDPR** | — | — | Primary | Primary | Personal data (PII), sensitive personal data |
| **CCPA/CPRA** | — | — | Primary | Primary | Consumer personal information |
| **ITAR** | — | — | — | Primary | Defense articles, technical data, USML items |
| **EAR** | — | — | Partial (EAR99) | Primary (CCL) | Dual-use items, technology, software |
| **HIPAA** | — | — | Partial (non-ePHI) | Primary (ePHI) | Protected health information |
| **PCI-DSS** | — | — | Partial (supporting) | Primary (CHD) | Cardholder data, authentication data |
| **NIST 800-53** | Low | Low | Moderate | High | All federal information systems |
| **ISO 27001** | Applicable | Applicable | Applicable | Applicable | All information assets |

---

## 5. Detailed Regulation Profiles

### 5.1 SOX (Sarbanes-Oxley Act)

**Applicable To:** Public companies listed on US exchanges and their subsidiaries

| Attribute | Detail |
|-----------|--------|
| **Applicable Data Types** | Financial statements, general ledger, journal entries, internal control documentation, audit work papers, management assertions, IT general controls evidence |
| **Minimum Classification Tier** | Tier 3 — Confidential (Financial) |
| **Upgrade to Tier 4 When** | Pre-announcement earnings, M&A financial modeling, material non-public information |
| **Key Sections** | Section 302 (CEO/CFO certification), Section 404 (internal controls assessment), Section 802 (document destruction penalties) |

**Control Requirements by Tier:**

| Control | Tier 3 — Confidential (Financial) | Tier 4 — Restricted (Material NPI) |
|---------|----------------------------------|--------------------------------------|
| Access control | Role-based; finance team + authorized auditors; quarterly review | Named individuals; JIT access via PIM; monthly review |
| Segregation of duties | Enforced (preparer/reviewer/approver separation) | Strictly enforced with system-enforced 4-eyes controls |
| Change management | All changes to financial systems documented and approved | All changes require dual approval + audit trail |
| Audit trail | All access and modifications logged; 7-year retention | All access logged with session recording; 7-year immutable retention |
| Encryption | AES-256 at rest (service-managed keys); TLS 1.2+ in transit | AES-256 with CMK at rest; end-to-end encryption |
| Data retention | 7 years minimum (per SEC Rule 17a-4) | 7 years minimum; crypto-shred on disposal |
| Backup and recovery | Daily backups; 4-hour RPO | Real-time replication; 1-hour RPO |
| Access review | Quarterly by data owner | Monthly by CFO delegate + auditor |

**Audit/Reporting Obligations:**

| Obligation | Frequency | Owner | Evidence Required |
|-----------|-----------|-------|-------------------|
| Internal control assessment (Section 404) | Annual | CFO / Controller | Control test results, deficiency documentation |
| External audit (financial statements) | Annual | External auditor | Financial data access logs, change management records |
| IT General Controls (ITGC) testing | Annual (with quarterly monitoring) | IT + Internal Audit | User access reviews, change logs, backup verification |
| Management assertion (Section 302) | Quarterly | CEO / CFO | Signed certification; supporting control evidence |
| **Penalties for Non-Compliance** | | | |
| Willful violation of Section 302 | — | — | Up to $5M fine and 20 years imprisonment |
| Willful violation of Section 802 | — | — | Up to $5M fine and 20 years imprisonment |
| Material weakness disclosure | — | — | Stock price impact; investor lawsuits |

### 5.2 GDPR (General Data Protection Regulation)

**Applicable To:** Organizations processing personal data of EU/EEA residents, regardless of organization location

| Attribute | Detail |
|-----------|--------|
| **Applicable Data Types** | Any data relating to an identified or identifiable natural person: name, email, IP address, location data, online identifiers, health data, genetic data, biometric data, racial/ethnic origin, political opinions, religious beliefs |
| **Minimum Classification Tier** | Tier 3 — Confidential (PII); Tier 4 for special categories (Article 9) |
| **Special Category Data (Article 9)** | Racial/ethnic origin, political opinions, religious beliefs, trade union membership, genetic data, biometric data, health data, sex life/orientation — always Tier 4 |

**Control Requirements by Tier:**

| Control | Tier 3 — Confidential (PII) | Tier 4 — Restricted (Special Category) |
|---------|------------------------------|----------------------------------------|
| Lawful basis | Documented lawful basis per Article 6 | Explicit consent or Article 9(2) exemption |
| Data minimization | Collect only necessary fields; purpose limitation documented | Strict minimization; no secondary use without consent |
| Access control | Role-based; need-to-know; MFA required | Named individuals; JIT access; FIDO2 MFA |
| Encryption | AES-256; pseudonymization recommended | AES-256 with CMK; pseudonymization required |
| Breach notification | 72 hours to supervisory authority (Art. 33); data subjects if high risk (Art. 34) | 72 hours to authority; without undue delay to data subjects |
| Data subject rights | Access, rectification, erasure, portability, objection; 30-day response | All rights plus right to withdraw consent; 15-day expedited response |
| DPIA | Required for high-risk processing (Art. 35) | Mandatory for all processing of special category data |
| Cross-border transfer | Adequate safeguards required (SCCs, BCRs, adequacy decision) | Enhanced safeguards; DPA consultation may be required |
| Retention | Purpose-limited; delete when no longer necessary | Minimum retention; delete immediately when purpose fulfilled |
| DPO involvement | Consultation for new processing activities | Mandatory DPO sign-off on all access and processing decisions |

**Penalties for Non-Compliance:**

| Violation Type | Maximum Fine | Examples |
|---------------|-------------|---------|
| Administrative/procedural (Art. 83(4)) | Up to 2% global annual revenue or EUR 10M | Failure to maintain ROPA, inadequate DPIA, no DPO appointment |
| Substantive/rights violations (Art. 83(5)) | Up to 4% global annual revenue or EUR 20M | Unlawful processing, breach of data subject rights, unauthorized transfer |

### 5.3 CCPA/CPRA (California Consumer Privacy Act / California Privacy Rights Act)

**Applicable To:** Businesses meeting revenue/data volume thresholds processing personal information of California residents

| Control | Tier 3 — Confidential (PI) | Tier 4 — Restricted (Sensitive PI) |
|---------|----------------------------|--------------------------------------|
| Consumer disclosure | Privacy notice at collection; categories of PI disclosed | Additional notice for sensitive PI; purpose limitation |
| Opt-out rights | Honor "Do Not Sell/Share" requests | Limit use to disclosed purpose; honor limit requests |
| Consumer access | Provide PI upon verified request within 45 days | Provide sensitive PI upon verified request within 45 days |
| Consumer deletion | Delete upon request (subject to exceptions) | Delete upon request; confirm deletion across all processors |
| Data minimization | Reasonable and proportionate to purpose | Strictly necessary for disclosed purpose only |
| Security | Reasonable security measures; encryption recommended | Enhanced security; encryption required |
| Service provider contracts | Written contract with use limitations | Written contract with enhanced audit rights |

**Penalties:** $2,500 per unintentional violation; $7,500 per intentional violation; private right of action $100-$750 per consumer for data breaches

### 5.4 ITAR (International Traffic in Arms Regulations)

**Applicable To:** Organizations manufacturing, exporting, or brokering defense articles, providing defense services, or handling ITAR-controlled technical data

| Attribute | Detail |
|-----------|--------|
| **Applicable Data Types** | Defense articles (USML-listed items), technical data (blueprints, drawings, specifications, test data), defense services, software directly related to defense articles |
| **Classification Tier** | Tier 4 — Restricted (ITAR) — no exceptions |
| **Governing Authority** | US Department of State, Directorate of Defense Trade Controls (DDTC) |
| **Key Regulation** | 22 CFR Parts 120-130 |

**Control Requirements:**

| Control | Requirement | ISL-04 Implementation |
|---------|-------------|----------------------|
| US Person access only | Only US citizens, permanent residents, or protected persons may access | Entra ID `usPersonVerified = true`; dynamic group; CA US-only location |
| Registration | Manufacturer/exporter must register with DDTC | Organization-level; DSP-9 form |
| Technology Control Plan (TCP) | Documented plan for safeguarding ITAR data | TCP ID required in PIM activation justification |
| Physical/logical separation | ITAR data in physically/logically secured environments | Dedicated Fabric workspace; dedicated Azure subscription |
| Deemed export prevention | Providing ITAR data to foreign person in US = export | Block VPN from non-US endpoints; IP geolocation enforcement |
| Marking | All ITAR documents must bear appropriate markings | Purview label `Highly Confidential\ITAR`; visual markings |
| Encryption | ITAR data encrypted at rest and in transit | AES-256 CMK; TLS 1.3; Double Key Encryption for highest sensitivity |
| Audit logging | All access logged and retained | 7-year retention; monthly access review |
| Incident reporting | Unauthorized disclosure reported to DDTC | 24-hour notification to Empowered Official; DDTC voluntary disclosure |
| Annual compliance review | Self-assessment of ITAR compliance program | Annual audit with documented findings and remediation |

**Penalties:** Criminal: up to $1M fine and 20 years imprisonment per violation; Civil: up to $500K per violation; debarment from government contracting

### 5.5 EAR (Export Administration Regulations)

**Applicable To:** Organizations exporting dual-use items, technology, or software subject to Commerce Control List

| Requirement | Tier 3 Controls (EAR99) | Tier 4 Controls (CCL Items) | Audit Evidence |
|------------|-------------------------|----------------------------|----------------|
| ECCN classification | Items classified; EAR99 determination documented | ECCN assigned by qualified export control officer | Classification records |
| Denied party screening | Consolidated screening list check before sharing | Real-time screening integration; end-use verification | Screening logs |
| License requirements | No license for EAR99 (most destinations) | License may be required based on ECCN/destination | License applications |
| Technology transfer | Deemed export controls; foreign national review | Enhanced nationality-based access in Entra ID | Deemed export assessments |
| Record keeping | 5 years from date of export | 5 years from date of export | Export records |

**Penalties:** Criminal: up to $1M and 20 years; Civil: up to $300K per violation or 2x transaction value; denial of export privileges

### 5.6 HIPAA (Health Insurance Portability and Accountability Act)

**Applicable To:** Covered entities and their business associates

| Control | Tier 3 Controls | Tier 4 Controls (ePHI) |
|---------|-----------------|------------------------|
| Privacy Rule | Minimum necessary standard; need-to-know | Enhanced minimum necessary; individual-level authorization |
| Security Rule — Administrative | Risk assessment; workforce training; contingency plan | Enhanced risk assessment; sanctions policy; BAA management |
| Security Rule — Technical | Access control (unique user ID, MFA); audit controls | Automatic logoff (1 hour); emergency access; encryption required |
| Security Rule — Physical | Facility access controls; workstation security | Dedicated secure areas; device encryption; media destruction |
| Breach notification | 60 days to individuals; 60 days to HHS (500+ breach) | Same + media notification (500+ in one state) |
| Business Associate Agreements | BAA with all vendors accessing PHI | BAA with enhanced audit rights |

**Penalties:** Tier 1: $100-$50K (unknowing); Tier 2: $1K-$50K (reasonable cause); Tier 3: $10K-$50K (willful neglect, corrected); Tier 4: $50K (willful neglect, not corrected); annual cap $1.5M per category

### 5.7 PCI-DSS v4.0

**Applicable To:** Organizations that store, process, or transmit cardholder data

| PCI-DSS Requirement | ISL-04 Control | Tier 4 Implementation |
|--------------------|----------------|----------------------|
| Req 1: Network security controls | Network segmentation for CDE | Dedicated workspace; Private Link; no public endpoints |
| Req 3: Protect stored account data | Encryption, tokenization, masking | AES-256 CMK; tokenization of PAN; DDM |
| Req 4: Encrypt transmission | TLS encryption | TLS 1.3; no wireless CHD transmission |
| Req 7: Restrict access by need | RBAC; least privilege | Named individuals; PIM; quarterly review |
| Req 8: Identify and authenticate | Unique IDs; MFA | Entra ID; FIDO2 MFA; no shared accounts |
| Req 10: Log and monitor all access | Audit logging | Full audit trail; 1-year retention; real-time monitoring |
| Req 12: Security policy | Security policies and procedures | ISL-04 framework; annual review |

**Penalties:** $5K-$100K per month of non-compliance (acquirer-imposed); liability for fraud losses; loss of processing privileges; brand damage

### 5.8 NIST SP 800-171 (Protecting CUI)

**Applicable To:** Non-federal organizations handling CUI under government contracts (DFARS 252.204-7012)

| Control Family | Key Requirements | ISL-04 Implementation |
|---------------|-----------------|----------------------|
| 3.1 Access Control | Limit system access; limit transactions; least privilege | Tier-based access groups; schema permissions; PIM |
| 3.3 Audit and Accountability | Create audit records; review and analyze logs | Enhanced logging for Tier 3-4; SOC review |
| 3.5 Identification and Authentication | Unique identification; MFA; password complexity | Entra ID; MFA per tier; FIDO2 for Tier 4 |
| 3.8 Media Protection | Media access; sanitization; transport | Encryption; crypto-shred; no USB for Tier 4 |
| 3.11 Risk Assessment | Periodic risk assessment; vulnerability scanning | Annual assessment; quarterly scans |
| 3.13 System/Communications Protection | Boundary protection; encryption | Network segmentation; TLS 1.2+; AES-256 |
| 3.14 System/Information Integrity | Flaw remediation; malware protection; monitoring | Patch management; Defender for Cloud; SIEM |

**Assessment:** NIST SP 800-171A; CMMC Level 2 for CUI; SPRS scoring
**Penalties:** Loss of government contracts; False Claims Act liability; debarment

---

## 6. Regulatory Overlap Analysis

### 6.1 Multi-Regulation Data Scenarios

When data is subject to multiple regulations simultaneously, controls must satisfy all applicable requirements. Apply the most restrictive control from each regulation.

| Data Scenario | Applicable Regulations | Most Restrictive Control Requirement | Minimum Tier |
|--------------|----------------------|-------------------------------------|-------------|
| Employee SSN + health plan selection | HIPAA + CCPA + GDPR (if EU employee) | HIPAA minimum necessary + GDPR explicit consent | Tier 4 |
| Customer PII + financial transaction | CCPA + SOX + PCI-DSS (if card data) | PCI-DSS full compliance (if card data present) | Tier 4 (card) / Tier 3 (no card) |
| Defense contractor employee health data | ITAR + HIPAA + NIST 800-171 | ITAR US Person + HIPAA minimum necessary + NIST full | Tier 4 |
| EU customer order with payment card | GDPR + PCI-DSS + CCPA (if CA resident) | GDPR cross-border + PCI-DSS encryption + CCPA rights | Tier 4 |
| Manufacturing process parameters for defense product | ITAR + Trade Secret law | ITAR controls (stricter than trade secret alone) | Tier 4 |
| Employee performance review (US-based, CA) | CCPA + SOX (if affects compensation accruals) | CCPA consumer rights + SOX audit trail | Tier 3 |
| IoT sensor data from defense manufacturing | ITAR (if reveals defense article performance) + NIST 800-171 | ITAR full controls | Tier 4 |
| Pre-release financial results for EU subsidiary | SOX + GDPR (if contains EU employee data) | SOX audit trail + GDPR cross-border safeguards | Tier 3-4 |

### 6.2 ISL-04 Control-to-Regulation Traceability

The following table shows which ISL-04 controls satisfy multiple regulatory requirements simultaneously, enabling efficient control deployment.

| ISL-04 Control | SOX | GDPR | CCPA | ITAR | HIPAA | PCI-DSS | NIST 800-171 |
|---------------|-----|------|------|------|-------|---------|-------------|
| AES-256 encryption at rest | Yes | Yes | Partial | Yes | Yes | Yes | Yes |
| TLS 1.2+ in transit | Yes | Yes | Partial | Yes | Yes | Yes | Yes |
| Customer-managed keys (CMK) | N/A | Yes | N/A | Yes | Yes | Yes | Yes |
| Role-based access control (RBAC) | Yes | Yes | Yes | Partial | Yes | Yes | Yes |
| MFA (Microsoft Authenticator) | Yes | Yes | N/A | Partial | Yes | Yes | Yes |
| MFA (FIDO2 security key) | Yes | Yes | N/A | Yes | Yes | Yes | Yes |
| Audit logging (all access) | Yes | Yes | N/A | Yes | Yes | Yes | Yes |
| Quarterly access review | Yes | Yes | N/A | Partial* | Yes | Partial | Yes |
| Monthly access review | Yes | Yes | N/A | Yes | Yes | Yes | Yes |
| Just-in-time access (PIM) | Yes | Yes | N/A | Yes | Yes | Yes | Yes |
| Dynamic Data Masking | Partial | Yes | Yes | N/A | Yes | Yes | Yes |
| Purview sensitivity labels | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| DLP policies | Partial | Yes | Yes | Yes | Yes | Partial | Yes |
| Breach notification (72 hrs) | N/A | Yes | Yes** | N/A | Partial*** | N/A | Yes |
| Data retention policy | Yes | Yes | Yes | Yes | Yes | Yes | Yes |

*ITAR requires monthly review minimum; **CCPA: "expeditiously, without unreasonable delay"; ***HIPAA: 60-day notification

---

## 7. Evidence Collection Requirements

### 7.1 Evidence Types by Regulation

| Regulation | Evidence Category | Specific Evidence | Collection Method | Retention |
|-----------|------------------|-------------------|-------------------|-----------|
| SOX | Access control | User access review completion reports | Entra ID Access Reviews export | 7 years |
| SOX | Change management | Change request tickets with approval chain | ServiceNow export | 7 years |
| SOX | Audit trail | System access logs for financial systems | Log Analytics query export | 7 years |
| SOX | Segregation of duties | Role-conflict analysis report | Identity governance tool export | 7 years |
| GDPR | Lawful basis | Records of Processing Activities (ROPA) | Data governance tool export | Duration of processing |
| GDPR | Consent | Consent records with timestamp and scope | Consent management platform export | Duration of processing + 3 years |
| GDPR | DSAR fulfillment | Request log with response time and outcome | Privacy management tool export | 3 years |
| GDPR | Breach response | Breach register with assessment and notification | Incident management export | 5 years |
| ITAR | US Person verification | Citizenship verification records | HR system + Empowered Official records | Employment duration + 5 years |
| ITAR | Access logging | Complete access log for all ITAR data | Log Analytics with 7-year retention | 7 years |
| ITAR | TCP compliance | Technology Control Plan with annual review | Document management system | Active + 5 years |
| HIPAA | Risk assessment | Annual HIPAA risk analysis report | GRC platform | 6 years |
| HIPAA | Access audit | PHI access logs with user identification | Log Analytics query export | 6 years |
| HIPAA | BAA inventory | Business associates with signed BAAs | Contract management system | Duration + 6 years |
| PCI-DSS | Vulnerability scans | ASV scan reports (quarterly) | Scanning vendor reports | 1 year |
| PCI-DSS | Penetration test | Annual penetration test report | Third-party assessor report | 1 year |
| NIST 800-171 | Self-assessment | NIST 800-171 assessment score (SPRS) | Assessment workbook | Current + all prior |
| NIST 800-171 | POA&M | Plan of Action and Milestones | GRC platform | Until closed + 3 years |

### 7.2 Evidence Storage and Access Control

| Attribute | Configuration |
|-----------|--------------|
| **Storage Location** | Dedicated compliance evidence SharePoint site + Azure Blob (long-term archive) |
| **Classification** | Tier 3 — Confidential (Business) |
| **Access** | Internal Audit + Compliance team + External auditors (time-limited guest) |
| **Retention** | Per regulation (longest applicable: 7 years for SOX/ITAR) |
| **Integrity** | Immutable storage (Azure Blob immutability policy) for audit evidence |
| **Backup** | Geo-redundant; daily backup; 30-day point-in-time recovery |
| **Chain of Custody** | All access logged; evidence files include SHA-256 hash for integrity verification |

---

## 8. Compliance Calendar

### 8.1 Annual Compliance Schedule

| Month | Activity | Regulation | Owner | Deliverable |
|-------|----------|-----------|-------|-------------|
| January | Annual compliance planning; set audit schedule | All | Compliance Lead | Annual compliance plan |
| January | DDTC registration renewal submission | ITAR | Empowered Official | DSP-9 registration form |
| February | HIPAA risk assessment initiation | HIPAA | Privacy Officer | Risk assessment project plan |
| March | Q1 internal control testing (ITGC) | SOX | Internal Audit | Q1 ITGC test results |
| March | Quarterly PCI-DSS ASV scan | PCI-DSS | IT Security | ASV scan report |
| April | NIST 800-171 self-assessment update | NIST 800-171 | CISO | Updated SPRS score |
| April | Annual ROPA review and update | GDPR | DPO | Updated ROPA register |
| May | HIPAA risk assessment completion | HIPAA | Privacy Officer | Risk assessment report + remediation plan |
| June | Q2 internal control testing (ITGC) | SOX | Internal Audit | Q2 ITGC test results |
| June | Quarterly PCI-DSS ASV scan | PCI-DSS | IT Security | ASV scan report |
| June | Semi-annual CCPA/CPRA opt-out mechanism audit | CCPA | Privacy Team | Opt-out compliance report |
| July | Mid-year compliance review | All | Compliance Lead | Mid-year status report |
| July | Annual TCP review and update | ITAR | Empowered Official | Updated TCP document |
| August | PCI-DSS annual penetration test | PCI-DSS | IT Security | Penetration test report |
| September | Q3 internal control testing (ITGC) | SOX | Internal Audit | Q3 ITGC test results |
| September | Quarterly PCI-DSS ASV scan | PCI-DSS | IT Security | ASV scan report |
| October | SOX external audit preparation | SOX | External Auditor + Finance | Audit planning memo |
| October | Annual privacy policy review | GDPR + CCPA | Legal + DPO | Updated privacy policy |
| November | CMMC assessment preparation | NIST 800-171 | CISO | Assessment readiness checklist |
| December | Q4 internal control testing (ITGC) | SOX | Internal Audit | Q4 ITGC test results |
| December | Quarterly PCI-DSS ASV scan | PCI-DSS | IT Security | ASV scan report |
| December | Annual compliance report | All | Compliance Lead | Annual compliance summary |

### 8.2 Recurring Activities (Non-Monthly)

| Activity | Frequency | Regulation | Owner |
|----------|-----------|-----------|-------|
| Tier 4 access review | Monthly | All (ITAR, HIPAA, PCI-DSS, SOX) | Data Owner + CISO |
| Tier 3 access review | Quarterly | All | Data Owner |
| Tier 2 access review | Annual | General | Group Owner |
| Data classification review (all assets) | Annual | All | Data Governance Council |
| Security awareness training | Annual (+ new hire) | All | HR + IT Security |
| ITAR-specific training | Annual (+ new hire for ITAR staff) | ITAR | Empowered Official |
| HIPAA training | Annual (+ new hire for PHI staff) | HIPAA | Privacy Officer |
| PCI-DSS training | Annual (+ new hire for CDE staff) | PCI-DSS | IT Security |
| Breach response tabletop exercise | Semi-annual | All | CISO + Legal |
| DLP policy review | Quarterly | GDPR, CCPA, ITAR | IT Security + DPO |
| Vendor compliance review | Annual | All | Procurement + Compliance |

---

## 9. Data Residency and Cross-Border Transfer

### 9.1 Data Residency Requirements

| Regulation | Residency Requirement | Tier 3 Implementation | Tier 4 Implementation |
|-----------|----------------------|----------------------|----------------------|
| **GDPR** | Adequate safeguards for EU-to-non-EU processing | Azure West Europe or North Europe; SCCs for non-EU | Azure West Europe only; no replication outside EU |
| **CCPA/CPRA** | No explicit residency; data accessible for DSARs | US-based Azure regions preferred | US-based; documented data location inventory |
| **ITAR** | US-only storage and processing | N/A (ITAR is always Tier 4) | US-only Azure regions; no geo-replication outside US |
| **HIPAA** | No explicit residency; BAA and security controls | US-based Azure regions; BAA with Microsoft | US-based; BAA; enhanced controls documentation |
| **PCI-DSS** | No explicit residency; network security required | PCI-compliant Azure regions | Dedicated PCI-scoped environment |

### 9.2 Cross-Border Transfer Rules

| Transfer Scenario | Legal Mechanism | Documentation | Controls |
|-------------------|----------------|---------------|----------|
| EU to US | EU-US Data Privacy Framework or SCCs | DPF certification or SCCs + TIA | SCCs + encryption + pseudonymization |
| EU to UK | UK adequacy decision or UK IDTA | Adequacy reliance documentation | Monitor adequacy status |
| US to any (ITAR) | DSP-5 license or exemption | State Department approval | US Persons only; no foreign transfer |
| Any to China | CAC security assessment or standard contract | Cross-border assessment | CAC assessment; Chinese DPO |
| Intra-company global | BCRs or SCCs | BCR approval or SCCs | Employee training; audit rights |

---

## 10. Gap Analysis Template

### 10.1 [ADAPTATION REQUIRED] Compliance Gap Assessment

> Complete this template during engagement onboarding to identify compliance coverage gaps in the client's current state.

| Regulation | Requirement | ISL-04 Control | Current State (Client) | Gap Identified | Severity | Remediation Action | Target Date | Owner |
|-----------|-------------|----------------|----------------------|----------------|----------|-------------------|------------|-------|
| SOX | Segregation of duties | Access-control Sec. 4.4 | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| SOX | 7-year audit log retention | Audit logging | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| GDPR | Records of Processing Activities | Data governance metadata | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| GDPR | 72-hour breach notification | Incident response | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| GDPR | Data subject request (30-day) | Privacy management | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| CCPA | Consumer opt-out mechanism | Privacy controls | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| ITAR | US Person verification | Access-control Sec. 16.1 | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| ITAR | Technology Control Plan | Physical/logical separation | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| ITAR | Dedicated ITAR environment | Workspace isolation | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| HIPAA | Minimum necessary enforcement | RLS/OLS + role groups | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| HIPAA | BAA inventory | Vendor management | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| PCI-DSS | CDE network segmentation | Network isolation | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| PCI-DSS | Quarterly ASV scanning | Vulnerability management | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| NIST 800-171 | SPRS self-assessment score | Assessment program | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |
| NIST 800-171 | POA&M for open items | Remediation tracking | ___________ | ___ | H/M/L | ___________ | ___/___/___ | ___________ |

### 10.2 [ADAPTATION REQUIRED] Industry-Specific Regulation Addendum

> If the client is subject to regulations not covered in this standard, add them here.

| Regulation | Jurisdiction | Applicable Data Types | Minimum Tier | Key Requirements | ISL-04 Controls | Gap |
|-----------|-------------|----------------------|-------------|------------------|----------------|-----|
| ___________ | ___________ | ___________ | ___ | ___________ | ___________ | ___ |
| ___________ | ___________ | ___________ | ___ | ___________ | ___________ | ___ |
| ___________ | ___________ | ___________ | ___ | ___________ | ___________ | ___ |

**Common additions by industry:**
- **Healthcare:** HITECH Act, state health privacy laws (e.g., CMIA in California)
- **Financial Services:** GLBA, FFIEC, NY DFS 23 NYCRR 500, SEC Regulation S-P
- **Education:** FERPA, COPPA
- **Government:** FedRAMP, FISMA, CJIS Security Policy
- **Energy/Utilities:** NERC CIP, TSA Pipeline Security Directives
- **Retail:** State breach notification laws (50 states), biometric privacy laws (BIPA)

---

## 11. Compliance Validation Checklists

### 11.1 SOX Compliance Checklist

- [ ] Financial data classified at Tier 3 or Tier 4
- [ ] Segregation of duties enforced for financial data entry and approval
- [ ] Quarterly access reviews completed for all financial data groups
- [ ] Audit trail captures all financial data access and modifications
- [ ] 7-year log retention configured and verified
- [ ] Change management process documented and followed for financial systems
- [ ] CEO/CFO certification process supported by access control evidence

### 11.2 GDPR Compliance Checklist

- [ ] Personal data classified at Tier 3 (standard PII) or Tier 4 (sensitive PII)
- [ ] ROPA maintained in Purview catalog with lawful basis documented
- [ ] DSAR process tested and operational (30-day SLA for Tier 3; 15-day for Tier 4)
- [ ] Data minimization implemented (retention limits, purpose limitation)
- [ ] Encryption at rest (AES-256) and in transit (TLS 1.2+) for all PII
- [ ] Cross-border transfer mechanisms in place (SCCs, adequacy, DPF)
- [ ] Breach notification process tested (72-hour DPA notification capability)
- [ ] DPO appointed and registered (if required)

### 11.3 ITAR Compliance Checklist

- [ ] All ITAR technical data identified and classified at Tier 4 (HC — ITAR)
- [ ] US Person verification completed for all individuals with ITAR access
- [ ] ITAR data stored in US-only Azure regions with no geo-replication outside US
- [ ] Logical separation (dedicated workspace/subscription) implemented
- [ ] ITAR markings applied to all documents and digital files
- [ ] Empowered Official designated and active
- [ ] Technology Control Plan documented and reviewed annually
- [ ] Annual ITAR compliance audit completed
- [ ] Deemed export controls implemented (foreign national access restricted)

### 11.4 HIPAA Compliance Checklist

- [ ] ePHI classified at Tier 4 (HC — Sensitive PII)
- [ ] Business Associate Agreements (BAAs) executed with all service providers
- [ ] Risk assessment completed (annual minimum)
- [ ] Workforce training completed and documented
- [ ] Access controls implemented (unique user ID, MFA, role-based)
- [ ] Audit trail captures all ePHI access (6-year retention)
- [ ] Breach notification process tested (60-day notification capability)
- [ ] Contingency/disaster recovery plan tested

### 11.5 PCI-DSS Compliance Checklist

- [ ] Cardholder data classified at Tier 4 (HC — Sensitive PII)
- [ ] Cardholder data environment (CDE) scope minimized; tokenization implemented
- [ ] Network segmentation implemented for CDE
- [ ] Encryption: AES-256 at rest (CMK), TLS 1.3 in transit
- [ ] Access restricted to named individuals with PIM
- [ ] Audit logs retained 1 year; available for immediate review (3 months)
- [ ] Quarterly vulnerability scans and annual penetration test completed
- [ ] PCI DSS SAQ or ROC completed and submitted

---

## 12. Fabric / Azure Implementation Guidance

### 12.1 Compliance Controls in Fabric

| Control | Fabric Implementation | Applicable Regulations |
|---------|----------------------|----------------------|
| Data encryption at rest | Fabric default (Microsoft-managed keys); CMK via Azure Key Vault for Tier 4 | All |
| Data encryption in transit | TLS 1.2+ (Fabric default); TLS 1.3 for PCI-DSS | All |
| Access control | Workspace roles + OneLake ACLs + SQL permissions per ISL-04 access-control-alignment | All |
| Audit logging | Fabric audit logs forwarded to Log Analytics workspace | All |
| Data Loss Prevention | Purview DLP policies applied to Fabric workspaces | GDPR, CCPA, ITAR |
| Sensitivity labeling | Purview labels on workspaces and items per ISL-04 labeling standard | All |
| Data residency | Fabric capacity region selection; multi-geo for compliance | GDPR, ITAR |
| Network isolation | Private Link; managed VNet for CDE and ITAR workspaces | PCI-DSS, ITAR, NIST 800-171 |
| Retention | Microsoft 365 retention policies; Azure Blob lifecycle management | SOX, HIPAA, ITAR |

### 12.2 Compliance Monitoring Configuration

| Monitoring Target | Tool | Alert Configuration | Response |
|------------------|------|---------------------|----------|
| Unauthorized access to Tier 4 data | Microsoft Sentinel | Custom analytics rule: non-approved user access | SOC investigation; potential breach |
| DLP policy violation | Microsoft Purview DLP | Alert on block actions for Tier 3-4 data | Data owner notification; incident review |
| Sensitivity label downgrade | Purview audit log | Alert on any Tier 4 label downgrade | CISO notification; justification review |
| External sharing of labeled content | Defender for Cloud Apps | Alert on external sharing of Confidential+ | Block + data owner notification |
| ITAR access from non-US location | Conditional Access + Sentinel | ITAR access attempt from non-US IP | Block + Empowered Official notification |
| Audit log gap | Azure Monitor | Alert if log pipeline stops > 1 hour | IT operations; compliance impact assessment |
| Failed breach notification SLA | GRC platform | Alert if breach assessment exceeds 4 hours | Escalate to CISO + Legal |

---

## 13. Manufacturing Overlay [CONDITIONAL]

> Include this section when the client has ITAR/EAR obligations, processes controlled technical data, or handles defense-related manufacturing data.

### 13.1 ITAR/EAR Detailed Control Requirements

| Control Area | ITAR Requirement | EAR Requirement | ISL-04 Implementation |
|-------------|-----------------|-----------------|----------------------|
| **Access Determination** | US Person only | US Person preferred; license may permit foreign access | Entra ID `usPersonVerified` attribute; dynamic group; CA |
| **License Management** | DSP-5, TAA, MLA required for exports | License per Commerce Control List | License tracking in GRC; access conditioned on license |
| **End-Use Monitoring** | Prohibited end-uses tracked | Prohibited per EAR Part 744 | Approval workflow; no self-service access |
| **Deemed Export** | Any release to foreign person = export | Same | Block foreign-person accounts from ITAR/EAR workspaces |
| **Re-Export** | Requires State Department approval | Requires BIS approval | DLP: block forwarding/sharing of labeled content |
| **Record Keeping** | 5 years from export date | 5 years from export date | 7-year retention (exceeds requirement) |

### 13.2 ITAR Technical Data Marking Requirements

| Document Type | Required Marking | Placement | ISL-04 Implementation |
|--------------|-----------------|-----------|----------------------|
| Technical drawings | ITAR statement + USML category | Title block + every page | Purview label `HC — ITAR`; visual markings |
| Digital files | ITAR label + file properties | Purview label + metadata | `USML_Category`, `ECCN`, `Distribution` metadata |
| Emails with ITAR content | ITAR warning in subject and body | Subject prefix + body header | Auto-labeling rule; DLP transport rule |
| Database records | ITAR flag column + RLS | Classification metadata column | `is_itar = TRUE`, `usml_category`, `distribution` |

### 13.3 Trade Secret Compliance (DTSA)

| Requirement | Implementation | Evidence |
|------------|----------------|----------|
| Reasonable measures to maintain secrecy | Tier 4 classification; PIM; NDA tracking | Classification records, PIM logs, NDA database |
| Identification of trade secrets | Purview catalog tagged `HC\Trade Secret` | Catalog export, labeling audit |
| Access limitation | Named-individual PIM access; monthly recertification | Access review certifications |
| Employee awareness | Annual training; policy acknowledgment | Training records, acknowledgments |
| Exit procedures | Automated deprovisioning; exit interview; continued NDA | Deprovisioning logs, exit records |

### 13.4 EAR ECCN Classification Reference

| ECCN Category | Description | Tier | Example Items |
|--------------|-------------|------|---------------|
| 0 — Nuclear | Nuclear materials, facilities, equipment | 4 | Reactor components, enrichment equipment |
| 1 — Materials | Special alloys, composites, coatings | 3-4 | Specialty alloys, protective coatings |
| 2 — Materials Processing | CNC machines (5-axis+), additive manufacturing | 3-4 | 5-axis CNC, metal 3D printers |
| 3 — Electronics | Microprocessors, FPGAs, signal processing | 3-4 | Advanced processors, FPGAs |
| 5 — Telecommunications | Encryption, network security equipment | 3-4 | Encryption software, security appliances |
| 9 — Propulsion | Aerospace propulsion systems | 4 | Gas turbines, rocket components |
| EAR99 | Items subject to EAR but not on CCL | 2-3 | Standard commercial equipment |

---

## 14. Cross-References

| ISL Module | Relationship to This Standard |
|-----------|-------------------------------|
| **ISL-01 — API Governance** | API security controls (authentication, authorization, encryption) map to compliance requirements for data-in-transit |
| **ISL-02 — Metadata & Lineage** | Compliance metadata (regulation, lawful basis, retention) stored in Purview Catalog; lineage tracks regulated data flow |
| **ISL-03 — Naming Conventions** | Compliance-scoped workspaces, schemas, and groups follow ISL-03 patterns |
| **ISL-04 — Classification Tier Definitions** | Tier definitions are the foundation; this standard maps regulations to those tiers |
| **ISL-04 — Sensitivity Labeling Standards** | Labels enforce regulatory controls (encryption, DLP, access restriction) |
| **ISL-04 — Access Control Alignment** | Access control patterns implement per-regulation access requirements defined here |
| **ISL-04 — Data Handling Requirements** | Handling requirements implement regulatory obligations for storage, transmission, retention |
| **ISL-04 — Classification Decision Tree** | Decision tree uses regulatory applicability as a classification input |
| **ISL-05 — Integration Patterns** | Pipeline design must respect regulatory boundaries (no cross-tier flow without controls) |
| **ISL-06 — Data Quality** | Quality requirements may be compliance-driven (SOX accuracy, HIPAA integrity) |

---

## 15. Compliance Alignment

| Framework | Relevant Controls | How This Standard Addresses |
|-----------|------------------|----------------------------|
| **NIST SP 800-53 Rev. 5** | RA-2 (Security Categorization), RA-3 (Risk Assessment), PL-2 (System Security Plan), AU-2 (Audit Events) | Classification-to-regulation mapping provides categorization basis; gap analysis supports risk assessment |
| **ISO 27001:2022** | A.5.31 (Legal Requirements), A.5.34 (Privacy/PII), A.5.36 (Compliance with Policies) | Regulation profiles define legal and privacy requirements; compliance calendar ensures periodic review |
| **DAMA DMBOK** | Chapter 7 — Data Security, Chapter 13 — Data Governance | Compliance mapping integrates with governance program; evidence collection supports maturity |
| **CAF (Cloud Adoption Framework)** | Regulatory compliance discipline, Security baseline discipline | Fabric implementation guidance aligns to CAF compliance and security disciplines |
| **COBIT 2019** | MEA03 (Compliance with External Requirements), APO12 (Managed Risk) | Compliance matrix and gap analysis directly support COBIT objectives |
| **CMMC** | All 17 domains (maps to NIST 800-171) | NIST 800-171 section provides CMMC Level 2 coverage |

---

## 16. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | ISL Working Group | Initial release — compliance mapping matrix |
| — | — | — | — |

---

## Adaptation Guide

> **For engagement teams:** Customize the sections below for each client.

- [ ] Complete the Client Context parameter table (Section 3) with confirmed applicable regulations
- [ ] Remove regulation sections that do not apply to the client (e.g., remove ITAR for non-defense)
- [ ] Add any client-specific regulations not covered (e.g., GLBA for financial services, FERPA for education)
- [ ] Validate minimum classification tier assignments against client's risk appetite and legal counsel
- [ ] Review regulatory overlap scenarios against client's actual data landscape
- [ ] Complete the Gap Analysis Template (Section 10.1) during engagement onboarding
- [ ] Adjust the Compliance Calendar (Section 8) to client's fiscal year and audit schedule
- [ ] Confirm evidence collection methods are compatible with client's GRC platform
- [ ] Validate ITAR/EAR applicability with client's Empowered Official or export compliance team
- [ ] Review penalties and consequences with client legal counsel for jurisdiction accuracy
- [ ] Map client's existing compliance controls to ISL-04 to identify re-use opportunities
- [ ] Confirm evidence retention periods meet regulatory minimums and records management policy
- [ ] Validate cross-border transfer mechanisms for client's international data flows

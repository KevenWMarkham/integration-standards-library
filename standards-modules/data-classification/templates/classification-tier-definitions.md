# Classification Tier Definitions
> Module: ISL-04 | Version: 1.0 | Adaptation Effort: 3-5 hrs | Dependencies: ISL-03

## Purpose

Define the 4-tier data classification model with formal definitions, sensitivity criteria, data examples, handling summaries, ownership responsibilities, and Microsoft Purview label mappings. This document is the anchor standard for ISL-04 and establishes the foundational classification scheme referenced by all other ISL-04 templates, ISL-01 API security controls, ISL-02 metadata attributes, ISL-03 naming encodings, and ISL-06 quality SLAs.

Data classification is the foundational control that determines how every data asset is stored, transmitted, shared, retained, and accessed. Without a clear, consistently applied classification scheme, organizations cannot enforce proportional security controls and will either over-protect low-value data (wasting productivity) or under-protect high-value data (creating compliance and breach risk).

---

## Scope

### In Scope

- Definition of 4 classification tiers applicable to all structured, semi-structured, and unstructured data
- Sensitivity criteria, data examples, and handling summaries for each tier
- Tier boundary decision guidelines and escalation rules
- Default classification rules and "classify up" policy
- Reclassification triggers, approval workflows, and lifecycle management
- Multi-tier data handling rules (mixed-classification datasets)
- Classification lifecycle from creation through disposal
- Microsoft Purview Information Protection label alignment per tier
- Manufacturing-specific classification examples and overlays (IoT, ITAR, BOM)

### Out of Scope

- Detailed sensitivity label configuration (see ISL-04 `sensitivity-labeling-standards.md`)
- Per-tier handling requirements for storage, transmission, and access (see ISL-04 `data-handling-requirements.md`)
- Physical media classification and handling (physical security program)
- Government security classification markings (FOUO, CUI, SECRET) beyond ITAR/EAR
- Data quality SLA definitions by tier (see ISL-06 Data Quality Framework)
- DLP policy configuration details (see ISL-04 `sensitivity-labeling-standards.md`)

---

## [ADAPTATION REQUIRED] Client Context

> Engagement teams must complete this parameter table before deploying the classification model.

| Parameter | Default Value | Client Value | Notes |
|-----------|--------------|-------------|-------|
| Number of classification tiers | 4 | _______________ | 4-tier model recommended; 3 or 5 tiers supported with justification |
| Tier 1 display name | Public | _______________ | Some clients use "Unrestricted" or "Open" |
| Tier 2 display name | Internal | _______________ | Some clients use "General" or "Business Use" |
| Tier 3 display name | Confidential | _______________ | Some clients use "Sensitive" or "Restricted" |
| Tier 4 display name | Restricted | _______________ | Some clients use "Highly Confidential" or "Top Secret" |
| Default classification for unclassified data | Tier 2 — Internal | _______________ | Must be at least Tier 2; never default to Public |
| Classification color palette | Green/Blue/Amber/Red | _______________ | Must be colorblind-accessible; validate with client branding |
| Purview label prefix | None | _______________ | Some clients prefix labels with org abbreviation (e.g., `ACME-Confidential`) |
| ITAR/EAR applicability | Yes (manufacturing) | _______________ | Set "No" for non-defense, non-manufacturing clients |
| Primary regulatory drivers | GDPR, CCPA, SOX | _______________ | Add HIPAA, FERPA, GLBA, PCI-DSS as applicable |
| Data owner role title | Data Owner | _______________ | May map to "Data Trustee", "Information Owner", or "Domain Lead" |
| Data steward role title | Data Steward | _______________ | May map to "Data Custodian", "Data Champion", or "Governance Analyst" |
| Classification review cadence — Tier 3 | Quarterly | _______________ | Range: monthly to semi-annually |
| Classification review cadence — Tier 4 | Monthly | _______________ | Range: weekly to quarterly |
| Escalation contact for classification disputes | Data Governance Council | _______________ | Must be a named body or individual |
| Manufacturing overlay required | Yes | _______________ | Set "No" if client has no manufacturing operations |

---

## 1. Tier Model Summary

| Attribute | Tier 1 — Public | Tier 2 — Internal | Tier 3 — Confidential | Tier 4 — Restricted |
|-----------|-----------------|--------------------|-----------------------|---------------------|
| **Icon** | `[PUB]` | `[INT]` | `[CON]` | `[RES]` |
| **Color Code** | Green (#2E7D32) | Blue (#1565C0) | Amber (#F57F17) | Red (#C62828) |
| **Purview Label** | `Public` | `Internal` | `Confidential` | `Highly Confidential` |
| **Impact if Disclosed** | None | Low — minor inconvenience | Moderate — financial loss, regulatory fine, reputational damage | Severe — existential threat, criminal liability, national security |
| **Default Encryption at Rest** | Platform default | Platform default (AES-256) | AES-256, service-managed keys | AES-256, customer-managed keys (CMK) |
| **Default Sharing** | Unrestricted | Internal only | Need-to-know, named teams | Named individuals, JIT access |
| **Access Review Cadence** | None | Annual | Quarterly | Monthly |
| **Purview Label Priority** | 0 (lowest) | 1 | 2 | 3 (highest) |
| **Typical Owner** | Communications / Marketing | Department heads | Data domain owners / Data stewards | CISO, Legal, Empowered Officials |
| **Review Cadence** | Annual or on public release | Annual | Quarterly | Monthly |

---

## 2. Tier 1 — Public

### 2.1 Formal Definition

Data explicitly approved for unrestricted distribution to any audience, including external parties, the general public, and competitors. Disclosure of Public data causes no harm to the organization, its customers, or its partners. Data is Public only if it has been affirmatively designated as such through an approval process — data is never Public by default.

### 2.2 Sensitivity Criteria

- No regulatory protection requirements apply
- Information is already publicly available or intended for public release
- Disclosure would cause no competitive, financial, legal, or reputational harm
- No personally identifiable information (PII) is present
- No contractual confidentiality obligations exist
- Content has been reviewed and approved for public release by an authorized approver

### 2.3 Data Examples

| # | Data Element | Domain | Rationale |
|---|-------------|--------|-----------|
| 1 | Published annual reports (10-K, 10-Q) | Finance | SEC-mandated public disclosure |
| 2 | Marketing brochures and datasheets | Marketing | Designed for external distribution |
| 3 | Published product specifications | Engineering | Publicly available on website |
| 4 | Press releases | Communications | Intended for media distribution |
| 5 | Public job postings | HR | Posted on external job boards |
| 6 | Company address and phone number | General | Listed on public website |
| 7 | Published patent documents | Legal/IP | Public record after filing |
| 8 | Open-source code contributions | Engineering | Licensed for public use |
| 9 | Published safety data sheets (SDS) | EHS | Regulatory requirement to publish |
| 10 | Public product recall notices | Quality | Regulatory-mandated disclosure |
| 11 | Published sustainability reports | Corporate | Voluntary public disclosure |
| 12 | Trade show presentation decks | Marketing | Presented at public events |
| 13 | Public regulatory filings | Legal | Filed with government agencies |
| 14 | Published API documentation | Engineering | Developer portal content |
| 15 | Company mission and values statements | Corporate | Published on website |
| 16 | Published industry benchmark participation | Finance | Anonymized, aggregated data |
| 17 | Published case studies and white papers | Marketing | Approved for public consumption |
| 18 | Open data feeds (weather, public census) | Data Science | Government open data |
| 19 | Published product warranty terms | Legal | Customer-facing documentation |
| 20 | Published compliance certifications (ISO badges) | Quality | Public trust indicators |

### 2.4 Default Handling Summary

- **Storage:** Any approved platform; no special encryption beyond platform defaults
- **Transmission:** Any channel; no restrictions on email, messaging, or file sharing
- **Sharing:** Unrestricted internally and externally
- **Retention:** Per records management schedule; no accelerated disposal required
- **Access Control:** Authenticated users (prevents anonymous modification, not access)
- **Monitoring:** Standard platform logging; no enhanced monitoring required

### 2.5 Typical Owners and Responsibilities

| Role | Responsibility |
|------|---------------|
| Communications / Marketing Lead | Approves public release designation |
| Content Creator | Requests public classification with justification |
| Legal | Validates no IP, contractual, or regulatory conflicts |
| Data Steward | Registers classification in Purview catalog |

### 2.6 Purview Label Mapping

- **Label Name:** `Public`
- **Tooltip:** "This data is approved for unrestricted public distribution. No special handling required."
- **Visual Marking:** Green footer — "Classification: PUBLIC"
- **Encryption:** None
- **Content Marking:** Footer text on documents

---

## 3. Tier 2 — Internal

### 3.1 Formal Definition

Data intended for use within the organization by employees and authorized contractors. Internal data is not sensitive enough to require need-to-know restrictions, but it is not approved for external distribution. Unauthorized disclosure would cause minor inconvenience or operational disruption but no significant financial, legal, or reputational damage. **This is the default classification for data that has not been explicitly classified.**

### 3.2 Sensitivity Criteria

- Information supports routine business operations
- No regulatory protection requirements beyond standard business data protections
- Disclosure to competitors would provide minor advantage but not cause material harm
- No PII beyond basic business contact information (name, title, business email)
- No financial data that could affect stock price or contractual negotiations
- General operational information not intended for public consumption

### 3.3 Data Examples

| # | Data Element | Domain | Rationale |
|---|-------------|--------|-----------|
| 1 | Internal org charts | HR | Internal structure, not competitively sensitive |
| 2 | Meeting minutes (non-sensitive topics) | General | Routine operational records |
| 3 | Internal project plans and timelines | PMO | Operational, not strategic |
| 4 | Internal training materials | HR/L&D | Developed for internal use |
| 5 | Office and facility floor plans | Facilities | Internal reference, minor security concern |
| 6 | Internal policies and procedures | Governance | Employee-facing documents |
| 7 | Non-sensitive email communications | General | Routine business correspondence |
| 8 | Internal newsletter content | Communications | Employee communications |
| 9 | General IT system documentation | IT | Architecture diagrams, runbooks |
| 10 | Non-financial KPI dashboards | Operations | Aggregated operational metrics |
| 11 | Approved vendor lists (non-strategic) | Procurement | Standard vendor information |
| 12 | Equipment maintenance schedules | Manufacturing | Routine operational data |
| 13 | Production shift schedules | Manufacturing | Standard scheduling data |
| 14 | Internal knowledge base articles | IT/Operations | Self-service documentation |
| 15 | Aggregated production volume reports | Manufacturing | Non-granular operational metrics |
| 16 | Internal event calendars | General | Employee event information |
| 17 | Standard operating procedures (non-IP) | Operations | Process documentation without trade secrets |
| 18 | Corporate travel policies | Finance | Internal expense guidelines |
| 19 | Internal survey results (non-HR-sensitive) | General | Aggregated employee feedback |
| 20 | Conference room booking schedules | Facilities | Operational scheduling data |
| 21 | IT service catalog descriptions | IT | Internal service offerings |
| 22 | General safety training materials | EHS | Required employee training content |

### 3.4 Default Handling Summary

- **Storage:** Approved enterprise platforms (SharePoint, OneLake, Azure SQL); platform-default encryption (AES-256)
- **Transmission:** Internal channels preferred; external transmission requires manager awareness
- **Sharing:** Internal employees and authorized contractors; no external sharing without approval
- **Retention:** Per records management schedule; standard disposal procedures
- **Access Control:** All authenticated employees and authorized contractors; no special authorization required
- **Monitoring:** Standard audit logging; annual access review

### 3.5 Typical Owners and Responsibilities

| Role | Responsibility |
|------|---------------|
| Department Head | Accountable for department's internal data |
| Content Creator | Applies Internal label at creation or accepts default |
| Data Steward | Monitors for misclassification, ensures catalog accuracy |
| IT Security | Enforces external sharing blocks for Internal-labeled content |

### 3.6 Purview Label Mapping

- **Label Name:** `Internal`
- **Tooltip:** "This data is for internal use only. Do not share outside the organization without approval."
- **Visual Marking:** Blue footer — "Classification: INTERNAL — Do Not Distribute Externally"
- **Encryption:** Optional (organization-default)
- **Content Marking:** Footer and header text on documents

---

## 4. Tier 3 — Confidential

### 4.1 Formal Definition

Data that is sensitive and restricted to authorized personnel with a demonstrated business need-to-know. Confidential data includes personally identifiable information, financial data not yet publicly disclosed, customer information, trade partner data, and business strategies. Unauthorized disclosure could result in regulatory fines, competitive disadvantage, contractual breach, litigation, or moderate reputational damage. Access requires explicit authorization from a data owner or steward.

### 4.2 Sensitivity Criteria

- Contains personally identifiable information (PII) subject to GDPR, CCPA, or similar regulations
- Financial information that could affect stock price, contractual negotiations, or competitive position
- Customer data subject to contractual confidentiality obligations
- Business strategies, plans, or forecasts not yet finalized or approved for broader distribution
- Data subject to specific regulatory requirements (SOX controls, HIPAA, PCI-DSS)
- Vendor or partner information subject to NDA or contractual protections
- Information whose disclosure would provide material competitive advantage to competitors

### 4.3 Sub-Classifications

| Sub-Classification | Label Suffix | Description | Additional Controls |
|-------------------|-------------|-------------|---------------------|
| Confidential — PII | `Confidential\PII` | Personal data of employees, customers, or partners | GDPR/CCPA controls, DSAR readiness, consent tracking |
| Confidential — Financial | `Confidential\Financial` | Pre-release financial data, forecasts, pricing | SOX controls, insider trading prevention, limited distribution |
| Confidential — Business | `Confidential\Business` | Strategies, plans, M&A exploration (early), contracts | NDA enforcement, watermarking, limited distribution lists |
| Confidential — Customer | `Confidential\Customer` | Customer-provided data, usage data, contractual information | Contractual compliance, customer notification requirements |
| Confidential — Technical | `Confidential\Technical` | Engineering designs, source code, process docs (non-trade-secret) | IP protection, code repository access controls |

### 4.4 Data Examples

| # | Data Element | Domain | Sub-Class | Rationale |
|---|-------------|--------|-----------|-----------|
| 1 | Customer names, addresses, contact info | Sales | PII | GDPR/CCPA regulated personal data |
| 2 | Employee home addresses and phone numbers | HR | PII | Employee personal data |
| 3 | Quarterly financial results (pre-release) | Finance | Financial | SOX, insider trading risk |
| 4 | Customer pricing agreements | Sales | Customer | Contractual, competitive |
| 5 | Vendor contracts and terms | Procurement | Business | NDA-protected, negotiation leverage |
| 6 | Strategic business plans | Executive | Business | Competitive advantage if disclosed |
| 7 | Employee performance reviews | HR | PII | Privacy-sensitive personnel data |
| 8 | Customer complaints and case history | Quality | Customer | Contractual, reputational |
| 9 | IT vulnerability scan results | IT Security | Technical | Exploitable if disclosed |
| 10 | Audit findings and remediation plans | Internal Audit | Financial | Regulatory, reputational |
| 11 | Budget forecasts by department | Finance | Financial | Pre-decisional financial data |
| 12 | Source code (proprietary, non-trade-secret) | Engineering | Technical | IP, competitive |
| 13 | Employee benefits enrollment data | HR | PII | Contains health plan selections, dependents |
| 14 | Sales pipeline and forecasts | Sales | Business | Competitive intelligence risk |
| 15 | Legal case files (non-privileged) | Legal | Business | Litigation risk, reputational |
| 16 | Customer order history and volumes | Sales | Customer | Contractual, competitive |
| 17 | Non-conformance reports (NCRs) | Quality | Technical | Process weakness disclosure risk |
| 18 | Network architecture diagrams (detailed) | IT | Technical | Security risk if disclosed |
| 19 | Employee date of birth | HR | PII | Regulated personal data |
| 20 | Insurance policy details | Finance | Financial | Contractual, financial exposure |
| 21 | Supplier quality audit reports | Quality | Business | Partner relationship, competitive |
| 22 | Internal cost-of-goods-sold breakdowns | Finance | Financial | Margin visibility, competitive |

### 4.5 Default Handling Summary

- **Storage:** Approved enterprise platforms only; AES-256 encryption at rest with service-managed keys minimum
- **Transmission:** Encrypted channels required (TLS 1.2+); no personal email; approved file-sharing platforms only
- **Sharing:** Need-to-know basis; team/role-based access; external sharing requires data owner approval and DLP policy compliance
- **Retention:** Per regulatory and records management schedule; certified disposal required
- **Access Control:** Role-based with explicit data owner authorization; MFA required; quarterly access reviews
- **Monitoring:** Enhanced audit logging; quarterly access reviews; DLP policy enforcement

### 4.6 Typical Owners and Responsibilities

| Role | Responsibility |
|------|---------------|
| Data Owner (domain) | Authorizes access, approves sharing, reviews classification |
| Data Steward | Manages day-to-day classification, validates auto-labeling |
| IT Security | Monitors DLP alerts, enforces encryption, reviews access |
| Privacy Officer (for PII) | Ensures GDPR/CCPA compliance, manages DSARs |

### 4.7 Purview Label Mapping

- **Label Name:** `Confidential` (parent, not directly assignable)
- **Tooltip:** "This data is restricted to authorized personnel with a business need-to-know. MFA required."
- **Visual Marking:** Amber header and footer — "Classification: CONFIDENTIAL — Authorized Personnel Only"
- **Encryption:** Azure RMS encryption with organization-scoped permissions
- **Content Marking:** Header, footer, and watermark on documents
- **DLP Policy:** Block external sharing; warn on internal sharing outside approved groups

---

## 5. Tier 4 — Restricted

### 5.1 Formal Definition

Data of the highest sensitivity whose unauthorized disclosure, modification, or destruction could cause severe or catastrophic harm to the organization, its customers, national security, or individual safety. Restricted data includes trade secrets, ITAR/EAR-controlled technical data, executive-level M&A information, data protected by legal privilege, and sensitive personal data categories (health, financial account numbers, biometrics). Access is limited to named individuals through just-in-time provisioning with mandatory multi-factor authentication and continuous monitoring.

### 5.2 Sensitivity Criteria

- Trade secrets as defined under the Defend Trade Secrets Act (DTSA) or equivalent jurisdiction
- Export-controlled data under ITAR (22 CFR) or EAR (15 CFR)
- Data whose disclosure could result in criminal liability, significant regulatory penalties, or national security harm
- Sensitive personal data categories: health information, financial account numbers, government identifiers (SSN, passport), biometric data
- Legal privilege (attorney-client, work product doctrine)
- M&A transaction data, board-level strategic decisions prior to announcement
- Data subject to specific government security classification markings
- Competitive intelligence whose disclosure would cause material, quantifiable harm

### 5.3 Sub-Classifications

| Sub-Classification | Label Suffix | Description | Additional Controls |
|-------------------|-------------|-------------|---------------------|
| Restricted — ITAR | `Highly Confidential\ITAR` | Technical data under ITAR 22 CFR | US Person only, physical/logical isolation, State Dept. reporting |
| Restricted — Trade Secret | `Highly Confidential\Trade Secret` | Proprietary IP meeting trade secret legal criteria | Numbered copies, access logging, NDA enforcement, CMK required |
| Restricted — PII Sensitive | `Highly Confidential\Sensitive PII` | SSN, health data, financial accounts, biometrics | HIPAA/PCI-DSS controls, tokenization, strong encryption |
| Restricted — Legal Privilege | `Highly Confidential\Legal` | Attorney-client privileged communications | Privilege log, restricted to legal team and named individuals |
| Restricted — Executive | `Highly Confidential\Executive` | M&A, board materials, executive compensation | Named individual access, watermarking, session recording |

### 5.4 Data Examples

| # | Data Element | Domain | Sub-Class | Rationale |
|---|-------------|--------|-----------|-----------|
| 1 | ITAR-controlled technical drawings | Engineering | ITAR | Federal law; criminal penalties |
| 2 | Proprietary alloy compositions/formulations | R&D | Trade Secret | Core competitive IP |
| 3 | Manufacturing process parameters (proprietary) | Manufacturing | Trade Secret | Equipment settings, yield optimization |
| 4 | Social Security Numbers (SSN) | HR | Sensitive PII | Identity theft risk; regulated |
| 5 | Bank account and routing numbers | Finance/HR | Sensitive PII | Financial fraud risk; PCI-DSS |
| 6 | Health and medical records | HR | Sensitive PII | HIPAA-protected |
| 7 | M&A target evaluations and deal terms | Executive | Executive | Material non-public information |
| 8 | Board meeting minutes (pre-approval) | Executive | Executive | Fiduciary, strategic |
| 9 | Attorney-client privileged communications | Legal | Legal Privilege | Legal privilege protection |
| 10 | Biometric authentication templates | IT Security | Sensitive PII | Irreplaceable if compromised |
| 11 | Encryption keys and certificates | IT Security | Trade Secret | Cryptographic material |
| 12 | Executive compensation details | HR | Executive | Contractual, competitive |
| 13 | Penetration test reports | IT Security | Trade Secret | Exploitable vulnerability details |
| 14 | Customer credit card numbers (full PAN) | Finance | Sensitive PII | PCI-DSS regulated |
| 15 | ECCN-classified technical data | Engineering | ITAR | Export control regulated |
| 16 | Patent applications (pre-filing) | Legal/R&D | Trade Secret | Loss of patent rights if disclosed |
| 17 | Whistleblower investigation files | Legal/HR | Legal Privilege | Legal protection, retaliation risk |
| 18 | Defense contract technical deliverables | Engineering | ITAR | Government-classified |
| 19 | Employee disciplinary records | HR | Sensitive PII | Privacy, legal liability |
| 20 | Proprietary machine learning model weights | Data Science | Trade Secret | Core IP, competitive advantage |
| 21 | Customer biometric enrollment data | IT Security | Sensitive PII | BIPA/GDPR special category |
| 22 | Unreleased product formulation specs | R&D | Trade Secret | Pre-patent core IP |

### 5.5 Default Handling Summary

- **Storage:** Dedicated isolated environments; AES-256 encryption at rest with customer-managed keys (CMK); Azure Key Vault HSM; no personal devices
- **Transmission:** End-to-end encryption required; VPN or ExpressRoute for network transit; no email; approved secure transfer only
- **Sharing:** Named individuals only; just-in-time (JIT) access via PIM; external sharing prohibited unless contract-mandated with legal approval
- **Retention:** Minimum required by regulation; crypto-shred on disposal; certified destruction with chain of custody
- **Access Control:** Named individuals with JIT/PIM; MFA with phishing-resistant methods (FIDO2); continuous session monitoring; monthly access recertification
- **Monitoring:** Real-time SOC alerting; continuous session monitoring; monthly access recertification; anomaly detection

### 5.6 Typical Owners and Responsibilities

| Role | Responsibility |
|------|---------------|
| CISO | Accountable for Restricted tier controls and incident response |
| Legal Counsel | Manages privilege, ITAR compliance, trade secret designation |
| Empowered Official (ITAR) | Authorizes access to ITAR-controlled data; US Person verification |
| Data Owner (named) | Maintains access list; performs monthly recertification |
| SOC Analyst | Monitors real-time access alerts; initiates incident response |

### 5.7 Purview Label Mapping

- **Label Name:** `Highly Confidential` (parent, not directly assignable)
- **Tooltip:** "Restricted to named individuals only. JIT access required. All access is monitored and audited."
- **Visual Marking:** Red header, footer, and watermark — "HIGHLY CONFIDENTIAL — RESTRICTED ACCESS"
- **Encryption:** Azure RMS with named-user permissions; Double Key Encryption (DKE) for ITAR
- **Content Marking:** Header, footer, dynamic watermark with user identity
- **DLP Policy:** Block all external sharing; block copy/paste to unmanaged apps; alert SOC on policy violation

---

## 6. Tier Boundary Decision Guidelines

### 6.1 Decision Criteria Matrix

| Decision Criterion | Tier 1 — Public | Tier 2 — Internal | Tier 3 — Confidential | Tier 4 — Restricted |
|-------------------|-----------------|--------------------|-----------------------|---------------------|
| **Regulatory requirement** | None | General business records | GDPR, SOX, CCPA, PCI-DSS | ITAR, HIPAA (sensitive), criminal statutes |
| **PII content** | None | Business contact only | Standard PII (address, DOB, personal email) | Sensitive PII (SSN, health, financial, biometric) |
| **Financial sensitivity** | Published financials | Internal budgets, cost centers | Pre-release results, pricing, forecasts | M&A terms, material non-public information |
| **Competitive impact** | None | Minor inconvenience | Material competitive disadvantage | Severe or existential competitive harm |
| **Contractual obligation** | None | Standard business terms | NDA-protected, customer contractual | Government contract, legal privilege |
| **IP classification** | No IP value | General know-how | Proprietary methods, copyrighted works | Trade secrets, pre-filing patents, ITAR data |
| **Audience** | General public | All employees and contractors | Specific teams/roles with need-to-know | Named individuals with JIT access |
| **Breach notification** | No | No | Yes (regulatory, 30-72 hours) | Yes (regulatory + contractual, 24-48 hours) |
| **Reputational impact** | None | Minimal | Moderate — media coverage likely | Severe — front-page news, executive liability |

### 6.2 Tier 2 vs. Tier 3 Boundary

Use the following questions. If ANY answer is "yes," classify at Tier 3:

| # | Question | If Yes → Tier 3 |
|---|----------|-----------------|
| 1 | Does the data contain PII beyond business contact information? | Tier 3 |
| 2 | Is the data subject to a specific named regulation (GDPR Art. 9, SOX, PCI-DSS)? | Tier 3 |
| 3 | Would disclosure give a competitor a material advantage in a negotiation or bid? | Tier 3 |
| 4 | Is the data subject to a non-disclosure agreement or contractual confidentiality clause? | Tier 3 |
| 5 | Does the data contain financial forecasts, pricing, or pre-release results? | Tier 3 |
| 6 | Would disclosure require a regulatory breach notification? | Tier 3 |
| 7 | Would you be uncomfortable if this data appeared in a news article? | Tier 3 |

### 6.3 Tier 3 vs. Tier 4 Boundary

Use the following questions. If ANY answer is "yes," classify at Tier 4:

| # | Question | If Yes → Tier 4 |
|---|----------|-----------------|
| 1 | Is the data subject to ITAR, EAR, or other export control regulations? | Tier 4 |
| 2 | Does the data qualify as a trade secret under DTSA or equivalent statute? | Tier 4 |
| 3 | Does the data contain SSN, health records, financial account numbers, or biometrics? | Tier 4 |
| 4 | Is the data protected by attorney-client privilege or work product doctrine? | Tier 4 |
| 5 | Would disclosure result in criminal liability for any individual? | Tier 4 |
| 6 | Is the data related to active M&A, board decisions, or executive compensation? | Tier 4 |
| 7 | Could disclosure cause existential harm to the organization (loss of key contract, patent invalidity)? | Tier 4 |
| 8 | Does the data require US Person verification before access? | Tier 4 |

---

## 7. Default Classification Rules

### 7.1 "When in Doubt, Classify Up One Tier"

The cardinal rule of data classification: **when the correct tier is ambiguous, classify the data one tier higher than the lowest plausible tier.** It is always easier to declassify data downward (with approval) than to recover from a breach caused by under-classification.

| Situation | Default Action |
|-----------|---------------|
| Data has not been classified | Assign Tier 2 — Internal (system default) |
| Classifier is uncertain between Tier 2 and Tier 3 | Assign Tier 3 — Confidential |
| Classifier is uncertain between Tier 3 and Tier 4 | Assign Tier 4 — Restricted |
| Newly ingested external data with unknown sensitivity | Assign Tier 3 — Confidential until reviewed |
| Data from a new system not yet assessed | Assign Tier 3 — Confidential until data owner reviews |
| IoT/OT telemetry from unclassified sensors | Assign Tier 2 — Internal (default); escalate if linked to trade secret processes |

### 7.2 Never-Public Rule

Data must never be classified as Tier 1 — Public by default. Public classification requires an affirmative approval from an authorized approver (Communications, Legal, or designated delegate). Auto-labeling policies must never auto-apply the Public label.

### 7.3 Aggregation Escalation Rule

When individually non-sensitive data is combined or aggregated in a way that reveals sensitive patterns, the aggregated dataset must be classified at the highest tier justified by the derived insight, not the individual source tier. Example: individual IoT temperature readings may be Tier 2, but a dataset combining readings with proprietary process parameters that reveals trade-secret yield optimization is Tier 4.

---

## 8. Multi-Tier Data Handling

### 8.1 Highest Tier Governs

When a dataset, document, or container includes data elements at multiple classification tiers, the **highest tier present governs the entire asset** unless granular controls are in place.

| Scenario | Handling Rule |
|----------|--------------|
| Database table with Tier 2 and Tier 3 columns | Entire table treated as Tier 3, unless column-level security (CLS) isolates Tier 3 columns |
| Document containing Tier 2 text and a Tier 4 SSN | Entire document is Tier 4 |
| Power BI report sourcing Tier 2 and Tier 3 datasets | Report inherits Tier 3 |
| Email thread where one message contains Tier 3 data | Entire thread is Tier 3 |
| SharePoint site with mixed-tier documents | Site label is set to highest tier present; individual documents retain their labels |
| Fabric lakehouse combining Tier 2 and Tier 4 tables | Lakehouse workspace must be Tier 4; alternative: separate Tier 4 tables into isolated workspace |

### 8.2 Separation Strategies

When mixed-tier data creates operational friction (e.g., an entire lakehouse locked to Tier 4 controls), use separation strategies:

| Strategy | When to Use | Implementation |
|----------|-------------|----------------|
| **Column-level security (CLS)** | Few sensitive columns in an otherwise lower-tier table | Dynamic Data Masking (DDM) or Object-Level Security (OLS) in Fabric/Power BI |
| **Row-level security (RLS)** | Specific rows are higher-tier based on a row attribute | RLS policies in Fabric SQL endpoint or Power BI |
| **Table separation** | A logical table has distinct tiers that cannot be managed by CLS | Split into separate tables by tier; join at query time with appropriate access controls |
| **Workspace isolation** | A workspace contains mixed-tier items with no item-level enforcement | Create separate workspaces per tier; use cross-workspace references where permitted |

---

## 9. Classification Lifecycle

### 9.1 Lifecycle Stages

```
Creation → Initial Classification → Periodic Review → Reclassification → Declassification → Disposal
```

| Stage | Description | Trigger | Responsible Role |
|-------|-------------|---------|-----------------|
| **Creation** | Data asset is created or ingested into the platform | New file, table, or dataset | Content creator / pipeline owner |
| **Initial Classification** | Tier assigned via auto-labeling or manual selection | Creation event | Auto-labeling engine or content creator |
| **Periodic Review** | Classification confirmed or updated per review cadence | Scheduled review cycle | Data owner / data steward |
| **Reclassification** | Classification changed due to a trigger event | Trigger event (see Section 9.2) | Data owner with appropriate approvals |
| **Declassification** | Data formally moved to a lower tier | Business or regulatory change | Data owner + governance approval |
| **Disposal** | Data securely deleted per retention policy and tier requirements | Retention period expiration or business decision | Data custodian / IT operations |

### 9.2 Reclassification Triggers

| Trigger | Direction | Example |
|---------|-----------|---------|
| Data aggregation | Upgrade | Individual anonymized records combined to become re-identifiable |
| Regulation change | Either | New privacy law covers previously unregulated data; regulation repealed |
| Public disclosure | Downgrade | Financial results published in 10-K (Confidential → Public) |
| Contract expiration | Downgrade | NDA expires; formerly confidential vendor data becomes Internal |
| M&A activity | Upgrade | Standard business data becomes material non-public information during deal |
| Data anonymization | Downgrade | PII removed/tokenized; Confidential PII becomes Internal |
| Export control determination | Upgrade | Engineering data determined to fall under ITAR/EAR jurisdiction |
| Security incident | Upgrade | Data integrity compromised; higher controls needed during investigation |
| Business decision | Either | Executive decision to publish or restrict data based on strategy |
| Data enrichment | Upgrade | Internal data joined with PII becomes Confidential |

### 9.3 Reclassification Approval Matrix

| Current Tier | New Tier | Approver | Documentation Required |
|-------------|----------|----------|----------------------|
| Any | Upgrade to Tier 3 | Data Owner | Classification change request with justification |
| Any | Upgrade to Tier 4 | Data Owner + CISO/DPO | Change request, risk assessment, control gap analysis |
| Tier 3 | Downgrade to Tier 2 | Data Owner + Governance Council | Justification, regulatory review, 30-day comment period |
| Tier 4 | Downgrade to any | Data Owner + CISO + Legal | Formal declassification review, regulatory clearance, legal sign-off |
| Any | Tier 1 (Public) | Data Owner + Communications + Legal | Public release approval, regulatory check, competitive review |

---

## 10. Classification Granularity Rules

| Granularity Level | When to Apply | Example | Implementation |
|-------------------|---------------|---------|----------------|
| **Database/Lakehouse** | All tables share the same classification | A dedicated ITAR lakehouse | Workspace-level Purview label |
| **Table/Dataset** | Most columns share classification; no higher-sensitivity columns | `dim_product` with public specs | Table-level Purview label |
| **Column/Field** | Specific columns contain higher-sensitivity data | `customer.ssn` is Restricted but `customer.name` is Confidential | Column-level label; OLS in Power BI; DDM |
| **Row** | Specific rows are higher-tier based on attribute | ITAR-flagged rows in `contract` table | RLS; row-level label via metadata column |
| **Cell** | Individual cells need different classification | Rare; indicates design issue | Avoid; refactor into separate tables |

**Rule:** Classify at the coarsest level that accurately represents sensitivity. If more than 20% of columns require a different classification, consider splitting by tier.

---

## Fabric / Azure Implementation Guidance

### Workspace Organization by Tier

| Tier | Workspace Strategy | Naming Pattern (per ISL-03) | Access Control |
|------|-------------------|----------------------------|----------------|
| Tier 1 — Public | Shared workspaces allowed | `ws_{domain}_public_{env}` | Viewer: all authenticated users |
| Tier 2 — Internal | Standard domain workspaces | `ws_{domain}_{layer}_{env}` | Member: domain team; Viewer: all employees |
| Tier 3 — Confidential | Dedicated domain workspaces with restricted membership | `ws_{domain}_{layer}_conf_{env}` | Member: approved roles; Viewer: need-to-know |
| Tier 4 — Restricted | Isolated workspaces with PIM-managed access | `ws_{domain}_{layer}_restr_{env}` | Admin: named individuals via PIM; no Viewer role |

### OneLake Path Conventions

```
onelake://{workspace}/{lakehouse}/Tables/{schema}/{table}
```

- Tier 3 and Tier 4 lakehouses must use dedicated storage accounts with CMK encryption
- Tier 4 workspaces must disable OneLake shortcuts from lower-tier workspaces
- Cross-tier data movement requires pipeline-level classification validation

### Purview Data Map Integration

- All Fabric assets are auto-registered in Purview Data Map via managed scanning
- Classification labels propagate from Purview to Fabric item properties
- Data stewards validate auto-classifications within 5 business days of initial scan
- Classification metadata is stored as Purview glossary term associations (per ISL-02)

### Power BI Considerations

- Sensitivity labels on datasets propagate to dependent reports and dashboards
- Tier 3 and Tier 4 datasets must restrict export formats (PDF only for Tier 3; blocked for Tier 4)
- Row-level security (RLS) must align with classification tier access requirements
- Paginated reports referencing Tier 4 data must enforce parameterized access filtering

---

## Manufacturing Overlay [CONDITIONAL]

> **Applicability:** Include this section when the client has manufacturing, engineering, or defense-related operations. Remove if not applicable (set "Manufacturing overlay required = No" in Client Context table).

### Manufacturing-Specific Classification Examples

| Data Element | Default Tier | Rationale | Special Handling |
|-------------|-------------|-----------|-----------------|
| IoT sensor telemetry (temperature, pressure, vibration) | Tier 2 — Internal | Routine operational data | Upgrade to Tier 4 if correlated with trade secret processes |
| Production rates and throughput | Tier 2 — Internal | Aggregated operational metrics | Upgrade to Tier 3 if granular per-line or per-product |
| Bill of Materials (BOM) — standard | Tier 3 — Confidential | Contains supplier pricing, component specs | Confidential\Technical sub-label |
| Bill of Materials (BOM) — defense/ITAR | Tier 4 — Restricted | Contains ITAR-controlled components | HC\ITAR sub-label; US Person only |
| ITAR technical drawings and specs | Tier 4 — Restricted | Federal export control (22 CFR 120-130) | Physical and logical isolation; Empowered Official approval |
| Proprietary process parameters (temperatures, pressures, speeds) | Tier 4 — Restricted | Trade secret; core competitive IP | HC\Trade Secret sub-label; numbered copies |
| Quality inspection results (routine) | Tier 2 — Internal | Standard QC data | Upgrade if linked to customer complaints |
| Supplier quality scorecards | Tier 3 — Confidential | NDA-protected partner data | Confidential\Business sub-label |
| Machine learning predictive maintenance models | Tier 3 — Confidential | Proprietary algorithms, operational insight | Confidential\Technical sub-label |
| OT network topology diagrams | Tier 3 — Confidential | Security-sensitive; exploitable if disclosed | Confidential\Technical sub-label |
| SCADA system credentials and configurations | Tier 4 — Restricted | Critical infrastructure; safety risk | HC\Trade Secret sub-label; isolated storage |
| Tooling and fixture designs (proprietary) | Tier 3 — Confidential | IP, competitive advantage | Upgrade to Tier 4 if trade secret designated |

### ITAR/EAR Classification Rules

1. **Any data on the US Munitions List (USML) or Commerce Control List (CCL) is automatically Tier 4 — Restricted**
2. ITAR data must be stored in US-based data centers only (Azure US regions)
3. ITAR workspaces must enforce US Person verification via Entra ID attribute (`employeeType = US_Person`)
4. ITAR data must never be co-mingled with non-ITAR data in the same workspace
5. All ITAR access must be logged with 7-year retention for State Department audit compliance

### IoT/OT Data Sensitivity Escalation

| Condition | Base Tier | Escalation Tier | Trigger |
|-----------|-----------|-----------------|---------|
| Raw telemetry, no process context | Tier 2 | — | Default |
| Telemetry linked to proprietary process | Tier 2 | Tier 4 | Correlation with trade secret parameters |
| Telemetry revealing production volume | Tier 2 | Tier 3 | Granular per-product-line data |
| OT network diagnostic data | Tier 2 | Tier 3 | Contains IP addresses, device identifiers |
| SCADA control commands | Tier 3 | Tier 4 | Safety-critical; sabotage risk |

---

## Cross-References

| ISL Module | Relationship to ISL-04 Tier Definitions |
|-----------|----------------------------------------|
| **ISL-01 — API Governance** | API security controls (authentication, rate limiting, encryption) vary by the classification tier of data exposed through the API |
| **ISL-02 — Metadata & Lineage** | Classification tier is stored as a metadata attribute in Purview Data Catalog; lineage tracks tier propagation through pipelines |
| **ISL-03 — Naming Conventions** | Object and workspace names encode classification tier (e.g., `ws_finance_gold_conf_prd`); tier abbreviations defined in ISL-03 |
| **ISL-04 — Sensitivity Labeling** | Purview sensitivity labels are the technical implementation of the tiers defined in this document |
| **ISL-04 — Data Handling Requirements** | Per-tier rules for storage, transmission, sharing, retention, and disposal |
| **ISL-05 — Integration Patterns** | Data pipeline patterns include tier validation gates; cross-tier data movement requires classification checks |
| **ISL-06 — Data Quality** | Data quality SLA thresholds (completeness, accuracy, timeliness) increase with classification tier |

---

## Compliance Alignment

| Framework | Relevant Controls | ISL-04 Alignment |
|-----------|------------------|-----------------|
| **NIST SP 800-60** | Information type categorization (confidentiality, integrity, availability) | 4-tier model maps to NIST low/moderate/high impact levels |
| **NIST SP 800-53 Rev. 5** | RA-2 (Security Categorization), AC-16 (Security and Privacy Attributes) | Tier definitions serve as security categorization; Purview labels implement AC-16 |
| **ISO/IEC 27001:2022** | A.5.12 (Classification of Information), A.5.13 (Labelling of Information) | 4-tier model satisfies A.5.12; Purview labels satisfy A.5.13 |
| **DAMA DMBOK** | Chapter 7 — Data Security (classification as governance control) | Tier model is the classification foundation for DAMA data security practices |
| **OWASP** | Data Classification guidance in OWASP SAMM | Tier model provides input to OWASP threat modeling for API and application security |
| **ITAR (22 CFR)** | §120.10 Technical Data, §120.33 Defense Article | Tier 4 sub-classification maps to ITAR technical data and defense article controls |
| **GDPR** | Art. 9 (Special Categories), Art. 32 (Security of Processing) | Tier 3 PII and Tier 4 Sensitive PII map to GDPR processing requirements |
| **SOX** | Section 302/404 — Internal Controls over Financial Reporting | Tier 3 Financial sub-classification enforces SOX controls on pre-release data |
| **PCI-DSS v4.0** | Req. 3 (Protect Stored Account Data), Req. 4 (Protect Cardholder Data in Transit) | Tier 4 Sensitive PII sub-classification covers cardholder data |
| **Cloud Adoption Framework (CAF)** | Security baseline — Data classification and protection | 4-tier model aligns with CAF recommended classification scheme |

---

## Revision History

| Version | Date | Author | Change Description |
|---------|------|--------|-------------------|
| 1.0 | 2025-01-15 | ISL Standards Team | Initial release — 4-tier classification model with Purview alignment |
| — | — | — | _Future revisions will be recorded here_ |

---

*This document is part of the Integration Standards Library (ISL). For questions or change requests, contact the Data Governance Council or submit a pull request to the ISL repository.*

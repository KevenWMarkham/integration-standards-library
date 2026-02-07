# Sensitivity Labeling Standards
> Module: ISL-04 | Version: 1.0 | Adaptation Effort: 4-6 hrs | Dependencies: ISL-03, ISL-04 Tier Definitions

## Purpose

Define the Microsoft Purview Information Protection sensitivity label taxonomy, auto-labeling rules, manual labeling guidelines, label inheritance behavior, conflict resolution, cross-platform enforcement actions, and label governance procedures. Sensitivity labels are the technical enforcement mechanism for the 4-tier classification model defined in `classification-tier-definitions.md`. While classification tiers describe the *policy* (what protection a data asset requires), sensitivity labels are the *implementation* (how that protection is enforced across Microsoft 365, Azure, Fabric, and Power BI).

This standard provides a production-ready label hierarchy that can be deployed to Microsoft Purview with minimal customization. All labels, auto-labeling rules, and enforcement actions are pre-mapped to the ISL-04 tier model.

---

## Scope

### In Scope

- Complete Purview sensitivity label hierarchy mapped to 4 classification tiers
- Label naming convention using `{Tier}\{SubLabel}` format
- Sub-labels for each tier with specific use-case targeting
- Auto-labeling rules: conditions, sensitive information types (SITs), trainable classifiers, exact data match (EDM)
- Manual labeling guidelines: when to apply, who can apply, approval and audit requirements
- Label inheritance rules: parent-to-child, container-to-content, cross-platform
- Label precedence and conflict resolution between auto-labeling and manual labeling
- Cross-platform enforcement: Office 365, SharePoint, Fabric, Power BI, Azure Storage
- Label actions: encryption, watermarking, access restrictions, DLP policy triggers
- Purview label configuration steps and governance procedures
- Label lifecycle management (creation, modification, retirement)

### Out of Scope

- Classification tier definitions and data examples (see ISL-04 `classification-tier-definitions.md`)
- Per-tier handling requirements for storage, transmission, and disposal (see ISL-04 `data-handling-requirements.md`)
- DLP policy rule authoring beyond label-triggered actions (see client DLP policy documentation)
- Azure Information Protection (AIP) unified labeling client migration (deprecated; use built-in Office labeling)
- Physical document labeling and marking (physical security program)

---

## [ADAPTATION REQUIRED] Client Context

> Engagement teams must complete this parameter table before deploying Purview labels.

| Parameter | Default Value | Client Value | Notes |
|-----------|--------------|-------------|-------|
| Purview tenant | — | _______________ | Microsoft 365 tenant ID |
| Existing label deployment | None (greenfield) | _______________ | Document any existing labels that must be migrated or retired |
| Label prefix | None | _______________ | Some clients prefix with org abbreviation (e.g., `ACME-Confidential`) |
| Tier 1 label display name | Public | _______________ | Must match client's tier naming from `classification-tier-definitions.md` |
| Tier 2 label display name | Internal | _______________ | Must match client's tier naming |
| Tier 3 label display name | Confidential | _______________ | Must match client's tier naming |
| Tier 4 label display name | Highly Confidential | _______________ | Must match client's tier naming |
| Sub-labels for Tier 2 | General, Project-Specific | _______________ | Add client-specific sub-labels as needed |
| Sub-labels for Tier 3 | PII, Financial, Business, Customer, Technical | _______________ | Add/remove based on client data domains |
| Sub-labels for Tier 4 | ITAR, Trade Secret, Sensitive PII, Legal, Executive | _______________ | Remove ITAR if not applicable; add HIPAA if healthcare |
| Auto-labeling mode | Recommend (Tier 3-4); Auto-apply (SIT matches) | _______________ | Some clients require recommend-only for all tiers initially |
| Mandatory labeling | Yes — on save for Office apps | _______________ | May disable during phased rollout |
| Default label for new documents | Internal\General | _______________ | Must be at least Tier 2 |
| Label governance body | Data Governance Council | _______________ | Maps to client's governance structure |
| EDM data sources | HR system, CRM | _______________ | Add client-specific data sources for exact data matching |
| Organization legal disclaimer text | — | _______________ | Appended to footer/header markings |

---

## 1. Label Hierarchy and Taxonomy

### 1.1 Parent-Child Label Structure

```
Public
Internal
  |-- Internal\General
  |-- Internal\Project-Specific
Confidential
  |-- Confidential\PII
  |-- Confidential\Financial
  |-- Confidential\Business
  |-- Confidential\Customer
  |-- Confidential\Technical
Highly Confidential
  |-- Highly Confidential\ITAR
  |-- Highly Confidential\Trade Secret
  |-- Highly Confidential\Sensitive PII
  |-- Highly Confidential\Legal
  |-- Highly Confidential\Executive
```

### 1.2 Label Naming Convention

**Format:** `{TierName}\{SubLabelName}`

| Element | Convention | Examples |
|---------|-----------|----------|
| Tier name | Title case, no abbreviations | `Confidential`, `Highly Confidential` |
| Sub-label name | Title case, hyphenated for multi-word | `PII`, `Trade Secret`, `Project-Specific` |
| Full label path | Backslash separator | `Confidential\Financial`, `Highly Confidential\ITAR` |
| Display name | Tier — Sub-label | "Confidential — Financial", "HC — ITAR" |
| Short reference | Tier abbreviation + sub-label | `CON-PII`, `HC-ITAR` (for documentation only, not in Purview) |

### 1.3 Label Definitions Table

| Label Name | Display Name | Tier | Priority | Scope | Description |
|-----------|-------------|------|----------|-------|-------------|
| `Public` | Public | 1 | 0 | Files, Emails, Meetings, Sites, Groups | Approved for unrestricted public distribution |
| `Internal` | Internal | 2 | 1 | Parent only (not directly assignable) | Internal use — select a sub-label |
| `Internal\General` | Internal — General | 2 | 2 | Files, Emails, Meetings, Sites, Groups | Standard internal business data |
| `Internal\Project-Specific` | Internal — Project | 2 | 3 | Files, Emails, Sites, Groups | Project-scoped internal data with limited team access |
| `Confidential` | Confidential | 3 | 4 | Parent only (not directly assignable) | Confidential — select a sub-label |
| `Confidential\PII` | Confidential — PII | 3 | 5 | Files, Emails, Schematized Data | Personal data subject to privacy regulations |
| `Confidential\Financial` | Confidential — Financial | 3 | 6 | Files, Emails, Schematized Data | Pre-release financial data, pricing, forecasts |
| `Confidential\Business` | Confidential — Business | 3 | 7 | Files, Emails, Sites, Groups | Business strategies, contracts, plans |
| `Confidential\Customer` | Confidential — Customer | 3 | 8 | Files, Emails, Schematized Data | Customer-provided or customer-related data |
| `Confidential\Technical` | Confidential — Technical | 3 | 9 | Files, Emails, Schematized Data, Sites | Proprietary technical data and source code |
| `Highly Confidential` | Highly Confidential | 4 | 10 | Parent only (not directly assignable) | Highly Confidential — select a sub-label |
| `Highly Confidential\ITAR` | HC — ITAR | 4 | 11 | Files, Emails, Schematized Data, Sites | ITAR/EAR export-controlled technical data |
| `Highly Confidential\Trade Secret` | HC — Trade Secret | 4 | 12 | Files, Emails, Schematized Data | Trade secrets and core proprietary IP |
| `Highly Confidential\Sensitive PII` | HC — Sensitive PII | 4 | 13 | Files, Emails, Schematized Data | SSN, health data, financial accounts, biometrics |
| `Highly Confidential\Legal` | HC — Legal Privilege | 4 | 14 | Files, Emails | Attorney-client privileged communications |
| `Highly Confidential\Executive` | HC — Executive | 4 | 15 | Files, Emails, Sites | M&A, board materials, executive compensation |

---

## 2. Visual Markings Per Label

| Label | Header Text | Footer Text | Watermark | Color |
|-------|------------|------------|-----------|-------|
| Public | — | Classification: PUBLIC | — | Green (#2E7D32) |
| Internal\General | Classification: INTERNAL | Do Not Distribute Externally | — | Blue (#1565C0) |
| Internal\Project-Specific | INTERNAL — Project Restricted | Do Not Distribute Externally | — | Blue (#1565C0) |
| Confidential\PII | CONFIDENTIAL — PII | Authorized Personnel Only — Contains Personal Data | — | Amber (#F57F17) |
| Confidential\Financial | CONFIDENTIAL — FINANCIAL | Authorized Personnel Only — Financial Data | — | Amber (#F57F17) |
| Confidential\Business | CONFIDENTIAL — BUSINESS | Authorized Personnel Only | — | Amber (#F57F17) |
| Confidential\Customer | CONFIDENTIAL — CUSTOMER | Authorized Personnel Only — Customer Data | — | Amber (#F57F17) |
| Confidential\Technical | CONFIDENTIAL — TECHNICAL | Authorized Personnel Only — Proprietary Technical Data | — | Amber (#F57F17) |
| HC — ITAR | HIGHLY CONFIDENTIAL — ITAR CONTROLLED | ITAR Restricted — US Persons Only — 22 CFR 120-130 | ITAR CONTROLLED | Red (#C62828) |
| HC — Trade Secret | HIGHLY CONFIDENTIAL — TRADE SECRET | Named Access Only — Trade Secret Protected | TRADE SECRET | Red (#C62828) |
| HC — Sensitive PII | HIGHLY CONFIDENTIAL — SENSITIVE PII | Named Access Only — Sensitive Personal Data | — | Red (#C62828) |
| HC — Legal Privilege | HIGHLY CONFIDENTIAL — LEGAL PRIVILEGE | Attorney-Client Privileged — Do Not Forward or Copy | PRIVILEGED | Red (#C62828) |
| HC — Executive | HIGHLY CONFIDENTIAL — EXECUTIVE | Named Access Only — Executive Restricted | `{UserName}` | Red (#C62828) |

### [ADAPTATION REQUIRED] Visual Marking Customization

> Replace the default marking text with client-specific organization name and legal disclaimers:

| Customization Point | Default | Client Value |
|-------------------|---------|-------------|
| Organization name in footer | (none) | _______________ |
| Legal disclaimer text | (none) | _______________ |
| Watermark font size | 50pt | _______________ |
| Watermark opacity | 50% | _______________ |
| Header/footer font | Calibri 8pt | _______________ |

---

## 3. Tooltip Text Per Label

| Label | Tooltip Text |
|-------|-------------|
| Public | "This content is approved for unrestricted public distribution. No special handling is required." |
| Internal\General | "This content is for internal use only. Do not share with external parties without manager approval." |
| Internal\Project-Specific | "This content is restricted to the specified project team. Do not share outside the project without the project lead's approval." |
| Confidential\PII | "This content contains personal information protected by privacy regulations (GDPR, CCPA). Share only with authorized personnel who have a business need-to-know. MFA is required." |
| Confidential\Financial | "This content contains non-public financial information. Subject to SOX controls and insider trading policies. Share only with authorized personnel." |
| Confidential\Business | "This content contains sensitive business information. Share only with authorized personnel who have a business need-to-know." |
| Confidential\Customer | "This content contains customer data subject to contractual confidentiality obligations. Share only with authorized personnel." |
| Confidential\Technical | "This content contains proprietary technical information. Share only with authorized engineering/technical personnel." |
| HC — ITAR | "WARNING: This content is controlled under ITAR (22 CFR 120-130). Access restricted to verified US Persons only. Unauthorized export is a federal crime. Contact the Empowered Official for questions." |
| HC — Trade Secret | "This content is a trade secret. Access restricted to named individuals only. All access is logged and audited. Unauthorized disclosure may result in legal action." |
| HC — Sensitive PII | "This content contains sensitive personal data (SSN, health, financial, biometric). Access restricted to named individuals with JIT access. All access is monitored." |
| HC — Legal Privilege | "PRIVILEGED AND CONFIDENTIAL. This content is protected by attorney-client privilege. Do not forward, copy, or discuss with anyone not on the privilege list." |
| HC — Executive | "This content is restricted to named executives. All access is logged with user identity. Unauthorized disclosure may result in termination and legal action." |

---

## 4. Auto-Labeling Rules

### 4.1 Auto-Labeling for Files and Emails

| Rule Name | Target Label | Content Type | Condition | Confidence | Action |
|-----------|-------------|-------------|-----------|------------|--------|
| PII-SSN-Detection | HC — Sensitive PII | All files, emails | Regex: `\b\d{3}-\d{2}-\d{4}\b` (SSN format) | High (3+ matches) | Auto-apply |
| PII-SSN-Detection-Low | Confidential\PII | All files, emails | Regex: `\b\d{3}-\d{2}-\d{4}\b` (SSN format) | Medium (1-2 matches) | Recommend |
| Credit-Card-PAN | HC — Sensitive PII | All files, emails | Regex: Luhn-validated 16-digit card numbers | High (3+ matches) | Auto-apply |
| IBAN-Detection | Confidential\Financial | All files, emails | Regex: `\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b` | High | Auto-apply |
| ITAR-Keywords | HC — ITAR | All files, emails | Keywords: "ITAR", "22 CFR", "USML", "export controlled", "defense article" AND "technical data" | High (2+ groups) | Recommend |
| Trade-Secret-Marking | HC — Trade Secret | All files | Keywords: "TRADE SECRET", "PROPRIETARY AND CONFIDENTIAL" in header/footer | High | Recommend |
| Health-Data-HIPAA | HC — Sensitive PII | All files, emails | SIT: US Health Insurance Data, Medical Terms, ICD-10 codes | High | Auto-apply |
| Financial-SOX | Confidential\Financial | Excel, PDF, Word | Keywords: "10-K DRAFT", "10-Q DRAFT", "PRELIMINARY FINANCIAL" AND financial tables | Medium | Recommend |
| Customer-Data | Confidential\Customer | All files, emails | SIT: customer names from EDM + keywords "customer", "client", "account" | High | Auto-apply |
| Employee-PII | Confidential\PII | All files, emails | SIT: employee names from EDM + personal data fields | High | Auto-apply |
| Legal-Privilege | HC — Legal Privilege | Emails | Sent from/to `legal@` domain AND keywords: "privileged", "attorney-client" | Medium | Recommend |
| Passport-Detection | HC — Sensitive PII | All files, emails | SIT: passport numbers (multi-country) | High | Auto-apply |
| Bank-Account | HC — Sensitive PII | All files, emails | SIT: ABA routing + account number patterns | High (2+ matches) | Auto-apply |
| Driver-License | Confidential\PII | All files, emails | SIT: US driver's license number patterns (multi-state) | High | Auto-apply |
| Tax-ID-EIN | Confidential\Financial | All files, emails | Regex: `\b\d{2}-\d{7}\b` (EIN format) | Medium | Recommend |

### [ADAPTATION REQUIRED] Client-Specific Auto-Labeling Conditions

> Add client-specific patterns below. Common additions include employee ID format, internal account number format, and product code patterns.

| Rule Name | Target Label | Condition | Action | Client Notes |
|-----------|-------------|-----------|--------|-------------|
| _Client-Employee-ID_ | _Confidential\PII_ | _Regex: client employee ID format_ | _Auto-apply_ | _______________ |
| _Client-Account-Number_ | _Confidential\Customer_ | _Regex: client account number format_ | _Auto-apply_ | _______________ |
| _Client-Product-Code_ | _Confidential\Technical_ | _Regex: client product code format_ | _Recommend_ | _______________ |

### 4.2 Auto-Labeling for Schematized Data (Purview Data Map)

| Rule Name | Target Label | Data Source | Column Pattern | Classification |
|-----------|-------------|-------------|---------------|----------------|
| SQL-SSN-Column | HC — Sensitive PII | Azure SQL, Fabric SQL | Column: `*ssn*`, `*social_security*`, `*tax_id*` | System: US SSN |
| SQL-DOB-Column | Confidential\PII | Azure SQL, Fabric SQL | Column: `*dob*`, `*date_of_birth*`, `*birth_date*` | System: Date of Birth |
| SQL-Email-Personal | Confidential\PII | Azure SQL, Fabric SQL | Column: `*personal_email*`, `*home_email*` | System: Email Address |
| SQL-Phone-Personal | Confidential\PII | Azure SQL, Fabric SQL | Column: `*personal_phone*`, `*home_phone*`, `*mobile*` | System: Phone Number |
| SQL-Salary | Confidential\Financial | Azure SQL, Fabric SQL | Column: `*salary*`, `*compensation*`, `*wage*`, `*pay_rate*` | Custom: Compensation |
| SQL-Bank-Account | HC — Sensitive PII | Azure SQL, Fabric SQL | Column: `*bank_account*`, `*routing*`, `*iban*`, `*swift*` | System: Bank Account |
| SQL-Credit-Card | HC — Sensitive PII | Azure SQL, Fabric SQL | Column: `*credit_card*`, `*card_number*`, `*pan*` | System: Credit Card |
| SQL-Address-Home | Confidential\PII | Azure SQL, Fabric SQL | Column: `*home_address*`, `*street*` + `*personal*` context | System: Address |
| SQL-Medical | HC — Sensitive PII | Azure SQL, Fabric SQL | Column: `*diagnosis*`, `*medical*`, `*health*`, `*icd*` | System: Medical |
| SQL-Price-Cost | Confidential\Financial | Azure SQL, Fabric SQL | Column: `*unit_price*`, `*cost*`, `*margin*` in vendor/customer context | Custom: Pricing |
| Fabric-Lakehouse-Scan | Per classification | Fabric Lakehouse | All columns scanned during Purview Data Map scan | Auto-classified |
| ADLS-File-Metadata | Per content | ADLS Gen2 | File path, name patterns, content sampling | Auto-classified |

### 4.3 Trainable Classifiers

| Classifier Name | Target Label | Training Description | Minimum Samples |
|----------------|-------------|---------------------|-----------------|
| Manufacturing-Drawings | Confidential\Technical | Engineering drawings, CAD exports, technical diagrams | 50 positive, 50 negative |
| Financial-Statements | Confidential\Financial | Income statements, balance sheets, cash flow statements | 50 positive, 50 negative |
| Legal-Contracts | Confidential\Business | Vendor agreements, customer contracts, NDAs | 50 positive, 50 negative |
| HR-Performance | Confidential\PII | Performance reviews, disciplinary records, promotion recommendations | 50 positive, 50 negative |
| ITAR-Technical-Data | HC — ITAR | ITAR-controlled technical documents, defense specifications | 25 positive, 25 negative |
| Trade-Secret-Formulations | HC — Trade Secret | Chemical formulations, alloy compositions, process parameters | 25 positive, 25 negative |
| Board-Materials | HC — Executive | Board presentations, minutes, resolutions | 25 positive, 25 negative |

### 4.4 Exact Data Match (EDM)

| EDM Schema | Target Label | Source Data | Match Columns | Refresh Cadence |
|-----------|-------------|-------------|---------------|-----------------|
| Employee-PII | Confidential\PII | HR system export | EmployeeName, EmployeeID, Email, Phone | Weekly |
| Customer-PII | Confidential\Customer | CRM export | CustomerName, AccountNumber, Email, Phone | Weekly |
| ITAR-Part-Numbers | HC — ITAR | Export control registry | PartNumber, DrawingNumber, ECCN, USML_Category | Monthly |
| Financial-Account-Numbers | HC — Sensitive PII | Finance system export | AccountNumber, RoutingNumber, IBAN | Weekly |

---

## 5. Manual Labeling Guidelines

### 5.1 When Manual Labeling Is Required

| Scenario | Reason | Required Approver |
|----------|--------|-------------------|
| Auto-labeling recommends but does not auto-apply | Confidence below threshold; human confirmation needed | Content creator/owner |
| New document type not covered by auto-labeling rules | No matching classifier or SIT pattern | Content creator + data steward |
| Multi-topic document spanning multiple classifications | Aggregation may require higher classification | Data steward |
| Label downgrade requested | Must confirm removal of controls is appropriate | Data owner (Tier 3), Data owner + CISO (Tier 4) |
| Label upgrade requested by security team | Incident or audit finding triggers reclassification | Data owner acknowledgment |
| External content received without label | Incoming documents from partners or customers | Receiving employee + data steward |
| Mandatory labeling enforcement — unlabeled content on save | Policy requires all documents to have a label | Content creator (prompted on save) |

### 5.2 Label Upgrade and Downgrade Approval

| Action | Who Can Perform | Approval Required | Audit Trail |
|--------|----------------|-------------------|-------------|
| Apply label (first time) | Any authorized user | None (Tier 1-2); data steward notification (Tier 3-4) | Purview activity log |
| Upgrade label (to higher tier) | Any authorized user | None (upgrading is always allowed) | Purview activity log |
| Downgrade from Tier 2 to Tier 1 | Content owner | Manager approval | Purview activity log + justification text |
| Downgrade from Tier 3 | Content owner | Data owner approval | Activity log + justification + governance ticket |
| Downgrade from Tier 4 | Data owner only | CISO + Legal approval | Activity log + justification + ticket + risk assessment |
| Remove label entirely | Not permitted | N/A — all content must carry a label | Blocked by policy |

### 5.3 Mandatory Labeling Policy

- **Office applications (Word, Excel, PowerPoint):** Users are prompted to select a label on first save. If no label is selected, `Internal\General` is applied as default.
- **Outlook:** Emails require a label before send. Default: `Internal\General`.
- **SharePoint document uploads:** Inherit site/library label. If no site label, user is prompted.
- **Power BI publish:** Dataset label is inherited from source. If no source label, publisher must select.
- **Fabric items:** Inherit workspace label. Manual override requires workspace Member role or higher.

---

## 6. Label Inheritance Rules

### 6.1 Parent-to-Child Inheritance

| Scenario | Behavior | Example |
|----------|----------|---------|
| Container labeled, new item created inside | Item inherits container label | SharePoint site "Internal" — new documents default to `Internal\General` |
| Item moved to labeled container | Item retains its own label (no override) | "Confidential" document moved to "Internal" site retains "Confidential" |
| Item has higher label than container | Item label preserved (highest wins) | "Restricted" document in "Confidential" folder keeps "Restricted" |
| Item has lower label than container | Item is upgraded to container label | "Internal" document uploaded to "Confidential" site upgraded to "Confidential" |
| Container label removed | Child items retain their labels | Site label removed — documents keep individual labels |

### 6.2 Cross-Platform Label Behavior

| Platform | Label Applied Via | Label Visible In | Enforcement |
|----------|------------------|------------------|-------------|
| Word/Excel/PowerPoint | Built-in ribbon, auto-label | Document properties, header/footer/watermark | Encryption, access control, visual markings |
| Outlook (email) | Sensitivity bar, auto-label | Email header, MailTips | Encryption, forwarding restrictions, DLP |
| SharePoint Online | Site/library settings, upload | Column in document library, site badge | Download restrictions, guest access control |
| OneDrive for Business | File upload, sync client | File properties | Encryption, sharing restrictions |
| Power BI | Dataset/report label, source inheritance | Report header, export restrictions | Export format restrictions, audience control |
| Microsoft Fabric | Workspace label, item-level label | Workspace badge, item properties | Workspace RBAC, OneLake access, export control |
| Teams | Channel/site inheritance | Channel header | Guest access, file sharing restrictions |
| Azure SQL / Fabric SQL | Purview Data Map scan, manual | Purview catalog, SSMS column properties | DDM, RLS via metadata |
| Azure Blob / ADLS Gen2 | Purview scan, manual | Purview catalog, blob metadata | Access policy, firewall rules |

### 6.3 Power BI Label Inheritance Chain

```
Source Table (Purview label) --> Fabric Dataset --> Power BI Semantic Model --> Report --> Dashboard --> App
```

- Each downstream artifact inherits the highest label from its sources
- Manual upgrade is always permitted; manual downgrade requires approval
- Export restrictions compound: if dataset is "Confidential," all reports inherit export restrictions
- Labels persist through workspace app publishing — consumers see the label badge

---

## 7. Label Precedence and Conflict Resolution

### 7.1 Priority Rules

1. **Highest label wins:** When a conflict exists between multiple applicable labels, the label with the highest priority number (most restrictive) is applied
2. **User cannot downgrade without approval:** Users can always upgrade but need approval to downgrade (see Section 5.2)
3. **Auto-label does not override manual:** If a user has manually applied a label, auto-labeling will not change it to a lower-priority label
4. **Auto-label can upgrade:** Auto-labeling can upgrade a label if it detects content requiring a higher-priority label
5. **Container label is a floor:** Items within a labeled container cannot have a label lower than the container label

### 7.2 Conflict Scenarios

| Scenario | Resolution | Resulting Label |
|----------|-----------|-----------------|
| Document "Internal" contains SSN detected by auto-label | Auto-label upgrades | HC — Sensitive PII |
| "Confidential\Financial" doc moved to "Internal" SharePoint site | Document retains higher label | Confidential\Financial |
| User tries to relabel "Internal" document as "Public" | Downgrade policy triggered | Blocked until manager approves |
| Two auto-label rules match (PII + Financial) | Higher priority wins | Whichever has higher priority number |
| Email reply chain: original "Confidential," reply adds no sensitive data | Highest label in chain persists | Confidential |
| Power BI report sourced from "Confidential" and "Internal" datasets | Highest source label inherited | Confidential |
| Fabric pipeline reads "Restricted" source, writes to "Confidential" target | Pipeline blocked or target upgraded | Target must be >= source tier |
| Auto-label says "Confidential\PII," user manually set "Confidential\Financial" | Manual label preserved (same tier, user intent) | Confidential\Financial |
| Content scanned after manual label — higher-tier content found | Auto-label upgrades (cross-tier) | Higher-tier label applied |

---

## 8. Cross-Platform Enforcement Actions

### 8.1 Label Enforcement Matrix

| Enforcement Action | Public | Internal | Confidential | Highly Confidential |
|-------------------|--------|----------|--------------|---------------------|
| **Encryption (Azure RMS)** | None | Optional | Required (org-scoped) | Required (named-user or DKE) |
| **Access Restrictions** | None | Authenticated users | Role-based, need-to-know | Named individuals, JIT |
| **Visual Markings — Header** | None | Yes | Yes | Yes (red) |
| **Visual Markings — Footer** | Yes (green) | Yes (blue) | Yes (amber) | Yes (red) |
| **Visual Markings — Watermark** | None | None | None | Yes (label-specific) |
| **External Sharing** | Allowed | Blocked (default) | Blocked + DLP alert | Blocked + SOC alert |
| **Guest Access** | Allowed | Manager approval | Data owner approval | Prohibited |
| **Copy to USB** | Allowed | Warn | Block | Block + SOC alert |
| **Print** | Allowed | Allowed | Allowed (watermarked) | Blocked |
| **Screen Capture** | Allowed | Allowed | Warn | Blocked (WIP) |
| **Forward (email)** | Allowed | Allowed | Internal only | Blocked (Do Not Forward) |
| **Download from SharePoint** | Allowed | Allowed | Allowed (labeled file) | Blocked (view-only in browser) |
| **Power BI Export** | All formats | All formats | PDF only (watermarked) | Blocked |
| **Fabric Data Export** | All formats | CSV/Parquet (internal) | Blocked from workspace | Blocked + audit alert |
| **DLP Policy Trigger** | None | Notify manager (external) | Block + notify data owner | Block + SOC alert + incident |
| **Session Timeout** | 8 hours | 8 hours | 4 hours | 1 hour |
| **MFA Requirement** | Optional | Required (SSO) | Required (per session) | Required (FIDO2 phishing-resistant) |
| **Device Compliance** | Any | Managed or compliant | Compliant only | Compliant + Intune-managed |
| **Network Location** | Any | Any (corporate preferred) | Corporate + approved VPN | Corporate network only |
| **Audit Log Retention** | 90 days | 180 days | 1 year | 7 years |

### 8.2 Conditional Access Policies by Label

| Policy Name | Trigger | Action | Applies To |
|------------|---------|--------|-----------|
| `CA-Label-Tier3-MFA` | Access to Confidential-labeled content | Require MFA (any method) | All users |
| `CA-Label-Tier4-FIDO2` | Access to HC-labeled content | Require phishing-resistant MFA (FIDO2/WHfB) | All users |
| `CA-Label-Tier3-Device` | Access to Confidential-labeled content from non-compliant device | Block access | All users |
| `CA-Label-Tier4-Device` | Access to HC-labeled content from non-managed device | Block access | All users |
| `CA-Label-Tier4-Location` | Access to HC-labeled content from non-corporate network | Block access | All users except break-glass |
| `CA-Label-ITAR-USPerson` | Access to HC-ITAR-labeled content | Require US Person attribute + FIDO2 | All users |

---

## 9. Purview Label Configuration Steps

### 9.1 Deployment Sequence

| Step | Action | Prerequisites | Validation |
|------|--------|---------------|-----------|
| 1 | Create parent labels (Public, Internal, Confidential, Highly Confidential) | Purview admin role | Labels visible in admin center |
| 2 | Create sub-labels under each parent | Parent labels exist | Full hierarchy visible |
| 3 | Configure visual markings per label | Sub-labels exist | Test document shows correct header/footer/watermark |
| 4 | Configure encryption settings per label | Azure RMS activated | Test encryption/decryption cycle |
| 5 | Create label policies (scope to pilot group) | Labels configured | Pilot users see labels in Office apps |
| 6 | Enable mandatory labeling in label policy | Policy scoped | Users prompted on save |
| 7 | Set default label (`Internal\General`) in policy | Policy scoped | New docs get default label |
| 8 | Configure auto-labeling simulation rules | SITs and keywords defined | Simulation shows expected matches |
| 9 | Review auto-labeling simulation results | Simulation complete (7+ days) | False positive rate < 5% |
| 10 | Enable auto-labeling in production | Simulation approved | Auto-labels applied to matching content |
| 11 | Configure Purview Data Map scan rules | Data sources registered | Scan completes; columns classified |
| 12 | Deploy DLP policies referencing labels | Labels in production | DLP blocks/warns per enforcement matrix |
| 13 | Configure conditional access policies | Labels in production | CA policies enforce per matrix |
| 14 | Enable cross-workspace label enforcement in Fabric | Fabric admin settings | Cross-workspace sharing respects labels |
| 15 | Deploy to all users (remove pilot scope) | Pilot validation complete | All users see labels |

### 9.2 Rollback Plan

| Issue | Rollback Action | Impact |
|-------|----------------|--------|
| Auto-labeling false positives > 5% | Disable auto-labeling rule; revert to recommend mode | Users must label manually until rule is refined |
| Label blocks legitimate business process | Modify enforcement action (reduce restriction) | Temporary reduction in protection; log exception |
| Performance impact from encryption | Disable encryption on specific sub-label temporarily | Content unencrypted until resolved |
| User adoption resistance | Switch to recommend-only mode for 30 days | Labels suggested but not enforced |

---

## Fabric / Azure Implementation Guidance

### Fabric-Specific Label Behavior

| Feature | Behavior | Configuration |
|---------|----------|---------------|
| Workspace label | Sets sensitivity floor for all items in workspace | Workspace Settings > Sensitivity |
| Item-level label | Individual items can have labels >= workspace label | Item Settings > Sensitivity |
| OneLake inheritance | Files in OneLake inherit item label | Automatic; no configuration needed |
| Cross-workspace sharing | Blocked if target workspace has lower label | Fabric admin setting + Purview DLP |
| Data pipeline | Pipeline respects source/target label hierarchy | Source label must be <= target workspace label |
| Notebook output | Notebook output inherits input dataset label | Automatic via Fabric platform |
| SQL endpoint | Reflects Purview Data Map column classifications | Sync via Purview scan; manual override in catalog |

### Azure Storage Label Integration

| Storage Type | Label Mechanism | Enforcement |
|-------------|----------------|-------------|
| ADLS Gen2 | Purview Data Map classification; blob index tags | Access policy via Entra ID RBAC + storage firewall |
| Azure SQL | Purview scan + SQL sensitivity classification | DDM, RLS, TDE with CMK for Tier 4 |
| Azure Key Vault | Vault access policy + RBAC | HSM-backed keys for Tier 4 CMK |
| Azure Blob | Purview classification; container-level access | Private endpoint required for Tier 3-4 |

### Power BI Label Integration

| Feature | Behavior | Configuration |
|---------|----------|---------------|
| Source inheritance | Dataset inherits highest label from source tables | Enabled via Purview admin settings |
| Report label | Reports inherit dataset label; manual upgrade allowed | Label visible in report header |
| Export restrictions | Label determines allowed export formats per enforcement matrix | Configured in label policy |
| Workspace app | App audience restricted based on label | App permissions aligned to tier access groups |
| Embed token | Embedded reports enforce label restrictions | Token scoped to label-permitted audience |

---

## Manufacturing Overlay [CONDITIONAL]

> Include this section when the client has manufacturing, engineering, or defense-related operations.

### Manufacturing-Specific Labeling Considerations

| Scenario | Label | Special Configuration |
|----------|-------|----------------------|
| CAD file auto-detection | Confidential\Technical | File extension trigger: `.dwg`, `.step`, `.iges`, `.sldprt`, `.catpart` |
| BOM exports from ERP | Confidential\Technical | Keyword: "Bill of Materials" + structured table detection |
| ITAR drawing with USML marking | HC — ITAR | Keyword + file metadata: USML category in properties |
| Process parameter spreadsheet | HC — Trade Secret | Keyword: "process parameter" + column patterns (temp, pressure, speed) |
| Quality inspection report | Internal\General (default) | Upgrade rule: if linked to customer NCR, upgrade to Confidential\Customer |
| OT network diagnostic export | Confidential\Technical | IP address pattern detection in OT subnet ranges |

### ITAR Label Enforcement Additions

- HC — ITAR label triggers Double Key Encryption (DKE) — encryption key held on-premises and in Azure
- ITAR-labeled content restricted to Azure US Government regions or approved commercial US regions
- ITAR label triggers US Person verification via Entra ID custom security attribute check
- ITAR-labeled SharePoint sites restricted to US Person security group membership
- All ITAR label events forwarded to Empowered Official notification distribution list

---

## Cross-References

| ISL Module | Relationship to Sensitivity Labeling Standards |
|-----------|------------------------------------------------|
| **ISL-01 — API Governance** | APIs exposing labeled data must enforce equivalent access controls; API gateway policies reference tier |
| **ISL-02 — Metadata & Lineage** | Sensitivity labels are propagated as metadata attributes in Purview Data Catalog; lineage tracks label inheritance |
| **ISL-03 — Naming Conventions** | Workspace and object naming encode tier abbreviation; label display names must not conflict with naming patterns |
| **ISL-04 — Tier Definitions** | This document implements the tiers defined in `classification-tier-definitions.md` |
| **ISL-04 — Data Handling** | Label enforcement actions align with per-tier handling requirements in `data-handling-requirements.md` |
| **ISL-05 — Integration Patterns** | Pipeline patterns include label validation gates; label mismatch between source and target blocks pipeline |
| **ISL-06 — Data Quality** | Quality SLA thresholds increase with label tier; quality alerts escalate based on label |

---

## Compliance Alignment

| Framework | Relevant Controls | ISL-04 Labeling Alignment |
|-----------|------------------|--------------------------|
| **NIST SP 800-53 Rev. 5** | AC-16 (Security and Privacy Attributes), MP-4 (Media Marking) | Purview labels implement security attributes; visual markings satisfy media marking |
| **ISO/IEC 27001:2022** | A.5.13 (Labelling of Information), A.5.12 (Classification) | Label hierarchy satisfies A.5.13; auto-labeling supports A.5.12 implementation |
| **DAMA DMBOK** | Chapter 7 — Data Security (labeling as governance control) | Labels are the technical enforcement of DAMA classification practices |
| **OWASP** | Data Classification and Protection | Labels provide input to OWASP threat modeling; API labels drive security testing scope |
| **GDPR** | Art. 25 (Data Protection by Design), Art. 32 (Security of Processing) | Auto-labeling of PII implements privacy by design; encryption enforces Art. 32 |
| **ITAR (22 CFR)** | §120.10 Technical Data marking requirements | HC — ITAR label with DKE and US Person enforcement satisfies ITAR marking |
| **PCI-DSS v4.0** | Req. 3.4 (Render PAN unreadable), Req. 9.4 (Media labeling) | HC — Sensitive PII label with encryption satisfies Req. 3.4; visual markings satisfy Req. 9.4 |
| **SOX** | Section 302/404 — Controls over financial data | Confidential\Financial label with SOX controls satisfies access and audit requirements |
| **Cloud Adoption Framework (CAF)** | Security baseline — Information protection | Label hierarchy aligns with CAF recommended sensitivity label deployment |

---

## Label Governance

### Label Management Roles

| Role | Responsibilities | Entra ID Group |
|------|-----------------|----------------|
| Label Administrator | Create, modify, delete labels; configure auto-labeling policies | `SG-Purview-LabelAdmin` |
| Label Publisher | Publish label policies to user groups; manage policy scope | `SG-Purview-LabelPublisher` |
| Label Reviewer | Review and approve label change requests; audit label usage | `SG-Purview-LabelReviewer` |
| Data Steward | Assign labels to data assets in Purview Data Map; validate auto-classifications | `SG-Data-Steward-{Domain}` |
| Security Analyst | Monitor label violations; investigate DLP incidents | `SG-Security-Analyst` |

### Label Change Approval Process

| Change Type | Requestor | Approver(s) | SLA |
|------------|-----------|-------------|-----|
| New label creation | Data Governance Council | CISO + Data Governance Lead | 10 business days |
| Modify enforcement actions | Label Administrator | CISO | 5 business days |
| Add auto-labeling rule | Data Steward | Label Admin + Security Analyst | 5 business days |
| Modify visual markings | Label Administrator | Data Governance Lead | 3 business days |
| Remove/retire a label | Data Governance Council | CISO + Legal + Data Governance Lead | 20 business days |
| Change label priority | Label Administrator | CISO | 5 business days |
| Add trainable classifier | Data Steward | Label Admin + ML Engineer | 15 business days |

---

## Revision History

| Version | Date | Author | Change Description |
|---------|------|--------|-------------------|
| 1.0 | 2025-01-15 | ISL Standards Team | Initial release — Purview label taxonomy with auto-labeling and enforcement actions |
| — | — | — | _Future revisions will be recorded here_ |

---

*This document is part of the Integration Standards Library (ISL). For questions or change requests, contact the Data Governance Council or submit a pull request to the ISL repository.*

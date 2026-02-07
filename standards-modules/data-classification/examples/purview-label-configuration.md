# Purview Label Configuration — Step-by-Step Setup Guide
> Module: ISL-04 | Version: 1.0 | Type: Example

## Purpose

This example provides a complete, step-by-step walkthrough for configuring Microsoft Purview sensitivity labels aligned to the ISL-04 4-tier classification model. It covers prerequisites, label hierarchy creation, encryption and content marking, auto-labeling policies, DLP integration, default labeling, Purview Data Map scanning, Power BI integration, and monitoring. All steps reflect a completed configuration for a manufacturing client with ITAR requirements.

---

## 1. Prerequisites

### 1.1 Licensing and Roles

| Requirement | License/Role | Purpose |
|-------------|-------------|---------|
| Purview Information Protection | Microsoft 365 E5 or E5 Compliance | Sensitivity labels, auto-labeling, DLP |
| Double Key Encryption (DKE) | Microsoft 365 E5 | ITAR Tier 4 labels with customer-controlled encryption |
| Power BI sensitivity labels | Power BI Pro/PPU (minimum); E5 for auto-inheritance | Label enforcement in Power BI |
| Compliance Administrator | Entra ID role | Create/manage labels, label policies, DLP |
| Information Protection Admin | Entra ID role | Manage auto-labeling policies |
| Power BI Administrator | Fabric role | Enable sensitivity label tenant settings |
| Purview Data Curator | Purview role | Manage Data Map scanning and classification |

### 1.2 Pre-Configuration Checklist

| Step | Action |
|------|--------|
| 1 | Verify M365 E5 licenses assigned to all users in scope |
| 2 | Enable Purview Information Protection in compliance portal |
| 3 | Enable sensitivity labels for Office files in SPO (`Set-SPOTenant -EnableAIPIntegration $true`) |
| 4 | Enable sensitivity labels in Power BI admin portal > Tenant settings > Information Protection |
| 5 | Create Entra ID security groups for label governance roles |
| 6 | Configure Azure Key Vault for Azure RMS encryption keys |
| 7 | Deploy DKE service for ITAR labels (on-premises or Azure App Service) |
| 8 | Document existing sensitivity labels for migration planning |

---

## 2. Label Hierarchy Creation

### 2.1 Create Parent Labels

Navigate to Microsoft Purview compliance portal > Information protection > Labels > Create a label.

**Public:** Name `Public`, color Green (#2E7D32). Tooltip: "This content is approved for unrestricted public distribution." Scope: Files, Emails, Meetings, Sites, Groups, Schematized data. No encryption. Content marking: green footer "Classification: PUBLIC."

**Internal:** Name `Internal`, color Blue (#1565C0). Parent label only — users select sub-labels. Tooltip: "This content is for internal use only. Select a sub-label."

**Confidential:** Name `Confidential`, color Amber (#F57F17). Parent label only. Tooltip: "This content is confidential. Select a sub-label based on data type."

**Highly Confidential:** Name `Highly Confidential`, color Red (#C62828). Parent label only. Tooltip: "This content is restricted to named individuals only. Select a sub-label."

### 2.2 Create Sub-Labels

For each parent, select the parent > Create sub-label.

**Internal sub-labels:**

| Sub-Label | Encryption | Content Marking |
|-----------|-----------|----------------|
| `Internal\General` | Optional (org default) | Header: "INTERNAL" / Footer: "Do Not Distribute Externally" |
| `Internal\Project-Specific` | Optional (org default) | Header: "INTERNAL — Project Restricted" / Footer: "Do Not Distribute Externally" |

**Confidential sub-labels:**

| Sub-Label | Encryption | Content Marking |
|-----------|-----------|----------------|
| `Confidential\PII` | Azure RMS, org-scoped | Header/Footer: "CONFIDENTIAL — PII — Authorized Personnel Only" |
| `Confidential\Financial` | Azure RMS, org-scoped | Header/Footer: "CONFIDENTIAL — FINANCIAL — Authorized Personnel Only" |
| `Confidential\Business` | Azure RMS, org-scoped | Header/Footer: "CONFIDENTIAL — BUSINESS — Authorized Personnel Only" |
| `Confidential\Customer` | Azure RMS, org-scoped | Header/Footer: "CONFIDENTIAL — CUSTOMER — Authorized Personnel Only" |
| `Confidential\Technical` | Azure RMS, org-scoped | Header/Footer: "CONFIDENTIAL — TECHNICAL — Authorized Personnel Only" |

**Highly Confidential sub-labels:**

| Sub-Label | Encryption | Content Marking |
|-----------|-----------|----------------|
| `HC\ITAR` | DKE (Double Key) | Header/Footer/Watermark: "ITAR CONTROLLED — US Persons Only — 22 CFR 120-130" |
| `HC\Trade Secret` | Azure RMS, named-user | Header/Footer/Watermark: "TRADE SECRET — Named Access Only" |
| `HC\Sensitive PII` | Azure RMS, named-user | Header/Footer: "SENSITIVE PII — Named Access Only" |
| `HC\Legal` | Azure RMS, named-user | Header/Footer/Watermark: "LEGAL PRIVILEGE — Do Not Forward or Copy" |
| `HC\Executive` | Azure RMS, named-user | Header/Footer/Watermark (dynamic `{UserName}`): "EXECUTIVE — Named Access Only" |

### 2.3 Label Priority Order

Set in Information protection > Labels > Label priority (0 = lowest):

| Priority | Label | Priority | Label |
|----------|-------|----------|-------|
| 0 | Public | 8 | Confidential\Customer |
| 1 | Internal | 9 | Confidential\Technical |
| 2 | Internal\General | 10 | Highly Confidential |
| 3 | Internal\Project-Specific | 11 | HC — ITAR |
| 4 | Confidential | 12 | HC — Trade Secret |
| 5 | Confidential\PII | 13 | HC — Sensitive PII |
| 6 | Confidential\Financial | 14 | HC — Legal Privilege |
| 7 | Confidential\Business | 15 | HC — Executive |

---

## 3. Label Encryption Settings

| Label | Encryption Type | Permissions | Offline Access |
|-------|----------------|------------|----------------|
| Public | None | N/A | N/A |
| Internal\General | Optional (user-configured) | Org-scoped, all authenticated | 30 days |
| Confidential\PII | Azure RMS (admin) | Org-scoped: Co-Author | 7 days |
| Confidential\Financial | Azure RMS (admin) | Org-scoped: Co-Author | 7 days |
| Confidential\Technical | Azure RMS (admin) | Org-scoped: Reviewer (no save copy/print) | 3 days |
| HC — ITAR | DKE (admin) | Named users: Co-Owner | No offline; 1-year expiry |
| HC — Trade Secret | Azure RMS (admin) | Named users: Reviewer | No offline; 6-month expiry |
| HC — Sensitive PII | Azure RMS (admin) | Named users: Reviewer | No offline |
| HC — Legal Privilege | Azure RMS (admin) | Named users: Reviewer + Do Not Forward | No offline |
| HC — Executive | Azure RMS (admin) | Named users: Co-Owner | No offline; 90-day expiry |

For the ITAR label, select "Double Key Encryption" and enter the DKE service URL (e.g., `https://dke.contoso.com/itar`). The DKE key store is hosted on-premises to ensure the encryption key never leaves the domestic network.

---

## 4. Auto-Labeling Policies

Navigate to Microsoft Purview compliance portal > Information protection > Auto-labeling.

### 4.1 Sensitive Information Type (SIT) Policies

| Policy Name | Target Label | Condition | Action |
|------------|-------------|-----------|--------|
| SSN Detection | HC — Sensitive PII | SIT: US SSN, 3+ instances, high confidence | Auto-apply |
| Credit Card PAN | HC — Sensitive PII | SIT: Credit Card (Luhn), 1+ instance | Auto-apply |
| Bank Account | HC — Sensitive PII | SIT: ABA routing + account number, 2+ matches | Auto-apply |
| Passport Numbers | HC — Sensitive PII | SIT: Multi-country passport numbers | Auto-apply |
| Health Data HIPAA | HC — Sensitive PII | SIT: US Health Insurance, ICD-10 codes | Auto-apply |
| Employee PII | Confidential — PII | EDM: Employee-PII schema, 3+ matches | Auto-apply |
| Customer Data | Confidential — Customer | EDM: Customer-PII schema, 3+ matches | Auto-apply |

### 4.2 Keyword and Classifier Policies

| Policy Name | Target Label | Condition | Action |
|------------|-------------|-----------|--------|
| ITAR Keywords | HC — ITAR | Keywords: ("ITAR" OR "22 CFR" OR "USML" OR "export controlled") AND ("technical data" OR "drawing" OR "specification") | Recommend |
| Trade Secret Marking | HC — Trade Secret | Header/footer keywords: "TRADE SECRET" OR "PROPRIETARY AND CONFIDENTIAL" | Recommend |
| Financial Drafts | Confidential — Financial | Keywords: "DRAFT"/"PRELIMINARY"/"PRE-RELEASE" + trainable classifier: Financial-Statements | Recommend |

ITAR and Trade Secret policies use "recommend" rather than auto-apply because classification carries significant legal consequences — human confirmation is required.

### 4.3 Trainable Classifiers

| Classifier | Target Label | Training Samples |
|-----------|-------------|-----------------|
| Manufacturing-Drawings | Confidential\Technical | 50 positive / 50 negative |
| Financial-Statements | Confidential\Financial | 50 positive / 50 negative |
| ITAR-Technical-Data | HC — ITAR | 25 positive / 25 negative |
| Trade-Secret-Formulations | HC — Trade Secret | 25 positive / 25 negative |

### 4.4 Simulation and Validation

Before deploying each auto-labeling policy, run simulation on 10% of content. Review true/false positive rates. Approval thresholds: auto-apply policies require <2% false positive rate; recommend policies accept up to 12%. SSN detection simulation identified 47 true positives and 2 false positives (phone numbers in XXX-XX-XXXX format excluded via regex refinement).

---

## 5. DLP Policies Tied to Labels

### 5.1 Block External Sharing — Tier 3/4

**Policy:** `DLP-Block-External-Confidential-HC`
- **Confidential labels:** Block external sharing; notify user: "This content is classified as Confidential and cannot be shared externally." Generate incident report for `SG-Security-Analyst`.
- **Highly Confidential labels:** Block external sharing; alert SOC and data owner; generate high-severity incident report.

### 5.2 Warn on External Sharing — Tier 2

**Policy:** `DLP-Warn-External-Internal`
- Allow with override; user must provide business justification. Policy tip: "External sharing requires manager awareness." Low-severity incident for monthly review.

### 5.3 ITAR Export Control

**Policy:** `DLP-ITAR-Export-Control`
- Block all external transmission, USB copy, and printing of HC — ITAR content. Alert Empowered Official and CISO immediately. Block access by users without `itarUSPerson = true`.

| Policy | Labels | External Share | USB Copy | Print | Alert Level |
|--------|--------|---------------|----------|-------|-------------|
| Warn Internal | Internal\* | Warn + override | Allowed | Allowed | Low |
| Block Confidential | Confidential\* | Blocked | Warned | Watermarked | Medium |
| Block HC | HC\* | Blocked + SOC | Blocked + SOC | Blocked | High |
| ITAR Control | HC — ITAR | Blocked + EO | Blocked | Blocked | Critical |

---

## 6. Default Labeling Policies

### 6.1 Documents and Emails

**Policy:** `LabelPolicy-Default-Internal` — Applied to all users.
- Default label for new documents and emails: `Internal\General`
- Mandatory labeling: Yes (users must apply a label before saving/sending)
- Justification required for downgrades: Yes

**Effect:** Every new Office document and Outlook email starts as `Internal\General`. Users select a different label if needed but cannot remove labels entirely.

### 6.2 SharePoint Sites

Default label for new sites and Microsoft 365 Groups: `Internal\General`. Label required at site creation.

### 6.3 Power BI

Default label for new Power BI content: `Internal\General`. Auto-inheritance from data sources enabled. Workspace admin override of auto-applied labels disabled.

---

## 7. Purview Data Map Integration

### 7.1 Registered Data Sources

| Source | Type | Scan Frequency | Classification Rules |
|--------|------|---------------|---------------------|
| SAP S/4HANA (Azure SQL staging) | Azure SQL | Weekly (Sunday 02:00) | System defaults + ITAR part numbers, compensation |
| Epicor Kinetic (Azure SQL staging) | Azure SQL | Weekly (Sunday 03:00) | System defaults + trade secret parameters |
| Fabric Lakehouses (Internal) | Fabric | Weekly (Saturday 22:00) | System defaults |
| Fabric Lakehouses (Confidential) | Fabric | Weekly (Saturday 23:00) | System defaults + financial, customer, PII |
| Fabric Lakehouses (Restricted) | Fabric | Monthly (1st Saturday) | System defaults + ITAR, trade secret, sensitive PII |
| ADLS Gen2 Raw Zone | ADLS Gen2 | Daily (01:00) | System defaults |
| SharePoint Online | SharePoint | Weekly (Sunday 05:00) | System defaults + trainable classifiers |

### 7.2 Custom Classification Rules

| Rule Name | Pattern | Applied Classification |
|-----------|---------|----------------------|
| ITAR Part Number | Regex: `\bITAR-\d{4}-[A-Z]{2}-\d{6}\b` | Custom: ITAR Part Number |
| Defense Drawing Number | Regex: `\bDWG-DEF-\d{8}(-REV[A-Z])?\b` | Custom: Defense Technical Drawing |
| Proprietary Alloy Code | Regex: `\bALLOY-[A-Z]{3}-\d{3}[A-Z]?\b` | Custom: Trade Secret Material |
| Welding Parameter Set | Column: `*weld_param*`, `*pulse_freq*`, `*gas_ratio*` | Custom: Trade Secret Process Parameter |
| Compensation Column | Column: `*salary*`, `*bonus*`, `*stock_option*` | System: Compensation |

### 7.3 Classification-to-Label Mapping

| Purview Classification | Mapped Label | Auto-Apply |
|-----------------------|-------------|-----------|
| System: US SSN | HC — Sensitive PII | Yes |
| System: Credit Card Number | HC — Sensitive PII | Yes |
| System: Person Name + DOB | Confidential — PII | Yes |
| Custom: ITAR Part Number | HC — ITAR | Recommend (steward review) |
| Custom: Trade Secret Material | HC — Trade Secret | Recommend (steward review) |
| Custom: Trade Secret Process Parameter | HC — Trade Secret | Recommend (steward review) |
| System: Compensation | Confidential — Financial | Yes |

---

## 8. Power BI Integration

### 8.1 Tenant Settings

| Setting | Value |
|---------|-------|
| Allow users to apply sensitivity labels | Enabled — entire organization |
| Apply labels from data sources to Power BI | Enabled |
| Auto-apply labels to downstream content | Enabled |
| Allow workspace admins to override auto-applied labels | Disabled |
| Restrict sharing of protected content via "everyone" links | Enabled |

### 8.2 Label Flow Example

**Source:** Lakehouse `lh_confidential_finance` labeled `Confidential\Financial` via Data Map. **Dataset:** `sm_confidential_finance` inherits `Confidential\Financial` automatically on connection. **Report:** `rpt_quarterly_financials` inherits from dataset; amber banner visible in header. **Dashboard:** Inherits highest label from pinned report tiles. **App:** Audience restricted to `SG-Finance-Viewers`. **Export:** User attempts Excel export — blocked by label policy. PDF export available with watermark.

### 8.3 Inheritance Matrix

| Source 1 | Source 2 | Result Label | Export |
|----------|----------|-------------|--------|
| Internal | Internal | Internal | All formats |
| Internal | Confidential\Financial | Confidential\Financial | PDF only |
| Confidential\PII | Confidential\Financial | Confidential\Financial | PDF only |
| Any | HC — ITAR | HC — ITAR | Blocked |

---

## 9. Monitoring and Reporting

### 9.1 Label Usage Reports

| Report | Frequency | Audience |
|--------|-----------|----------|
| Label distribution (documents, emails, Power BI) | Weekly | Compliance Admin, Data Governance Council |
| Label downgrades (with justification) | Daily | Security Analyst, Compliance Admin |
| Auto-labeling effectiveness (true/false positive rates) | Monthly | Information Protection Admin |
| Unlabeled content in Tier 3+ workspaces | Weekly | Compliance Admin |

### 9.2 DLP Incident Reports

| Alert Type | Severity | Response SLA |
|-----------|----------|-------------|
| External sharing of Confidential content | Medium | 8 business hours |
| External sharing of HC content | High | 2 business hours |
| ITAR export attempt | Critical | 1 hour |
| USB copy of HC content | High | 4 business hours |

### 9.3 Key Performance Indicators

| KPI | Target | Current |
|-----|--------|---------|
| Label coverage (all content) | >95% | 97.2% |
| Auto-label accuracy (true positive) | >98% | 99.1% |
| DLP incident response within SLA | >95% | 93.8% |
| ITAR label accuracy (zero false negatives) | 100% | 100% |
| Unlabeled content in Tier 3+ workspaces | 0% | 0.3% (12 files remediating) |

---

## Cross-References

- **ISL-04 Classification Tier Definitions** — tier model that labels enforce
- **ISL-04 Sensitivity Labeling Standards** — template this example implements
- **ISL-04 Fabric Security Model Example** — workspace access model labels integrate with
- **ISL-04 Manufacturing Classification Example** — client data classification auto-labeling detects
- **ISL-02 Metadata & Lineage** — labels propagated as metadata in Purview Data Catalog
- **ISL-03 Naming Conventions** — label names aligned to tier encoding in naming

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Information Protection Administrator | Initial Purview label configuration |
| 1.0 | 2025-01-15 | Compliance Administrator | DLP policy review and auto-labeling simulation approval |
| 1.0 | 2025-01-15 | Empowered Official | ITAR label and DLP policy sign-off |

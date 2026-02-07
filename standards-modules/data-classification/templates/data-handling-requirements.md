# Data Handling Requirements
> Module: ISL-04 | Version: 1.0 | Adaptation Effort: 3-5 hrs | Dependencies: ISL-03, ISL-04 Tier Definitions

## Purpose

Define the per-tier data handling requirements for storage, transmission, sharing, access control, retention, disposal, and monitoring across all four classification tiers. This document translates the classification tier model (defined in `classification-tier-definitions.md`) and the sensitivity label enforcement actions (defined in `sensitivity-labeling-standards.md`) into actionable, auditable handling requirements that data custodians, IT operations, security teams, and business users must follow.

Every data asset in the enterprise is governed by the handling requirements corresponding to its classification tier. When handling requirements conflict with operational convenience, the handling requirements prevail. Exceptions require documented risk acceptance from the Data Owner and CISO.

---

## Scope

### In Scope

- Per-tier requirements for seven handling areas: storage, transmission, sharing, access control, retention, disposal, and monitoring
- Data handling matrix (tier x handling area) as the primary reference table
- Detailed per-tier breakdowns with specific technical controls
- Incident response timelines and escalation paths by tier
- Third-party and vendor data handling requirements
- Cross-border data transfer rules by tier
- Physical security requirements by tier
- Manufacturing overlay: ITAR physical and logical separation, trade secret handling, OT data
- Exception and risk acceptance process
- Fabric-specific handling guidance (pipelines, Power BI, APIs)

### Out of Scope

- Classification tier definitions and data examples (see ISL-04 `classification-tier-definitions.md`)
- Sensitivity label configuration and auto-labeling (see ISL-04 `sensitivity-labeling-standards.md`)
- Endpoint device management policies (Intune/MDM program)
- Full DLP policy rule authoring (see client DLP documentation)
- Business continuity and disaster recovery planning (BC/DR program)
- Physical facility security beyond data handling (physical security program)

---

## [ADAPTATION REQUIRED] Client Context

> Engagement teams must complete this parameter table before deploying handling requirements.

| Parameter | Default Value | Client Value | Notes |
|-----------|--------------|-------------|-------|
| Primary cloud platform | Microsoft Azure / Fabric | _______________ | Handling requirements assume Azure; adjust for AWS/GCP if multi-cloud |
| Encryption standard (at rest) | AES-256 | _______________ | Must meet or exceed AES-256 |
| Encryption standard (in transit) | TLS 1.2+ | _______________ | TLS 1.3 preferred where supported |
| Key management service | Azure Key Vault | _______________ | HSM tier required for Tier 4 CMK |
| Tier 3 retention — default minimum | 3 years | _______________ | Adjust per industry regulation (7 years for financial services) |
| Tier 4 retention — default minimum | 7 years | _______________ | ITAR: match contract + 5 years; PCI-DSS: per standard |
| Tier 3 access review cadence | Quarterly | _______________ | Range: monthly to semi-annually |
| Tier 4 access review cadence | Monthly | _______________ | Range: weekly to quarterly |
| Incident notification — Tier 3 | 72 hours (GDPR default) | _______________ | Adjust per applicable regulation |
| Incident notification — Tier 4 | 24 hours | _______________ | ITAR incidents: immediate to Empowered Official |
| Approved external sharing platform | None (blocked by default) | _______________ | Client may use secure file transfer (e.g., Kiteworks, Accellion) |
| Legal hold custodian | Legal Department | _______________ | Must have authority to issue and release holds |
| Backup RPO — Tier 3 | 4 hours | _______________ | Recovery Point Objective |
| Backup RPO — Tier 4 | 1 hour | _______________ | Recovery Point Objective |
| Backup RTO — Tier 3 | 8 hours | _______________ | Recovery Time Objective |
| Backup RTO — Tier 4 | 4 hours | _______________ | Recovery Time Objective |
| Third-party security assessment standard | SOC 2 Type II | _______________ | May require ISO 27001, FedRAMP, or CMMC |
| Cross-border transfer mechanism | EU SCCs / DPA | _______________ | Adjust for client jurisdictions |
| Manufacturing overlay required | Yes | _______________ | Set "No" if client has no manufacturing operations |

---

## 1. Data Handling Matrix — Primary Reference

The following matrix is the key reference table for all data handling decisions. Each cell defines the minimum requirement for the intersection of classification tier and handling area.

| Handling Area | Tier 1 — Public | Tier 2 — Internal | Tier 3 — Confidential | Tier 4 — Restricted |
|--------------|-----------------|--------------------|-----------------------|---------------------|
| **Encryption at Rest** | Platform default | AES-256, platform-managed keys | AES-256, service-managed keys (SMK) | AES-256, customer-managed keys (CMK) via Key Vault HSM |
| **Encryption in Transit** | TLS 1.2+ (platform default) | TLS 1.2+ required | TLS 1.2+ required; mutual TLS for APIs | TLS 1.3 required; VPN/ExpressRoute for bulk transfer |
| **Storage Locations** | Any approved platform | Approved enterprise platforms | Approved platforms with access logging | Dedicated isolated environments; no multi-tenant |
| **Backup Frequency** | Per platform default | Daily | Every 4 hours (RPO: 4 hrs) | Hourly (RPO: 1 hr) |
| **Internal Sharing** | Unrestricted | All employees and contractors | Need-to-know; named teams/roles | Named individuals only; JIT via PIM |
| **External Sharing** | Unrestricted | Blocked (requires manager approval) | Blocked (requires data owner + DLP) | Prohibited (requires legal + CISO exception) |
| **Authentication** | Basic authentication acceptable | SSO with MFA | MFA per session required | Phishing-resistant MFA (FIDO2); continuous verification |
| **Authorization Model** | Open access | RBAC — broad roles | RBAC — specific roles with data owner approval | Named-user ACL; JIT/PIM provisioning |
| **Session Timeout** | 8 hours | 8 hours | 4 hours | 1 hour |
| **Minimum Retention** | Per records schedule | Per records schedule | 3 years or regulatory minimum | 7 years or regulatory minimum |
| **Maximum Retention** | No limit | Per records schedule | Per records schedule + legal hold | Minimum required; crypto-shred excess |
| **Disposal Method** | Standard deletion | Standard deletion | Certified deletion with confirmation | Crypto-shred; certified destruction; chain of custody |
| **Audit Logging** | Platform default (90 days) | Enhanced logging (180 days) | Comprehensive logging (1 year) | Real-time logging with SOC alerting (7 years) |
| **Access Review Cadence** | None | Annual | Quarterly | Monthly |
| **Anomaly Detection** | None | None | DLP policy alerts | Real-time UEBA + SOC monitoring |
| **Incident Notification** | None required | Internal notification (5 business days) | Regulatory notification (72 hours) | Regulatory + contractual (24 hours); SOC immediate |

---

## 2. Storage Requirements

### 2.1 Tier 1 — Public Storage

| Requirement | Specification |
|-------------|--------------|
| Encryption at rest | Platform default encryption; no additional requirements |
| Key management | Platform managed; no customer action required |
| Approved storage locations | Any approved enterprise or cloud platform; public CDN permitted |
| Storage account network | Public endpoint acceptable |
| Backup requirements | Per platform default schedule; no enhanced RPO/RTO |
| Data residency | No geographic restrictions |
| Personal device storage | Permitted |
| Removable media | Permitted |

### 2.2 Tier 2 — Internal Storage

| Requirement | Specification |
|-------------|--------------|
| Encryption at rest | AES-256, platform-managed keys (default on Azure/Fabric) |
| Key management | Platform managed; key rotation per platform schedule |
| Approved storage locations | SharePoint, OneDrive, OneLake, Azure SQL, ADLS Gen2, Azure Blob |
| Storage account network | Service endpoint or private endpoint recommended |
| Backup requirements | Daily backups; RPO: 24 hours; RTO: 24 hours |
| Data residency | Preferred: primary business region; no strict geo-fencing |
| Personal device storage | MDM-enrolled devices only |
| Removable media | Discouraged; requires manager acknowledgment |
| Prohibited storage | Personal cloud storage (Dropbox personal, Google Drive personal) |

### 2.3 Tier 3 — Confidential Storage

| Requirement | Specification |
|-------------|--------------|
| Encryption at rest | AES-256, service-managed keys minimum; CMK recommended for financial data |
| Key management | Service-managed; annual key rotation; CMK with Key Vault where required |
| Approved storage locations | SharePoint (restricted), OneLake, Azure SQL, ADLS Gen2 — all with access logging |
| Storage account network | Private endpoint required; no public endpoint |
| Backup requirements | Backups every 4 hours; RPO: 4 hours; RTO: 8 hours; backup encryption required |
| Data residency | Must comply with applicable regulation (GDPR: EU; CCPA: documented) |
| Storage isolation | Dedicated workspaces/containers with restricted membership |
| Personal device storage | Prohibited |
| Removable media | Prohibited without CISO exception |
| Database TDE | Enabled (SMK minimum); Always Encrypted recommended for PII columns |

### 2.4 Tier 4 — Restricted Storage

| Requirement | Specification |
|-------------|--------------|
| Encryption at rest | AES-256 with customer-managed keys (CMK) via Azure Key Vault HSM; DKE for ITAR |
| Key management | Customer-managed; HSM-backed; quarterly key rotation |
| Approved storage locations | Dedicated OneLake workspace, dedicated Azure SQL, ADLS Gen2 (dedicated subscription) |
| Storage account network | Private endpoint only; no public endpoint; dedicated VNet |
| Backup requirements | Hourly backups; RPO: 1 hour; RTO: 4 hours; CMK-encrypted backups; geo-restricted |
| Data residency | Strict geo-fencing; ITAR: US-only; per contract and regulation |
| Storage isolation | Mandatory physical and logical isolation; dedicated resource groups and subscriptions |
| Personal device storage | Prohibited; corporate-managed devices only |
| Removable media | Absolutely prohibited |
| Database TDE | Enabled (CMK); Always Encrypted for sensitive columns; Confidential Computing where available |

---

## 3. Transmission Requirements

| Control | Tier 1 — Public | Tier 2 — Internal | Tier 3 — Confidential | Tier 4 — Restricted |
|---------|-----------------|--------------------|-----------------------|---------------------|
| **Encryption in transit** | TLS 1.2+ recommended | TLS 1.2+ required | TLS 1.2+ required; TLS 1.3 preferred | TLS 1.3 required; mTLS for service-to-service |
| **Network path** | Public internet acceptable | Corporate network preferred | VPN or ExpressRoute for cross-network | ExpressRoute only; no public internet transit |
| **Email transmission** | Unrestricted | Internal + external with awareness | Internal encrypted only; external blocked by DLP | Prohibited; approved secure transfer only |
| **File transfer** | Any method | Corporate tools (OneDrive, SharePoint, Teams) | SFTP, ADF managed endpoints, OneDrive (encrypted) | Dedicated secure transfer; AzCopy with CMK |
| **API transmission** | HTTPS | HTTPS with API key or OAuth | OAuth 2.0 + scoped tokens; APIM required | mTLS + OAuth 2.0; APIM with IP restrictions |
| **Real-time streaming** | Standard | Kafka with SASL/SSL | Kafka SASL/SSL + topic-level ACLs | Event Hubs CMK; dedicated namespace; private endpoint |
| **Inter-region transfer** | No restriction | Permitted | Data residency compliance review required | Legal and regulatory approval per transfer |
| **Print/fax** | Unrestricted | Permitted | Secure print (badge release) with watermark | Prohibited without CISO exception |

---

## 4. Sharing Requirements

| Control | Tier 1 — Public | Tier 2 — Internal | Tier 3 — Confidential | Tier 4 — Restricted |
|---------|-----------------|--------------------|-----------------------|---------------------|
| **Internal sharing** | Unrestricted | All employees and authorized contractors | Need-to-know; data owner-approved groups | Named individuals only; JIT access |
| **External sharing** | Permitted | Prohibited (default); manager exception | Prohibited; data owner + legal exception | Prohibited; CISO + Legal + exec sponsor exception |
| **SharePoint sharing** | Anyone links allowed | Organization links only | Specific people links; no anonymous | View-only in browser; no download |
| **Power BI sharing** | Publish to web allowed | Organization-wide app | Workspace app to approved security groups | Named user workspace; no app distribution |
| **Fabric workspace sharing** | Viewer role open | Viewer role for org | Viewer/Contributor to approved groups | Named user roles; workspace audit enabled |
| **Guest access (B2B)** | Allowed | Manager approval required | Data owner approval; MFA enforced; NDA required | Prohibited |
| **DLP policy** | None | Monitor (log external sharing) | Block + notify data owner | Block + SOC alert + auto-incident |
| **Teams sharing** | Unrestricted | Internal channels/teams | Private channels; approved members | Not permitted in Teams |
| **Cross-workspace (Fabric)** | Allowed | Allowed (internal workspaces) | Allowed to equal or higher tier only | Not allowed; data stays in dedicated workspace |

### [ADAPTATION REQUIRED] Client Sharing Configuration

> Replace defaults with client-specific sharing rules:

| Sharing Parameter | Default | Client Value | Notes |
|------------------|---------|-------------|-------|
| Tier 2 external sharing approval | Manager | _______________ | Some clients permit external with training completion |
| Tier 3 approved external platform | None | _______________ | e.g., Kiteworks, Accellion, ShareFile |
| Tier 3 guest access max duration | 30 days | _______________ | Range: 7-90 days |
| Tier 3 NDA requirement for guests | Yes | _______________ | May use click-through NDA |
| DLP notification recipients | Data owner | _______________ | May include compliance officer, manager |

---

## 5. Access Control Requirements

| Control | Tier 1 — Public | Tier 2 — Internal | Tier 3 — Confidential | Tier 4 — Restricted |
|---------|-----------------|--------------------|-----------------------|---------------------|
| **Authentication** | Standard SSO | MFA (any method) | MFA per session (Authenticator/FIDO2) | Phishing-resistant MFA only (FIDO2/WHfB) |
| **Authorization model** | RBAC (broad roles) | RBAC (department/team) | RBAC + ABAC (role + dept + project) | RBAC + ABAC + PIM (JIT, named individuals) |
| **Conditional Access — device** | Any device | Managed or compliant | Compliant (Intune-enrolled) | Corporate-managed, encrypted, locked |
| **Conditional Access — location** | Any | Any (corporate preferred) | Corporate network + approved VPN | Corporate network only; named IP ranges |
| **Conditional Access — app** | Any client | Approved client apps | Approved apps + app protection policy | Approved apps + managed browser only |
| **Session controls** | 8-hour timeout | 8-hour timeout | 4-hour lifetime; 30-min inactivity | 1-hour lifetime; 15-min inactivity; CAE |
| **Access review** | None | Annual | Quarterly | Monthly (auto-revoke if not re-certified) |
| **Access provisioning** | Self-service | Manager-approved request | Data owner-approved; ITSM ticket | PIM eligible; JIT (max 8 hrs); dual approval |
| **Separation of duties** | Not required | Recommended | Required for modify + approve | Required; technically enforced |
| **Service accounts** | Permitted | Managed identity preferred | Managed identity required | Managed identity only; certificate-based |
| **Emergency access** | N/A | Standard break-glass | Break-glass; 24-hr post-use review | Break-glass; real-time SOC alert; 4-hr review |

### [ADAPTATION REQUIRED] Client Access Configuration — Tier 4

> Replace defaults with client-specific Tier 4 access requirements:

| Access Parameter | Default | Client Value | Notes |
|-----------------|---------|-------------|-------|
| JIT max activation window | 8 hours | _______________ | Some clients require 4-hour maximum |
| PIM approval required from | Data Owner | _______________ | May require dual approval (Data Owner + CISO) |
| Access recertification cadence | Monthly | _______________ | Some clients require bi-weekly |
| Break-glass notification | SOC real-time | _______________ | May also require CISO SMS alert |
| ITAR US Person attribute | `employeeType=US_Person` | _______________ | Map to client Entra ID schema |

---

## 6. Retention and Disposal Requirements

### 6.1 Retention Requirements by Tier

| Control | Tier 1 — Public | Tier 2 — Internal | Tier 3 — Confidential | Tier 4 — Restricted |
|---------|-----------------|--------------------|-----------------------|---------------------|
| **Default retention** | Per records schedule (3 yrs typical) | Per records schedule (5 yrs typical) | Per regulation (GDPR: minimization; SOX: 7 yrs) | Per regulation + legal counsel; min 7 yrs |
| **Legal hold capability** | Standard M365 hold | Standard M365 hold | Purview eDiscovery case hold; automated triggers | Dedicated legal hold; chain of custody; immediate |
| **Legal hold trigger** | Litigation notification | Litigation notification | Litigation, regulatory inquiry, audit finding | Litigation, regulatory, incident, M&A, whistleblower |
| **GDPR erasure SLA** | N/A (no PII) | N/A (business contact only) | 30-day erasure upon verified request | 15-day erasure; confirmation; all copies including backups |

### [ADAPTATION REQUIRED] Client Retention Schedule

> Replace defaults with client-specific retention periods:

| Data Sub-Classification | Default Minimum | Client Minimum | Regulatory Driver |
|------------------------|----------------|---------------|-------------------|
| Tier 3 — PII | 3 years | _______________ | GDPR Art. 5(1)(e), CCPA |
| Tier 3 — Financial | 7 years | _______________ | SOX, tax regulations |
| Tier 3 — Business | 3 years | _______________ | Contract terms, NDA duration |
| Tier 3 — Customer | 3 years | _______________ | DPA terms, contract duration |
| Tier 3 — Technical | 5 years | _______________ | Patent prosecution, IP lifecycle |
| Tier 4 — ITAR | Contract + 5 years | _______________ | 22 CFR, DFARS |
| Tier 4 — Trade Secret | Indefinite (while trade secret) | _______________ | DTSA, competitive need |
| Tier 4 — Sensitive PII | 7 years | _______________ | HIPAA, PCI-DSS, state laws |
| Tier 4 — Legal Privilege | Per case lifecycle | _______________ | Legal counsel determination |
| Tier 4 — Executive | 10 years | _______________ | SEC, governance requirements |

### 6.2 Disposal Requirements by Tier

| Control | Tier 1 — Public | Tier 2 — Internal | Tier 3 — Confidential | Tier 4 — Restricted |
|---------|-----------------|--------------------|-----------------------|---------------------|
| **Disposal method** | Standard soft delete (93-day recovery) | Standard deletion with confirmation | Certified deletion; crypto-shred for encrypted data | Crypto-shred + DoD 5220.22-M wipe for physical; certified destruction |
| **Disposal approval** | Records manager | Records manager | Data owner + records manager | Data owner + legal + CISO |
| **Disposal certification** | Not required | Email confirmation | Signed disposal certificate; retained 3 years | Signed certificate; chain of custody; witness; retained 10 years |
| **Backup disposal** | Per backup schedule | Per backup schedule | Explicit backup disposal on early termination | All copies tracked and destroyed; crypto-shred backups |
| **Media sanitization** | Not required | NIST 800-88 Clear | NIST 800-88 Purge | NIST 800-88 Destroy; third-party verification for ITAR |
| **Verification** | None | Automated deletion log | IT confirms deletion; steward verifies catalog removal | Dual verification: IT + data owner; forensic confirmation |

---

## 7. Monitoring and Audit Requirements

| Control | Tier 1 — Public | Tier 2 — Internal | Tier 3 — Confidential | Tier 4 — Restricted |
|---------|-----------------|--------------------|-----------------------|---------------------|
| **Access logging** | Platform default | Enabled (Entra ID, Unified Audit Log) | Enhanced (all access, data ops, sharing events) | Comprehensive (all events, session recording) |
| **Log retention** | 90 days | 180 days | 1 year | 7 years (immutable WORM storage) |
| **Log storage** | Standard Log Analytics | Log Analytics workspace | Dedicated Log Analytics; immutable ADLS export | Dedicated Log Analytics + immutable ADLS + SIEM |
| **Alert triggers** | None | Failed MFA (5+ attempts) | External sharing, bulk download, new location, privilege escalation | Any access event, label downgrade, export attempt, off-hours access |
| **Alert response SLA** | N/A | 24 hours (business) | 4 hours (business); 8 hours (after-hours) | 1 hour (24/7); auto-escalation after 30 minutes |
| **Audit review cadence** | None | Annual | Monthly | Weekly (automated) + monthly (manual) |
| **DLP monitoring** | None | Policy tips (education) | Block + notify data owner + DLP queue | Block + SOC alert + auto-incident + manager notify |
| **UEBA** | None | Baseline monitoring | Anomaly detection (unusual patterns) | Real-time UEBA; auto-terminate on high-risk |
| **Compliance reporting** | None | Quarterly dashboard | Monthly report to governance council | Weekly report to CISO; daily dashboard to data owner |

---

## 8. Physical Security Requirements

| Control | Tier 1 — Public | Tier 2 — Internal | Tier 3 — Confidential | Tier 4 — Restricted |
|---------|-----------------|--------------------|-----------------------|---------------------|
| **Device requirements** | Any device | Corporate or MDM-enrolled | Corporate-managed; disk encryption | Corporate-managed; encrypted; USB/camera disabled |
| **Printing** | Unrestricted | Permitted | Secure print (badge release) + watermark | Prohibited without CISO exception; counted copies |
| **Screen capture** | Permitted | Permitted | Discouraged; warn via DLP | Blocked via WIP |
| **Photography** | Permitted | Use judgment | Prohibited where Tier 3 data displayed | Prohibited; phone-free zones |
| **Clean desk** | Recommended | Required (end of day) | Required (leaving desk) | Required (always); locked cabinet |
| **Visitor access** | No restriction | Escort in office areas | No visitor access to Tier 3 areas | No visitor access; dedicated secure room |
| **Work from home** | Permitted | Permitted with corporate device | Corporate device + VPN; no public spaces | CISO approval; secure home office requirements |
| **Public spaces** | Permitted | Privacy screen recommended | Prohibited from display | Prohibited; no access outside secured premises |

---

## 9. Incident Response by Tier

### 9.1 Incident Notification Timelines

| Tier | Incident Examples | Internal Notification | Regulatory Notification | Executive Notification |
|------|------------------|----------------------|------------------------|----------------------|
| Tier 1 | Unauthorized modification of public content | 5 business days (IT manager) | Not required | Not required |
| Tier 2 | Internal data emailed externally | 2 business days (dept manager + IT security) | Not required unless PII | Not required |
| Tier 3 | PII breach, financial data leak, unauthorized access | 24 hours (data owner + IT security + privacy officer) | 72 hours GDPR; 30 days CCPA | CIO/CISO within 24 hours |
| Tier 4 | Trade secret exfiltration, ITAR violation, SSN breach | Immediate (CISO + Legal + data owner) | 24 hours GDPR (sensitive); immediate ITAR (State Dept.) | CEO/Board within 24 hours |

### 9.2 Escalation Paths

| Tier | Level 1 (Detection) | Level 2 (Investigation) | Level 3 (Response) | Level 4 (Executive) |
|------|---------------------|------------------------|-------------------|---------------------|
| Tier 1 | IT help desk | IT operations | IT manager | — |
| Tier 2 | IT help desk / SOC triage | IT security analyst | IT security manager + dept head | CIO (if pattern) |
| Tier 3 | SOC analyst | Incident response team | CISO + Privacy Officer + data owner | CIO + General Counsel |
| Tier 4 | SOC analyst (immediate) | IR commander + Legal | CISO + General Counsel + Empowered Official | CEO + Board (if material) |

### 9.3 Containment Actions by Tier

| Tier | Immediate Containment | Investigation Window | Evidence Preservation |
|------|----------------------|---------------------|---------------------|
| Tier 1 | Restore from backup | 10 business days | Platform logs (90 days) |
| Tier 2 | Revoke external access; notify affected users | 5 business days | Enhanced logs (180 days) |
| Tier 3 | Revoke non-essential access; isolate systems; preserve evidence | 48 hours to initial assessment | Comprehensive logs (1 year); forensic image |
| Tier 4 | Isolate immediately; revoke all access; engage IR retainer | 24 hours to initial assessment | Immutable logs (7 years); forensic image; chain of custody |

---

## 10. Third-Party and Vendor Data Handling

### 10.1 Vendor Security Assessment Requirements

| Tier | Assessment Required | Minimum Standard | Reassessment Cadence |
|------|-------------------|------------------|---------------------|
| Tier 1 | None | — | — |
| Tier 2 | Vendor security questionnaire | Basic security practices | Every 2 years |
| Tier 3 | SOC 2 Type II or equivalent | SOC 2 Type II, ISO 27001 | Annual |
| Tier 4 | SOC 2 Type II + on-site assessment | SOC 2 Type II + CMMC Level 2 (ITAR) | Semi-annual; continuous monitoring |

### 10.2 Vendor Contractual Requirements

| Control | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---------|--------|--------|--------|--------|
| **DPA required** | No | Standard terms | Full DPA with GDPR/CCPA annexes | Full DPA with special categories |
| **NDA required** | No | Standard NDA | Enhanced per-engagement NDA | Enhanced NDA + IP assignment |
| **Right to audit** | No | Best effort | Annual contractual right | Semi-annual + surprise audit right |
| **Breach notification SLA** | — | 5 business days | 48 hours | 24 hours |
| **Subprocessor approval** | No | No | Prior written approval | Prior written approval + security assessment |

### 10.3 Vendor Data Transfer Requirements

| Tier | Transfer Method | Encryption | Access Duration | Deletion After Use |
|------|---------------|-----------|----------------|-------------------|
| Tier 1 | Any | Platform default | No limit | Per vendor agreement |
| Tier 2 | Approved enterprise channels | TLS 1.2+ | Per contract term | Within 30 days of contract end |
| Tier 3 | Secure file transfer or API with mTLS | TLS 1.2+ + encryption at rest | Time-boxed; minimum necessary | Within 15 days; certified |
| Tier 4 | Dedicated encrypted channel or physical | E2E encryption; CMK | Minimum necessary; JIT | Within 7 days; certified destruction + chain of custody |

---

## 11. Cross-Border Data Transfer Rules

### 11.1 Transfer Requirements by Tier

| Tier | Cross-Border Permitted | Legal Mechanism | Additional Requirements |
|------|----------------------|----------------|------------------------|
| Tier 1 | Yes — unrestricted | None | — |
| Tier 2 | Yes — within approved regions | SCCs (if EU data) | Document transfer in records |
| Tier 3 | Yes — with legal review | EU SCCs, DPA, Transfer Impact Assessment | Data owner approval; encryption; DLP |
| Tier 4 | Restricted — legal + CISO approval | SCCs + supplementary measures; ITAR: US-only | Legal sign-off per transfer; ITAR never leaves US |

### 11.2 ITAR-Specific Transfer Restrictions

| Restriction | Requirement |
|-------------|------------|
| Geographic | US-based data centers only (Azure US regions) |
| Personnel | Verified US Persons only (citizens, permanent residents) |
| Cloud sovereignty | Azure commercial US or Azure Government; no EU/Asia sovereign cloud |
| Transfer method | No electronic transfer outside US; physical transfer requires State Dept. approval |
| Subprocessor | All subprocessors US-based with ITAR compliance programs |

### 11.3 Data Residency by Regulatory Driver

| Regulation | Data Type | Residency Requirement | ISL-04 Tier |
|-----------|-----------|----------------------|-------------|
| GDPR | EU personal data | EU/EEA or adequate country + SCCs | Tier 3 (PII), Tier 4 (Sensitive PII) |
| CCPA | California resident data | No strict residency; purpose limitation | Tier 3 (PII) |
| ITAR (22 CFR) | Defense technical data | US only | Tier 4 (ITAR) |
| PCI-DSS | Cardholder data | Zone segmentation required | Tier 4 (Sensitive PII) |
| HIPAA | Protected health information | BAA required; no strict residency | Tier 4 (Sensitive PII) |
| SOX | Financial reporting data | Access control required; no strict residency | Tier 3 (Financial) |

---

## Fabric / Azure Implementation Guidance

### Storage Implementation by Tier

| Tier | Fabric/Azure Resource | Configuration |
|------|----------------------|---------------|
| Tier 1 | Standard Fabric workspace; Azure Blob (hot) | Platform encryption; public read for published content |
| Tier 2 | Standard Fabric workspace; SharePoint; ADLS Gen2 | AES-256 platform keys; workspace RBAC; standard networking |
| Tier 3 | Dedicated Fabric workspace per domain; ADLS Gen2 (private endpoint) | AES-256 SMK; private endpoints; restricted membership; Purview label |
| Tier 4 | Isolated Fabric workspace with PIM; dedicated Azure subscription | AES-256 CMK (HSM); private endpoint only; DKE for ITAR |

### Network Security by Tier

| Tier | Network Controls |
|------|-----------------|
| Tier 1 | Standard Azure networking; CDN permitted |
| Tier 2 | Service endpoints recommended; Azure Firewall for outbound |
| Tier 3 | Private endpoints required; NSG rules; Azure Firewall |
| Tier 4 | Private endpoints mandatory; no public IP; ExpressRoute; Firewall Premium with TLS inspection; dedicated VNet |

### Monitoring and Logging by Tier

| Tier | Logging Configuration | SIEM Integration | Alert Rules |
|------|----------------------|------------------|-------------|
| Tier 1 | Azure Monitor basic; 90-day retention | Not required | None |
| Tier 2 | Azure Monitor standard; 180-day retention | Optional | External sharing attempts |
| Tier 3 | Azure Monitor + Purview audit; 1-year; Log Analytics | Required (Sentinel) | Unauthorized access, bulk download, off-hours, DLP violations |
| Tier 4 | Monitor + Purview + Defender; 7-year; immutable WORM | Required (Sentinel, dedicated) | All access; real-time SOC; anomaly; privilege escalation |

### Handling in Fabric Pipelines

| Scenario | Tier 1-2 | Tier 3 | Tier 4 |
|----------|----------|--------|--------|
| Credential storage | Connection string | Azure Key Vault (standard) | Azure Key Vault (HSM, dedicated) |
| Pipeline identity | Shared service principal | Dedicated managed identity per workspace | Dedicated managed identity per pipeline; cert-based |
| Pipeline logging | Activity log | Activity log + custom audit events | Activity log + custom audit + data-level tracking |
| Error handling | Standard logging | Mask sensitive fields in error output | No data in error logs; reference IDs only |
| Intermediate storage | Staging lakehouse | Encrypted staging; auto-purge | Dedicated staging; CMK; crypto-shred after pipeline |

### Handling in Power BI Reports

| Scenario | Tier 1-2 | Tier 3 | Tier 4 |
|----------|----------|--------|--------|
| Refresh credential | Standard OAuth | Service principal + Key Vault | Managed identity + Key Vault HSM |
| Distribution | Organization-wide | Security group-scoped app | Named user workspace |
| Export | All formats | PDF only (watermarked) | Export disabled |
| Embedding | Public embed allowed | Internal secure embed only | Embedding prohibited |
| Mobile access | Any device | Intune-managed devices | Prohibited on mobile |

### Handling via APIs (ISL-01 Alignment)

| Scenario | Tier 1-2 | Tier 3 | Tier 4 |
|----------|----------|--------|--------|
| Authentication | API key or OAuth 2.0 | OAuth 2.0 with scoped permissions | OAuth 2.0 + mTLS + IP allowlist |
| Rate limiting | Standard tier | Reduced limits for bulk ops | Strict limits; per-request audit |
| Response data | Full payload | Filtered by caller access level | Minimal payload; field-level encryption |
| Logging | Request/response metadata | Metadata + caller identity | Full request/response + payload hash |
| Gateway | Optional | Required (Azure APIM) | Required (APIM with WAF, DDoS) |

---

## Manufacturing Overlay [CONDITIONAL]

> Include this section when the client has manufacturing, engineering, or defense-related operations. Remove if not applicable (set "Manufacturing overlay required = No" in Client Context table).

### ITAR Physical and Logical Separation Requirements

| Requirement | Specification |
|-------------|--------------|
| **Logical isolation** | Dedicated Azure subscription for ITAR data; no resource sharing with non-ITAR |
| **Network isolation** | Dedicated VNet; no peering to non-ITAR networks; ExpressRoute for on-premises |
| **Workspace isolation** | Dedicated Fabric workspace(s); PIM-only access; no cross-workspace shortcuts |
| **Identity isolation** | Entra ID security group `SG-ITAR-USPersons`; verified US Person attribute; annual re-verification |
| **Key isolation** | Dedicated Key Vault HSM; no shared keys with non-ITAR workloads |
| **Backup isolation** | Separate US-only storage account; encrypted with ITAR-dedicated CMK |
| **Logging isolation** | Dedicated Log Analytics workspace; 7-year immutable retention; Empowered Official access |
| **Disposal verification** | Third-party verified destruction; NIST 800-88 Destroy; State Department records retention |

### Trade Secret Handling Requirements

| Requirement | Specification |
|-------------|--------------|
| **Access control** | Named individuals only; NDA on file; annual NDA renewal |
| **Numbered copies** | All distributed copies tracked with unique identifiers; copy log maintained |
| **Screen capture** | Blocked via WIP or endpoint DLP |
| **Print** | Blocked; exception requires data owner approval with numbered, watermarked output |
| **Storage** | CMK-encrypted; no multi-tenant; dedicated workspace |
| **Transmission** | Encrypted secure file transfer only; no email; no USB; no messaging |
| **Exit interview** | All trade secret access revoked before final day; ongoing confidentiality acknowledgment |

### IoT/OT Data Handling

| Data Type | Default Tier | Handling Requirements | Escalation Conditions |
|-----------|-------------|----------------------|----------------------|
| Raw sensor telemetry | Tier 2 | Standard internal handling; bronze lakehouse | Tier 3 if per-product-line; Tier 4 if trade secret process |
| Machine state and alarms | Tier 2 | Standard internal; operational dashboards | Tier 3 if reveals production capacity details |
| Production rates | Tier 2 | Standard internal | Tier 3 if per-product or per-customer granularity |
| Process control parameters | Tier 3 or 4 | Confidential or Restricted per trade secret status | Data owner determines trade secret designation |
| OT network configuration | Tier 3 | Confidential\Technical; private endpoint only | Tier 4 if contains SCADA credentials |
| SCADA credentials | Tier 4 | Restricted; HSM-stored; named individual only | Always Tier 4; no exceptions |
| Quality vision system images | Tier 2 | Standard internal | Tier 3 if reveals proprietary tooling/process |
| Predictive maintenance models | Tier 3 | Confidential\Technical | Tier 4 if model embodies trade secret algorithms |

---

## 12. Exception and Risk Acceptance Process

### 12.1 Exception Request Requirements

| Tier | Exception Approver | Required Documentation | Maximum Duration |
|------|-------------------|----------------------|-----------------|
| Tier 1 | IT Manager | Brief justification | 1 year |
| Tier 2 | Department Head + IT Security | Justification + alternative controls | 6 months |
| Tier 3 | Data Owner + CISO | Risk assessment + compensating controls + monitoring plan | 90 days (renewable once) |
| Tier 4 | Data Owner + CISO + Legal + CIO | Formal risk acceptance + compensating controls + enhanced monitoring + exit plan | 30 days (renewable with re-assessment) |

### 12.2 Risk Acceptance Documentation

Every exception must include:

- Exception requestor, date, and business unit
- Data assets affected (tier, sub-classification, Purview asset IDs)
- Specific handling requirement being excepted
- Business justification for exception
- Compensating controls in place during exception
- Residual risk assessment (likelihood x impact)
- Exception duration and renewal conditions
- Monitoring plan during exception period
- Exit plan to return to standard handling
- Approver signatures and date

---

## 13. Comprehensive Control Matrix — Quick Reference

| Category | Sub-Control | T1 | T2 | T3 | T4 |
|----------|-----------|----|----|----|----|
| **Storage** | Encryption | Platform default | AES-256 SMK | AES-256 SMK | AES-256 CMK (HSM) |
| **Storage** | Key mgmt | Platform | Platform | Service-managed | Customer-managed |
| **Storage** | Network | Public OK | Service endpoint | Private endpoint | Private EP + dedicated VNet |
| **Storage** | Personal device | Allowed | MDM only | Prohibited | Prohibited |
| **Storage** | Removable media | Allowed | Discouraged | Prohibited | Prohibited |
| **Transit** | TLS | 1.2+ rec | 1.2+ req | 1.2+ req (1.3 pref) | 1.3 req; mTLS S2S |
| **Transit** | Network path | Public | Corporate pref | VPN/ER | ExpressRoute only |
| **Transit** | Email | Unrestricted | Int + ext | Int encrypted only | Prohibited |
| **Sharing** | Internal | Unrestricted | All employees | Need-to-know | Named individuals JIT |
| **Sharing** | External | Allowed | Prohibited (default) | Prohibited (exception) | Prohibited |
| **Sharing** | DLP | None | Monitor | Block + notify | Block + SOC alert |
| **Access** | Auth | SSO | MFA (any) | MFA per session | FIDO2/WHfB |
| **Access** | Authorization | RBAC broad | RBAC team | RBAC+ABAC | RBAC+ABAC+PIM JIT |
| **Access** | Device | Any | Managed | Compliant | Managed+encrypted |
| **Access** | Session | 8 hr | 8 hr | 4 hr | 1 hr |
| **Access** | Review | None | Annual | Quarterly | Monthly |
| **Retention** | Default | 3 yr | 5 yr | Per regulation | 7 yr+ |
| **Disposal** | Method | Soft delete | Confirmed | Crypto-shred+cert | Crypto-shred+DoD wipe |
| **Monitor** | Logging | Default | Enhanced | Comprehensive | Real-time+SIEM |
| **Monitor** | Retention | 90 days | 180 days | 1 year | 7 years WORM |
| **Monitor** | Alert SLA | N/A | 24 hr | 4 hr | 1 hr 24/7 |
| **Physical** | Print | Unrestricted | Allowed | Secure print | Prohibited |
| **Physical** | WFH | Allowed | Allowed | Corp device+VPN | CISO approval |

---

## Cross-References

| ISL Module | Relationship to Data Handling Requirements |
|-----------|-------------------------------------------|
| **ISL-01 — API Governance** | API security controls (authentication, encryption, rate limiting) must meet or exceed the handling requirements of the data tier exposed |
| **ISL-02 — Metadata & Lineage** | Handling requirements are tracked as metadata attributes; lineage shows tier propagation through pipelines |
| **ISL-03 — Naming Conventions** | Workspace and storage account names encode tier, informing handling requirements at the infrastructure level |
| **ISL-04 — Tier Definitions** | This document operationalizes the tiers defined in `classification-tier-definitions.md` |
| **ISL-04 — Sensitivity Labeling** | Label enforcement actions in `sensitivity-labeling-standards.md` must align with handling requirements in this document |
| **ISL-05 — Integration Patterns** | Pipeline patterns must enforce handling requirements during data movement (encryption, access checks, tier validation) |
| **ISL-06 — Data Quality** | Quality SLA thresholds and incident response SLAs increase with tier, complementing handling requirements |

---

## Compliance Alignment

| Framework | Relevant Controls | ISL-04 Handling Alignment |
|-----------|------------------|--------------------------|
| **NIST SP 800-53 Rev. 5** | SC-8 (Transmission Confidentiality), SC-12 (Key Mgmt), SC-28 (Protection at Rest), AU-6 (Audit Review) | Per-tier encryption, key management, and audit requirements map to NIST control families |
| **ISO/IEC 27001:2022** | A.5.14 (Information Transfer), A.8.10 (Information Deletion), A.8.24 (Cryptography) | Transmission, disposal, and encryption requirements satisfy ISO 27001 Annex A |
| **DAMA DMBOK** | Chapter 7 — Data Security (handling controls by sensitivity) | Handling matrix implements proportional controls by classification |
| **OWASP** | Data Protection (transport, storage, logging) | Encryption and logging requirements align with OWASP recommendations |
| **GDPR** | Art. 5 (Storage Limitation), Art. 17 (Right to Erasure), Art. 32 (Security), Art. 33 (Breach Notification) | Retention, disposal, encryption, and incident notification satisfy GDPR |
| **ITAR (22 CFR)** | §120.10 Technical Data, §126.1 Prohibited Exports | ITAR overlay implements physical/logical separation and US Person restriction |
| **PCI-DSS v4.0** | Req. 3 (Stored Data), Req. 4 (Data in Transit), Req. 9 (Physical), Req. 10 (Logging) | Tier 4 handling for Sensitive PII satisfies PCI-DSS requirements |
| **SOX** | Section 302/404 — Internal Controls | Tier 3 Financial handling supports SOX access and audit requirements |
| **NIST SP 800-88** | Media Sanitization Guidelines | Disposal references 800-88 Clear (T2), Purge (T3), Destroy (T4) |
| **Cloud Adoption Framework (CAF)** | Security baseline — Data protection | Handling requirements align with CAF recommended controls per sensitivity |

---

## Revision History

| Version | Date | Author | Change Description |
|---------|------|--------|-------------------|
| 1.0 | 2025-01-15 | ISL Standards Team | Initial release — per-tier handling requirements with manufacturing overlay |
| — | — | — | _Future revisions will be recorded here_ |

---

*This document is part of the Integration Standards Library (ISL). For questions or change requests, contact the Data Governance Council or submit a pull request to the ISL repository.*

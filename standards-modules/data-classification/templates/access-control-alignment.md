# Access Control Alignment
> ISL-04 | Integration Standards Library | v1.0

**Module:** ISL-04 — Data Classification & Sensitivity Framework
**Purpose:** Define role-based and attribute-based access control patterns aligned to each classification tier, including Entra ID group structures, Fabric workspace security, Power BI row/object-level security, SQL permissions, Conditional Access policies, and privileged access management
**Adaptation Effort:** 4-8 hours
**Dependencies:** ISL-03 (naming conventions for security groups and workspaces), ISL-04 classification-tier-definitions (tier model), ISL-04 sensitivity-labeling-standards (label enforcement actions)

---

## 1. Purpose

Access control is the primary enforcement mechanism that translates data classification policy into operational reality. Without a systematic mapping between classification tiers and access control patterns, organizations experience one of two failure modes: (1) over-permissive access where sensitive data is broadly available to users who do not need it, or (2) over-restrictive access where excessive friction drives shadow IT and workarounds that bypass controls entirely.

This standard defines a comprehensive access control model for each classification tier, covering identity management (Entra ID), platform-level security (Fabric, Power BI, Azure SQL), network-level controls (Conditional Access), and privileged access management. Every control is mapped to a specific tier so that engagement teams can deploy proportional security without ambiguity.

Use this standard when:
- Designing access control architecture for a new Fabric/Azure data platform
- Mapping existing client security groups to classification tiers
- Implementing Row-Level Security (RLS) or Object-Level Security (OLS) in Power BI
- Configuring Conditional Access policies aligned to data sensitivity
- Establishing privileged access workflows for Tier 3/4 data
- Conducting access reviews and recertification exercises

---

## 2. Scope

### 2.1 In Scope

- Access control model selection per classification tier (RBAC, ABAC, JIT)
- Entra ID (Azure AD) group structure and naming conventions for tier-aligned security
- Microsoft Fabric workspace role assignments per tier
- OneLake folder-level and table-level permission patterns
- Power BI Row-Level Security (RLS) and Object-Level Security (OLS)
- Azure SQL / Fabric SQL Endpoint schema-level permissions and dynamic data masking
- Conditional Access policies per tier (MFA, device compliance, location restrictions)
- Privileged Access Management (PAM) for Tier 4 data
- Just-in-time (JIT) access patterns for Tier 3 and Tier 4
- Service principal and managed identity access controls by tier
- Access review and recertification cadence
- Break-glass and emergency access procedures

### 2.2 Out of Scope

- Network security architecture (firewalls, NSGs, private endpoints) — covered in ISL-05
- Data encryption key management — covered in ISL-04 data-handling-requirements
- Application-level authorization (custom app RBAC) — application-specific
- Physical access controls — facility security domain
- Identity lifecycle management (joiner/mover/leaver automation) — IAM domain

---

## 3. [ADAPTATION REQUIRED] Client Context

> Customize the following parameters for each engagement. Default values represent a mid-size manufacturing organization with Microsoft E5 licensing.

| Parameter | Default Value | Client Value | Notes |
|-----------|--------------|-------------|-------|
| **Identity Provider** | Microsoft Entra ID (Azure AD) | ___________ | Confirm Entra ID is primary IdP; note any federated IdPs |
| **Licensing Tier** | Microsoft 365 E5 + Fabric F64 | ___________ | E5 required for full Conditional Access; E3 has limitations |
| **Entra ID Group Naming Prefix** | `SG-Data-` | ___________ | Must align to ISL-03 naming conventions |
| **Existing Security Group Structure** | Greenfield (new groups) | ___________ | If brownfield, map existing groups to tier model |
| **Conditional Access Baseline** | Microsoft-recommended defaults | ___________ | Document any existing CA policies that conflict |
| **MFA Method (Tier 3)** | Microsoft Authenticator push | ___________ | Confirm supported MFA methods |
| **MFA Method (Tier 4)** | FIDO2 security key | ___________ | Confirm FIDO2 key deployment status |
| **PIM Licensed** | Yes (Entra ID P2) | ___________ | Required for JIT access; alternative if not licensed |
| **Access Review Tool** | Entra ID Access Reviews | ___________ | Alternative: manual quarterly spreadsheet |
| **Break-Glass Account Count** | 2 | ___________ | Minimum 2 recommended; stored in secure vault |
| **Approval Workflow Tool** | Power Automate + ServiceNow | ___________ | Client's ticketing/approval platform |
| **ITAR Applicable** | Yes | ___________ | If No, skip ITAR-specific access controls |
| **Guest Access Permitted** | Tier 1-2 only | ___________ | Some clients allow managed guest access for Tier 3 |

---

## 4. Access Control Model by Classification Tier

### 4.1 Model Selection Matrix

| Attribute | Tier 1 — Public | Tier 2 — Internal | Tier 3 — Confidential | Tier 4 — Restricted |
|-----------|-----------------|--------------------|-----------------------|---------------------|
| **Access Model** | Open (authenticated) | RBAC (role-based) | RBAC + ABAC (attribute-based) | ABAC + JIT (just-in-time) |
| **Authorization Basis** | Valid organizational identity | Organizational membership | Role/function + business need | Named individual + explicit approval |
| **Access Provisioning** | Automatic on hire | Automatic via group membership | Request + manager approval | Request + data owner + CISO approval |
| **Access Duration** | Permanent (while employed) | Permanent (while employed) | Duration-limited (project/role-based) | Time-boxed (JIT, max 8 hours default) |
| **Access Review** | None | Annual | Quarterly | Monthly |
| **Separation of Duties** | Not required | Not required | Recommended | Required (enforced) |
| **Audit Level** | Standard authentication logs | Group membership changes | All access events + data actions | All access events + session recording |
| **Emergency Access** | N/A | N/A | Break-glass with CISO notification | Break-glass with CISO + Legal notification |

### 4.2 Role Definitions

| Role Name | Description | Applicable Tiers | Typical Assignment |
|-----------|-------------|-------------------|-------------------|
| Data Reader | Read-only access to data assets | 1, 2, 3 | Analysts, report consumers |
| Data Contributor | Read and write access to data assets | 2, 3 | Data engineers, ETL developers |
| Data Steward | Classify, label, and manage data quality for a domain | 2, 3, 4 | Domain data stewards |
| Data Owner | Full control over data assets in their domain; approve access requests | 2, 3, 4 | Business domain leads |
| Data Engineer | Build and manage pipelines, transformations, and data models | 2, 3 | Technical platform team |
| Data Analyst | Query, analyze, and build reports from data | 1, 2, 3 | Business analysts |
| Data Scientist | Access data for ML/AI workloads; may access raw data | 2, 3, 4 | Data science team |
| Platform Admin | Manage Fabric workspaces, capacity, and platform configuration | All | Platform operations team |
| Security Admin | Manage access policies, monitor compliance, investigate incidents | All | Security operations team |
| Auditor | Read-only access to audit logs and compliance reports | All | Internal audit, external auditors |

### 4.3 Least Privilege Mapping

| Tier | Default Role | Maximum Self-Service | Requires Approval | Requires JIT |
|------|-------------|---------------------|-------------------|--------------|
| Tier 1 — Public | Data Reader | Data Reader | — | — |
| Tier 2 — Internal | Data Reader | Data Contributor | Data Steward, Data Owner | — |
| Tier 3 — Confidential | None (must request) | Data Reader | Data Contributor, Data Steward, Data Owner | Data Engineer (elevated) |
| Tier 4 — Restricted | None (must request via PIM) | None | Data Reader (time-limited) | All roles (max 8 hours) |

### 4.4 Separation of Duties

| Duty Pair | Tier 1-2 | Tier 3 | Tier 4 |
|-----------|----------|--------|--------|
| Access Provisioner + Access Consumer | Recommended | Required | Required (technically enforced) |
| Data Creator + Data Approver | Not required | Required for financial data | Required for all data |
| Pipeline Deployer + Pipeline Approver | Recommended | Required | Required (4-eyes principle) |
| Label Assigner + Label Auditor | Not required | Recommended | Required |
| Encryption Key Manager + Data Consumer | Not required | Not required | Required (split knowledge) |

### 4.5 Access Decision Flow

For each data access request, the following decision sequence applies:

1. **Authentication** — Is the user's identity verified through Entra ID with the required MFA strength?
2. **Tier Check** — What is the classification tier of the target data asset?
3. **Group Membership** — Is the user a member of the appropriate tier-aligned security group?
4. **Attribute Check (Tier 3-4)** — Does the user possess the required attributes (department, role, location, citizenship)?
5. **Approval Check (Tier 3-4)** — Has the required approval workflow been completed?
6. **JIT Activation (Tier 4)** — Has the user activated just-in-time access through PIM?
7. **Conditional Access** — Does the access context (device, location, risk level) meet the tier's CA policy?
8. **Grant or Deny** — Access is granted only if all applicable checks pass.

---

## 5. Entra ID Group Structure

### 5.1 Group Naming Convention

All security groups follow the ISL-03 naming standard with the following pattern:

```
SG-Data-{Tier}-{Domain}-{Role}
```

| Component | Values | Example |
|-----------|--------|---------|
| `SG-Data` | Fixed prefix for all data access groups | `SG-Data-` |
| `{Tier}` | `T1-Public`, `T2-Internal`, `T3-Confidential`, `T4-Restricted` | `T3-Confidential` |
| `{Domain}` | Business domain: `Finance`, `HR`, `Manufacturing`, `Sales`, `Engineering`, `Platform`, `All` | `Finance` |
| `{Role}` | Functional role from Section 4.2 | `Reader`, `Contributor`, `Steward`, `Owner`, `Engineer`, `Analyst`, `Admin` |

### 5.2 Tier-Aligned Group Definitions

#### Tier 1 — Public Data Groups

| Group Name | Type | Membership | Purpose |
|-----------|------|-----------|---------|
| `SG-Data-T1-Public-All-Reader` | Dynamic | All employees + all guests | Read access to all Tier 1 data assets |
| `SG-Data-T1-Public-All-Contributor` | Assigned | Content publishers, communications team | Write/publish access to Tier 1 data |
| `SG-Data-T1-Public-All-Admin` | Assigned | Data governance team | Manage Tier 1 data assets and classifications |

**Dynamic Membership Rule (T1 Read):**
```
(user.accountEnabled -eq true) AND (user.userType -eq "Member" OR user.userType -eq "Guest")
```

#### Tier 2 — Internal Data Groups

| Group Name | Type | Membership | Purpose |
|-----------|------|-----------|---------|
| `SG-Data-T2-Internal-All-Reader` | Dynamic | All employees + authorized contractors | Read access to all Tier 2 data assets |
| `SG-Data-T2-Internal-All-Contributor` | Assigned | Department data contributors | Write access to Tier 2 data within scope |
| `SG-Data-T2-Internal-{Domain}-Reader` | Assigned | Domain-specific internal users | Read access to domain-specific Tier 2 data |
| `SG-Data-T2-Internal-{Domain}-Analyst` | Assigned | Domain analysts | Analyze domain-specific Tier 2 data |
| `SG-Data-T2-Internal-All-Admin` | Assigned | Data governance team + domain stewards | Manage Tier 2 data assets |

**Dynamic Membership Rule (T2 Read):**
```
(user.accountEnabled -eq true) AND (user.userType -eq "Member") AND
(user.employeeType -eq "Employee" OR user.extensionAttribute1 -eq "AuthorizedContractor")
```

#### Tier 3 — Confidential Data Groups

| Group Name | Type | Membership | Purpose |
|-----------|------|-----------|---------|
| `SG-Data-T3-Confidential-{Domain}-Reader` | Assigned | Approved users within specific domain | Read access to domain-specific Tier 3 data |
| `SG-Data-T3-Confidential-{Domain}-Contributor` | Assigned | Domain data contributors with approval | Write access to domain-specific Tier 3 data |
| `SG-Data-T3-Confidential-Finance-Reader` | Assigned | Finance team + approved cross-functional | Financial confidential data read access |
| `SG-Data-T3-Confidential-HR-Reader` | Assigned | HR team + approved managers | HR confidential data read access |
| `SG-Data-T3-Confidential-HR-PII-Reader` | Assigned | HRIS team, benefits administrators | HR PII data read access |
| `SG-Data-T3-Confidential-Customer-Reader` | Assigned | Sales, support, account management | Customer confidential data read access |
| `SG-Data-T3-Confidential-Engineering-Reader` | Assigned | Engineering + product management | Technical confidential data read access |
| `SG-Data-T3-Confidential-Quality-Reader` | Assigned | Quality engineers + auditors | Quality/NCR data read access |
| `SG-Data-T3-Confidential-All-Admin` | Assigned | Data governance lead + CISO delegate | Manage all Tier 3 data assets |
| `SG-Data-T3-Confidential-All-Steward` | Assigned | Domain data stewards | Classification and quality oversight |

#### Tier 4 — Restricted Data Groups

| Group Name | Type | Membership | Purpose |
|-----------|------|-----------|---------|
| `SG-Data-T4-Restricted-ITAR-Reader` | Assigned (PIM-eligible) | Named US Persons with ITAR clearance | JIT read access to ITAR data |
| `SG-Data-T4-Restricted-ITAR-Contributor` | Assigned (PIM-eligible) | Named ITAR program engineers | JIT write access to ITAR data |
| `SG-Data-T4-Restricted-TradeSecret-Reader` | Assigned (PIM-eligible) | Named IP custodians | JIT read access to trade secrets |
| `SG-Data-T4-Restricted-SensitivePII-Reader` | Assigned (PIM-eligible) | Named HR/Payroll/Benefits staff | JIT read access to sensitive PII |
| `SG-Data-T4-Restricted-Executive-Reader` | Assigned (PIM-eligible) | Named C-suite and board members | JIT read access to executive data |
| `SG-Data-T4-Restricted-Legal-Reader` | Assigned (PIM-eligible) | Named legal counsel | JIT read access to privileged data |
| `SG-Data-T4-Restricted-All-Admin` | Assigned (PIM-eligible) | CISO + Data Protection Officer | JIT admin for all Tier 4 data assets |

**Dynamic Membership Rule (T4 ITAR):**
```
(user.accountEnabled -eq true) AND (user.extensionAttribute2 -eq "USPerson") AND
(user.extensionAttribute3 -contains "ITAR")
```

### 5.3 [ADAPTATION REQUIRED] Client Group Mapping

> Map the client's existing security groups to the ISL-04 tier model. Complete this table during engagement onboarding.

| ISL-04 Group | Client Existing Group | Gap | Action Required |
|-------------|----------------------|-----|-----------------|
| `SG-Data-T1-Public-All-Reader` | ___________ | ___ | ___________ |
| `SG-Data-T2-Internal-All-Reader` | ___________ | ___ | ___________ |
| `SG-Data-T3-Confidential-Finance-Reader` | ___________ | ___ | ___________ |
| `SG-Data-T3-Confidential-HR-Reader` | ___________ | ___ | ___________ |
| `SG-Data-T3-Confidential-Customer-Reader` | ___________ | ___ | ___________ |
| `SG-Data-T3-Confidential-Engineering-Reader` | ___________ | ___ | ___________ |
| `SG-Data-T4-Restricted-ITAR-Reader` | ___________ | ___ | ___________ |
| `SG-Data-T4-Restricted-TradeSecret-Reader` | ___________ | ___ | ___________ |
| `SG-Data-T4-Restricted-SensitivePII-Reader` | ___________ | ___ | ___________ |
| `SG-Data-T4-Restricted-Executive-Reader` | ___________ | ___ | ___________ |
| `SG-Data-T4-Restricted-Legal-Reader` | ___________ | ___ | ___________ |

---

## 6. Conditional Access Policies

### 6.1 Policy Matrix by Tier

| Policy Attribute | Tier 1 — Public | Tier 2 — Internal | Tier 3 — Confidential | Tier 4 — Restricted |
|-----------------|-----------------|--------------------|-----------------------|---------------------|
| **MFA Requirement** | Not required (SSO sufficient) | Required (any method: SMS, Authenticator, FIDO2) | Required (Microsoft Authenticator or FIDO2 only) | Required (FIDO2 security key or Windows Hello only) |
| **Device Compliance** | Any device (including personal) | Managed or compliant device | Intune-compliant device only | Intune-managed + compliant + encrypted + domain-joined |
| **Device Platform** | Any | Windows, macOS, iOS, Android (managed) | Windows, macOS (corporate-managed only) | Windows (corporate-managed, domain-joined) |
| **Location** | Any location | Any location (corporate preferred) | Corporate network + approved VPN | Corporate network only (no VPN) |
| **Sign-in Risk (Identity Protection)** | Allow all; block high risk | Block high risk; MFA on medium | Block medium + high risk | Block low + medium + high risk |
| **Session Duration** | 8 hours (browser persistent) | 8 hours | 4 hours (re-auth required) | 1 hour (continuous access evaluation) |
| **App Enforced Restrictions** | None | None | Block download on unmanaged devices | Block download, print, copy on all devices except approved |
| **Persistent Browser Session** | Allowed | Allowed | Disabled | Disabled |
| **Token Lifetime** | Default (1 hour access token) | Default | 30 minutes | 15 minutes |
| **Guest Access** | Allowed | Manager-approved with MFA | Data owner-approved with MFA | Blocked |

### 6.2 Named Conditional Access Policies

| Policy Name | Target Tier | Assignment | Conditions | Grant Controls |
|------------|------------|------------|-----------|----------------|
| `CA-T1-Public-BaseAccess` | 1 | All users | Any device, any location | Require authentication |
| `CA-T2-Internal-MFA` | 2+ | `SG-Data-T2-Internal-*` groups | Any managed device | Require MFA (any method) |
| `CA-T3-Confidential-DeviceCompliance` | 3+ | `SG-Data-T3-Confidential-*` groups | Fabric, Power BI, SharePoint | Require compliant device + MFA |
| `CA-T3-Confidential-LocationRestriction` | 3 | `SG-Data-T3-Confidential-*` groups | Non-corporate locations | Block or require VPN attestation |
| `CA-T4-Restricted-StrictAccess` | 4 | `SG-Data-T4-Restricted-*` groups | Fabric, Power BI, Azure portal | Require FIDO2 + compliant device + named location |
| `CA-T4-Restricted-SessionControl` | 4 | `SG-Data-T4-Restricted-*` groups | All sessions | Sign-in frequency: 1 hour; persistent browser: disabled |
| `CA-T4-ITAR-USPersonVerification` | 4 (ITAR) | `SG-Data-T4-Restricted-ITAR-*` | ITAR-labeled apps | Require FIDO2 + compliant device + US location only |
| `CA-AllTiers-BlockLegacyAuth` | All | All users | Legacy authentication protocols | Block access |
| `CA-AllTiers-RiskBasedAccess` | All | All users | Sign-in risk: High | Block (Tier 3-4); MFA + password change (Tier 1-2) |
| `CA-BreakGlass-Exclusion` | All | Break-glass accounts | All cloud apps | Excluded from all CA policies (monitored via alert) |

---

## 7. Fabric Workspace Security

### 7.1 Workspace Role Mapping by Tier

Microsoft Fabric workspaces use four built-in roles. The following table maps these roles to classification tiers with recommended membership.

| Workspace Role | Tier 1 — Public | Tier 2 — Internal | Tier 3 — Confidential | Tier 4 — Restricted |
|---------------|-----------------|--------------------|-----------------------|---------------------|
| **Admin** | `SG-Data-Platform-Admin` | `SG-Data-Platform-Admin` | `SG-Data-Platform-Admin` + `SG-Data-T3-{Domain}-Owner` | `SG-Data-Platform-Admin` (PIM-eligible only) |
| **Member** | Not used | `SG-Data-T2-Internal-All-Contributor` | `SG-Data-T3-{Domain}-Contributor` | Not used (too permissive for Tier 4) |
| **Contributor** | Not used | `SG-Data-T2-{Domain}-Engineer` | `SG-Data-T3-{Domain}-Engineer` | `SG-Data-T4-{SubClass}-Contributor` (PIM, max 8hr) |
| **Viewer** | `SG-Data-T1-Public-All-Reader` | `SG-Data-T2-Internal-All-Reader` | `SG-Data-T3-{Domain}-Reader` | `SG-Data-T4-{SubClass}-Reader` (PIM, max 8hr) |

### 7.2 Workspace Naming and Tier Alignment

Workspaces are named per ISL-03 conventions with tier encoding:

| Pattern | Example | Tier | Security Posture |
|---------|---------|------|-----------------|
| `ws-{domain}-public` | `ws-marketing-public-content` | 1 | Open viewer access; authenticated write |
| `ws-{domain}-internal` | `ws-finance-internal-reporting` | 2 | Employee viewer access; team-scoped write |
| `ws-{domain}-confidential` | `ws-hr-confidential-analytics` | 3 | Role-based viewer; named engineers |
| `ws-{domain}-restricted` | `ws-engineering-restricted-itar` | 4 | Named individuals only; PIM-activated; isolated |
| `ws-{domain}-dev` | `ws-finance-dev` | 2 (default) | Development/test; domain engineering team |
| `ws-{domain}-staging` | `ws-hr-staging-confidential` | Matches prod tier | Pre-production validation; engineering + QA |

### 7.3 Workspace Security Configuration Checklist

| Control | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---------|--------|--------|--------|--------|
| Sensitivity label on workspace | Public | Internal | Confidential | Highly Confidential |
| Block non-admin item creation | No | No | Yes | Yes |
| Block data export from workspace | No | No | Yes (CSV/Parquet blocked) | Yes (all formats blocked) |
| Require approval for access requests | No | No | Yes (manager) | Yes (data owner + CISO) |
| Workspace discoverable in gallery | Yes | Yes | No | No |
| Guest access permitted | Yes | No | No | No |
| Service principal access | Allowed | Allowed with registration | Allowed with named SPN + approval | Managed identity only |
| Azure Private Link required | No | No | Recommended | Required |
| Publish to web | Allowed (Tier 1 only) | Blocked | Blocked | Blocked |
| Install custom visuals | Organizational visuals only | Organizational visuals only | Organizational visuals only | Blocked (pre-approved only) |
| Copy data across workspaces | Allowed | Allowed | Same tier or higher only | Blocked (dedicated workspace) |

---

## 8. OneLake Access Control

### 8.1 Folder-Level Permissions

OneLake supports folder-level security within lakehouses. The following patterns apply per tier.

| Tier | Folder Structure Pattern | Permission Model | Example |
|------|------------------------|-----------------|---------|
| Tier 1 | `/public/{domain}/` | Inherited from workspace (broad read) | `/public/marketing/product-specs/` |
| Tier 2 | `/internal/{domain}/` | Inherited from workspace (employee read) | `/internal/operations/shift-reports/` |
| Tier 3 | `/confidential/{domain}/{sub-class}/` | Folder-level ACL restricting to specific groups | `/confidential/hr/pii/` |
| Tier 4 | Separate lakehouse (isolated) | Workspace-level isolation + folder ACL | Dedicated `lh-restricted-itar` lakehouse |

### 8.2 Table-Level Permissions

| Tier | Table Permission Model | Implementation | Audit |
|------|----------------------|----------------|-------|
| Tier 1 | Open read via workspace viewer role | No additional table-level ACL needed | Standard Fabric audit logs |
| Tier 2 | Inherited from workspace; no table-level restriction | Workspace membership controls access | Standard Fabric audit logs |
| Tier 3 | Table-level ACLs via OneLake security | Grant `SG-Data-T3-{Domain}-Reader` to specific tables | Enhanced logging; quarterly review |
| Tier 4 | Table-level ACLs + row-level filtering | Grant named individuals; enforce via PIM group | Full audit trail; monthly review |

### 8.3 Shortcut Security Considerations

| Scenario | Risk | Mitigation |
|----------|------|------------|
| Shortcut from Tier 3 lakehouse to Tier 2 workspace | Confidential data exposed to broader audience | Block shortcuts that cross tier boundaries downward |
| Shortcut to external ADLS Gen2 storage | Bypasses Fabric workspace security | Require managed identity; enforce ADLS ACLs aligned to tier |
| Shortcut to cross-tenant lakehouse | Data exfiltration risk | Tenant-level admin approval required; Tier 4 shortcuts prohibited |
| Internal shortcut within same workspace | Acceptable | Allowed; inherits workspace-level controls |

---

## 9. Power BI Security

### 9.1 Row-Level Security (RLS)

RLS restricts which rows of data a user can see within a Power BI semantic model, based on their identity or group membership.

| Tier | RLS Requirement | Pattern | Example DAX Filter |
|------|----------------|---------|-------------------|
| Tier 1 | Not required | No RLS rules defined | N/A — all rows visible to all |
| Tier 2 | Optional (business-driven) | Department-based RLS if datasets span departments | `[Department] = LOOKUPVALUE(DimUser[Department], DimUser[UPN], USERPRINCIPALNAME())` |
| Tier 3 | Required for multi-audience datasets | Role-based RLS with group-mapped roles | `[CostCenter] IN SELECTCOLUMNS(FILTER(DimUserAccess, DimUserAccess[UPN] = USERPRINCIPALNAME()), "CC", DimUserAccess[CostCenter])` |
| Tier 3 — PII | Required | Row filtering on data subject scope | `[Region] = LOOKUPVALUE(DimUser[Region], DimUser[UPN], USERPRINCIPALNAME())` |
| Tier 4 | Required + dataset isolation preferred | Named-user RLS or separate datasets per audience | `[ApprovedUser] = USERPRINCIPALNAME()` |
| Tier 4 — ITAR | Required | Only US Persons see ITAR-flagged rows | `[IsITAR] = FALSE() OR LOOKUPVALUE(DimUser[IsUSPerson], DimUser[UPN], USERPRINCIPALNAME()) = TRUE()` |

### 9.2 Object-Level Security (OLS)

OLS restricts which columns or measures a user can see, complementing RLS which restricts rows.

| Tier | OLS Requirement | Hidden From | Visible To | Example Columns |
|------|----------------|-------------|------------|----------------|
| Tier 1-2 | Not required | N/A | All users | No OLS rules |
| Tier 3 — HR | Required | `SG-Data-T2-Internal-Reader` | `SG-Data-T3-HR-Reader` | `Salary`, `Compensation`, `BonusAmount` |
| Tier 3 — Finance | Required | `SG-Data-T2-Internal-Reader` | `SG-Data-T3-Finance-Reader` | `CreditCardLast4`, `PaymentMethod` |
| Tier 3 — Sales | Required | `SG-Data-T2-Internal-Reader` | `SG-Data-T3-Sales-Reader` | `CustomerMargin`, `DiscountStructure` |
| Tier 4 — Sensitive PII | Required | All except Tier 4 group | `SG-Data-T4-Restricted-SensitivePII-Reader` | `SSN`, `BankAccount`, `HealthPlanID` |
| Tier 4 — Trade Secret | Required | All except Tier 4 group | `SG-Data-T4-Restricted-TradeSecret-Reader` | `ProcessParameters`, `YieldFormula`, `AlloyComposition` |

### 9.3 Power BI Workspace Access Patterns

| Security Layer | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---------------|--------|--------|--------|--------|
| Workspace access | All employees (Viewer) | Department (Viewer) | Named groups (Viewer) | Named individuals (PIM) |
| App audience | Entire organization | Specific distribution groups | Security groups per domain | Named individuals |
| Dataset sharing | Build permission open | Build permission by request | No build permission; pre-built reports only | No sharing; embedded in controlled app |
| Export to Excel | Allowed | Allowed | Blocked | Blocked |
| Export to PDF | Allowed | Allowed | Allowed (watermarked) | Blocked |
| Print | Allowed | Allowed | Allowed (watermarked) | Blocked |
| Subscribe to reports | Allowed | Allowed | Allowed (internal only) | Blocked |

### 9.4 RLS Testing Checklist

| Test | Expected Result | Pass Criteria |
|------|----------------|---------------|
| User in `SG-Data-T3-Finance-Reader` queries finance data | Sees only finance department rows | Row count matches finance-only filter |
| User NOT in finance group queries same model | Sees zero finance rows | Empty result for finance-scoped tables |
| ITAR user queries ITAR-flagged data | Sees ITAR and non-ITAR rows | Full result set |
| Non-ITAR user queries same model | ITAR rows hidden | Row count excludes ITAR-flagged rows |
| Admin bypasses RLS via "Analyze in Excel" | RLS still enforced | RLS applies in all client tools |
| User in multiple roles | Union of permitted rows | Most permissive role applied |

---

## 10. SQL Security Patterns

### 10.1 Schema-Level Permissions

For Fabric SQL Endpoints and Azure SQL databases, schema separation by tier provides a clean permission boundary.

| Schema | Tier | Permissions | Example Objects |
|--------|------|------------|-----------------|
| `public` | 1 | `SELECT` to all authenticated users | `public.dim_product_catalog`, `public.fact_published_metrics` |
| `internal` | 2 | `SELECT` to `SG-Data-T2-Internal-All-Reader` | `internal.dim_employee_directory`, `internal.fact_production_volume` |
| `confidential` | 3 | `SELECT` to `SG-Data-T3-Confidential-{Domain}-Reader` per domain | `confidential.dim_customer`, `confidential.fact_sales_pipeline` |
| `restricted` | 4 | `SELECT` to named individuals via PIM-activated group | `restricted.dim_itar_parts`, `restricted.fact_executive_compensation` |

### 10.2 Dynamic Data Masking by Tier

Dynamic Data Masking (DDM) provides in-place masking of sensitive columns without duplicating data.

| Column Type | Tier 1-2 (No Masking) | Tier 3 (Partial Masking) | Tier 4 (Full Masking Unless Authorized) |
|------------|----------------------|-------------------------|----------------------------------------|
| Email address | `john.doe@company.com` | `jXXX@XXXX.com` | `XXXXX@XXXXX.XXX` |
| Phone number | `+1-555-123-4567` | `+1-555-XXX-XXXX` | `+X-XXX-XXX-XXXX` |
| SSN | N/A (not in Tier 1-2) | N/A (should be Tier 4) | `XXX-XX-4567` (last 4 only, authorized users) |
| Credit card | N/A | `XXXX-XXXX-XXXX-1234` | `XXXX-XXXX-XXXX-XXXX` |
| Salary/compensation | Full value | Banded range (`$100K-$120K`) | `$XXX,XXX` |
| Name (personal) | Full name | Full name | First initial + last name (`J. Doe`) |
| Address | Full address | City and state only | State only |
| Date of birth | Full date | Year only (`1985`) | `XXXX-XX-XX` |
| Bank account | N/A | `XXXXXX1234` | `XXXXXXXXXX` |

### 10.3 DDM SQL Configuration

```sql
-- Tier 3: Partial masking on email
ALTER TABLE confidential.dim_customer
ALTER COLUMN Email ADD MASKED WITH (FUNCTION = 'email()');

-- Tier 4: Full masking on SSN
ALTER TABLE restricted.dim_employee_sensitive
ALTER COLUMN SSN ADD MASKED WITH (FUNCTION = 'default()');

-- Tier 3: Partial masking on phone
ALTER TABLE confidential.dim_customer
ALTER COLUMN Phone ADD MASKED WITH (FUNCTION = 'partial(0,"XXX-XXX-",4)');

-- Tier 4: Random masking on salary for analytics
ALTER TABLE restricted.dim_compensation
ALTER COLUMN Salary ADD MASKED WITH (FUNCTION = 'random(50000, 200000)');
```

### 10.4 Unmasking Permissions

| Tier | Who Receives UNMASK | Approval | Duration |
|------|-------------------|----------|----------|
| Tier 3 | `SG-Data-T3-{Domain}-Owner` and `SG-Data-T3-{Domain}-Steward` | Data owner approval | Persistent (reviewed quarterly) |
| Tier 4 | Named individuals in PIM-eligible group | Data owner + CISO approval | JIT (max 8 hours) |

### 10.5 Row-Level Security in SQL

```sql
-- Example: Tier 3 RLS policy for department-scoped access
CREATE SECURITY POLICY confidential.DepartmentFilter
ADD FILTER PREDICATE confidential.fn_department_access(DepartmentID)
ON confidential.fact_hr_metrics
WITH (STATE = ON);

-- Predicate function checks user's department membership
CREATE FUNCTION confidential.fn_department_access(@DepartmentID INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN SELECT 1 AS access_granted
WHERE @DepartmentID IN (
    SELECT DepartmentID
    FROM confidential.user_department_mapping
    WHERE UserPrincipal = SUSER_SNAME()
);
```

---

## 11. Just-in-Time Access and Privileged Access Management

### 11.1 PIM Configuration for Tier 4

All Tier 4 security groups are configured as PIM-eligible (not permanently assigned). Users must activate their membership through a time-bound approval workflow.

| PIM Setting | Configuration | Rationale |
|------------|---------------|-----------|
| **Activation Maximum Duration** | 8 hours | Limits exposure window for Tier 4 data |
| **Require Justification** | Yes | Audit trail for every activation |
| **Require Ticket Number** | Yes | Links to ServiceNow/ticketing system |
| **Require Approval** | Yes | Data owner or CISO must approve |
| **Require MFA on Activation** | Yes (FIDO2) | Prevents unauthorized activation |
| **Eligible Assignment Expiration** | 90 days (renewal required) | Prevents stale eligibility |
| **Notification on Activation** | CISO, SOC team, Data Owner | Real-time awareness |

### 11.2 PIM Approver Matrix

| PIM Group | Eligible Members | Approver(s) | Max Duration |
|-----------|-----------------|-------------|-------------|
| `SG-Data-T4-Restricted-ITAR-Reader` | ITAR-cleared engineers | Empowered Official + CISO | 8 hours |
| `SG-Data-T4-Restricted-TradeSecret-Reader` | R&D scientists, process engineers | R&D Director + CISO | 8 hours |
| `SG-Data-T4-Restricted-SensitivePII-Reader` | Payroll, benefits admin | CHRO + CISO | 4 hours |
| `SG-Data-T4-Restricted-Executive-Reader` | Named executives | CEO + General Counsel | 8 hours |
| `SG-Data-T4-Restricted-Legal-Reader` | Named legal counsel | General Counsel | 8 hours |

### 11.3 PIM Activation Workflow

1. User navigates to Entra ID PIM and selects the target Tier 4 group
2. User provides justification text and ServiceNow ticket number
3. User completes FIDO2 MFA challenge
4. Approval request sent to designated approver(s)
5. Approver reviews justification and ticket, then approves or denies
6. On approval, user's group membership is activated for the requested duration (max 8 hours)
7. SOC and data owner receive activation notification
8. User accesses Tier 4 data through normal channels (Fabric, Power BI, SQL)
9. All data access during the activation window is logged with enhanced audit detail
10. Membership automatically expires at the end of the activation window
11. Post-session audit review triggered for activations exceeding 4 hours

### 11.4 JIT Access for Tier 3

| Attribute | Tier 3 — Confidential |
|-----------|----------------------|
| **Trigger** | Access request via self-service portal or ServiceNow |
| **Approval** | Manager approval (auto-approved for pre-authorized roles) |
| **Duration** | 24 hours (renewable up to 3 consecutive times) |
| **Activation Delay** | Immediate on approval |
| **Revocation** | Manager or data owner can revoke at any time |
| **Post-Access Review** | Automated log review via anomaly detection |

### 11.5 [ADAPTATION REQUIRED] Approval Workflow Configuration

> Configure the approval workflow tool and approvers for each Tier 4 sub-classification.

| Sub-Classification | Approval Tool | Primary Approver | Secondary Approver | Escalation SLA |
|-------------------|--------------|-----------------|-------------------|----------------|
| ITAR | ___________ | ___________ | ___________ | ___ hours |
| Trade Secret | ___________ | ___________ | ___________ | ___ hours |
| Sensitive PII | ___________ | ___________ | ___________ | ___ hours |
| Executive | ___________ | ___________ | ___________ | ___ hours |
| Legal Privilege | ___________ | ___________ | ___________ | ___ hours |

---

## 12. Service Principal and Managed Identity Access

### 12.1 Non-Human Identity Access by Tier

| Identity Type | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|--------------|--------|--------|--------|--------|
| **Service Principal (App Registration)** | Allowed; standard client secret | Allowed; certificate credential preferred | Allowed; certificate credential required; named SPN with approval | Not allowed (use managed identity only) |
| **Managed Identity (System-assigned)** | Allowed | Allowed | Allowed; preferred over SPN | Required; only identity type permitted |
| **Managed Identity (User-assigned)** | Allowed | Allowed | Allowed; shared across related services | Allowed; dedicated identity per Tier 4 workload |
| **Secret Rotation Cadence** | 365 days | 180 days | 90 days | N/A (managed identity, no secrets) |
| **Certificate Rotation Cadence** | 365 days | 180 days | 90 days | N/A (managed identity) |
| **Permissions Scope** | Broad (resource group level) | Resource-specific | Table/schema-specific | Row/column-specific (minimum viable) |
| **Monitoring** | Standard logs | Standard logs + monthly review | Enhanced logging + weekly review | Real-time alerting + daily review |

### 12.2 Service Principal Naming Convention

```
SPN-{Application}-{Environment}-{Tier}-{Purpose}
MI-{Resource}-{Environment}-{Tier}-{Purpose}
```

Examples:
- `SPN-FabricPipeline-Prod-T2-InternalETL`
- `SPN-PurviewScanner-Prod-T3-ConfidentialScan`
- `MI-FabricWorkspace-Prod-T4-ITARProcessing`

---

## 13. Access Review and Recertification

### 13.1 Review Cadence by Tier

| Attribute | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|-----------|--------|--------|--------|--------|
| **Review Frequency** | None (dynamic group) | Annual | Quarterly | Monthly |
| **Review Scope** | N/A | All group members | All group members + access patterns | All group members + all access logs |
| **Reviewer** | N/A | Manager (group owner) | Data owner + data steward | Data owner + CISO |
| **Auto-Remove on Non-Response** | N/A | After 30 days | After 14 days | After 7 days |
| **Review Tool** | N/A | Entra ID Access Reviews | Entra ID Access Reviews | Entra ID Access Reviews + manual SOC review |
| **Escalation** | N/A | Remind at 7, 14, 21 days | Remind at 3, 7, 10 days | Remind at 1, 3, 5 days |
| **Audit Evidence** | N/A | Review completion report | Report + justification | Report + justification + risk assessment |
| **Service principal review** | N/A | Annual | Quarterly | Monthly |
| **PIM eligible review** | N/A | N/A | N/A | Monthly (90-day max eligible) |
| **Dormant account detection** | N/A | 90-day inactivity flag | 60-day inactivity flag | 30-day inactivity removal |

### 13.2 Recertification Triggers (Outside Regular Cadence)

| Trigger | Action | Timeline |
|---------|--------|----------|
| Employee role change (promotion, lateral move) | Re-evaluate all Tier 3-4 access | Within 5 business days |
| Employee termination | Revoke all access immediately | Within 1 hour (automated via HR feed) |
| Contractor engagement end date | Revoke all access | On end date (automated) |
| Security incident involving the data asset | Emergency access review for all users | Within 24 hours |
| Data reclassification (tier change) | Re-evaluate all existing access grants | Within 10 business days |
| Organizational restructuring | Full access review for affected departments | Within 30 business days |
| Regulatory audit finding | Targeted review per audit scope | Per audit remediation timeline |

---

## 14. Emergency / Break-Glass Access

### 14.1 Break-Glass Account Configuration

| Setting | Configuration |
|---------|--------------|
| Account naming | `emergency-access-01@domain.com`, `emergency-access-02@domain.com` |
| Authentication | FIDO2 security key (stored in physical safe); no phone-based MFA |
| Conditional access | Excluded from all CA policies (to ensure access during Entra ID outage) |
| Monitoring | Azure Monitor alert on any sign-in; immediate SOC notification |
| Group membership | `SG-Data-Platform-Admin` (permanent); no Tier 4 data access by default |
| Tier 4 access | Not pre-provisioned; requires manual PIM activation with 2-person approval |
| Password storage | Sealed envelope in physical safe; two-person access control |
| Testing | Monthly sign-in test (verify credentials work); documented in audit log |

### 14.2 Break-Glass Usage Protocol

| Step | Action | Timeline |
|------|--------|----------|
| 1 | Document the emergency requiring break-glass access | Before use |
| 2 | Retrieve credentials with witness (2-person integrity) | Immediate |
| 3 | Sign in and perform required emergency action | Minimal necessary time |
| 4 | Sign out and re-seal credentials | Immediately after use |
| 5 | Notify SOC and CISO of break-glass usage | Within 1 hour |
| 6 | Complete post-use review with security team | Within 4 hours |
| 7 | Rotate break-glass credentials | Within 24 hours |
| 8 | Document incident report with timeline and justification | Within 48 hours |

---

## 15. Fabric / Azure Implementation Guidance

### 15.1 Implementation Sequence

| Phase | Activity | Duration | Prerequisites |
|-------|----------|----------|---------------|
| 1 | Create Entra ID security groups per Section 5 | 2-3 days | ISL-03 naming conventions finalized |
| 2 | Configure PIM for Tier 4 groups per Section 11 | 1-2 days | Entra ID P2 licensing confirmed |
| 3 | Create Fabric workspaces with tier-aligned naming and labels | 2-3 days | Workspace naming per ISL-03; labels per ISL-04 labeling |
| 4 | Assign workspace roles per Section 7.1 | 1 day | Security groups created |
| 5 | Configure OneLake folder ACLs per Section 8 | 1-2 days | Lakehouse structure finalized |
| 6 | Implement SQL schema permissions per Section 10.1 | 1-2 days | SQL endpoint schemas created |
| 7 | Configure Dynamic Data Masking per Section 10.2 | 1 day | Column classification from Purview scan complete |
| 8 | Deploy Conditional Access policies per Section 6 | 2-3 days | Pilot group testing; staged rollout |
| 9 | Configure Power BI RLS/OLS per Section 9 | 2-3 days | Semantic models published |
| 10 | Set up access reviews per Section 13 | 1 day | All groups finalized |
| 11 | Validate end-to-end access flow per tier | 2-3 days | All controls deployed |

### 15.2 Monitoring and Alerting

| Alert | Source | Tier Applicability | Response |
|-------|--------|-------------------|----------|
| PIM activation for Tier 4 group | Entra ID Audit Log | 4 | SOC notification; log review |
| Conditional Access policy failure | Entra ID Sign-in Logs | 3-4 | Investigate if legitimate; adjust if false positive |
| Unusual data access volume | Microsoft Defender for Cloud Apps | 3-4 | SOC investigation; potential data exfiltration |
| Failed MFA attempt (5+ in 10 minutes) | Entra ID Sign-in Logs | All | Account lockout investigation |
| Security group membership change | Entra ID Audit Log | 3-4 | Verify change was approved; cross-reference ticket |
| Service principal secret expiration (30 days) | Azure Key Vault | 2-3 | Rotation workflow initiated |
| Break-glass account sign-in | Entra ID Sign-in Logs | Emergency | Immediate SOC response; incident report required |

---

## 16. Manufacturing Overlay [CONDITIONAL]

> Include this section when the client operates in manufacturing with ITAR/EAR obligations, trade secret IP, or IoT/OT environments.

### 16.1 ITAR Access Control Requirements

| Requirement | Implementation | ISL-04 Control |
|------------|----------------|----------------|
| US Person verification | Custom attribute `usPersonVerified = true` in Entra ID | Dynamic group filter; Conditional Access check |
| Technology Control Plan (TCP) | Documented per ITAR program; access linked to TCP approval | PIM justification must reference TCP ID |
| Physical separation of ITAR data | Dedicated Fabric workspace + dedicated Azure subscription | Workspace isolation per Section 7.2 |
| Deemed export prevention | Block access from non-US locations; block VPN from non-US endpoints | Conditional Access named location: US only |
| ITAR access logging | All access events logged for 7+ years | Fabric audit logs + Log Analytics workspace (7-year retention) |
| ITAR visitor access | Separate guest accounts with TCP approval and time-limited access | PIM-eligible guest accounts; 4-hour max activation |

### 16.2 Trade Secret Access Patterns

| Control | Implementation |
|---------|---------------|
| Numbered copy tracking | Digital watermark with user identity embedded in every document access |
| NDA verification | Access conditional on NDA status attribute in HR system (`ndaSigned = true`) |
| Access logging | All read/download events captured with user identity, timestamp, IP |
| No personal device access | Conditional Access: require Intune-managed corporate device |
| No cloud sync | DLP policy: block sync to personal OneDrive, Google Drive, Dropbox |
| Screen capture prevention | Windows Information Protection (WIP) policy blocks screen capture apps |

### 16.3 IoT/OT Data Access Tiers

| Data Category | Classification | Access Group | Notes |
|--------------|---------------|-------------|-------|
| Safety system data (emergency shutdowns, interlocks) | Tier 3-4 | `SG-Data-T3-Confidential-OTSafety-Reader` | Safety-critical; tampering could cause harm |
| Process control parameters (setpoints, recipes) | Tier 4 (Trade Secret) | `SG-Data-T4-Restricted-TradeSecret-Reader` | Core manufacturing IP |
| Production metrics (OEE, throughput, yield) | Tier 2 | `SG-Data-T2-Internal-Manufacturing-Reader` | Operational reporting |
| Equipment telemetry (vibration, temperature) | Tier 2 | `SG-Data-T2-Internal-Maintenance-Reader` | Predictive maintenance |
| Edge device credentials and certificates | Tier 4 | `SG-Data-T4-Restricted-OTCredentials-Reader` | Compromise could affect physical systems |
| Historian data (raw sensor time series) | Tier 2-3 | Depends on content sensitivity | Aggregated = Tier 2; raw with IP context = Tier 3 |

---

## 17. Cross-References

| ISL Module | Relationship to This Standard |
|-----------|-------------------------------|
| **ISL-01 — API Governance** | API authentication and authorization patterns must respect tier-based access controls; API keys and tokens scoped to tier |
| **ISL-02 — Metadata & Lineage** | Access control group assignments stored as metadata in Purview Data Catalog; lineage tracks data flow across tier boundaries |
| **ISL-03 — Naming Conventions** | Security group names, workspace names, and schema names follow ISL-03 naming patterns with tier encoding |
| **ISL-04 — Classification Tier Definitions** | This standard implements access controls for tiers defined in the tier definitions template |
| **ISL-04 — Sensitivity Labeling Standards** | Label enforcement actions (Section 8 of labeling standard) are enforced through the access controls defined here |
| **ISL-04 — Data Handling Requirements** | Handling requirements for storage, transmission, and sharing are enforced through access control and Conditional Access |
| **ISL-04 — Compliance Mapping Matrix** | Regulatory requirements in the compliance matrix drive specific access control mandates (ITAR US Person, HIPAA minimum necessary) |
| **ISL-04 — Classification Decision Tree** | Decision tree references access control implications when classifying data at each tier |
| **ISL-05 — Integration Patterns** | Data pipeline access uses service principal and managed identity patterns defined in Section 12 |
| **ISL-06 — Data Quality** | Quality monitoring access follows tier-based controls; steward access groups defined here |

---

## 18. Compliance Alignment

| Framework | Relevant Controls | How This Standard Addresses |
|-----------|------------------|----------------------------|
| **NIST SP 800-53 Rev. 5** | AC-2 (Account Management), AC-3 (Access Enforcement), AC-5 (Separation of Duties), AC-6 (Least Privilege), AC-7 (Unsuccessful Logon Attempts), AC-11 (Device Lock), AC-12 (Session Termination) | Tier-based group structure (AC-2), schema/folder permissions (AC-3), SoD matrix (AC-5), PIM JIT (AC-6), CA lockout (AC-7), session controls (AC-11/12) |
| **ISO 27001:2022** | A.5.15 (Access Control), A.5.18 (Access Rights), A.8.2 (Privileged Access Rights), A.8.3 (Information Access Restriction) | Full tier-to-control mapping, privileged access management for Tier 4, periodic access reviews per tier |
| **OWASP** | A01:2021 Broken Access Control | Defense-in-depth with multiple access control layers: identity, group, workspace, table, row, column |
| **DAMA DMBOK** | Chapter 7 — Data Security | Classification-driven access control model aligns to DAMA's recommended tiered security approach |
| **NIST SP 800-171** | 3.1.1 (Limit System Access), 3.1.2 (Limit Transaction Types), 3.1.5 (Least Privilege), 3.1.7 (Privileged Functions) | ITAR overlay directly satisfies CUI protection requirements; PIM satisfies privileged function control |
| **SOX (COSO/COBIT)** | DS5.3 (Identity Management), DS5.4 (User Account Management) | Role-based access to financial data with quarterly reviews satisfies SOX IT general controls |
| **HIPAA Security Rule** | 164.312(a)(1) Access Control, 164.312(d) Person Authentication | Tier 4 Sensitive PII controls meet HIPAA minimum necessary and authentication requirements |
| **PCI-DSS v4.0** | Req 7 (Restrict Access), Req 8 (Identify and Authenticate) | Named-individual PIM access for card data; FIDO2 MFA satisfies strong authentication |
| **CAF (Cloud Adoption Framework)** | Security baseline discipline, Identity baseline discipline | Conditional Access policies, PIM, and managed identity patterns align to CAF security governance |

---

## 19. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | ISL Working Group | Initial release — access control alignment standard |
| — | — | — | — |

---

## Adaptation Guide

> **For engagement teams:** Customize the sections below for each client.

- [ ] Complete the Client Context parameter table (Section 3) with confirmed client values
- [ ] Map client's existing Entra ID security groups to the ISL-04 group structure (Section 5.3)
- [ ] Confirm client's Entra ID licensing tier supports PIM (P2 required) and Conditional Access (E3 minimum, E5 recommended)
- [ ] Validate Conditional Access policies do not conflict with client's existing CA deployment
- [ ] Configure PIM approval workflows with client-specific approvers and tools (Section 11.5)
- [ ] Adjust JIT access durations if client's operational needs require longer windows (document risk acceptance)
- [ ] Confirm ITAR applicability and configure US Person verification attribute if required (Section 16.1)
- [ ] Customize RLS patterns for client's specific data model and organizational hierarchy
- [ ] Test end-to-end access flow for each tier in client's pilot environment before production deployment
- [ ] Validate service principal and managed identity patterns against client's DevOps and pipeline architecture
- [ ] Configure access review schedules and confirm reviewer assignments with client data owners
- [ ] Review break-glass account procedures with client's SOC and IT operations teams
- [ ] Document any client-specific deviations from this standard with risk acceptance sign-off

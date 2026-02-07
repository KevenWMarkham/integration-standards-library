# API Security Standards

> Module: ISL-01 | Version: 1.0 | Adaptation Effort: 4-8 hrs | Dependencies: ISL-03, ISL-04

## Purpose

This document establishes the security standards for all APIs developed, consumed, or managed within the client environment. These standards ensure that APIs are protected against the OWASP API Security Top 10 (2023) threats, enforce proper authentication and authorization, and align with the data classification tiers defined in ISL-04.

All APIs must pass a security review gate (defined in API Lifecycle Governance) before publishing. Security requirements scale with the data classification tier of the resources exposed by the API.

## Scope

### In Scope

- Authentication and authorization for all RESTful APIs
- OAuth 2.0 and OpenID Connect (OIDC) implementation requirements
- API key management policies
- Service-to-service authentication (mTLS, managed identity)
- Input validation and output encoding
- CORS configuration standards
- Transport layer security (TLS)
- Audit logging for API access
- OWASP API Security Top 10 (2023) mitigations
- ITAR-controlled API security overlay

### Out of Scope

- Network-level security (firewalls, NSGs) — covered under infrastructure standards
- Database encryption at rest — covered under ISL-04
- Application-level business logic authorization beyond API layer
- Physical security controls

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default | Client Value | Notes |
|-----------|---------|--------------|-------|
| Identity Provider | Microsoft Entra ID (Azure AD) | _________________ | Primary IdP for OAuth 2.0/OIDC |
| OAuth 2.0 Token Issuer | `https://login.microsoftonline.com/{tenant}/v2.0` | _________________ | Token issuer URL |
| API Audience | `api://{client-id}` | _________________ | Token audience claim |
| Token Expiry (Access) | 60 minutes | _________________ | Access token lifetime |
| Token Expiry (Refresh) | 24 hours | _________________ | Refresh token lifetime |
| API Key Rotation Period | 90 days | _________________ | Maximum key age |
| mTLS Required for Internal | Yes | _________________ | Service-to-service mTLS |
| TLS Minimum Version | 1.2 | _________________ | Minimum TLS version |
| CORS Allowed Origins | None (deny all) | _________________ | Whitelist of origins |
| WAF Provider | Azure Front Door WAF | _________________ | Web Application Firewall |
| SIEM Integration | Microsoft Sentinel | _________________ | Security event logging |
| ITAR Compliance Required | No | _________________ | Yes/No |
| Data Classification Tiers | ISL-04 Default (Tier 1-4) | _________________ | Reference ISL-04 |
| Certificate Authority | Internal PKI / Let's Encrypt | _________________ | TLS certificate provider |
| Secret Management | Azure Key Vault | _________________ | Secrets and key storage |

## Authentication Standards

### OAuth 2.0 Flow Selection

| Scenario | Recommended Flow | Grant Type | Notes |
|----------|-----------------|------------|-------|
| Web application (server-side) | Authorization Code + PKCE | `authorization_code` | Always use PKCE even for confidential clients |
| Single-page application (SPA) | Authorization Code + PKCE | `authorization_code` | No client secret; use PKCE |
| Mobile application | Authorization Code + PKCE | `authorization_code` | Use custom URL scheme for redirect |
| Service-to-service | Client Credentials | `client_credentials` | Machine identity, no user context |
| Daemon/batch process | Client Credentials | `client_credentials` | Use managed identity where possible |
| On-behalf-of (delegation) | On-Behalf-Of | `urn:ietf:params:oauth:grant-type:jwt-bearer` | User context propagation between services |

### Prohibited Flows

| Flow | Status | Rationale |
|------|--------|-----------|
| Implicit Grant | **PROHIBITED** | Tokens exposed in URL fragment; superseded by Auth Code + PKCE |
| Resource Owner Password Credentials (ROPC) | **PROHIBITED** | Exposes user credentials to the client application |
| Authorization Code without PKCE | **PROHIBITED** | Vulnerable to authorization code interception attacks |

### Token Validation Requirements

All API endpoints must validate tokens according to the following requirements:

| Validation Check | Required | Description |
|-----------------|----------|-------------|
| Signature verification | Yes | Verify JWT signature against IdP JWKS endpoint |
| Issuer (`iss`) claim | Yes | Must match configured token issuer |
| Audience (`aud`) claim | Yes | Must match the API's registered audience |
| Expiration (`exp`) claim | Yes | Reject expired tokens |
| Not-before (`nbf`) claim | Yes | Reject tokens not yet valid |
| Token type | Yes | Must be `Bearer` access token (not ID token) |
| Scopes/roles | Yes | Verify required scopes/roles for the endpoint |
| Token binding | Recommended | Proof-of-possession where supported |

### Token Validation — APIM Policy Example

```xml
<inbound>
    <validate-jwt header-name="Authorization" failed-validation-httpcode="401"
                  failed-validation-error-message="Unauthorized: Invalid or expired token"
                  require-expiration-time="true" require-scheme="Bearer">
        <openid-config url="https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration" />
        <audiences>
            <audience>api://{client-id}</audience>
        </audiences>
        <issuers>
            <issuer>https://login.microsoftonline.com/{tenant}/v2.0</issuer>
        </issuers>
        <required-claims>
            <claim name="roles" match="any">
                <value>API.Read</value>
                <value>API.Write</value>
            </claim>
        </required-claims>
    </validate-jwt>
</inbound>
```

### Managed Identity (Preferred for Azure Services)

For service-to-service communication within Azure, managed identity is preferred over client credentials with secrets:

| Component | Authentication Method |
|-----------|---------------------|
| Azure Function to APIM | System-assigned managed identity |
| Fabric Data Factory to External API | User-assigned managed identity |
| Logic App to APIM | System-assigned managed identity |
| AKS Pod to Key Vault | Workload identity (federated) |
| APIM to Backend Service | Managed identity with `authentication-managed-identity` policy |

## Authorization Standards

### Scope-Based Access Control

Define API scopes that map to resource actions:

| Scope | Permission | Description |
|-------|-----------|-------------|
| `api://app/WorkOrders.Read` | Read | View work orders |
| `api://app/WorkOrders.Write` | Write | Create/update work orders |
| `api://app/WorkOrders.Delete` | Delete | Remove work orders |
| `api://app/WorkOrders.Admin` | Full | Full work order management |
| `api://app/Telemetry.Ingest` | Write | Submit sensor telemetry data |
| `api://app/Telemetry.Read` | Read | Query telemetry data |
| `api://app/Reports.Export` | Read | Export report data |

### Role-Based Access Control (RBAC)

Map application roles to API scopes:

| Role | Scopes | Description |
|------|--------|-------------|
| `API.Consumer.Read` | `*.Read` | Read-only access to all resources |
| `API.Consumer.Write` | `*.Read`, `*.Write` | Read and write access |
| `API.Admin` | `*.Read`, `*.Write`, `*.Delete`, `*.Admin` | Full administrative access |
| `API.System` | `*.Read`, `*.Write`, `*.Ingest` | Service account for integrations |
| `API.IoT.Device` | `Telemetry.Ingest` | IoT device telemetry submission only |
| `API.ITAR.Cleared` | ITAR-scoped resources | US Person verified, ITAR access |

### Attribute-Based Access Control (ABAC)

For fine-grained authorization beyond roles, implement ABAC policies:

| Attribute | Source | Example Rule |
|-----------|--------|-------------|
| User department | Token claim `department` | Users can only access work orders for their department |
| Plant code | Token claim `plant_codes` | Users restricted to their assigned plant(s) |
| Data classification | Resource metadata | Tier 3/4 data requires additional authorization claims |
| Time of day | Request timestamp | Restrict certain operations to business hours |
| IP range | Request source | Restrict admin operations to corporate network |
| Country | Request geo-location | ITAR resources restricted to US-origin requests |

### Authorization Decision Flow

1. **Token validation** — Verify JWT signature, issuer, audience, expiration.
2. **Scope check** — Verify the token contains the required scope for the endpoint.
3. **Role check** — Verify the user/service has the required role assignment.
4. **ABAC evaluation** — Apply attribute-based rules (plant code, department, classification).
5. **Resource-level check** — Verify the caller has access to the specific resource instance.
6. **Audit log** — Record the authorization decision (permit or deny) with context.

## API Key Management

API keys are used as a supplementary authentication mechanism (e.g., for third-party integrations that cannot use OAuth 2.0) and must never be the sole authentication method for Tier 2+ data.

### API Key Policy

| Requirement | Standard |
|-------------|----------|
| Key format | 256-bit random, Base64-encoded (minimum 32 characters) |
| Key storage | Azure Key Vault only; never in source code, config files, or environment variables |
| Key rotation | Every 90 days maximum; support dual active keys during rotation |
| Key per consumer | Unique key per consumer application (never shared) |
| Key revocation | Immediate revocation capability; revoked within 5 minutes globally |
| Key transmission | HTTPS only; never in URL query parameters |
| Key header | `X-API-Key` header (not `Authorization`) |
| Key scope | Keys must be scoped to specific API products/endpoints |
| Monitoring | Alert on unusual key usage patterns (volume, time, geography) |

### Key Rotation Process

1. Generate new key in Azure Key Vault.
2. Configure APIM to accept both old and new keys (dual-key period).
3. Notify consumer to update to new key (minimum 14-day notice).
4. After consumer confirms migration, revoke old key.
5. Log rotation event in audit trail.

## Mutual TLS (mTLS) for Service-to-Service

### When mTLS is Required

| Communication Path | mTLS Required | Rationale |
|-------------------|---------------|-----------|
| APIM to backend service (internal) | Yes | Zero-trust internal network |
| Service to SAP RFC gateway | Yes | ERP data protection |
| IoT gateway to telemetry API | Recommended | Device authentication |
| External partner API calls | Conditional | Per partner agreement |
| Fabric to external endpoints | No | Uses managed identity/OAuth |

### mTLS Configuration Requirements

| Requirement | Standard |
|-------------|----------|
| Certificate authority | Internal PKI or approved public CA |
| Certificate key size | RSA 2048-bit minimum; RSA 4096-bit or ECDSA P-256 preferred |
| Certificate lifetime | 1 year maximum for service certificates |
| Certificate renewal | Automated via Azure Key Vault or cert-manager |
| Certificate validation | Full chain validation including revocation check (OCSP/CRL) |
| Client certificate header | `X-Client-Certificate` forwarded by APIM after validation |

## CORS Configuration

### CORS Policy Standards

| Setting | Default | Notes |
|---------|---------|-------|
| `Access-Control-Allow-Origin` | Explicit origin whitelist | Never use `*` for authenticated APIs |
| `Access-Control-Allow-Methods` | `GET, POST, PUT, PATCH, DELETE, OPTIONS` | Only methods the API supports |
| `Access-Control-Allow-Headers` | `Authorization, Content-Type, X-Request-ID, X-Correlation-ID, X-API-Key` | Explicit header list |
| `Access-Control-Expose-Headers` | `X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Location, ETag` | Headers client can read |
| `Access-Control-Max-Age` | `86400` (24 hours) | Preflight cache duration |
| `Access-Control-Allow-Credentials` | `true` (when origin is explicit) | Required for cookie/token auth |

### CORS APIM Policy

```xml
<cors allow-credentials="true">
    <allowed-origins>
        <origin>https://portal.example.com</origin>
        <origin>https://app.example.com</origin>
    </allowed-origins>
    <allowed-methods preflight-result-max-age="86400">
        <method>GET</method>
        <method>POST</method>
        <method>PUT</method>
        <method>PATCH</method>
        <method>DELETE</method>
        <method>OPTIONS</method>
    </allowed-methods>
    <allowed-headers>
        <header>Authorization</header>
        <header>Content-Type</header>
        <header>X-Request-ID</header>
        <header>X-Correlation-ID</header>
    </allowed-headers>
    <expose-headers>
        <header>X-RateLimit-Limit</header>
        <header>X-RateLimit-Remaining</header>
        <header>X-RateLimit-Reset</header>
        <header>Location</header>
        <header>ETag</header>
    </expose-headers>
</cors>
```

## Input Validation

All API inputs must be validated before processing. Input validation is the primary defense against injection attacks (OWASP API1, API3, API8).

### Validation Requirements by Input Source

| Input Source | Validation Type | Requirements |
|-------------|----------------|--------------|
| Path parameters | Type, format, range | Strict type checking; reject unexpected characters |
| Query parameters | Type, format, range, length | Maximum length enforcement; whitelist allowed parameters |
| Request headers | Format, length | Maximum header size 8KB; reject unknown custom headers |
| Request body (JSON) | Schema, type, format, range, length | Validate against OpenAPI schema; reject unknown properties |
| File uploads | Type, size, content scan | Allowlist MIME types; max size 10MB; antivirus scan |

### JSON Schema Validation Rules

| Rule | Requirement | Example |
|------|-------------|---------|
| String length limits | All strings must have `maxLength` | `"material_number": { "type": "string", "maxLength": 50 }` |
| Numeric ranges | All numbers must have `minimum`/`maximum` | `"quantity": { "type": "integer", "minimum": 1, "maximum": 999999 }` |
| Pattern matching | Use regex for structured strings | `"email": { "type": "string", "pattern": "^[^@]+@[^@]+$" }` |
| Enum enforcement | Use `enum` for known value sets | `"status": { "enum": ["open", "closed", "pending"] }` |
| Required fields | Explicitly list all required fields | `"required": ["material_number", "quantity", "plant_code"]` |
| No additional properties | Reject unknown fields by default | `"additionalProperties": false` |
| Array limits | Set `minItems` and `maxItems` | `"line_items": { "type": "array", "maxItems": 100 }` |
| Date format | Use ISO 8601 format validation | `"due_date": { "type": "string", "format": "date" }` |

### APIM Input Validation Policy

```xml
<inbound>
    <validate-content unspecified-content-type-action="prevent"
                      max-size="10485760"
                      size-exceeded-action="prevent"
                      errors-variable-name="validationErrors">
        <content type="application/json" validate-as="json"
                 action="prevent" allow-additional-properties="false" />
    </validate-content>
    <!-- Reject requests with query parameters exceeding length limits -->
    <choose>
        <when condition="@(context.Request.Url.Query.Any(q => q.Value.Length > 500))">
            <return-response>
                <set-status code="400" reason="Bad Request" />
                <set-body>{"type":"validation-error","title":"Query parameter too long","status":400}</set-body>
            </return-response>
        </when>
    </choose>
</inbound>
```

## OWASP API Security Top 10 (2023) — Mitigations

### API1:2023 — Broken Object Level Authorization (BOLA)

| Threat | An attacker accesses resources belonging to other users by manipulating resource IDs. |
|--------|---|
| Severity | Critical |
| Mitigation | Implement resource-level authorization checks on every request. Never rely solely on the resource ID provided by the client. Verify the caller's ownership/access to the specific resource. |
| Implementation | Authorization middleware must check: `token.subject` owns or has access to `resource.id`. |
| Testing | Include BOLA test cases in API security testing (horizontal privilege escalation). |

### API2:2023 — Broken Authentication

| Threat | Weak authentication mechanisms allow attackers to compromise tokens or bypass auth. |
|--------|---|
| Severity | Critical |
| Mitigation | Use OAuth 2.0 with PKCE for all flows. Enforce token validation (signature, expiry, audience, issuer). Prohibit implicit grant and ROPC. Implement token binding where possible. |
| Implementation | APIM `validate-jwt` policy on all endpoints. Short-lived tokens (60 min). Refresh token rotation. |
| Testing | Test for token reuse, expired token acceptance, missing validation checks. |

### API3:2023 — Broken Object Property Level Authorization

| Threat | API exposes sensitive object properties or allows unauthorized property modification. |
|--------|---|
| Severity | High |
| Mitigation | Define explicit response schemas per role. Never return all database columns by default. Filter response properties based on caller authorization level. Validate writable fields per role. |
| Implementation | Use response transformation policies to strip sensitive fields based on caller scope/role. |
| Testing | Verify role-based response filtering. Attempt to write read-only properties. |

### API4:2023 — Unrestricted Resource Consumption

| Threat | API lacks rate limiting, allowing resource exhaustion or financial damage. |
|--------|---|
| Severity | High |
| Mitigation | Implement rate limiting per consumer tier (see Rate Limiting Policy). Set request size limits. Limit pagination page size. Set query complexity limits. Apply cost-based throttling. |
| Implementation | APIM rate-limit and quota policies. Max request body 10MB. Max page size 1000. |
| Testing | Load testing to verify rate limits are enforced. Test oversized request rejection. |

### API5:2023 — Broken Function Level Authorization

| Threat | Attacker accesses administrative functions without proper authorization. |
|--------|---|
| Severity | High |
| Mitigation | Implement role-based access for all endpoints. Separate admin and user API routes. Deny by default — explicitly grant access. Log all administrative action attempts. |
| Implementation | APIM policies enforce role requirements per operation. Admin endpoints require `API.Admin` role. |
| Testing | Attempt admin operations with consumer tokens. Verify deny-by-default. |

### API6:2023 — Unrestricted Access to Sensitive Business Flows

| Threat | Automated abuse of business-critical API flows (e.g., mass creation, scraping). |
|--------|---|
| Severity | Medium |
| Mitigation | Implement business-flow rate limiting (separate from standard rate limits). Use CAPTCHA for user-facing flows. Monitor for automated abuse patterns. Apply progressive throttling. |
| Implementation | Custom APIM policies for business-critical endpoints. Anomaly detection in Sentinel. |
| Testing | Simulate automated abuse patterns and verify detection/blocking. |

### API7:2023 — Server-Side Request Forgery (SSRF)

| Threat | API fetches URLs provided by the client without validation, allowing internal resource access. |
|--------|---|
| Severity | High |
| Mitigation | Validate and sanitize all client-provided URLs. Maintain allowlist of permitted external domains. Block access to internal network ranges (10.x, 172.16-31.x, 192.168.x). Disable HTTP redirects for server-side requests. |
| Implementation | URL validation middleware. Network-level egress restrictions. APIM backend URL allowlist. |
| Testing | Attempt SSRF with internal IPs, metadata endpoints, and redirect chains. |

### API8:2023 — Security Misconfiguration

| Threat | Default configurations, unnecessary features, overly permissive CORS, verbose errors. |
|--------|---|
| Severity | Medium |
| Mitigation | Disable debug endpoints in production. Configure restrictive CORS. Suppress stack traces in errors. Disable unnecessary HTTP methods. Apply security headers. Run configuration audits. |
| Implementation | APIM policies enforce security headers. Automated configuration scanning via Defender for APIs. |
| Testing | Scan for default credentials, open debug endpoints, verbose error responses. |

### API9:2023 — Improper Inventory Management

| Threat | Shadow APIs, deprecated endpoints still accessible, undocumented APIs. |
|--------|---|
| Severity | Medium |
| Mitigation | Maintain API catalog (see API Catalog Requirements). Enforce API registration before publishing. Automatically discover and flag shadow APIs. Enforce deprecation timelines. Block unregistered APIs at the gateway. |
| Implementation | APIM API inventory with Defender for APIs discovery. Mandatory catalog registration. |
| Testing | Scan for undocumented endpoints. Verify deprecated APIs are sunset on schedule. |

### API10:2023 — Unsafe Consumption of APIs

| Threat | The API blindly trusts data from third-party APIs without validation. |
|--------|---|
| Severity | Medium |
| Mitigation | Validate all data received from external APIs (SAP, Epicor, third-party). Apply input validation to upstream API responses. Use circuit breakers for unreliable external APIs. Log and monitor external API interactions. |
| Implementation | Backend validation layer. APIM outbound policies for response validation. Circuit breaker patterns. |
| Testing | Send malformed data from mock external APIs. Verify validation and error handling. |

## Data Classification — Security Requirements Mapping

Align API security requirements with ISL-04 data classification tiers:

| Requirement | Tier 1 (Public) | Tier 2 (Internal) | Tier 3 (Confidential) | Tier 4 (Restricted/ITAR) |
|-------------|-----------------|--------------------|-----------------------|--------------------------|
| Authentication | API key acceptable | OAuth 2.0 required | OAuth 2.0 + MFA | OAuth 2.0 + MFA + mTLS |
| Authorization | Basic scope check | RBAC | RBAC + ABAC | RBAC + ABAC + US Person |
| Encryption in transit | TLS 1.2+ | TLS 1.2+ | TLS 1.3 required | TLS 1.3 + mTLS required |
| Input validation | Standard | Standard | Enhanced (strict schema) | Enhanced + content scanning |
| Rate limiting | Standard tier | Standard tier | Premium tier | Custom (restricted) |
| Audit logging | Basic (errors only) | Standard (all requests) | Enhanced (request + response body) | Full (immutable, 5-yr retention) |
| Error detail | Standard | Standard | Minimal (no internal details) | Minimal + incident trigger |
| CORS | Permissive allowed | Restricted | Strict allowlist only | No CORS (backend only) |
| API key allowed | Yes (sole auth OK) | Supplementary only | No (OAuth only) | No (OAuth + mTLS only) |
| Geo-restriction | None | None | Corporate network preferred | US-only (mandatory) |

## Transport Layer Security

### TLS Requirements

| Requirement | Standard |
|-------------|----------|
| Minimum TLS version | TLS 1.2 (TLS 1.3 preferred) |
| Prohibited versions | SSL 2.0, SSL 3.0, TLS 1.0, TLS 1.1 |
| Cipher suites (TLS 1.2) | `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`, `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256` |
| Cipher suites (TLS 1.3) | `TLS_AES_256_GCM_SHA384`, `TLS_AES_128_GCM_SHA256`, `TLS_CHACHA20_POLY1305_SHA256` |
| Certificate key size | RSA 2048-bit minimum; RSA 4096-bit or ECDSA P-256 preferred |
| Certificate validity | 1 year maximum (398 days) |
| Certificate renewal | Automated; alert at 30 days before expiry |
| HSTS | `Strict-Transport-Security: max-age=31536000; includeSubDomains` |
| Certificate transparency | Required for public-facing certificates |

## Audit Logging Requirements

### What to Log

| Event | Logged Data | Tier Applicability |
|-------|------------|-------------------|
| Authentication success | Timestamp, subject, client ID, IP, method | All tiers |
| Authentication failure | Timestamp, attempted subject, client ID, IP, failure reason | All tiers |
| Authorization denial | Timestamp, subject, resource, action, denial reason | All tiers |
| Resource access (read) | Timestamp, subject, resource, action | Tier 2+ |
| Resource modification | Timestamp, subject, resource, action, changed fields | Tier 2+ |
| Resource access with body | Timestamp, subject, resource, request body, response body | Tier 3+ |
| Administrative action | Timestamp, subject, action, target, before/after state | All tiers |
| Rate limit trigger | Timestamp, subject, endpoint, current count, limit | All tiers |
| API key usage | Timestamp, key ID (not key value), endpoint, IP | All tiers |

### What NOT to Log

- Full authentication tokens (Bearer tokens, API keys)
- Passwords or secrets in any form
- Full credit card numbers or SSNs
- Unmasked PII beyond what is necessary for audit
- Request/response bodies for Tier 1 data (excessive volume)

### Log Retention

| Tier | Retention Period | Storage |
|------|-----------------|---------|
| Tier 1 | 90 days | Log Analytics (hot), Storage Account (warm) |
| Tier 2 | 1 year | Log Analytics (hot 30d), Storage Account (warm) |
| Tier 3 | 3 years | Log Analytics (hot 30d), Immutable Storage (cold) |
| Tier 4 (ITAR) | 5 years minimum | Immutable Storage, geo-restricted to US regions |

## Fabric / Azure Implementation Guidance

### Azure API Management Security Configuration

- Enable Defender for APIs for runtime threat detection.
- Configure subscription keys as supplementary authentication (not primary).
- Use named values in Key Vault for all secrets referenced in policies.
- Enable Application Insights with request/response body logging for Tier 3+ APIs.
- Configure IP filtering for administrative endpoints.

### Microsoft Entra ID Integration

- Register each API as an app registration with explicit API permissions (scopes).
- Use app roles for RBAC (defined in the API's app registration manifest).
- Configure conditional access policies for Tier 3+ API access.
- Enable continuous access evaluation (CAE) for real-time token revocation.

### Fabric-Specific Security

- Fabric REST API calls must use service principal or managed identity authentication.
- OneLake access must use ABAC with workspace-level permissions.
- Fabric Data Factory web activities must store credentials in Key Vault linked services.
- Power BI embed tokens must be scoped to the minimum required permissions.

### Azure Key Vault Integration

- All API keys, client secrets, and certificates must be stored in Azure Key Vault.
- APIM must reference secrets via named values backed by Key Vault.
- Key Vault access policies must follow least-privilege principle.
- Enable soft-delete and purge protection on all Key Vault instances.
- Configure Key Vault diagnostic logging to the SIEM.

## Manufacturing Overlay [CONDITIONAL]

### SAP API Security

- SAP RFC/BAPI wrapper APIs must enforce the same OAuth 2.0 standards as native APIs.
- SAP system credentials used by wrapper services must be stored in Azure Key Vault.
- SAP user context propagation: map OAuth subject to SAP user via STS or claim mapping.
- SAP transport-layer security: SNC (Secure Network Communications) for RFC connections.
- SAP audit: log all RFC calls with SAP transaction codes and authorization objects.

### Epicor API Security

- Epicor Kinetic REST APIs use their own authentication; wrap behind APIM with OAuth 2.0.
- Map Epicor security groups to API roles for consistent authorization.
- Epicor session tokens must not be exposed to external consumers.
- Apply the same input validation standards to data before passing to Epicor.

### IoT Device Authentication

- IoT devices must use X.509 certificate-based authentication.
- Device certificates must be provisioned via Azure IoT Hub Device Provisioning Service (DPS).
- Device certificate rotation must be automated (maximum 1-year lifetime).
- Compromised device certificates must be revocable within 1 hour.
- Telemetry ingestion endpoints must validate device identity and authorized telemetry types.

### ITAR-Compliant API Security

- US Person verification: validate `itar_cleared` claim in token before granting access.
- Geo-fencing: reject requests from non-US IP addresses (APIM IP filter policy).
- Encryption: TLS 1.3 mandatory; no fallback to TLS 1.2.
- Audit: immutable audit log with 5-year retention in US-only Azure region.
- Access review: quarterly review of all ITAR API access grants.
- Incident response: automated alert on any unauthorized ITAR access attempt.
- Data residency: ITAR API backends must run in US-only Azure regions (East US, West US, Central US).

## Cross-References

| Document | Relationship |
|----------|-------------|
| ISL-01: API Design Standards | Error format, headers, input validation patterns |
| ISL-01: API Versioning Policy | Security implications of version migration |
| ISL-01: API Lifecycle Governance | Security review gates |
| ISL-01: API Catalog Requirements | API inventory for shadow API detection |
| ISL-01: Rate Limiting Policy | Throttling as security control |
| ISL-03: Naming Conventions | Security header naming |
| ISL-04: Security by Tier | Data classification tiers and security requirements |

## Compliance Alignment

| Standard | Alignment |
|----------|-----------|
| OWASP API Security Top 10 (2023) | Full mapping with mitigations for all 10 risks |
| NIST SP 800-53 (AC, AU, IA, SC) | Access control, audit, identification/auth, system communications |
| ISO 27001 (A.9, A.10, A.13, A.14) | Access management, cryptography, communications, system development |
| Microsoft REST API Guidelines | Authentication patterns, error handling |
| OAuth 2.0 (RFC 6749, 6750) | Authorization framework and bearer token usage |
| OpenID Connect Core 1.0 | Identity layer on OAuth 2.0 |
| RFC 7636 (PKCE) | Proof Key for Code Exchange |
| ITAR (22 CFR 120-130) | Export-controlled data protection requirements |
| SOC 2 Type II (CC6, CC7) | Logical access, system operations |
| PCI DSS v4.0 (Req 6, 8) | Secure development, strong authentication (if applicable) |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial release |
| — | — | — | Reserved for client adaptation |

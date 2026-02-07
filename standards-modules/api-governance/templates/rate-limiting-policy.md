# Rate Limiting & Throttling Policy

> Module: ISL-01 | Version: 1.0 | Adaptation Effort: 2-3 hrs | Dependencies: ISL-03, ISL-04

## Purpose

This document establishes the rate limiting and throttling policy for all APIs managed within the client environment. Rate limiting protects API infrastructure from overuse, ensures fair access across consumers, prevents resource exhaustion attacks (OWASP API4:2023), and enables predictable service quality aligned with SLA commitments.

All APIs published through the API gateway must implement rate limiting in accordance with this policy.

## Scope

### In Scope

- Per-consumer rate limiting for all API endpoints
- Consumer tier definitions and quota allocations
- Burst handling and spike protection
- Throttling response format and headers
- Quota management and monitoring
- Dynamic rate limiting for adaptive protection
- DDoS protection alignment
- Azure API Management (APIM) policy implementation

### Out of Scope

- Network-level DDoS protection (covered under infrastructure/Azure Front Door)
- Web Application Firewall (WAF) rules (complementary but separate)
- Application-level circuit breakers (covered under resilience patterns)
- Database connection throttling (covered under data platform standards)

## [ADAPTATION REQUIRED] Client Context

| Parameter | Default | Client Value | Notes |
|-----------|---------|--------------|-------|
| API Gateway | Azure API Management (APIM) | _________________ | Rate limiting enforcement point |
| Default Consumer Tier | Standard | _________________ | Tier for new consumers |
| Rate Limit Scope | Per subscription key | _________________ | Key, IP, user, or composite |
| Rate Window | Sliding window | _________________ | Fixed or sliding window |
| Burst Multiplier | 2x sustained rate | _________________ | Burst allowance above sustained |
| Quota Reset Time | Midnight UTC | _________________ | Daily quota reset point |
| Retry-After Format | Seconds (integer) | _________________ | Seconds or HTTP-date |
| DDoS Protection | Azure DDoS Protection Standard | _________________ | DDoS mitigation service |
| WAF Integration | Azure Front Door WAF | _________________ | WAF platform |
| Alerting Platform | Azure Monitor + Sentinel | _________________ | Rate limit alert destination |
| Exemption Authority | API Governance Board | _________________ | Who approves exemptions |
| IoT Ingestion Rate | 10,000 msg/sec aggregate | _________________ | IoT telemetry ceiling |

## Consumer Tier Definitions

### Tier Overview

| Tier | Target Audience | Use Case | Cost Model |
|------|----------------|----------|------------|
| **Free** | Developers, proof-of-concept, sandbox | Evaluation and testing | No charge |
| **Basic** | Internal applications, low-volume consumers | Departmental tools, reporting | Internal chargeback (low) |
| **Standard** | Production applications, standard consumers | Business applications, integrations | Internal chargeback (standard) |
| **Premium** | Mission-critical applications, high-volume consumers | Core business processes, ERP integrations | Internal chargeback (premium) |
| **Unlimited** | Infrastructure services (by exception only) | API gateway, health checks, monitoring | Governance Board approval |

### Tier Assignment Criteria

| Criterion | Free | Basic | Standard | Premium |
|-----------|------|-------|----------|---------|
| Environment | Sandbox only | Non-production + production | Production | Production |
| Business criticality | None | Low | Medium-High | Critical |
| SLA requirement | None | Bronze | Silver-Gold | Gold-Platinum |
| Expected daily volume | < 1,000 | < 10,000 | < 100,000 | < 1,000,000 |
| Consumer type | Developer | Internal app | Business app | Core system |
| Approval required | Self-service | Team lead | API Product Owner | Governance Board |

## Rate Limit Specifications

### Per-Tier Rate Limits

| Metric | Free | Basic | Standard | Premium |
|--------|------|-------|----------|---------|
| **Requests per second (sustained)** | 5 | 20 | 100 | 500 |
| **Requests per second (burst)** | 10 | 40 | 200 | 1,000 |
| **Requests per minute** | 60 | 600 | 3,000 | 15,000 |
| **Requests per hour** | 500 | 5,000 | 50,000 | 250,000 |
| **Requests per day** | 1,000 | 10,000 | 100,000 | 1,000,000 |
| **Max concurrent connections** | 2 | 10 | 50 | 200 |
| **Max request body size** | 1 MB | 5 MB | 10 MB | 25 MB |
| **Max response body size** | 5 MB | 10 MB | 25 MB | 50 MB |
| **Bulk operation batch size** | 10 | 25 | 100 | 500 |
| **Async operations per hour** | 5 | 20 | 100 | 500 |

### Endpoint-Specific Rate Limits

Certain endpoint categories have additional rate limits that apply regardless of consumer tier:

| Endpoint Category | Additional Limit | Rationale |
|-------------------|-----------------|-----------|
| Authentication endpoints (`/oauth/token`) | 10 req/min per client | Brute force protection |
| Bulk operation endpoints (`/*/bulk`) | 5 req/min per consumer | Resource protection |
| Report generation endpoints | 2 req/min per consumer | Compute protection |
| File upload endpoints | 10 req/min per consumer | Storage protection |
| Search endpoints | 30 req/min per consumer | Query load protection |
| Health check endpoints | Exempt | Monitoring must not be throttled |
| OpenAPI spec endpoints | 10 req/min per IP | Documentation cache-friendly |

### IoT Telemetry Rate Limits

IoT telemetry ingestion has specialized rate limits due to high-frequency, small-payload patterns:

| Metric | Per Device | Per Plant | Aggregate |
|--------|-----------|-----------|-----------|
| Messages per second | 10 | 1,000 | 10,000 |
| Messages per minute | 100 | 10,000 | 100,000 |
| Messages per hour | 3,600 | 360,000 | 3,600,000 |
| Max message size | 4 KB | N/A | N/A |
| Batch messages per request | 100 | N/A | N/A |

## Burst Handling

### Burst Policy

Burst handling allows temporary traffic spikes above the sustained rate limit:

| Parameter | Standard |
|-----------|----------|
| Burst multiplier | 2x sustained rate |
| Burst duration | 10 seconds maximum |
| Burst recovery | Full rate restored after 30-second cooldown |
| Burst tracking | Per consumer subscription key |
| Burst exhaustion | Standard rate limit applies (no queuing) |

### Token Bucket Algorithm

Rate limiting is implemented using the token bucket algorithm:

```
Bucket capacity = Burst limit (e.g., 200 for Standard tier)
Token refill rate = Sustained rate (e.g., 100/second for Standard tier)
Each request consumes 1 token (or more for expensive operations)

If bucket has tokens: Request proceeds, token consumed
If bucket is empty: Request rejected with 429
```

### Weighted Request Costing

Some operations consume more than one rate limit token:

| Operation | Token Cost | Rationale |
|-----------|-----------|-----------|
| GET (single resource) | 1 | Standard retrieval |
| GET (collection, default page) | 1 | Standard list |
| GET (collection, large page > 500) | 2 | Higher database load |
| POST (create) | 2 | Write operation |
| PUT/PATCH (update) | 2 | Write operation |
| DELETE | 1 | Simple operation |
| POST (bulk, per batch item) | 1 per item | Linear scaling |
| POST (async/long-running) | 5 | Significant resource usage |
| POST (report generation) | 10 | Compute-intensive |
| POST (file upload) | 5 | Storage + processing |

## Throttling Response Format

### 429 Too Many Requests Response

When a consumer exceeds their rate limit, the API must return a `429 Too Many Requests` response:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 30
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1710500100

{
  "type": "https://api.example.com/problems/rate-limit-exceeded",
  "title": "Rate Limit Exceeded",
  "status": 429,
  "detail": "You have exceeded the rate limit of 100 requests per second for the Standard tier. Please retry after 30 seconds.",
  "instance": "/v1/work-orders",
  "traceId": "00-abcdef1234567890-01",
  "timestamp": "2025-03-15T14:30:00Z",
  "rateLimitInfo": {
    "tier": "Standard",
    "limit": 100,
    "remaining": 0,
    "resetAt": "2025-03-15T14:30:30Z",
    "retryAfter": 30
  }
}
```

### Rate Limit Headers

All API responses (not just 429) must include rate limit headers:

| Header | Format | Description | Example |
|--------|--------|-------------|---------|
| `X-RateLimit-Limit` | Integer | Maximum requests allowed in current window | `100` |
| `X-RateLimit-Remaining` | Integer | Requests remaining in current window | `73` |
| `X-RateLimit-Reset` | Unix timestamp | When the rate limit window resets | `1710500100` |
| `Retry-After` | Integer (seconds) | Seconds until retry is safe (429 only) | `30` |
| `X-RateLimit-Policy` | String | Active rate limit policy name | `standard-100rps` |

### APIM Policy — Rate Limit Headers

```xml
<outbound>
    <set-header name="X-RateLimit-Limit" exists-action="override">
        <value>@{
            var tier = context.Subscription.Name;
            switch(tier) {
                case "premium": return "500";
                case "standard": return "100";
                case "basic": return "20";
                default: return "5";
            }
        }</value>
    </set-header>
    <set-header name="X-RateLimit-Remaining" exists-action="override">
        <value>@(context.Variables.GetValueOrDefault<string>("remainingCalls", "0"))</value>
    </set-header>
    <set-header name="X-RateLimit-Reset" exists-action="override">
        <value>@(new DateTimeOffset(context.Variables.GetValueOrDefault<DateTime>("resetTime", DateTime.UtcNow.AddMinutes(1))).ToUnixTimeSeconds().ToString())</value>
    </set-header>
</outbound>
```

## Quota Management

### Daily Quota Tracking

In addition to per-second/per-minute rate limits, daily quotas provide a total usage cap:

| Action | Description |
|--------|-------------|
| Quota check | Every request checks remaining daily quota |
| Quota decrement | Quota decremented by request token cost |
| Quota exhaustion | Returns 429 with `Retry-After` pointing to next quota reset |
| Quota reset | Daily at midnight UTC (configurable) |
| Quota warning | Consumer notified at 80% and 90% consumption |
| Quota overage | No overage allowed; strict enforcement |

### APIM Quota Policy

```xml
<inbound>
    <!-- Per-second rate limit -->
    <rate-limit-by-key
        calls="100"
        renewal-period="1"
        counter-key="@(context.Subscription.Id)"
        increment-condition="@(context.Response.StatusCode >= 200 && context.Response.StatusCode < 400)"
        remaining-calls-variable-name="remainingCalls"
        retry-after-variable-name="retryAfter" />

    <!-- Daily quota -->
    <quota-by-key
        calls="100000"
        renewal-period="86400"
        counter-key="@(context.Subscription.Id)"
        increment-condition="@(context.Response.StatusCode >= 200 && context.Response.StatusCode < 400)" />
</inbound>
```

### Quota Increase Request Process

| Step | Activity | Responsible | SLA |
|------|----------|-------------|-----|
| 1 | Consumer submits quota increase request via portal | Consumer | — |
| 2 | API Product Owner reviews business justification | Product Owner | 2 days |
| 3 | Platform Team assesses capacity impact | Platform Team | 2 days |
| 4 | Tier upgrade approved or denied | Product Owner or Governance Board | 1 day |
| 5 | APIM subscription updated to new tier | Platform Team | 1 day |
| 6 | Consumer notified of new limits | Platform Team | Same day |

## Exemptions

### Exemption Categories

| Category | Description | Approval Authority | Duration |
|----------|-------------|-------------------|----------|
| **Health Monitoring** | Synthetic monitoring and health checks | Auto-approved | Permanent |
| **Emergency Override** | Temporary limit increase during incidents | On-call Engineer | 24 hours max |
| **Migration Window** | Increased limits during consumer migration | API Product Owner | 30 days max |
| **Load Testing** | Elevated limits for performance testing (non-prod) | Team Lead | Test duration |
| **Infrastructure** | Service mesh, gateway, internal orchestration | Governance Board | Permanent (reviewed annually) |
| **Partner SLA** | Custom limits per partner contractual agreement | Governance Board + Legal | Per contract |

### Exemption Request Template

| Field | Description |
|-------|-------------|
| Requestor | Name and team |
| API(s) affected | Which APIs require exemption |
| Current tier | Existing rate limit tier |
| Requested limit | Specific limits requested |
| Business justification | Why standard limits are insufficient |
| Duration | How long the exemption is needed |
| Risk assessment | Impact if exemption causes overload |
| Rollback plan | How to revert if issues occur |
| Approval | Required signatures per exemption category |

## Monitoring and Alerting

### Rate Limit Monitoring

| Metric | Alert Threshold | Severity | Action |
|--------|----------------|----------|--------|
| Consumer 429 rate > 10% of requests | 10% per consumer | Warning | Notify consumer, suggest tier upgrade |
| Consumer 429 rate > 25% of requests | 25% per consumer | High | Direct consumer outreach |
| Total 429 rate > 5% aggregate | 5% aggregate | Warning | Review capacity and limits |
| Total 429 rate > 15% aggregate | 15% aggregate | Critical | Immediate capacity review |
| Single consumer > 80% daily quota | 80% per consumer | Info | Proactive consumer notification |
| Single consumer > 95% daily quota | 95% per consumer | Warning | Consumer notification, suggest upgrade |
| Sudden traffic spike (5x normal) | 5x baseline | High | Investigate (potential DDoS or runaway client) |
| Rate limit policy errors | Any | Critical | Platform team investigation |

### Monitoring Dashboard

| Panel | Metrics | Refresh |
|-------|---------|---------|
| Real-time rate limit status | Current request rates by tier | 10 seconds |
| 429 response rate | 429 counts by consumer, endpoint | 1 minute |
| Quota consumption | Daily quota usage per consumer (% used) | 5 minutes |
| Top consumers by volume | Request volume ranking | 5 minutes |
| Burst utilization | Burst token usage patterns | 1 minute |
| Exemption status | Active exemptions and expiration dates | Hourly |
| Historical trends | Weekly/monthly volume trends per API | Daily |

### APIM Analytics Query — Top Throttled Consumers

```kusto
// Log Analytics query for top throttled consumers (last 24 hours)
ApiManagementGatewayLogs
| where TimeGenerated > ago(24h)
| where ResponseCode == 429
| summarize ThrottledRequests = count() by SubscriptionId = tostring(parse_json(BackendResponseBody).subscriptionId)
| top 10 by ThrottledRequests desc
| project SubscriptionId, ThrottledRequests
```

## Dynamic Rate Limiting

### Adaptive Rate Limiting

In addition to static tier-based limits, the API gateway may apply dynamic rate limits based on real-time conditions:

| Condition | Dynamic Action | Trigger |
|-----------|---------------|---------|
| Backend service degraded | Reduce all consumer limits by 50% | Health check returns `degraded` |
| Backend service unhealthy | Reduce all consumer limits by 80% | Health check returns `unhealthy` |
| Aggregate traffic spike | Proportionally reduce per-consumer limits | Total traffic exceeds 80% of capacity |
| DDoS attack detected | Block suspicious IPs, tighten all limits | WAF/DDoS protection alert |
| ERP system under load | Reduce ERP API wrapper limits | SAP/Epicor response time > 5s |
| Maintenance window approaching | Gradually reduce limits (graceful drain) | Scheduled maintenance in < 30 min |

### APIM Conditional Rate Limit Policy

```xml
<inbound>
    <choose>
        <!-- Normal operation: standard rate limits -->
        <when condition="@(context.Variables.GetValueOrDefault<string>("backendHealth", "healthy") == "healthy")">
            <rate-limit-by-key calls="100" renewal-period="1"
                counter-key="@(context.Subscription.Id)" />
        </when>
        <!-- Backend degraded: reduced rate limits -->
        <when condition="@(context.Variables.GetValueOrDefault<string>("backendHealth", "healthy") == "degraded")">
            <rate-limit-by-key calls="50" renewal-period="1"
                counter-key="@(context.Subscription.Id)" />
        </when>
        <!-- Backend unhealthy: minimal rate limits -->
        <otherwise>
            <rate-limit-by-key calls="10" renewal-period="1"
                counter-key="@(context.Subscription.Id)" />
        </otherwise>
    </choose>
</inbound>
```

## DDoS Protection Alignment

### Defense-in-Depth Layers

| Layer | Tool | Rate Limiting Role |
|-------|------|-------------------|
| **Layer 1: Network** | Azure DDoS Protection Standard | Volumetric attack mitigation |
| **Layer 2: Edge** | Azure Front Door WAF | Protocol attack mitigation, IP reputation |
| **Layer 3: Gateway** | Azure APIM Rate Limiting | Per-consumer and per-API throttling |
| **Layer 4: Application** | Application-level checks | Business logic abuse prevention |

### Coordination with WAF

| WAF Rule | APIM Rate Limit Interaction |
|----------|---------------------------|
| IP reputation block | WAF blocks before APIM rate limit evaluation |
| Geo-blocking (ITAR) | WAF blocks non-US traffic before APIM |
| Bot detection | WAF challenges suspicious traffic before APIM |
| Rate-based WAF rules | WAF provides coarse IP-level limiting; APIM provides fine consumer-level |
| Custom WAF rules | WAF can enforce per-IP limits complementary to per-subscription APIM limits |

## Fabric / Azure Implementation Guidance

### APIM Rate Limiting Configuration

- Use APIM Products to map to consumer tiers (one product per tier).
- Configure `rate-limit-by-key` policies at the API level (per-second limits).
- Configure `quota-by-key` policies at the Product level (daily quotas).
- Use APIM Subscription keys as the rate limit counter key.
- For multi-region deployments, consider using Azure Cache for Redis as the external rate limit counter store.

### Fabric API Rate Limiting

- Fabric REST APIs have their own Microsoft-enforced rate limits; document these in the catalog.
- Do not add additional APIM rate limiting on top of Fabric API limits (double throttling).
- Monitor Fabric API 429 responses and surface them in the rate limit dashboard.
- Implement retry logic with exponential backoff for Fabric API calls from Data Factory.

### Application Insights Integration

- Log all rate limit events to Application Insights as custom events.
- Track rate limit header values in dependency telemetry.
- Create Application Insights alerts for rate limit threshold breaches.
- Use Application Insights workbooks for rate limit analysis and capacity planning.

## Manufacturing Overlay [CONDITIONAL]

### ERP API Rate Limits

| ERP System | Consideration | Recommended Limit |
|------------|---------------|-------------------|
| SAP S/4HANA | RFC connection pool size, dialog work process limits | Align with SAP RFC pool size (typically 10-50 concurrent) |
| SAP BAPI calls | Long-running BAPIs may hold connections | 20 req/sec for write operations; 50 req/sec for reads |
| Epicor Kinetic | Epicor REST API session limits | Align with Epicor concurrent session license |
| Epicor BAQ | Complex BAQ queries are compute-intensive | 10 req/sec for complex queries; 50 req/sec for simple |

### IoT Rate Limiting Best Practices

- Use per-device rate limits to prevent a single malfunctioning sensor from overwhelming the system.
- Implement per-plant aggregate limits aligned with infrastructure capacity.
- Allow burst capability for IoT devices that transmit in periodic batches.
- Use Azure IoT Hub built-in throttling as the first defense layer; APIM rate limiting as the second.
- Monitor for device flooding patterns (indication of device malfunction or compromise).

### ITAR API Rate Limits

- ITAR-controlled APIs should use the Premium tier as a minimum to accommodate audit logging overhead.
- Rate limit all ITAR API access to prevent data exfiltration via high-volume requests.
- Implement lower rate limits for ITAR endpoints compared to standard endpoints.
- Monitor for unusual access patterns (high volume, off-hours, unusual geography) and alert immediately.

## Cross-References

| Document | Relationship |
|----------|-------------|
| ISL-01: API Design Standards | Rate limit headers, 429 response format |
| ISL-01: API Security Standards | DDoS protection, OWASP API4 mitigation |
| ISL-01: API Versioning Policy | Rate limit changes across versions |
| ISL-01: API Lifecycle Governance | Consumer onboarding and tier assignment |
| ISL-01: API Catalog Requirements | Consumer tier metadata, usage analytics |
| ISL-03: Naming Conventions | Rate limit header naming |
| ISL-04: Security by Tier | Tier-based rate limit requirements |

## Compliance Alignment

| Standard | Alignment |
|----------|-----------|
| OWASP API Security Top 10 (API4:2023) | Unrestricted Resource Consumption — primary mitigation |
| OWASP API Security Top 10 (API6:2023) | Unrestricted Access to Sensitive Business Flows — business flow limiting |
| NIST SP 800-53 (SC-5) | Denial of service protection |
| ISO 27001 (A.13.1) | Network security management |
| Microsoft REST API Guidelines | Rate limit header conventions |
| Azure Well-Architected Framework | Reliability and performance efficiency pillars |
| SOC 2 Type II (CC6, CC7) | Logical access and system operations |
| ITAR (22 CFR 120-130) | Data exfiltration prevention for controlled data |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial release |
| — | — | — | Reserved for client adaptation |

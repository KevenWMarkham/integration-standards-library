# Fabric-Native API Patterns — Completed Example

> Module: ISL-01 | Version: 1.0 | Type: Example

## Purpose

This document provides a fully completed example of API governance patterns applied to Microsoft Fabric-native integrations. It demonstrates how the ISL-01 API Governance standards apply when consuming Fabric REST APIs, building integrations with OneLake, orchestrating data pipelines via Fabric Data Factory, and embedding Power BI content.

**Environment Profile:**
- Platform: Microsoft Fabric (F64 capacity)
- Authentication: Microsoft Entra ID (Azure AD) with service principals
- API Gateway: Azure API Management (for custom APIs fronting Fabric)
- Workspaces: Development, Staging, Production
- Key Integrations: Lakehouse, Warehouse, Data Factory, Power BI

## Fabric REST API Authentication

### Service Principal Configuration

All automated Fabric API interactions use service principal authentication:

```
Tenant ID:       contoso.onmicrosoft.com
App Registration: Fabric-Integration-SP (app-id: a1b2c3d4-...)
API Permissions:  Fabric.Read.All, Fabric.ReadWrite.All, Dataset.ReadWrite.All
Secret Storage:   Azure Key Vault (kv-fabric-integration)
```

### Token Acquisition — Client Credentials Flow

```python
# Python — Acquire token for Fabric REST API using MSAL
from msal import ConfidentialClientApplication
import requests

app = ConfidentialClientApplication(
    client_id="a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    client_credential=key_vault_client.get_secret("fabric-sp-secret").value,
    authority="https://login.microsoftonline.com/contoso.onmicrosoft.com"
)

# Fabric API resource scope
result = app.acquire_token_for_client(
    scopes=["https://api.fabric.microsoft.com/.default"]
)

access_token = result["access_token"]
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json",
    "X-Request-ID": str(uuid.uuid4())
}
```

```csharp
// C# — Acquire token using Azure.Identity (Managed Identity preferred)
using Azure.Identity;

var credential = new DefaultAzureCredential(); // Uses managed identity in Azure
var token = await credential.GetTokenAsync(
    new TokenRequestContext(new[] { "https://api.fabric.microsoft.com/.default" })
);

var httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", token.Token);
httpClient.DefaultRequestHeaders.Add("X-Request-ID", Guid.NewGuid().ToString());
```

### Authentication Method Selection

| Scenario | Authentication Method | Rationale |
|----------|---------------------|-----------|
| Azure Data Factory activities | Managed Identity | No secret management needed |
| Azure Functions calling Fabric | System-assigned Managed Identity | Automatic credential rotation |
| On-premises integration runtime | Service Principal + Key Vault | Managed identity unavailable |
| Developer testing | User delegated (interactive) | Personal development only |
| Power BI embedded (server-side) | Service Principal | App-owns-data pattern |
| Scheduled pipeline triggers | Service Principal + Key Vault | Non-interactive automation |

## Fabric Workspace API Patterns

### List Workspaces

```http
GET https://api.fabric.microsoft.com/v1/workspaces HTTP/1.1
Authorization: Bearer {token}
X-Request-ID: 8d2e4f6a-1b3c-5d7e-9f0a-2b4c6d8e0f1a
```

**Response:**

```json
{
  "value": [
    {
      "id": "ws-prod-12345678-abcd-ef01-2345-6789abcdef01",
      "displayName": "Manufacturing-Analytics-Prod",
      "description": "Production analytics workspace for manufacturing KPIs",
      "type": "Workspace",
      "capacityId": "cap-f64-prod-001"
    },
    {
      "id": "ws-stg-23456789-bcde-f012-3456-789abcdef012",
      "displayName": "Manufacturing-Analytics-Staging",
      "description": "Staging workspace for pre-production validation",
      "type": "Workspace",
      "capacityId": "cap-f64-nonprod-001"
    }
  ],
  "continuationUri": null
}
```

### Pagination Through Fabric API Results

Fabric REST APIs use continuation tokens for pagination. Implement the following pattern:

```python
# Python — Paginate through Fabric API results
def get_all_fabric_items(base_url, headers):
    """Paginate through Fabric REST API results using continuation tokens."""
    all_items = []
    url = base_url

    while url:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()

        all_items.extend(data.get("value", []))

        # Fabric uses 'continuationUri' for pagination
        url = data.get("continuationUri")

        # Rate limit awareness: respect Retry-After if present
        if response.status_code == 429:
            retry_after = int(response.headers.get("Retry-After", 60))
            time.sleep(retry_after)
            continue

    return all_items

# Usage
workspaces = get_all_fabric_items(
    "https://api.fabric.microsoft.com/v1/workspaces",
    headers
)
```

```csharp
// C# — Paginate through Fabric API results with retry logic
public async Task<List<JObject>> GetAllFabricItemsAsync(string baseUrl, HttpClient client)
{
    var allItems = new List<JObject>();
    var url = baseUrl;

    while (!string.IsNullOrEmpty(url))
    {
        var response = await client.GetAsync(url);

        if (response.StatusCode == (HttpStatusCode)429)
        {
            var retryAfter = response.Headers.RetryAfter?.Delta ?? TimeSpan.FromSeconds(60);
            await Task.Delay(retryAfter);
            continue;
        }

        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        var data = JObject.Parse(content);

        allItems.AddRange(data["value"]?.ToObject<List<JObject>>() ?? new List<JObject>());
        url = data["continuationUri"]?.ToString();
    }

    return allItems;
}
```

## OneLake API Patterns

### OneLake Endpoint Structure

OneLake exposes an ADLS Gen2 compatible endpoint:

```
Base URL:    https://onelake.dfs.fabric.microsoft.com
Path Format: /{workspace-name}/{item-name}/Files/{path}
             /{workspace-name}/{item-name}/Tables/{table-name}

Examples:
  https://onelake.dfs.fabric.microsoft.com/Manufacturing-Analytics-Prod/bronze-lakehouse/Files/raw/sap/materials/2025/03/15/
  https://onelake.dfs.fabric.microsoft.com/Manufacturing-Analytics-Prod/bronze-lakehouse/Tables/sap_material_master
```

### OneLake File Operations

**List Files (ADLS Gen2 compatible):**

```http
GET https://onelake.dfs.fabric.microsoft.com/Manufacturing-Analytics-Prod/bronze-lakehouse/Files/raw/sap/materials/?resource=filesystem&recursive=false HTTP/1.1
Authorization: Bearer {token}
X-Request-ID: 1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d
x-ms-version: 2021-06-08
```

**Upload File to OneLake:**

```python
# Python — Upload file to OneLake using ADLS Gen2 API
from azure.storage.filedatalake import DataLakeServiceClient
from azure.identity import ClientSecretCredential

credential = ClientSecretCredential(
    tenant_id="contoso.onmicrosoft.com",
    client_id="a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    client_secret=key_vault_client.get_secret("fabric-sp-secret").value
)

# OneLake uses the DFS endpoint
service_client = DataLakeServiceClient(
    account_url="https://onelake.dfs.fabric.microsoft.com",
    credential=credential
)

# Access the lakehouse filesystem
file_system_client = service_client.get_file_system_client(
    file_system="Manufacturing-Analytics-Prod/bronze-lakehouse"
)

# Upload a file
file_client = file_system_client.get_file_client("Files/raw/sap/materials/2025/03/15/materials_extract.parquet")
with open("materials_extract.parquet", "rb") as file_data:
    file_client.upload_data(file_data, overwrite=True)
```

### OneLake Shortcut Pattern

For cross-workspace data access without data duplication:

```http
POST https://api.fabric.microsoft.com/v1/workspaces/{workspace-id}/items/{lakehouse-id}/shortcuts HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "sap_material_master_gold",
  "path": "Tables",
  "target": {
    "oneLake": {
      "workspaceId": "ws-prod-12345678",
      "itemId": "lh-gold-87654321",
      "path": "Tables/sap_material_master"
    }
  }
}
```

## Fabric Data Factory — Web Activity API Calls

### Calling External APIs from Fabric Pipelines

Fabric Data Factory web activities can call external APIs. Apply ISL-01 standards to these calls.

**Web Activity Configuration — SAP Wrapper API Call:**

```json
{
  "name": "Call_SAP_Materials_API",
  "type": "WebActivity",
  "typeProperties": {
    "url": "https://api.acme-mfg.com/v1/sap/materials?plant_code=1000&material_type=FERT&limit=1000",
    "method": "GET",
    "headers": {
      "Accept": "application/json",
      "X-Request-ID": "@{pipeline().RunId}",
      "X-Correlation-ID": "@{pipeline().GroupId}"
    },
    "authentication": {
      "type": "ServicePrincipal",
      "resource": "api://acme-mfg-api",
      "credential": {
        "type": "KeyVaultReference",
        "store": {
          "referenceName": "AzureKeyVault_LinkedService",
          "type": "LinkedServiceReference"
        },
        "secretName": "fabric-sp-secret"
      }
    },
    "timeout": "00:05:00",
    "retryPolicy": {
      "count": 3,
      "intervalInSeconds": 30,
      "backoffMultiplier": 2
    }
  }
}
```

### Paginating Through API Results in Data Factory

Use a ForEach + Until loop pattern to paginate through external API results:

```json
{
  "name": "Paginate_Materials_API",
  "type": "Until",
  "typeProperties": {
    "expression": {
      "value": "@equals(activity('Call_Materials_Page').output.pagination.hasMore, false)",
      "type": "Expression"
    },
    "activities": [
      {
        "name": "Call_Materials_Page",
        "type": "WebActivity",
        "typeProperties": {
          "url": "@{if(empty(variables('nextPageUrl')), concat('https://api.acme-mfg.com/v1/sap/materials?limit=1000'), variables('nextPageUrl'))}",
          "method": "GET"
        }
      },
      {
        "name": "Set_Next_Page",
        "type": "SetVariable",
        "typeProperties": {
          "variableName": "nextPageUrl",
          "value": "@{activity('Call_Materials_Page').output.links.next}"
        }
      },
      {
        "name": "Write_To_Lakehouse",
        "type": "Copy",
        "typeProperties": {
          "source": {
            "type": "RestSource",
            "requestBody": "@{activity('Call_Materials_Page').output.data}"
          },
          "sink": {
            "type": "LakehouseTableSink",
            "tableActionOption": "Append"
          }
        }
      }
    ],
    "timeout": "01:00:00"
  }
}
```

## Power BI REST API Patterns

### Dataset Refresh API

```python
# Python — Trigger Power BI dataset refresh via Fabric REST API
workspace_id = "ws-prod-12345678-abcd-ef01-2345-6789abcdef01"
dataset_id = "ds-mfg-kpi-87654321-dcba-10fe-5432-1fedcba98765"

# Trigger refresh
refresh_url = f"https://api.powerbi.com/v1.0/myorg/groups/{workspace_id}/datasets/{dataset_id}/refreshes"

refresh_response = requests.post(
    refresh_url,
    headers=headers,
    json={
        "notifyOption": "MailOnFailure",
        "retryCount": 2,
        "type": "Full",
        "commitMode": "transactional",
        "applyRefreshPolicy": True
    }
)

# Check refresh status: 202 Accepted means refresh initiated
if refresh_response.status_code == 202:
    print(f"Refresh initiated. Request ID: {refresh_response.headers.get('RequestId')}")
```

### Power BI Embed Token Generation

```csharp
// C# — Generate Power BI embed token for app-owns-data scenario
public async Task<EmbedToken> GenerateEmbedTokenAsync(
    Guid workspaceId, Guid reportId, Guid datasetId)
{
    var tokenRequest = new GenerateTokenRequestV2
    {
        Datasets = new List<GenerateTokenRequestV2Dataset>
        {
            new GenerateTokenRequestV2Dataset(datasetId.ToString())
        },
        Reports = new List<GenerateTokenRequestV2Report>
        {
            new GenerateTokenRequestV2Report(reportId.ToString(), allowEdit: false)
        },
        TargetWorkspaces = new List<GenerateTokenRequestV2TargetWorkspace>
        {
            new GenerateTokenRequestV2TargetWorkspace(workspaceId.ToString())
        },
        Lifetimes = new List<EffectiveIdentityLifetime>
        {
            new EffectiveIdentityLifetime
            {
                StartDateTime = DateTime.UtcNow,
                ExpirationDateTime = DateTime.UtcNow.AddMinutes(30) // Short-lived
            }
        }
    };

    var url = $"https://api.powerbi.com/v1.0/myorg/GenerateToken";
    var response = await _httpClient.PostAsJsonAsync(url, tokenRequest);
    response.EnsureSuccessStatusCode();

    return await response.Content.ReadFromJsonAsync<EmbedToken>();
}
```

### Power BI Export API

```python
# Python — Export Power BI report to PDF
workspace_id = "ws-prod-12345678"
report_id = "rpt-mfg-dashboard-001"

# Step 1: Initiate export (async operation — 202 Accepted pattern)
export_url = f"https://api.powerbi.com/v1.0/myorg/groups/{workspace_id}/reports/{report_id}/ExportTo"

export_request = {
    "format": "PDF",
    "powerBIReportConfiguration": {
        "pages": [
            {"pageName": "production_overview"},
            {"pageName": "quality_metrics"}
        ],
        "defaultBookmark": {
            "name": "CurrentMonth",
            "state": "data_filter_bookmark_state"
        }
    }
}

export_response = requests.post(export_url, headers=headers, json=export_request)
export_id = export_response.json()["id"]

# Step 2: Poll for completion
status_url = f"{export_url}/{export_id}"
while True:
    status_response = requests.get(status_url, headers=headers)
    status = status_response.json()["status"]

    if status == "Succeeded":
        # Step 3: Download the file
        file_url = f"{status_url}/file"
        file_response = requests.get(file_url, headers=headers)
        with open("production_report.pdf", "wb") as f:
            f.write(file_response.content)
        break
    elif status == "Failed":
        raise Exception(f"Export failed: {status_response.json().get('error', 'Unknown error')}")

    time.sleep(5)  # Poll every 5 seconds
```

## Error Handling Patterns

### Fabric API Error Response Handling

```python
# Python — Robust error handling for Fabric REST API calls
import requests
import time
import logging

logger = logging.getLogger("fabric_api")

class FabricApiError(Exception):
    def __init__(self, status_code, error_code, message, request_id):
        self.status_code = status_code
        self.error_code = error_code
        self.message = message
        self.request_id = request_id
        super().__init__(f"[{status_code}] {error_code}: {message} (Request: {request_id})")

def call_fabric_api(method, url, headers, json_body=None, max_retries=3):
    """Call Fabric REST API with retry logic and error handling."""

    for attempt in range(max_retries):
        try:
            response = requests.request(method, url, headers=headers, json=json_body, timeout=30)
            request_id = response.headers.get("RequestId", "unknown")

            # Success
            if 200 <= response.status_code < 300:
                return response

            # Rate limited — retry with backoff
            if response.status_code == 429:
                retry_after = int(response.headers.get("Retry-After", 60))
                logger.warning(
                    f"Rate limited by Fabric API. Retry after {retry_after}s. "
                    f"Request: {request_id}, Attempt: {attempt + 1}/{max_retries}"
                )
                time.sleep(retry_after)
                continue

            # Server error — retry with exponential backoff
            if response.status_code >= 500:
                wait_time = (2 ** attempt) * 5  # 5s, 10s, 20s
                logger.warning(
                    f"Fabric API server error ({response.status_code}). "
                    f"Retrying in {wait_time}s. Request: {request_id}"
                )
                time.sleep(wait_time)
                continue

            # Client error — do not retry
            error_body = response.json() if response.content else {}
            raise FabricApiError(
                status_code=response.status_code,
                error_code=error_body.get("errorCode", "UNKNOWN"),
                message=error_body.get("message", response.reason),
                request_id=request_id
            )

        except requests.exceptions.Timeout:
            logger.warning(f"Fabric API timeout. Attempt {attempt + 1}/{max_retries}")
            if attempt == max_retries - 1:
                raise
            time.sleep((2 ** attempt) * 5)

    raise FabricApiError(
        status_code=429,
        error_code="MAX_RETRIES_EXCEEDED",
        message=f"Failed after {max_retries} retries",
        request_id="N/A"
    )
```

### Common Fabric API Error Codes

| HTTP Status | Fabric Error Code | Cause | Resolution |
|-------------|-------------------|-------|------------|
| 400 | InvalidRequest | Malformed request body or parameters | Validate request against API documentation |
| 401 | Unauthorized | Token expired or invalid | Refresh access token |
| 403 | InsufficientPermissions | Service principal lacks required permissions | Check Entra ID app permissions and workspace roles |
| 404 | ItemNotFound | Workspace, lakehouse, or item does not exist | Verify item ID and workspace ID |
| 409 | ConflictError | Concurrent modification conflict | Retry with latest resource state |
| 429 | TooManyRequests | Fabric API rate limit exceeded | Honor Retry-After header; implement backoff |
| 500 | InternalError | Fabric service error | Retry with exponential backoff |
| 503 | ServiceUnavailable | Fabric capacity paused or overloaded | Check capacity status; wait and retry |

## Fabric API Rate Limit Awareness

### Known Fabric API Rate Limits

| API Category | Rate Limit | Scope | Notes |
|-------------|-----------|-------|-------|
| Workspace operations | 200 req/hr | Per service principal | Create, update, delete workspaces |
| Item operations | 200 req/hr | Per workspace | Create, update, delete items |
| OneLake (DFS) | 20,000 req/min | Per storage account | ADLS Gen2 compatible limits |
| Power BI dataset refresh | 8 refreshes/day | Per dataset (Pro), 48 (Premium) | Scheduled + on-demand combined |
| Power BI export | 5 exports/min | Per report | PDF/PPT/PNG exports |
| Admin APIs | 200 req/hr | Per tenant | Tenant-level administration |

### Rate Limit Handling Strategy

```
Fabric API Call
      │
      ├── 200-299: Success → Process response
      │
      ├── 429: Rate Limited
      │     ├── Read Retry-After header
      │     ├── Log rate limit event
      │     ├── Wait specified duration
      │     └── Retry (max 3 attempts)
      │
      ├── 500-503: Server Error
      │     ├── Exponential backoff (5s, 10s, 20s)
      │     ├── Log error with RequestId
      │     └── Retry (max 3 attempts)
      │
      └── 400-499: Client Error
            ├── Log error with full context
            ├── Do NOT retry (except 401 with token refresh)
            └── Raise to calling process
```

## Cross-References

| Document | Usage in This Example |
|----------|----------------------|
| ISL-01: API Design Standards | Error handling, pagination, header standards |
| ISL-01: API Security Standards | OAuth 2.0, service principal, managed identity |
| ISL-01: API Versioning Policy | Fabric API version targeting |
| ISL-01: API Lifecycle Governance | Monitoring and incident handling for Fabric APIs |
| ISL-01: API Catalog Requirements | Fabric APIs registered in catalog |
| ISL-01: Rate Limiting Policy | Fabric rate limit awareness and handling |
| ISL-03: Naming Conventions | OneLake path naming, workspace naming |
| ISL-04: Security by Tier | Data classification for Fabric resources |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-15 | ISL Working Group | Initial example — Fabric-native patterns |

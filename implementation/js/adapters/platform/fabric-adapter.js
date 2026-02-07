/**
 * ISL Implementation Accelerator — Microsoft Fabric Adapter
 * Maps ISL-03 (Naming) and ISL-05 (Integration Patterns) to Fabric artifacts.
 */
(function() {
class FabricAdapter {
  constructor(config) {
    this._config = config;
    this._adapterConfig = config.adapters?.config?.fabric || {};
  }

  static getId() { return 'fabric'; }
  static getName() { return 'Microsoft Fabric'; }
  static getDescription() { return 'Generates Fabric workspace naming, lakehouse structure, and pipeline catalogs with deployment scripts.'; }
  static getModules() { return ['ISL-03', 'ISL-05']; }

  validate() {
    const errors = [];
    if (!this._config.naming?.orgPrefix) errors.push('naming.orgPrefix is required');
    return { valid: errors.length === 0, errors };
  }

  getConfigFields() {
    return [
      { key: 'workspacePattern', type: 'string', label: 'Workspace Pattern', description: 'Pattern for workspace names', default: '{{orgPrefix}}_{{envCode}}_{{domain}}_{{layer}}', required: false },
      { key: 'lakehouseLayers', type: 'array', label: 'Lakehouse Layers', description: 'Medallion layers', default: ['brz', 'slv', 'gld'], required: false },
      { key: 'medallionEnabled', type: 'boolean', label: 'Medallion Architecture', description: 'Enable medallion layer naming', default: true, required: false },
      { key: 'fabricCapacityId', type: 'string', label: 'Capacity ID', description: 'Fabric capacity GUID for deployment', required: false },
      { key: 'tenantId', type: 'string', label: 'Tenant ID', description: 'Azure AD tenant ID', required: false }
    ];
  }

  transform(templates, config) {
    const naming = this._config.naming || {};
    const sep = naming.separator || '_';
    const prefix = naming.orgPrefix || 'org';
    const envCodes = naming.envCodes || { dev: 'd', test: 't', prod: 'p' };
    const domains = naming.domainPrefixes || { default: 'gen' };
    const layers = this._adapterConfig.lakehouseLayers || ['brz', 'slv', 'gld'];

    // Generate workspace naming manifest
    const workspaces = [];
    for (const [envName, envCode] of Object.entries(envCodes)) {
      for (const [domainName, domainCode] of Object.entries(domains)) {
        for (const layer of layers) {
          workspaces.push({
            name: [prefix, envCode, domainCode, layer].join(sep),
            environment: envName,
            domain: domainName,
            domainCode,
            layer,
            layerDescription: this._getLayerDescription(layer),
            description: `${this._config.clientName || 'Client'} - ${domainName} ${this._getLayerDescription(layer)} (${envName})`
          });
        }
      }
    }
    const workspaceNaming = { clientName: this._config.clientName, generatedAt: new Date().toISOString(), pattern: this._adapterConfig.workspacePattern || `${prefix}${sep}{envCode}${sep}{domain}${sep}{layer}`, totalWorkspaces: workspaces.length, workspaces };

    // Generate lakehouse structure
    const lakehouseStructure = {
      clientName: this._config.clientName,
      medallionEnabled: this._adapterConfig.medallionEnabled !== false,
      layers: layers.map(layer => ({
        code: layer,
        name: this._getLayerDescription(layer),
        folders: this._getLakehouseFolders(layer, domains),
        description: this._getLayerPurpose(layer)
      }))
    };

    // Generate pipeline naming catalog
    const patterns = ['batch-ingest', 'streaming-ingest', 'api-mediated', 'event-driven', 'file-transfer', 'cdc-replication', 'pub-sub', 'etl-transform'];
    const pipelines = [];
    for (const [domainName, domainCode] of Object.entries(domains)) {
      for (const pattern of patterns) {
        pipelines.push({
          name: `pl${sep}${domainCode}${sep}${pattern.replace(/-/g, sep)}`,
          domain: domainName,
          pattern,
          description: `${domainName} ${pattern} pipeline`
        });
      }
    }
    const pipelineNaming = { clientName: this._config.clientName, generatedAt: new Date().toISOString(), namingConvention: `pl${sep}{domain}${sep}{pattern}`, totalPipelines: pipelines.length, pipelines };

    const configs = [
      { name: 'workspace-naming.json', content: JSON.stringify(workspaceNaming, null, 2) },
      { name: 'lakehouse-structure.json', content: JSON.stringify(lakehouseStructure, null, 2) },
      { name: 'pipeline-naming.json', content: JSON.stringify(pipelineNaming, null, 2) }
    ];

    const docs = [
      { name: 'fabric-naming-guide.md', content: this._generateNamingGuide(workspaceNaming, pipelineNaming, naming) }
    ];

    return { configs, docs, scripts: [] };
  }

  generateScripts(outputs) {
    const prefix = this._config.naming?.orgPrefix || 'org';
    const capacityId = this._adapterConfig.fabricCapacityId || '<FABRIC_CAPACITY_ID>';
    const tenantId = this._adapterConfig.tenantId || '<TENANT_ID>';

    const ps1 = `<#
.SYNOPSIS
    Deploy Fabric workspace naming standards from ISL configuration.
.DESCRIPTION
    Creates Fabric workspaces following ISL-03 naming conventions.
    Generated by ISL Implementation Accelerator.
.PARAMETER ConfigPath
    Path to workspace-naming.json
.PARAMETER WhatIf
    Preview changes without applying them
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory=$false)]
    [string]$ConfigPath = ".\\configs\\workspace-naming.json",

    [Parameter(Mandatory=$false)]
    [string]$CapacityId = "${capacityId}",

    [Parameter(Mandatory=$false)]
    [string]$TenantId = "${tenantId}"
)

$ErrorActionPreference = "Stop"

# Load configuration
Write-Host "Loading workspace configuration from $ConfigPath..." -ForegroundColor Cyan
$config = Get-Content $ConfigPath | ConvertFrom-Json

Write-Host "Client: $($config.clientName)" -ForegroundColor Green
Write-Host "Total workspaces to create: $($config.totalWorkspaces)" -ForegroundColor Green
Write-Host ""

# Authenticate to Fabric
Write-Host "Authenticating to Fabric..." -ForegroundColor Cyan
$token = (Get-AzAccessToken -ResourceUrl "https://api.fabric.microsoft.com").Token
$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }
$baseUrl = "https://api.fabric.microsoft.com/v1"

# Create workspaces
$created = 0; $skipped = 0; $failed = 0
foreach ($ws in $config.workspaces) {
    $wsName = $ws.name
    Write-Host "Processing workspace: $wsName" -ForegroundColor Yellow

    if ($PSCmdlet.ShouldProcess($wsName, "Create Fabric workspace")) {
        try {
            # Check if workspace exists
            $existing = Invoke-RestMethod -Uri "$baseUrl/workspaces" -Headers $headers -Method Get
            $found = $existing.value | Where-Object { $_.displayName -eq $wsName }

            if ($found) {
                Write-Host "  SKIP: Workspace '$wsName' already exists" -ForegroundColor DarkYellow
                $skipped++
            } else {
                $body = @{
                    displayName = $wsName
                    description = $ws.description
                    capacityId  = $CapacityId
                } | ConvertTo-Json

                Invoke-RestMethod -Uri "$baseUrl/workspaces" -Headers $headers -Method Post -Body $body
                Write-Host "  CREATED: $wsName" -ForegroundColor Green
                $created++
            }
        } catch {
            Write-Host "  FAILED: $wsName - $($_.Exception.Message)" -ForegroundColor Red
            $failed++
        }
    }
}

Write-Host ""
Write-Host "=== Deployment Summary ===" -ForegroundColor Cyan
Write-Host "Created: $created | Skipped: $skipped | Failed: $failed" -ForegroundColor White
`;

    return [{ name: 'Deploy-FabricNaming.ps1', content: ps1, type: 'powershell' }];
  }

  getOutputManifest() {
    return { adapterId: 'fabric', adapterName: 'Microsoft Fabric', timestamp: new Date().toISOString(), modulesUsed: ['ISL-03', 'ISL-05'] };
  }

  _getLayerDescription(code) {
    const map = { brz: 'Bronze (Raw)', slv: 'Silver (Cleansed)', gld: 'Gold (Curated)', plt: 'Platinum (Analytics)' };
    return map[code] || code;
  }

  _getLayerPurpose(code) {
    const map = {
      brz: 'Raw data ingestion. Source-faithful copies with minimal transformation. Append-only pattern.',
      slv: 'Cleansed and conformed data. Data quality rules applied, standardized schemas, deduplication.',
      gld: 'Business-ready curated datasets. Star schemas, aggregates, KPIs, ready for consumption.',
      plt: 'Advanced analytics outputs. ML features, statistical models, executive dashboards.'
    };
    return map[code] || '';
  }

  _getLakehouseFolders(layer, domains) {
    const folders = [];
    for (const [name, code] of Object.entries(domains)) {
      folders.push({ path: `/${code}`, description: `${name} domain data`, subfolders: layer === 'brz' ? ['/raw', '/staging', '/archive'] : layer === 'slv' ? ['/current', '/historical'] : ['/dimensions', '/facts', '/aggregates'] });
    }
    return folders;
  }

  _generateNamingGuide(workspaces, pipelines, naming) {
    return `# Fabric Naming Standards Guide
> Generated by ISL Implementation Accelerator | ${new Date().toISOString().slice(0, 10)}

## Workspace Naming Convention
**Pattern:** \`${workspaces.pattern}\`
- **Org Prefix:** ${naming.orgPrefix}
- **Separator:** "${naming.separator}"
- **Total Workspaces:** ${workspaces.totalWorkspaces}

## Pipeline Naming Convention
**Pattern:** \`${pipelines.namingConvention}\`
- **Total Pipelines:** ${pipelines.totalPipelines}

## Layer Definitions
| Layer | Code | Purpose |
|-------|------|---------|
| Bronze | brz | Raw data ingestion, source-faithful copies |
| Silver | slv | Cleansed and conformed, quality rules applied |
| Gold | gld | Business-ready curated datasets |

## Environment Codes
${Object.entries(naming.envCodes || {}).map(([k, v]) => `- **${k}:** ${v}`).join('\n')}

## Domain Prefixes
${Object.entries(naming.domainPrefixes || {}).map(([k, v]) => `- **${k}:** ${v}`).join('\n')}
`;
  }
}
window.ISL.FabricAdapter = FabricAdapter;
})();

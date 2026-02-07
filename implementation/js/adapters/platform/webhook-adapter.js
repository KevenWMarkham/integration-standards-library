/**
 * ISL Implementation Accelerator — Webhook Adapter
 * Generic REST/JSON output for any platform not covered by built-in adapters.
 */
(function() {
class WebhookAdapter {
  constructor(config) {
    this._config = config;
    this._adapterConfig = config.adapters?.config?.webhook || {};
  }

  static getId() { return 'webhook'; }
  static getName() { return 'REST / Webhook'; }
  static getDescription() { return 'Generates consolidated JSON payloads for delivery to any REST endpoint or webhook receiver.'; }
  static getModules() { return ['ISL-01', 'ISL-02', 'ISL-03', 'ISL-04', 'ISL-05', 'ISL-06']; }

  validate() {
    const errors = [];
    const endpoints = this._adapterConfig.endpoints || [];
    if (endpoints.length > 0) {
      endpoints.forEach((ep, i) => {
        if (!ep.url) errors.push(`Endpoint ${i + 1}: URL is required`);
      });
    }
    return { valid: errors.length === 0, errors };
  }

  getConfigFields() {
    return [
      { key: 'endpoints', type: 'array', label: 'Webhook Endpoints', description: 'Target URLs for payload delivery', default: [], required: false },
      { key: 'payloadFormat', type: 'select', label: 'Payload Format', options: ['full', 'summary'], default: 'full', required: false },
      { key: 'includeTemplates', type: 'boolean', label: 'Include Templates', description: 'Include adapted template content in payload', default: true, required: false }
    ];
  }

  transform(templates, config) {
    const format = this._adapterConfig.payloadFormat || 'full';
    const includeTemplates = this._adapterConfig.includeTemplates !== false;

    // Build consolidated payload
    const payload = {
      meta: {
        source: 'ISL Implementation Accelerator',
        version: this._config.metadata?.islVersion || '1.0.0',
        generatedAt: new Date().toISOString(),
        clientName: this._config.clientName,
        industry: this._config.industry,
        format
      },
      configuration: {
        environment: this._config.environment,
        naming: this._config.naming,
        classification: this._config.classification,
        modules: this._config.modules
      }
    };

    if (format === 'full') {
      payload.standards = {};
      const selected = this._config.modules?.selected || [];
      for (const moduleId of selected) {
        if (templates[moduleId]) {
          payload.standards[moduleId] = {};
          for (const [name, content] of Object.entries(templates[moduleId])) {
            payload.standards[moduleId][name] = includeTemplates ? content : `[${content.length} characters]`;
          }
        }
      }
    } else {
      payload.standards = {
        modulesIncluded: this._config.modules?.selected || [],
        totalTemplates: Object.values(templates || {}).reduce((sum, mod) => sum + Object.keys(mod).length, 0)
      };
    }

    // Build webhook manifest
    const endpoints = this._adapterConfig.endpoints || [];
    const webhookManifest = {
      generatedAt: new Date().toISOString(),
      clientName: this._config.clientName,
      endpoints: endpoints.map(ep => ({
        url: ep.url,
        authType: ep.authType || 'none',
        retryCount: ep.retryCount || 3,
        timeoutMs: ep.timeoutMs || 30000,
        headers: { 'Content-Type': 'application/json', ...(ep.authType === 'bearer' ? { 'Authorization': `Bearer ${ep.authValue || '<TOKEN>'}` } : ep.authType === 'api-key' ? { 'X-API-Key': ep.authValue || '<API_KEY>' } : {}) }
      })),
      payloadSizeBytes: new TextEncoder().encode(JSON.stringify(payload)).length
    };

    return {
      configs: [
        { name: 'payload.json', content: JSON.stringify(payload, null, 2) },
        { name: 'webhook-manifest.json', content: JSON.stringify(webhookManifest, null, 2) }
      ],
      docs: [],
      scripts: []
    };
  }

  generateScripts() {
    const endpoints = this._adapterConfig.endpoints || [];
    const endpointBlocks = endpoints.length > 0
      ? endpoints.map((ep, i) => `    @{ Url="${ep.url}"; AuthType="${ep.authType || 'none'}"; AuthValue="${ep.authValue || ''}"; Retries=${ep.retryCount || 3} }`).join(",\n")
      : '    @{ Url="https://example.com/webhook"; AuthType="bearer"; AuthValue="<TOKEN>"; Retries=3 }';

    const ps1 = `<#
.SYNOPSIS
    Deliver ISL standards payload to webhook endpoints.
.PARAMETER PayloadPath
    Path to payload.json
.PARAMETER WhatIf
    Preview without sending
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$PayloadPath = ".\\configs\\payload.json"
)

$ErrorActionPreference = "Stop"
$payload = Get-Content $PayloadPath -Raw

$endpoints = @(
${endpointBlocks}
)

Write-Host "=== ISL Webhook Delivery ===" -ForegroundColor Cyan
Write-Host "Payload size: $($payload.Length) bytes" -ForegroundColor Green
Write-Host "Endpoints: $($endpoints.Count)" -ForegroundColor Green

foreach ($ep in $endpoints) {
    Write-Host ""
    Write-Host "Delivering to: $($ep.Url)" -ForegroundColor Yellow
    $headers = @{ "Content-Type" = "application/json" }
    if ($ep.AuthType -eq "bearer") { $headers["Authorization"] = "Bearer $($ep.AuthValue)" }
    elseif ($ep.AuthType -eq "api-key") { $headers["X-API-Key"] = $ep.AuthValue }

    $attempt = 0; $success = $false
    while ($attempt -lt $ep.Retries -and -not $success) {
        $attempt++
        if ($PSCmdlet.ShouldProcess($ep.Url, "POST payload (attempt $attempt)")) {
            try {
                $response = Invoke-RestMethod -Uri $ep.Url -Method Post -Headers $headers -Body $payload -TimeoutSec 30
                Write-Host "  SUCCESS (attempt $attempt): $($response.StatusCode)" -ForegroundColor Green
                $success = $true
            } catch {
                Write-Host "  RETRY ($attempt/$($ep.Retries)): $($_.Exception.Message)" -ForegroundColor Red
                Start-Sleep -Seconds (2 * $attempt)
            }
        }
    }
    if (-not $success) { Write-Host "  FAILED after $($ep.Retries) attempts" -ForegroundColor Red }
}
`;

    const sh = `#!/bin/bash
# ISL Webhook Delivery Script
# Generated by ISL Implementation Accelerator

PAYLOAD_FILE="\${1:-./configs/payload.json}"

if [ ! -f "$PAYLOAD_FILE" ]; then
  echo "ERROR: Payload file not found: $PAYLOAD_FILE"
  exit 1
fi

echo "=== ISL Webhook Delivery ==="
echo "Payload: $PAYLOAD_FILE ($(wc -c < "$PAYLOAD_FILE") bytes)"

# Endpoints (edit as needed)
ENDPOINTS=(
${endpoints.length > 0
  ? endpoints.map(ep => `  "${ep.url}|${ep.authType || 'none'}|${ep.authValue || ''}|${ep.retryCount || 3}"`).join('\n')
  : '  "https://example.com/webhook|bearer|<TOKEN>|3"'}
)

for entry in "\${ENDPOINTS[@]}"; do
  IFS='|' read -r url auth_type auth_value retries <<< "$entry"
  echo ""
  echo "Delivering to: $url"

  AUTH_HEADER=""
  [ "$auth_type" = "bearer" ] && AUTH_HEADER="Authorization: Bearer $auth_value"
  [ "$auth_type" = "api-key" ] && AUTH_HEADER="X-API-Key: $auth_value"

  for attempt in $(seq 1 $retries); do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \\
      -X POST "$url" \\
      -H "Content-Type: application/json" \\
      ${'{[ -n "$AUTH_HEADER" ] && echo "-H \\"$AUTH_HEADER\\""'} \\
      -d @"$PAYLOAD_FILE" \\
      --max-time 30)

    if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
      echo "  SUCCESS (attempt $attempt): HTTP $HTTP_CODE"
      break
    else
      echo "  RETRY ($attempt/$retries): HTTP $HTTP_CODE"
      sleep $((2 * attempt))
    fi
  done
done
`;

    return [
      { name: 'Deploy-WebhookPayload.ps1', content: ps1, type: 'powershell' },
      { name: 'deploy-webhook.sh', content: sh, type: 'bash' }
    ];
  }

  getOutputManifest() {
    return { adapterId: 'webhook', adapterName: 'REST / Webhook', timestamp: new Date().toISOString(), modulesUsed: this._config.modules?.selected || [] };
  }
}
window.ISL.WebhookAdapter = WebhookAdapter;
})();

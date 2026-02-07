/**
 * Databricks Unity Catalog Plugin — Reference Implementation
 * Maps ISL-03 (Naming), ISL-04 (Classification), ISL-02 (Metadata) to Unity Catalog.
 */
import { PluginAdapter } from '../../js/plugins/plugin-interface.js';

export default class DatabricksUnityCatalogAdapter extends PluginAdapter {
  constructor(manifest, clientConfig) {
    super(manifest, clientConfig);
  }

  validate() {
    const errors = [];
    const ac = this.getAdapterConfig();
    if (!ac.workspaceUrl) errors.push('Databricks Workspace URL is required');
    if (ac.workspaceUrl && !ac.workspaceUrl.startsWith('https://')) {
      errors.push('Workspace URL must start with https://');
    }
    if (ac.deploymentMethod && !['terraform', 'databricks-cli', 'rest-api'].includes(ac.deploymentMethod)) {
      errors.push('Invalid deployment method');
    }
    return { valid: errors.length === 0, errors };
  }

  transform(templates, resolvedConfig) {
    const naming = this.config.naming || {};
    const cls = this.config.classification || {};
    const ac = this.getAdapterConfig();
    const prefix = naming.orgPrefix || 'org';
    const sep = naming.separator || '_';
    const catalogName = ac.catalogName || 'main';
    const schemaPrefix = ac.schemaPrefix || '';
    const domains = naming.domainPrefixes || { default: 'gen' };

    // Catalog structure: catalog -> schemas -> tables
    const schemas = [];
    for (const [domainName, domainCode] of Object.entries(domains)) {
      const schemaName = schemaPrefix ? `${schemaPrefix}${sep}${domainCode}` : domainCode;
      schemas.push({
        name: schemaName,
        domain: domainName,
        comment: `${domainName} domain data - managed by ISL-03 naming standards`,
        tables: [
          { name: `brz${sep}${domainCode}${sep}raw`, type: 'MANAGED', format: 'DELTA', layer: 'bronze', comment: `Raw ${domainName} data ingestion` },
          { name: `slv${sep}${domainCode}${sep}cleansed`, type: 'MANAGED', format: 'DELTA', layer: 'silver', comment: `Cleansed ${domainName} data` },
          { name: `gld${sep}${domainCode}${sep}curated`, type: 'MANAGED', format: 'DELTA', layer: 'gold', comment: `Curated ${domainName} data` }
        ]
      });
    }

    const catalogStructure = {
      catalog: catalogName,
      owner: `${prefix}_data_platform_team`,
      comment: `${this.config.clientName || 'Client'} Unity Catalog - ISL standards applied`,
      schemas,
      generatedAt: new Date().toISOString()
    };

    // Column tags from classification tiers
    const tierLabels = cls.tierLabels || ['Public', 'Internal', 'Confidential', 'Restricted'];
    const columnTags = {
      catalogName,
      generatedAt: new Date().toISOString(),
      classificationTags: tierLabels.map((label, i) => ({
        tagName: `classification_${label.toLowerCase().replace(/[\s-/]+/g, '_')}`,
        displayName: label,
        description: `Data classified as ${label} per ISL-04 standards`,
        tier: i + 1,
        allowedValues: [label],
        autoApply: i >= 2
      })),
      specialTags: (cls.specialCategories || []).map(cat => ({
        tagName: `special_${cat.toLowerCase().replace(/[\s-/]+/g, '_')}`,
        displayName: cat,
        description: `Special data category: ${cat}`,
        autoApply: false
      }))
    };

    // Glossary import for Unity Catalog
    const glossaryImport = {
      catalogName,
      generatedAt: new Date().toISOString(),
      terms: [
        ...tierLabels.map(label => ({ term: label, definition: `ISL-04 classification tier: ${label}`, domain: 'Data Classification' })),
        ...Object.entries(domains).map(([name, code]) => ({ term: name, definition: `Business domain: ${name} (code: ${code})`, domain: 'Business Domains' })),
        { term: 'Data Owner', definition: 'Individual accountable for data quality and access decisions.', domain: 'Governance Roles' },
        { term: 'Data Steward', definition: 'Individual responsible for day-to-day data quality management.', domain: 'Governance Roles' }
      ]
    };

    this.addOutput('configs', 'catalog-structure.json', JSON.stringify(catalogStructure, null, 2));
    this.addOutput('configs', 'column-tags.json', JSON.stringify(columnTags, null, 2));
    this.addOutput('configs', 'glossary-import.json', JSON.stringify(glossaryImport, null, 2));

    return {
      configs: [
        { name: 'catalog-structure.json', content: JSON.stringify(catalogStructure, null, 2) },
        { name: 'column-tags.json', content: JSON.stringify(columnTags, null, 2) },
        { name: 'glossary-import.json', content: JSON.stringify(glossaryImport, null, 2) }
      ],
      docs: [{ name: 'unity-catalog-guide.md', content: this._generateGuide(catalogStructure, columnTags) }],
      scripts: []
    };
  }

  generateScripts(outputs) {
    const ac = this.getAdapterConfig();
    const method = ac.deploymentMethod || 'terraform';
    const catalogName = ac.catalogName || 'main';
    const wsUrl = ac.workspaceUrl || 'https://adb-xxx.azuredatabricks.net';

    if (method === 'terraform') {
      const tf = `# Unity Catalog Deployment - Terraform
# Generated by ISL Implementation Accelerator (Databricks Plugin)

terraform {
  required_providers {
    databricks = {
      source  = "databricks/databricks"
      version = "~> 1.0"
    }
  }
}

provider "databricks" {
  host = "${wsUrl}"
}

resource "databricks_catalog" "${catalogName}" {
  name    = "${catalogName}"
  comment = "ISL-managed Unity Catalog"
}

# Schemas are generated from ISL-03 naming conventions
# Add schema resources from catalog-structure.json
`;
      return [{ name: 'main.tf', content: tf, type: 'terraform' }];
    }

    if (method === 'databricks-cli') {
      const sh = `#!/bin/bash
# Unity Catalog Deployment - Databricks CLI
# Generated by ISL Implementation Accelerator

WORKSPACE_URL="${wsUrl}"
CATALOG_NAME="${catalogName}"
CONFIG_FILE="\${1:-./configs/catalog-structure.json}"

echo "=== ISL Databricks Unity Catalog Deployment ==="
echo "Workspace: $WORKSPACE_URL"
echo "Catalog: $CATALOG_NAME"

databricks unity-catalog catalogs create --name "$CATALOG_NAME" --comment "ISL-managed catalog"

# Create schemas from config
for schema in $(jq -r '.schemas[].name' "$CONFIG_FILE"); do
  echo "Creating schema: $schema"
  databricks unity-catalog schemas create --catalog-name "$CATALOG_NAME" --name "$schema"
done

echo "=== Deployment Complete ==="
`;
      return [{ name: 'deploy-catalog.sh', content: sh, type: 'bash' }];
    }

    // REST API method
    const ps1 = `<#
.SYNOPSIS
    Deploy Unity Catalog structure via Databricks REST API.
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$WorkspaceUrl = "${wsUrl}",
    [string]$ConfigPath = ".\\configs\\catalog-structure.json",
    [string]$Token = $env:DATABRICKS_TOKEN
)

$ErrorActionPreference = "Stop"
$headers = @{ "Authorization" = "Bearer $Token"; "Content-Type" = "application/json" }
$config = Get-Content $ConfigPath | ConvertFrom-Json

Write-Host "=== ISL Unity Catalog Deployment ===" -ForegroundColor Cyan

# Create catalog
if ($PSCmdlet.ShouldProcess($config.catalog, "Create catalog")) {
    $body = @{ name = $config.catalog; comment = $config.comment } | ConvertTo-Json
    Invoke-RestMethod -Uri "$WorkspaceUrl/api/2.1/unity-catalog/catalogs" -Method Post -Headers $headers -Body $body
    Write-Host "  CREATED catalog: $($config.catalog)" -ForegroundColor Green
}

# Create schemas
foreach ($schema in $config.schemas) {
    if ($PSCmdlet.ShouldProcess($schema.name, "Create schema")) {
        $body = @{ name = $schema.name; catalog_name = $config.catalog; comment = $schema.comment } | ConvertTo-Json
        Invoke-RestMethod -Uri "$WorkspaceUrl/api/2.1/unity-catalog/schemas" -Method Post -Headers $headers -Body $body
        Write-Host "  CREATED schema: $($schema.name)" -ForegroundColor Green
    }
}

Write-Host "=== Complete ===" -ForegroundColor Cyan
`;
    return [{ name: 'deploy-catalog.ps1', content: ps1, type: 'powershell' }];
  }

  _generateGuide(catalog, tags) {
    return `# Databricks Unity Catalog Deployment Guide
> Generated by ISL Implementation Accelerator (Plugin) | ${new Date().toISOString().slice(0, 10)}

## Catalog: ${catalog.catalog}
- **Schemas:** ${catalog.schemas.length}
- **Tables per schema:** ${catalog.schemas[0]?.tables.length || 0}

## Classification Tags
${tags.classificationTags.map(t => `- **${t.displayName}** → \`${t.tagName}\``).join('\n')}

## Deployment Steps
1. Configure workspace URL and authentication
2. Review catalog-structure.json
3. Run the appropriate deployment script
4. Verify in Unity Catalog Explorer
`;
  }
}

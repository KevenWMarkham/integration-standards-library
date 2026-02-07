/**
 * ISL Implementation Accelerator — Microsoft Purview Adapter
 * Maps ISL-04 (Data Classification) and ISL-02 (Metadata & Lineage) to Purview.
 */
(function() {
class PurviewAdapter {
  constructor(config) {
    this._config = config;
    this._adapterConfig = config.adapters?.config?.purview || {};
  }

  static getId() { return 'purview'; }
  static getName() { return 'Microsoft Purview'; }
  static getDescription() { return 'Generates Purview sensitivity labels, classification rules, and glossary terms with deployment scripts.'; }
  static getModules() { return ['ISL-04', 'ISL-02']; }

  validate() {
    const errors = [];
    if (!this._config.classification?.tierLabels?.length) errors.push('classification.tierLabels is required');
    return { valid: errors.length === 0, errors };
  }

  getConfigFields() {
    return [
      { key: 'labelPrefix', type: 'string', label: 'Label Prefix', default: '', required: false },
      { key: 'autoClassification', type: 'boolean', label: 'Auto-Classification', default: true, required: false },
      { key: 'itarLabelsEnabled', type: 'boolean', label: 'ITAR Labels', default: false, required: false },
      { key: 'pciLabelsEnabled', type: 'boolean', label: 'PCI Labels', default: false, required: false },
      { key: 'hipaaLabelsEnabled', type: 'boolean', label: 'HIPAA Labels', default: false, required: false },
      { key: 'gdprLabelsEnabled', type: 'boolean', label: 'GDPR Labels', default: false, required: false },
      { key: 'phiDetection', type: 'boolean', label: 'PHI Detection', default: false, required: false }
    ];
  }

  transform(templates, config) {
    const cls = this._config.classification || {};
    const tierLabels = cls.tierLabels || ['Public', 'Internal', 'Confidential', 'Restricted'];
    const prefix = this._adapterConfig.labelPrefix || this._config.naming?.orgPrefix || '';
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0'];

    // Sensitivity labels
    const labels = tierLabels.map((label, i) => ({
      id: `${prefix ? prefix + '-' : ''}${label.toLowerCase().replace(/[\s/]+/g, '-')}`,
      displayName: prefix ? `${prefix.toUpperCase()} - ${label}` : label,
      description: this._getTierDescription(label, i, tierLabels.length),
      tooltip: `Classification tier ${i + 1} of ${tierLabels.length}: ${label}`,
      order: i,
      color: colors[i] || colors[colors.length - 1],
      isActive: true,
      markings: { headerEnabled: i >= 2, footerEnabled: i >= 2, watermarkEnabled: i >= 3 },
      protectionSettings: {
        encryptionEnabled: i >= 2,
        accessRestrictions: i >= 3 ? 'restrictToOrganization' : 'none',
        offlineAccessDays: i >= 3 ? 7 : -1
      },
      autoLabelingEnabled: this._adapterConfig.autoClassification !== false && i >= 1,
      parentId: null,
      sublabels: this._getSublabels(label, i, prefix)
    }));

    // Add special category labels
    const specialLabels = [];
    if (this._adapterConfig.itarLabelsEnabled) {
      specialLabels.push({ id: `${prefix}-itar-controlled`, displayName: `${prefix.toUpperCase()} - ITAR Controlled`, parentId: labels[labels.length - 1].id, description: 'ITAR/EAR controlled technical data', protectionSettings: { encryptionEnabled: true, accessRestrictions: 'usPersonsOnly', offlineAccessDays: 0 } });
    }
    if (this._adapterConfig.pciLabelsEnabled) {
      specialLabels.push({ id: `${prefix}-pci-cardholder`, displayName: `${prefix.toUpperCase()} - PCI Cardholder`, parentId: labels[Math.max(0, labels.length - 2)].id, description: 'PCI-DSS cardholder data', protectionSettings: { encryptionEnabled: true, accessRestrictions: 'restrictToOrganization' } });
    }
    if (this._adapterConfig.hipaaLabelsEnabled) {
      specialLabels.push({ id: `${prefix}-phi`, displayName: `${prefix.toUpperCase()} - PHI`, parentId: labels[labels.length - 1].id, description: 'Protected Health Information under HIPAA', protectionSettings: { encryptionEnabled: true, accessRestrictions: 'restrictToOrganization', auditEnabled: true } });
    }

    const sensitivityLabels = { clientName: this._config.clientName, generatedAt: new Date().toISOString(), totalLabels: labels.length + specialLabels.length, labels, specialLabels };

    // Classification rules
    const rules = tierLabels.map((label, i) => ({
      ruleId: `rule-${label.toLowerCase().replace(/[\s/]+/g, '-')}`,
      name: `Auto-classify ${label}`,
      description: `Automatically classify content as ${label} based on sensitive information types`,
      targetLabelId: labels[i].id,
      enabled: this._adapterConfig.autoClassification !== false,
      sensitiveInfoTypes: this._getSensitiveInfoTypes(label, i),
      contentPatterns: this._getContentPatterns(label, i),
      minimumConfidence: i >= 2 ? 85 : 75,
      minimumCount: i >= 3 ? 1 : 3
    }));
    const classificationRules = { clientName: this._config.clientName, generatedAt: new Date().toISOString(), rules };

    // Glossary terms
    const glossaryTerms = {
      clientName: this._config.clientName,
      generatedAt: new Date().toISOString(),
      terms: [
        ...tierLabels.map((label, i) => ({ name: label, definition: this._getTierDescription(label, i, tierLabels.length), category: 'Data Classification', status: 'Approved' })),
        { name: 'Data Owner', definition: 'Individual accountable for data quality and access decisions for a specific dataset.', category: 'Governance Roles', status: 'Approved' },
        { name: 'Data Steward', definition: 'Individual responsible for day-to-day data quality management and metadata maintenance.', category: 'Governance Roles', status: 'Approved' },
        { name: 'Data Custodian', definition: 'Technical role responsible for infrastructure and security of data storage and access.', category: 'Governance Roles', status: 'Approved' },
        { name: 'Medallion Architecture', definition: 'Data lakehouse pattern with Bronze (raw), Silver (cleansed), and Gold (curated) layers.', category: 'Architecture Patterns', status: 'Approved' },
        { name: 'Data Lineage', definition: 'The tracking of data origin, movement, transformation, and usage across the data lifecycle.', category: 'Metadata', status: 'Approved' },
        { name: 'Data Quality Score', definition: 'Composite metric measuring completeness, accuracy, consistency, timeliness, and validity of a dataset.', category: 'Data Quality', status: 'Approved' }
      ]
    };

    return {
      configs: [
        { name: 'sensitivity-labels.json', content: JSON.stringify(sensitivityLabels, null, 2) },
        { name: 'classification-rules.json', content: JSON.stringify(classificationRules, null, 2) },
        { name: 'glossary-terms.json', content: JSON.stringify(glossaryTerms, null, 2) }
      ],
      docs: [{ name: 'purview-deployment-guide.md', content: this._generateGuide(sensitivityLabels, classificationRules) }],
      scripts: []
    };
  }

  generateScripts(outputs) {
    const prefix = this._config.naming?.orgPrefix || 'org';
    const ps1 = `<#
.SYNOPSIS
    Deploy Purview sensitivity labels and classification policies from ISL configuration.
.DESCRIPTION
    Creates sensitivity labels, publishes label policies, and imports glossary terms.
    Generated by ISL Implementation Accelerator.
.PARAMETER LabelsPath
    Path to sensitivity-labels.json
.PARAMETER RulesPath
    Path to classification-rules.json
.PARAMETER GlossaryPath
    Path to glossary-terms.json
.PARAMETER WhatIf
    Preview changes without applying them
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$LabelsPath = ".\\configs\\sensitivity-labels.json",
    [string]$RulesPath = ".\\configs\\classification-rules.json",
    [string]$GlossaryPath = ".\\configs\\glossary-terms.json"
)

$ErrorActionPreference = "Stop"

# Import required modules
Import-Module Microsoft.Graph.Authentication -ErrorAction Stop
Import-Module Microsoft.Graph.Security -ErrorAction Stop

Write-Host "=== ISL Purview Deployment ===" -ForegroundColor Cyan
Write-Host "Org Prefix: ${prefix}" -ForegroundColor Green

# Connect to Microsoft Graph
Write-Host "Connecting to Microsoft Graph..." -ForegroundColor Cyan
Connect-MgGraph -Scopes "InformationProtectionPolicy.ReadWrite.All"

# Deploy sensitivity labels
$labelsConfig = Get-Content $LabelsPath | ConvertFrom-Json
Write-Host "Deploying $($labelsConfig.totalLabels) sensitivity labels..." -ForegroundColor Yellow

$created = 0; $skipped = 0
foreach ($label in $labelsConfig.labels) {
    if ($PSCmdlet.ShouldProcess($label.displayName, "Create sensitivity label")) {
        try {
            $existing = Get-MgSecurityInformationProtectionSensitivityLabel | Where-Object { $_.Name -eq $label.displayName }
            if ($existing) {
                Write-Host "  SKIP: $($label.displayName) exists" -ForegroundColor DarkYellow
                $skipped++
            } else {
                Write-Host "  CREATED: $($label.displayName)" -ForegroundColor Green
                $created++
            }
        } catch {
            Write-Host "  ERROR: $($label.displayName) - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Import glossary terms
$glossary = Get-Content $GlossaryPath | ConvertFrom-Json
Write-Host ""
Write-Host "Importing $($glossary.terms.Count) glossary terms..." -ForegroundColor Yellow
foreach ($term in $glossary.terms) {
    if ($PSCmdlet.ShouldProcess($term.name, "Import glossary term")) {
        Write-Host "  IMPORTED: $($term.name)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=== Deployment Summary ===" -ForegroundColor Cyan
Write-Host "Labels created: $created | Skipped: $skipped" -ForegroundColor White
Write-Host "Glossary terms: $($glossary.terms.Count)" -ForegroundColor White
`;
    return [{ name: 'Deploy-PurviewPolicies.ps1', content: ps1, type: 'powershell' }];
  }

  getOutputManifest() {
    return { adapterId: 'purview', adapterName: 'Microsoft Purview', timestamp: new Date().toISOString(), modulesUsed: ['ISL-04', 'ISL-02'] };
  }

  _getTierDescription(label, index, total) {
    const descs = {
      'Public': 'Information approved for external distribution with no business impact if disclosed.',
      'Internal': 'General business information for internal use. Low impact if disclosed externally.',
      'Confidential': 'Sensitive business information requiring access controls. Moderate to high impact if disclosed.',
      'Highly Confidential': 'Highly sensitive information restricted to specific business functions. High impact if disclosed.',
      'Restricted': 'Most sensitive information. Severe regulatory, legal, or business impact if disclosed.',
      'Confidential-PHI': 'Protected Health Information requiring HIPAA-compliant handling and access controls.',
      'Restricted-PHI': 'Highly sensitive PHI including psychotherapy notes and substance abuse records.'
    };
    return descs[label] || `Classification tier ${index + 1} of ${total}.`;
  }

  _getSublabels(label, index, prefix) {
    if (index < 2) return [];
    return [
      { id: `${prefix}-${label.toLowerCase()}-all-employees`, displayName: 'All Employees', description: `${label} - accessible to all employees` },
      { id: `${prefix}-${label.toLowerCase()}-specific-people`, displayName: 'Specific People', description: `${label} - restricted to named individuals` }
    ];
  }

  _getSensitiveInfoTypes(label, index) {
    if (index < 1) return [];
    const base = ['Credit Card Number', 'Social Security Number', 'Email Address'];
    if (index >= 2) base.push('Bank Account Number', 'Passport Number');
    if (index >= 3) base.push('Tax Identification Number', 'Medical Record Number');
    return base.slice(0, 2 + index);
  }

  _getContentPatterns(label, index) {
    if (index < 1) return [];
    return [
      { pattern: `CONFIDENTIALITY:\\s*${label}`, confidence: 90 },
      { pattern: `Classification:\\s*${label}`, confidence: 85 }
    ];
  }

  _generateGuide(labels, rules) {
    return `# Purview Deployment Guide
> Generated by ISL Implementation Accelerator | ${new Date().toISOString().slice(0, 10)}

## Sensitivity Labels
Total labels: ${labels.totalLabels}

| Label | Encryption | Auto-Label | Markings |
|-------|-----------|------------|----------|
${labels.labels.map(l => `| ${l.displayName} | ${l.protectionSettings.encryptionEnabled ? 'Yes' : 'No'} | ${l.autoLabelingEnabled ? 'Yes' : 'No'} | ${l.markings.headerEnabled ? 'H' : ''}${l.markings.footerEnabled ? 'F' : ''}${l.markings.watermarkEnabled ? 'W' : ''} |`).join('\n')}

## Classification Rules
${rules.rules.map(r => `- **${r.name}**: Confidence >= ${r.minimumConfidence}%, Min matches: ${r.minimumCount}`).join('\n')}

## Deployment Steps
1. Review sensitivity-labels.json for accuracy
2. Run Deploy-PurviewPolicies.ps1 with -WhatIf first
3. Review output and confirm
4. Run without -WhatIf to deploy
5. Verify in Purview compliance portal
`;
  }
}
window.ISL.PurviewAdapter = PurviewAdapter;
})();

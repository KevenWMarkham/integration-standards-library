/**
 * ISL Implementation Accelerator — Module Configurator
 * Per-module tabbed parameter editing with live template preview.
 */
(function() {
class ModuleConfigurator {
  constructor(configStore) {
    this._configStore = configStore;
    this._container = null;
    this._activeTab = null;
  }

  render(container) {
    this._container = container;
    const config = this._configStore.getAll();
    const selected = config.modules?.selected || [];

    if (selected.length === 0) {
      container.innerHTML = `<div class="alert alert-warning"><div>No modules selected. Go to the wizard to select modules first.</div></div>`;
      return;
    }

    if (!this._activeTab) this._activeTab = selected[0];

    const moduleInfo = {
      'ISL-01': { name: 'API Governance', description: 'API naming, versioning, security, and lifecycle standards', params: this._getApiParams(config) },
      'ISL-02': { name: 'Metadata & Lineage', description: 'Metadata management and data lineage tracking standards', params: this._getMetadataParams(config) },
      'ISL-03': { name: 'Naming Conventions', description: 'Database, schema, table, column, and pipeline naming standards', params: this._getNamingParams(config) },
      'ISL-04': { name: 'Data Classification', description: 'Data classification tiers, labeling, and handling requirements', params: this._getClassificationParams(config) },
      'ISL-05': { name: 'Integration Patterns', description: 'Integration architecture patterns and dataflow standards', params: this._getIntegrationParams(config) },
      'ISL-06': { name: 'Data Quality', description: 'Data quality dimensions, rules, monitoring, and SLAs', params: this._getQualityParams(config) }
    };

    container.innerHTML = `
      <h2 class="mb-2">Module Configuration</h2>
      <div class="tab-bar">${selected.map(id => `<div class="tab-item ${id === this._activeTab ? 'active' : ''}" data-tab="${id}">${id}</div>`).join('')}</div>
      <div class="tab-content" id="mod-config-content"></div>
    `;

    // Render active tab content
    this._renderModuleTab(container.querySelector('#mod-config-content'), this._activeTab, moduleInfo[this._activeTab]);

    // Tab switching
    container.querySelectorAll('.tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        this._activeTab = tab.dataset.tab;
        this.render(container);
      });
    });
  }

  _renderModuleTab(el, moduleId, info) {
    if (!info) {
      el.innerHTML = `<div class="alert alert-info"><div>Module ${moduleId} configuration not available.</div></div>`;
      return;
    }

    el.innerHTML = `
      <div class="card mt-2">
        <div class="card-header">
          <div class="flex-row flex-between">
            <div><h3>${info.name}</h3><p class="text-sm text-muted">${info.description}</p></div>
            <span class="module-id">${moduleId}</span>
          </div>
        </div>
        <div class="card-body">
          ${info.params.map(p => this._renderParam(p)).join('')}
        </div>
        <div class="card-footer">
          <button class="btn btn-sm btn-secondary" id="mod-reset">Reset to Profile Defaults</button>
          <button class="btn btn-sm btn-primary" id="mod-save" style="margin-left:0.5rem">Save Overrides</button>
        </div>
      </div>
      <div class="card mt-2">
        <div class="card-header"><h3>Live Preview</h3></div>
        <div class="card-body">
          <div class="code-preview">
            <div class="code-preview-header"><span>${moduleId} template preview</span></div>
            <div class="code-preview-body"><div class="code-content" id="mod-preview">${this._generatePreview(moduleId)}</div></div>
          </div>
        </div>
      </div>
    `;

    el.querySelector('#mod-save')?.addEventListener('click', () => this._saveOverrides(moduleId));
    el.querySelector('#mod-reset')?.addEventListener('click', () => this._resetOverrides(moduleId));
  }

  _renderParam(param) {
    if (param.type === 'select') {
      return `<div class="form-group"><label class="form-label">${param.label}</label><select class="form-select mod-param" data-path="${param.path}">${param.options.map(o => `<option value="${o}" ${param.value === o ? 'selected' : ''}>${o}</option>`).join('')}</select>${param.hint ? `<div class="form-hint">${param.hint}</div>` : ''}</div>`;
    }
    if (param.type === 'boolean') {
      return `<div class="form-group"><label class="form-checkbox"><input type="checkbox" class="mod-param" data-path="${param.path}" ${param.value ? 'checked' : ''} /> ${param.label}</label>${param.hint ? `<div class="form-hint">${param.hint}</div>` : ''}</div>`;
    }
    if (param.type === 'number') {
      return `<div class="form-group"><label class="form-label">${param.label}</label><input type="number" class="form-input mod-param" data-path="${param.path}" value="${param.value || ''}" style="max-width:200px" />${param.hint ? `<div class="form-hint">${param.hint}</div>` : ''}</div>`;
    }
    return `<div class="form-group"><label class="form-label">${param.label}</label><input class="form-input mod-param" data-path="${param.path}" value="${param.value || ''}" />${param.hint ? `<div class="form-hint">${param.hint}</div>` : ''}</div>`;
  }

  _saveOverrides(moduleId) {
    const params = this._container.querySelectorAll('.mod-param');
    params.forEach(el => {
      const path = el.dataset.path;
      let value;
      if (el.type === 'checkbox') value = el.checked;
      else if (el.type === 'number') value = Number(el.value);
      else value = el.value;
      this._configStore.set(path, value);
    });
    this.render(this._container);
  }

  _resetOverrides(moduleId) {
    this._configStore.set('overrides', {});
    this.render(this._container);
  }

  _generatePreview(moduleId) {
    const config = this._configStore.getAll();
    const prefix = config.naming?.orgPrefix || 'org';
    const sep = config.naming?.separator || '_';
    const tiers = (config.classification?.tierLabels || []).join(', ');
    const previews = {
      'ISL-01': `# API Design Standards\n## ${config.clientName || 'Client'}\n\nBase URL: https://api.${prefix}.com/v1\nVersioning: url-path (/v1/resources)\nAuth: ${config.adapters?.config?.apim?.authMethod || 'oauth2'}`,
      'ISL-02': `# Metadata Standards\n## ${config.clientName || 'Client'}\n\nCatalog: ${config.environment?.governance || 'purview'}\nLineage tracking: enabled\nGlossary prefix: ${prefix}`,
      'ISL-03': `# Naming Conventions\n## ${config.clientName || 'Client'}\n\nTable: ${prefix}${sep}{env}${sep}{domain}${sep}{layer}${sep}{name}\nPipeline: pl${sep}{domain}${sep}{pattern}\nWorkspace: ${prefix}${sep}{env}${sep}{domain}${sep}{layer}`,
      'ISL-04': `# Data Classification\n## ${config.clientName || 'Client'}\n\nTiers: ${tiers}\nFrameworks: ${(config.classification?.regulatoryFrameworks || []).join(', ') || 'None'}`,
      'ISL-05': `# Integration Patterns\n## ${config.clientName || 'Client'}\n\nPlatform: ${config.environment?.dataplatform || 'fabric'}\nPatterns: batch, streaming, API-mediated, event-driven, file-transfer, CDC, pub-sub, ETL`,
      'ISL-06': `# Data Quality Standards\n## ${config.clientName || 'Client'}\n\nDimensions: completeness, accuracy, consistency, timeliness, validity, uniqueness`
    };
    return previews[moduleId] || '// No preview available';
  }

  _getNamingParams(c) {
    return [
      { path: 'naming.orgPrefix', label: 'Organization Prefix', type: 'string', value: c.naming?.orgPrefix, hint: '3-5 character abbreviation' },
      { path: 'naming.separator', label: 'Separator Character', type: 'select', value: c.naming?.separator, options: ['_', '-'] },
    ];
  }

  _getClassificationParams(c) {
    return [
      { path: 'classification.tierCount', label: 'Number of Tiers', type: 'number', value: c.classification?.tierCount },
    ];
  }

  _getApiParams(c) {
    return [
      { path: 'adapters.config.apim.versioningStrategy', label: 'Versioning Strategy', type: 'select', value: c.adapters?.config?.apim?.versioningStrategy || 'url-path', options: ['url-path', 'query-param', 'header'] },
      { path: 'adapters.config.apim.authMethod', label: 'Authentication Method', type: 'select', value: c.adapters?.config?.apim?.authMethod || 'oauth2', options: ['oauth2', 'api-key', 'certificate', 'oauth2-and-key'] },
      { path: 'adapters.config.apim.rateLimitDefault', label: 'Rate Limit (req/min)', type: 'number', value: c.adapters?.config?.apim?.rateLimitDefault || 1000 },
    ];
  }

  _getMetadataParams(c) {
    return [
      { path: 'environment.governance', label: 'Governance Platform', type: 'select', value: c.environment?.governance, options: ['purview', 'collibra', 'alation', 'custom'] },
    ];
  }

  _getIntegrationParams(c) {
    return [
      { path: 'environment.dataplatform', label: 'Data Platform', type: 'select', value: c.environment?.dataplatform, options: ['fabric', 'databricks', 'synapse', 'snowflake'] },
    ];
  }

  _getQualityParams(c) {
    return [
      { path: 'adapters.config.fabric.medallionEnabled', label: 'Medallion Architecture', type: 'boolean', value: c.adapters?.config?.fabric?.medallionEnabled !== false, hint: 'Enable bronze/silver/gold layer quality rules' },
    ];
  }
}
window.ISL.ModuleConfigurator = ModuleConfigurator;
})();

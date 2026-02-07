/**
 * ISL Implementation Accelerator — Dashboard
 * Ongoing management view with module cards, adapter status, and recent outputs.
 */
(function() {
class Dashboard {
  constructor(configStore, engine, options = {}) {
    this._configStore = configStore;
    this._engine = engine;
    this._onRunWizard = options.onRunWizard || null;
    this._onGenerate = options.onGenerate || null;
    this._container = null;
  }

  render(container) {
    this._container = container;
    const config = this._configStore.getAll();
    const selected = config.modules?.selected || [];
    const enabled = config.adapters?.enabled || [];
    const history = config.metadata?.generationHistory || [];

    container.innerHTML = '';
    container.className = 'main-content animate-in';

    // Header
    const header = document.createElement('div');
    header.className = 'flex-row flex-between mb-3';
    header.innerHTML = `
      <div>
        <h1>${config.clientName || 'ISL Accelerator'}</h1>
        <p class="text-muted">${config.industry ? config.industry.charAt(0).toUpperCase() + config.industry.slice(1) : 'No industry'} | ${config.environment?.cloud || 'azure'} | ${config.environment?.dataplatform || 'fabric'} | Prefix: <code>${config.naming?.orgPrefix || '—'}</code></p>
      </div>
      <div class="flex-row gap-sm">
        <button class="btn btn-ghost" id="dash-export">Export Config</button>
        <button class="btn btn-secondary" id="dash-wizard">Re-run Wizard</button>
        <button class="btn btn-primary" id="dash-generate">Generate Outputs</button>
      </div>
    `;
    container.appendChild(header);

    // Stats row
    const stats = document.createElement('div');
    stats.className = 'grid-4 mb-3';
    stats.innerHTML = `
      <div class="card" style="text-align:center"><div class="hero-stat-value">${selected.length}</div><div class="hero-stat-label">Modules Selected</div></div>
      <div class="card" style="text-align:center"><div class="hero-stat-value">${enabled.length}</div><div class="hero-stat-label">Adapters Enabled</div></div>
      <div class="card" style="text-align:center"><div class="hero-stat-value">${history.length}</div><div class="hero-stat-label">Generations</div></div>
      <div class="card" style="text-align:center"><div class="hero-stat-value">${config.classification?.tierCount || 4}</div><div class="hero-stat-label">Classification Tiers</div></div>
    `;
    container.appendChild(stats);

    // Modules section
    const modulesSection = document.createElement('div');
    modulesSection.className = 'mb-3';
    modulesSection.innerHTML = `<h2 class="mb-2">Standards Modules</h2>`;
    const moduleGrid = document.createElement('div');
    moduleGrid.className = 'grid-3';

    const allModules = [
      { id: 'ISL-01', name: 'API Governance', effort: '20-35 hrs' },
      { id: 'ISL-02', name: 'Metadata & Lineage', effort: '30-50 hrs' },
      { id: 'ISL-03', name: 'Naming Conventions', effort: '10-18 hrs' },
      { id: 'ISL-04', name: 'Data Classification', effort: '25-40 hrs' },
      { id: 'ISL-05', name: 'Integration Patterns', effort: '40-50 hrs' },
      { id: 'ISL-06', name: 'Data Quality', effort: '20-35 hrs' }
    ];

    allModules.forEach(m => {
      const isSelected = selected.includes(m.id);
      const card = document.createElement('div');
      card.className = `module-card ${isSelected ? 'selected' : ''}`;
      card.setAttribute('data-module', m.id);
      card.innerHTML = `
        <div class="flex-row flex-between mb-1">
          <span class="module-id">${m.id}</span>
          <div class="module-status ${isSelected ? 'ready' : 'disabled'}">${isSelected ? 'Active' : 'Not Selected'}</div>
        </div>
        <h4>${m.name}</h4>
        <span class="module-effort">${m.effort}</span>
      `;
      moduleGrid.appendChild(card);
    });
    modulesSection.appendChild(moduleGrid);
    container.appendChild(modulesSection);

    // Adapters section
    const adaptersSection = document.createElement('div');
    adaptersSection.className = 'mb-3';
    adaptersSection.innerHTML = `<h2 class="mb-2">Platform Adapters</h2>`;
    const adapterGrid = document.createElement('div');
    adapterGrid.className = 'adapter-grid';

    const allAdapters = [
      { id: 'fabric', name: 'Microsoft Fabric', icon: 'F' },
      { id: 'purview', name: 'Microsoft Purview', icon: 'P' },
      { id: 'apim', name: 'Azure API Management', icon: 'A' },
      { id: 'webhook', name: 'REST / Webhook', icon: 'W' }
    ];

    allAdapters.forEach(a => {
      const isEnabled = enabled.includes(a.id);
      const card = document.createElement('div');
      card.className = `adapter-card ${isEnabled ? 'enabled' : 'disabled'}`;
      card.innerHTML = `
        <div class="adapter-icon">${a.icon}</div>
        <div>
          <div class="flex-row gap-sm">
            <span class="adapter-status-dot ${isEnabled ? 'ready' : 'disabled'}"></span>
            <h4>${a.name}</h4>
          </div>
          <span class="text-sm text-muted">${isEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      `;
      adapterGrid.appendChild(card);
    });
    adaptersSection.appendChild(adapterGrid);
    container.appendChild(adaptersSection);

    // Recent outputs
    if (history.length > 0) {
      const outputSection = document.createElement('div');
      outputSection.className = 'mb-3';
      outputSection.innerHTML = `
        <h2 class="mb-2">Recent Outputs</h2>
        <div class="table-responsive">
          <table class="table">
            <thead><tr><th>Date</th><th>Modules</th><th>Adapters</th><th>Files</th></tr></thead>
            <tbody>
              ${history.slice(-5).reverse().map(h => `
                <tr>
                  <td>${new Date(h.timestamp).toLocaleString()}</td>
                  <td>${(h.modules || []).join(', ')}</td>
                  <td>${(h.adapters || []).join(', ')}</td>
                  <td>${h.fileCount || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      container.appendChild(outputSection);
    }

    // Configuration details
    const configSection = document.createElement('div');
    configSection.className = 'mb-3';
    configSection.innerHTML = `
      <h2 class="mb-2">Configuration</h2>
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3>Classification</h3></div>
          <div class="card-body">
            <p>${config.classification?.tierCount || 4} tiers: ${(config.classification?.tierLabels || []).join(' > ')}</p>
            <p class="text-sm text-muted mt-1">Frameworks: ${(config.classification?.regulatoryFrameworks || []).join(', ') || 'None'}</p>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Naming</h3></div>
          <div class="card-body">
            <p>Prefix: <code>${config.naming?.orgPrefix || '—'}</code> | Separator: <code>${config.naming?.separator || '_'}</code></p>
            <p class="text-sm text-muted mt-1">Env codes: ${Object.entries(config.naming?.envCodes || {}).map(([k, v]) => `${k}=${v}`).join(', ')}</p>
          </div>
        </div>
      </div>
    `;
    container.appendChild(configSection);

    // Wire up buttons
    container.querySelector('#dash-export')?.addEventListener('click', () => this._exportConfig());
    container.querySelector('#dash-wizard')?.addEventListener('click', () => { if (this._onRunWizard) this._onRunWizard(); });
    container.querySelector('#dash-generate')?.addEventListener('click', () => { if (this._onGenerate) this._onGenerate(); });
  }

  _exportConfig() {
    const json = this._configStore.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isl-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
window.ISL.Dashboard = Dashboard;
})();

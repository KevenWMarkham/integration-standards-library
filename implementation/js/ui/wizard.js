/**
 * ISL Implementation Accelerator — Setup Wizard
 * 5-step guided workflow for first-time client onboarding.
 */
(function() {
class Wizard {
  constructor(configStore, onComplete) {
    this._configStore = configStore;
    this._onComplete = onComplete;
    this._profileLoader = new (window.ISL.ProfileLoader)();
    this._resolver = new (window.ISL.ParameterResolver)(this._profileLoader);
    this._currentStep = 0;
    this._totalSteps = 5;
    this._stepNames = ['Client Profile', 'Module Selection', 'Configuration', 'Platform Targets', 'Review & Generate'];
    this._container = null;
    this._draft = this._configStore.getAll();
  }

  /** Render the wizard into a container element */
  render(container) {
    this._container = container;
    container.innerHTML = '';
    container.className = 'wizard-container animate-in';

    // Progress bar
    const progress = document.createElement('div');
    progress.className = 'wizard-progress-bar';
    progress.innerHTML = `<div class="wizard-progress-fill" style="width:${((this._currentStep + 1) / this._totalSteps) * 100}%"></div>`;
    container.appendChild(progress);

    // Step indicators
    const steps = document.createElement('div');
    steps.className = 'wizard-steps';
    this._stepNames.forEach((name, i) => {
      if (i > 0) {
        const conn = document.createElement('div');
        conn.className = `wizard-step-connector${i <= this._currentStep ? ' completed' : ''}`;
        steps.appendChild(conn);
      }
      const ind = document.createElement('div');
      ind.className = `wizard-step-indicator${i === this._currentStep ? ' active' : ''}${i < this._currentStep ? ' completed' : ''}`;
      ind.innerHTML = `<div class="wizard-step-number">${i < this._currentStep ? '&#10003;' : i + 1}</div><div class="wizard-step-label">${name}</div>`;
      steps.appendChild(ind);
    });
    container.appendChild(steps);

    // Step content
    const content = document.createElement('div');
    content.className = 'wizard-step-content';
    this._renderStep(content);
    container.appendChild(content);

    // Navigation
    const nav = document.createElement('div');
    nav.className = 'wizard-nav';
    nav.innerHTML = `
      <button class="btn btn-ghost" id="wizard-back" ${this._currentStep === 0 ? 'disabled' : ''}>Back</button>
      <span class="text-muted text-sm">Step ${this._currentStep + 1} of ${this._totalSteps}</span>
      <button class="btn btn-primary" id="wizard-next">${this._currentStep === this._totalSteps - 1 ? 'Generate' : 'Next'}</button>
    `;
    container.appendChild(nav);

    container.querySelector('#wizard-back')?.addEventListener('click', () => this._prev());
    container.querySelector('#wizard-next')?.addEventListener('click', () => this._next());
  }

  _renderStep(container) {
    const renderers = [
      () => this._renderClientProfile(container),
      () => this._renderModuleSelection(container),
      () => this._renderConfiguration(container),
      () => this._renderPlatformTargets(container),
      () => this._renderReview(container)
    ];
    renderers[this._currentStep]();
  }

  _renderClientProfile(el) {
    const profiles = this._profileLoader.getAllSummaries();
    el.innerHTML = `
      <h2>Client Profile</h2>
      <p class="text-muted">Set up the client engagement context. Select an industry profile to pre-fill defaults.</p>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Client Name *</label>
          <input class="form-input" id="wz-clientName" value="${this._draft.clientName || ''}" placeholder="e.g., Acme Manufacturing" />
        </div>
        <div class="form-group">
          <label class="form-label">Industry Profile *</label>
          <select class="form-select" id="wz-industry">
            <option value="">Select industry...</option>
            ${profiles.filter(p => p.id).map(p => `<option value="${p.id}" ${this._draft.industry === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
            <option value="custom" ${this._draft.industry === 'custom' ? 'selected' : ''}>Custom</option>
          </select>
        </div>
      </div>
      <div id="profile-preview" class="mt-2"></div>
      <div class="form-row mt-2">
        <div class="form-group">
          <label class="form-label">Cloud Provider</label>
          <select class="form-select" id="wz-cloud">
            ${['azure', 'aws', 'gcp', 'hybrid'].map(v => `<option value="${v}" ${this._draft.environment?.cloud === v ? 'selected' : ''}>${v.charAt(0).toUpperCase() + v.slice(1)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Data Platform</label>
          <select class="form-select" id="wz-platform">
            ${['fabric', 'databricks', 'synapse', 'snowflake'].map(v => `<option value="${v}" ${this._draft.environment?.dataplatform === v ? 'selected' : ''}>${v.charAt(0).toUpperCase() + v.slice(1)}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Org Prefix * <span class="text-muted text-xs">(3-5 chars)</span></label>
          <input class="form-input" id="wz-orgPrefix" value="${this._draft.naming?.orgPrefix || ''}" placeholder="e.g., acme" maxlength="5" />
        </div>
        <div class="form-group">
          <label class="form-label">Separator</label>
          <select class="form-select" id="wz-separator">
            <option value="_" ${this._draft.naming?.separator === '_' ? 'selected' : ''}>Underscore (_)</option>
            <option value="-" ${this._draft.naming?.separator === '-' ? 'selected' : ''}>Hyphen (-)</option>
          </select>
        </div>
      </div>
    `;

    // Profile preview on change
    const industrySelect = el.querySelector('#wz-industry');
    const previewEl = el.querySelector('#profile-preview');
    const showPreview = () => {
      const id = industrySelect.value;
      const summary = this._profileLoader.getProfileSummary(id);
      if (summary && summary.id) {
        previewEl.innerHTML = `<div class="alert alert-info"><div><strong>${summary.name}</strong> — ${summary.description}<br/><span class="text-xs">Frameworks: ${summary.regulatoryFrameworks.join(', ') || 'None'} | Modules: ${summary.moduleRecommendations.join(', ') || 'None'}</span></div></div>`;
        // Pre-fill from profile
        const profile = this._profileLoader.load(id);
        if (profile) {
          if (profile.environment) {
            el.querySelector('#wz-cloud').value = profile.environment.cloud || 'azure';
            el.querySelector('#wz-platform').value = profile.environment.dataplatform || 'fabric';
          }
          if (profile.naming) {
            el.querySelector('#wz-separator').value = profile.naming.separator || '_';
          }
        }
      } else {
        previewEl.innerHTML = '';
      }
    };
    industrySelect.addEventListener('change', showPreview);
    if (this._draft.industry) showPreview();
  }

  _renderModuleSelection(el) {
    const modules = [
      { id: 'ISL-03', name: 'Naming Conventions', effort: '10-18 hrs', savings: '55-65%', phase: 'foundation', deps: [] },
      { id: 'ISL-04', name: 'Data Classification', effort: '25-40 hrs', savings: '50-60%', phase: 'foundation', deps: [] },
      { id: 'ISL-01', name: 'API Governance', effort: '20-35 hrs', savings: '55-70%', phase: 'core', deps: ['ISL-03', 'ISL-04'] },
      { id: 'ISL-06', name: 'Data Quality', effort: '20-35 hrs', savings: '50-60%', phase: 'core', deps: ['ISL-03', 'ISL-04'] },
      { id: 'ISL-02', name: 'Metadata & Lineage', effort: '30-50 hrs', savings: '60-70%', phase: 'advanced', deps: ['ISL-03', 'ISL-04', 'ISL-06'] },
      { id: 'ISL-05', name: 'Integration Patterns', effort: '40-50 hrs', savings: '35-45%', phase: 'advanced', deps: ['ISL-01', 'ISL-03'] }
    ];
    const selected = this._draft.modules?.selected || [];
    const phaseMap = this._draft.modules?.phaseMap || { foundation: [], core: [], advanced: [] };

    el.innerHTML = `
      <h2>Module Selection</h2>
      <p class="text-muted">Select which ISL standards modules to deploy. Modules are organized by recommended deployment phase.</p>
      <div class="grid-3 mt-2">
        ${modules.map(m => `
          <div class="module-card ${selected.includes(m.id) ? 'selected' : ''}" data-module="${m.id}" data-phase="${m.phase}">
            <div class="flex-row flex-between mb-1">
              <span class="module-id">${m.id}</span>
              <label class="form-checkbox"><input type="checkbox" value="${m.id}" ${selected.includes(m.id) ? 'checked' : ''} /> Select</label>
            </div>
            <h4>${m.name}</h4>
            <div class="flex-row gap-sm mt-1">
              <span class="module-effort">${m.effort}</span>
              <span class="badge badge-success">${m.savings} saved</span>
            </div>
            <div class="text-xs text-muted mt-1">Phase: ${m.phase}${m.deps.length ? ' | Deps: ' + m.deps.join(', ') : ''}</div>
          </div>
        `).join('')}
      </div>
      <div class="alert alert-info mt-2">
        <div>Dependencies are automatically included. Selecting ISL-01 will include ISL-03 and ISL-04.</div>
      </div>
    `;

    // Handle checkbox changes
    el.querySelectorAll('.module-card input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const card = e.target.closest('.module-card');
        card.classList.toggle('selected', e.target.checked);
        // Auto-select dependencies
        if (e.target.checked) {
          const mod = modules.find(m => m.id === e.target.value);
          mod?.deps.forEach(dep => {
            const depCb = el.querySelector(`input[value="${dep}"]`);
            if (depCb && !depCb.checked) {
              depCb.checked = true;
              depCb.closest('.module-card').classList.add('selected');
            }
          });
        }
      });
    });
  }

  _renderConfiguration(el) {
    const cls = this._draft.classification || {};
    const tierLabels = cls.tierLabels || ['Public', 'Internal', 'Confidential', 'Restricted'];
    const frameworks = cls.regulatoryFrameworks || [];
    const allFrameworks = ['ITAR', 'EAR', 'SOX', 'PCI-DSS', 'HIPAA', 'GDPR', 'CCPA', 'NIST-800-171', 'CMMC', 'Basel-III', 'GLBA', 'HITECH'];

    el.innerHTML = `
      <h2>Configuration</h2>
      <p class="text-muted">Fine-tune classification tiers and regulatory frameworks. Profile defaults are pre-filled — override as needed.</p>
      <div class="card mt-2">
        <div class="card-header"><h3>Classification Tiers</h3></div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">Number of Tiers</label>
            <select class="form-select" id="wz-tierCount" style="max-width:200px">
              ${[3, 4, 5].map(n => `<option value="${n}" ${cls.tierCount === n ? 'selected' : ''}>${n} tiers</option>`).join('')}
            </select>
          </div>
          <div id="tier-labels" class="mt-2">
            ${tierLabels.map((label, i) => `
              <div class="form-group" style="max-width:400px">
                <label class="form-label">Tier ${i + 1}</label>
                <input class="form-input tier-label" value="${label}" data-index="${i}" />
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="card mt-2">
        <div class="card-header"><h3>Regulatory Frameworks</h3></div>
        <div class="card-body">
          <div class="flex-row flex-wrap gap-sm">
            ${allFrameworks.map(f => `
              <label class="form-checkbox"><input type="checkbox" value="${f}" class="framework-cb" ${frameworks.includes(f) ? 'checked' : ''} /> ${f}</label>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  _renderPlatformTargets(el) {
    const adapters = [
      { id: 'fabric', name: 'Microsoft Fabric', icon: 'F', desc: 'Workspace naming, lakehouse structure, pipeline catalogs', modules: 'ISL-03, ISL-05' },
      { id: 'purview', name: 'Microsoft Purview', icon: 'P', desc: 'Sensitivity labels, classification rules, glossary terms', modules: 'ISL-04, ISL-02' },
      { id: 'apim', name: 'Azure API Management', icon: 'A', desc: 'Naming policies, versioning, security policies', modules: 'ISL-01' },
      { id: 'webhook', name: 'REST / Webhook', icon: 'W', desc: 'Generic JSON payload delivery to any endpoint', modules: 'All modules' }
    ];
    const enabled = this._draft.adapters?.enabled || [];

    el.innerHTML = `
      <h2>Platform Targets</h2>
      <p class="text-muted">Enable adapters to generate platform-specific configurations and deployment scripts.</p>
      <div class="adapter-grid mt-2">
        ${adapters.map(a => `
          <div class="adapter-card ${enabled.includes(a.id) ? 'enabled' : ''}" data-adapter="${a.id}">
            <div class="adapter-icon">${a.icon}</div>
            <div style="flex:1">
              <div class="flex-row flex-between">
                <h4>${a.name}</h4>
                <label class="form-checkbox"><input type="checkbox" value="${a.id}" class="adapter-cb" ${enabled.includes(a.id) ? 'checked' : ''} /></label>
              </div>
              <p class="text-sm text-muted mb-1">${a.desc}</p>
              <span class="badge badge-secondary">${a.modules}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="card mt-2">
        <div class="card-header"><h3>Plugins</h3></div>
        <div class="card-body">
          <p class="text-muted text-sm">Registered plugins will appear here. See <code>plugins/</code> directory to add custom adapters.</p>
        </div>
      </div>
    `;

    el.querySelectorAll('.adapter-cb').forEach(cb => {
      cb.addEventListener('change', e => {
        e.target.closest('.adapter-card').classList.toggle('enabled', e.target.checked);
      });
    });
  }

  _renderReview(el) {
    this._collectDraft();
    const validation = this._resolver.validate(this._draft);
    const selected = this._draft.modules?.selected || [];
    const enabled = this._draft.adapters?.enabled || [];

    el.innerHTML = `
      <h2>Review & Generate</h2>
      <p class="text-muted">Review your configuration before generating adapted standards and platform artifacts.</p>
      ${validation.missing.length ? `<div class="alert alert-error"><div>Missing required fields: ${validation.missing.join(', ')}</div></div>` : ''}
      ${validation.warnings.length ? validation.warnings.map(w => `<div class="alert alert-warning"><div>${w}</div></div>`).join('') : ''}
      <div class="grid-2 mt-2">
        <div class="card">
          <div class="card-header"><h3>Client</h3></div>
          <div class="card-body">
            <p><strong>${this._draft.clientName || '(not set)'}</strong></p>
            <p class="text-sm text-muted">${this._draft.industry || '(no industry)'} | ${this._draft.environment?.cloud} | ${this._draft.environment?.dataplatform}</p>
            <p class="text-sm">Prefix: <code>${this._draft.naming?.orgPrefix || '(not set)'}</code> | Separator: <code>${this._draft.naming?.separator}</code></p>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Classification</h3></div>
          <div class="card-body">
            <p>${this._draft.classification?.tierCount} tiers: ${(this._draft.classification?.tierLabels || []).join(' > ')}</p>
            <p class="text-sm text-muted">Frameworks: ${(this._draft.classification?.regulatoryFrameworks || []).join(', ') || 'None'}</p>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Modules (${selected.length})</h3></div>
          <div class="card-body">
            ${selected.length ? selected.map(m => `<span class="badge badge-primary" style="margin:0.15rem">${m}</span>`).join('') : '<p class="text-muted">No modules selected</p>'}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Adapters (${enabled.length})</h3></div>
          <div class="card-body">
            ${enabled.length ? enabled.map(a => `<span class="badge badge-secondary" style="margin:0.15rem">${a}</span>`).join('') : '<p class="text-muted">No adapters enabled</p>'}
          </div>
        </div>
      </div>
      ${!validation.missing.length ? '<div class="alert alert-success mt-2"><div>Configuration is valid. Click <strong>Generate</strong> to produce adapted standards and deployment artifacts.</div></div>' : ''}
    `;
  }

  _collectDraft() {
    const c = this._container;
    if (!c) return;

    // Step 1 fields
    const clientName = c.querySelector('#wz-clientName');
    if (clientName) this._draft.clientName = clientName.value;
    const industry = c.querySelector('#wz-industry');
    if (industry) this._draft.industry = industry.value;
    const cloud = c.querySelector('#wz-cloud');
    if (cloud) this._draft.environment = { ...this._draft.environment, cloud: cloud.value };
    const platform = c.querySelector('#wz-platform');
    if (platform) this._draft.environment = { ...this._draft.environment, dataplatform: platform.value };
    const orgPrefix = c.querySelector('#wz-orgPrefix');
    if (orgPrefix) this._draft.naming = { ...this._draft.naming, orgPrefix: orgPrefix.value };
    const separator = c.querySelector('#wz-separator');
    if (separator) this._draft.naming = { ...this._draft.naming, separator: separator.value };

    // Step 2 fields
    const moduleCbs = c.querySelectorAll('.module-card input[type="checkbox"]');
    if (moduleCbs.length) {
      const selected = [...moduleCbs].filter(cb => cb.checked).map(cb => cb.value);
      this._draft.modules = { ...this._draft.modules, selected };
    }

    // Step 3 fields
    const tierCount = c.querySelector('#wz-tierCount');
    if (tierCount) this._draft.classification = { ...this._draft.classification, tierCount: parseInt(tierCount.value) };
    const tierLabels = c.querySelectorAll('.tier-label');
    if (tierLabels.length) {
      this._draft.classification = { ...this._draft.classification, tierLabels: [...tierLabels].map(el => el.value) };
    }
    const frameworkCbs = c.querySelectorAll('.framework-cb');
    if (frameworkCbs.length) {
      this._draft.classification = { ...this._draft.classification, regulatoryFrameworks: [...frameworkCbs].filter(cb => cb.checked).map(cb => cb.value) };
    }

    // Step 4 fields
    const adapterCbs = c.querySelectorAll('.adapter-cb');
    if (adapterCbs.length) {
      this._draft.adapters = { ...this._draft.adapters, enabled: [...adapterCbs].filter(cb => cb.checked).map(cb => cb.value) };
    }

    // Auto-save to LocalStorage
    this._configStore.save(this._draft);
  }

  _next() {
    this._collectDraft();
    if (this._currentStep < this._totalSteps - 1) {
      this._currentStep++;
      this.render(this._container);
    } else {
      // Final step — generate
      this._configStore.save(this._draft);
      if (this._onComplete) this._onComplete(this._draft);
    }
  }

  _prev() {
    this._collectDraft();
    if (this._currentStep > 0) {
      this._currentStep--;
      this.render(this._container);
    }
  }
}
window.ISL.Wizard = Wizard;
})();

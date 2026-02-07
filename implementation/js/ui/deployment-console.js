/**
 * ISL Implementation Accelerator — Deployment Console
 * Output preview, generation progress, and ZIP download interface.
 */
(function() {
class DeploymentConsole {
  constructor(engine, configStore) {
    this._engine = engine;
    this._configStore = configStore;
    this._container = null;
    this._lines = [];
    this._isRunning = false;
    this._lastResult = null;
  }

  render(container) {
    this._container = container;
    const config = this._configStore.getAll();
    const enabled = config.adapters?.enabled || [];
    const selected = config.modules?.selected || [];

    container.innerHTML = `
      <h2 class="mb-2">Deployment Console</h2>
      <div class="grid-2 mb-2">
        <div class="card">
          <div class="card-header"><h3>Generation Preview</h3></div>
          <div class="card-body">
            <p><strong>Client:</strong> ${config.clientName || '(not configured)'}</p>
            <p><strong>Modules:</strong> ${selected.join(', ') || 'None selected'}</p>
            <p><strong>Adapters:</strong> ${enabled.join(', ') || 'None enabled'}</p>
            <p class="text-sm text-muted mt-1">Each adapter will generate: configs + docs + scripts + manifest</p>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Actions</h3></div>
          <div class="card-body flex-col gap-sm">
            <button class="btn btn-primary btn-block" id="dc-generate" ${this._isRunning ? 'disabled' : ''}>
              ${this._isRunning ? '<span class="spinner" style="display:inline-block;margin-right:8px"></span> Generating...' : 'Generate All Outputs'}
            </button>
            <button class="btn btn-secondary btn-block" id="dc-download" ${!this._lastResult ? 'disabled' : ''}>Download ZIP</button>
            <button class="btn btn-ghost btn-block" id="dc-clear">Clear Console</button>
          </div>
        </div>
      </div>

      <div class="card mb-2">
        <div class="card-header flex-row flex-between">
          <h3>Console Output</h3>
          <span class="text-xs text-muted" id="dc-status">${this._isRunning ? 'Running...' : this._lines.length ? 'Complete' : 'Ready'}</span>
        </div>
        <div class="card-body">
          <div class="progress-bar mb-1"><div class="progress-fill ${this._isRunning ? 'animated' : ''}" id="dc-progress" style="width:${this._isRunning ? '50%' : this._lastResult ? '100%' : '0%'}"></div></div>
          <div class="console-output" id="dc-console">
            ${this._lines.length ? this._lines.map(l => this._renderLine(l)).join('') : '<div class="console-line"><span class="console-timestamp">[--:--:--]</span> Waiting for generation command...</div>'}
          </div>
        </div>
      </div>

      ${this._lastResult ? this._renderResults() : ''}
    `;

    container.querySelector('#dc-generate')?.addEventListener('click', () => this.runGeneration());
    container.querySelector('#dc-download')?.addEventListener('click', () => this._downloadZip());
    container.querySelector('#dc-clear')?.addEventListener('click', () => this._clearConsole());
  }

  async runGeneration() {
    if (this._isRunning) return;
    this._isRunning = true;
    this._lines = [];
    this._lastResult = null;
    this.render(this._container);

    this._log('info', 'Starting ISL generation pipeline...');

    // Subscribe to engine events
    this._engine.on('progress', (data) => {
      this._log('info', data.message);
      if (data.total) {
        const pct = Math.round(((data.completed || 0) / data.total) * 100);
        const progressEl = this._container?.querySelector('#dc-progress');
        if (progressEl) progressEl.style.width = `${pct}%`;
      }
      this._updateConsole();
    });

    this._engine.on('error', (data) => {
      this._log('error', `Error in ${data.adapter}: ${data.error}`);
      this._updateConsole();
    });

    try {
      // Build template sources (placeholder — in real deployment, these would be fetched from ISL modules)
      const templateSources = this._buildTemplateSources();
      this._log('info', `Loaded ${Object.keys(templateSources).length} module template sets`);

      const result = await this._engine.execute(templateSources);
      this._lastResult = result;

      if (result.success) {
        this._log('success', `Generation complete! ${result.outputs.getSummary().totalFiles} files produced.`);
        const summary = result.outputs.getSummary();
        for (const [adapter, count] of Object.entries(summary.byAdapter)) {
          this._log('success', `  ${adapter}: ${count} files`);
        }
      } else {
        this._log('warning', `Generation completed with ${result.errors.length} error(s):`);
        result.errors.forEach(e => this._log('error', `  ${e}`));
      }
    } catch (e) {
      this._log('error', `Fatal error: ${e.message}`);
    }

    this._isRunning = false;
    this.render(this._container);
  }

  _buildTemplateSources() {
    const config = this._configStore.getAll();
    const selected = config.modules?.selected || [];
    const sources = {};

    // Generate placeholder templates with config placeholders
    // In production, these would be loaded from the ISL standards-modules/ directory
    selected.forEach(moduleId => {
      sources[moduleId] = {
        'standard-template': `# ${moduleId} Standards\n## Client: {{clientName}}\n## Industry: {{industry}}\n\n### Environment\n- Cloud: {{environment.cloud}}\n- Platform: {{environment.dataplatform}}\n- Governance: {{environment.governance}}\n\n### Naming\n- Prefix: {{naming.orgPrefix}}\n- Separator: {{naming.separator}}\n\n### Classification\n- Tiers: {{classification.tierCount}}\n{{#each classification.tierLabels}}\n- {{.}}\n{{/each}}\n\n### Regulatory Frameworks\n{{#each classification.regulatoryFrameworks}}\n- {{.}}\n{{/each}}\n`
      };
    });

    return sources;
  }

  _log(level, message) {
    this._lines.push({
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    });
  }

  _renderLine(line) {
    const icons = { info: 'i', success: '\u2713', error: '\u2717', warning: '!', };
    return `<div class="console-line ${line.level}"><span class="console-status-icon">${icons[line.level] || ' '}</span><span class="console-timestamp">[${line.timestamp}]</span> ${this._escapeHtml(line.message)}</div>`;
  }

  _updateConsole() {
    const consoleEl = this._container?.querySelector('#dc-console');
    if (consoleEl) {
      consoleEl.innerHTML = this._lines.map(l => this._renderLine(l)).join('');
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }
  }

  _renderResults() {
    if (!this._lastResult) return '';
    const summary = this._lastResult.outputs.getSummary();

    return `
      <div class="card mb-2">
        <div class="card-header"><h3>Generated Outputs</h3></div>
        <div class="card-body">
          <div class="grid-4 mb-2">
            <div style="text-align:center"><div class="hero-stat-value">${summary.totalFiles}</div><div class="hero-stat-label">Total Files</div></div>
            <div style="text-align:center"><div class="hero-stat-value">${summary.byCategory.configs}</div><div class="hero-stat-label">Configs</div></div>
            <div style="text-align:center"><div class="hero-stat-value">${summary.byCategory.docs}</div><div class="hero-stat-label">Documents</div></div>
            <div style="text-align:center"><div class="hero-stat-value">${summary.byCategory.scripts}</div><div class="hero-stat-label">Scripts</div></div>
          </div>
          <div class="download-zone">
            <h4 class="mb-1">Download Package</h4>
            <p class="text-sm text-muted mb-2">ZIP archive containing all adapted standards, platform configs, and deployment scripts.</p>
            <button class="btn btn-primary" id="dc-download-zip">Download ZIP Package</button>
          </div>
        </div>
      </div>
    `;
  }

  async _downloadZip() {
    if (!this._lastResult?.outputs) return;
    this._log('info', 'Packaging ZIP download...');
    this._updateConsole();
    await this._lastResult.outputs.downloadAll();
    this._log('success', 'ZIP downloaded.');
    this._updateConsole();
  }

  _clearConsole() {
    this._lines = [];
    this._lastResult = null;
    this.render(this._container);
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
window.ISL.DeploymentConsole = DeploymentConsole;
})();

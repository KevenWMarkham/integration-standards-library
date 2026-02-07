/**
 * ISL Implementation Accelerator — Adapter Engine
 * Orchestrates the two-layer adapter pipeline: context → platform → output.
 */
(function() {
class AdapterEngine {
  /** @param {import('./config-store.js').ConfigStore} configStore */
  constructor(configStore) {
    this._configStore = configStore;
    this._adapters = new Map();
    this._plugins = new Map();
    this._eventHandlers = new Map();
  }

  /** Register a built-in platform adapter class */
  registerAdapter(AdapterClass) {
    const id = AdapterClass.getId();
    this._adapters.set(id, AdapterClass);
  }

  /** Register a plugin adapter */
  registerPlugin(pluginId, manifest, AdapterClass) {
    this._plugins.set(pluginId, { manifest, AdapterClass });
  }

  /** Get all registered adapters (built-in + plugins) */
  getAdapters() {
    const all = [];
    for (const [id, Cls] of this._adapters) {
      all.push({ id, name: Cls.getName(), description: Cls.getDescription(), modules: Cls.getModules(), type: 'builtin' });
    }
    for (const [id, { manifest }] of this._plugins) {
      all.push({ id, name: manifest.name, description: manifest.description, modules: manifest.modules, type: 'plugin' });
    }
    return all;
  }

  /** Get adapters filtered by enabled status in config */
  getEnabledAdapters() {
    const enabled = this._configStore.get('adapters.enabled') || [];
    return this.getAdapters().filter(a => enabled.includes(a.id));
  }

  /**
   * Run the full pipeline:
   * resolve config → transform templates → run adapters → generate output
   */
  async execute(templateSources) {
    const config = this._configStore.getAll();
    const errors = [];
    const adapterManifests = {};

    this.emit('progress', { phase: 'start', message: 'Starting generation pipeline...' });

    // Step 1: Create transformer with resolved config
    const transformer = new (window.ISL.TemplateTransformer)(config);
    this.emit('progress', { phase: 'transform', message: 'Transforming templates...' });

    // Step 2: Transform all templates
    const transformedTemplates = {};
    for (const [moduleId, templates] of Object.entries(templateSources || {})) {
      transformedTemplates[moduleId] = {};
      for (const [templateName, templateContent] of Object.entries(templates)) {
        try {
          transformedTemplates[moduleId][templateName] = transformer.transform(templateContent);
        } catch (e) {
          errors.push(`Template transform error [${moduleId}/${templateName}]: ${e.message}`);
        }
      }
    }

    // Step 3: Create output generator
    const outputGen = new (window.ISL.OutputGenerator)(config.clientName);
    const enabledIds = config.adapters?.enabled || [];

    // Step 4: Execute each enabled adapter
    let completed = 0;
    const total = enabledIds.length;

    for (const adapterId of enabledIds) {
      try {
        this.emit('progress', {
          phase: 'adapter',
          adapter: adapterId,
          message: `Running ${adapterId} adapter...`,
          completed,
          total
        });

        const result = await this.executeAdapter(adapterId, transformedTemplates, config);

        // Collect outputs
        if (result.configs) {
          for (const f of result.configs) outputGen.addOutput(adapterId, 'configs', f.name, f.content);
        }
        if (result.docs) {
          for (const f of result.docs) outputGen.addOutput(adapterId, 'docs', f.name, f.content);
        }
        if (result.scripts) {
          for (const f of result.scripts) outputGen.addOutput(adapterId, 'scripts', f.name, f.content);
        }

        adapterManifests[adapterId] = result.manifest || {};
        completed++;
      } catch (e) {
        errors.push(`Adapter error [${adapterId}]: ${e.message}`);
        this.emit('error', { adapter: adapterId, error: e.message });
      }
    }

    // Step 5: Generate manifest
    const manifest = outputGen.generateManifest(config, adapterManifests);

    // Record in generation history
    const history = config.metadata?.generationHistory || [];
    history.push({
      timestamp: manifest.generatedAt,
      adapters: enabledIds,
      modules: config.modules?.selected || [],
      fileCount: outputGen.getSummary().totalFiles
    });
    this._configStore.set('metadata.generationHistory', history.slice(-20));

    this.emit('progress', { phase: 'complete', message: 'Generation complete.' });
    this.emit('complete', { manifest, summary: outputGen.getSummary() });

    return {
      success: errors.length === 0,
      outputs: outputGen,
      manifest,
      errors
    };
  }

  /** Execute a single adapter by ID */
  async executeAdapter(adapterId, transformedTemplates, resolvedConfig) {
    // Check built-in adapters
    if (this._adapters.has(adapterId)) {
      const AdapterClass = this._adapters.get(adapterId);
      const instance = new AdapterClass(resolvedConfig);
      const validation = instance.validate();
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      const result = instance.transform(transformedTemplates, resolvedConfig);
      const scripts = instance.generateScripts(result);
      if (scripts && scripts.length) {
        result.scripts = (result.scripts || []).concat(scripts);
      }
      result.manifest = instance.getOutputManifest();
      return result;
    }

    // Check plugins
    if (this._plugins.has(adapterId)) {
      const { manifest, AdapterClass } = this._plugins.get(adapterId);
      const instance = new AdapterClass(manifest, resolvedConfig);
      const validation = instance.validate();
      if (!validation.valid) {
        throw new Error(`Plugin validation failed: ${validation.errors.join(', ')}`);
      }
      const result = instance.transform(transformedTemplates, resolvedConfig);
      const scripts = instance.generateScripts(result);
      if (scripts && scripts.length) {
        result.scripts = (result.scripts || []).concat(scripts);
      }
      result.manifest = instance.getOutputManifest();
      return result;
    }

    throw new Error(`Unknown adapter: ${adapterId}`);
  }

  /** Validate all enabled adapters have required config */
  validateAll() {
    const config = this._configStore.getAll();
    const enabledIds = config.adapters?.enabled || [];
    const errors = new Map();
    let valid = true;

    for (const id of enabledIds) {
      let instance;
      if (this._adapters.has(id)) {
        const Cls = this._adapters.get(id);
        instance = new Cls(config);
      } else if (this._plugins.has(id)) {
        const { manifest, AdapterClass } = this._plugins.get(id);
        instance = new AdapterClass(manifest, config);
      }
      if (instance) {
        const result = instance.validate();
        if (!result.valid) {
          errors.set(id, result.errors);
          valid = false;
        }
      }
    }

    return { valid, errors };
  }

  /** Preview what will be generated without executing */
  preview() {
    const config = this._configStore.getAll();
    const enabledIds = config.adapters?.enabled || [];
    const adapters = [];

    for (const id of enabledIds) {
      let info;
      if (this._adapters.has(id)) {
        const Cls = this._adapters.get(id);
        info = { id, name: Cls.getName(), modules: Cls.getModules(), type: 'builtin' };
      } else if (this._plugins.has(id)) {
        const { manifest } = this._plugins.get(id);
        info = { id, name: manifest.name, modules: manifest.modules, type: 'plugin' };
      }
      if (info) adapters.push(info);
    }

    return {
      adapters,
      modules: config.modules?.selected || [],
      estimatedOutputs: adapters.map(a => `${a.id}: configs, docs, scripts, manifest`)
    };
  }

  /** Subscribe to events */
  on(event, callback) {
    if (!this._eventHandlers.has(event)) this._eventHandlers.set(event, []);
    this._eventHandlers.get(event).push(callback);
  }

  /** Emit an event */
  emit(event, data) {
    const handlers = this._eventHandlers.get(event) || [];
    handlers.forEach(fn => fn(data));
  }
}
window.ISL.AdapterEngine = AdapterEngine;
})();

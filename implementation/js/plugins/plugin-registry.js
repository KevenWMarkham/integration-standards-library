/**
 * ISL Implementation Accelerator — Plugin Registry
 * Discovery, loading, validation, and lifecycle management for plugins.
 */
(function() {
class PluginRegistry {
  constructor() {
    this._plugins = new Map();
  }

  /** Register a plugin from manifest + adapter class */
  register(manifest, AdapterClass) {
    const validation = this.validateManifest(manifest);
    if (!validation.valid) {
      return { success: false, error: `Invalid manifest: ${validation.errors.join(', ')}` };
    }

    if (!(AdapterClass.prototype instanceof window.ISL.PluginAdapter) && AdapterClass !== window.ISL.PluginAdapter) {
      // Allow duck-typing: check for required methods
      const proto = AdapterClass.prototype;
      const required = ['validate', 'transform', 'generateScripts'];
      const missing = required.filter(m => typeof proto[m] !== 'function');
      if (missing.length > 0) {
        return { success: false, error: `Adapter class missing methods: ${missing.join(', ')}` };
      }
    }

    this._plugins.set(manifest.id, { manifest, AdapterClass });
    return { success: true };
  }

  /** Validate a manifest object */
  validateManifest(manifest) {
    const errors = [];
    if (!manifest) { return { valid: false, errors: ['Manifest is required'] }; }
    if (!manifest.id) errors.push('Missing id');
    if (!manifest.name) errors.push('Missing name');
    if (!manifest.version) errors.push('Missing version');
    if (!manifest.entryPoint) errors.push('Missing entryPoint');
    if (!manifest.layer || !['platform', 'context'].includes(manifest.layer)) {
      errors.push('layer must be "platform" or "context"');
    }
    if (!Array.isArray(manifest.modules)) errors.push('modules must be an array');
    if (manifest.configSchema && typeof manifest.configSchema !== 'object') {
      errors.push('configSchema must be an object');
    }
    return { valid: errors.length === 0, errors };
  }

  /** Get all registered plugins */
  getAll() {
    return new Map(this._plugins);
  }

  /** Get a specific plugin by ID */
  get(pluginId) {
    return this._plugins.get(pluginId) || null;
  }

  /** Instantiate a plugin adapter with client config */
  instantiate(pluginId, clientConfig) {
    const plugin = this._plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin not found: ${pluginId}`);
    return new plugin.AdapterClass(plugin.manifest, clientConfig);
  }

  /** Get plugins filtered by module support */
  getByModule(moduleId) {
    const result = [];
    for (const [, { manifest, AdapterClass }] of this._plugins) {
      if (manifest.modules.includes(moduleId)) {
        result.push({ manifest, AdapterClass });
      }
    }
    return result;
  }

  /** Get plugins filtered by layer */
  getByLayer(layer) {
    const result = [];
    for (const [, { manifest, AdapterClass }] of this._plugins) {
      if (manifest.layer === layer) {
        result.push({ manifest, AdapterClass });
      }
    }
    return result;
  }

  /** Unregister a plugin */
  unregister(pluginId) {
    return this._plugins.delete(pluginId);
  }

  /** Get summary list for UI display */
  getSummaries() {
    const summaries = [];
    for (const [id, { manifest }] of this._plugins) {
      summaries.push({
        id,
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        modules: manifest.modules,
        layer: manifest.layer,
        author: manifest.author || 'Unknown'
      });
    }
    return summaries;
  }

  /** Load a plugin from manifest and adapter module */
  async loadPlugin(manifest, adapterModule) {
    try {
      const AdapterClass = adapterModule.default || adapterModule;
      return this.register(manifest, AdapterClass);
    } catch (e) {
      return { success: false, error: `Failed to load plugin: ${e.message}` };
    }
  }
}
window.ISL.PluginRegistry = PluginRegistry;
})();

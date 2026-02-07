/**
 * ISL Implementation Accelerator — Plugin Interface
 * Base class that all plugin adapters must extend.
 */
(function() {
class PluginAdapter {
  /**
   * @param {object} manifest - The plugin's manifest.json contents
   * @param {object} clientConfig - The resolved client configuration
   */
  constructor(manifest, clientConfig) {
    this.manifest = manifest;
    this.config = clientConfig;
    this.outputs = [];
  }

  /** Validate that required config fields are present */
  validate() {
    const errors = [];
    const schema = this.manifest.configSchema || {};
    const adapterConfig = this.config.adapters?.config?.[this.manifest.id] || {};

    for (const [key, def] of Object.entries(schema)) {
      if (def.required && !adapterConfig[key] && adapterConfig[key] !== 0 && adapterConfig[key] !== false) {
        errors.push(`Missing required config: ${def.label || key}`);
      }
      if (def.type === 'select' && adapterConfig[key] && def.options && !def.options.includes(adapterConfig[key])) {
        errors.push(`Invalid value for ${def.label || key}: "${adapterConfig[key]}". Must be one of: ${def.options.join(', ')}`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /** Return additional config fields for the wizard/dashboard UI */
  getConfigFields() {
    const schema = this.manifest.configSchema || {};
    return Object.entries(schema).map(([key, def]) => ({
      key,
      type: def.type || 'string',
      label: def.label || key,
      description: def.description || '',
      required: !!def.required,
      default: def.default || '',
      options: def.options || undefined
    }));
  }

  /** Transform ISL templates into platform-specific outputs — override in subclass */
  transform(templates, resolvedConfig) {
    throw new Error('transform() must be implemented by plugin');
  }

  /** Generate deployment scripts — override in subclass */
  generateScripts(outputs) {
    throw new Error('generateScripts() must be implemented by plugin');
  }

  /** Return audit manifest entry */
  getOutputManifest() {
    return {
      pluginId: this.manifest.id,
      pluginName: this.manifest.name,
      pluginVersion: this.manifest.version,
      timestamp: new Date().toISOString(),
      outputCount: this.outputs.length,
      modulesConsumed: this.manifest.modules || []
    };
  }

  /** Get the ISL modules this plugin works with */
  getModules() {
    return this.manifest.modules || [];
  }

  /** Helper: add an output file */
  addOutput(category, name, content) {
    this.outputs.push({ category, name, content });
  }

  /** Get all outputs produced */
  getOutputs() {
    return this.outputs;
  }

  /** Helper: get adapter-specific config from the client config */
  getAdapterConfig() {
    return this.config.adapters?.config?.[this.manifest.id] || {};
  }
}
window.ISL.PluginAdapter = PluginAdapter;
})();

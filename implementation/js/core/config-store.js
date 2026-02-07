/**
 * ISL Implementation Accelerator — Configuration Store
 * LocalStorage-backed client configuration persistence with dot-path access.
 */
(function() {
class ConfigStore {
  /** @param {string} storageKey */
  constructor(storageKey = 'isl-accelerator-config') {
    this._key = storageKey;
    this._listeners = [];
    this._config = this.load();
  }

  /** Load config from LocalStorage, return default if none exists */
  load() {
    try {
      const raw = localStorage.getItem(this._key);
      if (raw) {
        const parsed = JSON.parse(raw);
        return this._deepMerge(ConfigStore.getDefaultConfig(), parsed);
      }
    } catch (e) {
      console.warn('ConfigStore: failed to load, using defaults', e);
    }
    return ConfigStore.getDefaultConfig();
  }

  /** Save current config to LocalStorage */
  save(config) {
    if (config) this._config = config;
    this._config.metadata.updatedAt = new Date().toISOString();
    if (!this._config.metadata.createdAt) {
      this._config.metadata.createdAt = this._config.metadata.updatedAt;
    }
    try {
      localStorage.setItem(this._key, JSON.stringify(this._config));
    } catch (e) {
      console.error('ConfigStore: failed to save', e);
    }
    this._notify();
  }

  /** Get nested value by dot-path: get('naming.orgPrefix') */
  get(path) {
    return path.split('.').reduce((obj, key) => (obj != null ? obj[key] : undefined), this._config);
  }

  /** Set nested value by dot-path: set('naming.orgPrefix', 'acme') */
  set(path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    let obj = this._config;
    for (const key of keys) {
      if (obj[key] == null || typeof obj[key] !== 'object') obj[key] = {};
      obj = obj[key];
    }
    obj[last] = value;
    this.save();
  }

  /** Deep merge partial config over existing */
  merge(partial) {
    this._config = this._deepMerge(this._config, partial);
    this.save();
  }

  /** Export config as JSON string */
  exportJSON() {
    return JSON.stringify(this._config, null, 2);
  }

  /** Import config from JSON string */
  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      this._config = this._deepMerge(ConfigStore.getDefaultConfig(), parsed);
      this.save();
      return true;
    } catch (e) {
      console.error('ConfigStore: import failed', e);
      return false;
    }
  }

  /** Check if this is a first-time user */
  isFirstRun() {
    return localStorage.getItem(this._key) === null;
  }

  /** Reset to defaults */
  reset() {
    this._config = ConfigStore.getDefaultConfig();
    localStorage.removeItem(this._key);
    this._notify();
  }

  /** Get the full current config object */
  getAll() {
    return structuredClone(this._config);
  }

  /** Subscribe to config changes */
  onChange(callback) {
    this._listeners.push(callback);
    return () => { this._listeners = this._listeners.filter(fn => fn !== callback); };
  }

  /** @private */
  _notify() {
    this._listeners.forEach(fn => fn(this._config));
  }

  /** @private */
  _deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
          target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
        result[key] = this._deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  /** Default config structure */
  static getDefaultConfig() {
    return {
      clientName: '',
      industry: '',
      environment: {
        cloud: 'azure',
        dataplatform: 'fabric',
        governance: 'purview'
      },
      naming: {
        orgPrefix: '',
        envCodes: { dev: 'd', test: 't', staging: 's', prod: 'p' },
        separator: '_'
      },
      classification: {
        tierCount: 4,
        tierLabels: ['Public', 'Internal', 'Confidential', 'Restricted'],
        regulatoryFrameworks: []
      },
      modules: {
        selected: [],
        phaseMap: { foundation: [], core: [], advanced: [] }
      },
      adapters: {
        enabled: [],
        config: {}
      },
      overrides: {},
      metadata: {
        createdAt: null,
        updatedAt: null,
        islVersion: '1.0.0',
        generationHistory: []
      }
    };
  }
}
window.ISL.ConfigStore = ConfigStore;
})();

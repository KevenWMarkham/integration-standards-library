/**
 * ISL Implementation Accelerator — Parameter Resolver
 * Three-layer merge: profile baseline -> client overrides -> per-template overrides.
 */
(function() {
class ParameterResolver {
  /** @param {ProfileLoader} profileLoader */
  constructor(profileLoader) {
    this._profileLoader = profileLoader;
  }

  /**
   * Resolve final config: profile baseline -> client overrides -> per-template overrides
   * @param {string} profileId
   * @param {object} clientOverrides
   * @param {object} templateOverrides
   */
  resolve(profileId, clientOverrides, templateOverrides = {}) {
    const profile = this._profileLoader.load(profileId);
    if (!profile) throw new Error(`Unknown profile: ${profileId}`);

    // Layer 1: Profile baseline (extract config-relevant fields)
    const baseline = {
      clientName: '',
      industry: profile.industry,
      environment: { ...profile.environment },
      naming: this._deepClone(profile.naming),
      classification: this._deepClone(profile.classification),
      modules: this._deepClone(profile.modules),
      adapters: this._deepClone(profile.adapters),
      overlays: { ...profile.overlays },
      overrides: {},
      metadata: { createdAt: null, updatedAt: null, islVersion: '1.0.0', generationHistory: [] }
    };

    // Layer 2: Client overrides
    const withClient = this.deepMerge(baseline, clientOverrides || {});

    // Layer 3: Per-template overrides
    const resolved = this.deepMerge(withClient, templateOverrides);

    return resolved;
  }

  /** Deep merge: target <- source (source wins) */
  deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    const result = Array.isArray(target) ? [...target] : { ...target };

    for (const key of Object.keys(source)) {
      const sv = source[key];
      const tv = result[key];

      if (sv && typeof sv === 'object' && !Array.isArray(sv) &&
          tv && typeof tv === 'object' && !Array.isArray(tv)) {
        result[key] = this.deepMerge(tv, sv);
      } else {
        result[key] = sv;
      }
    }
    return result;
  }

  /** Get delta between resolved config and profile baseline */
  getDelta(profileId, resolvedConfig) {
    const profile = this._profileLoader.load(profileId);
    if (!profile) return resolvedConfig;

    const baseline = {
      industry: profile.industry,
      environment: profile.environment,
      naming: profile.naming,
      classification: profile.classification,
      modules: profile.modules,
      adapters: profile.adapters,
      overlays: profile.overlays
    };

    return this._diff(baseline, resolvedConfig);
  }

  /** Validate resolved config has all required fields */
  validate(resolvedConfig) {
    const missing = [];
    const warnings = [];

    if (!resolvedConfig.clientName) missing.push('clientName');
    if (!resolvedConfig.industry) missing.push('industry');
    if (!resolvedConfig.naming?.orgPrefix) missing.push('naming.orgPrefix');

    if (!resolvedConfig.modules?.selected?.length && !resolvedConfig.modules?.recommended?.length) {
      warnings.push('No modules selected — no standards will be generated');
    }
    if (!resolvedConfig.adapters?.enabled?.length && !resolvedConfig.adapters?.recommended?.length) {
      warnings.push('No adapters enabled — no platform outputs will be generated');
    }
    if (resolvedConfig.classification?.tierCount !== resolvedConfig.classification?.tierLabels?.length) {
      warnings.push(`tierCount (${resolvedConfig.classification?.tierCount}) does not match tierLabels length (${resolvedConfig.classification?.tierLabels?.length})`);
    }

    return { valid: missing.length === 0, missing, warnings };
  }

  /** Get parameter schema for UI rendering */
  getParameterSchema() {
    return [
      { path: 'clientName', type: 'string', required: true, label: 'Client Name', description: 'Full client organization name', group: 'general' },
      { path: 'industry', type: 'select', required: true, label: 'Industry', description: 'Industry vertical', options: ['manufacturing', 'financial-services', 'healthcare', 'custom'], group: 'general' },
      { path: 'environment.cloud', type: 'select', required: true, label: 'Cloud Provider', options: ['azure', 'aws', 'gcp', 'hybrid'], group: 'environment' },
      { path: 'environment.dataplatform', type: 'select', required: true, label: 'Data Platform', options: ['fabric', 'databricks', 'synapse', 'snowflake'], group: 'environment' },
      { path: 'environment.governance', type: 'select', required: true, label: 'Governance Tool', options: ['purview', 'collibra', 'alation', 'custom'], group: 'environment' },
      { path: 'naming.orgPrefix', type: 'string', required: true, label: 'Org Prefix', description: '3-5 character organization abbreviation', group: 'naming' },
      { path: 'naming.separator', type: 'select', required: true, label: 'Separator', options: ['_', '-'], group: 'naming' },
      { path: 'classification.tierCount', type: 'number', required: true, label: 'Classification Tiers', description: 'Number of data classification tiers (3-5)', group: 'classification' },
      { path: 'classification.tierLabels', type: 'array', required: true, label: 'Tier Labels', description: 'Labels for each classification tier', group: 'classification' },
      { path: 'classification.regulatoryFrameworks', type: 'multiselect', required: false, label: 'Regulatory Frameworks', options: ['ITAR', 'EAR', 'SOX', 'PCI-DSS', 'HIPAA', 'GDPR', 'CCPA', 'NIST-800-171', 'CMMC', 'Basel-III', 'GLBA', 'HITECH', 'FDA-21CFR11'], group: 'classification' }
    ];
  }

  /** @private */
  _deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => this._deepClone(item));
    const clone = {};
    for (const key of Object.keys(obj)) clone[key] = this._deepClone(obj[key]);
    return clone;
  }

  /** @private Compute diff between two objects */
  _diff(baseline, current) {
    const delta = {};
    for (const key of Object.keys(current)) {
      if (!(key in baseline)) {
        delta[key] = current[key];
      } else if (typeof current[key] === 'object' && current[key] !== null && !Array.isArray(current[key]) &&
                 typeof baseline[key] === 'object' && baseline[key] !== null && !Array.isArray(baseline[key])) {
        const sub = this._diff(baseline[key], current[key]);
        if (Object.keys(sub).length > 0) delta[key] = sub;
      } else if (JSON.stringify(baseline[key]) !== JSON.stringify(current[key])) {
        delta[key] = current[key];
      }
    }
    return delta;
  }
}
window.ISL.ParameterResolver = ParameterResolver;
})();

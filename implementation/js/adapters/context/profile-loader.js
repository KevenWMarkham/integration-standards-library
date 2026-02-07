/**
 * ISL Implementation Accelerator — Profile Loader
 * Loads and manages industry profiles (embedded inline for browser use).
 */
(function() {
class ProfileLoader {
  constructor() {
    this._profiles = new Map();
    this._loadBuiltinProfiles();
  }

  /** Get list of available profile IDs */
  getAvailableProfiles() {
    return [...this._profiles.keys()];
  }

  /** Load a profile by ID */
  load(profileId) {
    return this._profiles.get(profileId) || null;
  }

  /** Get profile metadata without full data (for selection UI) */
  getProfileSummary(profileId) {
    const p = this._profiles.get(profileId);
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      industry: p.industry,
      description: p.description,
      regulatoryFrameworks: p.classification?.regulatoryFrameworks || [],
      moduleRecommendations: p.modules?.recommended || [],
      adapterRecommendations: p.adapters?.recommended || [],
      overlays: Object.keys(p.overlays || {}).filter(k => p.overlays[k])
    };
  }

  /** Get all profile summaries */
  getAllSummaries() {
    return this.getAvailableProfiles().map(id => this.getProfileSummary(id)).filter(Boolean);
  }

  /** Register a custom profile (from JSON import) */
  registerProfile(profileId, profileData) {
    const validation = this.validate(profileData);
    if (!validation.valid) {
      throw new Error(`Invalid profile: ${validation.errors.join(', ')}`);
    }
    this._profiles.set(profileId, profileData);
  }

  /** Validate profile structure */
  validate(profileData) {
    const errors = [];
    if (!profileData) { errors.push('Profile data is required'); return { valid: false, errors }; }
    if (!profileData.id && profileData.id !== '') errors.push('Missing profile id');
    if (!profileData.name && profileData.name !== '') errors.push('Missing profile name');
    if (!profileData.environment) errors.push('Missing environment section');
    if (!profileData.naming) errors.push('Missing naming section');
    if (!profileData.classification) errors.push('Missing classification section');
    if (!profileData.modules) errors.push('Missing modules section');
    if (profileData.classification) {
      if (!Array.isArray(profileData.classification.tierLabels)) errors.push('classification.tierLabels must be an array');
      if (typeof profileData.classification.tierCount !== 'number') errors.push('classification.tierCount must be a number');
    }
    return { valid: errors.length === 0, errors };
  }

  /** @private Load all built-in profiles */
  _loadBuiltinProfiles() {
    this._profiles.set('manufacturing', {
      id: 'manufacturing',
      name: 'Manufacturing',
      description: 'Manufacturing industry profile with ITAR/EAR, IoT/OT, and ERP integration defaults. Aligned with ISL manufacturing overlays.',
      industry: 'manufacturing',
      environment: { cloud: 'azure', dataplatform: 'fabric', governance: 'purview' },
      naming: {
        orgPrefix: '', envCodes: { dev: 'd', test: 't', staging: 's', prod: 'p' }, separator: '_',
        domainPrefixes: { manufacturing: 'mfg', supplyChain: 'scm', quality: 'qms', maintenance: 'mnt', iot: 'iot', erp: 'erp', finance: 'fin', hr: 'hcm' }
      },
      classification: {
        tierCount: 4, tierLabels: ['Public', 'Internal', 'Confidential', 'Restricted'],
        regulatoryFrameworks: ['ITAR', 'EAR', 'SOX', 'NIST-800-171', 'CMMC'],
        specialCategories: ['CUI', 'ITAR-Controlled', 'OT-Safety-Critical']
      },
      modules: {
        recommended: ['ISL-03', 'ISL-04', 'ISL-01', 'ISL-06', 'ISL-02', 'ISL-05'],
        phaseMap: { foundation: ['ISL-03', 'ISL-04'], core: ['ISL-01', 'ISL-06'], advanced: ['ISL-02', 'ISL-05'] }
      },
      adapters: {
        recommended: ['fabric', 'purview', 'apim'],
        config: {
          fabric: { workspacePattern: '{{orgPrefix}}_{{envCode}}_{{domain}}_{{layer}}', lakehouseLayers: ['brz', 'slv', 'gld'], medallionEnabled: true },
          purview: { labelPrefix: '{{orgPrefix}}', autoClassification: true, itarLabelsEnabled: true },
          apim: { versioningStrategy: 'url-path', authMethod: 'oauth2', rateLimitDefault: 1000 }
        }
      },
      overlays: { itar: true, iot: true, erp: true, medallion: true }
    });

    this._profiles.set('financial-services', {
      id: 'financial-services',
      name: 'Financial Services',
      description: 'Financial services profile with SOX, PCI-DSS, GLBA, and Basel III compliance defaults.',
      industry: 'financial-services',
      environment: { cloud: 'azure', dataplatform: 'fabric', governance: 'purview' },
      naming: {
        orgPrefix: '', envCodes: { dev: 'd', test: 't', uat: 'u', staging: 's', prod: 'p' }, separator: '_',
        domainPrefixes: { retail: 'rtl', commercial: 'cml', treasury: 'trs', risk: 'rsk', compliance: 'cmp', trading: 'trd', payments: 'pay', lending: 'lnd' }
      },
      classification: {
        tierCount: 5, tierLabels: ['Public', 'Internal', 'Confidential', 'Highly Confidential', 'Restricted'],
        regulatoryFrameworks: ['SOX', 'PCI-DSS', 'GLBA', 'Basel-III', 'GDPR', 'CCPA'],
        specialCategories: ['PII', 'PCI-Cardholder', 'Material-Non-Public']
      },
      modules: {
        recommended: ['ISL-03', 'ISL-04', 'ISL-01', 'ISL-06', 'ISL-02', 'ISL-05'],
        phaseMap: { foundation: ['ISL-03', 'ISL-04'], core: ['ISL-01', 'ISL-06'], advanced: ['ISL-02', 'ISL-05'] }
      },
      adapters: {
        recommended: ['fabric', 'purview', 'apim'],
        config: {
          fabric: { workspacePattern: '{{orgPrefix}}_{{envCode}}_{{domain}}_{{layer}}', lakehouseLayers: ['brz', 'slv', 'gld', 'plt'], medallionEnabled: true },
          purview: { labelPrefix: '{{orgPrefix}}', autoClassification: true, pciLabelsEnabled: true, gdprLabelsEnabled: true },
          apim: { versioningStrategy: 'url-path', authMethod: 'oauth2', rateLimitDefault: 500, mTlsRequired: true }
        }
      },
      overlays: { pci: true, gdpr: true, sox: true, medallion: true }
    });

    this._profiles.set('healthcare', {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'Healthcare profile with HIPAA, HL7/FHIR, and PHI handling defaults.',
      industry: 'healthcare',
      environment: { cloud: 'azure', dataplatform: 'fabric', governance: 'purview' },
      naming: {
        orgPrefix: '', envCodes: { dev: 'd', test: 't', staging: 's', prod: 'p' }, separator: '_',
        domainPrefixes: { clinical: 'cln', pharmacy: 'phm', billing: 'bil', claims: 'clm', research: 'rch', genomics: 'gnm', imaging: 'img', ehr: 'ehr' }
      },
      classification: {
        tierCount: 4, tierLabels: ['Public', 'Internal', 'Confidential-PHI', 'Restricted-PHI'],
        regulatoryFrameworks: ['HIPAA', 'HITECH', 'FDA-21CFR11', 'GDPR'],
        specialCategories: ['PHI', 'ePHI', 'Psychotherapy-Notes', 'Genomic-Data', 'Substance-Abuse']
      },
      modules: {
        recommended: ['ISL-03', 'ISL-04', 'ISL-01', 'ISL-06', 'ISL-02'],
        phaseMap: { foundation: ['ISL-03', 'ISL-04'], core: ['ISL-01', 'ISL-06'], advanced: ['ISL-02'] }
      },
      adapters: {
        recommended: ['fabric', 'purview'],
        config: {
          fabric: { workspacePattern: '{{orgPrefix}}_{{envCode}}_{{domain}}_{{layer}}', lakehouseLayers: ['brz', 'slv', 'gld'], medallionEnabled: true, phiIsolation: true },
          purview: { labelPrefix: '{{orgPrefix}}', autoClassification: true, hipaaLabelsEnabled: true, phiDetection: true }
        }
      },
      overlays: { hipaa: true, fhir: true, phi: true, medallion: true }
    });

    this._profiles.set('_template', {
      id: '', name: '', description: 'Custom industry profile. Fill in all fields to create a new industry baseline.', industry: '',
      environment: { cloud: 'azure', dataplatform: 'fabric', governance: 'purview' },
      naming: { orgPrefix: '', envCodes: { dev: 'd', test: 't', staging: 's', prod: 'p' }, separator: '_', domainPrefixes: {} },
      classification: { tierCount: 4, tierLabels: ['Public', 'Internal', 'Confidential', 'Restricted'], regulatoryFrameworks: [], specialCategories: [] },
      modules: { recommended: [], phaseMap: { foundation: [], core: [], advanced: [] } },
      adapters: { recommended: [], config: {} },
      overlays: {}
    });
  }
}
window.ISL.ProfileLoader = ProfileLoader;
})();

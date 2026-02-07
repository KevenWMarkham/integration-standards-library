# ISL Plugin Development Guide

## Overview

Plugins extend the ISL Implementation Accelerator with adapters for platforms not covered by the built-in four (Fabric, Purview, APIM, Webhook). A plugin consists of a manifest file and an adapter class.

## Plugin Structure

```
plugins/
  my-plugin/
    manifest.json    # Plugin metadata and config schema
    adapter.js       # PluginAdapter implementation
```

## Manifest Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique plugin identifier (kebab-case) |
| `name` | string | Yes | Display name |
| `version` | string | Yes | Semantic version |
| `author` | string | No | Plugin author |
| `description` | string | No | What the plugin does |
| `modules` | string[] | Yes | ISL modules consumed (e.g., `["ISL-03", "ISL-04"]`) |
| `layer` | string | Yes | `"platform"` or `"context"` |
| `entryPoint` | string | Yes | Adapter JS file name |
| `minIslVersion` | string | No | Minimum ISL version required |
| `configSchema` | object | No | Additional config fields (see below) |

### Config Schema Fields

Each key in `configSchema` defines a UI field:

```json
{
  "fieldName": {
    "type": "string|number|boolean|select",
    "required": true,
    "default": "value",
    "label": "Display Label",
    "description": "Help text",
    "options": ["a", "b"]  // For select type only
  }
}
```

## PluginAdapter Class

Your adapter must extend `PluginAdapter` from `../../js/plugins/plugin-interface.js`:

```javascript
import { PluginAdapter } from '../../js/plugins/plugin-interface.js';

export default class MyAdapter extends PluginAdapter {
  validate()                          // Check required config
  transform(templates, resolvedConfig) // Generate outputs
  generateScripts(outputs)            // Create deployment scripts
}
```

### Required Methods

**`validate()`** — Return `{ valid: boolean, errors: string[] }`. Check that all required config fields from your manifest's `configSchema` are present.

**`transform(templates, resolvedConfig)`** — Generate platform-specific artifacts. Return `{ configs: [{name, content}], docs: [{name, content}], scripts: [] }`.

**`generateScripts(outputs)`** — Return deployment scripts as `[{ name, content, type }]`. Type is `"powershell"`, `"bash"`, or `"terraform"`.

### Helper Methods (inherited)

- `this.config` — Resolved client configuration
- `this.manifest` — Your manifest.json contents
- `this.getAdapterConfig()` — Your adapter-specific config from `config.adapters.config[id]`
- `this.addOutput(category, name, content)` — Track outputs
- `this.getOutputs()` — Get all tracked outputs

## Tutorial: Building a Snowflake Plugin

1. Create `plugins/snowflake/manifest.json`:
```json
{
  "id": "snowflake",
  "name": "Snowflake",
  "version": "1.0.0",
  "modules": ["ISL-03", "ISL-04"],
  "layer": "platform",
  "entryPoint": "adapter.js",
  "configSchema": {
    "accountUrl": { "type": "string", "required": true, "label": "Account URL" },
    "warehouse": { "type": "string", "required": false, "default": "COMPUTE_WH", "label": "Warehouse" }
  }
}
```

2. Create `plugins/snowflake/adapter.js`:
```javascript
import { PluginAdapter } from '../../js/plugins/plugin-interface.js';

export default class SnowflakeAdapter extends PluginAdapter {
  validate() {
    const ac = this.getAdapterConfig();
    const errors = [];
    if (!ac.accountUrl) errors.push('Account URL required');
    return { valid: errors.length === 0, errors };
  }

  transform(templates, config) {
    const naming = this.config.naming;
    // Generate Snowflake-specific configs...
    return {
      configs: [{ name: 'database-structure.json', content: '...' }],
      docs: [{ name: 'snowflake-guide.md', content: '...' }],
      scripts: []
    };
  }

  generateScripts() {
    return [{ name: 'deploy-snowflake.sql', content: '...', type: 'sql' }];
  }
}
```

3. Register in your app code:
```javascript
import manifest from '../plugins/snowflake/manifest.json';
import SnowflakeAdapter from '../plugins/snowflake/adapter.js';
pluginRegistry.register(manifest, SnowflakeAdapter);
```

## Output Conventions

| Directory | Contents |
|-----------|----------|
| `configs/` | Platform-native configuration files (JSON, XML, YAML) |
| `docs/` | Human-readable guides and adapted standards (Markdown) |
| `scripts/` | Deployment automation (PowerShell, Bash, Terraform, SQL) |

## Reference Implementation

See `_example-plugin/` for a complete Databricks Unity Catalog plugin.

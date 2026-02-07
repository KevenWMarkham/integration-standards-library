/**
 * ISL Implementation Accelerator — Template Transformer
 * Lightweight template engine: {{dot.path}} substitution, conditionals, loops, filters.
 */
(function() {
class TemplateTransformer {
  /** @param {object} resolvedConfig */
  constructor(resolvedConfig) {
    this._config = resolvedConfig;
    this._filters = {
      upper: v => String(v).toUpperCase(),
      lower: v => String(v).toLowerCase(),
      title: v => String(v).replace(/\b\w/g, c => c.toUpperCase()),
      kebab: v => String(v).replace(/[\s_]+/g, '-').toLowerCase(),
      snake: v => String(v).replace(/[\s-]+/g, '_').toLowerCase(),
      trim: v => String(v).trim()
    };
  }

  /** Transform a template string, replacing all placeholders and processing blocks */
  transform(templateString) {
    let result = templateString;
    result = this.processLoops(result);
    result = this.processConditionals(result);
    result = this._replacePlaceholders(result);
    return result;
  }

  /** Resolve a single dot-path against config */
  resolvePlaceholder(path) {
    const value = path.split('.').reduce(
      (obj, key) => (obj != null ? obj[key] : undefined),
      this._config
    );
    return value !== undefined ? value : '';
  }

  /** Process {{#if condition}}...{{/if}} and {{#unless condition}}...{{/unless}} */
  processConditionals(templateString) {
    let result = templateString;
    // {{#if condition}}...{{else}}...{{/if}}
    const ifElseRe = /\{\{#if\s+(.+?)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g;
    result = result.replace(ifElseRe, (_, cond, ifBlock, elseBlock) =>
      this.evaluateCondition(cond.trim()) ? ifBlock : elseBlock
    );
    // {{#if condition}}...{{/if}}
    const ifRe = /\{\{#if\s+(.+?)\}\}([\s\S]*?)\{\{\/if\}\}/g;
    result = result.replace(ifRe, (_, cond, block) =>
      this.evaluateCondition(cond.trim()) ? block : ''
    );
    // {{#unless condition}}...{{/unless}}
    const unlessRe = /\{\{#unless\s+(.+?)\}\}([\s\S]*?)\{\{\/unless\}\}/g;
    result = result.replace(unlessRe, (_, cond, block) =>
      this.evaluateCondition(cond.trim()) ? '' : block
    );
    return result;
  }

  /** Process {{#each items}}...{{/each}} */
  processLoops(templateString) {
    const eachRe = /\{\{#each\s+(.+?)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    return templateString.replace(eachRe, (_, path, block) => {
      const items = this.resolvePlaceholder(path.trim());
      if (!Array.isArray(items)) return '';
      return items.map((item, index) => {
        let rendered = block;
        rendered = rendered.replace(/\{\{\.\}\}/g, String(item));
        rendered = rendered.replace(/\{\{@index\}\}/g, String(index));
        rendered = rendered.replace(/\{\{@first\}\}/g, String(index === 0));
        rendered = rendered.replace(/\{\{@last\}\}/g, String(index === items.length - 1));
        if (typeof item === 'object' && item !== null) {
          for (const [k, v] of Object.entries(item)) {
            rendered = rendered.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
          }
        }
        return rendered;
      }).join('');
    });
  }

  /** Evaluate a condition expression */
  evaluateCondition(expression) {
    // Handle && and ||
    if (expression.includes('&&')) {
      return expression.split('&&').every(part => this.evaluateCondition(part.trim()));
    }
    if (expression.includes('||')) {
      return expression.split('||').some(part => this.evaluateCondition(part.trim()));
    }
    // Comparison operators
    const ops = ['===', '!==', '>=', '<=', '>', '<', ' includes '];
    for (const op of ops) {
      const idx = expression.indexOf(op);
      if (idx !== -1) {
        const left = this._resolveExprValue(expression.slice(0, idx).trim());
        const right = this._resolveExprValue(expression.slice(idx + op.length).trim());
        switch (op.trim()) {
          case '===': return String(left) === String(right);
          case '!==': return String(left) !== String(right);
          case '>=': return Number(left) >= Number(right);
          case '<=': return Number(left) <= Number(right);
          case '>': return Number(left) > Number(right);
          case '<': return Number(left) < Number(right);
          case 'includes': return Array.isArray(left) ? left.includes(right) : String(left).includes(String(right));
        }
      }
    }
    // Truthy check on a single value
    const val = this._resolveExprValue(expression);
    if (Array.isArray(val)) return val.length > 0;
    return !!val;
  }

  /** Extract all placeholders from a template */
  extractPlaceholders(templateString) {
    const re = /\{\{(?!#|\/|else|@)([^}|]+?)(?:\|[^}]+)?\}\}/g;
    const paths = new Set();
    let m;
    while ((m = re.exec(templateString)) !== null) {
      const p = m[1].trim();
      if (p !== '.') paths.add(p);
    }
    return [...paths];
  }

  /** Validate all placeholders can be resolved */
  validate(templateString) {
    const paths = this.extractPlaceholders(templateString);
    const missing = paths.filter(p => {
      const val = this.resolvePlaceholder(p);
      return val === '' || val === undefined;
    });
    return { valid: missing.length === 0, missing };
  }

  /** Register a custom filter */
  registerFilter(name, fn) {
    this._filters[name] = fn;
  }

  /** @private Replace {{path}} and {{path | filter}} */
  _replacePlaceholders(str) {
    return str.replace(/\{\{(?!#|\/|else|@)([^}]+?)\}\}/g, (_, expr) => {
      const parts = expr.split('|').map(s => s.trim());
      const path = parts[0];
      let value = this.resolvePlaceholder(path);
      if (value === undefined || value === null) value = '';
      if (Array.isArray(value)) value = value.join(', ');
      for (let i = 1; i < parts.length; i++) {
        const filterName = parts[i];
        if (this._filters[filterName]) {
          value = this._filters[filterName](value);
        }
      }
      return String(value);
    });
  }

  /** @private Resolve a value from an expression token (literal or config path) */
  _resolveExprValue(token) {
    if (/^["'](.*)["']$/.test(token)) return token.slice(1, -1);
    if (/^\d+(\.\d+)?$/.test(token)) return Number(token);
    if (token === 'true') return true;
    if (token === 'false') return false;
    return this.resolvePlaceholder(token);
  }
}
window.ISL.TemplateTransformer = TemplateTransformer;
})();

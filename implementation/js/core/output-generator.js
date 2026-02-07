/**
 * ISL Implementation Accelerator — Output Generator
 * Bundles adapted content into downloadable packages with minimal ZIP builder.
 */
(function() {
class OutputGenerator {
  /** @param {string} clientName */
  constructor(clientName) {
    this._clientName = clientName || 'client';
    this._outputs = new Map(); // adapterName → { configs:[], docs:[], scripts:[], manifests:[] }
    this._manifest = null;
  }

  /** Add an output entry from an adapter */
  addOutput(adapterName, category, filename, content) {
    if (!this._outputs.has(adapterName)) {
      this._outputs.set(adapterName, { configs: [], docs: [], scripts: [], manifests: [] });
    }
    const bucket = this._outputs.get(adapterName);
    if (bucket[category]) {
      bucket[category].push({ filename, content });
    }
  }

  /** Generate the complete output manifest */
  generateManifest(config, adapterResults) {
    this._manifest = {
      generatedAt: new Date().toISOString(),
      islVersion: config?.metadata?.islVersion || '1.0.0',
      clientName: this._clientName,
      industry: config?.industry || '',
      profile: config?.industry || 'custom',
      modulesDeployed: config?.modules?.selected || [],
      adaptersExecuted: [...this._outputs.keys()],
      outputSummary: this.getSummary(),
      configSnapshot: {
        environment: config?.environment,
        naming: config?.naming,
        classification: config?.classification,
        adapters: config?.adapters
      },
      adapterManifests: adapterResults || {}
    };
    return this._manifest;
  }

  /** Bundle all outputs into structured object */
  bundle() {
    const adapters = {};
    for (const [name, buckets] of this._outputs) {
      adapters[name] = {
        configs: buckets.configs.map(f => f.filename),
        docs: buckets.docs.map(f => f.filename),
        scripts: buckets.scripts.map(f => f.filename)
      };
    }
    return { adapters, manifest: this._manifest };
  }

  /** Generate a downloadable ZIP blob (Store method — no compression, no dependencies) */
  async generateZip() {
    const files = [];
    const root = this._sanitizeName(this._clientName);

    // Add manifest
    if (this._manifest) {
      files.push({ path: `${root}/manifest.json`, data: JSON.stringify(this._manifest, null, 2) });
    }

    // Add adapter outputs
    for (const [adapterName, buckets] of this._outputs) {
      for (const category of ['configs', 'docs', 'scripts', 'manifests']) {
        for (const file of buckets[category]) {
          files.push({
            path: `${root}/${adapterName}/${category}/${file.filename}`,
            data: file.content
          });
        }
      }
    }

    return this._buildZip(files);
  }

  /** Download a single file */
  downloadFile(filename, content, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /** Download complete ZIP package */
  async downloadAll() {
    const blob = await this.generateZip();
    const ts = new Date().toISOString().slice(0, 10);
    this.downloadFile(`${this._sanitizeName(this._clientName)}_ISL_${ts}.zip`, blob, 'application/zip');
  }

  /** Get output summary statistics */
  getSummary() {
    let totalFiles = 0;
    const byAdapter = {};
    const byCategory = { configs: 0, docs: 0, scripts: 0, manifests: 0 };

    for (const [name, buckets] of this._outputs) {
      let adapterCount = 0;
      for (const cat of ['configs', 'docs', 'scripts', 'manifests']) {
        const count = buckets[cat].length;
        adapterCount += count;
        byCategory[cat] += count;
      }
      byAdapter[name] = adapterCount;
      totalFiles += adapterCount;
    }

    return { totalFiles, byAdapter, byCategory };
  }

  /** Clear all outputs */
  clear() {
    this._outputs.clear();
    this._manifest = null;
  }

  /** @private Sanitize a name for filesystem use */
  _sanitizeName(name) {
    return name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  }

  /**
   * @private Minimal ZIP builder (Store method — no compression)
   * Produces a valid ZIP file containing UTF-8 text files.
   */
  _buildZip(files) {
    const encoder = new TextEncoder();
    const entries = [];
    let offset = 0;

    // Build local file entries
    for (const file of files) {
      const nameBytes = encoder.encode(file.path);
      const dataBytes = encoder.encode(file.data);
      const crc = this._crc32(dataBytes);

      // Local file header (30 bytes + name + data)
      const header = new ArrayBuffer(30);
      const hv = new DataView(header);
      hv.setUint32(0, 0x04034b50, true);   // signature
      hv.setUint16(4, 20, true);             // version needed
      hv.setUint16(6, 0x0800, true);         // flags (UTF-8)
      hv.setUint16(8, 0, true);              // compression: store
      hv.setUint16(10, 0, true);             // mod time
      hv.setUint16(12, 0, true);             // mod date
      hv.setUint32(14, crc, true);           // crc32
      hv.setUint32(18, dataBytes.length, true); // compressed size
      hv.setUint32(22, dataBytes.length, true); // uncompressed size
      hv.setUint16(26, nameBytes.length, true); // name length
      hv.setUint16(28, 0, true);             // extra length

      entries.push({
        headerOffset: offset,
        nameBytes,
        dataBytes,
        crc,
        localHeader: new Uint8Array(header)
      });

      offset += 30 + nameBytes.length + dataBytes.length;
    }

    // Build central directory
    const centralParts = [];
    let centralSize = 0;
    for (const entry of entries) {
      const cd = new ArrayBuffer(46);
      const cv = new DataView(cd);
      cv.setUint32(0, 0x02014b50, true);    // signature
      cv.setUint16(4, 20, true);              // version made by
      cv.setUint16(6, 20, true);              // version needed
      cv.setUint16(8, 0x0800, true);          // flags (UTF-8)
      cv.setUint16(10, 0, true);              // compression
      cv.setUint16(12, 0, true);              // mod time
      cv.setUint16(14, 0, true);              // mod date
      cv.setUint32(16, entry.crc, true);
      cv.setUint32(20, entry.dataBytes.length, true);
      cv.setUint32(24, entry.dataBytes.length, true);
      cv.setUint16(28, entry.nameBytes.length, true);
      cv.setUint16(30, 0, true);              // extra length
      cv.setUint16(32, 0, true);              // comment length
      cv.setUint16(34, 0, true);              // disk number
      cv.setUint16(36, 0, true);              // internal attrs
      cv.setUint32(38, 0, true);              // external attrs
      cv.setUint32(42, entry.headerOffset, true);

      centralParts.push(new Uint8Array(cd));
      centralParts.push(entry.nameBytes);
      centralSize += 46 + entry.nameBytes.length;
    }

    // End of central directory
    const eocd = new ArrayBuffer(22);
    const ev = new DataView(eocd);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, entries.length, true);
    ev.setUint16(10, entries.length, true);
    ev.setUint32(12, centralSize, true);
    ev.setUint32(16, offset, true);
    ev.setUint16(20, 0, true);

    // Assemble final blob
    const parts = [];
    for (const entry of entries) {
      parts.push(entry.localHeader);
      parts.push(entry.nameBytes);
      parts.push(entry.dataBytes);
    }
    for (const part of centralParts) {
      parts.push(part);
    }
    parts.push(new Uint8Array(eocd));

    return new Blob(parts, { type: 'application/zip' });
  }

  /** @private CRC32 calculation */
  _crc32(bytes) {
    if (!OutputGenerator._crcTable) {
      const table = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
          c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c;
      }
      OutputGenerator._crcTable = table;
    }
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) {
      crc = OutputGenerator._crcTable[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
}
window.ISL.OutputGenerator = OutputGenerator;
})();

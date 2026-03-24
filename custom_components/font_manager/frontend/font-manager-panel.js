/**
 * Home Assistant Custom Fonts Panel
 *
 * A custom panel element that renders the Home Assistant Custom Fonts settings UI
 * inside Home Assistant's sidebar navigation.
 *
 * Registered as <font-manager-panel> web component.
 * HA passes `hass` and `narrow` properties automatically.
 */

// ─── Styles ──────────────────────────────────────────────────────────────────

const PANEL_CSS = `
  :host {
    display: block;
    background: var(--primary-background-color);
    min-height: 100vh;
  }

  .panel-wrap {
    max-width: 820px;
    margin: 0 auto;
    padding: 16px;
  }

  h1.title {
    font-size: 24px;
    font-weight: 500;
    margin: 0 0 4px;
    color: var(--primary-text-color);
  }

  .subtitle {
    color: var(--secondary-text-color);
    margin: 0 0 24px;
    font-size: 14px;
  }

  .card {
    background: var(--card-background-color);
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 16px;
    box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,.1));
  }

  .card h2 {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 16px;
    color: var(--primary-text-color);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .row label {
    font-size: 14px;
    color: var(--primary-text-color);
    min-width: 180px;
  }

  .row .hint {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }

  .row-col {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 4px;
  }

  select, input[type="text"], input[type="number"], input[type="url"] {
    width: 100%;
    max-width: 380px;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid var(--divider-color);
    background: var(--primary-background-color);
    color: var(--primary-text-color);
    font-size: 14px;
    font-family: inherit;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s;
  }

  select:focus, input:focus {
    border-color: var(--primary-color);
  }

  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 26px;
    flex-shrink: 0;
  }

  .toggle-switch input { opacity: 0; width: 0; height: 0; }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background: var(--divider-color);
    border-radius: 26px;
    transition: background 0.3s;
  }

  .toggle-slider::before {
    content: "";
    position: absolute;
    height: 20px; width: 20px;
    left: 3px; bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
  }

  .toggle-switch input:checked + .toggle-slider {
    background: var(--primary-color);
  }

  .toggle-switch input:checked + .toggle-slider::before {
    transform: translateX(22px);
  }

  .preview-box {
    background: var(--primary-background-color);
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    padding: 20px;
    margin-top: 8px;
  }

  .preview-box .preview-text {
    margin: 0;
    line-height: 1.6;
  }

  .preview-box .preview-large { font-size: 28px; font-weight: 700; }
  .preview-box .preview-medium { font-size: 18px; font-weight: 400; }
  .preview-box .preview-small { font-size: 13px; color: var(--secondary-text-color); }
  .preview-box .preview-mono { font-size: 14px; font-family: monospace; margin-top: 6px; }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s, filter 0.2s;
    font-family: inherit;
  }

  .btn:hover { filter: brightness(1.08); }
  .btn:active { opacity: 0.8; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-primary {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  .btn-danger {
    background: var(--error-color, #db4437);
    color: white;
  }

  .btn-secondary {
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
  }

  .btn-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 16px;
  }

  .preset-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  .preset-chip {
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid var(--divider-color);
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }

  .preset-chip:hover, .preset-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }

  .upload-zone {
    border: 2px dashed var(--divider-color);
    border-radius: 8px;
    padding: 32px 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    margin-top: 8px;
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--primary-color);
    background: var(--primary-background-color);
  }

  .upload-zone p { margin: 4px 0; color: var(--secondary-text-color); font-size: 14px; }
  .upload-zone .upload-icon { font-size: 32px; margin-bottom: 8px; }

  .font-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }

  .font-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: var(--primary-background-color);
    border-radius: 8px;
    border: 1px solid var(--divider-color);
    gap: 8px;
  }

  .font-item .font-info { flex: 1; }
  .font-item .font-name { font-size: 14px; font-weight: 500; }
  .font-item .font-meta { font-size: 12px; color: var(--secondary-text-color); }

  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: var(--primary-text-color);
    color: var(--primary-background-color);
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 9999;
    transition: transform 0.3s ease;
    pointer-events: none;
  }

  .toast.show { transform: translateX(-50%) translateY(0); }

  .status-badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    margin-left: 8px;
  }

  .status-badge.on { background: var(--success-color, #4caf50); color: white; }
  .status-badge.off { background: var(--divider-color); color: var(--secondary-text-color); }

  .divider { border: none; border-top: 1px solid var(--divider-color); margin: 16px 0; }

  @media (max-width: 600px) {
    .panel-wrap { padding: 8px; }
    select, input { max-width: 100%; }
    .row { flex-direction: column; align-items: flex-start; }
  }
`;

// ─── Template ────────────────────────────────────────────────────────────────

const PANEL_HTML = `
  <div class="panel-wrap">
    <h1 class="title">
      Home Assistant Custom Fonts
      <span class="status-badge" id="statusBadge">OFF</span>
    </h1>
    <p class="subtitle">Globally customize fonts across the entire Home Assistant interface</p>

    <!-- Enable / Disable -->
    <div class="card">
      <h2>⚙️ General</h2>
      <div class="row">
        <div class="row-col">
          <label>Enable Home Assistant Custom Fonts</label>
          <span class="hint">Apply custom fonts globally to all UI elements</span>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" id="toggleEnabled">
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="row">
        <div class="row-col">
          <label>Apply to Shadow DOM</label>
          <span class="hint">Inject fonts into Web Components (recommended)</span>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" id="toggleShadow">
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    <!-- Font Source -->
    <div class="card">
      <h2>🔤 Font Source</h2>
      <div class="row">
        <label>Source</label>
        <select id="fontSource">
          <option value="google">Google Fonts</option>
          <option value="custom">Custom / Uploaded</option>
          <option value="system">System Font</option>
        </select>
      </div>

      <!-- Google Fonts section -->
      <div id="sectionGoogle">
        <div class="row">
          <label>Font Name</label>
          <input type="text" id="fontFamily" placeholder="e.g. Roboto">
        </div>
        <div class="row">
          <div class="row-col">
            <label>Google Fonts CSS URL</label>
            <span class="hint">Paste the full stylesheet URL from fonts.google.com</span>
          </div>
          <input type="url" id="fontUrl" placeholder="https://fonts.googleapis.com/css2?family=...">
        </div>
        <p style="font-size:13px;color:var(--secondary-text-color);margin:8px 0 4px">Quick presets:</p>
        <div class="preset-grid" id="presetGrid"></div>
      </div>

      <!-- Custom font section -->
      <div id="sectionCustom" style="display:none">
        <div class="row">
          <label>Font Family Name</label>
          <input type="text" id="customFontFamily" placeholder="MyFont">
        </div>
        <div class="row">
          <div class="row-col">
            <label>Font File URL</label>
            <span class="hint">Direct URL to .woff2 / .woff / .ttf file, or upload below</span>
          </div>
          <input type="url" id="customFontUrl" placeholder="/font_manager/fonts/my-font.woff2">
        </div>
        <div class="upload-zone" id="uploadZone">
          <div class="upload-icon">📁</div>
          <p><strong>Drop font file here</strong> or click to browse</p>
          <p>.woff2, .woff, .ttf, .otf · max 10 MB</p>
          <input type="file" id="fileInput" accept=".woff2,.woff,.ttf,.otf" style="display:none">
        </div>
        <div class="font-list" id="fontList"></div>
      </div>

      <!-- System font section -->
      <div id="sectionSystem" style="display:none">
        <div class="row">
          <div class="row-col">
            <label>System Font Stack</label>
            <span class="hint">Uses the OS default font. Home Assistant Custom Fonts will apply fallback chain.</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Typography -->
    <div class="card">
      <h2>📐 Typography</h2>
      <div class="row">
        <div class="row-col">
          <label>Base Font Size (px)</label>
          <span class="hint">Set to 0 to keep Home Assistant's default</span>
        </div>
        <input type="number" id="fontSize" min="0" max="32" step="1" placeholder="0" style="max-width:100px">
      </div>
    </div>

    <!-- Preview -->
    <div class="card">
      <h2>👁 Live Preview</h2>
      <div class="preview-box" id="previewBox">
        <p class="preview-text preview-large" id="previewLarge">Home Assistant</p>
        <p class="preview-text preview-medium" id="previewMedium">Living Room · 21°C · All lights on</p>
        <p class="preview-text preview-small" id="previewSmall">Updated 2 minutes ago · 3 automations active</p>
        <p class="preview-text preview-mono" id="previewMono">sensor.temperature: 21.4 °C</p>
      </div>
      <div style="margin-top:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <label style="font-size:13px;color:var(--secondary-text-color)">Preview text:</label>
        <input type="text" id="previewInput" placeholder="Type here to preview…"
          style="max-width:320px;padding:6px 10px;font-size:13px">
      </div>
    </div>

    <!-- Actions -->
    <div class="card">
      <h2>💾 Actions</h2>
      <div class="btn-group">
        <button class="btn btn-primary" id="btnSave">💾 Save Changes</button>
        <button class="btn btn-secondary" id="btnReload">🔄 Reload Fonts</button>
        <button class="btn btn-danger" id="btnReset">↩ Reset to Defaults</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toast"></div>
`;

// ─── Component ────────────────────────────────────────────────────────────────

class FontManagerPanel extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._config = null;
    this._fonts = [];
    this._shadow = this.attachShadow({ mode: "open" });
    this._initialized = false;
  }

  /** Called by HA when the hass object is available or updated. */
  set hass(hass) {
    this._hass = hass;
    if (!this._initialized) {
      this._initialized = true;
      this._render();
      this._loadAll();
    }
  }

  /** Initial render — inject styles + HTML. */
  _render() {
    const style = document.createElement("style");
    style.textContent = PANEL_CSS;
    this._shadow.appendChild(style);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = PANEL_HTML;
    this._shadow.appendChild(wrapper);

    this._bindEvents();
  }

  // ── Data loading ────────────────────────────────────────────────────────────

  async _loadAll() {
    await Promise.all([this._loadConfig(), this._loadFonts()]);
  }

  async _loadConfig() {
    try {
      const data = await this._hass.callApi("GET", "font_manager/config");
      this._config = data;
      this._populateForm(data);
      this._updatePreview();
    } catch (err) {
      this._toast("Failed to load config: " + err.message, "error");
    }
  }

  async _loadFonts() {
    try {
      const data = await this._hass.callApi("GET", "font_manager/fonts");
      this._fonts = data.fonts ?? [];
      this._renderFontList();
    } catch {
      this._fonts = [];
    }
  }

  // ── Form population ─────────────────────────────────────────────────────────

  _populateForm(cfg) {
    const s = this._shadow;

    // Status badge
    const badge = s.getElementById("statusBadge");
    badge.textContent = cfg.enabled ? "ON" : "OFF";
    badge.className = `status-badge ${cfg.enabled ? "on" : "off"}`;

    // Toggles
    s.getElementById("toggleEnabled").checked = !!cfg.enabled;
    s.getElementById("toggleShadow").checked = cfg.apply_to_shadow_dom !== false;

    // Font source
    s.getElementById("fontSource").value = cfg.font_source ?? "google";
    this._updateSourceSection(cfg.font_source ?? "google");

    // Fields
    s.getElementById("fontFamily").value = cfg.font_family ?? "";
    s.getElementById("fontUrl").value = cfg.font_url ?? "";
    s.getElementById("customFontFamily").value = cfg.font_family ?? "";
    s.getElementById("customFontUrl").value =
      cfg.font_source === "custom" ? (cfg.font_url ?? "") : "";
    s.getElementById("fontSize").value = cfg.font_size ?? 0;

    // Preset chips
    this._renderPresets(cfg);
  }

  _renderPresets(cfg) {
    const presets = this._config?.presets ?? {};
    const grid = this._shadow.getElementById("presetGrid");
    grid.innerHTML = "";

    Object.entries(presets).forEach(([name, url]) => {
      const chip = document.createElement("button");
      chip.className = "preset-chip" + (cfg.font_family === name ? " active" : "");
      chip.textContent = name;
      chip.style.fontFamily = `'${name}', sans-serif`;
      chip.addEventListener("click", () => this._applyPreset(name, url));
      grid.appendChild(chip);
    });
  }

  _applyPreset(name, url) {
    const s = this._shadow;
    s.getElementById("fontFamily").value = name;
    s.getElementById("fontUrl").value = url;
    s.getElementById("fontSource").value = "google";
    this._updateSourceSection("google");

    // Update active chip
    s.querySelectorAll(".preset-chip").forEach((c) => {
      c.classList.toggle("active", c.textContent === name);
    });

    this._updatePreview();
  }

  _updateSourceSection(source) {
    const s = this._shadow;
    s.getElementById("sectionGoogle").style.display =
      source === "google" ? "" : "none";
    s.getElementById("sectionCustom").style.display =
      source === "custom" ? "" : "none";
    s.getElementById("sectionSystem").style.display =
      source === "system" ? "" : "none";
  }

  // ── Font list (uploaded) ────────────────────────────────────────────────────

  _renderFontList() {
    const list = this._shadow.getElementById("fontList");
    list.innerHTML = "";

    if (this._fonts.length === 0) {
      list.innerHTML =
        '<p style="font-size:13px;color:var(--secondary-text-color);margin:8px 0">No fonts uploaded yet.</p>';
      return;
    }

    this._fonts.forEach((font) => {
      const item = document.createElement("div");
      item.className = "font-item";
      item.innerHTML = `
        <div class="font-info">
          <div class="font-name" style="font-family:'${font.family}',sans-serif">${font.family}</div>
          <div class="font-meta">${font.name} · ${this._fmtSize(font.size)}</div>
        </div>
        <button class="btn btn-secondary" data-use="${font.name}" data-url="${font.url}" data-family="${font.family}">
          Use
        </button>
        <button class="btn btn-danger" data-delete="${font.name}" style="padding:9px 12px">🗑</button>
      `;

      item.querySelector("[data-use]").addEventListener("click", (e) => {
        const btn = e.currentTarget;
        this._shadow.getElementById("customFontFamily").value = btn.dataset.family;
        this._shadow.getElementById("customFontUrl").value = btn.dataset.url;
        this._updatePreview();
      });

      item.querySelector("[data-delete]").addEventListener("click", (e) => {
        this._deleteFont(e.currentTarget.dataset.delete);
      });

      list.appendChild(item);
    });
  }

  _fmtSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  }

  // ── Preview ─────────────────────────────────────────────────────────────────

  _updatePreview() {
    const s = this._shadow;
    const source = s.getElementById("fontSource").value;
    let family = "";
    let url = "";

    if (source === "google") {
      family = s.getElementById("fontFamily").value;
      url = s.getElementById("fontUrl").value;
    } else if (source === "custom") {
      family = s.getElementById("customFontFamily").value;
      url = s.getElementById("customFontUrl").value;
    }

    // Inject preview @font-face / link
    this._injectPreviewFont(family, url, source);

    // Apply font to preview elements
    const previewEls = s.querySelectorAll(".preview-text");
    const stack = family ? `'${family}', system-ui, sans-serif` : "system-ui, sans-serif";
    previewEls.forEach((el) => (el.style.fontFamily = stack));

    const size = parseInt(s.getElementById("fontSize").value, 10);
    if (size > 0) {
      previewEls.forEach((el) => (el.style.fontSize = ""));
      s.getElementById("previewBox").style.fontSize = size + "px";
    } else {
      s.getElementById("previewBox").style.fontSize = "";
    }
  }

  _injectPreviewFont(family, url, source) {
    const s = this._shadow;
    const existing = s.querySelector("#previewFontStyle");
    if (existing) existing.remove();

    if (!family) return;

    const style = document.createElement("style");
    style.id = "previewFontStyle";

    if (source === "google" && url) {
      // We can't use @import inside shadow DOM easily for Google Fonts,
      // so inject the link into document head for preview purposes.
      let previewLink = document.querySelector("#fm-preview-link");
      if (!previewLink) {
        previewLink = document.createElement("link");
        previewLink.id = "fm-preview-link";
        previewLink.rel = "stylesheet";
        document.head.appendChild(previewLink);
      }
      previewLink.href = url;
    } else if (source === "custom" && url) {
      const ext = url.split(".").pop().toLowerCase();
      const fmt = { woff2: "woff2", woff: "woff", ttf: "truetype", otf: "opentype" }[ext] ?? "woff2";
      style.textContent = `
        @font-face {
          font-family: '${family}';
          src: url('${url}') format('${fmt}');
          font-display: swap;
        }
      `;
    }

    s.appendChild(style);
  }

  // ── Event binding ───────────────────────────────────────────────────────────

  _bindEvents() {
    const s = this._shadow;

    // Enable toggle
    s.getElementById("toggleEnabled").addEventListener("change", () => {
      const badge = s.getElementById("statusBadge");
      const on = s.getElementById("toggleEnabled").checked;
      badge.textContent = on ? "ON" : "OFF";
      badge.className = `status-badge ${on ? "on" : "off"}`;
    });

    // Source selector
    s.getElementById("fontSource").addEventListener("change", (e) => {
      this._updateSourceSection(e.target.value);
      this._updatePreview();
    });

    // Live preview on input
    ["fontFamily", "fontUrl", "customFontFamily", "customFontUrl", "fontSize"].forEach(
      (id) => s.getElementById(id)?.addEventListener("input", () => this._updatePreview())
    );

    // Custom preview text
    s.getElementById("previewInput").addEventListener("input", (e) => {
      const val = e.target.value;
      if (val) {
        s.getElementById("previewLarge").textContent = val;
        s.getElementById("previewMedium").textContent = val;
        s.getElementById("previewSmall").textContent = val;
      } else {
        s.getElementById("previewLarge").textContent = "Home Assistant";
        s.getElementById("previewMedium").textContent = "Living Room · 21°C · All lights on";
        s.getElementById("previewSmall").textContent = "Updated 2 minutes ago · 3 automations active";
      }
    });

    // Upload zone
    const zone = s.getElementById("uploadZone");
    const fileInput = s.getElementById("fileInput");

    zone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => this._handleFileSelect(e.target.files[0]));

    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      this._handleFileSelect(e.dataTransfer.files[0]);
    });

    // Buttons
    s.getElementById("btnSave").addEventListener("click", () => this._save());
    s.getElementById("btnReload").addEventListener("click", () => this._reloadFonts());
    s.getElementById("btnReset").addEventListener("click", () => this._reset());
  }

  // ── Save ────────────────────────────────────────────────────────────────────

  async _save() {
    const s = this._shadow;
    const source = s.getElementById("fontSource").value;

    const config = {
      enabled: s.getElementById("toggleEnabled").checked,
      apply_to_shadow_dom: s.getElementById("toggleShadow").checked,
      font_source: source,
      font_family:
        source === "custom"
          ? s.getElementById("customFontFamily").value.trim()
          : source === "google"
          ? s.getElementById("fontFamily").value.trim()
          : "system-ui",
      font_url:
        source === "custom"
          ? s.getElementById("customFontUrl").value.trim()
          : source === "google"
          ? s.getElementById("fontUrl").value.trim()
          : "",
      font_size: parseInt(s.getElementById("fontSize").value, 10) || null,
    };

    const btn = s.getElementById("btnSave");
    btn.disabled = true;
    btn.textContent = "Saving…";

    try {
      await this._hass.callApi("POST", "font_manager/config", config);
      this._config = { ...this._config, ...config };
      this._toast("✓ Settings saved. Fonts applied to all open tabs.");
      this._populateForm(this._config);
    } catch (err) {
      this._toast("Failed to save: " + err.message, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "💾 Save Changes";
    }
  }

  async _reloadFonts() {
    try {
      await this._hass.callService("font_manager", "apply", {});
      this._toast("✓ Fonts reloaded in all tabs.");
    } catch {
      // Fallback: reload page
      window.location.reload();
    }
  }

  async _reset() {
    if (!confirm("Reset all Home Assistant Custom Fonts settings to defaults?")) return;
    const defaults = {
      enabled: true,
      font_source: "google",
      font_family: "Roboto",
      font_url: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
      font_size: null,
      apply_to_shadow_dom: true,
    };
    try {
      await this._hass.callApi("POST", "font_manager/config", defaults);
      this._config = { ...this._config, ...defaults };
      this._populateForm(this._config);
      this._updatePreview();
      this._toast("✓ Settings reset to defaults.");
    } catch (err) {
      this._toast("Failed to reset: " + err.message, "error");
    }
  }

  // ── Font upload ─────────────────────────────────────────────────────────────

  async _handleFileSelect(file) {
    if (!file) return;

    const allowed = [".woff2", ".woff", ".ttf", ".otf"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      this._toast("Unsupported format. Use .woff2, .woff, .ttf, or .otf", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this._toast("File too large. Maximum size is 10 MB.", "error");
      return;
    }

    this._toast("Uploading…");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = this._hass.auth.data?.access_token;
      const res = await fetch("/api/font_manager/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || res.statusText);
      }

      const data = await res.json();
      this._toast(`✓ Uploaded: ${data.name}`);

      // Auto-populate the custom font fields
      this._shadow.getElementById("customFontFamily").value = data.family;
      this._shadow.getElementById("customFontUrl").value = data.url;
      this._shadow.getElementById("fontSource").value = "custom";
      this._updateSourceSection("custom");
      this._updatePreview();

      // Refresh font list
      await this._loadFonts();
    } catch (err) {
      this._toast("Upload failed: " + err.message, "error");
    }
  }

  async _deleteFont(filename) {
    if (!confirm(`Delete font "${filename}"?`)) return;
    try {
      const token = this._hass.auth.data?.access_token;
      const res = await fetch(`/api/font_manager/fonts/${encodeURIComponent(filename)}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(res.statusText);
      this._toast(`✓ Deleted: ${filename}`);
      await this._loadFonts();
    } catch (err) {
      this._toast("Delete failed: " + err.message, "error");
    }
  }

  // ── Toast notification ──────────────────────────────────────────────────────

  _toast(message, type = "success") {
    const el = this._shadow.getElementById("toast");
    el.textContent = message;
    el.style.background =
      type === "error"
        ? "var(--error-color, #db4437)"
        : "var(--primary-text-color)";
    el.classList.add("show");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove("show"), 3000);
  }
}

// ─── Register the custom element ──────────────────────────────────────────────

customElements.define("font-manager-panel", FontManagerPanel);

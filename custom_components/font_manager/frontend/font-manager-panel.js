/**
 * Home Assistant Custom Fonts — Settings Panel
 *
 * Web Component: <font-manager-panel>
 * Registered as a custom panel in HA sidebar.
 * Supports English and Russian UI with persistent language preference.
 */

// ─── i18n ─────────────────────────────────────────────────────────────────────

const TRANSLATIONS = {
  en: {
    title: "Home Assistant Custom Fonts",
    subtitle: "Globally customize fonts across the entire Home Assistant interface",
    by: "by",
    status_on: "ON",
    status_off: "OFF",

    section_general: "⚙️ General",
    label_enabled: "Enable Custom Fonts",
    hint_enabled: "Apply custom fonts globally to all UI elements",
    label_shadow: "Apply to Shadow DOM",
    hint_shadow: "Inject fonts into Web Components (recommended)",

    section_source: "🔤 Font Source",
    label_source: "Source",
    source_google: "Google Fonts",
    source_custom: "Custom / Uploaded",
    source_system: "System Font",

    label_font_name: "Font Name",
    label_gf_url: "Google Fonts CSS URL",
    hint_gf_url: "Paste the full stylesheet URL from fonts.google.com",
    label_presets: "Quick presets:",
    label_custom_family: "Font Family Name",
    label_custom_url: "Font File URL",
    hint_custom_url: "Direct URL to .woff2 / .woff / .ttf file, or upload below",
    upload_title: "Drop font file here or click to browse",
    upload_hint: ".woff2, .woff, .ttf, .otf · max 10 MB",
    no_fonts: "No fonts uploaded yet.",
    use_btn: "Use",
    system_hint: "Uses the OS default font. Font stack will be applied as fallback chain.",

    section_typography: "📐 Typography",
    label_font_size: "Base Font Size (px)",
    hint_font_size: "Set to 0 to keep Home Assistant's default",

    section_preview: "👁 Live Preview",
    preview_large: "Home Assistant",
    preview_medium: "Living Room · 21°C · All lights on",
    preview_small: "Updated 2 minutes ago · 3 automations active",
    preview_mono: "sensor.temperature: 21.4 °C",
    preview_placeholder: "Type here to preview…",
    preview_label: "Preview text:",

    section_actions: "💾 Actions",
    btn_save: "💾 Save Changes",
    btn_saving: "Saving…",
    btn_reload: "🔄 Reload Fonts",
    btn_reset: "↩ Reset to Defaults",

    toast_saved: "✓ Settings saved. Fonts applied to all open tabs.",
    toast_reloaded: "✓ Fonts reloaded in all tabs.",
    toast_reset: "✓ Settings reset to defaults.",
    toast_uploaded: "✓ Uploaded:",
    toast_deleted: "✓ Deleted:",
    confirm_reset: "Reset all settings to defaults?",
    confirm_delete: "Delete font",

    err_load: "Failed to load config:",
    err_save: "Failed to save:",
    err_reset: "Failed to reset:",
    err_upload: "Upload failed:",
    err_delete: "Delete failed:",
    err_format: "Unsupported format. Use .woff2, .woff, .ttf, or .otf",
    err_size: "File too large. Maximum size is 10 MB.",
    uploading: "Uploading…",

    lang_label: "Language",
  },
  ru: {
    title: "Home Assistant Custom Fonts",
    subtitle: "Глобальная настройка шрифтов для интерфейса Home Assistant",
    by: "от",
    status_on: "ВКЛ",
    status_off: "ВЫКЛ",

    section_general: "⚙️ Основное",
    label_enabled: "Включить Custom Fonts",
    hint_enabled: "Применить шрифты глобально ко всем элементам интерфейса",
    label_shadow: "Применять к Shadow DOM",
    hint_shadow: "Внедрять шрифты в Web Components (рекомендуется)",

    section_source: "🔤 Источник шрифта",
    label_source: "Источник",
    source_google: "Google Fonts",
    source_custom: "Свой / Загруженный",
    source_system: "Системный шрифт",

    label_font_name: "Название шрифта",
    label_gf_url: "URL таблицы стилей Google Fonts",
    hint_gf_url: "Вставьте полный URL с сайта fonts.google.com",
    label_presets: "Быстрые пресеты:",
    label_custom_family: "Название семейства шрифта",
    label_custom_url: "URL файла шрифта",
    hint_custom_url: "Прямая ссылка на .woff2 / .woff / .ttf или загрузите файл ниже",
    upload_title: "Перетащите файл шрифта сюда или нажмите для выбора",
    upload_hint: ".woff2, .woff, .ttf, .otf · макс. 10 МБ",
    no_fonts: "Загруженных шрифтов нет.",
    use_btn: "Использовать",
    system_hint: "Используется системный шрифт ОС. Задаётся цепочка запасных шрифтов.",

    section_typography: "📐 Типографика",
    label_font_size: "Базовый размер шрифта (px)",
    hint_font_size: "Установите 0, чтобы сохранить стандартный размер Home Assistant",

    section_preview: "👁 Предпросмотр",
    preview_large: "Home Assistant",
    preview_medium: "Гостиная · 21°C · Весь свет включён",
    preview_small: "Обновлено 2 минуты назад · 3 автоматизации активны",
    preview_mono: "sensor.temperature: 21.4 °C",
    preview_placeholder: "Введите текст для предпросмотра…",
    preview_label: "Текст предпросмотра:",

    section_actions: "💾 Действия",
    btn_save: "💾 Сохранить",
    btn_saving: "Сохранение…",
    btn_reload: "🔄 Перезагрузить шрифты",
    btn_reset: "↩ Сбросить настройки",

    toast_saved: "✓ Настройки сохранены. Шрифты применены во всех вкладках.",
    toast_reloaded: "✓ Шрифты перезагружены во всех вкладках.",
    toast_reset: "✓ Настройки сброшены до значений по умолчанию.",
    toast_uploaded: "✓ Загружен:",
    toast_deleted: "✓ Удалён:",
    confirm_reset: "Сбросить все настройки до значений по умолчанию?",
    confirm_delete: "Удалить шрифт",

    err_load: "Ошибка загрузки конфигурации:",
    err_save: "Ошибка сохранения:",
    err_reset: "Ошибка сброса:",
    err_upload: "Ошибка загрузки:",
    err_delete: "Ошибка удаления:",
    err_format: "Неподдерживаемый формат. Используйте .woff2, .woff, .ttf или .otf",
    err_size: "Файл слишком большой. Максимум 10 МБ.",
    uploading: "Загрузка…",

    lang_label: "Язык",
  },
};

const LANG_STORAGE_KEY = "ha_custom_fonts_lang";

function detectLanguage() {
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  if (saved && TRANSLATIONS[saved]) return saved;
  const browser = (navigator.language || "en").slice(0, 2).toLowerCase();
  return TRANSLATIONS[browser] ? browser : "en";
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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

  .panel-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 24px;
  }

  .panel-header-left { flex: 1; min-width: 200px; }

  h1.title {
    font-size: 24px;
    font-weight: 500;
    margin: 0 0 2px;
    color: var(--primary-text-color);
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .subtitle {
    color: var(--secondary-text-color);
    margin: 2px 0 0;
    font-size: 13px;
  }

  .author-link {
    font-size: 13px;
    color: var(--secondary-text-color);
    text-decoration: none;
    margin-top: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: color 0.2s;
  }
  .author-link:hover { color: var(--primary-color); text-decoration: underline; }

  .panel-header-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .lang-switcher {
    display: flex;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    overflow: hidden;
    font-size: 13px;
    font-weight: 500;
  }

  .lang-btn {
    padding: 6px 12px;
    border: none;
    background: transparent;
    color: var(--secondary-text-color);
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.2s, color 0.2s;
  }

  .lang-btn.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  .lang-btn:not(.active):hover {
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
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
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .row label { font-size: 14px; color: var(--primary-text-color); min-width: 180px; }
  .row .hint { font-size: 12px; color: var(--secondary-text-color); margin-top: 2px; }
  .row-col { display: flex; flex-direction: column; flex: 1; gap: 4px; }

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
  select:focus, input:focus { border-color: var(--primary-color); }

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
  .toggle-switch input:checked + .toggle-slider { background: var(--primary-color); }
  .toggle-switch input:checked + .toggle-slider::before { transform: translateX(22px); }

  .preview-box {
    background: var(--primary-background-color);
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    padding: 20px;
    margin-top: 8px;
  }
  .preview-box .preview-text { margin: 0; line-height: 1.6; }
  .preview-box .preview-large  { font-size: 28px; font-weight: 700; }
  .preview-box .preview-medium { font-size: 18px; font-weight: 400; }
  .preview-box .preview-small  { font-size: 13px; color: var(--secondary-text-color); }
  .preview-box .preview-mono   { font-size: 14px; font-family: monospace; margin-top: 6px; }

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
  .btn-primary  { background: var(--primary-color); color: var(--text-primary-color, #fff); }
  .btn-danger   { background: var(--error-color, #db4437); color: white; }
  .btn-secondary {
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
  }
  .btn-group { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }

  .preset-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
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

  .font-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
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

  .status-badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  .status-badge.on  { background: var(--success-color, #4caf50); color: white; }
  .status-badge.off { background: var(--divider-color); color: var(--secondary-text-color); }

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
    white-space: nowrap;
  }
  .toast.show { transform: translateX(-50%) translateY(0); }

  @media (max-width: 600px) {
    .panel-wrap { padding: 8px; }
    select, input { max-width: 100%; }
    .row { flex-direction: column; align-items: flex-start; }
    .panel-header { flex-direction: column; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

class FontManagerPanel extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._config = null;
    this._fonts = [];
    this._lang = detectLanguage();
    this._shadow = this.attachShadow({ mode: "open" });
    this._initialized = false;
    this._toastTimer = null;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._initialized) {
      this._initialized = true;
      this._render();
      this._loadAll();
    }
  }

  // ── Translations shortcut ──────────────────────────────────────────────────

  get t() {
    return TRANSLATIONS[this._lang];
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  _render() {
    const style = document.createElement("style");
    style.textContent = PANEL_CSS;
    this._shadow.appendChild(style);

    const wrap = document.createElement("div");
    wrap.innerHTML = this._buildHTML();
    this._shadow.appendChild(wrap);

    this._bindEvents();
  }

  _buildHTML() {
    const t = this.t;
    return `
      <div class="panel-wrap">

        <!-- ── Header ────────────────────────────────────────────── -->
        <div class="panel-header">
          <div class="panel-header-left">
            <h1 class="title" id="panelTitle">
              ${t.title}
              <span class="status-badge off" id="statusBadge">${t.status_off}</span>
            </h1>
            <p class="subtitle" id="panelSubtitle">${t.subtitle}</p>
            <a class="author-link"
               href="https://github.com/itsyuni"
               target="_blank"
               rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205
                  11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235
                  -3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23
                  -1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845
                  1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765
                  -1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385
                  1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3
                  1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56
                  3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23
                  1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375
                  .81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225
                  .69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span id="authorLabel">${t.by} @itsyuni</span>
            </a>
          </div>

          <div class="panel-header-right">
            <!-- Language switcher -->
            <div class="lang-switcher" title="${t.lang_label}">
              <button class="lang-btn ${this._lang === 'en' ? 'active' : ''}"
                      data-lang="en">EN</button>
              <button class="lang-btn ${this._lang === 'ru' ? 'active' : ''}"
                      data-lang="ru">RU</button>
            </div>
          </div>
        </div>

        <!-- ── General ───────────────────────────────────────────── -->
        <div class="card">
          <h2 id="sectionGeneral">${t.section_general}</h2>
          <div class="row">
            <div class="row-col">
              <label id="labelEnabled">${t.label_enabled}</label>
              <span class="hint" id="hintEnabled">${t.hint_enabled}</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggleEnabled">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="row">
            <div class="row-col">
              <label id="labelShadow">${t.label_shadow}</label>
              <span class="hint" id="hintShadow">${t.hint_shadow}</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggleShadow">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- ── Font Source ───────────────────────────────────────── -->
        <div class="card">
          <h2 id="sectionSource">${t.section_source}</h2>
          <div class="row">
            <label id="labelSource">${t.label_source}</label>
            <select id="fontSource">
              <option value="google">${t.source_google}</option>
              <option value="custom">${t.source_custom}</option>
              <option value="system">${t.source_system}</option>
            </select>
          </div>

          <!-- Google Fonts -->
          <div id="sectionGoogle">
            <div class="row">
              <label id="labelFontName">${t.label_font_name}</label>
              <input type="text" id="fontFamily" placeholder="Roboto">
            </div>
            <div class="row">
              <div class="row-col">
                <label id="labelGfUrl">${t.label_gf_url}</label>
                <span class="hint" id="hintGfUrl">${t.hint_gf_url}</span>
              </div>
              <input type="url" id="fontUrl"
                placeholder="https://fonts.googleapis.com/css2?family=...">
            </div>
            <p id="labelPresets" style="font-size:13px;color:var(--secondary-text-color);margin:8px 0 4px">
              ${t.label_presets}
            </p>
            <div class="preset-grid" id="presetGrid"></div>
          </div>

          <!-- Custom Font -->
          <div id="sectionCustom" style="display:none">
            <div class="row">
              <label id="labelCustomFamily">${t.label_custom_family}</label>
              <input type="text" id="customFontFamily" placeholder="MyFont">
            </div>
            <div class="row">
              <div class="row-col">
                <label id="labelCustomUrl">${t.label_custom_url}</label>
                <span class="hint" id="hintCustomUrl">${t.hint_custom_url}</span>
              </div>
              <input type="url" id="customFontUrl"
                placeholder="/font_manager/fonts/my-font.woff2">
            </div>
            <div class="upload-zone" id="uploadZone">
              <div class="upload-icon">📁</div>
              <p id="uploadTitle"><strong>${t.upload_title}</strong></p>
              <p id="uploadHint">${t.upload_hint}</p>
              <input type="file" id="fileInput"
                accept=".woff2,.woff,.ttf,.otf" style="display:none">
            </div>
            <div class="font-list" id="fontList"></div>
          </div>

          <!-- System Font -->
          <div id="sectionSystem" style="display:none">
            <p id="systemHint" style="font-size:14px;color:var(--secondary-text-color);margin:8px 0">
              ${t.system_hint}
            </p>
          </div>
        </div>

        <!-- ── Typography ────────────────────────────────────────── -->
        <div class="card">
          <h2 id="sectionTypography">${t.section_typography}</h2>
          <div class="row">
            <div class="row-col">
              <label id="labelFontSize">${t.label_font_size}</label>
              <span class="hint" id="hintFontSize">${t.hint_font_size}</span>
            </div>
            <input type="number" id="fontSize"
              min="0" max="32" step="1" placeholder="0"
              style="max-width:100px">
          </div>
        </div>

        <!-- ── Preview ───────────────────────────────────────────── -->
        <div class="card">
          <h2 id="sectionPreview">${t.section_preview}</h2>
          <div class="preview-box" id="previewBox">
            <p class="preview-text preview-large"  id="previewLarge">${t.preview_large}</p>
            <p class="preview-text preview-medium" id="previewMedium">${t.preview_medium}</p>
            <p class="preview-text preview-small"  id="previewSmall">${t.preview_small}</p>
            <p class="preview-text preview-mono"   id="previewMono">${t.preview_mono}</p>
          </div>
          <div style="margin-top:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <label id="labelPreviewInput"
              style="font-size:13px;color:var(--secondary-text-color)">
              ${t.preview_label}
            </label>
            <input type="text" id="previewInput"
              placeholder="${t.preview_placeholder}"
              style="max-width:320px;padding:6px 10px;font-size:13px">
          </div>
        </div>

        <!-- ── Actions ───────────────────────────────────────────── -->
        <div class="card">
          <h2 id="sectionActions">${t.section_actions}</h2>
          <div class="btn-group">
            <button class="btn btn-primary"   id="btnSave">${t.btn_save}</button>
            <button class="btn btn-secondary" id="btnReload">${t.btn_reload}</button>
            <button class="btn btn-danger"    id="btnReset">${t.btn_reset}</button>
          </div>
        </div>

      </div>
      <div class="toast" id="toast"></div>
    `;
  }

  // ── Language switch ────────────────────────────────────────────────────────

  _switchLanguage(lang) {
    if (lang === this._lang) return;
    this._lang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    this._updateTranslations();

    // Update active button
    this._shadow.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  /** Update all translatable text nodes without re-rendering the whole component. */
  _updateTranslations() {
    const t = this.t;
    const s = this._shadow;

    const set = (id, text) => {
      const el = s.getElementById(id);
      if (el) el.textContent = text;
    };
    const setHTML = (id, html) => {
      const el = s.getElementById(id);
      if (el) el.innerHTML = html;
    };

    set("panelSubtitle", t.subtitle);
    set("authorLabel", `${t.by} @itsyuni`);

    set("sectionGeneral", t.section_general);
    set("labelEnabled", t.label_enabled);
    set("hintEnabled", t.hint_enabled);
    set("labelShadow", t.label_shadow);
    set("hintShadow", t.hint_shadow);

    set("sectionSource", t.section_source);
    set("labelSource", t.label_source);
    set("labelFontName", t.label_font_name);
    set("labelGfUrl", t.label_gf_url);
    set("hintGfUrl", t.hint_gf_url);
    set("labelPresets", t.label_presets);
    set("labelCustomFamily", t.label_custom_family);
    set("labelCustomUrl", t.label_custom_url);
    set("hintCustomUrl", t.hint_custom_url);
    setHTML("uploadTitle", `<strong>${t.upload_title}</strong>`);
    set("uploadHint", t.upload_hint);
    set("systemHint", t.system_hint);

    set("sectionTypography", t.section_typography);
    set("labelFontSize", t.label_font_size);
    set("hintFontSize", t.hint_font_size);

    set("sectionPreview", t.section_preview);
    set("labelPreviewInput", t.preview_label);
    s.getElementById("previewInput").placeholder = t.preview_placeholder;

    // Reset preview text if user hasn't typed anything
    const userInput = s.getElementById("previewInput").value;
    if (!userInput) {
      set("previewLarge", t.preview_large);
      set("previewMedium", t.preview_medium);
      set("previewSmall", t.preview_small);
    }

    set("sectionActions", t.section_actions);
    set("btnSave", t.btn_save);
    set("btnReload", t.btn_reload);
    set("btnReset", t.btn_reset);

    // Update source select options
    const src = s.getElementById("fontSource");
    if (src) {
      src.options[0].text = t.source_google;
      src.options[1].text = t.source_custom;
      src.options[2].text = t.source_system;
    }

    // Re-render font list (has translatable "Use" buttons)
    this._renderFontList();
  }

  // ── Data loading ───────────────────────────────────────────────────────────

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
      this._toast(this.t.err_load + " " + err.message, "error");
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

  // ── Form population ────────────────────────────────────────────────────────

  _populateForm(cfg) {
    const s = this._shadow;
    const t = this.t;

    const badge = s.getElementById("statusBadge");
    badge.textContent = cfg.enabled ? t.status_on : t.status_off;
    badge.className = `status-badge ${cfg.enabled ? "on" : "off"}`;

    s.getElementById("toggleEnabled").checked = !!cfg.enabled;
    s.getElementById("toggleShadow").checked  = cfg.apply_to_shadow_dom !== false;

    const source = cfg.font_source ?? "google";
    s.getElementById("fontSource").value = source;
    this._updateSourceSection(source);

    s.getElementById("fontFamily").value       = cfg.font_family ?? "";
    s.getElementById("fontUrl").value          = cfg.font_url ?? "";
    s.getElementById("customFontFamily").value = cfg.font_family ?? "";
    s.getElementById("customFontUrl").value    =
      cfg.font_source === "custom" ? (cfg.font_url ?? "") : "";
    s.getElementById("fontSize").value         = cfg.font_size ?? 0;

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
    s.getElementById("fontUrl").value    = url;
    s.getElementById("fontSource").value = "google";
    this._updateSourceSection("google");
    s.querySelectorAll(".preset-chip").forEach(
      (c) => c.classList.toggle("active", c.textContent === name)
    );
    this._updatePreview();
  }

  _updateSourceSection(source) {
    const s = this._shadow;
    s.getElementById("sectionGoogle").style.display = source === "google" ? "" : "none";
    s.getElementById("sectionCustom").style.display = source === "custom" ? "" : "none";
    s.getElementById("sectionSystem").style.display = source === "system" ? "" : "none";
  }

  // ── Font list ──────────────────────────────────────────────────────────────

  _renderFontList() {
    const list = this._shadow.getElementById("fontList");
    if (!list) return;
    list.innerHTML = "";

    if (this._fonts.length === 0) {
      list.innerHTML = `<p style="font-size:13px;color:var(--secondary-text-color);margin:8px 0">
        ${this.t.no_fonts}</p>`;
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
        <button class="btn btn-secondary"
          data-use="${font.name}" data-url="${font.url}" data-family="${font.family}">
          ${this.t.use_btn}
        </button>
        <button class="btn btn-danger"
          data-delete="${font.name}" style="padding:9px 12px">🗑</button>
      `;
      item.querySelector("[data-use]").addEventListener("click", (e) => {
        const b = e.currentTarget;
        this._shadow.getElementById("customFontFamily").value = b.dataset.family;
        this._shadow.getElementById("customFontUrl").value    = b.dataset.url;
        this._updatePreview();
      });
      item.querySelector("[data-delete]").addEventListener("click", (e) => {
        this._deleteFont(e.currentTarget.dataset.delete);
      });
      list.appendChild(item);
    });
  }

  _fmtSize(bytes) {
    if (bytes < 1024)        return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  }

  // ── Preview ────────────────────────────────────────────────────────────────

  _updatePreview() {
    const s = this._shadow;
    const source = s.getElementById("fontSource").value;
    let family = "";
    let url    = "";

    if (source === "google") {
      family = s.getElementById("fontFamily").value;
      url    = s.getElementById("fontUrl").value;
    } else if (source === "custom") {
      family = s.getElementById("customFontFamily").value;
      url    = s.getElementById("customFontUrl").value;
    }

    this._injectPreviewFont(family, url, source);

    const stack = family ? `'${family}', system-ui, sans-serif` : "system-ui, sans-serif";
    s.querySelectorAll(".preview-text").forEach((el) => (el.style.fontFamily = stack));

    const size = parseInt(s.getElementById("fontSize").value, 10);
    s.getElementById("previewBox").style.fontSize = size > 0 ? size + "px" : "";
  }

  _injectPreviewFont(family, url, source) {
    const s = this._shadow;
    s.querySelector("#previewFontStyle")?.remove();
    if (!family) return;

    const style = document.createElement("style");
    style.id = "previewFontStyle";

    if (source === "google" && url) {
      let link = document.querySelector("#fm-preview-link");
      if (!link) {
        link = document.createElement("link");
        link.id = "fm-preview-link";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      link.href = url;
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

  // ── Events ─────────────────────────────────────────────────────────────────

  _bindEvents() {
    const s = this._shadow;

    // Language switcher
    s.querySelectorAll(".lang-btn").forEach((btn) =>
      btn.addEventListener("click", () => this._switchLanguage(btn.dataset.lang))
    );

    // Enable toggle → update badge
    s.getElementById("toggleEnabled").addEventListener("change", () => {
      const on    = s.getElementById("toggleEnabled").checked;
      const badge = s.getElementById("statusBadge");
      badge.textContent = on ? this.t.status_on : this.t.status_off;
      badge.className   = `status-badge ${on ? "on" : "off"}`;
    });

    // Source selector
    s.getElementById("fontSource").addEventListener("change", (e) => {
      this._updateSourceSection(e.target.value);
      this._updatePreview();
    });

    // Live preview
    ["fontFamily", "fontUrl", "customFontFamily", "customFontUrl", "fontSize"].forEach(
      (id) => s.getElementById(id)?.addEventListener("input", () => this._updatePreview())
    );

    // Custom preview text
    s.getElementById("previewInput").addEventListener("input", (e) => {
      const val = e.target.value;
      const t   = this.t;
      s.getElementById("previewLarge").textContent  = val || t.preview_large;
      s.getElementById("previewMedium").textContent = val || t.preview_medium;
      s.getElementById("previewSmall").textContent  = val || t.preview_small;
    });

    // Upload zone
    const zone      = s.getElementById("uploadZone");
    const fileInput = s.getElementById("fileInput");
    zone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => this._handleFileSelect(e.target.files[0]));
    zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("drag-over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      this._handleFileSelect(e.dataTransfer.files[0]);
    });

    // Buttons
    s.getElementById("btnSave").addEventListener("click",   () => this._save());
    s.getElementById("btnReload").addEventListener("click", () => this._reloadFonts());
    s.getElementById("btnReset").addEventListener("click",  () => this._reset());
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  async _save() {
    const s      = this._shadow;
    const t      = this.t;
    const source = s.getElementById("fontSource").value;

    const config = {
      enabled:           s.getElementById("toggleEnabled").checked,
      apply_to_shadow_dom: s.getElementById("toggleShadow").checked,
      font_source:       source,
      font_family:
        source === "custom" ? s.getElementById("customFontFamily").value.trim()
        : source === "google" ? s.getElementById("fontFamily").value.trim()
        : "system-ui",
      font_url:
        source === "custom" ? s.getElementById("customFontUrl").value.trim()
        : source === "google" ? s.getElementById("fontUrl").value.trim()
        : "",
      font_size: parseInt(s.getElementById("fontSize").value, 10) || null,
    };

    const btn = s.getElementById("btnSave");
    btn.disabled    = true;
    btn.textContent = t.btn_saving;

    try {
      await this._hass.callApi("POST", "font_manager/config", config);
      this._config = { ...this._config, ...config };
      this._toast(t.toast_saved);
      this._populateForm(this._config);
    } catch (err) {
      this._toast(t.err_save + " " + err.message, "error");
    } finally {
      btn.disabled    = false;
      btn.textContent = t.btn_save;
    }
  }

  async _reloadFonts() {
    try {
      await this._hass.callService("font_manager", "apply", {});
      this._toast(this.t.toast_reloaded);
    } catch {
      window.location.reload();
    }
  }

  async _reset() {
    if (!confirm(this.t.confirm_reset)) return;
    const defaults = {
      enabled: true, font_source: "google",
      font_family: "Roboto",
      font_url: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
      font_size: null, apply_to_shadow_dom: true,
    };
    try {
      await this._hass.callApi("POST", "font_manager/config", defaults);
      this._config = { ...this._config, ...defaults };
      this._populateForm(this._config);
      this._updatePreview();
      this._toast(this.t.toast_reset);
    } catch (err) {
      this._toast(this.t.err_reset + " " + err.message, "error");
    }
  }

  // ── Upload ─────────────────────────────────────────────────────────────────

  async _handleFileSelect(file) {
    if (!file) return;
    const t   = this.t;
    const ext = "." + file.name.split(".").pop().toLowerCase();

    if (![".woff2", ".woff", ".ttf", ".otf"].includes(ext)) {
      return this._toast(t.err_format, "error");
    }
    if (file.size > 10 * 1024 * 1024) {
      return this._toast(t.err_size, "error");
    }

    this._toast(t.uploading);

    const form  = new FormData();
    form.append("file", file);

    try {
      const token = this._hass.auth?.data?.access_token;
      const res   = await fetch("/api/font_manager/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || res.statusText);
      }
      const data = await res.json();
      this._toast(`${t.toast_uploaded} ${data.name}`);

      this._shadow.getElementById("customFontFamily").value = data.family;
      this._shadow.getElementById("customFontUrl").value    = data.url;
      this._shadow.getElementById("fontSource").value       = "custom";
      this._updateSourceSection("custom");
      this._updatePreview();
      await this._loadFonts();
    } catch (err) {
      this._toast(t.err_upload + " " + err.message, "error");
    }
  }

  async _deleteFont(filename) {
    if (!confirm(`${this.t.confirm_delete} "${filename}"?`)) return;
    try {
      const token = this._hass.auth?.data?.access_token;
      const res   = await fetch(
        `/api/font_manager/fonts/${encodeURIComponent(filename)}`,
        { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (!res.ok) throw new Error(res.statusText);
      this._toast(`${this.t.toast_deleted} ${filename}`);
      await this._loadFonts();
    } catch (err) {
      this._toast(this.t.err_delete + " " + err.message, "error");
    }
  }

  // ── Toast ──────────────────────────────────────────────────────────────────

  _toast(message, type = "success") {
    const el = this._shadow.getElementById("toast");
    el.textContent = message;
    el.style.background =
      type === "error" ? "var(--error-color, #db4437)" : "var(--primary-text-color)";
    el.classList.add("show");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove("show"), 3500);
  }
}

customElements.define("font-manager-panel", FontManagerPanel);

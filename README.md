# 🔤 Home Assistant Custom Fonts

> 🇷🇺 [Русский README](README.ru.md)

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2023.9%2B-blue.svg)](https://www.home-assistant.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/itsyuni/homeassistant-customfonts)](https://github.com/itsyuni/homeassistant-customfonts/releases)

> Global font replacement across the entire Home Assistant (Lovelace) interface — Google Fonts, custom font uploads, system fonts. Full Shadow DOM support included.

<img width="700" src="https://github.com/user-attachments/assets/f8a56e9a-b69d-458f-b372-287e092e08de" />


---

## ✨ Features

- **Google Fonts** — paste a Google Fonts URL or pick from 10 built-in presets
- **Custom font upload** — upload `.woff2`, `.woff`, `.ttf`, `.otf` directly through the UI
- **System fonts** — use the OS default font with a proper fallback chain
- **Shadow DOM traversal** — fonts are injected into every Web Component, not just the document root
- **Live preview** — see the font change in real time before saving
- **Enable / Disable toggle** — turn the plugin off without removing it
- **Custom base font size** — adjust the global font size in pixels
- **🌐 Bilingual UI** — English and Russian interface in the settings panel
- **Zero config required** — works out of the box after installation

---

## 📦 Installation via HACS

The easiest way to install is through [HACS](https://hacs.xyz).

[![Add to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=itsyuni&repository=homeassistant-customfonts&category=integration)

### Steps

1. Click the button above **or** open HACS → Integrations → ⋮ → Custom repositories
2. Add `https://github.com/itsyuni/homeassistant-customfonts` with category **Integration**
3. Find **Home Assistant Custom Fonts** in the HACS store and click **Download**
4. Restart Home Assistant
5. Go to **Settings → Devices & Services → Add Integration** → search for **Home Assistant Custom Fonts**
6. Follow the setup wizard

---

## 🛠 Manual Installation

1. Download the [latest release](https://github.com/itsyuni/homeassistant-customfonts/releases/latest)
2. Copy the `custom_components/font_manager/` folder into your HA config directory:
   ```
   config/
   └── custom_components/
       └── font_manager/   ← place it here
   ```
3. Restart Home Assistant
4. Add the integration via **Settings → Devices & Services → Add Integration**

---

## ⚙️ Configuration

After installation, open the **Custom Fonts** panel in the HA sidebar.

| Setting | Description |
|---|---|
| Enable Custom Fonts | Global on/off switch |
| Font Source | Google Fonts / Custom upload / System |
| Font Name | The font family name (e.g. `Roboto`) |
| Google Fonts URL | Full CSS URL from [fonts.google.com](https://fonts.google.com) |
| Font File URL | Direct URL to a `.woff2` / `.woff` / `.ttf` file |
| Base Font Size | Override font size in px (0 = keep HA default) |
| Apply to Shadow DOM | Inject fonts into Web Components |

### Quick presets (Google Fonts)

Roboto · Inter · Open Sans · Lato · Nunito · Montserrat · Poppins · Source Sans 3 · JetBrains Mono · Fira Code

---

## 🔧 How It Works

```
Home Assistant boot
  └── add_extra_js_url() injects font-manager.js
        └── fetch() → /api/font_manager/config  (public endpoint)
              └── Build @font-face / Google Fonts <link>
                    └── Inject <style> into document
                          └── Patch Element.prototype.attachShadow
                                └── MutationObserver watches for new nodes
                                      └── Inject <style> into every shadow root
```

Shadow DOM is the main challenge in HA frontend — a `<style>` in `<head>` doesn't pierce it. This integration uses three layers of defence:

1. **`attachShadow()` patch** — intercepts every new shadow root at creation time
2. **MutationObserver** — watches for newly added DOM nodes (debounced, 100 ms)
3. **Full tree traversal** — runs on initial load to catch all existing roots

---

## 🌐 Language Support

The settings panel is available in **English** and **Russian**. The language is auto-detected from your browser settings and can be changed manually via the `EN / RU` toggle in the panel header.

New languages are welcome — feel free to submit a Pull Request :)

---

## 📋 Requirements

- Home Assistant **2023.9.0** or newer
- [HACS](https://hacs.xyz) (for one-click install)
- Internet access for Google Fonts (optional — custom fonts work offline)

---

## 📄 License

MIT © [itsyuni](https://github.com/itsyuni)

/**
 * Home Assistant Custom Fonts — Home Assistant Frontend Module
 *
 * Injected into every HA page via add_extra_js_url().
 * Responsibilities:
 *   1. Load font configuration from the backend API
 *   2. Inject @font-face / Google Fonts link into <head>
 *   3. Apply CSS rules to document AND all Shadow DOM roots
 *   4. Watch for new Shadow DOM roots via attachShadow() patch + MutationObserver
 *   5. React to live config changes pushed from the backend
 *
 * Architecture note:
 *   Home Assistant uses Web Components with Shadow DOM everywhere.
 *   A global <style> in <head> does NOT pierce shadow roots.
 *   We must inject a <style> into each individual shadow root.
 */

(function FontManagerBootstrap() {
  "use strict";

  console.info(
    "%c Home Assistant Custom Fonts %c v1.0.0 ",
    "background:#6200ee;color:#fff;padding:2px 6px;border-radius:4px 0 0 4px",
    "background:#333;color:#fff;padding:2px 6px;border-radius:0 4px 4px 0"
  );

  // ─── Constants ─────────────────────────────────────────────────────────────
  const ATTR = "data-font-manager";          // marker attribute on injected styles
  const GOOGLE_ATTR = "data-fm-google";      // marker on Google Fonts <link>
  const API_CONFIG = "/api/font_manager/config";
  const RELOAD_DELAY_MS = 100;              // debounce for MutationObserver

  // ─── Utility ───────────────────────────────────────────────────────────────

  /** Debounce a function — collapses rapid successive calls into one. */
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // ─── FontManager class ────────────────────────────────────────────────────

  class FontManager {
    constructor() {
      /** @type {object|null} Current config from backend */
      this._config = null;

      /**
       * Tracks shadow roots we've already injected styles into.
       * WeakSet allows GC of detached elements automatically.
       * @type {WeakSet<ShadowRoot>}
       */
      this._injectedRoots = new WeakSet();

      /** @type {MutationObserver|null} */
      this._domObserver = null;

      /** Debounced version of _handleMutations */
      this._debouncedApply = debounce(() => this._applyToNewRoots(), RELOAD_DELAY_MS);

      /** Whether the original attachShadow has been patched */
      this._shadowPatched = false;

      this._init();
    }

    // ── Initialization ────────────────────────────────────────────────────────

    async _init() {
      await this._loadConfig();
      this._applyAll();
      this._patchAttachShadow();
      this._startMutationObserver();
      this._listenForConfigChanges();
      console.info(
        "[Home Assistant Custom Fonts] Initialized. Font:",
        this._config?.font_family ?? "none (check config)",
        "| Enabled:", this._config?.enabled ?? false
      );
    }

    // ── Config loading ────────────────────────────────────────────────────────

    async _loadConfig(retries = 3) {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          // GET /api/font_manager/config is intentionally public.
          // Avoids token race-condition: the JS module loads before HA
          // auth tokens are accessible in the DOM.
          const res = await fetch(API_CONFIG, { credentials: "same-origin" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          this._config = await res.json();
          return; // success — exit loop
        } catch (err) {
          console.warn(
            `[Home Assistant Custom Fonts] Config load attempt ${attempt}/${retries}:`,
            err.message
          );
          if (attempt < retries) {
            await new Promise((r) => setTimeout(r, 800 * attempt));
          }
        }
      }
      this._config = null;
    }

    // ── CSS generation ────────────────────────────────────────────────────────

    /**
     * Build the CSS string that will be injected into document and shadow roots.
     * @returns {string}
     */
    _buildCSS() {
      const cfg = this._config;
      if (!cfg || !cfg.enabled) return "";

      const family = cfg.font_family?.trim();
      const fallbacks = Array.isArray(cfg.fallback_fonts)
        ? cfg.fallback_fonts
        : ["system-ui", "-apple-system", "sans-serif"];

      // Build the font stack: 'CustomFont', system-ui, -apple-system, sans-serif
      const stack = [
        family ? `'${family}'` : null,
        ...fallbacks,
      ]
        .filter(Boolean)
        .join(", ");

      const sizeRule =
        cfg.font_size && cfg.font_size > 0
          ? `font-size: ${cfg.font_size}px !important;`
          : "";

      // Apply to everything inside a shadow root.
      // :host applies to the custom element itself.
      return `
        :host { font-family: ${stack} !important; ${sizeRule} }
        *, *::before, *::after { font-family: ${stack} !important; }
        ${sizeRule ? `html, body { font-size: ${cfg.font_size}px !important; }` : ""}
      `.trim();
    }

    /**
     * Build CSS for document <head> injection (non-shadow context).
     * @returns {string}
     */
    _buildGlobalCSS() {
      const cfg = this._config;
      if (!cfg || !cfg.enabled) return "";

      const family = cfg.font_family?.trim();
      const fallbacks = Array.isArray(cfg.fallback_fonts)
        ? cfg.fallback_fonts
        : ["system-ui", "-apple-system", "sans-serif"];

      const stack = [
        family ? `'${family}'` : null,
        ...fallbacks,
      ]
        .filter(Boolean)
        .join(", ");

      const sizeRule =
        cfg.font_size && cfg.font_size > 0
          ? `\n  font-size: ${cfg.font_size}px !important;`
          : "";

      return `
        html, body {
          font-family: ${stack} !important;${sizeRule}
        }
        *, *::before, *::after {
          font-family: ${stack} !important;
        }
      `.trim();
    }

    /** Build a @font-face declaration for custom (uploaded) fonts. */
    _buildFontFaceCSS() {
      const cfg = this._config;
      if (!cfg || cfg.font_source !== "custom" || !cfg.font_url) return "";

      const url = cfg.font_url;
      const ext = url.split(".").pop().toLowerCase();
      const formatMap = { woff2: "woff2", woff: "woff", ttf: "truetype", otf: "opentype" };
      const format = formatMap[ext] ?? "woff2";

      return `
        @font-face {
          font-family: '${cfg.font_family}';
          src: url('${url}') format('${format}');
          font-display: swap;
          font-weight: 100 900;
          font-style: normal;
        }
      `.trim();
    }

    // ── Style injection ───────────────────────────────────────────────────────

    /**
     * Inject or update a <style> element in the given root.
     * Idempotent: replaces existing style if present.
     * @param {Document|ShadowRoot} root
     * @param {string} css
     */
    _injectStyle(root, css) {
      // Find or create the managed <style>
      const existing = root.querySelector
        ? root.querySelector(`style[${ATTR}]`)
        : null;

      if (!css) {
        // If disabled — remove existing style
        existing?.remove();
        return;
      }

      if (existing) {
        if (existing.textContent !== css) existing.textContent = css;
        return;
      }

      const style = document.createElement("style");
      style.setAttribute(ATTR, "true");
      style.textContent = css;

      // For shadow roots, insert at the top so it can be overridden by component styles
      const target = root.head ?? root;
      target.prepend(style);
    }

    /**
     * Ensure the Google Fonts <link> is present in document <head>.
     * Only relevant when font_source === 'google'.
     */
    _manageGoogleFontsLink() {
      const cfg = this._config;
      const existing = document.querySelector(`link[${GOOGLE_ATTR}]`);

      if (!cfg || !cfg.enabled || cfg.font_source !== "google" || !cfg.font_url) {
        existing?.remove();
        return;
      }

      if (existing) {
        if (existing.href !== cfg.font_url) existing.href = cfg.font_url;
        return;
      }

      // Create preconnect hints for Google Fonts (improves load time)
      const hints = [
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
      ];
      hints.forEach((origin) => {
        if (!document.querySelector(`link[rel=preconnect][href="${origin}"]`)) {
          const link = document.createElement("link");
          link.rel = "preconnect";
          link.href = origin;
          if (origin.includes("gstatic")) link.crossOrigin = "anonymous";
          document.head.prepend(link);
        }
      });

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cfg.font_url;
      link.setAttribute(GOOGLE_ATTR, "true");
      document.head.appendChild(link);
    }

    // ── Apply to all roots ────────────────────────────────────────────────────

    /** Apply fonts to document <head> and all discovered shadow roots. */
    _applyAll() {
      const cfg = this._config;

      // 1. Manage Google Fonts link in <head>
      this._manageGoogleFontsLink();

      // 2. Inject global CSS + optional @font-face into document <head>
      const fontFaceCSS = this._buildFontFaceCSS();
      const globalCSS = this._buildGlobalCSS();
      this._injectStyle(document.head, fontFaceCSS + "\n" + globalCSS);

      // 3. If shadow DOM traversal is disabled — stop here
      if (cfg && !cfg.apply_to_shadow_dom) return;

      // 4. Traverse the full DOM tree and inject into every shadow root
      const shadowCSS = this._buildCSS();
      this._traverseAndInject(document.documentElement, shadowCSS);
    }

    /**
     * Recursively walk `el` and inject styles into every shadow root found.
     * Uses a stack (iterative DFS) to avoid call-stack overflow on large DOMs.
     * @param {Element} root
     * @param {string} css
     */
    _traverseAndInject(root, css) {
      const stack = [root];

      while (stack.length > 0) {
        const el = stack.pop();

        // If this element has a shadow root and we haven't styled it yet
        if (el.shadowRoot && !this._injectedRoots.has(el.shadowRoot)) {
          this._injectedRoots.add(el.shadowRoot);
          this._injectStyle(el.shadowRoot, css);
          // Also traverse inside the shadow root
          stack.push(...el.shadowRoot.children);
        }

        // Push light-DOM children
        if (el.children) {
          stack.push(...el.children);
        }
      }
    }

    /**
     * Called by the MutationObserver — applies styles only to newly-added nodes.
     * More efficient than a full re-traverse.
     */
    _applyToNewRoots() {
      if (!this._config?.enabled || !this._config?.apply_to_shadow_dom) return;
      const css = this._buildCSS();
      this._traverseAndInject(document.documentElement, css);
    }

    // ── attachShadow patch ────────────────────────────────────────────────────

    /**
     * Monkey-patch Element.prototype.attachShadow to intercept shadow root
     * creation. This catches roots created AFTER initial page load —
     * which is most of them in a SPA like Home Assistant.
     *
     * We schedule style injection via a microtask (Promise.resolve) to ensure
     * the component has had a chance to render its initial content first.
     */
    _patchAttachShadow() {
      if (this._shadowPatched) return;
      this._shadowPatched = true;

      const self = this;
      const _orig = Element.prototype.attachShadow;

      Element.prototype.attachShadow = function patchedAttachShadow(init) {
        const shadowRoot = _orig.call(this, init);

        // Defer to microtask so component can render before we inject
        Promise.resolve().then(() => {
          if (
            self._config?.enabled &&
            self._config?.apply_to_shadow_dom &&
            !self._injectedRoots.has(shadowRoot)
          ) {
            self._injectedRoots.add(shadowRoot);
            self._injectStyle(shadowRoot, self._buildCSS());
          }
        });

        return shadowRoot;
      };
    }

    // ── MutationObserver ──────────────────────────────────────────────────────

    /**
     * Watch for new elements added to the DOM.
     * When new nodes appear, check if they carry shadow roots.
     * Debounced to avoid hammering during large renders.
     */
    _startMutationObserver() {
      if (this._domObserver) {
        this._domObserver.disconnect();
      }

      this._domObserver = new MutationObserver((mutations) => {
        let hasNewNodes = false;
        for (const mutation of mutations) {
          if (mutation.addedNodes.length > 0) {
            hasNewNodes = true;
            break;
          }
        }
        if (hasNewNodes) this._debouncedApply();
      });

      this._domObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    // ── Live config updates ───────────────────────────────────────────────────

    /**
     * Listen for config change events pushed from the backend via HA's
     * server-sent event system (hass.connection.subscribeEvents).
     *
     * We wait for the `hass` object to become available on the window,
     * then subscribe to the font_manager_config_changed event.
     */
    _listenForConfigChanges() {
      const self = this;

      /**
       * Subscribe once `hass` / `hassConnection` is available.
       * HA exposes the connection on the `<home-assistant>` element.
       */
      function trySubscribe() {
        const haEl = document.querySelector("home-assistant");
        if (!haEl || !haEl.hass?.connection) {
          // Retry — HA might not have finished booting
          setTimeout(trySubscribe, 1000);
          return;
        }

        haEl.hass.connection.subscribeEvents((event) => {
          console.info("[FontManager] Config changed event received, reloading…");
          self._loadConfig().then(() => {
            // Remove all injected styles so we can re-inject fresh ones
            self._removeAllStyles();
            self._injectedRoots = new WeakSet();
            self._applyAll();
          });
        }, "font_manager_config_changed");
      }

      setTimeout(trySubscribe, 2000); // Give HA time to boot
    }

    // ── Cleanup ───────────────────────────────────────────────────────────────

    /** Remove every style element this module has injected. */
    _removeAllStyles() {
      document
        .querySelectorAll(`style[${ATTR}], link[${GOOGLE_ATTR}]`)
        .forEach((el) => el.remove());

      // Removing from shadow roots is harder — we re-inject with empty string instead.
      // The WeakSet reset in the caller handles the rest.
    }
  }

  // ─── Entry point ────────────────────────────────────────────────────────────

  /**
   * Delay initialization slightly to ensure HA's own scripts have loaded first.
   * This avoids race conditions during initial page boot.
   */
  function start() {
    window.__fontManager = new FontManager();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    // DOM is already ready (module loaded late) — run immediately
    start();
  }
})();

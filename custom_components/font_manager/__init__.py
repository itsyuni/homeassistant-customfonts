"""Home Assistant Custom Fonts - Custom integration for Home Assistant.

Allows global font replacement in the Lovelace UI including
Google Fonts, custom uploaded fonts, and system fonts.
"""

from __future__ import annotations

import logging
import shutil
from pathlib import Path
from typing import Any

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.panel_custom import async_register_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall

from .api import (
    FontManagerConfigView,
    FontManagerFontsView,
    FontManagerUploadView,
    FontManagerFontFileView,
    get_fonts_dir,
)
from .const import (
    DOMAIN,
    STATIC_PATH,
    FONTS_PATH,
    FRONTEND_SCRIPT,
    PANEL_SCRIPT,
    DATA_CONFIG,
    DEFAULT_ENABLED,
    DEFAULT_FONT_SOURCE,
    DEFAULT_FONT_FAMILY,
    DEFAULT_FONT_URL,
    DEFAULT_FALLBACK_FONTS,
    DEFAULT_APPLY_TO_SHADOW_DOM,
    CONF_ENABLED,
)

_LOGGER = logging.getLogger(__name__)

# Path to the frontend directory inside the integration
FRONTEND_DIR = Path(__file__).parent / "frontend"

# Legacy on-disk location used in <= 1.0.1 — kept around solely so we can
# migrate any uploaded fonts out of the integration package on first start
# of a newer version. The package directory is wiped on every HACS upgrade,
# so it's not a safe permanent home.
_LEGACY_FONTS_DIR = Path(__file__).parent / "fonts"


def _migrate_legacy_fonts(legacy_dir: Path, target_dir: Path) -> None:
    """Move font files from the in-package legacy folder to the persistent one.

    Runs in an executor (sync filesystem ops). Best-effort: failures are
    logged but do not stop integration setup. Files that already exist at
    the target are left untouched (the persistent copy wins).
    """
    if not legacy_dir.exists() or legacy_dir == target_dir:
        return

    target_dir.mkdir(mode=0o755, parents=True, exist_ok=True)

    for src in legacy_dir.iterdir():
        if not src.is_file():
            continue
        dest = target_dir / src.name
        if dest.exists():
            continue
        try:
            shutil.move(str(src), str(dest))
            _LOGGER.info(
                "Migrated uploaded font from legacy location: %s -> %s",
                src,
                dest,
            )
        except OSError as exc:
            _LOGGER.warning(
                "Failed to migrate legacy font %s: %s. "
                "Move it manually to %s to preserve it across HACS upgrades.",
                src,
                exc,
                target_dir,
            )


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Home Assistant Custom Fonts from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    # Persistent fonts directory under <config>/font_manager/fonts.
    # Lives outside the integration package so HACS upgrades don't wipe it.
    fonts_dir = get_fonts_dir(hass)

    # Ensure fonts directory exists + migrate any legacy uploads.
    # Both are sync filesystem ops — run in executor.
    def _prepare_fonts_dir() -> None:
        fonts_dir.mkdir(mode=0o755, parents=True, exist_ok=True)
        _migrate_legacy_fonts(_LEGACY_FONTS_DIR, fonts_dir)

    await hass.async_add_executor_job(_prepare_fonts_dir)

    # ── Static file serving ──────────────────────────────────────────────────
    # Serve the frontend JS files
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                url_path=STATIC_PATH,
                path=str(FRONTEND_DIR),
                cache_headers=False,  # Disable cache so changes apply immediately
            )
        ]
    )

    # Serve uploaded font files (from the persistent location)
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                url_path=FONTS_PATH,
                path=str(fonts_dir),
                cache_headers=True,
            )
        ]
    )

    # ── Inject the style module into every HA page ───────────────────────────
    # This makes font-manager.js load on every Lovelace page automatically
    add_extra_js_url(hass, f"{STATIC_PATH}/{FRONTEND_SCRIPT}", es5=False)

    # ── Register REST API views ──────────────────────────────────────────────
    hass.http.register_view(FontManagerConfigView(hass, entry))
    hass.http.register_view(FontManagerFontsView(hass, entry))
    hass.http.register_view(FontManagerUploadView(hass, entry))
    hass.http.register_view(FontManagerFontFileView(hass, entry))

    # ── Register the settings panel ──────────────────────────────────────────
    await async_register_panel(
        hass,
        webcomponent_name="font-manager-panel",
        frontend_url_path="font-manager",
        module_url=f"{STATIC_PATH}/{PANEL_SCRIPT}",
        sidebar_title="Custom Fonts",
        sidebar_icon="mdi:format-font",
        require_admin=True,
        config={},
    )

    # ── Store runtime data ───────────────────────────────────────────────────
    hass.data[DOMAIN][entry.entry_id] = {
        DATA_CONFIG: dict(entry.options),
    }

    # ── Listen for option updates (settings changed via UI) ──────────────────
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))

    # ── Register service: font_manager.apply ─────────────────────────────────
    async def handle_apply_service(call: ServiceCall) -> None:
        """Trigger re-application of fonts (fires browser event via WS)."""
        _LOGGER.debug("Home Assistant Custom Fonts: apply service called")
        hass.bus.async_fire(f"{DOMAIN}_config_changed", {})

    hass.services.async_register(DOMAIN, "apply", handle_apply_service)

    _LOGGER.info("Home Assistant Custom Fonts integration loaded successfully")
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    # Remove panel
    hass.data["panel_custom"].pop("font-manager", None)
    hass.components.frontend.async_remove_panel("font-manager")

    # Remove service
    hass.services.async_remove(DOMAIN, "apply")

    # Clean up data
    hass.data[DOMAIN].pop(entry.entry_id, None)

    return True


async def _async_options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle updated options — push new config to browser via HA event bus."""
    _LOGGER.debug("Home Assistant Custom Fonts: options updated, firing config_changed event")
    hass.data[DOMAIN][entry.entry_id][DATA_CONFIG] = dict(entry.options)
    # The frontend polls or listens for this event via SSE/WebSocket
    hass.bus.async_fire(f"{DOMAIN}_config_changed", dict(entry.options))

"""Home Assistant Custom Fonts - Custom integration for Home Assistant.

Allows global font replacement in the Lovelace UI including
Google Fonts, custom uploaded fonts, and system fonts.
"""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.panel_custom import async_register_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.typing import ConfigType

from .api import (
    FontManagerConfigView,
    FontManagerFontsView,
    FontManagerUploadView,
    FontManagerFontFileView,
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
FONTS_DIR = Path(__file__).parent / "fonts"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up Home Assistant Custom Fonts from yaml (not supported, use UI)."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Home Assistant Custom Fonts from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    # Ensure fonts directory exists
    await hass.async_add_executor_job(FONTS_DIR.mkdir, 0o755, True, True)

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

    # Serve uploaded font files
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                url_path=FONTS_PATH,
                path=str(FONTS_DIR),
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

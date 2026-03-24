"""REST API views for Home Assistant Custom Fonts."""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any

import aiofiles
from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    DATA_CONFIG,
    CONF_ENABLED,
    CONF_FONT_SOURCE,
    CONF_FONT_FAMILY,
    CONF_FONT_URL,
    CONF_FONT_SIZE,
    CONF_FALLBACK_FONTS,
    CONF_APPLY_TO_SHADOW_DOM,
    CONF_UPLOADED_FONTS,
    DEFAULT_ENABLED,
    DEFAULT_FONT_SOURCE,
    DEFAULT_FONT_FAMILY,
    DEFAULT_FONT_URL,
    DEFAULT_FALLBACK_FONTS,
    DEFAULT_APPLY_TO_SHADOW_DOM,
    ALLOWED_FONT_EXTENSIONS,
    MAX_FONT_FILE_SIZE,
    FONTS_PATH,
    GOOGLE_FONTS_PRESETS,
)

_LOGGER = logging.getLogger(__name__)

FONTS_DIR = Path(__file__).parent / "fonts"


def _default_config() -> dict:
    """Return the default configuration."""
    return {
        CONF_ENABLED: DEFAULT_ENABLED,
        CONF_FONT_SOURCE: DEFAULT_FONT_SOURCE,
        CONF_FONT_FAMILY: DEFAULT_FONT_FAMILY,
        CONF_FONT_URL: DEFAULT_FONT_URL,
        CONF_FONT_SIZE: None,
        CONF_FALLBACK_FONTS: DEFAULT_FALLBACK_FONTS,
        CONF_APPLY_TO_SHADOW_DOM: DEFAULT_APPLY_TO_SHADOW_DOM,
    }


def _get_config(hass: HomeAssistant, entry: ConfigEntry) -> dict:
    """Get the current configuration, falling back to defaults."""
    stored = hass.data.get(DOMAIN, {}).get(entry.entry_id, {}).get(DATA_CONFIG, {})
    base = _default_config()
    base.update(stored)
    return base


class FontManagerConfigView(HomeAssistantView):
    """GET/POST /api/font_manager/config.

    GET is intentionally unauthenticated — font family names and URLs are
    not sensitive data, and the JS module injected via add_extra_js_url
    runs before HA's auth token is available in the DOM.

    POST requires auth (enforced manually below).
    """

    url = "/api/font_manager/config"
    name = "api:font_manager:config"
    requires_auth = False  # GET is public; POST checks auth manually

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self._hass = hass
        self._entry = entry

    async def get(self, request: web.Request) -> web.Response:
        """Return the current font configuration (public)."""
        config = _get_config(self._hass, self._entry)
        config["presets"] = GOOGLE_FONTS_PRESETS
        return self.json(config)

    async def post(self, request: web.Request) -> web.Response:
        """Update the font configuration (requires auth)."""
        # Manual auth check since requires_auth = False on the class
        user = request.get("hass_user")
        if user is None:
            return self.json_message("Unauthorized", status_code=401)

        try:
            data: dict = await request.json()
        except Exception:
            return self.json_message("Invalid JSON body", status_code=400)

        # Validate known keys — reject unknown keys
        allowed_keys = {
            CONF_ENABLED, CONF_FONT_SOURCE, CONF_FONT_FAMILY,
            CONF_FONT_URL, CONF_FONT_SIZE, CONF_FALLBACK_FONTS,
            CONF_APPLY_TO_SHADOW_DOM,
        }
        unknown = set(data.keys()) - allowed_keys
        if unknown:
            return self.json_message(
                f"Unknown config keys: {unknown}", status_code=400
            )

        # Merge with current config
        current = _get_config(self._hass, self._entry)
        current.update(data)

        # Persist via options update (triggers _async_options_updated in __init__)
        self._hass.config_entries.async_update_entry(
            self._entry, options=current
        )

        _LOGGER.info("Home Assistant Custom Fonts config updated: %s", current)
        return self.json({"status": "ok", "config": current})


class FontManagerFontsView(HomeAssistantView):
    """GET /api/font_manager/fonts — list uploaded custom fonts."""

    url = "/api/font_manager/fonts"
    name = "api:font_manager:fonts"
    requires_auth = True

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self._hass = hass
        self._entry = entry

    async def get(self, request: web.Request) -> web.Response:
        """List all uploaded font files."""
        def _list_fonts() -> list[dict]:
            fonts = []
            if not FONTS_DIR.exists():
                return fonts
            for f in sorted(FONTS_DIR.iterdir()):
                if f.suffix.lower() in ALLOWED_FONT_EXTENSIONS:
                    fonts.append(
                        {
                            "name": f.name,
                            "family": f.stem.replace("-", " ").replace("_", " "),
                            "url": f"{FONTS_PATH}/{f.name}",
                            "size": f.stat().st_size,
                            "format": f.suffix.lstrip("."),
                        }
                    )
            return fonts

        fonts = await self._hass.async_add_executor_job(_list_fonts)
        return self.json({"fonts": fonts})


class FontManagerUploadView(HomeAssistantView):
    """POST /api/font_manager/upload — upload a custom font file."""

    url = "/api/font_manager/upload"
    name = "api:font_manager:upload"
    requires_auth = True

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self._hass = hass
        self._entry = entry

    async def post(self, request: web.Request) -> web.Response:
        """Handle font file upload (multipart/form-data)."""
        reader = await request.multipart()
        field = await reader.next()

        if field is None or field.name != "file":
            return self.json_message("Expected a 'file' field", status_code=400)

        filename = field.filename
        if not filename:
            return self.json_message("No filename provided", status_code=400)

        # Sanitize filename — keep only safe characters
        safe_name = "".join(
            c for c in filename if c.isalnum() or c in "._- "
        ).strip()
        safe_name = safe_name.replace(" ", "_")

        suffix = Path(safe_name).suffix.lower()
        if suffix not in ALLOWED_FONT_EXTENSIONS:
            return self.json_message(
                f"Unsupported font format. Allowed: {ALLOWED_FONT_EXTENSIONS}",
                status_code=415,
            )

        dest = FONTS_DIR / safe_name
        total_size = 0

        try:
            async with aiofiles.open(dest, "wb") as f:
                while True:
                    chunk = await field.read_chunk(8192)
                    if not chunk:
                        break
                    total_size += len(chunk)
                    if total_size > MAX_FONT_FILE_SIZE:
                        await f.close()
                        dest.unlink(missing_ok=True)
                        return self.json_message(
                            f"File too large. Max size: {MAX_FONT_FILE_SIZE // 1024 // 1024} MB",
                            status_code=413,
                        )
                    await f.write(chunk)
        except OSError as exc:
            _LOGGER.error("Font upload failed: %s", exc)
            return self.json_message("Failed to save file", status_code=500)

        font_url = f"{FONTS_PATH}/{safe_name}"
        _LOGGER.info("Font uploaded: %s (%d bytes)", safe_name, total_size)

        return self.json(
            {
                "status": "ok",
                "name": safe_name,
                "family": Path(safe_name).stem.replace("-", " ").replace("_", " "),
                "url": font_url,
                "size": total_size,
            }
        )


class FontManagerFontFileView(HomeAssistantView):
    """DELETE /api/font_manager/fonts/{filename} — delete an uploaded font."""

    url = "/api/font_manager/fonts/{filename}"
    name = "api:font_manager:font_file"
    requires_auth = True

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self._hass = hass
        self._entry = entry

    async def delete(self, request: web.Request, filename: str) -> web.Response:
        """Delete a specific uploaded font file."""
        # Sanitize: no directory traversal
        safe_name = Path(filename).name
        target = FONTS_DIR / safe_name

        if not target.exists() or target.suffix.lower() not in ALLOWED_FONT_EXTENSIONS:
            return self.json_message("Font not found", status_code=404)

        def _delete() -> None:
            target.unlink()

        await self._hass.async_add_executor_job(_delete)
        _LOGGER.info("Font deleted: %s", safe_name)
        return self.json({"status": "ok", "deleted": safe_name})

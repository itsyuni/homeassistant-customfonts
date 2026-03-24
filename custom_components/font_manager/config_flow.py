"""Config flow for Home Assistant Custom Fonts integration."""

from __future__ import annotations

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult

from .const import (
    DOMAIN,
    CONF_ENABLED,
    CONF_FONT_SOURCE,
    CONF_FONT_FAMILY,
    CONF_FONT_URL,
    CONF_FONT_SIZE,
    CONF_FALLBACK_FONTS,
    CONF_APPLY_TO_SHADOW_DOM,
    FONT_SOURCE_GOOGLE,
    FONT_SOURCE_CUSTOM,
    FONT_SOURCE_SYSTEM,
    DEFAULT_ENABLED,
    DEFAULT_FONT_SOURCE,
    DEFAULT_FONT_FAMILY,
    DEFAULT_FONT_URL,
    DEFAULT_FALLBACK_FONTS,
    DEFAULT_APPLY_TO_SHADOW_DOM,
    GOOGLE_FONTS_PRESETS,
)


def _options_schema(defaults: dict) -> vol.Schema:
    """Build the options schema with current defaults filled in."""
    return vol.Schema(
        {
            vol.Required(
                CONF_ENABLED,
                default=defaults.get(CONF_ENABLED, DEFAULT_ENABLED),
            ): bool,
            vol.Required(
                CONF_FONT_SOURCE,
                default=defaults.get(CONF_FONT_SOURCE, DEFAULT_FONT_SOURCE),
            ): vol.In([FONT_SOURCE_GOOGLE, FONT_SOURCE_CUSTOM, FONT_SOURCE_SYSTEM]),
            vol.Optional(
                CONF_FONT_FAMILY,
                default=defaults.get(CONF_FONT_FAMILY, DEFAULT_FONT_FAMILY),
            ): str,
            vol.Optional(
                CONF_FONT_URL,
                default=defaults.get(CONF_FONT_URL, DEFAULT_FONT_URL),
            ): str,
            vol.Optional(
                CONF_FONT_SIZE,
                default=defaults.get(CONF_FONT_SIZE, 0),
            ): vol.All(vol.Coerce(int), vol.Range(min=0, max=32)),
            vol.Optional(
                CONF_APPLY_TO_SHADOW_DOM,
                default=defaults.get(CONF_APPLY_TO_SHADOW_DOM, DEFAULT_APPLY_TO_SHADOW_DOM),
            ): bool,
        }
    )


class FontManagerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle the initial setup config flow."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict | None = None
    ) -> FlowResult:
        """Handle the first step — shown when user adds the integration."""
        # Only allow a single instance
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is not None:
            # Normalize fallback_fonts: store as list
            options = {
                CONF_ENABLED: user_input[CONF_ENABLED],
                CONF_FONT_SOURCE: user_input[CONF_FONT_SOURCE],
                CONF_FONT_FAMILY: user_input.get(CONF_FONT_FAMILY, DEFAULT_FONT_FAMILY),
                CONF_FONT_URL: user_input.get(CONF_FONT_URL, DEFAULT_FONT_URL),
                CONF_FONT_SIZE: user_input.get(CONF_FONT_SIZE, 0) or None,
                CONF_FALLBACK_FONTS: DEFAULT_FALLBACK_FONTS,
                CONF_APPLY_TO_SHADOW_DOM: user_input.get(
                    CONF_APPLY_TO_SHADOW_DOM, DEFAULT_APPLY_TO_SHADOW_DOM
                ),
            }
            return self.async_create_entry(title="Home Assistant Custom Fonts", data={}, options=options)

        schema = _options_schema({})
        return self.async_show_form(
            step_id="user",
            data_schema=schema,
            description_placeholders={
                "google_fonts_hint": "e.g. https://fonts.googleapis.com/css2?family=Roboto"
            },
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> FontManagerOptionsFlow:
        """Return the options flow handler."""
        return FontManagerOptionsFlow(config_entry)


class FontManagerOptionsFlow(config_entries.OptionsFlow):
    """Handle options updates (re-configuration)."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        self._config_entry = config_entry

    async def async_step_init(
        self, user_input: dict | None = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
            options = {
                CONF_ENABLED: user_input[CONF_ENABLED],
                CONF_FONT_SOURCE: user_input[CONF_FONT_SOURCE],
                CONF_FONT_FAMILY: user_input.get(CONF_FONT_FAMILY, DEFAULT_FONT_FAMILY),
                CONF_FONT_URL: user_input.get(CONF_FONT_URL, ""),
                CONF_FONT_SIZE: user_input.get(CONF_FONT_SIZE, 0) or None,
                CONF_FALLBACK_FONTS: self._config_entry.options.get(
                    CONF_FALLBACK_FONTS, DEFAULT_FALLBACK_FONTS
                ),
                CONF_APPLY_TO_SHADOW_DOM: user_input.get(
                    CONF_APPLY_TO_SHADOW_DOM, DEFAULT_APPLY_TO_SHADOW_DOM
                ),
            }
            return self.async_create_entry(title="", data=options)

        current = dict(self._config_entry.options)
        schema = _options_schema(current)

        return self.async_show_form(
            step_id="init",
            data_schema=schema,
            description_placeholders={
                "presets": ", ".join(GOOGLE_FONTS_PRESETS.keys())
            },
        )

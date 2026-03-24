"""Constants for Font Manager integration."""

DOMAIN = "font_manager"
PLATFORMS: list[str] = []

# Config keys
CONF_ENABLED = "enabled"
CONF_FONT_SOURCE = "font_source"
CONF_FONT_FAMILY = "font_family"
CONF_FONT_URL = "font_url"
CONF_FONT_SIZE = "font_size"
CONF_FALLBACK_FONTS = "fallback_fonts"
CONF_APPLY_TO_SHADOW_DOM = "apply_to_shadow_dom"
CONF_FONT_WEIGHT = "font_weight"
CONF_UPLOADED_FONTS = "uploaded_fonts"

# Font source options
FONT_SOURCE_GOOGLE = "google"
FONT_SOURCE_CUSTOM = "custom"
FONT_SOURCE_SYSTEM = "system"

FONT_SOURCES = [FONT_SOURCE_GOOGLE, FONT_SOURCE_CUSTOM, FONT_SOURCE_SYSTEM]

# Defaults
DEFAULT_ENABLED = True
DEFAULT_FONT_SOURCE = FONT_SOURCE_GOOGLE
DEFAULT_FONT_FAMILY = "Roboto"
DEFAULT_FONT_URL = (
    "https://fonts.googleapis.com/css2?family=Roboto"
    ":wght@300;400;500;700&display=swap"
)
DEFAULT_FONT_SIZE = None
DEFAULT_FALLBACK_FONTS = ["system-ui", "-apple-system", "sans-serif"]
DEFAULT_APPLY_TO_SHADOW_DOM = True
DEFAULT_FONT_WEIGHT = "400"

# Static paths
STATIC_PATH = "/font_manager/frontend"
FONTS_PATH = "/font_manager/fonts"

# Frontend files
FRONTEND_SCRIPT = "font-manager.js"
PANEL_SCRIPT = "font-manager-panel.js"

# API endpoints
API_BASE = "font_manager"
API_CONFIG = f"api/{API_BASE}/config"
API_FONTS = f"api/{API_BASE}/fonts"
API_UPLOAD = f"api/{API_BASE}/upload"

# Data store keys
DATA_CONFIG = "config"
DATA_ENTRY_ID = "entry_id"

# Allowed font file extensions
ALLOWED_FONT_EXTENSIONS = {".woff2", ".woff", ".ttf", ".otf"}
MAX_FONT_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

# Popular Google Fonts presets
GOOGLE_FONTS_PRESETS = {
    "Roboto": "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
    "Inter": "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    "Open Sans": "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap",
    "Lato": "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap",
    "Nunito": "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap",
    "Montserrat": "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap",
    "Poppins": "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
    "Source Sans 3": "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&display=swap",
    "JetBrains Mono": "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap",
    "Fira Code": "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap",
}

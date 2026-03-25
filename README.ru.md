# 🔤 Home Assistant Custom Fonts

> 🇬🇧 [English README](README.md)

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2023.9%2B-blue.svg)](https://www.home-assistant.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/itsyuni/homeassistant-customfonts)](https://github.com/itsyuni/homeassistant-customfonts/releases)

> Глобальная замена шрифтов во всём интерфейсе Home Assistant (Lovelace) — Google Fonts, загрузка собственных шрифтов, системные шрифты. Поддержка Shadow DOM включена.

<img width="700" src="https://github.com/user-attachments/assets/09b717a4-5b5b-442c-b775-9e318908f639" />


---

## ✨ Возможности

- **Google Fonts** — вставьте URL из Google Fonts или выберите из 10 встроенных пресетов
- **Загрузка своих шрифтов** — загружайте `.woff2`, `.woff`, `.ttf`, `.otf` прямо через интерфейс
- **Системные шрифты** — использование шрифта ОС с правильной цепочкой запасных
- **Обход Shadow DOM** — шрифты внедряются в каждый Web Component, а не только в корень документа
- **Предпросмотр в реальном времени** — видите изменения до сохранения
- **Включение / Выключение** — отключите плагин без удаления
- **Настройка базового размера шрифта** — глобальный размер в пикселях
- **🌐 Двуязычный интерфейс** — English и Русский в панели настроек
- **Не требует настройки** — работает сразу после установки

---

## 📦 Установка через HACS

Самый простой способ — через [HACS](https://hacs.xyz).

[![Добавить в HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=itsyuni&repository=homeassistant-customfonts&category=integration)

### Шаги

1. Нажмите кнопку выше **или** откройте HACS → Интеграции → ⋮ → Пользовательские репозитории
2. Добавьте `https://github.com/itsyuni/homeassistant-customfonts` с категорией **Integration**
3. Найдите **Home Assistant Custom Fonts** в магазине HACS и нажмите **Скачать**
4. Перезапустите Home Assistant
5. Перейдите в **Настройки → Устройства и службы → Добавить интеграцию** → найдите **Home Assistant Custom Fonts**
6. Пройдите мастер настройки

---

## 🛠 Ручная установка

1. Скачайте [последний релиз](https://github.com/itsyuni/homeassistant-customfonts/releases/latest)
2. Скопируйте папку `custom_components/font_manager/` в директорию конфигурации HA:
   ```
   config/
   └── custom_components/
       └── font_manager/   ← сюда
   ```
3. Перезапустите Home Assistant
4. Добавьте интеграцию через **Настройки → Устройства и службы → Добавить интеграцию**

---

## ⚙️ Настройка

После установки откройте раздел **Custom Fonts** в боковом меню HA.

| Настройка | Описание |
|---|---|
| Включить Custom Fonts | Глобальный переключатель вкл/выкл |
| Источник шрифта | Google Fonts / Свой файл / Системный |
| Название шрифта | Имя семейства шрифта (например `Roboto`) |
| URL Google Fonts | Полный CSS URL с [fonts.google.com](https://fonts.google.com) |
| URL файла шрифта | Прямая ссылка на `.woff2` / `.woff` / `.ttf` |
| Базовый размер шрифта | Размер в px (0 = оставить стандартный HA) |
| Применять к Shadow DOM | Внедрять шрифты в Web Components |

### Быстрые пресеты (Google Fonts)

Roboto · Inter · Open Sans · Lato · Nunito · Montserrat · Poppins · Source Sans 3 · JetBrains Mono · Fira Code

---

## 🔧 Как это работает

```
Загрузка Home Assistant
  └── add_extra_js_url() внедряет font-manager.js
        └── fetch() → /api/font_manager/config  (публичный endpoint)
              └── Формирование @font-face / Google Fonts <link>
                    └── Внедрение <style> в документ
                          └── Патч Element.prototype.attachShadow
                                └── MutationObserver следит за новыми узлами
                                      └── Внедрение <style> в каждый shadow root
```

Shadow DOM — главная сложность во frontend HA. `<style>` в `<head>` не пробивает его. Интеграция использует три уровня защиты:

1. **Патч `attachShadow()`** — перехватывает создание каждого нового shadow root
2. **MutationObserver** — следит за добавлением новых DOM-узлов (дебаунс 100 мс)
3. **Полный обход дерева** — выполняется при загрузке для всех существующих корней

---

## 🌐 Языковая поддержка

Панель настроек доступна на **английском** и **русском** языках. Язык определяется автоматически из настроек браузера и может быть изменён кнопкой `EN / RU` в заголовке панели.

Приветствуются добавление новых языков, отправляйте свои Pull request'ы :)

---

## 📋 Требования

- Home Assistant **2023.9.0** или новее
- [HACS](https://hacs.xyz) (для установки в один клик)
- Интернет для Google Fonts (необязательно — свои шрифты работают офлайн)

---

## 📄 Лицензия

MIT © [itsyuni](https://github.com/itsyuni)

# Assets structure (senior-style organization)

## CSS (`css/`)

- **`main.css`** – Single entry; imports all layers in order.
- **`base/`** – Variables, reset, theme (e.g. `variables.css`).
- **`layout/`** – Page structure and navbar (`layout.css`, `navbar.css`).
- **`components/`** – Reusable UI: language-select, search, filters, breaking, sections, news-grid, news-modal, sidebar.

## JS (`js/`)

Loaded in dependency order by `loader.js`:

- **`data/`** – Translations and i18n API (`translations.js`).
- **`components/`** – Nav (scroll, smooth scroll), language dropdown, theme, RSS, search tooltip, filters (+ More dropdown).
- **`features/`** – News grid (data, filters, infinite scroll), news modal, breaking banner, sidebar (newsletter).

Legacy single-file entry: `script.js` (kept for reference; app runs from the modular scripts above).

## Partials (`partials/`)

- **`layout/`** – `nav.html`, `content.html`, `sidebar.html`.
- **`components/`** – `modals.html` (news modal + search tooltip popup).
- **`head.html`** – Meta, title, CSS and font links (used by `build.js`).

## Run

Serve over HTTP (e.g. `npx serve .` or `python -m http.server`), then open the site. The loader fetches partials from `layout/` and `components/` and injects scripts in order.

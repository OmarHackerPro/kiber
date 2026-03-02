# Week 5 Deliverable: Webhooks, RSS, SSR/Pre-render, Structured Data, QA

## 1. Webhook & RSS configuration

### Webhook config (`webhooks.html`)
- **Create:** Name (optional), Endpoint URL (validated: HTTPS, no spaces, basic URL format), Secret (generate + copy once, masked after creation), Event types (multi-select), Payload format note (JSON versioned schema), Retry note (exponential backoff).
- **Manage:** List with enabled toggle, last delivery status (success/fail + timestamp), "Test delivery" button (sends sample payload via `fetch`), "Recent attempts" panel (last 10) with response code and latency.
- **Safety/UX:** Secrets not stored in plain text (only masked placeholder after create); clear error for invalid URL; empty state with use-case copy.
- **Storage:** Client-only (localStorage) until backend exists.

### RSS config (`rss-config.html`)
- **Feed generator:** What’s included (My Stack, Digest, Saved Entities), Filters (tags, sources, frequency, language).
- **Output:** RSS feed URL with private token; "Regenerate token" (invalidates previous link); "Copy URL."
- **Security:** Token in localStorage; rotation replaces token so old URL stops working.

### Deliverable
- Screens exist; URL validation and test delivery work; URLs/tokens copy reliably.

---

## 2. Pre-render strategy (Option B)

**Chosen path:** Pre-render (static HTML) + client hydration. No SSR server.

- **Pre-rendered routes:** `index.html`, `category.html`, `search.html`, `entity.html`, `preferences.html`, `webhooks.html`, `rss-config.html` are static HTML files. Main content and metadata are in the initial HTML.
- **Revalidation:** Static files; content updates require redeploy or a future build step (e.g. time-based or webhook-triggered rebuild if moving to a static generator).
- **Client-only deferred:** Theme (localStorage), language switcher, dynamic content injection on index/category (loader), analytics. No `window`/`document`/`localStorage` during “server” render because there is no server render—only static HTML. Critical content and meta tags are in the HTML.
- **QA acceptance:** Pre-rendered pages have full metadata and meaningful HTML (nav, main structure). View-source shows JSON-LD and meta.

---

## 3. Structured data (JSON-LD) verification

### Implemented
- **index.html:** Organization + WebSite in `<head>` (script type="application/ld+json"). Meta description, canonical.
- **search.html:** WebPage + BreadcrumbList (Home → Search). Meta description, canonical.
- **entity.html:** WebPage + BreadcrumbList (Home → Search → Entity) + Article. Meta description, canonical.

### Verification checklist
- [ ] JSON-LD present in raw HTML (view-source), not only in DevTools.
- [ ] Canonical URL matches the real route (update `https://cybernews.example.com/` to your production domain).
- [ ] name/title/description non-empty.
- [ ] No duplicate or conflicting structured data blocks on the same page.
- [ ] Robots meta: add `<meta name="robots" content="index, follow">` on public pages if needed.

### Note
- Replace `https://cybernews.example.com/` in all JSON-LD and canonicals with your real origin before production.

---

## 4. Performance & accessibility QA

### Performance (Core Web Vitals mindset)
- **LCP:** Minimize render-blocking; above-the-fold content in HTML; images (if any) with correct sizing, modern formats, lazy-load below fold.
- **INP:** Event handlers lightweight; avoid long tasks in click/focus handlers.
- **CLS:** Reserve space for dynamic content; avoid inserting content above existing layout.
- **Quick wins:** Code split by page (each page loads its own JS); defer non-critical scripts; limit font variants and use `font-display: swap`; static assets with long cache headers where applicable.

### Accessibility
- [ ] Keyboard navigation works (no traps); all interactive elements focusable.
- [ ] Focus states visible (outline or custom focus style).
- [ ] Heading hierarchy: one H1 per page; logical H2/H3.
- [ ] Form labels and error messages associated (e.g. `id`/`for`, `aria-describedby`, `aria-invalid`).
- [ ] Color contrast meets minimum (WCAG AA).
- [ ] ARIA only where needed (roles, aria-expanded, aria-live for dynamic messages).

### QA pass template
- **Smoke test routes:** dashboard (index), entity page, share flow, webhook config, RSS config.
- **Mobile:** Layout at 320px width.
- **No-JS:** Public pages (index, search, entity) show main content and metadata in raw HTML.
- **Lighthouse:** Run on marketing/public page, share link page, entity page; address critical issues.

### Known issues (short list)
- Webhook “test delivery” uses real `fetch` to user-provided URL; CORS or network errors show as failed attempt.
- RSS feed URL points to `/feed/rss.xml`; that endpoint is not implemented (backend or static XML needed).
- JSON-LD uses placeholder domain `https://cybernews.example.com/`; replace for production.
- Entity page title/description in HTML are generic; entity-specific meta could be injected client-side for share unfurls (optional).

---

## Suggested Week 5 output (done)

| Item | Status |
|------|--------|
| Webhook + RSS screens shippable (create/manage/test, copy URLs/tokens) | Done |
| Pre-render chosen and validated (static HTML, no SSR) | Done |
| Structured data + metadata in server HTML | Done |
| QA report and checklist (with known issues) | This doc |

# SiteCraft

A minimal, self-hosted website with a public home page and a local Admin
Dashboard for managing it — no backend, no database, no cloud services.
Every piece of content (modules, navigation, buttons, pages, theme) lives in
your browser's `localStorage` and is editable from `/admin` without writing
any HTML.

Built with **React + Vite + React Router + Tailwind CSS v4**, and designed
from the ground up to run 100% offline after installation and to deploy
as a static site to GitHub Pages.

---

## Table of contents

- [Privacy & security](#privacy--security)
- [Tech stack & dependencies](#tech-stack--dependencies)
- [Installation](#installation)
- [Running locally](#running-locally)
- [Folder structure](#folder-structure)
- [Building for production](#building-for-production)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [Using the Admin Dashboard](#using-the-admin-dashboard)
- [Customization](#customization)
- [Data model & storage](#data-model--storage)
- [Accessibility](#accessibility)
- [Future improvements](#future-improvements)

---

## Privacy & security

This project is built as a **privacy-first, offline-first, self-hosted**
application. Concretely:

- **No third-party services.** No Firebase, Supabase, Auth0, Stripe,
  Google/Microsoft APIs, or anything similar is integrated or required.
- **No telemetry.** No analytics, crash reporting, usage tracking, or
  device fingerprinting of any kind, and no automatic updates.
- **No CDN dependencies.** Nothing is loaded from Google Fonts, jsDelivr,
  unpkg, Cloudflare, Bootstrap CDN, Font Awesome CDN, or any other external
  script/stylesheet host. Fonts, icons, and all JS/CSS are bundled locally
  by Vite at build time.
- **Works fully offline.** Once `npm install` has fetched dependencies (or
  the site has been built/deployed once), the app makes zero network
  requests during normal use. Open the built `dist/index.html` and it
  works with no server.
- **Local-only data.** All site content is stored in the browser's
  `localStorage`, in a single JSON blob, and never transmitted anywhere.
  Export/import buttons in the dashboard let you move that JSON between
  machines yourself.
- **Content Security Policy.** `index.html` ships a strict CSP
  (`default-src 'self'`, no inline/eval scripts, no remote origins) — see
  the comment above the `<meta http-equiv="Content-Security-Policy">` tag.
- **Input sanitization.** All user-editable destinations (module links,
  button destinations, nav URLs, logo/image URLs) pass through
  `src/lib/security.js#sanitizeUrl`, which only allows relative paths,
  in-page anchors, and `http(s)`/`mailto:` links — `javascript:`/`data:`
  style payloads are rejected before they're stored. Page and module text
  is rendered as plain React children, never via `dangerouslySetInnerHTML`.
- **Local admin password (optional).** The password is never stored —
  only a SHA-256 hash salted per-install, computed with the browser's
  native Web Crypto API (`src/lib/security.js`, `src/lib/auth.js`). No
  password library, no OAuth, no external identity provider. This is a
  deterrent for a shared machine, not hardened multi-user authentication —
  there's no server, so there's nothing to rate-limit brute-force attempts
  against. Treat it accordingly.
- **Session handling.** The "unlocked" admin state lives in
  `sessionStorage`, so it clears automatically when the tab/window closes.

## Tech stack & dependencies

| Package | Why it's here | License |
|---|---|---|
| `react`, `react-dom` | UI rendering | MIT |
| `react-router-dom` | Client-side routing (`HashRouter`, so GitHub Pages needs no server rewrite rules) | MIT |
| `vite`, `@vitejs/plugin-react` | Dev server + production bundler | MIT |
| `tailwindcss`, `@tailwindcss/vite` | Utility CSS, compiled at build time — no Tailwind CDN build | MIT |
| `@fontsource/inter` | Self-hosted Inter font files, bundled locally instead of linking fonts.googleapis.com | MIT (package) / SIL OFL 1.1 (font) |
| `lucide-react` | Icon set, tree-shaken to only the icons actually used (see `src/components/Icon.jsx`) | ISC |
| `gh-pages` (dev only) | One-command publish of `dist/` to a `gh-pages` branch over local git — no external deploy service | MIT |
| `oxlint` (dev only) | Fast local linter | MIT |

No analytics, auth, state-management, animation, or UI-kit library is
installed beyond this list. Password hashing and unique IDs use the
browser's native Web Crypto API (`crypto.subtle`, `crypto.randomUUID`)
instead of an extra dependency.

## Installation

```bash
git clone <your-repo-url> sitecraft
cd sitecraft
npm install
```

Requires Node.js 18+ and npm. No other services, accounts, or API keys are
needed.

## Running locally

```bash
npm run dev
```

Opens the Vite dev server (default `http://localhost:5173`). Visit `/#/`
for the home page and `/#/admin` for the dashboard.

Because this is a static Vite app, you can also just build it and open it
with any static file server (or a tool like VS Code's Live Server) once
built — see [Building for production](#building-for-production).

## Folder structure

```
sitecraft/
├── .github/workflows/deploy.yml   # GitHub Actions: build + publish to Pages
├── public/                        # Static files copied as-is (favicon, etc.)
├── src/
│   ├── admin/                     # Admin Dashboard (separate route tree, /admin)
│   │   ├── AdminApp.jsx           # Auth gate + nested routes
│   │   ├── AdminLayout.jsx        # Sidebar shell
│   │   ├── AdminLogin.jsx         # Local password screen
│   │   └── pages/                 # One file per dashboard section
│   │       ├── Overview.jsx       # Stats, password settings, backup/restore
│   │       ├── ModulesManager.jsx # Add/edit/delete/reorder/hide home modules
│   │       ├── ThemeSettings.jsx  # Colors, logo, title, footer text
│   │       ├── NavigationManager.jsx
│   │       ├── ButtonsManager.jsx
│   │       └── PagesManager.jsx   # Create new routable pages
│   ├── components/                # Shared UI: Navbar, Footer, Card, Button,
│   │                               # Modal, ConfirmDialog, Toast, Spinner,
│   │                               # EmptyState, SearchBox, Icon
│   ├── data/defaultData.js        # Seed content used only on first run
│   ├── lib/
│   │   ├── storage.js             # localStorage engine (subscribe/notify)
│   │   ├── useStore.js            # React hook wrapper (useSyncExternalStore)
│   │   ├── auth.js                # Local admin password + session
│   │   └── security.js            # Hashing, URL sanitizing, slugify
│   ├── pages/
│   │   ├── Home.jsx                # Public landing page
│   │   └── DynamicPage.jsx         # Renders pages created in Page Manager
│   ├── App.jsx                     # Route table + live theme application
│   ├── main.jsx                    # Entry point (wraps App in HashRouter)
│   └── index.css                   # Tailwind import, design tokens, animations
├── index.html                      # CSP, favicon, fonts loaded via bundle
├── vite.config.js                  # base: './' for GitHub Pages-relative asset paths
└── package.json
```

## Building for production

```bash
npm run build      # outputs static files to dist/
npm run preview    # serve the build locally to sanity-check it
```

The build is a fully static set of files — HTML, JS, CSS, fonts, images —
with no server-side code anywhere.

## Deploying to GitHub Pages

Two supported paths — pick one:

**Option A — GitHub Actions (recommended).** This repo includes
`.github/workflows/deploy.yml`, which builds the site and publishes it via
GitHub's own Pages infrastructure on every push to `main`.

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).
   Your site will be live at `https://<user>.github.io/<repo>/`.

**Option B — `gh-pages` CLI.** Publishes `dist/` directly to a `gh-pages`
branch from your machine, no Actions required:

```bash
npm run deploy
```

Then set **Settings → Pages → Source** to **Deploy from a branch** →
`gh-pages` / `root`.

Because `vite.config.js` sets `base: './'`, the build uses relative asset
paths, so it works whether the repo is served from the domain root or from
a `/<repo-name>/` subpath — no extra configuration needed. Routing uses
`HashRouter` (URLs like `#/admin`) specifically so page refreshes work on
GitHub Pages' static hosting without a server-side rewrite rule.

## Using the Admin Dashboard

Open `/#/admin` (e.g. `http://localhost:5173/#/admin` in dev, or
`https://<your-site>/#/admin` once deployed).

- **Overview** — content counts, optional local password protection,
  and JSON export/import/reset.
- **Modules** — the cards shown in the home page's *Modules* section.
  Add, edit, delete, drag-to-reorder (or use the up/down arrows), and
  toggle visibility. A live preview updates as you type.
- **Theme** — accent/background/card/text colors, website title, logo,
  tagline, and footer text. Applies instantly, everywhere.
- **Navigation** — links shown in the header, with ordering and a
  visibility toggle.
- **Buttons** — reusable CTA buttons (e.g. the hero's primary/secondary
  buttons), each with its own style, color, and "open in new tab" option.
- **Pages** — create additional routable pages (name, slug, description,
  content, icon, and whether to feature the page on the home page). Each
  page becomes available immediately at `#/<slug>` — no rebuild needed,
  since it's rendered from stored data rather than a generated HTML file.

All changes save to `localStorage` immediately and are reflected on the
home page in the same tab and any other open tab/window.

## Customization

- **Theme editing** — either through Admin → Theme, or by editing the
  CSS custom properties (`--accent`, `--surface`, `--card`, `--ink`, etc.)
  and Tailwind `@theme` block at the top of `src/index.css`.
- **Adding modules programmatically** — edit the seed content in
  `src/data/defaultData.js` (only affects a fresh install with no existing
  `localStorage` data), or add them through the dashboard.
- **Icons** — module/feature/page icons are chosen from a curated list in
  `src/components/Icon.jsx` (`ICON_CHOICES`). Add more `lucide-react`
  icon names to that file's import list and `ICON_MAP`/`ICON_CHOICES` to
  make them selectable.
- **Fonts** — Inter ships via `@fontsource/inter`; swap the imports at the
  top of `src/index.css` for a different self-hosted `@fontsource/*`
  package to change typefaces without adding a CDN dependency.

## Data model & storage

Everything lives under one `localStorage` key (`sitecraft:data`) as JSON,
shaped like:

```json
{
  "siteConfig": { "title": "…", "logoText": "…", "footerText": "…", "social": [] },
  "theme": { "accent": "#12355B", "surface": "#FAF9F6", "card": "#FFFFFF", "ink": "#222222" },
  "navigation": [{ "id": "…", "title": "…", "url": "…", "order": 1, "visible": true }],
  "modules": [{ "id": "…", "title": "…", "description": "…", "icon": "…", "order": 1, "visible": true }],
  "buttons": [{ "id": "…", "text": "…", "destination": "…", "style": "primary" }],
  "pages": [{ "id": "…", "name": "…", "slug": "…", "content": "…", "showOnHome": false }]
}
```

`src/lib/storage.js` is the single place that reads/writes this key; every
component goes through `store.*` methods and the `useSiteData()` hook
rather than touching `localStorage` directly, which is what makes it
straightforward to later swap the backing store (see below) without
touching UI code.

## Accessibility

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) throughout.
- All interactive controls are real `<button>`/`<a>` elements with
  `aria-label`s where icon-only.
- Visible focus rings (`:focus-visible`) tuned for keyboard navigation.
- Modals trap Escape-to-close and are marked `role="dialog"`
  /`aria-modal`; toggles use `role="switch"`/`aria-checked`.
- Respects `prefers-reduced-motion` by disabling animations/transitions.
- Mobile navigation is a real, keyboard-reachable disclosure — not a
  hover-only menu.

## Future improvements

The architecture is intentionally boring in the middle layer (a single
`store` object with a subscribe/notify pattern) so these can be added
without a rewrite:

- **IndexedDB** for larger datasets — swap the body of `load()`/`persist()`
  in `src/lib/storage.js`; the `store.*` API and `useSiteData()` hook
  wouldn't need to change.
- **Local file-based storage** (writing/reading actual JSON files) via the
  File System Access API for browsers that support it, as a step toward
  the "migrate to JSON files" path mentioned above.
- **Self-hosted backends**, if ever needed: PostgreSQL, SQLite, MariaDB,
  or DuckDB for storage; PocketBase or Appwrite (self-hosted) for a
  batteries-included backend; Keycloak for real multi-user auth; MinIO for
  file storage; Gitea for git hosting; Grafana/Prometheus for
  self-hosted observability. None of these are cloud SaaS — all can run
  on infrastructure you control.
- **Markdown pages** — extend `PagesManager`/`DynamicPage` to parse
  Markdown (a small, permissively-licensed parser like `marked` or
  `micromark`, rendered through a sanitizer, would be the natural choice)
  instead of the current plain-paragraph splitting.
- **Dark mode** — the CSS custom properties in `src/index.css` are already
  centralized, so a dark palette is mostly a second `@theme`/`:root[data-theme="dark"]`
  block plus a toggle.
- **Search** — a client-side index (e.g. a small local search library) over
  modules/pages content, no external search service required.
- **Blog** — a natural extension of the Page Manager: add a `publishedAt`
  field and a listing view.

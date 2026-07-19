# Braeden Keena — Portfolio / Resume Site

Personal site and portfolio. Astro static frontend, deployed to Cloudflare Pages, with a
headless CMS (WordPress + WPGraphQL) planned as a Phase 2 upgrade behind the same content
interface.

## Why Astro, and why it's built this way

The site itself is part of the pitch — it needs to *be* fast and clean, not just claim to be.
Astro renders every page to static HTML at build time with **zero client-side JavaScript by
default**; a production build of this site currently ships an HTML file and a CSS file, no JS
bundle at all. That's not an accident to preserve — if a future change adds an interactive
island, make sure it's opt-in (`client:` directive on a specific component) rather than global.

## Architecture

```
Astro (content collections)  →  GitHub  →  Cloudflare Pages
        ▲
        │  Phase 2: swap the loader, not the components
        │
Headless WordPress + WPGraphQL
```

**Phase 1 (this repo, now):** All content — bio, resume, the CSI case study, other projects,
roadmap — lives in [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
as markdown/JSON files under `src/content/`, validated by zod schemas in `src/content.config.ts`.
Components never hardcode copy; they call `getCollection()` / `render()` and lay out whatever
comes back. `npm run build` produces a fully static `dist/` folder, which is exactly what
Cloudflare Pages wants — no adapter, no server runtime.

**Phase 2 (later):** Point WordPress + WPGraphQL as the source of truth, and change the
`loader` in each collection definition from `glob()`/`file()` (reads local markdown/JSON) to a
loader that queries WPGraphQL and shapes the response into the same schema. Because every
component was written against the zod-validated collection shape — never against "a markdown
file" — this should be a change confined almost entirely to `src/content.config.ts`, with no
component rewrites. That's the entire reason for the content-collection discipline in Phase 1:
it's the seam Phase 2 plugs into.

## Content model

| Collection     | Source                              | Maps to (Phase 2)                          |
| --------------- | ------------------------------------ | ------------------------------------------- |
| `profile`       | `src/content/profile/main.md`        | ACF options page / site-settings singleton  |
| `experience`    | `src/content/experience/*.md`        | Custom post type `experience`               |
| `projects`      | `src/content/projects/*.md`          | Custom post type `project`                  |
| `case-studies`  | `src/content/case-studies/*.md`      | Custom post type `case_study`               |
| `roadmap`       | `src/content/roadmap/*.md`           | Custom post type `roadmap_item`             |
| `skills`        | `src/content/skills/skills.json`     | ACF repeater field on the options page      |

Site navigation labels (`src/lib/nav.ts`) are deliberately **not** a content collection — that's
page information architecture, not editorial content, and isn't something WordPress would own
even after Phase 2.

## Privacy — CSI project data

**The public site carries methodology and aggregate results only.** Raw CSI captures, device
identifiers (MAC addresses, SSIDs, per-node identity dumps), and the 2D apartment / spatial map
must never be committed to this repo or published on the site. `.gitignore` has a dedicated
section enforcing this (catch-all `/private/`, `/raw-data/`, `/captures/`, `/sessions/`
directories, plus patterns for capture file formats, device-identifier dumps, and floor-plan/
spatial-map outputs) — read it before adding any CSI-related asset here. If something doesn't
match an existing pattern, drop it in `/private/` rather than adding a new exception.

The **live-demo slot** on the CSI case study (`demoSlot` in `case-studies/csi-array.md`) is a
placeholder for a **canned, sanitized recording** of the monitor — never a live feed of the real
space. `DemoSlot.astro`'s copy says so explicitly; keep that framing when the slot is eventually
filled in, and sanitize/crop any recording before it goes in `public/`.

## Adding content

- **New project:** add a markdown file to `src/content/projects/`, following the frontmatter
  shape in an existing entry. It appears in the grid automatically — no component change.
- **CSI live demo:** `src/content/case-studies/csi-array.md` has a `demoSlot` field
  (`status: coming-soon | gif | video | live-embed`, plus `mediaUrl`). Drop a GIF in `public/`,
  flip `status` to `gif`, point `mediaUrl` at it. No component rework — `DemoSlot.astro` already
  handles all four states.
- **Hardware photos:** once the 3D-printed enclosures are ready, add them as images in the
  `case-studies` entry or a new `stats`/gallery field; the schema can grow additively without
  breaking existing entries.

## Design system

Restrained and typographic, not a product-marketing look — flat dark background, hairline
dividers instead of card fills, plain underlined text links instead of buttons, one muted accent
color used sparingly (the CSI headline stat, link hovers). Type is the OS system font stack (no
web font download — one less network request, one less thing to flash-of-unstyled-text). All
design tokens live in `src/styles/global.css` as CSS custom properties.

## Commands

| Command           | Action                                       |
| ------------------ | --------------------------------------------- |
| `npm install`       | Install dependencies                          |
| `npm run dev`       | Local dev server at `localhost:4321`          |
| `npm run build`     | Build the static site to `./dist/`            |
| `npm run preview`   | Preview the production build locally          |

Requires Node ≥ 22.12 (see `.nvmrc`; run `nvm use` if using nvm).

## Deploying (not done yet, by design)

This repo is scaffolded and builds cleanly but is **not** connected to GitHub or Cloudflare Pages
yet — that connection is a deliberate manual step. When ready:

1. Push this repo to GitHub.
2. In Cloudflare Pages, create a project from the GitHub repo.
3. Build command: `npm run build`. Build output directory: `dist`.
4. No environment variables or adapters are needed for Phase 1 (pure static output). Phase 2's
   WPGraphQL endpoint URL will be added as a Pages environment variable when that lands.

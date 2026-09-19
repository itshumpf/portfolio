# Braeden Keena — Portfolio and Resume

Source for [braedenkeena.pages.dev](https://braedenkeena.pages.dev), a public
portfolio focused on recurring data pipelines, data integrity, failure detection,
embedded RF experiments, and operations leadership.

The site is built with Astro and deployed as static output on Cloudflare Pages.
It includes technical investigations, shipped projects, paid client work,
leadership case studies, and a generated two-page resume.

## What this repository demonstrates

- Static-first portfolio architecture with no SPA or client framework runtime.
- Content collections validated before the site can build.
- A fact registry that rejects missing, retired, or contradictory figures.
- Project write-ups that preserve provenance, limitations, and negative results.
- Small, explicit client-side enhancements instead of global hydration.
- Production essentials: canonical URLs, sitemap, `robots.txt`, and a custom 404.

## Architecture

```text
Astro content collections
        ↓
Static HTML and CSS + scoped inline JavaScript
        ↓
GitHub repository
        ↓
Cloudflare Pages
```

Astro renders the site to `dist/`; no adapter or application server is required.
The build does not emit a sitewide application bundle or framework runtime. It
does ship deliberate inline JavaScript for theme and party-mode controls on every
page, a deferred Cloudflare Web Analytics beacon, and page-specific scripts for
interactive technical exhibits such as the CSI and link-signature explorers. The
standalone dashboard and permit deliverable under `public/` also contain their
own self-contained scripts.

## Content model

All collections are defined and validated in `src/content.config.ts`.

| Collection | Source | Purpose |
| --- | --- | --- |
| `profile` | `src/content/profile/main.md` | Identity, positioning, contact details, and resume link |
| `experience` | `src/content/experience/*.md` | Professional experience timeline |
| `projects` | `src/content/projects/*.md` | Shipped technical and client projects |
| `case-studies` | `src/content/case-studies/*.md` | Long-form technical investigations |
| `leadership` | `src/content/leadership/*.md` | Operations and leadership case studies |
| `roadmap` | `src/content/roadmap/*.md` | Current and planned work |
| `skills` | `src/content/skills/skills.json` | Technical capability groups |
| `reviews` | `src/content/reviews/*.md` | Paid engagements and client evidence |

Navigation lives in `src/lib/nav.ts` because it is page information
architecture rather than editorial content.

## Fact verification

Hard numbers published by the site are registered in
`src/data/portfolio_facts.json` with a derivation and the pages on which each
figure must appear. `scripts/check-facts.mjs` inspects the production build and
fails when:

- a canonical figure is missing from a required page;
- a retired figure reappears; or
- one page contradicts another.

Run the production build and fact checker together with:

```bash
npm run check
```

## Privacy boundary

The public CSI material contains methodology and aggregate results only. Raw
captures, device identifiers, per-node identity dumps, and spatial maps are not
part of this repository. The CSI demo slot is reserved for a sanitized recording,
not a live feed from a private environment.

## Local development

Requires Node.js 22.19 or newer. The repository's expected version is recorded
in `.nvmrc`.

```bash
npm install
npm run dev
npm run check
npm run preview
```

| Command | Action |
| --- | --- |
| `npm run dev` | Start the local Astro development server |
| `npm run build` | Build the static site into `dist/` |
| `npm run verify` | Check a previously built site against the fact registry |
| `npm run check` | Build and run the fact checker |
| `npm run preview` | Serve the production build locally |

## Deployment

Production is hosted on Cloudflare Pages from this GitHub repository.

- Build command: `npm run build`
- Output directory: `dist`
- Runtime adapter: none; the output is static
- Environment variables: none required for the current site

The canonical production URL is
[braedenkeena.pages.dev](https://braedenkeena.pages.dev).

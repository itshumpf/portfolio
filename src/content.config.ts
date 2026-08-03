// Content Layer configuration.
//
// Every piece of copy on the site lives here, not in components. Each
// collection maps to something that becomes a WordPress post type / ACF
// field group in Phase 2 (see README "Phase 2" section) — swapping the
// `loader` from `glob`/`file` to a WPGraphQL fetch loader should be the
// only change needed, because components only ever consume the shape
// defined by these zod schemas, never the file source.
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// A photo in `public/`, with its intrinsic dimensions so the renderer can
// reserve layout space and respect the source aspect ratio. Declared here,
// above the first collection that uses it, because both `profile` (the
// homepage header band) and `leadership` (case-study photography) consume it.
const imageSlot = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
  caption: z.string().optional(),
  // 'small' constrains display width — for low-resolution sources that
  // would visibly upscale at full column width.
  size: z.enum(['default', 'small']).optional(),
});

const profile = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/profile' }),
  schema: z.object({
    name: z.string(),
    // The lead claim. Carries the hero on its own — typography and
    // hierarchy do the work, deliberately no motion anywhere on the page.
    claim: z.string(),
    // One honest, specific sentence — not a tagline or positioning slogan.
    // Renders under the claim as supporting detail, not as the opener.
    oneLiner: z.string(),
    // Small status indicator near the top of the hero, e.g. what he is
    // doing right now. Rendered as a quiet mono line, never a headline.
    status: z.string().optional(),
    // Availability fact (e.g. "Available for contract work"), paired with a
    // small green dot next to the name. States a fact, not a CTA — no link,
    // no verb aimed at the reader. Omit/blank this field to remove it
    // entirely once it's no longer true; it's the only place that controls it.
    availability: z.string().optional(),
    location: z.string(),
    email: z.string(),
    resumeUrl: z.string().optional(),
    links: z.array(
      z.object({
        label: z.string(),
        url: z.string(),
      }),
    ),
    // The hero's two primary destinations — one per lane of the site
    // (operations, engineering). Rendered as understated bordered `.btn`
    // links, never as filled marketing buttons. `href` is same-origin, so
    // these are plain internal links, distinct from the external `links`
    // row below them.
    ctas: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
        }),
      )
      .default([]),
    // Editorial photograph rendered as a wide band directly BELOW the hero
    // text block — never behind it. Text over a photo is the generic
    // landing-page look this site deliberately avoids, and it costs
    // contrast. The band is context for the claim above it, so it carries a
    // factual caption rather than sitting purely decorative.
    headerImage: imageSlot.optional(),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/experience' }),
  schema: z.object({
    role: z.string(),
    org: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    order: z.number(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    // When true, the card renders the markdown body (multi-paragraph,
    // CSI-case-study style) instead of the single-line tagline. Always
    // rendered in full — nothing on this site collapses or requires a
    // click to reveal; the depth is the point.
    expandedBody: z.boolean().optional(),
    period: z.string(),
    role: z.string(),
    // 'delivered' is for client work that's finished and shipped but has
    // no public URL to point 'live' at (confidential deliverables, etc).
    status: z.enum(['live', 'sunset', 'wip', 'delivered']),
    // Distinguishes commissioned/contract work from self-directed
    // founder projects. Defaults to 'personal' so existing entries don't
    // need updating; the card only shows a badge when it's 'client'.
    kind: z.enum(['personal', 'client']).default('personal'),
    order: z.number(),
    tech: z.array(z.string()),
    links: z.object({
      live: z.string().optional(),
      repo: z.string().optional(),
      // Shown instead of a link when a project has neither — e.g.
      // confidential client work with no public repo or deployment —
      // so the card reads as complete rather than as a broken card
      // missing its link.
      noLinkNote: z.string().optional(),
    }),
    stats: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
      .optional(),
    // Product screenshots under `public/work/`. These describe visual
    // products, so prose alone undersells them. Rendered below the body at
    // full column width, except `size: 'small'` (phone captures), which is
    // capped so it displays at something like handset scale instead of
    // upscaling a narrow source across the column.
    screenshots: z.array(imageSlot).optional(),
    // A short opening lede, rendered above the tagline/body: why the
    // project was done, why it was built the way it was, and what it
    // actually does or enables. The abstract, not a summary that lets a
    // reader skip the rest — everything below it still renders in full.
    thesis: z.string().optional(),
    // One visible closing sentence answering "so what" — every project
    // here documents what was built; this is the field that says why it
    // was worth building.
    impact: z.string().optional(),
    // A 2-4 word descriptor shown next to the title in the homepage's
    // project index (a table-of-contents jump list, not a summary). Tells a
    // stranger whether the project is worth jumping to — e.g. "GAScout"
    // alone means nothing outside Georgia, "Georgia public records" does.
    // Deliberately not a second tagline: keep it shorter than that.
    indexLabel: z.string().optional(),
    // A single client quote. Kept restrained on purpose: plain text quote
    // + attribution, no card, no star-rating graphic, no carousel — the
    // site's whole aesthetic is that it doesn't need one of those.
    testimonial: z
      .object({
        quote: z.string(),
        attribution: z.string(),
        rating: z.number().optional(),
        // Optional outside link that lets a reader verify the quote is
        // real (e.g. the public review page). Left unset when no such
        // link exists — never invent one.
        sourceUrl: z.string().optional(),
        sourceLabel: z.string().optional(),
        // A plain factual follow-up sentence rendered next to the quote
        // but visually distinct from it (not italicized as speech) —
        // e.g. noting a repeat engagement. Stated as fact, not quoted.
        note: z.string().optional(),
      })
      .optional(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    order: z.number(),
    headlineStat: z.object({
      value: z.string(),
      label: z.string(),
    }),
    secondaryStats: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    ),
    // Cumulative operational scale (total frames captured to date, ongoing
    // 24/7 run) — deliberately separate from headlineStat/secondaryStats,
    // which describe one specific validated dataset (11 sessions, 2.8M
    // frames). Never merge these numbers; they answer different questions.
    scaleStat: z.object({
      value: z.string(),
      label: z.string(),
      caveat: z.string(),
    }),
    approach: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
    results: z.array(z.string()),
    limitations: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
    techStack: z.array(
      z.object({
        category: z.string(),
        items: z.array(z.string()),
      }),
    ),
    demoSlot: z.object({
      status: z.enum(['coming-soon', 'gif', 'video', 'live-embed']),
      label: z.string(),
      note: z.string(),
      mediaUrl: z.string().optional(),
      mediaUrl2: z.string().optional(),
    }),
    links: z.object({
      repo: z.string().optional(),
    }),
  }),
});

// Operations-leadership case studies — the second lane of the site,
// rendered at /leadership. Same content-first discipline as the technical
// case studies: narrative lives in the markdown body, structured figures
// and section scaffolding live in frontmatter so the layout never hardcodes
// copy. `status: 'stub'` renders a heading and a placeholder only — used
// for entries whose content hasn't been written yet.
const leadership = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/leadership' }),
  schema: z.object({
    title: z.string(),
    role: z.string(),
    org: z.string(),
    location: z.string().optional(),
    period: z.string(),
    order: z.number(),
    status: z.enum(['published', 'stub']).default('published'),
    summary: z.string().optional(),
    stubNote: z.string().optional(),
    headlineStat: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .optional(),
    stats: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
      .optional(),
    // Image slots reference files under `public/leadership/`. `width`/`height`
    // are the file's intrinsic pixel dimensions and are emitted as HTML
    // attributes so the browser reserves the correct box before the image
    // loads (no layout shift, and portrait sources can't stretch the grid).
    // The page also checks the filesystem at build time and omits any slot
    // whose file is absent, so slots can be declared ahead of the photo.
    heroImage: imageSlot.optional(),
    // Photos for the condensed homepage précis only — the /leadership route
    // ignores these and renders `heroImage` plus the per-section `images`.
    // Kept separate so the homepage can show a different frame than the one
    // already used as the page header band, instead of repeating it.
    previewImages: z.array(imageSlot).optional(),
    sections: z
      .array(
        z.object({
          title: z.string(),
          body: z.array(z.string()),
          // One image renders full column width; two render as a pair.
          images: z.array(imageSlot).optional(),
        }),
      )
      .optional(),
  }),
});

const roadmap = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/roadmap' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['landing-soon', 'frontier', 'hardware']),
    order: z.number(),
  }),
});

const skills = defineCollection({
  loader: file('./src/content/skills/skills.json'),
  schema: z.object({
    category: z.string(),
    items: z.array(z.string()),
  }),
});

// Client case studies — rendered at /reviews, linked from the hero's
// utility-link row (GitHub / LinkedIn / Email / Resume / Reviews), not from
// the primary section nav. Same depth and voice as /leadership: narrative
// lives in `sections`, and the testimonial/stats/tagline are pulled from
// the matching `projects` entry via `projectId` rather than duplicated
// here, so there's one source of truth for that copy.
const reviews = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/reviews' }),
  schema: z.object({
    title: z.string(),
    // id of the matching entry in the `projects` collection.
    projectId: z.string(),
    period: z.string(),
    order: z.number(),
    summary: z.string().optional(),
    sections: z.array(
      z.object({
        title: z.string(),
        body: z.array(z.string()),
      }),
    ),
  }),
});

export const collections = {
  profile,
  experience,
  projects,
  'case-studies': caseStudies,
  leadership,
  roadmap,
  skills,
  reviews,
};

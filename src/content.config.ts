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
    location: z.string(),
    email: z.string(),
    resumeUrl: z.string().optional(),
    links: z.array(
      z.object({
        label: z.string(),
        url: z.string(),
      }),
    ),
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
    // CSI-case-study style) instead of the single-line tagline.
    expandedBody: z.boolean().optional(),
    period: z.string(),
    role: z.string(),
    status: z.enum(['live', 'sunset', 'wip']),
    order: z.number(),
    tech: z.array(z.string()),
    links: z.object({
      live: z.string().optional(),
      repo: z.string().optional(),
    }),
    stats: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
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

// A photo in `public/`, with its intrinsic dimensions so the renderer can
// reserve layout space and respect the source aspect ratio.
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

export const collections = {
  profile,
  experience,
  projects,
  'case-studies': caseStudies,
  leadership,
  roadmap,
  skills,
};

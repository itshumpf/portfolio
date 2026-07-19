// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  // Fully static output — the whole site is prerendered HTML/CSS with
  // zero client-side JS by default, deployable as-is to Cloudflare Pages
  // (build command `npm run build`, output directory `dist`).
  output: 'static',
  // Set once a custom domain is attached to the Cloudflare Pages project —
  // powers canonical URLs / sitemap generation later. Safe to leave unset
  // until then; nothing in Phase 1 depends on it.
  // site: 'https://your-domain.com',
});

// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  // Fully static output — the whole site is prerendered HTML/CSS with
  // zero client-side JS by default, deployable as-is to Cloudflare Pages
  // (build command `npm run build`, output directory `dist`).
  output: 'static',
  // Powers absolute canonical URLs / OG image URLs / sitemap generation.
  site: 'https://braedenkeena.pages.dev',
});

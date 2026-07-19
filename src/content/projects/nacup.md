---
title: "nacup.us"
tagline: "Live World Cup 2026 fan hub — host-city info, news, and live scores in one place."
period: "2026"
role: "Founder / Developer"
status: "live"
order: 1
tech: ["Python", "Vanilla JavaScript", "Leaflet.js", "Cloudflare Pages", "GitHub CI/CD"]
links:
  live: "https://nacup.us"
stats:
  - value: "48 hrs"
    label: "concept to deployed production site"
  - value: "700+"
    label: "visitors on day one, first-page organic search within 24 hrs"
  - value: "80+"
    label: "programmatically generated SEO pages across 38 host cities"
---
Designed, built, and deployed a full-stack production site in 48 hours, timed to a live global
event. A multi-source data pipeline (Google Places API, RSS, news scraping, a live-scores REST
API) merges and dedupes across 38 host-city feeds, with trust-tier scoring and freshness-decay
ranking so stale sources don't win over live ones.

On top of that pipeline sit 80+ programmatically generated static SEO pages with JSON-LD
structured data, a sitemap, and Search Console integration — plus live-score polling with caching
and fallback states so the site stays useful even when an upstream API hiccups.

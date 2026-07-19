---
title: "nacup.us"
tagline: "Live World Cup 2026 fan hub — host-city info, news, and live scores in one place."
expandedBody: true
period: "2026"
role: "Founder / Developer"
status: "live"
order: 1
tech: ["Python", "Vanilla JavaScript", "Leaflet.js", "Cloudflare Workers", "GitHub Actions"]
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
Built because I wanted one place for everything World Cup 2026 — every morsel of news, plus which
bars and fan events were happening near me. It became my own daily driver during the tournament,
and now serves ~11k visits a month.

News is aggregated from 16+ feeds and ranked by a time-decay scoring formula that weighs source
credibility, team and player entity matches, and whether a team is playing that day — with
near-duplicate coverage clustered instead of repeated. The venue map merges Yelp, Foursquare,
OpenStreetMap and Google Places into single records using geographic proximity and name-token
similarity, each carrying a confidence score based on how many independent sources agree.

A daily GitHub Actions pipeline regenerates the site — 48 team pages, 97 match pages, 38 city
pages and a 185-URL sitemap — for programmatic SEO across every team, match, and host city.

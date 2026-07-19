---
title: "findstorage"
tagline: "Nationwide self-storage directory with real unit-level pricing — not lead-gen filler."
period: "2025"
role: "Founder / Developer"
status: "live"
order: 2
tech: ["Python", "Leaflet.js", "MarkerCluster", "Scheduled task automation"]
links:
  live: "https://findstorage.netlify.app"
stats:
  - value: "~3,590"
    label: "storage facilities indexed nationwide"
  - value: "3"
    label: "chained scrapers against undocumented APIs"
  - value: "0"
    label: "manual work in the daily refresh pipeline"
---
Reverse-engineered undocumented APIs and chained three scrapers together to index roughly 3,590
self-storage facilities nationwide, with full unit-level pricing and promotional-discount math —
the numbers a shopper actually needs, not a lead-gen form.

An interactive map front end (Leaflet.js + MarkerCluster) supports smart location/keyword search,
distance search, and tap-to-call mobile UX. The dataset updates itself daily through a fully
automated refresh pipeline running on scheduled tasks.

---
title: "findstorage"
tagline: "National self-storage pricing directory — advertised unit prices, tracked daily, with market-level analysis."
expandedBody: true
period: "2025–2026"
role: "Founder / Developer"
status: "live"
order: 2
tech: ["Python", "Vanilla JavaScript", "Leaflet.js", "GitHub Actions", "Netlify"]
links:
  live: "https://findstorage.netlify.app"
  repo: "https://github.com/itshumpf/storage-directory"
stats:
  - value: "~43,900"
    label: "individual units tracked across ~3,530 stores"
  - value: "75,437"
    label: "advertised price changes logged across 9 snapshot dates"
  - value: "354"
    label: "ZIP3 markets computed automatically, not hand-curated"
screenshots:
  - src: "/work/findstorage-directory.jpg"
    alt: "The findstorage directory view: a filter bar and a grid of store cards, each listing site number, address, phone, and a per-size table of advertised monthly prices and promotions."
    width: 1868
    height: 940
    caption: "Directory view — advertised price by unit size for each store, including stores with no vacancy."
  - src: "/work/findstorage-trends.jpg"
    alt: "The findstorage trends page: national advertised inventory and national median 10x10 price plotted across daily snapshots from April to July 2026."
    width: 1868
    height: 940
    caption: "Trends — national advertised inventory and median 10x10 price across daily snapshots."
---
A national directory of advertised self-storage prices, and the market research that falls out of
tracking them over time. A seven-pass discovery scraper collects publicly published rates for
roughly 43,900 units across ~3,530 stores, and runs itself daily through GitHub Actions — commits
land in the repo unattended. The pipeline has safety rails: the run aborts rather than publishing
if store count drops below 3,300 or falls more than 10% against the previous run. Eleven snapshots
are captured so far, and the rate-change log holds 75,437 advertised price changes across nine
dates.

The analysis I care most about is a matched-pairs design. Averaging prices confounds the attribute
with the market — climate-controlled units are more common in expensive metros, so a naive average
credits the feature for the city. Instead it compares units of the same size, at the same store,
differing in exactly one attribute (climate control, floor level, drive-up), so location and local
demand cancel out and what's left is closer to the price of the attribute itself. Climate control
carries roughly an 18–22% premium on that basis. Records are linked across sources by 150m
haversine distance plus ≥60% name-token overlap.

Everything is cut by size (locker through 10x30 and parking). 354 ZIP3 markets are computed
nationwide rather than hand-picked, each with a client-side drill-down: store count, units per
store, promo share, median price by size with price-per-sqft against the national figure, trend
sparklines, and a renter leverage score. Movers tables surface the largest availability drops and
restocks and the largest 10x10 price moves over a rolling window. Moving the detail data into a
sidecar file fetched on first interaction kept the whole drill-down to +3.6KB gzip on initial load.

Worth stating plainly: these are advertised online rates, not what any given renter ends up paying.
Coverage is whatever the discovery pass finds published, so it is a sample rather than a census, and
matched pairs control for store and size — not for everything.

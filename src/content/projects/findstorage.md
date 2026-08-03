---
title: "findstorage"
tagline: "National self-storage pricing directory — advertised unit prices, tracked daily, with market-level analysis."
thesis: "Self-storage pricing is public but scattered — every operator publishes its own rates, and nobody aggregates them into a market view. This is built to run unattended and stay correct even when the market itself moves: when a large operator merger added roughly 1,100 stores overnight, the daily pipeline absorbed the shift with zero manual intervention rather than needing to be rebuilt around it."
expandedBody: true
period: "2025–2026"
role: "Founder / Developer"
status: "live"
order: 3
indexLabel: "Self-storage pricing directory"
tech: ["Python", "Vanilla JavaScript", "Leaflet.js", "GitHub Actions", "Cloudflare Pages"]
links:
  live: "https://findstorage.pages.dev"
  repo: "https://github.com/itshumpf/storage-directory"
stats:
  - value: "~57,200"
    label: "individual units tracked across ~4,600 stores nationwide"
  - value: "245,000+"
    label: "advertised price changes logged across 21 snapshot dates"
  - value: "414"
    label: "ZIP3 markets computed automatically, not hand-curated"
impact: "In late July 2026, a National Storage Affiliates merger added roughly 1,100 stores to the market overnight. The daily discovery pipeline absorbed it with zero manual intervention: stores tracked jumped ~3,539 → 4,637, advertised inventory rose ~212,000 → ~292,000 units, and computed ZIP3 markets grew 354 → 414. The safety rails held, and the merger showed up as signal in the trend data instead of a system that needed babysitting."
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
roughly 57,200 units across ~4,600 stores, and runs itself daily through GitHub Actions — commits
land in the repo unattended. The pipeline has safety rails: the run aborts rather than publishing
if store count drops below a floor or falls more than 10% against the previous run. Twenty-three
daily snapshots are captured so far, and the rate-change log holds over 245,000 advertised price
changes across 21 dates. When a large operator merger added roughly 1,100 stores overnight — a ~30%
jump — the pipeline absorbed it cleanly and surfaced the shift in the trend data instead of choking
on it.

The analysis I care most about is a matched-pairs design. Averaging prices confounds the attribute
with the market — climate-controlled units are more common in expensive metros, so a naive average
credits the feature for the city. Instead it compares units of the same size, at the same store,
differing in exactly one attribute (climate control, floor level, drive-up), so location and local
demand cancel out and what's left is closer to the price of the attribute itself. Climate control
carries roughly an 18–22% premium on that basis. Records are linked across sources by 150m
haversine distance plus ≥60% name-token overlap.

Everything is cut by size (locker through 10x30 and parking). 414 ZIP3 markets are computed
nationwide rather than hand-picked, each with a client-side drill-down: store count, units per
store, promo share, median price by size with price-per-sqft against the national figure, trend
sparklines, and a renter leverage score. Movers tables surface the largest availability drops and
restocks and the largest 10x10 price moves over a rolling window, and a per-store price-history view
charts a single store's advertised prices over time by unit size. Moving the detail data into a
sidecar fetched on first interaction kept the whole drill-down to +3.6KB gzip on initial load.

Worth stating plainly: these are advertised online rates, not what any given renter ends up paying.
Coverage is whatever the discovery pass finds published, so it is a sample rather than a census, and
matched pairs control for store and size — not for everything.

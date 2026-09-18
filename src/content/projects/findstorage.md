---
title: "FindStorage"
tagline: "A daily market observatory for advertised self-storage prices—and the pricing behavior that only appears when exact offers are followed through time."
thesis: "What began as a store-ID finder is now a seven-source longitudinal pipeline. It collects slowly, checkpoints expensive runs, rejects incomplete snapshots, and preserves enough history to distinguish a market event from a collection failure."
expandedBody: true
period: "2025–present"
role: "Founder / Data Engineer"
status: "live"
order: 4
indexLabel: "Storage pricing observatory"
tech: ["Python", "Vanilla JavaScript", "Leaflet.js", "Chart.js", "GitHub Actions", "Cloudflare Pages"]
links:
  live: "https://findstorage.pages.dev/dashboard.html#overview"
stats:
  - value: "9,077"
    label: "facilities in the complete 15 September 2026 snapshot across seven collections"
  - value: "129,704"
    label: "advertised unit and offer records preserved in that daily snapshot"
  - value: "4,904 / 4,904"
    label: "listings entering one August promotion whose advertised reference rate also increased"
impact: "The history exposed a coordinated promotion event that a current-price directory could never see: higher reference rates and a four-month discount were assigned to the same 4,904 listings, then unwound through a different combination of lower rates and weaker promotions."
screenshots:
  - src: "/work/findstorage-directory.jpg"
    alt: "The FindStorage directory view with store cards, addresses, and advertised prices and promotions by unit size."
    width: 1868
    height: 940
    caption: "Directory view — the current offer at each facility is only the surface; dated snapshots preserve what came before it."
  - src: "/work/findstorage-trends.jpg"
    alt: "The FindStorage trends view plotting national advertised inventory and median 10x10 prices over time."
    width: 1868
    height: 940
    caption: "Trend view — missing observations remain gaps, so a broken collection cannot masquerade as a market move."
---
This began with a five-digit store identifier that the team I was on needed every day and could not
find in one place. The tool that discovered those IDs grew into a national directory; the directory
grew into a daily history; and the history became useful when it started answering questions that a
single scrape could not.

[Open the live dashboard](https://findstorage.pages.dev/dashboard.html#overview) or go directly to
the [July–September pricing study](https://findstorage.pages.dev/dashboard.html#study).

## What the system is now

Seven collectors emit the same dated snapshot contract for Public Storage, CubeSmart, Storage
Sense, U-Haul, StorageMart, SmartStop, and an independent-operator pilot. On 15 September 2026 the
complete combined snapshot contained **9,077 facilities and 129,704 advertised unit or offer
records**.

The collection strategy is deliberately conservative. Each source has its own request delay and
catalog discovery logic. Long runs checkpoint their progress so a late failure does not require
repeating thousands of requests. Current sitemaps are fetched before facilities are visited, known
dead URLs are not hammered, and a 403 or 429 stops the responsible collector. Completed work can be
resumed, but it is not published as a daily snapshot until the full catalog passes its safety checks.

The merge is equally defensive. A source that is stale or below its expected coverage is excluded
instead of quietly shrinking the market. Writes are atomic. Store counts, exact offer counts, price
events, promotion events, and source freshness are all independently inspectable. Missing days stay
missing in time-series charts rather than being joined by a reassuring line.

## The finding: both sides of the discount moved

A percentage-off advertisement contains two numbers: the discount and the reference price to which
it is applied. Daily exact-SKU matching makes it possible to determine which one changed.

On **1 August 2026**, 4,904 tracked Public Storage listings moved onto the promotion “40% off For 4
Month.” Every one of those 4,904 listings also received an advertised reference-rate increase. The
median increase was **$45**.

Perfect overlap is notable, but it is not enough by itself. A website could have a publishing system
that mechanically writes price and promotion together. July supplies the control that rules that
out: four days earlier, 428 listings entered the same four-month promotion and **not one** received a
rate increase. Across the wider history there are also promotion-only days and price-only events.
The fields are independently writable; the August containment is a feature of that event, not an
artifact of the collection.

## One advertisement, followed through time

On 24 August, a Costa Mesa facility displayed “Month 1–4 40% OFF,” a struck-through full rate,
“Months 5–12 In-Store Rent,” and “Total Estimated 12-Month Savings.” Three visible offers confirmed
the arithmetic:

| Unit | Advertised reference | Months 1–4 | Stated savings |
|---|---:|---:|---:|
| 5×5 | $110 | $66 | $176 |
| 5×10 | $165 | $99 | $264 |
| 7.5×10 | $237 | $142 | $380 |

The operator’s savings figure is exactly four months at 40% off the displayed reference rate. The
arithmetic is correct; the reference rate is the moving part.

The $237 listing was observed at **$161 on 20 August**, $237 on 22–24 August, and **$161 again on 25
August**. Against the adjacent $161 rate, paying $142.20 for four months represents roughly $75 of
savings—not $380. Approximately **$304 of the displayed $380 difference** came from the temporarily
higher reference rate.

## September shows the unwind

The higher-reference, deeper-promotion structure persisted into September. Among continuously
observed listings carrying the major four-month offers on 13 September, reference rates were above
their 31 July medians:

| Promotion on 13 September | Matched listings | 31 July reference | 13 September | 14 September |
|---|---:|---:|---:|---:|
| 40% off four months | 7,790 | $116 | $130 | $98 |
| 50% off first four months | 6,600 | $80 | $98 | $74 |
| 30% off four months | 4,882 | $151 | $180 | $136 |

Relative to the same listings’ 31 July rates, the higher references accounted for **9.2% to 18.2%**
of the savings displayed by those September offers.

Then the structure reversed. On 14 September, 35,235 promotions changed and 30,762 matching rates
fell. The lower rates looked favorable in isolation, but promotion value fell more sharply. Across
59,045 matched, modelable offers, headline four-month value fell 14.7%, promotional discount value
fell 49.7%, and modeled customer cost rose **1.1%**. A Shapley decomposition attributes −15.4% to
the lower monthly rates and +16.5% to weaker promotions.

The customer-facing value had moved from the base rate into the promotional badge and then back
again. Looking at either field alone would have described only half of the decision.

## What the evidence supports

The observations support a narrow statement: **Public Storage calculated advertised savings from
reference rates that the daily history shows had recently increased—sometimes sharply and
temporarily.**

This is not transaction data. The model gives one equal weight to every matched advertised offer
and excludes administrative fees, insurance, tax, and later tenant-rate changes. It does not
establish intent or make a legal conclusion. It establishes the published advertisement, the
reference rate used in its arithmetic, and the history of that exact listing.

## Why the engineering matters

The case study exists because the system preserves identity and failure—not merely rows.

- Facilities and offers retain stable identifiers across daily snapshots.
- Catalog floors and prior-day drop checks reject plausible-looking partial runs.
- Checkpoints make politeness affordable: failed long runs resume without repeating completed work.
- Atomic publication prevents a collector crash from replacing yesterday’s complete snapshot.
- Source freshness is visible per brand, and stale sources are excluded from the combined view.
- Missing observations remain gaps; zero remains a measured value.
- Price and promotion changes are logged independently, making the July control possible.

The failure mode that costs you is not always a crash. It is a pipeline that succeeds, publishes,
and quietly changes the meaning of the market. FindStorage is built to refuse that kind of success.

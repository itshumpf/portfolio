---
title: "FindStorage"
tagline: "A daily advertised-price tracker for self-storage — retired on 25 August 2026, and the reason the measurement behind it outlived the product."
thesis: "What began as a store-ID finder became a national daily price tracker: it collected slowly, checkpointed expensive runs, rejected incomplete snapshots, and preserved enough history to tell a market event apart from a collection failure. It was shut down deliberately, and the shutdown is the part worth reading."
expandedBody: true
period: "2025–2026"
role: "Founder / Data Engineer"
status: "sunset"
order: 4
indexLabel: "Storage pricing observatory"
tech: ["Python", "Vanilla JavaScript", "Leaflet.js", "Chart.js", "GitHub Actions", "Cloudflare Pages"]
links:
  live: "https://findstorage.pages.dev/dashboard.html#overview"
stats:
  - value: "4,664"
    label: "Public Storage facilities in the final snapshot, 25 August 2026"
  - value: "46"
    label: "consecutive daily snapshots with no gaps, 11 July to 25 August"
  - value: "396,402"
    label: "advertised price changes logged, alongside 148,870 promotion changes"
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

**The directory is retired.** The published site is an archive: its last snapshot is 25 August 2026
and nothing has been added since. It stays up as a record of what the product was —
[open the archived dashboard](https://findstorage.pages.dev/dashboard.html#overview).

The measurement did not stop with the product. Collection continued unnamed, and the September
work — including the figures below — is written up at [the storage investigation](/storage).

## What the system was

A single-source daily tracker for Public Storage. The final snapshot, on **25 August 2026**, held
**4,664 facilities**, closing a run of **46 consecutive daily snapshots with no gaps** that began on
11 July. Across that run it logged **396,402 advertised price changes** and **148,870 promotion
changes** — every one tied to an exact listing, which is what made the finding below possible.

The collection strategy was deliberately conservative. Each source has its own request delay and
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

The clearest single case sits inside this run: a Costa Mesa listing whose reference rate moved to
$237 on 22 August, carried a four-month 40%-off promotion on the 24th, and returned to $161 on the
25th — the same day the promotion ended.

That reconstruction, with the exact SKU, the full change log and the arithmetic, is on the
[Storage Price Observatory](/storage). It is kept in one place on purpose.

## Where it goes after this

FindStorage stops here. The structure this run uncovered — a reference rate and a promotional
badge moving against each other — kept developing after the product was retired, and following it
required watching more than one operator.

That work is a separate project with its own dataset and its own boundary: the
[Storage Price Observatory](/storage). Nothing below 25 August 2026 belongs to it, and none of its
figures belong here.

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

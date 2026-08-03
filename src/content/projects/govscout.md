---
title: "GovScout"
tagline: "Federal solicitation & defense procurement intelligence engine."
thesis: "Built to do what a busy contracts specialist doesn't have time for: read every new SAM.gov solicitation in a given commodity area and flag the ones actually worth a phone call. It scores solicitation copy for pricing-availability signal and extracts the National Stock Numbers and part quantities buried in the text, so a human only has to look at the solicitations the scorer says are worth looking at."
expandedBody: true
period: "2026"
role: "Founder / Developer"
status: "live"
order: 2
indexLabel: "Federal procurement intelligence"
tech: ["Python 3.11", "SAM.gov API v2", "SQLite", "Regex Signal Classifier", "pytest"]
links:
  repo: "https://github.com/itshumpf/govscout"
stats:
  - value: "100/100"
    label: "pricing-availability signal scoring algorithm across 4 keyword families"
  - value: "NSN & P/N"
    label: "automated regex extraction of National Stock Numbers & part quantities"
  - value: "0 Deps"
    label: "zero third-party dependencies beyond standard library & pytest suite"
impact: "Zero third-party dependencies means the pricing-signal classifier, the NSN/part-number extractor, and the SQLite engine are auditable end to end — nothing opaque to trust in a pipeline that's deciding which federal solicitations are worth a human's time."
---
A federal procurement monitoring engine modeled on defense logistics (DLA/DIBBS) RFQ tracking. GovScout ingests live solicitations from the SAM.gov Opportunities API v2, filters them by FSC/PSC codes, detects pricing-availability signals, and extracts structured part data into SQLite.

- **Pricing Signal Classifier**: Evaluates solicitation copy against weighted keyword families (`online_pricing`, `historical_pricing`, `quote_workflow`, `competitive`) to generate a 0–100 pricing feasibility score.
- **Structured Part Extractor**: Automatically parses National Stock Numbers (`NSN \b\d{4}-\d{2}-\d{3}-\d{4}\b`), manufacturer part numbers (P/N), and required item quantities from raw text.
- **Dual Mode Architecture**: Operates in **Live Mode** (REST API client with 0.5s rate-limiting, 429 backoff, and state persistence) and **Demo Mode** (bundled offline dataset for zero-network testing).
- **SQLite Engine & Report Generator**: Upserts normalized solicitations with duplicate detection and exports CSV feeds and console digests grouped by signal priority.

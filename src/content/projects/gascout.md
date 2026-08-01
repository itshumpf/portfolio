---
title: "GAScout"
tagline: "Georgia public records pipeline & delinquent tax analytics dashboard."
thesis: "Built because Georgia's delinquent-tax data exists only as a 9,915-page fixed-width mainframe PDF — a format built for a printer, not for analysis. The extraction engine's job is to turn that dump into something a policy researcher can query, cut, and trust: parsed and checksum-verified line by line, with zero dropped rows, so aggregate figures are traceable back to source instead of estimated."
expandedBody: true
period: "2026"
role: "Founder / Developer"
status: "live"
order: 1
tech: ["Python", "Astro v5", "Vanilla JavaScript", "Cloudflare Pages", "pypdf"]
links:
  live: "https://gascout.pages.dev"
  repo: "https://github.com/itshumpf/gascrape-site"
stats:
  - value: "$62.75M"
    label: "uncollected delinquent tax liability tracked across 8 tax cycles"
  - value: "409,142"
    label: "line items parsed from 9,915 mainframe PDF pages with 0 dropped rows"
  - value: "90"
    label: "automated offline test fixtures verifying parser & checksum integrity"
impact: "The checksum verification isn't a nice-to-have: it's what auto-corrected 32 column-overflow shifts in the source PDF and let the pipeline enforce 100% line accounting — zero dropped or malformed rows. That's what makes the $62.75M liability figure something a policy researcher can trust down to the row, not a rough estimate off a monolithic government PDF."
---
A static public-records intelligence dashboard and daily extraction pipeline built on DeKalb County delinquent tax listings. 

County tax listings are published as a monolithic 9,915-page fixed-width mainframe PDF file (`DQ205GADEK`). The python extraction engine ingests the document offline line-by-line, detecting and auto-correcting 32 column-overflow shifts via a 5-column checksum verification algorithm. The pipeline enforces 100% line accounting — zero dropped rows, zero malformed records — backed by 90 automated offline test fixtures.

The web interface presents aggregate financial insights without publishing personal PII:
- **Tax Year Trend Explorer**: Multi-metric trend analysis showing how 56.9% ($35.7M) of outstanding debt sits in the 2025 cycle, while 26,000+ 2018 records remain open as long-tail "zombie properties".
- **Pareto Economic Breakdown**: Highlighting how 77.8% of rows are micro-bills under $100, whereas just 1,023 bills (> $5,000) hold over $11.3M in debt.
- **Interactive Policy Collection Simulator**: Live threshold tool allowing policy researchers to test collection targets ($100, $500, $1,000, $5,000+) to calculate recovered revenue ($M), percentage of county debt cleared, and owner contact efficiency.
- **Georgia Tax Status Classification**: Clear breakdown detailing `Fi.Fa. Lien Execution` (`F`), `School Tax Delinquency` (`S`), `Assessment Appeals` (`A`), and `Claim Transfers` (`T`).

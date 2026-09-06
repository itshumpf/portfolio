---
title: "GAScout"
tagline: "Georgia statewide public-records pipeline & delinquent tax analytics — four counties live."
thesis: "Built because Georgia publishes delinquent-tax data in whatever format each county happens to use — a 9,915-page fixed-width mainframe PDF in one, a scanned PDF needing OCR in the next, a weekly spreadsheet in a third. There is no state format. So the pipeline is an adapter architecture rather than a scraper: each county gets a parser that knows its dialect, all of them emit the same checksum-verified rows, and the aggregate stays traceable back to source instead of estimated."
expandedBody: true
period: "2026"
role: "Founder / Developer"
status: "live"
order: 1
indexLabel: "Georgia public records"
tech: ["Python", "Astro v5", "Vanilla JavaScript", "Cloudflare Pages", "pypdf"]
links:
  live: "https://gascout.pages.dev"
  repo: "https://github.com/itshumpf/GAScout"
stats:
  - value: "$152.34M"
    label: "uncollected delinquent tax liability tracked across four live Georgia counties"
  - value: "451,798"
    label: "records parsed from four different source formats with 0 dropped rows"
  - value: "4 / 159"
    label: "counties live, with the remaining 155 registered and marked Planned"
impact: "Four counties, four incompatible source formats, one schema out the other side. The checksum verification isn't a nice-to-have: on DeKalb alone it auto-corrected 32 column-overflow shifts and let the pipeline enforce 100% line accounting — zero dropped rows, zero malformed records. That's what makes the $152.34M figure something a policy researcher can trust down to the row, not a rough estimate off a pile of government PDFs."
---
A static public-records intelligence dashboard and extraction pipeline covering Georgia
delinquent tax listings. Four counties are live; all 159 are registered, so a county that
hasn't been built yet shows as Planned rather than silently missing.

**Every county publishes differently, and that is the actual engineering problem:**

| county | source format | tracked | records |
|---|---|---|---|
| DeKalb | 9,915-page fixed-width mainframe PDF (`DQ205GADEK`) | $62.75M | 409,142 |
| Gwinnett | weekly XLSX roll | $80.29M | 37,297 |
| Cobb | monthly delinquent PDF | $9.30M | 5,211 |
| Fulton | scanned PDF, OCR required | sheriff sale list | 148 |

**DeKalb remains the deepest parser case.** A monolithic 9,915-page fixed-width mainframe
dump, ingested offline line-by-line, detecting and auto-correcting 32 column-overflow
shifts via a 5-column checksum verification algorithm. The pipeline enforces 100% line
accounting — zero dropped rows, zero malformed records — backed by 90 automated offline
test fixtures. It was the first adapter written and it set the contract every later county
had to satisfy.

The web interface presents aggregate financial insights without publishing personal PII.
The DeKalb analysis below is the most developed:
- **Tax Year Trend Explorer**: Multi-metric trend analysis showing how 56.9% ($35.7M) of outstanding debt sits in the 2025 cycle, while 26,000+ 2018 records remain open as long-tail "zombie properties".
- **Pareto Economic Breakdown**: Highlighting how 77.8% of rows are micro-bills under $100, whereas just 1,023 bills (> $5,000) hold over $11.3M in debt.
- **Interactive Policy Collection Simulator**: Live threshold tool allowing policy researchers to test collection targets ($100, $500, $1,000, $5,000+) to calculate recovered revenue ($M), percentage of county debt cleared, and owner contact efficiency.
- **Georgia Tax Status Classification**: Clear breakdown detailing `Fi.Fa. Lien Execution` (`F`), `School Tax Delinquency` (`S`), `Assessment Appeals` (`A`), and `Claim Transfers` (`T`).

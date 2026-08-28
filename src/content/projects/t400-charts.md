---
title: "Franchise Rankings Chart Generator"
shortTitle: "Chart Generator"
indexLabel: "428 charts, one command"
tagline: "428 per-company sales and units charts generated from one spreadsheet, matching the publisher's existing output exactly — and handed over as something they can run themselves next year without me."
expandedBody: true
period: "Aug 2026"
role: "Contract — sole engineer"
status: "delivered"
kind: "client"
order: 7
thesis: "A publisher produces an annual franchise ranking and hand-builds a two-panel chart for every company in it. The ask was to automate that. The constraint that shaped the whole job was that the output had to be indistinguishable from what was already on their site — same library version, same colours, same markers, same number formatting — because the charts go into their CMS alongside years of existing ones. The interesting decisions turned out to be about missing data, not about plotting."
tech:
  - "Python"
  - "openpyxl"
  - "Plotly (version-pinned)"
  - "self-contained HTML output"
stats:
  - value: "428"
    label: "per-company chart files from one command"
  - value: "47"
    label: "companies without a full five years, each handled on its own axis"
  - value: "0"
    label: "blank years plotted as zero"
links:
  noLinkNote: "Client deliverable — the generated charts are published on the client's own site."
impact: "Delivered with a README written for someone who does not have Python installed. Running it next year is three steps and one edited line; if a column header changes, the script stops and names the column rather than writing 428 wrong files."
---

The publisher's existing charts were the specification. One of their published
files came along as a reference, and the job was to produce output that matched
it — the same pinned Plotly build already loaded by their CMS, the same two
stacked panels, the same colours and marker shapes, the same `$` prefix on the
sales axis.

Sales arrive in the spreadsheet stated in millions and appear in the published
charts as whole dollars. Getting that exactly right meant reproducing
`97885.166233` as `97885000000` — rounding to the nearest million, then
multiplying — rather than something a rounding difference away from it.

## The question that came up mid-job

**381 of the 428 companies have all five years. 47 do not** — 27 are missing
2021, 20 are missing 2021 and 2022. The client raised it partway through: chart
those companies over the years they actually have, with the title adjusted.

The easy thing is to plot a missing year as zero. That draws a chart where
revenue collapses to the floor and climbs back out, which is a picture of a
company in crisis rather than a company that wasn't in the ranking yet. **A year
a company did not report is not a year it sold nothing.**

So blank years are never plotted as zero. Leading and trailing blanks are
trimmed away and the chart is titled over the range it actually covers — *Sales
& Units 2022–2025* for a four-year company, with no empty stretch at the left.

A blank in the *middle* of a run is different: it cannot be trimmed away without
closing a gap that exists, and joining 2022 straight to 2024 would imply a
continuity that isn't there. Those stay as a break in the line. No company in
this year's sheet has one — the code handles it anyway, because next year's
might.

## Written to be run by someone else

The handover assumes no Python and no command line. Install it, install two
libraries once, drop next year's spreadsheet in the folder, run one command.
When the years roll forward, one line changes and the chart titles update
themselves.

The script reads columns by header text rather than by position, so a
reordered sheet doesn't silently produce wrong charts. If an expected header
is missing it **stops and names the column** — the alternative being 428 files
that look fine and aren't.

Six company names contain characters Windows will not accept in a filename —
`RE/MAX`, `Checkers/Rally's`, `The UPS Store/Mail Boxes Etc.` among them. Those
are substituted in the filename only. The chart title and the underlying data
are left exactly as the publisher wrote them.

## How the work was won

The posting included the spreadsheet and one sample of the output they wanted.
Instead of describing an approach, I spent thirty minutes building three real
charts from their own data and attached the files to the proposal.

He replied inside a minute, and said it was the only proposal he had opened out
of the fifteen or twenty he'd received. Three files out of four hundred and
twenty-eight is small enough to give away and specific enough to prove the rest
exists.

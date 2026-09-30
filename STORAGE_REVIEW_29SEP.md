# Storage Observatory — pre-send review, 29 Sep 2026

Both pages read in a browser this session:
`/storage/` (teardown) and `/storage/dashboard#study`.

**Verdict: send it. Fix the five contradictions first, because they are between
the two pages and a friend will read both.**

---

## Must fix — the two pages disagree with each other

### 1. The 14 September index is two different numbers

| page | 14 Sept matched index |
|---|---|
| teardown | **0.7667** |
| study | **0.7500** |

Same date, same panel, same chart. One of them is wrong.

### 2. "+12% restored" doesn't match the index move on either page

Both pages label 18 Sept as **+12% restored**, next to an index that moves:

- teardown: 0.7667 → 0.9800 = **+27.8%**
- study: 0.7500 → 0.9800 = **+30.7%**

If 12% is a per-unit median and the index is a panel aggregate, say so in the
label. As printed, the arithmetic doesn't close and it's the first thing a
numerate reader will check.

### 3. "Rates fell 14.7%" and "a 25% lower price regime" describe the same day

The study distinguishes them — −14.7% is four-month headline *value* across
59,045 offers; −25% is the rate cut on 30,762 SKUs. The teardown puts −14.7% in
the narrative and 0.7667 in the chart with nothing joining them.

One sentence fixes it. Without it, the two pages look like they disagree about
how big the event was.

### 4. Store count drifts between pages

Teardown header: **9,077 facilities**. Dashboard header: **9,020 stores**.
Live-versus-snapshot is a fine reason; a reader clicking straight through has no
way to know that. Either pull the teardown figure live or date-stamp it.

### 5. Typo, and it's in the first paragraph

> "published as a directory called**FindStorage**"

Missing space. It is the third line of the page.

---

## The one that actually matters — asymmetry between the pages

The study reports this, in full:

> August 1, measured on the 4,904-offer event cohort: headline value rose 35.3%
> and promotional value rose 216.4%, producing **a 2.1% reduction in aggregate
> modeled four-month cost**. That aggregate masks the distribution: the median
> offer cost $2 more, 55.8% of listings cost more over four months, and 96% cost
> more by month eight.

That is the honest handling of a finding that cuts against the thesis, and it is
the strongest paragraph on either page.

**The teardown does not contain it.** A reader who takes the teardown first and
the study second discovers that the summary page left out the one number that
complicates the story. That reads as selection, and it costs more credibility
than the number itself ever would.

Put one line of it in the teardown. "In aggregate the August event cost 2.1%
less; the median offer cost $2 more and 96% cost more by month eight" is a
*stronger* claim than silence, because it shows the aggregate was checked.

---

## Language — the teardown claims what the study declines to claim

| teardown | study |
|---|---|
| "**THE SMOKING GUN**" | — |
| "The Control That **Proves** It Wasn't a System Glitch" | "This **rules out an unavoidable coupled-write artifact**. It establishes an unusual pricing decision, **not why** that decision was made." |

The study's sentence is better work and better protection. The teardown's
headline asserts intent about a named public company; the study explicitly
disclaims intent two screens later. Pick one posture.

Not a lawyer, and this is a judgement call rather than advice — but "smoking
gun" is the single highest-risk string on the site, and the analysis does not
need it. The finding is 4,904 of 4,904 against 0 of 428. That number is more
alarming than any adjective placed near it.

### Two sentences in "What the evidence supports" worth another look

> "Public Storage's revenue-management system appears to be successfully
> **manipulating** the composition and presentation of customer offers"

"Manipulating" sits three lines above "does not… make a legal determination
about deceptive advertising." *Changing* or *restructuring* carries the same
finding without the accusation.

> "and the stock market has not rewarded the company during the period observed"

No stock data appears anywhere in this study. It is the one claim on the page
with no series behind it, and it reads as an investment opinion in a piece that
is otherwise careful to be a measurement. Cut it.

---

## Arithmetic that checks out

Verified by hand against the printed figures:

- 4 × ($237 − $142.20) = **$379.20** ✓ matches the "$380 savings" claim
- $237 × 0.60 = **$142.20** ✓
- $237 / $161 = **+47%** ✓
- ($161 − $142.20) × 4 = **$75.20** ✓
- $380 − $75.20 = $304.80; $304.80 / $380 = **80.2%** ✓
- −15.4% + 16.5% = **+1.1%** ✓
- $32.78M → $27.96M = **−14.7%** ✓ · $10.20M → $5.13M = **−49.7%** ✓
- $22.58M → $22.83M = **+1.1%** ✓
- 83 days − 5 pause − 1 gap = **77 observed** ✓ consistent across both pages

The accounting ledger is internally sound. The problems above are presentation
and cross-page consistency, not method.

---

## What is genuinely strong, and worth keeping intact

- **The July 28 control.** 0 of 428 against 4,904 of 4,904 is the whole argument
  and it is airtight.
- **The sealed predictions.** Committing P1–P3 to git before Q3 results exist is
  the most credible thing on the site. Most analysis you will read never does it.
- **"Missing observations preserved as missing rather than interpolated."**
- **The 96-hour walkback**, and admitting that a paper frozen on 14 September
  would have been wrong. Publishing the thing that would have embarrassed you is
  the rarest move in the whole piece.

# Task: nine corrections to the Storage Price Observatory pages

**Scope is exactly the nine items below. Do not restructure, rewrite, or "improve"
anything else on either page.**

Pages: the teardown (`/storage/`) and the case study (`/storage/dashboard#study`).

**Rules for this run**

- No new analysis. No new sections. No tone edits outside the two named below.
- **Every number you change must be re-derived from the pipeline by a command you
  can name before you change it.** If you cannot derive it, say so and leave the
  number alone — do not substitute a plausible one.
- Report at the end: per item, what changed and the command the figure came from.
  List separately anything you could not verify.

---

### 1. The 14 September matched index — the pages contradict each other

Teardown says **0.7667**. Study says **0.7500**. Same day, same chart.

Independent reconstruction from `history/publicstorage/2026-09-{13,14,15,18}.json`,
on a 51,921-SKU panel present on all four days:

| construction | 14 Sept | 18 Sept |
|---|---|---|
| median of per-SKU ratios, **full matched panel** | **0.7667** | **0.9797** |
| median of per-SKU ratios, **only SKUs whose price fell** (27,213) | **0.7500** | 0.9096 |

Both figures are real. They are **different cohorts**. The teardown's pair
(0.7667 → 0.9800) is internally consistent; the study pairs a cut-cohort value
with a full-panel one.

**Do:** verify against the analysis scripts that produced the published series,
then make both pages use the full-panel figure. If the cut-cohort number is worth
keeping, give it its own labeled row — do not let it sit unlabeled in the index
series.

*Note: the reconstruction panel is 51,921 SKUs; the published figure is 59,045
matched modelable offers. Filters differ. Re-derive against the real pipeline.*

### 2. "+12% restored" does not reconcile with the index

0.7667 → 0.9800 is **+27.8%**, not +12%.

Reconstruction shows the panel-wide average price change 14 → 18 September is
**+11.6% value-weighted / +11.8% equal-weighted**. That is where 12% comes from.
It is a **mean**; the index is a **median-of-ratios series**. On this distribution
those diverge sharply, which is why the label reads as an error.

**Do:** label it so they stop looking like the same measurement. Something like
*"+12% average price restoration (panel mean; the index is a median series, which
is why the two move differently)."*

### 3. "22,772 units" — RESOLVED, but mislabelled

**The figure is correct.** 22,772 is the number of SKUs whose **price changed
between 17 and 18 September**, reproduced exactly from the raw snapshots. The
same source also reproduces "31,244 price events" on 14 September and "17,935
promotions rewritten" on the 18th.

The problem is only the word "units restored." Of the 22,772 that repriced,
**18,828 went up and 3,944 went down** — so it is a repricing count, not a
restoration count.

**Do:** relabel as *"22,772 SKUs repriced (18,828 up, 3,944 down)"*. Do not
change the number.

### 4. Facility count drifts between pages

Teardown header: **9,077 facilities**. Dashboard header: **9,020 stores**.

**Do:** either make the teardown read the live figure, or date-stamp it.

### 5. Typo, third line of the teardown

> "published as a directory called**FindStorage**"

Missing space.

### 6. The teardown omits the August aggregate

The study reports, on the 4,904-offer event cohort: headline value rose 35.3%,
promotional value rose 216.4%, producing a **2.1% reduction** in aggregate modeled
four-month cost — with the median offer costing $2 more, 55.8% costing more over
four months, and 96% costing more by month eight.

The teardown does not contain this at all. A reader taking the teardown first and
the study second finds the summary omitted the number that complicates the story.

**Do:** add one sentence to the teardown carrying it. Do not soften the
surrounding text — the point is that the aggregate was checked and reported.

### 7. "Proves" overclaims relative to the study

Teardown heading: *"The Control That **Proves** It Wasn't a System Glitch."*
Study: *"This **rules out an unavoidable coupled-write artifact**. It establishes
an unusual pricing decision, **not why** that decision was made."*

**Do:** change "Proves" to "Rules Out". Change nothing else in that section — the
"smoking gun" framing stays.

### 8. Cut one sentence from the study

In *What the evidence supports*, remove:

> "and the stock market has not rewarded the company during the period observed"

No stock series exists anywhere in this study. It is the only unmeasured claim on
the page.

### 9. Finalise the Q3 day count — the quarter closed 30 September

Current text: *"Of the 83 days since, the pipeline recorded 77."* That was a live
counter and the quarter is now closed.

Q3 is **92 days** (1 July – 30 September). Collection began **9 July**, so the
window is **84 days**, and 8 days of the quarter precede collection entirely.

**Do:** derive the final observed count from the actual snapshot files — do not
carry 77 forward — and restate as fixed Q3 provenance:

> N of 92 days observed. 8 precede the start of collection, 5 were a deliberate
> pause (26–30 August) to review changed site terms, 1 is an unexplained gap.
> Missing days are preserved as missing; nothing is interpolated.

State the coverage percentage explicitly rather than leaving the subtraction to
the reader.

### 10. Is there a current-era wave calendar? (DO NOT touch the frozen one)

**`repricing-stats.json` is FROZEN ON PURPOSE. Do not regenerate it, do not
overwrite it, do not extend its window.**

```
generated    : 2026-08-25T10:27:31
window       : 2026-07-11 → 2026-08-25   (46 days)
stores_latest: 4664
```

That is the FindStorage artifact, frozen at the 25 August shutdown, and the
teardown page says so explicitly: those headline figures are frozen at that date
and reported separately. The freeze is a credential. Overwriting it destroys the
record of a deliberate decision.

**The actual question:** the Observatory pages discuss September's waves in prose
— the 14th reset, the 18th walkback — but is there a *current-era* structured wave
artifact, separate from the frozen FindStorage one?

**Do:** report whether a post-25-August wave calendar exists and whether anything
on the site renders it. If one does not exist, build it as a **new file** under a
new name, leaving `repricing-stats.json` untouched.

For reference, reconstruction of September's waves from the raw snapshots:

| wave | movers | share | up / down | net value |
|---|---:|---:|---|---:|
| 09-02 | 40,103 | 68.4% | 19,557 / 20,546 | +0.17% |
| 09-10 | 16,619 | 29.4% | 6,106 / 10,513 | −0.73% |
| **09-14** | 31,244 | 52.5% | **135 / 31,109** | **−14.55%** |
| 09-16 | 50,740 | 89.6% | 27,608 / 23,132 | +3.78% |
| **09-18** | 22,772 | 40.0% | **18,828 / 3,944** | **+7.56%** |
| 09-23 | 46,023 | 83.7% | 23,282 / 22,741 | +0.87% |
| 09-30 | 49,876 | 87.9% | 21,471 / 28,405 | +0.03% |

Seven waves; twenty-three days with zero price movement across ~56,000 SKUs.

**Do:** regenerate `repricing-stats.json` over the full collection window, and
check whether anything on the site renders it. Re-derive every figure from the
pipeline — the table above is an independent reconstruction for cross-checking,
not a source.

Note the directional tiering already in the file (`waves_directional`) is the
right discriminator: routine waves split near 50/50, the 14th was 135 up against
31,109 down. That distinction is stronger than volume and is worth surfacing.

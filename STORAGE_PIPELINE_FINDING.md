# The wave calendar exists — and it stopped on 11 September

Investigated 30 Sept 2026 in `C:\dev\storageDir`. Everything below was read out of
the files in this session.

---

## You were right about item 10

There **is** a current-era wave calendar and it **does** ingest FindStorage:

| | |
|---|---|
| file | `history/rate_changes.csv` |
| size | 47 MB, **667,815 rows** |
| schema | `date, store_id, site_number, size, sku, field, old, new, brand` |
| span | **2026-07-11 → 2026-09-11**, 35 distinct change days |
| readers | `analysis/repricing_waves.py`, `analysis/wave_tiers.py` |

It starts 11 July — the same window start as the frozen FindStorage artifact — so
the FindStorage era is inside it, continuous, under one schema. `repricing_waves.py`
already states the thesis in its own docstring ("rates sit completely static for
days at a time, then tens of thousands of units change at once") and `wave_tiers.py`
already separates directional from non-directional waves.

My earlier claim that the wave calendar didn't exist was wrong. So was calling
`repricing-stats.json` stale — it is the deliberate FindStorage freeze.

---

## The actual problem

**The log stops on 11 September. The reset was on the 14th.**

`history/rate_log_runs.csv` records a clean `ok` every day through 2026-09-11,
then nothing. It did not fail. It stopped.

So the structured wave record contains **none of the events the pages are built
on**:

| date | price changes | in `rate_changes.csv`? |
|---|---:|---|
| 09-02 | 40,103 | yes |
| 09-10 | 16,619 | yes |
| **09-14 — the reset** | **31,244** | **no** |
| 09-16 | 50,740 | **no** |
| **09-18 — the walkback** | **22,772** | **no** |
| 09-23 | 46,023 | **no** |
| 09-30 | 49,876 | **no** |

The two September days the log does contain — 40,103 and 16,619 — match an
independent reconstruction from the raw snapshots **exactly**. That cross-validates
both the log and the reconstruction.

## Not in the Parquet either — same date, same cause

`history/parquet/` stops at **2026-09-11 in every table**:

| table | files | last partition |
|---|---:|---|
| `rate_changes` | 55 | 2026-09-11 |
| `sizes` | 59 | 2026-09-11 |
| `store-sizes` | 45 | 2026-09-11 |
| `stores_daily` | 60 | 2026-09-11 |

`build_parquet.py` converts `history/*.csv`, so it inherits the gap rather than
filling it. The Parquet corpus is downstream of the same stop, not a second copy
of the data.

**One failure, one date, six artifacts.** That is a cleaner diagnosis than several
independent breakages — there is one thing to fix.

## It is not only the rate log

Three downstream artifacts froze in the same window while collection carried on:

| artifact | last written | what writes it |
|---|---|---|
| `history/rate_changes.csv` | 11 Sept (data) | `analysis/update_rate_log.py` |
| `history/2026-09.csv` | 12 Sept | `analysis/update_history.py` |
| `store-history.json` | 18 Sept | `analysis/build_store_history.py` |
| `enriched_locations.json` | **30 Sept 12:21** | `daily_scraper.py` |
| `history/publicstorage/*.json` | **30 Sept, complete** | daily snapshot |

**The scraper is running. The record-and-report steps are not.**

`.github/workflows/daily.yml` is correct — it calls `update_rate_log.py` at line 72
and `build_repricing_stats.py` at line 119. So the workflow definition is not the
bug. Either the Action is no longer firing (the 60-day scheduled-workflow
auto-disable is a known hazard on this repo) and the daily scrape is coming from
the local scheduled task instead, or the "Record the day's data" step is being
skipped. **I cannot tell which from the filesystem — that needs the Actions tab.**

## No data is lost, but it cannot self-heal

`update_rate_log.py` diffs `enriched_locations_backup.json` (yesterday) against
`enriched_locations.json` (today). It is a **rolling two-file diff**. Running it
now recovers 29 → 30 September only. Days 12–28 September are gone from the log
permanently by that route.

They are **not** gone from the data. `history/publicstorage/` holds a complete
daily snapshot for every day 1–30 September. The log can be rebuilt from the
archive — it just needs a script that walks the snapshot directory rather than the
rolling pair.

---

## What I'd do, in order

1. **Check the GitHub Actions tab** for `Daily Storage Scraper`. If it is disabled,
   re-enable it — and note the date, because that is the root cause of a 19-day
   analytical gap and it is worth knowing how it failed.
2. **Backfill `rate_changes.csv` from `history/publicstorage/*.json`** for 12–30
   September. New script; do not modify `update_rate_log.py`, which is correct for
   its job.
3. **Then** re-run `repricing_waves.py` and `wave_tiers.py` over the full window.
   That produces the September wave calendar the pages currently describe only in
   prose.
4. **Do not touch `repricing-stats.json`.** Frozen on purpose at the FindStorage
   shutdown.

## September waves, reconstructed independently for cross-checking

Not a source — use it to verify the rebuild.

| wave | movers | share | up / down | net value | median abs |
|---|---:|---:|---|---:|---:|
| 09-02 | 40,103 | 68.4% | 19,557 / 20,546 | +0.17% | 7.69% |
| 09-10 | 16,619 | 29.4% | 6,106 / 10,513 | −0.73% | 5.48% |
| **09-14** | 31,244 | 52.5% | **135 / 31,109** | **−14.55%** | 25.00% |
| 09-16 | 50,740 | 89.6% | 27,608 / 23,132 | +3.78% | 9.46% |
| **09-18** | 22,772 | 40.0% | **18,828 / 3,944** | **+7.56%** | 14.50% |
| 09-23 | 46,023 | 83.7% | 23,282 / 22,741 | +0.87% | 8.75% |
| 09-30 | 49,876 | 87.9% | 21,471 / 28,405 | +0.03% | 7.84% |

Seven waves. Twenty-three days with zero price movement across ~56,000 SKUs.

The 30 September wave is **routine** — balanced direction, near-zero net, the same
shape as 09-02 and 09-23. Only the 14th and the 18th are directional.

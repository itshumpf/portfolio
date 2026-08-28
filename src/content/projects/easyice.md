---
title: "Health-Inspection Lead Pipeline"
shortTitle: "Lead Pipeline"
indexLabel: "Public records, call order"
tagline: "Public health-inspection records across two jurisdictions, deduplicated and recency-ranked into a call list — with most of the engineering spent on making sure the list can't be quietly wrong."
expandedBody: true
period: "Aug 2026"
role: "Sole engineer"
status: "live"
kind: "personal"
order: 3
thesis: "A small business needed to know who to call first. The records that answer that are public, published by county and city health departments, and available in completely different shapes depending on who publishes them. The pipeline itself took a few days. The rest of the time went into the parts that stop a lead list being confidently wrong — a source whose join key is misspelled, a server that returns HTTP 200 for records that don't exist, and one jurisdiction that got investigated in full and then deliberately not built."
tech:
  - "Python"
  - "Socrata SODA API"
  - "server-rendered HTML parsing"
  - "pytest — 279 tests, no network"
  - "per-run request budget with backoff"
  - "coverage and trace reporting"
  - "PowerShell scheduled task"
stats:
  - value: "1"
    label: "jurisdiction researched in full, then deliberately not built"
  - value: "279"
    label: "tests, none of which touch the network"
  - value: "~30"
    label: "requests to cover a 9,711-business county"
  - value: "2"
    label: "publisher shapes: a JSON API and reverse-engineered HTML"
links:
  noLinkNote: "Private repository — the pipeline serves one small business and its output is a working call list."
impact: "The list decides call order and nothing else. The citation that put a business on it is never mentioned to that business, and nothing in the repository generates anything to say to one — a rule written into the README's third paragraph before the first adapter was built."
---

Businesses cited by a health inspector for a broken or dirty ice machine have a
dated, documented problem with a specific piece of equipment. Those citations
are public record. Turning them into a ranked call list is a day of work.
Making sure the list is *right* took the rest of the time.

## Two publishers, two entirely different problems

**Santa Clara County** publishes on Socrata — a real JSON API, three tables
joined client-side, about thirty requests to cover 9,711 businesses.

**Washington DC** publishes through Tyler's Digital Health Department platform,
which has no API at all. One GET returns one server-rendered inspection report,
and all four query parameters are required, including an undocumented tenant id.
Inspection ids are sequential integers. None of it is written down anywhere; it
was reverse-engineered.

Both feed one deduplicated, scored list, and every lead carries the market it
came from.

## The join key is misspelled, and correcting it breaks everything silently

Santa Clara's inspections table names its join key **`inpsection_id`** — p and s
transposed. The violations table spells the same key correctly. Both are right;
they disagree with each other, because Socrata derives field names from the
uploaded column header and the typo is baked into the dataset.

Correcting the spelling doesn't raise an error. It produces an **empty lead
list**, which looks exactly like a quiet week. The constant carries a large
comment and is pinned by a test named `test_join_key_typo_is_deliberate`, so a
future tidy-up has to argue with a failing test rather than with nothing.

DC has the same shape of trap from the other direction: requesting an inspection
id that was never issued returns **HTTP 200** with a normal-looking page. The
only usable "this record doesn't exist" test is a string check on the body.

## Florida: researched in full, then not built

Florida's mechanism was worked out completely — the free bulk extract, the
per-district partitioning, the licensure file that joins phone numbers, all
thirty-five of its columns enumerated to confirm what it does and does not
carry. It carries no email address.

**No adapter was written.** The finding was that Florida is better served by a
public records request than by scraping, and the document explaining why is in
the repository next to the adapters that were built. Deciding not to build
something is a result, and it is only useful if it is written down where the
next person will find it.

## Rate limiting, and correcting my own first version

Version one used `random.uniform(1.0, 2.0)` between requests and described this
in its own comments as "human-like delays" with "zero bot-detection footprint."

That posture is wrong for a documented public API that publishes a crawl delay.
The rewrite honours the published `Crawl-delay: 1`, sends a descriptive
User-Agent with a contact address rather than a browser string, honours
`Retry-After` on 429, backs off exponentially on 5xx, and caps the entire run at
400 requests so a bug cannot become a hammering. Both jurisdictions share one
budget, so adding a second market did not silently double the traffic.

The correct behaviour on a public API is to identify yourself and stay inside
the published limit, not to look like a person.

## What the source doesn't have, reported as its own output

Every run writes a coverage report and a request trace: what was retrieved,
what failed, what was deliberately skipped, and which fields the source simply
does not populate. An empty result has to distinguish *no data exists* from
*the request failed* from *I never asked* — three things that look identical in
a lead list and mean completely different things.

Two more that are stated because leaving them out would mislead. Santa Clara's
data carries **no explicit open licence** — Delaware's equivalent is marked
public domain and San Francisco's carries PDDL, and Santa Clara's metadata
carries neither. Access is permitted and the records are public, but there is no
licence grant to point at. And the dataset goes back exactly two years and no
further, because it was created in August 2024 — there are no older records
being filtered out, the source does not have any.

## Two fields where one would have been easier

`jurisdiction` is the publisher's boundary and the deduplication key. `market`
is the sales territory and the label a human reads. Collapsing them into one
field would either put a county name on someone's call list or use a marketing
label as a data key.

The first version exported everything as "San Jose." It is a county dataset
covering twenty-three cities.

## The daily run refuses to send stale mail

The emailer reads a CSV. It has no way of knowing whether that file was written
thirty seconds ago or last Tuesday. On one run the collector found 246 leads and
wrote none of them, because the file was open in a spreadsheet and locked — the
pipeline reported that correctly, but an emailer running blind straight
afterwards would have sent the previous list with the current date on it.

So the wrapper sends only if the file was written by that run, and the digest
covers net-new leads only. On a day with nothing new it stays silent, which is
the honest output and the one that keeps the mail worth opening.

---
title: "Multi-Platform Communications Consolidation"
projectId: "comms-consolidation"
period: "Jul 2026"
order: 1
summary: "A confidential Upwork engagement: consolidating 7,626 records across five messaging platforms into a single, defensible timeline for a legal proceeding. This write-up covers the engineering in depth. It deliberately says nothing about the underlying matter, the client, or any other party involved — that confidentiality is absolute and not up for discussion."
sections:
  - title: "Five sources, no shared schema"
    body:
      - "The records came out of five places that were never designed to talk to each other: a Gmail export, an iPhone SMS backup, a WhatsApp chat export, a Facebook Messenger data export, and a webmail account's own export tool. Each one uses a different file format, a different field naming convention, a different notion of what a 'message' even is — some carry rich metadata, some are closer to a flat text dump."
      - "The first decision was to not let that variety leak downstream. Every source gets its own parser, but every parser's only job is to translate its source's native shape into one internal record — sender, recipient, timestamp, body, and a pointer back to exactly where it came from. Deduplication, timezone handling, and reporting are all written once, against that one shape, regardless of which of the five platforms a given record started on."
  - title: "Timezone normalization, with DST handled explicitly"
    body:
      - "Every export timestamps messages in local time, and local time isn't a fixed offset from UTC — it changes twice a year, on dates that themselves move slightly year to year. A conversion that assumes a single fixed offset is wrong for part of the year, silently, by exactly one hour."
      - "That's not a rounding error here — it's the difference between two events looking sequential or simultaneous, which matters when the whole point of the exercise is a timeline that can be relied on. So every timestamp is resolved against the actual daylight-saving rules in effect on its specific date, not a constant offset applied uniformly across the dataset."
  - title: "Deduplication and reconciliation across sources"
    body:
      - "The same real-world exchange sometimes surfaces more than once — forwarded content, or the same conversation thread captured by two different export tools. Records that agree closely enough in timestamp and content are treated as one event and reduced to a single canonical entry."
      - "Records that are close but don't clear that bar aren't silently merged or silently dropped either way — they're flagged for a human to look at. A pipeline that quietly guesses on ambiguous matches is worse than one that admits it isn't sure."
  - title: "Provenance you can point to"
    body:
      - "Every record that survives reconciliation carries a tag back to its original source file and location. In a legal proceeding, a data point nobody can source is worth nothing — the deliverable has to answer 'where did this come from, exactly' for any single line someone points to, not just in aggregate."
  - title: "An independent QA audit pass"
    body:
      - "The pipeline checking its own output isn't the same thing as an independent check of it. Before delivery, a separate audit pass re-derived a sample of records directly from the raw source exports and confirmed they matched what the pipeline had produced — an outside check on the pipeline's own claims, not just a second run of the same code."
  - title: "Automated PDF report generation"
    body:
      - "The output that mattered wasn't a database or a CSV — it was something a non-technical reader could actually pick up and use. The pipeline's final stage formats the reconciled, provenance-tagged timeline into a structured PDF automatically, so the report has the same shape and the same rigor every time, rather than depending on a manual formatting pass to not introduce its own errors."
---
A one-off Upwork engagement, not a product: five export formats in, one defensible timeline out.
Everything below is the engineering behind that — what the platform differences actually were, how
timing was made trustworthy, how duplicates were resolved without guessing silently, and how the
result was checked before it went out the door.

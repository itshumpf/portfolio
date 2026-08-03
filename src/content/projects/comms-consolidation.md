---
title: "Multi-Platform Communications Consolidation"
tagline: "Confidential Upwork engagement — consolidated and reconciled 7,626 records across five messaging platforms into a single, defensible timeline for a legal proceeding."
thesis: "The client came to Upwork looking for basic Python scripting for a legal proceeding. What the matter actually needed was a small ETL system: five communication platforms, no shared identifier between them, and a timeline where an hour of timezone error could misstate what happened when. This is what got built instead of a script — a pipeline designed to be checked, not just to run."
expandedBody: true
period: "Jul 2026"
role: "Freelance Data Engineer (Upwork client engagement)"
status: "delivered"
kind: "client"
order: 0
indexLabel: "Legal record consolidation"
shortTitle: "Comms Consolidation"
tech: ["Python", "ETL & data reconciliation", "Timezone/DST-aware normalization", "PDF report generation"]
links:
  noLinkNote: "Confidential client engagement — no public repo or live URL."
stats:
  - value: "7,626"
    label: "records parsed and normalized across five heterogeneous communication sources"
  - value: "5"
    label: "platforms unified into one timeline: Gmail, iPhone SMS, WhatsApp, Facebook Messenger, and webmail"
  - value: "31 Jul 2026"
    label: "delivered on Upwork — client has since engaged him for the next phase"
impact: "The client came in looking for basic Python scripting. What the underlying legal proceeding actually needed was full-scale ETL: five incompatible export formats reconciled into a single record with defensible provenance for every line — the kind of problem that doesn't get solved by a script, only by a pipeline built to be checked."
testimonial:
  quote: "I originally searched for someone who could handle basic Python scripting, but Braeden delivered far beyond that. He anticipated needs I didn't even know how to articulate."
  attribution: "Client, Upwork"
  rating: 5.0
  note: "The client has since engaged him for the next phase of this project."
---
A client came to Upwork needing help pulling together records for a legal proceeding. What the
case actually needed was full-scale data engineering: 7,626 messages and records were scattered
across five incompatible export formats — Gmail, iPhone SMS, WhatsApp, Facebook Messenger, and a
webmail account — each with its own timestamp convention, its own missing fields, and no shared
identifier to link them.

The pipeline parses each source's native export format, then normalizes every timestamp to a single
timezone with correct daylight-saving handling — a naive UTC conversion silently shifts events by an
hour on either side of a DST boundary, which is disqualifying when timing is part of the record.
Duplicate and fragmentary records are reconciled across sources into one chronological timeline, and
every surviving record carries a provenance tag back to its original source file, so any line in the
final output can be traced to exactly where it came from.

The deliverable was a formatted PDF report generated automatically from the reconciled dataset, plus
a dedicated QA audit pass — a second, independent check of the pipeline's output against the source
exports before delivery — because a consolidation this size is only useful if it's also correct.

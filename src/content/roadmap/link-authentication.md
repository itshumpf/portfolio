---
title: "Adaptive link authentication — V2"
category: "landing-soon"
order: 0
---
V1 asked whether a clock identifies a device. It does not — it identifies a link: a transmitter,
a receiver and the path between them, measured as one object. V2 asks whether that link can
authenticate.

**Find the link. Measure it. Find out whether it can be tracked.** Three questions that can fail
independently, which is why they are three and not one.

The eight nights already settled three design decisions. Enrollment has to be **recent and
adaptive**, not a permanent template — a freshly enrolled signature holds through the rest of that
session at 88–96%, and a template carried to another night averages 38–49%. **Channel features
lead, not raw clock slope** — log CIR spread transfers at 57.6% and RSSI at 55.1%, against 38.4%
for the slope everything was originally built around. And two receivers have to be **independent
evidence under a calibrated rule**, because naive concatenation came in 0.6 points *below* the
better single receiver.

The measurement that matters is the one this corpus cannot make: **false-accept rate against
attacker displacement.** Eight nights contain no cloned MAC, no substitute board, no relay and no
replay — they measure repeatability, not spoof resistance. That needs randomized trials with the
legitimate beacon fixed and an attacker transmitting cloned packets from pre-registered distances
and bearings, device and location crossed factorially, receiver positions swapped midway,
thresholds frozen, and every attack trial scored blind.

Until that runs, *"a link signature is harder to spoof than a device signature"* is a hypothesis.
It is not a finding and it will not be quoted as one.

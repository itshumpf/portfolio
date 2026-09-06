---
title: "Live match and library — retired, and why"
category: "frontier"
order: 7
---
This was going to mature the live match/library workflow so any capture was scored against a
learned device library in real time, returning one of four verdicts: known device, same radio on a
rotated MAC, trusted MAC but wrong radio, or stranger.

**Its premise did not survive the controls.** That workflow assumes a device carries a portable
signature — that a library learned on one receiver means something on another, and next week.
The eight-night series measured the opposite: the cross-receiver double difference is 6.79
between-unit SD at every bin scale, and a template carried to a different night averages 38–49%
against 33.3% chance. There is no library to match against, because the thing being learned
belongs to the transmitter, the receiver and the path together.

Kept on the roadmap as a retired item rather than deleted, because the reasoning is more useful
than the plan was. What replaces it is *Adaptive link authentication*.

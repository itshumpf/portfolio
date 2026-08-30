---
title: "Room or Radio?"
subtitle: "I built a system that identified WiFi devices by their crystal imperfections at 99.7%. Then I spent two months trying to break it, and eventually succeeded."
order: 0
headlineStat:
  value: "13"
  label: "of my own working results, killed by controls I built to kill them — out of 29 hypotheses carried to a verdict"
secondaryStats:
  - value: "0.2σ"
    label: "between two different boards, four feet apart"
  - value: "19.6σ"
    label: "same board, two rooms"
  - value: "16"
    label: "tested past what the instrument can resolve"
  - value: "99.7% → 29.7%"
    label: "blind holdout, then across sessions"
scaleStat:
  value: "43.4 GB"
  label: "of raw CSI captures — 97 files across 60 recording sessions"
  caveat: "This is the corpus, not a result, and it is stated in bytes and files because those are the two things a command can count exactly. The experimental figures above come from two specific 38-minute windows on adjacent nights, each with all transmitters live and the room unoccupied — the conditions travel with the numbers because the numbers change without them. Corpus size and experimental result answer different questions and should never be merged."
approach:
  - title: "Write the hypothesis down before running the test"
    description: "Experiments exist in two stages. Hypotheses, decision thresholds and controls are written to disk and dated before any analysis runs; results are appended below a banner afterwards. Fifteen of the twenty-nine verdicts carry a bar frozen in advance — one of them timestamped 19:30 UTC before the sweep it governed. It means a result cannot be quietly reshaped to fit what came out."
  - title: "Build the control that kills your own result"
    description: "Fusing two features appeared to give a +26 percentage-point improvement, winning 12 of 12 comparisons with a confidence interval excluding zero. Substituting a random number of identical variance reproduced the gain exactly: +0.00 pp, CI [-1.80, +1.71]. The finding was dimensionality, not information. That control existed only because it was built to make my own result fail."
  - title: "Design tests that can come back either way"
    description: "Two of the twenty-nine ran backwards and made a finding stronger — a cable-topology confound that failed in the opposite direction to what a cable effect predicts, and a suspected artifact that survived removing the correction accused of causing it. A test that can destroy a result is the only kind whose survival means anything."
  - title: "Chronological splits, never random"
    description: "Train on the first 60% of each source's observations in time, test on the last 40%. A random split lets the model interpolate between observations minutes apart and reports a number that means nothing about tomorrow. The chronological version is lower and it is the one that describes reality."
  - title: "No number without the condition that produced it"
    description: "The headline accuracy was 99.7% on one receiver and 95.7% once a second receiver's captures of the same sessions joined. Same system, same data. Quoting either without naming the receiver configuration is quoting a number that does not exist."
results:
  - "Twenty-nine hypotheses were carried to a verdict; thirteen of them were my own working results. Each was live when its test began — reference-beacon subtraction, longer averaging windows, tighter gates, looser gates, cross-receiver library transfer, blind clustering of MAC-randomising devices, feature fusion. Every one was retired by a threshold or control set up in advance to permit exactly that outcome."
  - "Two physically distinct ESP32 boards, placed four feet apart on one surface, are statistically indistinguishable — 0.2σ and 0.7σ on two independent receivers, against a between-unit population spread of 0.00237 rad/subcarrier. The same pair read 7.9σ apart the previous night with one of them in another room. Both boards were measured in the same windows, so clock drift cannot account for it."
  - "The same physical board reads +0.0552 rad/subcarrier on a television in a bedroom and +0.0087 on a kitchen counter — a 19.6σ displacement of the quantity being used as its hardware identity, for a crystal that never changed. This one is a between-night comparison, so it inherits drift: an untouched beacon wanders 2.5-4.9σ across a single night by the project's own measurement, which makes the honest margin 4x to 8x rather than 19.6x. Stated that way because a reader who opens the drift document would find it in a minute."
  - "Two receivers observing the same transmitter at the same instant disagreed by up to 504x more when the transmitters were separated than when they were co-located. With the beacons apart, the two receivers measured one transmitter at +0.0120 and −0.0121 — opposite signs. Co-located, they agreed to one part in ten thousand. A property of a crystal cannot depend on which receiver is listening."
  - "Averaging cannot recover the signal, and a control proves the machinery is fine. Allan deviation falls as τ^-0.47 out to about ten seconds and then rises. Shuffling the same frames in time and re-averaging recovers the ideal 1/√W exactly — 15.7, 19.5 and 17.4 against a predicted 16. In true temporal order the same operation yields 1.10 to 1.70. There is nothing left to average away after the first second."
  - "An incidental finding: the instrument detects people well. A human in the room appears as an 8.7x increase in spread on every link simultaneously while the medians barely move — a cleaner presence detector than the amplitude-domain pipeline built for that purpose."
limitations:
  - title: "This does not show RF fingerprinting is impossible"
    description: "Published successes in the field generally use software-defined radios with far greater bandwidth, transient turn-on analysis and controlled channels. What this shows is that ESP32 CSI at 20 MHz, with phase-slope estimation, in a domestic multipath environment, cannot separate the transmitter from the room. That is a statement about an instrument, not about physics."
  - title: "Thermal drift was not ruled out, and three specific versions of it were"
    description: "A power-on warm-up transient, an applied one-hour outdoor-to-indoor step, and outdoor air temperature as the drift driver were each tested against controls and rejected. The general mechanism stays rated plausible-but-not-isolated, and the reason is a hardware boundary rather than an analytical one: no temperature was measured anywhere in the corpus — not outdoor, not indoor, not on-die. Isolating it needs an instrument the project does not own, so the honest position is three named sub-hypotheses rejected and the category left open. Naming the three is a stronger claim than naming the category, and the difference is not cosmetic."
  - title: "One window per condition, and a seven-night replication is running to fix it"
    description: "The 0.2σ co-location result is a single 38-minute window. It does not inherit drift — both boards were measured in the same minutes — but n = 1 is n = 1. A seven-night repeat is under way, pre-registered 28 August 2026 before the first capture. Two predictions are on record: the co-located pair holds below 1.0σ on at least five of seven nights, and reference correction increases cross-receiver disagreement rather than reducing it. A third asks whether the 1.0σ bar is even resolvable given a documented 2.5-4.9σ drift floor — because if it is not, the honest verdict is that the design cannot answer the question, which is a different outcome from the prediction failing. The registration separates those two before any data exists to blur them."
  - title: "The receiver-disagreement result was not pre-registered"
    description: "It was found by checking a caveat rather than by testing a frozen hypothesis, so no threshold was written for it in advance. The direction and magnitude should be predicted beforehand and re-tested on a fresh capture before it is treated as established. It is reported at the same prominence as the findings that were pre-registered."
  - title: "Power source is confounded with device identity"
    description: "In the co-located capture two beacons ran on battery and one on mains. The collapse between the two indistinguishable boards survives this — they differ in power source and collapse anyway, which is the harder direction for a confound to explain. The third board's apparent distinctness does not survive it, and is not relied on."
  - title: "Three devices, and the class count travels with every figure"
    description: "Every accuracy number here is against N = 3 with chance at 33.3%, and the count is printed beside each one. An earlier figure in this project became permanently uninterpretable because its class count was never recorded, and that is not being repeated."
  - title: "The dataset is not published, and results cannot be independently re-derived"
    description: "Running promiscuously, the array captured every WiFi transmitter in range — including third-party hardware whose owners did not consent — and the captures are unavoidably a log of when a home was occupied. That is a privacy decision before it is a reproducibility one. The pipeline can be read in full; the data behind the numbers is not shipped, and this is stated rather than worked around."
techStack:
  - category: "Firmware"
    items: ["C on ESP-IDF v5.5", "ESP-NOW transport", "custom binary telemetry protocol", "task and RF-liveness watchdogs", "NVS-persisted node identity"]
  - category: "Signal processing"
    items: ["Python", "NumPy", "vectorized RANSAC", "phase unwrap with temporal continuity", "1D Kalman drift tracking", "Welford covariance", "Mahalanobis distance with χ² thresholds"]
  - category: "Analysis and data"
    items: ["DuckDB", "Parquet", "SQLite", "chronological train/test harnesses", "pre-registered experiment scripts", "bootstrap resampling", "permutation and variance-matched null controls"]
  - category: "Deliberately not used"
    items: ["deep learning frameworks — every decision the system makes is explainable as an ellipse and a probability"]
demoSlot:
  status: "gif"
  label: "Separation by condition, in standard deviations of the between-unit population spread"
  mediaUrl: "/demo/csi/room-vs-device-separation.svg"
  note: "Being different hardware moves the measurement 0.2σ. Being the same board in a different room moves it 19.6σ. The two small bars are same-instant measurements; the large one is between-night and carries a 2.5–4.9σ drift floor."
links: {}
---

## The number I believed

99.7% blind-holdout accuracy at telling three transmitters apart, measured on a
chronological split so the test windows came later in time than the training
ones. Three ESP32 beacons, a promiscuous receiver, and a signal chain that
pulls sampling-clock error out of raw subcarrier phase.

Every radio is driven by a quartz crystal and no two are cut identically. The
resulting frequency offsets are baked into the silicon, which is what makes
them interesting — they survive a device changing its MAC address, so they
promise an identity a spoofer cannot put on and take off.

The number was real. It was not measuring what it was named after.

## The part that took two months

The interesting thing is not that the result fell over. It is how many times it
got back up first.

The pattern ran for eight weeks. A number would look good. I would find a
reason to doubt it, build a test that could kill it, and run the test. Sometimes
the number survived. Usually it didn't, and the fix produced a *new* good
number — which then went through the same thing.

**Thirteen of those tests killed a result I already had working. Six of them:**

| What I believed | What killed it |
| --- | --- |
| Reference-beacon subtraction cancels receiver-side drift | The correction **raised** the noise floor — in six of six cells |
| Longer averaging windows reduce estimator noise | 256× more averaging moved the pair that mattered 0.69σ → 0.83σ. A time-shuffle control on the identical frames delivered the textbook factor of 16, so the machinery was fine and the signal wasn't there |
| Tighter admission gates clean up the marginal pair | 175 configurations swept. 174 left it between 0.66σ and 1.18σ |
| Looser gates recover the ambient devices being missed | All 13 recovered sources failed a gain rule frozen before the sweep, at slope dispersions of 9.6σ to 64.5σ |
| Blind clustering re-links devices across randomized MACs | Multi-MAC cluster count came in **below** the permutation null in all eight configurations — what a one-dimensional feature colliding by pigeonhole looks like |
| Fusing two features adds information neither has alone | +26 pp, winning 12 of 12, CI excluding zero — reproduced exactly by a random number of the same variance |

**Each of those was a place to stop.** Every one had a working number sitting
in front of it, and in every case the comfortable thing and the honest thing
pointed in opposite directions. The record contains sixteen more questions
marked unresolved rather than answered — including one where the positive
control failed, which is written down instead of quietly re-run.

None of it explained the original 99.7%.

## Then I drew a floor plan

The three beacons live where they live. One on a side table in an open-plan
living space, one on a television in a bedroom, one beside a desktop PC in a
third room. The receivers are on the living-room wall.

**Every between-device measurement the project had ever produced was taken with
the transmitters on non-comparable propagation paths.** "Which device is this"
and "which room is this" had been the same question since July, and nothing in
43 GB of captures recorded where any hardware was.

It is not a bug and no figure was computed incorrectly. It is a design flaw —
a variable that was never varied, and therefore never separated from the
variable of interest.

## The experiment

Move the transmitters onto one surface, four feet apart, and repeat the
measurement.

Two boards that had read 7.9σ apart became **0.2σ** apart — measured in the
same windows, so no amount of clock drift explains it. Two receivers listening
to the same transmitter at the same instant, which had been reporting **+0.0120
and −0.0121** — opposite signs — agreed to one part in ten thousand. A crystal
cannot have one value for one listener and the negative of it for another.

Those two are the load-bearing results, and both are same-instant. The
between-night figure is larger and weaker: one board carried from a bedroom to
a kitchen counter moved **19.6σ**, against a same-position drift floor of
2.5–4.9σ. Real, and a 4× to 8× margin rather than the 19.6× it looks like.

None of it is the behavior of a crystal.

<div id="csi-explorer-slot"></div>

## Why this is the case study

Nothing here transfers to a data pipeline. Nobody hiring an engineer needs
someone who can fit a RANSAC line to subcarrier phase.

What transfers is the shape of the work: writing the threshold down before
running the test, building the control designed to kill your own result,
designing tests that can come back either way, and refusing to publish a number
without the condition that produced it.

Twenty-nine hypotheses, thirteen of them mine, sixteen questions left open.
That is the deliverable.

## What happens next, written down in advance

A seven-night replication starts tonight, pre-registered 28 August 2026 before
the first capture. Two predictions are on the record: the co-located pair holds
below 1.0σ on at least five of seven nights, and reference correction increases
cross-receiver disagreement rather than reducing it. If the pair scatters above
1.0σ on most nights, the room conclusion is in trouble — that is the stated
falsifier, and it was written before any data existed to argue with.

Then the project closes. Not because it stopped being interesting, but because
every remaining test requires hardware I would have to buy, and buying my way to
a different answer is not the experiment. Knowing where the end is has been part
of the method the whole way through.

I want to work on systems where correctness matters — pipelines feeding
decisions, measurements someone acts on, places where being wrong quietly is
expensive. I don't need domain expertise on day one. I need a problem worth
being careful about.

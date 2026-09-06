---
title: "Room or Radio?"
subtitle: "I built a system that identified Wi-Fi devices at 99.7%. The controls broke the identity claim—and opened a more interesting security question about the physical link."
order: 0
headlineStat:
  value: "69.5M"
  label: "clean beacon frames replayed with a deterministic, unwrap-free estimator"
secondaryStats:
  - value: "99.7%"
    label: "the original chronological holdout result, three transmitters"
  - value: "6.8 SD"
    label: "cross-receiver double difference — the same beacon pair, seen by two receivers in the same instants, disagreeing by this much at every bin scale. A property of the transmitter cannot do that."
  - value: "0.2σ"
    label: "between two different boards after they were co-located"
  - value: "95.8%"
    label: "median blind identification of three co-located transmitters, held-out 30-minute window, chance 33.3%"
  - value: "53–64%"
    label: "best channel-feature recognition on a held-out night — the same signature, one night later"
scaleStat:
  value: "54.92 GiB"
  label: "screened across 69,688,145 raw rows in sixteen canonical capture files"
  caveat: "Eight paired nights, three ESP32 beacons, and two receivers. Every row was screened; 69,510,186 clean beacon frames entered the replay. The new security interpretation is a hypothesis, not a measured spoof-resistance claim."
approach:
  - title: "Split time honestly"
    description: "Whole nights—not randomly mixed frames—were held out. Nearby CSI windows are strongly correlated; random splitting would reward interpolation and call it tomorrow."
  - title: "Replay every eligible frame"
    description: "The final pass screened every raw row, then computed deterministic unwrap-free slope, OLS, coherence, amplitude, RSSI, and CIR features for every clean B1/B2/B3 frame."
  - title: "Freeze the bar before the result"
    description: "Representations, train/test units, metrics, and pass/fail thresholds were written down before the eight-night link-signature classification was run. None of the frozen security prerequisites passed."
  - title: "Keep the claim smaller than the evidence"
    description: "These captures test repeatability and separability. With no cloned transmitter, displaced attacker, relay, replay, or receiver swap, they cannot test spoofing cost."
results:
  - "The original device-ID result did not survive physical controls. Two boards previously 7.9σ apart became 0.2σ apart when co-located; the same board moved 19.6σ between rooms, against a 2.5–4.9σ drift floor."
  - "What it measures is the link, not the device, and the double difference is the test that settles it. If a beacon pair's separation were a property of the transmitters, two receivers watching the same pair in the same instants should agree. They disagree by a median of 6.79 between-unit SD at 10-second, 1-minute and 5-minute bins, with level correlation of essentially zero. Smoothing does not remove it."
  - "It still separates co-located hardware. In a held-out 30-minute window that had never been analysed, blind identification of three transmitters sitting four feet apart on one surface ran to a median of 95.8% across fourteen receiver-nights, against 33.3% chance — with the signature moving only 0.07σ across a 39-minute gap. The capability is real; the attribution was wrong."
  - "All 69,688,145 raw rows were accounted for. The full replay retained 69,510,186 clean beacon frames, found 1,258 corrupt rows on D0WD and none on S3, and conserved every frame through four aggregation scales."
  - "Channel features were the best cross-night representation, reaching 53.2% balanced accuracy on D0WD and 64.3% on S3 against 33.3% chance. The frozen prerequisite still failed because performance varied sharply by night."
  - "Fresh within-night enrollment was much stronger: 88.4% on D0WD, 91.7% on S3, and 94.3% with both receivers for channel features. This was a post-registration stability analysis, so it is evidence for a short-horizon hypothesis rather than a confirmed authentication result."
  - "Claimed-link verification was not security quality. The best representation reached AUC 0.70 and an equal-error rate of 30.9%. Simple two-receiver concatenation did not improve held-out-night recognition."
limitations:
  - title: "No attacker was recorded"
    description: "There are no examples of a cloned MAC, substitute ESP32, displaced transmitter, directional antenna, channel emulator, replay, or relay. False-accept rate against those attacks remains unknown."
  - title: "Device and location are still confounded"
    description: "Each beacon stayed associated with its own hardware, antenna, transmit power, and location. Cross-receiver structure may be caused by any combination of those variables."
  - title: "The strong result is short-horizon and exploratory"
    description: "The early-40%-to-late-40% test used a 20% time gap and reached 88–96%, but it was designed after the frozen cross-night tests. It must be predicted and repeated prospectively."
  - title: "Three transmitters, two receivers"
    description: "Every accuracy uses three classes with chance at 33.3%. More devices, receiver geometries, homes, channels, and environmental conditions are needed before generalization."
  - title: "The raw corpus stays private"
    description: "Promiscuous captures include third-party radios and indirectly encode home occupancy. Only aggregate results and sanitized tooling are publishable."
techStack:
  - category: "Firmware"
    items: ["C on ESP-IDF", "ESP-NOW beacons", "two receiver architectures", "binary telemetry", "RF-liveness watchdogs"]
  - category: "Signal processing"
    items: ["Python", "NumPy", "unwrap-free circular slope arbitration", "OLS controls", "CIR metrics", "robust multiscale aggregation"]
  - category: "Experimental design"
    items: ["whole-night holdouts", "preregistered thresholds", "receiver double differences", "change-point tests", "block-shuffled periodicity", "night bootstrap"]
  - category: "Scale and validation"
    items: ["69.5M-frame memory-mapped cache", "exact frame conservation", "structural validators", "deterministic reruns"]
links: {}
---

## The number I believed

The first classifier identified three transmitters at **99.7% accuracy** on a
chronological holdout. It used sampling-frequency offset inferred from raw Wi-Fi
subcarrier phase: a plausible hardware feature produced by imperfect quartz clocks.

The number was real. It was not measuring what it was named after.

## Then I drew a floor plan

Each beacon lived in a different room. Every between-device comparison was also a
between-path comparison. “Which radio is this?” and “where is this radio?” had been
the same label from the beginning.

I put the transmitters on one surface, four feet apart, and repeated the measurement.
Two boards that had read **7.9σ apart became 0.2σ apart**. The same board moved between
rooms changed by **19.6σ**, even after stating the weaker 2.5–4.9σ drift floor beside
it. Two receivers could report opposite slope signs for the same transmitter at the
same instant.

A property of one crystal cannot depend on which receiver is listening.

## Eight nights later

The follow-up was larger than the experiment that broke the original claim: three
ESP32 beacons, one D0WD receiver, one S3 receiver, and eight paired overnight captures.
Every one of the **69,688,145 raw rows** was screened. A deterministic, unwrap-free
estimator replayed **69,510,186 clean beacon frames** and produced exact 1-second,
10-second, 1-minute, and 5-minute summaries.

Whole nights were held out. No neighboring window from a test night was allowed into
its training templates.

The fixed links were recognizable later in the same session: **88–96%** depending on
receiver and feature family. Across an unseen night, the best channel representation
fell to **53% on D0WD and 64% on S3**. At verification rather than identification, the
best equal-error rate was **30.9%**. Simple two-receiver concatenation did not help.

That is not an authentication system. It is evidence of a strong but short-lived
physical state.

## The more interesting security question

A MAC address is cheap to copy. A radio path is not carried in the packet header. An
attacker would have to reproduce what multiple receivers observe from the authorized
position, hardware, antenna, environment, and instant—or defeat the measurement some
other way.

**The eight nights do not prove that is hard. They prove there is something concrete
enough to challenge.**

The next experiment is therefore not another device classifier. It is a randomized
link-authentication trial: legitimate beacon fixed; cloned transmitter moved through
preregistered distances and bearings; same and different boards crossed with same and
different positions; receiver positions swapped; thresholds frozen before attacker
trials begin.

The primary result will be false-accept rate versus attacker displacement, reported
beside legitimate false rejects as the enrolled signature ages. Replay and relay need
unpredictable receiver challenges or channel hopping; passive CSI recognition alone
does not provide freshness.

## What this project demonstrates

The transferable work is not fitting a line to phase. It is building an instrument,
discovering that its best number answers the wrong question, replaying every frame
with a corrected estimator, and keeping the new claim smaller than the available
evidence.

The rejection ledger records **35 rejection tests, collapsing to 29 distinct ideas**
once six families of repeated kill are merged — the tests are separately run and
separately decided, not statistically independent, and the ledger states that
convention rather than leaving it to be inferred. Thirteen of the 29 were my own
working results, retired when their controls contradicted them. Fifteen of the 35
tests used a threshold or decision rule frozen before the run.

Thirteen earlier working results were retired by controls designed to let them fail.
The eight-night link-security prerequisite failed too. The project became more useful
each time the answer got narrower.

## On AI assistance

I use AI heavily for coding and writing. The experiment design, hardware, captures,
controls, decisions about which claims survived, and responsibility for every result
are mine. AI wrote much of the analysis code that produced these numbers; that is
exactly why every figure is re-derived from a named command and checked rather than
trusted. AI drafted much of this page; I chose the hook, rewrote and edited it heavily,
and I don't consider generated output evidence, which is why there's so much validation
here.

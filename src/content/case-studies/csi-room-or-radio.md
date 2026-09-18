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
    label: "between two different boards once they sat four feet apart on one surface"
  - value: "95.8%"
    label: "median blind identification of three transmitters four feet apart on one surface, held-out 30-minute window, chance 33.3%. N=3 units, not 3 populations"
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
  - "The original device-ID result did not survive physical controls. Two boards previously 7.9σ apart became 0.2σ apart once they sat four feet apart on one surface; the same board moved 19.6σ between rooms, against a 2.5–4.9σ drift floor."
  - "What it measures is the link, not the device, and the double difference is the test that settles it. If a beacon pair's separation were a property of the transmitters, two receivers watching the same pair in the same instants should agree. They disagree by a median of 6.79 between-unit SD at 10-second, 1-minute and 5-minute bins, with level correlation of essentially zero. Smoothing does not remove it."
  - "It still separates transmitters four feet apart on one surface — which is about ten wavelengths at 2.4 GHz, so this is not a claim that spatial effects were removed. In a held-out 30-minute window that had never been analysed, blind identification of the three transmitters ran to a median of 95.8% across fourteen receiver-nights, against 33.3% chance — with the signature moving only 0.07σ across a 39-minute gap. The capability is real; the attribution was wrong."
  - "All 69,688,145 raw rows were accounted for. The full replay retained 69,510,186 clean beacon frames, found 1,258 corrupt rows on D0WD and none on S3, and conserved every frame through four aggregation scales."
  - "Channel features were the best cross-night representation, reaching 53.2% balanced accuracy on D0WD and 64.3% on S3 against 33.3% chance. The frozen prerequisite still failed because performance varied sharply by night."
  - "Fresh within-night enrollment was much stronger: 88.4% on D0WD, 91.7% on S3, and 94.3% with both receivers for channel features. This was a post-registration stability analysis, so it is evidence for a short-horizon hypothesis rather than a confirmed authentication result."
  - "Claimed-link verification was not security quality. The best representation reached AUC 0.70 and an equal-error rate of 30.9%. Simple two-receiver concatenation did not improve held-out-night recognition."
limitations:
  - title: "No attacker was recorded"
    description: "There are no examples of a cloned MAC, substitute ESP32, displaced transmitter, directional antenna, channel emulator, replay, or relay. False-accept rate against those attacks remains unknown."
  - title: "Device and location are still confounded"
    description: "Each beacon stayed associated with its own hardware, antenna, transmit power and location — and four feet at 2.4 GHz is roughly ten wavelengths, far enough for the propagation paths to differ. Nothing in this corpus separates the radio from where it was sitting."
  - title: "Recognised, but never isolated"
    description: "Packet-detection timing is the main one. The diagnostic that started this work states that every capture carries an unknown packet-boundary timing offset producing another slope; the IQ study models the dominant ramp as sampling and timing offset combined; and one candidate step was tested for timing-offset behaviour and collapsed 30x under a tighter quality gate. Recognised, partially challenged, never independently estimated. Receiver PHY differences between the two ESP32 generations — AGC and analog front end — are a second unisolated contributor. Temperature at the hardware is a deliberate V1 scope decision rather than an oversight: V1 bought no new parts, so there is no die-temperature telemetry, and adding it is a V2 item."
  - title: "The strong result is short-horizon and exploratory"
    description: "The early-40%-to-late-40% test used a 20% time gap and reached 88–96%, but it was designed after the frozen cross-night tests. It must be predicted and repeated prospectively."
  - title: "N=3 transmitters — frame count is not sample size"
    description: "This is a deep case study on three transmitter units, not a fingerprinting benchmark. 69.5 million frames do not make it 69.5 million independent samples — the unit of analysis is the radio, and there are three of them. Every accuracy is a three-class problem with chance at 33.3%. More devices, receiver geometries, homes, channels and environmental conditions are needed before any of this generalizes."
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
chronological holdout. It used the phase slope across Wi-Fi subcarriers, which I named
sampling-frequency offset: a plausible hardware feature produced by imperfect quartz
clocks. That slope is a composite — sampling-frequency offset, packet-detection timing,
linear channel delay and estimation error — and a single antenna cannot separate them.
The diagnostic that started this work said as much, and the name stuck anyway.

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
receiver and feature family — but that analysis was designed *after* the frozen tests
failed, so it is exploratory and not one of the pre-registered results. The
pre-registered test was the cross-night one, and it failed: across an unseen night the
best channel representation fell to **53% on D0WD and 64% on S3**. At verification rather than identification, the
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

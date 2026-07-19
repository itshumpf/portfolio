---
title: "Fingerprinting Devices by Their Crystal Clocks"
subtitle: "A cameraless home-security system that identifies transmitting devices from hardware clock imperfections in their WiFi signals — running 24/7 on commodity ESP32 hardware."
order: 1
headlineStat:
  value: "99.6%"
  label: "blind-holdout accuracy at device identification, ~10,000 test windows across 11 sessions"
secondaryStats:
  - value: "11–15σ"
    label: "cross-manufacturer device separation (7/7 holdout, correctly classified)"
  - value: "2.8M"
    label: "CSI frames captured — 7+ GB across 11 sessions"
  - value: "$ few"
    label: "cost per sensor node — commodity ESP32 hardware"
scaleStat:
  value: "1B+"
  label: "CSI frames captured to date, cumulative across ongoing 24/7 operation"
  caveat: "This is the running total from continuous deployment, not the accuracy-validation dataset. The 99.6% figure above is measured on a separate, controlled 2.8M-frame / 11-session blind holdout — the two numbers answer different questions and aren't meant to be combined."
approach:
  - title: "A dedicated reference beacon, not router traffic"
    description: "A TX beacon broadcasts identical ESP-NOW packets at a fixed 100 Hz on a fixed channel — a clean, steady stream instead of bursty, unpredictable router traffic. RX nodes run custom ESP-IDF firmware that streams compact binary CSI frames over USB serial to a host PC, which does all the science. Dumb, robust capture nodes; a smart host — so the DSP can evolve without ever reflashing hardware."
  - title: "Vectorized RANSAC line fits, not least squares"
    description: "Per-frame phase-vs-subcarrier slope (the SFO proxy) is recovered with RANSAC instead of a plain line fit, so multipath bumps and junk subcarriers become outliers that get ignored rather than error that biases the result. It runs vectorized as a single broadcast operation because it has to keep up with 100 Hz capture."
  - title: "Reference-beacon drift subtraction"
    description: "The receiver's own crystal drifts too, and that drift is common-mode across every source it measures. Subtracting the beacon's own Kalman-smoothed drift track cancels the receiver-side thermal wander — measured impact: device separation more than doubled, from ~1.0σ to 2.6σ on the same data."
  - title: "Mahalanobis discrimination with real probabilistic meaning"
    description: "Each known device keeps a running 2D Gaussian model of its (CFO, SFO) signature. New observations are scored by Mahalanobis distance, which under the model is χ²-distributed — so the accept/reject thresholds correspond to actual confidence levels, not tuned magic numbers. Anomalous windows never update the model, so a spoofer can't teach the system its own signature by flooding it."
results:
  - "Headline: 99.6% blind-holdout accuracy at device ID, measured on a chronological split — the model is tested on windows later in time than it trained on, so the number reflects real thermal drift, not interpolation."
  - "The security-relevant regime — a stranger's device vs. a known fleet — is the easy case for this method: cross-manufacturer separation lands at 11–15σ with 7/7 holdout windows classified correctly."
  - "A second pipeline reuses the same captured amplitude data for cameraless occupancy sensing: motion detection and respiration detection (7–12 bpm) from the identical CSI stream, with multi-link consensus required before it alarms."
limitations:
  - title: "Same-model discrimination tops out near 77%"
    description: "Telling one ESP32 apart from an identical ESP32 is the adversarial worst case, not the operational common case — distinct units land 1.8–2.7σ apart. Still well above chance, but the honest ceiling today."
  - title: "True clock twins are the current frontier"
    description: "Two of the reference beacons are effectively identical crystals, ~0.3σ apart — a coin flip for two-feature discrimination. Closing this is the top item on the roadmap, not a hidden gap."
  - title: "Thermal drift is real and only partially modeled"
    description: "Clock signatures wander with temperature; one device pair moved from 2.7σ to 1.3σ over an hours-long session. Reference-beacon subtraction cancels receiver-side drift across sessions, but not within-session same-model wander."
techStack:
  - category: "Firmware"
    items: ["C on ESP-IDF v5.5", "Custom components (node_hal, telemetry, calibration)", "ESP-NOW transport", "NVS-persisted identity", "Custom binary wire protocol"]
  - category: "Signal processing / host"
    items: ["Python + NumPy", "Hand-rolled RANSAC, phase unwrap, Welford covariance, 1D Kalman", "pyserial", "SQLite", "Matplotlib"]
  - category: "Deliberately not used"
    items: ["Deep learning — the discriminator is a statistically interpretable Gaussian/Mahalanobis model with χ²-calibrated thresholds, explainable in terms of an ellipse and a probability"]
demoSlot:
  status: "gif"
  label: "CFO/SFO monitor — interface mockup"
  note: "Interface mockup — shows the live CFO/SFO monitor UI (representative visualization, not live captured data)."
  mediaUrl: "/demo/csi/csi-tracking-demo.gif"
  mediaUrl2: "/demo/csi/csi-fingerprint-demo.gif"
links: {}
---
Every WiFi transmitter is driven by a quartz crystal oscillator, and no two crystals are cut
identically — manufacturing tolerances leave each radio with a slightly different carrier
frequency and sampling clock. Those imperfections are physically baked into the silicon and stay
stable across reboots, across MAC-address rotation, and across software. A MAC address is
something a spoofer can fake in software in seconds; a crystal's timing signature is not.

This project measures that signature end to end on hardware that costs a few dollars a node: an
ESP32-based WiFi Channel State Information (CSI) sensing array that extracts **Carrier Frequency
Offset (CFO)** and **Sampling Frequency Offset (SFO)** from raw subcarrier phase, models each
device's clock signature statistically, and classifies live traffic as a known device or a
stranger. It has been running continuously as my own apartment's home-security system, not a
benchtop experiment.

It's a complete embedded-plus-DSP system built from first principles: custom firmware on
constrained hardware, a signal-processing pipeline where every stage defeats a specific measured
failure mode, statistically honest evaluation against a blind chronological holdout, and the
operational discipline to run it 24/7 and fix the bugs that only autonomy surfaces — like
discovering that pyserial asserts DTR/RTS on port open, silently power-cycling every node a
diagnostic tool touched, until every host tool was fixed to open ports with those lines
deasserted.

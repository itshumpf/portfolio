---
title: "Building the Instrument — Crystal-Clock Fingerprinting, V1"
subtitle: "How the sensor array was designed and what it measured before the physical controls ran. Every number here is real and reproducible; what they turned out to be measuring is the subject of Room or Radio, which supersedes the identity claim below."
order: 1
headlineStat:
  value: "99.7%"
  label: "blind-holdout accuracy over 7,497 test windows on a single receiver across 11 sessions — as measured in July, before co-location and cross-receiver controls established that the separation belongs to the link rather than the device"
secondaryStats:
  - value: "95.7%"
    label: "same task, 14,234 windows, once a second receiver's captures of those sessions join the population"
  - value: "12.7σ / 10.4σ"
    label: "cross-manufacturer device separation from the reference beacon and from the other ambient device (6/6 holdout, correctly classified)"
  - value: "2.36M"
    label: "CSI frames in the session set backing these results — 11 sessions"
  - value: "$ few"
    label: "cost per sensor node — commodity ESP32 hardware"
scaleStat:
  value: "99.5 GiB"
  label: "raw CSI captured across 118 session files"
  caveat: "Counted from disk. The sixteen canonical eight-night files account for 54.92 GiB and exactly 69,688,145 rows, which puts the full corpus in the region of 126 million rows by the same bytes-per-row — an extrapolation, not a count, and quoted as such. The 99.7% figure above rests on a separate 2.36M-frame, 11-session blind holdout; the two numbers answer different questions and must not be combined."
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
  - "Headline: 99.7% blind-holdout accuracy at device ID over 7,497 test windows on a single receiver, measured on a chronological split — the model is tested on windows later in time than it trained on, so the number reflects real thermal drift, not interpolation."
  - "Adding a second receiver's captures of those same sessions puts it at 95.7% over 14,234 windows. That split is by receiver rather than by time — the replay walks the files in sorted order, so the desk receiver's captures train the model and the second node's are classified blind. It's cross-hardware generalization: train on one radio, test on another."
  - "The security-relevant regime — a stranger's device vs. a known fleet — is the easy case for this method: cross-manufacturer separation lands at 12.7σ from the reference beacon and 10.4σ from the other ambient device, with 6/6 holdout windows classified correctly."
  - "A second pipeline reuses the same captured amplitude data for cameraless occupancy sensing: motion detection and respiration detection (7.0–16.0 bpm) from the identical CSI stream, with multi-link consensus required before it alarms. The occupancy arm is deliberately quoted without an accuracy figure — a labelled ground-truth session was captured, and when it was finally scored the labels turned out to be zone-calibration labels rather than the detection protocol's, so the numbers that would validate it cannot be computed from it. That session needs recapturing before any occupancy accuracy claim is made."
limitations:
  - title: "Same-model discrimination is the weak point"
    description: "Telling one ESP32 apart from an identical ESP32 is the adversarial worst case, not the operational common case — distinct units land 1.8–2.7σ apart. A single session scored around 77%, but that was a best case and the class count behind it was never recorded, so it isn't a general performance figure and isn't quoted as one. Well above chance; the honest ceiling today is unquantified."
  - title: "True clock twins are the current frontier"
    description: "Two of the reference beacons are effectively identical crystals, ~0.3σ apart — a coin flip for two-feature discrimination. Closing this is the top item on the roadmap, not a hidden gap."
  - title: "Thermal drift is real and only partially modeled"
    description: "Clock signatures wander with temperature; one device pair moved from 2.7σ to 1.3σ over an hours-long session. Reference-beacon subtraction cancels receiver-side drift across sessions, but not within-session same-model wander."
  - title: "Ambient devices are measured far worse than beacons, and the gap is not closable by capturing longer"
    description: "A dedicated beacon transmits constantly; a household device does not. Over a nine-hour two-receiver capture, 38 ambient addresses were seen and exactly one cleared the 2,000-frame line the estimator needs — and it was a duplicate of another address. Loosening the frame-admission gate raises the admitted-frame count by up to 500× but adds no usable sources: measured against a criterion frozen before the test, each newly-admitted device scatters across 10–65× the entire spread that separates one ESP32 from another. The cross-manufacturer separation figures above rest on a small number of windows from well-heard devices and should be read as an existence proof, not a population result."
  - title: "One candidate feature turned out to measure the receiver, not the transmitter"
    description: "The conjugate-image coefficient from IQ imbalance looked like a promising second fingerprint. A pre-registered test found it receiver-dominated: two receivers disagree about the same transmitter by 5.7× the entire spread between transmitters, and that disagreement is not a constant that can be calibrated away. With two receivers only the receiver difference is identifiable, so 5.7× is a lower bound. Reported because the result is negative and the alternative was to quietly stop mentioning it."
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
stranger. It ran continuously in my own apartment rather than on a bench — which is how the
thermal drift, the ambient-device problem and the overnight failures got found at all. **It was
never an authentication system**, and the controls above are what established that; the
round-the-clock running is a statement about how it was tested, not about what it could defend.

It's a complete embedded-plus-DSP system built from first principles: custom firmware on
constrained hardware, a signal-processing pipeline where every stage defeats a specific measured
failure mode, statistically honest evaluation against blind holdouts — chronological on a single
receiver, cross-receiver when both are pooled — and the
operational discipline to run it 24/7 and fix the bugs that only autonomy surfaces — like
discovering that pyserial asserts DTR/RTS on port open, silently power-cycling every node a
diagnostic tool touched, until every host tool was fixed to open ports with those lines
deasserted.

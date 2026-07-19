---
title: "Thermal compensation from the transmitter itself"
category: "frontier"
order: 3
---
Every ESP32 has an internal die-temperature sensor. Embedding TX die temperature in the beacon
payload lets the host correlate and compensate the thermal drift that currently smears same-model
centroids together — zero added hardware cost, and the single highest-value improvement on the
board.

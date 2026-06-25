---
description: Scan assets/audio/ for loudness, codec coverage, sample rate, and naming violations.
agent: build
---

When this skill is invoked:

## 1. Parse Arguments

```
/mix-check                          # scan all of assets/audio/
/mix-check assets/audio/sfx/        # scan specific directory
```

## 2. Scan

Recursively scan the target directory for `.wav` files. For each file:

- **Sample rate** — warn if not 48000 Hz
- **Bit depth** — warn if not 16 or 24 bit
- **Naming** — warn if not lowercase with underscores
- **Codec coverage** — check if a corresponding `.webm` exists alongside (indicates converted/optimized)

## 3. Report

```
MIX CHECK: assets/audio/
─────────────────────────
Files scanned:     24
Sample rate OK:    22
Bit depth OK:      22
Naming OK:         24
Missing codec:     2  (explosion.wav → no explosion.webm)

RECOMMENDATIONS
─────────────────────────
- Convert missing codec variants with /normalize-audio
- 2 files at wrong sample rate — re-export from source at 48kHz
```

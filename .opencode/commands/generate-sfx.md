---
description: Generate a procedural sound effect using jsfxr. Writes a WAV file to assets/audio/generated/.
agent: build
---

When this skill is invoked:

## 1. Parse Arguments

```
/generate-sfx pickupCoin
/generate-sfx laserShoot --output assets/audio/sfx/laser.wav
/generate-sfx random
```

Available presets: pickupCoin, laserShoot, explosion, powerUp, hitHurt, jump, blip, random

If `--output` is provided, write to that path relative to project root.
If no `--output`, write to `assets/audio/generated/<preset>-<timestamp>.wav`.

## 2. Generate

Run:
```bash
npx tsx tools/audio-pipeline/src/sfxr.ts <preset> --output <output-path>
```

## 3. Report

Confirm the file was written:
- Path
- File size
- Playback hint: "Import this into your AudioManager manifest to play it."

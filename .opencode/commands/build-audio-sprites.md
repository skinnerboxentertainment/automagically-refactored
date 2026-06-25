---
description: Pack individual WAV files into an audio sprite atlas (single file + JSON manifest).
agent: build
---

When this skill is invoked:

## 1. Parse Arguments

```
/build-audio-sprites assets/audio/sfx/
```

Scans all `.wav` files in the given directory and packs them into:
- `assets/audio/sprites/sfx.webm` (primary)
- `assets/audio/sprites/sfx.ogg` (fallback)
- `assets/audio/sprites/sfx.json` (manifest)

## 2. Pack

For each WAV file, generate a sprite entry with start/end times and cue key
(derived from the filename without extension). Concatenate all files into
a single audio file and produce the manifest.

## 3. Update AudioManager

The generated manifest can be loaded directly:

```typescript
import sfxSprite from "../../assets/audio/sprites/sfx.json"
audioManager.loadManifest({ sprites: sfxSprite })
```

## 4. Guardrails

- Source WAVs should be normalized first (`/normalize-audio`)
- Rebuild sprites whenever source WAVs change
- Keep sprites under 5MB for fast loading

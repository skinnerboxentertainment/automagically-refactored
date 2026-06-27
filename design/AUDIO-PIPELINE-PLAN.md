# Audio Pipeline Integration Plan

## Overview

Add a complete browser game audio pipeline to AutoMagically Built Games: runtime library,
specialist agent, pipeline tools, procedural generation, and commands.

---

## 1. Runtime — Howler.js

`npm install howler`

Single dependency, MIT license. Wraps Web Audio API, handles autoplay policies,
codec fallback, audio sprites, spatial audio, global mixer.

**Gameplay wrapper** at `src/gameplay/audio/audio-manager.ts`:
- Singleton audio manager wrapping Howler
- Preload sprite manifests
- Play SFX, music, UI sounds by key
- Volume groups (SFX, music, voice, UI)
- Fade, crossfade, ducking

```
npm install howler @types/howler
```

---

## 2. Specialist Agent

**File:** `.opencode/agents/audio-specialist.md`

```
---
description: "Audio specialist — Howler.js, Web Audio API, procedural SFX generation, ffmpeg pipeline, adaptive music, loudness normalization, browser audio compatibility"
mode: subagent
model: opencode-go/deepseek-v4-flash
steps: 20
permission:
  read: allow
  glob: allow
  grep: allow
  edit: allow
  bash: allow
---

# Audio Specialist
```

Encoded knowledge areas:
- Howler.js API (Howl, Howler global, sprites, spatial)
- Web Audio API fundamentals (AudioContext, oscillators, envelopes, filters)
- Browser autoplay policies and workarounds
- Codec selection: WebM(Pro) primary, OGG fallback, MP3 legacy
- Loudness: LUFS normalization, peak limiting, dynamic range
- Audio sprites: packing, manifest format, loop points
- Adaptive music: layers, crossfade, horizontal/vertical resequencing
- ffmpeg: normalize, convert, trim, fade, concat, sprite packing
- jsfxr: procedural SFX generation (coin, laser, jump, hurt, UI)
- Directory structure conventions
- Accessibility: subtitle timing, mute policies, audio descriptions

---

## 3. Directory Structure

```
assets/audio/
  music/          -- Background music tracks
  sfx/            -- Sound effects
  ui/             -- UI click, hover, confirm sounds
  ambience/       -- Environmental audio
  voices/         -- Dialogue/voiceover
  generated/      -- Procedurally generated assets (gitignored)
  sprites/        -- Packed audio sprite atlases
```

---

## 4. Pipeline Tools

**Directory:** `tools/audio-pipeline/`

### `tools/audio-pipeline/package.json`

Standalone npm package with ffmpeg and jsfxr wrappers.

Dependencies: none at runtime (calls ffmpeg binary + jsfxr npm package).
Dev: typescript, @types/node.

### `tools/audio-pipeline/src/normalize.ts`

```
normalize(input: string, output: string, targetLUFS?: number): void
```

Calls ffmpeg:
```
ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 output.wav
```

### `tools/audio-pipeline/src/convert.ts`

```
convert(input: string, output: string, format: 'webm' | 'ogg' | 'mp3'): void
```

Calls ffmpeg with appropriate codec flags:
- WebM: `-c:a libopus -b:a 96k`
- OGG: `-c:a libvorbis -q:a 5`
- MP3: `-c:a libmp3lame -b:a 128k`

### `tools/audio-pipeline/src/sprite.ts`

```
buildSprite(files: SpriteEntry[], output: string): SpriteManifest
```

Packs multiple audio files into a single sprite atlas using ffmpeg.
Produces a JSON manifest with start/end times for each sound key.

### `tools/audio-pipeline/src/sfxr.ts`

```
generateSFX(params: SfxrParams): Buffer
```

Wraps jsfxr npm package for procedural SFX generation.
Presets: coin, laser, explosion, powerup, hit, jump, select, blip, random.

### `tools/audio-pipeline/src/index.ts` — barrel export

---

## 5. Commands

### `/generate-sfx`

```
/generate-sfx coin_pickup --preset coin --output assets/audio/generated/coin_pickup.wav
/generate-sfx laser_blast --frequency 800 --duration 0.3 --output assets/audio/generated/
```

Invokes the sfxr pipeline tool with presets or custom parameters.
Writes WAV to `assets/audio/generated/`.

### `/mix-check`

```
/mix-check assets/audio/
```

Scans `assets/audio/` recursively, checks:
- Sample rate consistency (target: 48kHz)
- Bit depth (target: 16 or 24-bit)
- Loudness range (LUFS)
- Missing codec variants (every WAV needs WebM + OGG)
- Reports violations

### `/build-audio-sprites`

```
/build-audio-sprites assets/audio/sfx/ --output assets/audio/sprites/sfx.json
```

Packs all WAVs in a directory into a single sprite atlas.
Outputs:
- `assets/audio/sprites/sfx.webm` — packed audio
- `assets/audio/sprites/sfx.ogg` — fallback codec
- `assets/audio/sprites/sfx.json` — manifest for Howler

### `/normalize-audio`

```
/normalize-audio assets/audio/sfx/
```

Batch-normalizes all WAVs in a directory to -16 LUFS.
Idempotent: skips files already at target.

---

## 6. Vite Plugin

**File:** `tools/vite-plugin-audio/index.ts`

Auto-converts WAV files imported in `assets/audio/` at build time:
```
src/gameplay/audio/audio-manager.ts
  ↓ imports
assets/audio/sprites/sfx.json
  ↓ vite-plugin-audio
  ↓ 1. Reads manifest
  ↓ 2. Copies .webm / .ogg / .mp3 to dist/assets/audio/
  ↓ 3. Writes optimized manifest
```

This keeps the raw WAV source files out of the bundle while ensuring
the correct codec variant is served at runtime.

---

## 7. Narrative Graph Extension

Add audio-specific node types to the core format (in `packages/narrative-core/`):

```typescript
// New: AudioManifestSchema
export const AudioCueSchema = z.object({
  id: z.string(),
  key: z.string(),
  type: z.enum(['sfx', 'music', 'ui', 'ambience', 'voice']),
  sprite: z.string().optional(),
  loops: z.boolean().default(false),
  volume: z.number().min(0).max(1).default(1),
  spatial: z.boolean().default(false),
  group: z.enum(['sfx', 'music', 'voice', 'ui']).default('sfx'),
})
```

This makes the graph format aware of audio dependencies — an SFX cue
references game states, and vice versa.

---

## 8. Implementation Order

| Step | What | Files | Est. |
|------|------|-------|------|
| 1 | Install Howler.js | `package.json` | 1 min |
| 2 | Create audio directory structure | `assets/audio/*/` | 1 min |
| 3 | Create audio-specialist.md | `.opencode/agents/audio-specialist.md` | 15 min |
| 4 | Create audio-pipeline tools | `tools/audio-pipeline/src/*.ts` | 45 min |
| 5 | Create audio manager wrapper | `src/gameplay/audio/audio-manager.ts` | 20 min |
| 6 | Create `/generate-sfx` command | `.opencode/commands/generate-sfx.md` | 15 min |
| 7 | Create `/mix-check` command | `.opencode/commands/mix-check.md` | 15 min |
| 8 | Create `/build-audio-sprites` command | `.opencode/commands/build-audio-sprites.md` | 15 min |
| 9 | Install jsfxr + test procedural gen | verify works | 10 min |
| 10 | Wire audio schema into narrative-core | `packages/narrative-core/src/schema.ts` | 10 min |
| 11 | Review + commit | — | 5 min |

**Total: ~2.5 hours**

---

## 9. What This Unlocks

- Agents can generate placeholder SFX during prototyping (`/generate-sfx jump`)
- Audio director agent enforces loudness, codec coverage, sprite packing
- No hand-editing audio assets for basic game feel
- Consistent pipeline from raw WAV → optimized runtime assets
- Graph-aware: game design documents can reference audio cues by ID


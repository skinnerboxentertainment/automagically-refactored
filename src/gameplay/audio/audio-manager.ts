import { Howl, Howler } from "howler"

export type AudioGroup = "sfx" | "music" | "voice" | "ui"

export interface AudioCue {
  key: string
  src: string | string[]
  group?: AudioGroup
  volume?: number
  loop?: boolean
  sprite?: Record<string, [number, number]>
}

export interface AudioManifest {
  sprites: AudioCue[]
}

export class AudioManager {
  private sounds: Map<string, Howl> = new Map()
  private groupVolumes: Record<AudioGroup, number> = {
    sfx: 1,
    music: 0.7,
    voice: 1,
    ui: 1,
  }
  private musicId: number | null = null

  loadManifest(manifest: AudioManifest): void {
    for (const cue of manifest.sprites) {
      const howl = new Howl({
        src: Array.isArray(cue.src) ? cue.src : [cue.src],
        volume: (cue.volume ?? 1) * this.groupVolumes[cue.group ?? "sfx"],
        loop: cue.loop ?? false,
        sprite: cue.sprite,
      })
      this.sounds.set(cue.key, howl)
    }
  }

  play(key: string, group?: AudioGroup): number | null {
    const sound = this.sounds.get(key)
    if (!sound) return null
    const g = group ?? "sfx"
    sound.volume((this.groupVolumes[g] ?? 1) * (sound.volume() ?? 1))
    return sound.play()
  }

  playMusic(key: string): void {
    this.stopMusic()
    const id = this.play(key, "music")
    if (id !== null) this.musicId = id
  }

  stopMusic(): void {
    if (this.musicId !== null) {
      const sound = this.sounds.get("music")
      sound?.stop()
      this.musicId = null
    }
  }

  setGroupVolume(group: AudioGroup, volume: number): void {
    this.groupVolumes[group] = Math.max(0, Math.min(1, volume))
  }

  muteAll(): void {
    Howler.mute(true)
  }

  unmuteAll(): void {
    Howler.mute(false)
  }

  unloadAll(): void {
    for (const [, sound] of this.sounds) {
      sound.unload()
    }
    this.sounds.clear()
    this.musicId = null
  }
}

export const audioManager = new AudioManager()

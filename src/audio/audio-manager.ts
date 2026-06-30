import { Howl } from "howler"
import { sfxr } from "jsfxr"
import type { IAudioManager } from "./audio-manager.interface"

type SfxKey = "flap" | "score" | "hit"

const PRESETS: Record<SfxKey, string> = {
  flap: "jump",
  score: "pickupCoin",
  hit: "hitHurt",
}

export class AudioManager implements IAudioManager {
  private _ready = false
  private _sfxVolume = 1.0
  private _muted = false
  private sounds: Partial<Record<SfxKey, Howl>> = {}

  init(): void {
    if (this._ready) return
    for (const [key, preset] of Object.entries(PRESETS)) {
      try {
        const params = sfxr.generate(preset)
        const riff = sfxr.toWave(params)
        this.sounds[key as SfxKey] = new Howl({
          src: [riff.dataURI],
          format: ["wav"],
          volume: this._sfxVolume,
          onloaderror: () => {},
          onplayerror: () => {},
        })
      } catch {
        // skip — sound just won't play
      }
    }
    this._ready = true
  }

  playMusic(_key: string): void {
    if (!this._ready) return
  }

  playSfx(key: string): void {
    if (!this._ready || this._muted) return
    const sound = this.sounds[key as SfxKey]
    if (sound) sound.play()
  }

  stopAll(): void {
    for (const sound of Object.values(this.sounds)) {
      if (sound) sound.stop()
    }
  }

  setMusicVolume(_v: number): void {}
  setSfxVolume(v: number): void {
    this._sfxVolume = v
    for (const sound of Object.values(this.sounds)) {
      if (sound) sound.volume(v)
    }
  }

  mute(): void { this._muted = true }
  unmute(): void { this._muted = false }
}

export const audioManager = new AudioManager()

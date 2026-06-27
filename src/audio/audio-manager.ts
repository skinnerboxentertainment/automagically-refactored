// Stub — overwritten by /auto-build with Howler.js implementation.
// TODO: Replace stubs with real Howl instances when audio assets are added.

import type { IAudioManager } from "./audio-manager.interface"

export class AudioManager implements IAudioManager {
  private _ready = false
  private _musicVolume = 0.7
  private _sfxVolume = 1.0
  private _muted = false

  init(): void {
    this._ready = true
  }

  playMusic(_key: string): void {
    if (!this._ready) return
    // TODO: new Howl({ src: [`assets/audio/music/${key}.mp3`], loop: true }).play()
  }

  playSfx(_key: string): void {
    if (!this._ready) return
    // TODO: new Howl({ src: [`assets/audio/sfx/${key}.mp3`] }).play()
  }

  stopAll(): void {
    // TODO: stop all active Howl instances
  }

  setMusicVolume(v: number): void { this._musicVolume = v }
  setSfxVolume(v: number): void { this._sfxVolume = v }

  mute(): void { this._muted = true }
  unmute(): void { this._muted = false }
}

export const audioManager = new AudioManager()

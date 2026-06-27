// Stub — overwritten by /auto-build.

export interface IAudioManager {
  init(): void
  playMusic(key: string): void
  playSfx(key: string): void
  stopAll(): void
  setMusicVolume(v: number): void
  setSfxVolume(v: number): void
  mute(): void
  unmute(): void
}

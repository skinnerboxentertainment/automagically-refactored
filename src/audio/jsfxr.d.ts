declare module "jsfxr" {
  export interface SfxrParams {
    [key: string]: number | string | string[] | undefined
  }

  export interface RiffWave {
    wav: number[]
    dataURI: string
    header: Record<string, number | number[]>
  }

  export const sfxr: {
    generate(preset: string, options?: { sound_vol?: number; sample_rate?: number; sample_size?: number }): SfxrParams
    toWave(params: SfxrParams): RiffWave
  }
}

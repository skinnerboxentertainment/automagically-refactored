// Stub — overwritten by /auto-build.
// Reads assets/data/gameplay-config.json and provides typed access.

export interface GameplayConfig {
  player_speed: number
  player_jump_velocity: number
  player_gravity: number
  player_health: number
  invincibility_frames: number
  score_per_gem: number
  enemy_health: number
  tile_size: number
  max_fall_speed: number
}

let _config: GameplayConfig | null = null

export async function loadConfig(): Promise<GameplayConfig> {
  if (_config) return _config
  try {
    const resp = await fetch("assets/data/gameplay-config.json")
    _config = await resp.json() as GameplayConfig
  } catch {
    _config = {
      player_speed: 250,
      player_jump_velocity: -500,
      player_gravity: 980,
      player_health: 3,
      invincibility_frames: 1.5,
      score_per_gem: 100,
      enemy_health: 1,
      tile_size: 32,
      max_fall_speed: 600,
    }
  }
  return _config
}

export function getConfig(): GameplayConfig {
  if (!_config) throw new Error("Config not loaded — call loadConfig() first")
  return _config
}

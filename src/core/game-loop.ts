// Stub — overwritten by /auto-build.

import { InputManager } from "./input-manager"
import { SceneManager } from "./scene-manager"

export class GameLoop {
  constructor(
    private inputManager: InputManager,
    private sceneManager: SceneManager,
  ) {}

  update(dt: number): void {
    this.inputManager.update()
    this.sceneManager.update(dt)
  }
}

// Stub — overwritten by /auto-build.

import { Container } from "pixi.js"
import type { Scene } from "./types"

export class SceneManager {
  private stack: Scene[] = []

  constructor(_stage: Container) {}

  push(scene: Scene): void {
    this.stack.push(scene)
    scene.enter()
  }

  pop(): void {
    const scene = this.stack.pop()
    if (scene) scene.exit()
  }

  replace(scene: Scene): void {
    const current = this.stack.pop()
    if (current) current.exit()
    this.stack.push(scene)
    scene.enter()
  }

  update(dt: number): void {
    const current = this.stack[this.stack.length - 1]
    if (current) current.update(dt)
  }
}

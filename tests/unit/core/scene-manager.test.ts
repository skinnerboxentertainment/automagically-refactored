import { describe, it, expect, beforeEach, vi } from "vitest"
import { Container } from "pixi.js"
import { SceneManager } from "../../../src/core/scene-manager"
import type { Scene } from "../../../src/core/types"

describe("SceneManager", () => {
  let manager: SceneManager
  let stage: Container

  beforeEach(() => {
    stage = new Container()
    manager = new SceneManager(stage)
  })

  it("test_scene_pushCallsEnter", () => {
    const scene: Scene = { enter: vi.fn(), update: vi.fn(), exit: vi.fn() }
    manager.push(scene)
    expect(scene.enter).toHaveBeenCalledTimes(1)
  })

  it("test_scene_popCallsExit", () => {
    const scene: Scene = { enter: vi.fn(), update: vi.fn(), exit: vi.fn() }
    manager.push(scene)
    manager.pop()
    expect(scene.exit).toHaveBeenCalledTimes(1)
  })

  it("test_scene_replaceCallsExitAndEnter", () => {
    const oldScene: Scene = { enter: vi.fn(), update: vi.fn(), exit: vi.fn() }
    const newScene: Scene = { enter: vi.fn(), update: vi.fn(), exit: vi.fn() }
    manager.push(oldScene)
    manager.replace(newScene)
    expect(oldScene.exit).toHaveBeenCalledTimes(1)
    expect(newScene.enter).toHaveBeenCalledTimes(1)
  })

  it("test_scene_updateCallsTopSceneUpdate", () => {
    const scene: Scene = { enter: vi.fn(), update: vi.fn(), exit: vi.fn() }
    manager.push(scene)
    manager.update(1.0)
    expect(scene.update).toHaveBeenCalledWith(1.0)
  })

  it("test_scene_pushPausesCurrentScene", () => {
    const first: Scene = { enter: vi.fn(), update: vi.fn(), exit: vi.fn() }
    const second: Scene = { enter: vi.fn(), update: vi.fn(), exit: vi.fn() }
    manager.push(first)
    manager.push(second)
    manager.update(1.0)
    expect(first.update).not.toHaveBeenCalled()
    expect(second.update).toHaveBeenCalled()
  })
})

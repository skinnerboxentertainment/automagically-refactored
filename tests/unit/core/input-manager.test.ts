import { describe, it, expect, beforeEach, vi } from "vitest"
import { InputManager } from "../../../src/core/input-manager"

describe("InputManager", () => {
  let manager: InputManager

  beforeEach(() => {
    manager = new InputManager()
  })

  it("test_input_clearOnBlur_clearsKeys", () => {
    manager.keys.add("Space")
    window.dispatchEvent(new Event("blur"))
    expect(manager.keys.has("Space")).toBe(false)
  })

  it("test_input_tracksKeysJustPressed", () => {
    const event = new KeyboardEvent("keydown", { code: "Space" })
    window.dispatchEvent(event)
    manager.update()
    expect(manager.keysJustPressed.has("Space")).toBe(true)
    manager.update()
    expect(manager.keysJustPressed.has("Space")).toBe(false)
  })

  it("test_input_mouseStateTracksPosition", () => {
    const event = new MouseEvent("mousemove", { clientX: 100, clientY: 200 })
    window.dispatchEvent(event)
    expect(manager.mouse.x).toBe(100)
    expect(manager.mouse.y).toBe(200)
  })

  it("test_input_destroy_removesHandlers", () => {
    manager.destroy()
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }))
    expect(manager.keys.has("Space")).toBe(false)
  })
})

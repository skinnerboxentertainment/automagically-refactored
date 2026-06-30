export class InputManager {
  readonly keys = new Set<string>()
  readonly keysJustPressed = new Set<string>()
  readonly mouse = { x: 0, y: 0, left: false, leftClicked: false }

  private prevKeys = new Set<string>()
  private clickPending = false
  private handlers: (() => void)[] = []

  constructor() {
    const onKeyDown = (e: KeyboardEvent) => {
      this.keys.add(e.code)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      this.keys.delete(e.code)
    }
    const onMouseMove = (e: MouseEvent) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    }
    const onMouseDown = () => {
      this.mouse.left = true
      this.clickPending = true
    }
    const onMouseUp = (e: MouseEvent) => {
      this.mouse.left = e.buttons === 1
    }
    const onBlur = () => {
      this.keys.clear()
      this.mouse.left = false
      this.clickPending = false
      this.mouse.leftClicked = false
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("blur", onBlur)
    this.handlers = [
      () => window.removeEventListener("keydown", onKeyDown),
      () => window.removeEventListener("keyup", onKeyUp),
      () => window.removeEventListener("mousemove", onMouseMove),
      () => window.removeEventListener("mousedown", onMouseDown),
      () => window.removeEventListener("mouseup", onMouseUp),
      () => window.removeEventListener("blur", onBlur),
    ]
  }

  update(): void {
    this.keysJustPressed.clear()
    for (const k of this.keys) {
      if (!this.prevKeys.has(k)) this.keysJustPressed.add(k)
    }
    this.prevKeys = new Set(this.keys)
    this.mouse.leftClicked = this.clickPending
    this.clickPending = false
  }

  destroy(): void {
    for (const h of this.handlers) h()
  }
}

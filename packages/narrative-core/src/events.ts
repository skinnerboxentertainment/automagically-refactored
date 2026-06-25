export interface ExecutionEvent {
  eventId: string
  payload: Record<string, unknown>
  context: { sceneId?: string; timestamp: number }
}

type EventListener = (event: ExecutionEvent) => void

class NarrativeEventBus {
  private listeners: Record<string, EventListener[]> = {}

  subscribe(eventId: string, handler: EventListener): () => void {
    if (!this.listeners[eventId]) {
      this.listeners[eventId] = []
    }
    this.listeners[eventId].push(handler)

    return () => {
      this.listeners[eventId] = this.listeners[eventId].filter((h) => h !== handler)
    }
  }

  publish(event: ExecutionEvent) {
    console.log(`[EventBus] Publishing ${event.eventId}`, event.payload)

    if (this.listeners[event.eventId]) {
      this.listeners[event.eventId].forEach((h) => h(event))
    }

    if (this.listeners["*"]) {
      this.listeners["*"].forEach((h) => h(event))
    }
  }
}

export const eventBus = new NarrativeEventBus()

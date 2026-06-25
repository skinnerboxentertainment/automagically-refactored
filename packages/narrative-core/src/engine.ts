import type { NarrativeDocumentV2, Transition, Condition, Mutation } from "./types"
import { eventBus } from "./events"

export interface VirtualMachineState {
  currentNodeId: string
  variables: Record<string, unknown>
  history: string[]
}

export class NarrativeEngine {
  private document: NarrativeDocumentV2

  constructor(document: NarrativeDocumentV2) {
    this.document = document
  }

  public updateDocument(document: NarrativeDocumentV2) {
    this.document = document
  }

  public getStartNodeId(): string {
    return this.document.runtime.config.startNodeId
  }

  public initializeState(): VirtualMachineState {
    const vars: Record<string, unknown> = {}
    Object.values(this.document.environment.variables).forEach((v) => {
      vars[v.id] = v.defaultValue
    })

    return {
      currentNodeId: this.document.runtime.config.startNodeId,
      variables: vars,
      history: [this.document.runtime.config.startNodeId],
    }
  }

  public getCurrentScene(state: VirtualMachineState) {
    const node = this.document.topology.nodes[state.currentNodeId]
    if (!node) return null
    return this.document.content.scenes[node.sceneId]
  }

  public getAvailableTransitions(state: VirtualMachineState): Transition[] {
    const outgoing = Object.values(this.document.topology.transitions).filter(
      (t) => t.source === state.currentNodeId
    )
    return outgoing.filter((t) => this.evaluateConditions(t.conditions, state.variables))
  }

  public takeTransition(state: VirtualMachineState, transitionId: string): VirtualMachineState {
    const transition = this.document.topology.transitions[transitionId]
    if (!transition || transition.source !== state.currentNodeId) {
      throw new Error(`Invalid transition ${transitionId}`)
    }

    const nextVariables = { ...state.variables }
    transition.mutations.forEach((m) => this.applyMutation(m, nextVariables))

    const sceneId = this.document.topology.nodes[state.currentNodeId]?.sceneId
    transition.events.forEach((e) => {
      eventBus.publish({
        eventId: e.eventId,
        payload: e.payload,
        context: { sceneId, timestamp: Date.now() },
      })
    })

    return {
      currentNodeId: transition.target,
      variables: nextVariables,
      history: [...state.history, transition.target],
    }
  }

  public interpolateText(text: string, variables: Record<string, unknown>): string {
    return text.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
      let current: unknown = variables
      const parts = path.trim().split(".")
      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = (current as Record<string, unknown>)[part]
        } else {
          current = undefined
          break
        }
      }
      return current !== undefined && current !== null ? String(current) : ""
    })
  }

  private evaluateConditions(conditions: Condition[], variables: Record<string, unknown>): boolean {
    for (const cond of conditions) {
      const actual = variables[cond.variableId]
      if (!this.evaluateCondition(actual, cond.operator, cond.value)) {
        return false
      }
    }
    return true
  }

  private evaluateCondition(actual: unknown, operator: string, expected: unknown): boolean {
    if (operator === "==" || operator === "=") return actual === expected
    if (operator === "!=") return actual !== expected
    if (operator === ">") return (actual as number) > (expected as number)
    if (operator === "<") return (actual as number) < (expected as number)
    if (operator === ">=") return (actual as number) >= (expected as number)
    if (operator === "<=") return (actual as number) <= (expected as number)
    return false
  }

  private applyMutation(mutation: Mutation, variables: Record<string, unknown>) {
    const current = variables[mutation.variableId]
    const value = mutation.value

    switch (mutation.operator) {
      case "=":
      case "==":
        variables[mutation.variableId] = value
        break
      case "+=":
        if (typeof current === "number" && typeof value === "number") {
          variables[mutation.variableId] = current + value
        } else if (typeof current === "string" && typeof value === "string") {
          variables[mutation.variableId] = current + value
        }
        break
      case "-=":
        if (typeof current === "number" && typeof value === "number") {
          variables[mutation.variableId] = current - value
        }
        break
    }
  }
}

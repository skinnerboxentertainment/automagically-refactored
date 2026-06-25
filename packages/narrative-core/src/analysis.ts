import type { NarrativeDocumentV2 } from "./types"

export type AnalysisResult = {
  unreachableNodes: string[]
  orphanNodes: string[]
  deadEnds: string[]
  brokenSceneRefs: string[]
  brokenTransitionRefs: string[]
}

export function analyzeDocument(document: NarrativeDocumentV2): AnalysisResult {
  const result: AnalysisResult = {
    unreachableNodes: [],
    orphanNodes: [],
    deadEnds: [],
    brokenSceneRefs: [],
    brokenTransitionRefs: [],
  }

  const startNodeId = document.runtime.config.startNodeId
  const nodes = document.topology.nodes
  const transitions = document.topology.transitions
  const scenes = document.content.scenes

  const nodeIds = Object.keys(nodes)

  const outgoingMap = new Map<string, string[]>()
  const incomingMap = new Map<string, string[]>()

  for (const t of Object.values(transitions)) {
    if (!nodes[t.source] || !nodes[t.target]) {
      result.brokenTransitionRefs.push(t.id)
    }

    let out = outgoingMap.get(t.source)
    if (!out) {
      out = []
      outgoingMap.set(t.source, out)
    }
    out.push(t.target)

    let inc = incomingMap.get(t.target)
    if (!inc) {
      inc = []
      incomingMap.set(t.target, inc)
    }
    inc.push(t.source)
  }

  const visited = new Set<string>()
  const queue = startNodeId && nodes[startNodeId] ? [startNodeId] : []

  while (queue.length > 0) {
    const currentId = queue.shift()!
    if (!visited.has(currentId)) {
      visited.add(currentId)

      const outgoing = outgoingMap.get(currentId) || []
      for (const target of outgoing) {
        if (nodes[target] && !visited.has(target)) {
          queue.push(target)
        }
      }
    }
  }

  for (const nodeId of nodeIds) {
    const node = nodes[nodeId]
    const scene = scenes[node.sceneId]

    if (!visited.has(nodeId)) {
      result.unreachableNodes.push(nodeId)
    }

    const incomingCount = incomingMap.get(nodeId)?.length || 0
    const outgoingCount = outgoingMap.get(nodeId)?.length || 0

    if (incomingCount === 0 && outgoingCount === 0 && nodeId !== startNodeId) {
      result.orphanNodes.push(nodeId)
    }

    if (outgoingCount === 0) {
      if (!scene || !scene.isEnding) {
        result.deadEnds.push(nodeId)
      }
    }

    if (!scene) {
      result.brokenSceneRefs.push(nodeId)
    }
  }

  return result
}

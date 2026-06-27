// Stub — overwritten by /auto-build.
// Collects NarrativeDocument declarations from all systems at runtime.
// Enables live graph visualization via tools/graph-viewer/.

export interface GraphDeclaration {
  systemId: string
  metadata: Record<string, unknown>
  topology: Record<string, unknown>
  environment: Record<string, unknown>
}

class GraphRegistryImpl {
  private declarations: GraphDeclaration[] = []

  register(systemId: string, doc: Record<string, unknown>): void {
    this.declarations.push({
      systemId,
      metadata: doc.metadata as Record<string, unknown> || {},
      topology: doc.topology as Record<string, unknown> || {},
      environment: doc.environment as Record<string, unknown> || {},
    })
  }

  exportJSON(): Record<string, unknown> {
    return {
      metadata: { id: "combined", title: "Combined Game Graph", version: "2.0.0", createdAt: new Date().toISOString(), modifiedAt: new Date().toISOString() },
      content: { scenes: {}, arcs: {} },
      topology: { nodes: {}, transitions: {} },
      environment: { variables: {}, events: {} },
      presentation: { scenes: {}, characters: {}, themes: {}, cinematics: {} },
      runtime: { config: { startNodeId: "" } },
      editor: {},
      audio: { cues: {} },
      plugins: { registry: {}, state: {} },
      _systems: this.declarations,
    }
  }
}

export const GraphRegistry = new GraphRegistryImpl()

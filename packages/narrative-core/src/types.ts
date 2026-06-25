import type { z } from "zod"
import * as schemas from "./schema"

export type Operator = z.infer<typeof schemas.OperatorSchema>

export type MetadataLayer = z.infer<typeof schemas.MetadataSchema>

export type ContentBlock =
  | z.infer<typeof schemas.ParagraphBlockSchema>
  | z.infer<typeof schemas.DialogueBlockSchema>
  | z.infer<typeof schemas.ActionBlockSchema>
  | z.infer<typeof schemas.ImageBlockSchema>

export type SceneContent = Omit<z.infer<typeof schemas.SceneContentSchema>, "blocks"> & {
  blocks: ContentBlock[]
}

export type StoryArc = z.infer<typeof schemas.StoryArcSchema>
export type ContentLayer = Omit<z.infer<typeof schemas.ContentLayerSchema>, "scenes"> & {
  scenes: Record<string, SceneContent>
}

export type TopologyNode = z.infer<typeof schemas.TopologyNodeSchema>
export type Condition = z.infer<typeof schemas.ConditionSchema>
export type Mutation = z.infer<typeof schemas.MutationSchema>
export type EventTrigger = z.infer<typeof schemas.EventTriggerSchema>
export type Transition = z.infer<typeof schemas.TransitionSchema>
export type TopologyLayer = z.infer<typeof schemas.TopologyLayerSchema>

export type VariableDefinition = z.infer<typeof schemas.VariableDefinitionSchema>
export type EventDefinition = z.infer<typeof schemas.EventDefinitionSchema>
export type EnvironmentLayer = z.infer<typeof schemas.EnvironmentLayerSchema>

export type CharacterPresentation = z.infer<typeof schemas.CharacterPresentationSchema>
export type ScenePresentation = z.infer<typeof schemas.ScenePresentationSchema>
export type PresentationLayer = z.infer<typeof schemas.PresentationLayerSchema>

export type RuntimeConfig = z.infer<typeof schemas.RuntimeConfigSchema>
export type RuntimeLayer = z.infer<typeof schemas.RuntimeLayerSchema>

export type NodePosition = z.infer<typeof schemas.NodePositionSchema>
export type EditorGroup = z.infer<typeof schemas.EditorGroupSchema>
export type EditorLayer = z.infer<typeof schemas.EditorLayerSchema>

export type PluginMetadata = z.infer<typeof schemas.PluginMetadataSchema>
export type PluginLayer = z.infer<typeof schemas.PluginLayerSchema>

export interface NarrativeDocumentV2 {
  metadata: MetadataLayer
  content: ContentLayer
  topology: TopologyLayer
  environment: EnvironmentLayer
  presentation: PresentationLayer
  runtime: RuntimeLayer
  editor: EditorLayer
  plugins: PluginLayer
}

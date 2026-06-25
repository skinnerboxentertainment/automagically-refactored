import { z } from "zod"

export const OperatorSchema = z.enum(["==", "!=", ">", "<", ">=", "<=", "=", "+=", "-="])

// --- Metadata ---
export const MetadataSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  description: z.string().optional(),
  version: z.literal("2.0.0"),
  createdAt: z.string(),
  modifiedAt: z.string(),
  tags: z.array(z.string()).default([]),
})

// --- Content ---
export const ContentBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  payload: z.record(z.string(), z.unknown()),
})

export const ParagraphBlockSchema = ContentBlockSchema.extend({
  type: z.literal("paragraph"),
  payload: z.object({ text: z.string() }),
})

export const DialogueBlockSchema = ContentBlockSchema.extend({
  type: z.literal("dialogue"),
  payload: z.object({ characterId: z.string(), text: z.string(), audioVariantId: z.string().optional() }),
})

export const ActionBlockSchema = ContentBlockSchema.extend({
  type: z.literal("action"),
  payload: z.object({ text: z.string() }),
})

export const ImageBlockSchema = ContentBlockSchema.extend({
  type: z.literal("image"),
  payload: z.object({ url: z.string(), alt: z.string().optional() }),
})

export const SceneContentSchema = z.object({
  id: z.string(),
  title: z.string(),
  blocks: z.array(ContentBlockSchema),
  summary: z.string().optional(),
  notes: z.string().optional(),
  isEnding: z.boolean().optional(),
})

export const StoryArcSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  nodeIds: z.array(z.string()),
})

export const ContentLayerSchema = z.object({
  scenes: z.record(z.string(), SceneContentSchema),
  arcs: z.record(z.string(), StoryArcSchema).default({}),
})

// --- Topology ---
export const TopologyNodeSchema = z.object({
  id: z.string(),
  sceneId: z.string(),
  arcId: z.string().optional(),
})

export const ConditionSchema = z.object({
  variableId: z.string(),
  operator: OperatorSchema,
  value: z.unknown(),
})

export const MutationSchema = z.object({
  variableId: z.string(),
  operator: OperatorSchema,
  value: z.unknown(),
})

export const EventTriggerSchema = z.object({
  eventId: z.string(),
  payload: z.record(z.string(), z.unknown()).default({}),
})

export const TransitionSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string(),
  conditions: z.array(ConditionSchema).default([]),
  mutations: z.array(MutationSchema).default([]),
  events: z.array(EventTriggerSchema).default([]),
})

export const TopologyLayerSchema = z.object({
  nodes: z.record(z.string(), TopologyNodeSchema),
  transitions: z.record(z.string(), TransitionSchema),
})

// --- Environment ---
export const VariableDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["number", "string", "boolean", "enum"]),
  defaultValue: z.unknown(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  scope: z.enum(["global", "local", "session"]),
})

export const EventDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  payloadSchema: z.record(z.string(), z.unknown()).optional(),
})

export const EnvironmentLayerSchema = z.object({
  variables: z.record(z.string(), VariableDefinitionSchema),
  events: z.record(z.string(), EventDefinitionSchema).default({}),
})

// --- Presentation ---
export const CharacterPresentationSchema = z.object({
  id: z.string(),
  name: z.string(),
  portraits: z.record(z.string(), z.string()).default({}),
  voiceProfile: z.string().optional(),
  themeColor: z.string().optional(),
})

export const ScenePresentationSchema = z.object({
  backgroundUrl: z.string().optional(),
  audioTrackUrl: z.string().optional(),
})

export const PresentationLayerSchema = z.object({
  scenes: z.record(z.string(), ScenePresentationSchema).default({}),
  characters: z.record(z.string(), CharacterPresentationSchema).default({}),
  themes: z.record(z.string(), z.unknown()).default({}),
  cinematics: z.record(z.string(), z.unknown()).default({}),
})

// --- Runtime ---
export const RuntimeConfigSchema = z.object({
  startNodeId: z.string(),
  supportedEngineVersions: z.string().default("1.x"),
  flags: z.record(z.string(), z.boolean()).default({}),
})

export const RuntimeLayerSchema = z.object({
  config: RuntimeConfigSchema,
})

// --- Editor ---
export const NodePositionSchema = z.object({
  x: z.number(),
  y: z.number(),
})

export const EditorGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  nodes: z.array(z.string()),
  position: NodePositionSchema,
  dimensions: z.object({ width: z.number(), height: z.number() }).optional(),
  color: z.string().optional(),
})

export const EditorLayerSchema = z.object({
  viewport: z.object({ x: z.number(), y: z.number(), zoom: z.number() }).default({ x: 0, y: 0, zoom: 1 }),
  nodePositions: z.record(z.string(), NodePositionSchema).default({}),
  groups: z.record(z.string(), EditorGroupSchema).default({}),
})

// --- Plugins ---
export const PluginMetadataSchema = z.object({
  id: z.string(),
  version: z.string(),
  enabled: z.boolean(),
  permissions: z.array(z.string()),
})

export const PluginLayerSchema = z.object({
  registry: z.record(z.string(), PluginMetadataSchema).default({}),
  state: z.record(z.string(), z.unknown()).default({}),
})

// --- Root ---
export const NarrativeDocumentV2Schema = z.object({
  metadata: MetadataSchema,
  content: ContentLayerSchema,
  topology: TopologyLayerSchema,
  environment: EnvironmentLayerSchema,
  presentation: PresentationLayerSchema,
  runtime: RuntimeLayerSchema,
  editor: EditorLayerSchema,
  plugins: PluginLayerSchema,
})

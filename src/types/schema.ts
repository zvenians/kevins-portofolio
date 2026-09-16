import { z } from "zod";

// Base entity identity
export const BaseEntitySchema = z.object({
  id: z.string(),
  schemaVersion: z.number().default(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// Publishable extension
export const PublishableSchema = z.object({
  published: z.boolean().default(false),
  archived: z.boolean().default(false),
  publishedAt: z.coerce.date().optional(),
});

// Orderable extension
export const OrderableSchema = z.object({
  order: z.number().default(0),
});

// MediaAsset
export const MediaAssetSchema = z.object({
  id: z.string(),
  type: z.enum(["image", "video", "document", "embed"]),
  url: z.string().url(),
  storagePath: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  posterUrl: z.string().url().optional(),
  focalPoint: z.object({ x: z.number(), y: z.number() }).optional(),
  contentType: z.string().optional(),
  sizeBytes: z.number().optional(),
  credit: z.string().optional(),
  createdAt: z.coerce.date(),
});
export type MediaAsset = z.infer<typeof MediaAssetSchema>;

// Technology
export const TechnologySchema = BaseEntitySchema.merge(OrderableSchema).extend({
  slug: z.string(),
  name: z.string(),
  category: z.string().optional(),
  icon: MediaAssetSchema.optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  archived: z.boolean().default(false),
});
export type Technology = z.infer<typeof TechnologySchema>;

// Project Technology Reference
export const ProjectTechnologySchema = z.object({
  technologyId: z.string(),
  role: z.string().optional(),
});

// Content Blocks
export const ContentAlignmentSchema = z.enum(["left", "center", "right"]);
export const ContentWidthSchema = z.enum(["narrow", "medium", "wide", "full"]);

export const TextBlockSchema = z.object({
  id: z.string(),
  type: z.literal("text"),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  body: z.string(),
  alignment: ContentAlignmentSchema.optional(),
  width: ContentWidthSchema.optional(),
});

export const ImageBlockSchema = z.object({
  id: z.string(),
  type: z.literal("image"),
  media: MediaAssetSchema,
  size: z.enum(["small", "medium", "large", "full"]).optional(),
  caption: z.string().optional(),
  fullBleed: z.boolean().optional(),
});

export const VideoBlockSchema = z.object({
  id: z.string(),
  type: z.literal("video"),
  media: MediaAssetSchema,
  autoplay: z.boolean().optional(),
  muted: z.boolean().optional(),
  loop: z.boolean().optional(),
  controls: z.boolean().optional(),
  poster: MediaAssetSchema.optional(),
  caption: z.string().optional(),
});

export const GalleryBlockSchema = z.object({
  id: z.string(),
  type: z.literal("gallery"),
  items: z.array(MediaAssetSchema),
  layout: z.enum(["grid", "carousel", "masonry", "list"]).optional(),
  caption: z.string().optional(),
});

export const QuoteBlockSchema = z.object({
  id: z.string(),
  type: z.literal("quote"),
  quote: z.string(),
  author: z.string().optional(),
  role: z.string().optional(),
});

export const MetricItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  description: z.string().optional(),
});

export const MetricsBlockSchema = z.object({
  id: z.string(),
  type: z.literal("metrics"),
  items: z.array(MetricItemSchema),
});

export const ProcessStepSchema = z.object({
  number: z.number().optional(),
  title: z.string(),
  description: z.string(),
  media: MediaAssetSchema.optional(),
});

export const ProcessBlockSchema = z.object({
  id: z.string(),
  type: z.literal("process"),
  title: z.string().optional(),
  steps: z.array(ProcessStepSchema),
});

export const TimelineItemSchema = z.object({
  date: z.string(),
  title: z.string(),
  description: z.string(),
  media: MediaAssetSchema.optional(),
});

export const TimelineBlockSchema = z.object({
  id: z.string(),
  type: z.literal("timeline"),
  title: z.string().optional(),
  items: z.array(TimelineItemSchema),
});

export const CodeBlockSchema = z.object({
  id: z.string(),
  type: z.literal("code"),
  language: z.string(),
  code: z.string(),
  filename: z.string().optional(),
  description: z.string().optional(),
});

export const EmbedProviderSchema = z.enum(["youtube", "vimeo", "figma", "github", "custom"]);

export const EmbedBlockSchema = z.object({
  id: z.string(),
  type: z.literal("embed"),
  provider: EmbedProviderSchema,
  url: z.string().url(),
  title: z.string().optional(),
});

export const ComparisonBlockSchema = z.object({
  id: z.string(),
  type: z.literal("comparison"),
  before: z.object({
    label: z.string().optional(),
    description: z.string().optional(),
    media: MediaAssetSchema,
  }),
  after: z.object({
    label: z.string().optional(),
    description: z.string().optional(),
    media: MediaAssetSchema,
  }),
});

export const SpacerBlockSchema = z.object({
  id: z.string(),
  type: z.literal("spacer"),
  size: z.enum(["small", "medium", "large"]),
});

export const ContentBlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  ImageBlockSchema,
  VideoBlockSchema,
  GalleryBlockSchema,
  QuoteBlockSchema,
  MetricsBlockSchema,
  ProcessBlockSchema,
  TimelineBlockSchema,
  CodeBlockSchema,
  EmbedBlockSchema,
  ComparisonBlockSchema,
  SpacerBlockSchema,
]);
export type ContentBlock = z.infer<typeof ContentBlockSchema>;

// Project
export const ProjectSchema = BaseEntitySchema.merge(PublishableSchema).merge(OrderableSchema).extend({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  category: z.string().optional(),
  year: z.number().optional(),
  status: z.enum(["concept", "active", "completed", "archived"]).optional(),
  featured: z.boolean().default(false),
  role: z.string().optional(),
  duration: z.string().optional(),
  cover: MediaAssetSchema.optional(),
  technologies: z.array(ProjectTechnologySchema).optional(),
  content: z.array(ContentBlockSchema).default([]),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ExperienceSchema = BaseEntitySchema.merge(OrderableSchema).extend({
  title: z.string(),
  company: z.string(),
  companyUrl: z.string().url().optional(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  archived: z.boolean().default(false),
});
export type Experience = z.infer<typeof ExperienceSchema>;

export const ExperimentSchema = BaseEntitySchema.merge(PublishableSchema).merge(OrderableSchema).extend({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  cover: MediaAssetSchema.optional(),
  link: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  date: z.string().optional(),
  featured: z.boolean().default(false),
});
export type Experiment = z.infer<typeof ExperimentSchema>;


export const MessageStatusSchema = z.enum(['unread', 'read', 'archived']);

export const MessageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(150, 'Email is too long'),
  subject: z.string().max(200, 'Subject is too long').optional(),
  message: z.string().min(5, 'Message is too short').max(5000, 'Message is too long'),
  status: MessageStatusSchema.default('unread'),
  createdAt: z.coerce.date(),
});
export type Message = z.infer<typeof MessageSchema>;

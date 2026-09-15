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

export const ContentBlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  ImageBlockSchema,
  VideoBlockSchema,
  // Other blocks can be added here
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

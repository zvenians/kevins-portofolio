import { z } from "zod";
import { MediaAssetSchema } from "./schema";

export const SEODataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: MediaAssetSchema.optional(),
  keywords: z.array(z.string()).optional(),
});
export type SEOData = z.infer<typeof SEODataSchema>;

export const ResumeDataSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  file: MediaAssetSchema,
  version: z.string().optional(),
  updatedAt: z.coerce.date(),
});
export type ResumeData = z.infer<typeof ResumeDataSchema>;

export const SiteSettingsSchema = z.object({
  id: z.string().default("global"),
  schemaVersion: z.number().default(1),
  siteName: z.string(),
  siteTitle: z.string().optional(),
  tagline: z.string().optional(),
  shortBio: z.string().optional(),
  bio: z.string().optional(),
  profileImage: MediaAssetSchema.optional(),
  resume: ResumeDataSchema.optional(),
  email: z.string().email().optional(),
  location: z.string().optional(),
  availability: z.string().optional(),
  socialLinks: z.array(z.string()).optional(),
  defaultSeo: SEODataSchema.optional(),
  updatedAt: z.coerce.date(),
});
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;

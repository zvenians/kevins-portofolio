import { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/firestore/projects";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const projects = await getPublishedProjects();

    const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      // Use updatedAt as the primary last modified, fallback to publishedAt or createdAt
      lastModified: project.updatedAt || project.publishedAt || project.createdAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [...routes, ...projectRoutes];
  } catch (error) {
    console.error("Failed to generate sitemap for projects:", error);
    // Gracefully fallback to base routes
    return routes;
  }
}

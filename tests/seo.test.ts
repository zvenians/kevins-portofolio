import { describe, it, expect } from "vitest";
import { SITE_URL } from "@/lib/constants";
import { type Project } from "@/types/schema";

// Helper for generating canonical URLs
function generateCanonicalUrl(slug: string): string {
  return `${SITE_URL}/projects/${slug}`;
}

// Helper for generating JSON-LD
function generateStructuredData(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    url: generateCanonicalUrl(project.slug),
    ...(project.cover?.url && { image: project.cover.url }),
    ...(project.publishedAt && { datePublished: project.publishedAt.toISOString() }),
    ...(project.updatedAt && { dateModified: project.updatedAt.toISOString() }),
  };
}

describe("SEO Helpers", () => {
  const mockProject: Project = {
    id: "proj-1",
    slug: "test-project",
    title: "Test Project",
    description: "A test description",
    published: true,
    archived: false,
    featured: true,
    order: 0,
    schemaVersion: 1,
    content: [],
    publishedAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-02T00:00:00Z"),
    createdAt: new Date("2023-12-01T00:00:00Z"),
  };

  it("canonical URL generation uses correct production domain", () => {
    expect(generateCanonicalUrl("test-project")).toBe("https://kevins-portofolio.vercel.app/projects/test-project");
  });

  it("structured data generation emits valid schema.org Article format", () => {
    const jsonLd = generateStructuredData(mockProject);
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Article");
    expect(jsonLd.headline).toBe("Test Project");
    expect(jsonLd.description).toBe("A test description");
    expect(jsonLd.url).toBe("https://kevins-portofolio.vercel.app/projects/test-project");
    expect(jsonLd.datePublished).toBe("2024-01-01T00:00:00.000Z");
    expect(jsonLd.dateModified).toBe("2024-01-02T00:00:00.000Z");
  });

  it("structured data omits optional fields if missing", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { publishedAt, updatedAt, ...rest } = mockProject;
    const minProject = rest as Project;
    const jsonLd = generateStructuredData(minProject);
    expect(jsonLd).not.toHaveProperty("datePublished");
    expect(jsonLd).not.toHaveProperty("dateModified");
    expect(jsonLd).not.toHaveProperty("image");
  });

  it("structured data includes cover image if present", () => {
    const imgProject: Project = {
      ...mockProject,
      cover: {
        id: "img-1",
        url: "https://example.com/img.jpg",
        type: "image",
        storagePath: "projects/proj-1/img.jpg",
        createdAt: new Date(),
      },
    };
    const jsonLd = generateStructuredData(imgProject);
    expect(jsonLd.image).toBe("https://example.com/img.jpg");
  });
});

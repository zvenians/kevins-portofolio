/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { ProjectSchema, ContentBlockSchema } from "@/types/schema";

describe("Public Project Renderer Logic", () => {

  // --- Published project rendering ---
  it("published project with content passes schema validation", () => {
    const project = {
      id: "p1",
      slug: "test-project",
      title: "Test Project",
      description: "A test project",
      published: true,
      archived: false,
      featured: false,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      content: [
        { id: "b1", type: "text", body: "Hello world" },
        { id: "b2", type: "spacer", size: "medium" },
      ],
    };
    const res = ProjectSchema.safeParse(project);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.published).toBe(true);
      expect(res.data.content.length).toBe(2);
    }
  });

  // --- Draft project rejection ---
  it("draft project has published=false by default", () => {
    const project = {
      id: "p2",
      slug: "draft-project",
      title: "Draft",
      description: "Draft project",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = ProjectSchema.safeParse(project);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.published).toBe(false);
    }
  });

  // --- Missing project is handled by notFound() in page.tsx ---
  // (integration test would cover this; schema-level: null return is valid)

  // --- Block renderer selection ---
  it("all 12 block types parse correctly via discriminated union", () => {
    const blocks = [
      { id: "1", type: "text", body: "hello" },
      { id: "2", type: "image", media: { id: "m1", type: "image", url: "https://example.com/img.jpg", storagePath: "p/m1.jpg", createdAt: new Date() } },
      { id: "3", type: "video", media: { id: "m2", type: "video", url: "https://example.com/vid.mp4", storagePath: "p/m2.mp4", createdAt: new Date() } },
      { id: "4", type: "gallery", items: [] },
      { id: "5", type: "quote", quote: "Lorem ipsum" },
      { id: "6", type: "metrics", items: [{ label: "Users", value: "1000" }] },
      { id: "7", type: "process", steps: [{ title: "Step 1", description: "Do thing" }] },
      { id: "8", type: "timeline", items: [{ date: "2024", title: "Started", description: "Began work" }] },
      { id: "9", type: "code", language: "typescript", code: "const x = 1;" },
      { id: "10", type: "embed", provider: "youtube", url: "https://youtube.com/watch?v=123" },
      { id: "11", type: "comparison", before: { media: { id: "m3", type: "image", url: "https://example.com/b.jpg", storagePath: "p/m3.jpg", createdAt: new Date() } }, after: { media: { id: "m4", type: "image", url: "https://example.com/a.jpg", storagePath: "p/m4.jpg", createdAt: new Date() } } },
      { id: "12", type: "spacer", size: "large" },
    ];

    for (const block of blocks) {
      const res = ContentBlockSchema.safeParse(block);
      expect(res.success).toBe(true);
    }
  });

  // --- Unknown block handling ---
  it("unknown block type is rejected by schema", () => {
    const res = ContentBlockSchema.safeParse({ id: "x", type: "unknown_type", data: {} });
    expect(res.success).toBe(false);
  });

  // --- Dynamic metadata ---
  it("project with SEO fields validates correctly", () => {
    const project = {
      id: "p3",
      slug: "seo-project",
      title: "SEO Project",
      description: "SEO description",
      published: true,
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      cover: {
        id: "c1",
        type: "image",
        url: "https://example.com/cover.jpg",
        storagePath: "projects/p3/cover.jpg",
        alt: "Cover image",
        width: 1200,
        height: 630,
        createdAt: new Date(),
      },
      content: [],
    };
    const res = ProjectSchema.safeParse(project);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.cover?.url).toBe("https://example.com/cover.jpg");
      expect(res.data.cover?.width).toBe(1200);
    }
  });

  // --- Project navigation ---
  it("multiple published projects can be ordered for navigation", () => {
    const projectsData = [
      { id: "a", slug: "alpha", title: "Alpha", description: "A", published: true, archived: false, order: 0, createdAt: new Date(), updatedAt: new Date() },
      { id: "b", slug: "beta", title: "Beta", description: "B", published: true, archived: false, order: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: "c", slug: "gamma", title: "Gamma", description: "C", published: true, archived: false, order: 2, createdAt: new Date(), updatedAt: new Date() },
    ];

    const projects = projectsData.map((p) => {
      const res = ProjectSchema.safeParse(p);
      expect(res.success).toBe(true);
      return res.success ? res.data : null;
    }).filter(Boolean);

    expect(projects.length).toBe(3);

    // Simulate navigation logic
    const currentIndex = 1; // Beta
    const prev = currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
    const next = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

    expect(prev?.slug).toBe("alpha");
    expect(next?.slug).toBe("gamma");
  });

  // --- Three different content sequences through same schema ---
  it("Project A: Text, Image, Process, Gallery validates", () => {
    const project = {
      id: "pA", slug: "project-a", title: "A", description: "A", published: true, archived: false,
      createdAt: new Date(), updatedAt: new Date(),
      content: [
        { id: "1", type: "text", body: "Introduction" },
        { id: "2", type: "image", media: { id: "m1", type: "image", url: "https://x.com/1.jpg", storagePath: "p/1.jpg", createdAt: new Date() } },
        { id: "3", type: "process", steps: [{ title: "Research", description: "Did research" }] },
        { id: "4", type: "gallery", items: [] },
      ],
    };
    expect(ProjectSchema.safeParse(project).success).toBe(true);
  });

  it("Project B: Video, Quote, Metrics, Comparison validates", () => {
    const project = {
      id: "pB", slug: "project-b", title: "B", description: "B", published: true, archived: false,
      createdAt: new Date(), updatedAt: new Date(),
      content: [
        { id: "1", type: "video", media: { id: "m1", type: "video", url: "https://x.com/1.mp4", storagePath: "p/1.mp4", createdAt: new Date() } },
        { id: "2", type: "quote", quote: "Great work" },
        { id: "3", type: "metrics", items: [{ label: "Users", value: "5000" }] },
        { id: "4", type: "comparison", before: { media: { id: "m2", type: "image", url: "https://x.com/b.jpg", storagePath: "p/b.jpg", createdAt: new Date() } }, after: { media: { id: "m3", type: "image", url: "https://x.com/a.jpg", storagePath: "p/a.jpg", createdAt: new Date() } } },
      ],
    };
    expect(ProjectSchema.safeParse(project).success).toBe(true);
  });

  it("Project C: Text, Code, Timeline, Image, Embed validates", () => {
    const project = {
      id: "pC", slug: "project-c", title: "C", description: "C", published: true, archived: false,
      createdAt: new Date(), updatedAt: new Date(),
      content: [
        { id: "1", type: "text", body: "Overview" },
        { id: "2", type: "code", language: "python", code: "print('hello')" },
        { id: "3", type: "timeline", items: [{ date: "2024-01", title: "Start", description: "Beginning" }] },
        { id: "4", type: "image", media: { id: "m1", type: "image", url: "https://x.com/1.jpg", storagePath: "p/1.jpg", createdAt: new Date() } },
        { id: "5", type: "embed", provider: "youtube", url: "https://youtube.com/watch?v=abc" },
      ],
    };
    expect(ProjectSchema.safeParse(project).success).toBe(true);
  });

  // --- Embed provider validation ---
  it("invalid embed provider is rejected", () => {
    const block = { id: "1", type: "embed", provider: "tiktok", url: "https://tiktok.com/123" };
    expect(ContentBlockSchema.safeParse(block).success).toBe(false);
  });

  // --- Archived project must not be publicly visible ---
  it("archived published project should have archived=true", () => {
    const project = {
      id: "p4", slug: "archived", title: "Old", description: "Old project",
      published: true, archived: true,
      createdAt: new Date(), updatedAt: new Date(),
    };
    const res = ProjectSchema.safeParse(project);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.archived).toBe(true);
      // Data layer filters: where("archived", "==", false)
    }
  });
});

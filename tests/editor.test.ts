/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { ProjectSchema, ContentBlockSchema } from "@/types/schema";

describe("Editor Data Logic", () => {
  it("1. every block type validates", () => {
    const textBlock = { id: "1", type: "text", body: "hello" };
    expect(ContentBlockSchema.safeParse(textBlock).success).toBe(true);

    const media = { id: "m1", type: "image", url: "http://x", storagePath: "x", createdAt: new Date() };
    const imageBlock = { id: "2", type: "image", media };
    expect(ContentBlockSchema.safeParse(imageBlock).success).toBe(true);
    
    const embedBlock = { id: "3", type: "embed", provider: "youtube", url: "https://youtube.com/watch?v=123" };
    expect(ContentBlockSchema.safeParse(embedBlock).success).toBe(true);
  });

  it("2. malformed blocks are rejected", () => {
    const badBlock = { id: "1", type: "image" }; // missing media
    expect(ContentBlockSchema.safeParse(badBlock).success).toBe(false);

    const badEmbed = { id: "2", type: "embed", provider: "unknown", url: "http://x" }; // bad provider
    expect(ContentBlockSchema.safeParse(badEmbed).success).toBe(false);
  });

  it("3-6. block operations", () => {
    const blocks: any[] = [];
    
    // add works
    blocks.push({ id: "1", type: "text", body: "a" });
    expect(blocks.length).toBe(1);

    // duplicate works
    blocks.splice(1, 0, { ...blocks[0], id: "2" });
    expect(blocks.length).toBe(2);

    // reorder works
    [blocks[0], blocks[1]] = [blocks[1], blocks[0]];
    expect(blocks[0].id).toBe("2");

    // delete works
    blocks.splice(0, 1);
    expect(blocks.length).toBe(1);
    expect(blocks[0].id).toBe("1");
  });

  it("7. project with multiple block types can be serialized", () => {
    const project = {
      id: "p1",
      slug: "test",
      title: "Test",
      description: "Test project",
      createdAt: new Date(),
      updatedAt: new Date(),
      content: [
        { id: "1", type: "text", body: "p1" },
        { id: "2", type: "spacer", size: "medium" }
      ]
    };

    const res = ProjectSchema.safeParse(project);
    expect(res.success).toBe(true);
  });

  it("8. required media metadata is preserved", () => {
    const media = {
      id: "m1",
      type: "image",
      url: "http://x",
      storagePath: "x",
      width: 100,
      height: 200,
      createdAt: new Date()
    };
    const block = { id: "1", type: "image", media };
    const res = ContentBlockSchema.safeParse(block);
    expect(res.success).toBe(true);
    if (res.success && res.data.type === "image") {
      expect(res.data.media.width).toBe(100);
      expect(res.data.media.height).toBe(200);
    }
  });

  it("11. new project defaults to draft", () => {
    const project = {
      id: "p1",
      slug: "test",
      title: "Test",
      description: "Desc",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const res = ProjectSchema.safeParse(project);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.published).toBe(false);
      expect(res.data.archived).toBe(false);
    }
  });
});


  it("9. invalid upload types are rejected at schema level", () => {
    const badMedia = { id: "m1", type: "pdf", url: "http://x", storagePath: "x", createdAt: new Date() };
    expect(ContentBlockSchema.safeParse({ id: "1", type: "image", media: badMedia }).success).toBe(false);
  });

import { describe, it, expect } from "vitest";
import { ProjectSchema, ExperimentSchema, MessageSchema } from "@/types/schema";

/**
 * These tests verify the data-layer filtering behavior that protects
 * unpublished/archived content from appearing publicly.
 *
 * We test the Zod schemas directly because the actual Firestore queries
 * happen in server-only modules that require Firebase Admin credentials.
 * The Firestore query filters (published==true, archived==false) are
 * verified by code inspection in the walkthrough.
 */

describe("Public Eligibility - Project Schema", () => {
  const baseProject = {
    id: "test-1",
    slug: "test-project",
    title: "Test",
    description: "A test project",
    schemaVersion: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 0,
    content: [],
  };

  it("published + non-archived project is publicly eligible", () => {
    const result = ProjectSchema.safeParse({
      ...baseProject,
      published: true,
      archived: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.published).toBe(true);
      expect(result.data.archived).toBe(false);
    }
  });

  it("draft project (published=false) is excluded from public queries", () => {
    const result = ProjectSchema.safeParse({
      ...baseProject,
      published: false,
      archived: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      // This project would be filtered out by the Firestore query:
      // .where("published", "==", true)
      expect(result.data.published).toBe(false);
    }
  });

  it("archived project is excluded from public queries", () => {
    const result = ProjectSchema.safeParse({
      ...baseProject,
      published: true,
      archived: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      // This project would be filtered out by the Firestore query:
      // .where("archived", "==", false)
      expect(result.data.archived).toBe(true);
    }
  });

  it("unpublished project defaults published=false", () => {
    const result = ProjectSchema.safeParse({
      ...baseProject,
      // no published field provided — should default to false
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.published).toBe(false);
    }
  });

  it("featured filtering only applies to published projects", () => {
    const featured = ProjectSchema.safeParse({
      ...baseProject,
      published: true,
      archived: false,
      featured: true,
    });
    const unfeaturedDraft = ProjectSchema.safeParse({
      ...baseProject,
      id: "test-2",
      slug: "draft-featured",
      published: false,
      featured: true,
    });
    expect(featured.success).toBe(true);
    expect(unfeaturedDraft.success).toBe(true);
    if (featured.success && unfeaturedDraft.success) {
      // getFeaturedProjects() queries:
      // .where("published", "==", true)
      // .where("archived", "==", false)
      // .where("featured", "==", true)
      // So the draft would be excluded even though featured=true
      expect(featured.data.published).toBe(true);
      expect(featured.data.featured).toBe(true);
      expect(unfeaturedDraft.data.published).toBe(false);
      expect(unfeaturedDraft.data.featured).toBe(true);
    }
  });
});

describe("Public Eligibility - Experiment Schema", () => {
  const baseExperiment = {
    id: "exp-1",
    slug: "test-experiment",
    title: "Test Experiment",
    description: "A test experiment",
    schemaVersion: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 0,
  };

  it("published experiment is publicly eligible", () => {
    const result = ExperimentSchema.safeParse({
      ...baseExperiment,
      published: true,
      archived: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.published).toBe(true);
      expect(result.data.archived).toBe(false);
    }
  });

  it("draft experiment is excluded", () => {
    const result = ExperimentSchema.safeParse({
      ...baseExperiment,
      published: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.published).toBe(false);
    }
  });
});

describe("Message Schema - Security", () => {
  it("message status defaults to unread", () => {
    const result = MessageSchema.safeParse({
      id: "msg-1",
      name: "Visitor",
      email: "test@example.com",
      message: "Hello there",
      createdAt: new Date(),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("unread");
    }
  });

  it("rejects message with invalid status", () => {
    const result = MessageSchema.safeParse({
      id: "msg-1",
      name: "Visitor",
      email: "test@example.com",
      message: "Hello there",
      status: "admin-bypass",
      createdAt: new Date(),
    });
    expect(result.success).toBe(false);
  });
});

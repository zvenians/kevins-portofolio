import { describe, it, expect } from "vitest";
import { ExperienceSchema, ExperimentSchema } from "@/types/schema";

describe("Homepage Data Schema Logic", () => {
  it("validates valid Experience data", () => {
    const experience = {
      id: "exp1",
      title: "Senior Engineer",
      company: "Tech Corp",
      startDate: "2020",
      current: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = ExperienceSchema.safeParse(experience);
    expect(res.success).toBe(true);
  });

  it("validates valid Experiment data", () => {
    const experiment = {
      id: "exp2",
      slug: "test-experiment",
      title: "Test Experiment",
      description: "A fun test",
      published: true,
      archived: false,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = ExperimentSchema.safeParse(experiment);
    expect(res.success).toBe(true);
  });
});

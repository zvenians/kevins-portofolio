import { describe, it, expect } from "vitest";
import { SiteSettingsSchema } from "@/types/settings";
import { ExperienceSchema, ExperimentSchema, TechnologySchema } from "@/types/schema";

describe("Admin CMS Schemas", () => {
  it("validates valid SiteSettings data", () => {
    const settings = {
      id: "global",
      siteName: "Kevin",
      email: "test@example.com",
      socialLinks: ["https://github.com/kevin", "https://twitter.com/kevin"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = SiteSettingsSchema.safeParse(settings);
    expect(res.success).toBe(true);
  });

  it("fails SiteSettings with invalid email", () => {
    const settings = {
      id: "global",
      siteName: "Kevin",
      email: "not-an-email",
      updatedAt: new Date(),
    };
    const res = SiteSettingsSchema.safeParse(settings);
    expect(res.success).toBe(false);
  });

  it("validates valid Technology data", () => {
    const tech = {
      id: "tech-1",
      name: "React",
      slug: "react",
      category: "Frontend",
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = TechnologySchema.safeParse(tech);
    expect(res.success).toBe(true);
  });

  it("validates valid Experience data", () => {
    const exp = {
      id: "exp-1",
      title: "Dev",
      company: "Company",
      startDate: "2020",
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = ExperienceSchema.safeParse(exp);
    expect(res.success).toBe(true);
  });

  it("validates valid Experiment data", () => {
    const exp = {
      id: "exp-2",
      slug: "exp",
      title: "Exp",
      description: "Desc",
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = ExperimentSchema.safeParse(exp);
    expect(res.success).toBe(true);
  });
});

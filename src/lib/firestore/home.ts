import { adminDb } from "../firebase/adminDb";
import { type Experience, ExperienceSchema, type Experiment, ExperimentSchema, type Technology, TechnologySchema } from "../../types/schema";

export async function getFeaturedExperiments(): Promise<Experiment[]> {
  try {
    const snapshot = await adminDb
      .collection("experiments")
      .where("published", "==", true)
      .where("archived", "==", false)
      .where("featured", "==", true)
      .orderBy("order", "asc")
      .limit(6)
      .get();

    const experiments: Experiment[] = [];
    snapshot.forEach((doc) => {
      const raw = doc.data();
      if (raw.createdAt?.toDate) raw.createdAt = raw.createdAt.toDate();
      if (raw.updatedAt?.toDate) raw.updatedAt = raw.updatedAt.toDate();
      if (raw.publishedAt?.toDate) raw.publishedAt = raw.publishedAt.toDate();
      raw.id = doc.id;
      
      const parsed = ExperimentSchema.safeParse(raw);
      if (parsed.success) {
        experiments.push(parsed.data);
      }
    });
    return experiments;
  } catch (error) {
    console.error("Failed to fetch featured experiments:", error);
    return [];
  }
}

export async function getExperiments(): Promise<Experiment[]> {
  try {
    const snapshot = await adminDb
      .collection("experiments")
      .orderBy("order", "asc")
      .get();

    const experiments: Experiment[] = [];
    snapshot.forEach((doc) => {
      const raw = doc.data();
      if (raw.createdAt?.toDate) raw.createdAt = raw.createdAt.toDate();
      if (raw.updatedAt?.toDate) raw.updatedAt = raw.updatedAt.toDate();
      if (raw.publishedAt?.toDate) raw.publishedAt = raw.publishedAt.toDate();
      raw.id = doc.id;
      
      const parsed = ExperimentSchema.safeParse(raw);
      if (parsed.success) {
        experiments.push(parsed.data);
      }
    });
    return experiments;
  } catch (error) {
    console.error("Failed to fetch experiments:", error);
    return [];
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const snapshot = await adminDb
      .collection("experiences")
      .where("archived", "==", false)
      .orderBy("order", "asc")
      .get();

    const experiences: Experience[] = [];
    snapshot.forEach((doc) => {
      const raw = doc.data();
      if (raw.createdAt?.toDate) raw.createdAt = raw.createdAt.toDate();
      if (raw.updatedAt?.toDate) raw.updatedAt = raw.updatedAt.toDate();
      raw.id = doc.id;
      
      const parsed = ExperienceSchema.safeParse(raw);
      if (parsed.success) {
        experiences.push(parsed.data);
      }
    });
    return experiences;
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return [];
  }
}

export async function getTechnologies(): Promise<Technology[]> {
  try {
    const snapshot = await adminDb
      .collection("technologies")
      .where("archived", "==", false)
      .orderBy("order", "asc")
      .get();

    const technologies: Technology[] = [];
    snapshot.forEach((doc) => {
      const raw = doc.data();
      if (raw.createdAt?.toDate) raw.createdAt = raw.createdAt.toDate();
      if (raw.updatedAt?.toDate) raw.updatedAt = raw.updatedAt.toDate();
      raw.id = doc.id;
      
      const parsed = TechnologySchema.safeParse(raw);
      if (parsed.success) {
        technologies.push(parsed.data);
      }
    });
    return technologies;
  } catch (error) {
    console.error("Failed to fetch technologies:", error);
    return [];
  }
}

import { adminDb } from "../firebase/admin";
import { ProjectSchema, type Project } from "../../types/schema";

const COLLECTION_NAME = "projects";

/**
 * Validates raw Firestore data against the Zod schema.
 * Automatically falls back or throws depending on strictness.
 */
function validateProject(data: any): Project | null {
  const result = ProjectSchema.safeParse(data);
  if (!result.success) {
    console.error("Project validation failed:", result.error);
    return null;
  }
  return result.data;
}

/**
 * Fetches all published and non-archived projects.
 */
export async function getPublishedProjects(): Promise<Project[]> {
  const snapshot = await adminDb
    .collection(COLLECTION_NAME)
    .where("published", "==", true)
    .where("archived", "==", false)
    .orderBy("order", "asc")
    .get();

  const projects: Project[] = [];
  snapshot.forEach((doc) => {
    // Firestore Timestamp conversion
    const raw = doc.data();
    if (raw.createdAt?.toDate) raw.createdAt = raw.createdAt.toDate();
    if (raw.updatedAt?.toDate) raw.updatedAt = raw.updatedAt.toDate();
    if (raw.publishedAt?.toDate) raw.publishedAt = raw.publishedAt.toDate();
    
    raw.id = doc.id;
    
    const validated = validateProject(raw);
    if (validated) projects.push(validated);
  });

  return projects;
}

/**
 * Fetches a single project by slug.
 * Returns null if not found or if the project is a draft (unless bypassed for admin preview).
 */
export async function getProjectBySlug(slug: string, includeDrafts: boolean = false): Promise<Project | null> {
  let query = adminDb
    .collection(COLLECTION_NAME)
    .where("slug", "==", slug)
    .limit(1);

  if (!includeDrafts) {
    query = query
      .where("published", "==", true)
      .where("archived", "==", false);
  }

  const snapshot = await query.get();
  
  if (snapshot.empty) {
    return null;
  }

  const raw = snapshot.docs[0].data();
  if (raw.createdAt?.toDate) raw.createdAt = raw.createdAt.toDate();
  if (raw.updatedAt?.toDate) raw.updatedAt = raw.updatedAt.toDate();
  if (raw.publishedAt?.toDate) raw.publishedAt = raw.publishedAt.toDate();
  
  raw.id = snapshot.docs[0].id;

  return validateProject(raw);
}

/**
 * Fetches featured projects.
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const snapshot = await adminDb
    .collection(COLLECTION_NAME)
    .where("published", "==", true)
    .where("archived", "==", false)
    .where("featured", "==", true)
    .orderBy("order", "asc")
    .get();

  const projects: Project[] = [];
  snapshot.forEach((doc) => {
    const raw = doc.data();
    if (raw.createdAt?.toDate) raw.createdAt = raw.createdAt.toDate();
    if (raw.updatedAt?.toDate) raw.updatedAt = raw.updatedAt.toDate();
    if (raw.publishedAt?.toDate) raw.publishedAt = raw.publishedAt.toDate();
    raw.id = doc.id;
    const validated = validateProject(raw);
    if (validated) projects.push(validated);
  });

  return projects;
}
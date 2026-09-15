"use server";

import { adminDb } from "@/lib/firebase/admin";
import { verifyAdminSession } from "@/lib/auth/serverAuth";
import { ProjectSchema, type Project } from "@/types/schema";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function saveProject(data: Partial<Project>, isNew: boolean) {
  // Ensure user is admin
  await verifyAdminSession();

  const projectId = isNew ? (data.id || randomUUID()) : data.id;
  
  if (!projectId) {
    throw new Error("Project ID is required for updates");
  }

  // Pre-process data
  const now = new Date();
  const payload = {
    ...data,
    id: projectId,
    updatedAt: now,
    createdAt: isNew ? now : (data.createdAt ? new Date(data.createdAt) : now),
  };

  // Safe parse with zod to validate structure
  const result = ProjectSchema.safeParse(payload);
  
  if (!result.success) {
    console.error(result.error);
    throw new Error("Validation failed");
  }

  // If first time published, set publishedAt
  if (result.data.published && !result.data.publishedAt) {
    result.data.publishedAt = now;
  }

  // Convert dates back to strings/timestamps if necessary, or Firestore admin SDK handles Date objects automatically.
  // The Firebase admin SDK accepts native JavaScript Date objects and converts them to Firestore Timestamps.
  await adminDb.collection("projects").doc(projectId).set(result.data, { merge: true });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  
  return { success: true, id: projectId };
}

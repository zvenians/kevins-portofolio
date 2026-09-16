"use server";

import { adminDb } from "@/lib/firebase/adminDb";
import { verifyAdminSession } from "@/lib/auth/serverAuth";
import { ProjectSchema, type Project, ExperienceSchema, type Experience, ExperimentSchema, type Experiment, TechnologySchema, type Technology, MediaAssetSchema, type MediaAsset } from "@/types/schema";
import { SiteSettingsSchema, type SiteSettings } from "@/types/settings";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function saveProject(data: Partial<Project>, isNew: boolean) {
  await verifyAdminSession();
  const projectId = isNew ? (data.id || randomUUID()) : data.id;
  if (!projectId) throw new Error("ID is required");

  const now = new Date();
  const payload = {
    ...data,
    id: projectId,
    updatedAt: now,
    createdAt: isNew ? now : (data.createdAt ? new Date(data.createdAt) : now),
  };

  const result = ProjectSchema.safeParse(payload);
  if (!result.success) throw new Error("Validation failed");

  if (result.data.published && !result.data.publishedAt) {
    result.data.publishedAt = now;
  }

  await adminDb.collection("projects").doc(projectId).set(result.data, { merge: true });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  // Revalidate the specific project page so publish/unpublish/edit takes effect
  if (result.data.slug) {
    revalidatePath(`/projects/${result.data.slug}`);
  }
  return { success: true, id: projectId };
}

export async function saveExperience(data: Partial<Experience>, isNew: boolean) {
  await verifyAdminSession();
  const id = isNew ? (data.id || randomUUID()) : data.id;
  if (!id) throw new Error("ID is required");

  const now = new Date();
  const payload = { ...data, id, updatedAt: now, createdAt: isNew ? now : (data.createdAt ? new Date(data.createdAt) : now) };

  const result = ExperienceSchema.safeParse(payload);
  if (!result.success) throw new Error("Validation failed");

  await adminDb.collection("experiences").doc(id).set(result.data, { merge: true });
  revalidatePath("/");
  revalidatePath("/admin/experiences");
  return { success: true, id };
}

export async function deleteExperience(id: string) {
  await verifyAdminSession();
  await adminDb.collection("experiences").doc(id).delete();
  revalidatePath("/");
  revalidatePath("/admin/experiences");
  return { success: true };
}

export async function saveExperiment(data: Partial<Experiment>, isNew: boolean) {
  await verifyAdminSession();
  const id = isNew ? (data.id || randomUUID()) : data.id;
  if (!id) throw new Error("ID is required");

  const now = new Date();
  const payload = { ...data, id, updatedAt: now, createdAt: isNew ? now : (data.createdAt ? new Date(data.createdAt) : now) };

  const result = ExperimentSchema.safeParse(payload);
  if (!result.success) throw new Error("Validation failed");

  if (result.data.published && !result.data.publishedAt) result.data.publishedAt = now;

  await adminDb.collection("experiments").doc(id).set(result.data, { merge: true });
  revalidatePath("/");
  revalidatePath("/admin/experiments");
  return { success: true, id };
}

export async function deleteExperiment(id: string) {
  await verifyAdminSession();
  await adminDb.collection("experiments").doc(id).delete();
  revalidatePath("/");
  revalidatePath("/admin/experiments");
  return { success: true };
}

export async function saveTechnology(data: Partial<Technology>, isNew: boolean) {
  await verifyAdminSession();
  const id = isNew ? (data.id || randomUUID()) : data.id;
  if (!id) throw new Error("ID is required");

  const now = new Date();
  const payload = { ...data, id, updatedAt: now, createdAt: isNew ? now : (data.createdAt ? new Date(data.createdAt) : now) };

  const result = TechnologySchema.safeParse(payload);
  if (!result.success) throw new Error("Validation failed");

  await adminDb.collection("technologies").doc(id).set(result.data, { merge: true });
  revalidatePath("/");
  revalidatePath("/admin/technologies");
  return { success: true, id };
}

export async function deleteTechnology(id: string) {
  await verifyAdminSession();
  await adminDb.collection("technologies").doc(id).delete();
  revalidatePath("/");
  revalidatePath("/admin/technologies");
  return { success: true };
}

export async function saveSiteSettings(data: Partial<SiteSettings>) {
  await verifyAdminSession();
  const id = "global";
  const now = new Date();
  const payload = { ...data, id, updatedAt: now };

  const result = SiteSettingsSchema.safeParse(payload);
  if (!result.success) throw new Error("Validation failed");

  await adminDb.collection("siteSettings").doc(id).set(result.data, { merge: true });
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function updateOrder(collection: string, items: { id: string, order: number }[]) {
  await verifyAdminSession();
  const allowedCollections = ["projects", "experiences", "experiments", "technologies"];
  if (!allowedCollections.includes(collection)) throw new Error("Invalid collection for ordering");

  const batch = adminDb.batch();
  items.forEach((item) => {
    const ref = adminDb.collection(collection).doc(item.id);
    batch.update(ref, { order: item.order });
  });

  await batch.commit();
  revalidatePath("/");
  revalidatePath(`/admin/${collection}`);
  return { success: true };
}

export async function saveMediaAsset(asset: MediaAsset) {
  await verifyAdminSession();
  const payload = { ...asset, createdAt: new Date(asset.createdAt) };
  const result = MediaAssetSchema.safeParse(payload);
  if (!result.success) throw new Error("Validation failed");
  await adminDb.collection("mediaAssets").doc(result.data.id).set(result.data, { merge: true });
  return { success: true };
}

export async function fetchMediaAssets() {
  await verifyAdminSession();
  const { getMediaAssets } = await import("@/lib/firestore/media");
  return await getMediaAssets();
}

export async function updateMessageStatus(id: string, status: "unread" | "read" | "archived") {
  await verifyAdminSession();
  await adminDb.collection("messages").doc(id).update({ status });
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
  return { success: true };
}

export async function deleteMessage(id: string) {
  await verifyAdminSession();
  await adminDb.collection("messages").doc(id).delete();
  revalidatePath("/admin/messages");
  return { success: true };
}

import { adminDb } from "../firebase/admin";
import { SiteSettingsSchema, type SiteSettings } from "../../types/settings";

const COLLECTION_NAME = "siteSettings";
const GLOBAL_DOC_ID = "global";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const doc = await adminDb.collection(COLLECTION_NAME).doc(GLOBAL_DOC_ID).get();
  
  if (!doc.exists) {
    return null;
  }

  const raw = doc.data() || {};
  if (raw.updatedAt?.toDate) raw.updatedAt = raw.updatedAt.toDate();
  if (raw.resume?.updatedAt?.toDate) raw.resume.updatedAt = raw.resume.updatedAt.toDate();
  raw.id = doc.id;

  const result = SiteSettingsSchema.safeParse(raw);
  if (!result.success) {
    console.error("SiteSettings validation failed:", result.error);
    return null;
  }
  return result.data;
}

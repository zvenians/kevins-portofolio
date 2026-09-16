import { adminDb } from "../firebase/adminDb";
import { type MediaAsset, MediaAssetSchema } from "../../types/schema";

export async function getMediaAssets(limitCount = 50): Promise<MediaAsset[]> {
  try {
    const snapshot = await adminDb
      .collection("mediaAssets")
      .orderBy("createdAt", "desc")
      .limit(limitCount)
      .get();

    const assets: MediaAsset[] = [];
    snapshot.forEach((doc) => {
      const raw = doc.data();
      if (raw.createdAt?.toDate) raw.createdAt = raw.createdAt.toDate();
      raw.id = doc.id;
      
      const parsed = MediaAssetSchema.safeParse(raw);
      if (parsed.success) {
        assets.push(parsed.data);
      }
    });
    return assets;
  } catch (error) {
    console.error("Failed to fetch media assets:", error);
    return [];
  }
}

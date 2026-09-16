"use server";

import { adminAuth } from "@/lib/firebase/adminAuth";

export async function bootstrapAdmin(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (decodedToken.email === "simatupangkevin9@gmail.com" && !decodedToken.admin) {
      await adminAuth.setCustomUserClaims(decodedToken.uid, { admin: true });
      return { success: true, bootstrapped: true };
    }
    return { success: true, bootstrapped: false };
  } catch (error) {
    console.error("Bootstrap admin error:", error);
    return { success: false, error: "Verification failed" };
  }
}

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/adminAuth";
import { redirect } from "next/navigation";

export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (error: unknown) {
    if ((error as Error)?.message === 'NEXT_REDIRECT') throw error;
    console.error("Server auth verification failed:", error);
  }

  if (!decodedToken || !decodedToken.admin) {
    redirect("/admin/login");
  }

  return decodedToken;
}


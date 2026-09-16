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
    // Next.js redirect() throws a special error that must be re-thrown
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Server auth verification failed:", error);
    redirect("/admin/login");
  }

  if (!decodedToken.admin) {
    redirect("/admin/login");
  }

  return decodedToken;
}

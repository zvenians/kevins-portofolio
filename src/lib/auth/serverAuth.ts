import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/adminAuth";
import { redirect } from "next/navigation";

export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (!decodedToken.admin) {
      redirect("/admin/login");
    }
    return decodedToken;
  } catch (error) {
    console.error("Server auth verification failed:", error);
    redirect("/admin/login");
  }
}

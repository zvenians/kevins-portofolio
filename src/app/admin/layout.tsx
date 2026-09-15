import { AuthProvider } from "@/lib/auth/AuthContext";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-text-primary">
        {children}
      </div>
    </AuthProvider>
  );
}

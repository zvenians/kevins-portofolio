"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/admin/login");
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Verifying authorization...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}

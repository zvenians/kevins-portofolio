"use client";

import { auth } from "@/lib/firebase/config";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminSidebar() {
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    document.cookie = `firebase-token=; path=/; max-age=0; SameSite=Strict; Secure`;
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-surface-elevated border-r border-border p-6 flex flex-col h-screen sticky top-0">
      <h2 className="text-xl font-bold mb-8 tracking-tight">Admin</h2>
      
      <nav className="flex-1 space-y-2 text-sm">
        <Link href="/admin" className="block px-3 py-2 bg-surface rounded text-text-primary">
          Dashboard
        </Link>
        <Link href="/admin/projects" className="block px-3 py-2 hover:bg-surface rounded text-text-secondary hover:text-text-primary transition-colors">
          Projects
        </Link>
      </nav>
      
      <button 
        onClick={handleSignOut}
        className="mt-auto px-3 py-2 text-left text-sm text-text-muted hover:text-danger transition-colors"
      >
        Sign Out
      </button>
    </aside>
  );
}

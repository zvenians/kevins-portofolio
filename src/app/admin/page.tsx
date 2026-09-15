"use client";

import { AdminGuard } from "@/components/auth/AdminGuard";
import { auth } from "@/lib/firebase/config";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/admin/login");
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-surface-elevated border-r border-border p-6 flex flex-col h-screen sticky top-0">
          <h2 className="text-xl font-bold mb-8 tracking-tight">Admin</h2>
          
          <nav className="flex-1 space-y-2 text-sm">
            <Link href="/admin" className="block px-3 py-2 bg-surface rounded text-text-primary">
              Dashboard
            </Link>
            <Link href="/admin/projects" className="block px-3 py-2 hover:bg-surface rounded text-text-secondary hover:text-text-primary transition-colors">
              Projects
            </Link>
            <Link href="/admin/settings" className="block px-3 py-2 hover:bg-surface rounded text-text-secondary hover:text-text-primary transition-colors">
              Settings
            </Link>
          </nav>
          
          <button 
            onClick={handleSignOut}
            className="mt-auto px-3 py-2 text-left text-sm text-text-muted hover:text-danger transition-colors"
          >
            Sign Out
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-12">
          <header className="mb-12">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-text-secondary">Manage your personal digital experience.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-surface-elevated rounded-lg border border-border">
              <h3 className="text-lg font-medium mb-1">Projects</h3>
              <p className="text-sm text-text-muted mb-4">Manage portfolio items</p>
              <Link href="/admin/projects" className="text-sm text-accent hover:underline">
                View all projects →
              </Link>
            </div>
            
            <div className="p-6 bg-surface-elevated rounded-lg border border-border">
              <h3 className="text-lg font-medium mb-1">Settings</h3>
              <p className="text-sm text-text-muted mb-4">Manage global configurations</p>
              <Link href="/admin/settings" className="text-sm text-accent hover:underline">
                View settings →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

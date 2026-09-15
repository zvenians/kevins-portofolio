import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-text-secondary">Manage your personal digital experience.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="p-6 bg-surface-elevated rounded-lg border border-border">
          <h3 className="text-lg font-medium mb-1">Projects</h3>
          <p className="text-sm text-text-muted mb-4">Manage portfolio items</p>
          <Link href="/admin/projects" className="text-sm text-accent hover:underline">
            View all projects →
          </Link>
        </div>
      </div>
    </div>
  );
}

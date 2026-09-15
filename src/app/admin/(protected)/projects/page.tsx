export const dynamic = 'force-dynamic';
import { adminDb } from "@/lib/firebase/admin";
import Link from "next/link";
import { ProjectSchema, type Project } from "@/types/schema";

async function getAllProjects(): Promise<Project[]> {
  const snapshot = await adminDb
    .collection("projects")
    .orderBy("order", "asc")
    .get();

  const projects: Project[] = [];
  snapshot.forEach((doc) => {
    const raw = doc.data();
    if (raw.createdAt?.toDate) raw.createdAt = raw.createdAt.toDate();
    if (raw.updatedAt?.toDate) raw.updatedAt = raw.updatedAt.toDate();
    if (raw.publishedAt?.toDate) raw.publishedAt = raw.publishedAt.toDate();
    raw.id = doc.id;
    
    const res = ProjectSchema.safeParse(raw);
    if (res.success) projects.push(res.data);
  });
  return projects;
}

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="p-12 max-w-5xl">
      <header className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-text-secondary">Manage your content</p>
        </div>
        <Link 
          href="/admin/projects/new"
          className="px-4 py-2 bg-text-primary text-background font-medium rounded hover:bg-text-secondary transition-colors"
        >
          + New Project
        </Link>
      </header>

      <div className="bg-surface-elevated rounded-lg border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-text-secondary">Order</th>
              <th className="px-6 py-3 text-sm font-medium text-text-secondary">Title</th>
              <th className="px-6 py-3 text-sm font-medium text-text-secondary">Status</th>
              <th className="px-6 py-3 text-sm font-medium text-text-secondary text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-text-muted">
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map(project => {
                let statusText = "Draft";
                let statusClass = "text-text-muted";
                if (project.archived) {
                  statusText = "Archived";
                  statusClass = "text-danger";
                } else if (project.published) {
                  statusText = "Published";
                  statusClass = "text-success";
                }

                return (
                  <tr key={project.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono">{project.order}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">{project.title}</div>
                      <div className="text-sm text-text-muted">{project.slug}</div>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium ${statusClass}`}>
                      {statusText}
                      {project.featured && <span className="ml-2 text-accent text-xs border border-accent px-1 py-0.5 rounded">Featured</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/projects/${project.id}`}
                        className="text-accent hover:underline text-sm font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

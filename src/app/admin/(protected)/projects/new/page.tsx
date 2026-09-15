import { ProjectForm } from "@/components/admin/ProjectForm";
import Link from "next/link";

export default function NewProjectPage() {
  return (
    <div className="p-12 max-w-5xl">
      <header className="mb-12">
        <Link href="/admin/projects" className="text-text-muted hover:text-text-primary text-sm mb-4 inline-block">
          ← Back to Projects
        </Link>
        <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
      </header>

      <ProjectForm />
    </div>
  );
}

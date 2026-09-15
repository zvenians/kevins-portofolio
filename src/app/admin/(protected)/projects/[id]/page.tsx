export const dynamic = 'force-dynamic';
import { ProjectForm } from "@/components/admin/ProjectForm";
import { adminDb } from "@/lib/firebase/admin";
import { ProjectSchema, type Project } from "@/types/schema";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const doc = await adminDb.collection("projects").doc(resolvedParams.id).get();
  
  if (!doc.exists) {
    notFound();
  }

  const raw = doc.data() || {};
  if (raw.createdAt?.toDate) raw.createdAt = raw.createdAt.toDate();
  if (raw.updatedAt?.toDate) raw.updatedAt = raw.updatedAt.toDate();
  if (raw.publishedAt?.toDate) raw.publishedAt = raw.publishedAt.toDate();
  raw.id = doc.id;

  const result = ProjectSchema.safeParse(raw);
  
  if (!result.success) {
    console.error("Invalid project data:", result.error);
    // Continue anyway to allow fixing in the form, just passing raw
  }

  const initialData = result.success ? result.data : (raw as Project);

  return (
    <div className="p-12 max-w-5xl">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <Link href="/admin/projects" className="text-text-muted hover:text-text-primary text-sm mb-4 inline-block">
            ← Back to Projects
          </Link>
          <h1 className="text-3xl font-bold mb-2">Edit Project</h1>
        </div>
        <Link 
          href={`/projects/${initialData.slug}`}
          target="_blank"
          className="text-accent hover:underline text-sm"
        >
          View Public Page ↗
        </Link>
      </header>

      <ProjectForm initialData={initialData} />
    </div>
  );
}

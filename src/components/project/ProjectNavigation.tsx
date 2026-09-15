import { type Project } from "@/types/schema";
import { getPublishedProjects } from "@/lib/firestore/projects";
import Link from "next/link";

interface Props {
  currentProjectId: string;
}

/**
 * Navigation component shown at the end of a project page.
 * Uses published project ordering to determine next/previous.
 * No hardcoded project IDs. Purely data-driven.
 */
export async function ProjectNavigation({ currentProjectId }: Props) {
  let projects: Project[] = [];
  try {
    projects = await getPublishedProjects();
  } catch {
    return null;
  }

  if (projects.length <= 1) return null;

  const currentIndex = projects.findIndex((p) => p.id === currentProjectId);
  if (currentIndex === -1) return null;

  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

  return (
    <nav aria-label="Project navigation" className="border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Previous */}
        <Link
          href={`/projects/${prevProject.slug}`}
          className="group flex flex-col gap-2 px-6 md:px-12 py-12 md:py-16 border-b md:border-b-0 md:border-r border-border hover:bg-surface transition-colors"
        >
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
            ← Previous
          </span>
          <span className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-accent transition-colors">
            {prevProject.title}
          </span>
          {prevProject.category && (
            <span className="text-sm text-text-muted">{prevProject.category}</span>
          )}
        </Link>

        {/* Next */}
        <Link
          href={`/projects/${nextProject.slug}`}
          className="group flex flex-col gap-2 px-6 md:px-12 py-12 md:py-16 text-right hover:bg-surface transition-colors"
        >
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
            Next →
          </span>
          <span className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-accent transition-colors">
            {nextProject.title}
          </span>
          {nextProject.category && (
            <span className="text-sm text-text-muted">{nextProject.category}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

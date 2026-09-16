import { type Project } from "@/types/schema";
import { getPublishedProjects } from "@/lib/firestore/projects";
import Link from "next/link";

interface Props {
  currentProjectId: string;
}

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
    <nav aria-label="Project navigation" className="w-full bg-background border-t border-border/30 overflow-hidden">
      <div className="flex flex-col md:flex-row w-full min-h-[40vh] md:min-h-[50vh]">
        {/* Previous */}
        <Link
          href={`/projects/${prevProject.slug}`}
          className="group relative w-full md:w-1/2 flex flex-col justify-between p-8 md:p-16 border-b md:border-b-0 md:border-r border-border/30 hover:bg-surface/50 transition-colors duration-700"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted block z-10">
            [ Prev ]
          </span>
          
          <div className="z-10 mt-12 md:mt-0">
            <span className="text-4xl md:text-6xl font-medium tracking-tighter text-text-secondary group-hover:text-text-primary transition-colors duration-500 uppercase block mb-4">
              {prevProject.title}
            </span>
            {prevProject.category && (
              <span className="text-sm font-mono tracking-wider text-text-muted block">
                {prevProject.category}
              </span>
            )}
          </div>
          
          {/* Subtle directional arrow */}
          <div className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 opacity-0 -translate-x-8 group-hover:opacity-10 group-hover:translate-x-0 transition-all duration-700 pointer-events-none">
            <span className="text-[12rem] font-light leading-none">←</span>
          </div>
        </Link>

        {/* Next */}
        <Link
          href={`/projects/${nextProject.slug}`}
          className="group relative w-full md:w-1/2 flex flex-col justify-between items-end p-8 md:p-16 text-right hover:bg-surface/50 transition-colors duration-700"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted block z-10">
            [ Next ]
          </span>
          
          <div className="z-10 mt-12 md:mt-0">
            <span className="text-4xl md:text-6xl font-medium tracking-tighter text-text-secondary group-hover:text-text-primary transition-colors duration-500 uppercase block mb-4">
              {nextProject.title}
            </span>
            {nextProject.category && (
              <span className="text-sm font-mono tracking-wider text-text-muted block">
                {nextProject.category}
              </span>
            )}
          </div>
          
          {/* Subtle directional arrow */}
          <div className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 opacity-0 translate-x-8 group-hover:opacity-10 group-hover:translate-x-0 transition-all duration-700 pointer-events-none">
            <span className="text-[12rem] font-light leading-none">→</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}

import { Navigation } from "@/components/navigation/Navigation";
import { getPublishedProjects } from "@/lib/firestore/projects";
import { type Project } from "@/types/schema";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of digital experiences, products, and experiments.",
};

export const revalidate = 3600;

export default async function ProjectsIndexPage() {
  let projects: Project[] = [];
  try {
    projects = await getPublishedProjects();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  return (
    <>
      <Navigation />
      
      <main className="flex flex-col min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-16 md:mb-24">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-text-primary mb-6">
            Work
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl">
            Selected projects and professional experiences.
          </p>
        </header>

        {projects.length === 0 ? (
          <p className="text-text-muted italic">No projects available at the moment.</p>
        ) : (
          <div className="flex flex-col gap-16 md:gap-24 pb-32">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`} className="group block">
                <article className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-7 lg:col-span-8 aspect-[16/9] md:aspect-auto md:h-[500px] bg-surface-elevated rounded-lg overflow-hidden border border-border">
                    {project.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={project.cover.url} 
                        alt={project.cover.alt || project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        No cover media
                      </div>
                    )}
                  </div>
                  
                  <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-center">
                    {project.category && (
                      <span className="text-accent text-sm font-mono uppercase tracking-wider mb-3">
                        {project.category}
                      </span>
                    )}
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-accent transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-text-secondary leading-relaxed mb-6">
                      {project.description}
                    </p>
                    <div className="inline-flex items-center text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                      View Project <span className="ml-2">→</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

import { Navigation } from "@/components/navigation/Navigation";
import { getPublishedProjects } from "@/lib/firestore/projects";
import { type Project } from "@/types/schema";
import Link from "next/link";
import { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Work",
  description: "A collection of digital experiences, products, and experiments.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Work",
    description: "A collection of digital experiences, products, and experiments.",
    url: "/projects",
  },
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
      
      <main className="flex flex-col min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto overflow-x-hidden">
        <header className="mb-20 md:mb-32">
          <Reveal>
            <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter text-text-primary mb-6 leading-[1.05]">
              Archive.
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-xl md:text-2xl text-text-secondary max-w-2xl font-light">
              Selected projects, products, and digital experiences.
            </p>
          </Reveal>
        </header>

        {projects.length === 0 ? (
          <p className="text-text-muted italic font-light">No projects available at the moment.</p>
        ) : (
          <div className="flex flex-col gap-24 md:gap-40 pb-32">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={index === 0 ? 200 : 100}>
                <Link href={`/projects/${project.slug}`} className="group block">
                  <article className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-20 items-center`}>
                    <div className={`w-full ${index % 3 === 0 ? 'md:w-3/5' : 'md:w-1/2'} aspect-[4/3] bg-surface-elevated overflow-hidden rounded-xl`}>
                      {project.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={project.cover.url} 
                          alt={project.cover.alt || project.title}
                          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                          loading={index === 0 ? "eager" : "lazy"}
                          fetchPriority={index === 0 ? "high" : "auto"}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted font-mono text-sm">
                          No cover media
                        </div>
                      )}
                    </div>
                    
                    <div className={`w-full ${index % 3 === 0 ? 'md:w-2/5' : 'md:w-1/2'} flex flex-col justify-center`}>
                      {project.category && (
                        <span className="text-accent text-xs font-mono uppercase tracking-widest mb-4 block">
                          {project.category}
                        </span>
                      )}
                      <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 group-hover:text-accent transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-8 font-light">
                        {project.subtitle || project.description}
                      </p>
                      <div className="inline-flex items-center text-sm font-semibold tracking-wider uppercase text-text-primary group-hover:text-accent transition-colors">
                        View Case Study <span className="ml-3 transform transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

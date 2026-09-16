import { Navigation } from "@/components/navigation/Navigation";
import { getPublishedProjects } from "@/lib/firestore/projects";
import { type Project } from "@/types/schema";
import Link from "next/link";
import { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Archive",
  description: "A collection of digital experiences, products, and experiments.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Archive",
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
      
      <main className="flex flex-col min-h-screen pt-40 px-6 md:px-12 max-w-[1600px] mx-auto overflow-x-hidden">
        <header className="mb-32 md:mb-48 border-b border-border/30 pb-16">
          <Reveal>
            <h1 className="text-[12vw] font-medium tracking-tighter text-text-primary mb-8 leading-[0.85] uppercase">
              Archive
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-12 md:mt-24">
              <p className="text-xl md:text-3xl text-text-secondary max-w-2xl font-light leading-relaxed">
                Selected works, experiments, and cinematic digital experiences.
              </p>
              <div className="font-mono text-xs tracking-widest text-text-muted uppercase flex gap-4">
                <span>[ {projects.length} Entries ]</span>
                <span>[ 2020—Present ]</span>
              </div>
            </div>
          </Reveal>
        </header>

        {projects.length === 0 ? (
          <p className="text-text-muted italic font-light">No projects available at the moment.</p>
        ) : (
          <div className="flex flex-col w-full pb-40">
            {projects.map((project, index) => {
              const num = (index + 1).toString().padStart(2, '0');
              const isFirst = index === 0;
              return (
                <Reveal key={project.id} delay={100} className="w-full">
                  <article className="group w-full border-b border-border/20">
                    <Link href={`/projects/${project.slug}`} className="block w-full py-16 md:py-24 hover:bg-surface/30 transition-colors duration-700 px-4 md:px-8 -mx-4 md:-mx-8">
                      
                      <div className="flex flex-col md:flex-row md:items-center gap-12 md:gap-24 w-full">
                        
                        {/* Meta and Index */}
                        <div className="md:w-1/6 flex md:flex-col justify-between md:justify-start items-baseline gap-4">
                          <span className="font-mono text-xs tracking-widest text-text-muted block">
                            No. {num}
                          </span>
                          {project.year && (
                            <span className="text-xs font-mono text-text-secondary block opacity-50">
                              {project.year}
                            </span>
                          )}
                        </div>

                        {/* Title & Category */}
                        <div className="md:w-2/6">
                          <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-4 text-text-primary group-hover:text-text-secondary transition-colors duration-500 uppercase">
                            {project.title}
                          </h2>
                          {project.category && (
                            <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted block">
                              {"// "}{project.category}
                            </span>
                          )}
                        </div>

                        {/* Media */}
                        <div className={`md:w-2/6 ${isFirst ? 'aspect-video' : 'aspect-[3/2]'} bg-surface overflow-hidden relative`}>
                          {project.cover ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={project.cover.url} 
                                alt={project.cover.alt || project.title}
                                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 saturate-50 group-hover:saturate-100"
                                loading={isFirst ? "eager" : "lazy"}
                                fetchPriority={isFirst ? "high" : "auto"}
                              />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-surface-elevated text-text-primary/10 text-8xl font-medium uppercase">
                              {project.title.charAt(0)}
                            </div>
                          )}
                        </div>
                        
                        {/* Arrow */}
                        <div className="hidden md:flex md:w-1/6 justify-end">
                           <div className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center group-hover:bg-text-primary group-hover:text-background transition-all duration-500">
                             <span className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 text-lg">→</span>
                           </div>
                        </div>

                      </div>
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

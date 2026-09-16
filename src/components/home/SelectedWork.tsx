import Link from "next/link";
import { type Project } from "@/types/schema";
import { Reveal } from "@/components/ui/Reveal";

interface SelectedWorkProps {
  projects: Project[];
}

export function SelectedWork({ projects }: SelectedWorkProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-24 md:py-40">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-sm font-mono text-text-muted mb-16 uppercase tracking-wider">
            [01] Selected Works
          </h2>
        </Reveal>

        <div className="flex flex-col gap-32 md:gap-48 mt-24">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;
            const number = String(index + 1).padStart(2, "0");
            
            return (
              <Reveal key={project.id} delay={index * 100}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block w-full"
                >
                  <div
                    className={`flex flex-col ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    } items-center gap-12 md:gap-24`}
                  >
                    {/* Image Column */}
                    <div className={`w-full md:w-3/5 ${isEven ? "" : "md:pl-12"}`}>
                      <div className="relative overflow-hidden bg-surface aspect-[4/3] md:aspect-[16/10]">
                        {project.cover ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={project.cover.url}
                              alt={project.cover.alt || project.title}
                              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                            />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-surface-elevated">
                            <span className="text-8xl font-light text-text-muted opacity-20">
                              {project.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-background/0 transition-colors duration-500 group-hover:bg-background/10" />
                      </div>
                    </div>

                    {/* Text Column */}
                    <div className={`w-full md:w-2/5 flex flex-col justify-center ${isEven ? "md:pl-12" : "md:pr-12 md:items-end md:text-right"}`}>
                      <div className={`flex flex-col ${isEven ? "" : "md:items-end"}`}>
                        <span className="text-6xl md:text-8xl font-light text-text-muted opacity-30 -mb-4 md:-mb-8 tracking-tighter">
                          {number}
                        </span>
                        
                        <h3 className="text-4xl md:text-6xl lg:text-7xl font-medium text-text-primary tracking-tight transition-colors duration-300 group-hover:text-accent mb-4">
                          {project.title}
                        </h3>
                        
                        {project.subtitle && (
                          <p className="text-xl md:text-2xl text-text-secondary font-light mb-6">
                            {project.subtitle}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-6">
                          <span className="text-xs font-mono text-text-muted uppercase tracking-widest border border-border px-3 py-1 rounded-full">
                            {project.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

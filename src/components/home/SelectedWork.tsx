import Link from "next/link";
import { type Project } from "@/types/schema";
import { Reveal } from "@/components/ui/Reveal";

export default function SelectedWork({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="work" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <Reveal>
        <div className="flex items-center gap-6 mb-16 md:mb-24">
          <h2 className="text-sm font-mono tracking-widest uppercase text-text-muted">Selected Work</h2>
          <div className="flex-grow h-px bg-border/50"></div>
        </div>
      </Reveal>
      
      <div className="flex flex-col gap-24 md:gap-40">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={100}>
            <Link href={`/projects/${project.slug}`} className="group block">
              <article className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-20 items-center`}>
                <div className={`w-full ${index === 0 ? 'md:w-3/5 lg:w-2/3' : 'md:w-1/2'} aspect-[4/3] bg-surface-elevated overflow-hidden rounded-xl`}>
                  {project.cover && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={project.cover.url} 
                      alt={project.cover.alt || project.title} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className={`w-full ${index === 0 ? 'md:w-2/5 lg:w-1/3' : 'md:w-1/2'} flex flex-col justify-center`}>
                  {project.category && (
                    <span className="text-xs font-mono uppercase tracking-widest text-accent mb-4 block">
                      {project.category}
                    </span>
                  )}
                  <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-text-primary mb-6 transition-colors group-hover:text-accent">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-8">
                      {project.subtitle}
                    </p>
                  )}
                  <span className="inline-flex items-center text-sm font-semibold tracking-wider uppercase text-text-primary group-hover:text-accent transition-colors">
                    Explore <span className="ml-3 transform transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </article>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

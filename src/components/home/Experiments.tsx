import { type Experiment } from "@/types/schema";
import { Reveal } from "@/components/ui/Reveal";

export default function Experiments({ experiments }: { experiments: Experiment[] }) {
  if (!experiments || experiments.length === 0) return null;

  return (
    <section id="experiments" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <Reveal>
        <div className="flex items-center gap-6 mb-16 md:mb-20">
          <h2 className="text-sm font-mono tracking-widest uppercase text-text-muted">Explorations & Experiments</h2>
          <div className="flex-grow h-px bg-border/50"></div>
        </div>
      </Reveal>
      
      <div className="flex flex-col">
        {experiments.map((exp, index) => (
          <Reveal key={exp.id} delay={index * 50}>
            <a 
              href={exp.link || '#'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block border-b border-border py-8 md:py-12 transition-colors hover:bg-surface/50"
            >
              <article className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 px-4 md:px-8">
                <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 bg-surface-elevated rounded-md overflow-hidden relative border border-border/50">
                  {exp.cover && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={exp.cover.url} 
                      alt={exp.cover.alt || exp.title} 
                      className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-110"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl md:text-2xl font-medium text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-text-secondary md:text-lg max-w-2xl font-light">
                    {exp.description}
                  </p>
                </div>
                <div className="md:text-right shrink-0">
                  {exp.date && (
                    <span className="text-xs font-mono tracking-wider text-text-muted block md:mb-2">
                      {new Date(exp.date).getFullYear()}
                    </span>
                  )}
                  <span className="text-sm font-medium text-accent opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0 hidden md:inline-block">
                    View Project ↗
                  </span>
                </div>
              </article>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

import { Reveal } from "@/components/ui/Reveal";

interface Experiment {
  id: string;
  title: string;
  description?: string;
  cover?: { url: string; alt?: string };
  date?: string;
  link?: string;
}

interface ExperimentsProps {
  experiments: Experiment[];
}

export function Experiments({ experiments }: ExperimentsProps) {
  if (!experiments || experiments.length === 0) return null;

  return (
    <section className="py-24 md:py-40">
      <div className="container mx-auto px-6 overflow-hidden">
        <Reveal>
          <div className="flex justify-between items-end mb-16 md:mb-24 border-b border-border pb-8">
            <h2 className="text-sm font-mono text-text-muted uppercase tracking-wider">
              [03] Lab & Experiments
            </h2>
            <span className="text-xs font-mono text-text-muted">RAW / UNFILTERED</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
          {experiments.map((experiment, index) => {
            const delay = (index % 3) * 100;
            // Staggered top margin for middle items on desktop
            const isMiddle = index % 3 === 1;
            
            return (
              <Reveal key={experiment.id} delay={delay}>
                <a
                  href={experiment.link || "#"}
                  target={experiment.link ? "_blank" : undefined}
                  rel={experiment.link ? "noopener noreferrer" : undefined}
                  className={`group block w-full ${isMiddle ? "lg:mt-24" : ""}`}
                >
                  <div className="flex flex-col gap-6">
                    {/* Metadata Header */}
                    <div className="flex justify-between items-center font-mono text-xs text-text-muted">
                      <span>EXP_{String(index + 1).padStart(3, "0")}</span>
                      {experiment.date && (
                        <span>
                          {new Date(experiment.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                          })}
                        </span>
                      )}
                    </div>

                    {/* Image block (Technical aspect ratio) */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-elevated border border-border">
                      {experiment.cover ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={experiment.cover.url}
                            alt={experiment.cover.alt || experiment.title}
                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                          />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-mono text-text-muted opacity-20">NO_DATA</span>
                        </div>
                      )}
                      
                      {/* Technical overlay corners */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-text-muted m-2 opacity-50" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-text-muted m-2 opacity-50" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-text-muted m-2 opacity-50" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-text-muted m-2 opacity-50" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-medium text-text-primary group-hover:text-accent transition-colors">
                        {experiment.title}
                      </h3>
                      {experiment.description && (
                        <p className="text-sm text-text-secondary leading-relaxed font-light">
                          {experiment.description}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

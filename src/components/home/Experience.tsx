import { Reveal } from "@/components/ui/Reveal";
import { type Experience as ExperienceType } from "@/types/schema";

interface ExperienceProps {
  experiences: ExperienceType[];
}

export function Experience({ experiences }: ExperienceProps) {
  if (!experiences || experiences.length === 0) return null;

  return (
    <section className="py-24 md:py-40 bg-surface">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-sm font-mono text-text-muted mb-24 uppercase tracking-wider">
            [04] Chronology
          </h2>
        </Reveal>

        <div className="relative">
          {/* Vertical Timeline Line (Desktop only) */}
          <div className="hidden md:block absolute left-[30%] top-0 bottom-0 w-px bg-border/50" />

          <div className="flex flex-col gap-20">
            {experiences.map((exp, index) => {
              const startYear = new Date(exp.startDate).getFullYear();
              const endYear = exp.current
                ? "Present"
                : exp.endDate
                ? new Date(exp.endDate).getFullYear()
                : "";

              return (
                <Reveal key={exp.id || index} delay={index * 100}>
                  <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 group">
                    {/* Timeframe column */}
                    <div className="md:col-span-4 md:pr-16 flex md:justify-end items-start pt-2">
                      <div className="flex flex-col md:items-end text-left md:text-right">
                        <span className="text-5xl md:text-6xl font-light text-text-primary tracking-tighter tabular-nums leading-none">
                          {endYear}
                        </span>
                        {startYear !== endYear && startYear && (
                          <span className="text-xl md:text-2xl font-light text-text-muted mt-2">
                            {startYear}
                          </span>
                        )}
                        {exp.current && (
                          <span className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="hidden md:flex absolute left-[30%] -translate-x-1/2 top-4 w-3 h-3 rounded-full border border-border bg-surface transition-colors duration-300 group-hover:border-accent group-hover:bg-accent/20 z-10" />

                    {/* Content column */}
                    <div className="md:col-span-8 md:pl-16">
                      <h3 className="text-3xl md:text-4xl font-medium text-text-primary tracking-tight mb-2">
                        {exp.title}
                      </h3>
                      <p className="text-xl font-light text-text-secondary mb-6">
                        {exp.company}
                      </p>
                      {exp.description && (
                        <div className="text-base text-text-muted leading-relaxed font-light max-w-2xl whitespace-pre-wrap">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

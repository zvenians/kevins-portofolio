import { type Experience as ExperienceType } from "@/types/schema";
import { Reveal } from "@/components/ui/Reveal";

export default function Experience({ experiences }: { experiences: ExperienceType[] }) {
  if (!experiences || experiences.length === 0) return null;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 max-w-4xl mx-auto">
      <Reveal>
        <div className="flex items-center gap-6 mb-16 md:mb-24">
          <h2 className="text-sm font-mono tracking-widest uppercase text-text-muted">Experience</h2>
          <div className="flex-grow h-px bg-border/50"></div>
        </div>
      </Reveal>
      
      <div className="flex flex-col gap-16 md:gap-20">
        {experiences.map((exp, index) => {
          const startYear = exp.startDate ? new Date(exp.startDate).getFullYear() : '';
          const endYear = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '');
          const dateRange = startYear ? `${startYear} — ${endYear}` : '';

          return (
            <Reveal key={exp.id} delay={index * 100}>
              <article className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4 md:gap-12 group">
                <div className="text-xs font-mono tracking-widest text-text-muted uppercase pt-2">
                  {dateRange}
                </div>
                <div>
                  <h3 className="text-2xl font-medium tracking-tight text-text-primary mb-1">{exp.title}</h3>
                  <h4 className="text-lg text-text-secondary font-light mb-6">{exp.company}</h4>
                  {exp.description && (
                    <div className="text-text-secondary font-light leading-relaxed whitespace-pre-wrap">
                      {exp.description}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

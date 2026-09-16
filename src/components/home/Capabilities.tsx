import { type Technology } from "@/types/schema";
import { Reveal } from "@/components/ui/Reveal";

export default function Capabilities({ technologies }: { technologies: Technology[] }) {
  if (!technologies || technologies.length === 0) return null;

  // Group by category
  const grouped = technologies.reduce((acc, tech) => {
    const catName = tech.category || "Other";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-border/50">
      <Reveal>
        <div className="flex items-center gap-6 mb-16 md:mb-24">
          <h2 className="text-sm font-mono tracking-widest uppercase text-text-muted">Capabilities & Toolkit</h2>
        </div>
      </Reveal>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
        {Object.entries(grouped).map(([category, techs], index) => (
          <Reveal key={category} delay={index * 100}>
            <div>
              <h3 className="text-xl md:text-2xl font-medium tracking-tight text-text-primary mb-8 border-b border-border/50 pb-4">{category}</h3>
              <ul className="space-y-6">
                {techs.map((tech) => (
                  <li key={tech.id} className="flex flex-col">
                    <span className="text-lg text-text-primary font-medium tracking-tight">{tech.name}</span>
                    {tech.description && <span className="text-base text-text-secondary mt-1 font-light">{tech.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

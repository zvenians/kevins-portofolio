import { Reveal } from "@/components/ui/Reveal";
import { type Technology } from "@/types/schema";

interface CapabilitiesProps {
  technologies: Technology[];
}

export function Capabilities({ technologies }: CapabilitiesProps) {
  if (!technologies || technologies.length === 0) return null;

  // Group by category
  const grouped = technologies.reduce((acc, tech) => {
    const cat = tech.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  const categories = Object.keys(grouped).sort();

  return (
    <section className="py-24 md:py-40 bg-surface">
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-sm font-mono text-text-muted mb-24 uppercase tracking-wider">
            [02] Capabilities & Taxonomy
          </h2>
        </Reveal>

        <div className="flex flex-col gap-24">
          {categories.map((category, index) => (
            <Reveal key={category} delay={index * 100}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 border-t border-border pt-12">
                <div className="md:col-span-4 lg:col-span-3">
                  <h3 className="text-2xl md:text-3xl font-light text-text-primary tracking-tight capitalize">
                    {category}
                  </h3>
                </div>
                
                <div className="md:col-span-8 lg:col-span-9">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
                    {grouped[category].map((tech) => (
                      <div key={tech.id} className="flex flex-col gap-2">
                        <span className="text-lg md:text-xl text-text-primary font-medium">
                          {tech.name}
                        </span>
                        {tech.description && (
                          <span className="text-sm text-text-muted font-light leading-relaxed">
                            {tech.description}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/ui/Reveal";

interface SiteSettings {
  shortBio?: string;
  bio?: string;
}

interface PersonalContextProps {
  settings: SiteSettings | null;
}

export function PersonalContext({ settings }: PersonalContextProps) {
  if (!settings?.bio) return null;

  return (
    <section className="py-24 md:py-48">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Offset column for dramatic asymmetry */}
          <div className="md:col-span-2 lg:col-span-3">
            <Reveal>
              <div className="flex flex-col gap-4">
                <h2 className="text-sm font-mono text-text-muted uppercase tracking-wider">
                  [05] Context
                </h2>
                {settings.shortBio && (
                  <p className="text-sm text-text-muted max-w-[200px] leading-relaxed">
                    {settings.shortBio}
                  </p>
                )}
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-10 lg:col-span-8">
            <Reveal delay={0.2}>
              <div className="relative">
                <span className="absolute -left-8 md:-left-16 -top-8 text-8xl md:text-9xl text-surface-elevated font-serif leading-none">
                  &quot;
                </span>
                <p className="text-2xl md:text-4xl lg:text-5xl font-light text-text-primary leading-[1.3] md:leading-[1.4] tracking-tight relative z-10 whitespace-pre-wrap">
                  {settings.bio}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

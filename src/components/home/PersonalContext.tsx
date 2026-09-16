import { type SiteSettings } from "@/types/settings";
import { Reveal } from "@/components/ui/Reveal";

export default function PersonalContext({ settings }: { settings: SiteSettings | null }) {
  if (!settings || (!settings.shortBio && !settings.bio)) return null;

  return (
    <section id="about" className="py-24 md:py-40 px-6 md:px-12 max-w-4xl mx-auto">
      <Reveal>
        <h2 className="text-sm font-mono tracking-widest uppercase text-text-muted mb-12 text-center">About</h2>
      </Reveal>
      <Reveal delay={100}>
        <div className="space-y-8 text-center">
          {settings.bio && (
            <div className="text-xl md:text-3xl text-text-primary font-light leading-relaxed whitespace-pre-wrap">
              {settings.bio}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}

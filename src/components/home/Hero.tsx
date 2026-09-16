import { type SiteSettings } from "@/types/settings";
import { Reveal } from "@/components/ui/Reveal";

export default function Hero({ settings }: { settings: SiteSettings | null }) {
  if (!settings) return null;

  return (
    <section id="hero" className="py-32 md:py-48 lg:py-56 px-6 md:px-12 max-w-7xl mx-auto flex flex-col justify-center min-h-[70vh]">
      <Reveal>
        <span className="text-accent text-sm md:text-base font-mono uppercase tracking-widest mb-6 block">
          {settings.siteName || "Digital Experience"}
        </span>
      </Reveal>
      <Reveal delay={100}>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-text-primary leading-[1.05] max-w-5xl">
          {settings.tagline || settings.siteTitle}
        </h1>
      </Reveal>
      {settings.shortBio && (
        <Reveal delay={200}>
          <p className="mt-10 text-lg md:text-2xl text-text-secondary max-w-2xl font-light leading-relaxed">
            {settings.shortBio}
          </p>
        </Reveal>
      )}
    </section>
  );
}

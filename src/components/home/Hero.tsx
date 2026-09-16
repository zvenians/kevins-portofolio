import { type SiteSettings } from "@/types/settings";
import { Reveal } from "@/components/ui/Reveal";

export default function Hero({ settings }: { settings: SiteSettings | null }) {
  if (!settings) return null;

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col justify-center px-6 md:px-12 pt-24 pb-12 overflow-hidden">
      {/* Background ambient accents - very subtle */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-surface rounded-full blur-[120px] opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="max-w-[90vw] md:max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start gap-12 md:gap-24 relative z-10">
        
        {/* Main Typography */}
        <div className="flex-1 mt-12 md:mt-24">
          <Reveal delay={100}>
            <h1 className="text-[12vw] sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-[-0.04em] text-text-primary leading-[0.9] max-w-[14ch] text-balance">
              {settings.tagline || settings.siteTitle}
            </h1>
          </Reveal>
          
          {settings.shortBio && (
            <Reveal delay={300}>
              <p className="mt-12 text-lg md:text-xl lg:text-2xl text-text-secondary max-w-xl font-light leading-relaxed tracking-tight text-balance">
                {settings.shortBio}
              </p>
            </Reveal>
          )}
        </div>

        {/* Asymmetrical Metadata */}
        <div className="flex flex-col gap-8 md:gap-16 pt-4 md:pt-32 text-left md:text-right min-w-[200px]">
          <Reveal delay={400}>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">Location</span>
              <span className="text-sm text-text-primary">{settings.location || "Global"}</span>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">Status</span>
              <span className="text-sm text-text-primary flex items-center md:justify-end gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                {settings.availability || "Available for projects"}
              </span>
            </div>
          </Reveal>

          <Reveal delay={600}>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">Index</span>
              <span className="text-sm text-text-primary">{settings.siteName || "Digital Space"}</span>
            </div>
          </Reveal>
        </div>

      </div>

      {/* Scroll indicator */}
      <Reveal delay={800} className="absolute bottom-12 left-6 md:left-12">
        <div className="flex flex-col items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted -rotate-90 origin-left translate-y-8">Scroll</span>
          <div className="w-[1px] h-16 bg-border relative overflow-hidden mt-8">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-accent animate-[scrollDown_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </Reveal>
      
      {/* Scroll Animation Style */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollDown {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
      `}} />
    </section>
  );
}

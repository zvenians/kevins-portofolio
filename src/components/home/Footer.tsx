"use client";

import { Reveal } from "@/components/ui/Reveal";

interface SiteSettings {
  siteName?: string;
}

interface FooterProps {
  settings: SiteSettings | null;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-8 md:py-12 border-t border-border bg-background">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[10px] sm:text-xs text-text-muted tracking-widest uppercase">
            <div>
              &copy; {currentYear} {settings?.siteName || "Portfolio"}
            </div>
            
            <button 
              onClick={scrollToTop}
              className="hover:text-text-primary transition-colors flex items-center gap-2"
            >
              <span>Return to apex</span>
              <span className="transform -rotate-90 block">&rarr;</span>
            </button>
            
            <div className="hidden sm:block">
              All systems operational
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

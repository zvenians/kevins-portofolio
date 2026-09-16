import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";
import { type SiteSettings } from "@/types/settings";

interface ContactProps {
  settings: SiteSettings | null;
}

export function Contact({ settings }: ContactProps) {
  return (
    <section className="pt-24 pb-12 md:pt-40 md:pb-24 border-t border-border bg-surface">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Cinematic End Statement */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <Reveal>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-light text-text-primary tracking-tighter leading-none mb-12">
                  Initiate<br />
                  <span className="text-text-muted">Dialogue</span>
                </h2>
              </Reveal>
              
              <Reveal delay={0.1}>
                {settings?.email && (
                  <div className="mb-16">
                    <p className="text-sm font-mono text-text-muted mb-4 uppercase tracking-wider">
                      Direct Output
                    </p>
                    <a 
                      href={`mailto:${settings.email}`}
                      className="text-2xl md:text-3xl font-light hover:text-accent transition-colors inline-block pb-1 border-b border-transparent hover:border-accent"
                    >
                      {settings.email}
                    </a>
                  </div>
                )}
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              {settings?.socialLinks && settings.socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-8 mt-12 lg:mt-0">
                  {settings.socialLinks.map((socialString, index) => {
                    let label = socialString.replace(/^https?:\/\/(www\.)?/, '');
                    if (label.endsWith('/')) label = label.slice(0, -1);
                    return (
                      <a
                        key={index}
                        href={socialString}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors uppercase tracking-widest"
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              )}
            </Reveal>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.3}>
              <div className="bg-background p-8 md:p-12 border border-border">
                <p className="text-sm font-mono text-text-muted mb-8 uppercase tracking-wider">
                  System Input
                </p>
                <ContactForm />
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}

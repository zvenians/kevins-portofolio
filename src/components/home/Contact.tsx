import { type SiteSettings } from "@/types/settings";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";

export default function Contact({ settings }: { settings: SiteSettings | null }) {
  if (!settings) return null;

  return (
    <section id="contact" className="py-32 md:py-48 px-6 md:px-12 border-t border-border mt-24">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <Reveal>
          <h2 className="text-sm font-mono tracking-widest uppercase text-text-muted mb-6">Contact</h2>
          <h3 className="text-5xl md:text-7xl font-semibold tracking-tighter text-text-primary mb-12">Let&apos;s build something.</h3>
        </Reveal>
        
        {settings.email && (
          <Reveal delay={0.1}>
            <p className="text-lg text-text-secondary mb-4">
              Feel free to reach out directly at
            </p>
            <a 
              href={`mailto:${settings.email}`}
              className="text-xl md:text-2xl text-text-primary hover:text-text-secondary transition-colors border-b border-transparent hover:border-text-primary pb-1 inline-block"
            >
              {settings.email}
            </a>
          </Reveal>
        )}

        <Reveal delay={0.2} className="w-full">
          <ContactForm />
        </Reveal>

        {settings.socialLinks && settings.socialLinks.length > 0 && (
          <Reveal delay={0.2}>
            <ul className="flex flex-wrap justify-center gap-8">
              {settings.socialLinks.map((social, index) => {
                let name = social.replace(/^https?:\/\/(www\.)?/, '');
                if (name.endsWith('/')) name = name.slice(0, -1);
                return (
                <li key={index}>
                  <a 
                    href={social} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lg text-text-muted hover:text-text-primary transition-colors"
                  >
                    {name}
                  </a>
                </li>
              )})}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}

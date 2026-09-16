import { Reveal } from "@/components/ui/Reveal";

interface ResumeCTAProps {
  resumeUrl?: string;
}

export function ResumeCTA({ resumeUrl }: ResumeCTAProps) {
  if (!resumeUrl) return null;

  return (
    <section className="py-12 border-b border-border">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex justify-end">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 text-xs font-mono text-text-muted hover:text-text-primary transition-colors uppercase tracking-widest"
            >
              <span>Access Curriculum Vitae</span>
              <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                &rarr;
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

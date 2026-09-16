import { Reveal } from "@/components/ui/Reveal";

export default function ResumeCTA({ resumeUrl }: { resumeUrl?: string }) {
  if (!resumeUrl) return null;

  return (
    <section id="resume" className="py-24 px-6 md:px-12 flex justify-center">
      <Reveal>
        <a 
          href={resumeUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center px-10 py-5 text-xs font-mono font-semibold tracking-widest uppercase bg-text-primary text-background hover:bg-accent hover:text-white transition-colors"
        >
          View Full Resume <span className="ml-3 transform transition-transform group-hover:translate-x-1">→</span>
        </a>
      </Reveal>
    </section>
  );
}

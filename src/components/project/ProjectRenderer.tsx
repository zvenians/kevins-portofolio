import { type Project } from "@/types/schema";
import { ContentBlockRenderer } from "./blocks/ContentBlockRenderer";
import { Reveal } from "@/components/ui/Reveal";

interface Props {
  project: Project;
}

export function ProjectRenderer({ project }: Props) {
  return (
    <article className="overflow-x-hidden min-h-screen">
      {/* Project Hero */}
      <header className="px-6 md:px-12 w-full pt-40 md:pt-56 pb-24 md:pb-32">
        <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-24">
          <div className="md:w-3/4">
            <Reveal>
              {project.category && (
                <span className="text-xs font-mono uppercase tracking-widest mb-12 block text-text-muted">
                  [ {project.category} ]
                </span>
              )}
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-6xl sm:text-7xl md:text-[9rem] font-medium tracking-tighter mb-12 leading-[0.85] text-text-primary uppercase break-words">
                {project.title}
              </h1>
            </Reveal>
            <Reveal delay={200}>
              {(project.subtitle || project.description) && (
                <p className="text-2xl md:text-4xl text-text-secondary leading-tight max-w-4xl font-light">
                  {project.subtitle || project.description}
                </p>
              )}
            </Reveal>
          </div>

          <div className="md:w-1/4 flex flex-col justify-end">
            <Reveal delay={300}>
              <ProjectMeta project={project} />
            </Reveal>
          </div>
        </div>
      </header>

      {/* Cinematic Cover Media */}
      <Reveal delay={400} direction="none" className="w-full">
        {project.cover?.url ? (
          <figure className="w-full h-[60vh] md:h-[85vh] relative overflow-hidden bg-surface-elevated">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover.url}
              alt={project.cover.alt || project.title}
              className="w-full h-full object-cover scale-105"
              loading="eager"
              fetchPriority="high"
            />
            {project.cover.caption && (
              <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 mix-blend-difference">
                <figcaption className="text-xs font-mono tracking-widest text-white/70">
                  {project.cover.caption}
                </figcaption>
              </div>
            )}
          </figure>
        ) : (
          <div className="w-full h-[30vh] border-y border-border/30"></div>
        )}
      </Reveal>

      {/* Content Blocks */}
      {project.content && project.content.length > 0 && (
        <div className="py-24 md:py-48 max-w-[1400px] mx-auto">
          {project.content.map((block) => (
            <ContentBlockRenderer key={block.id} block={block} />
          ))}
        </div>
      )}
    </article>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  const metaItems: { label: string; value: string }[] = [];

  if (project.role) metaItems.push({ label: "Role", value: project.role });
  if (project.year) metaItems.push({ label: "Year", value: String(project.year) });
  if (project.duration) metaItems.push({ label: "Duration", value: project.duration });
  if (project.status) metaItems.push({ label: "Status", value: project.status });

  if (metaItems.length === 0) return null;

  return (
    <ul className="flex flex-col gap-6">
      {metaItems.map((item) => (
        <li key={item.label} className="border-t border-border/40 pt-4">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
              {"// "}{item.label}
            </span>
          <span className="block text-sm md:text-base text-text-primary font-light">
            {item.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

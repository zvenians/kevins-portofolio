import { type Project } from "@/types/schema";
import { ContentBlockRenderer } from "./blocks/ContentBlockRenderer";
import { Reveal } from "@/components/ui/Reveal";

interface Props {
  project: Project;
}

/**
 * Generic project renderer. Renders any published project from its structured data.
 * No slug-specific logic. No hardcoded content. Purely data-driven.
 */
export function ProjectRenderer({ project }: Props) {
  return (
    <article className="overflow-x-hidden">
      {/* Project Hero */}
      <header className="px-6 md:px-12 max-w-7xl mx-auto w-full pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-4xl">
          <Reveal>
            {project.category && (
              <span className="text-accent text-sm font-mono uppercase tracking-widest mb-6 block">
                {project.category}
              </span>
            )}
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-semibold tracking-tighter mb-8 leading-[1.05] text-text-primary">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            {(project.subtitle || project.description) && (
              <p className="text-xl md:text-3xl text-text-secondary leading-relaxed max-w-3xl font-light">
                {project.subtitle || project.description}
              </p>
            )}
          </Reveal>
        </div>

        {/* Project Metadata Bar */}
        <Reveal delay={300}>
          <ProjectMeta project={project} />
        </Reveal>
      </header>

      {/* Cover Media */}
      <Reveal delay={400} direction="none" className="w-full">
        {project.cover?.url && (
          <figure className="w-full bg-surface-elevated overflow-hidden border-y border-border/50">
            <div className="relative w-full" style={project.cover.width && project.cover.height ? { aspectRatio: `${project.cover.width}/${project.cover.height}` } : { minHeight: '50vh' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.cover.url}
                alt={project.cover.alt || project.title}
                width={project.cover.width}
                height={project.cover.height}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            {project.cover.caption && (
              <figcaption className="px-6 md:px-12 py-4 text-sm font-mono tracking-wider text-text-muted text-center border-b border-border/30">
                {project.cover.caption}
              </figcaption>
            )}
          </figure>
        )}
      </Reveal>

      {/* Content Blocks */}
      {project.content && project.content.length > 0 && (
        <div className="py-12 md:py-20">
          {project.content.map((block) => (
            <ContentBlockRenderer key={block.id} block={block} />
          ))}
        </div>
      )}
    </article>
  );
}

/**
 * Renders project metadata in a clean horizontal bar.
 */
function ProjectMeta({ project }: { project: Project }) {
  const metaItems: { label: string; value: string }[] = [];

  if (project.role) metaItems.push({ label: "Role", value: project.role });
  if (project.year) metaItems.push({ label: "Year", value: String(project.year) });
  if (project.duration) metaItems.push({ label: "Duration", value: project.duration });
  if (project.status) metaItems.push({ label: "Status", value: project.status });

  if (metaItems.length === 0) return null;

  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-4 mt-8 md:mt-12 pt-6 border-t border-border">
      {metaItems.map((item) => (
        <div key={item.label}>
          <dt className="text-xs font-mono uppercase tracking-wider text-text-muted mb-1">
            {item.label}
          </dt>
          <dd className="text-sm text-text-secondary capitalize">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

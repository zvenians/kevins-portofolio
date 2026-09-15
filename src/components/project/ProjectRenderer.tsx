import { type Project } from "@/types/schema";
import { ContentBlockRenderer } from "./blocks/ContentBlockRenderer";

interface Props {
  project: Project;
}

/**
 * Generic project renderer. Renders any published project from its structured data.
 * No slug-specific logic. No hardcoded content. Purely data-driven.
 */
export function ProjectRenderer({ project }: Props) {
  return (
    <article>
      {/* Project Hero */}
      <header className="px-6 md:px-12 max-w-7xl mx-auto w-full pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-4xl">
          {project.category && (
            <span className="text-accent text-xs md:text-sm font-mono uppercase tracking-wider mb-4 md:mb-6 block">
              {project.category}
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 md:mb-8 leading-[1.05]">
            {project.title}
          </h1>
          {(project.subtitle || project.description) && (
            <p className="text-lg sm:text-xl md:text-2xl text-text-secondary leading-relaxed max-w-3xl">
              {project.subtitle || project.description}
            </p>
          )}
        </div>

        {/* Project Metadata Bar */}
        <ProjectMeta project={project} />
      </header>

      {/* Cover Media */}
      {project.cover?.url && (
        <figure className="w-full bg-surface-elevated overflow-hidden border-y border-border">
          <div className="relative w-full" style={project.cover.width && project.cover.height ? { aspectRatio: `${project.cover.width}/${project.cover.height}` } : { minHeight: '50vh' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover.url}
              alt={project.cover.alt || project.title}
              width={project.cover.width}
              height={project.cover.height}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          {project.cover.caption && (
            <figcaption className="px-6 md:px-12 py-3 text-sm text-text-muted text-center">
              {project.cover.caption}
            </figcaption>
          )}
        </figure>
      )}

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

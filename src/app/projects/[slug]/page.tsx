import { Navigation } from "@/components/navigation/Navigation";
import { getProjectBySlug, getPublishedProjects } from "@/lib/firestore/projects";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const projects = await getPublishedProjects();
    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params (Firebase may not be configured):", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const project = await getProjectBySlug(resolvedParams.slug);
    
    if (!project) {
      return { title: "Not Found" };
    }

    return {
      title: project.title,
      description: project.description,
    };
  } catch (error) {
    return { title: "Project" };
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const resolvedParams = await params;
  let project;
  try {
    project = await getProjectBySlug(resolvedParams.slug);
  } catch {
    // console.error(error);
  }

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navigation />
      
      <main className="flex flex-col min-h-screen pt-24">
        {/* Project Hero */}
        <header className="px-6 md:px-12 max-w-7xl mx-auto w-full py-16 md:py-24">
          <div className="max-w-4xl">
            {project.category && (
              <span className="text-accent text-sm font-mono uppercase tracking-wider mb-6 block">
                {project.category}
              </span>
            )}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed">
              {project.subtitle || project.description}
            </p>
          </div>
        </header>

        {/* Cover Media */}
        {project.cover && (
          <div className="w-full h-[50vh] md:h-[80vh] bg-surface-elevated overflow-hidden border-y border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={project.cover.url} 
              alt={project.cover.alt || project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Project Content / Blocks (stubbed for now) */}
        <div className="px-6 md:px-12 max-w-4xl mx-auto w-full py-24">
          <div className="prose prose-invert prose-lg">
            <p className="text-text-secondary">{project.description}</p>
            {/* Dynamic blocks will be rendered here */}
            {project.content && project.content.length > 0 && (
              <div className="mt-12">
                {project.content.map((block) => (
                  <div key={block.id} className="my-8">
                    {/* Minimal block renderer for text type */}
                    {block.type === "text" && (
                      <div>
                        {block.title && <h2 className="text-2xl font-bold mb-4">{block.title}</h2>}
                        <div dangerouslySetInnerHTML={{ __html: block.body }} />
                      </div>
                    )}
                    {block.type === "image" && (
                      <div className="my-12">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={block.media.url} 
                          alt={block.media.alt || ""}
                          className="w-full rounded-lg"
                        />
                        {block.caption && <p className="text-sm text-text-muted mt-3 text-center">{block.caption}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

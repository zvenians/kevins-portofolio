import { Navigation } from "@/components/navigation/Navigation";
import { ProjectRenderer } from "@/components/project/ProjectRenderer";
import { ProjectNavigation } from "@/components/project/ProjectNavigation";
import { getProjectBySlug, getPublishedProjects } from "@/lib/firestore/projects";
import { notFound } from "next/navigation";
import { type Metadata } from "next";

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
  } catch {
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

    const title = project.title;
    const description = project.description;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        url: `/projects/${project.slug}`,
        ...(project.cover?.url && {
          images: [
            {
              url: project.cover.url,
              width: project.cover.width ?? 1200,
              height: project.cover.height ?? 630,
              alt: project.cover.alt || project.title,
            },
          ],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(project.cover?.url && { images: [project.cover.url] }),
      },
      alternates: {
        canonical: `/projects/${project.slug}`,
      },
    };
  } catch {
    return { title: "Project" };
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const resolvedParams = await params;
  let project;
  try {
    project = await getProjectBySlug(resolvedParams.slug);
  } catch {
    // Firebase not available
  }

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navigation />

      <main className="flex flex-col min-h-screen">
        <ProjectRenderer project={project} />
        <ProjectNavigation currentProjectId={project.id} />
      </main>
    </>
  );
}

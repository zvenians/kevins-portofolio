import { Navigation } from "@/components/navigation/Navigation";
import { ProjectRenderer } from "@/components/project/ProjectRenderer";
import { ProjectNavigation } from "@/components/project/ProjectNavigation";
import { getProjectBySlug } from "@/lib/firestore/projects";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

// ISR: serve from cache, revalidate in background every hour.
// On Cloud Run, every slug renders on-demand (no generateStaticParams needed).
// revalidatePath('/projects/[slug]') from admin actions forces immediate refresh.
export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const project = await getProjectBySlug(resolvedParams.slug);

    if (!project) {
      return { title: "Not Found" };
    }

    const title = project.title;
    const description = project.description;
    const url = `/projects/${project.slug}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        url,
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
        canonical: url, // Relative canonical that relies on metadataBase
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
  
  // Minimal JSON-LD based strictly on existing project data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    url: `${SITE_URL}/projects/${project.slug}`,
    ...(project.cover?.url && { image: project.cover.url }),
    ...(project.publishedAt && { datePublished: project.publishedAt.toISOString() }),
    ...(project.updatedAt && { dateModified: project.updatedAt.toISOString() }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />

      <main className="flex flex-col min-h-screen">
        <ProjectRenderer project={project} />
        <ProjectNavigation currentProjectId={project.id} />
      </main>
    </>
  );
}

import { Navigation } from "@/components/navigation/Navigation";
import { getFeaturedProjects } from "@/lib/firestore/projects";
import { type Project } from "@/types/schema";

export const revalidate = 3600; // Cache for 1 hour, or revalidate via API

export default async function Home() {
  // Gracefully handle missing env vars or empty DB during initial setup
  let featuredProjects: Project[] = [];
  try {
    featuredProjects = await getFeaturedProjects();
  } catch (error) {
    console.error("Failed to fetch featured projects (Firebase may not be configured yet):", error);
  }

  return (
    <>
      <Navigation />
      
      <main className="flex flex-col min-h-screen pt-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="py-20 md:py-32 flex flex-col items-start justify-center min-h-[70vh]">
          <p className="text-accent text-sm md:text-base font-mono mb-4 tracking-wider uppercase">
            Kevin Simatupang
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-primary leading-[1.1] mb-6">
            I build <br className="hidden md:block" />
            <span className="text-text-muted">digital experiences</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed mb-10">
            A personal portfolio and experimental platform focusing on premium, editorial, and cinematic interfaces.
          </p>
        </section>

        {/* Selected Projects */}
        <section className="py-20 border-t border-border">
          <h2 className="text-3xl font-bold mb-12 tracking-tight">Selected Work</h2>
          
          {featuredProjects.length === 0 ? (
            <p className="text-text-muted italic">Projects are currently being updated.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <article key={project.id} className="group cursor-pointer">
                  <div className="aspect-[4/3] bg-surface-elevated rounded-lg mb-6 overflow-hidden border border-border">
                    {/* Placeholder for project cover */}
                    {project.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={project.cover.url} 
                        alt={project.cover.alt || project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        No cover media
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-medium mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
                  <p className="text-text-secondary line-clamp-2">{project.description}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

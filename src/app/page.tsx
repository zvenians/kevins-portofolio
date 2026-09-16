import { Navigation } from "@/components/navigation/Navigation";
import { getFeaturedProjects } from "@/lib/firestore/projects";
import { getSiteSettings } from "@/lib/firestore/settings";
import { getFeaturedExperiments, getExperiences, getTechnologies } from "@/lib/firestore/home";

import Hero from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Capabilities } from "@/components/home/Capabilities";
import { Experiments } from "@/components/home/Experiments";
import { Experience } from "@/components/home/Experience";
import { PersonalContext } from "@/components/home/PersonalContext";
import { ResumeCTA } from "@/components/home/ResumeCTA";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";

import { Metadata } from "next";

export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    settings = await getSiteSettings();
  } catch {
    return {};
  }

  const title = settings?.defaultSeo?.title || settings?.siteTitle || "Kevin Simatupang | Digital Experience";
  const description = settings?.defaultSeo?.description || settings?.tagline || "Personal digital experience and professional portfolio of Kevin Simatupang.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(settings?.defaultSeo?.ogImage?.url && {
        images: [{ url: settings.defaultSeo.ogImage.url }],
      }),
    },
    twitter: {
      title,
      description,
      ...(settings?.defaultSeo?.ogImage?.url && {
        images: [settings.defaultSeo.ogImage.url],
      }),
    },
  };
}

export default async function Home() {
  // Fetch all data concurrently
  const [
    settings,
    featuredProjects,
    featuredExperiments,
    experiences,
    technologies,
  ] = await Promise.all([
    getSiteSettings().catch(() => null),
    getFeaturedProjects().catch(() => []),
    getFeaturedExperiments().catch(() => []),
    getExperiences().catch(() => []),
    getTechnologies().catch(() => []),
  ]);

  return (
    <>
      <Navigation />
      
      <main className="flex flex-col min-h-screen">
        <Hero settings={settings} />
        <SelectedWork projects={featuredProjects} />
        <Capabilities technologies={technologies} />
        <Experiments experiments={featuredExperiments} />
        <Experience experiences={experiences} />
        <PersonalContext settings={settings} />
        <ResumeCTA resumeUrl={settings?.resume?.file?.url} />
        <Contact settings={settings} />
        <Footer settings={settings} />
      </main>
    </>
  );
}

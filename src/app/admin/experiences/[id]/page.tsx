import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { getExperiences } from "@/lib/firestore/home";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  const items = await getExperiences();
  const item = items.find(i => i.id === params.id);
  
  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Edit Experience</h1>
      <ExperienceForm initialData={item} />
    </div>
  );
}
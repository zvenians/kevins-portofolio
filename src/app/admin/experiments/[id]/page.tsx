import { ExperimentForm } from "@/components/admin/ExperimentForm";
import { getExperiments } from "@/lib/firestore/home";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditExperimentPage({ params }: { params: { id: string } }) {
  const items = await getExperiments();
  const item = items.find(i => i.id === params.id);
  
  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Edit Experiment</h1>
      <ExperimentForm initialData={item} />
    </div>
  );
}
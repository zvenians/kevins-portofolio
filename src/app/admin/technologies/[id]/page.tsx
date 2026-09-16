import { TechnologyForm } from "@/components/admin/TechnologyForm";
import { getTechnologies } from "@/lib/firestore/home";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditTechnologyPage({ params }: { params: { id: string } }) {
  const items = await getTechnologies();
  const item = items.find(i => i.id === params.id);
  
  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Edit Technology</h1>
      <TechnologyForm initialData={item} />
    </div>
  );
}
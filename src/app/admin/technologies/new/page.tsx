import { TechnologyForm } from "@/components/admin/TechnologyForm";

export default function NewTechnologyPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">New Technology</h1>
      <TechnologyForm />
    </div>
  );
}
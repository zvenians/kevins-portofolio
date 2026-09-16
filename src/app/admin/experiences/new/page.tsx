import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">New Experience</h1>
      <ExperienceForm />
    </div>
  );
}
import { ExperimentForm } from "@/components/admin/ExperimentForm";

export default function NewExperimentPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">New Experiment</h1>
      <ExperimentForm />
    </div>
  );
}
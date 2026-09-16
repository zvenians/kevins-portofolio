import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/firestore/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
      <SettingsForm initialData={settings || undefined} />
    </div>
  );
}

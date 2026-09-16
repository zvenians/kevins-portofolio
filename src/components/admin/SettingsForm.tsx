"use client";

import { type SiteSettings } from "@/types/settings";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSiteSettings } from "@/app/admin/actions";
import { MediaPicker } from "./MediaPicker";

export function SettingsForm({ initialData }: { initialData?: SiteSettings }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<SiteSettings>>(
    initialData || {
      siteName: "",
      siteTitle: "",
      tagline: "",
      shortBio: "",
      bio: "",
      email: "",
      location: "",
      availability: "",
      socialLinks: [],
    }
  );

  const [socialLinksText, setSocialLinksText] = useState(
    initialData?.socialLinks?.join("\\n") || ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      socialLinks: socialLinksText.split("\\n").map(s => s.trim()).filter(s => s.length > 0),
    };

    try {
      await saveSiteSettings(payload);
      router.refresh();
      alert("Settings saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Error saving settings.\\n" + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="space-y-4 bg-surface-elevated p-6 rounded-lg border border-border">
        <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">General</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Site Name</label>
          <input type="text" value={formData.siteName || ''} onChange={(e) => setFormData({...formData, siteName: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Site Title (SEO)</label>
          <input type="text" value={formData.siteTitle || ''} onChange={(e) => setFormData({...formData, siteTitle: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tagline (Hero)</label>
          <input type="text" value={formData.tagline || ''} onChange={(e) => setFormData({...formData, tagline: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>
      </div>

      <div className="space-y-4 bg-surface-elevated p-6 rounded-lg border border-border">
        <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">Biography</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Short Bio (Hero)</label>
          <textarea value={formData.shortBio || ''} onChange={(e) => setFormData({...formData, shortBio: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded min-h-[80px]" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Full Bio (Personal Context)</label>
          <textarea value={formData.bio || ''} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded min-h-[150px]" />
        </div>
        <div className="pt-4 border-t border-border">
          <MediaPicker 
            folder="profile"
            currentAsset={formData.profileImage}
            onSelect={(asset) => setFormData({...formData, profileImage: asset || undefined})}
            accept="image/*"
            label="Profile Image"
          />
        </div>
      </div>

      <div className="space-y-4 bg-surface-elevated p-6 rounded-lg border border-border">
        <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">Contact & Social</h2>
        <div className="mb-4">
          <MediaPicker 
            folder="resume"
            currentAsset={formData.resume?.file}
            onSelect={(asset) => setFormData({...formData, resume: asset ? { file: asset, title: "Resume", updatedAt: new Date() } : undefined})}
            accept="application/pdf"
            label="Resume Document (PDF)"
          />
        </div>
        <div className="pt-4 border-t border-border">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input type="text" value={formData.location || ''} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Availability</label>
          <input type="text" value={formData.availability || ''} onChange={(e) => setFormData({...formData, availability: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Social Links (One per line)</label>
          <textarea 
            value={socialLinksText} 
            onChange={(e) => setSocialLinksText(e.target.value)} 
            placeholder="https://github.com/username&#10;https://linkedin.com/in/username"
            className="w-full px-3 py-2 bg-surface border border-border rounded min-h-[100px]" 
          />
        </div>
      </div>

      <div className="flex gap-4 sticky bottom-6 bg-background p-4 rounded-lg border border-border shadow-lg z-50">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-text-primary text-background rounded font-medium disabled:opacity-50">
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

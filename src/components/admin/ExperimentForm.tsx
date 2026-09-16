"use client";

import { type Experiment } from "@/types/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveExperiment, deleteExperiment } from "@/app/admin/actions";
import { MediaPicker } from "./MediaPicker";

export function ExperimentForm({ initialData }: { initialData?: Experiment }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Experiment>>(
    initialData || {
      id: crypto.randomUUID(),
      title: "",
      slug: "",
      description: "",
      order: 0,
      published: false,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveExperiment(formData, !initialData);
      router.push("/admin/experiments");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error saving experiment.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await deleteExperiment(initialData.id);
      router.push("/admin/experiments");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error deleting experiment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="space-y-4 bg-surface-elevated p-6 rounded-lg border border-border">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input type="text" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input type="text" value={formData.slug || ''} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded min-h-[100px]" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Live Link</label>
          <input type="url" value={formData.link || ''} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Repo URL</label>
          <input type="url" value={formData.repoUrl || ''} onChange={(e) => setFormData({...formData, repoUrl: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input type="text" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Order</label>
          <input type="number" value={formData.order || 0} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)||0})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>
        
        <div className="pt-4 border-t border-border">
          <MediaPicker 
            folder={`experiments/${formData.id}`}
            currentAsset={formData.cover}
            onSelect={(asset) => setFormData({...formData, cover: asset || undefined})}
            accept="image/*"
            label="Cover Image"
          />
        </div>

        <label className="flex items-center space-x-3 pt-4 border-t border-border">
          <input type="checkbox" checked={!!formData.published} onChange={(e) => setFormData({...formData, published: e.target.checked})} className="w-4 h-4" />
          <span>Published</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type="checkbox" checked={!!formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4" />
          <span>Featured</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type="checkbox" checked={!!formData.archived} onChange={(e) => setFormData({...formData, archived: e.target.checked})} className="w-4 h-4" />
          <span className="text-danger">Archived</span>
        </label>
      </div>

      <div className="flex gap-4 sticky bottom-6 bg-background p-4 rounded-lg border border-border shadow-lg justify-between z-50">
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-text-primary text-background rounded">Save</button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 bg-surface border border-border rounded">Cancel</button>
        </div>
        {initialData && (
          <button type="button" onClick={handleDelete} className="px-6 py-2 text-danger border border-danger rounded hover:bg-danger hover:text-white">Delete</button>
        )}
      </div>
    </form>
  );
}

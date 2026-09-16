"use client";

import { type Technology } from "@/types/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveTechnology, deleteTechnology } from "@/app/admin/actions";

export function TechnologyForm({ initialData }: { initialData?: Technology }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Technology>>(
    initialData || {
      id: crypto.randomUUID(),
      name: "",
      slug: "",
      order: 0,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveTechnology(formData, !initialData);
      router.push("/admin/technologies");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error saving technology.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await deleteTechnology(initialData.id);
      router.push("/admin/technologies");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error deleting technology.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="space-y-4 bg-surface-elevated p-6 rounded-lg border border-border">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input type="text" value={formData.slug || ''} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input type="text" value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded min-h-[100px]" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Website URL</label>
          <input type="url" value={formData.website || ''} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Order</label>
          <input type="number" value={formData.order || 0} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)||0})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>

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

"use client";

import { type Experience } from "@/types/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveExperience, deleteExperience } from "@/app/admin/actions";

export function ExperienceForm({ initialData }: { initialData?: Experience }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Experience>>(
    initialData || {
      id: crypto.randomUUID(),
      title: "",
      company: "",
      startDate: "",
      order: 0,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveExperience(formData, !initialData);
      router.push("/admin/experiences");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error saving experience.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await deleteExperience(initialData.id);
      router.push("/admin/experiences");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error deleting experience.");
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
          <label className="block text-sm font-medium mb-1">Company</label>
          <input type="text" value={formData.company || ''} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company URL</label>
          <input type="url" value={formData.companyUrl || ''} onChange={(e) => setFormData({...formData, companyUrl: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input type="text" value={formData.location || ''} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input type="text" placeholder="e.g. 2020 or Jan 2020" value={formData.startDate || ''} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input type="text" placeholder="e.g. 2022" value={formData.endDate || ''} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded" />
          </div>
        </div>
        <label className="flex items-center space-x-3">
          <input type="checkbox" checked={!!formData.current} onChange={(e) => setFormData({...formData, current: e.target.checked})} className="w-4 h-4" />
          <span>Current Role</span>
        </label>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded min-h-[100px]" />
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

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { type Project } from "@/types/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProject } from "@/app/admin/actions";
import { BlockEditor } from "./blocks/BlockEditor";

export function ProjectForm({ initialData }: { initialData?: Project }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>(
    initialData || {
      id: crypto.randomUUID(),
      title: "",
      slug: "",
      description: "",
      published: false,
      archived: false,
      featured: false,
      order: 0,
      content: [],
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveProject(formData, !initialData);
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error saving project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="space-y-4 bg-surface-elevated p-6 rounded-lg border border-border">
        <h2 className="text-xl font-bold mb-4">Basic Information</h2>
        
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-surface border border-border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-3 py-2 bg-surface border border-border rounded font-mono text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-surface border border-border rounded min-h-[100px]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Order</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 bg-surface border border-border rounded font-mono text-sm"
          />
        </div>
      </div>

      <div className="space-y-4 bg-surface-elevated p-6 rounded-lg border border-border">
        <h2 className="text-xl font-bold mb-4">Status & Visibility</h2>
        
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="w-4 h-4"
          />
          <span>Published (Visible to public if not archived)</span>
        </label>
        
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4"
          />
          <span>Featured (Shows on homepage)</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.archived}
            onChange={(e) => setFormData({ ...formData, archived: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-danger">Archived (Hides from public regardless of published status)</span>
        </label>
      </div>

      <div className="space-y-4 bg-surface-elevated p-6 rounded-lg border border-border">
        <h2 className="text-xl font-bold mb-4">Content Blocks</h2>
        <BlockEditor 
          projectId={formData.id!} 
          blocks={formData.content || []} 
          onChange={(blocks) => setFormData({ ...formData, content: blocks as any })}
        />
      </div>

      <div className="flex gap-4 sticky bottom-6 bg-background p-4 rounded-lg border border-border shadow-lg z-50">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-text-primary text-background font-medium rounded hover:bg-text-secondary disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Project"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-surface border border-border font-medium rounded hover:bg-surface-elevated"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

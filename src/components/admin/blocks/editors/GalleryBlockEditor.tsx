/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { type ContentBlock } from "@/types/schema";
import { MediaPicker } from "../../MediaPicker";

export function GalleryBlockEditor({ projectId, block, onChange }: { projectId: string, block: Extract<ContentBlock, { type: "gallery" }>, onChange: (b: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {block.items.map((item, idx) => (
          <div key={item.id} className="relative group rounded overflow-hidden border border-border aspect-video bg-surface">
            <img src={item.url} alt={item.alt || ""} className="w-full h-full object-cover" />
            <button type="button" className="absolute top-1 right-1 bg-danger text-white p-1 rounded opacity-0 group-hover:opacity-100"
              onClick={() => {
                const newItems = [...block.items];
                newItems.splice(idx, 1);
                onChange({ ...block, items: newItems });
              }}
            >X</button>
          </div>
        ))}
      </div>
      <MediaPicker folder={`projects/${projectId}`} accept="image/*" onSelect={(asset) => { if (asset) onChange({ ...block, items: [...block.items, asset] }) }} label="Add to Gallery" />
    </div>
  );
}

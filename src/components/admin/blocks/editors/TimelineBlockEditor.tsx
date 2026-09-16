/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { type ContentBlock } from "@/types/schema";
import { MediaPicker } from "../../MediaPicker";

export function TimelineBlockEditor({ projectId, block, onChange }: { projectId: string, block: Extract<ContentBlock, { type: "timeline" }>, onChange: (b: any) => void }) {
  return (
    <div className="space-y-6">
      <input type="text" value={block.title || ""} onChange={e => onChange({ ...block, title: e.target.value })} className="w-full p-2 bg-surface border rounded text-lg font-bold" placeholder="Timeline Title (Optional)" />
      
      <div className="space-y-4">
        {block.items.map((item, idx) => (
          <div key={idx} className="p-4 bg-surface rounded border border-border relative">
            <button type="button" onClick={() => {
              const newItems = [...block.items]; newItems.splice(idx, 1); onChange({ ...block, items: newItems });
            }} className="absolute top-2 right-2 text-danger text-sm hover:underline">Remove Item</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input type="text" value={item.date} onChange={e => {
                    const newItems = [...block.items]; newItems[idx].date = e.target.value; onChange({ ...block, items: newItems });
                  }} className="w-32 p-2 bg-background border rounded" placeholder="Date/Time" />
                  <input type="text" value={item.title} onChange={e => {
                    const newItems = [...block.items]; newItems[idx].title = e.target.value; onChange({ ...block, items: newItems });
                  }} className="flex-1 p-2 bg-background border rounded" placeholder="Title" />
                </div>
                <textarea value={item.description} onChange={e => {
                  const newItems = [...block.items]; newItems[idx].description = e.target.value; onChange({ ...block, items: newItems });
                }} className="w-full p-2 bg-background border rounded min-h-[100px]" placeholder="Description" />
              </div>
              <div>
                {item.media?.url ? (
                  <div className="relative bg-background rounded aspect-video overflow-hidden">
                    <img src={item.media.url} alt="Media" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => {
                      const newItems = [...block.items]; delete newItems[idx].media; onChange({ ...block, items: newItems });
                    }} className="absolute top-1 right-1 bg-danger text-white px-2 py-1 text-xs rounded">Remove Media</button>
                  </div>
                ) : (
                  <div className="h-full min-h-[150px] border border-dashed rounded flex items-center justify-center">
                    <MediaPicker folder={`projects/${projectId}`} accept="image/*,video/*" onSelect={(asset) => { if (asset) { const newItems = [...block.items]; newItems[idx].media = asset; onChange({ ...block, items: newItems }); } }} label="Select Media" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange({ ...block, items: [...block.items, { date: "", title: "", description: "" }] })} className="bg-surface px-4 py-2 rounded text-sm">+ Add Timeline Item</button>
    </div>
  );
}

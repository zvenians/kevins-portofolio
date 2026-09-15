/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { type ContentBlock } from "@/types/schema";

export function MetricsBlockEditor({ block, onChange }: { block: Extract<ContentBlock, { type: "metrics" }>, onChange: (b: any) => void }) {
  return (
    <div className="space-y-4">
      {block.items.map((item, idx) => (
        <div key={idx} className="flex gap-4 items-center bg-surface p-4 rounded">
          <input type="text" value={item.label} onChange={e => {
            const newItems = [...block.items]; newItems[idx].label = e.target.value; onChange({ ...block, items: newItems });
          }} className="flex-1 p-2 bg-background border rounded" placeholder="Label" />
          <input type="text" value={item.value} onChange={e => {
            const newItems = [...block.items]; newItems[idx].value = e.target.value; onChange({ ...block, items: newItems });
          }} className="w-32 p-2 bg-background border rounded" placeholder="Value" />
          <input type="text" value={item.description || ""} onChange={e => {
            const newItems = [...block.items]; newItems[idx].description = e.target.value; onChange({ ...block, items: newItems });
          }} className="flex-1 p-2 bg-background border rounded" placeholder="Description" />
          <button type="button" onClick={() => {
            const newItems = [...block.items]; newItems.splice(idx, 1); onChange({ ...block, items: newItems });
          }} className="text-danger">Del</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange({ ...block, items: [...block.items, { label: "", value: "" }] })} className="text-sm bg-surface p-2 rounded">+ Add Metric</button>
    </div>
  );
}

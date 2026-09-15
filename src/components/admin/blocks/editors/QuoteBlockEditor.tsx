/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { type ContentBlock } from "@/types/schema";

export function QuoteBlockEditor({ block, onChange }: { block: Extract<ContentBlock, { type: "quote" }>, onChange: (b: any) => void }) {
  return (
    <div className="space-y-4">
      <textarea value={block.quote} onChange={e => onChange({ ...block, quote: e.target.value })} className="w-full p-3 bg-surface border rounded" placeholder="Quote text..." required />
      <div className="flex gap-4">
        <input type="text" value={block.author || ""} onChange={e => onChange({ ...block, author: e.target.value })} className="flex-1 p-2 bg-surface border rounded" placeholder="Author" />
        <input type="text" value={block.role || ""} onChange={e => onChange({ ...block, role: e.target.value })} className="flex-1 p-2 bg-surface border rounded" placeholder="Role" />
      </div>
    </div>
  );
}

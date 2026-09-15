/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { type ContentBlock } from "@/types/schema";

export function EmbedBlockEditor({ block, onChange }: { block: Extract<ContentBlock, { type: "embed" }>, onChange: (b: any) => void }) {
  const providers = ["youtube", "vimeo", "figma", "github", "custom"];
  return (
    <div className="space-y-4">
      <select value={block.provider} onChange={e => onChange({ ...block, provider: e.target.value })} className="w-full p-2 bg-surface border rounded">
        {providers.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <input type="url" value={block.url} onChange={e => onChange({ ...block, url: e.target.value })} className="w-full p-2 bg-surface border rounded" placeholder="URL" required />
      <input type="text" value={block.title || ""} onChange={e => onChange({ ...block, title: e.target.value })} className="w-full p-2 bg-surface border rounded" placeholder="Title (Optional)" />
    </div>
  );
}

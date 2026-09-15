/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { type ContentBlock } from "@/types/schema";

export function CodeBlockEditor({ block, onChange }: { block: Extract<ContentBlock, { type: "code" }>, onChange: (b: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <input type="text" value={block.language} onChange={e => onChange({ ...block, language: e.target.value })} className="w-32 p-2 bg-surface border rounded" placeholder="Language" />
        <input type="text" value={block.filename || ""} onChange={e => onChange({ ...block, filename: e.target.value })} className="flex-1 p-2 bg-surface border rounded" placeholder="Filename (Optional)" />
      </div>
      <textarea value={block.code} onChange={e => onChange({ ...block, code: e.target.value })} className="w-full p-4 bg-surface border rounded font-mono text-sm min-h-[200px]" placeholder="Code..." />
      <input type="text" value={block.description || ""} onChange={e => onChange({ ...block, description: e.target.value })} className="w-full p-2 bg-surface border rounded" placeholder="Description (Optional)" />
    </div>
  );
}

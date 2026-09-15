/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { type ContentBlock } from "@/types/schema";
export function SpacerBlockEditor({ block, onChange }: { block: Extract<ContentBlock, { type: "spacer" }>, onChange: (b: any) => void }) {
  return (
    <select value={block.size} onChange={e => onChange({ ...block, size: e.target.value })} className="p-2 bg-surface rounded">
      <option value="small">Small</option>
      <option value="medium">Medium</option>
      <option value="large">Large</option>
    </select>
  );
}

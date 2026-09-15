/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { type ContentBlock } from "@/types/schema";

interface Props {
  block: Extract<ContentBlock, { type: "text" }>;
  onChange: (block: ContentBlock) => void;
}

export function TextBlockEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Eyebrow (Optional)</label>
          <input
            type="text"
            value={block.eyebrow || ""}
            onChange={(e) => onChange({ ...block, eyebrow: e.target.value })}
            className="w-full px-3 py-2 bg-surface border border-border rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Title (Optional)</label>
          <input
            type="text"
            value={block.title || ""}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
            className="w-full px-3 py-2 bg-surface border border-border rounded text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">Body (Markdown supported)</label>
        <textarea
          value={block.body}
          onChange={(e) => onChange({ ...block, body: e.target.value })}
          className="w-full px-3 py-2 bg-surface border border-border rounded min-h-[150px] font-mono text-sm"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Alignment</label>
          <select
            value={block.alignment || "left"}
            onChange={(e) => onChange({ ...block, alignment: e.target.value as any })}
            className="w-full px-3 py-2 bg-surface border border-border rounded text-sm"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Width</label>
          <select
            value={block.width || "medium"}
            onChange={(e) => onChange({ ...block, width: e.target.value as any })}
            className="w-full px-3 py-2 bg-surface border border-border rounded text-sm"
          >
            <option value="narrow">Narrow</option>
            <option value="medium">Medium</option>
            <option value="wide">Wide</option>
            <option value="full">Full</option>
          </select>
        </div>
      </div>
    </div>
  );
}

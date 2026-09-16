/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { type ContentBlock } from "@/types/schema";
import { MediaPicker } from "../../MediaPicker";

interface Props {
  projectId: string;
  block: Extract<ContentBlock, { type: "image" }>;
  onChange: (block: ContentBlock) => void;
}

export function ImageBlockEditor({ projectId, block, onChange }: Props) {
  return (
    <div className="space-y-4">
      {block.media.url ? (
        <div className="border border-border rounded p-4 flex gap-6 items-start bg-surface">
          <div className="w-48 h-32 relative bg-background rounded overflow-hidden flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.media.url} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Alt Text (Required for accessibility)</label>
              <input
                type="text"
                value={block.media.alt || ""}
                onChange={(e) => onChange({ ...block, media: { ...block.media, alt: e.target.value } })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Caption (Optional)</label>
              <input
                type="text"
                value={block.caption || ""}
                onChange={(e) => onChange({ ...block, caption: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={block.fullBleed || false}
                  onChange={(e) => onChange({ ...block, fullBleed: e.target.checked })}
                />
                Full Bleed
              </label>
            </div>
            <button
              type="button"
              onClick={() => onChange({ ...block, media: { ...block.media, url: "" } })}
              className="text-xs text-danger hover:underline"
            >
              Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-border p-8 rounded text-center">
          <MediaPicker folder={`projects/${projectId}`} accept="image/*" onSelect={(asset) => { if (asset) onChange({ ...block, media: asset }) }} label="Select Image" />
        </div>
      )}
    </div>
  );
}

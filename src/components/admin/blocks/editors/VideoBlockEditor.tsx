/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { type ContentBlock } from "@/types/schema";
import { MediaUploader } from "../../MediaUploader";

interface Props {
  projectId: string;
  block: Extract<ContentBlock, { type: "video" }>;
  onChange: (block: ContentBlock) => void;
}

export function VideoBlockEditor({ projectId, block, onChange }: Props) {
  return (
    <div className="space-y-4">
      {block.media.url ? (
        <div className="border border-border rounded p-4 flex gap-6 items-start bg-surface flex-col md:flex-row">
          <div className="w-full md:w-64 relative bg-background rounded overflow-hidden flex-shrink-0">
            <video src={block.media.url} controls className="w-full" poster={block.poster?.url} />
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Caption (Optional)</label>
              <input
                type="text"
                value={block.caption || ""}
                onChange={(e) => onChange({ ...block, caption: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={block.autoplay || false}
                  onChange={(e) => onChange({ ...block, autoplay: e.target.checked })}
                />
                Autoplay
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={block.muted || false}
                  onChange={(e) => onChange({ ...block, muted: e.target.checked })}
                />
                Muted
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={block.loop || false}
                  onChange={(e) => onChange({ ...block, loop: e.target.checked })}
                />
                Loop
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={block.controls ?? true}
                  onChange={(e) => onChange({ ...block, controls: e.target.checked })}
                />
                Controls
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Poster Image (Optional)</label>
              {block.poster?.url ? (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-12 bg-background rounded overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={block.poster.url} alt="Poster" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newBlock = { ...block };
                      delete newBlock.poster;
                      onChange(newBlock);
                    }}
                    className="text-xs text-danger"
                  >
                    Remove Poster
                  </button>
                </div>
              ) : (
                <MediaUploader 
                  projectId={projectId} 
                  accept="image/*"
                  onUploadComplete={(asset) => onChange({ ...block, poster: asset })} 
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => onChange({ ...block, media: { ...block.media, url: "" } })}
              className="text-xs text-danger hover:underline mt-2 inline-block"
            >
              Remove Video
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-border p-8 rounded text-center">
          <MediaUploader 
            projectId={projectId} 
            accept="video/*"
            onUploadComplete={(asset) => onChange({ ...block, media: asset })} 
          />
        </div>
      )}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { type ContentBlock, type MediaAsset } from "@/types/schema";
import { MediaUploader } from "../../MediaUploader";

export function ComparisonBlockEditor({ projectId, block, onChange }: { projectId: string, block: Extract<ContentBlock, { type: "comparison" }>, onChange: (b: any) => void }) {
  
  const renderSide = (side: "before" | "after", data: any) => (
    <div className="space-y-4 p-4 border border-border bg-surface rounded">
      <h3 className="font-bold uppercase text-sm">{side}</h3>
      <input type="text" value={data.label || ""} onChange={e => onChange({ ...block, [side]: { ...data, label: e.target.value } })} className="w-full p-2 bg-background border rounded" placeholder="Label" />
      <input type="text" value={data.description || ""} onChange={e => onChange({ ...block, [side]: { ...data, description: e.target.value } })} className="w-full p-2 bg-background border rounded" placeholder="Description" />
      {data.media?.url ? (
        <div className="relative bg-background rounded aspect-video overflow-hidden">
          <img src={data.media.url} alt="Media" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange({ ...block, [side]: { ...data, media: { id: "", type: "image", url: "", storagePath: "", createdAt: new Date() } } })} className="absolute top-1 right-1 bg-danger text-white px-2 py-1 text-xs rounded">Remove Media</button>
        </div>
      ) : (
        <div className="h-full min-h-[150px] border border-dashed rounded flex items-center justify-center">
          <MediaUploader projectId={projectId} accept="image/*" onUploadComplete={asset => onChange({ ...block, [side]: { ...data, media: asset } })} />
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderSide("before", block.before)}
      {renderSide("after", block.after)}
    </div>
  );
}

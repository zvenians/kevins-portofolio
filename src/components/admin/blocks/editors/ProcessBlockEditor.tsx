/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { type ContentBlock } from "@/types/schema";
import { MediaPicker } from "../../MediaPicker";

export function ProcessBlockEditor({ projectId, block, onChange }: { projectId: string, block: Extract<ContentBlock, { type: "process" }>, onChange: (b: any) => void }) {
  return (
    <div className="space-y-6">
      <input type="text" value={block.title || ""} onChange={e => onChange({ ...block, title: e.target.value })} className="w-full p-2 bg-surface border rounded text-lg font-bold" placeholder="Process Title (Optional)" />
      
      <div className="space-y-4">
        {block.steps.map((step, idx) => (
          <div key={idx} className="p-4 bg-surface rounded border border-border relative">
            <button type="button" onClick={() => {
              const newSteps = [...block.steps]; newSteps.splice(idx, 1); onChange({ ...block, steps: newSteps });
            }} className="absolute top-2 right-2 text-danger text-sm hover:underline">Remove Step</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input type="number" value={step.number || ""} onChange={e => {
                    const newSteps = [...block.steps]; newSteps[idx].number = parseInt(e.target.value) || undefined; onChange({ ...block, steps: newSteps });
                  }} className="w-20 p-2 bg-background border rounded" placeholder="No." />
                  <input type="text" value={step.title} onChange={e => {
                    const newSteps = [...block.steps]; newSteps[idx].title = e.target.value; onChange({ ...block, steps: newSteps });
                  }} className="flex-1 p-2 bg-background border rounded" placeholder="Step Title" />
                </div>
                <textarea value={step.description} onChange={e => {
                  const newSteps = [...block.steps]; newSteps[idx].description = e.target.value; onChange({ ...block, steps: newSteps });
                }} className="w-full p-2 bg-background border rounded min-h-[100px]" placeholder="Description" />
              </div>
              <div>
                {step.media?.url ? (
                  <div className="relative bg-background rounded aspect-video overflow-hidden">
                    <img src={step.media.url} alt="Media" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => {
                      const newSteps = [...block.steps]; delete newSteps[idx].media; onChange({ ...block, steps: newSteps });
                    }} className="absolute top-1 right-1 bg-danger text-white px-2 py-1 text-xs rounded">Remove Media</button>
                  </div>
                ) : (
                  <div className="h-full min-h-[150px] border border-dashed rounded flex items-center justify-center">
                    <MediaPicker folder={`projects/${projectId}`} accept="image/*,video/*" onSelect={(asset) => { if (asset) { const newSteps = [...block.steps]; newSteps[idx].media = asset; onChange({ ...block, steps: newSteps }); } }} label="Select Media" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange({ ...block, steps: [...block.steps, { title: "", description: "" }] })} className="bg-surface px-4 py-2 rounded text-sm">+ Add Step</button>
    </div>
  );
}

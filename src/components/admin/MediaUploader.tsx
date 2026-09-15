/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { type MediaAsset } from "@/types/schema";
import { uploadMediaAsset } from "@/lib/storage/mediaUpload";

interface Props {
  projectId: string;
  onUploadComplete: (asset: MediaAsset) => void;
  accept?: string;
}

export function MediaUploader({ projectId, onUploadComplete, accept = "image/*,video/*" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      if (!projectId) {
        throw new Error("Project ID is required. Please save the project draft first before uploading media.");
      }

      const asset = await uploadMediaAsset({
        projectId,
        file,
        onProgress: (p) => setProgress(Math.round(p)),
      });
      
      onUploadComplete(asset);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          disabled={uploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !projectId}
          className="px-4 py-2 bg-surface border border-border text-text-primary rounded text-sm hover:bg-surface-elevated disabled:opacity-50 transition-colors"
        >
          {uploading ? "Uploading..." : "Upload Media"}
        </button>
        {uploading && (
          <div className="text-sm text-text-secondary flex-1">
            <div className="w-full bg-surface border border-border rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1">{progress}%</div>
          </div>
        )}
      </div>
      {!projectId && (
        <p className="text-xs text-danger mt-1">Please save the project first to enable uploads.</p>
      )}
      {error && (
        <p className="text-sm text-danger mt-1">{error}</p>
      )}
    </div>
  );
}

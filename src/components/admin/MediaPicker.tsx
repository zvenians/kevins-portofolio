"use client";

import { useState, useRef, useEffect } from "react";
import { type MediaAsset } from "@/types/schema";
import { uploadMediaAsset } from "@/lib/storage/mediaUpload";
import { saveMediaAsset, fetchMediaAssets } from "@/app/admin/actions";

interface Props {
  folder: string;
  currentAsset?: MediaAsset | null;
  onSelect: (asset: MediaAsset | null) => void;
  accept?: string;
  label?: string;
}

export function MediaPicker({ folder, currentAsset, onSelect, accept = "image/*,video/*,application/pdf", label = "Media" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "library">("library");
  
  // Upload State
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Library State
  const [libraryAssets, setLibraryAssets] = useState<MediaAsset[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  const loadLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const assets = await fetchMediaAssets();
      setLibraryAssets(assets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === "library" && libraryAssets.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadLibrary();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeTab]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const asset = await uploadMediaAsset({
        folder,
        file,
        onProgress: (p) => setProgress(Math.round(p)),
      });
      
      await saveMediaAsset(asset);
      onSelect(asset);
      setIsOpen(false);
      
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload file";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">{label}</label>
      
      {currentAsset?.url ? (
        <div className="border border-border rounded p-4 flex gap-6 items-start bg-surface relative overflow-hidden">
          <div className="w-32 h-32 relative bg-background rounded flex items-center justify-center border border-border flex-shrink-0">
            {currentAsset.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentAsset.url} alt="Preview" className="w-full h-full object-cover rounded" />
            ) : currentAsset.type === "video" ? (
              <span className="text-xs font-mono text-text-secondary">VIDEO</span>
            ) : (
              <span className="text-xs font-mono text-text-secondary">DOCUMENT</span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs font-mono break-all text-text-secondary mb-4">{currentAsset.storagePath}</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="text-sm text-accent hover:underline"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="text-sm text-danger hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full py-8 border-2 border-dashed border-border rounded text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
        >
          Select or Upload {label}
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-elevated border border-border rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[85vh]">
            <div className="flex border-b border-border p-4 justify-between items-center">
              <h3 className="text-lg font-bold">Media Library</h3>
              <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text-primary">&times; Close</button>
            </div>
            
            <div className="flex border-b border-border px-4 gap-4">
              <button 
                type="button"
                className={`py-3 text-sm font-medium border-b-2 ${activeTab === 'library' ? 'border-text-primary text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
                onClick={() => setActiveTab('library')}
              >
                Library
              </button>
              <button 
                type="button"
                className={`py-3 text-sm font-medium border-b-2 ${activeTab === 'upload' ? 'border-text-primary text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
                onClick={() => setActiveTab('upload')}
              >
                Upload New
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "upload" && (
                <div className="flex flex-col items-center justify-center py-12">
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
                    disabled={uploading}
                    className="px-6 py-3 bg-text-primary text-background font-medium rounded hover:bg-text-secondary disabled:opacity-50 transition-colors"
                  >
                    {uploading ? "Uploading..." : "Select File to Upload"}
                  </button>
                  {uploading && (
                    <div className="mt-6 w-full max-w-xs text-sm text-text-secondary text-center">
                      <div className="w-full bg-surface border border-border rounded-full h-2 mb-2">
                        <div
                          className="bg-accent h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {progress}%
                    </div>
                  )}
                  {error && <p className="mt-4 text-sm text-danger">{error}</p>}
                </div>
              )}

              {activeTab === "library" && (
                <div>
                  {loadingLibrary ? (
                    <p className="text-center py-12 text-text-muted">Loading assets...</p>
                  ) : libraryAssets.length === 0 ? (
                    <p className="text-center py-12 text-text-muted">No media assets found in the library.</p>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                      {libraryAssets.map((asset) => (
                        <div 
                          key={asset.id} 
                          onClick={() => { onSelect(asset); setIsOpen(false); }}
                          className="aspect-square bg-surface border border-border rounded overflow-hidden cursor-pointer hover:border-accent group relative flex items-center justify-center"
                        >
                          {asset.type === "image" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={asset.url} alt="Library Item" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : asset.type === "video" ? (
                            <span className="text-xs font-mono text-text-secondary">VIDEO</span>
                          ) : (
                            <span className="text-xs font-mono text-text-secondary">DOCUMENT</span>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-background/90 p-1 text-[10px] font-mono truncate text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {asset.storagePath.split('/').pop()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

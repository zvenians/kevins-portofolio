"use client";

import { type ContentBlock } from "@/types/schema";
import { BlockItem } from "./BlockItem";
import { useState } from "react";

interface Props {
  projectId: string;
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export function BlockEditor({ projectId, blocks, onChange }: Props) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const blockTypes = [
    "text", "image", "video", "gallery", "quote", 
    "metrics", "process", "timeline", "code", 
    "embed", "comparison", "spacer"
  ] as const;

  const handleAddBlock = (type: typeof blockTypes[number]) => {
    const newBlock = createEmptyBlock(type);
    onChange([...blocks, newBlock]);
    setShowAddMenu(false);
  };

  const handleUpdateBlock = (index: number, updatedBlock: ContentBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    onChange(newBlocks);
  };

  const handleDeleteBlock = (index: number) => {
    if (confirm("Are you sure you want to delete this block?")) {
      const newBlocks = [...blocks];
      newBlocks.splice(index, 1);
      onChange(newBlocks);
    }
  };

  const handleDuplicateBlock = (index: number) => {
    const blockToDuplicate = blocks[index];
    const newBlock = { ...blockToDuplicate, id: crypto.randomUUID() };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange(newBlocks);
  };

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    // Swap
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  return (
    <div className="space-y-6">
      {blocks.length === 0 ? (
        <div className="p-8 border border-dashed border-border rounded-lg text-center text-text-muted">
          No content blocks yet. Add one to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <BlockItem
              key={block.id}
              block={block}
              index={index}
              totalBlocks={blocks.length}
              projectId={projectId}
              onUpdate={(b) => handleUpdateBlock(index, b)}
              onDelete={() => handleDeleteBlock(index)}
              onDuplicate={() => handleDuplicateBlock(index)}
              onMoveUp={() => handleMoveBlock(index, "up")}
              onMoveDown={() => handleMoveBlock(index, "down")}
            />
          ))}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full py-4 border border-dashed border-border text-text-secondary hover:text-text-primary hover:bg-surface hover:border-text-secondary transition-colors rounded-lg flex items-center justify-center font-medium"
        >
          + Add Content Block
        </button>

        {showAddMenu && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-surface-elevated border border-border p-4 rounded-lg shadow-xl z-10 grid grid-cols-2 md:grid-cols-4 gap-2">
            {blockTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleAddBlock(type)}
                className="px-3 py-2 text-sm text-left bg-surface hover:bg-border rounded capitalize text-text-primary transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function createEmptyBlock(type: string): ContentBlock {
  const id = crypto.randomUUID();
  switch (type) {
    case "text": return { id, type, body: "" };
    case "image": return { id, type, media: { id: "", type: "image", url: "", storagePath: "", createdAt: new Date() } };
    case "video": return { id, type, media: { id: "", type: "video", url: "", storagePath: "", createdAt: new Date() } };
    case "gallery": return { id, type, items: [] };
    case "quote": return { id, type, quote: "" };
    case "metrics": return { id, type, items: [] };
    case "process": return { id, type, steps: [] };
    case "timeline": return { id, type, items: [] };
    case "code": return { id, type, language: "typescript", code: "" };
    case "embed": return { id, type, provider: "youtube", url: "" };
    case "comparison": return { 
      id, type, 
      before: { media: { id: "", type: "image", url: "", storagePath: "", createdAt: new Date() } },
      after: { media: { id: "", type: "image", url: "", storagePath: "", createdAt: new Date() } }
    };
    case "spacer": return { id, type, size: "medium" };
    default: throw new Error(`Unknown block type: ${type}`);
  }
}

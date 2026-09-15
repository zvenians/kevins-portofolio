"use client";

import { type ContentBlock } from "@/types/schema";
import { BlockToolbar } from "./BlockToolbar";

// We will import specific editors
import { TextBlockEditor } from "./editors/TextBlockEditor";
import { ImageBlockEditor } from "./editors/ImageBlockEditor";
import { VideoBlockEditor } from "./editors/VideoBlockEditor";
import { GalleryBlockEditor } from "./editors/GalleryBlockEditor";
import { QuoteBlockEditor } from "./editors/QuoteBlockEditor";
import { MetricsBlockEditor } from "./editors/MetricsBlockEditor";
import { ProcessBlockEditor } from "./editors/ProcessBlockEditor";
import { TimelineBlockEditor } from "./editors/TimelineBlockEditor";
import { CodeBlockEditor } from "./editors/CodeBlockEditor";
import { EmbedBlockEditor } from "./editors/EmbedBlockEditor";
import { ComparisonBlockEditor } from "./editors/ComparisonBlockEditor";
import { SpacerBlockEditor } from "./editors/SpacerBlockEditor";

interface Props {
  block: ContentBlock;
  index: number;
  totalBlocks: number;
  projectId: string;
  onUpdate: (block: ContentBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function BlockItem({ block, index, totalBlocks, projectId, onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown }: Props) {
  
  const renderEditor = () => {
    switch (block.type) {
      case "text": return <TextBlockEditor block={block} onChange={onUpdate} />;
      case "image": return <ImageBlockEditor block={block} onChange={onUpdate} projectId={projectId} />;
      case "video": return <VideoBlockEditor block={block} onChange={onUpdate} projectId={projectId} />;
      case "gallery": return <GalleryBlockEditor block={block} onChange={onUpdate} projectId={projectId} />;
      case "quote": return <QuoteBlockEditor block={block} onChange={onUpdate} />;
      case "metrics": return <MetricsBlockEditor block={block} onChange={onUpdate} />;
      case "process": return <ProcessBlockEditor block={block} onChange={onUpdate} projectId={projectId} />;
      case "timeline": return <TimelineBlockEditor block={block} onChange={onUpdate} projectId={projectId} />;
      case "code": return <CodeBlockEditor block={block} onChange={onUpdate} />;
      case "embed": return <EmbedBlockEditor block={block} onChange={onUpdate} />;
      case "comparison": return <ComparisonBlockEditor block={block} onChange={onUpdate} projectId={projectId} />;
      case "spacer": return <SpacerBlockEditor block={block} onChange={onUpdate} />;
      default: return <div className="text-danger p-4">Unknown block type</div>;
    }
  };

  return (
    <div className="bg-surface-elevated border border-border rounded-lg overflow-hidden group">
      <BlockToolbar 
        type={block.type}
        index={index}
        totalBlocks={totalBlocks}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />
      <div className="p-4 md:p-6">
        {renderEditor()}
      </div>
    </div>
  );
}

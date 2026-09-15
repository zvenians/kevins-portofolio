"use client";

interface Props {
  type: string;
  index: number;
  totalBlocks: number;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function BlockToolbar({ type, index, totalBlocks, onDelete, onDuplicate, onMoveUp, onMoveDown }: Props) {
  return (
    <div className="bg-surface px-4 py-2 flex items-center justify-between border-b border-border">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-accent uppercase tracking-wider px-2 py-1 bg-accent/10 rounded">
          {type}
        </span>
        <span className="text-xs text-text-muted hidden md:inline">Block {index + 1} of {totalBlocks}</span>
      </div>

      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <button 
          type="button" 
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded disabled:opacity-30"
          aria-label="Move Up"
          title="Move Up"
        >
          ↑
        </button>
        <button 
          type="button" 
          onClick={onMoveDown}
          disabled={index === totalBlocks - 1}
          className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded disabled:opacity-30"
          aria-label="Move Down"
          title="Move Down"
        >
          ↓
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button 
          type="button" 
          onClick={onDuplicate}
          className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded"
          aria-label="Duplicate"
          title="Duplicate"
        >
          Dup
        </button>
        <button 
          type="button" 
          onClick={onDelete}
          className="p-1.5 text-danger hover:bg-danger/10 rounded"
          aria-label="Delete"
          title="Delete"
        >
          Del
        </button>
      </div>
    </div>
  );
}

import { type ContentBlock } from '@/types/schema';

type MetricsBlock = Extract<ContentBlock, { type: 'metrics' }>;

interface MetricsBlockRendererProps {
  block: MetricsBlock;
}

export function MetricsBlockRenderer({ block }: MetricsBlockRendererProps) {
  const { items } = block;

  if (!items || items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col p-6 bg-surface rounded-xl border border-border text-center shadow-sm">
          <span className="text-4xl md:text-5xl font-bold text-accent mb-2">{item.value}</span>
          <span className="text-lg font-medium text-text-primary mb-1">{item.label}</span>
          {item.description && (
            <span className="text-sm text-text-muted">{item.description}</span>
          )}
        </div>
      ))}
    </div>
  );
}

import { type ContentBlock } from '@/types/schema';

type ComparisonBlock = Extract<ContentBlock, { type: 'comparison' }>;

interface ComparisonBlockRendererProps {
  block: ComparisonBlock;
}

export function ComparisonBlockRenderer({ block }: ComparisonBlockRendererProps) {
  const { before, after } = block;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-8">
      <figure className="flex flex-col gap-3">
        <div className="relative rounded-lg overflow-hidden border border-border bg-surface-elevated">
          <div className="absolute top-4 left-4 bg-black/60 text-white backdrop-blur-md px-3 py-1 text-sm font-semibold rounded-full z-10">
            {before.label || 'Before'}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={before.media.url}
            alt={before.media.alt || before.label || 'Before image'}
            width={before.media.width}
            height={before.media.height}
            loading="lazy"
            className="w-full h-auto object-cover"
          />
        </div>
        {before.description && (
          <figcaption className="text-sm text-text-secondary px-2">
            {before.description}
          </figcaption>
        )}
      </figure>

      <figure className="flex flex-col gap-3">
        <div className="relative rounded-lg overflow-hidden border border-border bg-surface-elevated">
          <div className="absolute top-4 right-4 bg-accent text-white shadow-md px-3 py-1 text-sm font-semibold rounded-full z-10">
            {after.label || 'After'}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={after.media.url}
            alt={after.media.alt || after.label || 'After image'}
            width={after.media.width}
            height={after.media.height}
            loading="lazy"
            className="w-full h-auto object-cover"
          />
        </div>
        {after.description && (
          <figcaption className="text-sm text-text-secondary px-2 text-right md:text-left">
            {after.description}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

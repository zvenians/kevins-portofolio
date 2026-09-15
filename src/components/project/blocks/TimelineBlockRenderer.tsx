import { type ContentBlock } from '@/types/schema';

type TimelineBlock = Extract<ContentBlock, { type: 'timeline' }>;

interface TimelineBlockRendererProps {
  block: TimelineBlock;
}

export function TimelineBlockRenderer({ block }: TimelineBlockRendererProps) {
  const { title, items } = block;

  if (!items || items.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto w-full flex flex-col gap-8">
      {title && (
        <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
          {title}
        </h3>
      )}
      <div className="relative border-l-2 border-border ml-4 sm:ml-6 flex flex-col gap-10 py-4">
        {items.map((item, idx) => (
          <div key={idx} className="relative pl-8 sm:pl-10">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-accent"></div>
            <div className="flex flex-col gap-2">
              <time className="font-mono text-sm text-accent font-medium">
                {item.date}
              </time>
              <h4 className="text-xl font-semibold text-text-primary">{item.title}</h4>
              <p className="text-text-secondary leading-relaxed max-w-2xl">{item.description}</p>
              {item.media && (
                <div className="mt-4 max-w-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.media.url}
                    alt={item.media.alt || ''}
                    loading="lazy"
                    className="w-full h-auto rounded-lg object-cover bg-surface-elevated"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { type ContentBlock } from '@/types/schema';

type GalleryBlock = Extract<ContentBlock, { type: 'gallery' }>;

interface GalleryBlockRendererProps {
  block: GalleryBlock;
}

export function GalleryBlockRenderer({ block }: GalleryBlockRendererProps) {
  const { items, layout = 'grid', caption } = block;

  if (!items || items.length === 0) return null;

  const renderItems = (className: string, itemClassName?: string) => (
    <div className={className}>
      {items.map((item, idx) => (
        <div key={item.id || idx} className={itemClassName}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.alt || ''}
            width={item.width}
            height={item.height}
            loading="lazy"
            className="w-full h-auto rounded-lg bg-surface-elevated object-cover"
          />
        </div>
      ))}
    </div>
  );

  let galleryContent = null;
  switch (layout) {
    case 'masonry':
      galleryContent = renderItems('columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4', 'break-inside-avoid');
      break;
    case 'carousel':
      galleryContent = renderItems('flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4', 'flex-none w-[80vw] sm:w-[60vw] md:w-[40vw] snap-center');
      break;
    case 'list':
      galleryContent = renderItems('flex flex-col gap-8 max-w-4xl mx-auto');
      break;
    case 'grid':
    default:
      galleryContent = renderItems('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4');
      break;
  }

  return (
    <figure className="w-full flex flex-col gap-4">
      {galleryContent}
      {caption && (
        <figcaption className="text-center text-sm text-text-muted mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

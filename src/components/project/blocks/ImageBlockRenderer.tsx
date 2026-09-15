import { type ContentBlock } from '@/types/schema';

type ImageBlock = Extract<ContentBlock, { type: 'image' }>;

interface ImageBlockRendererProps {
  block: ImageBlock;
}

export function ImageBlockRenderer({ block }: ImageBlockRendererProps) {
  const { media, size = 'full', caption, fullBleed } = block;

  const widthClass = {
    small: 'max-w-sm',
    medium: 'max-w-3xl',
    large: 'max-w-5xl',
    full: 'max-w-none w-full',
  }[size];

  return (
    <figure className={`flex flex-col gap-3 mx-auto ${fullBleed ? 'w-full max-w-none' : widthClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.url}
        alt={media.alt || ''}
        width={media.width}
        height={media.height}
        loading="lazy"
        className={`bg-surface-elevated object-cover ${fullBleed ? 'rounded-none w-full' : 'rounded-lg w-full'}`}
      />
      {(caption || media.caption) && (
        <figcaption className="text-center text-sm text-text-muted">
          {caption || media.caption}
        </figcaption>
      )}
    </figure>
  );
}

import { type ContentBlock } from '@/types/schema';

type VideoBlock = Extract<ContentBlock, { type: 'video' }>;

interface VideoBlockRendererProps {
  block: VideoBlock;
}

export function VideoBlockRenderer({ block }: VideoBlockRendererProps) {
  const { media, autoplay, muted, loop, controls = true, poster, caption } = block;

  const posterUrl = poster?.url || media.posterUrl;
  const isAutoplay = Boolean(autoplay && muted);

  return (
    <figure className="flex flex-col gap-3 mx-auto w-full max-w-5xl">
      <video
        src={media.url}
        poster={posterUrl}
        controls={controls}
        autoPlay={isAutoplay}
        muted={muted}
        loop={loop}
        playsInline={isAutoplay}
        preload={isAutoplay ? 'auto' : 'none'}
        className="w-full rounded-lg bg-surface-elevated object-cover shadow-sm"
      />
      {(caption || media.caption) && (
        <figcaption className="text-center text-sm text-text-muted">
          {caption || media.caption}
        </figcaption>
      )}
    </figure>
  );
}

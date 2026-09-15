/* Server Component - no client-side state needed */

import { type ContentBlock } from '@/types/schema';

type EmbedBlock = Extract<ContentBlock, { type: 'embed' }>;

interface EmbedBlockRendererProps {
  block: EmbedBlock;
}

export function EmbedBlockRenderer({ block }: EmbedBlockRendererProps) {
  const { provider, url, title } = block;

  // Validate https
  if (!url.startsWith('https://')) {
    return null;
  }

  let embedUrl = url;
  let isIframe = true;

  if (provider === 'youtube') {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      embedUrl = `https://www.youtube-nocookie.com/embed/${videoIdMatch[1]}`;
    }
  } else if (provider === 'vimeo') {
    const vimeoIdMatch = url.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/);
    if (vimeoIdMatch && vimeoIdMatch[1]) {
      embedUrl = `https://player.vimeo.com/video/${vimeoIdMatch[1]}`;
    }
  } else if (provider === 'github') {
    isIframe = false;
  } else if (provider === 'custom') {
    // leave as is, already checked https
  } else if (provider === 'figma') {
    embedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
  } else {
    // unknown provider
    return null;
  }

  return (
    <figure className="w-full max-w-4xl mx-auto flex flex-col gap-3">
      {title && (
        <figcaption className="text-lg font-semibold text-text-primary text-center">
          {title}
        </figcaption>
      )}
      {isIframe ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-surface-elevated shadow-sm border border-border">
          <iframe
            src={embedUrl}
            title={title || `${provider} embed`}
            className="absolute top-0 left-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex p-6 rounded-lg border border-border bg-surface hover:bg-surface-elevated transition-colors items-center gap-4 text-text-primary"
        >
          <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span className="font-medium truncate">{title || url}</span>
        </a>
      )}
    </figure>
  );
}

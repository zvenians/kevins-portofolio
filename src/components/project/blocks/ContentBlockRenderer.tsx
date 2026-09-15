import { type ContentBlock } from '@/types/schema';
import { TextBlockRenderer } from './TextBlockRenderer';
import { ImageBlockRenderer } from './ImageBlockRenderer';
import { VideoBlockRenderer } from './VideoBlockRenderer';
import { GalleryBlockRenderer } from './GalleryBlockRenderer';
import { QuoteBlockRenderer } from './QuoteBlockRenderer';
import { MetricsBlockRenderer } from './MetricsBlockRenderer';
import { ProcessBlockRenderer } from './ProcessBlockRenderer';
import { TimelineBlockRenderer } from './TimelineBlockRenderer';
import { CodeBlockRenderer } from './CodeBlockRenderer';
import { EmbedBlockRenderer } from './EmbedBlockRenderer';
import { ComparisonBlockRenderer } from './ComparisonBlockRenderer';
import { SpacerBlockRenderer } from './SpacerBlockRenderer';

interface ContentBlockRendererProps {
  block: ContentBlock;
}

export function ContentBlockRenderer({ block }: ContentBlockRendererProps) {
  const renderBlock = () => {
    switch (block.type) {
      case 'text':
        return <TextBlockRenderer block={block} />;
      case 'image':
        return <ImageBlockRenderer block={block} />;
      case 'video':
        return <VideoBlockRenderer block={block} />;
      case 'gallery':
        return <GalleryBlockRenderer block={block} />;
      case 'quote':
        return <QuoteBlockRenderer block={block} />;
      case 'metrics':
        return <MetricsBlockRenderer block={block} />;
      case 'process':
        return <ProcessBlockRenderer block={block} />;
      case 'timeline':
        return <TimelineBlockRenderer block={block} />;
      case 'code':
        return <CodeBlockRenderer block={block} />;
      case 'embed':
        return <EmbedBlockRenderer block={block} />;
      case 'comparison':
        return <ComparisonBlockRenderer block={block} />;
      case 'spacer':
        return <SpacerBlockRenderer block={block} />;
      default:
        // Graceful degradation for unknown block types
        return null;
    }
  };

  const content = renderBlock();

  if (!content) return null;

  // Spacer doesn't need a section wrapper to keep layout clean, but we wrap others.
  if (block.type === 'spacer') {
    return content;
  }

  return (
    <section key={block.id} className="w-full px-4 md:px-8 py-4 md:py-8">
      {content}
    </section>
  );
}

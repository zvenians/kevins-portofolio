import { type ContentBlock } from '@/types/schema';

type TextBlock = Extract<ContentBlock, { type: 'text' }>;

interface TextBlockRendererProps {
  block: TextBlock;
}

export function TextBlockRenderer({ block }: TextBlockRendererProps) {
  const { eyebrow, title, body, alignment = 'left', width = 'medium' } = block;

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment];

  const widthClass = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-5xl',
    full: 'max-w-none',
  }[width];

  const paragraphs = body ? body.split('\n\n').filter(Boolean) : [];

  return (
    <div className={`mx-auto w-full ${widthClass} ${alignClass} flex flex-col gap-4`}>
      {eyebrow && (
        <span className="font-mono text-sm uppercase tracking-wider text-accent">
          {eyebrow}
        </span>
      )}
      {title && (
        <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
          {title}
        </h2>
      )}
      {paragraphs.length > 0 && (
        <div className="flex flex-col gap-4 text-lg text-text-secondary">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}

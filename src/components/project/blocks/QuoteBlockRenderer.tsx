import { type ContentBlock } from '@/types/schema';

type QuoteBlock = Extract<ContentBlock, { type: 'quote' }>;

interface QuoteBlockRendererProps {
  block: QuoteBlock;
}

export function QuoteBlockRenderer({ block }: QuoteBlockRendererProps) {
  const { quote, author, role } = block;

  return (
    <blockquote className="mx-auto max-w-4xl border-l-4 border-accent pl-6 py-4 sm:pl-8 sm:py-6 bg-surface/50 rounded-r-lg">
      <p className="text-2xl font-serif italic text-text-primary md:text-3xl leading-relaxed mb-6">
        &ldquo;{quote}&rdquo;
      </p>
      {(author || role) && (
        <footer className="flex flex-col gap-1">
          {author && <cite className="font-semibold text-text-primary not-italic">{author}</cite>}
          {role && <span className="text-sm text-text-secondary">{role}</span>}
        </footer>
      )}
    </blockquote>
  );
}

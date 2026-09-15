import { type ContentBlock } from '@/types/schema';

type CodeBlock = Extract<ContentBlock, { type: 'code' }>;

interface CodeBlockRendererProps {
  block: CodeBlock;
}

export function CodeBlockRenderer({ block }: CodeBlockRendererProps) {
  const { language, code, filename, description } = block;

  return (
    <figure className="w-full max-w-4xl mx-auto flex flex-col gap-3">
      <div className="rounded-xl overflow-hidden bg-[#1e1e1e] border border-border shadow-md">
        {(filename || language) && (
          <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/10 text-xs font-mono">
            {filename ? (
              <span className="text-text-secondary">{filename}</span>
            ) : (
              <span className="opacity-0">File</span>
            )}
            <span className="text-accent/80 uppercase">{language}</span>
          </div>
        )}
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm font-mono leading-relaxed text-[#d4d4d4] tab-size-2">
            <code className={`language-${language}`}>
              {code}
            </code>
          </pre>
        </div>
      </div>
      {description && (
        <figcaption className="text-center text-sm text-text-muted mt-1">
          {description}
        </figcaption>
      )}
    </figure>
  );
}

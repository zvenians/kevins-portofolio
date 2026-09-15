import { type ContentBlock } from '@/types/schema';

type ProcessBlock = Extract<ContentBlock, { type: 'process' }>;

interface ProcessBlockRendererProps {
  block: ProcessBlock;
}

export function ProcessBlockRenderer({ block }: ProcessBlockRendererProps) {
  const { title, steps } = block;

  if (!steps || steps.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto w-full flex flex-col gap-8">
      {title && (
        <h3 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-4">
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-8">
        {steps.map((step, idx) => {
          const num = step.number || (idx + 1).toString();
          return (
            <div key={idx} className="flex flex-col md:flex-row gap-6 items-start bg-surface p-6 rounded-xl border border-border relative">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center text-accent font-bold text-xl">
                {num}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <h4 className="text-xl font-semibold text-text-primary">{step.title}</h4>
                <p className="text-text-secondary leading-relaxed">{step.description}</p>
              </div>
              {step.media && (
                <div className="w-full md:w-48 flex-shrink-0 mt-4 md:mt-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.media.url}
                    alt={step.media.alt || ''}
                    loading="lazy"
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

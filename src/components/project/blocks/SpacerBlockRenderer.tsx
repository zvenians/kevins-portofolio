import { type ContentBlock } from '@/types/schema';

type SpacerBlock = Extract<ContentBlock, { type: 'spacer' }>;

interface SpacerBlockRendererProps {
  block: SpacerBlock;
}

export function SpacerBlockRenderer({ block }: SpacerBlockRendererProps) {
  const { size } = block;

  const sizeClass = {
    small: 'py-6 md:py-8',
    medium: 'py-12 md:py-16',
    large: 'py-20 md:py-24',
  }[size];

  return <div aria-hidden="true" className={`w-full ${sizeClass}`} />;
}

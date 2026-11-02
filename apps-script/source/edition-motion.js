import { animate } from 'motion/mini';

export function introduce(element) {
  if (!element || element.dataset.introduced || !element.animate ||
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('reduced')) return;
  element.dataset.introduced = 'true';
  animate(element, { transform: ['perspective(950px) rotateY(12deg) translateY(16px)', 'perspective(950px) rotateY(0deg) translateY(0px)'] },
    { duration: 0.55, ease: [0.2, 0.75, 0.2, 1] });
}

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { JSDOM } from 'jsdom';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Cinematic v4.4 liquid-glass project stack', () => {
  const source = read('vercel-site/public/atelier/index.js');
  const css = read('vercel-site/public/atelier/experience.css');
  const projects = JSON.parse(read('vercel-site/generated/fallback.json')).projects;
  const start = source.indexOf('function picks() {');
  const finish = source.indexOf('\nfunction brands() {', start);

  it('renders six authentic project screenshots without manual arrow controls', () => {
    const markup = runInNewContext(source.slice(start, finish) + '\npicks();', {
      projects,
      t: (key: string) => key,
      esc: (value: string) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;'),
      icon: () => '<svg aria-hidden="true"></svg>',
      cover: (project: { coverUrl?: string }) => project.coverUrl || '/project-shots/fallback.webp'
    }) as string;
    const doc = new JSDOM(markup).window.document;
    const cards = [...doc.querySelectorAll<HTMLAnchorElement>('.folio-cycle a.showpiece')];
    expect(cards).toHaveLength(6);
    expect(doc.querySelector('[data-folio-next], [data-folio-prev], [data-folio-motion]')).toBeNull();
    expect(cards.map(card => card.style.getPropertyValue('--folio-index'))).toEqual(['0','1','2','3','4','5']);
    for (const card of cards) {
      const src = card.querySelector('img')?.getAttribute('src');
      expect(src).toMatch(/^\/project-shots\//);
      expect(existsSync(resolve(process.cwd(), 'vercel-site/public', src!.slice(1)))).toBe(true);
    }
  });

  it('centers the preview stage and advances the folio in 1.1 seconds', () => {
    expect(source).toContain('setTimeout(() => { show(active + 1); resume(); }, 1100)');
    expect(source).toContain("folio.addEventListener('pointermove', move)");
    expect(source).toContain("folio.addEventListener('keydown', keydown)");
    expect(css).toContain('transition:transform .61s');
    expect(css).toContain('animation-duration:1.1s');
    expect(css).toContain('left:50%!important');
    expect(css).toContain('perspective(1100px) translate3d(-50%,calc(var(--stack-y)');
  });

  it('starts autoplay at mount without viewport/hover gates and retires the motion checkbox', () => {
    const folio = source.slice(source.indexOf('function mountProjectFolio()'), source.indexOf('function mountDemoTheatre()'));
    expect(folio).toMatch(/show\(0\);\r?\n  resume\(\);/);
    expect(folio).not.toContain('IntersectionObserver');
    expect(folio).not.toContain('pointerenter');
    expect(folio).not.toContain('focusin');
    expect(folio).not.toContain('document.hidden');
    expect(source).not.toContain('id="motion"');
    expect(css).not.toContain('data-motion=reduced');
  });
});

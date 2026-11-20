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

  it('renders seven authentic project screenshots with manual arrow controls', () => {
    const markup = runInNewContext(source.slice(start, finish) + '\npicks();', {
      projects,
      t: (key: string) => key,
      esc: (value: string) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;'),
      icon: () => '<svg aria-hidden="true"></svg>',
      cover: (project: { coverUrl?: string }) => project.coverUrl || '/project-shots/fallback.webp'
    }) as string;
    const doc = new JSDOM(markup).window.document;
    const cards = [...doc.querySelectorAll<HTMLAnchorElement>('.folio-cycle a.showpiece')];
    expect(cards).toHaveLength(7);
    expect(doc.querySelector('[data-folio-next]')).not.toBeNull();
    expect(doc.querySelector('[data-folio-prev]')).not.toBeNull();
    expect(doc.querySelector('output')?.textContent).toBe('01 / 07');
    expect(cards.map(card => card.style.getPropertyValue('--folio-index'))).toEqual(['0','1','2','3','4','5','6']);
    for (const card of cards) {
      const src = card.querySelector('img')?.getAttribute('src');
      expect(src).toMatch(/^\/project-shots\//);
      expect(existsSync(resolve(process.cwd(), 'vercel-site/public', src!.slice(1)))).toBe(true);
    }
  });

  it('centers the preview stage and advances on visitor input', () => {
    expect(source).toContain("folio.querySelector('[data-folio-next]').onclick");
    expect(source).toContain("folio.addEventListener('pointermove', move)");
    expect(source).toContain("folio.addEventListener('keydown', keydown)");
    expect(css).toContain('transition:transform .61s');
    expect(css).not.toContain('animation-duration:1.1s');
    expect(css).toContain('left:50%!important');
    expect(css).toContain('perspective(1100px) translate3d(-50%,calc(var(--stack-y)');
  });

  it('starts on the first project without autoplay and retires the motion checkbox', () => {
    const folio = source.slice(source.indexOf('function mountProjectFolio()'), source.indexOf('function mountDemoTheatre()'));
    expect(folio).toContain('show(0);');
    expect(folio).not.toContain('setTimeout(() => { show(active + 1)');
    expect(folio).not.toContain('IntersectionObserver');
    expect(folio).not.toContain('pointerenter');
    expect(folio).not.toContain('focusin');
    expect(folio).not.toContain('document.hidden');
    expect(source).not.toContain('id="motion"');
    expect(css).not.toContain('data-motion=reduced');
  });
});

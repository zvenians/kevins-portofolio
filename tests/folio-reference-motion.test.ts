import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { JSDOM } from 'jsdom';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Real project folio uses straight, interactive screenshot cards', () => {
  const source = read('vercel-site/public/atelier/index.js');
  const css = read('vercel-site/public/atelier/mobile-ui.css');
  const projects = JSON.parse(read('vercel-site/generated/fallback.json')).projects;

  const start = source.indexOf('function picks() {');
  const finish = source.indexOf('\nfunction brands() {', start);

  it('renders six distinct keyboard-accessible previews', () => {
    expect(start).toBeGreaterThanOrEqual(0);
    expect(finish).toBeGreaterThan(start);
    const markup = runInNewContext(source.slice(start, finish) + '\npicks();', {
      projects,
      t: (key: string) => key,
      esc: (value: string) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;'),
      icon: () => '<svg aria-hidden="true"></svg>'
    }) as string;
    const doc = new JSDOM(markup).window.document;
    const cycles = [...doc.querySelectorAll('.folio-cycle')];
    expect(cycles).toHaveLength(1);
    expect(cycles[0].querySelectorAll('a.showpiece')).toHaveLength(6);
    const first = [...cycles[0].querySelectorAll<HTMLAnchorElement>('a')];
    expect(first.map(a => a.style.getPropertyValue('--folio-index'))).toEqual(['0','1','2','3','4','5']);
    expect(first.every(a => a.getAttribute('tabindex') !== '-1')).toBe(true);
    expect(first[1].querySelector('img')?.getAttribute('src')).toBe('/project-shots/wedding-demo-live.png');
    for (const image of first.map(a => a.querySelector('img'))) {
      expect(image?.getAttribute('src')).toMatch(/^\/project-shots\//);
      expect(existsSync(resolve(process.cwd(), 'vercel-site/public', image!.getAttribute('src')!.slice(1)))).toBe(true);
    }
  });

  it('supports autoplay, pointer drag and accessible controls', () => {
    expect(source).toContain('setTimeout(() => { show(active + 1); resume(); }, 6200)');
    expect(source).toContain("folio.addEventListener('pointermove', move)");
    expect(source).toContain("folio.querySelector('[data-folio-next]').onclick");
    expect(css).toContain('calc(var(--stack-offset,0) * 82px + var(--gesture-y))');
    expect(css).toContain('transition:transform .54s');
  });

  it('stops autoplay and transitions in reduced motion', () => {
    expect(css).toContain('@media(prefers-reduced-motion:reduce)');
    expect(css).toContain('html[data-motion=reduced] .project-folio .showpiece{transition:none!important;}');
    expect(source).toContain('if (!reduced) timer = setTimeout');
  });
});

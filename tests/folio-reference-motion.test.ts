import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { JSDOM } from 'jsdom';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Real project folio matches the diagonal motion reference', () => {
  const source = read('vercel-site/public/atelier/index.js');
  const css = read('vercel-site/public/atelier/mobile-ui.css');
  const projects = JSON.parse(read('vercel-site/generated/fallback.json')).projects;

  const start = source.indexOf('function picks() {');
  const finish = source.indexOf('\nfunction brands() {', start);

  it('renders six distinct keyboard-accessible previews in one rigid fan', () => {
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
    expect(new Set(first.map(a => a.style.getPropertyValue('--folio-angle'))).size).toBe(6);
    expect(new Set(first.map(a => a.style.getPropertyValue('--folio-top'))).size).toBe(6);
    expect(new Set(first.map(a => a.style.getPropertyValue('--folio-left'))).size).toBeGreaterThan(1);
    expect(first.every(a => a.getAttribute('tabindex') !== '-1')).toBe(true);
    expect(first[1].querySelector('img')?.getAttribute('src')).toBe('/project-shots/wedding-demo-live.png');
    for (const image of first.map(a => a.querySelector('img'))) {
      expect(image?.getAttribute('src')).toMatch(/^\/project-shots\//);
      expect(existsSync(resolve(process.cwd(), 'vercel-site/public', image!.getAttribute('src')!.slice(1)))).toBe(true);
    }
  });

  it('uses the calibrated hold-rise-hold-return cycle without a conveyor', () => {
    expect(css).not.toContain('folio-conveyor');
    expect(css).toContain('folio-reference 5.6s');
    expect(css).toContain('39.285714%,57.142857%');
    expect(css).not.toContain('@keyframes folio-drift');
    expect(css).not.toContain('@keyframes folio-breathe');
    expect(source).not.toContain('data-folio-motion');
    expect(css).toContain('rotate(var(--folio-angle))');
  });

  it('keeps the same angled fan in reduced motion, with no nested scrollbar', () => {
    expect(css).toContain('@media(prefers-reduced-motion:reduce)');
    expect(css).toContain('html[data-motion=reduced] .project-folio .folio-track {animation:none!important;will-change:auto;}');
    expect(css).toContain('top:var(--folio-top)');
    expect(css).toContain('left:var(--folio-left)');
    expect(css).toContain('background:transparent');
    expect(css).not.toContain('scroll-snap-type:y proximity');
    expect(css).not.toContain('.project-folio .folio-cycle {height:auto;display:flex;flex-direction:column');
    expect(source).toContain('mountProjectFolio()');
  });
});

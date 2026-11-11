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

  it('renders six genuine project previews in two seamless, identical cycles', () => {
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
    expect(cycles).toHaveLength(2);
    expect(cycles[0].querySelectorAll('a.showpiece')).toHaveLength(6);
    expect(cycles[1].querySelectorAll('a.showpiece')).toHaveLength(6);
    expect(cycles[1].getAttribute('aria-hidden')).toBe('true');
    const first = [...cycles[0].querySelectorAll<HTMLAnchorElement>('a')];
    const duplicate = [...cycles[1].querySelectorAll<HTMLAnchorElement>('a')];
    expect(first.map(a => a.getAttribute('href'))).toEqual(duplicate.map(a => a.getAttribute('href')));
    expect(first.every(a => a.getAttribute('tabindex') !== '-1')).toBe(true);
    expect(duplicate.every(a => a.getAttribute('tabindex') === '-1')).toBe(true);
    expect(first[1].querySelector('img')?.getAttribute('src')).toBe('/project-shots/wedding-demo-live.png');
    for (const image of first.map(a => a.querySelector('img'))) {
      expect(image?.getAttribute('src')).toMatch(/^\/project-shots\//);
      expect(existsSync(resolve(process.cwd(), 'vercel-site/public', image!.getAttribute('src')!.slice(1)))).toBe(true);
    }
  });

  it('moves the entire repeated set upward with no oscillation or manual pause UI', () => {
    expect(css).toContain('@keyframes folio-conveyor');
    expect(css).toContain('transform:translate3d(0,-50%,0)');
    expect(css).toContain('20s linear infinite');
    expect(css).not.toContain('@keyframes folio-drift');
    expect(css).not.toContain('@keyframes folio-breathe');
    expect(source).not.toContain('data-folio-motion');
    expect(css).toContain('rotate(-14deg)');
  });

  it('has a readable reduced-motion layout without duplicated visible cards', () => {
    expect(css).toContain('html[data-motion=reduced] .project-folio .folio-cycle:nth-child(2) {display:none;}');
    expect(css).toContain('@media(prefers-reduced-motion:reduce)');
    expect(css).toContain('scroll-snap-type:y proximity');
    expect(source).toContain('mountProjectFolio()');
  });
});

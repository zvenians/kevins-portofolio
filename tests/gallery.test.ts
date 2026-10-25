import { test, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

for (const kind of ['wedding', 'morphslides', 'logostudio']) {
 test(`gallery ${kind} initializes and switches every direction`, () => {
  const dom = new JSDOM(`<div id="creative-demo" data-demo="${kind}"></div>`, {url:'https://example.com/work/demo', runScripts:'outside-only'});
  const w = dom.window;
  w.eval(`var $=s=>document.querySelector(s); var reduced=true; var homeHref=s=>'#'+s; var esc=s=>String(s).replaceAll('<','&lt;');`);
  w.eval(readFileSync('apps-script/source/CreativeStudios.js','utf8'));
  w.eval(readFileSync('apps-script/source/Gallery.js','utf8'));
  w.eval(`creativeStudio('${kind}'); setupGalleryVariants(document.querySelector('#creative-demo'));`);
  const buttons = w.document.querySelectorAll<HTMLButtonElement>('button[data-variant]');
  expect(buttons.length).toBe(3);
  buttons.forEach(b=>{ b.click(); expect(w.document.querySelector('#creative-demo')?.getAttribute('data-variant')).toBe(b.dataset.variant); });
  if(kind==='morphslides') {
   (w.document.querySelector('[data-player="next"]') as HTMLButtonElement).click();
   expect(w.document.querySelector('.morph-stage')?.getAttribute('data-scene')).toBe('1');
   (w.document.querySelector('[data-player="prev"]') as HTMLButtonElement).click();
   expect(w.document.querySelector('.morph-stage')?.getAttribute('data-scene')).toBe('0');
  }
  dom.window.close();
 });
}

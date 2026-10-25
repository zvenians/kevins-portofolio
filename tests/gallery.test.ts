import { test, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

test('navigation opens, closes on selection, and returns focus on Escape',()=>{
 const dom=new JSDOM('<header class="header"><nav><a href="#studio">Demo Studio</a></nav></header>',{runScripts:'outside-only'});
 dom.window.eval(readFileSync('apps-script/source/Gallery.js','utf8'));
 dom.window.eval('initGalleryNavigation();initGalleryNavigation();');
 const button=dom.window.document.querySelector<HTMLButtonElement>('#gallery-menu')!;
 expect(dom.window.document.querySelectorAll('#gallery-menu').length).toBe(1);
 button.click();expect(button.getAttribute('aria-expanded')).toBe('true');
 dom.window.document.querySelector<HTMLAnchorElement>('nav a')!.click();expect(button.getAttribute('aria-expanded')).toBe('false');
 button.click();button.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
 expect(button.getAttribute('aria-expanded')).toBe('false');expect(dom.window.document.activeElement).toBe(button);dom.window.close();
});

for (const kind of ['wedding', 'morphslides', 'logostudio']) {
 test(`gallery ${kind} initializes and switches every direction`, () => {
  const dom = new JSDOM(`<div id="creative-demo" data-demo="${kind}"></div>`, {url:'https://example.com/work/demo', runScripts:'outside-only'});
  const w = dom.window;
  w.eval(`var $=s=>document.querySelector(s); var reduced=true; var homeHref=s=>'#'+s; var esc=s=>String(s).replaceAll('<','&lt;');`);
  w.eval(readFileSync('apps-script/source/CreativeStudios.js','utf8'));w.eval(readFileSync('apps-script/source/CreativeWorlds.js','utf8'));
  w.eval(readFileSync('apps-script/source/Gallery.js','utf8'));
  w.eval(`creativeStudio('${kind}'); setupGalleryVariants(document.querySelector('#creative-demo'));`);
  const buttons = w.document.querySelectorAll<HTMLButtonElement>('button[data-variant]');
  expect(buttons.length).toBe(3);
  buttons.forEach(b=>{ b.click(); expect(w.document.querySelector('#creative-demo')?.getAttribute('data-variant')).toBe(b.dataset.variant); });
  if(kind==='wedding'){
   w.HTMLElement.prototype.scrollIntoView=()=>{};
   (w.document.querySelector('.inv-open') as HTMLButtonElement).click();
   expect(w.document.querySelector<HTMLElement>('.film-reel')?.hidden).toBe(false);
   const first=w.document.querySelector<HTMLInputElement>('#wed-one')!;
   first.value='Nadia';first.dispatchEvent(new w.Event('input'));
   expect(w.document.querySelector('.inv-opening svg')?.textContent).toContain('Nadia');
   w.document.querySelector<HTMLInputElement>('[name=guest]')!.value='Demo Guest';
   w.document.querySelector<HTMLSelectElement>('[name=reply]')!.value='Joyfully attending';
   w.document.querySelector('form')!.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
   expect(w.document.querySelector('.inv-feedback')?.textContent).toContain('Demo Guest — Joyfully attending');
  }
  if(kind==='logostudio'){
   const field=w.document.querySelector<HTMLInputElement>('#brand-name')!;field.value='TEST';field.dispatchEvent(new w.Event('input'));
   expect(w.document.querySelector('.identity-application strong')?.textContent).toBe('TEST');
   const grid=w.document.querySelector<HTMLInputElement>('#construction-grid')!;grid.checked=true;grid.dispatchEvent(new w.Event('change'));
   expect(w.document.querySelector('.identity-art')?.classList.contains('show-grid')).toBe(true);
  }
  if(kind==='morphslides') {
   (w.document.querySelector('[data-player="next"]') as HTMLButtonElement).click();
   expect(w.document.querySelector('.morph-stage')?.getAttribute('data-scene')).toBe('1');
   (w.document.querySelector('[data-player="prev"]') as HTMLButtonElement).click();
   expect(w.document.querySelector('.morph-stage')?.getAttribute('data-scene')).toBe('0');
  }
  dom.window.close();
 });
}

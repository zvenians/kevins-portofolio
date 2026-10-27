import {test,expect} from 'vitest';
import {JSDOM} from 'jsdom';
import {readFileSync} from 'node:fs';

function setup(html:string){
 const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true});
 dom.window.eval('var reduced=true;var worldSvg=id=>`<svg><text>${id}</text></svg>`;'+readFileSync('apps-script/source/Clean.js','utf8'));
 return dom;
}
test('demo context retains existing nodes and handlers while keeping the working demo visible',()=>{
 const d=setup('<article class="case-page"><section id="interactive-evidence"><input value="Keep this value"></section><div class="case-visual">Preview</div><div class="case-copy"><button id="evidence">Evidence</button></div></article>');
 const button=d.window.document.querySelector<HTMLButtonElement>('#evidence')!;let clicked=0;button.onclick=()=>clicked++;
 d.window.eval('initCleanExperience();initCleanExperience()');
 expect(d.window.document.querySelectorAll('.demo-context').length).toBe(1);
 expect(d.window.document.querySelector('.demo-context #evidence')).toBe(button);button.click();expect(clicked).toBe(1);
 expect(d.window.document.querySelector('#interactive-evidence')?.closest('details')).toBeNull();
 expect(d.window.document.querySelector('input')?.value).toBe('Keep this value');d.window.close();
});
test('services progressively disclose supporting copy without removing service links',()=>{
 const d=setup('<div class="service-lanes"><article><h3>Web</h3><ul><li>Integration</li></ul><small>Scope note</small><a href="#connect">Contact</a></article></div>');
 d.window.eval('initCleanExperience();initCleanExperience()');
 expect(d.window.document.querySelectorAll('.service-detail').length).toBe(1);
 expect(d.window.document.querySelector('.service-detail')?.textContent).toContain('Scope note');
 expect(d.window.document.querySelector('a')?.closest('details')).toBeNull();d.window.close();
});
test('studio sculpture is a keyboard-operable button and reverses its rotation',()=>{
 const d=setup('<section id="studio"><div class="gallery-section-head"></div></section>');d.window.eval('initCleanExperience();initCleanExperience()');
 const button=d.window.document.querySelector<HTMLButtonElement>('.studio-sculpture')!;
 expect(button.tagName).toBe('BUTTON');expect(button.getAttribute('aria-label')).toBe('Rotate studio preview');
 expect(d.window.document.querySelectorAll('.sculpture-page').length).toBe(3);
 button.click();expect(button.style.getPropertyValue('--sculpture-angle')).toBe('18deg');
 button.click();expect(button.style.getPropertyValue('--sculpture-angle')).toBe('-18deg');d.window.close();
});

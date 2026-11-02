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
test('studio shows a single linked comic print',()=>{
 const d=setup('<section id="studio"><div class="gallery-section-head"></div></section>');
 d.window.eval("var mangaPageSvg=n=>'<svg data-plate='+n+'></svg>';var projectHref=s=>'/work/'+s;initCleanExperience();initCleanExperience()");
 expect(d.window.document.querySelectorAll('.studio-feature-print')).toHaveLength(1);
 expect(d.window.document.querySelector('.studio-feature-print')?.getAttribute('href')).toBe('/work/koma-manga-reader');
 expect(Array.from(d.window.document.querySelectorAll('.volume-object svg'), el=>el.getAttribute('data-plate'))).toEqual(['2','1']);
 d.window.close();
});

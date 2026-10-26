import {test,expect} from 'vitest';
import {JSDOM} from 'jsdom';
import {readFileSync} from 'node:fs';
function setup(){
 const d=new JSDOM('<header class="header"></header><main><h1>Complex things.</h1><button id="action">Explore project ↗</button><input placeholder="Search files"><select><option>All files</option></select></main>',{url:'https://example.com',runScripts:'outside-only',pretendToBeVisual:true});
 d.window.eval('const data={admin:false};'+readFileSync('apps-script/source/Locale.js','utf8'));return d;
}
test('language switches reversibly, persists, and preserves option values and form input',()=>{
 const d=setup(),w=d.window;const input=w.document.querySelector('input')!;input.value='User-owned text';
 w.eval("setSiteLanguage('id')");expect(w.document.documentElement.lang).toBe('id');expect(w.document.querySelector('h1')!.textContent).toBe('Hal rumit.');expect(input.placeholder).toBe('Cari berkas');expect(input.value).toBe('User-owned text');expect(w.document.querySelector('option')!.value).toBe('All files');expect(w.localStorage.getItem('portfolio-language')).toBe('id');
 w.eval("setSiteLanguage('en')");expect(w.document.querySelector('h1')!.textContent).toBe('Complex things.');expect(input.placeholder).toBe('Search files');d.window.close();
});
test('newly rendered demo text follows chosen language without replacing controls',async()=>{
 const d=setup(),w=d.window;w.eval("setSiteLanguage('id')");let clicked=false;const button=w.document.querySelector<HTMLButtonElement>('#action')!;button.onclick=()=>{clicked=true;};button.click();expect(clicked).toBe(true);
 button.textContent='Copy project link';await new Promise(r=>setTimeout(r,10));expect(button.textContent).toBe('Salin tautan proyek');w.eval("setSiteLanguage('en')");expect(button.textContent).toBe('Copy project link');d.window.close();
});
test('first visit language prompt is nonmodal and dismissible',async()=>{
 const d=setup(),w=d.window;await new Promise(r=>setTimeout(r,1900));const prompt=w.document.querySelector('.language-nudge');expect(prompt?.tagName).toBe('ASIDE');expect(w.document.querySelectorAll('dialog[open]').length).toBe(0);w.document.querySelector<HTMLButtonElement>('.nudge-close')!.click();expect(w.document.querySelector('.language-nudge')).toBeNull();expect(w.localStorage.getItem('portfolio-language-seen')).toBe('1');d.window.close();
});
test('cinematic panels work with keyboard and retain real project links',()=>{
 const d=new JSDOM('<section class="arrival"></section>',{url:'https://example.com',runScripts:'outside-only',pretendToBeVisual:true});
 d.window.eval(`let galleryArrival;let initImmersion=()=>{};let reduced=true;const data={projects:[{status:'Real Project',name:'One',slug:'one',category:'Web',summary:'First'},{status:'Real Project',name:'Two',slug:'two',category:'Web',summary:'Second'}]};const esc=s=>s;const visual=p=>'<div class="visual">'+p.name+'</div>';const homeHref=s=>'#'+s;const projectHref=s=>'/work/'+s;const hydrateMedia=()=>{};`+readFileSync('apps-script/source/Cinematic.js','utf8')+';galleryArrival(document.querySelector(".arrival"));');
 const buttons=d.window.document.querySelectorAll<HTMLButtonElement>('[data-cinema]');buttons[0].dispatchEvent(new d.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));expect(buttons[1].getAttribute('aria-pressed')).toBe('true');expect(d.window.document.querySelector('.cinema-detail a')!.getAttribute('href')).toBe('/work/two');d.window.close();
});

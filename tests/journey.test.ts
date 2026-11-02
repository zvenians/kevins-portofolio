import { test, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';
import { NextRequest } from 'next/server';
import { POST } from '../vercel-site/app/api/events/route';

const source=readFileSync('apps-script/Code.gs','utf8');
const assets=JSON.parse(source.match(/\nconst ASSETS = (.*);\n?$/s)![1]);
const fallback=JSON.parse(readFileSync('vercel-site/generated/fallback.json','utf8'));
function page(studioPage=false,slug=''){
 const errors:unknown[]=[];
 const dom=new JSDOM(assets.html.replace('/*STYLES*/','').replace('/*CLIENT*/',''),{url:'https://example.com/'+(studioPage?'studio':slug?'work/'+slug:''),runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:new VirtualConsole().on('jsdomError',e=>errors.push(e))});
 const w=dom.window;
 Object.assign(w,{INDEX_HOSTED:true,INDEX_BOOTSTRAP:{...structuredClone(fallback),studioPage,projectSlug:slug,admin:false},matchMedia:()=>({matches:true,addEventListener(){}}),ResizeObserver:class{observe(){} disconnect(){}},IntersectionObserver:class{observe(){} disconnect(){}},fetch:()=>Promise.resolve({ok:true})});
 w.HTMLElement.prototype.scrollIntoView=()=>{};w.scrollTo=()=>{};w.eval(assets.client);
 return {dom,w,errors};
}
test('short home keeps real work, three demo entrances, services and valid studio navigation',async()=>{
 const {dom,w,errors}=page();await new Promise(r=>setTimeout(r,40));
 expect(w.document.querySelectorAll('#main>section').length).toBe(6);
 expect(w.document.querySelectorAll('#field .journey-card').length).toBe(4);
 const choices = [...w.document.querySelectorAll<HTMLButtonElement>('[data-project-index]')];
 choices[1].click();
 expect(choices.map(choice => choice.getAttribute('aria-pressed'))).toEqual(['false','true','false','false']);
 expect(w.document.querySelectorAll('.k-spot > div:not([hidden])')).toHaveLength(1);
 expect(w.document.querySelector('.k-spot > div:not([hidden]) a')?.getAttribute('href')).toContain('/work/galilea-digital-archive');
 const tempo = w.document.querySelector<HTMLInputElement>('#k-tempo')!;
 tempo.value = '120';
 tempo.dispatchEvent(new w.Event('input'));
 expect(w.document.querySelector('.k-controls output')?.textContent).toBe('120 ms');
 w.document.querySelector<HTMLButtonElement>('#k-play')!.click();
 expect(w.document.querySelector('.k-frames.playing')).toBeTruthy();
 expect(w.document.querySelectorAll('#studio-preview .journey-card').length).toBe(3);
 expect(w.document.querySelectorAll('.journey-services>a').length).toBe(4);
 expect(w.document.querySelector('.header nav')?.innerHTML).toContain('href="/studio"');
 const trigger=w.document.querySelector<HTMLButtonElement>('.quick-trigger')!;
 const links=w.document.querySelector('#quick-destinations')!;
 expect(links.hasAttribute('inert')).toBe(true);
 trigger.click();expect(links.hasAttribute('inert')).toBe(false);
 expect(links.querySelectorAll('a')).toHaveLength(4);
 trigger.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
 expect(trigger.getAttribute('aria-expanded')).toBe('false');
 expect(w.document.querySelectorAll('iframe').length).toBe(0);
 expect(errors).toEqual([]);dom.window.close();
});
test('studio preserves working labs, category selection and lazy image previews',async()=>{
 const {dom,w,errors}=page(true);await new Promise(r=>setTimeout(r,50));
 expect(w.document.querySelector('#home')).toBeNull();
 expect(w.document.querySelectorAll('.gallery-template').length).toBe(6);
 expect(w.document.querySelectorAll('.demo-dom-preview img').length).toBe(6);
 w.document.querySelector<HTMLButtonElement>('[data-gallery-category="Data & Excel"]')!.click();
 expect(w.document.querySelector('[data-gallery-lab="2"]')?.getAttribute('href')).toBe('/studio?lab=2#lab');
 expect(w.document.querySelector('#workspace')).not.toBeNull();expect(errors).toEqual([]);dom.window.close();
});
test('real case guide changes its caption and active view',async()=>{
 const {dom,w,errors}=page(false,'galilea-web-portal');await new Promise(r=>setTimeout(r,40));
 w.document.querySelector<HTMLButtonElement>('[data-guide="1"]')!.click();
 expect(w.document.querySelector('.guided-gallery')?.getAttribute('data-view')).toBe('1');
 expect(w.document.querySelector('.guided-caption')?.textContent).toContain('Detail view');
 expect(w.document.querySelector('.case-facts')?.textContent).toContain('See project history');expect(errors).toEqual([]);dom.window.close();
});
test('interaction endpoint accepts known events, excludes extra data, rejects foreign origins',async()=>{
 const log=vi.spyOn(console,'info').mockImplementation(()=>{});
 const req=(body:unknown,origin='https://example.com')=>new NextRequest('https://example.com/api/events',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)});
 expect((await POST(req({name:'project_open',project:'galilea-web-portal',email:'never-log-this'}))).status).toBe(204);
 expect(log.mock.calls[0][0]).not.toContain('never-log-this');
 expect((await POST(req({name:'unknown'}))).status).toBe(400);
 expect((await POST(req({name:'cv_open'},'https://foreign.example'))).status).toBe(403);
 log.mockRestore();
});

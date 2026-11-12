import { describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { academicPage, mountAcademic } from '../vercel-site/public/atelier/academic.js';

describe('academic support journey',()=>{
 it('keeps input through the three-step review flow without storing a draft',()=>{
  const dom=new JSDOM(`<main>${academicPage('id')}</main>`,{url:'https://portfolio.test/academic-support'});vi.stubGlobal('document',dom.window.document);dom.window.HTMLElement.prototype.scrollIntoView=()=>{};mountAcademic('id','simatupangkevin9@gmail.com');const root=dom.window.document.querySelector('#academic-app')!;
  const input=(el:HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement,value:string)=>{el.value=value;el.dispatchEvent(new dom.window.Event('input',{bubbles:true}))};const submit=()=>root.querySelector('[data-form]')!.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
  expect(root.querySelectorAll('.academic-steps button')).toHaveLength(3);const service=root.querySelector('input[value=thesis]') as HTMLInputElement;service.checked=true;service.dispatchEvent(new dom.window.Event('input',{bubbles:true}));submit();
  input(root.querySelector('input[name=topic]')!,'Regresi survei untuk Bab 3');input(root.querySelector('select[name=stage]')!,'Baru mulai');input(root.querySelector('input[name=date]')!,new Date(Date.now()+86400000).toISOString().slice(0,10));input(root.querySelector('textarea[name=note]')!,'Saya ingin memahami metode yang tepat.');submit();
  const handoff=root.querySelector('a[href^="mailto:"]') as HTMLAnchorElement;expect(decodeURIComponent(handoff.href)).toContain('Regresi survei untuk Bab 3');expect(root.textContent).toContain('Tidak ada yang dikirim otomatis');expect(root.querySelector('.academic-review')).not.toBeNull();expect(dom.window.sessionStorage.length).toBe(0);dom.window.close();vi.unstubAllGlobals();
 });
 it('exposes real examples and honest privacy boundaries',()=>{const source=readFileSync(resolve(process.cwd(),'vercel-site/public/atelier/academic.js'),'utf8');expect(source).not.toContain('sessionStorage');expect(source).toContain('No account, upload or payment is required');expect(source).toContain('Nothing is sent automatically');expect(source).toContain('fabricated data or false authorship');expect(source).toContain('/work/operations-decision-workbench?launch=1');expect(source).toContain('/work/research-practice-toolkit?launch=1');});
});

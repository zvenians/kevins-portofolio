import { describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { academicPage, mountAcademic } from '../vercel-site/public/atelier/academic.js';

describe('academic support journey',()=>{
 it('keeps input through category, challenge, materials, collaboration and review without unconsented storage',()=>{
  const dom=new JSDOM(`<main>${academicPage('id')}</main>`,{url:'https://portfolio.test/academic-support'});vi.stubGlobal('document',dom.window.document);vi.stubGlobal('sessionStorage',dom.window.sessionStorage);dom.window.HTMLElement.prototype.scrollIntoView=()=>{};mountAcademic('id','simatupangkevin9@gmail.com');const root=dom.window.document.querySelector('#academic-app')!;
  const input=(el:HTMLInputElement|HTMLTextAreaElement,value:string|boolean)=>{if(el instanceof dom.window.HTMLInputElement&&el.type==='checkbox')el.checked=Boolean(value);else el.value=String(value);el.dispatchEvent(new dom.window.Event('input',{bubbles:true}))};const submit=(form:Element)=>form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
  (root.querySelector('[data-next]') as HTMLButtonElement).click();const category=root.querySelector('input[value=excel]') as HTMLInputElement;category.checked=true;category.dispatchEvent(new dom.window.Event('input',{bubbles:true}));submit(root.querySelector('[data-form]')!);
  input(root.querySelector('textarea[name=detail]')!,'Saya ingin memahami dan memperbaiki rumus XLOOKUP yang menghasilkan #N/A.');input(root.querySelector('input[name=integrity]')!,true);submit(root.querySelector('[data-form]')!);
  input(root.querySelector('textarea[name=materials]')!,'Workbook .xlsx dengan data anonim.');input(root.querySelector('input[name=share]')!,true);submit(root.querySelector('[data-form]')!);
  input(root.querySelector('input[name=name]')!,'Mahasiswa Demo');input(root.querySelector('input[name=email]')!,'student@example.test');submit(root.querySelector('[data-form]')!);
  const handoff=root.querySelector('a[href^="mailto:"]') as HTMLAnchorElement;expect(decodeURIComponent(handoff.href)).toContain('Mahasiswa Demo');expect(root.textContent).toContain('Tidak ada yang dikirim otomatis');expect(sessionStorage.getItem('atelier.academic')).toBeNull();dom.window.close();vi.unstubAllGlobals();
 });
 it('exposes real examples and honest privacy boundaries',()=>{const source=readFileSync(resolve(process.cwd(),'vercel-site/public/atelier/academic.js'),'utf8');expect(source).toContain("if(state.saveDraft)sessionStorage.setItem('atelier.academic'");expect(source).toContain("sessionStorage.removeItem('atelier.academic')");expect(source).toContain('This site has no upload backend');expect(source).toContain('This site does not create a booking, payment, ticket or guaranteed deadline');expect(source).toContain('/work/operations-decision-workbench?launch=1');expect(source).toContain('/work/research-practice-toolkit?launch=1');});
});

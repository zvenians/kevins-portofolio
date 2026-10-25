import {test,expect} from 'vitest';
import {JSDOM} from 'jsdom';
import {readFileSync} from 'node:fs';
import {buildSync} from 'esbuild';

const engine=buildSync({entryPoints:['apps-script/source/data-engine.ts'],bundle:true,write:false,format:'iife',globalName:'Engine'}).outputFiles[0].text;
function setup(root:string){
 const dom=new JSDOM(`<div id="${root}"></div><dialog id="preview-dialog"><h3 id="preview-title"></h3><div id="preview-body"></div></dialog>`,{url:'https://example.com',runScripts:'outside-only'});
 dom.window.HTMLElement.prototype.scrollIntoView=()=>{};
 dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
 dom.window.eval(engine.replace('"use strict";', '')+`\nvar $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];var reduced=true;var state={lab:0,source:'reconciled',threshold:1000000,highlight:true};var esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');var toast=()=>{};var action=()=>{};var procurement=()=>{};`+'\n'+['Lab.js','Commerce.js','StudioSystems.js'].map(file=>readFileSync('apps-script/source/'+file,'utf8')).join('\n'));
 return dom;
}
test('archive filters folders and titles, previews sample records and queues locally',async()=>{
 const d=setup('archive-demo'),w=d.window;w.eval('archiveExperience()');
 const query=w.document.querySelector<HTMLInputElement>('#archive-search')!;query.value='music';query.dispatchEvent(new w.Event('input'));
 expect(w.document.querySelectorAll('[data-document]').length).toBe(1);
 w.document.querySelector<HTMLButtonElement>('[data-document]')!.click();expect(w.document.querySelector('#preview-title')?.textContent).toBe('Music schedule');
 query.value='';query.dispatchEvent(new w.Event('input'));w.document.querySelector<HTMLButtonElement>('[data-folder=September]')!.click();expect(w.document.querySelector('#archive-count')?.textContent).toBe('1 sample records');
 w.document.querySelector<HTMLButtonElement>('#queue-upload')!.click();expect(w.document.querySelector<HTMLButtonElement>('#queue-upload')!.disabled).toBe(true);
 await new Promise(r=>setTimeout(r,1000));expect(w.document.querySelector('#archive-count')?.textContent).toBe('5 sample records');expect(w.document.querySelector('#upload-status')?.textContent).toContain('100%');d.window.close();
});
test('booking guards date, switches available times, reviews and resets without submitting',()=>{
 const d=setup('booking-demo'),w=d.window;w.eval('bookingExperience()');const doc=w.document;
 const date=doc.querySelector<HTMLInputElement>('#booking-date')!;date.value='';doc.querySelector<HTMLButtonElement>('#booking-next')!.click();expect(doc.querySelector<HTMLElement>('[data-book-panel="1"]')!.hidden).toBe(true);
 date.value='2027-06-12';const service=doc.querySelector<HTMLSelectElement>('#booking-service')!;service.value='Document review';service.dispatchEvent(new w.Event('change'));expect(doc.querySelector('#booking-slots')?.textContent).toContain('09:30');
 doc.querySelector<HTMLButtonElement>('#booking-next')!.click();doc.querySelector<HTMLInputElement>('[name=name]')!.value='Sample Guest';doc.querySelector<HTMLInputElement>('[name=contact]')!.value='081200000000';doc.querySelector('form')!.dispatchEvent(new w.Event('submit',{cancelable:true}));
 expect(doc.querySelector<HTMLElement>('#booking-summary')!.hidden).toBe(false);expect(doc.querySelector('#booking-summary')?.textContent).toContain('Sample Guest');doc.querySelector<HTMLButtonElement>('#booking-restart')!.click();expect(doc.querySelector<HTMLElement>('[data-book-panel="0"]')!.hidden).toBe(false);expect(doc.querySelector<HTMLInputElement>('[name=name]')!.value).toBe('');d.window.close();
});
test('four data worlds keep their controls and decoration after recalculation',()=>{
 const d=setup('workspace'),w=d.window;
 for(let i=0;i<4;i++){w.eval(`state.lab=${i};renderLab()`);expect(w.document.querySelectorAll('.data-world-intro').length).toBe(1);expect(w.document.querySelector('#workspace')?.textContent).toContain('DEMONSTRATION DATA');}
 w.eval('state.lab=2;renderLab()');const expense=w.document.querySelector<HTMLInputElement>('#expense')!;expense.value='6000000';expense.dispatchEvent(new w.Event('change'));expect(w.document.querySelectorAll('.data-world-intro').length).toBe(1);expect(w.document.querySelector('.lab-stats')?.textContent).toContain('13.77m');
 w.eval('state.lab=1;renderLab()');const range=w.document.querySelector<HTMLInputElement>('[data-validated="0"]')!;range.value='30';range.dispatchEvent(new w.Event('change'));expect(w.document.querySelector('.verification-gauge')?.textContent).toContain('84');d.window.close();
});
test('commerce normalizes tampered local quantities and rejects unknown variants',()=>{
 const d=setup('commerce-demo'),w=d.window;w.localStorage.setItem('living-commerce-cart',JSON.stringify({'sera-notebook::Grid':999,'sera-bottle::Invalid':3,'sera-cap::Oat':-4,'sera-tote::Natural':'2'}));w.eval('commerceDemo()');expect(w.document.querySelector('#commerce-cart-count')?.textContent).toBe('9');expect(w.document.querySelector('.commerce-cart-lines')?.textContent).not.toContain('Invalid');expect(w.document.querySelectorAll('.commerce-product-art svg').length).toBe(6);d.window.close();
});

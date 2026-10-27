import {test,expect} from 'vitest';
import {JSDOM} from 'jsdom';
import {readFileSync} from 'node:fs';
function setup(){
 const dom=new JSDOM('<div id="canvas"></div>',{url:'https://example.com',runScripts:'outside-only'});
 dom.window.eval('var reduced=true;'+readFileSync('apps-script/source/Wedding.js','utf8'));
 dom.window.HTMLElement.prototype.scrollIntoView=()=>{};
 dom.window.eval('worldWedding(document.querySelector("#canvas"),"classic")');return dom;
}
test('names remain text, date clears safely and a past celebration never counts negative',()=>{
 const d=setup(),w=d.window;const name=w.document.querySelector<HTMLInputElement>('#wed-one')!;name.value='<img src=x>';name.dispatchEvent(new w.Event('input'));
 expect(w.document.querySelector('[data-first]')!.textContent).toBe('<img src=x>');expect(w.document.querySelector('[data-first] img')).toBeNull();
 const date=w.document.querySelector<HTMLInputElement>('#wed-date')!;date.value='2020-01-01';date.dispatchEvent(new w.Event('input'));
 expect([...w.document.querySelectorAll('[data-count]')].every(e=>e.textContent==='00')).toBe(true);
 date.value='';date.dispatchEvent(new w.Event('input'));expect(w.document.querySelector<HTMLButtonElement>('.wed-calendar')!.disabled).toBe(true);expect(w.document.querySelector('[data-date]')!.textContent).toBe('Date to be confirmed');d.window.close();
});
test('RSVP preserves wishes as text and disables seats for a declined invitation',()=>{
 const d=setup(),w=d.window;w.document.querySelector<HTMLInputElement>('[name=guest]')!.value='Demo Guest';const reply=w.document.querySelector<HTMLSelectElement>('[name=reply]')!;reply.value='Unable to attend';reply.dispatchEvent(new w.Event('change'));
 expect(w.document.querySelector<HTMLSelectElement>('[name=seats]')!.disabled).toBe(true);
 w.document.querySelector<HTMLTextAreaElement>('[name=wish]')!.value='<b>Congratulations</b>';
 w.document.querySelector('form')!.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
 expect(w.document.querySelector('.wed-reply-card p')!.textContent).toBe('<b>Congratulations</b>');expect(w.document.querySelector('.wed-reply-card b')).toBeNull();expect(w.document.querySelector('.inv-feedback')!.textContent).toContain('Nothing was sent.');d.window.close();
});
test('calendar converts 10 WITA to 02 UTC and escapes user text',()=>{
 const d=setup();const text=d.window.eval('weddingCalendar("Aruna, test","Bima","2027-06-12")');expect(text).toContain('DTSTART:20270612T020000Z');expect(text).toContain('DTEND:20270612T040000Z');expect(text).toContain('Aruna\\, test');expect(text).toContain('Fictional invitation preview');expect(d.window.eval('weddingCalendar("A","B","")')).toBeNull();d.window.close();
});

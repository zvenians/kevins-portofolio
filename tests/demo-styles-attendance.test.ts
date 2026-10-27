import {test,expect} from 'vitest';
import {JSDOM} from 'jsdom';
import {readFileSync} from 'node:fs';
const source=(name:string)=>readFileSync('apps-script/source/'+name+'.js','utf8');
function setup(search=''){
 const d=new JSDOM('<div id="attendance-demo"></div>',{url:'https://example.com/work/presence'+search,runScripts:'outside-only'});
 d.window.eval(`var $=s=>document.querySelector(s);var esc=s=>String(s).replaceAll('<','&lt;');var hydrateStudioPreviews=()=>{};var exported;var demoDownload=(...args)=>exported=args;`+source('Attendance')+source('DemoStyles')+';attendanceDemo();initDemoStyles();');return d;
}
test('attendance rejects missing check-in, duplicate punches and reversed times',()=>{const d=setup(),w=d.window;
 expect(w.eval("attendanceTransition({in:'',out:''},'out','17:00').error")).toMatch('Check in before');
 expect(w.eval("attendanceTransition({in:'09:00',out:''},'in','09:10').error")).toMatch('Already checked in');
 expect(w.eval("attendanceTransition({in:'09:00',out:''},'out','08:00').error")).toMatch('after check-in');
 expect(w.eval("attendanceTransition({in:'09:00',out:'17:00'},'out','18:00').error")).toMatch('Already checked out');
 expect(w.eval("attendanceTransition({in:'',out:''},'in','25:00').error")).toMatch('valid time');
 expect(w.eval("attendanceTransition({in:'',out:''},'in','09:01').record.status")).toBe('Late');
 expect(w.eval("attendanceTransition({in:'',out:''},'in','09:00').record.status")).toBe('On time');d.window.close();
});
test('check-in state survives all styles, checkout updates ledger and export',()=>{const d=setup(),w=d.window,q=(s:string)=>w.document.querySelector<HTMLElement>(s)!;
 q('#att-in').click();expect(q('.attendance-stats').textContent).toContain('4/6');
 w.document.querySelectorAll<HTMLButtonElement>('[data-demo-style-choice]').forEach(b=>{b.click();expect(q('.attendance-stats').textContent).toContain('4/6');expect(q('.demo-presentation').dataset.demoStyle).toBe(b.dataset.demoStyleChoice);});
 const time=q('#att-time') as HTMLInputElement;time.value='17:00';time.dispatchEvent(new w.Event('input'));q('#att-out').click();expect(q('#att-message').textContent).toContain('Checked out at 17:00');
 q('#att-export').click();expect(w.eval('exported[1]')).toContain('Raka Aditya,Design,09:00,17:00,On time');
 const search=q('#att-search') as HTMLInputElement;search.value='Sinta';search.dispatchEvent(new w.Event('input'));expect(q('.attendance-table tbody').textContent).toContain('Sinta');expect(q('.attendance-table tbody').textContent).not.toContain('Raka');
 d.window.eval('initDemoStyles()');expect(w.document.querySelectorAll('.demo-style-bar').length).toBe(1);d.window.close();
});
test('invalid style links fall back to clean and valid links reopen selected style',()=>{for(const [url,style] of [['?style=invalid','clean'],['?style=expressive','expressive'],['?style=focus','focus']]){const d=setup(url);expect(d.window.document.querySelector<HTMLElement>('.demo-presentation')!.dataset.demoStyle).toBe(style);d.window.close();}});
test('every interactive project has three style options and a unique gallery card',()=>{const d=setup();d.window.eval(source('DemoStyles')+source('Gallery')+';window.testGallery=galleryTemplates;');const projects=JSON.parse(readFileSync('apps-script/source/projects.json','utf8'));
 const cards=d.window.eval('window.testGallery');for(const p of projects.filter((p:any)=>p.status==='Interactive Demo')){const matches=cards.filter((x:any)=>x.slug===p.slug);expect(matches.length,p.slug).toBe(1);expect(d.window.eval('galleryStyles('+JSON.stringify(matches[0])+').length')).toBe(3);}
 for(const slug of ['koma-manga-reader','wedding-invitation-demo','presence-attendance-demo'])expect(cards.find((x:any)=>x.slug===slug).category).toBe('Websites');d.window.close();
});
test('wedding style changes preserve edited names, open state and RSVP input',()=>{const d=new JSDOM('<div id="creative-demo"></div>',{url:'https://example.com',runScripts:'outside-only'});const w=d.window;w.HTMLElement.prototype.scrollIntoView=()=>{};
 w.eval(`var reduced=true;var esc=s=>String(s);var homeHref=()=>'/';`+source('CreativeWorlds')+source('Wedding')+`;worldStudio('wedding');`);
 const name=w.document.querySelector<HTMLInputElement>('#wed-one')!;name.value='Nadia';name.dispatchEvent(new w.Event('input'));w.document.querySelector<HTMLButtonElement>('.inv-open')!.click();const guest=w.document.querySelector<HTMLInputElement>('[name=guest]')!;guest.value='Demo Guest';
 w.document.querySelector<HTMLButtonElement>('[data-variant=botanical]')!.click();w.document.querySelector<HTMLButtonElement>('[data-variant=cinema]')!.click();expect(name.value).toBe('Nadia');expect(guest.value).toBe('Demo Guest');expect(w.document.querySelector<HTMLElement>('.wed-content')!.hidden).toBe(false);expect(w.document.querySelector('.inv-opening [data-first]')!.textContent).toContain('Nadia');d.window.close();
});

import {test,expect} from 'vitest';
import {JSDOM} from 'jsdom';
import {readFileSync} from 'node:fs';
function setup(spread=false,reduced=true){const d=new JSDOM('<div id="manga-demo"></div>',{url:'https://example.com',runScripts:'outside-only'});Object.defineProperty(d.window.document.querySelector('#manga-demo'),'clientWidth',{value:spread?1100:390});d.window.eval('var reduced='+reduced+';var esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll("\\\"","&quot;");'+readFileSync('apps-script/source/Manga.js','utf8'));d.window.eval('mangaDemo()');return d;}
test('volume opens, spreads advance without skipping a page and stop at the end',()=>{const d=setup(true),q=(s:string)=>d.window.document.querySelector<HTMLButtonElement>(s)!;expect(q('.manga-position').textContent).toBe('Page 1–2 of 8');q('.manga-stage').dispatchEvent(new d.window.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));expect(q('.manga-position').textContent).toBe('Page 3–4 of 8');q('.manga-stage').dispatchEvent(new d.window.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));q('.manga-stage').dispatchEvent(new d.window.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));expect(q('.manga-position').textContent).toBe('Page 7–8 of 8');expect(q('.manga-next')).toBeNull();q('.manga-stage').dispatchEvent(new d.window.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));expect(q('.manga-position').textContent).toBe('Page 7–8 of 8');d.window.close();});
test('bookmark resumes the saved page and RTL keyboard navigation reverses with direction',()=>{const d=setup(),w=d.window,q=(s:string)=>w.document.querySelector<HTMLElement>(s)!;q('.manga-stage').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));expect(q('.manga-position').textContent).toBe('Page 2 of 8');q('.manga-bookmark').click();expect(w.localStorage.getItem('koma-bookmark')).toBe('2');w.eval('mangaDemo()');q('.manga-resume').click();expect(q('.manga-position').textContent).toBe('Page 2 of 8');const direction=q('.manga-direction') as HTMLSelectElement;direction.value='ltr';direction.dispatchEvent(new w.Event('change'));q('.manga-stage').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));expect(q('.manga-position').textContent).toBe('Page 3 of 8');d.window.close();});
test('page turn has front and back faces, guards fast clicks and cleans up',()=>{const d=setup(false,false),q=(s:string)=>d.window.document.querySelector<HTMLElement>(s)!;q('.manga-stage').dispatchEvent(new d.window.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));expect(q('.manga-sheet-front svg')).toBeTruthy();expect(q('.manga-sheet-back svg')).toBeTruthy();q('.manga-stage').dispatchEvent(new d.window.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));expect(q('.manga-position').textContent).toBe('Page 2 of 8');d.window.eval('mangaDemo()');expect(q('.manga-turn-sheet')).toBeNull();d.window.close();});
test('all comic pages have accessible original story descriptions and valid SVG',()=>{const d=setup();for(let i=0;i<=8;i++){const svg=d.window.eval('mangaPageSvg('+i+')');const parsed=new d.window.DOMParser().parseFromString(String(svg),'image/svg+xml');expect(parsed.querySelector('parsererror')).toBeNull();expect(parsed.documentElement.getAttribute('aria-label')!.length).toBeGreaterThan(30);}d.window.close();});
test('edge drag bends the printed page, cancels cleanly and commits only from the correct edge',()=>{
 const d=setup(false,false),w=d.window,book=w.document.querySelector<HTMLElement>('.manga-book')!;
 const position=()=>w.document.querySelector('.manga-position')!.textContent;
 Object.defineProperty(book,'offsetWidth',{value:340});
 book.getBoundingClientRect=()=>({left:0,width:340} as DOMRect);
 let now=0,id=0;const queue=new Map<number,FrameRequestCallback>();
 Object.defineProperty(w.performance,'now',{value:()=>now});
 w.requestAnimationFrame=fn=>{queue.set(++id,fn);return id;};
 w.cancelAnimationFrame=n=>{queue.delete(n);};
 const settle=()=>{for(let n=0;n<30&&queue.size;n++){now+=16;const frames=[...queue.values()];queue.clear();frames.forEach(fn=>fn(now));}};
 const fire=(event:string,x:number,y=10)=>{
   const pointer=new w.MouseEvent(event,{clientX:x,clientY:y,button:0});
   Object.defineProperty(pointer,'pointerId',{value:1});
   (book as unknown as Record<string,(value:Event)=>unknown>)['on'+event](pointer);
 };
 const prepare=()=>Object.defineProperty(book.querySelector('.manga-page')!,'offsetWidth',{value:340,configurable:true});
 prepare();fire('pointerdown',160);fire('pointermove',290);expect(book.querySelector('.koma-fold')).toBeNull();
 fire('pointerdown',4);fire('pointermove',8,60);expect(book.querySelector('.koma-fold')).toBeNull();
 fire('pointerdown',4);fire('pointermove',105);
 const strips=[...book.querySelectorAll<HTMLElement>('.koma-strip')];
 expect(strips).toHaveLength(16);expect(strips[0].style.transform).not.toEqual(strips.at(-1)!.style.transform);
 expect(strips[0].querySelectorAll('svg')).toHaveLength(2);
 fire('pointercancel',105);settle();expect(position()).toBe('Page 1 of 8');expect(book.querySelector('.koma-fold')).toBeNull();
 fire('pointerdown',4);fire('pointermove',240);fire('pointerup',240);settle();expect(position()).toBe('Page 2 of 8');
 prepare();fire('pointerdown',337);fire('pointermove',100);fire('pointerup',100);settle();expect(position()).toBe('Page 1 of 8');
 d.window.close();
});

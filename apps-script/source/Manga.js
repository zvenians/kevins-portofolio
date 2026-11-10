// Each plate is an original illustrated page. Lettering stays crisp at any zoom.
const mangaStory = [
  ['After the last train','Nara and Ren chase a paper bird across a rain-soaked station.','LAST TRAIN'],
  ['The loose wing','Rain lashes the platform. A folded bird slips from Nara’s hand.','Tunggu!'],
  ['Across the rail','Ren spots the bird beyond the railing and vaults after it.','Aku lihat!'],
  ['Slipstream','Their fingers almost catch the wing. A passing train pulls it away.','Hampir...'],
  ['Last doors','The doors slam between the couriers and the little white bird.','Ke jembatan!'],
  ['The stairwell','Nara takes the stairs two at a time as the train slides beneath her.','Lewat atas!'],
  ['Reach','Ren skids across the wet bridge and reaches back for Nara.','Pegang tanganku!'],
  ['First light','Their hands close on the paper bird as the rain breaks.','Dapat!'],
  ['The message','At sunrise they unfold the wing and read the message inside.','Sampai di rumah.']
].map(([title, scene, line], index) => ({
  title, line, caption: scene + ' “' + line + '”', chapter: index < 5 ? 1 : 2
}));

// Place the lettering inside the caption boxes drawn into each plate.
const mangaCaptions = [
  [], [[526,776,'23:58']], [[519,776,'Peron 04']], [],
  [[245,785,'Ren!'],[541,785,'Pintunya!']], [[539,783,'Di atas…']],
  [[534,784,'Sedikit lagi.']], [], [[539,780,'Tamat.']]
];

function mangaPageSvg(index) {
  const page = mangaStory[index];
  if (!page) return '';
  const origin = window.INDEX_HOSTED ? '' : 'https://portfolio-kevins.vercel.app';
  const art = origin + '/koma/plate-' + (index || 1) + '.webp';
  const bubbleWidth = Math.max(135, page.line.length * 16 + 35);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 900" role="img" aria-label="${esc(page.title + '. ' + page.caption)}">
    <rect width="640" height="900" fill="#fafafa"/>
    <image href="${art}" x="14" y="18" width="612" height="840" preserveAspectRatio="none"/>
    <g transform="translate(34 42)">
      <path d="M24 38l7 25 16-22" fill="white" stroke="#161616" stroke-width="3"/>
      <rect width="${bubbleWidth}" height="44" rx="19" fill="white" stroke="#161616" stroke-width="3"/>
      <text x="${bubbleWidth / 2}" y="30" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="750" font-size="23">${esc(page.line)}</text>
    </g>
    ${mangaCaptions[index].map(([x,y,text]) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="22">${text}</text>`).join('')}
    <text x="24" y="883" font-family="sans-serif" font-size="14" letter-spacing="2">KOMA · ${esc(page.title.toUpperCase())}</text>
    <text x="616" y="883" text-anchor="end" font-family="serif" font-size="18">${index || 'COVER'}</text>
  </svg>`;
}
let disposeManga=()=>{};
function mangaDemo(){
 const root=document.querySelector('#manga-demo');if(!root)return;disposeManga();
 let page=1,busy=false,flipTimer=null,saved=0,mode='auto',direction='rtl',zoom=1;
 try{saved=Math.max(0,Math.min(8,Math.trunc(Number(localStorage.getItem('koma-bookmark')))||0));}catch{}
 root.innerHTML=`<section class="manga-reader" aria-label="KOMA manga reader"><header class="manga-head"><div><span class="manga-wordmark">koma<span> / </span></span><span class="manga-edition">THE READING ROOM</span></div><span>ORIGINAL COMIC · VOL. 01</span></header><div class="manga-title"><div><span class="eyebrow">A SHORT STORY FOR THE LONG WAY HOME</span><h3>After the last train.</h3><p>Two strangers. One paper bird. A city full of second chances.</p></div><button type="button" class="manga-resume" ${saved?'':'hidden'}>Resume page ${saved} ↗</button></div><div class="manga-toolbar"><label>Chapter<select class="manga-chapter"><option value="0">Cover</option><option value="1">01 / The signal</option><option value="5">02 / First light</option></select></label><label>View<select class="manga-mode"><option value="auto">Adaptive</option><option value="single">Single page</option><option value="spread">Two pages</option></select></label><label>Reading direction<select class="manga-direction"><option value="rtl">Right to left</option><option value="ltr">Left to right</option></select></label><label>Zoom<select class="manga-zoom"><option value="1">Fit page</option><option value="1.5">150%</option><option value="2">200%</option></select></label><button type="button" class="manga-bookmark" aria-pressed="false">Bookmark</button><button type="button" class="manga-full">Fullscreen ⛶</button></div><div class="manga-stage" tabindex="0" aria-label="Comic pages. Use the arrow keys to turn pages."><div class="manga-stage-label"><span class="manga-chapter-label">THE STORY STARTS HERE</span><span class="manga-direction-label">READ RIGHT TO LEFT ←</span></div><div class="manga-book"></div><button type="button" class="manga-open">Open volume <span>↗</span></button><div class="manga-floor" aria-hidden="true"></div></div><div class="manga-controls"><div><span class="manga-position" role="status" aria-live="polite"></span><input class="manga-progress" type="range" min="0" max="8" value="0" aria-label="Go to page"></div></div><p class="manga-notice" role="status"></p><details class="manga-transcript"><summary>Read the page transcript <span>+</span></summary><div></div></details><footer class="manga-foot"><span>KOMA / ORIGINAL COMIC</span><span>Page turns respect reduced-motion preferences.</span></footer></section>`;
 const book=root.querySelector('.manga-book'),stage=root.querySelector('.manga-stage'),notice=root.querySelector('.manga-notice');
 // DOM adaptation of shadcn/ui new-york-v4 NativeSelect from the supplied archive.
 root.querySelectorAll('.manga-toolbar select').forEach(select => {
   const wrap = document.createElement('span');
   wrap.dataset.slot = 'native-select-wrapper';
   select.before(wrap);
   select.dataset.slot = 'native-select';
   wrap.append(select);
   wrap.insertAdjacentHTML('beforeend','<svg data-slot="native-select-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>');
 });
 const isSpread=()=>page>0&&(mode==='spread'||mode==='auto'&&root.clientWidth>720);
 const visible=()=>page===0?[0]:isSpread()&&page<8?[page,page+1]:[page];
 const render=()=>{const pages=visible();book.classList.toggle('is-cover',page===0);book.classList.toggle('is-spread',isSpread()&&pages.length>1);book.dataset.direction=direction;const base=Math.min(pages.length>1?880:440,Math.max(240,root.clientWidth*.9));book.style.width=zoom===1?'':base*zoom+'px';book.classList.toggle('is-zoomed',zoom>1);let display=direction==='rtl'?[...pages].reverse():pages;book.innerHTML=display.map(n=>`<div class="manga-page" data-page-number="${n}">${mangaPageSvg(n)}</div>`).join('');root.querySelector('.manga-open').hidden=page!==0;root.querySelector('.manga-position').textContent=page===0?'Cover / 8 pages':`Page ${pages.join('–')} of 8`;root.querySelector('.manga-progress').value=page;root.querySelector('.manga-progress').setAttribute('aria-valuetext',page===0?'Cover':`Page ${page} of 8`);root.querySelector('.manga-chapter').value=page===0?'0':page<5?'1':'5';root.querySelector('.manga-chapter-label').textContent=page===0?'THE STORY STARTS HERE':page<5?'CHAPTER 01 / THE SIGNAL':'CHAPTER 02 / FIRST LIGHT';root.querySelector('.manga-direction-label').textContent=direction==='rtl'?'READ RIGHT TO LEFT ←':'READ LEFT TO RIGHT →';const mark=root.querySelector('.manga-bookmark');mark.disabled=page===0;mark.setAttribute('aria-pressed',String(saved===page&&page>0));mark.textContent=saved===page&&page>0?'Bookmarked ✓':'Bookmark';root.querySelector('.manga-transcript>div').innerHTML=pages.map(n=>`<article><h4>${esc(mangaStory[n].title)}</h4><p>${esc([mangaStory[n].caption, ...mangaCaptions[n].map(c => c[2])].join(' '))}</p></article>`).join('');};
 const finish=()=>{clearFold();clearTimeout(flipTimer);flipTimer=null;busy=false;book.classList.remove('is-turning');book.querySelector('.manga-turn-sheet')?.remove();};
 const go=(next,animate=true)=>{next=Math.max(0,Math.min(8,Math.trunc(Number(next))||0));if(busy||next===page)return;const previous=page,spread=isSpread(),old=mangaPageSvg(next>page?visible().at(-1):page);page=next;render();if(!animate||reduced)return;busy=true;book.classList.add('is-turning');const sheet=document.createElement('div');sheet.className='manga-turn-sheet';const forward=next>previous;sheet.dataset.side=(direction==='rtl')===forward?'left':'right';sheet.classList.toggle('full-sheet',!spread||!isSpread());sheet.innerHTML=`<div class="manga-sheet-front">${old}</div><div class="manga-sheet-back">${mangaPageSvg(next)}</div>`;book.append(sheet);sheet.addEventListener('animationend',finish,{once:true});flipTimer=setTimeout(finish,850);};
 const next=()=>{if(!visible().includes(8))go(page===0?1:Math.min(8,page+(isSpread()?2:1)));};const prev=()=>go(Math.max(0,page-(isSpread()?2:1)));
 root.querySelector('.manga-open').onclick=next;
 let drag=null, settleFrame=0;
 const stripCount=16;
 function clearFold(){
   if(settleFrame)cancelAnimationFrame(settleFrame);settleFrame=0;
   if(!drag)return;
   drag.mesh?.remove();
   if(drag.under)drag.under.innerHTML=mangaPageSvg(drag.original);
   drag=null;
 }
 function prepareFold(){
   const leaves=[...book.querySelectorAll(':scope > .manga-page')];
   const leaf=drag.sign>0?leaves[0]:leaves.at(-1);
   const width=leaf.offsetWidth;
   drag.original=Number(leaf.dataset.pageNumber);drag.under=leaf;
   const targetPages=isSpread() && drag.target>0 && drag.target<8?[drag.target,drag.target+1]:[drag.target];
   const back=drag.forward?targetPages[0]:targetPages.at(-1);
   const under=drag.forward?targetPages.at(-1):targetPages[0];
   leaf.innerHTML=mangaPageSvg(under);
   const mesh=document.createElement('div');
   mesh.className='koma-fold';mesh.setAttribute('aria-hidden','true');
   mesh.style.left=leaf.offsetLeft+'px';mesh.style.width=width+'px';
   drag.mesh=mesh;drag.width=width;
   const frontArt=mangaPageSvg(drag.original),backArt=mangaPageSvg(back);
   drag.strips=Array.from({length:stripCount},(_,i)=>{
     const strip=document.createElement('div');strip.className='koma-strip';
     const col=drag.sign>0?stripCount-1-i:i;
     const slice=(art,n)=>art.replace('viewBox="0 0 640 900"','preserveAspectRatio="none" viewBox="'+n*640/stripCount+' 0 '+640/stripCount+' 900"');
     strip.innerHTML='<div>'+slice(frontArt,col)+'</div><div>'+slice(backArt,stripCount-1-col)+'</div>';
     strip.style.width=(width/stripCount+.45)+'px';
     mesh.append(strip);return strip;
   });
   book.append(mesh);
 }
 function fold(progress){
   drag.progress=progress;
   if(reduced)return;
   if(!drag.mesh)prepareFold();
   const outward=-drag.sign,step=drag.width/stripCount;
   let x=drag.sign>0?drag.width:0,z=0;
   drag.strips.forEach((strip,i)=>{
     const theta=Math.PI*progress+Math.sin(Math.PI*progress)*.9*((i+.5)/stripCount-.5);
     const angle=-outward*theta;
     const nextX=x+outward*Math.cos(theta)*step,nextZ=z+Math.sin(theta)*step;
     const left=outward>0?x:nextX,depth=outward>0?z:nextZ;
     strip.style.transform='translate3d('+left+'px,0,'+(depth+1)+'px) rotateY('+angle+'rad)';
     strip.style.setProperty('--shade',String(.28*Math.abs(Math.sin(theta))));
     x=nextX;z=nextZ;
   });
 }
 function settle(commit){
   if(!drag||drag.settling)return;
   drag.settling=true;
   const target=drag.target,from=drag.progress,to=commit?1:0;
   const done=()=>{clearFold();if(commit)go(target,false);};
   if(reduced||!from){done();return;}
   const start=performance.now(),duration=160+140*Math.abs(to-from);
   function advance(now){
     if(!drag)return;
     const elapsed=Math.min(1,(now-start)/duration);
     fold(from+(to-from)*(1-Math.pow(1-elapsed,3)));
     if(elapsed<1)settleFrame=requestAnimationFrame(advance);else done();
   }
   settleFrame=requestAnimationFrame(advance);
 }
 book.style.touchAction='pan-y pinch-zoom';
 book.onpointerdown=e=>{
   if(drag||busy||zoom>1||e.button!==0||e.isPrimary===false)return;
   const rect=book.getBoundingClientRect(),offset=e.clientX-rect.left;
   const grip=Math.min(80,Math.max(44,rect.width*.18));
   if(offset>grip && offset<rect.width-grip)return;
   const sign=offset<grip?1:-1,forward=(sign===1)===(direction==='rtl');
   if((forward&&visible().includes(8))||(!forward&&page===0))return;
   const target=forward?(page===0?1:Math.min(8,page+(isSpread()?2:1))):Math.max(0,page-(isSpread()?2:1));
   drag={id:e.pointerId,sign,forward,target,x:e.clientX,y:e.clientY,progress:0,lastX:e.clientX,lastTime:e.timeStamp,velocity:0};
 };
 book.onpointermove=e=>{
   if(!drag||drag.settling||drag.id!==e.pointerId)return;
   const dx=(e.clientX-drag.x)*drag.sign,dy=e.clientY-drag.y;
   if(!drag.progress && Math.abs(dy)>Math.abs(dx)+7){clearFold();return;}
   if(!drag.progress&&dx<5)return;
   book.setPointerCapture?.(e.pointerId);
   drag.velocity=(e.clientX-drag.lastX)*drag.sign/Math.max(1,e.timeStamp-drag.lastTime);
   drag.lastX=e.clientX;drag.lastTime=e.timeStamp;
   fold(Math.max(0,Math.min(1,dx/Math.max(80,book.offsetWidth*(isSpread()?.88:.85)))));
 };
 book.onpointercancel=e=>{if(drag?.id===e.pointerId)settle(false);};
 book.onpointerleave=e=>{if(drag&&!drag.settling&&!book.hasPointerCapture?.(e.pointerId))settle(false);};
 book.onpointerup=e=>{
   if(!drag||drag.id!==e.pointerId)return;
   settle(drag.progress>=.42||(drag.progress>.10&&drag.velocity>.55&&e.timeStamp-drag.lastTime<100));
 };
 
 root.querySelector('.manga-chapter').onchange=e=>{finish();go(e.target.value,false);};root.querySelector('.manga-progress').oninput=e=>{finish();go(e.target.value,false);};
 root.querySelector('.manga-zoom').onchange=e=>{finish();zoom=Number(e.target.value);render();};
 root.querySelector('.manga-mode').onchange=e=>{finish();mode=e.target.value;render();};root.querySelector('.manga-direction').onchange=e=>{finish();direction=e.target.value;render();};
 root.addEventListener('keydown',e=>{if(e.target.closest('input,select,textarea,button,summary'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();(e.key===(direction==='rtl'?'ArrowLeft':'ArrowRight')?next:prev)();}});
 root.querySelector('.manga-bookmark').onclick=()=>{saved=saved===page?0:page;try{if(saved)localStorage.setItem('koma-bookmark',String(saved));else localStorage.removeItem('koma-bookmark');notice.textContent=saved?'Bookmark saved on this device.':'Bookmark removed.';}catch{notice.textContent='This browser cannot save the bookmark. You can keep reading.';}root.querySelector('.manga-resume').hidden=!saved;root.querySelector('.manga-resume').textContent='Resume page '+saved+' ↗';render();};root.querySelector('.manga-resume').onclick=()=>go(saved,false);
 root.querySelector('.manga-full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(root.requestFullscreen)await root.requestFullscreen();else notice.textContent='Fullscreen is unavailable in this browser.';}catch{notice.textContent='Fullscreen is unavailable in this browser.';}};
 let lastWidth=root.clientWidth;const observer=typeof ResizeObserver==='function'?new ResizeObserver(()=>{if(!root.isConnected){observer.disconnect();return;}if(root.clientWidth!==lastWidth){lastWidth=root.clientWidth;finish();render();}}):null;observer?.observe(root);
 disposeManga=()=>{finish();observer?.disconnect();};render();
}

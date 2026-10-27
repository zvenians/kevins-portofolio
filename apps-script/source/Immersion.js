function initImmersion(){
  const html=document.documentElement,header=$('.header');
  if(!$('.living-progress'))document.body.insertAdjacentHTML('afterbegin','<div class="future-atmosphere" aria-hidden="true"><i></i><i></i><i></i><b></b></div><div class="living-progress" aria-hidden="true"></div><div class="living-halo" aria-hidden="true"></div><div class="space-index" aria-hidden="true"><span></span><b>SPACE 00</b><span></span></div>');
  const sections=[...document.querySelectorAll('main section[id]')];
  sections.forEach((section,index)=>{section.classList.add('world-stage');section.dataset.world=String(index).padStart(2,'0');section.style.setProperty('--world-index',index);if(!section.querySelector(':scope > .world-axis'))section.insertAdjacentHTML('afterbegin',`<div class="world-axis" aria-hidden="true"><span>0${index+1}</span><i></i><b>Z ${String((index+1)*12).padStart(3,'0')}</b></div>`);});
  const arrival=$('.arrival');
  if(arrival&&!arrival.querySelector('.arrival-orbit'))arrival.insertAdjacentHTML('afterbegin','<div class="arrival-orbit" aria-hidden="true"><i></i><i></i><i></i><b>KS</b><span>DEPTH / 001</span></div>');
  const rail=$('.space-index');
  if(rail&&sections.length)rail.innerHTML='<span></span><b>SPACE 00</b>'+sections.slice(0,8).map((_,i)=>`<i class="${i===0?'is-current':''}" data-space="${i}"></i>`).join('')+'<span></span>';
  const revealTargets=$$('.section-heading,.exhibit,.workspace,.experiment,.profile-grid,.capability,.connect h2,.connect-actions,.case-copy,.case-visual');
  revealTargets.forEach((el,i)=>{el.classList.add('motion-reveal');el.style.transitionDelay=Math.min(i%4,3)*45+'ms';});
  if(window.__livingObserver)window.__livingObserver.disconnect();
  window.__livingObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');if(entry.target.matches('section[id]'))setCurrentSpace(entry.target,sections);}}),{rootMargin:'-12% 0px -18%',threshold:.08});
  [...sections,...revealTargets].forEach(el=>window.__livingObserver.observe(el));
  initDemoDepth();
  initCreativeLinks();
  initSpatialGallery();
  initDemoStyles();
  if(document.body.dataset.immersionBound)return;
  document.body.dataset.immersionBound='true';
  document.addEventListener('visibilitychange',()=>document.body.classList.toggle('tab-idle',document.hidden));
  let frame=0;
  document.addEventListener('pointermove',event=>{if(reduced||event.pointerType==='touch')return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const nx=event.clientX/innerWidth-.5,ny=event.clientY/innerHeight-.5;html.style.setProperty('--pointer-x',event.clientX+'px');html.style.setProperty('--pointer-y',event.clientY+'px');html.style.setProperty('--scene-x',nx.toFixed(3));html.style.setProperty('--scene-y',ny.toFixed(3));const stage=event.target.closest('.world-stage');if(stage){const rect=stage.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width,y=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));stage.style.setProperty('--world-rx',((.5-y)*2.2).toFixed(2)+'deg');stage.style.setProperty('--world-ry',((x-.5)*3.2).toFixed(2)+'deg');stage.style.setProperty('--world-light',(x*100).toFixed(1)+'% '+(y*100).toFixed(1)+'%');}const arrival=event.target.closest('.arrival');if(arrival){const rect=arrival.getBoundingClientRect();html.style.setProperty('--hero-x',((event.clientX-rect.left)/rect.width-.5).toFixed(3));html.style.setProperty('--hero-y',((event.clientY-rect.top)/rect.height-.5).toFixed(3));}const card=event.target.closest('.exhibit');if(card){const rect=card.getBoundingClientRect();card.style.setProperty('--tilt-x',(((event.clientX-rect.left)/rect.width-.5)*7).toFixed(2));card.style.setProperty('--tilt-y',(((event.clientY-rect.top)/rect.height-.5)*7).toFixed(2));}});});
  document.addEventListener('pointerout',event=>{const card=event.target.closest?.('.exhibit');if(card&&!card.contains(event.relatedTarget)){card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');}const stage=event.target.closest?.('.world-stage');if(stage&&!stage.contains(event.relatedTarget)){stage.style.setProperty('--world-rx','.25deg');stage.style.setProperty('--world-ry','-.35deg');stage.style.setProperty('--world-light','50% 30%');}});
  let scrollFrame=0;
  const updateScroll=()=>{cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight,progress=max>0?(scrollY/max)*100:0;html.style.setProperty('--scroll-progress',progress+'%');header?.classList.toggle('is-scrolled',scrollY>24);sections.forEach(section=>{const rect=section.getBoundingClientRect(),center=(rect.top+rect.height/2-innerHeight/2)/Math.max(innerHeight,1);section.style.setProperty('--world-scroll',Math.max(-1,Math.min(1,center)).toFixed(3));});});};
  addEventListener('scroll',updateScroll,{passive:true});updateScroll();
}
function setCurrentSpace(section,sections){
  const index=Math.max(0,sections.indexOf(section)),rail=$('.space-index');
  if(rail){const label=rail.querySelector('b');if(label)label.textContent='SPACE '+String(index).padStart(2,'0');rail.querySelectorAll('i').forEach((dot,i)=>dot.classList.toggle('is-current',i===index));}
  $$('.header nav a').forEach(link=>link.classList.toggle('is-current',link.getAttribute('href')==='#'+section.id));
}

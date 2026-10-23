function initImmersion(){
  const html=document.documentElement,header=$('.header');
  if(!$('.living-progress'))document.body.insertAdjacentHTML('afterbegin','<div class="living-progress" aria-hidden="true"></div><div class="living-halo" aria-hidden="true"></div><div class="space-index" aria-hidden="true"><span></span><b>SPACE 00</b><span></span></div>');
  const sections=[...document.querySelectorAll('main section[id]')];
  const rail=$('.space-index');
  if(rail&&sections.length)rail.innerHTML='<span></span><b>SPACE 00</b>'+sections.slice(0,8).map((_,i)=>`<i class="${i===0?'is-current':''}" data-space="${i}"></i>`).join('')+'<span></span>';
  const revealTargets=$$('.section-heading,.exhibit,.workspace,.experiment,.profile-grid,.capability,.connect h2,.connect-actions,.case-copy,.case-visual');
  revealTargets.forEach((el,i)=>{el.classList.add('motion-reveal');el.style.transitionDelay=Math.min(i%4,3)*45+'ms';});
  if(window.__livingObserver)window.__livingObserver.disconnect();
  window.__livingObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');if(entry.target.matches('section[id]'))setCurrentSpace(entry.target,sections);}}),{rootMargin:'-12% 0px -18%',threshold:.08});
  [...sections,...revealTargets].forEach(el=>window.__livingObserver.observe(el));
  if(document.body.dataset.immersionBound)return;
  document.body.dataset.immersionBound='true';
  let frame=0;
  document.addEventListener('pointermove',event=>{if(reduced||event.pointerType==='touch')return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{html.style.setProperty('--pointer-x',event.clientX+'px');html.style.setProperty('--pointer-y',event.clientY+'px');const arrival=event.target.closest('.arrival');if(arrival){const rect=arrival.getBoundingClientRect();html.style.setProperty('--hero-x',((event.clientX-rect.left)/rect.width-.5).toFixed(3));html.style.setProperty('--hero-y',((event.clientY-rect.top)/rect.height-.5).toFixed(3));}const card=event.target.closest('.exhibit');if(card){const rect=card.getBoundingClientRect();card.style.setProperty('--tilt-x',(((event.clientX-rect.left)/rect.width-.5)*4).toFixed(2));card.style.setProperty('--tilt-y',(((event.clientY-rect.top)/rect.height-.5)*4).toFixed(2));}});});
  document.addEventListener('pointerout',event=>{const card=event.target.closest?.('.exhibit');if(card&&!card.contains(event.relatedTarget)){card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');}});
  const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight,progress=max>0?(scrollY/max)*100:0;html.style.setProperty('--scroll-progress',progress+'%');header?.classList.toggle('is-scrolled',scrollY>24);};
  addEventListener('scroll',updateScroll,{passive:true});updateScroll();
}
function setCurrentSpace(section,sections){
  const index=Math.max(0,sections.indexOf(section)),rail=$('.space-index');
  if(rail){const label=rail.querySelector('b');if(label)label.textContent='SPACE '+String(index).padStart(2,'0');rail.querySelectorAll('i').forEach((dot,i)=>dot.classList.toggle('is-current',i===index));}
  $$('.header nav a').forEach(link=>link.classList.toggle('is-current',link.getAttribute('href')==='#'+section.id));
}

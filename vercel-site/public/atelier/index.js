import { icon } from './icons.js';
import { locales, names, translate } from './words.js';
import { mountScene } from './scene.js';
import { mountChoreography } from './choreography.js';
import { novaPage } from './nova.js';
import { caseStudy } from './cases.js';
import { capabilities } from './capabilities.js';
import { academicPage, mountAcademic } from './academic.js';
const {
  section,
  projects,
  resume,
  email
} = JSON.parse(document.querySelector('#payload').textContent);
const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[char]);
function read(key, otherwise) {
  try {
    return localStorage.getItem('atelier.' + key) ?? otherwise;
  } catch {
    return otherwise;
  }
}
function save(key, value) {
  try {
    localStorage.setItem('atelier.' + key, value);
    if (key === 'language') localStorage.setItem('portfolio-language', value === 'id' ? 'id' : 'en');
  } catch {}
}
let language = read('language', 'en');
if (!locales.includes(language)) language = 'en';
const t = key => translate(key, language);
// Ambient lighting follows browser-local time; no network calls or reflow.
const hour = new Date().getHours();
document.documentElement.dataset.atmosphere = hour < 11 && hour >= 5 ? 'morning' : hour >= 16 && hour < 19 ? 'dusk' : hour >= 19 || hour < 5 ? 'night' : 'day';
const greetings = {
  en: ['Good morning', 'Good afternoon', 'Good evening', 'Good night'],
  id: ['Selamat pagi', 'Selamat siang', 'Selamat sore', 'Selamat malam'],
  fr: ['Bonjour', 'Bon après-midi', 'Bonsoir', 'Bonne soirée'],
  es: ['Buenos días', 'Buenas tardes', 'Buenas tardes', 'Buenas noches']
};
function visitorGreeting() {
  const hour = new Date().getHours(); // Browser-local time zone, not the server's clock.
  const period = hour >= 5 && hour < 11 ? 0 : hour >= 11 && hour < 15 ? 1 : hour >= 15 && hour < 19 ? 2 : 3;
  return greetings[language][period];
}
const categories = ['work', 'demos', 'capabilities', 'about', 'contact'];
const nav = () => categories.map(id => `<a href="/${id}" ${section === id ? 'aria-current="page"' : ''}>${t(id)}</a>`).join('');
const dockPrimary = [['home','/','home'],['work','/work','layers'],['demos','/demos','play']];
const dockMore = [['dataLab','/#data-lab','data'],['capabilities','/#skills','code'],['academicSupport','/academic-support','academic'],['contact','/contact','mail']];
function mountDock() {
  let dock = document.querySelector('#site-dock');
  if (!dock) { dock = document.createElement('aside'); dock.id = 'site-dock'; document.body.append(dock); }
  const route = ([key,url,glyph], secondary = false) => `<a class="dock-route ${secondary?'dock-secondary':''}" href="${url}" aria-label="${t(key)}" ${section === key || (!section && key === 'home') ? 'aria-current="page"' : ''}><span class="dock-ring" aria-hidden="true">${icon(glyph)}</span><b>${t(key)}</b></a>`;
  dock.innerHTML = `<button class="dock-trigger" type="button" aria-label="${t('openNavigation')}" aria-expanded="false">${icon('menu')}</button><div class="dock-inner"><nav aria-label="${t('openNavigation')}">${dockPrimary.map(item=>route(item)).join('')}<span class="dock-more">${dockMore.map(item=>route(item,true)).join('')}</span></nav><button class="dock-settings" type="button" data-settings aria-label="${t('prefs')}"><span class="dock-ring" aria-hidden="true">${icon('settings')}</span><b>${t('prefs')}</b></button><button class="dock-close" type="button" aria-label="${t('closeNavigation')}">×</button></div>`;
  const trigger = dock.querySelector('.dock-trigger');
  const routes = [...dock.querySelectorAll('.dock-route')];
  // CSS owns dock expansion; Motion only owns per-icon micro-interactions.
  const motion = window.Motion;
  const bubbleStops = routes.concat(dock.querySelector('.dock-settings')).filter(Boolean).map(item => {
    const ring = item.querySelector('.dock-ring');
    const enter = () => motion?.animate?.(ring,{scale:1.17},{duration:.28,ease:[.22,1,.36,1]});
    const leave = () => motion?.animate?.(ring,{scale:1},{duration:.24,ease:'easeOut'});
    item.addEventListener('pointerenter',enter); item.addEventListener('pointerleave',leave);
    item.addEventListener('focus',enter); item.addEventListener('blur',leave);
    return () => { item.removeEventListener('pointerenter',enter); item.removeEventListener('pointerleave',leave); item.removeEventListener('focus',enter); item.removeEventListener('blur',leave); };
  });
  const currentLocation = `${location.pathname}${location.hash}`;
  routes.forEach(route => route.removeAttribute('aria-current'));
  const currentRoute = routes.find(route => {
    const target = new URL(route.href, location.href);
    const targetLocation = `${target.pathname}${target.hash}`;
    return location.hash ? targetLocation === currentLocation : !target.hash && target.pathname === location.pathname;
  });
  currentRoute?.setAttribute('aria-current', 'page');
  if (currentRoute) {
    currentRoute.classList.add('is-arriving');
    currentRoute.addEventListener('animationend', () => currentRoute.classList.remove('is-arriving'), {once:true});
  }
  routes.forEach(route => route.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = new URL(route.href, location.href);
    if (target.origin !== location.origin) return;
    event.preventDefault();
    routes.forEach(item => item.removeAttribute('aria-current'));
    route.setAttribute('aria-current', 'page');
    route.classList.add('is-departing');
    setTimeout(() => location.assign(target.href), 300);
  }));
  const mobile = () => matchMedia('(max-width:899px)').matches;
  const setOpen = (open, restore = false) => { dock.classList.toggle('is-open',open); trigger.setAttribute('aria-expanded',String(open)); document.body.classList.toggle('dock-open',open && mobile()); if (open && mobile()) dock.querySelector('nav a').focus(); else if (!open && restore && mobile()) trigger.focus(); };
  trigger.onclick = () => setOpen(!dock.classList.contains('is-open'));
  dock.querySelector('.dock-close').onclick = () => setOpen(false, true);
  dock.onkeydown = e => {
    if (e.key === 'Escape') setOpen(false, true);
    if (e.key === 'Tab' && dock.classList.contains('is-open')) {
      const links = [...dock.querySelectorAll('.dock-inner a,.dock-inner button')].filter(el => getComputedStyle(el).display !== 'none');
      const first = links[0], last = links.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  return () => {
    bubbleStops.forEach(stop => stop());
  };
}
const flagship = [
  ['KOMA Manga Reader', 'creative', '/work/koma-manga-reader', 'web-manga'],
  ['Daun & Bara', 'restaurant', '/edisi/resto.html', 'showcase/dining'],
  ['Lintas Teluk', 'travel', '/edisi/travel.html', 'showcase/atlas'],
  ['Ruang Rawat', 'care', '/edisi/care.html', 'showcase/care'],
  ['NOVA Creative', 'nova', '/nova', 'showcase/nova'],
  ['Undangan Digital', 'creative', '/work/wedding-invitation-demo', 'classic']
];
const real = projects.filter(p => p.status === 'Real Project');
const demos = projects.filter(p => p.status === 'Interactive Demo');
const publicCV = '/resume/Kevin-Oloan-Simatupang-CV.pdf';
let demoIndex = 0;
function projectRow(p, i) {
  return `<a class="project-row" href="/work/${encodeURIComponent(p.slug)}"><small>${String(i + 1).padStart(2, '0')}</small><span><strong>${esc(p.name)}</strong><small>${(p.technologies || []).slice(0, 3).map(esc).join(' / ')}</small></span><b aria-hidden="true">${icon('outward')}</b></a>`;
}
function picks() {
  const slugs = ['atlas-logistics-command-center','digital-wedding-invitation','galilea-web-portal','galilea-digital-archive','majelis-galilea','naomi-rouli'];
  const selected = slugs.map(slug => projects.find(p => p.slug === slug)).filter(Boolean);
  const cover = p => p.slug === 'digital-wedding-invitation'
    ? '/project-shots/wedding-demo-live.png'
    : `/project-shots/${encodeURIComponent(p.slug)}.webp`;
  const cards = selected.map((p, i) => `<a class="showpiece" style="--folio-index:${i}" href="/work/${encodeURIComponent(p.slug)}" aria-label="${esc(p.name)}" draggable="false"><div class="shot"><span class="shot-fallback">${esc(p.name)}</span><img src="${cover(p)}" alt="${esc(p.name)} project interface" width="1200" height="745" ${i?'loading="lazy"':'fetchpriority="high"'} decoding="async" draggable="false"></div><span class="folio-copy"><small>${esc(p.category || t('project'))}</small><b>${esc(p.name)}</b><span>${esc(p.summary || '')}</span><strong>${t('view')} ${icon('outward')}</strong></span></a>`).join('');
  return `<div class="folio-shell"><div class="folio-tools"><p>${t('folioNote')}</p></div><div class="showcase project-folio" tabindex="0" aria-label="${t('work')}" aria-roledescription="carousel"><div class="folio-cycle">${cards}</div><div class="folio-status"><output aria-live="off" aria-label="Project position">01 / 06</output><span class="folio-progress" aria-hidden="true"><i></i></span><small>AUTO / DRAG</small></div></div></div>`;
}
const dataLabSlugs = ['operations-decision-workbench','research-data-preparation-studio','research-practice-toolkit','asset-field-companion','document-automation-studio','sera-commerce-operations-console'];
function dataLab() {
  const entries = dataLabSlugs.map(slug => projects.find(project => project.slug === slug)).filter(Boolean);
  return `<div class="data-lab-intro"><h3>${t('dataLabTitle')}</h3><p>${t('dataLabNote')}</p></div><div class="data-lab-grid">${entries.map((project,index)=>`<a href="/work/${encodeURIComponent(project.slug)}?launch=1" class="data-lab-card"><small>${String(index+1).padStart(2,'0')} / ${esc(project.category)}</small><figure><img src="/demo-shots/${esc(project.visual)}.webp" width="720" height="430" loading="lazy" alt="${esc(project.name)} interface"></figure><strong>${esc(project.name)}</strong><span>${esc(project.summary)}</span><div class="lab-signal" aria-hidden="true"><svg viewBox="0 0 180 48" preserveAspectRatio="none"><path class="lab-baseline" d="M0 45 H180"/><path class="lab-trace" d="${['M2 37 L30 29 L48 34 L67 13 L92 20 L111 11 L142 17 L178 5','M2 35 L27 30 L49 13 L67 22 L84 16 L101 25 L125 10 L178 8','M2 38 L27 36 L50 24 L70 31 L98 13 L117 17 L153 7 L178 12','M2 36 L31 20 L57 27 L88 15 L116 26 L146 11 L178 8','M2 29 L30 25 L54 16 L77 28 L97 18 L129 12 L151 16 L178 5','M2 39 L36 31 L60 28 L81 15 L110 19 L135 8 L157 11 L178 5'][index]}"/></svg><span class="lab-metadata">MODULE / 0${index+1} <i>${esc((project.technologies || []).slice(0,2).join(' · '))}</i></span></div></a>`).join('')}</div><a class="more" href="/demos">${t('legacy')}</a>`;
}
function brands() {
  return `<div class="brands product-gallery demo-theatre" data-demo-theatre><div class="demo-tabs" role="tablist" aria-label="${t('demos')}">${flagship.map(([name,kind],i)=>`<button type="button" role="tab" id="demo-tab-${i}" aria-controls="demo-panel-${i}" aria-selected="${i===demoIndex}" tabindex="${i===demoIndex?0:-1}" data-demo-tab="${i}"><span>0${i+1}</span><strong>${name}</strong><small>${t(kind)}</small></button>`).join('')}</div><div class="demo-stage">${flagship.map(([name,kind,url,image],i)=>`<article class="demo-panel" role="tabpanel" tabindex="0" id="demo-panel-${i}" aria-labelledby="demo-tab-${i}" ${i===demoIndex?'':'hidden'}><a class="brand brand-${kind}" href="${url}"><figure><img loading="lazy" width="940" height="645" src="/demo-shots/${image}.webp" alt=""></figure><div><small>0${i+1} / ${t(kind)}</small><h3>${name}</h3><span>${t('open')} ${icon('outward')}</span></div></a></article>`).join('')}<div class="demo-controls"><button type="button" data-demo-prev aria-label="${t('previousDemo')}">←</button><output>${String(demoIndex+1).padStart(2,'0')} / ${String(flagship.length).padStart(2,'0')}</output><button type="button" data-demo-next aria-label="${t('nextDemo')}">→</button></div></div></div>`;
}
function heading(id, num) {
  return `<div class="heading"><small>${num} / KS</small><h2>${t(id)}</h2></div>`;
}
function home() {
  return `<section class="hero"><div class="scene"><canvas aria-hidden="true"></canvas><small>FIG. 01 &nbsp; / &nbsp; ${t('film')}</small></div><div class="hero-text"><small>CODE / CRAFT / MOTION</small><small class="visitor-greeting">${visitorGreeting()}</small><h1>Kevin<br><em>Simatupang.</em></h1><strong class="hero-role">${t('creativeProgrammer')}</strong><p>${t('hero')}</p><div class="actions"><a class="solid" href="#work">${t('explore')}</a><a href="/demos">${t('demos')}</a></div><a class="hero-academic" href="/academic-support">${t('heroAcademic')}</a></div></section><div class="axis"><small>KS / PORTFOLIO</small><small>${t('location')}</small></div><section class="block" id="work">${heading('work', '01')}${picks()}<a class="more" href="/work">${t('all')}</a></section><section class="block" id="studio">${heading('demos', '02')}${brands()}<a class="more" href="/demos">${t('legacy')}</a></section><section class="block data-lab" id="data-lab">${heading('dataLab', '03')}${dataLab()}</section><section id="skills" class="block">${heading('capabilities', '04')}${skillsSummary()}</section>`;
}
function skillsSummary() {
  const groups = [
    ['skillLanguages', [['JavaScript','javascript'],['TypeScript','typescript'],['Python','python'],['Java','java'],['C','c'],['C++','cpp'],['C#','csharp'],['Go','go'],['Rust','rust'],['PHP','php'],['Kotlin','kotlin'],['Swift','swift'],['Ruby','ruby']]],
    ['skillFrameworks', [['React','react'],['Next.js','nextjs'],['Vue.js','vuejs'],['Angular','angular'],['Svelte','svelte'],['Node.js','nodejs'],['Express','express'],['Django','django'],['Flask','flask'],['Laravel','laravel'],['Spring','spring']]],
    ['skillData', [['PostgreSQL','postgresql'],['MySQL','mysql'],['MongoDB','mongodb'],['Redis','redis'],['SQLite','sqlite'],['Firebase','firebase']]],
    ['skillDelivery', [['HTML5','html5'],['CSS3','css3'],['Git','git'],['Docker','docker'],['Linux','linux'],['GitHub Actions','githubactions'],['Figma','figma'],['Bash','bash']]]
  ];
  const chip = ([name,logo], category, duplicate = false) => `<li>${duplicate ? `<span class="skill-copy"><img loading="lazy" width="24" height="24" src="/edisi/logos/${logo}.svg" alt=""><span>${name}</span></span>` : `<button type="button" class="skill-chip" data-skill="${esc(name)}" data-category="${esc(t(category))}" aria-label="${esc(name)}: ${esc(t(category))}"><img loading="lazy" width="24" height="24" src="/edisi/logos/${logo}.svg" alt=""><span>${name}</span></button>`}</li>`;
  return `<div class="skill-intro"><div><small>${t('selectedStrengths')}</small><h3><em>${t('craft')}</em><br>${t('verifiable')}</h3><p>${t('skillMotionNote')}</p></div><div class="skill-lattice" aria-hidden="true"></div></div><div class="skill-rails">${groups.map(([label,items],i)=>{const content=items.map(item=>chip(item,label)).join('');const copy=items.map(item=>chip(item,label,true)).join('');return `<div class="skill-rail" style="--rail:${i}"><strong>${t(label)}</strong><div class="skill-window"><div class="skill-track"><ul>${content}</ul><ul aria-hidden="true">${copy}</ul></div></div></div>`}).join('')}</div><div class="skill-popover" hidden role="dialog" aria-label="${t('skillDetails')}"><button type="button" class="skill-close" aria-label="${t('close')}">×</button><div class="skill-detail"></div></div><a class="more" href="/capabilities">${t('catalog')} ${icon('outward')}</a>`;
}
function mountSkills() {
  const root = document.querySelector('#skills');
  if (!root) return () => {};
  const pop = root.querySelector('.skill-popover');
  let selected;
  const close = () => { pop.hidden=true; root.classList.remove('skill-reading'); selected?.focus(); };
  root.querySelectorAll('.skill-chip').forEach(button => button.onclick = () => {
    selected=button;
    button.classList.remove('is-bouncing'); void button.offsetWidth; button.classList.add('is-bouncing');
    const name=button.dataset.skill, category=button.dataset.category;
    const matches=projects.filter(p => p.visibility !== 'draft' && (p.technologies || []).some(tech => tech.toLowerCase() === name.toLowerCase())).slice(0,3);
    pop.querySelector('.skill-detail').innerHTML=`<small>${esc(category)}</small><h3>${esc(name)}</h3>${matches.length ? matches.map(p=>`<a href="/work/${encodeURIComponent(p.slug)}">${esc(p.name)} ${icon('outward')}</a>`).join('') : `<p>${t('noSkillProject')}</p>`}`;
    pop.hidden=false; root.classList.add('skill-reading'); pop.querySelector('.skill-close').focus();
  });
  pop.querySelector('.skill-close').onclick=close;
  const key = e => { if (e.key==='Escape' && !pop.hidden) close(); };
  const outside = e => { if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('.skill-chip')) close(); };
  document.addEventListener('keydown',key); document.addEventListener('pointerdown',outside);
  return () => { document.removeEventListener('keydown',key); document.removeEventListener('pointerdown',outside); };
}
function mountProjectFolio() {
  const folio = document.querySelector('.showcase.project-folio');
  if (!folio) return () => {};
  const cards = [...folio.querySelectorAll('.showpiece')];
  const progress = folio.querySelector('.folio-progress i');
  let active = 0, timer, start = null, dragged = false;
  // Only CSS interpolates the stack transform; Motion does not also animate the variables.
  const show = index => {
    const next = (index + cards.length) % cards.length;
    if (next !== active) {
      const incoming = cards[next];
      incoming.style.setProperty('transition', 'none', 'important');
      incoming.style.setProperty('--stack-y', `${folio.clientHeight * .64}px`);
      incoming.style.setProperty('--stack-scale', '1.06');
      incoming.style.setProperty('--stack-opacity', '0');
      incoming.style.setProperty('--stack-tilt', '-2deg');
      void incoming.offsetHeight;
      incoming.style.removeProperty('transition');
    }
    active = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      const offset = (active - i + cards.length) % cards.length;
      card.style.setProperty('--stack-offset', offset);
      const values = {
        '--stack-y': `${folio.clientHeight * [.50,.385,.285,.19,.105,.045][offset]}px`,
        '--stack-scale': [1,.92,.85,.79,.73,.53][offset],
        '--stack-tilt': `${Math.min(offset * .7, 2.8)}deg`,
        '--stack-brightness': Math.max(1 - offset * .085, .66)
      };
      card.style.setProperty('--stack-opacity', offset === cards.length - 1 ? '0' : '1');
      Object.entries(values).forEach(([name,value]) => card.style.setProperty(name,String(value)));
      card.style.zIndex = String(cards.length - offset);
      const current = offset === 0;
      card.dataset.active = String(current);
      card.classList.toggle('is-active', current);
      card.setAttribute('aria-hidden', String(!current));
      card.tabIndex = current ? 0 : -1;
    });
    folio.querySelector('output').textContent = `${String(active + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    progress.classList.remove('is-running');
    void progress.offsetWidth;
    progress.classList.add('is-running');
  };
  const pause = () => clearTimeout(timer);
  const resume = () => { pause(); timer = setTimeout(() => { show(active + 1); resume(); }, 1100); };
  const down = e => { if (start || (e.pointerType === 'mouse' && e.button !== 0)) return; start = {x:e.clientX,y:e.clientY}; dragged = false; folio.classList.add('is-dragging'); if (e.pointerId !== undefined && e.pointerType !== 'touch') folio.setPointerCapture(e.pointerId); };
  const move = e => { if (!start) return; const delta=e.clientY-start.y; if (Math.abs(delta)>8) { dragged=true; if (e.pointerType !== 'touch') folio.style.setProperty('--gesture-y', `${Math.max(-35,Math.min(35,delta))}px`); } };
  const up = e => { if (!start) return; const delta=e.clientY-start.y, horizontal=e.clientX-start.x; start=null; folio.classList.remove('is-dragging'); folio.style.setProperty('--gesture-y','0px'); if (e.pointerId !== undefined && folio.hasPointerCapture(e.pointerId)) folio.releasePointerCapture(e.pointerId); if (e.type !== 'pointercancel' && Math.abs(delta)>45 && Math.abs(delta)>Math.abs(horizontal)) show(active + (delta<0?1:-1)); resume(); };
    const keydown = event => { if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return; event.preventDefault(); show(active + (['ArrowRight','ArrowUp'].includes(event.key) ? 1 : -1)); resume(); };
  const activate = event => {
    const card = event.target.closest('.showpiece.is-active');
    if (!card || event.defaultPrevented || dragged || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); folio.classList.add('is-revealing');
    setTimeout(() => location.assign(card.href), 260);
  };
  // On Android, horizontal swipe changes cards; vertical gestures remain native page scrolling.
  let touchOrigin = null;
  const touchStart = e => { const touch=e.touches[0]; if(touch) touchOrigin={x:touch.clientX,y:touch.clientY}; };
  const touchEnd = e => {
    if(!touchOrigin) return;
    const touch=e.changedTouches[0]; if(!touch){touchOrigin=null;return;}
    const dx=touch.clientX-touchOrigin.x, dy=touch.clientY-touchOrigin.y;
    touchOrigin=null;
    if(Math.abs(dx)>48 && Math.abs(dx)>Math.abs(dy)*1.3){dragged=true;show(active+(dx<0?1:-1));resume();}
  };
  show(0);
  resume();
    folio.addEventListener('pointerdown', down);
  folio.addEventListener('pointermove', move);
  folio.addEventListener('pointerup', up);
  folio.addEventListener('pointercancel', up);
  folio.addEventListener('touchstart', touchStart, {passive:true});
  folio.addEventListener('touchend', touchEnd, {passive:true});
  folio.addEventListener('touchcancel', () => {touchOrigin=null;}, {passive:true});
  folio.addEventListener('dragstart', event => event.preventDefault());
  folio.addEventListener('keydown', keydown);
  folio.addEventListener('click', activate);
    folio.addEventListener('click', e => { if (dragged) { e.preventDefault(); dragged=false; } }, true);
  const imageError = event => {
    if (event.target instanceof HTMLImageElement && event.target.closest('.showpiece')) {
      event.target.closest('.shot')?.classList.add('is-unavailable');
    }
  };
  folio.addEventListener('error', imageError, true);
  const resize = () => show(active);
  window.addEventListener('resize', resize);
  return () => { pause(); window.removeEventListener('resize', resize); folio.removeEventListener('error', imageError, true); folio.removeEventListener('touchstart',touchStart); folio.removeEventListener('touchend',touchEnd); };
}
function mountEditorialReveals() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const contexts = [];
  const hero = document.querySelector('.hero-text');
  if(hero){
    const layers=hero.querySelectorAll(':scope > small,:scope > h1,:scope > strong,:scope > p,:scope > .actions,:scope > .hero-academic');
    contexts.push(gsap.fromTo(layers,{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.78,stagger:.065,ease:'power3.out',clearProps:'transform,opacity,visibility'}));
  }
  const process = document.querySelector('.process ol');
  if(process){
    const timeline=ScrollTrigger.create({trigger:process,start:'top 86%',end:'bottom 30%',onUpdate:self=>process.style.setProperty('--process-progress',self.progress.toFixed(3))});
    contexts.push({kill:()=>timeline.kill()});
  }
  document.querySelectorAll('.block').forEach(section => {
    const targets = section.querySelectorAll(':scope > .heading, :scope > .data-lab-intro, :scope > ol > li, :scope > .bio-chapter, :scope > .flow');
    if (!targets.length) return;
    contexts.push(gsap.fromTo(targets,{autoAlpha:0,y:26},{autoAlpha:1,y:0,duration:.7,stagger:.075,ease:'power3.out',clearProps:'transform,opacity,visibility',scrollTrigger:{trigger:section,start:'top 84%',once:true}}));
  });
  return () => contexts.forEach(animation => { animation.scrollTrigger?.kill(); animation.kill(); });
}
function mountDemoTheatre() {
  const theatre = $('[data-demo-theatre]');
  if (!theatre) return () => {};
  const tabs = [...theatre.querySelectorAll('[data-demo-tab]')], panels = [...theatre.querySelectorAll('.demo-panel')];
  const stage = theatre.querySelector('.demo-stage');
  stage?.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !matchMedia('(hover:hover)').matches) return;
    const rect = stage.getBoundingClientRect();
    stage.style.setProperty('--demo-rotate-y', (((event.clientX - rect.left) / rect.width) - .5) * 4 + 'deg');
    stage.style.setProperty('--demo-rotate-x', (.5 - ((event.clientY - rect.top) / rect.height)) * 3 + 'deg');
  });
  stage?.addEventListener('pointerleave', () => { stage.style.removeProperty('--demo-rotate-y'); stage.style.removeProperty('--demo-rotate-x'); });

  let timer, touchStart = 0, pointerStart = null, pointerMoved = false, visible = false;
  const stop = () => { clearTimeout(timer); timer = 0; };
  const show = (index, focus = false) => {
    theatre.style.setProperty('--demo-direction', index < demoIndex ? '-1' : '1');
    demoIndex = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const active = i === demoIndex;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panels.forEach((panel, i) => panel.hidden = i !== demoIndex);
    const tabstrip=theatre.querySelector('.demo-tabs');
    const selected=tabs[demoIndex];
    if(matchMedia('(max-width:800px)').matches && selected && tabstrip){
      const tbox=selected.getBoundingClientRect(),box=tabstrip.getBoundingClientRect();
      tabstrip.scrollTo({left:tabstrip.scrollLeft+tbox.left-box.left-(box.width-tbox.width)/2,behavior:'smooth'});
    }
    theatre.querySelector('output').textContent = `${String(demoIndex + 1).padStart(2,'0')} / ${String(tabs.length).padStart(2,'0')}`;
  };
  const schedule = () => { stop(); if (visible && !document.hidden) timer = setTimeout(() => { show(demoIndex + 1); schedule(); }, 2400); };
  tabs.forEach((tab, i) => {
    tab.onclick = () => { show(i); schedule(); };
    tab.onkeydown = event => {
      const next = {ArrowLeft:demoIndex-1,ArrowUp:demoIndex-1,ArrowRight:demoIndex+1,ArrowDown:demoIndex+1,Home:0,End:tabs.length-1}[event.key];
      if (next === undefined) return;
      event.preventDefault(); show(next, true); schedule();
    };
  });
  $('[data-demo-prev]').onclick = () => { show(demoIndex - 1); schedule(); };
  $('[data-demo-next]').onclick = () => { show(demoIndex + 1); schedule(); };
  theatre.onpointerdown = event => {
    if (event.pointerType === 'mouse' && event.button === 0 && stage.querySelector('.demo-panel:not([hidden])')?.contains(event.target)) { pointerStart = event.clientX; pointerMoved = false; }
    else if (event.pointerType !== 'mouse') touchStart = event.clientX;
  };
  theatre.onpointerup = event => {
    if (event.pointerType === 'mouse' && pointerStart !== null) {
      const distance = event.clientX - pointerStart; pointerStart = null; stage.classList.remove('is-dragging'); stage.style.removeProperty('--demo-drag');
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
      if (Math.abs(distance) > 45) { pointerMoved = true; show(demoIndex + (distance < 0 ? 1 : -1)); schedule(); }
      return;
    }
    if (!touchStart) return;
    const distance = event.clientX - touchStart; touchStart = 0;
    if (Math.abs(distance) > 45) { show(demoIndex + (distance < 0 ? 1 : -1)); schedule(); }
  };
  theatre.addEventListener('pointermove', event => { if (pointerStart === null || event.pointerType !== 'mouse') return; const distance = event.clientX - pointerStart; if (Math.abs(distance) <= 6) return; if (!stage.hasPointerCapture(event.pointerId)) stage.setPointerCapture(event.pointerId); stage.classList.add('is-dragging'); stage.style.setProperty('--demo-drag', `${Math.max(-80, Math.min(80, distance))}px`); });
  theatre.addEventListener('pointercancel', () => { pointerStart = null; stage.classList.remove('is-dragging'); stage.style.removeProperty('--demo-drag'); });
  theatre.addEventListener('click', event => { if (pointerMoved) { event.preventDefault(); pointerMoved = false; } }, true);
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio > .18);
    visible ? schedule() : stop();
  }, {threshold:[0,.18,.5]});
  observer.observe(theatre);
  return () => { stop(); observer.disconnect(); };
}
let step = 0,
  brief = {};
let libraryGroup = 'all';
try {
  brief = JSON.parse(sessionStorage.getItem('atelier.brief') || '{}') || {};
} catch {}
const steps = [['type', 'existing', 'scope', 'audience'], ['budget', 'time'], ['name', 'email']];
function inquiry() {
  const keys = steps[step];
  const progress = `<div class="brief-progress" aria-hidden="true">${Array.from({length:4},(_,i)=>`<i class="${i<=step?'is-complete':''}"></i>`).join('')}</div>`;
  return `<div class="flow"><aside>${['project', 'plan', 'contact', 'review'].map((k, i) => `<p class="${i === step ? 'current' : ''}">0${i + 1}　${t(k)}</p>`).join('')}</aside><form id="inquiry">${progress}<small class="brief-edition">CREATIVE BRIEF / 0${step+1} — 04</small><h2>${t(['project', 'plan', 'contact', 'review'][step])}</h2>${keys ? keys.map(k => `<label>${t(k)}${k === 'scope' ? `<textarea name="scope" required maxlength="2500">${esc(brief.scope)}</textarea>` : `<input name="${k}" type="${k === 'time' ? 'date' : k === 'email' ? 'email' : 'text'}" value="${esc(brief[k])}" maxlength="160" required>`}</label>`).join('') : `<dl>${steps.flat().map(k => `<dt>${t(k)}</dt><dd>${esc(brief[k])}</dd>`).join('')}</dl><p>${t('mailhint')}</p>`}${!keys ? `<p class="brief-privacy">${t('formPrivacy')}</p><label class="brief-honeypot" aria-hidden="true">Company website<input type="text" name="website" tabindex="-1" autocomplete="off"></label><p class="brief-result" id="inquiry-result" role="status" aria-live="polite"></p><a id="email-backup" href="#" hidden>${t('mailFallback')} ↗</a>` : ''}<div class="actions">${step ? `<button type="button" id="back">${t('back')}</button>` : ''}<button class="solid" type="submit">${t(keys ? 'next' : 'sendInquiry')} →</button></div></form></div>`;
}
let dispose;
function render() {
  dispose?.();
  document.documentElement.lang = language;
  $('.skip').textContent = t('skip');
  
  $('#bar').innerHTML = `<a href="/" class="wordmark">ks<span>.</span></a><nav>${nav()}</nav><div><button data-settings>${language.toUpperCase()} ${icon('down')}</button><button data-menu>${t('menu')} ${icon('menu')}</button></div>`;
  const disposeDock = mountDock();
  $('#foot').innerHTML = `<a class="wordmark" href="/">ks<span>.</span></a><small>© 2026 Kevin Oloan Simatupang · Balikpapan</small><button data-settings>${t('prefs')}</button>`;
  let body;
  switch (section) {
    case 'work':
      body = picks() + projects.filter(p => ['Concept','Historical Prototype'].includes(p.status)).map(projectRow).join('');
      break;
    case 'demos':
      body = brands() + `<div id="library">${heading('legacy', '02')}<input id="search" type="search" aria-label="${t('search')}" placeholder="${t('search')}"><div id="results"></div></div>`;
      break;
    case 'about':
      body = `<div class="bio"><p>${t('profile')}</p><small>${t('location')}</small><div class="actions"><a class="solid" href="/work">${t('explore')} ${icon('outward')}</a></div></div>`;
      break;
    case 'capabilities':
      body = '<div id="capability-map"></div>';
      break;
    case 'contact':
      body = inquiry();
      break;
    case 'resume':
      body = `<section class="block resume-page"><small>KS / ${t('resumeTitle')}</small><h1>${t('resumeTitle')}</h1><p>${t('resumeAvailable')}</p><div class="resume-current"><small>2026 / ${t('currentWork')}</small><h2>PT Wulandari Bangun Laksana Tbk</h2><p>${t('currentPeriod')}</p></div><div class="resume-file"><small>PDF / Kevin Oloan Simatupang</small><a class="solid" href="${publicCV}" target="_blank" rel="noopener">${t('resumeOpen')} ${icon('outward')}</a></div><div class="resume-proof"><h2>${t('work')}</h2>${real.slice(0,4).map(projectRow).join('')}</div><div class="actions"><a class="more" href="/contact">${t('contact')} →</a></div></section>`;
      break;
    case 'academic-support':
      body = academicPage(language);
      break;
    case '404':
      body = `<section class="block missing-page"><small>404 / KS</small><div class="missing-orbit" aria-hidden="true"><i></i><i></i><i></i></div><h1>${t('missingTitle')}</h1><p>${t('missingNote')}</p><div class="actions"><a class="solid" href="/">${t('home')} ${icon('outward')}</a><a href="/work">${t('work')} →</a><a href="/demos">${t('demos')} →</a></div></section>`;
      break;
    case 'nova':
      body = novaPage(language);
      break;
    default:
      body = section.startsWith('nova/') ? novaPage(language) : section.startsWith('work/') ? caseStudy(projects.find(p => p.slug === section.slice(5)), language, esc, t) : home();
  }
  $('#content').innerHTML = categories.includes(section) ? `<section class="block sub"><small>Kevin Simatupang / ${t('edition')}</small><h1>${t(section)}</h1>${body}</section>` : body;
  if (!section || section === 'about') {
    const notes = t('processNotes').split(' · ');
    $('#content').insertAdjacentHTML('beforeend', `<section class="block process">${heading('process', '05')}<ol>${t('phases').split(' · ').map((phase, i) => `<li><small>0${i + 1}</small><h3>${phase}</h3><p>${notes[i]}</p></li>`).join('')}</ol></section><section class="block closing"><small>${t('edition')} / Balikpapan</small><h2>${t('contact')}</h2><div class="actions"><a class="solid" href="/contact">${t('contact')}</a><a href="/about">${t('about')}</a></div></section>`);
  }
  if(!section) $('.closing').insertAdjacentHTML('beforebegin', `<section class="block bio-chapter">${heading('about','06')}<p>${t('profile')}</p><a class="more" href="/about">${t('about')}</a></section>`);
  if(!section) $('.closing').insertAdjacentHTML('beforeend',inquiry());
  if(section==='nova' || section.startsWith('nova/')) $('#bar nav').innerHTML=`<a href="/demos">← ${t('demos')}</a>`;
  if (section === 'about') $('.bio').insertAdjacentHTML('beforeend', `<div class="bio-facts"><strong>${t('currentWork')}</strong><p>PT Wulandari Bangun Laksana Tbk · ${t('currentPeriod')}</p><strong>${t('education')}</strong><p>${t('practice')}</p><a href="/resume">CV / PDF ${icon('outward')}</a></div>`);
  const disposeScene = mountScene($('.scene canvas'));
  const disposeCamera = mountChoreography();
  const disposeAcademic = mountAcademic(language,email);
  const disposeFolio = mountProjectFolio();
  const disposeSkills = mountSkills();
  const disposeDemos = mountDemoTheatre();
  const disposeReveals = mountEditorialReveals();
  dispose = () => { disposeScene?.(); disposeCamera(); disposeAcademic?.(); disposeDemos(); disposeFolio(); disposeSkills(); disposeDock(); disposeReveals(); };
  document.querySelectorAll('a[href="/edisi/skill.html"]').forEach(a => a.href = '/capabilities');
  if (section === 'demos') {
    document.querySelectorAll('.demo-panel').forEach((panel, i) => {
      const [name, kind, url] = flagship[i];
      if (!['restaurant', 'travel', 'care'].includes(kind)) return;
      panel.insertAdjacentHTML('beforeend', `<details class="brief-case"><summary>${t('view')}</summary><h3>${name}</h3><h4>${t('flow')}</h4><p>${t(kind + 'Flow')}</p><h4>${t('logic')}</h4><p>${t(kind + 'Logic')}</p><a href="${url}">${t('open')} ${icon('outward')}</a></details>`);
    });
    $('#library').insertAdjacentHTML('beforebegin', `<aside class="academic-entry"><small>STUDENT / SUPPORT</small><h2>${t('academicSupport')}</h2><p>${t('academicLead')}</p><a class="solid" href="/academic-support">${t('academicCta')} ${icon('outward')}</a></aside>`);
  }
  if ($('#capability-map')) capabilities($('#capability-map'), projects, language, esc);
  if (section === 'capabilities') $('#capability-map').insertAdjacentHTML('afterend', `<aside class="academic-entry"><small>EXCEL / SPSS / DATA / DOCUMENTS</small><h2>${t('academicSupport')}</h2><p>${t('academicLead')}</p><a class="solid" href="/academic-support">${t('academicCta')} ${icon('outward')}</a></aside>`);
  if (section === 'contact') $('#inquiry').insertAdjacentHTML('afterend', `<aside class="academic-entry"><small>STUDENT / SUPPORT</small><h2>${t('academicSupport')}</h2><p>${t('academicLead')}</p><a class="solid" href="/academic-support">${t('academicCta')} ${icon('outward')}</a></aside>`);
  if ($('#search')) {
    $('#search').insertAdjacentHTML('beforebegin', `<div class="library-filters" role="group" aria-label="${t('libraryFilter')}">${['all','appsGroup','excelData','researchGroup','creative'].map(key=>`<button data-library="${key}" aria-pressed="${libraryGroup===key}">${t(key)}</button>`).join('')}</div>`);
    const search = () => {
      const q = $('#search').value.toLowerCase();
      const types={appsGroup:['booking','commerce','commerceops','scopebuilder','fieldcompanion','attendance','archive','qualityroom'],excelData:['operations','dataprep','documents'],researchGroup:['researchtools'],creative:['morphslides','logostudio','wedding','manga']};
      const rows = demos.filter(p => [p.name, ...p.technologies].join(' ').toLowerCase().includes(q) && (libraryGroup==='all'||types[libraryGroup]?.includes(p.visual))).sort((a,b)=>Number(b.slug==='koma-manga-reader')-Number(a.slug==='koma-manga-reader'));
      const groups=[
        [t('creative'),types.creative],
        [t('appsGroup'),types.appsGroup],
        [t('excelData'),types.excelData],
        [t('researchGroup'),types.researchGroup]
      ];
      $('#results').innerHTML = groups.map(([label,types])=>{
        const group=rows.filter(p=>types.includes(p.visual));
        return group.length?`<section class="library-group"><h3>${label}</h3>${group.map(projectRow).join('')}</section>`:'';
      }).join('') + rows.filter(p=>!groups.some(([,types])=>types.includes(p.visual))).map(projectRow).join('') || `<p>${t('empty')}</p>`;
    };
    $('#search').oninput = search;
    document.querySelectorAll('[data-library]').forEach(button=>button.onclick=()=>{
      libraryGroup=button.dataset.library;
      document.querySelectorAll('[data-library]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
      search();
    });
    search();
  }
  mountInquiry();
}
function mountInquiry() {
  if (!$('#inquiry')) return;
  {
    const form = $('#inquiry');
    function stash() {
      Object.assign(brief, Object.fromEntries(new FormData(form)));
      try {
        sessionStorage.setItem('atelier.brief', JSON.stringify(brief));
      } catch {}
    }
    form.oninput = stash;
    form.onsubmit = async e => {
      e.preventDefault();
      stash();
      if (step < 3) {
        step++;
        const flow=form.closest('.flow');
        flow.outerHTML=inquiry();
        mountInquiry();
        $('#inquiry h2').scrollIntoView({block:'nearest'});
        return;
      }
      const submit=form.querySelector('button[type=submit]');
      const status=form.querySelector('#inquiry-result');
      const backup=form.querySelector('#email-backup');
      const draft='mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent(brief.type || 'Project request')+'&body='+encodeURIComponent(steps.flat().map(k=>t(k)+': '+(brief[k]||'')).join('\n'));
      submit.disabled=true;
      submit.textContent=t('sendingInquiry');
      backup.hidden=true;
      try {
        const response=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(brief)});
        const result=await response.json().catch(()=>({}));
        if(!response.ok || !result.ok) throw new Error(result.code || 'DELIVERY_UNAVAILABLE');
        status.textContent=t('sentInquiry');
        try {sessionStorage.removeItem('atelier.brief');} catch {}
        brief={};step=0;
        submit.hidden=true;
      } catch {
        status.textContent=t('failedInquiry');
        backup.href=draft;
        backup.hidden=false;
      } finally {
        submit.disabled=false;
        if(!submit.hidden) submit.textContent=t('sendInquiry')+' →';
      }
    };
    if ($('#back')) $('#back').onclick = () => {
      stash();
      step--;
      const flow=form.closest('.flow');
      flow.outerHTML=inquiry();
      mountInquiry();
      $('#inquiry h2').scrollIntoView({block:'nearest'});
    };
  }
}
const panel = $('#panel');
function openPanel(mode) {
  panel.className = mode;
  panel.innerHTML = mode === 'menu' ? `<button data-close>${t('close')} ×</button><nav>${nav()}</nav><button data-settings>${t('prefs')}</button>` : `<div class="portal-art" aria-hidden="true"><i></i><i></i><i></i></div><small>KS / PORTFOLIO</small><h2>${t('welcome')}</h2><p>${t('intro')}</p><label>${t('lang')}<select id="locale">${locales.map((l, i) => `<option value="${l}" ${l === language ? 'selected' : ''}>${names[i]}</option>`).join('')}</select></label><button class="solid" data-enter>${t('enter')} →</button>`;
  panel.setAttribute('aria-label', t(mode === 'menu' ? 'menu' : 'prefs'));
  if (mode === 'menu') {
    const visual = document.createElement('figure');
    visual.className = 'menu-preview';
    panel.append(visual);
    const media = ['/project-shots/galilea-web-portal.webp', '/edisi/hidangan.webp', '/demo-shots/operations.webp', '/project-shots/naomi-rouli.webp', '/demo-shots/scopebuilder.webp'];
    const update = i => {
      visual.innerHTML = `<img src="${media[i]}" alt=""><figcaption>0${i + 1} / ${t(categories[i])}</figcaption>`;
    };
    panel.querySelectorAll('nav a').forEach((a, i) => {
      a.onpointerenter = a.onfocus = () => update(i);
    });
    update(0);
  } else {
    panel.onpointermove = e => {
      const rect = panel.getBoundingClientRect();
      panel.style.setProperty('--yaw', ((e.clientX - rect.left) / rect.width - .5) * 20 + 'deg');
    };
  }
  if (!panel.open) panel.showModal();
  if ($('#locale')) $('#locale').onchange = e => {
    language = e.target.value;
    save('language', language);
    render();
    openPanel('prefs');
    $('#locale').focus();
  };
}
document.addEventListener('click', e => {
  if (e.target.closest('[data-menu]')) openPanel('menu');
  if (e.target.closest('[data-settings]')) openPanel('prefs');
  if (e.target.closest('[data-enter],[data-close]')) panel.close();
});
panel.addEventListener('close', () => {
  if (panel.className === 'prefs') save('visited', 'yes');
});
if (section === 'nova') window.addEventListener('hashchange', () => {
  render();
  window.scrollTo(0, 0);
});
render();
if (!section && read('visited','') !== 'yes') {
  const welcome=document.createElement('aside');
  welcome.className='welcome-note';
  welcome.innerHTML=`<button data-settings>${t('welcome')} · EN / ID / FR / ES</button><button aria-label="${t('close')}">×</button>`;
  document.body.append(welcome);
  welcome.addEventListener('click',()=>{welcome.remove();save('visited','yes');});
}

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
let reduced = read('reduced', String(matchMedia('(prefers-reduced-motion: reduce)').matches)) === 'true';
const t = key => translate(key, language);
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
let demoPaused = reduced;
let demoIndex = 0;
function projectRow(p, i) {
  return `<a class="project-row" href="/work/${encodeURIComponent(p.slug)}"><small>${String(i + 1).padStart(2, '0')}</small><span><strong>${esc(p.name)}</strong><small>${(p.technologies || []).slice(0, 3).map(esc).join(' / ')}</small></span><b aria-hidden="true">${icon('outward')}</b></a>`;
}
function picks() {
  const slugs = ['atlas-logistics-command-center','digital-wedding-invitation','galilea-web-portal','galilea-digital-archive','majelis-galilea','naomi-rouli'];
  const selected = slugs.map(slug => projects.find(p => p.slug === slug)).filter(Boolean);
  // Positions are part of the reference fan composition, not an auto-flow grid.
  // Keep cards rigid while the single parent follows the video choreography.
  const left = [13,26,32,25,15,4];
  const top = [-4,15,34,53,71,88];
  const angles = [-26,-13,0,14,26,37];
  const cover = p => p.slug === 'digital-wedding-invitation'
    ? '/project-shots/wedding-demo-live.png'
    : `/project-shots/${encodeURIComponent(p.slug)}.webp`;
  const cards = selected.map((p, i) => `<a class="showpiece" style="--folio-index:${i};--folio-left:${left[i]}%;--folio-top:${top[i]}%;--folio-angle:${angles[i]}deg" href="/work/${encodeURIComponent(p.slug)}" aria-label="${esc(p.name)}"><div class="shot"><span class="shot-fallback">${esc(p.name)}</span><img src="${cover(p)}" alt="${esc(p.name)} — project interface" loading="eager" decoding="async"></div><span class="folio-label"><b>${esc(p.name)}</b><span aria-hidden="true">${icon('outward')}</span></span></a>`).join('');
  return `<div class="folio-shell"><div class="folio-tools"><p>${t('folioNote')}</p></div><div class="showcase project-folio" aria-label="${t('work')} — ${selected.length} selected projects" style="--folio-count:${selected.length}"><div class="folio-track"><div class="folio-cycle">${cards}</div></div><div class="folio-counter" aria-hidden="true">KS / ${String(selected.length).padStart(2, '0')} PROJECTS</div></div></div>`;
}
function brands() {
  return `<div class="brands product-gallery demo-theatre" data-demo-theatre><div class="demo-tabs" role="tablist" aria-label="${t('demos')}">${flagship.map(([name,kind],i)=>`<button type="button" role="tab" id="demo-tab-${i}" aria-controls="demo-panel-${i}" aria-selected="${i===demoIndex}" tabindex="${i===demoIndex?0:-1}" data-demo-tab="${i}"><span>0${i+1}</span><strong>${name}</strong><small>${t(kind)}</small></button>`).join('')}</div><div class="demo-stage">${flagship.map(([name,kind,url,image],i)=>`<article class="demo-panel" role="tabpanel" tabindex="0" id="demo-panel-${i}" aria-labelledby="demo-tab-${i}" ${i===demoIndex?'':'hidden'}><a class="brand brand-${kind}" href="${url}"><figure><img loading="lazy" width="940" height="645" src="/demo-shots/${image}.webp" alt=""></figure><div><small>0${i+1} / ${t(kind)}</small><h3>${name}</h3><span>${t('open')} ${icon('outward')}</span></div></a></article>`).join('')}<div class="demo-controls"><button type="button" data-demo-prev aria-label="${t('previousDemo')}">←</button><output>${String(demoIndex+1).padStart(2,'0')} / ${String(flagship.length).padStart(2,'0')}</output><button type="button" data-demo-next aria-label="${t('nextDemo')}">→</button></div></div></div>`;
}
function heading(id, num) {
  return `<div class="heading"><small>${num} / KS</small><h2>${t(id)}</h2></div>`;
}
function home() {
  return `<section class="hero"><div class="scene"><canvas aria-hidden="true"></canvas><small>FIG. 01 &nbsp; / &nbsp; ${t('film')}</small></div><div class="hero-text"><small><i class="dot"></i> Kevin Oloan Simatupang</small><small class="visitor-greeting">${visitorGreeting()}</small><h1><em>Creative</em><br>DEVELOPER.</h1><p>${t('hero')}</p><div class="actions"><a class="solid" href="/work">${t('explore')} ${icon('outward')}</a><a href="/contact">${t('contact')} →</a></div></div></section><div class="axis"><small>KS / PORTFOLIO</small><small>${t('location')}</small></div><section class="block" id="work">${heading('work', '01')}${picks()}<a class="more" href="/work">${t('all')} →</a></section><section class="block" id="studio">${heading('demos', '02')}${brands()}<a class="more" href="/demos">${t('legacy')} →</a></section><section id="skills" class="block">${heading('capabilities', '03')}${skillsSummary()}</section>`;
}
function skillsSummary() {
  const groups = [
    ['skillLanguages', [['JavaScript','javascript'],['TypeScript','typescript'],['Python','python'],['Java','java'],['C','c'],['C++','cpp'],['C#','csharp'],['Go','go'],['Rust','rust'],['PHP','php'],['Kotlin','kotlin'],['Swift','swift'],['Ruby','ruby']]],
    ['skillFrameworks', [['React','react'],['Next.js','nextjs'],['Vue.js','vuejs'],['Angular','angular'],['Svelte','svelte'],['Node.js','nodejs'],['Express','express'],['Django','django'],['Flask','flask'],['Laravel','laravel'],['Spring','spring']]],
    ['skillData', [['PostgreSQL','postgresql'],['MySQL','mysql'],['MongoDB','mongodb'],['Redis','redis'],['SQLite','sqlite'],['Firebase','firebase']]],
    ['skillDelivery', [['HTML5','html5'],['CSS3','css3'],['Git','git'],['Docker','docker'],['Linux','linux'],['GitHub Actions','githubactions'],['Figma','figma'],['Bash','bash']]]
  ];
  const chip = ([name,logo]) => `<li><img loading="lazy" width="24" height="24" src="/edisi/logos/${logo}.svg" alt=""><span>${name}</span></li>`;
  return `<div class="skill-intro"><div><small>${t('selectedStrengths')}</small><h3><em>${t('craft')}</em><br>${t('verifiable')}</h3><p>${t('skillMotionNote')}</p></div><div class="skill-lattice" aria-hidden="true"></div></div><div class="skill-rails">${groups.map(([label,items],i)=>{const content=items.map(chip).join('');return `<div class="skill-rail" style="--rail:${i}"><strong>${t(label)}</strong><div class="skill-window"><div class="skill-track"><ul>${content}</ul><ul aria-hidden="true">${content}</ul></div></div></div>`}).join('')}</div><a class="more" href="/capabilities">${t('catalog')} ${icon('outward')}</a>`;
}
function mountProjectFolio() {
  const folio = document.querySelector('.showcase.project-folio');
  if (!folio) return () => {};
  const imageError = event => {
    if (event.target instanceof HTMLImageElement && event.target.closest('.showpiece')) {
      event.target.closest('.shot')?.classList.add('is-unavailable');
    }
  };
  folio.addEventListener('error', imageError, true);
  return () => folio.removeEventListener('error', imageError, true);
}
function mountDemoTheatre() {
  const theatre = $('[data-demo-theatre]');
  if (!theatre) return () => {};
  const tabs = [...theatre.querySelectorAll('[data-demo-tab]')], panels = [...theatre.querySelectorAll('.demo-panel')];
  const stage = theatre.querySelector('.demo-stage');
  stage?.addEventListener('pointermove', event => {
    if (reduced || event.pointerType !== 'mouse' || !matchMedia('(hover:hover)').matches) return;
    const rect = stage.getBoundingClientRect();
    stage.style.setProperty('--demo-rotate-y', (((event.clientX - rect.left) / rect.width) - .5) * 7 + 'deg');
    stage.style.setProperty('--demo-rotate-x', (.5 - ((event.clientY - rect.top) / rect.height)) * 5 + 'deg');
  });
  stage?.addEventListener('pointerleave', () => { stage.style.removeProperty('--demo-rotate-y'); stage.style.removeProperty('--demo-rotate-x'); });

  let timer, touchStart = 0, pointerStart = null, pointerMoved = false;
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
    theatre.querySelector('output').textContent = `${String(demoIndex + 1).padStart(2,'0')} / ${String(tabs.length).padStart(2,'0')}`;
  };
  const schedule = () => { stop(); if (!demoPaused) timer = setTimeout(() => { show(demoIndex + 1); schedule(); }, 4800); };
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
  schedule();
  return stop;
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
  return `<div class="flow"><aside>${['project', 'plan', 'contact', 'review'].map((k, i) => `<p class="${i === step ? 'current' : ''}">0${i + 1}　${t(k)}</p>`).join('')}</aside><form id="inquiry"><h2>${t(['project', 'plan', 'contact', 'review'][step])}</h2>${keys ? keys.map(k => `<label>${t(k)}${k === 'scope' ? `<textarea name="scope" required maxlength="2500">${esc(brief.scope)}</textarea>` : `<input name="${k}" type="${k === 'time' ? 'date' : k === 'email' ? 'email' : 'text'}" value="${esc(brief[k])}" maxlength="160" required>`}</label>`).join('') : `<dl>${steps.flat().map(k => `<dt>${t(k)}</dt><dd>${esc(brief[k])}</dd>`).join('')}</dl><p>${t('mailhint')}</p>`}<div class="actions">${step ? `<button type="button" id="back">${t('back')}</button>` : ''}<button class="solid">${t(keys ? 'next' : 'compose')} →</button></div></form></div>`;
}
let dispose;
function render() {
  dispose?.();
  document.documentElement.lang = language;
  $('.skip').textContent = t('skip');
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  $('#bar').innerHTML = `<a href="/" class="wordmark">ks<span>.</span></a><nav>${nav()}</nav><div><button data-settings>${language.toUpperCase()} ${icon('down')}</button><button data-menu>${t('menu')} ${icon('menu')}</button></div>`;
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
    $('#content').insertAdjacentHTML('beforeend', `<section class="block process">${heading('process', '04')}<ol>${t('phases').split(' · ').map((phase, i) => `<li><small>0${i + 1}</small><h3>${phase}</h3><p>${notes[i]}</p></li>`).join('')}</ol></section><section class="block closing"><small>${t('edition')} / Balikpapan</small><h2>${t('contact')}</h2><div class="actions"><a class="solid" href="/contact">${t('contact')} ${icon('outward')}</a><a href="/about">${t('about')} →</a></div></section>`);
  }
  if(!section) $('.closing').insertAdjacentHTML('beforebegin', `<section class="block bio-chapter">${heading('about','05')}<p>${t('profile')}</p><a class="more" href="/about">${t('about')} ${icon('outward')}</a></section>`);
  if(!section) $('.closing').insertAdjacentHTML('beforeend',inquiry());
  if(section==='nova' || section.startsWith('nova/')) $('#bar nav').innerHTML=`<a href="/demos">← ${t('demos')}</a>`;
  if (section === 'about') $('.bio').insertAdjacentHTML('beforeend', `<div class="bio-facts"><strong>${t('currentWork')}</strong><p>PT Wulandari Bangun Laksana Tbk · ${t('currentPeriod')}</p><strong>${t('education')}</strong><p>${t('practice')}</p><a href="/resume">CV / PDF ${icon('outward')}</a></div>`);
  const disposeScene = mountScene($('.scene canvas'), reduced);
  const disposeCamera = mountChoreography(reduced);
  const disposeAcademic = mountAcademic(language,email);
  const disposeFolio = mountProjectFolio();
  const disposeDemos = mountDemoTheatre();
  dispose = () => { disposeScene?.(); disposeCamera(); disposeAcademic?.(); disposeDemos(); disposeFolio(); };
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
  if ($('#inquiry')) {
    const form = $('#inquiry');
    function stash() {
      Object.assign(brief, Object.fromEntries(new FormData(form)));
      try {
        sessionStorage.setItem('atelier.brief', JSON.stringify(brief));
      } catch {}
    }
    form.oninput = stash;
    form.onsubmit = e => {
      e.preventDefault();
      stash();
      if (step < 3) {
        step++;
        render();
        $('#inquiry h2').scrollIntoView({
          block: 'nearest'
        });
      } else location.href = 'mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent(brief.type) + '&body=' + encodeURIComponent(steps.flat().map(k => t(k) + ': ' + brief[k]).join('\n'));
    };
    if ($('#back')) $('#back').onclick = () => {
      stash();
      step--;
      render();
    };
  }
}
const panel = $('#panel');
function openPanel(mode) {
  panel.className = mode;
  panel.innerHTML = mode === 'menu' ? `<button data-close>${t('close')} ×</button><nav>${nav()}</nav><button data-settings>${t('prefs')}</button>` : `<div class="portal-art" aria-hidden="true"><i></i><i></i><i></i></div><small>KS / PORTFOLIO</small><h2>${t('welcome')}</h2><p>${t('intro')}</p><label>${t('lang')}<select id="locale">${locales.map((l, i) => `<option value="${l}" ${l === language ? 'selected' : ''}>${names[i]}</option>`).join('')}</select></label><label class="check"><input id="motion" type="checkbox" ${reduced ? 'checked' : ''}>${t('motion')}</label><button class="solid" data-enter>${t('enter')} →</button>`;
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
      if (reduced) return;
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
  if ($('#motion')) $('#motion').onchange = e => {
    reduced = e.target.checked;
    demoPaused = reduced;
    save('reduced', String(reduced));
    render();
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

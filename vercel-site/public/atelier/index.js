import { icon } from './icons.js';
import { locales, names, translate } from './words.js';
import { mountScene } from './scene.js';
import { novaPage } from './nova.js';
import { caseStudy } from './cases.js';
import { capabilities } from './capabilities.js';
const {
  section,
  projects,
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
const categories = ['work', 'demos', 'capabilities', 'about', 'contact'];
const nav = () => categories.map(id => `<a href="/${id}" ${section === id ? 'aria-current="page"' : ''}>${t(id)}</a>`).join('');
const flagship = [['Daun & Bara', 'restaurant', '/edisi/resto.html', '/edisi/hidangan.webp'], ['Lintas Teluk', 'travel', '/edisi/travel.html', '/edisi/pesisir.webp'], ['Ruang Rawat', 'care', '/edisi/care.html', '/edisi/perawat-0.webp'], ['NOVA Creative', 'nova', '/nova', '']];
const real = projects.filter(p => p.status === 'Real Project');
const demos = projects.filter(p => p.status === 'Interactive Demo');
function projectRow(p, i) {
  return `<a class="project-row" href="/work/${encodeURIComponent(p.slug)}"><small>${String(i + 1).padStart(2, '0')}</small><span><strong>${esc(p.name)}</strong><small>${(p.technologies || []).slice(0, 3).map(esc).join(' / ')}</small></span><b aria-hidden="true">${icon('outward')}</b></a>`;
}
function picks() {
  return `<div class="showcase">${real.filter(p => ['galilea-web-portal','galilea-digital-archive','majelis-galilea','naomi-rouli'].includes(p.slug)).map((p, i) => `<a class="showpiece" href="/work/${encodeURIComponent(p.slug)}"><div class="shot tone${i}"><img loading="lazy" src="/project-shots/${encodeURIComponent(p.slug)}.webp" alt="${esc(p.name)}"></div><small>0${i + 1} / ${esc(p.technologies.filter(tech=>section || !/apps script|google sheets/i.test(tech)).slice(0, 2).join(' + '))}</small><h3>${esc(p.name)} <span>${icon('outward')}</span></h3></a>`).join('')}</div>`;
}
function demoArtifact(kind) {
  const captions={restaurant:['01 / 02','Daun & Bara','Lemongrass chicken','45.000'],travel:['WITA / 09:00','Terminal Teluk → Teluk House','12 km · 28 min','E-TICKET'],care:['Ruang Rawat','Nadia Laras','Balikpapan','75.000 / h'],nova:['FORMA / RADIO','NOVA®','NV—001','STUDIO']};
  const [folio,title,detail,value]=captions[kind];
  return `<figure aria-hidden="true" class="artifact artifact-${kind}"><small>${folio}</small><b>${title}</b><span>${detail}</span><strong>${value}</strong></figure>`;
}
function brands() {
  return `<div class="brands">${flagship.map(([name, kind, url, img], i) => `<a href="${url}" class="brand brand-${kind}">${img ? `<img loading="lazy" src="${img}" alt="">` : '<i class="nova-mark" aria-hidden="true">'+icon('spark')+'</i>'}${demoArtifact(kind)}<div><small>0${i + 1} / ${t(kind)}</small><h3>${name}</h3><span>${t('open')} ${icon('outward')}</span></div></a>`).join('')}</div>`;
}
function heading(id, num) {
  return `<div class="heading"><small>${num} / KS</small><h2>${t(id)}</h2></div>`;
}
function home() {
  return `<section class="hero"><div class="scene"><canvas aria-hidden="true"></canvas><small>FIG. 01 &nbsp; / &nbsp; ${t('film')}</small></div><div class="hero-text"><small><i class="dot"></i> Kevin Oloan Simatupang</small><h1><em>Creative</em><br>DEVELOPER.</h1><p>${t('hero')}</p><div class="actions"><a class="solid" href="/work">${t('explore')} ${icon('outward')}</a><a href="/contact">${t('contact')} →</a></div></div></section><div class="axis"><small>KS / PORTFOLIO</small><small>${t('location')}</small></div><section class="block" id="work">${heading('work', '01')}${picks()}<a class="more" href="/work">${t('all')} →</a></section><section class="block" id="studio">${heading('demos', '02')}${brands()}<a class="more" href="/demos">${t('legacy')} →</a></section><section id="skills" class="block">${heading('capabilities', '03')}${skillsSummary()}</section>`;
}
function skillsSummary() {
  const strengths = [
    ['Frontend','react','Galilea Digital Archive','galilea-digital-archive'],
    ['Backend','firebase','GMAHK Galilea','galilea-web-portal'],
    [t('creative'),'css3','KOMA Manga Reader','koma-manga-reader'],
    [t('systems'),'javascript','Majelis Galilea','majelis-galilea']
  ];
  const plates = strengths.map(([name,logo,project,slug],i)=>`<a class="skill-plate" href="/work/${slug}"><span class="skill-mark" style="--phase:-${i}s"><img src="/edisi/logos/${logo}.svg" alt=""></span><strong>${name}</strong><small>${project}</small></a>`);
  return `<div class="skill-wall">${plates.join('')}</div><a class="more" href="/capabilities">${t('catalog')} ${icon('outward')}</a>`;
}
let step = 0,
  brief = {};
try {
  brief = JSON.parse(sessionStorage.getItem('atelier.brief') || '{}') || {};
} catch {}
const steps = [['type', 'existing', 'scope', 'audience'], ['budget', 'time'], ['name', 'email']];
function inquiry() {
  const keys = steps[step];
  return `<div class="flow"><aside>${['project', 'plan', 'contact', 'review'].map((k, i) => `<p class="${i === step ? 'current' : ''}">0${i + 1}　${t(k)}</p>`).join('')}</aside><form id="inquiry"><h2>${t(['project', 'plan', 'contact', 'review'][step])}</h2>${keys ? keys.map(k => `<label>${t(k)}${k === 'scope' ? `<textarea name="scope" required maxlength="2500">${esc(brief.scope)}</textarea>` : `<input name="${k}" type="${k === 'time' ? 'date' : k === 'email' ? 'email' : 'text'}" value="${esc(brief[k])}" maxlength="160" required>`}</label>`).join('') : `<dl>${steps.flat().map(k => `<dt>${t(k)}</dt><dd>${esc(brief[k])}</dd>`).join('')}</dl><p>${t('mailhint')}</p>`}<div class="actions">${step ? `<button type="button" id="back">${t('back')}</button>` : ''}<button class="solid">${t(keys ? 'next' : 'compose')} →</button></div></form></div>`;
}
let dispose;
let scenePaused = reduced;
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
      body = brands() + heading('legacy', '02') + `<input id="search" type="search" aria-label="${t('search')}" placeholder="${t('search')}"><div id="results"></div><a class="more" href="/studio">${t('archive')} →</a>`;
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
    case 'nova':
      body = novaPage(language);
      break;
    default:
      body = section.startsWith('work/') ? caseStudy(projects.find(p => p.slug === section.slice(5)), language, esc, t) : home();
  }
  $('#content').innerHTML = categories.includes(section) ? `<section class="block sub"><small>Kevin Simatupang / ${t('edition')}</small><h1>${t(section)}</h1>${body}</section>` : body;
  if (!section || section === 'about') {
    const notes = t('processNotes').split(' · ');
    $('#content').insertAdjacentHTML('beforeend', `<section class="block process">${heading('process', '04')}<ol>${t('phases').split(' · ').map((phase, i) => `<li><small>0${i + 1}</small><h3>${phase}</h3><p>${notes[i]}</p></li>`).join('')}</ol></section><section class="block closing"><small>${t('edition')} / Balikpapan</small><h2>${t('contact')}</h2><div class="actions"><a class="solid" href="/contact">${t('contact')} ${icon('outward')}</a><a href="/about">${t('about')} →</a></div></section>`);
  }
  if(!section) $('.closing').insertAdjacentHTML('beforebegin', `<section class="block bio-chapter">${heading('about','05')}<p>${t('profile')}</p><a class="more" href="/about">${t('about')} ${icon('outward')}</a></section>`);
  if(!section) $('.closing').insertAdjacentHTML('beforeend',inquiry());
  if(section==='nova') $('#bar nav').innerHTML=`<a href="/demos">← ${t('demos')}</a>`;
  if (section === 'about') $('.bio').insertAdjacentHTML('beforeend', `<div class="bio-facts"><strong>${t('education')}</strong><p>${t('practice')}</p><a href="/resume">CV / PDF ${icon('outward')}</a></div>`);
  const scene = $('.scene');
  if (scene) {
    const toggle = document.createElement('button');
    toggle.className = 'scene-toggle';
    toggle.textContent = t(scenePaused ? 'playScene' : 'pauseScene');
    scene.append(toggle);
    toggle.onclick = () => {
      scenePaused = !scenePaused;
      render();
      $('.scene-toggle').focus({preventScroll:true});
    };
  }
  dispose = mountScene($('.scene canvas'), scenePaused);
  document.querySelectorAll('a[href="/edisi/skill.html"]').forEach(a => a.href = '/capabilities');
  if (section === 'demos') {
    document.querySelectorAll('.brands .brand').forEach((a, i) => {
      const [name, kind, url] = flagship[i],
        wrap = document.createElement('article');
      a.before(wrap);
      wrap.append(a);
      wrap.insertAdjacentHTML('beforeend', `<details class="brief-case"><summary>${t('view')}</summary><h3>${name}</h3><h4>${t('flow')}</h4><p>${t(kind + 'Flow')}</p><h4>${t('logic')}</h4><p>${t(kind + 'Logic')}</p><a href="${url}">${t('open')} ${icon('outward')}</a></details>`);
    });
  }
  if ($('#capability-map')) capabilities($('#capability-map'), projects, language, esc);
  if ($('#search')) {
    const search = () => {
      const q = $('#search').value.toLowerCase();
      const rows = demos.filter(p => [p.name, ...p.technologies].join(' ').toLowerCase().includes(q));
      const groups=[
        [t('bookShop'),['booking','commerce','commerceops','scopebuilder']],
        [t('operationsGroup'),['operations','researchtools','fieldcompanion','dataprep','documents','qualityroom','attendance','archive']],
        [t('creative'),['morphslides','logostudio','wedding','manga']]
      ];
      $('#results').innerHTML = groups.map(([label,types])=>{
        const group=rows.filter(p=>types.includes(p.visual));
        return group.length?`<section class="library-group"><h3>${label}</h3>${group.map(projectRow).join('')}</section>`:'';
      }).join('') + rows.filter(p=>!groups.some(([,types])=>types.includes(p.visual))).map(projectRow).join('') || `<p>${t('empty')}</p>`;
    };
    $('#search').oninput = search;
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
    scenePaused = reduced;
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

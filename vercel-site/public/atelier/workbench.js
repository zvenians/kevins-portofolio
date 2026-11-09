import { scenarios } from './scenarios.js';
import { locales, names } from './words.js';
import { controls } from './legacy-words.js';
const shell = document.querySelector('.apprail');
const kind = shell.dataset.kind;
const targets = {
  manga: ['.manga-direction,.manga-mode,.manga-open', '.manga-bookmark,.manga-next'],
  attendance: ['#att-in,#att-out', '#att-filter,#att-export'],
  commerce: ['#commerce-search,#commerce-sort,#commerce-grid button', '#commerce-checkout-form,#commerce-checkout-jump'],
  booking: ['#booking-service,#booking-date', '#booking-next,#booking-form'],
  operations: ['#workspace input,#workspace select', '#vendor-export,#workspace button'],
  fieldcompanion: ['#field-asset,#field-capture', '#field-sync'],
  researchtools: ['#research-toolkit button,#research-tool-workspace select', '#revision-form,#research-tool-workspace button'],
  dataprep: ['#prep-missing,#prep-run', '#prep-csv,#prep-syntax'],
  documents: ['#document-form input,#document-form select', '#document-pdf'],
  commerceops: ['[data-ops]', '#stock-post,#ops-export'],
  qualityroom: ['#quality-width,#quality-run', '#quality-copy'],
  scopebuilder: ['#scope-area,#scope-deliverables input', '#scope-copy,#scope-form button'],
  morphslides: ['[data-slide-copy],#morph-heading,[data-scene]', '#morph-play,#slide-export'],
  logostudio: ['#brand-name,#brand-ink,#logo-initials', '#brand-export,#logo-export'],
  wedding: ['#wed-one,#wed-date', '#wed-reply button,#wedding-rsvp button,.wedding-modern a[download]'],
  archive: ['#archive-search,[data-folder]', '[data-document],#queue-upload']
};
const labels = ['Session guide|Panduan sesi|Guide de session|Guía de sesión', 'Observed actions|Aksi tercatat|Actions observées|Acciones registradas', 'Go to control|Ke kontrol|Aller au contrôle|Ir al control', 'Clear progress|Hapus progres|Effacer le suivi|Borrar progreso', 'Continue in the application to reveal this control.|Lanjutkan alur di aplikasi untuk membuka kontrol ini.|Poursuivez le parcours pour afficher cette commande.|Avanza en la aplicación para mostrar este control.'];
let lang = 'en',
  progress = [false, false];
const key = 'atelier.progress.' + kind;
try {
  lang = localStorage.getItem('atelier.language') || lang;
  progress = JSON.parse(sessionStorage.getItem(key)) || progress;
} catch {}
const text = line => line.split('|')[Math.max(0, locales.indexOf(lang))];
const picker = document.createElement('select');
picker.setAttribute('aria-label', 'English / Indonesia / Français / Español');
locales.forEach((code, i) => picker.add(new Option(names[i], code, false, code === lang)));
shell.append(picker);
if (['operations','researchtools','dataprep','documents'].includes(kind)) {
  const support=document.createElement('a');
  support.href='/academic-support';
  support.textContent=lang==='id'?'Bantuan akademik ↗':lang==='fr'?'Soutien académique ↗':lang==='es'?'Apoyo académico ↗':'Academic support ↗';
  shell.append(support);
}
picker.onchange = () => {
  try {
    localStorage.setItem('atelier.language', picker.value);
    localStorage.setItem('portfolio-language', picker.value === 'id' ? 'id' : 'en');
  } catch {}
  location.reload();
};
if (lang === 'fr' || lang === 'es') {
  const dictionary = new Map(controls.map(row => [row[0], row[lang === 'fr' ? 1 : 2]]));
  function localize(node) {
    if (!node.parentElement || node.parentElement.closest('script,style,textarea,pre,code,[contenteditable]')) return;
    const original = node.nodeValue.trim(),
      translated = dictionary.get(original);
    if (!translated || original === translated) return;
    const parent = node.parentElement;
    if (parent.tagName === 'OPTION' && !parent.hasAttribute('value')) parent.value = original;
    node.nodeValue = node.nodeValue.replace(original, translated);
  }
  function tree(root) {
    if (root.nodeType === 3) {
      localize(root);
      return;
    }
    if (root.nodeType !== 1) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) localize(node);
  }
  const main = document.querySelector('main');
  if (main) {
    tree(main);
    new MutationObserver(records => {
      for (const change of records) {
        if (change.type === 'characterData') localize(change.target);else change.addedNodes.forEach(tree);
      }
    }).observe(main, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
}
if (targets[kind] && scenarios[kind]) {
  const guide = document.createElement('details');
  guide.className = 'session-guide';
  shell.after(guide);
  function draw() {
    guide.innerHTML = `<summary>${text(labels[0])}<span>${progress.filter(Boolean).length} / 2</span></summary><div class="guide-body">${scenarios[kind].map((s, i) => `<div><small>${progress[i] ? '✓' : '0' + (i + 1)}</small><p>${text(s)}</p><button data-focus="${i}">${text(labels[2])} →</button></div>`).join('')}<button data-clear>${text(labels[3])}</button><p role="status"></p></div>`;
  }
  function save() {
    try {
      sessionStorage.setItem(key, JSON.stringify(progress));
    } catch {}
    draw();
  }
  guide.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-clear')) {
      progress = [false, false];
      save();
      return;
    }
    const control = [...document.querySelectorAll(targets[kind][Number(b.dataset.focus)])].find(n => n.getClientRects().length && !n.disabled);
    if (control) {
      guide.open = false;
      control.scrollIntoView({
        block: 'center'
      });
      control.focus({
        preventScroll: true
      });
    } else guide.querySelector('[role=status]').textContent = text(labels[4]);
  });
  for (const event of ['change', 'click', 'submit']) document.addEventListener(event, e => {
    const index = targets[kind].findIndex(s => e.target.closest(s));
    if (index < 0 || progress[index] || e.type === 'click' && e.target.matches('input:not([type=checkbox],[type=radio]),select,textarea')) return;
    progress[index] = true;
    save();
  }, true);
  draw();
}

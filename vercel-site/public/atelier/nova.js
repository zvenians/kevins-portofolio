import { icon } from './icons.js';

const copy = {
  index:'Studio index|Indeks studio|Index du studio|Índice del estudio',
  next:'Next project|Proyek berikutnya|Projet suivant|Proyecto siguiente',
  industries: 'Industries|Industri|Secteurs|Sectores',
  culture: 'Culture|Budaya|Culture|Cultura',
  publishing: 'Publishing|Penerbitan|Édition|Editorial',
  events: 'Events|Acara|Événements|Eventos',
  newsletter: 'Journal by email|Jurnal via email|Journal par courriel|Revista por correo',
  subscribe: 'Subscribe in demo|Berlangganan dalam demo|Essayer l’abonnement|Probar la suscripción',
  subscribeDone: 'Demo subscription confirmed.|Langganan demo dikonfirmasi.|Abonnement de démonstration confirmé.|Suscripción de demostración confirmada.',
  find: 'Search the journal|Cari artikel|Rechercher un article|Buscar artículos',
  otherArticle: 'A type system for small screens|Sistem huruf untuk layar kecil|Composer pour les petits écrans|Tipografía para pantallas pequeñas',
  otherBody: 'Our first proof is a line of text on a narrow screen. We adjust its width and line spacing before choosing the display face.|Uji pertama kami adalah satu baris teks pada layar sempit. Lebar dan jarak baris ditentukan sebelum memilih huruf judul.|Notre premier essai est une ligne sur un écran étroit. Nous réglons sa largeur et son interligne avant de choisir le caractère de titre.|La primera prueba es una línea en una pantalla estrecha. Ajustamos su ancho e interlineado antes de elegir la tipografía del título.',
  empty: 'No articles found.|Tidak ada artikel.|Aucun article trouvé.|No se encontraron artículos.',
  home: 'Studio|Studio|Studio|Estudio',
  services: 'Services|Layanan|Services|Servicios',
  work: 'Work|Karya|Projets|Proyectos',
  insights: 'Journal|Jurnal|Journal|Revista',
  careers: 'Careers|Karier|Carrières|Empleo',
  about: 'About|Profil|À propos|Nosotros',
  inquiry: 'Project inquiry|Permintaan proyek|Demande de projet|Consulta de proyecto',
  headline: 'Identity in motion.|Identitas dalam gerak.|Identités en mouvement.|Identidades en movimiento.',
  intro: 'We design identities, digital products and interactive spaces.|Kami merancang identitas, produk digital, dan ruang interaktif.|Nous concevons des identités, des produits numériques et des espaces interactifs.|Diseñamos identidades, productos digitales y espacios interactivos.',
  strategy: 'Brand systems|Sistem brand|Systèmes de marque|Sistemas de marca',
  product: 'Digital products|Produk digital|Produits numériques|Productos digitales',
  space: 'Spatial experiences|Pengalaman spasial|Expériences spatiales|Experiencias espaciales',
  strategyText: 'Naming, visual identity and guidelines that carry through print and screen.|Penamaan, identitas visual, dan panduan untuk cetak dan layar.|Naming, identité visuelle et guides pour le papier et l’écran.|Naming, identidad visual y guías para papel y pantalla.',
  productText: 'Research, prototypes and a component library for teams shipping software.|Riset, prototipe, dan pustaka komponen untuk tim produk.|Recherche, prototypes et bibliothèque de composants pour les équipes produit.|Investigación, prototipos y biblioteca de componentes para equipos de producto.',
  spaceText: 'A sequence of projections and wayfinding cues for visitors moving through a venue.|Urutan proyeksi dan petunjuk arah untuk pengunjung di ruang pamer.|Projections et repères pour guider les visiteurs dans un lieu.|Proyecciones y señalización para guiar a visitantes por un recinto.',
  concept: 'Fictional studio · interactive concept|Studio fiktif · konsep interaktif|Studio fictif · concept interactif|Estudio ficticio · concepto interactivo',
  email: 'Email|Email|E-mail|Correo',
  brief: 'Your brief|Brief Anda|Votre brief|Tu propuesta',
  send: 'Review inquiry|Tinjau permintaan|Vérifier la demande|Revisar consulta',
  done: 'Inquiry recorded in this demo.|Permintaan tersimpan dalam demo ini.|Demande enregistrée dans cette démo.|Consulta registrada en esta demo.',
  apply: 'Apply for this role|Lamar posisi ini|Postuler|Solicitar el puesto',
  all: 'All|Semua|Tout|Todo',
  confirm: 'Confirm|Konfirmasi|Confirmer|Confirmar',
  edit: 'Edit|Ubah|Modifier|Editar',
  review: 'Review|Tinjauan|Vérification|Revisión',
  back: 'Portfolio|Portfolio|Portfolio|Portfolio',
  article: 'Designing for a moving audience|Desain untuk pengunjung yang bergerak|Concevoir pour un public en mouvement|Diseñar para un público en movimiento',
  articleBody: 'We test a sign from the doorway before refining it at a desk. Distance changes what people read first. A single word with a strong silhouette often survives where a paragraph disappears.|Kami menguji papan petunjuk dari pintu masuk. Jarak memengaruhi apa yang dibaca terlebih dahulu. Satu kata dengan bentuk yang jelas sering lebih terbaca dari satu paragraf.|Nous testons un panneau depuis l’entrée. La distance modifie l’ordre de lecture. Un mot bien dessiné reste lisible là où un paragraphe disparaît.|Probamos cada señal desde la entrada. La distancia cambia el orden de lectura. Una palabra de silueta clara sigue siendo legible donde un párrafo desaparece.'
};
export function novaPage(language) {
  const idx = ['en', 'id', 'fr', 'es'].indexOf(language),
    t = k => copy[k].split('|')[idx];
  const services = ['strategy', 'product', 'space'],
    works = ['Forma Radio', 'Parallel Editions', 'Field Assembly'];
  const route = location.hash.slice(1).split('/'),
    page = route[0] || 'home';
  const number = Number(route[1]);
  const i = Number.isInteger(number) && number >= 0 && number < 3 ? number : 0;
  const link = (key, label) => `<a class="nova-link" href="#${key}"><span>${label}</span>${icon('forward')}</a>`;
  const section = ({case:'work',service:'services',article:'insights',job:'careers',apply:'careers'})[page] || page;
  const sections = ['about','services','industries','work','insights','careers','inquiry'];
  const directory = sections.map((key,n)=>`<a href="#${key}" ${section===key?'aria-current="page"':''}><small>0${n+1}</small><span>${t(key)}</span></a>`).join('');
  const mast = `<div class="nova-mast"><a class="nova-logo" href="#home" aria-label="NOVA Creative"><b>NOVA</b><sup>®</sup></a><nav class="nova-wide" aria-label="${t('index')}">${directory}</nav><details class="nova-index"><summary>${t('index')}${icon('plus')}</summary><nav aria-label="${t('index')}">${directory}</nav></details></div>`;
  const captions=['FORMA / RADIO','PARALLEL / EDITIONS','FIELD / ASSEMBLY'];
  function plate(index){
    const lines=Array.from({length:37},(_,n)=>{
      const y=28+n*4;
      return `<path d="M-6 ${y+35} C82 ${y+90},100 ${y-110},175 ${y-16} S286 ${y+110},408 ${y-38}"/>`;
    }).join('');
    const shapes=[`<g fill="none" stroke="currentColor" stroke-width="1.6">${lines}</g>`,'<g fill="none" stroke="currentColor" stroke-width="11" transform="rotate(-16 200 108)"><rect x="76" y="-40" width="114" height="300"/><rect x="214" y="-40" width="114" height="300"/></g>','<g fill="none" stroke="currentColor" stroke-width="17"><circle cx="100" cy="115" r="94"/><circle cx="213" cy="115" r="94"/><circle cx="326" cy="115" r="94"/></g>'];
    return `<figure class="nova-plate plate-${index}" aria-hidden="true"><svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">${shapes[index]}</svg><figcaption><b>${captions[index]}</b><span>NV—00${index+1}</span></figcaption></figure>`;
  }
  const entry = (key, title, info) => `<article><small>NOVA / ${info}</small><h2>${link(key, title)}</h2></article>`;
  let body = '';
  switch (page) {
    case 'about':
      body = `<h1>NOVA Creative.</h1><p>${t('intro')}</p>` + services.map(k => `<article><h3>${t(k)}</h3><p>${t(k + 'Text')}</p></article>`).join('');
      break;
    case 'services':
      body = `<h1>${t('services')}</h1>` + services.map((k, i) => entry('service/' + i, t(k), '0' + (i + 1))).join('');
      break;
    case 'industries':
      body = `<h1>${t('industries')}</h1>` + ['culture', 'publishing', 'events'].map((k, i) => entry('case/' + i, t(k), works[i])).join('');
      break;
    case 'service':
      body = `<h1>${t(services[i])}</h1><p>${t(services[i] + 'Text')}</p>` + entry('case/' + i, works[i], t('work'));
      break;
    case 'work':
      body = `<h1>${t('work')}</h1><select id="industry" aria-label="${t('services')}"><option value="">${t('all')}</option>${services.map((k, i) => `<option value="${i}">${t(k)}</option>`).join('')}</select>` + works.map((w, i) => entry('case/' + i, w, t(services[i]))).join('');
      break;
    case 'case':
      body = `<div class="nova-case-head"><small>${t('work')}　/　0${i+1} — 03</small><h1>${works[i]}</h1><p>${t(services[i])} <span> / </span> ${t(['culture','publishing','events'][i])}</p></div>${plate(i)}<div class="nova-case-copy"><h2>${t(services[i])}</h2><p>${t(services[i]+'Text')}</p>${link('service/'+i,t('services'))}</div><div class="nova-next"><small>${t('next')}</small>${link('case/'+((i+1)%3),works[(i+1)%3])}</div>`;
      break;
    case 'insights':
      body = `<h1>${t('insights')}</h1><label>${t('find')}<input type="search" id="journal-search"></label>` + entry('article', t('article'), '01') + entry('article/1', t('otherArticle'), '02') + `<p id="journal-empty" hidden>${t('empty')}</p><form id="newsletter"><h3>${t('newsletter')}</h3><label>${t('email')}<input type="email" required></label><button class="solid">${t('subscribe')}</button><p role="status"></p></form>`;
      break;
    case 'article':
      body = `<h1>${t(i ? 'otherArticle' : 'article')}</h1><p>${t(i ? 'otherBody' : 'articleBody')}</p>`;
      break;
    case 'careers':
      body = `<h1>${t('careers')}</h1>` + entry('job', 'Creative Developer', '01');
      break;
    case 'job':
      body = `<h1>Creative Developer</h1><p>${t('productText')}</p>${link('apply', t('apply'))}`;
      break;
    case 'apply':
    case 'inquiry':
      body = `<h1>${t(page === 'apply' ? 'apply' : 'inquiry')}</h1><form id="nova-form"><label>${t('email')}<input name="email" type="email" required></label><label>${t('brief')}<textarea name="brief" required minlength="8"></textarea></label><button class="solid">${t('send')} →</button></form><article id="nova-review" hidden><h2>${t('review')}</h2><p></p><button data-edit>${t('edit')}</button><button data-confirm class="solid">${t('confirm')}</button></article><p id="nova-done" role="status"></p>`;
      break;
    default:
      body = `<h1>${t('headline')}</h1><p>${t('intro')}</p>` + works.map((w, i) => entry('case/' + i, w, t(services[i]))).join('');
  }
  queueMicrotask(() => {
    const journal = document.querySelector('#journal-search');
    if (journal) journal.oninput = () => {
      const items = [...document.querySelectorAll('.nova article')];
      items.forEach(item => item.hidden = !item.textContent.toLowerCase().includes(journal.value.toLowerCase()));
      document.querySelector('#journal-empty').hidden = items.some(item => !item.hidden);
    };
    const newsletter = document.querySelector('#newsletter');
    if (newsletter) newsletter.onsubmit = e => {
      e.preventDefault();
      newsletter.querySelector('[role=status]').textContent = t('subscribeDone');
      newsletter.reset();
    };
    const filter = document.querySelector('#industry');
    if (filter) filter.onchange = () => document.querySelectorAll('.nova article').forEach((a, i) => a.hidden = filter.value !== '' && Number(filter.value) !== i);
    const form = document.querySelector('#nova-form'),
      review = document.querySelector('#nova-review');
    if (!form) return;
    form.onsubmit = e => {
      e.preventDefault();
      review.querySelector('p').textContent = [...new FormData(form).values()].join(' · ');
      form.hidden = true;
      review.hidden = false;
      review.querySelector('button').focus();
    };
    review.querySelector('[data-edit]').onclick = () => {
      review.hidden = true;
      form.hidden = false;
      form.elements.email.focus();
    };
    review.querySelector('[data-confirm]').onclick = () => {
      review.hidden = true;
      document.querySelector('#nova-done').textContent = t('done');
    };
  });
  return `<section class="nova nova-edition">${mast}<div class="nova-page">${page==='home'?plate(0):''}${body}</div><footer class="nova-credit"><b>NOVA Creative</b><small>${t('concept')}</small></footer></section>`;
}

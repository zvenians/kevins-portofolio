const copy = {
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
  const link = (key, label) => `<a href="#${key}">${label} ↗</a>`;
  const entry = (key, title, info) => `<article><small>NOVA / ${info}</small><h2>${link(key, title)}</h2></article>`;
  let body = '';
  switch (page) {
    case 'about':
      body = `<h1>NOVA Creative.</h1><p>${t('intro')}</p>` + services.map(k => `<article><h3>${t(k)}</h3><p>${t(k + 'Text')}</p></article>`).join('');
      break;
    case 'services':
      body = `<h1>${t('services')}</h1>` + services.map((k, i) => entry('service/' + i, t(k), '0' + (i + 1))).join('');
      break;
    case 'service':
      body = `<h1>${t(services[i])}</h1><p>${t(services[i] + 'Text')}</p>` + entry('case/' + i, works[i], t('work'));
      break;
    case 'work':
      body = `<h1>${t('work')}</h1><select id="industry" aria-label="${t('services')}"><option value="">${t('all')}</option>${services.map((k, i) => `<option value="${i}">${t(k)}</option>`).join('')}</select>` + works.map((w, i) => entry('case/' + i, w, t(services[i]))).join('');
      break;
    case 'case':
      body = `<small>${t('work')} / 0${i + 1}</small><h1>${works[i]}</h1><h3>${t(services[i])}</h3><p>${t(services[i] + 'Text')}</p>${link('service/' + i, t('services'))}`;
      break;
    case 'insights':
      body = `<h1>${t('insights')}</h1>` + entry('article', t('article'), '01');
      break;
    case 'article':
      body = `<h1>${t('article')}</h1><p>${t('articleBody')}</p>`;
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
  return `<section class="nova"><small>${t('concept')}</small><nav>${['home', 'about', 'services', 'work', 'insights', 'careers', 'inquiry'].map(k => link(k, k === 'home' ? 'NOVA®' : t(k))).join('')}</nav>${body}</section>`;
}

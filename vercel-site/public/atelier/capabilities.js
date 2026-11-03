import { icon } from './icons.js';
import { locales } from './words.js';
const labels = {
  all: 'All domains|Semua bidang|Tous les domaines|Todas las áreas',
  front: 'Interfaces|Antarmuka|Interfaces|Interfaces',
  back: 'Backend & APIs|Backend & API|Serveurs et API|Backend y API',
  db: 'Data & databases|Data & basis data|Données et bases|Datos y bases',
  infra: 'Cloud & delivery|Cloud & pengiriman|Cloud et livraison|Nube y despliegue',
  media: 'Design & motion|Desain & motion|Design et animation|Diseño y movimiento',
  mobile: 'Mobile|Seluler|Mobile|Móvil',
  tools: 'Tools & languages|Alat & bahasa|Outils et langages|Herramientas y lenguajes',
  evidence: 'Used in portfolio projects|Dipakai dalam proyek portfolio|Utilisé dans les projets|Usado en proyectos',
  directory: 'Technology reference|Referensi teknologi|Répertoire technique|Directorio tecnológico',
  search: 'Find a technology|Cari teknologi|Rechercher une technologie|Buscar tecnología',
  empty: 'No results|Tidak ada hasil|Aucun résultat|Sin resultados',
  more: 'Show more|Tampilkan lagi|Voir plus|Mostrar más',
  retry: 'Reload catalogue|Muat ulang katalog|Recharger le catalogue|Recargar catálogo'
};
function group(name, tags) {
  const s = (name + ' ' + tags).toLowerCase();
  if (/database|postgres|sql|sheet|statistic|data prep|spreadsheet|mongo|redis/.test(s)) return 'db';
  if (/android|ios|flutter|mobile|kotlin|swift/.test(s)) return 'mobile';
  if (/3d|graphic|design|motion|figma|adobe|animation|blender|illustrat/.test(s)) return 'media';
  if (/cloud|deploy|container|ci\/cd|docker|kubernetes|vercel|hosting|devops/.test(s)) return 'infra';
  if (/api|backend|server|django|express|laravel|nodejs|firebase|apps script/.test(s)) return 'back';
  if (/front.?end|react|vue|html|css|javascript|svelte|angular|browser/.test(s)) return 'front';
  return 'tools';
}
let directory;
export async function capabilities(root, projects, language, esc) {
  const t = k => labels[k].split('|')[locales.indexOf(language)];
  const groups = ['all', 'front', 'back', 'db', 'infra', 'mobile', 'media', 'tools'];
  root.innerHTML = `<div class="cap-tools"><label>${t('search')}<input type="search" id="skill-search"></label><label>${t('all')}<select id="skill-group">${groups.map(k => `<option value="${k}">${t(k)}</option>`).join('')}</select></label></div><h2>${t('evidence')}</h2><div id="proven" class="skills"></div><h2>${t('directory')}</h2><div id="directory" class="catalogue"></div><button class="more" id="more">${t('more')}</button>`;
  const data = new Map();
  for (const p of projects) for (const tech of p.technologies || []) {
    if (!data.has(tech)) data.set(tech, []);
    data.get(tech).push(p);
  }
  const q = root.querySelector('#skill-search'),
    category = root.querySelector('#skill-group');
  let limit = 32;
  const matches = (name, tags) => name.toLowerCase().includes(q.value.trim().toLowerCase()) && (category.value === 'all' || group(name, tags) === category.value);
  function draw() {
    root.querySelector('#proven').innerHTML = [...data].filter(([tech]) => matches(tech, '')).map(([tech, ps]) => `<details><summary>${esc(tech)} <small>${ps.length}</small></summary>${ps.map(p => `<a href="/work/${encodeURIComponent(p.slug)}">${esc(p.name)} ${icon('outward')}</a>`).join('')}</details>`).join('') || `<p>${t('empty')}</p>`;
    const filtered = (directory || []).filter(r => matches(r.name, r.tags));
    root.querySelector('#directory').innerHTML = filtered.slice(0, limit).map(r => `<div><i aria-hidden="true" class="${esc(r.icon)}"></i><strong>${esc(r.name)}</strong><small>${t(group(r.name, r.tags))}</small></div>`).join('') || (directory ? `<p>${t('empty')}</p>` : '…');
    root.querySelector('#more').hidden = filtered.length <= limit;
  }
  q.oninput = category.onchange = () => {
    limit = 32;
    draw();
  };
  root.querySelector('#more').onclick = () => {
    limit += 48;
    draw();
  };
  draw();
  if (!directory) try {
    const res = await fetch('/edisi/skill.html');
    if (!res.ok) throw Error();
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    directory = [...doc.querySelectorAll('.catalog li')].map(li => ({
      name: li.querySelector('strong').textContent,
      tags: li.querySelector('small').textContent,
      icon: li.querySelector('i').className
    }));
  } catch {
    root.querySelector('#directory').innerHTML = '<button>' + t('retry') + '</button>';
    root.querySelector('#directory button').onclick = () => capabilities(root, projects, language, esc);
    return;
  }
  if (root.isConnected) draw();
}

import { locales, names } from './words.js';
import { textRows } from './service-words.js';
const kind = document.body.dataset.service,
  dining = kind === 'resto',
  travel = kind === 'travel';
const brand = {
  resto: 'Daun & Bara',
  travel: 'Lintas Teluk',
  care: 'Ruang Rawat'
}[kind];
const safe = v => String(v ?? '').replace(/[&<>"']/g, k => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[k]);
const $ = s => document.querySelector(s);
let lang = 'en';
try {
  lang = localStorage.getItem('atelier.language') || 'en';
} catch {}
if (!locales.includes(lang)) lang = 'en';
const t = k => textRows[k]?.split('|')[locales.indexOf(lang)] ?? k;
const money = v => new Intl.NumberFormat(lang, {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
}).format(v);
const today = new Date(),
  todayISO = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
const key = 'atelier.booking.' + kind;
let state = {
  stage: 0,
  spread: 0,
  bag: [],
  place: '0',
  vehicle: '0',
  date: todayISO,
  time: '09:00',
  qty: '1',
  service: 'daily',
  address: '',
  extra: false,
  method: 'card',
  mode: 'dine',
  reference: '',
  cancelled: false
};
try {
  Object.assign(state, JSON.parse(sessionStorage.getItem(key) || '{}'));
} catch {}
const persist = () => {
  try {
    sessionStorage.setItem(key, JSON.stringify(state));
  } catch {}
};
const dishes = [['chicken', 45000], ['fish', 62000], ['mushroom', 34000], ['satay', 32000], ['tofu', 23000], ['rice', 25000], ['tea', 18000], ['coffee', 28000], ['lime', 22000], ['roselle', 24000], ['coconut', 26000], ['passion', 29000]];
const hotels = [['Teluk House', 560000, 12, 28, 179, 97], ['Pesisir Lodge', 740000, 19, 42, 246, 65], ['Bukit Senja', 860000, 25, 54, 297, 34]];
const drivers = [['Sedan', 'Dimas Arta', 105000], ['MPV', 'Rani Surya', 155000], ['Minibus', 'Bayu Adi', 225000]];
const nurses = ['Nadia Laras', 'Arif Pradana', 'Mira Sari'],
  specialties = ['daily', 'mobility', 'elder'],
  rates = {
    daily: 75000,
    mobility: 85000,
    elder: 95000
  };
const image = {
  resto: 'hidangan.webp',
  travel: 'pesisir.webp',
  care: 'perawat-0.webp'
}[kind];
function select(k, label, values, display = t) {
  return `<label>${t(label)}<select name="${k}">${values.map(v => `<option value="${v}" ${String(state[k]) === String(v) ? 'selected' : ''}>${safe(display(v))}</option>`).join('')}</select></label>`;
}
function amount() {
  if (dining) return state.bag.reduce((sum, item) => sum + dishes[item.id][1], 0);
  if (travel) return hotels[state.place][1] * Number(state.qty) + drivers[state.vehicle][2] + hotels[state.place][2] * 3000;
  return rates[state.service] * Number(state.qty) + (state.extra ? 45000 : 0);
}
function book() {
  const start = state.spread * 6;
  return `<div class="tabs">${['food', 'drinks'].map((k, i) => `<button data-page="${i}" aria-pressed="${state.spread === i}">${t(k)}</button>`).join('')}</div><div class="book">${[0, 1].map(side => `<article><small>${t('page')} 0${state.spread * 2 + side + 1}</small><h2>${t(state.spread ? 'drinks' : 'food')}</h2>${dishes.slice(start + side * 3, start + side * 3 + 3).map(([k, p], j) => `<div class="dish"><h3>${t(k)}</h3><p>${money(p)}</p><button data-dish="${start + side * 3 + j}" aria-label="${t('add')} · ${t(k)}">+ ${t('add')}</button></div>`).join('')}</article>`).join('')}</div>`;
}
function serviceForm() {
  const choices = travel ? hotels.map(h => h[0]) : nurses;
  return `<h2>${t(travel ? 'hotel' : 'nurse')}</h2><div class="choices">${choices.map((n, i) => `<label class="choice">${travel ? '' : `<img src="/edisi/perawat-${i}.webp" alt="">`}<span><strong>${n}</strong><small>${travel ? money(hotels[i][1]) + ' / ' + t('perNight') : t(specialties[i])}</small></span><input type="radio" name="place" value="${i}" ${Number(state.place) === i ? 'checked' : ''}></label>`).join('')}</div><div class="inputs"><label>${t('date')}<input name="date" required type="date" min="${todayISO}" value="${safe(state.date)}"></label><label>${t('time')} (WITA)<input name="time" required type="time" value="${safe(state.time)}"></label>${select('qty', travel ? 'nights' : 'hours', travel ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 4, 8], String)}${travel ? select('vehicle', 'car', [0, 1, 2], i => drivers[i][0]) : select('service', 'service', specialties)}</div>${travel ? '' : `<label>${t('address')}<input name="address" maxlength="200" required value="${safe(state.address)}"></label><label class="inline"><input type="checkbox" name="extra" ${state.extra ? 'checked' : ''}> ${t('companion')} + ${money(45000)}</label>`}`;
}
function map() {
  const [hotel,, km, min, x, y] = hotels[state.place];
  return `<figure><svg viewBox="0 0 340 170" aria-hidden="true"><rect width="340" height="170" fill="#e8eddf"/><path d="M0 115Q90 130 140 42L200 0H0" fill="#a8d0d7"/><path d="M0 160L80 120 120 130 170 100 330 40M100 170L128 95 278 0M140 170L190 112 340 90" stroke="white" fill="none" stroke-width="8"/><path d="M30 150L80 120 120 130 170 100 ${x} ${y}" fill="none" stroke="#146b78" stroke-width="5"/><circle cx="30" cy="150" r="6"/><circle cx="${x}" cy="${y}" r="6"/></svg><figcaption>${t('layout')} · ${km} km · ${min} ${t('minutes')}</figcaption></figure><p>Terminal Teluk → ${hotel}</p>`;
}
function summary() {
  if (dining) return state.bag.length ? state.bag.map((item, i) => `<div class="line"><span><strong>${t(dishes[item.id][0])}</strong><small>${item.opts.map(o => t(o)).join(' / ')}</small></span><span>${money(dishes[item.id][1])}${state.stage === 0 ? `<button data-remove="${i}">${t('remove')}</button>` : ''}</span></div>`).join('') : `<p>${t('empty')}</p>`;
  if (travel) {
    const [car, driver, fare] = drivers[state.vehicle],
      h = hotels[state.place];
    return map() + `<p>${t('hotel')}: ${h[0]} · ${state.qty} ${t('nights')} · ${money(h[1] * state.qty)}</p><p>${car} · ${t('driver')}: ${driver} · ${money(fare + h[2] * 3000)}</p><p>${safe(state.date)} · ${safe(state.time)} WITA</p>`;
  }
  return `<strong>${nurses[state.place]}</strong><p>${t(state.service)} · ${money(rates[state.service])} / ${t('perHour')}</p><p>${state.qty} ${t('hours')} · ${safe(state.date)} · ${safe(state.time)} WITA</p><p>${safe(state.address)}</p>${state.extra ? `<p>${t('companion')} + ${money(45000)}</p>` : ''}`;
}
function total() {
  return `<div class="total"><span>${t('total')}</span><strong>${money(amount())}</strong></div>`;
}
function side() {
  return `<small>${brand}</small><h2>${t(dining ? 'basket' : travel ? 'route' : 'estimate')}</h2>${summary()}${total()}<button class="primary" form="order" ${dining && !state.bag.length ? 'disabled' : ''}>${t('next')} →</button>`;
}
function render() {
  document.documentElement.lang = lang;
  document.title = brand + ' · ' + t(kind);
  $('header').innerHTML = `<b>${brand}</b><nav><a href="/demos">← ${t('studio')}</a><select aria-label="Language" id="language">${locales.map((l, i) => `<option value="${l}" ${lang === l ? 'selected' : ''}>${names[i]}</option>`).join('')}</select></nav>`;
  $('footer').textContent = brand + ' · ' + t('demo');
  const stage = state.stage,
    output = dining ? 'receipt' : travel ? 'ticket' : 'visit';
  $('main').innerHTML = stage === 0 ? `<div class="mast"><div><small>${t(kind)}</small><h1>${t(kind + 'Title')}</h1></div><img src="/edisi/${image}" alt=""></div><div class="workspace"><form id="order">${dining ? select('mode', 'mode', ['dine', 'pickup']) + book() : serviceForm()}</form><aside>${side()}</aside></div>` : `<section class="paper"><small>${t('demo')}</small><h1>${t(stage === 1 ? 'next' : output)}</h1>${state.reference ? `<p class="ref">${safe(state.reference)}</p>` : ''}${dining ? `<p>${t(state.mode)} · ${t('table')}</p>` : ''}${summary()}${total()}${stage === 1 ? `<form id="payment">${select('method', 'method', ['card', 'wallet'])}<button class="primary">${t('pay')}</button></form><button data-back>${t('back')}</button>` : `<p>${t('method')} · ${t(state.method)}</p><p class="status">${t('status')} · ${t(state.cancelled ? 'cancelled' : dining ? 'preparing' : 'confirmed')}</p><div class="controls"><button data-print>${t('print')}</button>${!dining && !state.cancelled ? `<button data-back>${t('change')}</button><button data-cancel>${t('cancel')}</button>` : ''}<button data-new>${t('again')}</button></div>`}</section>`;
  $('#language').onchange = e => {
    lang = e.target.value;
    try {
      localStorage.setItem('atelier.language', lang);
    } catch {}
    render();
  };
}
function update(e) {
  const el = e.target;
  if (!el.name || !Object.hasOwn(state, el.name)) return;
  state[el.name] = el.type === 'checkbox' ? el.checked : el.value;
  persist();
  if ($('aside')) $('aside').innerHTML = side();
}
document.addEventListener('input', update);
document.addEventListener('submit', e => {
  if (!['order', 'payment', 'dish'].includes(e.target.id)) return;
  e.preventDefault();
  if (e.target.id === 'dish') {
    const f = e.target;
    state.bag.push({
      id: Number(f.dataset.id),
      opts: [...new FormData(f).values()]
    });
    $('dialog').close();
  } else if (e.target.id === 'order') {
    if (dining && !state.bag.length) return;
    state.stage = 1;
  } else {
    state.stage = 2;
    state.reference ||= kind.toUpperCase() + '-' + crypto.randomUUID().slice(0, 8).toUpperCase();
    state.cancelled = false;
  }
  persist();
  render();
  if (state.stage) scrollTo(0, 0);
});
document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  const a = b.dataset;
  if ('page' in a || 'dish' in a || 'remove' in a) e.preventDefault();
  if ('dish' in a) {
    const id = Number(a.dish);
    $('dialog').innerHTML = `<form id="dish" data-id="${id}"><small>${brand}</small><h2>${t(dishes[id][0])}</h2>${id < 6 ? select('spice', 'spice', ['mild', 'hot', 'side']) : select('ice', 'ice', ['normal', 'less', 'none']) + select('sugar', 'sugar', ['normal', 'less', 'none'])}<button class="primary">${t('add')} · ${money(dishes[id][1])}</button><button type="button" data-dismiss>← ${t('menu')}</button></form>`;
    $('dialog').showModal();
    return;
  }
  if ('dismiss' in a) {
    $('dialog').close();
    return;
  }
  if ('print' in a) {
    window.print();
    return;
  }
  if ('page' in a) state.spread = Number(a.page);else if ('remove' in a) state.bag.splice(Number(a.remove), 1);else if ('back' in a) state.stage = 0;else if ('cancel' in a) {
    if (!confirm(t('confirmCancel'))) return;
    state.cancelled = true;
  } else if ('new' in a) {
    try {
      sessionStorage.removeItem(key);
    } catch {}
    location.reload();
    return;
  } else return;
  persist();
  render();
});
render();

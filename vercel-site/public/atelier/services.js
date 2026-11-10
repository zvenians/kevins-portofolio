import { locales, names } from './words.js';
import { textRows } from './service-words.js';
import QRCode from './qr-encoder.js';
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
  room: 'garden',
  guests: '1',
  guest: '',
  people: '1',
  deliveryAddress: '',
  voucher: 'none',
  recurring: 'once',
  notes: '',
  ready: false,
  reference: '',
  cancelled: false
};
function restoreBooking(saved) {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return;
  const allowed = {
    stage: [0, 1, 2],
    spread: [0, 1],
    place: ['0', '1', '2'],
    vehicle: ['0', '1', '2'],
    qty: (travel ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 4, 8]).map(String),
    service: ['daily', 'elder', 'mobility'],
    method: ['card', 'wallet'],
    mode: ['dine', 'delivery', 'pickup'],
    room: ['garden', 'suite'],
    guests: ['1', '2', '3', '4'],
    people: ['1', '2', '3', '4', '5', '6'],
    voucher: ['none', 'season'],
    recurring: ['once', 'weekly']
  };
  for (const [field, values] of Object.entries(allowed)) if (values.includes(saved[field])) state[field] = saved[field];
  for (const field of ['guest', 'notes', 'address', 'deliveryAddress']) if (typeof saved[field] === 'string') state[field] = saved[field].slice(0, 200);
  for (const field of ['extra', 'ready', 'cancelled']) state[field] = saved[field] === true;
  if (typeof saved.date === 'string' && /^\d{4}-\d\d-\d\d$/.test(saved.date)) state.date = saved.date;
  if (typeof saved.time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(saved.time)) state.time = saved.time;
  if (typeof saved.reference === 'string' && new RegExp('^' + kind.toUpperCase() + '-[A-F0-9]{8}$').test(saved.reference)) state.reference = saved.reference;
  if (Array.isArray(saved.bag)) state.bag = saved.bag.filter(item => item && Number.isInteger(item.id) && item.id >= 0 && item.id < 12).slice(0, 200).map(item => ({
    id: item.id,
    double: item.double === true,
    note: typeof item.note === 'string' ? item.note.slice(0, 120) : '',
    opts: Array.isArray(item.opts) ? item.opts.filter(o => ['normal', 'less', 'none', 'mild', 'hot', 'side', 'double'].includes(o)).slice(0, 3) : []
  }));
  if (state.stage === 2 && !state.reference || dining && state.stage && !state.bag.length) state.stage = 0;
}
try {
  restoreBooking(JSON.parse(sessionStorage.getItem(key) || 'null'));
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
  if (dining) {
    const subtotal = state.bag.reduce((sum, item) => sum + dishes[item.id][1] * (item.double ? 2 : 1), 0);
    return Math.round(subtotal * (state.voucher === 'season' ? .9 : 1)) + (state.mode === 'delivery' && subtotal ? 15000 : 0);
  }
  if (travel) return (hotels[state.place][1] + (state.room === 'suite' ? 220000 : 0)) * Number(state.qty) + drivers[state.vehicle][2] + hotels[state.place][2] * 3000;
  return (rates[state.service] * Number(state.qty) + (state.extra ? 45000 : 0)) * (state.recurring === 'weekly' ? 4 : 1);
}
function ticketCode(reference) {
  const code = new QRCode(1, 1);
  code.addData(reference);
  code.make();
  let pixels = '';
  for (let row = 0; row < code.getModuleCount(); row++) for (let col = 0; col < code.getModuleCount(); col++) if (code.isDark(row, col)) pixels += 'M' + (col + 4) + ' ' + (row + 4) + 'h1v1h-1z';
  return `<svg role="img" aria-label="QR · ${safe(reference)}" width="116" height="116" viewBox="0 0 29 29" shape-rendering="crispEdges"><path fill="white" d="M0 0h29v29H0z"/><path fill="#141414" d="${pixels}"/></svg>`;
}
function book() {
  const start = state.spread * 6;
  return `<div class="tabs">${['food', 'drinks'].map((k, i) => `<button data-page="${i}" aria-pressed="${state.spread === i}">${t(k)}</button>`).join('')}</div><div class="book">${[0, 1].map(side => `<article><small>${t('page')} 0${state.spread * 2 + side + 1}</small><h2>${t(state.spread ? 'drinks' : 'food')}</h2>${dishes.slice(start + side * 3, start + side * 3 + 3).map(([k, p], j) => {
    const id=start+side*3+j,
      x=(id%4)/3*100,
      y=Math.floor(id/4)/2*100;
    return `<div class="dish"><span class="dish-photo" style="--dish-x:${x}%;--dish-y:${y}%" aria-hidden="true"></span><div class="dish-copy"><small>${t('estimateTime')} · ${id > 5 ? 4 : id === 0 ? 18 : 12} ${t('minutes')}</small><h3>${t(k)}</h3><p>${money(p)}</p><button data-dish="${id}" aria-label="${t('add')} · ${t(k)}">+ ${t('add')}</button></div></div>`;
  }).join('')}</article>`).join('')}</div>`;
}
function serviceForm() {
  const choices = travel ? hotels.map(h => h[0]) : nurses;
  return `<h2>${t(travel ? 'hotel' : 'nurse')}</h2><div class="choices">${choices.map((n, i) => `<label class="choice">${travel ? `<span class="hotel-photo" style="--hotel-x:${i*50}%" aria-hidden="true"></span>` : `<img src="/edisi/perawat-${i}.webp" alt="">`}<span><strong>${n}</strong><small>${travel ? money(hotels[i][1]) + ' / ' + t('perNight') : t(specialties[i])}</small></span><input type="radio" name="place" value="${i}" ${Number(state.place) === i ? 'checked' : ''}></label>`).join('')}</div><div class="inputs"><label>${t('date')}<input name="date" required type="date" min="${todayISO}" value="${safe(state.date)}"></label><label>${t('time')} (WITA)<input name="time" required type="time" value="${safe(state.time)}"></label>${select('qty', travel ? 'nights' : 'hours', travel ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 4, 8], String)}${travel ? select('vehicle', 'car', [0, 1, 2], i => drivers[i][0]) : select('service', 'service', specialties)}</div>${travel ? '' : `<label>${t('address')}<input name="address" maxlength="200" required value="${safe(state.address)}"></label><label class="inline"><input type="checkbox" name="extra" ${state.extra ? 'checked' : ''}> ${t('companion')} + ${money(45000)}</label>`}`;
}
function map() {
  const [hotel,, km, min, x, y] = hotels[state.place];
  return `<figure><svg viewBox="0 0 340 170" aria-hidden="true"><rect width="340" height="170" fill="#e8eddf"/><path d="M0 115Q90 130 140 42L200 0H0" fill="#a8d0d7"/><path d="M0 160L80 120 120 130 170 100 330 40M100 170L128 95 278 0M140 170L190 112 340 90" stroke="white" fill="none" stroke-width="8"/><path d="M30 150L80 120 120 130 170 100 ${x} ${y}" fill="none" stroke="#146b78" stroke-width="5"/><circle cx="30" cy="150" r="6"/><circle cx="${x}" cy="${y}" r="6"/><g font-family="system-ui" font-size="12" font-weight="700" fill="#123341" stroke="#f9f7ec" stroke-width="3" paint-order="stroke"><text x="12" y="139">Terminal Teluk</text><text x="${x-8}" y="${y-12}" text-anchor="end">${hotel}</text></g></svg><figcaption>${t('layout')} · ${km} km · ${min} ${t('minutes')}</figcaption></figure><p>Terminal Teluk → ${hotel}</p>`;
}
function summary() {
  if (dining) return state.bag.length ? state.bag.map((item, i) => `<div class="line"><span><strong>${t(dishes[item.id][0])}</strong><small>${item.opts.map(o => t(o)).join(' / ')} · ${safe(item.note)}</small></span><span>${money(dishes[item.id][1] * (item.double ? 2 : 1))}${state.stage === 0 ? `<button data-remove="${i}">${t('remove')}</button>` : ''}</span></div>`).join('') : `<p>${t('empty')}</p>`;
  const duration = (key,singular) => Number(state.qty) === 1 && lang === 'en' ? singular : t(key);
  if (travel) {
    const [car, driver, fare] = drivers[state.vehicle],
      h = hotels[state.place];
    return map() + `<p>${h[0]} · ${t(state.room)} · ${state.qty} ${duration('nights','night')} · ${money((h[1] + (state.room === 'suite' ? 220000 : 0)) * state.qty)}</p><p>${t('guests')} · ${state.guests}${state.guest ? ' · '+safe(state.guest) : ''}</p><p>${car} · ${t('driver')} · ${driver} · KT 11${state.vehicle}2 LT · ${money(fare + h[2] * 3000)}</p><p>${safe(state.date)} · ${safe(state.time)} WITA</p>`;
  }
  return `<strong>${nurses[state.place]}</strong><p>${t(state.service)} · ${money(rates[state.service])} / ${t('perHour')}</p><p>${state.qty} ${duration('hours','hour')} · ${safe(state.date)} · ${safe(state.time)} WITA</p><p>${safe(state.address)}</p>${state.extra ? `<p>${t('companion')} + ${money(45000)}</p>` : ''}`;
}
function total() {
  const details = [];
  if (dining && state.voucher === 'season') details.push(t('season'));
  if (dining && state.mode === 'delivery') details.push(t('deliveryFee') + ' · ' + money(15000) + ' · ' + safe(state.deliveryAddress));
  if (dining && state.mode === 'dine' && state.people > 1) details.push(t('split') + ' · ' + money(amount() / state.people));
  if (!dining && !travel) details.push(t(state.recurring), safe(state.notes));
  return details.filter(Boolean).map(line => '<p>' + line + '</p>').join('') + `<div class="total"><span>${t('total')}</span><strong>${money(amount())}</strong></div>`;
}
function discovery(form) {
  const bar = document.createElement('section');
  bar.className = 'discovery';
  const filters = dining ? select('filter', 'diet', ['any', 'plant']) : travel ? select('filter', 'sort', ['any', 'priceAsc', 'durationSort']) : select('filter', 'service', ['any', ...specialties]);
  bar.innerHTML = `<label>${t('search')}<input type="search" autocomplete="off"></label>${filters}<p hidden role="status">${t('noResults')}</p>`;
  if(dining) form.querySelector('.book').after(bar);
  else form.prepend(bar);
  const rows = [...form.querySelectorAll(dining ? '.dish' : '.choice')];
  rows.forEach((row, i) => {
    if (!dining) {
      const details = document.createElement('div');
      details.className = 'profile-detail';
      const features = travel ? [t('breakfast'), t('wifi'), t('access')] : [t('licensed'), t('area') + ' · Balikpapan', t('language') + ' · ' + ['Indonesia / English', 'Indonesia', 'Indonesia / English'][i]];
      details.innerHTML = `<details><summary>${t('detail')}</summary><p>${features.join(' · ')}</p></details>`;
      row.after(details);
      const wrapper = document.createElement('div');
      row.before(wrapper);
      wrapper.append(row, details);
      wrapper.className = 'option-panel';
    }
  });
  function filter() {
    const query = bar.querySelector('input').value.trim().toLowerCase(),
      mode = bar.querySelector('select').value;
    let count = 0;
    const order = rows.map((row, i) => ({
      row,
      i
    }));
    if (travel && mode !== 'any') order.sort((a, b) => hotels[a.i][mode === 'priceAsc' ? 1 : 3] - hotels[b.i][mode === 'priceAsc' ? 1 : 3]);
    for (const {
      row,
      i
    } of order) {
      const card = dining ? row : row.parentElement;
      const matches = row.textContent.toLowerCase().includes(query) && (mode === 'any' || travel || (dining ? [2, 4, 5, 6, 8, 9, 10, 11].includes(Number(row.querySelector('[data-dish]').dataset.dish)) : specialties[i] === mode));
      card.hidden = !matches;
      if (travel) card.parentElement.append(card);
      if (matches) count++;
    }
    bar.querySelector('[role=status]').hidden = count > 0;
  }
  bar.oninput = filter;
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
  $('main').innerHTML = stage === 0 ? `<div class="mast"><div><small>${t(kind)}</small><h1>${t(kind + 'Title')}</h1></div><img src="/edisi/${image}" alt=""></div><div class="workspace"><form id="order">${dining ? book() + select('mode', 'mode', ['dine', 'pickup']) : serviceForm()}</form><aside>${side()}</aside></div>` : `<section class="paper"><small>${t('demo')}</small><h1>${t(stage === 1 ? 'next' : output)}</h1>${state.reference ? `<p class="ref">${safe(state.reference)}</p>` : ''}${dining ? `<p>${t(state.mode)} · ${t('table')}</p>` : ''}${summary()}${total()}${stage === 1 ? `<form id="payment">${select('method', 'method', ['card', 'wallet'])}<button class="primary">${t('pay')}</button></form><button data-back>${t('back')}</button>` : `<p>${t('method')} · ${t(state.method)}</p><p class="status">${t('status')} · ${t(state.cancelled ? 'cancelled' : dining ? 'preparing' : 'confirmed')}</p><div class="controls"><button data-print>${t('print')}</button>${!dining && !state.cancelled ? `<button data-back>${t('change')}</button><button data-cancel>${t('cancel')}</button>` : ''}<button data-new>${t('again')}</button></div>`}</section>`;
  if (stage === 0) {
    if (dining) {
      const mode = $('select[name=mode]');
      mode.innerHTML += `<option value="delivery">${t('delivery')}</option>`;
      mode.value = state.mode;
      const details = state.mode === 'delivery' ? `<label>${t('destination')}<input required name="deliveryAddress" value="${safe(state.deliveryAddress)}" maxlength="160"></label>` : state.mode === 'dine' ? select('people', 'people', [1, 2, 3, 4, 5, 6], String) : '';
      mode.closest('label').insertAdjacentHTML('afterend', `<div class="inputs">${details}${select('voucher', 'voucher', ['none', 'season'])}</div>`);
    } else if (travel) {
      $('#order').insertAdjacentHTML('beforeend', `<div class="inputs">${select('room', 'room', ['garden', 'suite'])}${select('guests', 'guests', [1, 2, 3, 4], String)}</div><label>${t('guest')}<input name="guest" maxlength="80" required value="${safe(state.guest)}"></label>`);
    } else {
      $('#order').insertAdjacentHTML('beforeend', `<div class="inputs">${select('recurring', 'recurring', ['once', 'weekly'])}<label>${t('notes')}<input name="notes" maxlength="180" value="${safe(state.notes)}"></label></div>`);
      document.querySelectorAll('.choice span').forEach((el, i) => el.insertAdjacentHTML('beforeend', `<small>${[6, 4, 8][i]} ${t('exp')} · Balikpapan</small>`));
    }
  }
  if (stage === 0) {
    discovery($('#order'));
    const mast=$('.mast'), heading=mast.querySelector('h1');
    const titles={resto:'Daun & Bara.',travel:'Lintas Teluk.',care:t('careTitle')};
    heading.textContent=titles[kind];
    mast.querySelector('div').insertAdjacentHTML('beforeend',`<a class="mast-action" href="#order">${t(dining?'food':travel?'hotel':'nurse')} ↓</a>`);
    if(travel) mast.querySelector('img').outerHTML=`<div class="atlas-art" aria-hidden="true">${map()}</div>`;
  }
  if (stage === 2 && travel) {
    $('.ref').insertAdjacentHTML('afterend', ticketCode(state.reference));
    $('.controls').insertAdjacentHTML('afterbegin', `<button data-download>${t('download')}</button>`);
  }
  if (stage === 2 && dining && !state.ready) $('.controls').insertAdjacentHTML('afterbegin', `<button data-advance>${t('advance')}</button>`);
  if (stage === 2 && dining && state.ready) $('.status').textContent = t('status') + ' · ' + t('ready');
  if (stage && dining && state.mode !== 'dine') $('.paper>p:not(.ref)').textContent = t(state.mode);
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
  if (!el.name || !Object.hasOwn(state, el.name) || !el.matches('#order input,#order select,#payment select')) return;
  state[el.name] = el.type === 'checkbox' ? el.checked : el.value;
  persist();
  if (el.name === 'mode') {
    render();
    return;
  }
  if ($('aside')) $('aside').innerHTML = side();
  if(travel && el.name==='place') $('.atlas-art').innerHTML=map();
}
document.addEventListener('input', update);
document.addEventListener('submit', e => {
  if (!['order', 'payment', 'dish'].includes(e.target.id)) return;
  e.preventDefault();
  if (e.target.id === 'dish') {
    const f = e.target;
    state.bag.push({
      id: Number(f.dataset.id),
      opts: [...f.querySelectorAll('select')].map(s => s.value),
      double: f.elements.portion?.value === 'double',
      note: f.elements.note.value.trim()
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
    const custom = $('#dish .primary');
    custom.insertAdjacentHTML('beforebegin', (id < 6 ? select('portion', 'portion', ['normal', 'double']) : '') + `<label>${t('note')}<input name="note" maxlength="120"></label>`);
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
  if ('download' in a) {
    const slip = $('.paper').cloneNode(true);
    slip.querySelector('.controls')?.remove();
    const file = new Blob(['<!doctype html><html lang="' + lang + '"><meta charset="utf-8"><title>' + safe(state.reference) + '</title><main style="max-width:620px;margin:3em auto;font:16px/1.5 system-ui">' + slip.innerHTML + '</main></html>'], {
      type: 'text/html'
    });
    const url = URL.createObjectURL(file),
      link = document.createElement('a');
    link.href = url;
    link.download = state.reference + '.html';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  if ('advance' in a) {
    state.ready = true;
    persist();
    render();
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

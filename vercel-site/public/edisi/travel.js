const options = document.getElementById('options');
const arrival = document.getElementById('arrival');
const pickup = document.getElementById('pickup');
const form = document.getElementById('form');
const route = document.getElementById('route');
const pin = document.getElementById('pin');
const destination = document.getElementById('destination');
const info = document.getElementById('info');
const ticket = document.getElementById('ticket');
const download = document.getElementById('download');
const code = document.getElementById('code');
const hotels=[['Teluk House','Kamar taman',560000,12,28,180,97],['Pesisir Lodge','Kamar teluk',740000,19,42,246,65],['Bukit Senja','Suite bukit',860000,25,54,297,34]];
const cars=[['Sedan','Dimas Arta',105000],['MPV','Rani Surya',155000],['Minibus','Bayu Adi',225000]];
options.innerHTML=field('Hotel',hotels.map(x=>x[0]))+field('Transportasi',cars.map(x=>x[0]))+field('Malam',[1,2,3,4,5,6,7]);
arrival.min=arrival.value=dateToday();
function itinerary(){const [hotel,room,rate,km,minutes,x,y]=hotels[form.elements.Hotel.selectedIndex];const [car,driver,fare]=cars[form.elements.Transportasi.selectedIndex];const nights=Number(form.elements.Malam.value);const transfer=fare+km*3000;return {hotel,x,y,lines:[hotel+' · '+room,'Check-in '+arrival.value+' · '+nights+' malam','Kamar '+rp(rate)+' × '+nights,'Terminal Teluk → '+hotel,car+' · Pengemudi '+driver,'Penjemputan '+pickup.value+' WITA · '+km+' km · ±'+minutes+' menit','Transportasi '+rp(transfer),'Total '+rp(rate*nights+transfer)]}}
function refresh(){const t=itinerary();route.setAttribute('d','M32 150 L90 128 L123 131 L147 102 L'+t.x+' '+t.y);pin.setAttribute('cx',t.x);pin.setAttribute('cy',t.y);destination.textContent=t.hotel;info.innerHTML=t.lines.map(l=>'<p>'+l+'</p>').join('');ticket.hidden=true;if(download.href.startsWith('blob:'))URL.revokeObjectURL(download.href)}
form.oninput=refresh;form.onsubmit=e=>{e.preventDefault();const t=itinerary(),ref='LT-'+crypto.randomUUID().slice(0,8).toUpperCase();const lines=['Lintas Teluk','E-tiket simulasi '+ref,...t.lines,'Data fiktif. Berlaku untuk demonstrasi saja.'];const html='<!doctype html><html lang="id"><meta charset="utf-8"><title>E-tiket '+ref+'</title><main style="max-width:540px;margin:8vh auto;font:18px/1.5 system-ui;border-top:8px solid #134d69;padding:24px"><h1>'+lines.shift()+'</h1>'+lines.map(l=>'<p>'+l+'</p>').join('')+'</main></html>';download.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));download.download=ref+'.html';code.textContent=ref;ticket.hidden=false;download.focus()};refresh();

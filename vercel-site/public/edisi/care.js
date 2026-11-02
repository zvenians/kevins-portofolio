const people = document.getElementById('people');
const options = document.getElementById('options');
const day = document.getElementById('day');
const hour = document.getElementById('hour');
const form = document.getElementById('form');
const addressField = document.getElementById('addressField');
const estimate = document.getElementById('estimate');
const confirmation = document.getElementById('confirmation');
const nurses=['Nadia Laras','Arif Pradana','Mira Sari'];const services=[['Pendampingan harian',75000],['Kunjungan lansia',95000],['Pendampingan mobilitas',85000]];
const fokus=['Pendampingan harian','Pendampingan mobilitas','Kunjungan lansia'];
people.innerHTML=nurses.map((name,i)=>'<label><img width="260" height="260" src="perawat-'+i+'.webp" alt="Potret ilustratif '+name+'"><span><input required type="radio" name="perawat" value="'+name+'" '+(i?'':'checked')+'> '+name+'</span><small>Fokus · '+fokus[i]+'</small></label>').join('');
options.innerHTML=field('Layanan',services.map(s=>s[0]))+field('Durasi',['1 jam','2 jam','4 jam','8 jam']);day.min=day.value=dateToday();
function quote(){const [service,rate]=services[form.elements.Layanan.selectedIndex],duration=form.elements.Durasi.value;return [service,duration,rp(rate*parseInt(duration))]}
function refresh(){const [service,duration,price]=quote();estimate.textContent=form.elements.perawat.value+' · '+service+' · '+duration+' · '+price;confirmation.textContent=''}
form.oninput=refresh;form.onsubmit=e=>{e.preventDefault();const addr=addressField.value.trim();if(!addr){addressField.focus();return}confirmation.textContent='Kunjungan demo terjadwal untuk '+day.value+' pukul '+hour.value+' WITA. '+form.elements.perawat.value+' · '+quote().join(' · ')+' · '+addr+'.'};refresh();

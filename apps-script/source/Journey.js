// A short public entrance; the complete working collection has its own address.
const fullStudioHome=home, previousImmersion=initImmersion, previousCase=casePage;
const studioUrl=()=>window.INDEX_HOSTED?'/studio':'#studio';
const originalHomeHref=homeHref;
homeHref=function(anchor='home'){if(window.INDEX_HOSTED&&['studio','lab','research','research-intake','open-lab','experiments'].includes(anchor))return '/studio'+(anchor==='studio'?'':'#'+anchor);return originalHomeHref(anchor);};
const shortCard=p=>`<a class="journey-card" href="${projectHref(p.slug)}">${visual(p)}<span>${esc(p.status)}</span><h3>${esc(p.name)} ↗</h3><p>${esc(p.summary)}</p></a>`;
const editionRoot = () => window.INDEX_HOSTED ? '' : 'https:\x2f\x2fportfolio-kevins.vercel.app';
const serviceDemos = [
 ['resto','Daun & Bara','Buka buku menu','Pilih hidangan dan racik minuman.'],
 ['travel','Lintas Teluk','Rencanakan perjalanan','Pesan kamar dan kendaraan dalam satu tiket.'],
 ['care','Ruang Rawat','Atur kunjungan','Pilih perawat dan jadwalkan layanan di rumah.']
];
function serviceShelf(){
 return '<div class="service-shelf">'+serviceDemos.map(([id,title,action,note],i)=>`<a href="${editionRoot()}/edisi/${id}.html"><small>0${i+1} / Demo</small><strong>${title}</strong><p>${note}</p><b>${action} ↗</b></a>`).join('')+'</div>';
}
const skillGroups={
 'Bahasa & web':'JavaScript TypeScript Python Java C C++ C-Sharp Go Rust PHP Kotlin Swift Ruby HTML5 CSS3',
 'Framework & runtime':'React Next.js Vue.js Angular Svelte Django Flask Laravel Spring Node.js Express',
 'Database & penyimpanan':'PostgreSQL MySQL MongoDB Redis SQLite Firebase',
 'Peralatan IT':'Git Docker Linux GitHub-Actions Figma Bash'
};
function skillIndex(){
 const ids={'C++':'cpp','C-Sharp':'csharp','GitHub-Actions':'githubactions'};
 return `<div id="skills" class="skill-index"><h2>Skill & teknologi</h2><p>Katalog bahasa, framework, database, dan alat IT. Lihat studi kasus untuk teknologi yang digunakan Kevin.</p>${Object.entries(skillGroups).map(([group,names])=>`<details><summary>${group}</summary><ul>${names.split(' ').map(name=>`<li><img loading="lazy" width="28" height="28" alt="" src="${editionRoot()}/edisi/logos/${ids[name]||name.toLowerCase().replaceAll('.','')}.svg">${name.replace('C-Sharp','C#').replace('GitHub-Actions','GitHub Actions')}</li>`).join('')}</ul></details>`).join('')}<p><a href="${editionRoot()}/edisi/skill.html">Telusuri seluruh katalog teknologi ↗</a></p></div>`;
}
home=function(){
 if(data.studioPage||(!window.INDEX_HOSTED&&location.hash==='#studio')){fullStudioHome();return;}
 document.body.classList.add('journey-home');
 const real=data.projects.filter(p=>p.status==='Real Project');
 const picks=['koma-manga-reader','wedding-invitation-demo','presence-attendance-demo'].map(slug=>data.projects.find(p=>p.slug===slug)).filter(Boolean);
 $('#main').innerHTML=`
 <section class="journey-hero kinetic-hero" id="home">
   <div class="k-meta"><span>KS / BALIKPAPAN</span><span>01 — 05</span></div>
   <h1><span>Kevin</span> <em>Simatupang.</em></h1>
   <div class="k-intro"><p>Full-stack developer building websites,<br>data workflows, and everyday automation.</p>
   <div class="journey-actions"><a class="solid-button" href="${homeHref('field')}">Explore real projects ↗</a><a href="${homeHref('connect')}">Discuss a project</a><a href="${homeHref('resume')}">CV / PDF ↗</a></div></div>
   <figure class="portfolio-cover"><img src="${editionRoot()}/project-shots/galilea-web-portal.webp" width="1100" height="720" alt="Antarmuka portal Galilea"><figcaption>Proyek pilihan / GMAHK Galilea</figcaption></figure>
 </section>
 <section id="field" class="journey-section k-work"><span class="eyebrow">02 / SELECTED WORK</span><h2>Selected projects.</h2>
 <div class="k-split"><div class="k-index">${real.map((p,i)=>`<button type="button" aria-pressed="${i===0}" data-project-index="${i}"><small>${String(i+1).padStart(2,'0')}</small><span>${esc(p.name)}</span><b aria-hidden="true">↗</b></button>`).join('')}</div>
 <div class="k-spot">${real.map((p,i)=>`<div ${i?'hidden':''}>${shortCard(p)}</div>`).join('')}</div></div></section>
 <section id="studio-preview" class="journey-section k-studio"><div class="journey-heading"><div><span class="eyebrow">03 / MOTION STUDIO</span><h2>Motion studies.</h2></div><a href="${studioUrl()}">Explore all demos ↗</a></div>
 ${serviceShelf()}<div class="k-console"><div class="k-frames" aria-hidden="true">${['I','II','III','IV'].map((s,i)=>`<i style="--step:${i}">${s}</i>`).join('')}</div>
 <div class="k-controls"><label for="k-tempo">Stagger</label><output for="k-tempo">80 ms</output><input id="k-tempo" type="range" min="0" max="160" step="10" value="80"><button type="button" id="k-play">Replay sequence ↗</button></div></div>
 <div class="journey-grid journey-three">${picks.map(shortCard).join('')}</div></section>
 <section id="services" class="journey-section">${skillIndex()}<span class="eyebrow">04 / CAPABILITIES</span><h2>What needs to work better?</h2><div class="journey-services">${[['Websites & systems','Responsive websites, internal tools, and API integrations.','sera-goods-commerce-demo'],['Data & automation','Reconciliation, reporting, spreadsheets, and recurring workflows.','operations-decision-workbench'],['Research support','Method review, data preparation, and understandable results.','research-practice-toolkit'],['Identity & presentations','Visual identities and clear, purposeful presentation systems.','morph-presentation-studio']].map(([name,copy,slug])=>`<a href="${projectHref(slug)}"><h3>${name} ↗</h3><p>${copy}</p><span>Explore an example</span></a>`).join('')}</div><p class="journey-note">Share the context → Agree the scope → Build & review → Hand over.</p></section><section id="profile" class="journey-section journey-profile"><span class="eyebrow">KEVIN / PROFILE</span><h2>Kevin Simatupang.</h2><p>I bring web development and operational data together to make complicated work easier to use. Based in Balikpapan, with a degree in Informatics Engineering and experience in IT support and asset workflows.</p><a href="${homeHref('resume')}">Experience & CV ↗</a></section><section id="connect" class="journey-section journey-contact"><span class="eyebrow">05 / START A CONVERSATION</span><h2>Tell me what<br>you have in mind.</h2><a class="solid-button" href="${projectHref('project-brief-scope-builder')}">Discuss your project ↗</a><div id="contact-links" class="connect-actions"></div></section>`;
 const spotlight = document.querySelector('.k-spot');
 const buttons = [...document.querySelectorAll('[data-project-index]')];
 buttons.forEach((button, index) => button.onclick = () => {
   buttons.forEach((item, i) => {
     item.setAttribute('aria-pressed', String(index === i));
     spotlight.children[i].hidden = index !== i;
   });
 });
 const tempo = document.querySelector('#k-tempo');
 tempo.oninput = () => {
   tempo.previousElementSibling.value = tempo.value + ' ms';
   document.querySelector('.k-frames').style.setProperty('--gap', tempo.value + 'ms');
 };
 document.querySelector('#k-play').onclick = () => {
   const frames = document.querySelector('.k-frames');
   frames.classList.remove('playing');
   void frames.offsetWidth;
   frames.classList.add('playing');
 };
 const profile = $('#profile');
 profile.querySelector('p').insertAdjacentHTML('afterend', `
   <dl class="k-dossier">
     <div><dt>Practice</dt><dd>Web engineering · Data automation</dd></div>
     <div><dt>Education</dt><dd>Informatics Engineering</dd></div>
     <div><dt>Current role</dt><dd>PT. Wulandari Bangun Laksana</dd></div>
   </dl>`);
 const email = data.settings?.email;
 if (email && /^[^\s@?&]+@[^\s@?&]+\.[^\s@?&]+$/.test(email)) {
   const contact = $('#connect');
   contact.insertAdjacentHTML('beforeend', `<form class="k-letter">
     <label for="k-message">What are you working on?</label>
     <textarea required id="k-message" rows="3" maxlength="1800"></textarea>
     <button type="submit">Open email draft ↗</button>
   </form>`);
   contact.querySelector('form').onsubmit = event => {
     event.preventDefault();
     const message = $('#k-message').value.trim();
     if (message) location.href = 'mailto:' + email + '?subject=Portfolio&body=' + encodeURIComponent(message);
   };
 }
 const title = $('.kinetic-hero h1');
 title.onpointermove = event => {
   if (event.pointerType !== 'mouse' || reduced || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
   const rect = title.getBoundingClientRect();
   title.style.setProperty('--yaw', ((event.clientX - rect.left) / rect.width * 9 - 4.5) + 'deg');
 };
 title.onpointerleave = () => title.style.removeProperty('--yaw');
 renderContact();hydrateMedia();
};
initImmersion=function(){
 document.body.classList.add('spatial-gallery','spatial-v2','clean-ui');
 if(document.querySelector('.journey-hero')){initGalleryNavigation();hydrateStudioPreviews(document);}else{document.body.classList.remove('journey-home');previousImmersion();}
 const nav=document.querySelector('.header nav');if(nav)nav.innerHTML=[['Work',homeHref('field')],['Demo Studio',studioUrl()],['Skill',homeHref('skills')],['Services',homeHref('services')],['About',homeHref('profile')],['Contact',homeHref('connect')],['CV / PDF',homeHref('resume')]].map(([label,href])=>`<a href="${href}">${label}</a>`).join('');
 setupQuickMenu();
 if(window.INDEX_HOSTED)document.querySelectorAll('.header .identity,footer>a').forEach(a=>a.href='/');
 if(data.studioPage){document.body.classList.add('dedicated-studio');document.querySelectorAll('#home,#field,#services,#profile,#connect').forEach(e=>e.remove());const studio=$('#studio');if(studio&&!studio.dataset.intro){studio.dataset.intro='true';studio.querySelector('.gallery-section-head')?.insertAdjacentHTML('afterend',serviceShelf());studio.insertAdjacentHTML('afterbegin',`<a class="studio-return" href="/">← Kevin Simatupang / Home</a>`);}}
};
casePage=function(slug){previousCase(slug);const p=data.projects.find(x=>x.slug===slug);if(!p||p.status!=='Real Project')return;
 const page=$('.case-page'),hero=page.querySelector('.case-visual');
 const summary=document.createElement('dl');summary.className='case-facts';summary.innerHTML=[['Role','Development & interface design'],['Stack',p.technologies.slice(0,4).join(' · ')],['Scope',p.disciplines.join(' · ')]].map(([label,value])=>`<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('');page.querySelector('.case-links').after(summary);
 if(safeUrl(p.repositoryUrl))summary.insertAdjacentHTML('beforeend',`<div><dt>Timeline</dt><dd><a href="${esc(p.repositoryUrl)}/commits" target="_blank" rel="noopener">See project history ↗</a></dd></div>`);
 if(!hero)return;const image=hero.querySelector('img');if(!image)return;
 hero.classList.add('guided-gallery');
 const labels=['01 / Overview','02 / Interface detail','03 / The outcome'];
 const notes=[p.challenge,p.approach+' Detail view of the same public screenshot.',p.outcome];
 hero.insertAdjacentHTML('beforeend', '<div class="guided-controls" role="tablist" aria-label="Project walkthrough">'+labels.map((label,i)=>'<button role="tab" id="guide-tab-'+i+'" aria-controls="guide-panel-'+i+'" data-guide="'+i+'">'+label+'</button>').join('')+'</div>'+notes.map((note,i)=>'<div role="tabpanel" tabindex="0" id="guide-panel-'+i+'" aria-labelledby="guide-tab-'+i+'" class="guide-note">'+esc(note)+'</div>').join(''));
 const tabs=[...hero.querySelectorAll('[role=tab]')];
 function show(index){
   hero.dataset.view=String(index);
   tabs.forEach((tab,i)=>{
     const active=i===index;
     tab.setAttribute('aria-selected',String(active));
     tab.tabIndex=active?0:-1;
     const panel=hero.querySelector('#guide-panel-'+i);
     panel.hidden=!active;
     panel.classList.toggle('guided-caption',active);
   });
 }
 tabs.forEach((tab,i)=>{
   tab.onclick=()=>show(i);
   tab.onkeydown=e=>{
     const next={Home:0,End:2,ArrowLeft:(i+2)%3,ArrowRight:(i+1)%3}[e.key];
     if(next===undefined)return;
     e.preventDefault();show(next);tabs[next].focus();
   };
 });
 show(0);
};
Object.assign(localeDictionary,{'Quick links':'Akses cepat','Discuss a project':'Diskusikan proyek','Clear thinking.':'Pikiran jernih.','Useful things.':'Hasil yang berguna.','Full-stack developer building websites,':'Full-stack developer untuk website,','data workflows, and everyday automation.':'alur data, dan otomasi sehari-hari.','Explore real projects ↗':'Lihat proyek nyata ↗','Try the Demo Studio →':'Coba Studio Demo →','Built. Used. Open to explore.':'Dibangun. Digunakan. Bisa dijelajahi.','Try an idea.':'Coba sebuah ide.','Explore all demos ↗':'Jelajahi semua demo ↗','What needs to work better?':'Apa yang perlu dibuat lebih baik?','Interactive demos with fictional data. Each has three styles.':'Demo interaktif dengan data fiktif. Masing-masing memiliki tiga style.','Explore an example':'Lihat contoh','Experience & CV ↗':'Pengalaman & CV ↗','Tell me what':'Ceritakan apa','you have in mind.':'yang Anda pikirkan.','Discuss your project ↗':'Diskusikan proyek Anda ↗','Role':'Peran','Year':'Tahun','Duration':'Durasi','Scope':'Lingkup','See project history':'Lihat riwayat proyek'});
Object.assign(localeDictionary,{
 'Built for people.':'Dibangun untuk manusia.','Made understandable.':'Dibuat mudah dipahami.','Considered in detail.':'Diperhatikan hingga detail.',
 '01 / SELECTED REAL WORK':'01 / PILIHAN PROYEK NYATA','02 / THE DEMO STUDIO':'02 / STUDIO DEMO','03 / WORK WITH ME':'03 / BEKERJA BERSAMA','04 / THE PERSON BEHIND THE WORK':'04 / DI BALIK KARYA','05 / START A CONVERSATION':'05 / MULAI PERCAKAPAN',
 'Responsive websites, internal tools, and API integrations.':'Website responsif, alat internal, dan integrasi API.','Data & automation':'Data & otomasi','Reconciliation, reporting, spreadsheets, and recurring workflows.':'Rekonsiliasi, pelaporan, spreadsheet, dan alur kerja rutin.','Method review, data preparation, and understandable results.':'Tinjauan metode, persiapan data, dan hasil yang mudah dipahami.','Identity & presentations':'Identitas & presentasi','Visual identities and clear, purposeful presentation systems.':'Identitas visual dan sistem presentasi yang jelas dan terarah.',
 'Share the context → Agree the scope → Build & review → Hand over.':'Ceritakan konteks → Sepakati lingkup → Bangun & tinjau → Serah terima.',
 'I bring web development and operational data together to make complicated work easier to use. Based in Balikpapan, with a degree in Informatics Engineering and experience in IT support and asset workflows.':'Saya menggabungkan pengembangan web dan data operasional agar pekerjaan rumit menjadi lebih mudah. Berbasis di Balikpapan, lulusan Teknik Informatika dengan pengalaman dukungan TI dan alur kerja aset.',
 'Development & interface design':'Pengembangan & desain antarmuka','Timeline':'Linimasa','See project history ↗':'Lihat riwayat proyek ↗','01 / Overview':'01 / Gambaran umum','02 / Interface detail':'02 / Detail antarmuka','03 / The outcome':'03 / Hasilnya','← Kevin Simatupang / Home':'← Kevin Simatupang / Beranda'
});
// Anonymous, fixed-name events. Never send form values, queries or contact data.
Object.assign(localeDictionary, {
 '02 / SELECTED WORK':'02 / KARYA PILIHAN','Selected projects.':'Proyek pilihan.',
 '03 / MOTION STUDIO':'03 / STUDIO GERAK','Motion studies.':'Studi gerak.',
 'Stagger':'Jeda antargerakan','Replay sequence ↗':'Putar ulang urutan ↗',
 '04 / CAPABILITIES':'04 / KEAHLIAN','KEVIN / PROFILE':'KEVIN / PROFIL',
 'Practice':'Bidang kerja','Current role':'Tempat kerja saat ini','Education':'Pendidikan',
 'Informatics Engineering':'Teknik Informatika','Web engineering · Data automation':'Pengembangan web · Otomasi data',
 'What are you working on?':'Apa yang sedang Anda kerjakan?','Open email draft ↗':'Buka draf email ↗',
 '01 / SOURCE':'01 / SUMBER','02 / SYNC':'02 / SINKRONISASI','03 / RENDER':'03 / TAMPILAN'
});
if(window.INDEX_HOSTED&&navigator.doNotTrack!=='1'){
 let lastEvent='',lastAt=0;
 document.addEventListener('click',e=>{
  const target=e.target.closest('a,button');if(!target)return;
  const href=target.getAttribute('href')||'';
  const name=target.id==='jump-demo'?'demo_start':target.id==='resume-download'?'cv_download':target.matches('[data-demo-style-choice],[data-variant]')?'style_change':href.startsWith('/work/')?'project_open':/resume/.test(href)?'cv_open':/^(mailto:|https:\/\/wa.me)/.test(href)?'contact_click':href==='/studio'?'studio_open':null;
  if(!name)return;const project=href.startsWith('/work/')?href.split('?')[0].split('/').pop():data.projectSlug||'';
  const key=name+project;if(lastEvent===key&&Date.now()-lastAt<1000)return;lastEvent=key;lastAt=Date.now();
  const body=JSON.stringify({name,project});
  if(navigator.sendBeacon)navigator.sendBeacon('/api/events',new Blob([body],{type:'application/json'}));
  else fetch('/api/events',{method:'POST',headers:{'content-type':'application/json'},body,keepalive:true}).catch(()=>{});
 });
}

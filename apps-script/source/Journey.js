// A short public entrance; the complete working collection has its own address.
const fullStudioHome=home, previousImmersion=initImmersion, previousCase=casePage;
const studioUrl=()=>window.INDEX_HOSTED?'/studio':'#studio';
const editorialProjectNames = {
 'galilea-web-portal':'Sistem Informasi Ibadah & Jemaat',
 'galilea-digital-archive':'Sistem Arsip Digital Jemaat',
 'majelis-galilea':'Sistem Administrasi Majelis',
 'naomi-rouli':'Pesan Interaktif untuk Pasangan',
 'atlas-logistics-command-center':'Logistics Command Center',
 'digital-wedding-invitation':'Undangan Pernikahan Digital'
};
if(Array.isArray(data.projects))data.projects.forEach(project=>{if(editorialProjectNames[project.slug])project.name=editorialProjectNames[project.slug];});
function visitorGreeting(){
 const hour=new Date().getHours();
 const period=hour>=5&&hour<11?0:hour>=11&&hour<15?1:hour>=15&&hour<19?2:3;
 const lang=(document.documentElement.lang||navigator.language||'en').slice(0,2);
 const copy={en:['Good morning','Good afternoon','Good evening','Good night'],id:['Selamat pagi','Selamat siang','Selamat sore','Selamat malam'],fr:['Bonjour','Bon après-midi','Bonsoir','Bonne soirée'],es:['Buenos días','Buenas tardes','Buenas tardes','Buenas noches']};
 return (copy[lang]||copy.en)[period];
}
const originalHomeHref=homeHref;
homeHref=function(anchor='home'){if(window.INDEX_HOSTED&&['studio','lab','research','research-intake','open-lab','experiments'].includes(anchor))return '/studio'+(anchor==='studio'?'':'#'+anchor);return originalHomeHref(anchor);};
const shortCard=p=>`<a class="journey-card" href="${projectHref(p.slug)}">${visual(p)}<span>${esc(p.status)}</span><h3>${esc(p.name)} ↗</h3><p>${esc(p.summary)}</p></a>`;
const editionRoot = () => window.INDEX_HOSTED ? '' : 'https:\x2f\x2fportfolio-kevins.vercel.app';
const serviceDemos = [
 {id:'resto',title:'Daun & Bara',type:'Modern Asian dining',action:'Open the menu',note:'Choose a dish, spice level, drink, ice, and sweetness.'},
 {id:'travel',title:'Lintas Teluk',type:'Hotel + transport super app',action:'Plan the journey',note:'Compare stays and rides, follow the map, then open an e-ticket.'},
 {id:'care',title:'Ruang Rawat',type:'Professional home care',action:'Arrange a visit',note:'Choose a nurse, service, address, duration, and transparent price.'}
];
function serviceShelf(){
 return '<div class="service-shelf">'+serviceDemos.map(({id,title,action,note},i)=>`<a href="${editionRoot()}/edisi/${id}.html"><small>0${i+1} / Demo</small><strong>${title}</strong><p>${note}</p><b>${action} ↗</b></a>`).join('')+'</div>';
}
const skillGroups={
 'Languages & foundations':'JavaScript TypeScript Python Java C C++ C-Sharp Go Rust PHP Kotlin Swift Ruby HTML5 CSS3',
 'Frameworks & runtime':'React Next.js Vue.js Angular Svelte Django Flask Laravel Spring Node.js Express',
 'Data & storage':'PostgreSQL MySQL MongoDB Redis SQLite Firebase',
 'Tools & delivery':'Git Docker Linux GitHub-Actions Figma Bash'
};
function skillIndex(){
 const ids={'C++':'cpp','C-Sharp':'csharp','GitHub-Actions':'githubactions'};
 const item=name=>`<li><img loading="lazy" width="28" height="28" alt="" src="${editionRoot()}/edisi/logos/${ids[name]||name.toLowerCase().replaceAll('.','')}.svg"><span>${name.replace('C-Sharp','C#').replace('GitHub-Actions','GitHub Actions')}</span></li>`;
 return `<div id="skills" class="skill-index"><div class="skill-heading"><div><span class="eyebrow">04 / SKILL SYSTEM</span><h2>Tools in motion.</h2><p>Languages, frameworks, databases, and delivery tools are kept visible and grouped by purpose.</p></div></div><div class="skill-rails">${Object.entries(skillGroups).map(([group,names],index)=>{const content=names.split(' ').map(item).join('');return `<div class="skill-rail" style="--rail:${index}"><strong>${group}</strong><div class="skill-window"><div class="skill-track"><ul>${content}</ul><ul aria-hidden="true">${content}</ul></div></div></div>`}).join('')}</div><p class="skill-catalog"><a href="${editionRoot()}/edisi/skill.html">Explore the complete technology catalogue ↗</a></p></div>`;
}
function projectFolio(p,index,total){
 return `<a class="project-folio" href="${projectHref(p.slug)}" style="--folio:${index}" data-folio="${index}"><div class="folio-head"><span>${String(index+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</span><span>${esc(p.status)}</span></div>${visual(p)}<div class="folio-copy"><small>${esc(p.category)}</small><h3>${esc(p.name)}</h3><p>${esc(p.summary)}</p><b>View project ↗</b></div></a>`;
}
function demoEntries(){
 const projects=['wedding-invitation-demo','koma-manga-reader','operations-decision-workbench'].map(slug=>data.projects.find(p=>p.slug===slug)).filter(Boolean).map(p=>({title:p.name,type:p.category,note:p.summary,href:projectHref(p.slug),project:p}));
 return [...serviceDemos.map(d=>({...d,href:editionRoot()+'/edisi/'+d.id+'.html'})),...projects];
}
function servicePreview(id){
 if(id==='resto')return '<div class="service-preview restaurant"><span>DAUN & BARA</span><b>Chef selection</b><i>Spice · drink · table</i></div>';
 if(id==='travel')return '<div class="service-preview travel"><span>BPN → NUSANTARA</span><b>01 h 28 min</b><i>Hotel · driver · e-ticket</i></div>';
 return '<div class="service-preview care"><span>HOME VISIT</span><b>Nurse Maya</b><i>Today · 90 min · verified</i></div>';
}
function demoPanel(entry,index){
 const preview=entry.project?visual(entry.project):servicePreview(entry.id);
 return `<article class="demo-panel" role="tabpanel" tabindex="0" id="demo-panel-${index}" aria-labelledby="demo-tab-${index}" ${index?'hidden':''}><a href="${entry.href}">${preview}<div class="demo-panel-copy"><span>${esc(entry.type)}</span><h3>${esc(entry.title)}</h3><p>${esc(entry.note)}</p><b>${esc(entry.action||'Open working demo')} ↗</b></div></a></article>`;
}
home=function(){
 if(data.studioPage||(!window.INDEX_HOSTED&&location.hash==='#studio')){fullStudioHome();return;}
 document.body.classList.add('journey-home');
 const real=data.projects.filter(p=>p.status==='Real Project');
 const plates = real.filter(p => ['galilea-web-portal','galilea-digital-archive','majelis-galilea','naomi-rouli'].includes(p.slug));
 const showcaseSlugs=['atlas-logistics-command-center','digital-wedding-invitation','galilea-web-portal','galilea-digital-archive','majelis-galilea','naomi-rouli'];
 const showcase=showcaseSlugs.map(slug=>data.projects.find(p=>p.slug===slug)).filter(Boolean);
 const demos=demoEntries();
 $('#main').innerHTML=`
 <section class="journey-hero kinetic-hero" id="home">
   <div class="k-meta"><span>KS / BALIKPAPAN</span><span>Portfolio / Selected works</span></div>
   <p class="visitor-greeting">${visitorGreeting()}</p>
   <h1><span>Kevin</span> <em>Simatupang.</em></h1>
   <div class="k-intro"><p>Full-stack developer building websites,<br>data workflows, and everyday automation.</p>
   <div class="journey-actions"><a class="solid-button" href="${homeHref('field')}">Explore real projects ↗</a><a href="${homeHref('connect')}">Discuss a project</a><a href="${homeHref('resume')}">CV / PDF ↗</a></div></div>
   ${plates.length ? `<figure class="portfolio-cover orbital">
     <div class="orbit-stage"><i class="orbit-line" aria-hidden="true"></i><a class="orbit-plate" href="${projectHref(plates[0].slug)}"><img src="${editionRoot()}/project-shots/${plates[0].slug}.webp" fetchpriority="high" width="1100" height="720" alt="${esc(plates[0].name)}"></a></div>
     <figcaption><span aria-live="polite"><small>01 / ${String(plates.length).padStart(2,'0')}</small><strong>${esc(plates[0].name)}</strong></span>${plates.length>1?'<div><button type="button" aria-label="Previous project">←</button><button type="button" aria-label="Next project">→</button></div>':''}</figcaption>
   </figure>` : ''}
 </section>
 <section id="field" class="journey-section k-work"><div class="journey-heading"><div><span class="eyebrow">02 / SELECTED WORK</span><h2>A moving folio.</h2><p>Six selected projects, layered like an editorial deck rather than compressed into a crowded grid.</p></div></div>
 <div class="project-folio-stack">${showcase.map((p,i)=>projectFolio(p,i,showcase.length)).join('')}</div></section>
 <section id="studio-preview" class="journey-section k-studio"><div class="journey-heading"><div><span class="eyebrow">03 / INTERACTIVE DEMOS</span><h2>One stage.<br>Many systems.</h2><p>Choose a working experience. The stage changes laterally, deliberately different from the layered project folio.</p></div><a href="${studioUrl()}">Explore all demos ↗</a></div>
 <div class="demo-theatre"><div class="demo-tabs" role="tablist" aria-label="Interactive demo selection">${demos.map((entry,i)=>`<button role="tab" type="button" id="demo-tab-${i}" aria-controls="demo-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-demo-index="${i}"><span>${String(i+1).padStart(2,'0')}</span><b>${esc(entry.title)}</b><small>${esc(entry.type)}</small></button>`).join('')}</div><div class="demo-stage">${demos.map(demoPanel).join('')}<div class="demo-stage-controls"><button type="button" id="demo-prev" aria-label="Previous demo">←</button><span id="demo-count" aria-live="polite">01 / ${String(demos.length).padStart(2,'0')}</span><button type="button" id="demo-next" aria-label="Next demo">→</button></div></div></div></section>
 <section id="services" class="journey-section">${skillIndex()}<span class="eyebrow">04 / CAPABILITIES</span><h2>What needs to work better?</h2><div class="journey-services">${[['Websites & systems','Responsive websites, internal tools, and API integrations.','sera-goods-commerce-demo'],['Data & automation','Reconciliation, reporting, spreadsheets, and recurring workflows.','operations-decision-workbench'],['Research support','Method review, data preparation, and understandable results.','research-practice-toolkit'],['Identity & presentations','Visual identities and clear, purposeful presentation systems.','morph-presentation-studio']].map(([name,copy,slug])=>`<a href="${projectHref(slug)}"><h3>${name} ↗</h3><p>${copy}</p><span>Explore an example</span></a>`).join('')}</div><p class="journey-note">Share the context → Agree the scope → Build & review → Hand over.</p></section><section id="profile" class="journey-section journey-profile"><span class="eyebrow">KEVIN / PROFILE</span><h2>Kevin Simatupang.</h2><p>I bring web development and operational data together to make complicated work easier to use. Based in Balikpapan, with a degree in Informatics Engineering and experience in IT support and asset workflows.</p><a href="${homeHref('resume')}">Experience & CV ↗</a></section><section id="connect" class="journey-section journey-contact"><span class="eyebrow">05 / START A CONVERSATION</span><h2>Tell me what<br>you have in mind.</h2><a class="solid-button" href="${projectHref('project-brief-scope-builder')}">Discuss your project ↗</a><div id="contact-links" class="connect-actions"></div></section>`;
 const motionReduced=()=>reduced||matchMedia('(prefers-reduced-motion: reduce)').matches;
 const folioStack=document.querySelector('.project-folio-stack');
 folioStack.onpointermove=event=>{
   if(event.pointerType!=='mouse'||motionReduced()||!matchMedia('(hover:hover)').matches)return;
   const box=folioStack.getBoundingClientRect();
   folioStack.style.setProperty('--folio-x',((event.clientX-box.left)/box.width-.5)*9+'deg');
   folioStack.style.setProperty('--folio-y',(.5-(event.clientY-box.top)/box.height)*6+'deg');
 };
 folioStack.onpointerleave=()=>{folioStack.style.removeProperty('--folio-x');folioStack.style.removeProperty('--folio-y');};
 const demoTabs=[...document.querySelectorAll('[data-demo-index]')];
 const demoPanels=[...document.querySelectorAll('.demo-panel')];
 const demoTheatre=document.querySelector('.demo-theatre');
 let activeDemo=0,demoTimer,demoPaused=motionReduced(),touchStart=0;
 const stopDemoTimer=()=>{clearTimeout(demoTimer);demoTimer=0;};
 const scheduleDemo=()=>{stopDemoTimer();if(!demoPaused)demoTimer=setTimeout(()=>{showDemo(activeDemo+1);scheduleDemo();},4800);};
 function showDemo(index,focus=false){
   activeDemo=(index+demos.length)%demos.length;
   demoTabs.forEach((tab,i)=>{const active=i===activeDemo;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus();});
   demoPanels.forEach((panel,i)=>panel.hidden=i!==activeDemo);
   document.querySelector('#demo-count').textContent=String(activeDemo+1).padStart(2,'0')+' / '+String(demos.length).padStart(2,'0');
 }
 demoTabs.forEach((tab,index)=>{
   tab.onclick=()=>{showDemo(index);scheduleDemo();};
   tab.onkeydown=event=>{const next={ArrowLeft:activeDemo-1,ArrowUp:activeDemo-1,ArrowRight:activeDemo+1,ArrowDown:activeDemo+1,Home:0,End:demos.length-1}[event.key];if(next===undefined)return;event.preventDefault();showDemo(next,true);scheduleDemo();};
 });
 document.querySelector('#demo-prev').onclick=()=>{showDemo(activeDemo-1);scheduleDemo();};
 document.querySelector('#demo-next').onclick=()=>{showDemo(activeDemo+1);scheduleDemo();};
 demoTheatre.onpointerdown=event=>{if(event.pointerType!=='mouse')touchStart=event.clientX;};
 demoTheatre.onpointerup=event=>{if(!touchStart)return;const distance=event.clientX-touchStart;touchStart=0;if(Math.abs(distance)>45){showDemo(activeDemo+(distance<0?1:-1));scheduleDemo();}};
 if(!demoPaused) scheduleDemo();
 const profile = $('#profile');
 profile.querySelector('p').insertAdjacentHTML('afterend', `
   <dl class="k-dossier">
     <div><dt>Practice</dt><dd>Web engineering · Data automation</dd></div>
     <div><dt>Education</dt><dd>Informatics Engineering</dd></div>
     <div><dt>Current role</dt><dd>PT Wulandari Bangun Laksana Tbk</dd></div>
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
 const stage = document.querySelector('.orbit-stage');
 if (stage) {
   const frame = stage.querySelector('a');
   const image = frame.querySelector('img');
   const caption = stage.nextElementSibling;
   let current = 0;
   caption.querySelectorAll('button').forEach((button, direction) => {
     button.onclick = () => {
       current = (current + (direction ? 1 : -1) + plates.length) % plates.length;
       const project = plates[current];
       frame.href = projectHref(project.slug);
       image.src = editionRoot()+'/project-shots/'+project.slug+'.webp';
       image.alt = project.name;
       caption.querySelector('strong').textContent = project.name;
       caption.querySelector('small').textContent = String(current+1).padStart(2,'0')+' / '+String(plates.length).padStart(2,'0');
       if (!reduced && !matchMedia('(prefers-reduced-motion: reduce)').matches)
         image.animate?.([{opacity:.55,transform:'translateX(8px)'},{opacity:1,transform:'none'}],{duration:300});
     };
   });
   stage.onpointermove = event => {
     if (event.pointerType !== 'mouse' || reduced || !matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches) return;
     const box = stage.getBoundingClientRect();
     stage.style.setProperty('--pitch',(0.5-(event.clientY-box.top)/box.height)*12+'deg');
     stage.style.setProperty('--turn',((event.clientX-box.left)/box.width-0.5)*18+'deg');
   };
   stage.onpointerleave = () => {stage.style.removeProperty('--pitch');stage.style.removeProperty('--turn');};
 }
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
Object.assign(localeDictionary, {
 'A moving folio.':'Folio yang bergerak.','Six selected projects, layered like an editorial deck rather than compressed into a crowded grid.':'Enam proyek pilihan, disusun seperti dek editorial tanpa dipadatkan menjadi grid yang sesak.',
 '03 / INTERACTIVE DEMOS':'03 / DEMO INTERAKTIF','One stage.':'Satu panggung.','Many systems.':'Banyak sistem.','Choose a working experience. The stage changes laterally, deliberately different from the layered project folio.':'Pilih pengalaman yang dapat digunakan. Panggung bergerak menyamping, berbeda dari lapisan folio proyek.',
 'Previous demo':'Demo sebelumnya','Next demo':'Demo berikutnya',
 '04 / SKILL SYSTEM':'04 / SISTEM KEAHLIAN','Tools in motion.':'Peralatan yang bergerak.','Languages, frameworks, databases, and delivery tools are kept visible and grouped by purpose.':'Bahasa, framework, database, dan alat delivery selalu terlihat dan dikelompokkan berdasarkan fungsi.',
 'Languages & foundations':'Bahasa & fondasi','Frameworks & runtime':'Framework & runtime','Data & storage':'Data & penyimpanan','Tools & delivery':'Peralatan & delivery','Explore the complete technology catalogue ↗':'Jelajahi seluruh katalog teknologi ↗'
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

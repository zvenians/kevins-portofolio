// Public template registry. Routes remain stable; artwork is an honest layout preview.
const galleryTemplates=[
 {
  "id": "web-manga",
  "category": "Websites",
  "name": "KOMA / Manga reader",
  "note": "An immersive comic reading room with dimensional page turns, adaptive spreads, chapter navigation, and bookmarks.",
  "slug": "koma-manga-reader",
  "kind": "manga"
 },
 {
  "id": "classic",
  "category": "Websites",
  "name": "The Vow / Wedding invitation",
  "note": "A responsive digital wedding invitation with a live design editor, event details, a fictional story, and RSVP simulation.",
  "slug": "wedding-invitation-demo",
  "kind": "classic"
 },
 {
  "id": "attendance",
  "category": "Websites",
  "name": "Presence / Attendance",
  "note": "A working attendance desk with check-in, check-out, status filters, and CSV export. Three styles, one fictional team.",
  "slug": "presence-attendance-demo",
  "kind": "attendance"
 },
 {
  "id": "web-commerce",
  "category": "Websites",
  "name": "SERA / Product studio",
  "note": "A detailed storefront demonstration with product discovery, variants, stock-aware cart logic, vouchers, shipping choices, and a clear checkout review.",
  "slug": "sera-goods-commerce-demo",
  "kind": "commerce"
 },
 {
  "id": "web-booking",
  "category": "Websites",
  "name": "Ruang / Service desk",
  "note": "A local-service booking demo that helps customers choose a service, pick a time, and send one clear booking summary.",
  "slug": "ruang-temu-booking-demo",
  "kind": "booking"
 },
 {
  "id": "web-archive",
  "category": "Websites",
  "name": "Archive / Document browser",
  "note": "A fictional document archive with folder navigation, search, sample previews, and a simulated upload queue.",
  "slug": "archive-browser-demo",
  "kind": "platform"
 },
 {
  "id": "corporate",
  "category": "Presentations",
  "name": "Signal / Presentation studio",
  "note": "An editable slide sequence where the same objects move between layouts\u2014an interactive study of presentation pacing.",
  "slug": "morph-presentation-studio",
  "kind": "corporate"
 },
 {
  "id": "geometric",
  "category": "Identity",
  "name": "Form / Identity studio",
  "note": "A small, functioning logo workbench: explore structure, weight, contrast, and export a vector concept.",
  "slug": "identity-mark-studio",
  "kind": "geometric"
 },
 {
  "id": "operations",
  "category": "Data & Excel",
  "name": "Decision / Procurement",
  "note": "A procurement and operations demonstration that compares vendor offers with editable weights, transparent formulas, and an exportable decision workbook.",
  "slug": "operations-decision-workbench",
  "kind": "operations"
 },
 {
  "id": "researchtools",
  "category": "Data & Excel",
  "name": "Method / Research toolkit",
  "note": "Eight local research tools for method selection, sample planning, assumption review, result tables, questionnaire structure, citations, defense practice, and revision tracking.",
  "slug": "research-practice-toolkit",
  "kind": "researchtools"
 },
 {
  "id": "fieldcompanion",
  "category": "Business tools",
  "name": "Field / Asset companion",
  "note": "An offline-first field workflow for finding an asset, recording its condition, attaching evidence, and synchronizing a reviewable observation later.",
  "slug": "asset-field-companion",
  "kind": "fieldcompanion"
 },
 {
  "id": "dataprep",
  "category": "Data & Excel",
  "name": "Data / Preparation studio",
  "note": "A hands-on preparation desk for missing codes, duplicate respondents, reverse scoring, implausible values, codebooks, and SPSS-ready working files.",
  "slug": "research-data-preparation-studio",
  "kind": "dataprep"
 },
 {
  "id": "documents",
  "category": "Business tools",
  "name": "Paper / Document automation",
  "note": "A controlled Sheets-to-document workflow for references, structured fields, draft status, PDF generation, and an archive-ready activity record.",
  "slug": "document-automation-studio",
  "kind": "documents"
 },
 {
  "id": "commerceops",
  "category": "Business tools",
  "name": "SERA / Operations",
  "note": "The back-office half of the SERA storefront: fulfilment stages, stock movements, reorder signals, return review, margin context, and a daily close.",
  "slug": "sera-commerce-operations-console",
  "kind": "commerceops"
 },
 {
  "id": "qualityroom",
  "category": "Business tools",
  "name": "Quality / Evidence room",
  "note": "A transparent release-review surface for responsive behavior, keyboard safeguards, reduced motion, semantic structure, and clearly bounded evidence.",
  "slug": "quality-evidence-room",
  "kind": "qualityroom"
 },
 {
  "id": "scopebuilder",
  "category": "Business tools",
  "name": "Brief / Scope builder",
  "note": "A practical intake tool for websites, data work, research support, and automation\u2014without guessing a price or promising an unreviewed deadline.",
  "slug": "project-brief-scope-builder",
  "kind": "scopebuilder"
 },
 {
  "id": "reconcile",
  "category": "Data & Excel",
  "name": "Ledger / Reconciliation",
  "note": "Adjust the sample inputs, inspect the result, and export your work.",
  "lab": 0,
  "kind": "lab"
 },
 {
  "id": "validate",
  "category": "Data & Excel",
  "name": "Field / Validation",
  "note": "Adjust the sample inputs, inspect the result, and export your work.",
  "lab": 1,
  "kind": "lab"
 },
 {
  "id": "budget",
  "category": "Data & Excel",
  "name": "Balance / Budget",
  "note": "Adjust the sample inputs, inspect the result, and export your work.",
  "lab": 2,
  "kind": "lab"
 },
 {
  "id": "maintenance",
  "category": "Data & Excel",
  "name": "Service / Maintenance",
  "note": "Adjust the sample inputs, inspect the result, and export your work.",
  "lab": 3,
  "kind": "lab"
 },
 {
  "id": "schedule",
  "category": "Data & Excel",
  "name": "Roster / Scheduling",
  "note": "Adjust the sample inputs, inspect the result, and export your work.",
  "lab": 4,
  "kind": "lab"
 },
 {
  "id": "cleanup",
  "category": "Data & Excel",
  "name": "Tidy / Data cleanup",
  "note": "Adjust the sample inputs, inspect the result, and export your work.",
  "lab": 5,
  "kind": "lab"
 }
];
function galleryHref(t){return t.lab!==undefined?(window.INDEX_HOSTED?'/?lab='+t.lab+'#lab':homeHref('lab')):projectHref(t.slug)+(window.INDEX_HOSTED?'?template='+t.id:'');}
function galleryStyles(t){return ({classic:['Clean','Botanical Garden','Wedding Cinema'],corporate:['Clean','Kinetic Type','Editorial Story'],geometric:['Clean','Luxury Editorial','Expressive'],platform:['Clean','Library Index','Archive Desk']})[t.kind]||demoStyleNames[t.kind]||demoStyleNames.lab;}
function galleryArt(t){if(typeof demoSnapshots!=='undefined'&&demoSnapshots[t.id])return `<div class="demo-dom-preview" data-demo-snapshot="${t.id}" aria-hidden="true"></div>`;return `<div class="world-thumbnail">${worldSvg(t.id)}</div>`;}
function initSpatialGallery(){
 document.body.classList.add('spatial-gallery');
 initGalleryNavigation();
 document.querySelector('.visitor-guide')?.remove();
 const nav=$('.header nav');if(nav&&!nav.dataset.gallery){nav.dataset.gallery='true';nav.innerHTML=[['field','Work'],['studio','Demo Studio'],['services','Services'],['profile','About'],['connect','Contact'],['resume','CV / PDF']].map(([id,label])=>`<a href="${homeHref(id)}">${label}</a>`).join('');}
 const arrival=$('.arrival');if(arrival&&!arrival.dataset.gallery){arrival.dataset.gallery='true';galleryArrival(arrival);
 $('.visitor-guide')?.remove();
 const field=$('#field');field.insertAdjacentHTML('afterend',`<section id="studio" class="gallery-studio"><div class="gallery-section-head"><div><span class="eyebrow">TRY BEFORE YOU ASK</span><h2>Different worlds.<br><i>Working ideas.</i></h2></div><p>Choose a category, open a demo, then explore its three styles. Every demo is interactive and uses fictional data.</p></div><div class="gallery-steps"><span><b>01</b> Choose a category</span><span><b>02</b> Open a demo</span><span><b>03</b> Pick a style & try it</span></div><div class="gallery-categories" aria-label="Demo categories"></div><div class="gallery-template-list"></div><p class="gallery-disclosure">Previews show the actual demo interface. Each demo starts in Clean, with two styles tailored to its context. All demo records and wedding details are fictional.</p></section>`);
 const studio=$('#studio');let active='Websites';try{active=sessionStorage.getItem('gallery-category')||active}catch{}if(!galleryTemplates.some(t=>t.category===active))active='Websites';function draw(){studio.querySelector('.gallery-categories').innerHTML=[...new Set(galleryTemplates.map(t=>t.category))].map(c=>`<button aria-pressed="${c===active}" data-gallery-category="${esc(c)}">${esc(c)}</button>`).join('');studio.querySelector('.gallery-template-list').innerHTML=galleryTemplates.filter(t=>t.category===active).map(t=>`<a class="gallery-template" href="${galleryHref(t)}" ${t.lab!==undefined?`data-gallery-lab="${t.lab}"`:''}>${galleryArt(t)}<div><span>INTERACTIVE DEMO / 3 STYLES</span><h3>${esc(t.name)} <b>↗</b></h3><p>${esc(t.note)}</p><div class="gallery-style-tags">${galleryStyles(t).map(n=>`<small>${n}</small>`).join('')}</div></div></a>`).join('');studio.querySelectorAll('[data-gallery-category]').forEach(b=>b.onclick=()=>{active=b.dataset.galleryCategory;try{sessionStorage.setItem('gallery-category',active)}catch{}draw()});hydrateStudioPreviews(studio);studio.querySelectorAll('[data-gallery-lab]').forEach(a=>a.onclick=()=>{state.lab=Number(a.dataset.galleryLab);remember();renderLab();$$('[data-lab]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.lab)===state.lab));});}draw();
 // Keep advanced tools available, but stop presenting every control on arrival.
 const main=$('#main'),services=$('#services');studio.after(services);['research','open-lab','experiments'].forEach(id=>{const el=document.getElementById(id);if(!el)return;const d=document.createElement('details');d.className='gallery-deep-dive';d.innerHTML=`<summary><span>${({lab:'Data & Excel workbench',research:'Research & SPSS support','open-lab':'Interface and architecture lab',experiments:'Additional design experiments'})[id]}</span><b>Open workspace +</b></summary>`;el.before(d);d.append(el);});
 const openTarget=()=>{const target=document.getElementById(location.hash.slice(1));const d=target?.closest('details');if(d)d.open=true;};openTarget();window.addEventListener('hashchange',openTarget);main.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const hash=a.hash;const target=hash&&document.getElementById(hash.slice(1));if(target?.closest('details'))target.closest('details').open=true;});
 }
 const demo=$('#creative-demo');if(demo&&!demo.dataset.gallery){demo.dataset.gallery='true';setupGalleryVariants(demo);}
 const labParam=new URLSearchParams(location.search).get('lab');
 if(labParam!==null&&/^[0-5]$/.test(labParam)&&$('#lab')&&!$('#lab').dataset.linkApplied){$('#lab').dataset.linkApplied='true';state.lab=Number(labParam);remember();renderLab();$('#lab').closest('details')?.setAttribute('open','');}
 const casePage=$('.case-page');if(casePage&&!casePage.dataset.journey){casePage.dataset.journey='true';const working=casePage.querySelector('.creative-case,.demo-case-copy');if(working){working.id='interactive-evidence';const links=casePage.querySelector('.case-links');links.insertAdjacentHTML('beforeend','<button class="text-link" id="jump-demo">Try the demo ↓</button>');links.after(working);casePage.querySelector('#jump-demo').onclick=()=>working.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});casePage.insertAdjacentHTML('beforeend',`<nav class="case-demo-nav" aria-label="Demo navigation"><a href="${homeHref('studio')}">← Choose another demo</a><a href="${homeHref('field')}">View real projects ↗</a></nav>`);casePage.querySelector('.back').href=homeHref('studio');casePage.querySelector('.back').textContent='← BACK TO DEMO STUDIO';}casePage.insertAdjacentHTML('beforeend',`<div class="case-contact"><h2>Have a similar problem?</h2><p>Tell me what needs to work. We can start there.</p><a class="text-link" href="${homeHref('connect')}">Discuss a project ↗</a></div>`);}
}
function initGalleryNavigation(){
 const header=document.querySelector('.header'),nav=header?.querySelector('nav');if(!nav||header.querySelector('#gallery-menu'))return;
 nav.id='primary-navigation';const button=document.createElement('button');button.id='gallery-menu';button.type='button';button.textContent='Menu +';button.setAttribute('aria-controls',nav.id);button.setAttribute('aria-expanded','false');header.insertBefore(button,nav);
 const close=()=>{header.classList.remove('menu-open');button.setAttribute('aria-expanded','false');button.textContent='Menu +';};
 button.onclick=()=>{const open=button.getAttribute('aria-expanded')!=='true';header.classList.toggle('menu-open',open);button.setAttribute('aria-expanded',String(open));button.textContent=open?'Close −':'Menu +';};
 header.addEventListener('keydown',e=>{if(e.key==='Escape'){close();button.focus();}});nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});
}
function setupGalleryVariants(root){
 if(root.dataset.worldStudio)return;
 const kind=root.dataset.demo,category=({wedding:'Invitations',morphslides:'Presentations',logostudio:'Identity'})[kind];if(!category)return;
 const options=galleryTemplates.filter(t=>t.category===category);let selected=options.find(t=>t.id===new URLSearchParams(location.search).get('template'))||options[0];
 root.insertAdjacentHTML('afterbegin',`<div class="variant-picker"><span>CHOOSE A DESIGN DIRECTION</span><div>${options.map(t=>`<button data-variant="${t.id}">${esc(t.name)}</button>`).join('')}</div><p class="variant-description"></p></div>`);
 const apply=t=>{selected=t;root.dataset.variant=t.id;root.querySelectorAll('[data-variant]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.variant===t.id));root.querySelector('.variant-description').textContent=t.note;if(window.INDEX_HOSTED){const u=new URL(location.href);u.searchParams.set('template',t.id);history.replaceState(null,'',u);}if(kind==='wedding'){const tone=$('#wed-tone');tone.value=t.id==='cinema'?'midnight':t.id==='botanical'?'garden':'terracotta';tone.dispatchEvent(new Event('input'));}if(kind==='logostudio'){root.querySelector(`[data-logo="${options.indexOf(t)}"]`)?.click();}};
 root.querySelectorAll('[data-variant]').forEach(b=>b.onclick=()=>apply(options.find(t=>t.id===b.dataset.variant)));
 if(kind==='morphslides'){
 const stage=root.querySelector('.morph-stage');stage.insertAdjacentHTML('beforeend','<div class="morph-chapter-art" aria-hidden="true"><span>OBSERVE</span><span>CONNECT</span><span>EXPLAIN</span></div>');
 const controls=document.createElement('div');controls.className='gallery-player';controls.innerHTML='<button data-player="prev">← Previous</button><button data-player="next">Next →</button><button data-player="replay">Replay ↺</button><button data-player="full">Fullscreen ⛶</button><span role="status"></span>';stage.after(controls);
 controls.querySelectorAll('button').forEach(b=>b.onclick=()=>{const n=Number(stage.dataset.scene),action=b.dataset.player;if(action==='full'){if(document.fullscreenElement)document.exitFullscreen();else stage.requestFullscreen?.().catch(()=>controls.querySelector('span').textContent='Fullscreen is unavailable here.');return;}if(root.querySelector('#morph-play').textContent.includes('Pause'))root.querySelector('#morph-play').click();const next=action==='prev'?(n+2)%3:action==='replay'?0:(n+1)%3;root.querySelector(`button[data-scene="${next}"]`).click();if(action==='replay')setTimeout(()=>root.querySelector('#morph-play')?.click(),250);});
 }
 if(kind==='wedding'){
 const preview=root.querySelector('.wedding-preview');preview.insertAdjacentHTML('afterbegin','<nav class="invitation-nav" aria-label="Invitation chapters"><button data-invitation-part=".wedding-hero">Invitation</button><button data-invitation-part=".wedding-details">The day</button><button data-invitation-part=".wedding-rsvp">RSVP</button></nav>');preview.querySelectorAll('[data-invitation-part]').forEach(b=>b.onclick=()=>preview.querySelector(b.dataset.invitationPart).scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'}));
 preview.querySelector('.wedding-hero').insertAdjacentHTML('beforeend','<div class="invitation-countdown" role="status"></div>');const count=()=>{const value=$('#wed-date').value,days=value?Math.max(0,Math.ceil((new Date(value+'T10:00:00+08:00').getTime()-Date.now())/86400000)):null;preview.querySelector('.invitation-countdown').textContent=days===null?'Date to be confirmed':days+' DAYS TO THE CELEBRATION';};$('#wed-date').addEventListener('input',count);count();
 preview.querySelector('.wedding-story').insertAdjacentHTML('beforeend','<div class="invitation-gallery" aria-label="Illustrative gallery"><button aria-label="View botanical composition"><i class="botanical-illustration"></i><span>01 / Botanical study</span></button><button aria-label="View typographic composition"><strong>A & B</strong><span>02 / Type study</span></button><button aria-label="View architectural composition"><i class="arch-illustration"></i><span>03 / Architectural study</span></button></div><small>Original abstract compositions, not photographs of a real couple.</small>');preview.querySelectorAll('.invitation-gallery button').forEach(b=>b.onclick=()=>{$('#preview-title').textContent='Illustrative invitation artwork';$('#preview-body').innerHTML='<div class="invitation-art-enlarged">'+b.innerHTML+'</div>';$('#preview-dialog').showModal();});
 // Internal demo anchors must not trigger the site-level router.
 preview.querySelector('.wedding-scroll').replaceWith(Object.assign(document.createElement('button'),{className:'wedding-scroll',textContent:'THE CELEBRATION ↓',onclick:()=>preview.querySelector('.wedding-details').scrollIntoView({behavior:'smooth',block:'center'})}));
 }
 if(kind==='logostudio')root.querySelector('.logo-stage').insertAdjacentHTML('beforeend','<div class="brand-applications"><div><span>STATIONERY / CONCEPT</span><strong>Considered<br>in every detail.</strong><small>IDENTITY SYSTEM / 01</small></div><div><span>POSTER / CONCEPT</span><b>Make<br>your mark.</b></div><details><summary>From draft to direction</summary><p>Illustrative starting point: an unstructured wordmark. Refined direction: a consistent symbol, spacing, and hierarchy. This is not a real client before/after.</p></details></div>');
 apply(selected);
}

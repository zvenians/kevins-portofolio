import { escapeHtml, type Content } from './content';

const pages: Record<string,string> = {
  '': 'Creative Technologist', work:'Selected Work', demos:'Demo Studio', about:'About',
  capabilities:'Capabilities', contact:'Start a Project', nova:'NOVA Creative', resume:'Resume', 'academic-support':'Academic Support', '404':'Page not found'
};

export function renderIndex(section: string, content: Content) {
  const project=section.startsWith('work/') ? content.projects.find(p=>p.slug===section.slice(5)) : null;
  const title=section==='' ? 'Kevin Simatupang — Creative Programmer' : (project?.name || pages[section] || (section.startsWith('nova/') ? 'NOVA Creative' : 'Portfolio'))+' — Kevin Simatupang';
  const summary=project?.summary || 'Explore digital products, community systems and interactive software by Kevin Simatupang.';
  const canonical='https://portfolio-kevins.vercel.app/'+section.split('/').map(encodeURIComponent).join('/');
  const image=project ? (project.slug==='digital-wedding-invitation' ? 'https://portfolio-kevins.vercel.app/project-shots/wedding-demo-live.png' : new URL(project.coverUrl || '/og?v=white-20261112',canonical).href) : 'https://portfolio-kevins.vercel.app/og?v=white-20261112';
  const social=`<meta property="og:type" content="website"><meta property="og:site_name" content="Kevin Simatupang"><meta property="og:image" content="${escapeHtml(image)}"><meta property="og:image:alt" content="${escapeHtml(title)}">${project?'':'<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'}<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(summary)}"><meta name="twitter:image" content="${escapeHtml(image)}">`;
  const data=JSON.stringify({
    section,projects:content.projects.map(({repositoryUrl:_private,...rest})=>rest),resume:content.resume ? {name:content.resume.name,uploadedAt:content.resume.uploadedAt} : null,
    email:content.settings.email || 'simatupangkevin9@gmail.com'
  }).replace(/</g,'\\u003c');
  const list=content.projects.filter(p=>section==='demos'?p.status==='Interactive Demo':p.status==='Real Project');
  const homePreview=`<section class="hero"><div class="scene" aria-hidden="true"></div><div class="hero-text"><small>CODE / CRAFT / MOTION</small><h1>Kevin<br><em>Simatupang.</em></h1><strong class="hero-role">Creative Programmer</strong><p>I design and build community platforms, booking tools and interactive web experiences.</p><div class="actions"><a class="solid" href="#work">Explore work</a><a href="/demos">Demo studio</a></div></div></section><section class="block" id="work"><div class="heading"><h2>Selected work</h2></div>${list.map(p=>`<p><a href="/work/${encodeURIComponent(p.slug)}">${escapeHtml(p.name)}</a></p>`).join('')}</section>`;
  const casePreviewImage=project && ['Real Project','Portfolio Project'].includes(project.status) ? (project.slug==='digital-wedding-invitation'?'/project-shots/wedding-demo-live.png':`/project-shots/${encodeURIComponent(project.slug)}.webp`) : null;
  const initial=project?`<article class="block study" data-case="${escapeHtml(project.slug)}"><h1>${escapeHtml(project.name)}</h1><p>${escapeHtml(summary)}</p>${casePreviewImage?`<div class="case-shot"><img src="${casePreviewImage}" alt="${escapeHtml(project.name)} project interface"></div>`:''}<p>${escapeHtml(project.implementation)}</p></article>`:
    section===''?homePreview:
    `<h1>${escapeHtml(pages[section] || (section.startsWith('nova/')?'NOVA Creative':'Portfolio'))}</h1><p>${escapeHtml(summary)}</p>${list.map(p=>`<p><a href="/work/${encodeURIComponent(p.slug)}">${escapeHtml(p.name)}</a></p>`).join('')}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f8f8f6"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(summary)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(summary)}"><meta property="og:url" content="${canonical}">${social}<link rel="stylesheet" href="/atelier/index.css"><link rel="stylesheet" href="/atelier/mobile-ui.css"><link rel="stylesheet" href="/atelier/experience.css">${section==='capabilities'?'<link rel="stylesheet" href="/edisi/devicon.css">':''}${section==='academic-support'?'<link rel="stylesheet" href="/atelier/academic.css">':''}<script defer src="/vendor/motion.min.js"></script><script defer src="/vendor/gsap.min.js"></script><script defer src="/vendor/ScrollTrigger.min.js"></script><script type="module" src="/atelier/index.js"></script></head><body><a class="skip" href="#content">Skip to content</a><header id="bar"><a href="/">Kevin Simatupang</a><nav><a href="/work">Work</a> <a href="/demos">Demo studio</a> <a href="/contact">Contact</a></nav></header><main id="content" tabindex="-1">${initial}</main><footer id="foot"></footer><dialog id="panel"></dialog><script id="payload" type="application/json">${data}</script></body></html>`;
}

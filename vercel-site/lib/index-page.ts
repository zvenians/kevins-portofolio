import { escapeHtml, type Content } from './content';

const pages: Record<string,string> = {
  '': 'Creative Technologist', work:'Selected Work', demos:'Demo Studio', about:'About',
  capabilities:'Capabilities', contact:'Start a Project', nova:'NOVA Creative'
};

export function renderIndex(section: string, content: Content) {
  const project=section.startsWith('work/') ? content.projects.find(p=>p.slug===section.slice(5)) : null;
  const title=(project?.name || pages[section] || 'Portfolio')+' — Kevin Simatupang';
  const summary=project?.summary || 'Explore digital products, community systems and interactive software by Kevin Simatupang.';
  const canonical='https://portfolio-kevins.vercel.app/'+section.split('/').map(encodeURIComponent).join('/');
  const data=JSON.stringify({
    section,projects:content.projects.map(({repositoryUrl:_private,...rest})=>rest),
    email:content.settings.email || 'simatupangkevin9@gmail.com'
  }).replace(/</g,'\\u003c');
  const list=content.projects.filter(p=>section==='demos'?p.status==='Interactive Demo':p.status==='Real Project');
  const initial=project?`<article><h1>${escapeHtml(project.name)}</h1><p>${escapeHtml(summary)}</p><p>${escapeHtml(project.implementation)}</p></article>`:
    `<h1>${escapeHtml(section?pages[section]:'Kevin Simatupang')}</h1><p>${escapeHtml(summary)}</p>${list.map(p=>`<p><a href="/work/${encodeURIComponent(p.slug)}">${escapeHtml(p.name)}</a></p>`).join('')}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#10110f"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(summary)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(summary)}"><meta property="og:url" content="${canonical}"><link rel="stylesheet" href="/atelier/index.css"><link rel="stylesheet" href="/atelier/mobile-ui.css">${section==='capabilities'?'<link rel="stylesheet" href="/edisi/devicon.css">':''}<script type="module" src="/atelier/index.js"></script></head><body><a class="skip" href="#content">Skip to content</a><header id="bar"><a href="/">Kevin Simatupang</a><nav><a href="/work">Work</a> <a href="/demos">Demo studio</a> <a href="/contact">Contact</a></nav></header><main id="content" tabindex="-1">${initial}</main><footer id="foot"></footer><dialog id="panel"></dialog><script id="payload" type="application/json">${data}</script></body></html>`;
}

import { NextRequest } from 'next/server';
import { publicContent, GAS_URL, escapeHtml } from '../../lib/content';
import { template } from '../../generated/template';

export const runtime = 'nodejs';

export async function GET(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await context.params;
  if (path.length === 2 && path[0] === 'projects') return new Response(null, { status: 308, headers: { location: `/work/${encodeURIComponent(path[1])}` } });
  const studioPage = path.length === 1 && path[0] === 'studio';
  if (!studioPage && path.length && (path.length !== 2 || path[0] !== 'work')) return new Response('Not found', { status: 404 });
  const content = await publicContent();
  const project = !studioPage && path.length ? content.projects.find(p => p.slug === path[1]) : null;
  if (!studioPage && path.length && !project) return new Response('Exhibit not found', { status: 404 });
  const title = studioPage ? 'Demo Studio — Kevin Simatupang' : project ? `${project.name} — Kevin Simatupang` : 'Kevin Simatupang — The Living Index';
  const description = studioPage ? 'Explore 22 interactive demos across websites, data, business tools, identity and presentations. Three styles for each working idea.' : project?.summary || 'Kevin Simatupang is a full-stack developer in Balikpapan working across web systems, operational data, workflow automation, and interface design.';
  const canonical = new URL(request.nextUrl.pathname, 'https://portfolio-kevins.vercel.app').toString();
  const previewIds: Record<string,string> = { manga:'web-manga',wedding:'classic',attendance:'attendance',commerce:'web-commerce',booking:'web-booking',archive:'web-archive',morphslides:'corporate',logostudio:'geometric',operations:'operations',researchtools:'researchtools',dataprep:'dataprep',fieldcompanion:'fieldcompanion',documents:'documents',commerceops:'commerceops',qualityroom:'qualityroom',scopebuilder:'scopebuilder' };
  const screenshot = project?.status === 'Real Project' && ['galilea-web-portal','galilea-digital-archive','majelis-galilea','naomi-rouli'].includes(project.slug) ? '/project-shots/'+project.slug+'.webp' : project?.status === 'Interactive Demo' && previewIds[project.visual] ? '/demo-shots/'+previewIds[project.visual]+'.webp' : '/og';
  const socialImage = new URL(screenshot, 'https://portfolio-kevins.vercel.app');
  socialImage.searchParams.set('title', project?.name || 'Kevin Simatupang');
  socialImage.searchParams.set('label', project ? `${project.status} / ${project.category}` : 'WEB SYSTEMS / OPERATIONAL DATA / INTERFACE DESIGN');
  const bootstrap = JSON.stringify({ ...content, appUrl: GAS_URL, admin: false, projectSlug: project?.slug || '', studioPage })
    .replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const preview = project ? `<article><h1>${escapeHtml(project.name)}</h1><p>${escapeHtml(description)}</p><p>${escapeHtml(project.challenge)}</p><p>${escapeHtml(project.approach)}</p><p>${escapeHtml(project.implementation)}</p><p>${escapeHtml(project.outcome)}</p></article>`
    : `<section><h1>Kevin Simatupang</h1><p>Full-stack developer working across web systems, operational data, automation, and interface design in Balikpapan, Indonesia.</p><h2>Selected real work</h2>${content.projects.filter(p => p.status === 'Real Project').map(p => `<article><h3><a href="/work/${encodeURIComponent(p.slug)}">${escapeHtml(p.name)}</a></h3><p>${escapeHtml(p.summary)}</p></article>`).join('')}</section>`;
  const structuredData = project ? { '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.name, headline: project.title, description, url: canonical, creator: { '@type': 'Person', name: 'Kevin Simatupang', url: 'https://portfolio-kevins.vercel.app/' }, keywords: [...(project.disciplines || []), ...(project.technologies || [])].join(', '), sameAs: [project.repositoryUrl, project.liveUrl].filter(Boolean) } : { '@context': 'https://schema.org', '@type': 'Person', name: 'Kevin Simatupang', jobTitle: 'Full-stack developer', address: { '@type': 'PostalAddress', addressLocality: 'Balikpapan', addressRegion: 'East Kalimantan', addressCountry: 'ID' }, url: canonical, sameAs: ['https://github.com/zvenians'] };
  const metadata = `<meta name="description" content="${escapeHtml(description)}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:type" content="${project ? 'article' : 'profile'}"><meta property="og:image" content="${escapeHtml(socialImage.toString())}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${escapeHtml(socialImage.toString())}"><link rel="canonical" href="${escapeHtml(canonical)}"><script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`;
  const html = template.replace('<title>Kevin Simatupang — The Living Index</title>', `<title>${escapeHtml(title)}</title>${metadata}`)
    .replace('<main id="main"></main>', `<main id="main">${preview}</main>`)
    .replace('/*BOOTSTRAP*/', `window.INDEX_HOSTED=true;window.INDEX_BOOTSTRAP=${bootstrap};`);
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300', 'x-content-type-options': 'nosniff' } });
}

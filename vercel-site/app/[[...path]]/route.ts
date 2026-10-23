import { NextRequest } from 'next/server';
import { publicContent, GAS_URL, escapeHtml } from '../../lib/content';
import { template } from '../../generated/template';

export const runtime = 'nodejs';

export async function GET(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await context.params;
  if (path.length && (path.length !== 2 || path[0] !== 'projects')) return new Response('Not found', { status: 404 });
  const content = await publicContent();
  const project = path.length ? content.projects.find(p => p.slug === path[1]) : null;
  if (path.length && !project) return new Response('Exhibit not found', { status: 404 });
  const title = project ? `${project.name} — Kevin Simatupang` : 'Kevin Simatupang — The Living Index';
  const description = project?.summary || 'An evolving collection of web systems, data tools, and considered digital experiences.';
  const canonical = new URL(request.nextUrl.pathname, 'https://portfolio-kevins.vercel.app').toString();
  const bootstrap = JSON.stringify({ ...content, appUrl: GAS_URL, admin: false, projectSlug: project?.slug || '' })
    .replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const preview = project ? `<article><h1>${escapeHtml(project.name)}</h1><p>${escapeHtml(description)}</p><p>${escapeHtml(project.challenge)}</p><p>${escapeHtml(project.approach)}</p><p>${escapeHtml(project.implementation)}</p><p>${escapeHtml(project.outcome)}</p></article>`
    : `<section><h1>Kevin Simatupang</h1><p>Developer, systems, design, and data — Balikpapan, Indonesia.</p><h2>Selected work</h2>${content.projects.map(p => `<article><h3><a href="/projects/${encodeURIComponent(p.slug)}">${escapeHtml(p.name)}</a></h3><p>${escapeHtml(p.summary)}</p></article>`).join('')}</section>`;
  const metadata = `<meta name="description" content="${escapeHtml(description)}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:type" content="${project ? 'article' : 'website'}"><link rel="canonical" href="${escapeHtml(canonical)}">`;
  const html = template.replace('<title>Kevin Simatupang — The Living Index</title>', `<title>${escapeHtml(title)}</title>${metadata}`)
    .replace('<main id="main"></main>', `<main id="main">${preview}</main>`)
    .replace('/*BOOTSTRAP*/', `window.INDEX_HOSTED=true;window.INDEX_BOOTSTRAP=${bootstrap};`);
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300', 'x-content-type-options': 'nosniff' } });
}

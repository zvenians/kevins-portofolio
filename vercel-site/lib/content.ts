import fallback from '../generated/fallback.json';

export const GAS_URL = 'https://script.google.com/macros/s/AKfycbzEszzwReW4V9uZCKTPvh6XEEAZzy1T-0L_JxliPaFDtliuIzO99PUx0qP-ufcXCO442w/exec';
export type Project = { slug: string; name: string; title: string; summary: string; category: string; status: string; visibility: string; technologies: string[]; disciplines: string[]; evidence: string[]; visual: string; challenge: string; approach: string; implementation: string; outcome: string; tradeoff: string; featured?: boolean; order?: number; repositoryUrl?: string; liveUrl?: string; coverUrl?: string; mediaId?: string; revision?: string };
export type Content = { projects: Project[]; resume: null | { name: string; uploadedAt: string }; settings: Record<string, string>; version?: string; contentSource?: 'live' | 'snapshot' };

// Browser-local exhibits ship with the frontend even if the owner Sheet has
// not been synchronized yet. A published owner record of the same slug wins.

function withBundledProjects(content: Content): Content {
  const fallbackProjects = (fallback as Content).projects;
  const fallbackBySlug = new Map(fallbackProjects.map(project => [project.slug, project]));
  const remoteProjects = content.projects.filter(p => p.visibility === 'public').map(project => ({ ...fallbackBySlug.get(project.slug), ...project } as Project));
  const remoteSlugs = new Set(remoteProjects.map(p => p.slug));
  const bundledProjects = fallbackProjects.filter(
    p => p.visibility === 'public' && p.status === 'Interactive Demo' && !remoteSlugs.has(p.slug)
  );
  return { ...content, projects: [...remoteProjects, ...bundledProjects].map(p => p.status === 'Interactive Demo' && ['wedding','manga','attendance','booking','commerce','archive'].includes(p.visual) ? { ...p, category: 'Websites' } : p).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)) };
}

let cached: Content | null = null;
let expiresAt = 0;
let pending: Promise<Content> | null = null;

export async function publicContent(): Promise<Content> {
  if (cached && Date.now() < expiresAt) return cached;
  if (pending) return pending;
  pending = refreshContent().finally(() => { pending = null; });
  return pending;
}

async function refreshContent(): Promise<Content> {
  try {
    const response = await fetch(GAS_URL + '?format=json', { next: { revalidate: 60 }, signal: AbortSignal.timeout(3000) });
    if (!response.ok) throw new Error('Content service unavailable');
    const content = await response.json() as Content;
    if (!Array.isArray(content.projects) || !content.projects.every(p => p && typeof p.slug === 'string' && typeof p.name === 'string') || !content.settings || typeof content.settings !== 'object') throw new Error('Invalid content response');
    cached = { ...withBundledProjects(content), contentSource: 'live' };
    expiresAt = Date.now() + 60000;
    return cached;
  } catch {
    console.warn('Content service unavailable; serving cached or bundled public content.');
    cached = { ...(cached || fallback as Content), contentSource: 'snapshot' };
    expiresAt = Date.now() + 15000;
    return cached;
  }
}

export function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}

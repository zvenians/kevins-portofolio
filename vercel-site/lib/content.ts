import fallback from '../generated/fallback.json';

export const GAS_URL = 'https://script.google.com/macros/s/AKfycbzEszzwReW4V9uZCKTPvh6XEEAZzy1T-0L_JxliPaFDtliuIzO99PUx0qP-ufcXCO442w/exec';
export type Project = { slug: string; name: string; title: string; summary: string; category: string; status: string; visibility: string; technologies: string[]; disciplines: string[]; evidence: string[]; visual: string; challenge: string; approach: string; implementation: string; outcome: string; tradeoff: string; featured?: boolean; order?: number; repositoryUrl?: string; liveUrl?: string; coverUrl?: string; mediaId?: string; revision?: string };
export type Content = { projects: Project[]; resume: null | { name: string; uploadedAt: string }; settings: Record<string, string>; version?: string };

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
  return { ...content, projects: [...remoteProjects, ...bundledProjects].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)) };
}

export async function publicContent(): Promise<Content> {
  try {
    const response = await fetch(GAS_URL + '?format=json', { next: { revalidate: 60 }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('Content service unavailable');
    const content = await response.json() as Content;
    if (!Array.isArray(content.projects)) throw new Error('Invalid content response');
    return withBundledProjects(content);
  } catch (error) {
    console.error('Using last published project snapshot:', error);
    return fallback as Content;
  }
}

export function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}

import fallback from '../generated/fallback.json';

export const GAS_URL = 'https://script.google.com/macros/s/AKfycbzEszzwReW4V9uZCKTPvh6XEEAZzy1T-0L_JxliPaFDtliuIzO99PUx0qP-ufcXCO442w/exec';
export type Project = { slug: string; name: string; title: string; summary: string; category: string; status: string; visibility: string; technologies: string[]; challenge: string; approach: string; implementation: string; outcome: string; tradeoff: string; repositoryUrl?: string; liveUrl?: string };
export type Content = { projects: Project[]; resume: null | { name: string; uploadedAt: string }; settings: Record<string, string>; version?: string };

export async function publicContent(): Promise<Content> {
  try {
    const response = await fetch(GAS_URL + '?format=json', { next: { revalidate: 60 }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('Content service unavailable');
    const content = await response.json() as Content;
    if (!Array.isArray(content.projects)) throw new Error('Invalid content response');
    return { ...content, projects: content.projects.filter(p => p.visibility === 'public') };
  } catch (error) {
    console.error('Using last published project snapshot:', error);
    return fallback as Content;
  }
}

export function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}

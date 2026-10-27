import { NextRequest } from 'next/server';
import fallback from '../../../generated/fallback.json';

const names = new Set(['project_open', 'demo_start', 'style_change', 'cv_open', 'cv_download', 'contact_click', 'studio_open']);
const projects = new Set(fallback.projects.map(project => project.slug));

// Anonymous interaction counts are available in Vercel runtime logs. No cookies,
// visitor identifiers, form content, full URLs, or contact details are recorded.
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== request.nextUrl.origin) return new Response(null, { status: 403 });
  if (Number(request.headers.get('content-length') || 0) > 512) return new Response(null, { status: 413 });
  const raw = await request.text();
  if (raw.length > 512) return new Response(null, { status: 413 });
  try {
    const event = JSON.parse(raw);
    if (!names.has(event.name) || (event.project && !projects.has(event.project))) return new Response(null, { status: 400 });
    console.info(JSON.stringify({ kind: 'portfolio_interaction', name: event.name, project: event.project || undefined }));
    return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
  } catch {
    return new Response(null, { status: 400 });
  }
}

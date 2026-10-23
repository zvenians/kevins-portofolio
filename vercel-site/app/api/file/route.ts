import { NextRequest } from 'next/server';
import { GAS_URL } from '../../../lib/content';

export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type');
  const id = request.nextUrl.searchParams.get('id');
  if (type !== 'resume' && (type !== 'media' || !id || !/^[\w-]{1,80}$/.test(id))) return Response.json({ error: 'Invalid public file request' }, { status: 400 });
  const upstream = new URL(GAS_URL);
  upstream.searchParams.set('format', 'file');
  upstream.searchParams.set('type', type);
  if (type === 'media' && id) upstream.searchParams.set('id', id);
  try {
    const response = await fetch(upstream, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
    if (!response.ok) throw new Error('Unpublished file');
    const file = await response.json();
    if (!file.base64 || !['application/pdf', 'image/png', 'image/jpeg'].includes(file.mime)) throw new Error('Invalid file');
    return Response.json(file, { headers: { 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff' } });
  } catch {
    return Response.json({ error: 'Published file unavailable' }, { status: 404 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const limits = new Map<string, { count: number; resetAt: number }>();
const fields = ['type','existing','scope','audience','budget','time','name','email'] as const;
type ContactField = typeof fields[number];
type ContactBrief = Record<ContactField,string>;

function clean(value: unknown, max = 2500) {
  return typeof value === 'string' ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max) : '';
}

function invalid(brief: ContactBrief) {
  if (fields.some(field => !brief[field])) return 'Complete every field before continuing.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email) || brief.email.length > 160) return 'Enter a valid email address.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(brief.time) || Number.isNaN(Date.parse(`${brief.time}T00:00:00Z`))) return 'Choose a valid target date.';
  if (fields.some(field => brief[field].length > (field === 'scope' ? 2500 : 160))) return 'One or more fields exceed the allowed length.';
  return '';
}

function rateLimited(request: NextRequest) {
  const now = Date.now();
  const key = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  const current = limits.get(key);
  if (!current || current.resetAt <= now) {
    limits.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 8;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== request.nextUrl.origin) return NextResponse.json({ error: 'Request origin was not accepted.' }, { status: 403 });
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return NextResponse.json({ error: 'Send JSON content.' }, { status: 415 });
  if (Number(request.headers.get('content-length') || 0) > 6_000) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  if (rateLimited(request)) return NextResponse.json({ error: 'Too many attempts. Wait a minute and try again.' }, { status: 429, headers: { 'retry-after': '60' } });

  try {
    const raw = await request.text();
    if (raw.length > 6_000) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
    const parsed = JSON.parse(raw) as Record<string,unknown>;
    const brief = Object.fromEntries(fields.map(field => [field, clean(parsed[field], field === 'scope' ? 2500 : 160)])) as ContactBrief;
    const error = invalid(brief);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const recipient = process.env.CONTACT_EMAIL || 'simatupangkevin9@gmail.com';
    const subject = encodeURIComponent(`[Portfolio inquiry] ${brief.type} · ${brief.name}`);
    const body = encodeURIComponent(fields.map(field => `${field}: ${brief[field]}`).join('\n'));
    return NextResponse.json(
      { handoffUrl: `mailto:${recipient}?subject=${subject}&body=${body}`, sent: false },
      { headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } }
    );
  } catch {
    return NextResponse.json({ error: 'The request could not be prepared. Check the fields and try again.' }, { status: 400 });
  }
}

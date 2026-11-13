/**
 * Server-side inquiry delivery. No provider key, sender address, or recipient
 * address is exposed to the public Atelier JavaScript.
 *
 * Required Vercel env: RESEND_API_KEY, INQUIRY_FROM_EMAIL, INQUIRY_TO_EMAIL.
 * The client falls back to a user-initiated email draft when unconfigured.
 */
export const runtime = 'nodejs';
const fields = ['type','existing','scope','audience','budget','time','name','email'] as const;
type BriefField = typeof fields[number];
type Brief = Record<BriefField,string>;

const reply = (status: number, code: string) =>
  Response.json({ok:false,code},{status,headers:{'cache-control':'no-store'}});

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').trim().slice(0,max) : '';
}

export async function POST(request: Request): Promise<Response> {
  if (!request.headers.get('content-type')?.includes('application/json')) return reply(415,'INVALID_CONTENT_TYPE');
  const origin=request.headers.get('origin');
  if(origin) {
    try {if(new URL(origin).host !== new URL(request.url).host) return reply(403,'INVALID_ORIGIN');}
    catch {return reply(403,'INVALID_ORIGIN');}
  }
  if(Number(request.headers.get('content-length') || 0)>12_000) return reply(413,'PAYLOAD_TOO_LARGE');
  let raw: Record<string,unknown>;
  try {
    const input=await request.text();
    if(input.length>12_000) return reply(413,'PAYLOAD_TOO_LARGE');
    raw=JSON.parse(input);
    if(!raw || typeof raw !== 'object' || Array.isArray(raw)) return reply(400,'INVALID_BRIEF');
  } catch {return reply(400,'INVALID_JSON');}
  // Honeypot: deliberately pretend success without sending a message.
  if(clean(raw.website,160)) return Response.json({ok:true},{headers:{'cache-control':'no-store'}});
  const brief=Object.fromEntries(fields.map(field=>[field,clean(raw[field],field==='scope'?2500:160)])) as Brief;
  if(fields.some(field=>!brief[field])) return reply(400,'INCOMPLETE_BRIEF');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(brief.email)) return reply(400,'INVALID_EMAIL');
  const apiKey=process.env.RESEND_API_KEY;
  const from=process.env.INQUIRY_FROM_EMAIL;
  const to=process.env.INQUIRY_TO_EMAIL;
  if(!apiKey || !from || !to) return reply(503,'MAIL_NOT_CONFIGURED');
  const text=['New portfolio project inquiry','',...fields.map(field=>`${field.toUpperCase()}\n${brief[field]}`)].join('\n\n');
  try {
    const response=await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        from,to:[to],reply_to:brief.email,
        subject:`Portfolio inquiry — ${brief.type.slice(0,75)}`,
        text
      }),
      signal:AbortSignal.timeout(8500)
    });
    if(!response.ok) return reply(502,'MAIL_PROVIDER_UNAVAILABLE');
    return Response.json({ok:true},{headers:{'cache-control':'no-store'}});
  } catch {return reply(502,'MAIL_PROVIDER_UNAVAILABLE');}
}

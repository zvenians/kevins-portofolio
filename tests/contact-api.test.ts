import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../vercel-site/app/api/contact/route';

const validBrief = {
  type: 'Portfolio website', existing: 'Existing site available',
  scope: 'Improve the product flow and production readiness.', audience: 'Prospective clients',
  budget: 'Discuss after review', time: '2026-12-10', name: 'Kevin Demo', email: 'kevin@example.test'
};

let requestIndex = 1;
function request(body: unknown, origin = 'https://portfolio-kevins.vercel.app') {
  return new NextRequest(`${origin}/api/contact`, {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json', 'x-forwarded-for': `203.0.113.${requestIndex++}` },
    body: JSON.stringify(body)
  });
}

describe('contact handoff API', () => {
  it('validates the brief and prepares an honest email handoff', async () => {
    const response = await POST(request(validBrief));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.sent).toBe(false);
    expect(result.handoffUrl).toMatch(/^mailto:/);
    expect(decodeURIComponent(result.handoffUrl)).toContain('Kevin Demo');
  });

  it('rejects invalid or cross-origin submissions', async () => {
    const invalid = await POST(request({ ...validBrief, email: 'not-an-email' }));
    expect(invalid.status).toBe(400);
    const crossOrigin = new NextRequest('https://portfolio-kevins.vercel.app/api/contact', {
      method: 'POST', headers: { origin: 'https://attacker.example', 'content-type': 'application/json' }, body: JSON.stringify(validBrief)
    });
    expect((await POST(crossOrigin)).status).toBe(403);
  });
});

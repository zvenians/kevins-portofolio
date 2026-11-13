import {describe,it,expect,vi,afterEach} from 'vitest';
import {POST} from '../vercel-site/app/api/inquiry/route';

const env={key:process.env.RESEND_API_KEY,from:process.env.INQUIRY_FROM_EMAIL,to:process.env.INQUIRY_TO_EMAIL};
const brief={type:'Website',existing:'No',scope:'A user-facing booking system',audience:'Customers',budget:'Discuss',time:'2027-02-01',name:'Sample Visitor',email:'visitor@example.com'};
function request(body: unknown, origin='https://portfolio-kevins.vercel.app') {
 return new Request('https://portfolio-kevins.vercel.app/api/inquiry',{
  method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)
 });
}
afterEach(()=>{
 vi.unstubAllGlobals();
 if(env.key===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=env.key;
 if(env.from===undefined)delete process.env.INQUIRY_FROM_EMAIL;else process.env.INQUIRY_FROM_EMAIL=env.from;
 if(env.to===undefined)delete process.env.INQUIRY_TO_EMAIL;else process.env.INQUIRY_TO_EMAIL=env.to;
});
describe('portfolio inquiry API',()=>{
 it('rejects bad content and cross-origin submission',async()=>{
  expect((await POST(new Request('https://portfolio-kevins.vercel.app/api/inquiry',{method:'POST',body:'hello'}))).status).toBe(415);
  expect((await POST(request(brief,'https://unknown.example'))).status).toBe(403);
 });
 it('validates inputs before attempting delivery',async()=>{
  expect((await POST(request({...brief,email:'not-an-email'}))).status).toBe(400);
  expect((await POST(request({...brief,scope:''}))).status).toBe(400);
 });
 it('returns a helpful not-configured status without sending anything',async()=>{
  delete process.env.RESEND_API_KEY;delete process.env.INQUIRY_FROM_EMAIL;delete process.env.INQUIRY_TO_EMAIL;
  const res=await POST(request(brief));
  expect(res.status).toBe(503);
  expect((await res.json()).code).toBe('MAIL_NOT_CONFIGURED');
 });
 it('sends only from the server and sets reply-to for the visitor',async()=>{
  process.env.RESEND_API_KEY='test_token';
  process.env.INQUIRY_FROM_EMAIL='Portfolio <hello@studio.example>';
  process.env.INQUIRY_TO_EMAIL='owner@example.com';
  const mock=vi.fn().mockResolvedValue(new Response('{"id":"test"}',{status:200}));
  vi.stubGlobal('fetch',mock);
  const res=await POST(request(brief));
  expect(res.status).toBe(200);
  const [url,opts]=mock.mock.calls[0];
  expect(url).toBe('https://api.resend.com/emails');
  expect(opts.headers.Authorization).toBe('Bearer test_token');
  const payload=JSON.parse(opts.body);
  expect(payload.reply_to).toBe('visitor@example.com');
  expect(payload.to).toEqual(['owner@example.com']);
  expect(payload.text).toContain(brief.scope);
 });
});

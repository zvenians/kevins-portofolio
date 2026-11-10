import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const read=(path:string)=>readFileSync(resolve(process.cwd(),path),'utf8');
describe('demo studio discovery and route coverage',()=>{
 it('groups the full library without hiding search',()=>{const source=read('vercel-site/public/atelier/index.js');expect(source).toContain("['all','appsGroup','excelData','researchGroup','creative']");expect(source).toContain("document.querySelectorAll('[data-library]')");expect(source).not.toContain("$$('[data-library]')");expect(source).toContain("researchGroup:['researchtools']");});
 it('keeps every published interactive demo addressable',()=>{const projects=JSON.parse(read('apps-script/source/projects.json')),interactive=projects.filter((p:{status:string,visibility?:string})=>p.status==='Interactive Demo'&&p.visibility!=='draft');expect(interactive.length).toBeGreaterThanOrEqual(14);for(const p of interactive){expect(p.slug).toMatch(/^[a-z0-9-]+$/);expect(p.visual).toBeTruthy();expect(p.summary).toBeTruthy();}const route=read('vercel-site/app/[[...path]]/route.ts');expect(route).toContain("content.projects.find(p => p.slug === path[1])");});
 it('ships all flagship runtimes and assets',()=>{for(const file of ['vercel-site/public/edisi/resto.html','vercel-site/public/edisi/travel.html','vercel-site/public/edisi/care.html','vercel-site/public/edisi/daun-bara-menu.webp','vercel-site/public/edisi/lintas-teluk-hotels.webp','vercel-site/public/edisi/perawat-0.webp','vercel-site/public/edisi/perawat-1.webp','vercel-site/public/edisi/perawat-2.webp'])expect(existsSync(resolve(process.cwd(),file))).toBe(true);});
});

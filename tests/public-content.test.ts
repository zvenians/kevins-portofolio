import {test,expect,vi,afterEach} from 'vitest';
afterEach(()=>{vi.unstubAllGlobals();vi.restoreAllMocks();vi.resetModules();});
test('public content coalesces concurrent requests and validates remote content',async()=>{
 const fetchMock=vi.fn().mockResolvedValue({ok:true,json:async()=>({projects:[],settings:{},resume:null})});vi.stubGlobal('fetch',fetchMock);
 const {publicContent}=await import('../vercel-site/lib/content');
 const results=await Promise.all([publicContent(),publicContent()]);expect(fetchMock).toHaveBeenCalledTimes(1);expect(results[0].contentSource).toBe('live');expect(results[0].projects.length).toBeGreaterThan(0);await publicContent();expect(fetchMock).toHaveBeenCalledTimes(1);
});
test('malformed content falls back without breaking project routes',async()=>{
 vi.spyOn(console,'warn').mockImplementation(()=>{});vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({projects:[null],settings:{}})}));const {publicContent}=await import('../vercel-site/lib/content');const result=await publicContent();expect(result.contentSource).toBe('snapshot');expect(result.projects.every(p=>typeof p.slug==='string')).toBe(true);
});

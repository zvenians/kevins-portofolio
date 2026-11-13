const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const assert=require('node:assert/strict');
const base=process.env.FOLIO_BASE_URL || 'http://localhost:3001';
const authHeaders=process.env.VERCEL_OIDC_TOKEN?{'x-vercel-trusted-oidc-idp-token':process.env.VERCEL_OIDC_TOKEN}:{};
const output=process.env.WHITE_OUTPUT||'artifacts/white-release';
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 const report={pages:[],errors:[],performance:null};
 await fs.mkdir(output,{recursive:true});
 try {
  for(const [width,height] of [[390,844],[768,1024],[1440,900],[1920,1080]]) {
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference',extraHTTPHeaders:authHeaders});
   await context.addInitScript(()=>localStorage.setItem('atelier.visited','yes'));
   const page=await context.newPage();
   page.on('pageerror',e=>report.errors.push(String(e)));
   for(const route of ['/','/work','/demos','/capabilities','/about','/contact','/resume','/academic-support']) {
    const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});
    assert.equal(response.status(),200);
    await page.waitForTimeout(500);
    const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,background:getComputedStyle(document.documentElement).backgroundColor}));
    assert.equal(geometry.overflow,false,`${route} ${width} overflow`);
    assert.equal(geometry.background,'rgb(248, 248, 246)');
    if(route==='/'){
      assert.equal(await page.locator('.visitor-greeting').count(),1);
      assert.equal(await page.locator('.data-lab-card').count(),6);
      assert.equal(await page.locator('.project-folio .showpiece').count(),6);
      assert.equal(await page.locator('.skill-chip').count()>20,true);
      const theatreGeometry=await page.evaluate(()=>{
       const tabs=document.querySelector('#studio .demo-tabs').getBoundingClientRect();
       const stage=document.querySelector('#studio .demo-stage').getBoundingClientRect();
       const theatre=document.querySelector('#studio .demo-theatre').getBoundingClientRect();
       return {tabs:{x:tabs.x,y:tabs.y,width:tabs.width,height:tabs.height,bottom:tabs.bottom},stage:{x:stage.x,y:stage.y,width:stage.width,height:stage.height},theatreHeight:theatre.height};
      });
      if(width>=900){
       assert.ok(Math.abs(theatreGeometry.tabs.y-theatreGeometry.stage.y)<2,`desktop theatre rows split at ${width}`);
       assert.ok(theatreGeometry.theatreHeight<760,`desktop theatre too tall at ${width}`);
      }else{
       assert.ok(theatreGeometry.stage.y>=theatreGeometry.tabs.bottom-2,`mobile stage overlaps tabs at ${width}`);
       assert.ok(theatreGeometry.theatreHeight<760,`mobile theatre too tall at ${width}`);
      }
      await page.locator('.skill-chip').first().click({force:true});
      assert.equal(await page.locator('.skill-popover').isVisible(),true);
      await page.locator('.skill-close').click();
      assert.equal(await page.locator('.skill-popover').isVisible(),false);
      if(width===390){
       await page.locator('.dock-trigger').click();
       assert.equal(await page.locator('#site-dock nav a').first().isVisible(),true);
       await page.locator('#site-dock nav a').first().focus();
       await page.keyboard.press('Shift+Tab');
       const active=await page.evaluate(()=>({isClose:document.activeElement?.classList.contains('dock-close'),markup:document.activeElement?.outerHTML}));
       assert.equal(active.isClose,true,active.markup);
       await page.locator('.dock-close').click();
      }
      if(width===1440){
       const dockWidth=await page.locator('#site-dock .dock-inner').evaluate(element=>element.getBoundingClientRect().width);
       assert.ok(dockWidth<=70,`desktop dock expanded to ${dockWidth}px`);
       const workRoute=page.locator('#site-dock .dock-route[href="/work"]');
       await workRoute.hover();
       await page.waitForTimeout(300);
       assert.equal(await workRoute.locator('b').evaluate(element=>getComputedStyle(element).opacity),'1');
       await workRoute.click({noWaitAfter:true});
       assert.equal(await workRoute.evaluate(element=>element.classList.contains('is-departing')),true);
       await page.waitForURL('**/work',{timeout:2500});
       assert.equal(await page.locator('#site-dock .dock-route[href="/work"][aria-current="page"]').count(),1);
       await page.goto(base,{waitUntil:'domcontentloaded'});
      }
      assert.equal(await page.locator('[data-folio-motion]').count(),0);
    }
    if(route==='/academic-support'){
      await page.locator('input[name=service][value=thesis]').check();
      await page.locator('[data-form] button[type=submit]').click();
      await page.locator('input[name=topic]').fill('Survey regression');
      await page.locator('select[name=stage]').selectOption({index:1});
      await page.locator('input[name=date]').fill(new Date(Date.now()+86400000).toISOString().slice(0,10));
      await page.locator('[data-form] button[type=submit]').click();
      assert.equal(await page.locator('.academic-review').isVisible(),true);
      assert.equal(await page.locator('.academic-review a[href^="mailto:"]').count(),1);
    }
    await page.screenshot({path:`${output}/${width}-${route.slice(1)||'home'}.png`,fullPage:true});
    report.pages.push({route,width,...geometry});
   }
   if(width===1440) {
    await page.goto(base,{waitUntil:'domcontentloaded'});
    report.performance=await page.evaluate(()=>new Promise(resolve=>{
     const intervals=[];let previous=performance.now();const start=previous;
     function frame(now){intervals.push(now-previous);previous=now;if(now-start<6000)requestAnimationFrame(frame);else{intervals.sort((a,b)=>a-b);resolve({sampleMs:now-start,frames:intervals.length,p95FrameMs:intervals[Math.floor(intervals.length*.95)],framesOver50ms:intervals.filter(x=>x>50).length});}}
     requestAnimationFrame(frame);
    }));
   }
   await context.close();
  }
  assert.deepEqual(report.errors,[]);
  // The Linux CI runner is software-rendered. Guard severe regressions here;
  // 60 FPS and Core Web Vitals still require physical-device measurements.
  assert.ok(report.performance?.p95FrameMs<180,`render p95 regression: ${report.performance?.p95FrameMs}ms`);
  const response=await fetch(base,{headers:authHeaders});const html=await response.text();
  assert.ok(html.includes('<title>Kevin Simatupang — Creative Programmer</title>'));
  assert.equal((html.match(/property="og:image"/g)||[]).length,1);
  assert.equal((html.match(/name="twitter:image"/g)||[]).length,1);
  const og=await fetch(base+'/og?v=white-20261112',{headers:authHeaders});assert.equal(og.status,200);
  const png=Buffer.from(await og.arrayBuffer());assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
  await fs.writeFile(`${output}/og.png`,png);
  await fs.writeFile(`${output}/home.html`,html);
  await fs.writeFile(`${output}/results.json`,JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

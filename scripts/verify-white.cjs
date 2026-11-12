const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const assert=require('node:assert/strict');
const base=process.env.FOLIO_BASE_URL || 'http://localhost:3001';
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 const report={pages:[],errors:[],performance:null};
 await fs.mkdir('artifacts/white-release',{recursive:true});
 try {
  for(const [width,height] of [[390,844],[768,1024],[1440,900],[1920,1080]]) {
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference'});
   await context.addInitScript(()=>localStorage.setItem('atelier.visited','yes'));
   const page=await context.newPage();
   page.on('pageerror',e=>report.errors.push(String(e)));
   for(const route of ['/','/work','/demos','/capabilities','/about','/contact','/resume']) {
    const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});
    assert.equal(response.status(),200);
    await page.waitForTimeout(500);
    const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,background:getComputedStyle(document.documentElement).backgroundColor}));
    assert.equal(geometry.overflow,false,`${route} ${width} overflow`);
    assert.equal(geometry.background,'rgb(255, 255, 255)');
    if(route==='/'){
      assert.equal(await page.locator('.visitor-greeting').count(),1);
      assert.equal(await page.locator('.skill-chip').count()>20,true);
      await page.locator('.skill-chip').first().click({force:true});
      assert.equal(await page.locator('.skill-popover').isVisible(),true);
      await page.locator('.skill-close').click();
      assert.equal(await page.locator('.skill-popover').isVisible(),false);
      if(width===390){
       await page.locator('.dock-trigger').click();
       assert.equal(await page.locator('#site-dock nav a').first().isVisible(),true);
       await page.keyboard.press('Shift+Tab');
       assert.equal(await page.locator('.dock-close').evaluate(el=>el===document.activeElement),true);
       await page.locator('.dock-close').click();
      }
      assert.equal(await page.locator('[data-folio-motion]').count(),0);
    }
    await page.screenshot({path:`artifacts/white-release/${width}-${route.slice(1)||'home'}.png`,fullPage:true});
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
  const response=await fetch(base);const html=await response.text();
  assert.ok(html.includes('<title>Kevin Simatupang — Creative Programmer</title>'));
  assert.equal((html.match(/property="og:image"/g)||[]).length,1);
  assert.equal((html.match(/name="twitter:image"/g)||[]).length,1);
  const og=await fetch(base+'/og?v=white-20261112');assert.equal(og.status,200);
  const png=Buffer.from(await og.arrayBuffer());assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
  await fs.writeFile('artifacts/white-release/og.png',png);
  await fs.writeFile('artifacts/white-release/home.html',html);
  await fs.writeFile('artifacts/white-release/results.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

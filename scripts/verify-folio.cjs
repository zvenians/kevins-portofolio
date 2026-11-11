// Usage: NODE_PATH=<directory containing playwright> node scripts/verify-folio.cjs <reference.mp4>
const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const output = path.resolve('artifacts/folio-fidelity');
(async () => {
  await fs.mkdir(output, {recursive:true});
  const browser = await chromium.launch({channel:process.env.CI ? undefined : 'chrome',headless:true});
  const report = { viewports:[], errors:[], reference:process.argv[2] };
  try {
    if (process.argv[2]) {
      const page = await browser.newPage({viewport:{width:384,height:848}});
      const data = await fs.readFile(process.argv[2]);
      await page.setContent('<body style="margin:0;background:#ddd"><video muted style="width:100%;height:100vh;object-fit:contain"></video></body>');
      await page.locator('video').evaluate((video,src) => new Promise(resolve => {video.onloadeddata=resolve;video.src=src;}), 'data:video/mp4;base64,'+data.toString('base64'));
      report.referenceDuration = await page.locator('video').evaluate(v=>v.duration);
      for (const time of [.5,2.5,4.8]) {
        await page.locator('video').evaluate((v,t)=>new Promise(resolve=>{v.onseeked=resolve;v.currentTime=t;}),time);
        await page.screenshot({path:path.join(output,`reference-${time}.png`)});
      }
      await page.close();
    }
    for (const [width,height] of [[384,848],[390,844],[768,1024],[1440,900]]) {
      const context = await browser.newContext({viewport:{width,height},reducedMotion:'no-preference',recordVideo:{dir:output,size:{width,height}}});
      await context.addInitScript(()=>{localStorage.setItem('atelier.language','en');localStorage.setItem('atelier.reduced','false');});
      const page = await context.newPage();
      page.on('pageerror',e=>report.errors.push(String(e)));
      await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
      const scene = page.locator('.project-folio');
      await scene.scrollIntoViewIfNeeded();
      await page.evaluate(()=>scrollTo(0,document.querySelector('.project-folio').getBoundingClientRect().top+scrollY));
      await page.locator('.project-folio img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
      const overflow = await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
      assert.equal(overflow,false,'Horizontal page overflow');
      assert.equal(await scene.locator('a').count(),6);
      const frames=[];
      for(const time of [.5,2.5,4.8]) {
        const measurement=await page.locator('.folio-track').evaluate((track,t)=>{
          const animation=track.getAnimations()[0];if(!animation)throw Error('Missing folio animation');
          animation.pause();animation.currentTime=t*1000;
          const m=new DOMMatrix(getComputedStyle(track).transform);
          return {time:t,x:m.m41,y:m.m42,angle:Math.atan2(m.b,m.a)*180/Math.PI,childTransforms:[...track.querySelectorAll('.showpiece')].map(c=>getComputedStyle(c).transform)};
        },time);
        frames.push(measurement);
        await page.screenshot({path:path.join(output,`${width}-${time}.png`)});
      }
      if(width===384){assert.ok(Math.abs(frames[1].y+120)<=15);assert.ok(Math.abs(frames[1].x+19)<=12);assert.ok(Math.abs(frames[1].angle+15)<=2.5);}
      assert.ok(Math.abs(frames[2].y)<=6 && Math.abs(frames[2].x)<=6);
      assert.deepEqual(frames[0].childTransforms,frames[1].childTransforms);
      // Record an uninterrupted cycle at natural speed, including both rests.
      await page.locator('.folio-track').evaluate(track=>{const a=track.getAnimations()[0];a.currentTime=0;a.play();});
      await page.waitForTimeout(5800);
      for(const card of await scene.locator('a').all()) {
        await card.focus();assert.equal(await card.evaluate(c=>c===document.activeElement),true);
        const href=await card.getAttribute('href');assert.equal((await page.request.get('http://localhost:3000'+href)).status(),200);
      }
      // Both system preference and saved UI preference must retain the fan
      // without triggering the old nested vertical-scroll list.
      await page.emulateMedia({reducedMotion:'reduce'});
      assert.equal(await page.locator('.folio-track').evaluate(e=>getComputedStyle(e).animationName),'none');
      const staticGeometry = await scene.evaluate(element => {
        const computed = getComputedStyle(element);
        const cards = [...element.querySelectorAll('.showpiece')];
        const rotations = cards.map(card => {
          const matrix = new DOMMatrix(getComputedStyle(card).transform);
          return Math.atan2(matrix.b,matrix.a)*180/Math.PI;
        });
        return {
          overflowY:computed.overflowY,
          cardCount:cards.length,
          rotations,
          cardWidths:cards.map(card => card.getBoundingClientRect().width),
          stageWidth:element.getBoundingClientRect().width
        };
      });
      assert.equal(staticGeometry.overflowY,'hidden','Reduced motion created an internal scrollbar');
      assert.equal(staticGeometry.cardCount,6);
      assert.equal(new Set(staticGeometry.rotations.map(angle=>Math.round(angle))).size,6,
        'Reduced motion flattened the diagonal card composition');
      assert.ok(staticGeometry.cardWidths.every(w=>w>0 && w<staticGeometry.stageWidth));
      await page.screenshot({path:path.join(output,`${width}-reduced.png`)});
      await page.evaluate(()=>{document.documentElement.dataset.motion='reduced'});
      assert.equal(await scene.evaluate(e=>getComputedStyle(e).overflowY),'hidden',
        'Saved reduced-motion setting created an internal scrollbar');
      assert.equal(await page.locator('.folio-track').evaluate(e=>getComputedStyle(e).animationName),'none');
      report.viewports.push({width,height,overflow,frames,staticGeometry,keyboard:'PASS',routes:'PASS',images:'PASS',reducedMotion:'PASS'});
      await context.close();
      await page.video().saveAs(path.join(output,`${width}-cycle.webm`));
    }
    assert.deepEqual(report.errors,[]);
    await fs.writeFile(path.join(output,'measurements.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

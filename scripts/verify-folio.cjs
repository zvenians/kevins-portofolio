const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const base=process.env.FOLIO_BASE_URL||'http://localhost:3000';
const output=path.resolve(process.env.FOLIO_OUTPUT||'artifacts/folio-fidelity');
(async()=>{
  await fs.mkdir(output,{recursive:true});
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const results=[];
  try{
    for(const [width,height] of [[320,720],[390,844],[768,1024],[1440,900],[1920,1080]]){
      const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference'});
      await context.addInitScript(()=>{localStorage.setItem('atelier.language','en');localStorage.setItem('atelier.reduced','false');localStorage.setItem('atelier.visited','yes');});
      const page=await context.newPage();
      const errors=[];page.on('pageerror',e=>errors.push(String(e)));
      assert.equal((await page.goto(base,{waitUntil:'domcontentloaded'})).status(),200);
      const stage=page.locator('.project-folio');await stage.waitFor({state:'visible'});
      await stage.scrollIntoViewIfNeeded();
      const cards=stage.locator('.showpiece');assert.equal(await cards.count(),6);
      await cards.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
      const geometry=await stage.evaluate(el=>({overflow:document.documentElement.scrollWidth>innerWidth+1,rotations:[...el.querySelectorAll('.showpiece')].map(card=>{const m=new DOMMatrix(getComputedStyle(card).transform);return Math.atan2(m.b,m.a)*180/Math.PI}),widths:[...el.querySelectorAll('.showpiece')].map(card=>card.getBoundingClientRect().width),stageWidth:el.getBoundingClientRect().width}));
      assert.equal(geometry.overflow,false,`${width}: horizontal overflow`);
      assert.ok(geometry.rotations.every(angle=>Math.abs(angle)<.2),`${width}: rotated card`);
      assert.ok(geometry.widths.every(cardWidth=>cardWidth>0&&cardWidth<geometry.stageWidth));
      await page.screenshot({path:path.join(output,`${width}-initial.png`)});
      await stage.locator('[data-folio-next]').click();
      assert.match(await stage.locator('output').innerText(),/^02 \/ 06$/);
      await page.screenshot({path:path.join(output,`${width}-next.png`)});
      await stage.locator('[data-folio-prev]').click();
      assert.match(await stage.locator('output').innerText(),/^01 \/ 06$/);
      if(width===390){
        const box=await cards.first().boundingBox();
        await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
        await page.mouse.down();await page.mouse.move(box.x+box.width/2,box.y+box.height/2-100,{steps:12});await page.mouse.up();
        assert.match(await stage.locator('output').innerText(),/^02 \/ 06$/);
        await page.mouse.move(0,0);
        await page.waitForTimeout(6600);
        assert.match(await stage.locator('output').innerText(),/^03 \/ 06$/);
      }
      for(const card of await cards.all()){
        await card.focus();assert.equal(await card.evaluate(el=>el===document.activeElement),true);
        const href=await card.getAttribute('href');assert.equal((await page.request.get(base+href)).status(),200);
      }
      await page.evaluate(()=>document.documentElement.dataset.motion='reduced');
      assert.equal(await stage.evaluate(el=>getComputedStyle(el.querySelector('.showpiece')).transitionDuration),'0s');
      assert.deepEqual(errors,[]);
      results.push({width,height,...geometry,controls:'pass',dragAndAutoplay:width===390?'pass':'not sampled',keyboard:'pass',routes:'pass',reducedMotion:'pass'});
      await context.close();
    }
    await fs.writeFile(path.join(output,'measurements.json'),JSON.stringify(results,null,2));
    console.log(JSON.stringify(results));
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

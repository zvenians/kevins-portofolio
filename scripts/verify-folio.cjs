const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const base=process.env.FOLIO_BASE_URL||'http://localhost:3000';
const output=path.resolve(process.env.FOLIO_OUTPUT||'artifacts/folio-fidelity');
const authHeaders=process.env.VERCEL_OIDC_TOKEN?{'x-vercel-trusted-oidc-idp-token':process.env.VERCEL_OIDC_TOKEN}:{};
(async()=>{
  await fs.mkdir(output,{recursive:true});
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const results=[];
  try{
    for(const [width,height] of [[320,720],[390,844],[768,1024],[1440,900],[1920,1080]]){
      const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference',extraHTTPHeaders:authHeaders,recordVideo:width===390?{dir:output,size:{width,height}}:undefined});
      await context.addInitScript(()=>{localStorage.setItem('atelier.language','en');localStorage.setItem('atelier.reduced','false');localStorage.setItem('atelier.visited','yes');});
      const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
      assert.equal((await page.goto(base,{waitUntil:'networkidle'})).status(),200);
      const stage=page.locator('.project-folio');await stage.scrollIntoViewIfNeeded();
      const cards=stage.locator('.showpiece');assert.equal(await cards.count(),6);
      assert.equal(await stage.locator('[data-folio-next], [data-folio-prev], [data-folio-motion]').count(),0);
      await cards.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
      const geometry=await stage.evaluate(el=>({overflow:document.documentElement.scrollWidth>innerWidth+1,rotations:[...el.querySelectorAll('.showpiece')].map(card=>{const m=new DOMMatrix(getComputedStyle(card).transform);return Math.atan2(m.b,m.a)*180/Math.PI}),cardWidth:el.querySelector('.showpiece').getBoundingClientRect().width,stageWidth:el.getBoundingClientRect().width}));
      assert.equal(geometry.overflow,false,`${width}: horizontal overflow`);assert.ok(geometry.rotations.every(angle=>Math.abs(angle)<.2),`${width}: rotated card`);assert.ok(geometry.cardWidth>0&&geometry.cardWidth<=geometry.stageWidth);
      await page.screenshot({path:path.join(output,`${width}-initial.png`),fullPage:true});
      const initial=await stage.locator('output').innerText();await page.mouse.move(0,0);await page.waitForTimeout(2450);const autoplay=await stage.locator('output').innerText();assert.notEqual(autoplay,initial,`${width}: autoplay did not advance`);
      await stage.press('ArrowRight');const keyboard=await stage.locator('output').innerText();assert.notEqual(keyboard,autoplay,`${width}: keyboard did not advance`);
      if(width===390){await page.waitForTimeout(850);await stage.dispatchEvent('mousedown',{button:0,clientX:300,clientY:180});await stage.dispatchEvent('mousemove',{buttons:1,clientX:180,clientY:180});await stage.dispatchEvent('mouseup',{button:0,clientX:180,clientY:180});assert.notEqual(await stage.locator('output').innerText(),keyboard,'drag did not advance');}
      for(const card of await cards.all()){const href=await card.getAttribute('href');assert.equal((await page.request.get(base+href)).status(),200);}
      await page.evaluate(()=>document.documentElement.dataset.motion='reduced');assert.equal(await cards.first().evaluate(el=>getComputedStyle(el).transitionDuration),'0s');assert.deepEqual(errors,[]);
      results.push({width,height,...geometry,autoplay:'pass',drag:width===390?'pass':'sampled on mobile',keyboard:'pass',routes:'pass',reducedMotion:'pass'});await context.close();
    }
    await fs.writeFile(path.join(output,'measurements.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

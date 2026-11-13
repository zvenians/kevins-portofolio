const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const base=process.env.FOLIO_BASE_URL||'http://localhost:3000';
const output=path.resolve(process.env.FOLIO_OUTPUT||'artifacts/folio-fidelity');
const authHeaders=process.env.VERCEL_OIDC_TOKEN?{'x-vercel-trusted-oidc-idp-token':process.env.VERCEL_OIDC_TOKEN}:{};
const viewports=[[320,720],[360,800],[375,812],[390,844],[412,860],[430,880],[600,900],[740,960],[768,1024],[1024,900],[1440,900],[1920,1080]];
(async()=>{
  await fs.mkdir(output,{recursive:true});
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const results=[];
  try{
    for(const [width,height] of viewports){
      const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference',extraHTTPHeaders:authHeaders,recordVideo:[390,1440].includes(width)?{dir:output,size:{width,height}}:undefined});
      await context.addInitScript(()=>{localStorage.setItem('atelier.language','en');localStorage.setItem('atelier.reduced','true');localStorage.setItem('atelier.visited','yes');});
      const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
      assert.equal((await page.goto(base,{waitUntil:'networkidle'})).status(),200);
      const stage=page.locator('.project-folio');
      const offscreenStart=await stage.locator('output').innerText();
      await page.waitForTimeout(1330);
      assert.notEqual(await stage.locator('output').innerText(),offscreenStart,`${width}: autoplay did not start before scrolling`);
      await stage.scrollIntoViewIfNeeded();
      const cards=stage.locator('.showpiece');assert.equal(await cards.count(),6);
      assert.equal(await stage.locator('[data-folio-next], [data-folio-prev], [data-folio-motion]').count(),0);
      await cards.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
      await page.waitForFunction(()=>{const active=document.querySelector('.project-folio .showpiece.is-active');const status=document.querySelector('.project-folio .folio-status');return active&&status&&status.getBoundingClientRect().top-active.getBoundingClientRect().bottom>=24},null,{timeout:3000,polling:50});
      const geometry=await stage.evaluate(el=>{const rect=node=>node.getBoundingClientRect().toJSON();const active=el.querySelector('.showpiece.is-active'),status=el.querySelector('.folio-status'),image=active.querySelector('.shot img'),stage=el.getBoundingClientRect();const visible=[...el.querySelectorAll('.showpiece')].filter(card=>+getComputedStyle(card).opacity>.1);return {overflow:document.documentElement.scrollWidth>innerWidth+1,rotations:[...el.querySelectorAll('.showpiece')].map(card=>{const m=new DOMMatrix(getComputedStyle(card).transform);return Math.atan2(m.b,m.a)*180/Math.PI}),card:rect(active),image:rect(image),status:rect(status),visibleLayers:visible.length,stageWidth:stage.width,stageHeight:stage.height,centerOffset:(active.getBoundingClientRect().left+active.getBoundingClientRect().width/2)-(stage.left+stage.width/2),clippedRight:active.getBoundingClientRect().right>innerWidth+1,identity:el.querySelector('.folio-identity strong').textContent,activeName:active.dataset.name};});
      assert.equal(geometry.overflow,false,`${width}: horizontal overflow`);
      assert.ok(geometry.rotations.every(angle=>Math.abs(angle)<.2),`${width}: rotated card`);
      assert.ok(geometry.card.width>0&&geometry.card.width<=geometry.stageWidth);
      assert.ok(Math.abs(geometry.centerOffset)<4,`${width}: folio is off-center`);
      assert.equal(geometry.clippedRight,false,`${width}: active project cropped on right`);
      assert.ok(geometry.status.y-geometry.card.bottom>=24,`${width}: status/card gap is below 24px`);
      assert.ok(geometry.image.left>=geometry.card.left-2&&geometry.image.right<=geometry.card.right+2&&geometry.image.top>=geometry.card.top-2&&geometry.image.bottom<=geometry.card.bottom+2,`${width}: thumbnail is clipped ${JSON.stringify({card:geometry.card,image:geometry.image})}`);
      assert.equal(geometry.visibleLayers,5,`${width}: expected five useful visible layers`);
      assert.equal(geometry.identity,geometry.activeName,`${width}: editorial identity is not synchronized`);
      console.log(`${width}x${height}`,JSON.stringify({card:{width:geometry.card.width,height:geometry.card.height},stageHeight:geometry.stageHeight,gap:geometry.status.y-geometry.card.bottom,visibleLayers:geometry.visibleLayers}));
      if(width>=1440){assert.ok(geometry.card.width>=580&&geometry.card.width<=600,`${width}: desktop card width missed target`);assert.ok(geometry.card.height>=300&&geometry.card.height<=312,`${width}: desktop card height missed target`);assert.ok(geometry.stageHeight>=680&&geometry.stageHeight<=730,`${width}: stage height missed target`);}
      if(width===768)assert.ok(geometry.card.width>=460&&geometry.card.width<500,'tablet card should scale fluidly');
      await stage.screenshot({path:path.join(output,`${width}-showcase.png`)});if([390,1440].includes(width))await page.screenshot({path:path.join(output,`${width}-page.png`),fullPage:true});
      const initial=await stage.locator('output').innerText();await stage.hover();await page.waitForTimeout(1250);const autoplay=await stage.locator('output').innerText();assert.notEqual(autoplay,initial,`${width}: autoplay stopped on hover`);
      await stage.focus();const focused=await stage.locator('output').innerText();await page.waitForTimeout(1250);assert.notEqual(await stage.locator('output').innerText(),focused,`${width}: autoplay stopped on focus`);
      const beforeKeyboard=await stage.locator('output').innerText();await stage.press('ArrowRight');const keyboard=await stage.locator('output').innerText();assert.notEqual(keyboard,beforeKeyboard,`${width}: keyboard did not advance`);
      if(width===390){await page.waitForTimeout(850);const box=await stage.locator('.is-active').boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2,box.y+box.height/2-80,{steps:12});await page.mouse.up();assert.notEqual(await stage.locator('output').innerText(),keyboard,'vertical drag did not advance');}
      if(width===1440){for(let i=0;i<6&&!((await stage.locator('output').innerText()).startsWith('06'));i++)await stage.press('ArrowRight');assert.ok((await stage.locator('output').innerText()).startsWith('06'),'could not reach project 06');await page.waitForTimeout(1150);assert.ok((await stage.locator('output').innerText()).startsWith('01'),'06→01 autoplay wrap snapped or stalled');}
      for(const card of await cards.all()){const href=await card.getAttribute('href');assert.equal((await page.request.get(base+href)).status(),200);}
      assert.equal(await page.locator('#motion').count(),0,'retired preferences checkbox remains');assert.deepEqual(errors,[]);
      results.push({width,height,...geometry,autoplay:'pass',hoverContinuity:'pass',focusContinuity:'pass',drag:width===390?'pass':'sampled on mobile',keyboard:'pass',routes:'pass',oldStoredPreferenceIgnored:'pass'});await context.close();
    }
    await fs.writeFile(path.join(output,'measurements.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

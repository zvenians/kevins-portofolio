const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const assert=require('node:assert/strict');
const base=process.env.FOLIO_BASE_URL||'http://localhost:3000';
const out=process.env.FOLIO_OUTPUT||'artifacts/video-lock';
(async()=>{
 await fs.mkdir(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome'});
 const results=[];
 try{for(const width of [320,390,768,1440,1920]){
  const height=width===320?720:width===390?844:width===768?1024:width===1440?900:1080;
  const context=await browser.newContext({viewport:{width,height},recordVideo:{dir:out,size:{width,height}}});
  await context.addInitScript(()=>localStorage.setItem('atelier.visited','yes'));
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',message=>{if(message.type()==='error')errors.push(`${message.text()} ${message.location().url}`.trim())});
  await page.goto(base,{waitUntil:'networkidle'});
  const runtime=await page.evaluate(()=>({motion:Boolean(window.Motion?.animate),gsap:Boolean(window.gsap),scrollTrigger:Boolean(window.ScrollTrigger),hero:Boolean(document.querySelector('.scene canvas'))}));
  assert.deepEqual(runtime,{motion:true,gsap:true,scrollTrigger:true,hero:true});
  const stage=page.locator('.project-folio');
  const firstOffscreen=await stage.locator('output').innerText();await page.waitForTimeout(1320);
  assert.notEqual(await stage.locator('output').innerText(),firstOffscreen,`${width}: initial autoplay must begin offscreen`);
  await stage.scrollIntoViewIfNeeded();
  await stage.locator('img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
  await stage.focus();await page.waitForTimeout(750);
  await page.waitForFunction(()=>{
   const visible=[...document.querySelectorAll('.project-folio .showpiece')].filter(card=>+getComputedStyle(card).opacity>.1).sort((a,b)=>a.getBoundingClientRect().y-b.getBoundingClientRect().y);
   return visible.length===5&&visible.at(-1)?.classList.contains('is-active');
  },null,{timeout:2500,polling:50});
  // Sample a settled frame deterministically between autoplay cycles.
  await stage.press('ArrowRight');
  await page.waitForTimeout(700);
  const geometry=await stage.evaluate(el=>{
   const rect=el.getBoundingClientRect();const cards=[...el.querySelectorAll('.showpiece')].map(c=>({active:c.classList.contains('is-active'),opacity:+getComputedStyle(c).opacity,rect:c.getBoundingClientRect().toJSON()})).filter(c=>c.opacity>.1).sort((a,b)=>a.rect.y-b.rect.y);
   return {overflow:document.documentElement.scrollWidth>innerWidth,stage:rect.toJSON(),cards};
  });
  assert.equal(geometry.overflow,false);assert.equal(geometry.cards.length,5);
  for(const c of geometry.cards)assert.ok(Math.abs(c.rect.x+c.rect.width/2-geometry.stage.x-geometry.stage.width/2)<=4);
  assert.equal(geometry.cards.at(-1).active,true);
  for(let i=1;i<geometry.cards.length;i++)assert.ok(geometry.cards[i].rect.width>geometry.cards[i-1].rect.width);
  await stage.screenshot({path:`${out}/${width}-deck.png`});
  const box=await stage.locator('.is-active').boundingBox();const initial=await stage.locator('output').innerText();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2,box.y+box.height/2-80,{steps:15});await page.mouse.up();
  assert.notEqual(await stage.locator('output').innerText(),initial,'real cursor drag');
  await stage.press('ArrowUp');await page.waitForTimeout(700);
  await page.mouse.move(width-1,0);await page.evaluate(()=>document.activeElement.blur());
  const before=await stage.locator('output').innerText();await page.waitForTimeout(1250);assert.notEqual(await stage.locator('output').innerText(),before);
  await page.waitForTimeout(6000);
  const dock=page.locator('#site-dock');assert.equal((await dock.boundingBox()).x,0);
  if(width<900)await page.locator('.dock-trigger').click();else await dock.hover();
  await page.waitForTimeout(550);await page.screenshot({path:`${out}/${width}-dock.png`});
  await page.keyboard.press('Escape');
  await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});
  const continued=await stage.locator('output').innerText();await page.waitForTimeout(1320);
  assert.notEqual(await stage.locator('output').innerText(),continued,'no retired OS-based animation pause');
  await stage.press('ArrowUp');assert.equal(await page.locator('#motion').count(),0);
  await stage.screenshot({path:`${out}/${width}-loop.png`});assert.deepEqual(errors,[]);
  results.push({width,height,geometry,runtime,drag:'real mouse passed',autoplay:'passed',oldMotionToggleRemoved:'passed',dockX:0});await context.close();
 }
 await fs.writeFile(`${out}/results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

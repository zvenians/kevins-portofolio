const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  const results = [];
  try {
    await fs.mkdir('artifacts/hero-lock', {recursive:true});
    for (const width of [390,1440]) {
      const context = await browser.newContext({viewport:{width,height:width===390?844:900},hasTouch:width===390,reducedMotion:'no-preference'});
      await context.addInitScript(() => {
        localStorage.setItem('atelier.visited','yes');
        window.heroProbe = {draws:0, gestures:[]};
        const prototype = WebGLRenderingContext.prototype;
        const draw = prototype.drawArrays;
        prototype.drawArrays = function(...args) { window.heroProbe.draws++; return draw.apply(this,args); };
        const uniform = prototype.uniform2f;
        prototype.uniform2f = function(location,x,y) { window.heroProbe.gestures.push([x,y]); return uniform.call(this,location,x,y); };
      });
      const page = await context.newPage();
      await page.goto(process.env.FOLIO_BASE_URL || 'http://localhost:3001', {waitUntil:'domcontentloaded'});
      const canvas = page.locator('.scene canvas');
      await canvas.waitFor({state:'visible'});
      await page.waitForTimeout(1200);
      const before = await page.evaluate(()=>window.heroProbe.draws);
      const box = await canvas.boundingBox();
      assert.ok(box && box.width>100 && box.height>100);
      if(width===390) {
        const session=await context.newCDPSession(page);
        await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width*.5,y:box.y+box.height*.5}]});
        await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width*.7,y:box.y+box.height*.5}]});
        await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      } else {
        await page.mouse.move(box.x+box.width*.25,box.y+box.height*.5);
        await page.mouse.move(box.x+box.width*.75,box.y+box.height*.5,{steps:12});
      }
      await page.waitForTimeout(1200);
      const probe=await page.evaluate(()=>window.heroProbe);
      assert.ok(probe.draws>before+10,'WebGL must continue drawing');
      assert.ok(new Set(probe.gestures.map(v=>JSON.stringify(v))).size>10,'Interactive uniforms must change');
      await page.screenshot({path:`artifacts/hero-lock/${width}.png`});
      results.push({width,webglDraws:probe.draws,drawsAfterInteraction:probe.draws-before,input:width===390?'emulated touch':'mouse',physicalDevice:'NOT TESTED'});
      await context.close();
    }
    await fs.writeFile('artifacts/hero-lock/results.json',JSON.stringify(results,null,2));
    console.log(results);
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});

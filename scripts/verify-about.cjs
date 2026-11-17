const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const assert=require('node:assert/strict');
const base=process.env.FOLIO_BASE_URL||'http://localhost:3000';
const output=process.env.FOLIO_OUTPUT||'artifacts/atelier';
(async()=>{
 await fs.mkdir(output,{recursive:true});
 const browser=await chromium.launch({channel:'chrome'});
 const results=[];
 try {
  for(const width of [320,360,375,390,393,412,430,600,740,768,1024,1280,1440,1920]){
   const context=await browser.newContext({viewport:{width,height:900},hasTouch:width<800,recordVideo:width===390?{dir:output}:undefined});
   const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
   for(const language of ['en','id','fr','es']){
    await context.addInitScript(lang=>localStorage.setItem('atelier.language',lang),language);
    await page.goto(base+'/about',{waitUntil:'networkidle'});
    assert.equal(await page.locator('.about-practice>section').count(),6);
    assert.equal(await page.locator('.practice-directory details').count(),6);
    await page.locator('.practice-directory summary').first().focus();await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    assert.notEqual(await page.locator('.practice-directory details').first().getAttribute('open'),null);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    if(language==='en'&&[320,390,768,1440].includes(width))await page.screenshot({path:`${output}/about-${width}.png`,fullPage:true});
    results.push({width,language,modules:6,keyboard:'pass',overflow:false});
   }
   assert.deepEqual(errors,[]);await context.close();
  }
  await fs.writeFile(`${output}/about-results.json`,JSON.stringify(results,null,2));
  console.log(`${results.length} About viewport/locale checks passed`);
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});

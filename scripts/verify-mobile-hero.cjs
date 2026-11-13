const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const base=process.env.FOLIO_BASE_URL||'http://localhost:3000';
const output=process.env.MOBILE_HERO_OUTPUT||'artifacts/mobile-hero';
(async()=>{
 await fs.mkdir(output,{recursive:true});
 const browser=await chromium.launch({channel:'chrome'});
 const results=[];
 try {
  for(const width of [320,360,375,390,393,412,430,768]){
   const page=await browser.newPage({
    viewport:{width,height:width<400?760:850},isMobile:true,hasTouch:true,deviceScaleFactor:2
   });
   await page.addInitScript(()=>localStorage.setItem('atelier.visited','yes'));
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.locator('.hero h1 em').waitFor();
   await page.evaluate(()=>document.fonts.ready);
   const measure=()=>page.evaluate(()=>{
    const element=document.querySelector('.hero h1 em');
    const heading=document.querySelector('.hero h1');
    const text=document.querySelector('.hero-text');
    const range=document.createRange();range.selectNodeContents(element);
    const glyphs=range.getBoundingClientRect();
    const container=text.getBoundingClientRect();
    return {
     viewport:innerWidth,containerLeft:container.left,containerRight:container.right,
     nameLeft:glyphs.left,nameRight:glyphs.right,nameWidth:glyphs.width,
     headingFont:getComputedStyle(heading).fontSize,emFont:getComputedStyle(element).fontSize,
     documentOverflow:document.documentElement.scrollWidth>innerWidth+1
    };
   });
   const standard=await measure();
   assert.ok(standard.nameLeft>=standard.containerLeft-2 && standard.nameRight<=standard.containerRight+2,
    `surname clipped at ${width}: ${JSON.stringify(standard)}`);
   assert.equal(standard.documentOverflow,false,`document overflows at ${width}`);
   await page.evaluate(()=>{document.documentElement.style.fontSize='32px'});
   const enlarged=await measure();
   assert.ok(enlarged.nameLeft>=enlarged.containerLeft-2 && enlarged.nameRight<=enlarged.containerRight+2,
    `surname clipped at ${width} with large base font: ${JSON.stringify(enlarged)}`);
   if([320,390,430].includes(width))await page.screenshot({path:`${output}/android-${width}.png`});
   if(width===390){
    const stage=page.locator('.project-folio');
    const before=await stage.locator('output').innerText();
    await stage.evaluate(node=>{
     const make=(x,y)=>new Touch({identifier:3,target:node,clientX:x,clientY:y});
     const first=make(240,400),last=make(110,405);
     node.dispatchEvent(new TouchEvent('touchstart',{touches:[first],changedTouches:[first],bubbles:true}));
     node.dispatchEvent(new TouchEvent('touchend',{touches:[],changedTouches:[last],bubbles:true}));
    });
    assert.notEqual(await stage.locator('output').innerText(),before,'mobile horizontal swipe failed');
    await page.goto(base+'/contact',{waitUntil:'domcontentloaded'});
    await page.locator('#inquiry input[name=type]').focus();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   }
   assert.deepEqual(errors,[]);
   results.push({width,standard,enlarged,status:'pass'});
   await page.close();
  }
  await fs.writeFile(`${output}/results.json`,JSON.stringify(results,null,2));
  console.log(JSON.stringify(results));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});

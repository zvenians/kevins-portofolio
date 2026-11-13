const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const base=process.env.FOLIO_BASE_URL||'http://127.0.0.1:3000';
const output='artifacts/data-lab-fidelity';
const widths=[320,360,390,430,600,740,768,899,1024,1050,1440,1920];
const near=(a,b,tolerance=2)=>Math.abs(a-b)<=tolerance;
(async()=>{
 await fs.mkdir(output,{recursive:true});
 const browser=await chromium.launch({channel:'chrome'});
 const results=[];
 try{
  for(const width of widths){
   const page=await browser.newPage({viewport:{width,height:width<500?850:900},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(()=>{localStorage.setItem('atelier.visited','yes')});
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.locator('#data-lab .data-lab-card').first().waitFor({timeout:15000});
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('#data-lab').scrollIntoViewIfNeeded();
   const result=await page.evaluate(()=>{
    const box=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
    const grid=document.querySelector('#data-lab .data-lab-grid');
    const cards=[...document.querySelectorAll('#data-lab .data-lab-card')];
    const details=cards.map((card,i)=>({
     index:i+1,box:box(card),image:box(card.querySelector('figure')),
     name:box(card.querySelector('strong')),
     signal:box(card.querySelector('.lab-signal')),
     naturalWidth:card.querySelector('figure img').naturalWidth,
     href:card.getAttribute('href')
    }));
    return {viewport:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,
      grid:box(grid),columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,
      cardCount:cards.length,cards:details};
   });
   assert.equal(result.overflow,false,`horizontal page overflow at ${width}`);
   assert.equal(result.cardCount,6,`Data Lab should have six real demo cards at ${width}`);
   assert.ok(result.grid.left>=-2&&result.grid.right<=width+2,`grid outside screen at ${width}`);
   const cards=result.cards;
   for(const [i,card] of cards.entries()){
    assert.ok(card.box.width>100&&card.box.height>150,`collapsed card ${i+1} at ${width}`);
    assert.ok(card.box.left>=result.grid.left-2&&card.box.right<=result.grid.right+2,`card outside grid ${i+1} at ${width}`);
    assert.ok(card.image.left>=card.box.left-2&&card.image.right<=card.box.right+2,`image outside card ${i+1} at ${width}`);
    assert.ok(card.image.bottom<=card.name.top+3,`image/title overlap ${i+1} at ${width}`);
    assert.ok(card.signal.left>=card.box.left-2&&card.signal.right<=card.box.right+2&&card.signal.bottom<=card.box.bottom+3,`technical signal outside card ${i+1} at ${width}`);
    assert.ok(card.href?.startsWith('/work/'),`Data Lab link missing at ${width}`);
    for(let j=i+1;j<cards.length;j++){
      const other=cards[j];
      const overlapX=Math.min(card.box.right,other.box.right)-Math.max(card.box.left,other.box.left);
      const overlapY=Math.min(card.box.bottom,other.box.bottom)-Math.max(card.box.top,other.box.top);
      assert.ok(overlapX<=2||overlapY<=2,`cards ${i+1}/${j+1} overlap at ${width}: ${overlapX}x${overlapY}`);
    }
    if(i>0)assert.ok(card.box.top>=cards[i-1].box.top-2,`visual reading order regressed at ${width}`);
   }
   if(width<=740)assert.ok(cards.every(c=>near(c.box.left,cards[0].box.left)),`single-column misalignment at ${width}`);
   if(width>1050)assert.ok(cards[0].box.width>cards[1].box.width,`featured card hierarchy missing at ${width}`);
   if([320,390,768,1024,1440].includes(width))await page.locator('#data-lab').screenshot({path:`${output}/data-lab-${width}.png`});
   assert.deepEqual(errors,[]);
   results.push({width,columns:result.columns,cards:result.cardCount,overlap:false,overflow:false});
   await page.close();
  }
  await fs.writeFile(`${output}/layout-report.json`,JSON.stringify(results,null,2));
  console.log(JSON.stringify({status:'pass',results}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

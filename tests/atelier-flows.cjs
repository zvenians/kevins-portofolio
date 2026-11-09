const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '../vercel-site/public');
async function service(kind, language, saved) {
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'edisi', kind+'.html'), 'utf8'), { runScripts:'outside-only', url:'https://example.org/edisi/'+kind+'.html' });
  const w=dom.window;
  w.localStorage.setItem('atelier.language',language);
  if(saved)w.sessionStorage.setItem('atelier.booking.'+kind,JSON.stringify(saved));
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  w.scrollTo=()=>{}; w.confirm=()=>true;
  const context=dom.getInternalVMContext();
  async function load(name){
    const code=fs.readFileSync(path.join(root,'atelier',name),'utf8');
    const module=new vm.SourceTextModule(code,{context,identifier:name});
    await module.link(spec=>load(spec.replace('./','')));
    return module;
  }
  const app=await load('services.js');await app.evaluate();
  return w;
}
for(const language of ['en','id','fr','es']){
  for(const kind of ['resto','travel','care']){
    test(kind+' · '+language+' selection, review, payment and receipt',async()=>{
      const w=await service(kind,language),doc=w.document,q=s=>doc.querySelector(s);
      const input=(el,value)=>{el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));};
      const submit=form=>form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
      assert.equal(doc.documentElement.lang,language);
      if(kind==='resto'){
        assert.equal(doc.querySelectorAll('.dish-photo').length,6);
        assert.ok([...doc.querySelectorAll('.dish')].every(card=>card.querySelectorAll('small').length===1));
        assert.equal(q('aside button.primary').disabled,true);
        q('[data-page="1"]').click();q('[data-dish="6"]').click();
        q('#dish select[name=ice]').value='less';submit(q('#dish'));assert.equal(q('aside button.primary').disabled,false);
      } else if(kind==='travel'){assert.equal(doc.querySelectorAll('.hotel-photo').length,3);input(q('[name=guest]'),'Demo 22');input(q('[name=qty]'),'2');input(q('[name=vehicle]'),'2');assert.match(q('aside').textContent,/Bayu Adi/);}
      else {assert.equal(doc.querySelectorAll('.choice img').length,3);input(q('[name=address]'),'Demo 22');input(q('[name=qty]'),'4');assert.match(q('aside').textContent,/Demo 22/);}
      assert.equal(q('#order').checkValidity(),true);submit(q('#order'));const reviewTotal=q('.total strong').textContent;
      submit(q('#payment'));assert.equal(q('.total strong').textContent,reviewTotal);
      assert.ok(q('.ref').textContent.startsWith(kind.toUpperCase()));assert.ok(q('[data-print]'));
      const stored=JSON.parse(w.sessionStorage.getItem('atelier.booking.'+kind));assert.equal(stored.stage,2);
      if(kind!=='resto'){q('[data-cancel]').click();assert.equal(JSON.parse(w.sessionStorage.getItem('atelier.booking.'+kind)).cancelled,true);}
      const resumed=await service(kind,language,stored);
      assert.equal(resumed.document.querySelector('.ref').textContent,stored.reference);
      assert.equal(resumed.document.querySelector('.total strong').textContent,reviewTotal);resumed.close();
      w.close();
    });
  }
}
test('untrusted persisted values cannot create markup in a ticket or confirmation',async()=>{
  const attack='<img src=x onerror=alert(1)>';
  for(const kind of ['travel','care','resto']){
    const w=await service(kind,'en',{stage:2,reference:kind.toUpperCase()+'-12345678',guest:attack,notes:attack,room:attack,qty:attack,bag:[{id:0,opts:[attack],note:attack}]});
    assert.equal(w.document.querySelector('[onerror]'),null);
    assert.ok(w.document.querySelector('.paper').textContent.includes(attack));
    w.close();
  }
});
test('unsupported storage values recover to a usable selection',async()=>{
  const w=await service('resto','fr',{stage:2,place:'99',bag:[null,{id:99}],reference:'invalid'});
  assert.ok(w.document.querySelector('#order'));assert.equal(w.document.querySelector('.primary').disabled,true);w.close();
});

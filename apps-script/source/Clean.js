// Shared presentation rules. Move existing nodes so demo state and handlers survive.
function initCleanExperience(){
 document.body.classList.add('clean-ui');
 const studio=document.querySelector('#studio');
 if(studio&&!studio.dataset.clean){
  studio.dataset.clean='true';const head=studio.querySelector('.gallery-section-head');
  const object=document.createElement('button');object.type='button';object.className='studio-sculpture';object.setAttribute('aria-label','Rotate studio preview');object.setAttribute('aria-describedby','studio-depth-note');
  object.innerHTML=`<span class="sculpture-space" aria-hidden="true"><span class="sculpture-shadow"></span><span class="sculpture-pages">${['classic','corporate','editorial'].map((id,i)=>`<span class="sculpture-page" style="--page:${i}">${worldSvg(id)}</span>`).join('')}</span></span><span id="studio-depth-note">Three disciplines. One studio. <span>↻</span></span>`;
  let angle=-18;object.onclick=()=>{angle=angle===-18?18:-18;object.style.setProperty('--sculpture-angle',angle+'deg');};head.append(object);
 }
 document.querySelectorAll('.service-lanes>article').forEach(article=>{
  if(article.dataset.clean)return;article.dataset.clean='true';const list=article.querySelector('ul');if(!list)return;
  const details=document.createElement('details');details.className='service-detail';details.innerHTML='<summary>What’s included <span>+</span></summary>';list.before(details);details.append(list);const note=article.querySelector('small');if(note)details.append(note);
 });
 const page=document.querySelector('.case-page');
 if(page&&!page.dataset.clean){
  page.dataset.clean='true';const demo=page.querySelector('#interactive-evidence');
  if(demo){page.classList.add('demo-page');const details=document.createElement('details');details.className='demo-context';details.innerHTML='<summary>About this demo <span>Scope, approach & details +</span></summary>';demo.after(details);
   page.querySelectorAll(':scope>.case-visual,:scope>.proof-band,:scope>.tags,:scope>.case-copy:not(#interactive-evidence)').forEach(node=>details.append(node));
  }
 }
}
// Pointer depth only affects artwork. Inputs, copy, and tables never tilt.
let depthFrame=0,depthTarget=null,depthX=0,depthY=0;
document.addEventListener('pointermove',event=>{
 if(reduced||event.pointerType==='touch'||!matchMedia('(hover:hover)').matches)return;
 const target=event.target.closest?.('.exhibit,.gallery-template');
 if(target!==depthTarget){if(depthTarget){depthTarget.style.removeProperty('--depth-x');depthTarget.style.removeProperty('--depth-y');}depthTarget=target;}
 if(!target)return;const rect=target.getBoundingClientRect();depthX=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1))*5;depthY=Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1))*-4;
 if(!depthFrame)depthFrame=requestAnimationFrame(()=>{depthFrame=0;if(depthTarget){depthTarget.style.setProperty('--depth-x',depthX+'deg');depthTarget.style.setProperty('--depth-y',depthY+'deg');}});
},{passive:true});
document.addEventListener('pointerout',event=>{if(depthTarget&&!depthTarget.contains(event.relatedTarget)){depthTarget.style.removeProperty('--depth-x');depthTarget.style.removeProperty('--depth-y');depthTarget=null;}});

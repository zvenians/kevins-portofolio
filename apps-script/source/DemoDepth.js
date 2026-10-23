function initDemoDepth(){
  const stages=[...document.querySelectorAll('[data-demo-stage],#booking-demo,#archive-demo,#commerce-demo,.research-toolkit,.data-lab .workspace')];
  stages.forEach((stage,index)=>{
    stage.classList.add('spatial-demo');
    stage.style.setProperty('--stage-index',String(index+1).padStart(2,'0'));
    if(!stage.querySelector(':scope > .spatial-coordinate'))stage.insertAdjacentHTML('afterbegin','<div class="spatial-coordinate" aria-hidden="true"><span>LIVE WORKSPACE</span><b>00 / 00 / 00</b></div>');
    const planeSets=[
      ['.working-demo-head,.commerce-notice,.commerce-store-head,.toolkit-heading,.workspace-heading,.simulation-label','depth-plane depth-plane--label'],
      ['.field-device>aside,.prep-layout>aside,.document-desk>form,.scope-desk>form,.quality-controls,.ops-console>nav,.commerce-toolbar,.commerce-categories,.commerce-checkout>form,.toolkit-tabs,.lab-controls,.archive-controls,.booking-form','depth-plane depth-plane--input'],
      ['.field-device>main,.prep-layout>main,.paper-preview,#scope-output,#quality-frame,#quality-results,#ops-view,.commerce-grid,.commerce-cart,.commerce-order,.toolkit-workspace,.lab-stats,.table-scroll,.calendar,.cleanup>div,.archive-list,.booking-summary','depth-plane depth-plane--output']
    ];
    planeSets.forEach(([selector,names])=>stage.querySelectorAll(selector).forEach(el=>el.classList.add(...names.split(' '))));
    if(stage.dataset.depthBound)return;
    stage.dataset.depthBound='true';
    let frame=0;
    const reset=()=>{stage.style.setProperty('--depth-rx','.55deg');stage.style.setProperty('--depth-ry','-.65deg');stage.style.setProperty('--depth-x','50%');stage.style.setProperty('--depth-y','50%');};
    stage.addEventListener('pointermove',event=>{
      if(reduced||event.pointerType==='touch'||matchMedia('(pointer: coarse)').matches)return;
      const rect=stage.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;
      cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
        stage.style.setProperty('--depth-rx',((.5-y)*2.2).toFixed(2)+'deg');
        stage.style.setProperty('--depth-ry',((x-.5)*2.8).toFixed(2)+'deg');
        stage.style.setProperty('--depth-x',(x*100).toFixed(1)+'%');
        stage.style.setProperty('--depth-y',(y*100).toFixed(1)+'%');
        const coordinate=stage.querySelector(':scope > .spatial-coordinate b');
        if(coordinate)coordinate.textContent=String(Math.round(x*99)).padStart(2,'0')+' / '+String(Math.round(y*99)).padStart(2,'0')+' / '+String(index+1).padStart(2,'0');
      });
    });
    stage.addEventListener('pointerleave',reset);
    stage.addEventListener('focusin',event=>{stage.classList.add('has-depth-focus');event.target.closest('.depth-plane')?.classList.add('is-depth-active');});
    stage.addEventListener('focusout',event=>{event.target.closest('.depth-plane')?.classList.remove('is-depth-active');if(!stage.contains(event.relatedTarget))stage.classList.remove('has-depth-focus');});
    reset();
  });
}

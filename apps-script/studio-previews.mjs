import {JSDOM} from 'jsdom';
import {readFile} from 'node:fs/promises';

// Capture the real initial DOM, without running nested applications in the gallery.
export async function buildStudioPreviews(engine){
 const sources=await Promise.all(['Lab.js','Commerce.js','OperationsResearch.js','NextWave.js','CreativeWorlds.js','Wedding.js','Manga.js','Attendance.js','StudioSystems.js','Cinematic.js'].map(name=>readFile(new URL('./source/'+name,import.meta.url),'utf8')));
 const definitions=[['web-commerce','commerce-demo','commerceDemo()'],['web-archive','archive-demo','archiveExperience()'],['web-booking','booking-demo','bookingExperience()'],['attendance','attendance-demo','attendanceDemo()'],['web-manga','manga-demo','mangaDemo()'],...['reconcile','validate','budget','maintenance','schedule','cleanup','operations'].map((id,n)=>[id,'workspace',`state.lab=${n};renderLab()`]),...['fieldcompanion','dataprep','documents','commerceops','qualityroom','scopebuilder'].map(id=>[id,'next-wave-demo',`nextWaveDemo('${id}')`]),...['classic','corporate','geometric'].map((id,i)=>[id,'creative-demo',`worldStudio('${['wedding','morphslides','logostudio'][i]}')`]),['researchtools','research-tools-case',`document.querySelector('#research-tools-case').innerHTML=researchToolkitPanel();bindResearchToolkit()`]];
 const snapshots={};
 for(const [id,root,call] of definitions){
  const dom=new JSDOM(`<div id="${root}" class="${root==='workspace'?'workspace':''}"></div>`,{url:'https://example.com',runScripts:'outside-only',pretendToBeVisual:true});
  dom.window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
  try{
   dom.window.eval(engine+`\nvar $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];var reduced=true;var state={lab:0,source:'reconciled',threshold:1000000,highlight:true};var data={projects:[]};var esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');var toast=()=>{};var action=()=>{};var homeHref=()=>'/';var initImmersion=()=>{};`+'\n'+sources.join('\n')+'\n'+call);
   dom.window.document.querySelectorAll('.world-switch,.world-bottom').forEach(el=>el.remove());
   snapshots[id]=dom.window.document.body.innerHTML;
  }catch(error){throw new Error('Preview failed: '+id+' — '+error.message,{cause:error});}
  finally{dom.window.close();}
 }
 return snapshots;
}

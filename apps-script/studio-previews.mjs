import {JSDOM} from 'jsdom';
import {readFile} from 'node:fs/promises';

// Render the real, initial demo DOM at build time. No invented UI or live nested apps.
export async function buildStudioPreviews(engine){
 const sources=await Promise.all(['Lab.js','Commerce.js','StudioSystems.js','Cinematic.js'].map(name=>readFile(new URL('./source/'+name,import.meta.url),'utf8')));
 const definitions=[['web-commerce','commerce-demo','commerceDemo()'],['web-archive','archive-demo','archiveExperience()'],['web-booking','booking-demo','bookingExperience()'],...['reconcile','validate','budget','maintenance'].map((id,n)=>[id,'workspace',`state.lab=${n};renderLab()`])];
 const snapshots={};
 for(const [id,root,call] of definitions){
  const dom=new JSDOM(`<div id="${root}"></div>`,{url:'https://example.com',runScripts:'outside-only'});
  dom.window.eval(engine+`\nvar $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];var reduced=true;var state={lab:0,source:'reconciled',threshold:1000000,highlight:true};var esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');var toast=()=>{};var action=()=>{};var procurement=()=>{};`+'\n'+sources.join('\n')+'\n'+call);
  snapshots[id]=dom.window.document.body.innerHTML;
  dom.window.close();
 }
 return snapshots;
}

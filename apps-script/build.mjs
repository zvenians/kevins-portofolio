import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {build} from 'esbuild';
const source=new URL('./source/',import.meta.url);
const projects=JSON.parse(await readFile(new URL('projects.json',source),'utf8'));
const engine=await build({entryPoints:['apps-script/source/data-engine.ts'],bundle:true,write:false,format:'iife',globalName:'Engine',target:'es2020'});
// Apps Script's HTML sanitizer treats // in template literals as line comments.
// Keep the URL equivalent while avoiding literal // in the emitted inline script.
const client=(engine.outputFiles[0].text+'\n'+(await Promise.all(['Client.js','Lab.js','Commerce.js','OperationsResearch.js','NextWave.js','Immersion.js','Admin.js'].map(n=>readFile(new URL(n,source),'utf8')))).join('\n'))
  .replaceAll('https://','https:\\x2f\\x2f');
const css=(await Promise.all(['Styles.css','Enhancements.css','Commerce.css','OperationsResearch.css','NextWave.css','FieldOps.css','Immersion.css'].map(name=>readFile(new URL(name,source),'utf8')))).join('\n');
const assets={html:await readFile(new URL('Index.html',source),'utf8'),css,client};
const server=await readFile(new URL('Server.gs',source),'utf8');
await writeFile(new URL('./Code.gs',import.meta.url),server+'\nconst SEED_PROJECTS = '+JSON.stringify(projects)+';\nconst ASSETS = '+JSON.stringify(assets)+';\n');
await mkdir('apps-script/preview',{recursive:true});
const bootstrap={projects:projects.filter(p=>p.visibility==='public'),settings:{},resume:null,appUrl:'',admin:false};
const html=assets.html.replace('/*BOOTSTRAP*/',()=> 'window.INDEX_BOOTSTRAP='+JSON.stringify(bootstrap)+';').replace('/*STYLES*/',()=>assets.css).replace('/*CLIENT*/',()=>assets.client);
await writeFile('apps-script/preview/index.html',html);
await mkdir('vercel-site/generated',{recursive:true});
await writeFile('vercel-site/generated/fallback.json',JSON.stringify({projects:bootstrap.projects,settings:{},resume:null},null,2)+'\n');
const vercelTemplate=assets.html.replace('/*STYLES*/',()=>assets.css).replace('/*CLIENT*/',()=>assets.client);
await writeFile('vercel-site/generated/template.ts','export const template = '+JSON.stringify(vercelTemplate)+';\n');
console.log('Built Apps Script distribution and browser preview.');

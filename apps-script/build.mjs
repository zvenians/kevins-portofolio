import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {build} from 'esbuild';
import {buildStudioPreviews} from './studio-previews.mjs';
const source=new URL('./source/',import.meta.url);
const readText=async file=>(await readFile(file,'utf8')).replace(/\r\n/g,'\n');
const projects=JSON.parse(await readText(new URL('projects.json',source)));
const engine=await build({entryPoints:['apps-script/source/data-engine.ts'],bundle:true,write:false,format:'iife',globalName:'Engine',target:'es2020'});
// Apps Script's HTML sanitizer treats // in template literals as line comments.
// Keep the URL equivalent while avoiding literal // in the emitted inline script.
const client=('const demoSnapshots='+JSON.stringify(Object.fromEntries(Object.keys(await buildStudioPreviews(engine.outputFiles[0].text)).map(id=>[id,true])))+';\n'+engine.outputFiles[0].text+'\n'+(await Promise.all(['Client.js','Lab.js','Commerce.js','OperationsResearch.js','NextWave.js','CreativeStudios.js','CreativeWorlds.js','Wedding.js','Manga.js','Attendance.js','DemoStyles.js','StudioSystems.js','Gallery.js','Immersion.js','DemoDepth.js','Admin.js'].map(n=>readText(new URL(n,source))))).join('\n'))
  .replaceAll('https://','https:\\x2f\\x2f').replaceAll('</body>','<\\/body>');
const css=(await Promise.all(['Styles.css','Enhancements.css','Commerce.css','OperationsResearch.css','NextWave.css','FieldOps.css','CreativeStudios.css','StudioSystems.css','QualityLock.css'].map(name=>readText(new URL(name,source))))).join('\n');
const motionBundle=await build({entryPoints:['apps-script/source/edition-motion.js'],bundle:true,write:false,format:'iife',globalName:'EditionMotion',target:'es2020',minify:true});
const cinematicClient=motionBundle.outputFiles[0].text+'\n'+client.replace('if(data.projectSlug&&!location.hash&&window.INDEX_HOSTED)',await readText(new URL('Cinematic.js',source))+'\n'+await readText(new URL('Clean.js',source))+'\n'+await readText(new URL('Locale.js',source))+'\n'+await readText(new URL('Journey.js',source))+'\n'+await readText(new URL('QuickMenu.js',source))+'\nif(data.projectSlug&&!location.hash&&window.INDEX_HOSTED)');
const assets={html:await readText(new URL('Index.html',source)),css:css+'\n'+await readText(new URL('Gallery.css',source))+'\n'+await readText(new URL('CreativeWorlds.css',source))+'\n'+await readText(new URL('Spatial.css',source))+'\n'+await readText(new URL('Clean.css',source))+'\n'+await readText(new URL('Wedding.css',source))+'\n'+await readText(new URL('Manga.css',source))+'\n'+await readText(new URL('Attendance.css',source))+'\n'+await readText(new URL('DemoStyles.css',source))+'\n'+await readText(new URL('Journey.css',source))+'\n'+await readText(new URL('Edition.css',source)),client:cinematicClient};
const server=await readText(new URL('Server.gs',source));
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

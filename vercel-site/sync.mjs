import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const site = path.dirname(fileURLToPath(import.meta.url));
const script = await readFile(path.resolve(site, '../apps-script/Code.gs'), 'utf8');
const projects = JSON.parse(script.match(/\nconst SEED_PROJECTS = (.*);\nconst ASSETS = /s)?.[1] || '[]');
const assets = JSON.parse(script.match(/\nconst ASSETS = (.*);\n?$/s)?.[1] || '{}');
if (!assets.html || !assets.css || !assets.client) throw new Error('Build apps-script/Code.gs first.');

let client = assets.client;
// The Google owner workspace keeps its Apps Script RPC. Only the Vercel output
// receives path-based public project links and shareable canonical URLs.
client = client.replaceAll('href="#project/${esc(p.slug)}"', 'href="${projectHref(p.slug)}"');
client = client.replaceAll("'#project/'+p.slug", 'projectHref(p.slug)');
client = client.replace("const url=data.appUrl+'?project='+encodeURIComponent(p.slug)", "const url=window.INDEX_HOSTED?location.origin+projectHref(p.slug):data.appUrl+'?project='+encodeURIComponent(p.slug)");

// Replacement strings interpret $$ and $&; use callbacks to preserve the
// bundled JavaScript byte-for-byte (the client declares both $ and $$).
const template = assets.html.replace('/*STYLES*/', () => assets.css).replace('/*CLIENT*/', () => client);
const generated = path.join(site, 'generated');
await mkdir(generated, { recursive: true });
await writeFile(path.join(generated, 'template.ts'), 'export const template = ' + JSON.stringify(template) + ';\n');
await writeFile(path.join(generated, 'fallback.json'), JSON.stringify({ projects: projects.filter(p => p.visibility === 'public'), resume: null, settings: {}, version: 'snapshot' }, null, 2) + '\n');
console.log('Synced the Vercel presentation and public fallback snapshot.');

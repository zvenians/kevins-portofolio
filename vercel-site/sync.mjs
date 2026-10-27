import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { transform } from 'esbuild';

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
// Content hashes let subsequent pages reuse the same minified presentation.
const bundleDir = path.join(site, 'public', 'assets');
await mkdir(bundleDir, { recursive: true });
const compiled = await Promise.all([
  transform(assets.css, { loader: 'css', minify: true }),
  transform(client, { loader: 'js', minify: true, target: 'es2020' })
]);
const filenames = [];
for (const [i, result] of compiled.entries()) {
  const filename = 'portfolio-' + createHash('sha256').update(result.code).digest('hex').slice(0, 12) + (i === 0 ? '.css' : '.js');
  await writeFile(path.join(bundleDir, filename), result.code);
  filenames.push(filename);
}
const template = assets.html
  .replace('<style>/*STYLES*/</style>', `<link rel="stylesheet" href="/assets/${filenames[0]}">`)
  .replace('<script>/*CLIENT*/</script>', `<script defer src="/assets/${filenames[1]}"></script>`);
const generated = path.join(site, 'generated');
await mkdir(generated, { recursive: true });
await writeFile(path.join(generated, 'template.ts'), 'export const template = ' + JSON.stringify(template) + ';\n');
await writeFile(path.join(generated, 'fallback.json'), JSON.stringify({
  projects: projects.filter(p => p.visibility === 'public'),
  resume: null,
  settings: {
    email: 'simatupangkevin9@gmail.com',
    linkedin: 'https://www.linkedin.com/in/kevinoloann',
    whatsapp: '6287810933977'
  },
  version: 'snapshot'
}, null, 2) + '\n');
console.log('Synced the Vercel presentation and public fallback snapshot.');

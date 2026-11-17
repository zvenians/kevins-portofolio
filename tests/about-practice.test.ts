import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {JSDOM} from 'jsdom';

const source=readFileSync('vercel-site/public/atelier/about.js','utf8').replace("import { facts } from './cases.js';",'const facts = {};').replace('export function','function');
describe('personal practice directory',()=>{
  for(const language of ['en','id','fr','es']) it(`provides six accessible modules and SEO detail in ${language}`,()=>{
    const html=runInNewContext(source+'\naboutPage(language, [], key=>key, value=>value);',{language});
    const document=new JSDOM(html).window.document;
    expect(document.querySelectorAll('.about-practice>section')).toHaveLength(6);
    expect(document.querySelectorAll('details>summary')).toHaveLength(6);
    expect(document.querySelectorAll('#practice-3 li')).toHaveLength(8);
    expect(document.querySelector('#practice-3')?.hasAttribute('open')).toBe(true);
    expect(document.querySelector('a[href="/resume"]')).not.toBeNull();
    expect(document.querySelector('a[href="/contact"]')).not.toBeNull();
    expect(html).not.toContain('undefined');
    expect(html).not.toMatch(/95%|Expert|5-star/);
  });
});

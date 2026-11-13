import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';

const css=readFileSync('vercel-site/public/atelier/experience.css','utf8');
const js=readFileSync('vercel-site/public/atelier/index.js','utf8');

describe('Data Lab editorial gallery regression locks',()=>{
 it('uses deterministic rows with no negative margins or CSS dense packing',()=>{
  const section=css.slice(css.indexOf('/* Data Lab: predictable asymmetric gallery.'),css.indexOf('/* The workflow reads as an editorial sequence'));
  expect(section).toContain('grid-auto-flow:row');
  expect(section).toContain('align-items:stretch');
  expect(section).toContain('grid-template-columns:repeat(12,minmax(0,1fr))');
  expect(section).not.toContain('grid-auto-flow:dense');
  expect(section).not.toContain('grid-row:span');
  expect(section).not.toMatch(/margin-top:clamp\(-/);
  expect(section).toContain('@media(max-width:740px)');
  expect(section).toContain('display:flex;flex-direction:column;grid-column:1');
 });
 it('keeps six navigable examples and accessible descriptions',()=>{
  expect(js).toContain("const dataLabSlugs = ['operations-decision-workbench'");
  expect(js).toContain('class="data-lab-card"');
  expect(js).toContain('class="lab-signal"');
  expect(js).toContain('project.summary');
 });
 it('keeps the separate Data Lab browser screenshot gate',()=>{
  const flow=readFileSync('.github/workflows/ci.yml','utf8');
  expect(flow).toContain('node scripts/verify-data-lab.cjs');
  expect(flow).toContain('artifacts/data-lab-fidelity/');
 });
});

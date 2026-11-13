import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';

const read=(name:string)=>readFileSync(name,'utf8');
const js=read('vercel-site/public/atelier/index.js');
const css=read('vercel-site/public/atelier/experience.css');
const mobile=read('vercel-site/public/atelier/mobile-ui.css');
const words=read('vercel-site/public/atelier/words.js');
const render=read('vercel-site/lib/index-page.ts');
describe('2026 cinematic completion contract',()=>{
 it('fits the entire name by resetting the legacy oversized em shorthand',()=>{
  expect(css).toContain('#content .hero h1 em{');
  expect(css).toContain('font:inherit');
  expect(css).toContain('15cqw');
  expect(css).toContain('container-type:inline-size');
  expect(css).toContain('overflow-y:visible');
  expect(render).toContain('class="hero-text"');
  expect(render).toContain('<h1>Kevin<br><em>Simatupang.</em></h1>');
 });
 it('keeps About broad and localized',()=>{
  const profile=words.split('\n').find(line=>line.trim().startsWith('profile:'));
  expect(profile).toBeDefined();
  expect(profile).not.toContain('Galilea');
  expect(profile!.split('|')).toHaveLength(4);
 });
 it('uses a single showcase interpolation path, offscreen autoplay and touch without scroll hijacking',()=>{
  const folio=js.slice(js.indexOf('function mountProjectFolio()'),js.indexOf('function mountEditorialReveals()'));
  expect(folio).toContain('show(0);\n  resume();');
  expect(folio).not.toContain('motion.animate(card, values');
  expect(folio).toContain("folio.addEventListener('touchstart', touchStart, {passive:true})");
  expect(folio).toContain("folio.addEventListener('touchend', touchEnd, {passive:true})");
  expect(js).toContain('aria-live="off"');
  expect(css).toContain('touch-action:pan-y');
 });
 it('makes technical visualizations represent demo categories rather than fabricated business KPIs',()=>{
  expect(js).toContain('lab-signal');
  expect(js).toContain('project.technologies || []');
  expect(css).toContain('.lab-trace');
  expect(css).toContain('grid-auto-flow:row');
  expect(css).not.toContain('grid-auto-flow:dense');
 });
 it('adds contextual atmospheric light, page transition and scroll-driven workflow progress',()=>{
  expect(js).toContain('dataset.atmosphere');
  expect(css).toContain('@view-transition{navigation:auto}');
  expect(css).toContain('--process-progress');
  expect(js).toContain('ScrollTrigger.create({trigger:process');
  expect(mobile).not.toContain('-webkit-box-reflect:below');
 });
 it('provides a functional form, progress indicators and explicit failure fallback',()=>{
  expect(js).toContain("fetch('/api/inquiry'");
  expect(js).toContain('brief-progress');
  expect(js).toContain('id="email-backup"');
  expect(js).toContain('failedInquiry');
 });
});

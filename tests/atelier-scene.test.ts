import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { springStep } from '../vercel-site/public/atelier/scene.js';

describe('Home sphere motion engine', () => {
  it('converges smoothly toward the pointer target', () => {
    const state={value:0,velocity:0};
    const samples:number[]=[];
    for(let index=0;index<120;index+=1) {
      samples.push(springStep(state,.25,1/60,7,1,2));
    }
    expect(samples[0]).toBeGreaterThan(0);
    expect(Math.abs(state.value-.25)).toBeLessThan(.001);
    expect(Math.abs(state.velocity)).toBeLessThan(.01);
    expect(Math.max(...samples)).toBeLessThanOrEqual(.251);
  });

  it('caps velocity during abrupt touch input', () => {
    const state={value:0,velocity:0};
    springStep(state,10,.05,12,.7,.8);
    expect(Math.abs(state.velocity)).toBeLessThanOrEqual(.8);
  });

  it('keeps lifecycle and mobile gesture safeguards in the implementation', () => {
    const source=readFileSync(resolve(process.cwd(),'vercel-site/public/atelier/scene.js'),'utf8');
    expect(source).toContain("canvas.addEventListener('webglcontextlost'");
    expect(source).toContain("canvas.addEventListener('webglcontextrestored'");
    expect(source).toContain('setPointerCapture?.');
    expect(source).toContain('event.preventDefault()');
    expect(source).toContain("canvas.dataset.frameP95Ms");
    expect(source).toContain('deviceMemory');
  });
});

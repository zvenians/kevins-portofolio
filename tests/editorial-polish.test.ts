import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

const css=readFileSync('vercel-site/public/atelier/experience.css','utf8');
const js=readFileSync('vercel-site/public/atelier/index.js','utf8');

describe('issue 28 cinematic editorial polish',()=>{
  it('enlarges the desktop showcase while retaining a conservative mobile stack',()=>{
    expect(css).toContain('width:clamp(560px,41.25vw,594px)');
    expect(css).toContain('height:clamp(290px,21.32vw,307px)');
    expect(css).toContain('height:clamp(680px,50vw,720px)');
    expect(css).toContain('width:82%');
    expect(css).toContain('height:clamp(190px,32vw,230px)');
  });

  it('derives stack positions from rendered stage, card and status dimensions',()=>{
    const folio=js.slice(js.indexOf('function mountProjectFolio()'),js.indexOf('function mountEditorialReveals()'));
    expect(folio).toContain('const cardHeight=cards[0].offsetHeight');
    expect(folio).toContain('status.offsetHeight-statusGap-cardHeight-geometryBuffer');
    expect(folio).toContain('const positions=[activeY');
    expect(folio).not.toContain("folio.clientHeight * [.50,.385,.285,.19,.105,.045]");
    expect(folio).toContain('1100');
  });

  it('keeps the active editorial identity genuine, compact and synchronized',()=>{
    expect(js).toContain('data-name="${esc(p.name)}"');
    expect(js).toContain("(p.technologies || []).slice(0,2)");
    expect(js).toContain("identity.querySelector('strong').textContent=current.dataset.name");
    expect(css).toContain('--folio-status-gap:24px');
  });

  it('preserves the fixed Data Lab row contract',()=>{
    expect(css).toContain('#data-lab .data-lab-card:nth-child(1){grid-column:span 7}');
    expect(css).toContain('#data-lab .data-lab-card:nth-child(2){grid-column:span 5}');
    expect(css).toContain('#data-lab .data-lab-card:nth-child(3){grid-column:span 5}');
    expect(css).toContain('#data-lab .data-lab-card:nth-child(4){grid-column:span 7}');
    expect(css).toContain('grid-auto-flow:row');
    expect(css).not.toContain('grid-auto-flow:dense');
  });
});

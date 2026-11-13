import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('public portfolio visual source of truth', () => {
  const entry = file('vercel-site/lib/index-page.ts');
  const visual = file('vercel-site/public/atelier/experience.css');
  const responsive = file('vercel-site/public/atelier/mobile-ui.css');
  const interaction = file('vercel-site/public/atelier/index.js');

  it('loads a single edition stylesheet after the functional foundations', () => {
    expect(entry).toContain('/atelier/index.css');
    expect(entry).toContain('/atelier/mobile-ui.css');
    expect(entry).toContain('/atelier/experience.css');
    expect(entry).not.toContain('/atelier/v43.css');
    expect(entry).not.toContain('/atelier/v44.css');
    expect((entry.match(/atelier\/experience\.css/g) ?? []).length).toBe(1);
  });

  it('does not keep obsolete fan animations or the second-generation dock', () => {
    expect(responsive).not.toContain('Design lock v2');
    expect(responsive).not.toContain('folio-reference');
    expect(responsive).not.toContain('fixed fan deck');
    expect(visual).not.toContain('@keyframes folio-reference');
    expect(visual).not.toContain('.ring-orange{border-color:#e56c37}');
    for (const path of ['vercel-site/public/atelier/v43.css',
                        'vercel-site/public/atelier/v44.css',
                        'rules.md']) {
      expect(existsSync(resolve(process.cwd(), path))).toBe(false);
    }
  });

  it('keeps selected work centered and free of opaque navy chrome', () => {
    expect(visual).toContain('left:50%!important');
    expect(visual).toContain('width:min(100%,1120px)!important');
    expect(visual).toContain('backdrop-filter:blur(18px)');
    expect(visual).toContain('grid-template-columns:minmax(0,1.16fr) minmax(0,.84fr)');
    expect(visual).not.toContain('background:#182431!important');
  });

  it('uses fast but accessible motion without accelerating the skill conveyor', () => {
    expect(interaction).toContain('setTimeout(() => { show(active + 1); resume(); }, 1100)');
    expect(interaction).toContain('setTimeout(() => { show(demoIndex + 1); schedule(); }, 2400)');
    expect(visual).toContain('animation-duration:1.1s');
    expect(responsive).toContain('52s + var(--rail) * 7s');
    expect(visual).toContain('@media(prefers-reduced-motion:reduce)');
    expect(visual).toContain('html[data-motion=reduced]');
  });

  it('keeps first-visit preferences and one current design brief', () => {
    const direction = file('design.md');
    expect(direction).toContain('Cinematic Liquid Glass Editorial');
    expect(direction).toContain('experience.css');
    expect(visual).toContain('#panel.prefs');
    expect(existsSync(resolve(process.cwd(), 'docs/quality-lock/CINEMATIC_LIQUID_GLASS_WIREFRAME.md'))).toBe(true);
    expect(existsSync(resolve(process.cwd(), 'docs/quality-lock/RELEASE.md'))).toBe(true);
  });
});

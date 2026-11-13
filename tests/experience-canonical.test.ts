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
    expect(visual).toContain('background:transparent!important');
    expect(visual).toContain('transform:perspective(1100px) translate3d(-50%');
    expect(visual).not.toContain('background:linear-gradient(180deg,#e9e6e1,#d7d2cc)');
    expect(visual).not.toContain('conic-gradient(var(--ring-color)');
    expect(visual).not.toContain('dock-pin');
    expect(visual).not.toContain('dock-trigger-rings');
    expect(visual).not.toContain('is-pinned');
    expect(interaction).not.toContain('dock-pin');
    expect(interaction).not.toContain('ring-orange');
    expect(interaction).not.toContain('dock-trigger-rings');
    expect(interaction).not.toContain('setDesktopDock');
    expect(interaction).toContain('CSS owns dock expansion');
    expect(visual).toContain('transition:width .48s');
    expect(interaction).not.toContain("folio.addEventListener('mousedown'");
    expect(interaction).not.toContain("folio.addEventListener('mousemove'");
    expect(interaction).not.toContain("folio.addEventListener('mouseup'");
    expect(interaction).toContain("mountScene($('.scene canvas'))");
    expect(interaction).toContain('mountChoreography()');
  });

  it('uses fast but accessible motion without accelerating the skill conveyor', () => {
    expect(interaction).toContain('setTimeout(() => { show(active + 1); resume(); }, 1100)');
    expect(interaction).toContain('setTimeout(() => { show(demoIndex + 1); schedule(); }, 2400)');
    expect(visual).toContain('animation-duration:1.1s');
    expect(responsive).toContain('52s + var(--rail) * 7s');
    expect(interaction).toMatch(/show\(0\);\r?\n  resume\(\);/);
    const folio = interaction.slice(interaction.indexOf('function mountProjectFolio()'), interaction.indexOf('function mountDemoTheatre()'));
    expect(folio).not.toContain('IntersectionObserver');
    expect(folio).not.toContain('hovering');
    expect(folio).not.toContain('document.hidden');
    expect(interaction).not.toContain('id="motion"');
    expect(interaction).not.toContain("read('reduced'");
    expect(visual).not.toContain('data-motion=reduced');
  });

  it('retains one active dock state and no unreachable motion-mode branches', () => {
    const words = file('vercel-site/public/atelier/words.js');
    const scene = file('vercel-site/public/atelier/scene.js');
    const choreography = file('vercel-site/public/atelier/choreography.js');
    const direction = file('design.md');
    expect(words).not.toContain('pinNavigation:');
    expect(scene).toContain('export function mountScene(canvas) {');
    expect(choreography).toContain('export function mountChoreography() {');
    expect(scene).not.toMatch(/\breduced\b/);
    expect(choreography).not.toMatch(/\breduced\b/);
    expect(direction).toContain('44px collapsed, 196px expanded');
    for (const oldToken of ['--glass-ink','--glass-paper','--glass-warm','--glass-border','--silver','--steel']) {
      expect(visual).not.toContain(oldToken);
    }
  });

  it('keeps first-visit preferences and one current design brief', () => {
    const direction = file('design.md');
    expect(direction).toContain('Cinematic Liquid Glass Editorial');
    expect(direction).toContain('experience.css');
    expect(visual).toContain('#panel.prefs');
    expect(existsSync(resolve(process.cwd(), 'docs/quality-lock/SHOWCASE_VIDEO_LOCK.md'))).toBe(true);
    expect(existsSync(resolve(process.cwd(), 'docs/quality-lock/RELEASE.md'))).toBe(true);
  });
});

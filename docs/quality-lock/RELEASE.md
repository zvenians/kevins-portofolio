# Public portfolio release gate

**Current work:** Cinematic Liquid Glass Editorial, 13 November 2026
**Target:** `portfolio-kevins.vercel.app`
**State:** UNDER VERIFICATION. A successful commit or preview deployment is not evidence of full production acceptance.

The current direction is in [design.md](../../design.md); desktop and mobile acceptance is in [the wireframe](SHOWCASE_VIDEO_LOCK.md).

## Required automated checks

```bash
npm ci
npm ci --prefix apps-script
node apps-script/build.mjs
node vercel-site/sync.mjs
npm --prefix vercel-site run build
npm test
npm run lint
```

The CI workflow must show passing source and browser checks against the **latest commit**, not only earlier merged work.

Browser checks: 320, 390, 768, 1440 and 1920px; project center error < 4px; active card right bound within viewport; no document-level horizontal overflow; six valid work routes, loaded real preview images, autoplay from initial render (even before scrolling), hover/focus continuity, manual keyboard/drag controls, no retired motion-mode checkbox, functional demo tabs, responsive form interaction, and visible dock navigation.

## Active visual contract

- Only `vercel-site/public/atelier/experience.css` defines the public cinematic visual edition. `index.css` and `mobile-ui.css` remain functional foundations; other CSS files are limited to their distinct application features.
- No legacy v43/v44 stylesheet import, legacy design-lock fan, or previous colored icon dock.
- Active work cards are geometrically centered. Liquid glass surfaces cannot obscure screenshots or text.
- Work autoplay is 1,100ms; demo autoplay is 2,400ms; skill track remains purposefully slow.
- Desktop collapsible dock and touch drawer must both work.
- First-visit preferences dialogue must remain accessible, responsive and dismissible.
- No retired on-site motion checkbox/storage/alternate-state rules. Showcase starts at mount; no intersection/hover/focus pause gate. Keep visual pacing non-flashing and keyboard interactions usable.

## Manual checks that automation cannot certify

Real iOS Safari and Android Chrome touch behavior, cross-browser GPU variation, visual readability of screenshots, mouse-pointer handoff after drag and accessibility keyboard traversal must be recorded before claiming broad production acceptance. All untested checks remain **NOT TESTED** rather than silently marked green.

## Publication policy

Changes are proposed through a branch and pull request; merge/deployment only after the required enabled checks pass. No production status is implied by this document. GitHub history retains old iterations; old runtime overrides and obsolete direction files must not be restored.

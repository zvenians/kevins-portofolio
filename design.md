# Portfolio visual direction

**Current public direction:** Cinematic Liquid Glass Editorial
**Effective:** 13 November 2026
**Runtime:** `vercel-site/`, using the public Atelier shell.
**Implementation:** `vercel-site/public/atelier/experience.css`
**Wireframes:** `docs/quality-lock/CINEMATIC_LIQUID_GLASS_WIREFRAME.md`

## Identity

The portfolio is a curated digital exhibition. It should look human-made, cinematic, and precise rather than like a generic SaaS site. Type, carefully selected project screenshots, editorial composition, and a few choreographed interactions communicate the work.

Use warm ivory, charcoal ink, titanium grey and restrained champagne. The portfolio shell is light, not dark-first. Dark UI may exist inside authentic project screenshots and independent demo products. Do not redraw, tint, or hide those real images to fit the shell.

Liquid glass is a *material choice*, not a universal effect: use translucent neutral surfaces where they provide depth or help focus attention. Avoid neon rings, blue opaque screenshot frames, decorative gradients, glowing borders, excessive blur, and rounded cards repeated everywhere.

## Layout

The active project must be centered within its available content area at every viewport, not pushed to the right by navigation or transforms. Show one clearly readable active project, with remaining projects as restrained supporting layers. Do not turn the work section into an infinite sideways conveyor or an illegible stack.

Hero is the primary cinematic moment. Work reveals form the secondary highlight. The Demo Theatre uses distinct lateral transitions. Forms are calmer, with explicit field state, labels and real submit behavior. Keep section spacing varied but intentional.

Navigation is a small fixed monochrome dock: about 56px collapsed, 202px expanded, 16px icons inside 32px neutral frames. Touch uses a compact tab and a navigable mobile drawer. Expanded and collapsed states must not cover content unexpectedly.

## Motion

The direction is **responsive and refined**, never aggressively animated. Motion has one focal point per viewport and uses transform/opacity where possible.

- Work autoplay: 1,100ms per project; 420ms transition.
- Demo autoplay: 2,400ms per demo; approximately 260ms lateral reveal.
- Case opening: approximately 260ms.
- Button feedback: approximately 160ms.
- Navigation expansion: approximately 440ms.
- Skill rail: deliberately slow and right-to-left, keeping the previously approved rhythm (52–73 seconds per loop).
- Avoid perpetual float/glow on product imagery, form fields, and multiple simultaneous sections.

Honor the visitor's reduced-motion preference and the site's own control. Stop autoplay when not visible and while the user is focusing or exploring the active work; manual keyboard and touch interactions remain available.

## Engineering boundary

The public design is authored only in `vercel-site/public/atelier/experience.css` alongside the functional foundation `index.css`, `mobile-ui.css`, and feature-specific stylesheets. Do not recreate `v43.css`, `v44.css`, an older `Design lock v2`, or parallel presentation overrides.

`apps-script/source/` remains the canonical source for the separate Apps Script presentation and demo engines. A new public shell design must not be implemented by editing generated `apps-script/Code.gs`, `vercel-site/generated/template.ts`, or hashed bundle artifacts directly. Those are rebuilt through the repository scripts when their own source changes.

The separately existing Next/Firebase application is not the deployed public portfolio. Do not use its superseded product specs to override the Atelier UI.

## Quality gates

1. No active project clipping, off-center focal cards, horizontal page overflow, or hidden focusable routes at 320, 390, 768, 1440 and 1920px.
2. Authentic previews, captions and links remain available.
3. Both swipe/drag and keyboard state changes work; no click event opens a project after a drag.
4. Navigation is usable by mouse, keyboard and touch with visible focus and at least 44px touch targets.
5. Forms have real labels, clear error and success behavior, and readable contrast.
6. Reduced-motion visitors get a stable composition without essential information hidden.
7. Existing unit, integration, accessibility and browser tests pass. Physical-device coverage and performance must be reported accurately.
8. Changes to runtime behavior require a branch, reviewed diff and passing checks before deployment.

This document is the current **visual direction**, not a replacement for executable tests or authoritative product data.

# Showcase video lock and public UI contract

**Edition:** 2026-11-13 · **Runtime:** `vercel-site/public/atelier/`
**Canonical direction:** `design.md`
**Source media:** `WhatsApp Video 2026-11-12 at 10.16.23(1).mp4` supplied by the owner. The video, `showcase_reference_sequence.png` and `PORTFOLIO_VIDEO_LOCK_WIREFRAME.html` are distributed with the Codex handoff. The video outranks all illustrative wireframes and mockups.

## Reference, not approximation

The selected six real projects are a **vertical perspective stack** sharing a single horizontal centerline. The front/active image is the lowest and largest, with older cards higher, smaller and behind it. A new card enters from below and advances continuously in depth. The 6-to-1 transition must look like every other transition: no flash, snap, reorder jump, or empty state. Project thumbnails and labels are authentic; video-player and phone overlays are excluded.

The showcase starts its **1.1-second autoplay scheduler at component mount**, before visitors scroll to the section. It does not deliberately pause for hover, focus, modal, offscreen state, or document visibility. Browser background throttling is outside the site's control. Keyboard arrows and drag remain functional; activating a card still opens its case study. Progress and active index remain synchronized.

The stage is **neutral/transparent**, with no yellow-brown gradient backdrop and no oversized navy device bezel. The active card center must match the usable work-stage center within 4px, including at 320/390/430/768/1024/1440/1920px. There must be no horizontal overflow or cropped active card.

## The dock is attached to the viewport, not carved inward

The left navigation material touches viewport `x=0`. Convex outer shoulders/reverse fillets bridge the top and bottom of the dock to the viewport edge. Do not cut a wavy indentation into the dock's content area. Default collapsed visible width target is approximately 40–44px, with 44px interaction rows. Expanding intentionally reveals a ~196px panel through an eased width/clip/geometry morph. Hovering a collapsed icon creates a soft, temporary bubble zoom. Icons are monochrome and optically aligned; no color-coded arcs.

## Section-by-section desktop wireframe

```text
LEFT EDGE              MAIN CONTENT (independent of dock width)
┌┐ ┌─────────────────────────────────────────────────────────────┐
││ │ HERO: personal typography + existing responsive 3D sculpture│
││ ├─────────────────────────────────────────────────────────────┤
││ │ SELECTED WORK                                               │
││ │                  [rear card    05]                           │
││ │                 [mid card      04]                           │
││ │                [mid card       03]                           │
││ │               [rear card      02]                            │
││ │              [ACTIVE FOREGROUND 01]                          │
││ │                 01 / 06  progression                         │
││ ├─────────────────────────────────────────────────────────────┤
││ │ DEMO THEATRE: lateral cinematic stage (not the work stack)   │
││ ├─────────────────────────────────────────────────────────────┤
││ │ DATA LAB: asymmetric featured engineering composition        │
││ ├─────────────────────────────────────────────────────────────┤
││ │ SKILLS: cinematic technical editorial rails / slow marquee  │
││ ├─────────────────────────────────────────────────────────────┤
││ │ HOW I WORK: six-stage narrative timeline                    │
││ ├─────────────────────────────────────────────────────────────┤
││ │ ABOUT: general practice, personal editorial introduction     │
││ ├─────────────────────────────────────────────────────────────┤
││ │ START A PROJECT: 4-stage immersive but functional brief flow │
└┘ └─────────────────────────────────────────────────────────────┘
```

On phones, preserve the vertical stack on the available viewport width with an unobtrusive edge tab that opens a properly accessible navigation drawer. Demo Theatre uses mobile-first horizontal tabs/one large live panel; Data Lab and Skills use intentional nonuniform responsive arrangements; forms keep all labels, progress, validation and review.

## Motion tool ownership — no overlapping engines

- **Motion for JavaScript** owns work deck interpolation, dock bubble/expansion micro-interactions, and UI/card state transitions.
- **GSAP + ScrollTrigger** owns editorial section reveals and scroll-linked cinematic composition only. GSAP must not animate transforms already owned by Motion.
- Preserve the existing 3D hero scene; do not replace it with generic Spline or add a heavy second GPU canvas without measured benefit.
- Native SVG/CSS owns the edge-attached fillet silhouette. Do not install Rive without a real .riv asset and meaningful use case.
- Lenis is optional and must be omitted if native scrolling plus ScrollTrigger is already smooth. Never hijack scroll or harm touch behavior.

Both design libraries are npm modules; the public Atelier uses vanilla JS in `vercel-site/public/atelier/`. Bundle/version them locally through the project build tooling. Do not use unpinned CDN `latest` imports or expose API tokens.

## Verification and acceptance

- Real browser video recorded with initial page load and no initial scroll shows at least two work-card advances.
- A hover, focus, hidden/offscreen stage, manual drag and route click do not break the work deck.
- All six project case-study links resolve, project names and screenshots remain correct, including wedding and ATLAS.
- Dock uses edge-connected outer shoulder fillets, collapsed width ~40–44px, bubble hover, a smooth ~196px expanded state, and passing keyboard/mobile tests.
- Demo Theatre's horizontal choreography is distinct from the work deck. Data Lab links, Skills detail and marquee, six How I Work stages, all four About locale variants, and the four-stage inquiry handoff remain available.
- Source/build/lint/tests and browser checks pass on the same final commit. Record findings and links to artifacts; do not treat screenshots or a Vercel preview as evidence of production deployment.
- There is no in-site **Reduce Motion checkbox, persistent preference or alternate UI mode**. No flashing transitions, hidden essential content, scroll trapping or broken keyboard navigation.

Historical horizontal showcase wireframes, tinted-stage design locks and old reduced-motion UI instructions are retired. Do not resurrect them or add a new override CSS edition.

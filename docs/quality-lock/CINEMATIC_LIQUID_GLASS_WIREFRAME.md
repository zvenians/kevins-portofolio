# Cinematic Liquid Glass: Interactive Portfolio Wireframe

**Edition:** 2026-11-13 · **Target:** Public portfolio, desktop and touch · **Status:** Implemented visual direction with acceptance gates.

## Design read

A personal digital exhibition for prospective clients, employers, and creative collaborators. It should feel editorial, tactile, and deliberate rather than like a dashboard or a neon application.

- **ENERGY:** 3, expressive primarily in hero and major transitions.
- **RHYTHM:** 3, calm text alternating with cinematic artwork, focused work previews, and functional forms.
- **MOTION:** 2, responsive choreography; one controlled motion focal point per viewport.
- **Palette:** warm ivory, titanium, charcoal ink, muted champagne accent. No bright icon rings and no solid navy UI backing.
- **Material:** liquid glass as a framing material with thin light-catching borders, selective translucency, subtle refraction; never full-page glassmorphism.

## Wireframe A: Desktop, wide viewport

```text
┌─────┬──────────────────────────────────────────────────────────────────────────────┐
│  ◯  │        HERO / Identity                                                  01   │
│  ⧉  │                                                                            │
│  ▷  │  Kevin.                          Sculptural, reactive 3D visual              │
│     │  Simatupang.                    [subtle depth, no foreground clutter]       │
│  ⚙  │  Creative programmer                                                      │
│     │  [Selected work]    [Interactive demos]                                   │
│     ├──────────────────────────────────────────────────────────────────────────────┤
│     │        SELECTED WORK                                                       │
│     │        Six selected projects in one cinematic viewing stage                │
│     │                                                                            │
│     │          ┌────────────────────────────────────────────────────────┐        │
│     │          │  ACTUAL PROJECT IMAGE  │  Category                    │        │
│     │          │                        │  Editorial project title     │        │
│     │          │                        │  Short project summary       │        │
│     │          │                        │  Open case study             │        │
│     │          └────────────────────────────────────────────────────────┘        │
│     │             ─────────────────────────────────────  01 / 06                 │
│     │       Other projects revealed as subtle sheets behind, not a dark pile     │
│     ├──────────────────────────────────────────────────────────────────────────────┤
│     │        DEMO THEATRE                                                        │
│     │        ┌────────────────┬─────────────────────────────────────────┐         │
│     │        │ 01 Manga       │                                         │         │
│     │        │ 02 Dining      │        ACTIVE LIVE DEMO IMAGE           │         │
│     │        │ 03 Travel      │         horizontal reveal               │         │
│     │        │ 04 Home care   │                                         │         │
│     │        │ 05 Creative    │                                         │         │
│     │        │ 06 Wedding     │                           [←] 02/06 [→]│         │
│     │        └────────────────┴─────────────────────────────────────────┘         │
│     ├──────────────────────────────────────────────────────────────────────────────┤
│     │    DATA / APPLICATIONS     : editorial cards with restrained depth        │
│     │    CAPABILITIES           : slow right-to-left logo tracks                 │
│     │    CONTACT / BRIEF        : natural form layout and clear active fields     │
└─────┴──────────────────────────────────────────────────────────────────────────────┘
```

The collapsed rail occupies about 56px including its inner material. Icons are monochrome, 16px drawing area, in 32px rounded-square frames. At hover, focus, or explicit pin, it widens to a 202px text navigation surface. Touch uses a discreet 43px edge tab that opens a real navigation drawer.

## Wireframe B: Phone, compact viewport

```text
┌────────────────────────────┐
│ ◇                          │
│ KEVIN                      │
│ SIMATUPANG.                │
│ Creative programmer        │
│ [See work]  [Demos]        │
│        3D visual           │
├────────────────────────────┤
│      SELECTED WORK         │
│   ┌────────────────────┐   │
│   │ Real project image │   │
│   ├────────────────────┤   │
│   │ Project title      │   │
│   │ Summary            │   │
│   └────────────────────┘   │
│     01 / 06  ──────        │
├────────────────────────────┤
│  DEMOS  [01] [02] [03]     │
│         [04] [05] [06]     │
│  ┌──────────────────────┐  │
│  │ active demo          │  │
│  └──────────────────────┘  │
├────────────────────────────┤
│  APPLICATION CARDS         │
│  SKILL MARQUEE             │
│  CONTACT FORM              │
└────────────────────────────┘
```

No separate miniature desktop replica, no overflowing cards, no hover-only actions. The active project can be changed by drag/swipe or arrow keys; tapping opens the actual case study. Input fields and navigation remain at least 44px touch targets.

## Timing, transitions and deliberate restraint

| Experience | Motion | Duration | UX purpose |
|:--|:--|--:|:--|
| Work folio | One card steps forward, supporting sheets settle softly | 420ms | Communicate which work is selected |
| Work autoplay | Advance to next case | 1,100ms per project | Twice the previous tempo |
| Project opening | Brief zoom and continuation into case study | 260ms | Visual continuity without blocking navigation |
| Demo tabs | A lateral horizontal reveal, not a folio clone | 260ms | Make state change legible |
| Demo autoplay | Advance active demonstration | 2,400ms per demo | Twice the previous tempo |
| Buttons | 1-2px feedback | 160ms | Click/touch confidence |
| Cards | 5px restrained lift, no perpetual float | 320ms | Indicate interaction |
| Sidebar | Soft lateral width expansion | 440ms | Reveal labels without visual shock |
| Skills | Slow leftward continuous marquee | 52-73s | Legible technology context, previous preference retained |

**Cinematic moment hierarchy:** hero artwork first; project reveal second; demo scene third. Forms intentionally remain calm. Avoid synchronized motion of all of these elements.

## Implementation rules

1. Center the work stage within the actual content container, not viewport coordinates or hardcoded offsets.
2. Use one active project with readable description, six selectable entries, and restrained stacked depth.
3. Retain authentic project media, including embedded dark areas native to the screenshots; remove the app's own opaque navy framing.
4. Keep navigation monochrome and the collapsed rail visually light.
5. Use liquid glass with purpose: active project surface and selective interactive stages, not every card and modal.
6. Keep contrast WCAG AA, visible keyboard focus, image alternatives and reduced-motion support.
7. Prefer transform and opacity transitions; no forced scroll takeover and no infinite rotating icons.
8. Preserve existing routes, bilingual content, demo links, form submission and project data.
9. Test at 320, 390, 768, 1440, 1920px and both reduced-motion and full-motion settings before calling release complete.

## Visual acceptance

- A vertical line through the center of the selected-work content intersects the center of the active card at all target widths.
- No text, metadata or active card may be cropped by the right side of the viewport.
- Collapsed navigation is no longer a colored stack of glowing circular icons.
- No opaque navy rectangle is used for the UI surface around any portfolio image.
- The work autoplay count advances roughly twice as fast as previously and remains manually navigable.
- Demo Theatre is visibly different from work: horizontal, staged, focus-first.
- When reduced motion is requested, the selected project is fully visible, interactive, and not cycling.

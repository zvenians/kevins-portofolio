# Portfolio quality lock baseline

Date: 2026-11-09

## Source state

- Working branch: `feature/portfolio-quality-lock`
- Showcase parent: `806bb2686a4f2bc54ccdbeea9f82aa607633fcd2`
- Production branch observed: `origin/main` at `c02e1791adc21f2e95b5a7f4437a477f844772a9`
- Public runtime: `vercel-site/`
- Canonical presentation source: `apps-script/source/`, followed by `apps-script/build.mjs` and `vercel-site/sync.mjs`
- Independent portfolio shell and flagship demos: `vercel-site/public/atelier/` and `vercel-site/public/edisi/`

The production commit is not merged wholesale because its tree removes showcase assets, the current CV PDF, and cinematic route files. Production maintenance changes will be evaluated and carried forward selectively.

## Home visual lock

The following Home properties are immutable for this work:

- navigation structure and wordmark
- hero headline, paragraph, CTA labels and positions
- hero grid, canvas bounds, spacing and background
- section order, selected work, demo gallery, skills, process, profile, inquiry and footer
- typography scale, palette, screenshots and copy outside the sphere canvas

The only permitted Home visual change is inside the existing sphere canvas: material response, lighting, pointer and touch behavior, graceful fallback, and performance controls.

## Baseline observation

The local preview was inspected at `http://terminal.local:4173/` before source edits.

- Desktop: 1365 x 768 cloud browser, Home visible with the established black and ivory composition, fixed hero canvas bounds and existing pearl sphere.
- Mobile contract: 390 px and 430 px layouts must preserve the same Home content while reflowing the existing composition.
- Browser accessibility tree contained all current navigation, hero actions, work entries, demo entries, skill links, inquiry fields and footer controls.
- Automated local screenshot capture is unavailable because the executor has Playwright libraries but no browser executable. Cloud-browser screenshots remain the visual evidence source. This limitation does not count as a mobile or physical-device pass.

## Current functional map

| Experience | Route | Canonical source | Primary verification |
| --- | --- | --- | --- |
| Home sphere | `/` | `vercel-site/public/atelier/scene.js` | pointer, touch, pause, reduced motion, fallback |
| Portfolio shell | `/work`, `/demos`, `/capabilities`, `/contact` | `vercel-site/public/atelier/` | navigation, locale, keyboard, responsive layout |
| Restaurant | `/edisi/resto.html` | `vercel-site/public/edisi/` | customize, basket, review, demo receipt |
| Travel | `/edisi/travel.html` | `vercel-site/public/edisi/` | dates, hotel, transport, review, e-ticket |
| Home care | `/edisi/care.html` | `vercel-site/public/edisi/` | nurse, duration, address, cost, reschedule/cancel |
| NOVA | `/nova` and subroutes | `vercel-site/public/atelier/nova.js` | routes and work filter |
| Legacy applications | `/work/:slug?launch=1` | `apps-script/source/` plus generated public assets | primary action and honest local state |
| Data and research tools | workbench routes | `apps-script/source/Lab.js`, `OperationsResearch.js`, `StudioSystems.js`, `data-engine.ts` | calculations, table states, export |
| Academic support | `/academic-support` | `vercel-site/public/atelier/academic.js` | seven-step ethical consultation handoff |

## Design read

- Portfolio shell: personal creative portfolio for prospective collaborators, premium editorial and cinematic language, ENERGY 3 / RHYTHM 3 / MOTION 2.
- Product demos: independently art-directed applications whose layout follows each task, with visible simulation boundaries.
- Student workspace: learning and consultation tools for students, warm editorial workspace, ENERGY 2 / RHYTHM 2 / MOTION 1-2.

## Decision reasons

- Existing Home composition stays untouched because it is the approved identity and the user explicitly locked it.
- Sphere lighting is the sole Home polish because it raises material realism without moving surrounding content.
- Data workspaces use table and step affordances because the main job is to inspect, change, understand and export data.
- Academic support uses a stepwise form because students need plain-language guidance and review before opening an external contact app.
- ui-main patterns guide semantics, labels, states and keyboard behavior; React components are not copied into functioning vanilla JavaScript areas.

## Risks and open gates

- Physical iOS Safari and Android touch behavior cannot be passed in this environment and must remain `NOT TESTED` until observed on devices.
- GPU rendering in the cloud browser may differ from consumer hardware; frame measurements must identify the tested renderer.
- `origin/main` and the showcase branch diverge. A broad merge would remove current showcase work, so integration needs selective review.
- Generated Apps Script and Vercel bundles must stay synchronized with canonical source changes.
- Public production promotion stays blocked until all enabled interactions, visual comparisons, accessibility checks, exports and release documents pass.

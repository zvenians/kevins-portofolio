# Studio repair / 26 October 2026

## Implemented

- Separate archive workspace, guided booking concierge, and editorial commerce presentation. Original product illustrations replace title-only product art.
- Four data compositions with the existing reconciliation, validation, budget, and maintenance calculations retained. Data and research sections are directly visible, not hidden inside workspace disclosures.
- Seven web/data thumbnails generated from the real initial demo DOM during `apps-script/build.mjs`. Sandboxed, script-free iframe previews are labelled static. Nine creative previews retain shared original SVG artwork.
- Restored slide text editing/reset and static SVG export, logo name/initials/color controls and small-size checks. Invitation name/date updates are consistent in the opening and dedication.
- Cart hydration validates products, variants, integer quantities, and stock limits.
- Content fetches coalesce concurrent requests, cache successes, and use a three-second timeout with a short retry cache on failure. A fallback CV state does not claim the owner has not uploaded a CV.

## Verification

- Vitest DOM/logic coverage: navigation, three creative directions per studio, archive search/folders/upload, booking validation/review/reset, data recalculation, tampered carts, and content fallback.
- Chromium responsive iframe checks: 17 pages/directions at widths 360, 390, 768, 1024, and 1440. No document-level horizontal overflow in 85 checks. This is not certification that every intermediate state is visually perfect.
- Browser interaction: booking review using fictional details; slide Play/Pause/Next; visual mobile booking inspection.
- Next production build and TypeScript check. Google Script content requests timed out in the local build and the fallback was exercised.

## Boundaries

- No production storage, payments, or real RSVP/booking writes in demos.
- Slide export is SVG, not an authored PowerPoint Morph deck.
- Apps Script backend deployment, authenticated CV replacement, and contact delivery were not changed or end-to-end verified in this repair.
- Firefox, Safari, physical-device touch, and field Core Web Vitals are not measured here.
- Source of truth: `apps-script/source`. Regenerate bundled artifacts with `node apps-script/build.mjs` before deployment. New system demo previews are registered in `apps-script/studio-previews.mjs`; gallery metadata lives in `Gallery.js`.

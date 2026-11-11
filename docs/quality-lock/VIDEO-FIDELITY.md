# Real Project fan motion — 2026-11-11

The public Atelier showcase now contains one set of six links. Static card angles are -28, -15, 0, 15, 28 and 38 degrees. A single CSS parent runs the requested 5.6-second rest/rise/hold/return/rest cycle. The other portfolio sections are unchanged by this patch.

## Evidence

Browser: installed Google Chrome, headless, Windows. Source video duration: 6.72 seconds. Source frames at 0.5, 2.5 and 4.8 seconds were extracted in Chromium and compared visually with the rendered captures. Product imagery and labels intentionally differ from the reference. The visible fan was adjusted after the first comparison: narrower cards, wider vertical spacing and distinct initial angles.

- [Initial phase](../../artifacts/folio-fidelity/384-0.5.png)
- [Peak phase](../../artifacts/folio-fidelity/384-2.5.png)
- [Return phase](../../artifacts/folio-fidelity/384-4.8.png)
- [Browser recording, including an uninterrupted full cycle](../../artifacts/folio-fidelity/384-cycle.webm)
- [Measured transforms and viewport results](../../artifacts/folio-fidelity/measurements.json)

| Check | Result |
| --- | --- |
| 384×848 peak translation | PASS: -19px X, -120px Y |
| Peak rotation | PASS: -14.999995 degrees |
| Return error | PASS: 0px X/Y, 0 degrees |
| Relative child transforms across phases | PASS: unchanged |
| 384×848, 390×844, 768×1024, 1440×900 | PASS: no page overflow, six loaded images, six valid routes |
| Keyboard focus and reduced motion | PASS in Chromium |
| Browser page errors | PASS: none |
| Physical iOS/Android and device performance | NOT TESTED |
| Full existing production release gate | BLOCKED: see RELEASE.md |

This is measured conformance to the supplied motion tolerances, not a claim of pixel-identical screenshots or comprehensive accessibility certification. The wedding capture is the existing Kevin & Naomi image; GitHub identifies https://wedding-demo-hazel.vercel.app as the homepage of zvenians/wedding-demo. Other image provenance remains in the project-shots README.

Anti-slop R-40 exception: no new pause/resume button, as explicitly requested by the owner. Keyboard focus pauses the parent; reduced motion presents a static scrollable list. The standalone Anti-slop and ui-main skill packages were unavailable; the explicit request and repository semantics guidance were followed.

Reproduce with `node scripts/verify-folio.cjs <reference.mp4>` with Playwright resolvable through NODE_PATH and the public frontend running on port 3000. Evidence belongs to this local verification; CI results are checked separately on the PR.

## Visual correction after the owner's desktop screenshot

The owner-provided production screenshot showed an unrotated, centered list with an internal gray-stage scrollbar. This was not the intended fan: the previous `prefers-reduced-motion` and saved `data-motion=reduced` fallbacks changed the entire layout to a vertical scrolling list. That is a visual defect, independent of whether motion is enabled.

This revision makes both modes share the **same diagonal six-card composition**. The normal mode animates only the parent through the previously calibrated 5.6-second choreography. Reduced motion disables animation but keeps every card's angle, offset, screenshot and link. The stage is clipped editorial artwork, not a separately scrolling region. Mobile cards have deliberate individual offsets and an increased width; desktop stage width is capped to avoid a huge empty gray canvas.

CI now runs a real-browser screenshot check at 384×848, 390×844, 768×1024 and 1440×900 and uploads the latest **`real-project-visual-<run id>`** artifact with moving and reduced-motion screenshots. The screenshots previously committed under `artifacts/folio-fidelity/` were produced **before this geometry correction** and must not be treated as evidence for this revision. Check the latest CI artifact instead.

Browser testing on real iOS/Android devices remains unverified. The older repository-wide release gate still applies.

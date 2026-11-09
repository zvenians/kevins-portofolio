# QA matrix

Date: 2026-11-09

| ID | Observed result | Status |
| --- | --- | --- |
| HOME-01 | Source changes outside the canvas do not alter Home content/layout; retained pixel-diff set unavailable | PARTIAL |
| SPHERE-01/02 | Sphere fallback rendered and drag was observed earlier; spring convergence/velocity tests pass | PASS (fallback) |
| SPHERE-03 | Horizontal capture threshold and `pan-y` contract implemented; no physical phone | NOT TESTED on device |
| SPHERE-04 | Pause/reduced motion, RAF cancellation and listener cleanup are implemented/tested | PASS |
| SPHERE-05 | Canvas fallback and context handlers exist; hardware WebGL restoration not exercised | PARTIAL |
| DEMO-01 | Restaurant selection → review → payment simulation → receipt passes in EN/ID/FR/ES | PASS |
| DEMO-02 | Travel selection, totals, review, ticket flow passes in EN/ID/FR/ES | PASS |
| DEMO-03 | Home-care selection, cost, review and cancel/change flow passes in EN/ID/FR/ES | PASS |
| DEMO-04 | NOVA/manga/wedding functional source tests pass; physical touch remains untested | PARTIAL |
| DEMO-05 | All published demos retain valid slugs, visuals, summaries and public work routing | PASS |
| DATA-01/02 | Reconciliation, locale parsing, operations and research unit cases pass | PASS |
| DATA-03 | Real XLSX generation/formula tests pass; desktop spreadsheet reopen not performed | PARTIAL |
| DATA-04 | Responsive CSS present; 390 px visual proof unavailable | NOT TESTED visually |
| STUDENT-01/02 | Full category → challenge → materials → collaboration → review handoff and validation pass | PASS |
| STUDENT-03/04 | No fake upload/payment/received state; privacy and integrity copy asserted | PASS |
| A11Y/RESP | Semantic/focus/reduced-motion source audit passes; full manual keyboard and physical device runs pending | PARTIAL |
| SEO | Route/sitemap/canonical/404 source compiles in public build | PASS (build) |
| CODE | 88 Vitest, 23 Apps Script, 14 multilingual flagship tests; public Next build exit 0 | PASS |
| PERF | Adaptive controls and frame instrumentation exist; representative FPS/p95 unmeasured | NOT MEASURED |

Commands executed:

- `node apps-script/build.mjs && node vercel-site/sync.mjs` — exit 0
- `npm test` — 88/88 Vitest and 23/23 Apps Script tests
- `node --experimental-vm-modules --test tests/atelier-flows.cjs` — 14/14
- `npm --prefix vercel-site run build` — exit 0

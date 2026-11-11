# Release decision

Date: 2026-11-09

## BLOCKED FOR PRODUCTION

The implementation may be used for a feature-branch preview only. Unit/integration/build gates pass, but production promotion remains blocked by missing retained multi-viewport screenshots, physical iOS/Android touch tests, real-device WebGL/performance measurements, manual keyboard/contrast evidence, and reopening a generated XLSX in a desktop spreadsheet reader.

Do not merge to `main`, promote a Vercel production build or assign the production domain until these gates are documented as passed.

## PR #16 verification update — 2026-11-11

- GitHub Actions `Source and behavior tests`: **PASS** on commit `23d59b8`.
- Vercel preview build: **PASS**.
- Generated Apps Script and Vercel assets: **PASS**, reproducible with no diff.
- Unit/integration tests: **PASS** (94 Vitest tests and 24 Apps Script tests).
- Lint and public frontend production build: **PASS**.
- Chromium 384×848, 390×844, 768×1024 and 1440×900: **PASS** for overflow, project routes, image loading, browser keyboard focus, reduced motion and page errors. Retained evidence is documented in `VIDEO-FIDELITY.md`.
- Physical iOS Safari and Android touch testing: **NOT TESTED**.
- Real-device WebGL and performance measurements: **NOT TESTED**.
- Manual contrast evidence: **NOT TESTED**.
- Generated XLSX reopened in a desktop spreadsheet reader: **NOT TESTED**.

The production decision remains **BLOCKED**. Passing automated checks and the Vercel preview does not override the outstanding physical-device and manual release gates.

# The Living Index — Apps Script edition

This edition runs its website, owner tools, and backend in Google Apps Script. Google Sheets holds structured content. Private Google Drive files hold media and resume versions. The existing Next.js application is preserved separately.

## Installation

1. Build with `node apps-script/build.mjs` and test with `node --test apps-script/tests/core.test.mjs`.
2. Paste generated `apps-script/Code.gs` into an Apps Script project using the V8 runtime.
3. Run `setupLivingIndex` from the editor as the owner. Review Google's Drive, Sheets, and identity permissions. Setup creates its own spreadsheet and private media folder; IDs are stored in Script Properties.
4. Deploy a web app, execute as the owner, public access. Test owner access separately with the installing Google account. If Google withholds the active identity, administration fails closed. Use an owner-only deployment for admin if necessary.
5. Open the published URL. Owner access uses `?page=admin`. Project share URLs use `?project=slug`. The current resume is accessed through `#resume`.
6. After code changes, update the existing deployment to a new version. Content changes do not require redeployment.

Do not copy credentials or tokens into browser code. Google manages authorization; persistent login is not guaranteed. Revoked permissions or expired browser sessions require renewed authorization.

## Content workflow

Owner access supports adding and editing exhibits, categories, featured order, public/draft/private visibility, layout preview, private media uploads, and public contact settings. Projects render from records, so no homepage layout changes are required when adding entries. Keep IDs and slugs stable. An updatedAt check prevents overwriting a concurrent app edit.

The Projects sheet stores a JSON content record and separate visibility/order controls. Prefer the admin form. Manual sheet edits bypass application validation and concurrency checks. Only grant sheet edit access to trusted owners.

Resume: upload a PDF (5 MB maximum), preview the draft, then explicitly Publish. Publishing replaces the current public version. Unpublish removes public access through the app. Old versions remain private. PNG/JPEG media are limited to 4 MB and become publicly retrievable only when attached to a public project. File signatures and MIME types are checked; this is not malware scanning.

## Source map

- `source/Server.gs`: authentication, database, content validation, private storage, audit records.
- `source/Index.html`, `source/Styles.css`: shell and visual system.
- `source/Client.js`, `source/Lab.js`, `source/Admin.js`: public experience, demonstrations, owner interface. These combine into a shared closure during build.
- `source/projects.json`: first-install seed with verified repository revisions. Later content lives in Sheets.
- `source/data-engine.ts`: pure data calculations used by the lab and tests.
- `Code.gs`: generated deployable distribution. Rebuild instead of editing generated asset strings.
- `preview/index.html`: local public preview. Server operations deliberately fail with an explanatory message outside Apps Script.

## Evidence and demonstration boundaries

Six public repository records were inspected on 22 October 2026. Evidence links pin audited revisions. Galilea Origins contains only a README and is a historical marker. Zvenians is an educational exploration. Naomi's personal photos and letters are not reused. All project visuals are labelled illustrations unless approved media is uploaded. No invented employers, clients, testimonials, or numerical business outcomes are included.

The six data exhibits use fictional records. Reconciliation compares original cost for 2025–2026 acquisitions and 2024 revaluation for earlier acquisitions. Missing values and duplicate identifiers do not silently become zero or matched records. Number cleanup requires explicit locale selection. Scheduling excludes visitor-specified dates; these are not an official holiday calendar.

Excel/PDF export libraries are loaded only on demand from pinned jsDelivr URLs. A failed load produces a user-facing error. The reconciliation workbook includes source-linked formulas and cached values; it is a fixed-size demonstration, not an unlimited import/reconciliation product.

## Release status and remaining gates

Local calculation, authorization guard, public/private response, PDF validation, and generated-script checks pass. Public rendering was inspected in Chrome. Before calling the release production-ready, verify the deployed owner/public sessions, PDF replacement and unpublished-file boundaries, all download flows, mobile layout, and browser history. Firefox/Safari and real-device performance have not been measured.

Apps Script serves HTML in Google's iframe wrapper. It does not offer the same SEO, canonical URL, sitemap, social metadata, custom domain, HTTP caching, or routing controls as a dedicated frontend host. These original brief requirements remain a documented platform limitation. No Core Web Vitals results or successful production deployment are claimed until measured/verified.

Contact initially uses the verified GitHub account. Add approved public email/LinkedIn/WhatsApp through owner settings. No CV is invented or published automatically.

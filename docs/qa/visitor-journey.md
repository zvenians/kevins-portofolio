# Visitor journey release

- Home: six concise sections; four real projects, three featured demos, four
  service entrances, profile and contact.
- `/studio`: the full 22-demo collection and working data/research tools.
- Studio categories and cross-page return links remain available on case pages.
- Real cases: role, stack, scope and repository history, with guided captions.
  The interface-detail view explicitly zooms the same verified screenshot.
  Project delivery dates/durations are not invented.
- Gallery previews: 22 actual demo captures, WebP, lazy loaded; no preview iframe
  documents or repeated embedded stylesheets.
- Presentation: minified JS/CSS with content-hashed filenames and immutable
  caching. Initial home renders only its own content. This is shared caching,
  not route-level code splitting.
- Language prompt: compact, dismissible, auto-dismiss after 12 seconds unless
  focused. Language remains selectable in the header.
- Mobile hero uses simple layered sheets; reduced-motion has a static fallback.
- Open Graph: distinct real project screenshots and demo interface previews.

## Anonymous interaction events

`POST /api/events` records fixed event names and an allowlisted project slug in
Vercel runtime logs under `portfolio_interaction`. Events cover project, Studio,
demo start, style selection, CV and contact links. No visitor IDs, cookies,
form content, full URLs or contact details are submitted. Do Not Track is honored.
Requests reject foreign origins and unknown event names/project slugs.

This is basic event instrumentation, **not a persistent analytics dashboard**.
Retention and export follow the existing Vercel runtime logging plan. Filter
runtime logs by `portfolio_interaction` to inspect events. No paid analytics
plan or new third-party account was enabled.

## Verification

The release includes regression tests for the rendered Home/Studio navigation,
case walkthrough controls and event endpoint validation, alongside existing
commerce, booking, attendance, manga, wedding, lab, security and content tests.

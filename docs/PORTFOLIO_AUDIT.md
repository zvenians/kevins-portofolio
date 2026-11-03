# Portfolio repository audit

Source inspection date: 2026-11-03. This is a documentation audit, not a browser test.

## Architecture distinction

The public portfolio is served from `vercel-site/`. Its presentation source is maintained in `apps-script/source/`, built with `node apps-script/build.mjs`, then synchronized via `node vercel-site/sync.mjs`. The root `src/app` and Firebase design documents refer to a separate implementation. Avoid treating both implementations as the same deployed product.

## Verification commands documented by the repository

```sh
npm ci
npm ci --prefix apps-script
node apps-script/build.mjs
node vercel-site/sync.mjs
npm test
```

These are documented commands, **not executed results**. The root `package.json` currently defines `npm test` as Vitest tests plus Node tests under `apps-script/tests/`. It also defines `npm run lint` as `next lint`; verify compatibility with the installed Next.js version before relying on that command.

## UI audit checklist

- Inspect home, navigation, thumbnails, project demonstrations, and skills on desktop and mobile.
- Verify icon assets render as intended rather than platform-specific emoji.
- Verify touch-driven animations and provide reduced-motion fallbacks.
- Confirm the skills section is visible and usable without hidden interaction.
- Check focus states, contrast, small-screen overflow, and loading/empty/error states.
- Test real URLs and distinguish interactive demonstrations from live integrations.

## Acceptance

Keep source and generated files synchronized, run the documented tests, and verify the Vercel target separately before merge. Do not assert visual correctness or passing tests until they are observed.

© Kevin Oloan Simatupang.

# Contributing

## Source of truth
The public-facing portfolio is built from `apps-script/source/`. Its output is synchronized to `vercel-site/`. The root `src/app/` implementation is separate and should not be confused with the deployed public presentation.

## Engineering guidelines
- Favor readable, maintainable code and focused changes.
- Use clear information hierarchy and purposeful visual effects.
- Check keyboard access, visible focus, mobile layouts, contrast, and reduced-motion preferences.
- Ensure interactive demonstrations expose real feedback and appropriate error states.
- Avoid fictitious usage metrics, unsupported claims, and placeholder actions.
- Keep credentials and private content outside version control.
- Document changes to generated assets alongside their source changes.

## Checks
```sh
npm ci
npm ci --prefix apps-script
node apps-script/build.mjs
node vercel-site/sync.mjs
npm test
```

Check the actual public target in a browser before requesting production release. Report incomplete checks accurately. Do not merge or deploy without project-owner approval.

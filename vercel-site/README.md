# Vercel public face / Google Apps Script content

Vercel project root directory: `vercel-site`. The public page reads the published-only JSON feed from the Google Apps Script deployment. The editor and PDF/media uploads stay behind the Google account owner check in Apps Script; there are no write credentials in this Vercel project.

To refresh the presentation code after changes in `apps-script/source`, run `npm run build` in `apps-script`, then `node vercel-site/sync.mjs` from the repository root. Commit the generated `vercel-site/generated` files. Content edits made through the Google owner workspace do not require a Vercel deploy; the feed revalidates after roughly one minute. If the feed is temporarily down, the last bundled public snapshot is displayed, and newly edited content waits for it to recover.

The owner workspace URL is the same Google Apps Script deployment with `?page=admin`. Production project paths use `/projects/:slug`; the six Data Lab exhibits run locally in the browser. Resume media requests use a read-only public endpoint that only exposes a published PDF or media attached to a published project.

Run `npm install && npm run build` inside `vercel-site` to verify the Vercel build. Never put Apps Script owner tokens or Google credentials in Vercel environment variables.

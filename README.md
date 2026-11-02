# Kevin Simatupang · Portfolio

Public site: https://portfolio-kevins.vercel.app

Edit public screens, motion, translations and demo behavior in `apps-script/source/`. The content feed comes from the Google Apps Script owner workspace. Vercel serves the public pages from `vercel-site/`.

From the repository root, install dependencies with `npm ci` and `npm ci --prefix apps-script`. After editing the presentation, run `node apps-script/build.mjs`, then `node vercel-site/sync.mjs` and `npm test`. Commit the generated assets with their sources. Verify the deployment build inside `vercel-site/`.

The root `src/app` application and Firebase design documents describe the separate Firebase implementation. The public portfolio uses the Vercel target described above.

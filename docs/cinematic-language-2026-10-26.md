# Cinematic presentation and language preference

The active Apps Script source now builds an Apple-inspired system-font presentation with an expandable, keyboard-operable project gallery. The same project registry and links feed the gallery. The final CSS layer restyles navigation, project cards, case studies, studio previews and working demo controls; each creative direction keeps its artwork.

`Cinematic.js` and `Cinematic.css` own this layer. `Locale.js` contains reversible English/Indonesian interface translations and project summaries. Language changes preserve form values and event handlers. A dismissible first-visit prompt appears after 1.8 seconds without moving focus or opening a modal; local storage remembers the choice. New DOM content is translated after rendering. Add exact source/translation pairs to the dictionary for new content. Unmapped long-form case-study content and artwork remain in their original language; this is not a universal machine translator.

System typography resolves to the native Apple font on Apple devices and system fallbacks elsewhere. No Apple font files are redistributed.

Build: `node apps-script/build.mjs && node vercel-site/sync.mjs`. Literal inline closing body tags are escaped to prevent preview live-reload injection from corrupting embedded iframe HTML. Root esbuild is declared because existing studio tests import it directly.

Validation: 57 Vitest tests and 23 core tests passed. Added tests exercise reversible translation, stored preference, unchanged input and option values, dynamic translated controls, dismissible first-visit prompt, and keyboard gallery navigation. Next.js production compilation and TypeScript checks passed; content service fallback was used during the local build. Desktop browser rendering and Indonesian navigation were inspected. No live backend data, payments or bookings were submitted.

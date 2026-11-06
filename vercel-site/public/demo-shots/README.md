# Demo Studio — Preview Assets

**Static screenshots of the public demonstration interfaces.**

The images in this directory were prepared from browser-visible demo states for the portfolio gallery. The existing capture set was documented on **27 October 2026** against a recorded project revision. It uses fictional demonstration records, not real client data.

## Purpose

A gallery preview helps a visitor recognize a demo before opening it. It is **not** a replacement for the working demo or evidence that every interaction has been tested.

| Item | Convention |
| --- | --- |
| Format | WebP |
| Approximate preview canvas | 1100 × 720 pixels in the documented capture set |
| Filename | Stable demo/template identifier |
| Source | Actual demonstration interface state, not a fabricated marketing mockup |
| Runtime | Static image; interactions load when the real demo is opened |

The gallery registry is maintained in [`apps-script/source/Gallery.js`](../../../apps-script/source/Gallery.js). Some demo categories generate previews from their initial DOM states through [`apps-script/studio-previews.mjs`](../../../apps-script/studio-previews.mjs).

## Maintenance

1. Make the interface change in the relevant source module.
2. Regenerate the presentation and verify the demo at the intended viewport.
3. Capture or update the preview only from an actual rendered state.
4. Preserve the expected gallery identifier in the filename.
5. Verify crop, legibility, and file size before committing.
6. Never present fictional labels, balances, or appointments as customer outcomes.

Older preview filenames or route descriptions may reflect the capture date and should be checked against the current registry before being reused.

For screenshots of **real portfolio projects**, see [`project-shots/`](../project-shots/README.md).

---

[Back to portfolio documentation](../../../README.md)

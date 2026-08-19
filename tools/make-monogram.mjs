/**
 * Generates the AS monogram from the site's own Bodoni Moda outlines:
 *   src/components/Monogram.astro  (header mark, perpetual gold gleam)
 *   public/favicon.svg             (static gold, reads at 16px)
 * Run: node tools/make-monogram.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import wawoff2 from "wawoff2";
import opentype from "opentype.js";

const woff2 = readFileSync("node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-wght-normal.woff2");
const font = opentype.parse(Uint8Array.from(await wawoff2.decompress(woff2)).buffer);
const glyph = (ch) => font.charToGlyph(ch).getPath(0, 0, 100).toPathData(2);
const A = glyph("A"), S = glyph("S");

const SWASH = `M66,-44 C44,-26 4,-14 -12,-22 C-26,-30 -20,-50 0,-48 C24,-45 50,-31 64,-25 C74,-21 82,-25 86,-33`;
const VIEW = `-24 -84 134 94`;

// ── Header mark ─────────────────────────────────────────────────────
// WebKit does not reliably animate gradientTransform through SMIL, so the
// mark sat static on every iOS browser while Chromium played it fine.
// Instead: the letterforms become a mask, a solid bronze plate sits under
// it, and a highlight band is translated across with a CSS animation.
// CSS transforms on SVG elements are solid everywhere.
const SPAN = 134;   // viewBox width
const astro = `---
/**
 * The AS monogram, set from the site's own Bodoni Moda outlines with the
 * connecting swash drawn by hand.
 *
 * The letterforms are used as a mask over a bronze plate, and a highlight
 * band sweeps across beneath that mask. This avoids animating gradient
 * attributes through SMIL, which WebKit does not support reliably: the
 * mark was frozen on every browser on iOS. A CSS transform on a plain
 * rect works in every engine, and reduced motion parks the band mid-mark.
 *
 * Regenerate with: node tools/make-monogram.mjs
 */
interface Props { class?: string; }
const { class: cls = "" } = Astro.props;
---
<svg viewBox="${VIEW}" class={cls} aria-hidden="true">
  <defs>
    <mask id="as-mask" maskUnits="userSpaceOnUse" x="-24" y="-84" width="134" height="94">
      <g fill="#fff" stroke="#fff" stroke-width="1.1" stroke-linejoin="round">
        <path d="${A}"/>
        <path transform="translate(48,0)" d="${S}"/>
      </g>
      <path fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" d="${SWASH}"/>
    </mask>
    <linearGradient id="as-band" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0"    stop-color="#FFF8E8" stop-opacity="0"/>
      <stop offset="0.42" stop-color="#FFF3D9" stop-opacity="0.85"/>
      <stop offset="0.5"  stop-color="#FFFDF7" stop-opacity="1"/>
      <stop offset="0.58" stop-color="#FFF3D9" stop-opacity="0.85"/>
      <stop offset="1"    stop-color="#FFF8E8" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <g mask="url(#as-mask)">
    <!-- The metal itself, always present -->
    <rect x="-24" y="-84" width="134" height="94" fill="#C08343"/>
    <rect x="-24" y="-84" width="134" height="94" fill="#D19A5C" opacity="0.5"/>
    <!-- The light crossing it -->
    <rect class="as-sheen" x="-24" y="-84" width="72" height="94" fill="url(#as-band)"/>
  </g>
</svg>
`;
writeFileSync("src/components/Monogram.astro", astro);

// ── Favicon: static gold on the void, weighted to read at 16px. ──
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW}">
  <rect x="-24" y="-84" width="134" height="94" rx="14" fill="#0B0A08"/>
  <g fill="#C08343" stroke="#C08343" stroke-width="1.6" stroke-linejoin="round">
    <path d="${A}"/>
    <path transform="translate(48,0)" d="${S}"/>
  </g>
  <path fill="none" stroke="#F3D9A6" stroke-width="4" stroke-linecap="round" d="${SWASH}"/>
</svg>
`;
writeFileSync("public/favicon.svg", favicon);
console.log("monogram + favicon generated");

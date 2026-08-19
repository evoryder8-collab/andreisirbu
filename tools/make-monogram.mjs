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

// ── Header mark: the gleam travels through the letterforms forever. ──
const astro = `---
/**
 * The AS monogram, set from the site's own Bodoni Moda outlines with the
 * connecting swash drawn by hand. The gold gradient slides through the
 * mark continuously via SMIL, which costs no JS and no layout; Base pauses
 * it for visitors who prefer reduced motion.
 *
 * Regenerate with: node tools/make-monogram.mjs
 */
interface Props { class?: string; }
const { class: cls = "" } = Astro.props;
---
<svg
  data-gleam-svg
  viewBox="${VIEW}"
  class={cls}
  aria-hidden="true"
>
  <defs>
    <linearGradient id="as-gleam" x1="0" y1="0" x2="1" y2="0" spreadMethod="pad">
      <stop offset="0" stop-color="#9A6B33"/>
      <stop offset="0.38" stop-color="#C08343"/>
      <stop offset="0.5" stop-color="#FFF2D8"/>
      <stop offset="0.62" stop-color="#C08343"/>
      <stop offset="1" stop-color="#9A6B33"/>
      <animateTransform attributeName="gradientTransform" type="translate"
        values="-1.4 0; 1.4 0; -1.4 0" dur="6.5s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <g fill="url(#as-gleam)">
    <path d="${A}"/>
    <path transform="translate(48,0)" d="${S}"/>
  </g>
  <path fill="none" stroke="url(#as-gleam)" stroke-width="2.6" stroke-linecap="round" d="${SWASH}"/>
</svg>
`;
writeFileSync("src/components/Monogram.astro", astro);

// ── Favicon: static gold on the void, weighted to read at 16px. ──
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW}">
  <rect x="-24" y="-84" width="134" height="94" rx="14" fill="#0B0A08"/>
  <g fill="#C08343">
    <path d="${A}"/>
    <path transform="translate(48,0)" d="${S}"/>
  </g>
  <path fill="none" stroke="#E8C489" stroke-width="3.2" stroke-linecap="round" d="${SWASH}"/>
</svg>
`;
writeFileSync("public/favicon.svg", favicon);
console.log("monogram + favicon generated");

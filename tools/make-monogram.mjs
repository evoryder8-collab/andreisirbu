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
// Gradient in user space with spreadMethod="repeat", translated by exactly
// one period. objectBoundingBox + pad parked the gradient off the shape for
// most of the cycle, which is why the mark read as flat bronze and the
// gleam looked stuck. One period of travel loops seamlessly.
const PERIOD = 168;
const astro = `---
/**
 * The AS monogram, set from the site's own Bodoni Moda outlines with the
 * connecting swash drawn by hand.
 *
 * The gold repeats in user space and travels exactly one period, so the
 * loop is seamless and a highlight is always somewhere on the mark. SMIL
 * keeps it off the main thread; Base pauses it under reduced motion.
 *
 * Regenerate with: node tools/make-monogram.mjs
 */
interface Props { class?: string; }
const { class: cls = "" } = Astro.props;
---
<svg data-gleam-svg viewBox="${VIEW}" class={cls} aria-hidden="true">
  <defs>
    <linearGradient id="as-gleam" gradientUnits="userSpaceOnUse"
      x1="-24" y1="0" x2="${-24 + PERIOD}" y2="0" spreadMethod="repeat">
      <stop offset="0"    stop-color="#8A5E2C"/>
      <stop offset="0.30" stop-color="#C08343"/>
      <stop offset="0.44" stop-color="#F3D9A6"/>
      <stop offset="0.50" stop-color="#FFF8E8"/>
      <stop offset="0.56" stop-color="#F3D9A6"/>
      <stop offset="0.70" stop-color="#C08343"/>
      <stop offset="1"    stop-color="#8A5E2C"/>
      <animateTransform attributeName="gradientTransform" type="translate"
        from="0 0" to="${PERIOD} 0" dur="3s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <!-- Stroking the fills as well as filling them thickens the hairlines
       optically, so the didone still holds together at header size. -->
  <g fill="url(#as-gleam)" stroke="url(#as-gleam)" stroke-width="1.1" stroke-linejoin="round">
    <path d="${A}"/>
    <path transform="translate(48,0)" d="${S}"/>
  </g>
  <path fill="none" stroke="url(#as-gleam)" stroke-width="3.4"
        stroke-linecap="round" d="${SWASH}"/>
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

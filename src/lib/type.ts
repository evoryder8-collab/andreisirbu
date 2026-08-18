/**
 * Typographic reveal.
 *
 * Words rise out of a clipped line rather than fading in. Fade-up is the
 * default gesture of every template; a masked rise reads as letterpress
 * being lifted into place and gives the display face real presence.
 *
 * Splitting is word-level, so the text content is unchanged and screen
 * readers get the same sentence they always would.
 */
import { gsap, ScrollTrigger, onCleanup, prefersReducedMotion } from "./motion";

const SPLIT_ATTR = "data-split-done";

/** Wrap each word in a masked line so it can be lifted independently. */
function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.getAttribute(SPLIT_ATTR)) {
    return Array.from(el.querySelectorAll<HTMLElement>(".tr-w"));
  }

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) {
    if ((n.textContent ?? "").trim()) texts.push(n as Text);
  }

  for (const t of texts) {
    const frag = document.createDocumentFragment();
    const parts = (t.textContent ?? "").split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
      const mask = document.createElement("span");
      mask.className = "tr-mask";
      const word = document.createElement("span");
      word.className = "tr-w";
      word.textContent = part;
      mask.appendChild(word);
      frag.appendChild(mask);
    }
    t.parentNode?.replaceChild(frag, t);
  }

  el.setAttribute(SPLIT_ATTR, "true");
  return Array.from(el.querySelectorAll<HTMLElement>(".tr-w"));
}

export function initTypeReveals(): void {
  const targets = document.querySelectorAll<HTMLElement>("[data-type-reveal]");
  if (!targets.length) return;

  // Reduced motion keeps the type exactly as authored: no split, no motion.
  if (prefersReducedMotion()) return;

  targets.forEach((el) => {
    const words = splitWords(el);
    if (!words.length) return;

    gsap.set(words, { yPercent: 118, rotate: 2.5 });

    const tween = gsap.to(words, {
      yPercent: 0,
      rotate: 0,
      duration: 1.15,
      ease: "expo.out",
      stagger: { each: 0.055, from: "start" },
      scrollTrigger: { trigger: el, start: "top 86%", once: true },
    });

    onCleanup(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
  });

  ScrollTrigger.refresh();
}

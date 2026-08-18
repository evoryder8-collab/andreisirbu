/**
 * Scroll-velocity effects.
 *
 * One idea, applied consistently: the page has mass. Imagery leans and
 * stretches very slightly with the speed of the scroll, then settles. The
 * amounts are deliberately small; the effect should register as weight, not
 * as a filter.
 *
 * Reads velocity from Lenis rather than attaching its own scroll listener,
 * and writes through GSAP's quickTo so there is no second animation loop.
 */
import { gsap, ScrollTrigger, getLenis, onCleanup, prefersReducedMotion } from "./motion";

export function initScrollFx(): void {
  if (prefersReducedMotion()) return;

  const lenis = getLenis();
  if (!lenis) return;

  const plates = gsap.utils.toArray<HTMLElement>("[data-fx-plate]");
  if (!plates.length) return;

  const setters = plates.map((el) => ({
    skew: gsap.quickTo(el, "skewY", { duration: 0.55, ease: "power3.out" }),
    scale: gsap.quickTo(el, "scaleY", { duration: 0.65, ease: "power3.out" }),
  }));

  const onScroll = ({ velocity }: { velocity: number }) => {
    // Clamped hard: past roughly a screen per second it stops increasing, so
    // a flung scroll never turns the page to soup.
    const v = gsap.utils.clamp(-40, 40, velocity);
    const skew = gsap.utils.clamp(-2.2, 2.2, v * 0.055);
    const stretch = 1 + Math.min(Math.abs(v) * 0.0016, 0.035);
    for (const s of setters) { s.skew(skew); s.scale(stretch); }
  };

  lenis.on("scroll", onScroll);
  onCleanup(() => lenis.off("scroll", onScroll));

  // Chapter cross-dissolve: each section surfaces from darkness and sinks
  // back, so chapters bleed instead of stacking.
  gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((sec) => {
    gsap.fromTo(sec,
      { filter: "brightness(0.55)" },
      {
        filter: "brightness(1)",
        ease: "none",
        scrollTrigger: { trigger: sec, start: "top 88%", end: "top 42%", scrub: 0.8 },
      });
  });
}

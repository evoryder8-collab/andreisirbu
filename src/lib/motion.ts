/**
 * Motion architecture.
 *
 * Exactly one Lenis instance and one animation clock for the whole site.
 * Lenis' RAF is driven by GSAP's ticker rather than its own loop, so there
 * is never a second requestAnimationFrame competing for frames.
 *
 * Everything registered here is torn down on Astro view transitions.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Registered at module scope, not inside initMotion(). Page scripts live
// inside <slot/> and therefore execute BEFORE the layout script, so deferring
// registration left their ScrollTriggers inert and snapped tweens to their
// end state on load.
gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

/** Teardown callbacks contributed by individual scenes. */
const disposers = new Set<() => void>();

export const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const onCleanup = (fn: () => void): void => {
  disposers.add(fn);
};

export function getLenis(): Lenis | null {
  return lenis;
}

export function initMotion(): void {
  // Reduced motion: no smooth scroll, no scrubbing. Content still reveals
  // via CSS, which the stylesheet flattens to an instant state.
  if (prefersReducedMotion()) {
    revealAll();
    return;
  }

  // A zero-height viewport (backgrounded/collapsed tab) makes ScrollTrigger
  // bake in nonsense pin geometry. Wait for a real one.
  if (!window.innerHeight) {
    window.addEventListener("resize", () => initMotion(), { once: true });
    revealAll();
    return;
  }

  lenis = new Lenis({
    // Shorter glide: the previous 1.15s read as resistance. Touch is left
    // entirely native (syncTouch off) so a finger drag is never intercepted.
    duration: 0.85,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 2,
  });

  lenis.on("scroll", ScrollTrigger.update);

  tickerFn = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  initReveals();

  // Late-loading imagery changes document height; ScrollTrigger needs to know.
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh);
  onCleanup(() => window.removeEventListener("load", refresh));

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
  }
}

/** Scroll-linked reveal. CSS owns the appearance; this only flips state. */
function initReveals(): void {
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal],[data-cut]");
  if (!targets.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.state = "in";
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
  );

  targets.forEach((t) => io.observe(t));
  onCleanup(() => io.disconnect());
}

function revealAll(): void {
  document
    .querySelectorAll<HTMLElement>("[data-reveal],[data-cut]")
    .forEach((el) => (el.dataset.state = "in"));
}

export function destroyMotion(): void {
  disposers.forEach((fn) => {
    try {
      fn();
    } catch {
      /* a failing scene teardown must not block the rest */
    }
  });
  disposers.clear();

  ScrollTrigger.getAll().forEach((st) => st.kill());

  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }

  lenis?.destroy();
  lenis = null;
}

export { gsap, ScrollTrigger };

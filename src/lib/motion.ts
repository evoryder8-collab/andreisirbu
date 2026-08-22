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
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
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
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
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
    .querySelectorAll<HTMLElement>("[data-reveal]")
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

/**
 * In-page anchors, eased rather than jumped.
 *
 * A native hash jump lands instantly, which reads as the page reloading in
 * place rather than travelling somewhere. The tween is driven here rather
 * than handed to Lenis: Lenis drops out of smooth mode on touch, so its own
 * scrollTo would jump on exactly the devices this matters most on. Writing
 * each frame back through Lenis keeps its internal position in sync, so the
 * scroll does not snap back when the visitor takes over again.
 */
const HEADER_CLEARANCE = 88;

const easeOutExpo = (t: number): number => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

function glideTo(top: number): void {
  const limit = document.documentElement.scrollHeight - window.innerHeight;
  const to = Math.max(0, Math.min(top, limit));
  const from = window.scrollY;
  const dist = to - from;
  if (Math.abs(dist) < 2) return;

  const lenisInstance = getLenis();
  if (prefersReducedMotion()) {
    window.scrollTo(0, to);
    return;
  }

  // Long journeys take longer, but never so long that the visitor waits.
  const duration = Math.min(1500, Math.max(560, Math.abs(dist) * 0.6));
  const t0 = performance.now();
  let cancelled = false;

  // The visitor is always allowed to take the wheel back mid-flight.
  const abort = () => {
    cancelled = true;
  };
  window.addEventListener("wheel", abort, { passive: true, once: true });
  window.addEventListener("touchstart", abort, { passive: true, once: true });
  window.addEventListener("keydown", abort, { once: true });

  // Read the clock directly rather than trusting the frame timestamp: the two
  // do not share an origin in every engine, and a mismatch makes the tween
  // resolve on its first frame, which is the jump this exists to avoid.
  const step = () => {
    if (cancelled) return;
    const p = Math.min(1, (performance.now() - t0) / duration);
    const y = from + dist * easeOutExpo(p);
    if (lenisInstance) lenisInstance.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
    if (p < 1) requestAnimationFrame(step);
    else {
      window.removeEventListener("wheel", abort);
      window.removeEventListener("touchstart", abort);
      window.removeEventListener("keydown", abort);
    }
  };
  requestAnimationFrame(step);
}

const onAnchorClick = (e: MouseEvent): void => {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  const el = e.target as HTMLElement | null;
  const link = el?.closest?.<HTMLAnchorElement>('a[href*="#"]');
  if (!link || link.target === "_blank") return;

  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname) return;
  if (!url.hash || url.hash === "#") return;

  const target = document.querySelector<HTMLElement>(url.hash);
  if (!target) return;

  e.preventDefault();
  glideTo(target.getBoundingClientRect().top + window.scrollY - HEADER_CLEARANCE);
  history.replaceState(null, "", url.hash);
};

let anchorsBound = false;

export function initAnchors(): void {
  if (anchorsBound) return;
  anchorsBound = true;
  // Capture phase on purpose. Astro's client router also listens for link
  // clicks on the document and, for a same-page hash, scrolls the target into
  // view itself. In the bubble phase it gets there first and the jump has
  // already happened by the time this could prevent it.
  document.addEventListener("click", onAnchorClick, { capture: true });
}

export { gsap, ScrollTrigger };

/**
 * Number animation.
 *
 * Figures count up when they enter view, then settle. Prices roll in the
 * Swiss format the store actually uses, so 1250 arrives as 1'250.
 *
 * The real value is always in the markup. JS reads it, winds it back to a
 * start point and animates forward, so a visitor without JS, or with reduced
 * motion, sees the correct figure immediately and never a zero.
 */
import { gsap, onCleanup, prefersReducedMotion } from "./motion";

const swiss = (n: number) => n.toLocaleString("de-CH", { maximumFractionDigits: 0 });

export function initNumbers(): void {
  const els = document.querySelectorAll<HTMLElement>("[data-count]");
  if (!els.length) return;

  if (prefersReducedMotion()) return; // markup already holds the final value

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        if (el.dataset.counted === "true") continue;
        el.dataset.counted = "true";

        const target = Number(el.dataset.count);
        if (!Number.isFinite(target)) continue;

        const group = el.dataset.countGroup === "true";
        const obj = { v: 0 };

        // Prices resolve almost instantly and flash: a figure at this price
        // point should land with confidence, not crawl upward. Other figures
        // still travel, paced by magnitude.
        const isPrice = group;
        const duration = isPrice
          ? 0.34
          : gsap.utils.clamp(0.9, 1.6, 0.7 + Math.log10(Math.max(target, 1)) * 0.36);

        const settle = () => {
          el.textContent = group ? swiss(target) : String(target);
        };

        const land = () => {
          settle();
          el.classList.remove("num-flash");
          void el.offsetWidth; // restart the animation
          el.classList.add("num-flash");
        };

        const tween = gsap.to(obj, {
          v: target,
          duration,
          ease: isPrice ? "power3.out" : "power2.out",
          onUpdate: () => {
            const n = Math.round(obj.v);
            el.textContent = group ? swiss(n) : String(n);
          },
          onComplete: land,
          // A frozen tween must never leave a wrong figure on screen.
          onInterrupt: settle,
        });

        // Guaranteed settle. A price is not decoration: if the ticker stalls
        // mid-count (heavy image decode on this page did exactly that, leaving
        // 261 where 295 belonged), the correct figure still lands.
        const guard = window.setTimeout(() => {
          if (!tween.progress || tween.progress() < 1) {
            tween.kill();
            land();
          }
        }, Math.ceil(duration * 1000) + 400);

        onCleanup(() => {
          window.clearTimeout(guard);
          tween.kill();
          settle();
        });
      }
    },
    { threshold: 0.4, rootMargin: "0px 0px -8% 0px" },
  );

  els.forEach((el) => {
    // Count once per element, ever. boot() runs again on view transitions, and
    // without this a settled price visibly winds back to zero and re-counts
    // while somebody is reading it.
    if (el.dataset.counted === "true") return;
    io.observe(el);
  });

  onCleanup(() => io.disconnect());
}

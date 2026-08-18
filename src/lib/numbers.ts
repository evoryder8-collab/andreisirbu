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

        const target = Number(el.dataset.count);
        if (!Number.isFinite(target)) continue;

        const group = el.dataset.countGroup === "true";
        const obj = { v: 0 };

        // Larger figures travel further and take slightly longer, so a 900
        // and an 18 feel like they carry different weight.
        const duration = gsap.utils.clamp(0.9, 2.0, 0.7 + Math.log10(Math.max(target, 1)) * 0.42);

        gsap.to(obj, {
          v: target,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            const n = Math.round(obj.v);
            el.textContent = group ? swiss(n) : String(n);
          },
          onComplete: () => {
            el.textContent = group ? swiss(target) : String(target);
          },
        });
      }
    },
    { threshold: 0.4, rootMargin: "0px 0px -8% 0px" },
  );

  els.forEach((el) => {
    // Wind back only once it is safe: the observer fires before first paint
    // of the animation, so nothing flashes zero on screen.
    io.observe(el);
  });

  onCleanup(() => io.disconnect());
}

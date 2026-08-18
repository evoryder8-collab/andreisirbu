/**
 * Overture choreography: the entry ritual.
 *
 * Sequence, light blooms, seam opens, mark and options arrive, then on
 * choice the veil parts from the centre and the site is revealed beneath.
 */
import { gsap, onCleanup, prefersReducedMotion } from "./motion";

export function initOverture(): void {
  const ov = document.getElementById("overture");
  if (!ov || ov.hidden) return;

  const root = document.documentElement;
  // Hold the page still while the overture is up.
  root.style.overflow = "hidden";

  const finish = (code: string, to?: string) => {
    try { localStorage.setItem("as-lang", code); } catch { /* private mode */ }
    root.lang = code;
    delete root.dataset.overture;

    // A different locale is a different document; the veil parts and then we
    // navigate, so the choice lands on native copy rather than only a flag.
    const here = window.location.pathname.replace(/\/$/, "");
    const target = (to || "").replace(/\/$/, "");
    const navigating = Boolean(target) && target !== here;

    const done = () => {
      if (navigating) { window.location.href = to as string; return; }
      ov.hidden = true;
      root.style.overflow = "";
      // Geometry changed; scroll scenes must re-measure.
      window.dispatchEvent(new Event("resize"));
    };

    if (prefersReducedMotion()) { done(); return; }

    // The veil parts from the centre rather than fading, the same material
    // language as the hero's dissolve.
    gsap.timeline({ onComplete: done })
      .to("[data-ov-item], [data-ov-label], [data-ov-mark], [data-ov-note]",
          { opacity: 0, y: -12, duration: 0.45, stagger: 0.03, ease: "power2.in" }, 0)
      .to("[data-ov-seam]", { scaleX: 1.6, opacity: 0, duration: 0.9, ease: "power2.inOut" }, 0.1)
      .to(ov, {
        duration: 1.0, ease: "power3.inOut",
        "--m1": "0%", "--m2": "100%",
      }, 0.25);
  };

  ov.querySelectorAll<HTMLButtonElement>("button[data-lang]").forEach((b) => {
    b.addEventListener("click", () => finish(b.dataset.lang || "en", b.dataset.to), { once: true });
  });

  // Keyboard: Escape accepts English so nobody is ever trapped.
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") finish("en"); };
  document.addEventListener("keydown", onKey);
  onCleanup(() => document.removeEventListener("keydown", onKey));

  if (prefersReducedMotion()) {
    gsap.set("[data-ov-glow],[data-ov-mark],[data-ov-label],[data-ov-item],[data-ov-note]", { opacity: 1 });
    gsap.set("[data-ov-seam]", { scaleX: 1 });
    (ov.querySelector("button") as HTMLElement | null)?.focus();
    return;
  }

  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to("[data-ov-glow]", { opacity: 1, duration: 2.2 }, 0)
    .to("[data-ov-seam]", { scaleX: 1, duration: 1.4 }, 0.2)
    .to("[data-ov-mark]", { opacity: 1, y: 0, duration: 1.1 }, 0.5)
    .to("[data-ov-label]", { opacity: 1, duration: 0.9 }, 0.9)
    .to("[data-ov-item]", { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 1.0)
    .to("[data-ov-note]", { opacity: 1, duration: 0.8 }, 1.6)
    .add(() => (ov.querySelector("button") as HTMLElement | null)?.focus(), 1.4);

  gsap.fromTo("[data-ov-item]", { y: 18 }, { y: 0, duration: 0.9, stagger: 0.08, delay: 1.0, ease: "power3.out" });
}

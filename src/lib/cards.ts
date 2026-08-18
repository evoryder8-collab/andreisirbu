/**
 * Session card behaviour.
 *
 * Two things: a slow idle float so the grid feels suspended rather than
 * pinned to the page, and a pointer-driven tilt with parallaxed interior
 * and a specular highlight that follows the cursor.
 *
 * Pointer devices only. Touch gets the static composition, which is already
 * the intended object, no hover state is faked.
 */
import { gsap, onCleanup, prefersReducedMotion } from "./motion";

export function initCards(): void {
  if (prefersReducedMotion()) return;

  const cards = document.querySelectorAll<HTMLElement>("[data-card]");
  if (!cards.length) return;

  // Idle float, desynchronised per card so the grid breathes unevenly,
  // the way suspended objects actually do.
  cards.forEach((card, i) => {
    const body = card.querySelector<HTMLElement>("[data-card-body]");
    if (!body) return;
    gsap.to(body, {
      y: i % 2 === 0 ? -7 : -10,
      duration: 3.4 + (i % 3) * 0.55,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: i * 0.22,
    });
  });

  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  cards.forEach((card) => {
    const body = card.querySelector<HTMLElement>("[data-card-body]");
    const img = card.querySelector<HTMLElement>("[data-card-img]");
    const gleam = card.querySelector<HTMLElement>("[data-card-gleam]");
    if (!body) return;

    gsap.set(body, { transformPerspective: 1400, transformOrigin: "center" });

    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;

      gsap.to(body, {
        rotateY: px * 11,
        rotateX: -py * 9,
        scale: 1.025,
        duration: 0.7,
        ease: "power3.out",
        overwrite: "auto",
      });

      // Interior counter-move: the depth cue that sells the object.
      if (img) {
        gsap.to(img, {
          x: px * -26, y: py * -20,
          duration: 0.9, ease: "power3.out", overwrite: "auto",
        });
      }

      if (gleam) {
        gleam.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        gleam.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      }
    };

    const leave = () => {
      gsap.to(body, { rotateX: 0, rotateY: 0, scale: 1, duration: 1.1, ease: "power3.out", overwrite: "auto" });
      if (img) gsap.to(img, { x: 0, y: 0, duration: 1.1, ease: "power3.out", overwrite: "auto" });
    };

    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    onCleanup(() => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
    });
  });
}

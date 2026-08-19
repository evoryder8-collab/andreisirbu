/**
 * Offering choreography on the reserve page.
 *
 * Each block drifts on its own cycle. Touching one selects it: the gold
 * around it begins to breathe, its photograph warms and comes forward, and
 * the others recede. Confirming plays an entry, the chosen block expands
 * toward the viewer and the plate whites out through gold, before the
 * booking flow loads.
 *
 * The CTA is a real link throughout, so keyboard and no-JS visitors reach
 * WooCommerce directly and never depend on any of this.
 */
import { gsap, onCleanup, prefersReducedMotion } from "./motion";

export function initOfferings(): void {
  const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-offering]"));
  if (!cards.length) return;

  const reduced = prefersReducedMotion();
  const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  let selected: HTMLElement | null = null;

  const bodyOf = (c: HTMLElement) => c.querySelector<HTMLElement>("[data-offering-body]");
  const imgOf = (c: HTMLElement) => c.querySelector<HTMLElement>("[data-offering-img]");

  const deselect = () => {
    if (!selected) return;
    const prev = selected;
    selected = null;
    const b = bodyOf(prev);
    b?.classList.remove("breathe-gold");
    cards.forEach((c) => {
      const cb = bodyOf(c);
      const ci = imgOf(c);
      if (cb) gsap.to(cb, { scale: 1, opacity: 1, duration: 0.7, ease: "power3.out" });
      if (ci) gsap.to(ci, { scale: 1, filter: "grayscale(0.22) contrast(1.06) brightness(0.52)", duration: 0.9, ease: "power3.out" });
    });
  };

  const select = (card: HTMLElement) => {
    if (selected === card) return;
    deselect();
    selected = card;

    const b = bodyOf(card);
    if (b && !reduced) b.classList.add("breathe-gold");
    else if (b) b.classList.add("breathe-gold");

    cards.forEach((c) => {
      const cb = bodyOf(c);
      const ci = imgOf(c);
      const isIt = c === card;
      if (cb) gsap.to(cb, { scale: isIt ? 1.015 : 0.985, opacity: isIt ? 1 : 0.45, duration: 0.8, ease: "power3.out" });
      if (ci) {
        gsap.to(ci, {
          scale: isIt ? 1.06 : 1,
          filter: isIt
            ? "grayscale(0) contrast(1.1) brightness(0.68)"
            : "grayscale(0.4) contrast(1.04) brightness(0.42)",
          duration: 1.1, ease: "power3.out",
        });
      }
    });

    // One sheen pass across the chosen block, driven by CSS so it can never
    // be left frozen part-way across.
    const sheen = card.querySelector<HTMLElement>("[data-offering-sheen]");
    if (sheen && !reduced) {
      sheen.classList.remove("sweep-run");
      void sheen.offsetWidth; // restart
      sheen.classList.add("sweep-run");
    }
  };

  const enterBlock = (card: HTMLElement, href: string) => {
    if (reduced) { window.location.href = href; return; }

    const b = bodyOf(card);
    const veil = document.createElement("div");
    veil.setAttribute("aria-hidden", "true");
    veil.className = "fixed inset-0 z-[90] pointer-events-none opacity-0";
    veil.style.background =
      "radial-gradient(circle at 50% 55%, rgba(255,242,216,0.96) 0%, rgba(192,131,67,0.9) 38%, rgba(5,6,5,1) 78%)";
    document.body.appendChild(veil);

    gsap.timeline({ onComplete: () => { window.location.href = href; } })
      .to(cards.filter((c) => c !== card).map(bodyOf).filter(Boolean) as HTMLElement[],
          { opacity: 0, scale: 0.94, duration: 0.5, ease: "power2.in" }, 0)
      .to(b, { scale: 1.14, duration: 0.9, ease: "power2.in" }, 0.05)
      .to(imgOf(card), { scale: 1.2, filter: "grayscale(0) contrast(1.15) brightness(0.95)", duration: 0.9, ease: "power2.in" }, 0.05)
      .to(veil, { opacity: 1, duration: 0.55, ease: "power2.in" }, 0.45);
  };

  cards.forEach((card, i) => {
    const b = bodyOf(card);
    const cta = card.querySelector<HTMLAnchorElement>("[data-offering-cta]");
    if (!b) return;

    // Drift. Each block on its own cycle so the column never pulses in unison.
    if (!reduced) {
      gsap.set(b, { transformPerspective: 1200 });
      gsap.to(b, {
        y: i % 2 === 0 ? -9 : -13,
        rotateZ: i % 2 === 0 ? 0.25 : -0.25,
        duration: 3.8 + (i % 3) * 0.7,
        ease: "sine.inOut",
        repeat: -1, yoyo: true, delay: i * 0.26,
      });
    }

    // Touch: first tap chooses, the CTA confirms.
    const onTap = (e: Event) => {
      if (!coarse) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-offering-cta]")) return;
      e.preventDefault();
      select(card);
    };
    card.addEventListener("click", onTap);

    // Pointer devices: hovering is intent enough.
    const onEnter = () => { if (!coarse) select(card); };
    card.addEventListener("pointerenter", onEnter);

    if (cta) {
      const onCta = (e: MouseEvent) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return; // let people open in a tab
        e.preventDefault();
        select(card);
        enterBlock(card, cta.href);
      };
      cta.addEventListener("click", onCta);
      onCleanup(() => cta.removeEventListener("click", onCta));
    }

    onCleanup(() => {
      card.removeEventListener("click", onTap);
      card.removeEventListener("pointerenter", onEnter);
    });
  });

  const onOutside = (e: PointerEvent) => {
    if (!(e.target as HTMLElement).closest("[data-offering]")) deselect();
  };
  document.addEventListener("pointerdown", onOutside);
  onCleanup(() => document.removeEventListener("pointerdown", onOutside));
}

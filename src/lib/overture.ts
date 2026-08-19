/**
 * Portal choreography.
 *
 * Behaviour preserved exactly from the previous portal: five languages,
 * browser detection, a countdown on the detected language, automatic entry,
 * and cancellation on any deliberate interaction. What changed is the staging.
 *
 * The blocks hang in depth and drift on independent cycles. The detected
 * language is promoted to hero: it comes forward, grows, lights its edge and
 * carries the countdown as a ring around its face. Choosing pulls the visitor
 * through that block.
 */
import { gsap, onCleanup, prefersReducedMotion } from "./motion";
import { LOCALES, DICTS, type Locale } from "../i18n/dict";

const AUTO_SECONDS = 5;
const RING = 119.4; // circumference of r=19

function detectLocale(): Locale | null {
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const raw of candidates) {
    const base = (raw || "").toLowerCase().split("-")[0];
    if ((LOCALES as readonly string[]).includes(base)) return base as Locale;
  }
  return null;
}

export function openOverture(): void {
  const ov = document.getElementById("overture");
  if (!ov) return;
  gsap.killTweensOf(ov);
  ov.hidden = false;
  document.documentElement.dataset.overture = "on";
  ov.style.setProperty("--m1", "50%");
  ov.style.setProperty("--m2", "50%");
  gsap.set(ov, { clearProps: "opacity" });
  gsap.set("[data-ov-plate],[data-ov-glow],[data-ov-beam],[data-ov-mark],[data-ov-label],[data-ov-item],[data-ov-note],[data-ov-hint]",
           { opacity: 0, clearProps: "transform" });
  gsap.set("[data-ov-passage]", { opacity: 0 });
  gsap.set("[data-ov-bloom]", { opacity: 0, scale: 1 });
  ov.querySelectorAll("[data-lang-item]").forEach((el) => ((el as HTMLElement).dataset.hero = "false"));
  runOverture(ov);
}

export function initOverture(): void {
  const ov = document.getElementById("overture");
  if (!ov || ov.hidden) return;
  runOverture(ov);
}

function runOverture(ov: HTMLElement): void {
  const root = document.documentElement;
  root.style.overflow = "hidden";

  const items = Array.from(ov.querySelectorAll<HTMLElement>("[data-lang-item]"));
  const buttons = Array.from(ov.querySelectorAll<HTMLButtonElement>("button[data-lang]"));
  const hint = ov.querySelector<HTMLElement>("[data-ov-hint]");
  const reduced = prefersReducedMotion();

  let countdown: number | undefined;
  let ringTween: gsap.core.Tween | null = null;
  let settled = false;
  let heroItem: HTMLElement | null = null;

  const cancelAuto = () => {
    if (countdown) { window.clearInterval(countdown); countdown = undefined; }
    ringTween?.kill(); ringTween = null;
    const ring = heroItem?.querySelector<HTMLElement>("[data-ov-ring]");
    if (ring) gsap.to(ring, { opacity: 0, duration: 0.4, onComplete: () => (ring.style.display = "none") });
    if (hint) gsap.to(hint, { opacity: 0, duration: 0.35 });
  };

  const enter = (code: Locale, to?: string) => {
    if (settled) return;
    settled = true;
    cancelAuto();

    try { localStorage.setItem("as-lang", code); } catch { /* private mode */ }
    root.lang = code;
    delete root.dataset.overture;

    // Only the homepage exists per locale, so navigating away from an inner
    // route would discard the page the visitor actually came for.
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    const here = window.location.pathname.replace(/\/$/, "");
    const homePaths = new Set(
      LOCALES.map((l) => (l === "en" ? base : `${base}/${l}`).replace(/\/$/, "")),
    );
    const target = (to || "").replace(/\/$/, "");
    const navigating = homePaths.has(here) && Boolean(target) && target !== here;

    // The portal is modal: if this never runs, the visitor is trapped behind
    // the veil. It must not depend on an animation callback firing.
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(failsafe);
      if (navigating) { window.location.href = to as string; return; }
      ov.hidden = true;
      root.style.overflow = "";
      window.dispatchEvent(new Event("resize"));
    };

    // Hard ceiling on the passage. Longer than the timeline, so the sequence
    // plays in full normally, but the portal always releases.
    const failsafe = window.setTimeout(done, 4200);
    onCleanup(() => window.clearTimeout(failsafe));

    if (reduced) { done(); return; }

    const chosen = items.find((i) => i.dataset.langItem === code) ?? null;
    const others = items.filter((i) => i !== chosen);
    const note = ov.querySelector<HTMLElement>("[data-ov-passage-note]");
    if (note) note.textContent = DICTS[code].overture.entering;

    // Pulled through the chosen block: it comes at the camera and its light
    // floods the frame as everything else falls away.
    gsap.timeline({ onComplete: done })
      .to(others, { opacity: 0, z: -180, scale: 0.9, duration: 0.6, stagger: 0.04, ease: "power2.in" }, 0)
      .to("[data-ov-mark], [data-ov-label], [data-ov-note], [data-ov-hint]",
          { opacity: 0, y: -12, duration: 0.45, ease: "power2.in" }, 0)
      .to(chosen, { z: 420, scale: 1.35, duration: 1.15, ease: "power2.in" }, 0.15)
      .to(chosen, { opacity: 0, duration: 0.5, ease: "power2.in" }, 0.95)
      .to("[data-ov-passage]", { opacity: 1, duration: 0.5 }, 0.8)
      .fromTo("[data-ov-passage-mark]", { scale: 0.95, opacity: 0 },
              { scale: 1, opacity: 1, duration: 1.0, ease: "power3.out" }, 0.85)
      .to("[data-ov-bloom]", { opacity: 1, scale: 1.25, duration: 1.4, ease: "power2.out" }, 0.9)
      .to(note, { opacity: 1, duration: 0.5 }, 1.35)
      .to("[data-ov-bloom]", { opacity: 0, scale: 1.7, duration: 0.8, ease: "power2.in" }, 2.0)
      .to("[data-ov-passage]", { opacity: 0, duration: 0.55, ease: "power2.in" }, 2.2)
      .to(ov, { duration: 1.0, ease: "power3.inOut", "--m1": "0%", "--m2": "100%" }, 2.0);
  };

  buttons.forEach((b) => {
    b.addEventListener("click", () => enter(b.dataset.lang as Locale, b.dataset.to));
    b.addEventListener("pointerenter", cancelAuto, { once: true });
    b.addEventListener("focus", cancelAuto, { once: true });
  });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") { cancelAuto(); enter("en"); } else cancelAuto();
  };
  document.addEventListener("keydown", onKey);
  ov.addEventListener("pointerdown", cancelAuto, { once: true });
  ov.addEventListener("wheel", cancelAuto, { once: true, passive: true });
  onCleanup(() => document.removeEventListener("keydown", onKey));

  if (reduced) {
    gsap.set("[data-ov-plate],[data-ov-glow],[data-ov-mark],[data-ov-label],[data-ov-item],[data-ov-note]", { opacity: 1 });
    buttons[0]?.focus();
    return;
  }

  // Blocks drift on independent cycles so the group never pulses in unison.
  items.forEach((item, i) => {
    const block = item.querySelector<HTMLElement>(".ov-block");
    if (!block) return;
    gsap.set(block, { transformPerspective: 1500 });
    gsap.to(block, {
      y: i % 2 === 0 ? -8 : -12,
      rotateZ: i % 2 === 0 ? 0.35 : -0.35,
      rotateX: 1.4,
      duration: 4.2 + (i % 3) * 0.8,
      ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.3,
    });

    // Magnetic response to touch or pointer.
    const move = (e: PointerEvent) => {
      const r = block.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(block, { rotateY: px * 12, rotateX: 1.4 - py * 8, duration: 0.6, ease: "power3.out", overwrite: "auto" });
    };
    const leave = () => gsap.to(block, { rotateY: 0, rotateX: 1.4, duration: 0.9, ease: "power3.out", overwrite: "auto" });
    block.addEventListener("pointermove", move);
    block.addEventListener("pointerleave", leave);
    onCleanup(() => {
      block.removeEventListener("pointermove", move);
      block.removeEventListener("pointerleave", leave);
    });

    // One specular pass on approach.
    const spec = block.querySelector<HTMLElement>("[data-ov-spec]");
    if (spec) {
      const pass = () => gsap.fromTo(spec, { xPercent: -130 }, { xPercent: 130, duration: 1.0, ease: "power2.inOut" });
      block.addEventListener("pointerenter", pass);
      onCleanup(() => block.removeEventListener("pointerenter", pass));
    }
  });

  // Slow camera drift across the whole composition.
  gsap.to("[data-ov-camera]", {
    rotateY: 1.6, rotateX: -1.0, duration: 14, ease: "sine.inOut", repeat: -1, yoyo: true,
  });
  gsap.to("[data-ov-beam]", { xPercent: 18, duration: 11, ease: "sine.inOut", repeat: -1, yoyo: true });

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } })
    .to("[data-ov-plate]", { opacity: 1, duration: 2.4 }, 0)
    .to("[data-ov-glow]", { opacity: 1, duration: 2.2 }, 0.1)
    .to("[data-ov-beam]", { opacity: 1, duration: 2.6 }, 0.2)
    .to("[data-ov-mark]", { opacity: 1, y: 0, duration: 1.0 }, 0.45)
    .to("[data-ov-label]", { opacity: 1, duration: 0.8 }, 0.8)
    .fromTo(items, { z: -220, y: 26, opacity: 0 },
            { z: 0, y: 0, opacity: 1, duration: 1.15, stagger: 0.09 }, 0.9)
    .to("[data-ov-note]", { opacity: 1, duration: 0.7 }, 1.9);

  const detected = detectLocale();
  intro.add(() => {
    if (settled) return;
    const item = detected ? items.find((i) => i.dataset.langItem === detected) ?? null : null;
    if (!detected || !item) { buttons[0]?.focus(); return; }

    heroItem = item;
    item.dataset.hero = "true";
    const block = item.querySelector<HTMLElement>(".ov-block");
    const ring = item.querySelector<HTMLElement>("[data-ov-ring]");
    const arc = item.querySelector<SVGCircleElement>("[data-ov-ring-arc]");
    const num = item.querySelector<HTMLElement>("[data-ov-ring-n]");
    const d = DICTS[detected];

    // Promote: forward, larger, lit.
    gsap.to(block, { z: 64, scale: 1.0, duration: 1.1, ease: "power3.out" });
    items.filter((i) => i !== item).forEach((other) => {
      gsap.to(other.querySelector(".ov-block"), { z: -70, scale: 0.97, opacity: 0.8, duration: 1.0, ease: "power3.out" });
    });

    if (hint) { hint.textContent = d.overture.cancelHint; gsap.to(hint, { opacity: 1, duration: 0.7 }); }
    (item.querySelector("button") as HTMLElement | null)?.focus();

    if (ring) { ring.style.display = "block"; gsap.fromTo(ring, { opacity: 0 }, { opacity: 1, duration: 0.6 }); }
    if (num) num.textContent = String(AUTO_SECONDS);

    // The ring drains as the countdown runs.
    if (arc) {
      gsap.set(arc, { strokeDashoffset: 0 });
      ringTween = gsap.to(arc, { strokeDashoffset: RING, duration: AUTO_SECONDS, ease: "none" });
    }

    let left = AUTO_SECONDS;
    countdown = window.setInterval(() => {
      left -= 1;
      if (num) {
        num.textContent = String(Math.max(left, 0));
        gsap.fromTo(num, { opacity: 0.4, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
      }
      if (left <= 0) {
        window.clearInterval(countdown);
        countdown = undefined;
        enter(detected, (item.querySelector("button") as HTMLButtonElement).dataset.to);
      }
    }, 1000);
    onCleanup(() => { if (countdown) window.clearInterval(countdown); });
  }, 2.0);
}

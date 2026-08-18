/**
 * Overture: detection, countdown, passage.
 *
 * On arrival the browser's own language is matched against what the practice
 * carries. If it matches, that row is marked and a countdown runs; the visitor
 * can let it settle or override it, and any interaction cancels the timer.
 * Whichever way it resolves, the choice passes through the same passage: the
 * mark gathers light, a gleam crosses it, the bloom opens and the veil parts.
 */
import { gsap, onCleanup, prefersReducedMotion } from "./motion";
import { LOCALES, LOCALE_NAMES, DICTS, type Locale } from "../i18n/dict";

const AUTO_SECONDS = 4;

/** Match navigator languages against what we carry. Region tags are ignored. */
function detectLocale(): Locale | null {
  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const raw of candidates) {
    const base = (raw || "").toLowerCase().split("-")[0];
    if ((LOCALES as readonly string[]).includes(base)) return base as Locale;
  }
  return null;
}

export function initOverture(): void {
  const ov = document.getElementById("overture");
  if (!ov || ov.hidden) return;

  const root = document.documentElement;
  root.style.overflow = "hidden";

  const buttons = Array.from(ov.querySelectorAll<HTMLButtonElement>("button[data-lang]"));
  const auto = ov.querySelector<HTMLElement>("[data-ov-auto]");
  const autoText = ov.querySelector<HTMLElement>("[data-ov-auto-text]");
  const autoN = ov.querySelector<HTMLElement>("[data-ov-auto-n]");
  const autoHint = ov.querySelector<HTMLElement>("[data-ov-auto-hint]");

  let countdown: number | undefined;
  let settled = false;

  const cancelAuto = () => {
    if (countdown) { window.clearInterval(countdown); countdown = undefined; }
    if (auto) gsap.to(auto, { opacity: 0, duration: 0.4, ease: "power2.out" });
    buttons.forEach((b) => { b.dataset.armed = "false"; });
  };

  const enter = (code: Locale, to?: string) => {
    if (settled) return;
    settled = true;
    cancelAuto();

    try { localStorage.setItem("as-lang", code); } catch { /* private mode */ }
    root.lang = code;
    delete root.dataset.overture;

    const here = window.location.pathname.replace(/\/$/, "");
    const target = (to || "").replace(/\/$/, "");
    const navigating = Boolean(target) && target !== here;

    const done = () => {
      if (navigating) { window.location.href = to as string; return; }
      ov.hidden = true;
      root.style.overflow = "";
      window.dispatchEvent(new Event("resize"));
    };

    if (prefersReducedMotion()) { done(); return; }

    const note = ov.querySelector<HTMLElement>("[data-ov-passage-note]");
    if (note) note.textContent = DICTS[code].overture.entering;

    // The passage.
    gsap.timeline({ onComplete: done })
      .to("[data-ov-item], [data-ov-label], [data-ov-mark], [data-ov-note], [data-ov-auto]",
          { opacity: 0, y: -10, duration: 0.4, stagger: 0.025, ease: "power2.in" }, 0)
      .to("[data-ov-seam]", { scaleX: 1.5, opacity: 0, duration: 0.7, ease: "power2.inOut" }, 0.05)
      .to("[data-ov-passage]", { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.35)
      .fromTo("[data-ov-passage-mark]",
              { scale: 0.94, opacity: 0 },
              { scale: 1, opacity: 1, duration: 1.1, ease: "power3.out" }, 0.4)
      .to("[data-ov-bloom]", { opacity: 1, scale: 1.18, duration: 1.6, ease: "power2.out" }, 0.5)
      .fromTo("[data-ov-gleam]",
              { xPercent: -130 },
              { xPercent: 130, duration: 1.15, ease: "power2.inOut" }, 0.85)
      .to(note, { opacity: 1, duration: 0.6 }, 1.1)
      .to("[data-ov-bloom]", { opacity: 0, scale: 1.6, duration: 0.9, ease: "power2.in" }, 1.9)
      .to("[data-ov-passage]", { opacity: 0, duration: 0.6, ease: "power2.in" }, 2.1)
      .to(ov, { duration: 1.0, ease: "power3.inOut", "--m1": "0%", "--m2": "100%" }, 1.9);
  };

  buttons.forEach((b) => {
    b.addEventListener("click", () => enter(b.dataset.lang as Locale, b.dataset.to));
    // Any deliberate interaction means the visitor is choosing for themselves.
    b.addEventListener("pointerenter", cancelAuto, { once: true });
    b.addEventListener("focus", cancelAuto, { once: true });
  });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") { cancelAuto(); enter("en"); }
    else cancelAuto();
  };
  document.addEventListener("keydown", onKey);
  ov.addEventListener("pointerdown", cancelAuto, { once: true });
  ov.addEventListener("wheel", cancelAuto, { once: true, passive: true });
  onCleanup(() => document.removeEventListener("keydown", onKey));

  if (prefersReducedMotion()) {
    gsap.set("[data-ov-glow],[data-ov-mark],[data-ov-label],[data-ov-item],[data-ov-note]", { opacity: 1 });
    gsap.set("[data-ov-seam]", { scaleX: 1 });
    buttons[0]?.focus();
    return;
  }

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } })
    .to("[data-ov-glow]", { opacity: 1, duration: 2.2 }, 0)
    .to("[data-ov-seam]", { scaleX: 1, duration: 1.4 }, 0.2)
    .to("[data-ov-mark]", { opacity: 1, y: 0, duration: 1.1 }, 0.5)
    .to("[data-ov-label]", { opacity: 1, duration: 0.9 }, 0.9)
    .fromTo("[data-ov-item]", { y: 18 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 1.0)
    .to("[data-ov-note]", { opacity: 1, duration: 0.8 }, 1.7);

  // Detection runs once the list has arrived, so the highlight is seen.
  const detected = detectLocale();
  intro.add(() => {
    if (settled) return;
    const btn = detected ? buttons.find((b) => b.dataset.lang === detected) : null;
    if (!detected || !btn) { buttons[0]?.focus(); return; }

    const d = DICTS[detected];
    if (autoText) autoText.textContent = d.overture.autoPrefix;
    if (autoHint) autoHint.textContent = d.overture.cancelHint;
    if (autoN) autoN.textContent = String(AUTO_SECONDS);

    btn.dataset.armed = "true";
    btn.focus();
    if (auto) gsap.to(auto, { opacity: 1, duration: 0.6 });

    let left = AUTO_SECONDS;
    countdown = window.setInterval(() => {
      left -= 1;
      if (autoN) {
        autoN.textContent = String(Math.max(left, 0));
        gsap.fromTo(autoN, { opacity: 0.35, y: -3 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
      }
      if (left <= 0) {
        window.clearInterval(countdown);
        countdown = undefined;
        enter(detected, btn.dataset.to);
      }
    }, 1000);
    onCleanup(() => { if (countdown) window.clearInterval(countdown); });
  }, 1.9);
}

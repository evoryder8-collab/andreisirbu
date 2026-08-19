/**
 * The dock and its held moment.
 *
 * The marks drift on independent cycles so the group never pulses together.
 * Choosing one opens a panel that names the destination in the visitor's own
 * language and offers a way back. The destination link is a real anchor with
 * a real href by the time it is shown, so it opens as a user gesture rather
 * than a scripted navigation, which pop-up blockers would otherwise catch.
 */
import { gsap, onCleanup, prefersReducedMotion } from "./motion";
import { DICTS, type Locale } from "../i18n/dict";

export function initSocial(): void {
  const dock = document.querySelector<HTMLElement>("[data-dock]");
  const sheet = document.querySelector<HTMLElement>("[data-social-sheet]");
  if (!dock || !sheet) return;

  const panel = sheet.querySelector<HTMLElement>("[data-social-panel]")!;
  const bloom = sheet.querySelector<HTMLElement>("[data-social-bloom]")!;
  const mark = sheet.querySelector<HTMLElement>("[data-social-mark]")!;
  const text = sheet.querySelector<HTMLElement>("[data-social-text]")!;
  const go = sheet.querySelector<HTMLAnchorElement>("[data-social-go]")!;
  const stay = sheet.querySelector<HTMLButtonElement>("[data-social-stay]")!;

  const locale = (document.documentElement.lang || "en") as Locale;
  const t = DICTS[locale] ?? DICTS.en;
  const reduced = prefersReducedMotion();

  const buttons = Array.from(dock.querySelectorAll<HTMLButtonElement>("[data-social]"));

  // Drift, each on its own cycle.
  if (!reduced) {
    buttons.forEach((b, i) => {
      gsap.to(b, {
        y: i % 2 === 0 ? -6 : -9,
        duration: 3.2 + i * 0.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.35,
      });
    });
  }

  let lastFocus: HTMLElement | null = null;

  const open = (b: HTMLButtonElement) => {
    const name = b.dataset.name || "";
    const tint = b.dataset.tint || "#C08343";
    const kind = b.dataset.kind === "contact" ? t.social.contact : t.social.visit;

    text.textContent = kind.replace("%s", name);
    go.href = b.dataset.href || "#";
    go.textContent = t.social.proceed;
    stay.textContent = t.social.stay;

    // The panel borrows the platform's colour rather than announcing it.
    bloom.style.background = `radial-gradient(circle, ${tint}66 0%, transparent 70%)`;
    mark.style.color = tint;
    mark.innerHTML = b.querySelector("svg")?.outerHTML ?? "";
    const svg = mark.querySelector("svg");
    if (svg) { svg.classList.remove("h-[1.35rem]", "w-[1.35rem]"); svg.setAttribute("width", "30"); svg.setAttribute("height", "30"); }
    go.style.background = tint;
    go.style.color = "#08090A";

    lastFocus = document.activeElement as HTMLElement;
    sheet.hidden = false;
    // Forced reflow rather than rAF: a frame callback never arrives in a
    // backgrounded tab and would leave the panel invisible but interactive.
    void sheet.offsetWidth;
    sheet.style.opacity = "1";
    panel.style.transform = "translateY(0) scale(1)";
    if (!reduced) gsap.fromTo(bloom, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power2.out" });
    go.focus();
  };

  const shut = () => {
    sheet.style.opacity = "0";
    panel.style.transform = "";
    window.setTimeout(() => { sheet.hidden = true; }, 400);
    lastFocus?.focus();
  };

  buttons.forEach((b) => {
    const onClick = () => open(b);
    b.addEventListener("click", onClick);
    onCleanup(() => b.removeEventListener("click", onClick));
  });

  stay.addEventListener("click", shut);
  go.addEventListener("click", () => window.setTimeout(shut, 120));
  sheet.addEventListener("click", (e) => { if (e.target === sheet) shut(); });

  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !sheet.hidden) shut(); };
  document.addEventListener("keydown", onKey);
  onCleanup(() => document.removeEventListener("keydown", onKey));
}

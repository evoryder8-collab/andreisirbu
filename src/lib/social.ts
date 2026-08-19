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
  const seam = sheet.querySelector<HTMLElement>("[data-social-seam]")!;
  const markWell = sheet.querySelector<HTMLElement>("[data-social-mark]")!;
  const glyph = sheet.querySelector<HTMLElement>("[data-social-glyph]")!;
  const text = sheet.querySelector<HTMLElement>("[data-social-text]")!;
  const go = sheet.querySelector<HTMLAnchorElement>("[data-social-go]")!;
  const goLabel = sheet.querySelector<HTMLElement>("[data-social-go-label]")!;
  const goSheen = sheet.querySelector<HTMLElement>("[data-social-go-sheen]")!;
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
  let intro: gsap.core.Timeline | null = null;

  /**
   * The sentence carries the platform name in the middle so each language
   * keeps its word order. Building it as nodes rather than markup lets the
   * name take the platform's colour without ever parsing a string as HTML.
   */
  const compose = (template: string, name: string, tint: string) => {
    text.textContent = "";
    const [before, after = ""] = template.split("%s");
    text.append(document.createTextNode(before));
    const em = document.createElement("em");
    em.textContent = name;
    em.style.color = tint;
    em.style.fontStyle = "italic";
    text.append(em, document.createTextNode(after));
  };

  const open = (b: HTMLButtonElement) => {
    const name = b.dataset.name || "";
    const tint = b.dataset.tint || "#C08343";
    const template = b.dataset.kind === "contact" ? t.social.contact : t.social.visit;

    compose(template, name, tint);
    go.href = b.dataset.href || "#";
    goLabel.textContent = t.social.proceed;
    stay.textContent = t.social.stay;

    // The panel borrows the platform's colour rather than announcing it: a
    // seam, a bloom, a ring and the action, all from the one hue.
    bloom.style.background = `radial-gradient(circle, ${tint}59 0%, ${tint}1f 42%, transparent 72%)`;
    seam.style.background = `linear-gradient(90deg, transparent, ${tint}, transparent)`;
    markWell.style.color = tint;
    go.style.background = `linear-gradient(150deg, ${tint}, ${tint}cc)`;
    go.style.boxShadow = `0 10px 30px -12px ${tint}, inset 0 1px 0 0 rgba(255,255,255,0.35)`;

    glyph.innerHTML = "";
    const icon = b.querySelector("svg")?.cloneNode(true) as SVGElement | undefined;
    if (icon) {
      icon.removeAttribute("class");
      icon.setAttribute("width", "28");
      icon.setAttribute("height", "28");
      icon.style.color = tint;
      glyph.append(icon);
    }

    lastFocus = document.activeElement as HTMLElement;
    sheet.hidden = false;
    // Forced reflow rather than rAF: a frame callback never arrives in a
    // backgrounded tab and would leave the panel invisible but interactive.
    void sheet.offsetWidth;
    sheet.style.opacity = "1";

    if (reduced) {
      gsap.set([panel, bloom, seam, text, go, stay], { clearProps: "all" });
      go.focus();
      return;
    }

    // Staged arrival, so this reads as a held moment rather than a dialog.
    intro?.kill();
    intro = gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(panel, { y: 26, scale: 0.965, opacity: 0 },
                     { y: 0, scale: 1, opacity: 1, duration: 0.75 }, 0)
      .fromTo(seam, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.9 }, 0.12)
      .fromTo(markWell, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.6)" }, 0.18)
      .fromTo(bloom, { opacity: 0, scale: 0.75 }, { opacity: 1, scale: 1, duration: 1.1 }, 0.2)
      .fromTo(text, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.48)
      .fromTo([go, stay], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 }, 0.62)
      .add(() => {
        goSheen.classList.remove("sweep-run");
        void goSheen.offsetWidth;
        goSheen.classList.add("sweep-run");
      }, 0.85);

    // The bloom keeps breathing while the visitor decides.
    gsap.to(bloom, { scale: 1.12, duration: 3.4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.2 });

    go.focus();
  };

  const shut = () => {
    intro?.kill();
    if (reduced) {
      sheet.style.opacity = "0";
      window.setTimeout(() => { sheet.hidden = true; }, 300);
      lastFocus?.focus();
      return;
    }
    gsap.killTweensOf(bloom);
    gsap.timeline({
      onComplete: () => { sheet.hidden = true; lastFocus?.focus(); },
    })
      .to(panel, { y: 14, scale: 0.98, opacity: 0, duration: 0.35, ease: "power2.in" }, 0)
      .to(sheet, { opacity: 0, duration: 0.4, ease: "power2.in" }, 0.05);
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

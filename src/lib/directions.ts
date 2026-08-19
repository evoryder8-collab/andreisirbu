/**
 * Drive Here.
 *
 * Offers the two map apps people actually have, then opens the chosen one
 * directly in navigation mode rather than at a pin the visitor still has to
 * tap through.
 *
 * Apple Maps: dirflg=d puts it in driving directions.
 * Google Maps: the universal /dir/ URL with travelmode=driving, which the
 * app intercepts on both platforms and the web falls back to cleanly.
 */
import { STUDIO } from "./availability";

const DEST = `${STUDIO.street}, ${STUDIO.postcode} ${STUDIO.city}, ${STUDIO.country}`;

export const appleMapsUrl = (): string =>
  `https://maps.apple.com/?daddr=${encodeURIComponent(DEST)}&dirflg=d`;

export const googleMapsUrl = (): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(DEST)}` +
  `&destination_place_id=&travelmode=driving&dir_action=navigate`;

/** Apple devices get Apple Maps listed first; everyone else gets Google. */
export const prefersApple = (): boolean =>
  /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && "ontouchend" in document
  || /iPhone|iPad|iPod/.test(navigator.userAgent);

export function initDirections(): void {
  const trigger = document.querySelector<HTMLElement>("[data-drive]");
  const sheet = document.querySelector<HTMLElement>("[data-drive-sheet]");
  if (!trigger || !sheet) return;

  const google = sheet.querySelector<HTMLAnchorElement>("[data-map-google]");
  const apple = sheet.querySelector<HTMLAnchorElement>("[data-map-apple]");
  const close = sheet.querySelector<HTMLElement>("[data-drive-close]");
  if (google) google.href = googleMapsUrl();
  if (apple) apple.href = appleMapsUrl();

  // Put the likely app first without hiding the other.
  if (apple && google && prefersApple()) {
    apple.parentElement?.prepend(apple);
  }

  let lastFocus: HTMLElement | null = null;

  const open = () => {
    lastFocus = document.activeElement as HTMLElement;
    sheet.hidden = false;
    // Forced reflow rather than rAF: the frame callback never arrives in a
    // backgrounded tab, which left the sheet unstyled and invisible.
    void sheet.offsetWidth;
    sheet.dataset.open = "true";
    (sheet.querySelector("a") as HTMLElement | null)?.focus();
  };
  const shut = () => {
    delete sheet.dataset.open;
    window.setTimeout(() => { sheet.hidden = true; }, 320);
    lastFocus?.focus();
  };

  trigger.addEventListener("click", (e) => { e.preventDefault(); open(); });
  close?.addEventListener("click", shut);
  sheet.addEventListener("click", (e) => { if (e.target === sheet) shut(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !sheet.hidden) shut();
  });
}

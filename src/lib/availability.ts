/**
 * Booking availability.
 *
 * Deterministic placeholder data for now: the same date always yields the
 * same slots, so the UI is stable and testable. Every read goes through
 * `getMonth` and every write through `submitBooking`, so connecting
 * WooCommerce Bookings later is a change to two functions and nothing else.
 *
 * TO CONNECT WOOCOMMERCE:
 *   getMonth  -> GET  /wp-json/wc-bookings/v1/products/<id>/slots?min_date&max_date
 *   submitBooking -> POST the chosen slot into the cart, then hand off to checkout.
 * The shapes below are already close to what that endpoint returns.
 */
import { getSession } from "../data/catalogue";

export interface Slot {
  /** 24h "HH:MM" in the studio's local time. */
  time: string;
  available: boolean;
}

export interface Day {
  /** ISO "YYYY-MM-DD". */
  date: string;
  /** Studio closed, or fully booked. */
  closed: boolean;
  slots: Slot[];
}

export const STUDIO = {
  name: "Andrei Sirbu",
  street: "Zähringerstrasse 36",
  postcode: "8001",
  city: "Zürich",
  country: "Switzerland",
  email: "contact@andreisirbu.com",
  phone: "+41 76 739 67 28",
  phoneHref: "+41767396728",
  hours: "09:00 – 19:00, daily",
  lat: 47.3782,
  lng: 8.5432,
} as const;

const OPEN_HOUR = 9;
const CLOSE_HOUR = 19;

/** Small deterministic hash so the same day always looks the same. */
function seed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export const iso = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Slot spacing follows the session length, plus turnaround. */
function stepFor(slug: string): number {
  const s = getSession(slug);
  const mins = Number((s?.duration ?? "60").replace(/[^0-9]/g, "")) || 60;
  return Math.max(60, Math.ceil((mins + 30) / 30) * 30);
}

export function getDay(slug: string, date: Date): Day {
  const key = iso(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // The past is not bookable, and same-day requests go through contact.
  if (date <= today) return { date: key, closed: true, slots: [] };

  const step = stepFor(slug);
  const slots: Slot[] = [];
  for (let m = OPEN_HOUR * 60; m + step <= CLOSE_HOUR * 60; m += step) {
    const time = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    // Roughly a third of slots already taken, stable per day and session.
    slots.push({ time, available: seed(`${slug}|${key}|${time}`) > 0.36 });
  }

  const closed = slots.every((s) => !s.available);
  return { date: key, closed, slots };
}

/** A calendar grid for the given month, Monday first. */
export function getMonth(slug: string, year: number, month: number): (Day | null)[] {
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Day | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(getDay(slug, new Date(year, month, d)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export interface BookingRequest {
  slug: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface BookingResult {
  ok: boolean;
  reference?: string;
  message?: string;
}

/**
 * Placeholder submit. Records the request and returns a reference so the
 * confirmation step is real and testable. Replace the body with the
 * WooCommerce cart call when the backend is connected; nothing in the UI
 * reads anything except `BookingResult`.
 */
export async function submitBooking(req: BookingRequest): Promise<BookingResult> {
  try {
    const held = JSON.parse(localStorage.getItem("as-bookings") || "[]");
    const reference = `AS-${req.date.replace(/-/g, "").slice(4)}-${req.time.replace(":", "")}`;
    held.push({ ...req, reference, at: new Date().toISOString() });
    localStorage.setItem("as-bookings", JSON.stringify(held));
    return { ok: true, reference };
  } catch {
    return { ok: false, message: "Could not hold that time. Please write to the studio." };
  }
}

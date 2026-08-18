/**
 * Session catalogue.
 *
 * Values mirror the live WooCommerce store exactly (verified against
 * /wp-json/wc/store/v1/products). Data is held statically for now so the
 * design can be settled without a live dependency.
 *
 * TO CONNECT WOOCOMMERCE LATER: implement `fetchSessions()` below to call
 * the Store API and map its response onto the `Session` shape. Nothing in
 * the UI reads anything except this shape, so no component needs to change.
 */

export interface Session {
  /** WooCommerce product slug — also the booking URL segment. */
  slug: string;
  /** Display name. Shorter than the Woo product title where that title is unwieldy. */
  name: string;
  /** Full Woo product title, used for structured data and the booking handoff. */
  storeName: string;
  /** Integer francs. No decimals in this catalogue. */
  price: number;
  currency: string;
  /** Shown as a mono micro-label. */
  duration: string;
  /** Second micro-label: the modality. */
  modality: string;
  /** One sensory line. Never marketing filler. */
  description: string;
  /** Longer copy for the session detail route. */
  detail: string;
  /** Ordering weight for the grid — the signature work leads. */
  rank: number;
  /** Marks the proprietary method. Rendered with additional emphasis. */
  signature?: boolean;
  /** Sits outside the private-session ladder (teaching, vouchers). */
  aside?: boolean;
}

export const CURRENCY = "CHF";

/** Where a Reserve action sends the visitor. */
export const bookingUrl = (slug: string): string =>
  `https://andreisirbu.com/bookings/${slug}/`;

export const formatPrice = (n: number): string =>
  n.toLocaleString("de-CH", { maximumFractionDigits: 0 });

export const SESSIONS: Session[] = [
  {
    slug: "la-terapia",
    name: "La Terapia Method",
    storeName: "La Terapia Method – Advanced Nervous System Reset",
    price: 295,
    currency: CURRENCY,
    duration: "90 min",
    modality: "Nervous system reset",
    description:
      "The proprietary work. Guided in real time, following the body rather than a routine.",
    detail:
      "The method this practice is built on. Structure and intuition held together — precise touch, breath awareness, and guidance that responds to what your body is doing in the moment rather than to a fixed sequence.",
    rank: 1,
    signature: true,
  },
  {
    slug: "sacral-ritual",
    name: "Sacral Ritual",
    storeName: "Sacral Ritual 90 min",
    price: 395,
    currency: CURRENCY,
    duration: "90 min",
    modality: "Deep release",
    description: "The longest and most complete of the private sessions.",
    detail:
      "Ninety minutes of sustained, unhurried work for those who want depth rather than relief. Held tension is met slowly, and given room to reorganise.",
    rank: 2,
  },
  {
    slug: "relaxing-massage-ritual",
    name: "Relaxing Ritual",
    storeName: "Relaxing Ritual 75min",
    price: 295,
    currency: CURRENCY,
    duration: "75 min",
    modality: "Restoration",
    description: "Warmth, oil and pressure held long enough for the body to let go.",
    detail:
      "A slower session built around sustained contact and warmth. Less clinical than the therapeutic work, and intended to bring the nervous system down rather than to treat a specific complaint.",
    rank: 3,
  },
  {
    slug: "lomi-lomi-therapy",
    name: "Lomi Lomi Ritual",
    storeName: "Lomi Lomi Ritual 75min",
    price: 289,
    currency: CURRENCY,
    duration: "75 min",
    modality: "Hawaiian bodywork",
    description: "Continuous flowing forearm work, rhythmic and enveloping.",
    detail:
      "Traditional Hawaiian bodywork adapted to this practice. Long, uninterrupted strokes travel the length of the body, closer to rhythm than to technique.",
    rank: 4,
  },
  {
    slug: "therapeutic-massage-55min",
    name: "Therapeutic Massage",
    storeName: "Therapeutic Massage 55min",
    price: 195,
    currency: CURRENCY,
    duration: "55 min",
    modality: "Clinical",
    description: "Focused structural work where something specific needs attention.",
    detail:
      "Direct, targeted treatment for a specific restriction or pattern. The most clinical session offered, and the usual starting point for a first visit.",
    rank: 5,
  },
  {
    slug: "revibe",
    name: "ReVibe Energy Restart",
    storeName: "ReVibe Energy Restart – 40 min",
    price: 145,
    currency: CURRENCY,
    duration: "40 min",
    modality: "Short form",
    description: "A concentrated reset for a body that cannot spare the full hour.",
    detail:
      "Forty minutes, condensed. Built for the middle of a working week rather than as an introduction to the deeper work.",
    rank: 6,
  },
  {
    slug: "holistic-massage-masterclass",
    name: "Holistic Massage Masterclass",
    storeName: "Holistic Massage Masterclass",
    price: 1250,
    currency: CURRENCY,
    duration: "Course",
    modality: "Teaching",
    description: "Eighteen years of practice, taught directly to practitioners.",
    detail:
      "Not a session. A course for working practitioners who want the method itself — how the work is structured, and how to read a body in real time.",
    rank: 7,
    aside: true,
  },
];

/** The private-session ladder — what the sessions grid shows. */
export const privateSessions = (): Session[] =>
  SESSIONS.filter((s) => !s.aside).sort((a, b) => a.rank - b.rank);

/** Everything outside the ladder: teaching, and later, vouchers. */
export const asideOfferings = (): Session[] => SESSIONS.filter((s) => s.aside);

export const getSession = (slug: string): Session | undefined =>
  SESSIONS.find((s) => s.slug === slug);

export const priceRange = (): { min: number; max: number } => {
  const p = privateSessions().map((s) => s.price);
  return { min: Math.min(...p), max: Math.max(...p) };
};

/**
 * Reserved for the WooCommerce Store API connection.
 *
 * Intended implementation:
 *   const res = await fetch("https://andreisirbu.com/wp-json/wc/store/v1/products?per_page=50");
 *   map each product → Session (prices arrive as minor units: price / 10^currency_minor_unit)
 *   on failure, return SESSIONS so the page always renders.
 */
export async function fetchSessions(): Promise<Session[]> {
  return SESSIONS;
}

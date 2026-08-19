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
  /** WooCommerce product slug, also the booking URL segment. */
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
  /** Ordering weight for the grid, the signature work leads. */
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
    duration: "75 min",
    modality: "Nervous system reset",
    description:
      "A profound journey into the release of repressed emotions and somatized trauma.",
    detail:
      "La Terapia, the sacred vision of Andrei Sîrbu, is a profound journey into the release of repressed emotions and somatized trauma.\nBy merging spiritual principles with manual therapy, psychotherapy, and breathwork, this method restores harmony to body, mind, and soul.\nA sacred, embodied healing experience that awakens inner peace, emotional liberation, and deep remembrance of who you truly are.",
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
    description: "A sacred energetic ceremony designed to cleanse, rebalance, and awaken your inner power.",
    detail:
      "The Sacral Ritual is a sacred energetic ceremony designed to cleanse, rebalance, and awaken your inner power. It releases emotional tension and energetic blockages stored in the lower body, restoring the natural harmony between the feminine and the masculine within.\nThis deep process reconnects you to your sensuality, creative flow, and authentic vitality. Through breath, awareness, and sacred touch, stagnant energy transforms into freedom, light, and inner strength.\nAllow yourself to return to the temple of your body, open, radiant, and aligned with the essence of who you truly are.",
    rank: 2,
    signature: true,
  },
  {
    slug: "relaxing-massage-ritual",
    name: "Relaxing Ritual",
    storeName: "Relaxing Ritual 75min",
    price: 295,
    currency: CURRENCY,
    duration: "75 min",
    modality: "Restoration",
    description: "A sacred experience of touch and presence, created to release tension and restore inner balance.",
    detail:
      "Relaxing Massage Ritual, a sacred experience of touch and presence, created to release tension, calm the nervous system, and restore inner balance.\nEach session unfolds like a ritual of renewal, refined, intuitive, and deeply therapeutic, guiding you back to a state of peace and clarity.",
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
    description: "A sacred and deeply transformative healing practice rooted in the traditions of ancient Hawaii.",
    detail:
      "Lomi Lomi massage is a sacred and deeply transformative healing practice rooted in the traditions of ancient Hawaii. With the gentle yet powerful touch of loving hands, this massage technique aims to harmonize the body, mind, and spirit, restoring balance and facilitating the release of physical and emotional blockages.\nDuring a Lomi Lomi massage, the practitioner moves with intention and fluidity, mimicking the ebb and flow of the ocean waves. Through rhythmic movements and long, continuous strokes, Lomi Lomi massage is believed to not only soothe the physical body but also to invoke a sense of spiritual connection and oneness with the universe.\nEvery touch in Lomi Lomi massage is thought to be infused with aloha, the spirit of love, compassion, and unity. As you surrender to the healing energy of the massage, you may experience a deep sense of relaxation, inner peace, and a profound reconnection with your inner self.",
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
    description: "Addresses trauma, poor posture, and injuries caused by repetitive movements.",
    detail:
      "The therapy addresses conditions such as trauma, poor posture, and injuries caused by repetitive movements.\nThis treatment brings together the most advanced therapeutic modalities to relieve and ultimately correct patterns in the body that lead to pain and discomfort.",
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
    description: "A deeply restorative session designed to rebalance and realign your energetic centers.",
    detail:
      "A deeply restorative session designed to rebalance and realign your energetic centers. We are energetic beings with an energetic anatomy, the aura, just as real as our physical body.\nWhen this subtle energy field is disturbed, tension, fatigue, or emotional imbalance can manifest in the body. Through gentle energy work and focused intention, Energy Restart clears blockages and restores the natural free flow of life force.\nThis promotes vitality, emotional harmony, and an overall sense of inner peace and well-being.",
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
    description: "A two-day intensive for therapists who want to deepen their advanced bodywork techniques.",
    detail:
      "The two-day intensive course is designed for therapists and massage practitioners who want to deepen their advanced bodywork techniques, focusing on releasing retained emotions and somatic trauma. The program integrates knowledge from psychosomatics, neurophysiology, and manual therapy, providing participants with practical tools to identify and transform energetic and emotional blockages through tactile therapy.\nDay 1: Theoretical foundation (psychosomatics, applied anatomy), palpation assessment of somatization areas, working with the diaphragm and solar plexus techniques.\nDay 2: Applying the integrated protocol (massage, trigger point therapy, approaches, somato-emotional assessment), case studies, and practical exercises in pairs.\nParticipants receive a diploma in applying the learned techniques, and access to a set of techniques for reducing symptoms of anxiety, chronic pain, and adrenal fatigue. Groups are kept to a maximum of four people so feedback stays individual.\nFor manual therapists, physiotherapists, experienced massage practitioners, or health students with basic knowledge of anatomy.",
    rank: 7,
    aside: true,
  },
];

/** The private-session ladder, what the sessions grid shows. */
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

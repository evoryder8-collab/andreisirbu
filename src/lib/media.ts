/**
 * Image assignments.
 *
 * Six frames carry the whole site. Where a frame repeats, it repeats at a
 * different crop, scale and grade so it reads as another moment in the same
 * shoot rather than a reused stock tile.
 */
import gorgeWide from "../assets/img/gorge-wide.jpg";
import gorgePortrait from "../assets/img/gorge-portrait.jpg";
import handsMono from "../assets/img/hands-mono.jpg";
import portrait from "../assets/img/portrait.jpg";
import treatment from "../assets/img/treatment.jpg";
import candleDetail from "../assets/img/candle-detail.jpg";
import candle from "../assets/img/candle.jpg";

// `room` used to point at a photograph of Andrei meditating cross-legged in
// patterned dress, while every alt text described a treatment room. Wrong
// image, and the description did not match it. It is now an actual session in
// a warm, candlelit room, and `room` is kept as an alias so the studio and
// contact pages keep working.
export { gorgeWide, gorgePortrait, handsMono, portrait, treatment, candle, candleDetail };
export const room = treatment;

export interface Plate {
  src: ImageMetadata;
  alt: string;
  /** object-position, so each reuse lands on a different part of the frame. */
  focus: string;
}

export const sessionPlate: Record<string, Plate> = {
  // His own photograph stays on the signature method and nowhere else.
  "la-terapia": {
    src: gorgePortrait,
    alt: "Andrei Sirbu seated at the edge of an alpine gorge, mist rising behind him.",
    focus: "50% 42%",
  },
  // Ninety minutes, the deepest of the private work: a session already under
  // way in a warm, low-lit room.
  "sacral-ritual": {
    src: gorgeWide,
    alt: "Moving water over wet basalt in an alpine gorge.",
    focus: "38% 56%",
  },
  // Warmth, oil and pressure, held long enough to let go.
  "relaxing-massage-ritual": {
    src: treatment,
    alt: "A session under way in a warm, candlelit treatment room.",
    focus: "34% 58%",
  },
  // Delivered somewhere other than the studio, so an intimate interior
  // rather than the practice room.
  "the-private-session": {
    src: candle,
    alt: "Candlelight across warmed oil and folded linen.",
    focus: "50% 50%",
  },
  // Continuous flowing forearm work, so the frame is the enveloping room
  // rather than a technique held still.
  "lomi-lomi-therapy": {
    src: candleDetail,
    alt: "Warm candle oil poured in long, continuous strokes.",
    focus: "52% 46%",
  },
  // The clinical session: hands working structure, in monochrome.
  "therapeutic-massage-55min": {
    src: handsMono,
    alt: "Focused structural work through the shoulder, in monochrome.",
    focus: "44% 44%",
  },
  // Teaching: the hands themselves, which are what is being passed on.
  "holistic-massage-masterclass": {
    src: portrait,
    alt: "Andrei Sirbu, who teaches the method.",
    focus: "50% 30%",
  },
};

export const plateFor = (slug: string): Plate =>
  sessionPlate[slug] ?? { src: gorgeWide, alt: "", focus: "50% 50%" };

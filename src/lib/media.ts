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
import room from "../assets/img/room.jpg";
import candle from "../assets/img/candle.jpg";

export { gorgeWide, gorgePortrait, handsMono, portrait, room, candle };

export interface Plate {
  src: ImageMetadata;
  alt: string;
  /** object-position, so each reuse lands on a different part of the frame. */
  focus: string;
}

export const sessionPlate: Record<string, Plate> = {
  "la-terapia": {
    src: gorgePortrait,
    alt: "Seated figure at the edge of a gorge pool, mist rising from the falls behind.",
    focus: "50% 42%",
  },
  "sacral-ritual": {
    src: handsMono,
    alt: "Practitioner's hands working along a draped back, in monochrome.",
    focus: "56% 58%",
  },
  "relaxing-massage-ritual": {
    src: candle,
    alt: "Candlelight across warmed oil and folded linen in the treatment room.",
    focus: "50% 50%",
  },
  "lomi-lomi-therapy": {
    src: gorgeWide,
    alt: "Wet basalt and moving water in an alpine gorge.",
    focus: "34% 60%",
  },
  "therapeutic-massage-55min": {
    src: handsMono,
    alt: "Focused structural work through the shoulder, in monochrome.",
    focus: "38% 40%",
  },
  revibe: {
    src: room,
    alt: "The treatment room in low light, prepared before a session.",
    focus: "60% 45%",
  },
  "holistic-massage-masterclass": {
    src: portrait,
    alt: "Andrei Sirbu, portrait.",
    focus: "50% 30%",
  },
};

export const plateFor = (slug: string): Plate =>
  sessionPlate[slug] ?? { src: gorgeWide, alt: "", focus: "50% 50%" };

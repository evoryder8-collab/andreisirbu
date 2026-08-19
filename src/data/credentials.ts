/**
 * Credentials.
 *
 * Everything here renders only when it is filled in, so a claim about a
 * real person's reputation is never guessed at.
 *
 * The award graphic already exists in the media library (2022) reading
 * "3rd in the World", but it appears on no page of the current site and no
 * text anywhere names the competition, the body or the year, so it cannot
 * be published as it stands.
 */

export interface Award {
  /** e.g. "3rd in the World" */
  placing: string;
  /** The competition or body. e.g. "World Massage Championship" */
  event: string;
  /** e.g. "2022" */
  year: string;
  /** Discipline or category, if the placing was in one. */
  discipline?: string;
  /** Where it can be verified, if there is a public record. */
  source?: string;
}

/** Add entries and the Recognition chapter appears. */
export const AWARDS: Award[] = [
  {
    placing: "3rd in the World",
    event: "World Championship in Massage",
    year: "2022",
  },
];

/**
 * How the practice describes who it serves. His own site frames this by
 * discretion rather than by names, which is both the more prestigious form
 * and the one that keeps confidentiality intact. Naming clients would
 * contradict the promise the practice makes.
 */
export interface Clientele {
  /** A discretion-preserving line, e.g. "Trusted by touring artists and executives." */
  line: string;
  /** Optional supporting sentence. */
  note?: string;
}

export const CLIENTELE: Clientele | null = {
  // Stated plainly, but never with names. Several are public figures who came
  // here because the practice does not talk, so naming them would break the
  // thing being offered.
  line: "His clients have included public figures and celebrities.",
  note: "None of them are named here. Several came precisely because the practice does not talk, and the room is the same whoever is lying in it.",
};

/** Trainings and modalities. Renders as a list when populated. */
export const DISCIPLINES: string[] = [
  "Advanced manual therapy",
  "Somatic psychology",
  "Breathwork",
  "Nervous system regulation",
  "Lomi Lomi",
];

export const hasAwards = () => AWARDS.length > 0;

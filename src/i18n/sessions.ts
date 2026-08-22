/**
 * Session copy per locale.
 *
 * Translations of Andrei's own descriptions. The English in catalogue.ts is
 * the source of truth and stays frozen; these are renderings of it, not
 * rewrites. Where a locale is missing an entry the English is used, so a gap
 * degrades to his words rather than to nothing.
 *
 * Register follows the rest of the site: formal address throughout, and the
 * sacred vocabulary he chose is carried rather than flattened into wellness
 * copy.
 */
import type { Locale } from "./dict";

export interface SessionCopy {
  description: string;
  /** Optional: falls back to his English until the inner routes are localised. */
  detail?: string;
}

type Table = Partial<Record<Locale, Partial<Record<string, SessionCopy>>>>;

export const SESSION_COPY: Table = {
  de: {
    "la-terapia": {
      description: "Eine tiefe Reise in das Lösen unterdrückter Gefühle und somatisierter Traumata.",
      detail:
        "The Reset Method, die heilige Vision von Andrei Sîrbu, ist eine tiefe Reise in das Lösen unterdrückter Gefühle und somatisierter Traumata.\n" +
        "Indem spirituelle Prinzipien mit manueller Therapie, Psychotherapie und Atemarbeit verbunden werden, bringt diese Methode Körper, Geist und Seele wieder in Einklang.\n" +
        "Eine heilige, verkörperte Heilerfahrung, die inneren Frieden weckt, emotionale Befreiung schenkt und tief daran erinnert, wer Sie wirklich sind.",
    },
    "the-private-session": {
      description: "Villa, Residenz oder Hotel. Dieselbe Arbeit, dorthin gebracht, wo Sie sind.",
      detail:
        "The Reset Method, bei Ihnen statt in der Praxis.\n" +
        "Villa, Residenz oder Hotel. Das Honorar richtet sich nach Anfahrt und Ort und wird bestätigt, sobald beides feststeht.\n" +
        "Eine Sitzung. In sich abgeschlossen. Wenn Ihr Körper Sie zurückruft, kommen Sie wieder.",
    },
    "sacral-ritual": {
      description: "Eine heilige energetische Zeremonie, die reinigt, ausgleicht und Ihre innere Kraft weckt.",
      detail:
        "Das Sacral Ritual ist eine heilige energetische Zeremonie, die reinigt, ausgleicht und Ihre innere Kraft weckt. Sie löst emotionale Spannung und energetische Blockaden im unteren Körper und stellt die natürliche Harmonie zwischen dem Weiblichen und dem Männlichen in Ihnen wieder her.\n" +
        "Dieser tiefe Prozess verbindet Sie neu mit Ihrer Sinnlichkeit, Ihrem schöpferischen Fluss und Ihrer echten Lebenskraft. Durch Atem, Achtsamkeit und heilige Berührung verwandelt sich stagnierende Energie in Freiheit, Licht und innere Stärke.\n" +
        "Erlauben Sie sich, in den Tempel Ihres Körpers zurückzukehren, offen, strahlend und im Einklang mit dem Wesen dessen, wer Sie wirklich sind.",
    },
    "relaxing-massage-ritual": {
      description: "Eine heilige Erfahrung von Berührung und Präsenz, die Spannung löst und inneres Gleichgewicht zurückgibt.",
      detail:
        "Relaxing Massage Ritual, eine heilige Erfahrung von Berührung und Präsenz, geschaffen, um Spannung zu lösen, das Nervensystem zu beruhigen und das innere Gleichgewicht wiederherzustellen.\n" +
        "Jede Sitzung entfaltet sich wie ein Ritual der Erneuerung, fein, intuitiv und zutiefst therapeutisch, und führt Sie zurück in einen Zustand von Ruhe und Klarheit.",
    },
    "lomi-lomi-therapy": {
      description: "Eine heilige und zutiefst verwandelnde Heilpraxis aus den Traditionen des alten Hawaii.",
      detail:
        "Die Lomi Lomi Massage ist eine heilige und zutiefst verwandelnde Heilpraxis, verwurzelt in den Traditionen des alten Hawaii. Mit der sanften und zugleich kraftvollen Berührung liebender Hände bringt diese Technik Körper, Geist und Seele in Einklang, stellt Balance her und hilft, körperliche und emotionale Blockaden zu lösen.\n" +
        "Während einer Lomi Lomi Massage bewegt sich der Therapeut mit Absicht und Fluss und ahmt das Kommen und Gehen der Meereswellen nach. Durch rhythmische Bewegungen und lange, ununterbrochene Striche soll Lomi Lomi nicht nur den Körper beruhigen, sondern auch ein Gefühl spiritueller Verbundenheit und Einheit mit dem Universum wecken.\n" +
        "Jede Berührung in der Lomi Lomi Massage gilt als durchdrungen von Aloha, dem Geist von Liebe, Mitgefühl und Verbundenheit. Wenn Sie sich der heilenden Energie hingeben, können Sie tiefe Entspannung, inneren Frieden und eine tiefe Wiederverbindung mit sich selbst erfahren.",
    },
    "therapeutic-massage-55min": {
      description: "Behandelt Traumata, Fehlhaltungen und Verletzungen durch wiederholte Bewegung.",
      detail:
        "Die Therapie behandelt Beschwerden wie Traumata, Fehlhaltungen und Verletzungen durch wiederholte Bewegungen.\n" +
        "Diese Behandlung vereint die fortschrittlichsten therapeutischen Methoden, um Muster im Körper zu lindern und letztlich zu korrigieren, die zu Schmerz und Beschwerden führen.",
    },
    revibe: {
      description: "Eine zutiefst erholsame Sitzung, die Ihre energetischen Zentren wieder ins Gleichgewicht bringt.",
      detail:
        "Eine zutiefst erholsame Sitzung, die Ihre energetischen Zentren wieder ins Gleichgewicht und in Ausrichtung bringt. Wir sind energetische Wesen mit einer energetischen Anatomie, der Aura, so real wie unser physischer Körper.\n" +
        "Ist dieses feine Energiefeld gestört, können sich Spannung, Erschöpfung oder emotionales Ungleichgewicht im Körper zeigen. Durch sanfte Energiearbeit und gerichtete Absicht löst Energy Restart Blockaden und stellt den natürlichen freien Fluss der Lebenskraft wieder her.\n" +
        "Das fördert Vitalität, emotionale Harmonie und ein umfassendes Gefühl von innerem Frieden und Wohlbefinden.",
    },
    "holistic-massage-masterclass": {
      description: "Ein zweitägiger Intensivkurs für Therapeuten, die ihre Körperarbeit vertiefen wollen.",
      detail:
        "Der zweitägige Intensivkurs richtet sich an Therapeuten und Massagepraktiker, die ihre fortgeschrittenen Techniken der Körperarbeit vertiefen möchten, mit Schwerpunkt auf dem Lösen zurückgehaltener Emotionen und somatischer Traumata. Das Programm verbindet Wissen aus Psychosomatik, Neurophysiologie und manueller Therapie und gibt den Teilnehmenden praktische Werkzeuge an die Hand, um energetische und emotionale Blockaden über taktile Therapie zu erkennen und zu wandeln.\n" +
        "Tag 1: Theoretische Grundlagen (Psychosomatik, angewandte Anatomie), palpatorische Beurteilung von Somatisierungszonen, Arbeit mit Zwerchfell und Solarplexus.\n" +
        "Tag 2: Anwendung des integrierten Protokolls (Massage, Triggerpunkttherapie, Zugänge, somato-emotionale Beurteilung), Fallbeispiele und praktische Übungen zu zweit.\n" +
        "Die Teilnehmenden erhalten ein Diplom über die Anwendung der erlernten Techniken sowie Zugang zu Techniken zur Linderung von Angst, chronischem Schmerz und Nebennierenerschöpfung. Die Gruppen sind auf maximal vier Personen begrenzt, damit die Rückmeldung individuell bleibt.\n" +
        "Für manuelle Therapeuten, Physiotherapeuten, erfahrene Massagepraktiker oder Studierende im Gesundheitsbereich mit anatomischen Grundkenntnissen.",
    },
  },
  fr: {
    "la-terapia": { description: "Un voyage profond dans la libération des émotions refoulées et des traumatismes somatisés." },
    "the-private-session": { description: "Villa, résidence ou hôtel. Le même travail, porté là où vous êtes." },
    "sacral-ritual": { description: "Une cérémonie énergétique sacrée qui purifie, rééquilibre et réveille votre puissance intérieure." },
    "relaxing-massage-ritual": { description: "Une expérience sacrée de toucher et de présence, pour relâcher les tensions et retrouver l'équilibre." },
    "lomi-lomi-therapy": { description: "Une pratique de soin sacrée et profondément transformatrice, née des traditions de l'ancienne Hawaï." },
    "therapeutic-massage-55min": { description: "Traite les traumatismes, les mauvaises postures et les blessures dues aux gestes répétés." },
    revibe: { description: "Une séance profondément réparatrice qui rééquilibre et réaligne vos centres énergétiques." },
    "holistic-massage-masterclass": { description: "Un intensif de deux jours pour les thérapeutes qui veulent approfondir leur travail corporel." },
  },
  it: {
    "la-terapia": { description: "Un viaggio profondo nel rilascio delle emozioni represse e dei traumi somatizzati." },
    "the-private-session": { description: "Villa, residenza o hotel. Lo stesso lavoro, portato dove si trova lei." },
    "sacral-ritual": { description: "Una cerimonia energetica sacra che purifica, riequilibra e risveglia la sua forza interiore." },
    "relaxing-massage-ritual": { description: "Un'esperienza sacra di tocco e presenza, per sciogliere la tensione e ritrovare l'equilibrio." },
    "lomi-lomi-therapy": { description: "Una pratica di guarigione sacra e profondamente trasformativa, radicata nelle tradizioni dell'antica Hawaii." },
    "therapeutic-massage-55min": { description: "Tratta traumi, posture scorrette e lesioni causate da movimenti ripetuti." },
    revibe: { description: "Una sessione profondamente rigenerante che riequilibra e riallinea i suoi centri energetici." },
    "holistic-massage-masterclass": { description: "Un intensivo di due giorni per terapisti che vogliono approfondire il lavoro corporeo." },
  },
  es: {
    "la-terapia": { description: "Un viaje profundo hacia la liberación de emociones reprimidas y traumas somatizados." },
    "the-private-session": { description: "Villa, residencia u hotel. El mismo trabajo, llevado a donde usted esté." },
    "sacral-ritual": { description: "Una ceremonia energética sagrada que limpia, reequilibra y despierta su poder interior." },
    "relaxing-massage-ritual": { description: "Una experiencia sagrada de tacto y presencia, para soltar la tensión y recuperar el equilibrio." },
    "lomi-lomi-therapy": { description: "Una práctica de sanación sagrada y profundamente transformadora, nacida en las tradiciones de la antigua Hawái." },
    "therapeutic-massage-55min": { description: "Trata traumas, malas posturas y lesiones causadas por movimientos repetidos." },
    revibe: { description: "Una sesión profundamente restauradora que reequilibra y realinea sus centros energéticos." },
    "holistic-massage-masterclass": { description: "Un intensivo de dos días para terapeutas que quieren profundizar su trabajo corporal." },
  },
  ro: {
    "la-terapia": { description: "O călătorie profundă în eliberarea emoțiilor reprimate și a traumelor somatizate." },
    "the-private-session": { description: "Vilă, reședință sau hotel. Aceeași lucrare, adusă acolo unde vă aflați." },
    "sacral-ritual": { description: "O ceremonie energetică sacră care curăță, reechilibrează și vă trezește puterea interioară." },
    "relaxing-massage-ritual": { description: "O experiență sacră a atingerii și a prezenței, care destinde și readuce echilibrul interior." },
    "lomi-lomi-therapy": { description: "O practică de vindecare sacră și profund transformatoare, din tradițiile vechii Hawaii." },
    "therapeutic-massage-55min": { description: "Tratează traume, postură deficitară și accidentări cauzate de mișcări repetitive." },
    revibe: { description: "O ședință profund restauratoare care reechilibrează și realiniază centrii dumneavoastră energetici." },
    "holistic-massage-masterclass": { description: "Un intensiv de două zile pentru terapeuții care vor să aprofundeze lucrul corporal." },
  },
};

export const sessionCopy = (
  locale: Locale,
  slug: string,
  fallback: { description: string; detail: string },
): { description: string; detail: string } => {
  const found = SESSION_COPY[locale]?.[slug];
  return {
    description: found?.description ?? fallback.description,
    detail: found?.detail ?? fallback.detail,
  };
};

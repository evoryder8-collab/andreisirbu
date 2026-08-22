/**
 * Localised copy.
 *
 * Transcreated, not translated. Each locale uses the register and idiom a
 * native reader expects from a private practice at this price: formal address
 * throughout (Sie / vous / lei / usted), and figures of speech chosen for the
 * culture rather than carried over from English.
 *
 * Notable departures from the English, all deliberate:
 *  - "You are guided, not treated" becomes "Sie werden begleitet, nicht
 *    behandelt" in German, which turns on begleiten/behandeln, a distinction
 *    German already carries and English has to explain.
 *  - "If this resonates" has no natural German equivalent. "Wenn Sie sich
 *    darin wiedererkennen" (if you recognise yourself in this) is what a
 *    German practitioner would actually write.
 *  - French uses "si cela vous parle", the ordinary idiom, rather than any
 *    literal rendering of resonance.
 *  - "Apply" is softened everywhere outside English: bewerben/candidature read
 *    as a job application, so each locale uses its own word for a request.
 */

export const LOCALES = ["en", "de", "fr", "it", "es", "ro"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, { native: string; word: string }> = {
  en: { native: "English",  word: "Welcome"    },
  de: { native: "Deutsch",  word: "Willkommen" },
  fr: { native: "Français", word: "Bienvenue"  },
  it: { native: "Italiano", word: "Benvenuto"  },
  es: { native: "Español",  word: "Bienvenido" },
  ro: { native: "Română",   word: "Bun venit"  },
};

export interface Dict {
  htmlLang: string;
  meta: { title: string; description: string };
  nav: { method: string; sessions: string; studio: string; evidence: string; about: string; contact: string; reserve: string };
  overture: { choose: string; note: string; autoPrefix: string; cancelHint: string; entering: string };
  hero: { eyebrow: string; l1: string; l2: string; l3: string; lede: string; cta: string; scroll: string };
  positioning: { eyebrow: string; t1: string; t2: string; lede: string; body: string;
                 practising: string; sessionsHeld: string; atATime: string };
  method: { eyebrow: string; body: string; more: string };
  process: { eyebrow: string; title: string; steps: { k: string; t: string }[];
             resultsLabel: string; outcomeTitle: string; results: string[] };
  sessions: { eyebrow: string; title: string; from: string; all: string; reserve: string };
  evidence: { eyebrow: string; q1: string; a1: string; q2: string; a2: string; verified: string; delivered: string; more: string };
  studio: { eyebrow: string; title: string; body: string; link: string };
  cta: { eyebrow: string; title: string; body: string; primary: string; secondary: string };
  footer: { tagline: string; practice: string; booking: string; legal: string; rights: string };
  social: { label: string; visit: string; contact: string; proceed: string; stay: string };
  teaching: { ask: string; badge: string; note: string };
  signature: string;
  reset: {
    method: string;
    subtitle: string;
    opening: string;
    onlyOne: string;
    returnLine: string;
    standsAlone: string;
    applyCta: string;
    atStudio: string;
    inYourSpace: string;
    ritualsLabel: string;
    ritualsNote: string;
    travelNote: string;
    basedIn: string;
  };
}

const en: Dict = {
  htmlLang: "en",
  meta: {
    title: "Andrei Sirbu | Advanced Nervous System Reset, Zürich",
    description: "A private practice in Zürich. Eighteen years of somatic work, guided in real time. Sessions from CHF 195.",
  },
  nav: { method: "Method", sessions: "Sessions", studio: "Studio", evidence: "Evidence", about: "About", contact: "Contact", reserve: "Reserve" },
  overture: { choose: "Choose your language", note: "Sessions are held in English and German", autoPrefix: "English selected in", cancelHint: "Choose another to stay", entering: "Entering" },
  hero: {
    eyebrow: "Private practice · Zürich · Since 2008",
    l1: "Advanced", l2: "Nervous System", l3: "Reset",
    lede: "I work with high-performing people whose bodies no longer recover at the pace of their lives.",
    cta: "Reserve a session", scroll: "Scroll",
  },
  positioning: {
    eyebrow: "Authority", t1: "A practice built on", t2: "precision and experience.",
    lede: "With over 18 years of dedicated practice, this work combines therapeutic structure with intuitive awareness.",
    body: "Each session is guided in real time, responding to your body rather than following a fixed routine. This is not a treatment menu. It is one practitioner, one room, and the particular body in front of him.",
    practising: "Practising", sessionsHeld: "Sessions held", atATime: "At a time",
  },
  method: {
    eyebrow: "Proprietary method",
    body: "A deeper form of work, designed for those ready to go beyond surface-level relaxation. Structure and intuition held together: precise touch, breath awareness, and guidance that follows the body rather than a sequence.",
    more: "The method in full",
  },
  process: {
    eyebrow: "What happens", title: "You are guided, not treated.",
    steps: [
      { k: "Arrival", t: "You are met, not processed. The room is prepared before you reach it." },
      { k: "Descent", t: "You are gently guided into a state of deep relaxation, where the body begins to release stored tension naturally." },
      { k: "The work", t: "Through precise touch, breath awareness and intuitive guidance, patterns held beneath the surface can soften and reorganise." },
      { k: "After", t: "Nothing is rushed. You leave when the nervous system has settled, not when the hour ends." },
    ],
    resultsLabel: "Results of this work",
    outcomeTitle: "What you leave with.",
    results: ["Release of deep physical tension", "Emotional lightness and clarity", "Nervous system regulation", "Improved sleep and recovery", "Greater connection with your body"],
  },
  sessions: { eyebrow: "The work offered", title: "Sessions", from: "From CHF", all: "All sessions and detail", reserve: "Reserve" },
  evidence: {
    eyebrow: "Evidence",
    q1: "I have never experienced anything close to this. I left feeling like my body had been given back to me.", a1: "Private client · Zürich",
    q2: "Precise, unhurried and completely present. He works with a level of attention I did not know was possible.", a2: "Returning client",
    verified: "Verified bookings", delivered: "900+ sessions delivered", more: "Read more",
  },
  studio: {
    eyebrow: "The studio", title: "One room in Zürich.",
    body: "Private, unshared and prepared for a single person at a time. No reception, no queue, no adjoining treatment rooms.",
    link: "Location and arrival",
  },
  cta: {
    eyebrow: "By application", title: "If this resonates,\nyou are welcome to apply.",
    body: "Sessions are limited and held privately. Reserve directly, or write first if you are unsure which work suits you.",
    primary: "Reserve a session", secondary: "See all sessions",
  },
  footer: {
    tagline: "Sessions are held privately,\none at a time.",
    practice: "Practice", booking: "Booking", legal: "Legal",
    rights: "Holistic & Massage Therapy, Zürich",
  },
  social: {
    label: "Elsewhere",
    visit: "You are about to visit me on %s. Proceed?",
    contact: "You are about to reach me on %s. Proceed?",
    proceed: "Continue",
    stay: "Stay here",
  },
  teaching: {
    ask: "Are you a therapist?",
    badge: "For therapists",
    note: "The work below is taught, not received.",
  },
  signature: "Signature",
  reset: {
    method: "The Reset Method",
    subtitle: "Nervous System Reset for High Performers",
    opening: "I work with high-performing people whose bodies no longer recover at the pace of their lives.",
    onlyOne: "One session. Complete in itself.",
    returnLine: "If your body asks you to return, you return.",
    standsAlone: "Every session stands on its own.",
    applyCta: "Apply for a Private Session",
    atStudio: "At the studio",
    inYourSpace: "In your space",
    ritualsLabel: "The ritual menu",
    ritualsNote: "The Zurich practice, unchanged.",
    travelNote: "Villa, residence or hotel. The fee varies with travel and location.",
    basedIn: "Zurich. Travelling on request.",
  },
};

const de: Dict = {
  htmlLang: "de",
  meta: {
    title: "Andrei Sirbu | Fortgeschrittener Nervensystem-Reset, Zürich",
    description: "Eine private Praxis in Zürich. Achtzehn Jahre Körperarbeit, im Moment geführt. Sitzungen ab CHF 195.",
  },
  nav: { method: "Methode", sessions: "Sitzungen", studio: "Praxis", evidence: "Stimmen", about: "Über mich", contact: "Kontakt", reserve: "Termin" },
  overture: { choose: "Wählen Sie Ihre Sprache", note: "Sitzungen finden auf Deutsch und Englisch statt", autoPrefix: "Deutsch wird gewählt in", cancelHint: "Wählen Sie eine andere Sprache", entering: "Sie treten ein" },
  hero: {
    eyebrow: "Private Praxis · Zürich · Seit 2008",
    l1: "Fortgeschrittener", l2: "Nervensystem", l3: "Reset",
    lede: "Ich arbeite mit Menschen auf hohem Leistungsniveau, deren Körper dem Tempo ihres Lebens nicht mehr hinterherkommt.",
    cta: "Termin vereinbaren", scroll: "Scrollen",
  },
  positioning: {
    eyebrow: "Erfahrung", t1: "Eine Praxis, die auf", t2: "Präzision und Erfahrung ruht.",
    lede: "Aus über 18 Jahren konsequenter Praxis verbindet diese Arbeit therapeutische Struktur mit intuitivem Gespür.",
    body: "Jede Sitzung entsteht im Moment und richtet sich nach Ihrem Körper, nicht nach einem festen Ablauf. Das ist keine Behandlungsliste. Es sind ein Therapeut, ein Raum und der Mensch, der gerade da ist.",
    practising: "In Praxis", sessionsHeld: "Sitzungen", atATime: "Gleichzeitig",
  },
  method: {
    eyebrow: "Eigene Methode",
    body: "Eine tiefere Form der Arbeit, für alle, die über oberflächliche Entspannung hinausgehen möchten. Struktur und Intuition greifen ineinander: präzise Berührung, Atemwahrnehmung und eine Führung, die dem Körper folgt statt einem Ablauf.",
    more: "Die Methode im Ganzen",
  },
  process: {
    eyebrow: "Der Ablauf", title: "Sie werden begleitet, nicht behandelt.",
    steps: [
      { k: "Ankommen", t: "Sie werden empfangen, nicht abgefertigt. Der Raum ist vorbereitet, bevor Sie ihn betreten." },
      { k: "Absinken", t: "Sie werden behutsam in eine tiefe Entspannung geführt, in der der Körper gehaltene Spannung von selbst loslässt." },
      { k: "Die Arbeit", t: "Durch präzise Berührung, Atemwahrnehmung und intuitive Führung dürfen Muster unter der Oberfläche weich werden und sich neu ordnen." },
      { k: "Danach", t: "Nichts wird beschleunigt. Sie gehen, wenn das Nervensystem zur Ruhe gekommen ist, nicht wenn die Stunde vorbei ist." },
    ],
    resultsLabel: "Was diese Arbeit bewirkt",
    outcomeTitle: "Womit Sie gehen.",
    results: ["Lösen tief sitzender körperlicher Spannung", "Emotionale Leichtigkeit und Klarheit", "Regulation des Nervensystems", "Besserer Schlaf und schnellere Erholung", "Ein deutlicheres Gefühl für den eigenen Körper"],
  },
  sessions: { eyebrow: "Das Angebot", title: "Sitzungen", from: "Ab CHF", all: "Alle Sitzungen im Detail", reserve: "Termin" },
  evidence: {
    eyebrow: "Stimmen",
    q1: "So etwas habe ich noch nie erlebt. Ich ging mit dem Gefühl, meinen Körper zurückbekommen zu haben.", a1: "Privatklientin · Zürich",
    q2: "Präzise, ohne Eile und ganz da. Er arbeitet mit einer Aufmerksamkeit, die ich für unmöglich gehalten hätte.", a2: "Langjähriger Klient",
    verified: "Bestätigte Buchungen", delivered: "Über 900 Sitzungen", more: "Mehr lesen",
  },
  studio: {
    eyebrow: "Die Praxis", title: "Ein Raum in Zürich.",
    body: "Privat, für Sie allein und immer nur für einen Menschen vorbereitet. Kein Empfang, keine Wartezeit, keine Behandlungsräume nebenan.",
    link: "Lage und Anreise",
  },
  cta: {
    eyebrow: "Auf Anfrage", title: "Wenn Sie sich darin wiedererkennen,\nfreue ich mich auf Ihre Anfrage.",
    body: "Die Zahl der Sitzungen ist begrenzt und jede findet privat statt. Buchen Sie direkt, oder schreiben Sie zuerst, wenn Sie unsicher sind, welche Arbeit passt.",
    primary: "Termin vereinbaren", secondary: "Alle Sitzungen ansehen",
  },
  footer: {
    tagline: "Jede Sitzung findet privat statt,\nimmer nur eine nach der anderen.",
    practice: "Praxis", booking: "Buchung", legal: "Rechtliches",
    rights: "Ganzheitliche Massage- und Körpertherapie, Zürich",
  },
  social: {
    label: "Anderswo",
    visit: "Sie sind dabei, mich auf %s zu besuchen. Fortfahren?",
    contact: "Sie sind dabei, mich über %s zu erreichen. Fortfahren?",
    proceed: "Fortfahren",
    stay: "Hier bleiben",
  },
  teaching: {
    ask: "Sind Sie Therapeut?",
    badge: "Für Therapeuten",
    note: "Das Folgende wird gelehrt, nicht empfangen.",
  },
  signature: "Signatur",
  reset: {
    method: "The Reset Method",
    subtitle: "Nervensystem-Reset für High Performer",
    opening: "Ich arbeite mit Menschen auf hohem Leistungsniveau, deren Körper dem Tempo ihres Lebens nicht mehr hinterherkommt.",
    onlyOne: "Eine Sitzung. In sich abgeschlossen.",
    returnLine: "Wenn Ihr Körper Sie zurückruft, kommen Sie wieder.",
    standsAlone: "Jede Sitzung steht für sich.",
    applyCta: "Private Sitzung anfragen",
    atStudio: "In der Praxis",
    inYourSpace: "Bei Ihnen",
    ritualsLabel: "Die Ritual-Karte",
    ritualsNote: "Die Zürcher Praxis, unverändert.",
    travelNote: "Villa, Residenz oder Hotel. Das Honorar richtet sich nach Anfahrt und Ort.",
    basedIn: "Zürich. Anreise auf Anfrage.",
  },
};

const fr: Dict = {
  htmlLang: "fr",
  meta: {
    title: "Andrei Sirbu | Reset avancé du système nerveux, Zurich",
    description: "Un cabinet privé à Zurich. Dix-huit ans de travail corporel, guidé dans l'instant. Séances à partir de CHF 195.",
  },
  nav: { method: "Méthode", sessions: "Séances", studio: "Le cabinet", evidence: "Témoignages", about: "À propos", contact: "Contact", reserve: "Réserver" },
  overture: { choose: "Choisissez votre langue", note: "Les séances se déroulent en anglais et en allemand", autoPrefix: "Français sélectionné dans", cancelHint: "Choisissez-en une autre pour rester", entering: "Entrée" },
  hero: {
    eyebrow: "Cabinet privé · Zurich · Depuis 2008",
    l1: "Reset avancé", l2: "du système", l3: "nerveux",
    lede: "Je travaille avec des personnes de haut niveau dont le corps ne récupère plus au rythme de leur vie.",
    cta: "Réserver une séance", scroll: "Défiler",
  },
  positioning: {
    eyebrow: "Expérience", t1: "Une pratique fondée sur", t2: "la précision et l'expérience.",
    lede: "Fort de plus de 18 ans de pratique assidue, ce travail allie une structure thérapeutique à une écoute intuitive.",
    body: "Chaque séance se construit dans l'instant et suit votre corps, non un protocole établi. Il ne s'agit pas d'une carte de soins. Il y a un praticien, une pièce, et le corps qui se présente.",
    practising: "De pratique", sessionsHeld: "Séances", atATime: "À la fois",
  },
  method: {
    eyebrow: "Méthode propre",
    body: "Un travail plus profond, pensé pour celles et ceux qui veulent aller au-delà de la simple détente. La structure et l'intuition avancent ensemble : un toucher précis, une attention au souffle, et une conduite qui suit le corps plutôt qu'une séquence.",
    more: "La méthode en détail",
  },
  process: {
    eyebrow: "Le déroulement", title: "Vous êtes accompagné, non traité.",
    steps: [
      { k: "L'accueil", t: "On vous reçoit, on ne vous expédie pas. La pièce est préparée avant votre arrivée." },
      { k: "La descente", t: "Vous êtes conduit en douceur vers une détente profonde, où le corps relâche de lui-même les tensions accumulées." },
      { k: "Le travail", t: "Par un toucher précis, une attention au souffle et une conduite intuitive, ce qui se tient sous la surface peut s'assouplir et se réorganiser." },
      { k: "Après", t: "Rien n'est pressé. Vous partez lorsque le système nerveux s'est apaisé, non lorsque l'heure est écoulée." },
    ],
    resultsLabel: "Ce que ce travail apporte",
    outcomeTitle: "Ce que vous emportez.",
    results: ["Relâchement des tensions physiques profondes", "Légèreté et clarté émotionnelles", "Régulation du système nerveux", "Un sommeil et une récupération meilleurs", "Un lien plus juste avec son corps"],
  },
  sessions: { eyebrow: "Les prestations", title: "Séances", from: "Dès CHF", all: "Toutes les séances en détail", reserve: "Réserver" },
  evidence: {
    eyebrow: "Témoignages",
    q1: "Je n'avais jamais rien vécu de tel. Je suis repartie avec le sentiment qu'on m'avait rendu mon corps.", a1: "Cliente privée · Zurich",
    q2: "Précis, sans hâte et pleinement présent. Il travaille avec une attention que je ne croyais pas possible.", a2: "Client fidèle",
    verified: "Réservations vérifiées", delivered: "Plus de 900 séances", more: "Lire la suite",
  },
  studio: {
    eyebrow: "Le cabinet", title: "Une seule pièce, à Zurich.",
    body: "Privée, réservée à vous seul et préparée pour une personne à la fois. Pas d'accueil, pas d'attente, aucune salle de soins mitoyenne.",
    link: "Adresse et accès",
  },
  cta: {
    eyebrow: "Sur demande", title: "Si cela vous parle,\nvotre demande est la bienvenue.",
    body: "Les séances sont peu nombreuses et se déroulent en privé. Réservez directement, ou écrivez d'abord si vous hésitez sur le travail qui vous convient.",
    primary: "Réserver une séance", secondary: "Voir toutes les séances",
  },
  footer: {
    tagline: "Les séances se déroulent en privé,\nune à la fois.",
    practice: "Le cabinet", booking: "Réservation", legal: "Mentions légales",
    rights: "Massage et thérapie holistique, Zurich",
  },
  social: {
    label: "Ailleurs",
    visit: "Vous êtes sur le point de me retrouver sur %s. Continuer ?",
    contact: "Vous êtes sur le point de m’écrire sur %s. Continuer ?",
    proceed: "Continuer",
    stay: "Rester ici",
  },
  teaching: {
    ask: "Vous êtes thérapeute ?",
    badge: "Pour thérapeutes",
    note: "Ce qui suit s’enseigne, ne se reçoit pas.",
  },
  signature: "Signature",
  reset: {
    method: "The Reset Method",
    subtitle: "Reset du système nerveux pour haut niveau",
    opening: "Je travaille avec des personnes de haut niveau dont le corps ne récupère plus au rythme de leur vie.",
    onlyOne: "Une séance. Complète en elle-même.",
    returnLine: "Si votre corps vous rappelle, vous revenez.",
    standsAlone: "Chaque séance se suffit à elle-même.",
    applyCta: "Demander une séance privée",
    atStudio: "Au cabinet",
    inYourSpace: "Chez vous",
    ritualsLabel: "La carte des rituels",
    ritualsNote: "Le cabinet zurichois, inchangé.",
    travelNote: "Villa, résidence ou hôtel. Les honoraires dépendent du déplacement et du lieu.",
    basedIn: "Zurich. Déplacements sur demande.",
  },
};

const it: Dict = {
  htmlLang: "it",
  meta: {
    title: "Andrei Sirbu | Reset avanzato del sistema nervoso, Zurigo",
    description: "Uno studio privato a Zurigo. Diciotto anni di lavoro corporeo, guidato nel momento. Sessioni da CHF 195.",
  },
  nav: { method: "Metodo", sessions: "Sessioni", studio: "Lo studio", evidence: "Testimonianze", about: "Chi sono", contact: "Contatti", reserve: "Prenota" },
  overture: { choose: "Scelga la sua lingua", note: "Le sessioni si tengono in inglese e tedesco", autoPrefix: "Italiano selezionato tra", cancelHint: "Ne scelga un’altra per restare", entering: "Ingresso" },
  hero: {
    eyebrow: "Studio privato · Zurigo · Dal 2008",
    l1: "Reset avanzato", l2: "del sistema", l3: "nervoso",
    lede: "Lavoro con persone ad alte prestazioni il cui corpo non recupera più al ritmo della loro vita.",
    cta: "Prenoti una sessione", scroll: "Scorri",
  },
  positioning: {
    eyebrow: "Esperienza", t1: "Una pratica fondata su", t2: "precisione ed esperienza.",
    lede: "Da oltre 18 anni di pratica costante, questo lavoro unisce una struttura terapeutica a un ascolto intuitivo.",
    body: "Ogni sessione nasce nel momento e segue il suo corpo, non una sequenza prestabilita. Non è un elenco di trattamenti. C'è un terapista, una stanza e la persona che si presenta.",
    practising: "Di pratica", sessionsHeld: "Sessioni", atATime: "Per volta",
  },
  method: {
    eyebrow: "Metodo proprio",
    body: "Un lavoro più profondo, pensato per chi vuole andare oltre il semplice rilassamento. Struttura e intuito procedono insieme: tocco preciso, ascolto del respiro e una guida che segue il corpo invece di una sequenza.",
    more: "Il metodo per intero",
  },
  process: {
    eyebrow: "Come si svolge", title: "Viene accompagnato, non trattato.",
    steps: [
      { k: "L'arrivo", t: "Viene accolto, non smaltito. La stanza è pronta prima che lei entri." },
      { k: "La discesa", t: "Viene condotto con delicatezza in un rilassamento profondo, dove il corpo lascia andare da sé la tensione trattenuta." },
      { k: "Il lavoro", t: "Con un tocco preciso, l'ascolto del respiro e una guida intuitiva, ciò che si tiene sotto la superficie può ammorbidirsi e riorganizzarsi." },
      { k: "Dopo", t: "Nulla viene affrettato. Se ne va quando il sistema nervoso si è posato, non quando finisce l'ora." },
    ],
    resultsLabel: "Che cosa porta questo lavoro",
    outcomeTitle: "Che cosa si porta via.",
    results: ["Rilascio delle tensioni fisiche profonde", "Leggerezza e chiarezza emotiva", "Riequilibrio del sistema nervoso", "Sonno e recupero migliori", "Un legame più chiaro con il proprio corpo"],
  },
  sessions: { eyebrow: "Che cosa offro", title: "Sessioni", from: "Da CHF", all: "Tutte le sessioni in dettaglio", reserve: "Prenota" },
  evidence: {
    eyebrow: "Testimonianze",
    q1: "Non avevo mai provato nulla di simile. Sono uscita con la sensazione che mi fosse stato restituito il corpo.", a1: "Cliente privata · Zurigo",
    q2: "Preciso, senza fretta e del tutto presente. Lavora con un'attenzione che non credevo possibile.", a2: "Cliente di lunga data",
    verified: "Prenotazioni verificate", delivered: "Oltre 900 sessioni", more: "Continua a leggere",
  },
  studio: {
    eyebrow: "Lo studio", title: "Una sola stanza, a Zurigo.",
    body: "Privata, riservata a lei e preparata per una persona alla volta. Nessuna reception, nessuna attesa, nessuna sala accanto.",
    link: "Dove si trova e come arrivare",
  },
  cta: {
    eyebrow: "Su richiesta", title: "Se sente che questo la riguarda,\nla sua richiesta è benvenuta.",
    body: "Le sessioni sono poche e si svolgono in privato. Prenoti direttamente, oppure scriva prima se non è certo di quale lavoro faccia al caso suo.",
    primary: "Prenoti una sessione", secondary: "Vedi tutte le sessioni",
  },
  footer: {
    tagline: "Le sessioni si svolgono in privato,\nuna alla volta.",
    practice: "Lo studio", booking: "Prenotazione", legal: "Note legali",
    rights: "Massaggio e terapia olistica, Zurigo",
  },
  social: {
    label: "Altrove",
    visit: "Sta per raggiungermi su %s. Vuole continuare?",
    contact: "Sta per scrivermi su %s. Vuole continuare?",
    proceed: "Continua",
    stay: "Resto qui",
  },
  teaching: {
    ask: "È un terapista?",
    badge: "Per terapisti",
    note: "Quello che segue si insegna, non si riceve.",
  },
  signature: "Firma",
  reset: {
    method: "The Reset Method",
    subtitle: "Reset del sistema nervoso per alte prestazioni",
    opening: "Lavoro con persone ad alte prestazioni il cui corpo non recupera più al ritmo della loro vita.",
    onlyOne: "Una sessione. Completa in sé.",
    returnLine: "Se il suo corpo la richiama, torna.",
    standsAlone: "Ogni sessione vale da sola.",
    applyCta: "Richiedere una sessione privata",
    atStudio: "In studio",
    inYourSpace: "Da lei",
    ritualsLabel: "La carta dei rituali",
    ritualsNote: "Lo studio di Zurigo, invariato.",
    travelNote: "Villa, residenza o hotel. Il compenso dipende dallo spostamento e dal luogo.",
    basedIn: "Zurigo. Trasferte su richiesta.",
  },
};

const es: Dict = {
  htmlLang: "es",
  meta: {
    title: "Andrei Sirbu | Reset avanzado del sistema nervioso, Zúrich",
    description: "Una consulta privada en Zúrich. Dieciocho años de trabajo corporal, guiado en el momento. Sesiones desde CHF 195.",
  },
  nav: { method: "Método", sessions: "Sesiones", studio: "La consulta", evidence: "Testimonios", about: "Sobre mí", contact: "Contacto", reserve: "Reservar" },
  overture: { choose: "Elija su idioma", note: "Las sesiones se imparten en inglés y alemán", autoPrefix: "Español seleccionado en", cancelHint: "Elija otro para quedarse", entering: "Entrando" },
  hero: {
    eyebrow: "Consulta privada · Zúrich · Desde 2008",
    l1: "Reset avanzado", l2: "del sistema", l3: "nervioso",
    lede: "Trabajo con personas de alto rendimiento cuyo cuerpo ya no se recupera al ritmo de su vida.",
    cta: "Reservar una sesión", scroll: "Desplácese",
  },
  positioning: {
    eyebrow: "Trayectoria", t1: "Una práctica sostenida por", t2: "la precisión y la experiencia.",
    lede: "Con más de 18 años de práctica constante, este trabajo une una estructura terapéutica a una escucha intuitiva.",
    body: "Cada sesión se construye en el momento y sigue a su cuerpo, no una rutina fija. No es una carta de tratamientos. Hay un terapeuta, una sala y el cuerpo que llega.",
    practising: "De práctica", sessionsHeld: "Sesiones", atATime: "Cada vez",
  },
  method: {
    eyebrow: "Método propio",
    body: "Un trabajo más profundo, pensado para quienes quieren ir más allá de la relajación superficial. Estructura e intuición avanzan juntas: un tacto preciso, atención a la respiración y una guía que sigue al cuerpo en lugar de a una secuencia.",
    more: "El método completo",
  },
  process: {
    eyebrow: "Cómo transcurre", title: "Se le acompaña, no se le trata.",
    steps: [
      { k: "La llegada", t: "Se le recibe, no se le despacha. La sala está preparada antes de que usted entre." },
      { k: "El descenso", t: "Se le conduce con calma a una relajación profunda, donde el cuerpo suelta por sí solo la tensión guardada." },
      { k: "El trabajo", t: "Con un tacto preciso, atención a la respiración y una guía intuitiva, lo que se sostiene bajo la superficie puede ablandarse y reordenarse." },
      { k: "Después", t: "Nada se apresura. Usted se marcha cuando el sistema nervioso se ha asentado, no cuando termina la hora." },
    ],
    resultsLabel: "Lo que deja este trabajo",
    outcomeTitle: "Lo que se lleva.",
    results: ["Liberación de la tensión física profunda", "Ligereza y claridad emocional", "Regulación del sistema nervioso", "Mejor sueño y recuperación", "Un vínculo más claro con el propio cuerpo"],
  },
  sessions: { eyebrow: "Lo que ofrezco", title: "Sesiones", from: "Desde CHF", all: "Todas las sesiones en detalle", reserve: "Reservar" },
  evidence: {
    eyebrow: "Testimonios",
    q1: "Nunca había vivido nada parecido. Salí con la sensación de que me habían devuelto el cuerpo.", a1: "Clienta privada · Zúrich",
    q2: "Preciso, sin prisa y del todo presente. Trabaja con una atención que no creía posible.", a2: "Cliente habitual",
    verified: "Reservas verificadas", delivered: "Más de 900 sesiones", more: "Seguir leyendo",
  },
  studio: {
    eyebrow: "La consulta", title: "Una sola sala, en Zúrich.",
    body: "Privada, reservada para usted y preparada para una persona cada vez. Sin recepción, sin espera, sin salas contiguas.",
    link: "Dónde está y cómo llegar",
  },
  cta: {
    eyebrow: "Con cita previa", title: "Si esto le resuena,\nserá un placer recibir su solicitud.",
    body: "Las sesiones son limitadas y se realizan en privado. Reserve directamente, o escriba antes si no sabe qué trabajo le conviene.",
    primary: "Reservar una sesión", secondary: "Ver todas las sesiones",
  },
  footer: {
    tagline: "Las sesiones se realizan en privado,\nuna a una.",
    practice: "La consulta", booking: "Reservas", legal: "Aviso legal",
    rights: "Masaje y terapia holística, Zúrich",
  },
  social: {
    label: "En otro lugar",
    visit: "Está a punto de visitarme en %s. ¿Continuamos?",
    contact: "Está a punto de escribirme por %s. ¿Continuamos?",
    proceed: "Continuar",
    stay: "Quedarme aquí",
  },
  teaching: {
    ask: "¿Es usted terapeuta?",
    badge: "Para terapeutas",
    note: "Lo que sigue se enseña, no se recibe.",
  },
  signature: "Sello",
  reset: {
    method: "The Reset Method",
    subtitle: "Reset del sistema nervioso para alto rendimiento",
    opening: "Trabajo con personas de alto rendimiento cuyo cuerpo ya no se recupera al ritmo de su vida.",
    onlyOne: "Una sesión. Completa en sí misma.",
    returnLine: "Si su cuerpo le pide volver, vuelve.",
    standsAlone: "Cada sesión se sostiene sola.",
    applyCta: "Solicitar una sesión privada",
    atStudio: "En la consulta",
    inYourSpace: "Donde usted esté",
    ritualsLabel: "La carta de rituales",
    ritualsNote: "La consulta de Zúrich, sin cambios.",
    travelNote: "Villa, residencia u hotel. Los honorarios dependen del desplazamiento y del lugar.",
    basedIn: "Zúrich. Desplazamientos a petición.",
  },
};


const ro: Dict = {
  htmlLang: "ro",
  meta: {
    title: "Andrei Sirbu | Resetare avansată a sistemului nervos, Zürich",
    description: "Un cabinet privat în Zürich. Optsprezece ani de lucru cu corpul, ghidat în prezent. Ședințe de la CHF 195.",
  },
  nav: { method: "Metoda", sessions: "Ședințe", studio: "Cabinetul", evidence: "Mărturii", about: "Andrei", contact: "Contact", reserve: "Rezervare" },
  overture: {
    choose: "Alegeți limba",
    note: "Ședințele se desfășoară în engleză și germană",
    autoPrefix: "Româna se alege în",
    cancelHint: "Alegeți alta pentru a rămâne",
    entering: "Intrați",
  },
  hero: {
    eyebrow: "Cabinet privat · Zürich · Din 2008",
    l1: "Resetare avansată", l2: "a sistemului", l3: "nervos",
    lede: "Lucrez cu oameni de mare performanță al căror corp nu mai ține pasul cu ritmul vieții lor.",
    cta: "Rezervați o ședință", scroll: "Derulați",
  },
  positioning: {
    eyebrow: "Experiență", t1: "O practică întemeiată pe", t2: "precizie și experiență.",
    lede: "Din peste 18 ani de practică neîntreruptă, această muncă îmbină structura terapeutică cu o ascultare intuitivă.",
    body: "Fiecare ședință se naște în prezent și urmează corpul dumneavoastră, nu un tipar dinainte stabilit. Nu este o listă de tratamente. Sunt un terapeut, o încăpere și omul care intră pe ușă.",
    practising: "De practică", sessionsHeld: "Ședințe", atATime: "Pe rând",
  },
  method: {
    eyebrow: "Metodă proprie",
    body: "O formă mai adâncă de lucru, gândită pentru cei care vor să treacă dincolo de relaxarea de suprafață. Structura și intuiția merg împreună: atingere precisă, atenție la respirație și o îndrumare care urmează corpul, nu o succesiune.",
    more: "Metoda pe larg",
  },
  process: {
    eyebrow: "Cum decurge", title: "Nu se lucrează asupra dumneavoastră, ci cu dumneavoastră.",
    steps: [
      { k: "Sosirea", t: "Sunteți primit, nu expediat. Încăperea este pregătită înainte să ajungeți." },
      { k: "Coborârea", t: "Sunteți condus cu blândețe într-o relaxare adâncă, în care corpul lasă de la sine tensiunea adunată." },
      { k: "Lucrul", t: "Prin atingere precisă, atenție la respirație și îndrumare intuitivă, ceea ce se ține sub suprafață se poate înmuia și așeza altfel." },
      { k: "După", t: "Nimic nu se grăbește. Plecați când sistemul nervos s-a liniștit, nu când se termină ora." },
    ],
    resultsLabel: "Ce lasă în urmă această muncă",
    outcomeTitle: "Cu ce plecați.",
    results: ["Eliberarea tensiunii fizice adânci", "Ușurință și limpezime emoțională", "Reglarea sistemului nervos", "Somn și refacere mai bune", "O legătură mai limpede cu propriul corp"],
  },
  sessions: { eyebrow: "Ce ofer", title: "Ședințe", from: "De la CHF", all: "Toate ședințele în detaliu", reserve: "Rezervare" },
  evidence: {
    eyebrow: "Mărturii",
    q1: "Nu mai trăisem niciodată așa ceva. Am plecat cu senzația că mi s-a dat corpul înapoi.", a1: "Clientă privată · Zürich",
    q2: "Precis, fără grabă și cu totul prezent. Lucrează cu o atenție pe care nu o credeam cu putință.", a2: "Client de ani buni",
    verified: "Rezervări verificate", delivered: "Peste 900 de ședințe", more: "Citiți mai departe",
  },
  studio: {
    eyebrow: "Cabinetul", title: "O singură încăpere, în Zürich.",
    body: "Privată, doar a dumneavoastră și pregătită pentru un singur om pe rând. Fără recepție, fără așteptare, fără cabinete alăturate.",
    link: "Unde se află și cum ajungeți",
  },
  cta: {
    eyebrow: "La cerere", title: "Dacă vă regăsiți în aceste cuvinte,\naștept cu drag un mesaj.",
    body: "Numărul ședințelor este limitat și fiecare se desfășoară în privat. Rezervați direct sau scrieți mai întâi, dacă nu știți sigur ce vi se potrivește.",
    primary: "Rezervați o ședință", secondary: "Vedeți toate ședințele",
  },
  footer: {
    tagline: "Ședințele se desfășoară în privat,\nuna după alta.",
    practice: "Cabinet", booking: "Rezervări", legal: "Termeni",
    rights: "Masaj și terapie holistică, Zürich",
  },
  social: {
    label: "În altă parte",
    visit: "Sunteți pe cale să mă vizitați pe %s. Continuați?",
    contact: "Sunteți pe cale să îmi scrieți pe %s. Continuați?",
    proceed: "Continuați",
    stay: "Rămân aici",
  },
  teaching: {
    ask: "Sunteți terapeut?",
    badge: "Pentru terapeuți",
    note: "Ce urmează se predă, nu se primește.",
  },
  signature: "Semnătură",
  reset: {
    method: "The Reset Method",
    subtitle: "Resetarea sistemului nervos pentru performeri",
    opening: "Lucrez cu oameni de mare performanță al căror corp nu mai ține pasul cu ritmul vieții lor.",
    onlyOne: "O singură ședință. Completă în sine.",
    returnLine: "Dacă vă cheamă corpul înapoi, reveniți.",
    standsAlone: "Fiecare ședință stă în picioare singură.",
    applyCta: "Solicitați o ședință privată",
    atStudio: "În cabinet",
    inYourSpace: "La dumneavoastră",
    ritualsLabel: "Carta ritualurilor",
    ritualsNote: "Cabinetul din Zürich, neschimbat.",
    travelNote: "Vilă, reședință sau hotel. Onorariul depinde de deplasare și de locație.",
    basedIn: "Zürich. Deplasări la cerere.",
  },
};

export const DICTS: Record<Locale, Dict> = { en, de, fr, it, es, ro };

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

/** English lives at the root; every other locale is prefixed. */
export const localeHref = (locale: Locale, path = "/"): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  let p = path.startsWith("/") ? path : `/${path}`;
  // Trailing slash keeps internal links on the canonical URL, avoiding a 301
  // hop on every navigation.
  if (!p.endsWith("/") && !p.includes("#") && !p.includes("?") && !/\.[a-z0-9]+$/i.test(p)) {
    p = `${p}/`;
  }
  return locale === "en" ? `${base}${p}` : `${base}/${locale}${p}`;
};

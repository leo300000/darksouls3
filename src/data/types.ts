/**
 * Modèles de données de THE ASHEN ARCHIVE.
 *
 * Principes :
 *  - chaque entité possède un `slug` stable, utilisé dans les URL et les relations ;
 *  - les relations passent toujours par des identifiants (jamais par du texte libre) ;
 *  - toute donnée sensible porte un niveau de fiabilité (`Confidence`) ;
 *  - une donnée inconnue vaut `null` et s'affiche comme « à compléter », jamais inventée.
 */

/** Contenu d'appartenance. Le DLC n'est jamais présenté comme jeu de base. */
export type Dlc = "base" | "ashes-of-ariandel" | "ringed-city";

/**
 * Niveau de fiabilité d'une information.
 *  - game        : directement établi par le jeu (texte d'objet, dialogue, événement observable)
 *  - reference   : issu d'une référence communautaire documentée (voir sources.ts)
 *  - deduction   : déduction fortement étayée par plusieurs éléments du jeu
 *  - theory      : théorie communautaire discutable
 *  - unverified  : connaissance de rédaction non recoupée pendant la session — à vérifier
 */
export type Confidence = "game" | "reference" | "deduction" | "theory" | "unverified";

export interface Sourced<T> {
  value: T;
  confidence: Confidence;
  note?: string;
  sources?: string[];
}

/** Illustration optionnelle. Si absente, une gravure procédurale identifiée comme telle est affichée. */
export interface ImageRef {
  src: string;
  alt: string;
  credit: string;
  license: string;
}

/** Paramètres de la gravure générée pour une entité (aucune image externe nécessaire). */
export interface ArtSpec {
  palette: "ash" | "ember" | "frost" | "abyss" | "gold" | "moss" | "blood" | "storm";
  motif:
    | "cemetery" | "shrine" | "castle" | "village" | "forest" | "cathedral" | "swamp"
    | "catacomb" | "lava" | "city" | "dungeon" | "ruin" | "peak" | "kiln" | "snow"
    | "dreg" | "garden" | "archive";
}

export type DamageType =
  | "physique" | "frappe" | "taille" | "estoc"
  | "magie" | "feu" | "foudre" | "tenebres"
  | "saignement" | "poison" | "toxique" | "givre" | "malediction";

/* ───────────────────────────── Zones ───────────────────────────── */

export type ZoneKind = "obligatoire" | "facultative" | "secrete" | "dlc";

export interface ZoneLink {
  zone: string; // slug
  via: string; // description du passage
  condition?: string;
  kind: "principal" | "facultatif" | "secret" | "raccourci";
}

export interface Zone {
  slug: string;
  name: string; // nom français d'usage
  nameEn: string; // nom anglais officiel
  dlc: Dlc;
  kind: ZoneKind;
  /** Ordre indicatif dans un parcours type (plusieurs ordres restent possibles). */
  order: number;
  /** Identifiant de section dans la source MIT (parcours détaillé). */
  sourceSection: string;
  tagline: string;
  ambiance: string[];
  difficulty: { level: 1 | 2 | 3 | 4 | 5; note: string };
  subAreas: string[];
  connections: ZoneLink[];
  bonfires: string[];
  bosses: string[]; // slugs de boss
  enemies: { name: string; note: string }[];
  npcs: string[]; // slugs de PNJ
  shortcuts: string[];
  secrets: string[];
  hazards: string[]; // mimics, pièges, embuscades
  missables: string[];
  questsAffected: string[]; // slugs de PNJ dont la quête est concernée
  tips: string[];
  art: ArtSpec;
  image?: ImageRef;
}

/* ───────────────────────────── Boss ───────────────────────────── */

export interface BossAttack {
  name: string;
  tell: string; // signal visuel
  punish: string; // fenêtre de punition / réponse
}

export interface Boss {
  slug: string;
  name: string;
  nameEn: string;
  /** Formes acceptées par la source (pour la résolution des liens). */
  aliases: string[];
  zone: string;
  dlc: Dlc;
  required: boolean;
  /** Précision sur le caractère obligatoire lorsque les sources divergent. */
  requiredNote?: string;
  lordOfCinder?: boolean;
  /** Ordre de rencontre indicatif. */
  order: number;
  summary: string; // sans spoiler
  spoiler: string; // résumé narratif, masqué par défaut
  souls: Sourced<number> | null; // NG, hors bonus
  hp: Sourced<string> | null;
  soulItem: string | null; // nom EN de l'âme
  drops: string[]; // noms EN
  transpositions: string[]; // noms EN
  achievement: string | null;
  unlocks: string[];
  weaknesses: Sourced<DamageType[]> | null;
  resistances: Sourced<DamageType[]> | null;
  damageTypes: DamageType[];
  phases: { name: string; description: string }[];
  attacks: BossAttack[];
  strategy: { general: string; melee: string; ranged: string; magic: string };
  particulars: string[];
  summons: { name: string; condition: string }[];
  lore: {
    identity: string;
    history: string;
    relations: { target: string; label: string }[]; // target = slug lore/pnj/boss
    symbolism: string;
    interpretation: string;
    theories: { text: string; confidence: Confidence }[];
    evidence: { item: string; gist: string }[];
  };
  art: ArtSpec;
  image?: ImageRef;
}

/* ───────────────────────────── PNJ & quêtes ───────────────────────────── */

export interface QuestStep {
  id: string;
  title: string;
  zone?: string;
  detail: string;
  condition?: string;
  warning?: string;
  missable?: boolean;
  reward?: string[];
}

export interface QuestOutcome {
  id: string;
  label: string;
  description: string;
}

export interface QuestDependency {
  npc: string;
  kind: "requiert" | "incompatible" | "influence";
  note: string;
}

export interface Quest {
  title: string;
  summary: string;
  steps: QuestStep[];
  outcomes: QuestOutcome[];
  irreversible: string[];
  consequences: string[];
  rewards: string[];
  dependencies: QuestDependency[];
}

export interface Npc {
  slug: string;
  name: string;
  nameEn: string;
  aliases: string[];
  dlc: Dlc;
  role: string;
  summary: string;
  story: string[];
  locations: { zone: string; when: string }[];
  dialogues: string[]; // résumés, jamais de longues citations
  relations: { target: string; label: string }[];
  merchant?: string;
  quest?: Quest;
  art: ArtSpec;
  image?: ImageRef;
}

/* ───────────────────────────── Fins ───────────────────────────── */

export interface EndingStep {
  id: string;
  title: string;
  detail: string;
  irreversible?: boolean;
  warning?: string;
  link?: string; // route interne
}

export interface Ending {
  slug: string;
  name: string;
  nameEn: string;
  achievement: string | null;
  isVariant: boolean;
  variantOf?: string;
  context: string;
  conditions: string[];
  prerequisites: string[];
  steps: EndingStep[];
  characters: string[]; // slugs PNJ / boss
  blockers: string[];
  pointOfNoReturn: string;
  narrative: string; // spoiler
  relatedQuests: string[]; // slugs PNJ
  incompatibleWith: string[]; // slugs de fins
  art: ArtSpec;
}

/* ───────────────────────────── Lore ───────────────────────────── */

export type LoreCategory =
  | "seigneurs-des-cendres" | "dieux-et-lignees" | "royaumes" | "civilisations"
  | "serments-et-factions" | "cultes" | "chevaliers" | "creatures" | "personnages"
  | "evenements" | "cycles-du-feu" | "abysses" | "peintures" | "liens-trilogie";

export interface LoreSection {
  heading: string;
  confidence: Confidence;
  paragraphs: string[];
}

export interface LoreArticle {
  slug: string;
  title: string;
  category: LoreCategory;
  summary: string;
  sections: LoreSection[];
  timeline?: { when: string; event: string; certainty: "certain" | "probable" | "incertain" }[];
  related: { kind: "boss" | "pnj" | "zone" | "lore" | "objet"; slug: string }[];
  items: string[]; // objets dont les descriptions nourrissent l'article (noms EN)
  art: ArtSpec;
}

export type RelationKind = "allie" | "ennemi" | "famille" | "affiliation" | "objet" | "evenement";

export interface LoreNode {
  id: string;
  label: string;
  group: "dieu" | "seigneur" | "royaute" | "chevalier" | "pnj" | "entite" | "faction" | "lieu" | "objet" | "evenement";
  href?: string;
}

export interface LoreEdge {
  from: string;
  to: string;
  kind: RelationKind;
  label: string;
  confidence: "game" | "deduction" | "theory";
}

export interface TimelineEvent {
  id: string;
  era: string;
  title: string;
  description: string;
  certainty: "certain" | "probable" | "incertain";
  refs: { kind: "boss" | "pnj" | "zone" | "lore"; slug: string }[];
}

/* ───────────────────────────── Catalogue ───────────────────────────── */

export type ItemKind = "arme" | "bouclier" | "armure" | "ensemble" | "anneau" | "sort" | "objet";

export type SpellSchool = "sorcellerie" | "pyromancie" | "miracle";

export interface WeaponStats {
  /** Valeurs de base (+0, sans infusion). */
  damage: Partial<Record<"physique" | "magie" | "feu" | "foudre" | "tenebres", number>>;
  scaling: Partial<Record<"FOR" | "DEX" | "INT" | "FOI", "S" | "A" | "B" | "C" | "D" | "E" | "-">>;
  requirements: Partial<Record<"FOR" | "DEX" | "INT" | "FOI", number>>;
  weight: number;
  durability?: number;
  skill?: string;
  infusable?: boolean;
  upgrade?: "titanite" | "twinkling" | "scale";
}

/** Une mention d'une entité dans le parcours détaillé (localisation sourcée). */
export interface Mention {
  stepId: string;
  zone: string; // slug de zone
  ng: string | null; // "ng+" | "ng++" | null
  tags: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  kind: "fin" | "boss" | "divers" | "serment" | "collection";
  ref?: { kind: "boss" | "fin" | "zone" | "serment"; slug: string };
}

export interface Covenant {
  slug: string;
  name: string;
  nameEn: string;
  aliases: string[];
  dlc: Dlc;
  location: string;
  zone: string;
  leader: string;
  item: string | null;
  summary: string;
  rewards: string[];
}

export interface MapMarker {
  id: string;
  kind: "feu" | "boss" | "pnj" | "objet" | "raccourci" | "secret" | "sortie" | "facultatif";
  label: string;
  x: number; // 0..100 (coordonnées schématiques)
  y: number;
  ref?: { kind: "boss" | "pnj" | "zone" | "objet" | "etape"; slug: string };
  note?: string;
}

export interface SchematicMap {
  zone: string;
  nodes: { id: string; label: string; x: number; y: number; r?: number }[];
  paths: { from: string; to: string; kind: "principal" | "facultatif" | "secret" | "raccourci" }[];
  markers: MapMarker[];
}

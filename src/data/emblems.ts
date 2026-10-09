import type { EmblemKey } from "@/components/art/emblems";

/** Emblème héraldique de chaque boss (évocation de son arme ou de son symbole). */
export const bossEmblems: Record<string, EmblemKey> = {
  "iudex-gundyr": "halberd",
  vordt: "mace",
  "grand-bois-maudit": "tree",
  "sage-cristallin": "crystal",
  "diacres-des-profondeurs": "candles",
  "veilleurs-des-abysses": "crossedSwords",
  "high-lord-wolnir": "skullCrown",
  "vieux-roi-demon": "flame",
  "pontife-sulyvahn": "twinBlades",
  yhorm: "cleaver",
  aldrich: "eye",
  "danseuse-de-la-vallee-boreale": "crescent",
  "armure-du-tueur-de-dragons": "axeShield",
  oceiros: "crownedWing",
  "champion-gundyr": "chainedHalberd",
  "wyverne-antique": "wing",
  "roi-sans-nom": "crownBolt",
  "lorian-et-lothric": "twinCrowns",
  "ame-des-cendres": "coiledSword",
  "gardien-des-tombes-du-champion": "claws",
  "soeur-friede": "scythe",
  "prince-demon": "twinFlames",
  halflight: "spear",
  midir: "darkWing",
  "slave-knight-gael": "brokenSword",
};

/** Emblème de chaque fin. */
export const endingEmblems: Record<string, EmblemKey> = {
  "raviver-la-premiere-flamme": "flame",
  "fin-du-feu": "eclipse",
  "fin-du-feu-variante": "eyes",
  "usurpation-du-feu": "darksign",
};

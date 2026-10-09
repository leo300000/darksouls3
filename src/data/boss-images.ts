/**
 * Bibliothèque d'images des boss (fichiers locaux dans `public/images/boss/`).
 *
 * Chaque boss a un chemin réservé, dérivé de son identifiant :
 *   - `images/boss/<slug>.webp`        grand visuel de la fiche (3:4, 900 × 1200)
 *   - `images/boss/<slug>-thumb.webp`  miniature portrait (3:4, 450 × 600 : accueil, guide)
 *   - `images/boss/<slug>-card.webp`   vignette des cartes de la liste des boss (16:10, 800 × 500)
 * Les fichiers sont produits par `npm run images:boss` à partir des sources placées dans
 * `assets/boss-src/<slug>.(png|jpg|webp)`.
 *
 * Statuts :
 *   - "integre"    : fichier présent, provenance et licence vérifiées, affiché sur le site ;
 *   - "a-verifier" : fichier présent mais licence ou fidélité à confirmer — non affiché ;
 *   - "a-produire" : aucune image réutilisable ; l'emblème généré s'affiche, signalé comme provisoire.
 *
 * Aucune image officielle (captures, artworks de FromSoftware / Bandai Namco) ni image de
 * fan sans licence explicite ne doit être ajoutée. `npm run data:validate` vérifie les
 * fichiers, les doublons et la cohérence des statuts.
 */

export type BossImageStatus = "integre" | "a-verifier" | "a-produire";

export interface BossImage {
  /** Chemin relatif à `public/` (sans préfixe de déploiement). */
  file: string;
  thumb: string;
  card: string;
  width: number;
  height: number;
  alt: string;
  status: BossImageStatus;
  /** Provenance : « Illustration originale », URL de la page source, etc. */
  source: string | null;
  author: string | null;
  license: string | null;
  note?: string;
}

const W = 900;
const H = 1200;

function entry(slug: string, alt: string, extra: Partial<BossImage> = {}): BossImage {
  return {
    file: `images/boss/${slug}.webp`,
    thumb: `images/boss/${slug}-thumb.webp`,
    card: `images/boss/${slug}-card.webp`,
    width: W,
    height: H,
    alt,
    status: "a-produire",
    source: null,
    author: null,
    license: null,
    ...extra,
  };
}

/** Une entrée par boss, indexée par l'identifiant (slug) utilisé dans `bosses.ts`. */
export const bossImages: Record<string, BossImage> = {
  "iudex-gundyr": entry("iudex-gundyr", "Iudex Gundyr, chevalier en armure tenant une hallebarde, dans le Cimetière des Cendres"),
  vordt: entry("vordt", "Vordt de la vallée boréale, bête en armure maniant une masse, dans une cour enneigée"),
  "grand-bois-maudit": entry("grand-bois-maudit", "Le Grand Bois maudit pourrissant, arbre colossal couvert de tumeurs"),
  "sage-cristallin": entry("sage-cristallin", "Le Sage cristallin, sorcier en robe entouré d'éclats de cristal"),
  "diacres-des-profondeurs": entry("diacres-des-profondeurs", "Les Diacres des profondeurs, procession de prêtres encapuchonnés dans une cathédrale"),
  "veilleurs-des-abysses": entry("veilleurs-des-abysses", "Les Veilleurs des Abysses, chevaliers en cape maniant épée et dague"),
  "high-lord-wolnir": entry("high-lord-wolnir", "High Lord Wolnir, squelette géant couronné émergeant des ténèbres"),
  "vieux-roi-demon": entry("vieux-roi-demon", "Le Vieux Roi démon, démon massif dans des ruines incandescentes"),
  "pontife-sulyvahn": entry("pontife-sulyvahn", "Le Pontife Sulyvahn, prélat maniant deux épées, l'une de feu, l'autre de magie"),
  yhorm: entry("yhorm", "Yhorm le Géant, géant armé d'un immense couperet"),
  aldrich: entry("aldrich", "Aldrich, Dévoreur des dieux, masse informe surmontée d'une silhouette drapée"),
  "danseuse-de-la-vallee-boreale": entry("danseuse-de-la-vallee-boreale", "La Danseuse de la vallée boréale, silhouette élancée maniant une lame courbe enflammée"),
  "armure-du-tueur-de-dragons": entry("armure-du-tueur-de-dragons", "L'Armure du tueur de dragons, armure vide maniant une grande hache et un bouclier"),
  oceiros: entry("oceiros", "Oceiros, le Roi consumé, créature draconique pâle dans un jardin"),
  "champion-gundyr": entry("champion-gundyr", "Champion Gundyr, chevalier en armure à la hallebarde, dans un cimetière sombre"),
  "wyverne-antique": entry("wyverne-antique", "La Wyverne antique, dragon gigantesque sur un pic"),
  "roi-sans-nom": entry("roi-sans-nom", "Le Roi sans nom chevauchant un dragon de tempête, lance en main"),
  "lorian-et-lothric": entry("lorian-et-lothric", "Lorian et Lothric, les princes jumeaux, l'aîné portant le cadet"),
  "ame-des-cendres": entry("ame-des-cendres", "L'Âme des cendres, guerrier carbonisé devant la Première Flamme"),
  "gardien-des-tombes-du-champion": entry("gardien-des-tombes-du-champion", "Le Gardien des tombes du champion et le Grand loup, dans un paysage enneigé"),
  "soeur-friede": entry("soeur-friede", "Sœur Friede, femme en robe blanche maniant une faux, dans une chapelle glacée"),
  "prince-demon": entry("prince-demon", "Le Prince démon, démon ailé enflammé dans un paysage de ruines"),
  halflight: entry("halflight", "Halflight, Lance de l'Église, guerrier masqué devant un autel"),
  midir: entry("midir", "Midir le Dévoreur des ténèbres, dragon noir crachant des ténèbres"),
  "slave-knight-gael": entry("slave-knight-gael", "Gael, le Chevalier esclave, chevalier en cape rouge en lambeaux"),
};

export function bossImage(slug: string): BossImage | null {
  return bossImages[slug] ?? null;
}

/** Image affichable : uniquement les entrées au statut « integre ». */
export function displayableBossImage(slug: string): BossImage | null {
  const img = bossImages[slug];
  return img && img.status === "integre" ? img : null;
}

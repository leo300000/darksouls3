import type { Dlc } from "./types";

/** Types du catalogue généré (src/data/generated/catalog.json) par scripts/build-catalog.ts. */

export type EntityKind =
  | "arme" | "bouclier" | "armure" | "ensemble" | "anneau" | "sort" | "objet"
  | "boss" | "pnj" | "zone" | "serment" | "ennemi";

export interface CatalogEntity {
  key: string; // identifiant stable = slug
  kind: EntityKind;
  name: string; // nom affiché (anglais officiel pour les objets, français pour boss/PNJ/zones)
  nameEn: string;
  href: string | null; // null = entité sans fiche (ennemis génériques)
  category: string; // catégorie lisible (FR)
  dlc: Dlc;
  /** Uniquement pour les sorts. */
  school?: "sorcellerie" | "pyromancie" | "miracle";
  /** Uniquement pour les pièces d'armure. */
  slot?: "tete" | "torse" | "mains" | "jambes";
  /** Clé de l'ensemble d'armure parent, si identifié. */
  set?: string;
}

/** Segment de texte enrichi : texte brut ou lien vers une entité. */
export interface Seg {
  t?: string;
  l?: string; // libellé du lien tel qu'écrit dans la source
  k?: string | null; // clé d'entité résolue (null = non résolue)
}

export interface CatalogStep {
  id: string;
  zone: string; // slug de zone
  tags: string[];
  ng: string | null;
  fr: Seg[];
  en: Seg[];
}

export interface ChecklistEntry {
  id: string;
  group: string; // identifiant de section source
  subject: string | null; // clé d'entité principale (sort, anneau…)
  label: string; // libellé court (nom du geste, de l'infusion…)
  fr: Seg[];
}

export interface Catalog {
  generatedAt: string;
  source: { name: string; author: string; url: string; license: string };
  entities: Record<string, CatalogEntity>;
  steps: CatalogStep[];
  mentions: Record<string, string[]>; // clé d'entité → ids d'étapes
  checklists: Record<string, ChecklistEntry[]>; // section → entrées
  crowTrades: { id: string; give: string[]; get: string[] }[];
  unresolved: string[]; // libellés non résolus (pour la maintenance)
}

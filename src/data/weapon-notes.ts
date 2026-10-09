import type { WeaponStats, Confidence } from "./types";

/**
 * Compléments éditoriaux pour les équipements.
 *
 * - `drops` : butins d'ennemis génériques couramment documentés. Connaissance de rédaction,
 *   marquée « à vérifier » dans l'interface.
 * - `stats` : statistiques chiffrées. VIDE volontairement : aucune valeur n'a pu être recoupée
 *   pendant cette session. Ajoutez ici des entrées sourcées (voir README, « Compléter les données »).
 */

export const enemyDrops: Record<string, { from: string; confidence: Confidence }> = {
  "lothric-knight-sword": { from: "Chevaliers de Lothric", confidence: "unverified" },
  "lothric-knight-greatsword": { from: "Chevaliers de Lothric", confidence: "unverified" },
  "lothric-knight-long-spear": { from: "Chevaliers de Lothric", confidence: "unverified" },
  "lothric-knight-shield": { from: "Chevaliers de Lothric", confidence: "unverified" },
  "lothric-knight-greatshield": { from: "Chevaliers de Lothric", confidence: "unverified" },
  "black-knight-greatsword": { from: "Chevaliers noirs", confidence: "unverified" },
  "black-knight-greataxe": { from: "Chevaliers noirs", confidence: "unverified" },
  "black-knight-shield": { from: "Chevaliers noirs", confidence: "unverified" },
  "pontiff-knight-curved-sword": { from: "Chevaliers du Pontife", confidence: "unverified" },
  "pontiff-knight-great-scythe": { from: "Chevaliers du Pontife", confidence: "unverified" },
  "pontiff-knight-shield": { from: "Chevaliers du Pontife", confidence: "unverified" },
  "cathedral-knight-greatsword": { from: "Chevaliers de la cathédrale", confidence: "unverified" },
  "cathedral-knight-greatshield": { from: "Chevaliers de la cathédrale", confidence: "unverified" },
  "carthus-curved-sword": { from: "Squelettes de Carthus", confidence: "unverified" },
  "carthus-shotel": { from: "Squelettes de Carthus", confidence: "unverified" },
  "carthus-curved-greatsword": { from: "Squelettes de Carthus", confidence: "unverified" },
  "carthus-shield": { from: "Squelettes de Carthus", confidence: "unverified" },
  "rotten-ghru-dagger": { from: "Ghrus", confidence: "unverified" },
  "rotten-ghru-curved-sword": { from: "Ghrus", confidence: "unverified" },
  "rotten-ghru-spear": { from: "Ghrus", confidence: "unverified" },
  "ghru-rotshield": { from: "Ghrus", confidence: "unverified" },
  "winged-knight-twinaxes": { from: "Chevaliers ailés", confidence: "unverified" },
  "winged-knight-halberd": { from: "Chevaliers ailés", confidence: "unverified" },
  "silver-knight-shield": { from: "Chevaliers d'argent", confidence: "unverified" },
  "thrall-axe": { from: "Thralls", confidence: "unverified" },
  "man-serpent-hatchet": { from: "Hommes-serpents", confidence: "unverified" },
  "corvian-greatknife": { from: "Corviens", confidence: "unverified" },
  "great-corvian-scythe": { from: "Corviens", confidence: "unverified" },
  "storytellers-staff": { from: "Conteurs corviens", confidence: "unverified" },
  "man-grubs-staff": { from: "Man-grubs", confidence: "unverified" },
};

/** Statistiques sourcées par slug d'arme. À compléter avec des données recoupées. */
export const weaponStats: Record<string, { stats: WeaponStats; confidence: Confidence; source: string }> = {};

/**
 * Métadonnées des sources. Chaque donnée sensible de l'archive porte un niveau de fiabilité
 * (voir types.ts : Confidence) qui renvoie à l'une de ces catégories.
 */
export interface SourceMeta {
  id: string;
  name: string;
  url?: string;
  license?: string;
  covers: string[];
  status: "integre" | "connaissance" | "a-integrer";
  note: string;
}

export const sources: SourceMeta[] = [
  {
    id: "zk-cheatsheet",
    name: "Dark Souls 3 Cheat Sheet — Zachary Kjellberg & contributeurs",
    url: "https://github.com/ZKjellberg/dark-souls-3-cheat-sheet",
    license: "MIT",
    covers: ["Parcours détaillé des 22 zones (983 étapes)", "Localisations des objets, armes, armures, anneaux et sorts", "Listes des sorts, anneaux, gestes, infusions et succès", "Échanges du corbeau", "Liste des armes, boucliers et pièces d'armure"],
    status: "integre",
    note: "Source principale, structurée automatiquement (scripts/parse-cheatsheet.py) puis traduite en français. Les tags « manquable », « NG+ », « boss », « PNJ » viennent de cette source.",
  },
  {
    id: "redaction",
    name: "Connaissance de rédaction",
    covers: ["Fiches de boss (attaques, phases, stratégies)", "Âmes de boss (valeurs marquées « à vérifier »)", "Faiblesses et résistances (marquées « à vérifier »)", "Effets qualitatifs des anneaux", "Lore, interprétations et théories", "Descriptions de zones"],
    status: "connaissance",
    note: "Rédigé sans accès en ligne aux wikis pendant la session (réseau restreint) : non recoupé. Les valeurs chiffrées concernées portent le badge « À vérifier ».",
  },
  {
    id: "stats",
    name: "Statistiques chiffrées (armes, armures, sorts, PV des boss)",
    covers: ["Dégâts de base", "Scaling", "Exigences", "Poids", "Coûts en PC", "Points de vie"],
    status: "a-integrer",
    note: "Volontairement vides : à importer depuis une source fiable (données de jeu extraites ou référence détaillée) via src/data/weapon-notes.ts.",
  },
];

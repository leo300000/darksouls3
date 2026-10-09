import "server-only";
import { entitiesOf, gearInfo, type GearInfo } from "./data";
import { zoneBySlug } from "@/data/zones";
import type { CatalogRow } from "@/components/catalog/CatalogBrowser";

export function weaponRows(): CatalogRow[] {
  return [...entitiesOf("arme"), ...entitiesOf("bouclier")].map((e) => {
    const g = gearInfo(e);
    return {
      key: e.key,
      name: e.name,
      href: e.href,
      dlc: e.dlc,
      facets: {
        categorie: [e.category],
        type: [e.kind === "arme" ? "Arme" : "Bouclier"],
        dlc: [e.dlc],
        methode: g.acquisitions,
        zone: g.zones.map((z) => zoneBySlug.get(z)?.name ?? z),
        boss: [g.transposition ? "Arme de boss (transposition)" : "Autre"],
        disponibilite: [g.availableBeforeEnd ? "Avant le boss final" : "Après le boss final"],
        infusion: [g.infusable === false ? "Non infusable" : g.infusable ? "Infusable" : "Non renseigné"],
        manquable: [g.missable ? "Manquable" : g.ngOnly ? `Uniquement ${g.ngOnly.toUpperCase()}` : "Non signalé manquable"],
        ...statFacets(g),
      },
      cols: {
        obtention: g.transposition ? `Âme : ${g.transposition.bossName}` : g.acquisitions.join(", "),
        lieu: g.zones.map((z) => zoneBySlug.get(z)?.name ?? z).join(", ") || (g.enemyDrop ? g.enemyDrop.from : "—"),
      },
    };
  });
}

export type { GearInfo };

/** Facettes chiffrées : générées uniquement pour les armes dont les statistiques sont sourcées. */
function statFacets(g: GearInfo): Record<string, string[]> {
  const st = g.stats?.stats;
  if (!st) return {};
  const w = st.weight;
  const req = st.requirements;
  const maxReq = Math.max(0, ...Object.values(req).map((v) => v ?? 0));
  return {
    poids: [w < 3 ? "Moins de 3" : w < 6 ? "3 à 6" : w < 10 ? "6 à 10" : "10 et plus"],
    exigences: [maxReq <= 12 ? "Faibles (≤ 12)" : maxReq <= 20 ? "Moyennes (13–20)" : "Élevées (> 20)"],
    scaling: Object.entries(st.scaling).filter(([, v]) => v && v !== "-").map(([k, v]) => `${k} ${v}`),
    degats: Object.entries(st.damage).filter(([, v]) => (v ?? 0) > 0).map(([k]) => k),
  };
}

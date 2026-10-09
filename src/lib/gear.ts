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
      },
      cols: {
        obtention: g.transposition ? `Âme : ${g.transposition.bossName}` : g.acquisitions.join(", "),
        lieu: g.zones.map((z) => zoneBySlug.get(z)?.name ?? z).join(", ") || (g.enemyDrop ? g.enemyDrop.from : "—"),
      },
    };
  });
}

export type { GearInfo };

import "server-only";
import { checklistEntriesFor, entity, entitiesOf, mentionsOf } from "./data";
import type { CatalogEntity } from "@/data/catalog-types";

const ACH_SECTIONS: Record<string, string> = {
  Master_of_Sorceries: "Master of Sorceries",
  Master_of_Pyromancies: "Master of Pyromancies",
  Master_of_Miracles: "Master of Miracles",
};

export interface SpellInfo {
  entity: CatalogEntity;
  vendors: CatalogEntity[];
  price: number[];
  tomes: CatalogEntity[];
  soul: CatalogEntity | null;
  covenant: CatalogEntity | null;
  achievement: string | null;
  method: string;
  found: boolean;
}

export function spellInfo(e: CatalogEntity): SpellInfo {
  const entries = checklistEntriesFor(e.key);
  const segs = entries.flatMap((x) => x.fr);
  const ents = segs.map((s) => entity(s.k)).filter((x): x is CatalogEntity => !!x && x.key !== e.key);
  const text = segs.map((s) => s.t ?? "").join(" ");
  const price = [...text.matchAll(/(\d[\d\s  ]*)\s*âmes/g)].map((m) => Number(m[1].replace(/\D/g, ""))).filter(Boolean);
  const vendors = [...new Map(ents.filter((x) => x.kind === "pnj").map((x) => [x.key, x])).values()];
  const tomes = ents.filter((x) => x.category === "Tomes et parchemins");
  const soul = ents.find((x) => x.category === "Âmes de boss") ?? null;
  const covenant = ents.find((x) => x.kind === "serment") ?? null;
  const found = mentionsOf(e.key).length > 0;
  const method = soul ? "Transposition" : covenant ? "Récompense de serment" : vendors.length ? "Marchand" : found || /trouv|cadavre|laiss|obten|remis|sur un/i.test(text) ? "Trouvé ou remis" : "À compléter";
  return {
    entity: e,
    vendors,
    price,
    tomes,
    soul,
    covenant,
    achievement: entries.map((x) => ACH_SECTIONS[x.group]).find(Boolean) ?? null,
    method,
    found,
  };
}

export function allSpells() {
  return entitiesOf("sort").map(spellInfo);
}

import "server-only";
import { catalog, zones, bosses, npcs, endings, loreArticles, covenants } from "./data";
import { NAV } from "./nav";
import type { SearchDoc } from "./search";
import { fold } from "./text";
import { dlcLabel } from "@/components/ui/Badges";

const KIND_CAT: Record<string, string> = {
  arme: "Armes", bouclier: "Boucliers", armure: "Armures", ensemble: "Ensembles", anneau: "Anneaux", sort: "Sorts", objet: "Objets",
};

export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const z of zones) docs.push({ t: z.name, s: z.nameEn, c: "Zones", h: `/guide/${z.slug}`, k: fold(`${z.nameEn} ${z.subAreas.join(" ")} ${z.bonfires.join(" ")}`) });
  for (const b of bosses) docs.push({ t: b.name, s: `${b.nameEn} · ${zones.find((z) => z.slug === b.zone)?.name ?? ""}`, c: "Boss", h: `/boss/${b.slug}`, k: fold(b.aliases.join(" ")) });
  for (const n of npcs) {
    docs.push({ t: n.name, s: n.role, c: "Personnages", h: `/pnj/${n.slug}`, k: fold(`${n.nameEn} ${n.aliases.join(" ")}`) });
    if (n.quest) docs.push({ t: n.quest.title, s: `Quête — ${n.name}`, c: "Quêtes", h: `/pnj/${n.slug}#quete`, k: fold(n.nameEn) });
  }
  for (const e of endings) docs.push({ t: e.name, s: e.nameEn, c: "Fins", h: `/fins/${e.slug}`, k: fold(e.nameEn) });
  for (const a of loreArticles) docs.push({ t: a.title, s: a.summary.slice(0, 70), c: "Lore", h: `/lore/${a.slug}` });
  for (const c of covenants) docs.push({ t: c.name, s: c.nameEn, c: "Serments", h: `/serments#${c.slug}`, k: fold(c.nameEn) });
  for (const e of Object.values(catalog.entities)) {
    const cat = KIND_CAT[e.kind];
    if (!cat || !e.href) continue;
    docs.push({ t: e.name, s: `${e.category}${e.dlc !== "base" ? ` · ${dlcLabel(e.dlc)}` : ""}`, c: cat, h: e.href });
  }
  for (const g of NAV) for (const it of g.items) docs.push({ t: it.label, s: g.title, c: "Pages", h: it.href });
  return docs;
}

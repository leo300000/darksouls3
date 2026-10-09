import "server-only";
import catalogJson from "@/data/generated/catalog.json";
import type { Catalog, CatalogEntity, CatalogStep, ChecklistEntry, EntityKind } from "@/data/catalog-types";
import { zones, zoneBySlug } from "@/data/zones";
import { bosses, bossBySlug } from "@/data/bosses";
import { npcs, npcBySlug } from "@/data/npcs";
import { endings } from "@/data/endings";
import { loreArticles, loreBySlug } from "@/data/lore";
import { covenants } from "@/data/covenants";
import { enemyDrops, weaponStats } from "@/data/weapon-notes";
import { slugify } from "./text";

export const catalog = catalogJson as unknown as Catalog;

const stepById = new Map(catalog.steps.map((s) => [s.id, s]));
const entityList = Object.values(catalog.entities);

export function entity(key: string | null | undefined): CatalogEntity | null {
  return key ? (catalog.entities[key] ?? null) : null;
}

export function entitiesOf(kind: EntityKind): CatalogEntity[] {
  return entityList.filter((e) => e.kind === kind);
}

export function entityBySlug(kind: EntityKind, slug: string): CatalogEntity | null {
  return catalog.entities[`${kind}:${slug}`] ?? null;
}

export function stepsForZone(zone: string): CatalogStep[] {
  return catalog.steps.filter((s) => s.zone === zone);
}

export function step(id: string): CatalogStep | null {
  return stepById.get(id) ?? null;
}

/** Étapes du parcours qui mentionnent une entité (localisations sourcées). */
export function mentionsOf(key: string): CatalogStep[] {
  return (catalog.mentions[key] ?? []).map((id) => stepById.get(id)!).filter(Boolean);
}

export function checklistEntriesFor(key: string): ChecklistEntry[] {
  return Object.values(catalog.checklists)
    .flat()
    .filter((e) => e.subject === key);
}

export function checklist(section: string): ChecklistEntry[] {
  return catalog.checklists[section] ?? [];
}

/* ───────────── Équipement enrichi ───────────── */

export type Acquisition = "Trouvé" | "Coffre" | "Mimic" | "Butin de PNJ" | "Butin d'ennemi" | "Boss" | "Transposition" | "Marchand" | "Échange" | "À compléter";

export interface GearInfo {
  entity: CatalogEntity;
  steps: CatalogStep[];
  acquisitions: Acquisition[];
  transposition: { boss: string; bossName: string; soul: string } | null;
  enemyDrop: { from: string; confidence: import("@/data/types").Confidence } | null;
  missable: boolean;
  ngOnly: string | null;
  availableBeforeEnd: boolean;
  infusable: boolean | null;
  stats: (typeof weaponStats)[string] | null;
  zones: string[];
}

const transpositionIndex = new Map<string, { boss: string; bossName: string; soul: string }>();
for (const b of bosses) for (const t of b.transpositions) transpositionIndex.set(slugify(t), { boss: b.slug, bossName: b.name, soul: b.soulItem ?? "" });
// Âmes hors boss principaux documentées par la source
transpositionIndex.set("havels-ring", { boss: "", bossName: "Démon errant (Stray Demon)", soul: "Soul of a Stray Demon" });
transpositionIndex.set("boulder-heave", { boss: "", bossName: "Démon errant (Stray Demon)", soul: "Soul of a Stray Demon" });
transpositionIndex.set("bountiful-sunlight", { boss: "", bossName: "Rosaria", soul: "Soul of Rosaria" });

function textOf(step: CatalogStep): string {
  return step.en.map((s) => s.t ?? s.l ?? "").join("");
}

export function gearInfo(e: CatalogEntity): GearInfo {
  const steps = mentionsOf(e.key);
  const slug = e.key.split(":")[1];
  const transposition = transpositionIndex.get(slug) ?? null;
  const drop = enemyDrops[slug] ?? null;
  const acq = new Set<Acquisition>();
  for (const s of steps) {
    const txt = textOf(s);
    if (/mimic/i.test(txt)) acq.add("Mimic");
    else if (s.tags.includes("boss") && /(defeat|kill)/i.test(txt)) acq.add("Boss");
    else if (/(sold|purchase|buy)/i.test(txt)) acq.add("Marchand");
    else if (/trade/i.test(txt)) acq.add("Échange");
    else if (/chest/i.test(txt)) acq.add("Coffre");
    else if (s.tags.includes("npc") || /(invade|invasion|killing him|kill her|defeat her|drops)/i.test(txt)) acq.add("Butin de PNJ");
    else if (/(kill|drops)/i.test(txt)) acq.add("Butin d'ennemi");
    else acq.add("Trouvé");
  }
  if (transposition) acq.add("Transposition");
  if (drop) acq.add("Butin d'ennemi");
  if (/crow_/.test(JSON.stringify(catalog.crowTrades.filter((t) => t.get.includes(e.key)).map((t) => t.id)))) acq.add("Échange");
  if (acq.size === 0) acq.add("À compléter");
  const ngSteps = steps.filter((s) => s.ng);
  const isPostgame = transposition?.soul === "Soul of the Lords";
  const isBossWeapon = !!transposition && (e.kind === "arme" || e.kind === "bouclier");
  return {
    entity: e,
    steps,
    acquisitions: [...acq],
    transposition,
    enemyDrop: drop,
    missable: steps.length > 0 && steps.every((s) => s.tags.includes("miss")),
    ngOnly: steps.length > 0 && ngSteps.length === steps.length ? ngSteps[0].ng : null,
    availableBeforeEnd: !isPostgame,
    infusable: isBossWeapon ? false : null,
    stats: weaponStats[slug] ?? null,
    zones: [...new Set(steps.map((s) => s.zone))],
  };
}

/* ───────────── Références croisées ───────────── */

export interface RefLink {
  href: string;
  label: string;
  kind: string;
}

/** Résout un slug éditorial (boss, PNJ, zone, lore) vers un lien. */
export function resolveRef(slug: string): RefLink | null {
  const b = bossBySlug.get(slug);
  if (b) return { href: `/boss/${slug}`, label: b.name, kind: "Boss" };
  const n = npcBySlug.get(slug);
  if (n) return { href: `/pnj/${slug}`, label: n.name, kind: "PNJ" };
  const z = zoneBySlug.get(slug);
  if (z) return { href: `/guide/${slug}`, label: z.name, kind: "Zone" };
  const l = loreBySlug.get(slug);
  if (l) return { href: `/lore/${slug}`, label: l.title, kind: "Lore" };
  return null;
}

export function refFor(kind: "boss" | "pnj" | "zone" | "lore" | "objet", slug: string): RefLink | null {
  if (kind === "objet") {
    const key = findItemKeyBySlug(slug);
    const e = entity(key);
    return e && e.href ? { href: e.href, label: e.name, kind: e.category } : null;
  }
  return resolveRef(slug);
}

/** Retrouve une entité d'équipement/objet par son nom anglais. */
export function itemByName(name: string): CatalogEntity | null {
  const slug = slugify(name);
  return entity(findItemKeyBySlug(slug));
}

function findItemKeyBySlug(slug: string): string | null {
  for (const k of ["objet", "arme", "bouclier", "anneau", "sort", "ensemble", "armure"] as const) {
    if (catalog.entities[`${k}:${slug}`]) return `${k}:${slug}`;
  }
  return null;
}

export { zones, bosses, npcs, endings, loreArticles, covenants };

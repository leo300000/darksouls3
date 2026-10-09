/**
 * Valide la cohérence des données : chaque identifiant référencé doit exister.
 * Usage : npm run data:validate (code de sortie 1 en cas d'erreur).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { zones } from "../src/data/zones";
import { bosses } from "../src/data/bosses";
import { npcs } from "../src/data/npcs";
import { endings } from "../src/data/endings";
import { loreArticles, loreEdges, loreNodes, timeline } from "../src/data/lore";
import { covenants } from "../src/data/covenants";
import type { Catalog } from "../src/data/catalog-types";
import { slugify } from "../src/lib/text";

const catalog: Catalog = JSON.parse(readFileSync(join(__dirname, "../src/data/generated/catalog.json"), "utf8"));
const errors: string[] = [];
const warn: string[] = [];
const Z = new Set(zones.map((z) => z.slug));
const B = new Set(bosses.map((b) => b.slug));
const N = new Set(npcs.map((n) => n.slug));
const L = new Set(loreArticles.map((a) => a.slug));
const E = new Set(endings.map((e) => e.slug));
const anyRef = (s: string) => Z.has(s) || B.has(s) || N.has(s) || L.has(s);
const itemExists = (name: string) =>
  ["objet", "arme", "bouclier", "anneau", "sort", "ensemble", "armure"].some((k) => catalog.entities[`${k}:${slugify(name)}`]);

const dup = (arr: string[], what: string) => {
  const seen = new Set<string>();
  for (const s of arr) {
    if (seen.has(s)) errors.push(`${what} en double : ${s}`);
    seen.add(s);
  }
};
dup(zones.map((z) => z.slug), "zone");
dup(bosses.map((b) => b.slug), "boss");
dup(npcs.map((n) => n.slug), "PNJ");
dup(loreArticles.map((a) => a.slug), "article");
for (const s of [...B]) if (N.has(s)) errors.push(`Slug partagé boss/PNJ : ${s}`);

for (const z of zones) {
  for (const c of z.connections) if (!Z.has(c.zone)) errors.push(`Zone ${z.slug} : connexion inconnue ${c.zone}`);
  for (const b of z.bosses) if (!B.has(b)) errors.push(`Zone ${z.slug} : boss inconnu ${b}`);
  for (const n of [...z.npcs, ...z.questsAffected]) if (!N.has(n)) errors.push(`Zone ${z.slug} : PNJ inconnu ${n}`);
  if (!catalog.steps.some((s) => s.zone === z.slug)) errors.push(`Zone ${z.slug} : aucune étape de parcours`);
}
for (const b of bosses) {
  if (!Z.has(b.zone)) errors.push(`Boss ${b.slug} : zone inconnue ${b.zone}`);
  for (const r of b.lore.relations) if (!anyRef(r.target)) errors.push(`Boss ${b.slug} : relation inconnue ${r.target}`);
  for (const t of b.transpositions) if (!itemExists(t)) errors.push(`Boss ${b.slug} : transposition introuvable ${t}`);
  for (const d of b.drops) if (!itemExists(d)) warn.push(`Boss ${b.slug} : objet sans fiche ${d}`);
  if (b.souls && b.souls.confidence !== "game" && !b.souls.note) errors.push(`Boss ${b.slug} : âmes sans note de fiabilité`);
}
for (const n of npcs) {
  for (const l of n.locations) if (!Z.has(l.zone)) errors.push(`PNJ ${n.slug} : zone inconnue ${l.zone}`);
  for (const r of n.relations) if (!anyRef(r.target)) errors.push(`PNJ ${n.slug} : relation inconnue ${r.target}`);
  for (const s of n.quest?.steps ?? []) if (s.zone && !Z.has(s.zone)) errors.push(`Quête ${n.slug}/${s.id} : zone inconnue ${s.zone}`);
  for (const d of n.quest?.dependencies ?? []) if (!N.has(d.npc)) errors.push(`Quête ${n.slug} : dépendance inconnue ${d.npc}`);
}
for (const e of endings) {
  for (const c of [...e.characters, ...e.relatedQuests]) if (!anyRef(c)) errors.push(`Fin ${e.slug} : référence inconnue ${c}`);
  for (const i of e.incompatibleWith) if (!E.has(i)) errors.push(`Fin ${e.slug} : fin inconnue ${i}`);
  if (e.variantOf && !E.has(e.variantOf)) errors.push(`Fin ${e.slug} : variante de ${e.variantOf} inconnue`);
}
const kindSet = { boss: B, pnj: N, zone: Z, lore: L } as const;
for (const a of loreArticles)
  for (const r of a.related) {
    if (r.kind === "objet") { if (!itemExists(r.slug)) errors.push(`Lore ${a.slug} : objet inconnu ${r.slug}`); }
    else if (!kindSet[r.kind].has(r.slug)) errors.push(`Lore ${a.slug} : ${r.kind} inconnu ${r.slug}`);
  }
for (const t of timeline) for (const r of t.refs) if (!kindSet[r.kind].has(r.slug)) errors.push(`Chronologie ${t.id} : ${r.kind} inconnu ${r.slug}`);
const nodeIds = new Set(loreNodes.map((n) => n.id));
for (const e of loreEdges) for (const id of [e.from, e.to]) if (!nodeIds.has(id)) errors.push(`Graphe : nœud inconnu ${id}`);
for (const c of covenants) if (!Z.has(c.zone)) errors.push(`Serment ${c.slug} : zone inconnue ${c.zone}`);
if (catalog.unresolved.length) errors.push(`${catalog.unresolved.length} liens non résolus dans le catalogue`);

for (const w of warn) console.warn(`⚠ ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  console.error(`\n${errors.length} erreur(s).`);
  process.exit(1);
}
console.log(`✓ Données cohérentes : ${zones.length} zones, ${bosses.length} boss, ${npcs.length} PNJ, ${endings.length} fins, ${loreArticles.length} articles, ${catalog.steps.length} étapes (${warn.length} avertissement(s)).`);

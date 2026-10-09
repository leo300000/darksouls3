/**
 * Génère src/data/generated/catalog.json à partir :
 *  - de la source MIT structurée (src/data/source/cheatsheet.json),
 *  - des traductions françaises (src/data/walkthrough, src/data/checklists),
 *  - des données éditoriales typées (zones, boss, PNJ).
 *
 * Usage : npm run data:build
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { zones } from "../src/data/zones";
import { bosses } from "../src/data/bosses";
import { npcs } from "../src/data/npcs";
import { covenants } from "../src/data/covenants";
import type { Catalog, CatalogEntity, CatalogStep, ChecklistEntry, Seg, EntityKind } from "../src/data/catalog-types";
import type { Dlc } from "../src/data/types";
import { fold, slugify, stripQuantity } from "../src/lib/text";

const ROOT = join(__dirname, "..");
const data = JSON.parse(readFileSync(join(ROOT, "src/data/source/cheatsheet.json"), "utf8"));

type RawSeg = { t?: string; link?: string; wiki?: string | null };
type RawItem = { id: string; tags: string[]; ng: string | null; segments: RawSeg[] };
type RawSection = { id: string; title: string; items: RawItem[]; groups: { title: string; items: RawItem[] }[] };

const norm = (s: string) => fold(stripQuantity(s)).replace(/\s+/g, " ");

/* ───────────── Registre ───────────── */
const entities: Record<string, CatalogEntity> = {};
const byName = new Map<string, string>(); // nom normalisé → clé
const byWiki = new Map<string, string>(); // slug wiki normalisé → clé

function register(e: CatalogEntity, names: string[], wikis: (string | null | undefined)[] = []) {
  if (!entities[e.key]) entities[e.key] = e;
  for (const n of names) if (n && !byName.has(norm(n))) byName.set(norm(n), e.key);
  for (const w of wikis) if (w && !byWiki.has(norm(w))) byWiki.set(norm(w), e.key);
}

const DLC_ZONES: Record<string, Dlc> = {
  "monde-peint-d-ariandel": "ashes-of-ariandel",
  "monceau-des-residus": "ringed-city",
  "cite-annelee": "ringed-city",
};

// Zones, boss, PNJ, serments (données éditoriales)
for (const z of zones) register({ key: `zone:${z.slug}`, kind: "zone", name: z.name, nameEn: z.nameEn, href: `/guide/${z.slug}`, category: "Zone", dlc: z.dlc }, [z.nameEn, z.name]);
for (const b of bosses) register({ key: `boss:${b.slug}`, kind: "boss", name: b.name, nameEn: b.nameEn, href: `/boss/${b.slug}`, category: "Boss", dlc: b.dlc }, [...b.aliases, b.nameEn]);
for (const n of npcs) register({ key: `pnj:${n.slug}`, kind: "pnj", name: n.name, nameEn: n.nameEn, href: `/pnj/${n.slug}`, category: "PNJ", dlc: n.dlc }, [...n.aliases, n.nameEn]);
for (const c of covenants) register({ key: `serment:${c.slug}`, kind: "serment", name: c.name, nameEn: c.nameEn, href: `/serments#${c.slug}`, category: "Serment", dlc: c.dlc }, [c.nameEn, ...c.aliases]);

// Armes et boucliers
const WEAPON_CAT_FR: Record<string, string> = {
  Daggers: "Dagues", "Straight Swords": "Épées droites", Greatswords: "Grandes épées", "Ultra Greatswords": "Très grandes épées",
  "Curved Swords": "Épées courbes", "Curved Greatswords": "Grandes épées courbes", "Thrusting Swords": "Épées d'estoc", Katanas: "Katanas",
  Axes: "Haches", Greataxes: "Grandes haches", Hammers: "Marteaux", "Great Hammers": "Grands marteaux", Spears: "Lances", Pikes: "Piques",
  Halberds: "Hallebardes", Reapers: "Faux", Whips: "Fouets", Fists: "Poings", Claws: "Griffes", Bows: "Arcs", Greatbows: "Grands arcs",
  Crossbows: "Arbalètes", Staves: "Bâtons", "Pyromancy Flames": "Flammes de pyromancie", Talismans: "Talismans", "Sacred Chimes": "Carillons sacrés",
  Torches: "Torches", "Small Shields": "Petits boucliers", Shields: "Boucliers", Greatshields: "Grands boucliers",
};
const firstLabel = (it: RawItem) => {
  const s = it.segments[0];
  return { label: (s.link ?? s.t ?? "").trim(), wiki: s.wiki ?? null };
};
for (const sec of data.weapons as RawSection[]) {
  for (const g of sec.groups) {
    const cat = WEAPON_CAT_FR[g.title] ?? g.title;
    const kind: EntityKind = sec.id === "Shields" ? "bouclier" : "arme";
    for (const it of g.items) {
      const { label, wiki } = firstLabel(it);
      const slug = slugify(label);
      register({ key: `${kind}:${slug}`, kind, name: label, nameEn: label, href: `/armes/${slug}`, category: cat, dlc: "base" }, [label], [wiki]);
    }
  }
}

// Armures (pièces)
const SLOT: Record<string, { slot: CatalogEntity["slot"]; label: string }> = {
  Helms: { slot: "tete", label: "Casques" }, Chests: { slot: "torse", label: "Torses" },
  Gauntlets: { slot: "mains", label: "Gants" }, Leggings: { slot: "jambes", label: "Jambières" },
};
for (const sec of data.armors as RawSection[]) {
  const s = SLOT[sec.id];
  for (const it of sec.items) {
    const { label, wiki } = firstLabel(it);
    const slug = slugify(label);
    register({ key: `armure:${slug}`, kind: "armure", name: label, nameEn: label, href: `/armures/${slug}`, category: s.label, slot: s.slot, dlc: "base" }, [label], [wiki]);
  }
}

// Sorts et anneaux (listes de complétion)
const SCHOOL: Record<string, "sorcellerie" | "pyromancie" | "miracle"> = {
  Master_of_Sorceries: "sorcellerie", Master_of_Pyromancies: "pyromancie", Master_of_Miracles: "miracle",
};
const DLC_SPELL_SCHOOL: Record<string, "sorcellerie" | "pyromancie" | "miracle"> = {
  "Way of White Corona": "miracle", "Floating Chaos": "pyromancie", "Frozen Weapon": "sorcellerie", "Snap Freeze": "sorcellerie",
  "Lightning Arrow": "miracle", "Projected Heal": "miracle", "Flame Fan": "pyromancie", "Seething Chaos": "pyromancie",
  "Great Soul Dregs": "sorcellerie", "Old Moonlight": "sorcellerie",
};
const SCHOOL_LABEL = { sorcellerie: "Sorcelleries", pyromancie: "Pyromancies", miracle: "Miracles" };
for (const sec of data.checklists as RawSection[]) {
  const isSpell = sec.id in SCHOOL || sec.id === "DLC_Spells";
  const isRing = sec.id === "Master_of_Rings" || sec.id === "DLC_Rings";
  if (!isSpell && !isRing) continue;
  for (const it of sec.items) {
    const { label, wiki } = firstLabel(it);
    const slug = slugify(label);
    if (isSpell) {
      const school = SCHOOL[sec.id] ?? DLC_SPELL_SCHOOL[label];
      if (!school) throw new Error(`École inconnue pour ${label}`);
      register({ key: `sort:${slug}`, kind: "sort", name: label, nameEn: label, href: `/sorts/${slug}`, category: SCHOOL_LABEL[school], school, dlc: sec.id === "DLC_Spells" ? "base" : "base" }, [label], [wiki]);
    } else {
      // les variantes +N ne sont pas enregistrées sous le slug wiki de base
      const isVariant = /\+\d$/.test(label);
      register({ key: `anneau:${slug}`, kind: "anneau", name: label, nameEn: label, href: `/anneaux/${slug}`, category: isVariant ? "Anneaux (variantes NG+)" : "Anneaux", dlc: "base" }, [label], isVariant ? [] : [wiki]);
    }
  }
}

// Ennemis et notions sans fiche (ne doivent pas devenir des « objets »)
const NON_ITEMS = [
  "Misc", "Affinity (wiki)", "Basilisk", "Basilisks", "Boreal Outrider Knight", "Burning Stake Witch", "Fire Witch", "Carthus Sandworm",
  "Cathedral Grave Warden", "Crystal Lizard", "Ravenous Crystal Lizard", "Deep Accursed", "Demon", "Dog", "Dogs", "Drakeblood Knight",
  "Endings", "Evangelist", "Ghru Leaper", "Great Crab", "Hand Ogre", "Hand Ogres", "Havel Knight", "Havel", "Illusory Walls", "illusory wall",
  "Lothric Knight", "Lothric Wyvern", "Lothric Wyverns", "Madwoman", "Mimic", "Poisonhorn Bug", "Poisonhorn Bugs", "Pus of Man",
  "Rapier Champion", "Ringed Knight", "Skeleton Wheel", "Skeleton Wheels", "Stray Demon", "Sulyvahn's Beast", "Sulyvahn's Beasts",
  "Thrall", "Thralls", "Trophy & Achievement Guide", "Wretch", "Wretches", "rat", "Rat", "Velka the Goddess of Sin",
  "Velka the Goddess of Sin's statue", "Giant Humanity", "Humanity", "Sword Master", "Sword Master Saber", "Desert Pyromancer Zoey",
  "Daughter of Crystal Kriemhild", "Black Hand Kamui", "Lion Knight Albert", "Silver Knight Ledo", "Seeker of the Spurned", "Sir Vilhelm",
  "you will have certain options for the endings you can select", "Estus Soup", "Purging Monument", "Gertrude",
  "Sacred Chimes", "Sacred Chime", "Rotten Flesh of Aldrich",
];
for (const n of NON_ITEMS) {
  const slug = slugify(n);
  register({ key: `ennemi:${slug}`, kind: "ennemi", name: n, nameEn: n, href: null, category: "Ennemi ou élément du décor", dlc: "base" }, [n], [n]);
}
// Alias ponctuels (variantes d'écriture de la source)
const ALIASES: Record<string, string> = {
  "Siegbrau": "Siegbräu", "Greirat Ashes": "Greirat's Ashes", "Greirat's ashes": "Greirat's Ashes", "Loretta's bone": "Loretta's Bone",
  "Witch's ring": "Witch's Ring", "Titanite Scales": "Titanite Scale", "Sunlight Medals": "Sunlight Medal", "Young White Branches": "Young White Branch",
  "Refined Gems": "Refined Gem", "Millwood Greatarrows": "Millwood Greatarrow",
  "Blessed Mail Breaker": "Mail Breaker", "Blessed Red and White Shield+1": "Red and White Round Shield", "Deep Battle Axe": "Battle Axe",
  "Lucatiel Mask": "Lucatiel's Mask", "Mound Makers": "Mound-makers", "Mound-Makers": "Mound-makers", "Warriors of Sunlight": "Warrior of Sunlight",
  "Blade of the Darkmoon": "Blades of the Darkmoon", "Small Doll": "Small Doll", "Dorhys' Gnawing": "Dorhys' Gnawing",
  "Soul of Deacons of the Deep": "Soul of the Deacons of the Deep", "Catarina Armor Set": "Catarina Set", "Siegward's Armor Set": "Catarina Set",
  "Executioner's Armor Set": "Executioner Set", "Leonhard's Armor Set": "Leonhard's Set", "Mirrah Chain Armor Set": "Mirrah Chain Set",
  "Morne's Armor Set": "Morne's Set", "Sunless Armor Set": "Sunless Set", "Wolf Knight Armor Set": "Wolf Knight Set",
  "Northern Armor Set": "Northern Armor Set", "Drang Armor Set": "Drang Armor Set", "Sunset Armor Set": "Sunset Armor Set",
  "Millwood Knight Set": "Millwood Set", "Slave Knight Set": "Slave Set", "Lords of Cinder: Abyss Watchers": "Abyss Watchers",
  "Leonhard's": "Leonhard", "Patches": "Unbreakable Patches",
};

/* ───────────── Objets dérivés des liens ───────────── */
const BOSS_SOULS = new Set(["Soul of a Crystal Sage", "Soul of a Stray Demon", "Soul of a Demon", "Soul of Rosaria"]);
function itemCategory(name: string, tags: Set<string>): string {
  const n = name;
  if (BOSS_SOULS.has(n) || bosses.some((b) => b.soulItem === n)) return "Âmes de boss";
  if (/Set$/.test(n)) return "Ensemble d'armure";
  if (/Titanite/.test(n)) return "Matériaux d'amélioration";
  if (/Gem$|Shriving Stone/.test(n)) return "Gemmes d'infusion";
  if (/Coal$/.test(n)) return "Charbons (infusions)";
  if (/^(Large )?Soul of (a|an) /.test(n)) return "Âmes consommables";
  if (/^Soul of /.test(n)) return "Âmes de boss";
  if (/Ashes$/.test(n)) return "Cendres (marchands)";
  if (/Tome|Scroll/.test(n)) return "Tomes et parchemins";
  if (/Carving$/.test(n)) return "Gravures";
  if (/arrow|bolt/i.test(n)) return "Munitions";
  if (/Key|Basin of Vows|Small Doll|Coiled Sword|Transposing Kiln|Cinders of a Lord|Eyes of a Fire Keeper|Dragon .*Stone|Small Envoy Banner|Dragon Torso Stone|Dragon Head Stone/.test(n)) return "Clés et progression";
  if (/Estus Shard|Undead Bone Shard|Ashen Estus Flask|Estus Flask/.test(n)) return "Estus et feux";
  if (/Sunlight Medal|Proof of a Concord Kept|Pale Tongue|Human Dregs|Vertebra Shackle|Eye Orb|Soapstone|Small Lothric Banner|Champion's Bones|Dried Finger|Blue Eye Orb/.test(n)) return "Serments et multijoueur";
  if (/Loretta's Bone|Fire Keeper Soul|Dark Sigil|Sword of Avowal|Blood of the Dark Soul|Filianore's Spear Ornament|Ritual Spear Fragment|Wolf's Blood Swordgrass|Roster of Knights|Church Guardian Shiv/.test(n)) return "Objets de quête et uniques";
  if (/Young White Branch/.test(n)) return "Consommables et divers";
  if (tags.has("estus") || tags.has("bone")) return "Estus et feux";
  return "Consommables et divers";
}

function resolve(label: string, wiki: string | null | undefined): string | null {
  const candidates = [label, stripQuantity(label), ALIASES[label], ALIASES[stripQuantity(label)]].filter(Boolean) as string[];
  for (const c of candidates) {
    const k = byName.get(norm(c));
    if (k) return k;
  }
  if (wiki) {
    const w = ALIASES[wiki] ?? wiki;
    const k = byWiki.get(norm(w)) ?? byName.get(norm(w));
    if (k) return k;
  }
  return null;
}

const unresolved = new Set<string>();
function resolveOrCreate(label: string, wiki: string | null | undefined, tags: Set<string>): string | null {
  const k = resolve(label, wiki);
  if (k) return k;
  // Nouvel objet : nom de base sans quantité ni « +N » d'amélioration
  const base = (ALIASES[stripQuantity(label)] ?? stripQuantity(label)).trim();
  if (!base) return null;
  const category = itemCategory(base, tags);
  const kind: EntityKind = category === "Ensemble d'armure" ? "ensemble" : "objet";
  const slug = slugify(base);
  const key = `${kind}:${slug}`;
  register({ key, kind, name: base, nameEn: base, href: kind === "ensemble" ? `/armures/ensemble/${slug}` : `/objets/${slug}`, category, dlc: "base" }, [base, label], [wiki]);
  return key;
}

const toSegs = (raw: RawSeg[], tags: Set<string>): Seg[] =>
  raw.map((s) => (s.link !== undefined ? { l: s.link, k: resolveOrCreate(s.link, s.wiki, tags) } : { t: s.t ?? "" }));

/** Convertit une traduction « texte [[Lien]] » en segments, en résolvant les liens via les segments source. */
function frSegs(fr: string, src: Seg[], ctx: string): Seg[] {
  const out: Seg[] = [];
  const re = /\[\[(.+?)\]\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(fr))) {
    if (m.index > last) out.push({ t: fr.slice(last, m.index) });
    const label = m[1];
    const hit = src.find((s) => s.l === label);
    if (!hit) unresolved.add(`${ctx}: [[${label}]]`);
    out.push({ l: label, k: hit?.k ?? null });
    last = m.index + m[0].length;
  }
  if (last < fr.length) out.push({ t: fr.slice(last) });
  return out;
}

/* ───────────── Étapes du parcours ───────────── */
const zoneBySection = new Map(zones.map((z) => [z.sourceSection, z]));
const steps: CatalogStep[] = [];
const mentions: Record<string, string[]> = {};
for (const sec of data.playthrough as RawSection[]) {
  const zone = zoneBySection.get(sec.id);
  if (!zone) throw new Error(`Section sans zone : ${sec.id}`);
  const trPath = join(ROOT, "src/data/walkthrough", `${sec.id}.json`);
  const tr: Record<string, string> = existsSync(trPath) ? JSON.parse(readFileSync(trPath, "utf8")) : {};
  for (const it of sec.items) {
    const tags = new Set(it.tags);
    const en = toSegs(it.segments, tags);
    const fr = tr[it.id] ? frSegs(tr[it.id], en, it.id) : en;
    steps.push({ id: it.id, zone: zone.slug, tags: it.tags, ng: it.ng, fr, en });
    for (const s of en) {
      if (!s.k) continue;
      const list = (mentions[s.k] ??= []);
      if (!list.includes(it.id)) list.push(it.id);
    }
  }
}

/* ───────────── Listes de complétion ───────────── */
const checklists: Record<string, ChecklistEntry[]> = {};
for (const sec of data.checklists as RawSection[]) {
  const trPath = join(ROOT, "src/data/checklists", `${sec.id}.json`);
  const tr: Record<string, string> = existsSync(trPath) ? JSON.parse(readFileSync(trPath, "utf8")) : {};
  checklists[sec.id] = sec.items.map((it) => {
    const tags = new Set(it.tags);
    const en = toSegs(it.segments, tags);
    const fr = tr[it.id] ? frSegs(tr[it.id], en, it.id) : en;
    const firstText = (it.segments[0].t ?? "").split(":")[0].trim();
    const subject = en[0]?.k ?? null;
    const label = en[0]?.l ?? firstText;
    return { id: it.id, group: sec.id, subject, label, fr };
  });
}

/* ───────────── Échanges du corbeau ───────────── */
const crowTrades = (data.misc as RawSection[])
  .flatMap((s) => s.items)
  .map((it) => {
    const tags = new Set(it.tags);
    const segs = toSegs(it.segments, tags);
    const forIdx = segs.findIndex((s) => s.t && / for /.test(s.t));
    const keys = (arr: Seg[]) => arr.filter((s) => s.k).map((s) => s.k as string);
    return { id: it.id, give: keys(segs.slice(0, forIdx)), get: keys(segs.slice(forIdx)) };
  });

/* ───────────── DLC par localisation ───────────── */
const stepZone = new Map(steps.map((s) => [s.id, s.zone]));
for (const [key, ids] of Object.entries(mentions)) {
  const e = entities[key];
  if (!e || !["arme", "bouclier", "armure", "ensemble", "anneau", "sort", "objet"].includes(e.kind)) continue;
  const zs = ids.map((id) => stepZone.get(id)!);
  const dlcs = new Set(zs.map((z) => DLC_ZONES[z] ?? "base"));
  if (dlcs.size === 1) e.dlc = [...dlcs][0] as Dlc;
}
// Entrées DLC des listes de complétion
for (const e of checklists.DLC_Spells ?? []) if (e.subject && entities[e.subject] && !mentions[e.subject]) entities[e.subject].dlc = "ringed-city";
for (const e of checklists.DLC_Rings ?? []) if (e.subject && entities[e.subject] && !mentions[e.subject]) entities[e.subject].dlc = "ringed-city";
// Transpositions d'âmes de boss DLC
for (const b of bosses) if (b.dlc !== "base") for (const t of b.transpositions) {
  const k = resolve(t, null);
  if (k && entities[k]) entities[k].dlc = b.dlc;
}
// Correctifs DLC documentés (objets vendus ou non localisés dans le parcours)
const DLC_FIX: Record<string, Dlc> = {
  "arme:splitleaf-greatsword": "ringed-city", // Old Woman's Ashes (Monceau)
  "armure:ordained-hood": "ashes-of-ariandel", "armure:ordained-dress": "ashes-of-ariandel", "armure:ordained-trousers": "ashes-of-ariandel",
};
for (const [k, d] of Object.entries(DLC_FIX)) if (entities[k]) entities[k].dlc = d;

// Pièces d'armure → ensemble (préfixe commun)
for (const e of Object.values(entities)) {
  if (e.kind !== "ensemble") continue;
  const prefix = e.name.replace(/\s+(Armor\s+)?Set$/, "").trim();
  const p = norm(prefix);
  for (const piece of Object.values(entities)) {
    if (piece.kind !== "armure" || piece.set) continue;
    if (norm(piece.name).startsWith(p + " ") || norm(piece.name) === p) {
      piece.set = e.key;
      if (piece.dlc === "base" && e.dlc !== "base") piece.dlc = e.dlc;
    }
  }
}

// Pièces d'armure sans ensemble identifié ni localisation : pas de fiche dédiée (pas de page vide)
const crowGets = new Set(crowTrades.flatMap((t) => t.get));
for (const e of Object.values(entities)) {
  if (e.kind === "armure" && !e.set && !mentions[e.key] && !crowGets.has(e.key)) e.href = null;
}

const catalog: Catalog = {
  generatedAt: new Date().toISOString(),
  source: data.source,
  entities,
  steps,
  mentions,
  checklists,
  crowTrades,
  unresolved: [...unresolved].sort(),
};

mkdirSync(join(ROOT, "src/data/generated"), { recursive: true });
writeFileSync(join(ROOT, "src/data/generated/catalog.json"), JSON.stringify(catalog));
const count = (k: EntityKind) => Object.values(entities).filter((e) => e.kind === k).length;
console.log(
  `Catalogue : ${steps.length} étapes, ${count("arme")} armes, ${count("bouclier")} boucliers, ${count("armure")} pièces d'armure, ` +
    `${count("ensemble")} ensembles, ${count("anneau")} anneaux, ${count("sort")} sorts, ${count("objet")} objets, ${unresolved.size} liens non résolus.`,
);

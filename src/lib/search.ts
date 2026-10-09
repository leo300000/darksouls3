import { fold } from "./text";

/** Entrée compacte de l'index de recherche (servi en JSON statique). */
export interface SearchDoc {
  t: string; // titre
  s?: string; // sous-titre
  c: string; // catégorie affichée
  h: string; // lien
  k?: string; // mots-clés supplémentaires (déjà normalisés)
}

export interface SearchHit extends SearchDoc {
  score: number;
}

const PRIMARY = new Set(["Boss", "Personnages", "Zones", "Fins"]);

export const CATEGORY_ORDER = [
  "Zones", "Boss", "Personnages", "Quêtes", "Fins", "Lore", "Armes", "Boucliers", "Armures", "Ensembles",
  "Anneaux", "Sorts", "Objets", "Serments", "Pages",
];

/** Recherche insensible à la casse et aux accents, tolérante aux mots dans le désordre. */
export function search(index: SearchDoc[], query: string, limit = 60): SearchHit[] {
  const q = fold(query).replace(/\s+/g, " ").trim();
  if (!q) return [];
  const tokens = q.split(" ").filter(Boolean);
  const hits: SearchHit[] = [];
  for (const d of index) {
    const title = fold(d.t);
    const hay = `${title} ${fold(d.s ?? "")} ${d.k ?? ""}`;
    let score = 0;
    if (title === q) score = 1000;
    else if (title.startsWith(q) || title.split(/[\s'’,-]+/).some((w) => w.startsWith(q))) score = 700;
    else if (title.includes(q)) score = 500;
    else if (tokens.every((t) => hay.includes(t))) score = 300 + (tokens.every((t) => title.includes(t)) ? 100 : 0);
    else if (q.length >= 4 && isSubsequence(q.replace(/ /g, ""), title.replace(/ /g, ""))) score = 120;
    if (score > 0) {
      score -= Math.min(title.length, 60) * 0.5; // titres courts favorisés
      if (PRIMARY.has(d.c)) score += 40; // entités principales légèrement favorisées
      hits.push({ ...d, score });
    }
  }
  hits.sort((a, b) => b.score - a.score || a.t.localeCompare(b.t, "fr"));
  return hits.slice(0, limit);
}

function isSubsequence(needle: string, hay: string): boolean {
  let i = 0;
  for (const ch of hay) if (ch === needle[i]) i++;
  return i === needle.length;
}

export function groupHits(hits: SearchHit[]): { category: string; hits: SearchHit[] }[] {
  const map = new Map<string, SearchHit[]>();
  for (const h of hits) (map.get(h.c) ?? map.set(h.c, []).get(h.c)!).push(h);
  return [...map.entries()]
    .sort((a, b) => b[1][0].score - a[1][0].score || CATEGORY_ORDER.indexOf(a[0]) - CATEGORY_ORDER.indexOf(b[0]))
    .map(([category, hs]) => ({ category, hits: hs }));
}

let cached: Promise<SearchDoc[]> | null = null;
export function loadIndex(): Promise<SearchDoc[]> {
  if (!cached) {
    cached = fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/search-index.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<SearchDoc[]>;
      })
      .catch((e) => {
        cached = null;
        throw e;
      });
  }
  return cached;
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Scale } from "lucide-react";
import { activeProfile, setChecked, useHydrated, useStore } from "@/lib/store";
import { fold } from "@/lib/text";

export interface CatalogRow {
  key: string;
  name: string;
  href: string | null;
  subtitle?: string;
  /** Valeurs de facettes : facette → valeurs (multi). */
  facets: Record<string, string[]>;
  /** Colonnes supplémentaires affichées (déjà formatées). */
  cols?: Record<string, string>;
  dlc: string;
}

export interface Facet {
  id: string;
  label: string;
  /** Ordre d'affichage optionnel des valeurs. */
  order?: string[];
}

const DLC_LABEL: Record<string, string> = { base: "Jeu de base", "ashes-of-ariandel": "Ashes of Ariandel", "ringed-city": "The Ringed City" };

export function CatalogBrowser({
  rows,
  facets,
  columns = [],
  compare,
  itemLabel = "éléments",
  collectLabel = "Obtenu",
}: {
  rows: CatalogRow[];
  facets: Facet[];
  columns?: { id: string; label: string }[];
  compare?: { max: number; path: string };
  itemLabel?: string;
  collectLabel?: string;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const store = useStore();
  const hydrated = useHydrated();
  const profile = activeProfile(store);
  const [q, setQ] = useState(params.get("q") ?? "");
  const [sel, setSel] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of facets) {
      const v = params.get(f.id);
      if (v) init[f.id] = v;
    }
    return init;
  });
  const [owned, setOwned] = useState<"tous" | "manquants" | "obtenus">("tous");
  const [cmp, setCmp] = useState<string[]>([]);
  const [sort, setSort] = useState<"nom" | "categorie">("categorie");

  const values = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const f of facets) {
      const set = new Set<string>();
      for (const r of rows) for (const v of r.facets[f.id] ?? []) set.add(v);
      out[f.id] = [...set].sort((a, b) => {
        const ia = f.order?.indexOf(a) ?? -1;
        const ib = f.order?.indexOf(b) ?? -1;
        if (ia >= 0 || ib >= 0) return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
        return a.localeCompare(b, "fr");
      });
    }
    return out;
  }, [rows, facets]);

  const list = useMemo(() => {
    const f = fold(q);
    const l = rows.filter((r) => {
      if (f && !fold(`${r.name} ${r.subtitle ?? ""}`).includes(f)) return false;
      for (const [fid, v] of Object.entries(sel)) if (v && !(r.facets[fid] ?? []).includes(v)) return false;
      if (owned !== "tous") {
        const has = !!profile.checked[r.key];
        if (owned === "obtenus" ? !has : has) return false;
      }
      return true;
    });
    return l.sort((a, b) =>
      sort === "nom" ? a.name.localeCompare(b.name) : (a.facets.categorie?.[0] ?? "").localeCompare(b.facets.categorie?.[0] ?? "", "fr") || a.name.localeCompare(b.name),
    );
  }, [rows, q, sel, owned, profile.checked, sort]);

  const done = hydrated ? rows.filter((r) => profile.checked[r.key]).length : 0;
  const toggleCmp = (slug: string) => setCmp((c) => (c.includes(slug) ? c.filter((x) => x !== slug) : c.length >= (compare?.max ?? 4) ? c : [...c, slug]));

  return (
    <div>
      <div className="panel mb-5 flex flex-wrap items-center gap-4 p-4">
        <div className="min-w-[200px] flex-1">
          <div className="flex items-baseline justify-between text-sm">
            <span className="eyebrow">Collection</span>
            <span className="font-mono">{hydrated ? done : "…"} / {rows.length}</span>
          </div>
          <div className="mt-2 h-1.5 bg-stone/50"><div className="h-full bg-gradient-to-r from-ember to-gold-hi" style={{ width: `${(done / Math.max(rows.length, 1)) * 100}%` }} /></div>
        </div>
        {compare && (
          <button type="button" className="btn btn-sm btn-ember" disabled={cmp.length < 2} onClick={() => router.push(`${compare.path}?ids=${cmp.join(",")}`)} aria-disabled={cmp.length < 2}>
            <Scale size={15} /> Comparer ({cmp.length}/{compare.max})
          </button>
        )}
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input className="input-archive sm:col-span-2 lg:col-span-1" placeholder={`Rechercher parmi ${rows.length} ${itemLabel}…`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Recherche par nom" />
        {facets.map((f) => (
          <select key={f.id} className="input-archive" value={sel[f.id] ?? ""} onChange={(e) => setSel({ ...sel, [f.id]: e.target.value })} aria-label={f.label}>
            <option value="">{f.label} : tous</option>
            {values[f.id].map((v) => (
              <option key={v} value={v}>{f.id === "dlc" ? (DLC_LABEL[v] ?? v) : v}</option>
            ))}
          </select>
        ))}
      </div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {(["tous", "manquants", "obtenus"] as const).map((o) => (
          <button key={o} type="button" className="chip" aria-pressed={owned === o} onClick={() => setOwned(o)}>
            {o === "tous" ? "Tous" : o === "manquants" ? "Manquants" : "Obtenus"}
          </button>
        ))}
        <button type="button" className="chip" aria-pressed={sort === "categorie"} onClick={() => setSort("categorie")}>Tri par catégorie</button>
        <button type="button" className="chip" aria-pressed={sort === "nom"} onClick={() => setSort("nom")}>Tri alphabétique</button>
        {(Object.values(sel).some(Boolean) || q) && (
          <button type="button" className="text-sm text-gold hover:text-gold-hi" onClick={() => { setSel({}); setQ(""); }}>Réinitialiser les filtres</button>
        )}
        <span className="ml-auto text-sm text-dim">{list.length} résultat{list.length > 1 ? "s" : ""}</span>
      </div>

      {list.length === 0 ? (
        <p className="panel p-6 text-dim">Aucun élément ne correspond à ces filtres. Essayez d&apos;en retirer un.</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="table-archive">
              <thead>
                <tr>
                  <th className="w-10"><span className="sr-only">{collectLabel}</span></th>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  {columns.map((c) => <th key={c.id}>{c.label}</th>)}
                  <th>Contenu</th>
                  {compare && <th className="w-24">Comparer</th>}
                </tr>
              </thead>
              <tbody>
                {list.map((r) => {
                  const slug = r.key.split(":")[1];
                  return (
                    <tr key={r.key}>
                      <td><input type="checkbox" className="seal-check" checked={hydrated && !!profile.checked[r.key]} onChange={(e) => setChecked(r.key, e.target.checked)} aria-label={`${collectLabel} : ${r.name}`} /></td>
                      <td>
                        {r.href ? <Link href={r.href} className="font-medium text-parch hover:text-gold-hi">{r.name}</Link> : <span className="text-parch">{r.name}</span>}
                        {r.subtitle && <span className="block text-xs text-ash">{r.subtitle}</span>}
                      </td>
                      <td className="text-dim">{r.facets.categorie?.join(", ")}</td>
                      {columns.map((c) => <td key={c.id} className="text-sm text-dim">{r.cols?.[c.id] ?? "—"}</td>)}
                      <td className="text-xs">{r.dlc === "base" ? <span className="text-ash">Base</span> : <span className="text-frost">{DLC_LABEL[r.dlc]}</span>}</td>
                      {compare && (
                        <td><input type="checkbox" checked={cmp.includes(slug)} onChange={() => toggleCmp(slug)} disabled={!cmp.includes(slug) && cmp.length >= compare.max} aria-label={`Comparer ${r.name}`} className="accent-[rgb(var(--c-ember-hi))]" /></td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <ul className="space-y-2 md:hidden">
            {list.map((r) => {
              const slug = r.key.split(":")[1];
              return (
                <li key={r.key} className="panel flex items-start gap-3 p-3">
                  <input type="checkbox" className="seal-check mt-1" checked={hydrated && !!profile.checked[r.key]} onChange={(e) => setChecked(r.key, e.target.checked)} aria-label={`${collectLabel} : ${r.name}`} />
                  <div className="min-w-0 flex-1">
                    {r.href ? <Link href={r.href} className="font-medium text-parch">{r.name}</Link> : <span className="text-parch">{r.name}</span>}
                    <p className="text-xs text-dim">{r.facets.categorie?.join(", ")}{r.dlc !== "base" ? ` · ${DLC_LABEL[r.dlc]}` : ""}</p>
                    {columns.map((c) => r.cols?.[c.id] ? <p key={c.id} className="text-xs text-ash">{c.label} : {r.cols[c.id]}</p> : null)}
                  </div>
                  {compare && (
                    <label className="flex flex-col items-center text-[0.6rem] text-ash">
                      <input type="checkbox" checked={cmp.includes(slug)} onChange={() => toggleCmp(slug)} disabled={!cmp.includes(slug) && cmp.length >= compare.max} className="h-5 w-5 accent-[rgb(var(--c-ember-hi))]" />
                      Comparer
                    </label>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

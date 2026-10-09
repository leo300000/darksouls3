"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Engraving } from "@/components/art/Engraving";
import type { ArtSpec, Dlc } from "@/data/types";
import { activeProfile, setChecked, useHydrated, useStore } from "@/lib/store";
import { fold } from "@/lib/text";

export interface BossCard {
  slug: string;
  name: string;
  nameEn: string;
  zone: string;
  zoneName: string;
  dlc: Dlc;
  required: boolean;
  lord: boolean;
  order: number;
  weaknesses: string[];
  art: ArtSpec;
}

const DLC_LABEL: Record<Dlc, string> = { base: "Jeu de base", "ashes-of-ariandel": "Ashes of Ariandel", "ringed-city": "The Ringed City" };

export function BossBrowser({ bosses }: { bosses: BossCard[] }) {
  const store = useStore();
  const hydrated = useHydrated();
  const profile = activeProfile(store);
  const [q, setQ] = useState("");
  const [req, setReq] = useState<"tous" | "obligatoires" | "facultatifs">("tous");
  const [dlc, setDlc] = useState<"tous" | Dlc>("tous");
  const [zone, setZone] = useState("toutes");
  const [weak, setWeak] = useState("toutes");
  const [sort, setSort] = useState<"progression" | "alpha">("progression");
  const [onlyFav, setOnlyFav] = useState(false);
  const [hideDone, setHideDone] = useState(false);

  const zones = useMemo(() => [...new Map(bosses.map((b) => [b.zone, b.zoneName])).entries()], [bosses]);
  const weaknesses = useMemo(() => [...new Set(bosses.flatMap((b) => b.weaknesses))].sort(), [bosses]);
  const favs = useMemo(() => new Set(store.favorites.map((f) => f.href)), [store.favorites]);

  const list = useMemo(() => {
    const f = fold(q);
    const l = bosses.filter(
      (b) =>
        (!f || fold(`${b.name} ${b.nameEn} ${b.zoneName}`).includes(f)) &&
        (req === "tous" || (req === "obligatoires") === b.required) &&
        (dlc === "tous" || b.dlc === dlc) &&
        (zone === "toutes" || b.zone === zone) &&
        (weak === "toutes" || b.weaknesses.includes(weak)) &&
        (!onlyFav || favs.has(`/boss/${b.slug}`)) &&
        (!hideDone || !profile.checked[`boss:${b.slug}`]),
    );
    return l.sort((a, b) => (sort === "alpha" ? a.name.localeCompare(b.name, "fr") : a.order - b.order));
  }, [bosses, q, req, dlc, zone, weak, sort, onlyFav, hideDone, favs, profile.checked]);

  const done = hydrated ? bosses.filter((b) => profile.checked[`boss:${b.slug}`]).length : 0;

  return (
    <div>
      <div className="panel mb-6 p-4">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow">Boss vaincus</span>
          <span className="font-mono text-sm">{hydrated ? done : "…"} / {bosses.length}</span>
        </div>
        <div className="mt-2 h-1.5 bg-stone/50">
          <div className="h-full bg-gradient-to-r from-ember to-gold-hi" style={{ width: `${(done / bosses.length) * 100}%` }} />
        </div>
      </div>
      <div className="mb-6 grid gap-3 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <input className="input-archive" placeholder="Rechercher un boss…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Rechercher un boss" />
        <select className="input-archive" value={req} onChange={(e) => setReq(e.target.value as typeof req)} aria-label="Caractère obligatoire">
          <option value="tous">Obligatoires et facultatifs</option>
          <option value="obligatoires">Obligatoires</option>
          <option value="facultatifs">Facultatifs</option>
        </select>
        <select className="input-archive" value={dlc} onChange={(e) => setDlc(e.target.value as typeof dlc)} aria-label="Contenu">
          <option value="tous">Base et DLC</option>
          {(Object.keys(DLC_LABEL) as Dlc[]).map((d) => (
            <option key={d} value={d}>{DLC_LABEL[d]}</option>
          ))}
        </select>
        <select className="input-archive" value={zone} onChange={(e) => setZone(e.target.value)} aria-label="Zone">
          <option value="toutes">Toutes les zones</option>
          {zones.map(([s, n]) => (
            <option key={s} value={s}>{n}</option>
          ))}
        </select>
        <select className="input-archive" value={weak} onChange={(e) => setWeak(e.target.value)} aria-label="Faiblesse">
          <option value="toutes">Toutes faiblesses</option>
          {weaknesses.map((w) => (
            <option key={w} value={w}>Faible : {w}</option>
          ))}
        </select>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button type="button" className="chip" aria-pressed={sort === "progression"} onClick={() => setSort("progression")}>Ordre de progression</button>
        <button type="button" className="chip" aria-pressed={sort === "alpha"} onClick={() => setSort("alpha")}>Ordre alphabétique</button>
        <button type="button" className="chip" aria-pressed={onlyFav} onClick={() => setOnlyFav(!onlyFav)}>Favoris</button>
        <button type="button" className="chip" aria-pressed={hideDone} onClick={() => setHideDone(!hideDone)}>Masquer les vaincus</button>
        <span className="ml-auto text-sm text-dim">{list.length} boss</span>
      </div>
      {weak !== "toutes" && <p className="mb-4 text-xs text-ash">Les faiblesses sont des retours communautaires non recoupés : seuls les boss pour lesquels une faiblesse est renseignée apparaissent.</p>}
      {list.length === 0 && <p className="panel p-6 text-dim">Aucun boss ne correspond à ces filtres.</p>}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((b) => {
          const beaten = hydrated && !!profile.checked[`boss:${b.slug}`];
          return (
            <li key={b.slug} className="panel card-link group relative overflow-hidden">
              <Link href={`/boss/${b.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Engraving spec={b.art} seed={b.slug} variant="sigil" className={`h-full w-full transition duration-700 group-hover:scale-105 ${beaten ? "opacity-40 grayscale" : ""}`} caption={false} title={b.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 font-mono text-xs text-gold">#{String(b.order).padStart(2, "0")}</span>
                  {beaten && <span className="absolute right-3 top-3 border border-ember-hi px-2 py-0.5 font-engrave text-[0.6rem] text-ember-hi">Vaincu</span>}
                </div>
                <div className="p-4 pb-14">
                  <p className="text-[0.7rem] text-gold">{b.zoneName}</p>
                  <h3 className="font-display text-2xl leading-tight text-parch group-hover:text-gold-hi">{b.name}</h3>
                  <p className="text-xs text-ash">{b.nameEn}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[0.68rem]">
                    <span className={`border px-1.5 py-0.5 ${b.required ? "border-gold/50 text-gold-hi" : "border-line/30 text-dim"}`}>{b.required ? "Obligatoire" : "Facultatif"}</span>
                    {b.lord && <span className="border border-ember-hi/50 px-1.5 py-0.5 text-ember-hi">Seigneur des cendres</span>}
                    {b.dlc !== "base" && <span className="border border-frost/50 px-1.5 py-0.5 text-frost">{DLC_LABEL[b.dlc]}</span>}
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setChecked(`boss:${b.slug}`, !beaten)}
                aria-pressed={beaten}
                className="absolute bottom-3 left-4 flex items-center gap-2 text-xs text-dim hover:text-text"
              >
                <span className={`inline-block h-3 w-3 rotate-45 border ${beaten ? "border-ember-hi bg-ember-hi" : "border-gold"}`} /> {beaten ? "Vaincu" : "Marquer vaincu"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

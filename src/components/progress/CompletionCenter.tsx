"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  activeProfile, createProfile, deleteProfile, renameProfile, setChecked, setManyChecked, setNgCycle, switchProfile, useHydrated, useStore,
} from "@/lib/store";
import { QuestStatusSelect } from "@/components/quest/QuestStatusSelect";
import { DataTools } from "./DataTools";
import { fold } from "@/lib/text";

interface Item {
  id: string;
  label: string;
  href?: string;
  note?: string;
  dlc?: string;
  achievement?: string;
}
interface Category {
  id: string;
  label: string;
  description: string;
  items: Item[];
  mode?: "check" | "quest";
}

export function CompletionCenter({ categories }: { categories: Category[] }) {
  const store = useStore();
  const hydrated = useHydrated();
  const p = activeProfile(store);
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [onlyMissing, setOnlyMissing] = useState(true);
  const [scope, setScope] = useState<"tout" | "succes" | "collection">("tout");
  const [newName, setNewName] = useState("");

  const isDone = (c: Category, it: Item) => (c.mode === "quest" ? p.questStatus[it.id.replace(/^quete:/, "")] === "terminee" : !!p.checked[it.id]);
  const stats = categories.map((c) => {
    const done = hydrated ? c.items.filter((it) => isDone(c, it)).length : 0;
    return { c, done, total: c.items.length };
  });
  const totalDone = stats.reduce((n, s) => n + s.done, 0);
  const total = stats.reduce((n, s) => n + s.total, 0);
  const pct = total ? (totalDone / total) * 100 : 0;
  const incomplete = stats.filter((s) => s.done < s.total);

  const search = useMemo(() => {
    const f = fold(q);
    if (f.length < 2) return [];
    return categories.flatMap((c) => c.items.filter((it) => fold(`${it.label} ${it.note ?? ""}`).includes(f)).map((it) => ({ c, it }))).slice(0, 60);
  }, [q, categories]);

  return (
    <div className="space-y-10">
      {/* Profils */}
      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="panel-raised frame-corners p-6">
          <p className="eyebrow">Progression globale — {hydrated ? p.name : "…"}</p>
          <p className="mt-2 font-display text-6xl font-semibold text-parch">{hydrated ? (Math.floor(pct * 10) / 10).toLocaleString("fr-FR") : "…"} %</p>
          <p className="text-sm text-dim">{totalDone.toLocaleString("fr-FR")} / {total.toLocaleString("fr-FR")} éléments suivis · cycle {p.ngCycle === 0 ? "NG" : `NG+${p.ngCycle > 1 ? p.ngCycle : ""}`}</p>
          <div className="mt-4 h-2 bg-stone/50"><div className="h-full bg-gradient-to-r from-ember to-gold-hi transition-all" style={{ width: `${pct}%` }} /></div>
          <p className="mt-4 text-xs text-ash">
            {incomplete.length === 0 && hydrated
              ? "Toutes les catégories suivies sont complètes."
              : `Le 100 % n'est affiché que lorsque toutes les catégories sont complètes (${incomplete.length} catégorie${incomplete.length > 1 ? "s" : ""} incomplète${incomplete.length > 1 ? "s" : ""}). Les succès, quêtes et fins se renseignent manuellement : l'archive ne lit pas votre sauvegarde de jeu.`}
          </p>
        </div>
        <div className="panel p-5">
          <p className="eyebrow mb-3">Profils de partie</p>
          <ul className="space-y-2">
            {Object.values(store.profiles).map((pr) => (
              <li key={pr.id} className={`flex items-center gap-2 border px-3 py-2 ${pr.id === p.id ? "border-gold/60 bg-gold/5" : "border-line/15"}`}>
                <button type="button" className="flex-1 text-left" onClick={() => switchProfile(pr.id)} aria-pressed={pr.id === p.id}>
                  <span className="text-parch">{pr.name}</span>
                  <span className="block text-xs text-ash">{Object.keys(pr.checked).length} cases · {pr.ngCycle === 0 ? "NG" : `NG+${pr.ngCycle > 1 ? pr.ngCycle : ""}`}</span>
                </button>
                {pr.id === p.id && (
                  <button type="button" className="text-xs text-gold hover:text-gold-hi" onClick={() => { const n = window.prompt("Nouveau nom du profil", pr.name); if (n) renameProfile(pr.id, n); }}>Renommer</button>
                )}
                {Object.keys(store.profiles).length > 1 && (
                  <button type="button" className="text-ash hover:text-ember-hi" aria-label={`Supprimer le profil ${pr.name}`} onClick={() => window.confirm(`Supprimer définitivement le profil « ${pr.name} » ?`) && deleteProfile(pr.id)}><Trash2 size={14} /></button>
                )}
              </li>
            ))}
          </ul>
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); createProfile(newName); setNewName(""); }}>
            <input className="input-archive !min-h-[38px] !py-1" placeholder="Nom de la nouvelle partie" value={newName} onChange={(e) => setNewName(e.target.value)} aria-label="Nom du nouveau profil" />
            <button type="submit" className="btn btn-sm"><Plus size={14} /> Créer</button>
          </form>
          <label className="mt-4 flex items-center gap-3 text-sm">
            <span className="text-dim">Cycle de jeu :</span>
            <select className="input-archive !min-h-[36px] !w-auto !py-1" value={p.ngCycle} onChange={(e) => setNgCycle(Number(e.target.value))}>
              {Array.from({ length: 8 }, (_, i) => <option key={i} value={i}>{i === 0 ? "NG (première partie)" : `NG+${i > 1 ? i : ""}`}</option>)}
            </select>
          </label>
          <p className="mt-1 text-xs text-ash">Le mode NG+ signale les anneaux +1/+2 disponibles dans les étapes du guide. Créez un profil par partie pour suivre plusieurs cycles.</p>
        </div>
      </section>

      <DataTools />

      {/* Recherche des éléments manquants */}
      <section>
        <h2 className="h-section">Rechercher un élément</h2>
        <input className="input-archive mt-4" placeholder="Nom d'un objet, d'un anneau, d'un boss, d'un geste…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Rechercher dans les éléments suivis" />
        {q.length >= 2 && (
          <ul className="mt-3 space-y-1">
            {search.length === 0 && <li className="text-sm text-dim">Aucun élément suivi ne correspond.</li>}
            {search.map(({ c, it }) => (
              <li key={c.id + it.id} className="panel flex items-center gap-3 px-3 py-2 text-sm">
                {c.mode === "quest" ? <QuestStatusSelect npc={it.id.replace(/^quete:/, "")} compact /> : <input type="checkbox" className="seal-check" checked={hydrated && !!p.checked[it.id]} onChange={(e) => setChecked(it.id, e.target.checked)} aria-label={it.label} />}
                <span className="flex-1">{it.href ? <Link className="link-archive" href={it.href}>{it.label}</Link> : it.label}</span>
                <span className="text-xs text-ash">{c.label}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Catégories */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="h-section">Par catégorie</h2>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="chip" aria-pressed={onlyMissing} onClick={() => setOnlyMissing(!onlyMissing)}>Manquants uniquement</button>
            <button type="button" className="chip" aria-pressed={scope === "tout"} onClick={() => setScope("tout")}>Tout</button>
            <button type="button" className="chip" aria-pressed={scope === "succes"} onClick={() => setScope("succes")}>Requis pour un succès</button>
            <button type="button" className="chip" aria-pressed={scope === "collection"} onClick={() => setScope("collection")}>Collection uniquement</button>
          </div>
        </div>
        <ul className="mt-6 space-y-3">
          {stats.map(({ c, done, total }) => {
            const isOpen = open === c.id;
            const items = c.items.filter((it) => (!onlyMissing || !isDone(c, it)) && (scope === "tout" || (scope === "succes" ? !!it.achievement : !it.achievement)));
            return (
              <li key={c.id} id={c.id} className="panel scroll-mt-24">
                <button type="button" className="flex w-full flex-wrap items-center gap-4 p-4 text-left" onClick={() => setOpen(isOpen ? null : c.id)} aria-expanded={isOpen} aria-controls={`cat-${c.id}`}>
                  <span className="min-w-[180px] flex-1">
                    <span className="font-display text-xl text-parch">{c.label}</span>
                    <span className="block text-xs text-dim">{c.description}</span>
                  </span>
                  <span className="w-40">
                    <span className="flex justify-between font-mono text-xs"><span>{hydrated ? done : "…"} / {total}</span><span>{total ? Math.round((done / total) * 100) : 0} %</span></span>
                    <span className="mt-1 block h-1.5 bg-stone/50"><span className="block h-full bg-gradient-to-r from-ember to-gold-hi" style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></span>
                  </span>
                  <span className="text-gold" aria-hidden>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div id={`cat-${c.id}`} className="border-t border-line/15 p-4">
                    {c.mode !== "quest" && items.length > 0 && (
                      <div className="mb-3 flex gap-3 text-xs">
                        <button type="button" className="link-archive" onClick={() => setManyChecked(items.map((i) => i.id), true)}>Cocher les {items.length} affichés</button>
                      </div>
                    )}
                    {items.length === 0 ? (
                      <p className="text-sm text-dim">{onlyMissing ? "Rien ne manque dans cette sélection." : "Aucun élément."}</p>
                    ) : (
                      <ul className="grid gap-x-6 sm:grid-cols-2">
                        {items.map((it) => (
                          <li key={it.id} className="flex items-start gap-3 border-b border-line/10 py-2 text-sm">
                            {c.mode === "quest" ? (
                              <QuestStatusSelect npc={it.id.replace(/^quete:/, "")} compact />
                            ) : (
                              <input type="checkbox" className="seal-check mt-0.5" checked={hydrated && !!p.checked[it.id]} onChange={(e) => setChecked(it.id, e.target.checked)} aria-label={it.label} />
                            )}
                            <span className="min-w-0 flex-1">
                              {it.href ? <Link className="link-archive" href={it.href}>{it.label}</Link> : <span>{it.label}</span>}
                              <span className="block text-xs text-ash">
                                {[it.note, it.dlc, it.achievement ? `Succès : ${it.achievement}` : null].filter(Boolean).join(" · ")}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

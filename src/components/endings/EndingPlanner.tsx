"use client";

import Link from "next/link";
import { AlertTriangle, Lock, Target } from "lucide-react";
import type { Ending } from "@/data/types";
import { activeProfile, setEndingTarget, setChecked, useHydrated, useStore } from "@/lib/store";

/** Sélection d'une fin cible et checklist adaptée au parcours. */
export function EndingPlanner({ endings }: { endings: Ending[] }) {
  const store = useStore();
  const hydrated = useHydrated();
  const p = activeProfile(store);
  const target = hydrated ? endings.find((e) => e.slug === p.endingTarget) : undefined;
  const ids = target ? target.steps.map((s) => `fin-etape:${target.slug}:${s.id}`) : [];
  const done = ids.filter((id) => p.checked[id]).length;

  return (
    <div className="panel-raised frame-corners p-5 sm:p-8">
      <div className="flex items-center gap-2">
        <Target size={18} className="text-gold" aria-hidden />
        <p className="eyebrow">Parcours guidé</p>
      </div>
      <h3 className="mt-2 font-display text-3xl text-parch">Choisissez votre fin cible</h3>
      <div className="mt-5 flex flex-wrap gap-2" role="radiogroup" aria-label="Fin cible">
        {endings.map((e) => (
          <button key={e.slug} type="button" role="radio" aria-checked={target?.slug === e.slug} className="chip" data-active={target?.slug === e.slug} onClick={() => setEndingTarget(target?.slug === e.slug ? null : e.slug)}>
            {e.name}
          </button>
        ))}
      </div>
      {!target && <p className="mt-6 text-sm text-dim">Sélectionnez une fin pour obtenir la checklist correspondante. Votre choix est enregistré dans votre profil.</p>}
      {target && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="flex items-baseline justify-between">
              <p className="font-display text-xl text-parch">{target.name}</p>
              <span className="font-mono text-sm">{done}/{ids.length}</span>
            </div>
            <div className="mt-2 h-1.5 bg-stone/50"><div className="h-full bg-gradient-to-r from-ember to-gold-hi" style={{ width: `${(done / Math.max(ids.length, 1)) * 100}%` }} /></div>
            <ol className="mt-5 space-y-2">
              {target.steps.map((s, i) => {
                const id = `fin-etape:${target.slug}:${s.id}`;
                const checked = !!p.checked[id];
                return (
                  <li key={s.id}>
                    {s.warning && !checked && (
                      <p className="mb-1 flex gap-2 text-xs text-ember-hi"><AlertTriangle size={13} className="mt-0.5" aria-hidden /> {s.warning}</p>
                    )}
                    <label className={`flex cursor-pointer gap-3 border-l-2 px-3 py-2.5 ${s.irreversible ? "border-ember-hi/70 bg-ember/5" : "border-line/20"}`}>
                      <input type="checkbox" className="seal-check mt-1" checked={checked} onChange={(e) => setChecked(id, e.target.checked)} />
                      <span className={checked ? "text-dim line-through" : ""}>
                        <span className="font-mono text-xs text-gold">{i + 1}.</span> <span className="font-medium text-parch">{s.title}</span>
                        {s.irreversible && <span className="ml-2 inline-flex items-center gap-1 text-xs text-ember-hi"><Lock size={11} /> irréversible</span>}
                        {s.detail && <span className="block text-sm text-dim">{s.detail}</span>}
                        {s.link && <Link href={s.link} className="text-xs text-gold hover:text-gold-hi">Ouvrir la fiche →</Link>}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="space-y-4">
            <div className="panel p-4">
              <p className="eyebrow mb-2">Erreurs bloquantes</p>
              <ul className="space-y-2 text-sm">{target.blockers.map((b) => <li key={b} className="flex gap-2"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-ember-hi" aria-hidden /> {b}</li>)}</ul>
            </div>
            <div className="panel p-4">
              <p className="eyebrow mb-2">Point de non-retour</p>
              <p className="text-sm">{target.pointOfNoReturn}</p>
            </div>
            {target.incompatibleWith.length > 0 && (
              <div className="panel p-4">
                <p className="eyebrow mb-2">Incompatible dans la même partie</p>
                <ul className="text-sm">{target.incompatibleWith.map((s) => <li key={s}><Link className="link-archive" href={`/fins/${s}`}>{endings.find((e) => e.slug === s)?.name}</Link></li>)}</ul>
                <p className="mt-2 text-xs text-ash">Une seule fin par partie ; la sauvegarde de jeu peut être copiée avant le choix final pour voir les autres.</p>
              </div>
            )}
            <Link href={`/fins/${target.slug}`} className="btn btn-sm w-full">Fiche complète</Link>
          </div>
        </div>
      )}
    </div>
  );
}

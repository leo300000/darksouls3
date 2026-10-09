"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Skull, Sparkles, UserRound } from "lucide-react";
import { activeProfile, useHydrated, useStore, setChecked } from "@/lib/store";

export interface StepRow {
  id: string;
  tags: string[];
  ng: string | null;
  content: React.ReactNode;
}

type Filter = "tout" | "restant" | "manquables" | "boss" | "pnj";

/** Liste interactive des étapes d'une zone : cases persistées, filtres, avertissements. */
export function StepList({ steps, ngCycle = 0 }: { steps: StepRow[]; ngCycle?: number }) {
  const store = useStore();
  const hydrated = useHydrated();
  const profile = activeProfile(store);
  const [filter, setFilter] = useState<Filter>("tout");
  const [showNg, setShowNg] = useState(true);
  const cycle = hydrated ? profile.ngCycle : ngCycle;

  const visible = useMemo(
    () =>
      steps.filter((s) => {
        if (!showNg && s.ng) return false;
        if (filter === "restant") return !profile.checked[`step:${s.id}`];
        if (filter === "manquables") return s.tags.includes("miss");
        if (filter === "boss") return s.tags.includes("boss");
        if (filter === "pnj") return s.tags.includes("npc");
        return true;
      }),
    [steps, filter, showNg, profile.checked],
  );

  const FILTERS: { id: Filter; label: string }[] = [
    { id: "tout", label: "Toutes" },
    { id: "restant", label: "Restantes" },
    { id: "manquables", label: "Manquables" },
    { id: "boss", label: "Boss" },
    { id: "pnj", label: "PNJ" },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2" role="toolbar" aria-label="Filtrer les étapes">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm text-dim">
          <input type="checkbox" checked={showNg} onChange={(e) => setShowNg(e.target.checked)} className="accent-[rgb(var(--c-gold))]" />
          Afficher les objets NG+ / NG++
        </label>
      </div>
      {visible.length === 0 && <p className="panel p-5 text-sm text-dim">Aucune étape ne correspond à ce filtre.</p>}
      <ol className="space-y-1">
        {visible.map((s) => {
          const id = `step:${s.id}`;
          const checked = hydrated && !!profile.checked[id];
          const missable = s.tags.includes("miss");
          const ngLocked = s.ng === "ng+" ? cycle < 1 : s.ng === "ng++" ? cycle < 2 : false;
          return (
            <li key={s.id} id={s.id} className="scroll-mt-24">
              {missable && !checked && (
                <p className="mb-1 mt-3 flex items-center gap-2 text-xs text-ember-hi">
                  <AlertTriangle size={13} aria-hidden /> Attention : étape manquable ou affectant une quête.
                </p>
              )}
              <label
                className={`group flex cursor-pointer items-start gap-3 border-l-2 px-3 py-3 transition ${
                  missable ? "border-ember-hi/60 bg-ember/5" : s.tags.includes("boss") ? "border-gold/60 bg-gold/5" : "border-line/15 hover:bg-stone/15"
                }`}
              >
                <input type="checkbox" className="seal-check mt-1" checked={checked} onChange={(e) => setChecked(id, e.target.checked)} aria-label={`Étape ${s.id}`} />
                <span className={`flex-1 leading-relaxed ${checked ? "text-dim line-through decoration-ember/50" : ""}`}>
                  <span className="mr-2 inline-flex gap-1 align-middle">
                    {s.tags.includes("boss") && <Skull size={14} className="text-gold" aria-label="Boss" />}
                    {s.tags.includes("npc") && <UserRound size={14} className="text-frost" aria-label="PNJ" />}
                    {s.ng && (
                      <span className={`inline-flex items-center gap-1 border px-1 font-mono text-[0.6rem] uppercase ${ngLocked ? "border-ash/40 text-ash" : "border-gold/50 text-gold"}`} title={ngLocked ? "Disponible dans un cycle ultérieur" : undefined}>
                        <Sparkles size={10} /> {s.ng}
                      </span>
                    )}
                  </span>
                  {s.content}
                </span>
              </label>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

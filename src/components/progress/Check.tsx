"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect } from "react";
import { activeProfile, recordVisit, setManyChecked, toggleFavorite, useChecked, useHydrated, useStore } from "@/lib/store";

/** Case à cocher persistée (contenu riche rendu côté serveur passé en enfant). */
export function CheckItem({ id, children, className = "", compact = false }: { id: string; children: React.ReactNode; className?: string; compact?: boolean }) {
  const [checked, set] = useChecked(id);
  return (
    <label className={`group flex cursor-pointer items-start gap-3 ${compact ? "py-1.5" : "py-2.5"} ${className}`}>
      <input type="checkbox" className="seal-check mt-1" checked={checked} onChange={(e) => set(e.target.checked)} aria-describedby={`${id}-label`} />
      <span id={`${id}-label`} className={`flex-1 transition ${checked ? "text-dim line-through decoration-ember/60" : ""}`}>
        {children}
      </span>
    </label>
  );
}

export function CheckToggle({ id, label = "Vaincu", doneLabel }: { id: string; label?: string; doneLabel?: string }) {
  const [checked, set] = useChecked(id);
  return (
    <button type="button" aria-pressed={checked} onClick={() => set(!checked)} className={`btn btn-sm ${checked ? "btn-ember" : ""}`}>
      <span aria-hidden className={`inline-block h-2.5 w-2.5 rotate-45 border ${checked ? "border-parch bg-parch" : "border-gold"}`} />
      {checked ? (doneLabel ?? label) : label}
    </button>
  );
}

/** Barre de progression d'un ensemble d'identifiants, avec actions groupées. */
export function ChecklistProgress({ ids, label, actions = true }: { ids: string[]; label: string; actions?: boolean }) {
  const store = useStore();
  const hydrated = useHydrated();
  const p = activeProfile(store);
  const done = hydrated ? ids.filter((id) => p.checked[id]).length : 0;
  const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;
  return (
    <div className="panel p-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="eyebrow">{label}</span>
        <span className="font-mono text-sm text-parch">
          {hydrated ? done : "…"} / {ids.length}
        </span>
      </div>
      <div className="mt-3 h-1.5 bg-stone/50" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="h-full bg-gradient-to-r from-ember to-gold-hi transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      {actions && ids.length > 0 && (
        <div className="mt-3 flex gap-3 text-xs">
          <button type="button" className="link-archive" onClick={() => setManyChecked(ids, true)}>
            Tout cocher
          </button>
          <button
            type="button"
            className="link-archive"
            onClick={() => {
              if (window.confirm(`Décocher les ${ids.length} éléments de « ${label} » ?`)) setManyChecked(ids, false);
            }}
          >
            Tout décocher
          </button>
        </div>
      )}
    </div>
  );
}

export function FavoriteButton({ href, title, kind }: { href: string; title: string; kind: string }) {
  const store = useStore();
  const fav = store.favorites.some((f) => f.href === href);
  return (
    <button type="button" aria-pressed={fav} onClick={() => toggleFavorite({ href, title, kind })} className={`btn btn-sm ${fav ? "border-gold-hi text-gold-hi" : ""}`}>
      {fav ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
      {fav ? "Dans vos favoris" : "Ajouter aux favoris"}
    </button>
  );
}

/** Enregistre la consultation d'une fiche dans l'historique local. */
export function VisitRecorder({ href, title, kind }: { href: string; title: string; kind: string }) {
  useEffect(() => {
    recordVisit({ href, title, kind });
  }, [href, title, kind]);
  return null;
}

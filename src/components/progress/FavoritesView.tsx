"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toggleFavorite, update, useHydrated, useStore } from "@/lib/store";

export function FavoritesView() {
  const store = useStore();
  const hydrated = useHydrated();
  if (!hydrated) return <p className="text-dim">Chargement…</p>;
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section>
        <h2 className="h-section">Favoris</h2>
        {store.favorites.length === 0 ? (
          <p className="mt-4 text-dim">Aucun favori. Utilisez le bouton « Ajouter aux favoris » sur une fiche.</p>
        ) : (
          <ul className="mt-5 space-y-2">
            {store.favorites.map((f) => (
              <li key={f.href} className="panel flex items-center gap-3 p-3">
                <span className="eyebrow w-24 shrink-0 text-[0.58rem]">{f.kind}</span>
                <Link href={f.href} className="flex-1 text-parch hover:text-gold-hi">{f.title}</Link>
                <button type="button" onClick={() => toggleFavorite(f)} className="text-ash hover:text-ember-hi" aria-label={`Retirer ${f.title} des favoris`}><Trash2 size={15} /></button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <div className="flex items-end justify-between">
          <h2 className="h-section">Historique</h2>
          {store.history.length > 0 && (
            <button type="button" className="text-sm text-gold hover:text-gold-hi" onClick={() => update((s) => ({ ...s, history: [] }))}>Effacer l&apos;historique</button>
          )}
        </div>
        {store.history.length === 0 ? (
          <p className="mt-4 text-dim">Aucune page consultée pour l&apos;instant.</p>
        ) : (
          <ul className="mt-5 space-y-2">
            {store.history.map((h) => (
              <li key={h.href} className="panel flex items-center gap-3 p-3">
                <span className="eyebrow w-24 shrink-0 text-[0.58rem]">{h.kind}</span>
                <Link href={h.href} className="flex-1 text-parch hover:text-gold-hi">{h.title}</Link>
                <time className="text-xs text-ash" dateTime={h.at}>{new Date(h.at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

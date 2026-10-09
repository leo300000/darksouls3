"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { groupHits, loadIndex, search, type SearchDoc } from "@/lib/search";
import { recordSearch } from "@/lib/store";

export function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [index, setIndex] = useState<SearchDoc[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    loadIndex().then(setIndex).catch(() => setError(true));
  }, []);
  const groups = useMemo(() => (index ? groupHits(search(index, q, 300)) : []), [index, q]);
  const total = groups.reduce((n, g) => n + g.hits.length, 0);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          recordSearch(q);
          router.replace(`/recherche?q=${encodeURIComponent(q)}`);
        }}
      >
        <input className="input-archive text-lg" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher dans toute l'archive…" aria-label="Recherche" autoFocus />
      </form>
      {error && <p className="mt-4 text-ember-hi">Impossible de charger l&apos;index de recherche. Réessayez plus tard.</p>}
      {!index && !error && <p className="mt-4 text-dim">Chargement de l&apos;index…</p>}
      {index && q.trim() && (
        <p className="mt-4 text-sm text-dim">{total === 0 ? `Aucun résultat pour « ${q} ». Les objets sont indexés sous leur nom anglais officiel ; essayez aussi un terme plus court.` : `${total} résultat${total > 1 ? "s" : ""} pour « ${q} »`}</p>
      )}
      <div className="mt-8 space-y-10">
        {groups.map((g) => (
          <section key={g.category}>
            <h2 className="eyebrow mb-3">{g.category} · {g.hits.length}</h2>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {g.hits.map((h) => (
                <li key={h.h + h.t} className="min-w-0">
                  <Link href={h.h} className="panel card-link block p-3" onClick={() => recordSearch(q)}>
                    <span className="block text-parch">{h.t}</span>
                    {h.s && <span className="block truncate text-xs text-dim">{h.s}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

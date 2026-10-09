"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { fold } from "@/lib/text";

export function ComparePicker({ options, selected, max = 4 }: { options: { slug: string; name: string; category: string }[]; selected: string[]; max?: number }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const f = fold(q);
    if (!f) return [];
    return options.filter((o) => !selected.includes(o.slug) && fold(o.name).includes(f)).slice(0, 8);
  }, [q, options, selected]);
  const go = (ids: string[]) => router.push(`/armes/comparateur${ids.length ? `?ids=${ids.join(",")}` : ""}`);
  return (
    <div className="panel p-4">
      <div className="flex flex-wrap gap-2">
        {selected.map((s) => (
          <button key={s} type="button" className="chip" onClick={() => go(selected.filter((x) => x !== s))} aria-label={`Retirer ${options.find((o) => o.slug === s)?.name}`}>
            {options.find((o) => o.slug === s)?.name ?? s} ✕
          </button>
        ))}
      </div>
      {selected.length < max ? (
        <div className="relative mt-3">
          <input className="input-archive" placeholder={`Ajouter une arme (${selected.length}/${max})…`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Ajouter une arme à la comparaison" />
          {results.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full border border-line/30 bg-night shadow-xl">
              {results.map((r) => (
                <li key={r.slug}>
                  <button type="button" className="w-full px-3 py-2 text-left hover:bg-stone/40" onClick={() => { setQ(""); go([...selected, r.slug]); }}>
                    {r.name} <span className="text-xs text-ash">{r.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-dim">Maximum de {max} armes atteint.</p>
      )}
    </div>
  );
}

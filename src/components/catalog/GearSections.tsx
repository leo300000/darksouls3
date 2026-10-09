import Link from "next/link";
import { AlertTriangle, Repeat } from "lucide-react";
import type { CatalogStep } from "@/data/catalog-types";
import { Rich } from "@/components/rich/Rich";
import { catalog, checklistEntriesFor, entity } from "@/lib/data";
import { zoneBySlug } from "@/data/zones";

/** Localisations sourcées d'un élément (étapes du parcours et listes de complétion). */
export function Locations({ entityKey, steps }: { entityKey: string; steps: CatalogStep[] }) {
  const lists = checklistEntriesFor(entityKey);
  const trades = catalog.crowTrades.filter((t) => t.get.includes(entityKey) || t.give.includes(entityKey));
  if (!steps.length && !lists.length && !trades.length)
    return (
      <p className="border-l-2 border-ash/50 px-4 py-2 text-sm text-ash">
        Aucune localisation dans le parcours sourcé : l&apos;élément est probablement vendu, obtenu sur un ennemi ou par transposition. Localisation exacte à compléter.
      </p>
    );
  return (
    <div className="space-y-4">
      {lists.map((l) => (
        <p key={l.id} className="panel p-4 text-[0.97rem] leading-relaxed">
          <Rich segs={l.fr} />
        </p>
      ))}
      {steps.length > 0 && (
        <ul className="space-y-3">
          {steps.map((s) => (
            <li key={s.id} className={`border-l-2 pl-4 text-[0.97rem] leading-relaxed ${s.tags.includes("miss") ? "border-ember-hi/70" : "border-gold/40"}`}>
              <Link href={`/guide/${s.zone}#${s.id}`} className="eyebrow block text-[0.6rem] hover:text-gold-hi">
                {zoneBySlug.get(s.zone)?.name}
                {s.ng ? ` · ${s.ng.toUpperCase()}` : ""}
              </Link>
              {s.tags.includes("miss") && (
                <span className="mr-1 inline-flex items-center gap-1 text-xs text-ember-hi"><AlertTriangle size={12} /> manquable</span>
              )}
              <Rich segs={s.fr} />
            </li>
          ))}
        </ul>
      )}
      {trades.map((t) => (
        <p key={t.id} className="flex items-start gap-2 text-sm">
          <Repeat size={14} className="mt-1 text-gold" aria-hidden />
          <span>
            Échange avec le corbeau du sanctuaire :{" "}
            {t.give.map((k) => entity(k)).filter(Boolean).map((e, i) => <span key={e!.key}>{i > 0 && " ou "}{e!.href ? <Link className="link-archive" href={e!.href}>{e!.name}</Link> : e!.name}</span>)} →{" "}
            {t.get.map((k) => entity(k)).filter(Boolean).map((e) => <span key={e!.key}>{e!.href ? <Link className="link-archive" href={e!.href}>{e!.name}</Link> : e!.name}</span>)}
          </span>
        </p>
      ))}
    </div>
  );
}

export function StatRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-3 border-b border-line/10 py-2.5 text-sm">
      <dt className="text-dim">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

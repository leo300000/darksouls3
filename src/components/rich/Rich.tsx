import Link from "next/link";
import type { Seg } from "@/data/catalog-types";
import { catalog } from "@/lib/data";

/**
 * Rend un texte segmenté en liens internes vers les fiches.
 * Les entités sans fiche (ennemis génériques) sont mises en valeur sans lien.
 */
export function Rich({ segs, className }: { segs: Seg[]; className?: string }) {
  return (
    <span className={className}>
      {segs.map((s, i) => {
        if (s.t !== undefined) return <span key={i}>{s.t}</span>;
        const e = s.k ? catalog.entities[s.k] : null;
        // Les boss, PNJ et zones affichent leur nom français ; les objets gardent leur nom officiel.
        const label = e && (e.kind === "boss" || e.kind === "pnj" || e.kind === "zone") ? e.name : s.l;
        if (e?.href) {
          return (
            <Link key={i} href={e.href} className="link-archive" title={e.kind === "boss" || e.kind === "pnj" || e.kind === "zone" ? `${e.name} (${e.nameEn})` : e.category}>
              {label}
            </Link>
          );
        }
        return (
          <span key={i} className="text-parch" title={e?.category}>
            {label}
          </span>
        );
      })}
    </span>
  );
}

export function plain(segs: Seg[]): string {
  return segs.map((s) => s.t ?? s.l ?? "").join("");
}

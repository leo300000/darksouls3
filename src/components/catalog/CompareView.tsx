"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Missing } from "@/components/ui/Badges";
import { ComparePicker } from "./ComparePicker";
import type { Dlc, WeaponStats } from "@/data/types";

export interface CompareWeapon {
  slug: string;
  name: string;
  href: string | null;
  category: string;
  dlc: Dlc;
  acquisitions: string[];
  zones: string[];
  transposition: string | null;
  infusable: boolean | null;
  categoryNote: string | null;
  stats: WeaponStats | null;
}

const DLC_NAME: Record<Dlc, string> = { base: "Jeu de base", "ashes-of-ariandel": "Ashes of Ariandel", "ringed-city": "The Ringed City" };

/** Lit la sélection dans l'URL (?ids=a,b) côté client : la page reste exportable en statique. */
export function CompareView({ weapons }: { weapons: CompareWeapon[] }) {
  const params = useSearchParams();
  const bySlug = new Map(weapons.map((w) => [w.slug, w]));
  const items = (params.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((s) => bySlug.get(s))
    .filter((w): w is CompareWeapon => !!w);
  const options = weapons.map((w) => ({ slug: w.slug, name: w.name, category: w.category }));

  const rows: { label: string; render: (w: CompareWeapon) => React.ReactNode }[] = [
    { label: "Catégorie", render: (w) => w.category },
    { label: "Contenu", render: (w) => DLC_NAME[w.dlc] },
    { label: "Obtention", render: (w) => w.acquisitions.join(", ") },
    { label: "Lieux", render: (w) => w.zones.join(", ") || "—" },
    { label: "Arme de boss", render: (w) => (w.transposition ? `Oui — ${w.transposition}` : "Non") },
    { label: "Dégâts de base (+0)", render: (w) => (w.stats ? Object.entries(w.stats.damage).map(([k, v]) => `${k} ${v}`).join(" · ") : <Missing compact />) },
    { label: "Exigences", render: (w) => (w.stats ? Object.entries(w.stats.requirements).map(([k, v]) => `${k} ${v}`).join(" · ") : <Missing compact />) },
    { label: "Poids", render: (w) => w.stats?.weight ?? <Missing compact /> },
    { label: "Scaling", render: (w) => (w.stats ? Object.entries(w.stats.scaling).map(([k, v]) => `${k} ${v}`).join(" · ") : <Missing compact />) },
    { label: "Compétence", render: (w) => w.stats?.skill ?? <Missing compact /> },
    { label: "Amélioration", render: (w) => (w.transposition ? "Twinkling Titanite" : <Missing compact />) },
    { label: "Infusions", render: (w) => (w.infusable === false ? "Non infusable" : <Missing compact />) },
    { label: "Atouts et limites (catégorie)", render: (w) => <span className="text-xs text-dim">{w.categoryNote ?? "—"}</span> },
  ];

  return (
    <>
      <ComparePicker options={options} selected={items.map((w) => w.slug)} />
      {items.length < 2 ? (
        <p className="panel p-6 text-dim">
          Ajoutez au moins deux armes ci-dessus, ou cochez-les depuis le <Link className="link-archive" href="/armes">catalogue</Link>.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-archive min-w-[640px]">
            <thead>
              <tr>
                <th className="w-44">Critère</th>
                {items.map((w) => (
                  <th key={w.slug}>
                    {w.href ? <Link href={w.href} className="font-display text-base normal-case tracking-normal text-parch hover:text-gold-hi">{w.name}</Link> : w.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="text-dim">{r.label}</td>
                  {items.map((w) => <td key={w.slug}>{r.render(w)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DlcBadge } from "@/components/ui/Badges";
import { ItemLink } from "@/components/rich/ItemLink";
import { CheckItem } from "@/components/progress/Check";
import { covenants } from "@/lib/data";
import { zoneBySlug } from "@/data/zones";

export const metadata: Metadata = { title: "Serments", description: "Les serments de Dark Souls III : localisation, chef, objet d'offrande et récompenses documentées." };

export default function CovenantsPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Serments" }]} overline="Factions" title="Serments" lede="Neuf serments, dont un ajouté par The Ringed City. Rejoindre chaque serment du jeu de base une première fois débloque un succès." compact />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <ul className="grid gap-4 md:grid-cols-2">
          {covenants.map((c) => (
            <li key={c.slug} id={c.slug} className="panel scroll-mt-24 p-5">
              <DlcBadge dlc={c.dlc} hideBase />
              <h2 className="mt-1 font-display text-2xl text-parch">{c.name}</h2>
              <p className="text-xs text-ash">{c.nameEn}</p>
              <p className="mt-3 text-dim">{c.summary}</p>
              <dl className="mt-4 space-y-1.5 text-sm">
                <div><dt className="inline text-ash">Où : </dt><dd className="inline">{c.location} — <Link className="link-archive" href={`/guide/${c.zone}`}>{zoneBySlug.get(c.zone)?.name}</Link></dd></div>
                <div><dt className="inline text-ash">Chef : </dt><dd className="inline">{c.leader}</dd></div>
                <div><dt className="inline text-ash">Offrande : </dt><dd className="inline">{c.item ? <ItemLink name={c.item} /> : "—"}</dd></div>
                <div><dt className="inline text-ash">Récompenses documentées : </dt><dd className="inline">{c.rewards.length ? c.rewards.join(" · ") : <span className="italic text-ash">à compléter</span>}</dd></div>
              </dl>
              <div className="mt-3 border-t border-line/15 pt-2"><CheckItem id={`serment:${c.slug}`} compact>Serment rejoint</CheckItem></div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

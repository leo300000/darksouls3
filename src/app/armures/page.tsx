import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTitle } from "@/components/ui/Ornament";
import { DlcBadge } from "@/components/ui/Badges";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { entitiesOf, gearInfo, entity } from "@/lib/data";
import { zoneBySlug } from "@/data/zones";

export const metadata: Metadata = {
  title: "Armures et ensembles",
  description: "Casques, torses, gants et jambières de Dark Souls III et de ses DLC, ensembles et localisations sourcées.",
};

export default function ArmorPage() {
  const sets = entitiesOf("ensemble").sort((a, b) => a.name.localeCompare(b.name));
  const pieces = entitiesOf("armure");
  const rows = pieces.map((e) => {
    const g = gearInfo(e);
    const set = entity(e.set);
    return {
      key: e.key,
      name: e.name,
      href: e.href,
      dlc: e.dlc,
      subtitle: set ? `Ensemble : ${set.name}` : undefined,
      facets: {
        categorie: [e.category],
        dlc: [e.dlc],
        ensemble: [set ? "Rattachée à un ensemble" : "Ensemble non identifié"],
        zone: g.zones.map((z) => zoneBySlug.get(z)?.name ?? z),
        manquable: [g.missable ? "Manquable" : "Non signalé manquable"],
      },
      cols: { source: g.steps.length ? "Parcours" : set ? "Via l'ensemble" : "À compléter" },
    };
  });
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Armures" }]}
        overline="Arsenal"
        title="Armures"
        lede={<>{pieces.length} pièces d&apos;armure et {sets.length} ensembles localisés par le parcours. Les pièces dont ni l&apos;ensemble ni la localisation ne sont documentés n&apos;ont pas de fiche dédiée.</>}
        art={{ palette: "ash", motif: "castle" }}
        seed="armures"
      />
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-10 sm:px-8">
        <section>
          <SectionTitle overline={`${sets.length} ensembles`} title="Ensembles localisés" />
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {sets.map((s) => (
              <li key={s.key}>
                <Link href={s.href!} className="panel card-link flex items-center justify-between gap-2 p-3">
                  <span className="text-parch">{s.name}</span>
                  <DlcBadge dlc={s.dlc} hideBase />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <SectionTitle overline={`${pieces.length} pièces`} title="Toutes les pièces" />
          <Suspense fallback={<p className="text-dim">Chargement…</p>}>
            <CatalogBrowser
              rows={rows}
              itemLabel="pièces"
              facets={[
                { id: "categorie", label: "Emplacement", order: ["Casques", "Torses", "Gants", "Jambières"] },
                { id: "dlc", label: "Contenu", order: ["base", "ashes-of-ariandel", "ringed-city"] },
                { id: "ensemble", label: "Ensemble" },
                { id: "zone", label: "Lieu" },
                { id: "manquable", label: "Manquable" },
              ]}
              columns={[{ id: "source", label: "Localisation" }]}
            />
          </Suspense>
        </section>
      </div>
    </>
  );
}

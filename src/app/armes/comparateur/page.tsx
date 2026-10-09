import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CompareView, type CompareWeapon } from "@/components/catalog/CompareView";
import { entitiesOf, gearInfo } from "@/lib/data";
import { zoneBySlug } from "@/data/zones";
import { categoryNotes } from "@/data/categories";

export const metadata: Metadata = {
  title: "Comparateur d'armes",
  description: "Comparez deux à quatre armes de Dark Souls III côte à côte : obtention, catégorie, exigences, poids, scaling et compétences lorsque les données sont vérifiées.",
};

export default function ComparePage() {
  const weapons: CompareWeapon[] = [...entitiesOf("arme"), ...entitiesOf("bouclier")]
    .map((e) => {
      const g = gearInfo(e);
      return {
        slug: e.key.split(":")[1],
        name: e.name,
        href: e.href,
        category: e.category,
        dlc: e.dlc,
        acquisitions: g.acquisitions,
        zones: g.zones.map((z) => zoneBySlug.get(z)?.name ?? z),
        transposition: g.transposition?.bossName ?? null,
        infusable: g.infusable ?? null,
        categoryNote: categoryNotes[e.category] ?? null,
        stats: g.stats?.stats ?? null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <PageHeader crumbs={[{ href: "/armes", label: "Armes & boucliers" }, { label: "Comparateur" }]} overline="Arsenal" title="Comparateur" lede="Sélectionnez de deux à quatre armes. Aucun score de puissance universel n'est calculé : les performances dépendent du build et du contexte." compact />
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-8">
        <Suspense fallback={<p className="text-dim">Chargement du comparateur…</p>}>
          <CompareView weapons={weapons} />
        </Suspense>
      </div>
    </>
  );
}

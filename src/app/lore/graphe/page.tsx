import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoreGraph } from "@/components/lore/LoreGraph";
import { loreEdges, loreNodes } from "@/data/lore";

export const metadata: Metadata = {
  title: "Graphe narratif",
  description: "Graphe interactif des relations entre les personnages, factions, objets et événements de Dark Souls III, avec niveau de fiabilité.",
};

export default function LoreGraphPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/lore", label: "Lore" }, { label: "Graphe narratif" }]}
        overline="Archives"
        title="Graphe narratif"
        lede="Sélectionnez un nœud pour voir ses alliés, ennemis, liens familiaux, affiliations, objets et événements. Le style des traits indique la fiabilité : fait établi, déduction ou théorie."
        compact
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <LoreGraph nodes={loreNodes} edges={loreEdges} />
        <p className="mt-4 text-xs text-ash">{loreNodes.length} nœuds · {loreEdges.length} relations. La disposition est calculée automatiquement et n&apos;a pas de signification géographique.</p>
      </div>
    </>
  );
}

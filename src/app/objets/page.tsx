import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { entitiesOf, gearInfo } from "@/lib/data";
import { zoneBySlug } from "@/data/zones";
import { itemUses } from "@/data/item-uses";

export const metadata: Metadata = { title: "Objets et consommables", description: "Clés, matériaux d'amélioration, gemmes, cendres, tomes, consommables et objets de quête de Dark Souls III : où les trouver et à quoi ils servent." };

export default function ItemsPage() {
  const items = entitiesOf("objet");
  const rows = items.map((e) => {
    const g = gearInfo(e);
    return {
      key: e.key,
      name: e.name,
      href: e.href,
      dlc: e.dlc,
      facets: {
        categorie: [e.category],
        zone: g.zones.map((z) => zoneBySlug.get(z)?.name ?? z),
        dlc: [e.dlc],
        usage: [itemUses[e.name] ? "Débloque quelque chose" : "Autre"],
      },
      cols: {
        usage: itemUses[e.name] ? itemUses[e.name].slice(0, 90) + (itemUses[e.name].length > 90 ? "…" : "") : "",
        lieux: g.zones.length ? `${g.zones.length} zone${g.zones.length > 1 ? "s" : ""}` : "—",
      },
    };
  });
  return (
    <>
      <PageHeader crumbs={[{ label: "Objets" }]} overline="Arsenal" title="Objets et consommables" lede={<>{items.length} objets cités dans le parcours : où les trouver, combien d&apos;exemplaires, et ce qu&apos;ils permettent de débloquer.</>} art={{ palette: "moss", motif: "village" }} seed="objets" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <Suspense fallback={<p className="text-dim">Chargement…</p>}>
          <CatalogBrowser
            rows={rows}
            itemLabel="objets"
            collectLabel="Trouvé"
            facets={[
              { id: "categorie", label: "Catégorie" },
              { id: "usage", label: "Usage" },
              { id: "zone", label: "Lieu" },
              { id: "dlc", label: "Contenu", order: ["base", "ashes-of-ariandel", "ringed-city"] },
            ]}
            columns={[{ id: "usage", label: "Permet" }, { id: "lieux", label: "Présence" }]}
          />
        </Suspense>
      </div>
    </>
  );
}

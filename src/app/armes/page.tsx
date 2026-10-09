import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { weaponRows } from "@/lib/gear";
import { weaponStats } from "@/data/weapon-notes";

export const metadata: Metadata = {
  title: "Armes et boucliers",
  description: "Catalogue filtrable des armes et boucliers de Dark Souls III et de ses DLC : catégories, localisations sourcées, armes de boss, comparateur.",
};

export default function WeaponsPage() {
  const rows = weaponRows();
  const statCount = Object.keys(weaponStats).length;
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Armes & boucliers" }]}
        overline="Arsenal"
        title="Armes et boucliers"
        lede={<>{rows.length} armes et boucliers, du jeu de base et des DLC. Les localisations proviennent du parcours sourcé ; les statistiques chiffrées ne sont affichées que lorsqu&apos;elles ont été recoupées.</>}
        art={{ palette: "gold", motif: "castle" }}
        seed="armes"
        actions={<Link href="/armes/comparateur" className="btn btn-sm">Comparateur</Link>}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <p className="mb-6 border-l-2 border-gold/50 bg-gold/5 px-4 py-3 text-sm text-dim">
          Statistiques chiffrées recoupées : <strong className="text-parch">{statCount}</strong> / {rows.length}. Les filtres par poids, exigences, scaling et type de dégâts
          s&apos;activeront automatiquement dès que des valeurs sourcées seront ajoutées (voir <Link href="/a-propos#completer" className="link-archive">Compléter les données</Link>).
          En attendant, aucune valeur n&apos;est inventée.
        </p>
        <Suspense fallback={<p className="text-dim">Chargement du catalogue…</p>}>
          <CatalogBrowser
            rows={rows}
            itemLabel="armes"
            facets={[
              { id: "categorie", label: "Catégorie" },
              { id: "type", label: "Type" },
              { id: "dlc", label: "Contenu", order: ["base", "ashes-of-ariandel", "ringed-city"] },
              { id: "methode", label: "Obtention" },
              { id: "zone", label: "Lieu" },
              { id: "boss", label: "Arme de boss" },
              { id: "disponibilite", label: "Disponibilité" },
              { id: "infusion", label: "Infusions" },
              { id: "manquable", label: "Manquable" },
            ]}
            columns={[
              { id: "obtention", label: "Obtention" },
              { id: "lieu", label: "Lieu" },
            ]}
            compare={{ max: 4, path: "/armes/comparateur" }}
          />
        </Suspense>
      </div>
    </>
  );
}

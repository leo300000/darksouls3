import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { allSpells } from "@/lib/spells";
import { formatNumber } from "@/lib/text";

export const metadata: Metadata = { title: "Sorts", description: "Sorcelleries, pyromancies et miracles de Dark Souls III : marchands, prix, tomes requis, transpositions et succès." };

export default function SpellsPage() {
  const spells = allSpells();
  const rows = spells.map((s) => ({
    key: s.entity.key,
    name: s.entity.name,
    href: s.entity.href,
    dlc: s.entity.dlc,
    facets: {
      categorie: [s.entity.category],
      methode: [s.method],
      marchand: s.vendors.length ? s.vendors.map((v) => v.name) : ["Aucun"],
      tome: s.tomes.length ? ["Nécessite un tome ou parchemin"] : ["Sans tome"],
      succes: [s.achievement ? `Requis : ${s.achievement}` : "Hors succès"],
      dlc: [s.entity.dlc],
    },
    cols: {
      obtention: s.soul ? `Âme : ${s.soul.name}` : s.vendors.length ? s.vendors.map((v) => v.name).join(" / ") : s.covenant ? s.covenant.name : s.method,
      prix: s.price.length ? s.price.map((p) => `${formatNumber(p)} âmes`).join(" / ") : "—",
    },
  }));
  return (
    <>
      <PageHeader crumbs={[{ label: "Sorts" }]} overline="Arsenal" title="Sorts" lede={<>{spells.length} sorcelleries, pyromancies et miracles. Prix et marchands proviennent des listes de complétion sourcées ; coûts en PC et exigences restent à compléter.</>} art={{ palette: "frost", motif: "archive" }} seed="sorts" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <Suspense fallback={<p className="text-dim">Chargement…</p>}>
          <CatalogBrowser
            rows={rows}
            itemLabel="sorts"
            collectLabel="Appris"
            facets={[
              { id: "categorie", label: "École" },
              { id: "methode", label: "Obtention" },
              { id: "marchand", label: "Marchand" },
              { id: "tome", label: "Tome" },
              { id: "succes", label: "Succès" },
              { id: "dlc", label: "Contenu", order: ["base", "ashes-of-ariandel", "ringed-city"] },
            ]}
            columns={[{ id: "obtention", label: "Obtention" }, { id: "prix", label: "Prix" }]}
          />
        </Suspense>
      </div>
    </>
  );
}

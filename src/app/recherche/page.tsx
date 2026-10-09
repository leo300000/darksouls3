import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchPage } from "@/components/search/SearchPage";

export const metadata: Metadata = { title: "Recherche", description: "Recherche globale dans The Ashen Archive : boss, PNJ, armes, armures, sorts, anneaux, zones, objets, quêtes et lore.", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Recherche" }]} title="Recherche" lede="Insensible aux majuscules et aux accents. Raccourci depuis n'importe quelle page : Ctrl+K (ou /)." compact />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <Suspense fallback={<p className="text-dim">Chargement…</p>}>
          <SearchPage />
        </Suspense>
      </div>
    </>
  );
}

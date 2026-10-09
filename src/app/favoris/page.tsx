import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { FavoritesView } from "@/components/progress/FavoritesView";

export const metadata: Metadata = { title: "Favoris et historique", robots: { index: false } };

export default function FavoritesPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Favoris & historique" }]} overline="Votre carnet" title="Favoris et historique" lede="Conservés uniquement dans ce navigateur." compact />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8"><FavoritesView /></div>
    </>
  );
}

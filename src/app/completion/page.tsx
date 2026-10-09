import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CompletionCenter } from "@/components/progress/CompletionCenter";
import { buildCompletion } from "@/lib/completion";

export const metadata: Metadata = {
  title: "Centre de complétion 100 %",
  description: "Suivez votre progression vers le 100 % dans Dark Souls III : boss, zones, feux, armes, armures, anneaux, sorts, gestes, serments, quêtes, fins, succès et éléments manquables.",
};

export default function CompletionPage() {
  const categories = buildCompletion();
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Complétion" }]}
        overline="Progression"
        title="Centre de complétion"
        lede={<>{categories.length} catégories suivies, distinguant ce qui est requis pour un succès de ce qui relève de la simple collection. Plusieurs profils de partie, mode NG+, import et export.</>}
        art={{ palette: "gold", motif: "shrine" }}
        seed="completion"
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <CompletionCenter categories={categories} />
      </div>
    </>
  );
}

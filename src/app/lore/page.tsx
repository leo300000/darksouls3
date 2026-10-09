import type { Metadata } from "next";
import Link from "next/link";
import { Network, Hourglass } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTitle } from "@/components/ui/Ornament";
import { ConfidenceBadge } from "@/components/ui/Badges";
import { Engraving } from "@/components/art/Engraving";
import { loreArticles } from "@/lib/data";
import { loreCategories } from "@/data/lore";

export const metadata: Metadata = {
  title: "Encyclopédie du lore",
  description: "Comprendre l'univers de Dark Souls III : Seigneurs des cendres, lignée de Gwyn, Abysses, Londor, mondes peints, liens avec la trilogie.",
};

export default function LoreIndex() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Lore" }]}
        overline="Archives"
        title="Encyclopédie du lore"
        lede="Chaque section précise son niveau de certitude : ce que le jeu établit, ce que l'on peut en déduire, et ce qui relève de la théorie."
        art={{ palette: "abyss", motif: "city" }}
        seed="lore"
        actions={
          <>
            <Link href="/lore/graphe" className="btn btn-sm"><Network size={15} /> Graphe narratif</Link>
            <Link href="/lore/chronologie" className="btn btn-sm"><Hourglass size={15} /> Chronologie</Link>
          </>
        }
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <div className="mb-10 flex flex-wrap items-center gap-3 text-sm text-dim">
          Légende : <ConfidenceBadge level="game" /> <ConfidenceBadge level="deduction" /> <ConfidenceBadge level="theory" />
        </div>
        <div className="space-y-14">
          {loreCategories.map((c) => {
            const list = loreArticles.filter((a) => a.category === c.id);
            if (!list.length) return null;
            return (
              <section key={c.id} id={c.id} className="scroll-mt-24">
                <SectionTitle overline={`${list.length} article${list.length > 1 ? "s" : ""}`} title={c.label}>{c.description}</SectionTitle>
                <ul className="grid gap-4 md:grid-cols-2">
                  {list.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/lore/${a.slug}`} className="panel card-link group grid grid-cols-[120px_1fr] overflow-hidden">
                        <Engraving spec={a.art} seed={a.slug} className="h-full min-h-[120px] w-full" caption={false} title={a.title} />
                        <div className="p-4">
                          <h3 className="font-display text-xl text-parch group-hover:text-gold-hi">{a.title}</h3>
                          <p className="mt-1 text-sm text-dim">{a.summary}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          <section className="panel p-6">
            <p className="eyebrow mb-2">Personnages</p>
            <p className="text-dim">
              Les biographies détaillées des personnages se trouvent dans leurs fiches : <Link className="link-archive" href="/pnj">personnages</Link> et <Link className="link-archive" href="/boss">boss</Link> (section Lore).
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

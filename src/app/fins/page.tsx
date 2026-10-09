import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTitle } from "@/components/ui/Ornament";
import { Tag } from "@/components/ui/Badges";
import { Engraving } from "@/components/art/Engraving";
import { EndingPlanner } from "@/components/endings/EndingPlanner";
import { endings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Guide des fins",
  description: "Les fins de Dark Souls III : conditions exactes, prérequis, choix irréversibles, variantes et parcours guidé pour chaque fin.",
};

export default function EndingsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Fins du jeu" }]}
        overline="Le dernier choix"
        title="Les fins de Dark Souls III"
        lede={
          <>
            Le jeu attribue <strong className="text-parch">trois succès de fin</strong>. Une quatrième conclusion, obtenue en attaquant la Gardienne du feu pendant « La Fin du Feu »,
            est présentée ici comme une <em>variante</em> : elle n&apos;a pas de succès propre.
          </>
        }
        art={{ palette: "ember", motif: "kiln" }}
        seed="fins"
      />
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-8">
        <section>
          <div className="grid gap-5 md:grid-cols-2">
            {endings.map((e) => (
              <Link key={e.slug} href={`/fins/${e.slug}`} className={`panel card-link group grid grid-cols-[120px_1fr] overflow-hidden ${e.isVariant ? "opacity-90" : ""}`}>
                <Engraving spec={e.art} seed={e.slug} variant="sigil" className="h-full w-full" caption={false} title={e.name} />
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {e.isVariant ? <Tag tone="frost">Variante de « La Fin du Feu »</Tag> : <Tag tone="gold">Succès : {e.achievement}</Tag>}
                  </div>
                  <h2 className="mt-2 font-display text-2xl text-parch group-hover:text-gold-hi">{e.name}</h2>
                  <p className="text-xs text-ash">{e.nameEn}</p>
                  <p className="mt-2 line-clamp-3 text-sm text-dim">{e.context}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <SectionTitle overline="Votre route" title="Planifier une fin" />
          <EndingPlanner endings={endings} />
        </section>
        <section>
          <SectionTitle overline="Vue d'ensemble" title="Conditions comparées" />
          <div className="overflow-x-auto">
            <table className="table-archive min-w-[720px]">
              <thead><tr><th>Fin</th><th>Conditions clés</th><th>Point de non-retour</th><th>Succès</th></tr></thead>
              <tbody>
                {endings.map((e) => (
                  <tr key={e.slug}>
                    <td><Link className="link-archive" href={`/fins/${e.slug}`}>{e.name}</Link></td>
                    <td className="text-sm text-dim"><ul>{e.conditions.map((c) => <li key={c}>• {c}</li>)}</ul></td>
                    <td className="text-sm">{e.pointOfNoReturn}</td>
                    <td className="text-sm">{e.achievement ?? <span className="text-ash">Aucun (variante)</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

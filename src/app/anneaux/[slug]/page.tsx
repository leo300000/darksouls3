import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfidenceBadge, DlcBadge, Missing, Tag } from "@/components/ui/Badges";
import { Locations, StatRow } from "@/components/catalog/GearSections";
import { CheckToggle, FavoriteButton, VisitRecorder } from "@/components/progress/Check";
import { entitiesOf, entity, checklist, gearInfo } from "@/lib/data";
import { ringEffects } from "@/data/ring-effects";

export function generateStaticParams() {
  return entitiesOf("anneau").map((e) => ({ slug: e.key.split(":")[1] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = entity(`anneau:${slug}`);
  return e ? { title: `${e.name} — anneau`, description: `Effet et localisation de ${e.name} dans Dark Souls III.` } : { title: "Anneau introuvable" };
}

export default async function RingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = entity(`anneau:${slug}`);
  if (!e) notFound();
  const base = e.name.replace(/\+\d$/, "");
  const variants = entitiesOf("anneau").filter((r) => r.name.replace(/\+\d$/, "") === base).sort((a, b) => a.name.localeCompare(b.name));
  const required = checklist("Master_of_Rings").some((c) => c.subject === e.key);
  const g = gearInfo(e);
  const effect = ringEffects[base];
  return (
    <>
      <VisitRecorder href={e.href!} title={e.name} kind="Anneau" />
      <PageHeader
        crumbs={[{ href: "/anneaux", label: "Anneaux" }, { label: e.name }]}
        overline={e.category}
        title={e.name}
        meta={<><DlcBadge dlc={e.dlc} />{required ? <Tag tone="gold">Requis : Master of Rings</Tag> : <Tag>Non requis pour le succès</Tag>}{g.transposition && <Tag tone="ember">Transposition</Tag>}</>}
        actions={<><CheckToggle id={e.key} label="Marquer obtenu" doneLabel="Obtenu" /><FavoriteButton href={e.href!} title={e.name} kind="Anneau" /></>}
        compact
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-10">
          <section>
            <h2 className="h-section">Effet</h2>
            {effect ? (
              <div className="mt-4">
                <p className="prose-archive">{effect}{e.name !== base && " La variante renforce l'effet de l'anneau de base."}</p>
                <div className="mt-2"><ConfidenceBadge level="unverified" /></div>
              </div>
            ) : <p className="mt-4"><Missing /></p>}
            <dl className="mt-5">
              <StatRow label="Valeurs exactes"><Missing compact>Non recoupées — à compléter</Missing></StatRow>
              <StatRow label="Poids"><Missing compact /></StatRow>
            </dl>
          </section>
          <section>
            <h2 className="h-section">Obtention</h2>
            <div className="mt-5 space-y-4">
              {g.transposition && <p className="panel p-4">Transposition de la <strong className="text-parch">{g.transposition.soul}</strong> ({g.transposition.bossName}) par Ludleth.</p>}
              <Locations entityKey={e.key} steps={g.steps} />
            </div>
          </section>
        </div>
        <aside className="panel self-start p-5">
          <p className="eyebrow mb-3">Variantes</p>
          <ul className="space-y-1 text-sm">
            {variants.map((v) => <li key={v.key}>{v.key === e.key ? <span className="text-parch">{v.name}</span> : <Link className="link-archive" href={v.href!}>{v.name}</Link>} <span className="text-xs text-ash">{/\+1$/.test(v.name) ? "NG+" : /\+2$/.test(v.name) ? "NG++" : /\+3$/.test(v.name) ? "DLC" : ""}</span></li>)}
          </ul>
        </aside>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DlcBadge, Missing } from "@/components/ui/Badges";
import { Locations, StatRow } from "@/components/catalog/GearSections";
import { CheckToggle, FavoriteButton, VisitRecorder } from "@/components/progress/Check";
import { entitiesOf, entity, mentionsOf } from "@/lib/data";

export function generateStaticParams() {
  return entitiesOf("armure").filter((e) => e.href).map((e) => ({ slug: e.key.split(":")[1] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = entity(`armure:${slug}`);
  return e ? { title: `${e.name} — ${e.category}`, description: `${e.name} dans Dark Souls III : ensemble et localisation.` } : { title: "Pièce introuvable" };
}

export default async function ArmorPiecePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = entity(`armure:${slug}`);
  if (!e || !e.href) notFound();
  const set = entity(e.set);
  const steps = mentionsOf(e.key);
  return (
    <>
      <VisitRecorder href={e.href} title={e.name} kind="Armure" />
      <PageHeader
        crumbs={[{ href: "/armures", label: "Armures" }, ...(set ? [{ href: set.href!, label: set.name }] : []), { label: e.name }]}
        overline={e.category}
        title={e.name}
        meta={<DlcBadge dlc={e.dlc} />}
        actions={<><CheckToggle id={e.key} label="Marquer obtenue" doneLabel="Obtenue" /><FavoriteButton href={e.href} title={e.name} kind="Armure" /></>}
        compact
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <h2 className="h-section">Obtention</h2>
          <div className="mt-5 space-y-4">
            {set && (
              <p className="panel p-4">Fait partie de l&apos;ensemble <Link className="link-archive" href={set.href!}>{set.name}</Link>, obtenu aux emplacements suivants.</p>
            )}
            <Locations entityKey={set && !steps.length ? set.key : e.key} steps={steps.length ? steps : set ? mentionsOf(set.key) : []} />
          </div>
        </section>
        <aside className="panel p-5">
          <p className="eyebrow mb-2">Caractéristiques</p>
          <dl>
            <StatRow label="Emplacement">{e.category}</StatRow>
            <StatRow label="Poids"><Missing compact /></StatRow>
            <StatRow label="Absorptions"><Missing compact /></StatRow>
            <StatRow label="Résistances"><Missing compact /></StatRow>
          </dl>
          <p className="mt-3 text-xs text-ash">Valeurs non recoupées pendant la rédaction : laissées vides.</p>
        </aside>
      </div>
    </>
  );
}

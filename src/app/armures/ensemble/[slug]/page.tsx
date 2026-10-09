import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DlcBadge, Missing } from "@/components/ui/Badges";
import { Locations } from "@/components/catalog/GearSections";
import { CheckItem, FavoriteButton, VisitRecorder } from "@/components/progress/Check";
import { entitiesOf, entity, mentionsOf } from "@/lib/data";

export function generateStaticParams() {
  return entitiesOf("ensemble").map((e) => ({ slug: e.key.split(":")[1] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = entity(`ensemble:${slug}`);
  return e ? { title: `${e.name} — ensemble d'armure`, description: `Où trouver le ${e.name} dans Dark Souls III et quelles pièces il contient.` } : { title: "Ensemble introuvable" };
}

export default async function SetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = entity(`ensemble:${slug}`);
  if (!e) notFound();
  const pieces = entitiesOf("armure").filter((p) => p.set === e.key);
  return (
    <>
      <VisitRecorder href={e.href!} title={e.name} kind="Armure" />
      <PageHeader crumbs={[{ href: "/armures", label: "Armures" }, { label: e.name }]} overline="Ensemble d'armure" title={e.name} meta={<DlcBadge dlc={e.dlc} />} actions={<FavoriteButton href={e.href!} title={e.name} kind="Armure" />} compact />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <h2 className="h-section">Où le trouver</h2>
          <div className="mt-5"><Locations entityKey={e.key} steps={mentionsOf(e.key)} /></div>
        </section>
        <aside className="panel p-5">
          <p className="eyebrow mb-3">Pièces ({pieces.length})</p>
          {pieces.length === 0 ? (
            <Missing>Pièces non rattachées automatiquement — à compléter</Missing>
          ) : (
            <ul>
              {pieces.map((p) => (
                <li key={p.key} className="border-b border-line/10 last:border-0">
                  <CheckItem id={p.key} compact>
                    <Link className="link-archive" href={p.href!}>{p.name}</Link> <span className="text-xs text-ash">{p.category}</span>
                  </CheckItem>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-ash">Rattachement par nom ; certaines pièces au nom différent (ex. « Loincloth ») peuvent manquer.</p>
        </aside>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Unlock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DlcBadge, Tag } from "@/components/ui/Badges";
import { Locations } from "@/components/catalog/GearSections";
import { Rich } from "@/components/rich/Rich";
import { CheckToggle, FavoriteButton, VisitRecorder } from "@/components/progress/Check";
import { catalog, entitiesOf, entity, gearInfo } from "@/lib/data";
import { itemUses } from "@/data/item-uses";
import { bosses } from "@/data/bosses";
import { zoneBySlug } from "@/data/zones";

export function generateStaticParams() {
  return entitiesOf("objet").map((e) => ({ slug: e.key.split(":")[1] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = entity(`objet:${slug}`);
  return e ? { title: `${e.name} — ${e.category}`, description: `Où trouver ${e.name} dans Dark Souls III et à quoi il sert.` } : { title: "Objet introuvable" };
}

export default async function ItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = entity(`objet:${slug}`);
  if (!e) notFound();
  const g = gearInfo(e);
  // Ce que l'objet débloque : entrées de listes qui le citent comme prérequis
  const unlocks = Object.values(catalog.checklists).flat().filter((c) => c.subject !== e.key && c.fr.some((s) => s.k === e.key));
  const boss = bosses.find((b) => b.soulItem === e.name);
  const perZone = g.zones.map((z) => ({ z, n: g.steps.filter((s) => s.zone === z).length }));

  return (
    <>
      <VisitRecorder href={e.href!} title={e.name} kind="Objet" />
      <PageHeader
        crumbs={[{ href: "/objets", label: "Objets" }, { href: `/objets?categorie=${encodeURIComponent(e.category)}`, label: e.category }, { label: e.name }]}
        overline={e.category}
        title={e.name}
        meta={<><DlcBadge dlc={e.dlc} />{g.missable && <Tag tone="ember">Manquable</Tag>}</>}
        actions={<><CheckToggle id={e.key} label="Marquer trouvé" doneLabel="Trouvé" /><FavoriteButton href={e.href!} title={e.name} kind="Objet" /></>}
        compact
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-10">
          {(itemUses[e.name] || boss || unlocks.length > 0) && (
            <section>
              <h2 className="h-section">À quoi sert-il ?</h2>
              <div className="mt-5 space-y-3">
                {itemUses[e.name] && <p className="panel flex gap-3 p-4"><Unlock size={16} className="mt-1 shrink-0 text-gold" aria-hidden /> {itemUses[e.name]}</p>}
                {boss && (
                  <p className="panel p-4">
                    Âme de <Link className="link-archive" href={`/boss/${boss.slug}`}>{boss.name}</Link>. Peut être consommée pour des âmes ou transposée par Ludleth en :{" "}
                    {boss.transpositions.map((t, i) => { const x = entitiesOf("arme").concat(entitiesOf("bouclier"), entitiesOf("sort"), entitiesOf("anneau")).find((y) => y.name === t); return <span key={t}>{i > 0 && ", "}{x ? <Link className="link-archive" href={x.href!}>{t}</Link> : t}</span>; })}
                    {boss.transpositions.length === 0 && "aucune transposition"}.
                  </p>
                )}
                {unlocks.length > 0 && (
                  <div className="panel p-4">
                    <p className="eyebrow mb-2">Cité comme prérequis ou échange pour</p>
                    <ul className="space-y-2 text-[0.95rem]">{unlocks.map((u) => <li key={u.id}><Rich segs={u.fr} /></li>)}</ul>
                  </div>
                )}
              </div>
            </section>
          )}
          <section>
            <h2 className="h-section">Où le trouver</h2>
            <div className="mt-5"><Locations entityKey={e.key} steps={g.steps} /></div>
          </section>
        </div>
        <aside className="space-y-6 self-start">
          <div className="panel p-5">
            <p className="eyebrow mb-3">Répartition</p>
            {perZone.length === 0 ? <p className="text-sm text-dim">Non cité dans le parcours.</p> : (
              <ul className="space-y-1 text-sm">
                {perZone.map(({ z, n }) => <li key={z} className="flex justify-between gap-2"><Link className="link-archive" href={`/guide/${z}`}>{zoneBySlug.get(z)?.name}</Link><span className="font-mono text-ash">{n}</span></li>)}
              </ul>
            )}
            <p className="mt-3 text-xs text-ash">Nombre d&apos;étapes du parcours citant l&apos;objet (les ennemis qui réapparaissent et les marchands ne sont pas comptés).</p>
          </div>
        </aside>
      </div>
    </>
  );
}

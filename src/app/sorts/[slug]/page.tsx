import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DlcBadge, Missing, Tag } from "@/components/ui/Badges";
import { Locations, StatRow } from "@/components/catalog/GearSections";
import { CheckToggle, FavoriteButton, VisitRecorder } from "@/components/progress/Check";
import { entitiesOf, entity, mentionsOf } from "@/lib/data";
import { spellInfo } from "@/lib/spells";
import { formatNumber } from "@/lib/text";

export function generateStaticParams() {
  return entitiesOf("sort").map((e) => ({ slug: e.key.split(":")[1] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = entity(`sort:${slug}`);
  return e ? { title: `${e.name} — ${e.category.toLowerCase()}`, description: `Où obtenir ${e.name} dans Dark Souls III : marchand, prix, prérequis.` } : { title: "Sort introuvable" };
}

export default async function SpellPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = entity(`sort:${slug}`);
  if (!e) notFound();
  const s = spellInfo(e);
  const same = entitiesOf("sort").filter((x) => x.category === e.category && x.key !== e.key);
  return (
    <>
      <VisitRecorder href={e.href!} title={e.name} kind="Sort" />
      <PageHeader
        crumbs={[{ href: "/sorts", label: "Sorts" }, { href: `/sorts?categorie=${encodeURIComponent(e.category)}`, label: e.category }, { label: e.name }]}
        overline={e.category}
        title={e.name}
        meta={<><DlcBadge dlc={e.dlc} />{s.achievement ? <Tag tone="gold">Requis : {s.achievement}</Tag> : <Tag>Non requis pour un succès</Tag>}</>}
        actions={<><CheckToggle id={e.key} label="Marquer appris" doneLabel="Appris" /><FavoriteButton href={e.href!} title={e.name} kind="Sort" /></>}
        compact
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-10">
          <section>
            <h2 className="h-section">Obtention</h2>
            <div className="mt-5"><Locations entityKey={e.key} steps={mentionsOf(e.key)} /></div>
          </section>
          <section>
            <h2 className="h-section">Fiche technique</h2>
            <dl className="mt-4">
              <StatRow label="École">{e.category}</StatRow>
              <StatRow label="Méthode">{s.method}</StatRow>
              <StatRow label="Marchand(s)">{s.vendors.length ? s.vendors.map((v, i) => <span key={v.key}>{i > 0 && ", "}<Link className="link-archive" href={v.href!}>{v.name}</Link></span>) : "—"}</StatRow>
              <StatRow label="Prix">{s.price.length ? s.price.map((p) => `${formatNumber(p)} âmes`).join(" / ") : "—"}</StatRow>
              <StatRow label="Déblocage">{s.tomes.length ? s.tomes.map((t, i) => <span key={t.key}>{i > 0 && ", "}<Link className="link-archive" href={t.href!}>{t.name}</Link></span>) : s.soul ? <>Âme : <Link className="link-archive" href={s.soul.href!}>{s.soul.name}</Link></> : s.covenant ? <Link className="link-archive" href={s.covenant.href!}>{s.covenant.name}</Link> : "—"}</StatRow>
              <StatRow label="Coût en PC"><Missing compact /></StatRow>
              <StatRow label="Exigences"><Missing compact /></StatRow>
              <StatRow label="Emplacements"><Missing compact /></StatRow>
              <StatRow label="Effet / dégâts"><Missing compact /></StatRow>
            </dl>
            <p className="mt-3 text-xs text-ash">Coûts, exigences et effets chiffrés n&apos;ont pas été recoupés : ils restent à compléter.</p>
          </section>
        </div>
        <aside className="panel self-start p-5">
          <p className="eyebrow mb-3">{e.category} ({same.length + 1})</p>
          <ul className="max-h-96 space-y-1 overflow-y-auto text-sm">{same.map((x) => <li key={x.key}><Link className="link-archive" href={x.href!}>{x.name}</Link></li>)}</ul>
        </aside>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Lock, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tag } from "@/components/ui/Badges";
import { Spoiler } from "@/components/ui/Spoiler";
import { CheckItem, ChecklistProgress, FavoriteButton, VisitRecorder } from "@/components/progress/Check";
import { endings, resolveRef } from "@/lib/data";
import { endingBySlug } from "@/data/endings";

export function generateStaticParams() {
  return endings.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = endingBySlug.get(slug);
  if (!e) return { title: "Fin introuvable" };
  return { title: `${e.name} (${e.nameEn}) — conditions et étapes`, description: e.context };
}

export default async function EndingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = endingBySlug.get(slug);
  if (!e) notFound();
  const variantOf = e.variantOf ? endingBySlug.get(e.variantOf) : null;
  const variants = endings.filter((x) => x.variantOf === e.slug);

  return (
    <>
      <VisitRecorder href={`/fins/${e.slug}`} title={e.name} kind="Fin" />
      <PageHeader
        crumbs={[{ href: "/fins", label: "Fins" }, { label: e.name }]}
        overline={e.isVariant ? "Variante" : "Fin"}
        title={e.name}
        subtitle={e.nameEn}
        art={e.art}
        seed={`${e.slug}-hdr`}
        meta={e.achievement ? <Tag tone="gold">Succès : {e.achievement}</Tag> : <Tag tone="frost">Aucun succès propre</Tag>}
        actions={<FavoriteButton href={`/fins/${e.slug}`} title={e.name} kind="Fin" />}
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-12">
          {variantOf && (
            <p className="border-l-2 border-frost bg-frost/10 px-4 py-3 text-sm">
              Il s&apos;agit d&apos;une variante de <Link className="link-archive" href={`/fins/${variantOf.slug}`}>{variantOf.name}</Link>, et non d&apos;une fin distincte au sens des succès.
            </p>
          )}
          <section>
            <h2 className="h-section">Contexte</h2>
            <p className="prose-archive mt-4">{e.context}</p>
          </section>
          <section>
            <h2 className="h-section">Conditions exactes</h2>
            <ul className="mt-4 space-y-2">{e.conditions.map((c) => <li key={c} className="flex gap-3"><CheckCircle2 size={16} className="mt-1 shrink-0 text-gold" aria-hidden /> {c}</li>)}</ul>
            <h3 className="mt-8 font-display text-xl text-parch">Prérequis</h3>
            <ul className="prose-archive mt-2">{e.prerequisites.map((c) => <li key={c}>{c}</li>)}</ul>
          </section>
          <section>
            <h2 className="h-section">Étapes dans l&apos;ordre</h2>
            <ol className="mt-5 space-y-2">
              {e.steps.map((s, i) => (
                <li key={s.id}>
                  {s.warning && <p className="mb-1 flex gap-2 text-xs text-ember-hi"><AlertTriangle size={13} className="mt-0.5" aria-hidden /> {s.warning}</p>}
                  <div className={`panel border-l-2 px-4 ${s.irreversible ? "border-l-ember-hi" : ""}`}>
                    <CheckItem id={`fin-etape:${e.slug}:${s.id}`}>
                      <span className="font-mono text-xs text-gold">{i + 1}.</span> <span className="font-medium text-parch">{s.title}</span>
                      {s.irreversible && <span className="ml-2 inline-flex items-center gap-1 text-xs text-ember-hi"><Lock size={11} /> choix irréversible</span>}
                      {s.detail && <span className="block text-sm text-dim">{s.detail}</span>}
                      {s.link && <Link href={s.link} className="text-xs text-gold hover:text-gold-hi">Ouvrir la fiche →</Link>}
                    </CheckItem>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            <div className="panel p-5">
              <p className="eyebrow mb-3">Erreurs susceptibles de bloquer la fin</p>
              <ul className="space-y-2 text-sm">{e.blockers.map((b) => <li key={b} className="flex gap-2"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-ember-hi" aria-hidden /> {b}</li>)}</ul>
            </div>
            <div className="panel p-5">
              <p className="eyebrow mb-3">Moment où le choix devient définitif</p>
              <p className="text-sm">{e.pointOfNoReturn}</p>
            </div>
          </section>
          <section>
            <h2 className="h-section">Différences narratives</h2>
            <Spoiler className="mt-4" label="Description de la scène finale">
              <p className="prose-archive">{e.narrative}</p>
            </Spoiler>
          </section>
          {variants.length > 0 && (
            <section className="panel p-5">
              <p className="eyebrow mb-2">Variante</p>
              {variants.map((v) => <Link key={v.slug} href={`/fins/${v.slug}`} className="link-archive">{v.name}</Link>)}
            </section>
          )}
        </div>
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <ChecklistProgress ids={[`fin:${e.slug}`, ...e.steps.map((s) => `fin-etape:${e.slug}:${s.id}`)]} label="Progression" actions={false} />
          <div className="panel px-4 py-2"><CheckItem id={`fin:${e.slug}`}>Fin obtenue</CheckItem></div>
          <div className="panel p-5">
            <p className="eyebrow mb-3">Personnages concernés</p>
            <ul className="space-y-1 text-sm">
              {e.characters.map((c) => {
                const r = resolveRef(c);
                return <li key={c}>{r ? <Link className="link-archive" href={r.href}>{r.label}</Link> : c}</li>;
              })}
            </ul>
            {e.relatedQuests.length > 0 && (
              <>
                <p className="eyebrow mb-2 mt-5">Quêtes associées</p>
                <ul className="space-y-1 text-sm">
                  {e.relatedQuests.map((c) => {
                    const r = resolveRef(c);
                    return <li key={c}>{r ? <Link className="link-archive" href={`${r.href}#quete`}>{r.label}</Link> : c}</li>;
                  })}
                </ul>
              </>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

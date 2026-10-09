import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfidenceBadge } from "@/components/ui/Badges";
import { Toc } from "@/components/ui/Toc";
import { ItemLink } from "@/components/rich/ItemLink";
import { FavoriteButton, VisitRecorder } from "@/components/progress/Check";
import { loreArticles, refFor } from "@/lib/data";
import { loreBySlug, loreCategories } from "@/data/lore";
import { slugify } from "@/lib/text";

export function generateStaticParams() {
  return loreArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = loreBySlug.get(slug);
  if (!a) return { title: "Article introuvable" };
  return { title: `${a.title} — lore`, description: a.summary };
}

const CERT = { certain: "Établi", probable: "Probable", incertain: "Incertain" };

export default async function LoreArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = loreBySlug.get(slug);
  if (!a) notFound();
  const cat = loreCategories.find((c) => c.id === a.category);
  const toc = a.sections.map((s) => ({ id: slugify(s.heading), label: s.heading }));
  const siblings = loreArticles.filter((x) => x.category === a.category && x.slug !== a.slug);

  return (
    <>
      <VisitRecorder href={`/lore/${a.slug}`} title={a.title} kind="Lore" />
      <PageHeader
        crumbs={[{ href: "/lore", label: "Lore" }, { href: `/lore#${a.category}`, label: cat?.label ?? "" }, { label: a.title }]}
        overline={cat?.label}
        title={a.title}
        lede={a.summary}
        art={a.art}
        seed={`${a.slug}-hdr`}
        actions={<FavoriteButton href={`/lore/${a.slug}`} title={a.title} kind="Lore" />}
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article className="min-w-0">
          <div className="prose-archive">
            {a.sections.map((s, i) => (
              <section key={s.heading}>
                <h2 id={slugify(s.heading)}>{s.heading}</h2>
                <ConfidenceBadge level={s.confidence} />
                {s.paragraphs.map((p, k) => (
                  <p key={k} className={i === 0 && k === 0 ? "drop-cap mt-4" : k === 0 ? "mt-4" : ""}>{p}</p>
                ))}
              </section>
            ))}
          </div>
          {a.timeline && (
            <section className="mt-12">
              <h2 className="h-section">Repères chronologiques</h2>
              <ol className="mt-5 space-y-3 border-l border-line/25 pl-6">
                {a.timeline.map((t) => (
                  <li key={t.event} className="relative">
                    <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rotate-45 border border-gold bg-night" />
                    <p className="font-engrave text-[0.65rem] text-gold">{t.when} · {CERT[t.certainty]}</p>
                    <p>{t.event}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {a.items.length > 0 && (
            <section className="mt-12 panel p-5">
              <p className="eyebrow mb-3">Objets dont les descriptions nourrissent cet article</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{a.items.map((i) => <li key={i}><ItemLink name={i} /></li>)}</ul>
              <p className="mt-3 text-xs text-ash">Les descriptions d&apos;objets ne sont pas reproduites : consultez-les en jeu.</p>
            </section>
          )}
        </article>
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="hidden lg:block"><Toc items={toc} /></div>
          <div className="panel p-5">
            <p className="eyebrow mb-3">Pages liées</p>
            <ul className="space-y-1.5 text-sm">
              {a.related.map((r) => {
                const ref = refFor(r.kind, r.slug);
                return ref ? <li key={r.kind + r.slug}><Link className="link-archive" href={ref.href}>{ref.label}</Link> <span className="text-xs text-ash">{ref.kind}</span></li> : null;
              })}
            </ul>
          </div>
          {siblings.length > 0 && (
            <div className="panel p-5">
              <p className="eyebrow mb-3">Dans la même catégorie</p>
              <ul className="space-y-1.5 text-sm">{siblings.map((s) => <li key={s.slug}><Link className="link-archive" href={`/lore/${s.slug}`}>{s.title}</Link></li>)}</ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

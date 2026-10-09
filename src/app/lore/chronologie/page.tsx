import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { refFor } from "@/lib/data";
import { timeline } from "@/data/lore";

export const metadata: Metadata = {
  title: "Chronologie",
  description: "Chronologie navigable des grands événements de l'univers de Dark Souls, avec les incertitudes clairement signalées.",
};

const CERT = {
  certain: { label: "Ordre établi", cls: "border-gold text-gold-hi" },
  probable: { label: "Ordre probable", cls: "border-frost text-frost" },
  incertain: { label: "Ordre incertain", cls: "border-ember-hi text-ember-hi" },
};

export default function ChronologyPage() {
  const eras = [...new Set(timeline.map((t) => t.era))];
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/lore", label: "Lore" }, { label: "Chronologie" }]}
        overline="Archives"
        title="Chronologie"
        lede="Aucune date n'est inventée : la série ne donne pas de calendrier. Les événements sont ordonnés par grandes ères, avec un indicateur de certitude sur leur ordre."
        compact
      />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        <nav aria-label="Ères" className="mb-10 flex flex-wrap gap-2">
          {eras.map((e) => <a key={e} href={`#${encodeURIComponent(e)}`} className="chip">{e}</a>)}
        </nav>
        <div className="flex flex-wrap gap-3 text-xs">
          {Object.values(CERT).map((c) => <span key={c.label} className={`border px-2 py-0.5 ${c.cls}`}>{c.label}</span>)}
        </div>
        <ol className="relative mt-8 border-l border-line/30 pl-8">
          {eras.map((era) => (
            <li key={era} id={encodeURIComponent(era)} className="scroll-mt-24 pb-6">
              <p className="-ml-8 mb-4 bg-void py-1 font-engrave text-sm text-gold">{era}</p>
              <ol className="space-y-5">
                {timeline.filter((t) => t.era === era).map((t) => (
                  <li key={t.id} className="relative panel p-5">
                    <span className="absolute -left-[38px] top-6 h-3 w-3 rotate-45 border border-gold bg-night" aria-hidden />
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-xl text-parch">{t.title}</h2>
                      <span className={`border px-1.5 py-0.5 text-[0.65rem] ${CERT[t.certainty].cls}`}>{CERT[t.certainty].label}</span>
                    </div>
                    <p className="mt-2 text-dim">{t.description}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {t.refs.map((r) => {
                        const ref = refFor(r.kind, r.slug);
                        return ref ? <li key={r.slug}><Link href={ref.href} className="chip !min-h-[30px] text-xs">{ref.label}</Link></li> : null;
                      })}
                    </ul>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

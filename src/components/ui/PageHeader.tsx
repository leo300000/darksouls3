import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ArtSpec } from "@/data/types";
import { Illustration } from "@/components/art/Illustration";
import { fold } from "@/lib/text";
import { Embers } from "@/components/art/Embers";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ href: "/", label: "Accueil" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className="text-[0.78rem]">
      <ol className="flex flex-wrap items-center gap-1 text-dim">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} className="text-ash" aria-hidden />}
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="hover:text-gold-hi">
                {c.label}
              </Link>
            ) : (
              <span aria-current={i === all.length - 1 ? "page" : undefined} className="text-text">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: c.href })),
          }),
        }}
      />
    </nav>
  );
}

export function PageHeader({
  crumbs,
  overline,
  title,
  subtitle,
  lede,
  art,
  seed,
  imageKey,
  actions,
  meta,
  compact = false,
}: {
  crumbs: Crumb[];
  overline?: string;
  title: string;
  subtitle?: string;
  lede?: React.ReactNode;
  art?: ArtSpec;
  seed?: string;
  /** Clé du registre d'illustrations (ex. « zone:anor-londo ») ; gravure générée sinon. */
  imageKey?: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <header className={`relative overflow-hidden border-b border-line/15 ${compact ? "" : "min-h-[300px]"}`}>
      {art && (
        <div className="absolute inset-0 opacity-70">
          <Illustration imageKey={imageKey ?? ""} spec={art} seed={seed ?? title} className="h-full w-full" title={title} caption={false} />
          <div className="absolute inset-0 bg-gradient-to-r from-void via-void/85 to-void/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40" />
        </div>
      )}
      <Embers count={10} seed={`hdr-${title}`} />
      <div className={`relative mx-auto max-w-6xl px-4 sm:px-8 ${compact ? "py-8" : "pb-12 pt-8 sm:pt-10"}`}>
        <Breadcrumbs items={crumbs} />
        <div className="anim-page mt-8 max-w-3xl">
          {overline && <p className="eyebrow mb-3">{overline}</p>}
          <h1 className="title-monument text-[clamp(2.4rem,1.6rem+3.6vw,4.6rem)]">{title}</h1>
          {subtitle && fold(subtitle) !== fold(title) && <p className="mt-2 font-display text-xl italic text-gold/90">{subtitle}</p>}
          {lede && <div className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-text/90">{lede}</div>}
          {meta && <div className="mt-5 flex flex-wrap items-center gap-2">{meta}</div>}
          {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
    </header>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Scale } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfidenceBadge, DlcBadge, Missing, Tag } from "@/components/ui/Badges";
import { Locations, StatRow } from "@/components/catalog/GearSections";
import { CheckToggle, FavoriteButton, VisitRecorder } from "@/components/progress/Check";
import { entitiesOf, entity, gearInfo } from "@/lib/data";
import { categoryNotes } from "@/data/categories";
import type { ArtSpec } from "@/data/types";
import { Engraving } from "@/components/art/Engraving";

function find(slug: string) {
  return entity(`arme:${slug}`) ?? entity(`bouclier:${slug}`);
}

export function generateStaticParams() {
  return [...entitiesOf("arme"), ...entitiesOf("bouclier")].map((e) => ({ slug: e.key.split(":")[1] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = find(slug);
  if (!e) return { title: "Arme introuvable" };
  return { title: `${e.name} — ${e.category}`, description: `${e.name} (${e.category}) dans Dark Souls III : obtention, localisation, informations de combat.` };
}

const ART: Record<string, ArtSpec> = {
  base: { palette: "gold", motif: "castle" },
  "ashes-of-ariandel": { palette: "frost", motif: "snow" },
  "ringed-city": { palette: "blood", motif: "dreg" },
};

export default async function WeaponPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = find(slug);
  if (!e) notFound();
  const g = gearInfo(e);
  const s = g.stats?.stats;
  const same = [...entitiesOf("arme"), ...entitiesOf("bouclier")].filter((x) => x.category === e.category && x.key !== e.key);

  return (
    <>
      <VisitRecorder href={e.href!} title={e.name} kind={e.kind === "arme" ? "Arme" : "Bouclier"} />
      <PageHeader
        crumbs={[{ href: "/armes", label: "Armes & boucliers" }, { href: `/armes?categorie=${encodeURIComponent(e.category)}`, label: e.category }, { label: e.name }]}
        overline={e.category}
        title={e.name}
        meta={
          <>
            <DlcBadge dlc={e.dlc} />
            {g.transposition && <Tag tone="ember">Arme de boss</Tag>}
            {g.missable && <Tag tone="ember">Manquable</Tag>}
            {g.ngOnly && <Tag tone="gold">{g.ngOnly.toUpperCase()}</Tag>}
          </>
        }
        actions={
          <>
            <CheckToggle id={e.key} label="Marquer obtenue" doneLabel="Obtenue" />
            <FavoriteButton href={e.href!} title={e.name} kind="Arme" />
            <Link href={`/armes/comparateur?ids=${slug}`} className="btn btn-sm"><Scale size={15} /> Comparer</Link>
          </>
        }
        compact
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="h-section">Obtention</h2>
            <div className="mt-5 space-y-4">
              {g.transposition && (
                <p className="panel p-4">
                  Transposition par Ludleth de Courland de la <strong className="text-parch">{g.transposition.soul}</strong>
                  {g.transposition.boss ? <> (<Link className="link-archive" href={`/boss/${g.transposition.boss}`}>{g.transposition.bossName}</Link>)</> : <> ({g.transposition.bossName})</>}. Nécessite le Transposing Kiln.
                  {!g.availableBeforeEnd && <span className="mt-1 block text-sm text-ember-hi">Disponible uniquement après le boss final.</span>}
                </p>
              )}
              {g.enemyDrop && (
                <p className="panel flex flex-wrap items-center gap-2 p-4">
                  Butin possible : <strong className="text-parch">{g.enemyDrop.from}</strong> <ConfidenceBadge level={g.enemyDrop.confidence} />
                </p>
              )}
              <Locations entityKey={e.key} steps={g.steps} />
            </div>
          </section>

          <section>
            <h2 className="h-section">Caractéristiques</h2>
            {!s && (
              <p className="mt-4 border-l-2 border-gold/40 bg-gold/5 px-4 py-3 text-sm text-dim">
                Les valeurs chiffrées (dégâts de base à +0, scaling, exigences, poids, durabilité) n&apos;ont pas pu être recoupées pendant la rédaction : elles restent vides plutôt qu&apos;inventées.
                La structure est prête à les recevoir (voir <Link className="link-archive" href="/a-propos#completer">Compléter les données</Link>).
              </p>
            )}
            <dl className="mt-5">
              <StatRow label="Catégorie">{e.category}</StatRow>
              <StatRow label="Dégâts de base (+0)">{s ? Object.entries(s.damage).map(([k, v]) => `${k} ${v}`).join(" · ") : <Missing compact />}</StatRow>
              <StatRow label="Scaling">{s ? Object.entries(s.scaling).map(([k, v]) => `${k} ${v}`).join(" · ") : <Missing compact />}</StatRow>
              <StatRow label="Exigences">{s ? Object.entries(s.requirements).map(([k, v]) => `${k} ${v}`).join(" · ") : <Missing compact />}</StatRow>
              <StatRow label="Poids">{s ? s.weight : <Missing compact />}</StatRow>
              <StatRow label="Durabilité">{s?.durability ?? <Missing compact />}</StatRow>
              <StatRow label="Compétence d'arme">{s?.skill ?? <Missing compact />}</StatRow>
              <StatRow label="Amélioration">
                {g.transposition ? (
                  <span>Twinkling Titanite (règle des armes de boss) <ConfidenceBadge level="reference" /></span>
                ) : s?.upgrade ? s.upgrade : <Missing compact />}
              </StatRow>
              <StatRow label="Infusions">
                {g.infusable === false ? (
                  <span>Non infusable — les armes de boss ne peuvent pas être infusées <ConfidenceBadge level="reference" /></span>
                ) : (
                  <Missing compact>Compatibilité à vérifier</Missing>
                )}
              </StatRow>
            </dl>
            {g.stats && <p className="mt-3 text-xs text-ash">Source : {g.stats.source}</p>}
          </section>

          {categoryNotes[e.category] && (
            <section>
              <h2 className="h-section">Style de jeu</h2>
              <p className="prose-archive mt-4">{categoryNotes[e.category]}</p>
              <p className="mt-2 text-xs text-ash">Généralité sur la catégorie : les performances réelles dépendent du build et du contexte. Aucun score universel n&apos;est attribué.</p>
            </section>
          )}
        </div>
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <figure className="panel overflow-hidden">
            <Engraving spec={ART[e.dlc]} seed={e.key} variant="sigil" className="aspect-square w-full" title={e.name} />
            <figcaption className="p-3 text-[0.7rem] text-ash">Icône officielle non intégrée : emblème généré, temporaire.</figcaption>
          </figure>
          <div className="panel p-5">
            <p className="eyebrow mb-3">Même catégorie ({same.length})</p>
            <ul className="max-h-80 space-y-1 overflow-y-auto text-sm">
              {same.map((x) => <li key={x.key}><Link className="link-archive" href={x.href!}>{x.name}</Link></li>)}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}

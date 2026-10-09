import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/nav";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Swords, Crosshair, Wand2, Shield } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfidenceBadge, DlcBadge, Missing, Tag } from "@/components/ui/Badges";
import { Spoiler } from "@/components/ui/Spoiler";
import { Toc } from "@/components/ui/Toc";
import { Illustration, hasIllustration } from "@/components/art/Illustration";
import { bossEmblems } from "@/data/emblems";
import { Rich } from "@/components/rich/Rich";
import { ItemLink } from "@/components/rich/ItemLink";
import { CheckToggle, FavoriteButton, VisitRecorder } from "@/components/progress/Check";
import { bosses, mentionsOf, resolveRef, zones } from "@/lib/data";
import { bossBySlug } from "@/data/bosses";
import { zoneBySlug } from "@/data/zones";
import { formatNumber } from "@/lib/text";

export function generateStaticParams() {
  return bosses.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = bossBySlug.get(slug);
  if (!b) return { title: "Boss introuvable" };
  return { title: `${b.name} (${b.nameEn}) — stratégie et lore`, description: b.summary, openGraph: { title: b.name, description: b.summary, images: [OG_IMAGE] } };
}

export default async function BossDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = bossBySlug.get(slug);
  if (!b) notFound();
  const zone = zoneBySlug.get(b.zone)!;
  const ordered = [...bosses].sort((x, y) => x.order - y.order);
  const i = ordered.findIndex((x) => x.slug === b.slug);
  const prev = ordered[i - 1];
  const next = ordered[i + 1];
  const steps = mentionsOf(`boss:${b.slug}`);
  // Passages menant à la zone du boss (données des zones) : conditions d'accès sans les dupliquer.
  const access = zones
    .flatMap((from) => from.connections.filter((c) => c.zone === b.zone && c.kind !== "raccourci").map((c) => ({ from, via: c.via, condition: c.condition })))
    .slice(0, 3);

  const toc = [
    { id: "presentation", label: "Présentation" },
    { id: "combat", label: "Combat" },
    { id: "attaques", label: "Attaques et signaux" },
    { id: "strategie", label: "Stratégie" },
    { id: "recompenses", label: "Récompenses" },
    { id: "lore", label: "Lore" },
    ...(steps.length ? [{ id: "parcours", label: "Dans le parcours" }] : []),
  ];

  return (
    <>
      <VisitRecorder href={`/boss/${b.slug}`} title={b.name} kind="Boss" />
      <PageHeader
        crumbs={[{ href: "/boss", label: "Boss" }, { label: b.name }]}
        overline={`Boss ${String(b.order).padStart(2, "0")} · ${zone.name}`}
        title={b.name}
        subtitle={b.nameEn}
        art={b.art}
        seed={`${b.slug}-hdr`}
        meta={
          <>
            <DlcBadge dlc={b.dlc} />
            <Tag tone={b.required ? "gold" : "default"}>{b.required ? "Obligatoire" : "Facultatif"}</Tag>
            {b.lordOfCinder && <Tag tone="ember">Seigneur des cendres</Tag>}
          </>
        }
        actions={
          <>
            <CheckToggle id={`boss:${b.slug}`} label="Marquer vaincu" doneLabel="Vaincu" />
            <FavoriteButton href={`/boss/${b.slug}`} title={b.name} kind="Boss" />
          </>
        }
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-16">
          <section id="presentation" className="scroll-mt-24 grid gap-8 md:grid-cols-[1fr_240px]">
            <div>
              <h2 className="h-section">Présentation</h2>
              <p className="prose-archive mt-5 drop-cap">{b.summary}</p>
              {b.requiredNote && <p className="mt-4 border-l-2 border-gold/50 pl-3 text-sm text-dim">{b.requiredNote}</p>}
              <h3 className="mt-8 font-display text-xl text-parch">Résumé narratif</h3>
              <Spoiler className="mt-3">
                <p className="prose-archive">{b.spoiler}</p>
              </Spoiler>
            </div>
            <figure className="panel overflow-hidden">
              <Illustration imageKey={`boss:${b.slug}`} spec={b.art} seed={b.slug} variant="sigil" emblem={bossEmblems[b.slug]} className="aspect-[3/4] w-full" title={b.name} />
              <figcaption className="p-3 text-[0.7rem] text-ash">
                {hasIllustration(`boss:${b.slug}`) ? "Illustration originale." : "Emblème généré pour l'archive (illustration provisoire). Aucune image officielle n'est intégrée."}
              </figcaption>
            </figure>
          </section>

          <section id="combat" className="scroll-mt-24">
            <h2 className="h-section">Combat</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="panel p-5">
                <p className="eyebrow">Barre de vie</p>
                {b.hp ? <p className="mt-2 font-mono text-2xl">{b.hp.value}</p> : <p className="mt-2"><Missing>Aucune valeur recoupée — non renseignée</Missing></p>}
                <p className="eyebrow mt-5">Âmes (NG)</p>
                {b.souls ? (
                  <>
                    <p className="mt-2 font-mono text-2xl text-parch">{formatNumber(b.souls.value)}</p>
                    <ConfidenceBadge level={b.souls.confidence} className="mt-2" />
                    <p className="mt-1 text-xs text-ash">{b.souls.note}</p>
                  </>
                ) : (
                  <p className="mt-2"><Missing /></p>
                )}
              </div>
              <div className="panel p-5">
                <p className="eyebrow">Faiblesses</p>
                {b.weaknesses ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {b.weaknesses.value.map((w) => <Tag key={w} tone="ember">{w}</Tag>)}
                    <ConfidenceBadge level={b.weaknesses.confidence} />
                  </div>
                ) : (
                  <p className="mt-2"><Missing>Non établies — à vérifier</Missing></p>
                )}
                {b.weaknesses?.note && <p className="mt-1 text-xs text-ash">{b.weaknesses.note}</p>}
                <p className="eyebrow mt-5">Résistances</p>
                {b.resistances ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {b.resistances.value.map((w) => <Tag key={w} tone="frost">{w}</Tag>)}
                    <ConfidenceBadge level={b.resistances.confidence} />
                  </div>
                ) : (
                  <p className="mt-2"><Missing>Non établies — à vérifier</Missing></p>
                )}
                <p className="eyebrow mt-5">Types de dégâts infligés</p>
                <div className="mt-2 flex flex-wrap gap-2">{b.damageTypes.map((d) => <Tag key={d}>{d}</Tag>)}</div>
              </div>
            </div>
            <h3 className="mt-10 font-display text-2xl text-parch">Phases</h3>
            <ol className="mt-4 grid gap-4 md:grid-cols-2">
              {b.phases.map((p, k) => (
                <li key={p.name} className="panel relative p-5 pl-14">
                  <span className="absolute left-4 top-4 font-display text-3xl text-gold">{["I", "II", "III"][k]}</span>
                  <p className="font-display text-xl text-parch">{p.name}</p>
                  <p className="mt-1 text-sm text-dim">{p.description}</p>
                </li>
              ))}
            </ol>
            {b.particulars.length > 0 && (
              <>
                <h3 className="mt-10 font-display text-2xl text-parch">Particularités</h3>
                <ul className="prose-archive mt-3">
                  {b.particulars.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </>
            )}
          </section>

          <section id="attaques" className="scroll-mt-24">
            <h2 className="h-section">Attaques et signaux</h2>
            {b.attacks.length === 0 ? (
              <p className="mt-4 text-dim">Ce combat varie selon l&apos;adversaire (boss incarné par un joueur) : aucune liste d&apos;attaques fixe.</p>
            ) : (
              <>
                <div className="mt-6 hidden overflow-x-auto md:block">
                  <table className="table-archive">
                    <thead>
                      <tr><th>Attaque</th><th>Signal visuel</th><th>Réponse / fenêtre</th></tr>
                    </thead>
                    <tbody>
                      {b.attacks.map((a) => (
                        <tr key={a.name}>
                          <td className="font-medium text-parch">{a.name}</td>
                          <td className="text-dim">{a.tell}</td>
                          <td>{a.punish}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ul className="mt-6 space-y-3 md:hidden">
                  {b.attacks.map((a) => (
                    <li key={a.name} className="panel p-4">
                      <p className="font-medium text-parch">{a.name}</p>
                      <p className="mt-1 text-sm text-dim"><span className="text-gold">Signal :</span> {a.tell}</p>
                      <p className="mt-1 text-sm"><span className="text-gold">Réponse :</span> {a.punish}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section id="strategie" className="scroll-mt-24">
            <h2 className="h-section">Stratégie recommandée</h2>
            <p className="prose-archive mt-5">{b.strategy.general}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { icon: Swords, title: "Mêlée", text: b.strategy.melee },
                { icon: Crosshair, title: "Distance", text: b.strategy.ranged },
                { icon: Wand2, title: "Magie", text: b.strategy.magic },
              ].map((s) => (
                <div key={s.title} className="panel p-5">
                  <s.icon size={18} className="text-gold" aria-hidden />
                  <p className="mt-2 font-display text-xl text-parch">{s.title}</p>
                  <p className="mt-1 text-sm text-dim">{s.text}</p>
                </div>
              ))}
            </div>
            <h3 className="mt-10 font-display text-2xl text-parch">Invocations et alliés</h3>
            {b.summons.length === 0 ? (
              <p className="mt-3 text-dim">Aucune invocation de PNJ documentée par les sources utilisées.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {b.summons.map((s) => (
                  <li key={s.name} className="flex gap-3">
                    <Shield size={16} className="mt-1 shrink-0 text-frost" aria-hidden />
                    <span><span className="text-parch">{s.name}</span> — <span className="text-dim">{s.condition}</span></span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section id="recompenses" className="scroll-mt-24">
            <h2 className="h-section">Récompenses</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="panel p-5">
                <p className="eyebrow">Objets obtenus</p>
                <ul className="mt-3 space-y-1">{b.drops.map((d) => <li key={d}><ItemLink name={d} /></li>)}</ul>
              </div>
              <div className="panel p-5">
                <p className="eyebrow">Transpositions (Ludleth)</p>
                {b.transpositions.length ? (
                  <ul className="mt-3 space-y-1">{b.transpositions.map((d) => <li key={d}><ItemLink name={d} /></li>)}</ul>
                ) : (
                  <p className="mt-3 text-sm text-dim">Aucune transposition.</p>
                )}
              </div>
              <div className="panel p-5">
                <p className="eyebrow">Succès</p>
                <p className="mt-3 text-sm">{b.achievement ?? <span className="text-dim">Aucun succès dédié (les boss de DLC n&apos;en ont pas).</span>}</p>
                <p className="eyebrow mt-5">Débloque</p>
                <ul className="mt-2 text-sm text-dim">{b.unlocks.length ? b.unlocks.map((u) => <li key={u}>{u}</li>) : <li>—</li>}</ul>
              </div>
            </div>
          </section>

          <section id="lore" className="scroll-mt-24">
            <h2 className="h-section">Lore</h2>
            <Spoiler className="mt-6" label="Lore et révélations">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2"><ConfidenceBadge level="game" /> <span className="text-sm text-dim">Identité et histoire telles que le jeu les présente.</span></div>
                <div className="prose-archive">
                  <h3>Identité</h3>
                  <p>{b.lore.identity}</p>
                  {b.lore.history && (<><h3>Histoire</h3><p>{b.lore.history}</p></>)}
                </div>
                {(b.lore.symbolism || b.lore.interpretation) && (
                  <div className="border-l-2 border-line/25 pl-4">
                    <div className="flex flex-wrap items-center gap-2"><ConfidenceBadge level="deduction" /> <span className="text-sm text-dim">Lecture éditoriale : ce qui suit interprète les indices, le jeu ne l&apos;énonce pas.</span></div>
                    <div className="prose-archive mt-2">
                      {b.lore.symbolism && (<><h3>Symbolisme</h3><p>{b.lore.symbolism}</p></>)}
                      {b.lore.interpretation && (<><h3>Interprétation</h3><p>{b.lore.interpretation}</p></>)}
                    </div>
                  </div>
                )}
                {b.lore.relations.length > 0 && (
                  <div>
                    <p className="eyebrow mb-2">Relations</p>
                    <ul className="flex flex-wrap gap-2">
                      {b.lore.relations.map((r) => {
                        const ref = resolveRef(r.target);
                        return (
                          <li key={r.target + r.label}>
                            {ref ? <Link href={ref.href} className="chip">{ref.label} · <span className="text-ash">{r.label}</span></Link> : <span className="chip">{r.label}</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {b.lore.theories.length > 0 && (
                  <div className="panel p-5">
                    <p className="eyebrow mb-3">Théories et déductions</p>
                    <ul className="space-y-3">
                      {b.lore.theories.map((t) => (
                        <li key={t.text} className="flex flex-col gap-1">
                          <ConfidenceBadge level={t.confidence} className="self-start" />
                          <span className="text-sm">{t.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {b.lore.evidence.length > 0 && (
                  <div>
                    <p className="eyebrow mb-2">Objets et descriptions à l&apos;appui</p>
                    <ul className="space-y-1 text-sm">
                      {b.lore.evidence.map((e) => (
                        <li key={e.item}><ItemLink name={e.item} /> — <span className="text-dim">{e.gist}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Spoiler>
          </section>

          {steps.length > 0 && (
            <section id="parcours" className="scroll-mt-24">
              <h2 className="h-section">Dans le parcours</h2>
              <ul className="mt-5 space-y-3">
                {steps.map((s) => (
                  <li key={s.id} className="border-l-2 border-gold/40 pl-4 text-[0.95rem]">
                    <Rich segs={s.fr} />{" "}
                    <Link href={`/guide/${s.zone}#${s.id}`} className="text-xs text-ash hover:text-text">→ {zoneBySlug.get(s.zone)?.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav className="grid gap-3 border-t border-line/15 pt-8 sm:grid-cols-2" aria-label="Boss précédent et suivant">
            {prev ? (
              <Link href={`/boss/${prev.slug}`} className="panel card-link p-4"><span className="flex items-center gap-1 text-xs text-ash"><ArrowLeft size={12} /> Précédent</span><span className="font-display text-xl text-parch">{prev.name}</span></Link>
            ) : <span />}
            {next && (
              <Link href={`/boss/${next.slug}`} className="panel card-link p-4 text-right"><span className="flex items-center justify-end gap-1 text-xs text-ash">Suivant <ArrowRight size={12} /></span><span className="font-display text-xl text-parch">{next.name}</span></Link>
            )}
          </nav>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="panel p-5 text-sm">
            <p className="eyebrow mb-3">Fiche</p>
            <dl className="space-y-2">
              <div className="flex justify-between gap-3"><dt className="text-dim">Zone</dt><dd><Link className="link-archive" href={`/guide/${zone.slug}`}>{zone.name}</Link></dd></div>
              <div className="flex justify-between gap-3"><dt className="text-dim">Contenu</dt><dd>{b.dlc === "base" ? "Jeu de base" : b.dlc === "ashes-of-ariandel" ? "Ashes of Ariandel" : "The Ringed City"}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-dim">Statut</dt><dd>{b.required ? "Obligatoire" : "Facultatif"}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-dim">Âme</dt><dd className="text-right">{b.soulItem ? <ItemLink name={b.soulItem} /> : "—"}</dd></div>
              <div className="flex justify-between gap-3">
                <dt className="text-dim">Âmes NG</dt>
                <dd className="text-right font-mono">
                  {b.souls ? formatNumber(b.souls.value) : "—"}
                  {b.souls && b.souls.confidence !== "game" && <span className="block font-sans text-[0.68rem] text-ash">à vérifier</span>}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-dim">Faiblesses</dt>
                <dd className="text-right">{b.weaknesses?.value.length ? b.weaknesses.value.join(", ") : "—"}{b.weaknesses && b.weaknesses.confidence !== "game" && <span className="block text-[0.68rem] text-ash">à vérifier</span>}</dd>
              </div>
            </dl>
            {access.length > 0 && (
              <div className="mt-4 border-t border-line/15 pt-3">
                <p className="eyebrow mb-2">Accès à la zone</p>
                <ul className="space-y-2 text-xs">
                  {access.map((a) => (
                    <li key={a.from.slug + a.via}>
                      <span className="text-dim">Depuis </span>
                      <Link href={`/guide/${a.from.slug}`} className="link-archive">{a.from.name}</Link>
                      <span className="text-dim"> — {a.via}</span>
                      {a.condition && <span className="mt-0.5 block text-gold">Condition : {a.condition}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="hidden lg:block"><Toc items={toc} /></div>
        </aside>
      </div>
    </>
  );
}

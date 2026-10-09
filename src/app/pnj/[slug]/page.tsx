import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Lock, MapPin, Gift, Link2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DlcBadge, Tag } from "@/components/ui/Badges";
import { Spoiler } from "@/components/ui/Spoiler";
import { Engraving } from "@/components/art/Engraving";
import { Rich } from "@/components/rich/Rich";
import { ItemLink } from "@/components/rich/ItemLink";
import { CheckItem, ChecklistProgress, FavoriteButton, VisitRecorder } from "@/components/progress/Check";
import { QuestStatusSelect } from "@/components/quest/QuestStatusSelect";
import { npcs, mentionsOf, resolveRef } from "@/lib/data";
import { npcBySlug } from "@/data/npcs";
import { zoneBySlug } from "@/data/zones";

export function generateStaticParams() {
  return npcs.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = npcBySlug.get(slug);
  if (!n) return { title: "Personnage introuvable" };
  return { title: `${n.name} — ${n.quest ? "quête complète" : "personnage"}`, description: n.summary };
}

const DEP = { requiert: { label: "Requiert", tone: "gold" as const }, incompatible: { label: "Incompatible", tone: "ember" as const }, influence: { label: "Influence", tone: "frost" as const } };

export default async function NpcPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = npcBySlug.get(slug);
  if (!n) notFound();
  const steps = mentionsOf(`pnj:${n.slug}`);
  const q = n.quest;

  return (
    <>
      <VisitRecorder href={`/pnj/${n.slug}`} title={n.name} kind="Personnage" />
      <PageHeader
        crumbs={[{ href: "/pnj", label: "Personnages" }, { label: n.name }]}
        overline={n.role}
        title={n.name}
        subtitle={n.nameEn !== n.name ? n.nameEn : undefined}
        art={n.art}
        seed={`${n.slug}-hdr`}
        meta={<DlcBadge dlc={n.dlc} />}
        actions={
          <>
            {q && <QuestStatusSelect npc={n.slug} />}
            <FavoriteButton href={`/pnj/${n.slug}`} title={n.name} kind="Personnage" />
          </>
        }
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-14">
          <section>
            <h2 className="h-section">Présentation</h2>
            <p className="prose-archive mt-5 drop-cap">{n.summary}</p>
            <h3 className="mt-8 font-display text-xl text-parch">Histoire</h3>
            <Spoiler className="mt-3">
              <div className="prose-archive">{n.story.map((p) => <p key={p}>{p}</p>)}</div>
            </Spoiler>
          </section>

          {q && (
            <section id="quete" className="scroll-mt-24">
              <p className="eyebrow">Quête</p>
              <h2 className="h-section mt-2">{q.title}</h2>
              <p className="mt-3 max-w-2xl text-dim">{q.summary}</p>
              <ol className="relative mt-8 space-y-4 border-l border-line/25 pl-8">
                {q.steps.map((s, i) => {
                  const zone = s.zone ? zoneBySlug.get(s.zone) : null;
                  return (
                    <li key={s.id} className="relative">
                      <span className={`absolute -left-[42px] top-3 flex h-5 w-5 rotate-45 items-center justify-center border ${s.missable ? "border-ember-hi bg-ember/30" : "border-gold bg-night"}`}>
                        <span className="-rotate-45 font-mono text-[0.6rem]">{i + 1}</span>
                      </span>
                      {s.warning && (
                        <p className="mb-2 flex gap-2 border-l-2 border-ember-hi bg-ember/10 px-3 py-2 text-sm text-ember-hi">
                          <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden /> {s.warning}
                        </p>
                      )}
                      <div className="panel px-4">
                        <CheckItem id={`quete:${n.slug}:${s.id}`}>
                          <span className="block font-medium text-parch">{s.title}</span>
                          {zone && (
                            <Link href={`/guide/${zone.slug}`} className="mt-0.5 inline-flex items-center gap-1 text-xs text-gold hover:text-gold-hi">
                              <MapPin size={11} /> {zone.name}
                            </Link>
                          )}
                          <span className="mt-1 block text-sm text-text/90">{s.detail}</span>
                          {s.condition && <span className="mt-1 block text-xs text-frost">Condition : {s.condition}</span>}
                          {s.reward && (
                            <span className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                              <Gift size={12} className="text-gold" aria-hidden />
                              {s.reward.map((r) => <ItemLink key={r} name={r} />)}
                            </span>
                          )}
                        </CheckItem>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                <div className="panel p-5">
                  <p className="eyebrow mb-3">Issues possibles</p>
                  <Spoiler>
                    <ul className="space-y-3">
                      {q.outcomes.map((o) => (
                        <li key={o.id}>
                          <p className="font-display text-lg text-parch">{o.label}</p>
                          <p className="text-sm text-dim">{o.description}</p>
                        </li>
                      ))}
                    </ul>
                  </Spoiler>
                </div>
                <div className="panel p-5">
                  <p className="eyebrow mb-3">Événements irréversibles</p>
                  {q.irreversible.length ? (
                    <ul className="space-y-2 text-sm">
                      {q.irreversible.map((x) => (
                        <li key={x} className="flex gap-2"><Lock size={14} className="mt-0.5 shrink-0 text-ember-hi" aria-hidden /> {x}</li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-dim">Aucun point de non-retour documenté.</p>}
                  {q.consequences.length > 0 && (
                    <>
                      <p className="eyebrow mb-2 mt-5">Conséquences</p>
                      <ul className="space-y-1 text-sm text-dim">{q.consequences.map((c) => <li key={c}>{c}</li>)}</ul>
                    </>
                  )}
                </div>
              </div>

              {q.dependencies.length > 0 && (
                <div className="mt-6">
                  <p className="eyebrow mb-3">Dépendances avec d&apos;autres quêtes</p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {q.dependencies.map((d) => {
                      const other = npcBySlug.get(d.npc);
                      return (
                        <li key={d.npc + d.kind} className="panel flex gap-3 p-4">
                          <Link2 size={16} className="mt-1 shrink-0 text-gold" aria-hidden />
                          <div>
                            <Tag tone={DEP[d.kind].tone}>{DEP[d.kind].label}</Tag>{" "}
                            <Link href={`/pnj/${d.npc}`} className="link-archive">{other?.name ?? d.npc}</Link>
                            <p className="mt-1 text-sm text-dim">{d.note}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </section>
          )}

          <section>
            <h2 className="h-section">Localisations successives</h2>
            <ol className="mt-5 space-y-2">
              {n.locations.map((l, i) => (
                <li key={i} className="flex gap-3">
                  <MapPin size={16} className="mt-1 shrink-0 text-gold" aria-hidden />
                  <span><Link href={`/guide/${l.zone}`} className="link-archive">{zoneBySlug.get(l.zone)?.name ?? l.zone}</Link> <span className="text-dim">— {l.when}</span></span>
                </li>
              ))}
            </ol>
          </section>

          {n.dialogues.length > 0 && (
            <section>
              <h2 className="h-section">Dialogues résumés</h2>
              <ul className="prose-archive mt-5">{n.dialogues.map((d) => <li key={d}>{d}</li>)}</ul>
            </section>
          )}

          {steps.length > 0 && (
            <section>
              <h2 className="h-section">Dans le parcours détaillé</h2>
              <ul className="mt-5 space-y-3">
                {steps.map((s) => (
                  <li key={s.id} className="border-l-2 border-frost/40 pl-4 text-[0.95rem]">
                    <Rich segs={s.fr} />{" "}
                    <Link href={`/guide/${s.zone}#${s.id}`} className="text-xs text-ash hover:text-text">→ {zoneBySlug.get(s.zone)?.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <figure className="panel overflow-hidden">
            <Engraving spec={n.art} seed={n.slug} variant="sigil" className="aspect-[4/5] w-full" title={n.name} />
            <figcaption className="p-3 text-[0.7rem] text-ash">Portrait non disponible : gravure générée, temporaire.</figcaption>
          </figure>
          {q && <ChecklistProgress ids={q.steps.map((s) => `quete:${n.slug}:${s.id}`)} label="Étapes de la quête" actions={false} />}
          {n.merchant && (
            <div className="panel p-5 text-sm">
              <p className="eyebrow mb-2">Services</p>
              <p className="text-dim">{n.merchant}</p>
            </div>
          )}
          {n.relations.length > 0 && (
            <div className="panel p-5">
              <p className="eyebrow mb-3">Relations</p>
              <ul className="space-y-2 text-sm">
                {n.relations.map((r) => {
                  const ref = resolveRef(r.target);
                  return (
                    <li key={r.target + r.label}>
                      {ref ? <Link href={ref.href} className="link-archive">{ref.label}</Link> : r.target} <span className="text-dim">— {r.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {q && q.rewards.length > 0 && (
            <div className="panel p-5">
              <p className="eyebrow mb-3">Récompenses</p>
              <ul className="space-y-1 text-sm">{q.rewards.map((r) => <li key={r}><ItemLink name={r.replace(/ \(.+\)$/, "")} />{/\(.+\)$/.test(r) && <span className="text-dim"> {r.match(/\(.+\)$/)![0]}</span>}</li>)}</ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

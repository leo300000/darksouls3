import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Map as MapIcon, AlertTriangle, KeyRound, EyeOff, Bomb, Lightbulb, Flame } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DlcBadge, Tag } from "@/components/ui/Badges";
import { Toc } from "@/components/ui/Toc";
import { Rich, plain } from "@/components/rich/Rich";
import { StepList } from "@/components/guide/StepList";
import { Difficulty } from "@/components/guide/Difficulty";
import { CheckItem, ChecklistProgress, CheckToggle, FavoriteButton, VisitRecorder } from "@/components/progress/Check";
import { Engraving } from "@/components/art/Engraving";
import { zones, stepsForZone, entity, catalog, loreArticles } from "@/lib/data";
import { zoneBySlug } from "@/data/zones";
import { bossBySlug } from "@/data/bosses";
import { npcBySlug } from "@/data/npcs";
import type { CatalogEntity } from "@/data/catalog-types";

export function generateStaticParams() {
  return zones.map((z) => ({ zone: z.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ zone: string }> }): Promise<Metadata> {
  const { zone } = await params;
  const z = zoneBySlug.get(zone);
  if (!z) return { title: "Zone introuvable" };
  return {
    title: `${z.name} (${z.nameEn}) — guide de zone`,
    description: `${z.tagline} Cheminement étape par étape, feux, boss, objets, secrets et éléments manquables.`,
    openGraph: { title: `${z.name} — The Ashen Archive`, description: z.tagline },
  };
}

const ITEM_GROUPS: { title: string; match: (e: CatalogEntity) => boolean }[] = [
  { title: "Armes et boucliers", match: (e) => e.kind === "arme" || e.kind === "bouclier" },
  { title: "Armures", match: (e) => e.kind === "ensemble" || e.kind === "armure" },
  { title: "Anneaux", match: (e) => e.kind === "anneau" },
  { title: "Sorts", match: (e) => e.kind === "sort" },
  { title: "Clés, quêtes et progression", match: (e) => e.kind === "objet" && /Clés|quête|Estus|Cendres|Tomes|Charbons|Âmes de boss|Serments/.test(e.category) },
  { title: "Matériaux, gemmes et consommables", match: (e) => e.kind === "objet" && !/Clés|quête|Estus|Cendres|Tomes|Charbons|Âmes de boss|Serments/.test(e.category) },
];

export default async function ZonePage({ params }: { params: Promise<{ zone: string }> }) {
  const { zone: slug } = await params;
  const z = zoneBySlug.get(slug);
  if (!z) notFound();

  const steps = stepsForZone(z.slug);
  const ordered = [...zones].sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((x) => x.slug === z.slug);
  const prev = ordered[idx - 1];
  const next = ordered[idx + 1];

  // Entités mentionnées dans la zone, regroupées
  const keys = new Set<string>();
  for (const s of steps) for (const seg of s.en) if (seg.k) keys.add(seg.k);
  const mentioned = [...keys].map((k) => entity(k)!).filter(Boolean);
  const secretSteps = steps.filter((s) => /illusory|illusionary|hidden|secret/i.test(plain(s.en)));
  const trapSteps = steps.filter((s) => /mimic|ambush|invade|invasion/i.test(plain(s.en)));
  const shortcutSteps = steps.filter((s) => /shortcut/i.test(plain(s.en)));
  const missSteps = steps.filter((s) => s.tags.includes("miss"));
  const npcSteps = steps.filter((s) => s.tags.includes("npc"));
  const zoneBosses = z.bosses.map((b) => bossBySlug.get(b)!).filter(Boolean);
  const zoneNpcs = z.npcs.map((n) => npcBySlug.get(n)).filter(Boolean);
  const lore = loreArticles.filter((a) => a.related.some((r) => r.kind === "zone" && r.slug === z.slug));

  const toc = [
    { id: "presentation", label: "Présentation" },
    { id: "cheminement", label: "Cheminement" },
    { id: "acces", label: "Entrées et sorties" },
    { id: "feux", label: "Feux de camp" },
    { id: "boss", label: "Boss" },
    { id: "ennemis", label: "Ennemis importants" },
    { id: "objets", label: "Objets et équipements" },
    { id: "pnj", label: "PNJ et interactions" },
    { id: "raccourcis", label: "Raccourcis" },
    { id: "secrets", label: "Secrets" },
    { id: "pieges", label: "Mimics et pièges" },
    { id: "quetes", label: "Quêtes affectées" },
    { id: "manquables", label: "Événements manquables" },
    { id: "conseils", label: "Conseils de combat" },
  ];

  const stepRows = steps.map((s) => ({ id: s.id, tags: s.tags, ng: s.ng, content: <Rich segs={s.fr} /> }));
  const zoneChecklistIds = [`zone:${z.slug}`, ...z.bonfires.map((b) => `feu:${z.slug}:${b}`), ...z.bosses.map((b) => `boss:${b}`), ...steps.map((s) => `step:${s.id}`)];

  return (
    <>
      <VisitRecorder href={`/guide/${z.slug}`} title={z.name} kind="Zone" />
      <PageHeader
        crumbs={[{ href: "/guide", label: "Guide" }, { label: z.name }]}
        overline={`Zone ${String(z.order).padStart(2, "0")} · ${z.nameEn}`}
        title={z.name}
        subtitle={z.tagline}
        art={z.art}
        seed={z.slug}
        meta={
          <>
            <DlcBadge dlc={z.dlc} />
            <Tag tone={z.kind === "obligatoire" ? "gold" : z.kind === "secrete" ? "ember" : "default"}>
              {z.kind === "obligatoire" ? "Zone obligatoire" : z.kind === "facultative" ? "Zone facultative" : z.kind === "secrete" ? "Zone secrète" : "Zone de DLC"}
            </Tag>
            <Difficulty level={z.difficulty.level} compact />
          </>
        }
        actions={
          <>
            <FavoriteButton href={`/guide/${z.slug}`} title={z.name} kind="Zone" />
            <Link href={`/cartes/${z.slug}`} className="btn btn-sm">
              <MapIcon size={15} /> Carte schématique
            </Link>
          </>
        }
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-16">
          <section id="presentation" className="scroll-mt-24">
            <h2 className="h-section">Présentation et ambiance</h2>
            <div className="prose-archive mt-5">
              {z.ambiance.map((p, i) => (
                <p key={i} className={i === 0 ? "drop-cap" : ""}>
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="panel p-4">
                <p className="eyebrow">Difficulté indicative</p>
                <div className="mt-2">
                  <Difficulty level={z.difficulty.level} />
                </div>
                <p className="mt-2 text-sm text-dim">{z.difficulty.note}</p>
                <p className="mt-2 text-[0.7rem] italic text-ash">Estimation éditoriale : elle dépend de votre niveau, de votre build et de votre expérience.</p>
              </div>
              <div className="panel p-4">
                <p className="eyebrow">Sous-zones</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {z.subAreas.map((s) => (
                    <li key={s}>
                      <Tag>{s}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="cheminement" className="scroll-mt-24">
            <h2 className="h-section">Cheminement étape par étape</h2>
            <p className="mt-3 max-w-2xl text-sm text-dim">
              {steps.length} étapes, dans l&apos;ordre d&apos;un parcours type. Cochez-les au fur et à mesure : la progression est enregistrée dans ce navigateur. Les noms d&apos;objets sont donnés dans leur version anglaise officielle.
            </p>
            <div className="mt-6">
              <StepList steps={stepRows} />
            </div>
          </section>

          <section id="acces" className="scroll-mt-24">
            <h2 className="h-section">Entrées et sorties</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {z.connections.map((c) => {
                const t = zoneBySlug.get(c.zone);
                return (
                  <li key={c.zone + c.via} className="panel p-4">
                    <p className="eyebrow text-[0.6rem]">{{ principal: "Passage principal", facultatif: "Passage facultatif", secret: "Accès secret", raccourci: "Raccourci" }[c.kind]}</p>
                    <Link href={`/guide/${c.zone}`} className="mt-1 block font-display text-xl text-parch hover:text-gold-hi">
                      {t?.name ?? c.zone}
                    </Link>
                    <p className="text-sm text-dim">{c.via}</p>
                    {c.condition && <p className="mt-1 text-sm text-gold">Condition : {c.condition}</p>}
                  </li>
                );
              })}
            </ul>
          </section>

          <section id="feux" className="scroll-mt-24">
            <h2 className="h-section">Feux de camp</h2>
            <p className="mt-2 text-sm text-dim">Noms anglais officiels des feux. Cochez ceux que vous avez allumés.</p>
            <ul className="mt-4 grid gap-1 sm:grid-cols-2">
              {z.bonfires.map((b) => (
                <li key={b} className="panel px-3">
                  <CheckItem id={`feu:${z.slug}:${b}`} compact>
                    <span className="inline-flex items-center gap-2">
                      <Flame size={14} className="text-ember-hi" aria-hidden /> {b}
                    </span>
                  </CheckItem>
                </li>
              ))}
            </ul>
          </section>

          <section id="boss" className="scroll-mt-24">
            <h2 className="h-section">Boss rencontrés</h2>
            {zoneBosses.length === 0 ? (
              <p className="mt-3 text-dim">Aucun boss dans cette zone.</p>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {zoneBosses.map((b) => (
                  <article key={b.slug} className="panel grid grid-cols-[110px_1fr] overflow-hidden">
                    <Engraving spec={b.art} seed={b.slug} variant="sigil" className="h-full w-full" caption={false} title={b.name} />
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <Tag tone={b.required ? "gold" : "default"}>{b.required ? "Obligatoire" : "Facultatif"}</Tag>
                        {b.lordOfCinder && <Tag tone="ember">Seigneur des cendres</Tag>}
                      </div>
                      <Link href={`/boss/${b.slug}`} className="mt-2 block font-display text-xl text-parch hover:text-gold-hi">
                        {b.name}
                      </Link>
                      <p className="mt-1 line-clamp-2 text-sm text-dim">{b.summary}</p>
                      <div className="mt-3">
                        <CheckToggle id={`boss:${b.slug}`} label="Marquer vaincu" doneLabel="Vaincu" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section id="ennemis" className="scroll-mt-24">
            <h2 className="h-section">Ennemis importants</h2>
            <dl className="mt-5 divide-y divide-line/10 border-y border-line/15">
              {z.enemies.length === 0 && <p className="py-3 text-dim">Aucun ennemi hors boss.</p>}
              {z.enemies.map((e) => (
                <div key={e.name} className="grid gap-1 py-3 sm:grid-cols-[220px_1fr]">
                  <dt className="font-medium text-parch">{e.name}</dt>
                  <dd className="text-sm text-dim">{e.note}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="objets" className="scroll-mt-24">
            <h2 className="h-section">Objets, armes et armures</h2>
            <p className="mt-2 text-sm text-dim">Tous les éléments cités dans le cheminement de cette zone, avec un lien vers leur fiche.</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {ITEM_GROUPS.map((g) => {
                const list = mentioned.filter(g.match).sort((a, b) => a.name.localeCompare(b.name));
                if (!list.length) return null;
                return (
                  <div key={g.title}>
                    <p className="eyebrow mb-2">
                      {g.title} <span className="text-ash">({list.length})</span>
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {list.map((e) => (
                        <li key={e.key}>
                          {e.href ? (
                            <Link href={e.href} className="chip !min-h-[32px] text-[0.8rem]">
                              {e.name}
                            </Link>
                          ) : (
                            <span className="chip !min-h-[32px] text-[0.8rem]">{e.name}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          <section id="pnj" className="scroll-mt-24">
            <h2 className="h-section">PNJ et interactions</h2>
            {zoneNpcs.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {zoneNpcs.map((n) => (
                  <li key={n!.slug}>
                    <Link href={`/pnj/${n!.slug}`} className="chip">
                      {n!.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {npcSteps.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {npcSteps.map((s) => (
                  <li key={s.id} className="border-l-2 border-frost/40 pl-4 text-[0.95rem] leading-relaxed">
                    <Rich segs={s.fr} />{" "}
                    <a href={`#${s.id}`} className="text-xs text-ash hover:text-text">
                      (étape)
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-dim">Aucune interaction de quête signalée dans le parcours de cette zone.</p>
            )}
          </section>

          <section id="raccourcis" className="scroll-mt-24">
            <h2 className="h-section">Raccourcis</h2>
            <ul className="mt-5 space-y-3">
              {z.shortcuts.map((s) => (
                <li key={s} className="flex gap-3">
                  <KeyRound size={16} className="mt-1 shrink-0 text-moss" aria-hidden /> {s}
                </li>
              ))}
              {shortcutSteps.map((s) => (
                <li key={s.id} className="flex gap-3 text-[0.95rem] text-dim">
                  <KeyRound size={16} className="mt-1 shrink-0 text-moss/60" aria-hidden />
                  <span>
                    <Rich segs={s.fr} />
                  </span>
                </li>
              ))}
              {z.shortcuts.length + shortcutSteps.length === 0 && <li className="text-dim">Aucun raccourci notable.</li>}
            </ul>
          </section>

          <section id="secrets" className="scroll-mt-24">
            <h2 className="h-section">Secrets et passages dissimulés</h2>
            <ul className="mt-5 space-y-3">
              {z.secrets.map((s) => (
                <li key={s} className="flex gap-3">
                  <EyeOff size={16} className="mt-1 shrink-0 text-gold" aria-hidden /> {s}
                </li>
              ))}
              {secretSteps.map((s) => (
                <li key={s.id} className="flex gap-3 text-[0.95rem] text-dim">
                  <EyeOff size={16} className="mt-1 shrink-0 text-gold/60" aria-hidden />
                  <span>
                    <Rich segs={s.fr} />
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section id="pieges" className="scroll-mt-24">
            <h2 className="h-section">Mimics, pièges et invasions</h2>
            <ul className="mt-5 space-y-3">
              {z.hazards.map((s) => (
                <li key={s} className="flex gap-3">
                  <Bomb size={16} className="mt-1 shrink-0 text-ember-hi" aria-hidden /> {s}
                </li>
              ))}
              {trapSteps.map((s) => (
                <li key={s.id} className="flex gap-3 text-[0.95rem] text-dim">
                  <Bomb size={16} className="mt-1 shrink-0 text-ember-hi/60" aria-hidden />
                  <span>
                    <Rich segs={s.fr} />
                  </span>
                </li>
              ))}
              {z.hazards.length + trapSteps.length === 0 && <li className="text-dim">Aucun piège notable signalé.</li>}
            </ul>
          </section>

          <section id="quetes" className="scroll-mt-24">
            <h2 className="h-section">Quêtes pouvant être affectées</h2>
            {z.questsAffected.length === 0 ? (
              <p className="mt-3 text-dim">Aucune quête n&apos;est directement affectée dans cette zone.</p>
            ) : (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {z.questsAffected.map((q) => {
                  const n = npcBySlug.get(q);
                  if (!n) return null;
                  return (
                    <li key={q}>
                      <Link href={`/pnj/${q}#quete`} className="panel card-link block p-4">
                        <span className="font-display text-lg text-parch">{n.name}</span>
                        <span className="block text-sm text-dim">{n.quest?.title ?? n.role}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section id="manquables" className="scroll-mt-24">
            <h2 className="h-section">Événements manquables</h2>
            <div className="mt-5 space-y-3">
              {z.missables.map((m) => (
                <p key={m} className="flex gap-3 border-l-2 border-ember-hi/60 bg-ember/5 px-4 py-3">
                  <AlertTriangle size={16} className="mt-1 shrink-0 text-ember-hi" aria-hidden /> {m}
                </p>
              ))}
              {missSteps.length > 0 && (
                <details className="panel p-4">
                  <summary className="cursor-pointer text-sm text-gold-hi">{missSteps.length} étapes du parcours signalées « manquables »</summary>
                  <ul className="mt-3 space-y-2 text-[0.92rem] text-dim">
                    {missSteps.map((s) => (
                      <li key={s.id}>
                        <a href={`#${s.id}`} className="text-ash hover:text-text">
                          ↳
                        </a>{" "}
                        <Rich segs={s.fr} />
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              {z.missables.length + missSteps.length === 0 && <p className="text-dim">Rien de manquable signalé dans cette zone.</p>}
            </div>
          </section>

          <section id="conseils" className="scroll-mt-24">
            <h2 className="h-section">Conseils de combat</h2>
            <ul className="mt-5 space-y-3">
              {z.tips.map((t) => (
                <li key={t} className="flex gap-3">
                  <Lightbulb size={16} className="mt-1 shrink-0 text-gold" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </section>

          {lore.length > 0 && (
            <section className="panel p-5">
              <p className="eyebrow">Pour aller plus loin</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {lore.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/lore/${a.slug}`} className="chip">
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav className="grid gap-3 border-t border-line/15 pt-8 sm:grid-cols-2" aria-label="Zones précédente et suivante">
            {prev ? (
              <Link href={`/guide/${prev.slug}`} className="panel card-link group p-4">
                <span className="flex items-center gap-1 text-xs text-ash">
                  <ArrowLeft size={12} /> Zone précédente
                </span>
                <span className="mt-1 block font-display text-xl text-parch group-hover:text-gold-hi">{prev.name}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/guide/${next.slug}`} className="panel card-link group p-4 text-right">
                <span className="flex items-center justify-end gap-1 text-xs text-ash">
                  Zone suivante <ArrowRight size={12} />
                </span>
                <span className="mt-1 block font-display text-xl text-parch group-hover:text-gold-hi">{next.name}</span>
              </Link>
            )}
          </nav>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
          <ChecklistProgress ids={zoneChecklistIds} label="Checklist de la zone" />
          <div className="panel px-4 py-2">
            <CheckItem id={`zone:${z.slug}`}>Zone entièrement explorée</CheckItem>
          </div>
          <div className="hidden lg:block">
            <Toc items={toc} />
          </div>
          <div className="panel p-4 text-sm">
            <p className="eyebrow mb-2">En bref</p>
            <dl className="space-y-2">
              <div className="flex justify-between gap-2">
                <dt className="text-dim">Feux</dt>
                <dd className="font-mono">{z.bonfires.length}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-dim">Boss</dt>
                <dd className="font-mono">{z.bosses.length}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-dim">Étapes</dt>
                <dd className="font-mono">{steps.length}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-dim">Manquables</dt>
                <dd className="font-mono text-ember-hi">{missSteps.length}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-dim">Éléments cités</dt>
                <dd className="font-mono">{mentioned.filter((e) => e.kind !== "boss" && e.kind !== "pnj" && e.kind !== "zone" && e.kind !== "ennemi").length}</dd>
              </div>
            </dl>
          </div>
          <p className="text-[0.7rem] leading-relaxed text-ash">
            Cheminement adapté de la{" "}
            <a href={catalog.source.url} className="underline" rel="noopener noreferrer" target="_blank">
              Dark Souls 3 Cheat Sheet
            </a>{" "}
            (licence {catalog.source.license}).
          </p>
        </aside>
      </div>
    </>
  );
}

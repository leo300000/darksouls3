import Link from "next/link";
import { ArrowRight, BookOpen, Flame } from "lucide-react";
import { HeroScene } from "@/components/art/HeroScene";
import { Embers } from "@/components/art/Embers";
import { Engraving } from "@/components/art/Engraving";
import { endingEmblems } from "@/data/emblems";
import { BossPortrait } from "@/components/art/BossPortrait";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { Ornament, SectionTitle } from "@/components/ui/Ornament";
import { DlcBadge } from "@/components/ui/Badges";
import { ContinueJourney, RecentlyViewed } from "@/components/home/ContinueJourney";
import { catalog, entitiesOf, zones, bosses, npcs, endings, loreArticles } from "@/lib/data";
import { bossBySlug } from "@/data/bosses";
import { zoneBySlug } from "@/data/zones";
import type { ArtSpec } from "@/data/types";
import { slugify } from "@/lib/text";

export default function HomePage() {
  const weapons = entitiesOf("arme").length + entitiesOf("bouclier").length;
  const illusory = catalog.steps.filter((s) => /illusory|illusionary/i.test(s.en.map((x) => x.t ?? "").join(""))).length;
  const missables = catalog.steps.filter((s) => s.tags.includes("miss")).length;

  const archives: { href: string; title: string; text: string; count: string; art: ArtSpec }[] = [
    { href: "/guide", title: "Guide de l'aventure", text: "Le voyage complet, zone par zone, avec checklists et embranchements.", count: `${zones.length} zones · ${catalog.steps.length} étapes`, art: { palette: "ash", motif: "cemetery" } },
    { href: "/boss", title: "Boss", text: "Stratégies, phases, récompenses et lore des seigneurs déchus.", count: `${bosses.length} boss`, art: { palette: "blood", motif: "cathedral" } },
    { href: "/pnj", title: "Personnages", text: "Quêtes conditionnelles, choix irréversibles et destins croisés.", count: `${npcs.length} personnages`, art: { palette: "ember", motif: "shrine" } },
    { href: "/lore", title: "Lore", text: "Seigneurs des cendres, Abysses, lignée de Gwyn, mondes peints.", count: `${loreArticles.length} articles`, art: { palette: "abyss", motif: "city" } },
    { href: "/armes", title: "Armes et équipements", text: "Catalogue filtrable, comparateur et localisations sourcées.", count: `${weapons} armes et boucliers`, art: { palette: "gold", motif: "castle" } },
    { href: "/objets", title: "Objets et consommables", text: "Clés, matériaux, cendres et objets de quête : où les trouver.", count: `${entitiesOf("objet").length} objets`, art: { palette: "moss", motif: "village" } },
    { href: "/sorts", title: "Sorts", text: "Sorcelleries, pyromancies et miracles, avec marchands et prérequis.", count: `${entitiesOf("sort").length} sorts`, art: { palette: "frost", motif: "archive" } },
    { href: "/cartes", title: "Cartes", text: "Cartes schématiques interactives reliées à la base de données.", count: `${zones.length} schémas`, art: { palette: "storm", motif: "peak" } },
    { href: "/fins", title: "Fins du jeu", text: "Conditions exactes, points de non-retour et parcours guidés.", count: "3 fins + 1 variante", art: { palette: "ember", motif: "kiln" } },
    { href: "/completion", title: "Succès et complétion", text: "Profils, NG+, éléments manquables, import/export.", count: "15 catégories suivies", art: { palette: "gold", motif: "shrine" } },
  ];

  const iconic = ["veilleurs-des-abysses", "pontife-sulyvahn", "roi-sans-nom", "lorian-et-lothric", "midir", "slave-knight-gael"].map((s) => bossBySlug.get(s)!);
  const featuredZones = ["irithyll-de-la-vallee-boreale", "cathedrale-des-profondeurs", "lac-ardent", "pic-de-l-archidragon", "grandes-archives"].map((s) => zoneBySlug.get(s)!);
  const mysterious = ["yuria", "karla", "patches", "rosaria"].map((s) => npcs.find((n) => n.slug === s)!);
  const legendary = bosses
    .filter((b) => b.transpositions.length)
    .flatMap((b) => b.transpositions.slice(0, 1).map((t) => ({ t, b })))
    .filter(({ t }) => catalog.entities[`arme:${slugify(t)}`])
    .slice(0, 8);

  const facts = [
    { text: "Ludleth de Courland est le seul Seigneur des cendres revenu de lui-même s'asseoir sur son trône.", href: "/pnj/ludleth" },
    { text: "La Storm Ruler, posée près du trône de Yhorm, est l'arme pensée pour abattre le géant.", href: "/boss/yhorm" },
    { text: "Les Tombes oubliées sont un double sombre du Cimetière des Cendres, caché derrière un mur illusoire après Oceiros.", href: "/guide/tombes-oubliees" },
    { text: "Au Château de Lothric, tuer le premier lézard de cristal puis mourir fait disparaître définitivement le second.", href: "/guide/chateau-de-lothric" },
    { text: "Le Hawk Ring apparaît là où se tenait le Géant de la Colonie si vous ramassez tous les objets des trois Bouleaux blancs.", href: "/anneaux/hawk-ring" },
    { text: "Les sorts et anneaux des DLC ne sont pas requis pour les succès de collection « Master of… ».", href: "/completion" },
  ];

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute inset-0 -z-10">
          <HeroScene className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-void/95 via-void/70 to-void/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/30" />
        </div>
        <Embers count={34} seed="home-hero" />
        <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-6xl flex-col justify-center px-4 py-20 sm:px-8 lg:min-h-svh">
          <div className="anim-page max-w-2xl">
            <p className="eyebrow mb-5">Encyclopédie non officielle · Dark Souls III &amp; DLC</p>
            <h1 id="hero-title" className="title-monument text-[clamp(3.2rem,1.8rem+7vw,8.2rem)]">
              The Ashen
              <br />
              Archive
            </h1>
            <p className="mt-5 font-display text-[clamp(1.4rem,1rem+1.5vw,2.1rem)] italic text-gold-hi">Toutes les cendres ont une histoire.</p>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-text/90">
              Des archives retrouvées dans les ruines de Lothric : un guide intégral du voyage, chaque boss, chaque quête, chaque fin — et le moyen de suivre votre route
              jusqu&apos;à la dernière braise.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchTrigger />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/guide/cimetiere-des-cendres" className="btn btn-ember">
                <Flame size={16} /> Commencer le voyage
              </Link>
              <Link href="#archives" className="btn">
                <BookOpen size={16} /> Explorer les archives
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-24 px-4 pb-10 sm:px-8">
        {/* ───────────── Continuer ───────────── */}
        <section aria-labelledby="continuer" className="-mt-10 relative">
          <SectionTitle overline="Reprendre la route" title="Continuer son aventure" id="continuer" />
          <ContinueJourney questTitles={Object.fromEntries(npcs.filter((n) => n.quest).map((n) => [n.slug, n.quest!.title]))} />
        </section>

        {/* ───────────── Grandes archives ───────────── */}
        <section id="archives" aria-labelledby="archives-title" className="scroll-mt-20">
          <SectionTitle overline="Les salles de l'archive" title="Explorer les grandes archives" id="archives-title">
            Dix salles, toutes reliées entre elles. Chaque fiche renvoie vers les zones, boss, objets et personnages qui lui sont liés.
          </SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {archives.map((a, i) => (
              <Link
                key={a.href}
                href={a.href}
                className={`panel card-link group relative flex min-h-[220px] flex-col justify-end overflow-hidden ${i < 2 ? "lg:col-span-3 lg:min-h-[300px]" : i < 5 ? "lg:col-span-2" : "lg:col-span-2"}`}
              >
                <Engraving spec={a.art} seed={a.href} className="absolute inset-0 h-full w-full opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-80" caption={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-transparent" />
                <div className="relative p-5">
                  <span className="font-mono text-[0.7rem] text-gold">{a.count}</span>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-parch">{a.title}</h3>
                  <p className="mt-1 text-sm text-dim">{a.text}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold-hi opacity-0 transition group-hover:opacity-100">
                    Entrer <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ───────────── Boss emblématiques ───────────── */}
        <section aria-labelledby="boss-embl">
          <SectionTitle overline="Bestiaire" title="Boss emblématiques" id="boss-embl" />
          <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
            {iconic.map((b) => (
              <Link key={b.slug} href={`/boss/${b.slug}`} className="panel card-link group w-[62vw] shrink-0 snap-start overflow-hidden sm:w-auto">
                <div className="relative overflow-hidden">
                  <BossPortrait slug={b.slug} name={b.name} art={b.art} size="thumb" imgClassName="transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
                  <div className="absolute bottom-0 p-3">
                    <DlcBadge dlc={b.dlc} hideBase />
                    <p className="mt-1 font-display text-lg leading-tight text-parch">{b.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ───────────── Zones à explorer ───────────── */}
        <section aria-labelledby="zones-explore">
          <SectionTitle overline="Cartographie" title="Zones à explorer" id="zones-explore" />
          <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
            {featuredZones.map((z, i) => (
              <Link key={z.slug} href={`/guide/${z.slug}`} className={`panel card-link group relative flex min-h-[200px] flex-col justify-end overflow-hidden ${i === 0 ? "md:col-span-2 md:row-span-2 md:min-h-[440px]" : ""}`}>
                <Engraving spec={z.art} seed={z.slug} className="absolute inset-0 h-full w-full opacity-75 transition duration-700 group-hover:scale-105" caption={i === 0} title={z.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
                <div className="relative p-5">
                  <p className="font-engrave text-[0.6rem] text-gold">{z.nameEn}</p>
                  <h3 className={`font-display font-semibold text-parch ${i === 0 ? "text-4xl" : "text-2xl"}`}>{z.name}</h3>
                  <p className="mt-1 max-w-md text-sm text-dim">{z.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ───────────── Personnages ───────────── */}
        <section aria-labelledby="pnj-mys">
          <SectionTitle overline="Destins" title="Personnages mystérieux" id="pnj-mys" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mysterious.map((n) => (
              <Link key={n.slug} href={`/pnj/${n.slug}`} className="panel card-link group flex gap-4 p-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-line/20">
                  <Engraving spec={n.art} seed={n.slug} variant="sigil" className="h-full w-full" caption={false} />
                </div>
                <div>
                  <p className="font-display text-xl text-parch">{n.name}</p>
                  <p className="text-xs text-gold">{n.role}</p>
                  <p className="mt-2 line-clamp-3 text-sm text-dim">{n.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ───────────── Armes légendaires ───────────── */}
        <section aria-labelledby="armes-leg" className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionTitle overline="Transpositions" title="Armes légendaires" id="armes-leg">
              Les âmes des boss, confiées à Ludleth de Courland avec le Transposing Kiln, deviennent armes, sorts ou anneaux uniques.
            </SectionTitle>
            <Link href="/armes?methode=Transposition" className="btn btn-sm">
              Toutes les armes de boss <ArrowRight size={14} />
            </Link>
          </div>
          <ul className="divide-y divide-line/10 border-y border-line/15">
            {legendary.map(({ t, b }) => (
              <li key={t}>
                <Link href={`/armes/${slugify(t)}`} className="group flex items-center justify-between gap-4 py-3 transition hover:bg-stone/15">
                  <span className="font-display text-xl text-parch group-hover:text-gold-hi">{t}</span>
                  <span className="text-right text-xs text-dim">
                    Âme de <span className="text-text">{b.name}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ───────────── Derniers articles ───────────── */}
        <section aria-labelledby="recent">
          <SectionTitle overline="Votre carnet" title="Derniers articles consultés" id="recent" />
          <RecentlyViewed />
        </section>

        {/* ───────────── DLC ───────────── */}
        <section aria-labelledby="dlc">
          <SectionTitle overline="Extensions" title="Au-delà du jeu de base" id="dlc">
            Deux extensions, présentées séparément du jeu de base dans toute l&apos;archive.
          </SectionTitle>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { dlc: "ashes-of-ariandel" as const, title: "Ashes of Ariandel", text: "Un monde peint gelé qui pourrit lentement, une sœur qui refuse le feu, et un chevalier esclave qui cherche un pigment.", zone: "monde-peint-d-ariandel", art: { palette: "frost", motif: "snow" } as ArtSpec, access: "Accès : Chapelle de purification (Cathédrale des profondeurs)." },
              { dlc: "ringed-city" as const, title: "The Ringed City", text: "Au bout du monde, la cité des Pygmées, un dragon rongé par l'Abysse et le dernier duel de la trilogie.", zone: "monceau-des-residus", art: { palette: "blood", motif: "dreg" } as ArtSpec, access: "Accès : Fournaise de la Première Flamme ou feu de Sœur Friede." },
            ].map((d) => (
              <article key={d.dlc} className="panel-raised relative overflow-hidden">
                <div className="relative h-56">
                  <Engraving spec={d.art} seed={d.dlc} className="h-full w-full" title={d.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
                </div>
                <div className="p-6">
                  <DlcBadge dlc={d.dlc} />
                  <h3 className="mt-3 font-display text-3xl font-semibold text-parch">{d.title}</h3>
                  <p className="mt-2 text-dim">{d.text}</p>
                  <p className="mt-3 text-sm text-ash">{d.access}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {bosses
                      .filter((b) => b.dlc === d.dlc)
                      .map((b) => (
                        <li key={b.slug}>
                          <Link href={`/boss/${b.slug}`} className="chip">{b.name}</Link>
                        </li>
                      ))}
                  </ul>
                  <Link href={`/guide/${d.zone}`} className="btn btn-sm mt-5">
                    Ouvrir le guide <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ───────────── Le saviez-vous ───────────── */}
        <section aria-labelledby="saviez" className="parchment frame-corners relative border border-line/20 p-6 sm:p-10">
          <SectionTitle overline="Marginalia" title="Le saviez-vous ?" id="saviez" />
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {facts.map((f, i) => (
              <li key={i} className="font-serif text-[1.02rem] leading-relaxed">
                <span className="mr-2 font-display text-3xl text-gold">{["I", "II", "III", "IV", "V", "VI"][i]}.</span>
                {f.text}{" "}
                <Link href={f.href} className="link-archive whitespace-nowrap text-sm">
                  Voir la fiche
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ───────────── Fins et secrets ───────────── */}
        <section aria-labelledby="fins-secrets">
          <SectionTitle overline="Le dernier choix" title="Fins et secrets" id="fins-secrets" />
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="grid gap-4 sm:grid-cols-3">
              {endings
                .filter((e) => !e.isVariant)
                .map((e) => (
                  <Link key={e.slug} href={`/fins/${e.slug}`} className="panel card-link group relative flex min-h-[260px] flex-col justify-end overflow-hidden">
                    <Engraving spec={e.art} seed={e.slug} variant="sigil" emblem={endingEmblems[e.slug]} className="absolute inset-0 h-full w-full opacity-70" caption={false} />
                    <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent" />
                    <div className="relative p-4">
                      <p className="font-engrave text-[0.58rem] text-gold">{e.nameEn}</p>
                      <h3 className="font-display text-2xl text-parch">{e.name}</h3>
                    </div>
                  </Link>
                ))}
            </div>
            <div className="panel p-6">
              <p className="eyebrow">Dans l&apos;ombre du parcours</p>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="font-display text-4xl text-parch">{illusory}</dt>
                  <dd className="text-sm text-dim">étapes impliquant un mur illusoire</dd>
                </div>
                <div>
                  <dt className="font-display text-4xl text-parch">{missables}</dt>
                  <dd className="text-sm text-dim">étapes signalées comme manquables</dd>
                </div>
                <div>
                  <dt className="font-display text-4xl text-parch">{zones.filter((z) => z.kind === "secrete").length}</dt>
                  <dd className="text-sm text-dim">zones secrètes (Lac ardent, Tombes oubliées)</dd>
                </div>
              </dl>
              <Link href="/completion#manquables" className="btn btn-sm mt-5">Suivre les manquables</Link>
            </div>
          </div>
        </section>
        <Ornament />
      </div>
    </>
  );
}

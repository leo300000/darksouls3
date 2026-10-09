import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTitle } from "@/components/ui/Ornament";
import { DlcBadge } from "@/components/ui/Badges";
import { Engraving } from "@/components/art/Engraving";
import { QuestStatusSelect } from "@/components/quest/QuestStatusSelect";
import { npcs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Personnages et PNJ",
  description: "Tous les personnages importants de Dark Souls III et de ses DLC : histoires, localisations successives, quêtes et conséquences.",
};

export default function NpcIndex() {
  const groups = [
    { title: "Personnages à quête", text: "Leurs destins dépendent de vos choix.", list: npcs.filter((n) => n.quest) },
    { title: "Marchands, services et figures du sanctuaire", text: "Sans quête suivie, mais indispensables.", list: npcs.filter((n) => !n.quest && (n.merchant || n.locations.some((l) => l.zone === "sanctuaire-de-lige-feu"))) },
    { title: "Envahisseurs, alliés et chefs de serment", text: "Rencontres ponctuelles, invasions et serments.", list: npcs.filter((n) => !n.quest && !n.merchant && !n.locations.some((l) => l.zone === "sanctuaire-de-lige-feu")) },
  ];
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Personnages" }]}
        overline="Âmes & destins"
        title="Personnages"
        lede={<>{npcs.length} personnages : leurs histoires, leurs déplacements et les conséquences de chacun de vos choix. Suivez l&apos;état de chaque quête directement depuis cette page.</>}
        art={{ palette: "ember", motif: "shrine" }}
        seed="pnj"
        actions={<Link href="/quetes" className="btn btn-sm">Tableau des quêtes et dépendances</Link>}
      />
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-8">
        {groups.map((g) => (
          <section key={g.title}>
            <SectionTitle overline={`${g.list.length} personnages`} title={g.title}>{g.text}</SectionTitle>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.list.map((n) => (
                <li key={n.slug} className="panel card-link relative flex min-w-0 gap-4 p-4">
                  <div className="h-28 w-20 shrink-0 overflow-hidden border border-line/20">
                    <Engraving spec={n.art} seed={n.slug} variant="sigil" className="h-full w-full" caption={false} title={n.name} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <DlcBadge dlc={n.dlc} hideBase />
                    <Link href={`/pnj/${n.slug}`} className="block font-display text-xl leading-tight text-parch after:absolute after:inset-0 hover:text-gold-hi">
                      {n.name}
                    </Link>
                    <p className="text-xs text-gold">{n.role}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-dim">{n.summary}</p>
                    {n.quest && (
                      <div className="relative z-10 mt-2">
                        <QuestStatusSelect npc={n.slug} compact />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

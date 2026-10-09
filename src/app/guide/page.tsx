import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTitle } from "@/components/ui/Ornament";
import { DlcBadge } from "@/components/ui/Badges";
import { Illustration } from "@/components/art/Illustration";
import { ZoneGraph, type GraphEdge } from "@/components/guide/ZoneGraph";
import { ZoneProgressMini } from "@/components/guide/ZoneProgressMini";
import { zones, bosses, stepsForZone } from "@/lib/data";
import { Difficulty } from "@/components/guide/Difficulty";

export const metadata: Metadata = {
  title: "Guide intégral de l'aventure",
  description: "Le voyage complet de Dark Souls III et de ses DLC, zone par zone : cheminement, feux, boss, objets, secrets, éléments manquables et checklists.",
};

const GROUPS = [
  { kind: "obligatoire", title: "Parcours principal", text: "Les zones nécessaires pour atteindre la fin. L'ordre proposé est indicatif : plusieurs étapes peuvent être inversées (par exemple Yhorm et Aldrich)." },
  { kind: "facultative", title: "Zones facultatives", text: "Contenus optionnels de fin de jeu, accessibles par des embranchements." },
  { kind: "secrete", title: "Zones secrètes", text: "Accessibles par des passages dissimulés." },
  { kind: "dlc", title: "Extensions (DLC)", text: "Ashes of Ariandel et The Ringed City, présentés séparément du jeu de base." },
] as const;

export default function GuidePage() {
  const edgeMap = new Map<string, GraphEdge>();
  for (const z of zones)
    for (const c of z.connections) {
      const key = [z.slug, c.zone].sort().join("|");
      if (!edgeMap.has(key)) edgeMap.set(key, { from: z.slug, to: c.zone, kind: c.kind, via: c.via, condition: c.condition });
    }
  const sorted = [...zones].sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Guide de l'aventure" }]}
        overline="Le voyage"
        title="Guide intégral de l'aventure"
        lede={
          <>
            De l&apos;éveil au Cimetière des Cendres jusqu&apos;à la Fournaise de la Première Flamme, puis au bout du monde dans les DLC.{" "}
            <strong className="text-parch">{zones.length} zones</strong> et <strong className="text-parch">{sorted.reduce((n, z) => n + stepsForZone(z.slug).length, 0)} étapes</strong> détaillées, chacune avec sa checklist sauvegardée dans votre navigateur.
          </>
        }
        art={{ palette: "ash", motif: "cemetery" }}
        seed="guide"
      />
      <div className="mx-auto max-w-6xl space-y-20 px-4 py-14 sm:px-8">
        <section aria-labelledby="graphe">
          <SectionTitle overline="Cartographie des routes" title="Graphe de progression" id="graphe">
            Survolez ou sélectionnez une zone pour voir ses connexions et conditions d&apos;accès ; cliquez pour ouvrir son guide. Le graphe est schématique : il ne représente pas la géographie réelle.
          </SectionTitle>
          <ZoneGraph
            zones={zones.map((z) => ({ slug: z.slug, name: z.name, kind: z.kind, bosses: z.bosses }))}
            edges={[...edgeMap.values()]}
            bossNames={Object.fromEntries(bosses.map((b) => [b.slug, b.name]))}
          />
        </section>

        {GROUPS.map((g) => {
          const list = sorted.filter((z) => z.kind === g.kind);
          return (
            <section key={g.kind} aria-labelledby={`grp-${g.kind}`}>
              <SectionTitle overline={`${list.length} zones`} title={g.title} id={`grp-${g.kind}`}>
                {g.text}
              </SectionTitle>
              <ol className="grid gap-4 md:grid-cols-2">
                {list.map((z) => {
                  const ids = stepsForZone(z.slug).map((s) => `step:${s.id}`);
                  return (
                    <li key={z.slug}>
                      <Link href={`/guide/${z.slug}`} className="panel card-link group grid grid-cols-[110px_1fr] overflow-hidden sm:grid-cols-[150px_1fr]">
                        <div className="relative">
                          <Illustration imageKey={`zone:${z.slug}`} spec={z.art} seed={z.slug} className="h-full w-full" caption={false} title={z.name} />
                          <span className="absolute left-2 top-2 font-display text-3xl text-parch/90 drop-shadow">{String(z.order).padStart(2, "0")}</span>
                        </div>
                        <div className="p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <DlcBadge dlc={z.dlc} hideBase />
                            <Difficulty level={z.difficulty.level} compact />
                          </div>
                          <h3 className="mt-1 font-display text-2xl text-parch group-hover:text-gold-hi">{z.name}</h3>
                          <p className="text-xs text-ash">{z.nameEn}</p>
                          <p className="mt-2 line-clamp-2 text-sm text-dim">{z.tagline}</p>
                          <ZoneProgressMini ids={ids} />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </>
  );
}

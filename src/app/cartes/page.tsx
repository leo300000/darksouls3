import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DlcBadge } from "@/components/ui/Badges";
import { Engraving } from "@/components/art/Engraving";
import { zones, stepsForZone } from "@/lib/data";
import { markerKind } from "@/lib/maps";

export const metadata: Metadata = { title: "Cartes", description: "Cartes schématiques interactives des 22 zones de Dark Souls III et de ses DLC, reliées à la base de données." };

export default function MapsIndex() {
  const sorted = [...zones].sort((a, b) => a.order - b.order);
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Cartes" }]}
        overline="Cartographie"
        title="Cartes"
        lede="Aucune carte officielle n'est intégrée (droits non vérifiés). Chaque zone dispose d'une carte schématique interactive : zoom, déplacement, filtres et marqueurs reliés aux étapes du guide."
        art={{ palette: "storm", motif: "peak" }}
        seed="cartes"
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((z) => {
            const steps = stepsForZone(z.slug);
            const kinds = steps.map((s) => markerKind(s, z.slug));
            return (
              <li key={z.slug}>
                <Link href={`/cartes/${z.slug}`} className="panel card-link group block overflow-hidden">
                  <div className="relative h-32">
                    <Engraving spec={z.art} seed={`${z.slug}-map`} className="h-full w-full" caption={false} title={z.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-night to-transparent" />
                  </div>
                  <div className="p-4">
                    <DlcBadge dlc={z.dlc} hideBase />
                    <p className="font-display text-xl text-parch group-hover:text-gold-hi">{z.name}</p>
                    <p className="mt-1 font-mono text-xs text-ash">
                      {steps.length} marqueurs · {kinds.filter((k) => k === "feu").length} feux · {kinds.filter((k) => k === "boss").length} boss · {kinds.filter((k) => k === "secret").length} secrets
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { entitiesOf, checklist, gearInfo } from "@/lib/data";
import { ringEffects } from "@/data/ring-effects";
import { zoneBySlug } from "@/data/zones";

export const metadata: Metadata = { title: "Anneaux", description: "Les 116 anneaux de Dark Souls III et des DLC, variantes NG+ comprises : effets, localisations et exigences du succès Master of Rings." };

export default function RingsPage() {
  const achievement = new Set(checklist("Master_of_Rings").map((e) => e.subject));
  const rings = entitiesOf("anneau");
  const rows = rings.map((e) => {
    const base = e.name.replace(/\+\d$/, "");
    const g = gearInfo(e);
    return {
      key: e.key,
      name: e.name,
      href: e.href,
      dlc: e.dlc,
      facets: {
        categorie: [e.category],
        dlc: [e.dlc],
        succes: [achievement.has(e.key) ? "Requis pour Master of Rings" : "Hors succès"],
        cycle: [/\+1$/.test(e.name) ? "NG+" : /\+2$/.test(e.name) ? "NG++" : /\+3$/.test(e.name) ? "DLC (+3)" : "Première partie"],
        zone: g.zones.map((z) => zoneBySlug.get(z)?.name ?? z),
      },
      cols: { effet: ringEffects[base] ?? "À compléter" },
    };
  });
  return (
    <>
      <PageHeader crumbs={[{ label: "Anneaux" }]} overline="Arsenal" title="Anneaux" lede={<>{rings.length} anneaux et variantes. Les effets sont décrits qualitativement : aucune valeur chiffrée n&apos;est donnée tant qu&apos;elle n&apos;a pas été recoupée.</>} art={{ palette: "gold", motif: "shrine" }} seed="anneaux" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <Suspense fallback={<p className="text-dim">Chargement…</p>}>
          <CatalogBrowser
            rows={rows}
            itemLabel="anneaux"
            facets={[
              { id: "categorie", label: "Type" },
              { id: "cycle", label: "Cycle", order: ["Première partie", "NG+", "NG++", "DLC (+3)"] },
              { id: "succes", label: "Succès" },
              { id: "dlc", label: "Contenu", order: ["base", "ashes-of-ariandel", "ringed-city"] },
              { id: "zone", label: "Lieu" },
            ]}
            columns={[{ id: "effet", label: "Effet (qualitatif)" }]}
          />
        </Suspense>
      </div>
    </>
  );
}

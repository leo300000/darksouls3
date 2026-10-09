import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { BossBrowser } from "@/components/boss/BossBrowser";
import { bosses } from "@/lib/data";
import { zoneBySlug } from "@/data/zones";

export const metadata: Metadata = {
  title: "Encyclopédie des boss",
  description: "Les 25 boss de Dark Souls III, Ashes of Ariandel et The Ringed City : stratégies, phases, récompenses, transpositions et lore.",
};

export default function BossPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Boss" }]}
        overline="Bestiaire"
        title="Encyclopédie des boss"
        lede={
          <>
            Les {bosses.filter((b) => b.dlc === "base").length} boss du jeu de base et les {bosses.filter((b) => b.dlc !== "base").length} boss des DLC. Les points de vie ne sont pas
            renseignés faute de source recoupée ; âmes et faiblesses portent la mention « à vérifier ».
          </>
        }
        art={{ palette: "blood", motif: "cathedral" }}
        seed="boss-index"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <BossBrowser
          bosses={bosses.map((b) => ({
            slug: b.slug,
            name: b.name,
            nameEn: b.nameEn,
            zone: b.zone,
            zoneName: zoneBySlug.get(b.zone)?.name ?? b.zone,
            dlc: b.dlc,
            required: b.required,
            lord: !!b.lordOfCinder,
            order: b.order,
            weaknesses: b.weaknesses?.value ?? [],
            art: b.art,
          }))}
        />
      </div>
    </>
  );
}

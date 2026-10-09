import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { SchematicMap } from "@/components/maps/SchematicMap";
import { Rich, plain } from "@/components/rich/Rich";
import { zones } from "@/lib/data";
import { zoneBySlug } from "@/data/zones";
import { layoutSteps, markerKind } from "@/lib/maps";

export function generateStaticParams() {
  return zones.map((z) => ({ zone: z.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ zone: string }> }): Promise<Metadata> {
  const { zone } = await params;
  const z = zoneBySlug.get(zone);
  return z ? { title: `Carte schématique — ${z.name}`, description: `Carte schématique interactive de ${z.name} : feux, boss, PNJ, objets, secrets et raccourcis.` } : { title: "Carte introuvable" };
}

export default async function MapPage({ params }: { params: Promise<{ zone: string }> }) {
  const { zone } = await params;
  const z = zoneBySlug.get(zone);
  if (!z) notFound();
  const { pts, path } = layoutSteps(z.slug);
  const markers = pts.map((p, i) => ({
    id: p.step.id,
    kind: markerKind(p.step, z.slug),
    x: p.x,
    y: p.y,
    index: i + 1,
    label: plain(p.step.fr).slice(0, 80),
    missable: p.step.tags.includes("miss"),
    content: <Rich segs={p.step.fr} />,
  }));
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/cartes", label: "Cartes" }, { label: z.name }]}
        overline="Carte schématique"
        title={z.name}
        lede="Représentation schématique du parcours, et non carte géographique officielle : chaque marqueur est relié à une étape sourcée du guide."
        compact
        actions={<Link href={`/guide/${z.slug}`} className="btn btn-sm">Ouvrir le guide de la zone</Link>}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <SchematicMap markers={markers} path={path} zoneSlug={z.slug} />
      </div>
    </>
  );
}

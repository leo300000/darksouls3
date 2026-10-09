import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Missing } from "@/components/ui/Badges";
import { ComparePicker } from "@/components/catalog/ComparePicker";
import { entitiesOf, entity, gearInfo } from "@/lib/data";
import { zoneBySlug } from "@/data/zones";
import { categoryNotes } from "@/data/categories";

export const metadata: Metadata = {
  title: "Comparateur d'armes",
  description: "Comparez deux à quatre armes de Dark Souls III côte à côte : obtention, catégorie, exigences, poids, scaling et compétences lorsque les données sont vérifiées.",
};

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const { ids } = await searchParams;
  const slugs = (ids ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
  const items = slugs.map((s) => entity(`arme:${s}`) ?? entity(`bouclier:${s}`)).filter((e): e is NonNullable<typeof e> => !!e);
  const infos = items.map((e) => gearInfo(e));
  const options = [...entitiesOf("arme"), ...entitiesOf("bouclier")].map((e) => ({ slug: e.key.split(":")[1], name: e.name, category: e.category })).sort((a, b) => a.name.localeCompare(b.name));

  const rows: { label: string; render: (i: number) => React.ReactNode }[] = [
    { label: "Catégorie", render: (i) => items[i].category },
    { label: "Contenu", render: (i) => (items[i].dlc === "base" ? "Jeu de base" : items[i].dlc === "ashes-of-ariandel" ? "Ashes of Ariandel" : "The Ringed City") },
    { label: "Obtention", render: (i) => infos[i].acquisitions.join(", ") },
    { label: "Lieux", render: (i) => infos[i].zones.map((z) => zoneBySlug.get(z)?.name).join(", ") || "—" },
    { label: "Arme de boss", render: (i) => (infos[i].transposition ? `Oui — ${infos[i].transposition!.bossName}` : "Non") },
    { label: "Dégâts de base (+0)", render: (i) => (infos[i].stats ? JSON.stringify(infos[i].stats!.stats.damage) : <Missing compact />) },
    { label: "Exigences", render: (i) => (infos[i].stats ? Object.entries(infos[i].stats!.stats.requirements).map(([k, v]) => `${k} ${v}`).join(" · ") : <Missing compact />) },
    { label: "Poids", render: (i) => infos[i].stats?.stats.weight ?? <Missing compact /> },
    { label: "Scaling", render: (i) => (infos[i].stats ? Object.entries(infos[i].stats!.stats.scaling).map(([k, v]) => `${k} ${v}`).join(" · ") : <Missing compact />) },
    { label: "Compétence", render: (i) => infos[i].stats?.stats.skill ?? <Missing compact /> },
    { label: "Amélioration", render: (i) => (infos[i].transposition ? "Twinkling Titanite" : <Missing compact />) },
    { label: "Infusions", render: (i) => (infos[i].infusable === false ? "Non infusable" : <Missing compact />) },
    { label: "Atouts et limites (catégorie)", render: (i) => <span className="text-xs text-dim">{categoryNotes[items[i].category] ?? "—"}</span> },
  ];

  return (
    <>
      <PageHeader crumbs={[{ href: "/armes", label: "Armes & boucliers" }, { label: "Comparateur" }]} overline="Arsenal" title="Comparateur" lede="Sélectionnez de deux à quatre armes. Aucun score de puissance universel n'est calculé : les performances dépendent du build et du contexte." compact />
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-8">
        <ComparePicker options={options} selected={items.map((e) => e.key.split(":")[1])} />
        {items.length < 2 ? (
          <p className="panel p-6 text-dim">
            Ajoutez au moins deux armes ci-dessus, ou cochez-les depuis le <Link className="link-archive" href="/armes">catalogue</Link>.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-archive min-w-[640px]">
              <thead>
                <tr>
                  <th className="w-44">Critère</th>
                  {items.map((e) => <th key={e.key}><Link href={e.href!} className="font-display text-base normal-case tracking-normal text-parch hover:text-gold-hi">{e.name}</Link></th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label}>
                    <td className="text-dim">{r.label}</td>
                    {items.map((e, i) => <td key={e.key}>{r.render(i)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

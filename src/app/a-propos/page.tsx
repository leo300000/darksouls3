import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfidenceBadge, confidenceHelp } from "@/components/ui/Badges";
import { sources } from "@/data/sources";
import { catalog, entitiesOf, bosses } from "@/lib/data";
import { weaponStats } from "@/data/weapon-notes";
import type { Confidence } from "@/data/types";

export const metadata: Metadata = { title: "Sources et fiabilité", description: "D'où viennent les données de The Ashen Archive, comment elles sont qualifiées et ce qui reste à compléter." };

const STATUS = { integre: "Intégrée", connaissance: "Non recoupée", "a-integrer": "À intégrer" };

export default function AboutPage() {
  const weapons = entitiesOf("arme").length + entitiesOf("bouclier").length;
  const missing = [
    { label: "Statistiques d'armes et de boucliers", value: `${Object.keys(weaponStats).length} / ${weapons} renseignées` },
    { label: "Statistiques d'armures (poids, absorptions)", value: `0 / ${entitiesOf("armure").length} renseignées` },
    { label: "Coûts et exigences des sorts", value: `0 / ${entitiesOf("sort").length} renseignés` },
    { label: "Points de vie des boss", value: `${bosses.filter((b) => b.hp).length} / ${bosses.length} renseignés` },
    { label: "Âmes des boss", value: `${bosses.filter((b) => b.souls).length} / ${bosses.length} renseignées (toutes « à vérifier »)` },
    { label: "Pièces d'armure sans ensemble ni localisation", value: `${entitiesOf("armure").filter((e) => !e.href).length} sans fiche dédiée` },
    { label: "Armes absentes du parcours sourcé", value: `${[...entitiesOf("arme"), ...entitiesOf("bouclier")].filter((e) => !catalog.mentions[e.key]).length} (marchands, butins, transpositions)` },
    { label: "Noms français officiels des objets", value: "Non intégrés : noms anglais officiels utilisés" },
  ];
  return (
    <>
      <PageHeader crumbs={[{ label: "Sources et fiabilité" }]} overline="Méthode" title="Sources et fiabilité" lede="Une encyclopédie n'a de valeur que si l'on sait d'où viennent ses informations. Voici exactement ce qui est sourcé, ce qui ne l'est pas, et ce qui manque." compact />
      <div className="prose-archive mx-auto max-w-4xl px-4 py-10 sm:px-8">
        <h2>Niveaux de fiabilité</h2>
        <ul>
          {(["game", "reference", "deduction", "theory", "unverified"] as Confidence[]).map((c) => (
            <li key={c}><ConfidenceBadge level={c} /> — {confidenceHelp(c)}</li>
          ))}
        </ul>

        <h2>Sources</h2>
        {sources.map((s) => (
          <div key={s.id} className="not-prose panel mb-4 p-5">
            <p className="font-display text-xl text-parch">{s.name}</p>
            <p className="text-xs text-gold">{STATUS[s.status]}{s.license ? ` · licence ${s.license}` : ""}</p>
            {s.url && <a className="link-archive text-sm" href={s.url} rel="noopener noreferrer" target="_blank">{s.url}</a>}
            <p className="mt-2 text-sm text-dim">{s.note}</p>
            <ul className="mt-2 list-inside list-disc text-sm">{s.covers.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        ))}

        <h2>Ce qui reste à compléter</h2>
        <table className="table-archive not-prose">
          <tbody>{missing.map((m) => <tr key={m.label}><td>{m.label}</td><td className="text-dim">{m.value}</td></tr>)}</tbody>
        </table>

        <h2 id="completer">Compléter les données</h2>
        <p>Toutes les pages sont générées à partir de fichiers de données typés : il suffit d&apos;ajouter une valeur sourcée pour qu&apos;elle apparaisse partout (fiche, filtres, comparateur, recherche).</p>
        <ul>
          <li>Statistiques d&apos;armes : <code>src/data/weapon-notes.ts</code> (objet <code>weaponStats</code>, par slug, avec niveau de fiabilité et source).</li>
          <li>Boss (PV, âmes, faiblesses) : <code>src/data/bosses.ts</code>.</li>
          <li>Parcours et traductions : <code>src/data/walkthrough/*.json</code>, puis <code>npm run data:build</code>.</li>
          <li>Validation des références croisées : <code>npm run data:validate</code>.</li>
        </ul>

        <h2>Images</h2>
        <p>
          Aucune image officielle (captures, illustrations, icônes) n&apos;a été intégrée : leur provenance et leurs conditions d&apos;utilisation n&apos;ont pas pu être vérifiées. Chaque fiche affiche une
          <strong> gravure générée</strong>, unique et explicitement marquée comme temporaire. Pour la remplacer, renseignez le champ <code>image</code> (source, texte alternatif, crédit, licence) dans les données.
        </p>

        <h2>Langue</h2>
        <p>
          L&apos;interface et les textes sont en français. Les noms d&apos;objets, d&apos;armes et de sorts sont donnés dans leur version anglaise officielle afin de correspondre aux sources ;
          les noms français des zones et des boss sont des noms d&apos;usage.
        </p>
        <h2>Mentions</h2>
        <p>Site de fan non officiel, sans affiliation avec FromSoftware ou Bandai Namco Entertainment. Dark Souls est une marque de ses détenteurs respectifs.</p>
      </div>
    </>
  );
}

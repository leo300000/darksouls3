import "server-only";
import { catalog, entitiesOf, checklist, zones, bosses, npcs, endings, covenants } from "./data";

/**
 * Définition des catégories de complétion et de leurs éléments cochables.
 * Les identifiants sont ceux utilisés par la sauvegarde locale.
 */
export interface CompletionItem {
  id: string;
  label: string;
  href?: string;
  note?: string;
  dlc?: string;
  /** Requis pour un succès (et lequel). */
  achievement?: string;
}

export interface CompletionCategory {
  id: string;
  label: string;
  description: string;
  items: CompletionItem[];
  /** Les quêtes sont suivies par statut plutôt que par case. */
  mode?: "check" | "quest";
}

const dlcLabel = (d: string) => (d === "base" ? undefined : d === "ashes-of-ariandel" ? "Ashes of Ariandel" : "The Ringed City");

export function buildCompletion(): CompletionCategory[] {
  const ach = (section: string) => {
    const set = new Set(checklist(section).map((e) => e.subject).filter(Boolean) as string[]);
    return set;
  };
  const sorcAch = ach("Master_of_Sorceries");
  const pyroAch = ach("Master_of_Pyromancies");
  const miracleAch = ach("Master_of_Miracles");
  const ringAch = ach("Master_of_Rings");

  const gestures = checklist("Master_of_Expression").map((e) => ({
    id: `geste:${e.id}`,
    label: (e.fr.map((s) => s.t ?? s.l).join("").split(" : ")[0] || e.label).replace(/^«\s*|\s*»/g, "").trim(),
    achievement: "Master of Expression",
  }));

  const INFUSION_FR: Record<string, string> = {
    Refined: "Raffinée", Raw: "Brute", Fire: "Feu", Heavy: "Lourde", Sharp: "Tranchante", Poison: "Empoisonnée",
    Crystal: "Cristal", Blessed: "Bénie", Deep: "Profonde", Dark: "Sombre", Blood: "Sang", Hollow: "Creuse",
    Lightning: "Foudre", Simple: "Simple", Chaos: "Chaos",
  };
  const infusions = checklist("Master_of_Infusion").map((e) => {
    const en = (e.fr.map((s) => s.t ?? s.l).join("").split(":")[0] || e.label).trim();
    const gem = e.fr.find((s) => s.k && /gem/.test(s.k ?? ""));
    const coal = e.fr.find((s) => s.k && /coal/.test(s.k ?? ""));
    return {
      id: `infusion:${e.id}`,
      label: `${INFUSION_FR[en] ?? en} (${en})`,
      note: [gem?.l, coal?.l].filter(Boolean).join(" · ") || undefined,
      achievement: "Master of Infusion",
    };
  });

  const steps = catalog.steps;
  const bonfires = zones.flatMap((z) => z.bonfires.map((b) => ({ id: `feu:${z.slug}:${b}`, label: b, note: z.name, dlc: dlcLabel(z.dlc), href: `/guide/${z.slug}` })));

  const gear = (kind: "arme" | "bouclier" | "armure") =>
    entitiesOf(kind)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((e) => ({ id: e.key, label: e.name, href: e.href ?? undefined, note: e.category, dlc: dlcLabel(e.dlc) }));

  return [
    {
      id: "boss",
      label: "Boss vaincus",
      description: "Tous les boss du jeu de base et des deux DLC.",
      items: bosses.map((b) => ({ id: `boss:${b.slug}`, label: b.name, href: `/boss/${b.slug}`, dlc: dlcLabel(b.dlc), achievement: b.achievement ?? undefined, note: b.required ? "Obligatoire" : "Facultatif" })),
    },
    {
      id: "zones",
      label: "Zones explorées",
      description: "Une zone est cochée quand vous la considérez entièrement explorée.",
      items: zones.map((z) => ({ id: `zone:${z.slug}`, label: z.name, href: `/guide/${z.slug}`, dlc: dlcLabel(z.dlc), achievement: z.slug === "tombes-oubliees" ? "Untended Graves" : z.slug === "pic-de-l-archidragon" ? "Archdragon Peak" : undefined })),
    },
    { id: "feux", label: "Feux de camp", description: "Feux allumés, zone par zone.", items: bonfires },
    { id: "armes", label: "Armes", description: "Collection complète (aucun succès associé).", items: gear("arme") },
    { id: "boucliers", label: "Boucliers", description: "Collection complète (aucun succès associé).", items: gear("bouclier") },
    { id: "armures", label: "Pièces d'armure", description: "Collection complète (aucun succès associé).", items: gear("armure") },
    {
      id: "anneaux",
      label: "Anneaux",
      description: "Les anneaux du jeu de base, variantes NG+ et NG++ comprises, sont requis pour « Master of Rings » ; les anneaux des DLC ne le sont pas.",
      items: entitiesOf("anneau")
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((e) => ({ id: e.key, label: e.name, href: e.href ?? undefined, dlc: dlcLabel(e.dlc), achievement: ringAch.has(e.key) ? "Master of Rings" : undefined, note: e.category })),
    },
    {
      id: "sorts",
      label: "Sorts",
      description: "Sorcelleries, pyromancies et miracles. Ceux des DLC ne sont pas requis pour les succès.",
      items: entitiesOf("sort")
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((e) => ({
          id: e.key,
          label: e.name,
          href: e.href ?? undefined,
          note: e.category,
          dlc: dlcLabel(e.dlc),
          achievement: sorcAch.has(e.key) ? "Master of Sorceries" : pyroAch.has(e.key) ? "Master of Pyromancies" : miracleAch.has(e.key) ? "Master of Miracles" : undefined,
        })),
    },
    { id: "gestes", label: "Gestes", description: "Tous les gestes sont requis pour « Master of Expression ».", items: gestures },
    { id: "infusions", label: "Infusions", description: "Infuser une arme avec chaque type est requis pour « Master of Infusion ».", items: infusions },
    {
      id: "serments",
      label: "Serments",
      description: "Découvrir chaque serment du jeu de base débloque un succès ; Spears of the Church (DLC) n'en a pas.",
      items: covenants.map((c) => ({ id: `serment:${c.slug}`, label: c.name, href: `/serments#${c.slug}`, dlc: dlcLabel(c.dlc), achievement: c.dlc === "base" ? `Covenant: ${c.nameEn}` : undefined, note: c.nameEn })),
    },
    {
      id: "quetes",
      label: "Quêtes des PNJ",
      description: "Une quête compte comme accomplie lorsque vous la marquez « terminée ».",
      mode: "quest",
      items: npcs.filter((n) => n.quest).map((n) => ({ id: `quete:${n.slug}`, label: n.quest!.title, note: n.name, href: `/pnj/${n.slug}`, dlc: dlcLabel(n.dlc) })),
    },
    {
      id: "fins",
      label: "Fins obtenues",
      description: "Trois fins débloquent un succès. La variante de la Gardienne est suivie à part, sans succès.",
      items: endings.map((e) => ({ id: `fin:${e.slug}`, label: e.name, href: `/fins/${e.slug}`, achievement: e.achievement ?? undefined, note: e.isVariant ? "Variante" : undefined })),
    },
    {
      id: "succes",
      label: "Succès et trophées",
      description: "Les succès sont à cocher manuellement : l'archive ne lit pas votre sauvegarde de jeu.",
      items: [
        ...["Ending_Achievements", "Boss_Achievements", "Misc_Achievements", "Covenants_Achievements"].flatMap((sec) =>
          checklist(sec)
            .filter((e) => !/No Achievement/i.test(e.fr.map((s) => s.t ?? "").join("")))
            .map((e) => ({ id: `succes:${e.id}`, label: e.label || e.fr.map((s) => s.t ?? s.l).join("").split(":")[0], note: sectionLabel(sec) })),
        ),
        ...["Master of Expression", "Master of Sorceries", "Master of Pyromancies", "Master of Miracles", "Master of Rings", "Master of Infusion"].map((m) => ({
          id: `succes:${m}`,
          label: m,
          note: "Collection",
        })),
      ],
    },
    {
      id: "manquables",
      label: "Éléments manquables",
      description: "Étapes du parcours signalées comme pouvant être manquées (quêtes, invasions, choix).",
      items: steps
        .filter((s) => s.tags.includes("miss"))
        .map((s) => ({
          id: `step:${s.id}`,
          label: s.fr.map((x) => x.t ?? x.l).join("").slice(0, 140) + (s.fr.map((x) => x.t ?? x.l).join("").length > 140 ? "…" : ""),
          href: `/guide/${s.zone}#${s.id}`,
          note: zones.find((z) => z.slug === s.zone)?.name,
        })),
    },
  ];
}

function sectionLabel(sec: string) {
  return { Ending_Achievements: "Fin", Boss_Achievements: "Boss", Misc_Achievements: "Divers", Covenants_Achievements: "Serment" }[sec] ?? sec;
}

/** Version allégée pour le client (identifiants uniquement). */
export function completionManifest() {
  return buildCompletion().map((c) => ({ id: c.id, label: c.label, mode: c.mode ?? "check", ids: c.items.map((i) => i.id) }));
}

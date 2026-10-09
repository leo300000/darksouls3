import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTitle } from "@/components/ui/Ornament";
import { DependencyGraph, QuestBoard, type DepEdge } from "@/components/quest/QuestBoard";
import { npcs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Quêtes des PNJ : suivi et dépendances",
  description: "Tableau de suivi des quêtes de Dark Souls III (en cours, terminées, bloquées, manquées) et graphe des incompatibilités entre quêtes.",
};

export default function QuestsPage() {
  const withQuest = npcs.filter((n) => n.quest);
  const edges: DepEdge[] = withQuest.flatMap((n) => n.quest!.dependencies.map((d) => ({ from: n.slug, to: d.npc, kind: d.kind, note: d.note })));
  const ids = new Set(edges.flatMap((e) => [e.from, e.to]));
  const nodes = npcs.filter((n) => ids.has(n.slug)).map((n) => ({ id: n.slug, label: n.name.replace(/ (de|du|des|d') .+$/, "") }));
  const conflicts = edges.filter((e) => e.kind === "incompatible");
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Quêtes" }]}
        overline="Destins croisés"
        title="Quêtes des personnages"
        lede="L'archive ne peut pas lire votre sauvegarde de jeu : indiquez vous-même l'état de chaque quête. Il est conservé dans votre profil local."
        art={{ palette: "ember", motif: "village" }}
        seed="quetes"
      />
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-8">
        <section>
          <SectionTitle overline={`${withQuest.length} quêtes suivies`} title="Tableau de suivi">
            Classez chaque quête : en cours, en attente d&apos;une condition, terminée, bloquée ou manquée.
          </SectionTitle>
          <QuestBoard quests={withQuest.map((n) => ({ npc: n.slug, name: n.name, title: n.quest!.title, steps: n.quest!.steps.map((s) => `quete:${n.slug}:${s.id}`), dlc: n.dlc }))} />
        </section>
        <section>
          <SectionTitle overline="Choix incompatibles" title="Dépendances entre quêtes">
            Une flèche « requiert » indique qu&apos;une quête a besoin d&apos;une autre ; « incompatible » signale des choix qui s&apos;excluent.
          </SectionTitle>
          <div className="mb-6 space-y-2">
            {conflicts.map((c, i) => (
              <p key={i} className="border-l-2 border-ember-hi bg-ember/10 px-4 py-2 text-sm">
                <strong className="text-parch">{npcs.find((n) => n.slug === c.from)?.name}</strong> ⟷ <strong className="text-parch">{npcs.find((n) => n.slug === c.to)?.name}</strong> : {c.note}
              </p>
            ))}
          </div>
          <DependencyGraph nodes={nodes} edges={edges} />
        </section>
      </div>
    </>
  );
}

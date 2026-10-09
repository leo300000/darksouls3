"use client";

import { activeProfile, setQuestStatus, useHydrated, useStore, type QuestStatus } from "@/lib/store";

export const QUEST_STATUS: { id: QuestStatus; label: string; tone: string }[] = [
  { id: "non-commencee", label: "Non commencée", tone: "text-dim" },
  { id: "en-cours", label: "En cours", tone: "text-gold-hi" },
  { id: "attente", label: "En attente d'une condition", tone: "text-frost" },
  { id: "terminee", label: "Terminée", tone: "text-moss" },
  { id: "bloquee", label: "Bloquée", tone: "text-ember-hi" },
  { id: "manquee", label: "Manquée", tone: "text-ash" },
];

export function useQuestStatus(npc: string): QuestStatus {
  const s = useStore();
  const h = useHydrated();
  return h ? (activeProfile(s).questStatus[npc] ?? "non-commencee") : "non-commencee";
}

export function QuestStatusSelect({ npc, compact = false }: { npc: string; compact?: boolean }) {
  const status = useQuestStatus(npc);
  const tone = QUEST_STATUS.find((q) => q.id === status)?.tone;
  return (
    <label className={`flex items-center gap-2 ${compact ? "text-xs" : "text-sm"}`}>
      {!compact && <span className="text-dim">Statut :</span>}
      <select
        value={status}
        onChange={(e) => setQuestStatus(npc, e.target.value as QuestStatus)}
        className={`input-archive !min-h-[36px] !w-auto !py-1 ${tone}`}
        aria-label="Statut de la quête"
      >
        {QUEST_STATUS.map((q) => (
          <option key={q.id} value={q.id}>{q.label}</option>
        ))}
      </select>
    </label>
  );
}

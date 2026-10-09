"use client";

import Link from "next/link";
import { useState } from "react";
import { activeProfile, useHydrated, useStore, type QuestStatus } from "@/lib/store";
import { QUEST_STATUS, QuestStatusSelect } from "./QuestStatusSelect";

export interface QuestSummary {
  npc: string;
  name: string;
  title: string;
  steps: string[]; // ids des étapes cochables
  dlc: string;
}

export interface DepEdge {
  from: string;
  to: string;
  kind: "requiert" | "incompatible" | "influence";
  note: string;
}

export function QuestBoard({ quests }: { quests: QuestSummary[] }) {
  const store = useStore();
  const hydrated = useHydrated();
  const p = activeProfile(store);
  const status = (n: string): QuestStatus => (hydrated ? (p.questStatus[n] ?? "non-commencee") : "non-commencee");
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {QUEST_STATUS.map((col) => {
        const list = quests.filter((q) => status(q.npc) === col.id);
        return (
          <section key={col.id} className="panel p-4" aria-labelledby={`col-${col.id}`}>
            <h3 id={`col-${col.id}`} className={`flex items-baseline justify-between font-display text-xl ${col.tone}`}>
              {col.label} <span className="font-mono text-sm text-ash">{list.length}</span>
            </h3>
            <ul className="mt-3 space-y-2">
              {list.length === 0 && <li className="text-sm text-ash">—</li>}
              {list.map((q) => {
                const done = hydrated ? q.steps.filter((s) => p.checked[s]).length : 0;
                return (
                  <li key={q.npc} className="border border-line/15 bg-void/40 p-3">
                    <Link href={`/pnj/${q.npc}#quete`} className="font-medium text-parch hover:text-gold-hi">{q.title}</Link>
                    <p className="text-xs text-dim">{q.name} · {done}/{q.steps.length} étapes{q.dlc !== "base" ? " · DLC" : ""}</p>
                    <div className="mt-2"><QuestStatusSelect npc={q.npc} compact /></div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

const KIND = {
  requiert: { color: "rgb(var(--c-gold-hi))", label: "Requiert", dash: "" },
  incompatible: { color: "rgb(var(--c-ember-hi))", label: "Incompatible", dash: "5 4" },
  influence: { color: "rgb(var(--c-frost))", label: "Influence", dash: "2 4" },
};

export function DependencyGraph({ nodes, edges }: { nodes: { id: string; label: string }[]; edges: DepEdge[] }) {
  const [focus, setFocus] = useState<string | null>(null);
  const R = 230;
  const cx = 300;
  const cy = 270;
  const pos = new Map(nodes.map((n, i) => [n.id, [cx + R * Math.cos((2 * Math.PI * i) / nodes.length - Math.PI / 2), cy + R * Math.sin((2 * Math.PI * i) / nodes.length - Math.PI / 2)] as const]));
  const visible = focus ? edges.filter((e) => e.from === focus || e.to === focus) : edges;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="panel overflow-x-auto p-2">
        <svg viewBox="0 0 600 540" className="min-w-[520px]" role="group" aria-label="Graphe des dépendances entre quêtes">
          <defs>
            {Object.entries(KIND).map(([k, v]) => (
              <marker key={k} id={`dep-${k}`} viewBox="0 0 10 10" refX="22" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M0 0 L10 5 L0 10 z" fill={v.color} />
              </marker>
            ))}
          </defs>
          {visible.map((e, i) => {
            const a = pos.get(e.from);
            const b = pos.get(e.to);
            if (!a || !b) return null;
            return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={KIND[e.kind].color} strokeWidth="1.6" strokeDasharray={KIND[e.kind].dash} markerEnd={`url(#dep-${e.kind})`} opacity="0.85" />;
          })}
          {nodes.map((n) => {
            const [x, y] = pos.get(n.id)!;
            const on = focus === n.id;
            return (
              <g key={n.id} transform={`translate(${x} ${y})`} tabIndex={0} role="button" aria-pressed={on} aria-label={n.label} className="cursor-pointer outline-none" onClick={() => setFocus(on ? null : n.id)} onKeyDown={(e) => e.key === "Enter" && setFocus(on ? null : n.id)}>
                <circle r={on ? 16 : 12} fill="rgb(var(--c-night))" stroke={on ? "rgb(var(--c-ember-hi))" : "rgb(var(--c-gold))"} strokeWidth="1.5" />
                <text y={x > cx + 5 ? 4 : 4} x={x > cx ? 20 : -20} textAnchor={x > cx ? "start" : "end"} fontSize="12" fill="rgb(var(--c-text))">{n.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="panel p-5">
        <p className="eyebrow mb-3">{focus ? nodes.find((n) => n.id === focus)?.label : "Toutes les dépendances"}</p>
        <ul className="max-h-[420px] space-y-3 overflow-y-auto text-sm">
          {visible.map((e, i) => (
            <li key={i} className="border-l-2 pl-3" style={{ borderColor: KIND[e.kind].color }}>
              <span className="text-parch">{nodes.find((n) => n.id === e.from)?.label}</span> <span style={{ color: KIND[e.kind].color }}>{KIND[e.kind].label.toLowerCase()}</span>{" "}
              <span className="text-parch">{nodes.find((n) => n.id === e.to)?.label}</span>
              <p className="text-xs text-dim">{e.note}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-line/15 pt-3 text-xs text-dim">
          {Object.values(KIND).map((k) => (
            <p key={k.label} className="flex items-center gap-2"><svg width="26" height="6" aria-hidden><line x1="0" y1="3" x2="26" y2="3" stroke={k.color} strokeWidth="2" strokeDasharray={k.dash} /></svg>{k.label}</p>
          ))}
          <p>Cliquez sur un personnage pour isoler ses dépendances.</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LoreEdge, LoreNode, RelationKind } from "@/data/types";

const KIND_LABEL: Record<RelationKind, string> = {
  allie: "Alliés", ennemi: "Ennemis", famille: "Liens familiaux", affiliation: "Affiliations", objet: "Objets associés", evenement: "Événements",
};
const KIND_COLOR: Record<RelationKind, string> = {
  allie: "rgb(var(--c-moss))", ennemi: "rgb(var(--c-ember-hi))", famille: "rgb(var(--c-gold-hi))", affiliation: "rgb(var(--c-frost))", objet: "rgb(var(--c-ash))", evenement: "rgb(var(--c-parch))",
};
const CONF_DASH = { game: "", deduction: "6 4", theory: "1.5 4" };
const CONF_LABEL = { game: "Fait établi dans le jeu", deduction: "Déduction fortement étayée", theory: "Théorie discutable" };
const GROUP_FILL: Record<LoreNode["group"], string> = {
  dieu: "rgb(var(--c-gold) / 0.35)", seigneur: "rgb(var(--c-ember) / 0.45)", royaute: "rgb(var(--c-gold) / 0.2)", chevalier: "rgb(var(--c-stone) / 0.8)",
  pnj: "rgb(var(--c-night))", entite: "rgb(var(--c-frost) / 0.25)", faction: "rgb(var(--c-moss) / 0.3)", lieu: "rgb(var(--c-night))", objet: "rgb(var(--c-void))", evenement: "rgb(var(--c-ember-hi) / 0.25)",
};

function layout(nodes: LoreNode[], edges: LoreEdge[], W: number, H: number) {
  const idx = new Map(nodes.map((n, i) => [n.id, i]));
  const p = nodes.map((_, i) => {
    const a = (2 * Math.PI * i) / nodes.length;
    return { x: W / 2 + Math.cos(a) * W * 0.35, y: H / 2 + Math.sin(a) * H * 0.35, vx: 0, vy: 0 };
  });
  const links = edges.map((e) => [idx.get(e.from)!, idx.get(e.to)!]).filter(([a, b]) => a !== undefined && b !== undefined);
  for (let it = 0; it < 500; it++) {
    const t = 1 - it / 500;
    for (let i = 0; i < p.length; i++)
      for (let j = i + 1; j < p.length; j++) {
        const dx = p[j].x - p[i].x;
        const dy = p[j].y - p[i].y;
        const d2 = Math.max(dx * dx + dy * dy, 25);
        const f = 5200 / d2;
        const d = Math.sqrt(d2);
        p[i].vx -= (dx / d) * f; p[i].vy -= (dy / d) * f;
        p[j].vx += (dx / d) * f; p[j].vy += (dy / d) * f;
      }
    for (const [a, b] of links) {
      const dx = p[b].x - p[a].x;
      const dy = p[b].y - p[a].y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = (d - 110) * 0.02;
      p[a].vx += (dx / d) * f; p[a].vy += (dy / d) * f;
      p[b].vx -= (dx / d) * f; p[b].vy -= (dy / d) * f;
    }
    for (const q of p) {
      q.vx += (W / 2 - q.x) * 0.004;
      q.vy += (H / 2 - q.y) * 0.004;
      q.x += q.vx * 0.5 * t; q.y += q.vy * 0.5 * t;
      q.vx *= 0.6; q.vy *= 0.6;
      q.x = Math.max(40, Math.min(W - 40, q.x));
      q.y = Math.max(30, Math.min(H - 30, q.y));
    }
  }
  return new Map(nodes.map((n, i) => [n.id, p[i]]));
}

export function LoreGraph({ nodes, edges }: { nodes: LoreNode[]; edges: LoreEdge[] }) {
  const W = 1000;
  const H = 720;
  const pos = useMemo(() => layout(nodes, edges, W, H), [nodes, edges]);
  const [sel, setSel] = useState<string>("gwyn");
  const [conf, setConf] = useState({ game: true, deduction: true, theory: true });
  const shownEdges = edges.filter((e) => conf[e.confidence]);
  const selected = nodes.find((n) => n.id === sel);
  const rel = shownEdges.filter((e) => e.from === sel || e.to === sel);
  const neighbors = new Set(rel.flatMap((e) => [e.from, e.to]));
  const byKind = (Object.keys(KIND_LABEL) as RelationKind[]).map((k) => ({ k, list: rel.filter((e) => e.kind === k) })).filter((x) => x.list.length);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="panel overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[700px]" role="group" aria-label="Graphe des relations entre personnages">
          {shownEdges.map((e, i) => {
            const a = pos.get(e.from);
            const b = pos.get(e.to);
            if (!a || !b) return null;
            const hot = e.from === sel || e.to === sel;
            return (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={KIND_COLOR[e.kind]} strokeWidth={hot ? 2.2 : 1} strokeDasharray={CONF_DASH[e.confidence]} opacity={hot ? 0.95 : 0.22}>
                <title>{`${e.label} (${CONF_LABEL[e.confidence]})`}</title>
              </line>
            );
          })}
          {nodes.map((n) => {
            const q = pos.get(n.id)!;
            const on = n.id === sel;
            const near = neighbors.has(n.id);
            return (
              <g key={n.id} transform={`translate(${q.x} ${q.y})`} tabIndex={0} role="button" aria-pressed={on} aria-label={n.label} className="cursor-pointer outline-none" onClick={() => setSel(n.id)} onKeyDown={(ev) => ev.key === "Enter" && setSel(n.id)}>
                <circle r={on ? 15 : 10} fill={GROUP_FILL[n.group]} stroke={on ? "rgb(var(--c-ember-hi))" : near ? "rgb(var(--c-gold-hi))" : "rgb(var(--c-line) / 0.5)"} strokeWidth={on ? 2.5 : 1.2} />
                <text y={-16} textAnchor="middle" fontSize="12.5" fill={on || near ? "rgb(var(--c-parch))" : "rgb(var(--c-text-dim))"} opacity={sel && !on && !near ? 0.75 : 1} stroke="rgb(var(--c-void))" strokeWidth={3} strokeOpacity={0.85} paintOrder="stroke">{n.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <aside className="panel p-5" aria-live="polite">
        {selected && (
          <>
            <p className="eyebrow">{selected.group}</p>
            <h3 className="mt-1 font-display text-2xl text-parch">{selected.label}</h3>
            {selected.href && <Link href={selected.href} className="link-archive text-sm">Ouvrir la fiche</Link>}
            <div className="mt-4 space-y-4">
              {byKind.length === 0 && <p className="text-sm text-dim">Aucune relation visible avec les filtres actuels.</p>}
              {byKind.map(({ k, list }) => (
                <div key={k}>
                  <p className="text-xs font-semibold" style={{ color: KIND_COLOR[k] }}>{KIND_LABEL[k]}</p>
                  <ul className="mt-1 space-y-1 text-sm">
                    {list.map((e, i) => {
                      const other = nodes.find((n) => n.id === (e.from === sel ? e.to : e.from));
                      return (
                        <li key={i}>
                          <button type="button" className="link-archive" onClick={() => other && setSel(other.id)}>{other?.label}</button>
                          <span className="text-dim"> — {e.label}</span>
                          {e.confidence !== "game" && <span className="ml-1 text-[0.7rem] text-ash">({e.confidence === "deduction" ? "déduction" : "théorie"})</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="mt-6 space-y-2 border-t border-line/15 pt-4 text-xs">
          <p className="eyebrow">Fiabilité</p>
          {(Object.keys(CONF_LABEL) as (keyof typeof CONF_LABEL)[]).map((c) => (
            <label key={c} className="flex items-center gap-2 text-dim">
              <input type="checkbox" checked={conf[c]} onChange={(e) => setConf({ ...conf, [c]: e.target.checked })} className="accent-[rgb(var(--c-gold))]" />
              <svg width="28" height="6" aria-hidden><line x1="0" y1="3" x2="28" y2="3" stroke="rgb(var(--c-parch))" strokeWidth="2" strokeDasharray={CONF_DASH[c]} /></svg>
              {CONF_LABEL[c]}
            </label>
          ))}
          <p className="eyebrow pt-2">Relations</p>
          <div className="grid grid-cols-2 gap-1">
            {(Object.keys(KIND_LABEL) as RelationKind[]).map((k) => (
              <span key={k} className="flex items-center gap-1.5 text-dim"><span className="inline-block h-2 w-3" style={{ background: KIND_COLOR[k] }} />{KIND_LABEL[k]}</span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

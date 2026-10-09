"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface GraphZone {
  slug: string;
  name: string;
  kind: "obligatoire" | "facultative" | "secrete" | "dlc";
  bosses: string[];
}
export interface GraphEdge {
  from: string;
  to: string;
  kind: "principal" | "facultatif" | "secret" | "raccourci";
  via: string;
  condition?: string;
}

/** Positions schématiques (le graphe n'est pas une carte géographique). */
const POS: Record<string, [number, number]> = {
  "cimetiere-des-cendres": [70, 190],
  "sanctuaire-de-lige-feu": [195, 190],
  "haut-mur-de-lothric": [325, 190],
  "colonie-des-morts-vivants": [455, 190],
  "route-des-sacrifices": [585, 190],
  "cathedrale-des-profondeurs": [585, 70],
  "monde-peint-d-ariandel": [745, 70],
  "forteresse-de-farron": [715, 190],
  "catacombes-de-carthus": [845, 190],
  "lac-ardent": [845, 315],
  "irithyll-de-la-vallee-boreale": [985, 190],
  "anor-londo": [1070, 300],
  "donjon-d-irithyll": [960, 380],
  "capitale-profanee": [830, 440],
  "pic-de-l-archidragon": [1065, 470],
  "chateau-de-lothric": [325, 360],
  "jardin-du-roi-consume": [200, 470],
  "tombes-oubliees": [70, 470],
  "grandes-archives": [455, 470],
  "fournaise-de-la-premiere-flamme": [195, 600],
  "monceau-des-residus": [455, 600],
  "cite-annelee": [640, 600],
};

const NODE_STYLE = {
  obligatoire: { stroke: "rgb(var(--c-gold-hi))", fill: "rgb(var(--c-night))", label: "Zone obligatoire" },
  facultative: { stroke: "rgb(var(--c-ash))", fill: "rgb(var(--c-night))", label: "Zone facultative" },
  secrete: { stroke: "rgb(var(--c-ember-hi))", fill: "rgb(var(--c-void))", label: "Zone secrète" },
  dlc: { stroke: "rgb(var(--c-frost))", fill: "rgb(var(--c-night))", label: "Zone de DLC" },
};
const EDGE_STYLE = {
  principal: { dash: "", color: "rgb(var(--c-gold) / 0.7)", label: "Passage principal" },
  facultatif: { dash: "6 5", color: "rgb(var(--c-ash) / 0.8)", label: "Passage facultatif" },
  secret: { dash: "2 5", color: "rgb(var(--c-ember-hi) / 0.85)", label: "Accès secret" },
  raccourci: { dash: "10 4 2 4", color: "rgb(var(--c-moss))", label: "Raccourci" },
};

export function ZoneGraph({ zones, edges, bossNames }: { zones: GraphZone[]; edges: GraphEdge[]; bossNames: Record<string, string> }) {
  const router = useRouter();
  const [focus, setFocus] = useState<string>("cimetiere-des-cendres");
  const byId = useMemo(() => new Map(zones.map((z) => [z.slug, z])), [zones]);
  const current = byId.get(focus);
  const related = edges.filter((e) => e.from === focus || e.to === focus);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="panel overflow-x-auto">
        <svg viewBox="0 0 1140 680" className="min-w-[760px]" role="group" aria-label="Graphe de progression des zones">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="rgb(var(--c-gold) / 0.7)" />
            </marker>
          </defs>
          {edges.map((e, i) => {
            const a = POS[e.from];
            const b = POS[e.to];
            if (!a || !b) return null;
            const s = EDGE_STYLE[e.kind];
            const hot = e.from === focus || e.to === focus;
            return (
              <g key={i}>
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={s.color} strokeWidth={hot ? 2.6 : 1.4} strokeDasharray={s.dash} opacity={hot ? 1 : 0.55} />
                <title>{`${byId.get(e.from)?.name} → ${byId.get(e.to)?.name} : ${e.via}${e.condition ? ` (condition : ${e.condition})` : ""}`}</title>
              </g>
            );
          })}
          {zones.map((z) => {
            const p = POS[z.slug];
            if (!p) return null;
            const s = NODE_STYLE[z.kind];
            const active = z.slug === focus;
            return (
              <g
                key={z.slug}
                transform={`translate(${p[0]} ${p[1]})`}
                tabIndex={0}
                role="link"
                aria-label={`${z.name} — ${s.label}. Entrée pour ouvrir le guide.`}
                className="cursor-pointer outline-none"
                onMouseEnter={() => setFocus(z.slug)}
                onFocus={() => setFocus(z.slug)}
                onClick={() => router.push(`/guide/${z.slug}`)}
                onKeyDown={(ev) => ev.key === "Enter" && router.push(`/guide/${z.slug}`)}
              >
                <circle r={active ? 30 : 24} fill={s.fill} stroke={s.stroke} strokeWidth={active ? 2.4 : 1.4} />
                {z.bosses.length > 0 && <circle r={active ? 36 : 29} fill="none" stroke={s.stroke} strokeOpacity="0.35" strokeDasharray="2 4" />}
                <path d="M0 -7 L7 0 L0 7 L-7 0 Z" fill={active ? "rgb(var(--c-ember-hi))" : s.stroke} opacity={active ? 1 : 0.6} />
                <text y={48} textAnchor="middle" fontSize="13" fill={active ? "rgb(var(--c-parch))" : "rgb(var(--c-text-dim))"} style={{ fontFamily: "var(--font-sans)" }}>
                  {z.name.length > 22 ? z.name.slice(0, 21) + "…" : z.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <aside className="panel p-5" aria-live="polite">
        {current && (
          <>
            <p className="eyebrow">{NODE_STYLE[current.kind].label}</p>
            <h3 className="mt-2 font-display text-2xl text-parch">{current.name}</h3>
            {current.bosses.length > 0 && (
              <p className="mt-2 text-sm text-dim">
                Boss : {current.bosses.map((b) => bossNames[b] ?? b).join(", ")}
              </p>
            )}
            <ul className="mt-4 space-y-3 text-sm">
              {related.map((e, i) => {
                const other = e.from === focus ? e.to : e.from;
                return (
                  <li key={i} className="border-l-2 pl-3" style={{ borderColor: EDGE_STYLE[e.kind].color }}>
                    <Link href={`/guide/${other}`} className="link-archive">
                      {e.from === focus ? "→ " : "← "}
                      {byId.get(other)?.name}
                    </Link>
                    <p className="text-xs text-dim">{e.via}</p>
                    {e.condition && <p className="text-xs text-gold">Condition : {e.condition}</p>}
                  </li>
                );
              })}
            </ul>
            <Link href={`/guide/${current.slug}`} className="btn btn-sm mt-5 w-full">Ouvrir le guide de la zone</Link>
          </>
        )}
        <div className="mt-6 space-y-2 border-t border-line/15 pt-4 text-xs text-dim">
          {Object.values(NODE_STYLE).map((s) => (
            <p key={s.label} className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full border-2" style={{ borderColor: s.stroke }} /> {s.label}
            </p>
          ))}
          {Object.values(EDGE_STYLE).map((s) => (
            <p key={s.label} className="flex items-center gap-2">
              <svg width="28" height="6" aria-hidden>
                <line x1="0" y1="3" x2="28" y2="3" stroke={s.color} strokeWidth="2" strokeDasharray={s.dash} />
              </svg>
              {s.label}
            </p>
          ))}
          <p className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border border-dashed border-gold" /> Zone avec boss
          </p>
        </div>
      </aside>
    </div>
  );
}

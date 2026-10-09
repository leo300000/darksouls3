"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { setPrefs, useStore } from "@/lib/store";

export type MarkerKind = "feu" | "boss" | "pnj" | "secret" | "raccourci" | "sortie" | "objet" | "consommable";

export interface MapMarkerData {
  id: string;
  kind: MarkerKind;
  x: number;
  y: number;
  label: string;
  index: number;
  content: React.ReactNode;
  missable: boolean;
}

export const MARKER_META: Record<MarkerKind, { label: string; color: string; shape: "diamond" | "circle" | "square" | "triangle" }> = {
  feu: { label: "Feux de camp", color: "rgb(var(--c-ember-hi))", shape: "triangle" },
  boss: { label: "Boss", color: "rgb(var(--c-gold-hi))", shape: "diamond" },
  pnj: { label: "PNJ", color: "rgb(var(--c-frost))", shape: "circle" },
  secret: { label: "Secrets", color: "rgb(var(--c-parch))", shape: "diamond" },
  raccourci: { label: "Raccourcis", color: "rgb(var(--c-moss))", shape: "square" },
  sortie: { label: "Sorties et connexions", color: "rgb(var(--c-gold))", shape: "square" },
  objet: { label: "Équipements et objets clés", color: "rgb(var(--c-gold))", shape: "circle" },
  consommable: { label: "Consommables et matériaux", color: "rgb(var(--c-ash))", shape: "circle" },
};

function Shape({ kind, r, active }: { kind: MarkerKind; r: number; active: boolean }) {
  const m = MARKER_META[kind];
  const stroke = active ? "rgb(var(--c-parch))" : "rgb(var(--c-void))";
  const common = { fill: m.color, stroke, strokeWidth: active ? 0.6 : 0.35 };
  if (m.shape === "diamond") return <path d={`M0 ${-r * 1.3} L${r * 1.3} 0 L0 ${r * 1.3} L${-r * 1.3} 0 Z`} {...common} />;
  if (m.shape === "square") return <rect x={-r} y={-r} width={r * 2} height={r * 2} {...common} />;
  if (m.shape === "triangle") return <path d={`M0 ${-r * 1.4} L${r * 1.2} ${r} L${-r * 1.2} ${r} Z`} {...common} />;
  return <circle r={r} {...common} />;
}

const DEFAULT_FILTERS: Record<MarkerKind, boolean> = { feu: true, boss: true, pnj: true, secret: true, raccourci: true, sortie: true, objet: true, consommable: false };

export function SchematicMap({ markers, path, zoneSlug }: { markers: MapMarkerData[]; path: string; zoneSlug: string }) {
  // Filtres mémorisés dans les préférences (communs à toutes les cartes).
  const savedFilters = useStore().prefs.mapFilters;
  const enabled = { ...DEFAULT_FILTERS, ...(savedFilters ?? {}) } as Record<MarkerKind, boolean>;
  const setEnabled = (next: Record<MarkerKind, boolean>) => setPrefs({ mapFilters: next });
  const [view, setView] = useState({ x: 0, y: 0, w: 100, h: 70 });
  const [sel, setSel] = useState<string | null>(null);
  const drag = useRef<{ px: number; py: number; vx: number; vy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const counts = useMemo(() => {
    const c = {} as Record<MarkerKind, number>;
    for (const m of markers) c[m.kind] = (c[m.kind] ?? 0) + 1;
    return c;
  }, [markers]);
  const visible = markers.filter((m) => enabled[m.kind]);
  const selected = markers.find((m) => m.id === sel);

  const zoom = useCallback((factor: number, cx?: number, cy?: number) => {
    setView((v) => {
      const w = Math.min(100, Math.max(14, v.w * factor));
      const h = w * 0.7;
      const ox = cx ?? v.x + v.w / 2;
      const oy = cy ?? v.y + v.h / 2;
      const x = Math.min(100 - w, Math.max(0, ox - ((ox - v.x) * w) / v.w));
      const y = Math.min(70 - h, Math.max(0, oy - ((oy - v.y) * h) / v.h));
      return { x, y, w, h };
    });
  }, [setView]);

  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const v = viewRef.current;
      const rect = el.getBoundingClientRect();
      zoom(e.deltaY > 0 ? 1.15 : 0.87, v.x + ((e.clientX - rect.left) / rect.width) * v.w, v.y + ((e.clientY - rect.top) / rect.height) * v.h);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoom]);

  const pan = useCallback((dx: number, dy: number) => {
    setView((v) => ({ ...v, x: Math.min(100 - v.w, Math.max(0, v.x + dx * v.w)), y: Math.min(70 - v.h, Math.max(0, v.y + dy * v.h)) }));
  }, [setView]);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.target !== svgRef.current) return;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-0.15, 0], ArrowRight: [0.15, 0], ArrowUp: [0, -0.15], ArrowDown: [0, 0.15] };
    if (moves[e.key]) { e.preventDefault(); pan(...moves[e.key]); }
    else if (e.key === "+" || e.key === "=") { e.preventDefault(); zoom(0.75); }
    else if (e.key === "-") { e.preventDefault(); zoom(1.33); }
    else if (e.key === "0") { e.preventDefault(); setView({ x: 0, y: 0, w: 100, h: 70 }); }
  };

  const r = Math.max(0.55, view.w / 70);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Filtres des marqueurs">
          {(Object.keys(MARKER_META) as MarkerKind[]).filter((k) => counts[k]).map((k) => (
            <button key={k} type="button" className="chip !min-h-[34px] text-xs" aria-pressed={enabled[k]} onClick={() => setEnabled({ ...enabled, [k]: !enabled[k] })}>
              <svg width="12" height="12" viewBox="-2 -2 4 4" aria-hidden><Shape kind={k} r={1.2} active={false} /></svg>
              {MARKER_META[k].label} <span className="font-mono text-ash">{counts[k]}</span>
            </button>
          ))}
        </div>
        <div className="panel relative overflow-hidden">
          <svg
            ref={svgRef}
            viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
            className="block aspect-[10/7] w-full touch-none select-none"
            role="application"
            tabIndex={0}
            onKeyDown={onKey}
            aria-label="Carte schématique interactive. Flèches : déplacer ; + et − : zoomer ; 0 : réinitialiser. Tabulation pour parcourir les marqueurs, Entrée pour ouvrir."
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture?.(e.pointerId);
              drag.current = { px: e.clientX, py: e.clientY, vx: view.x, vy: view.y };
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              const rect = svgRef.current!.getBoundingClientRect();
              const dx = ((e.clientX - drag.current.px) / rect.width) * view.w;
              const dy = ((e.clientY - drag.current.py) / rect.height) * view.h;
              setView((v) => ({ ...v, x: Math.min(100 - v.w, Math.max(0, drag.current!.vx - dx)), y: Math.min(70 - v.h, Math.max(0, drag.current!.vy - dy)) }));
            }}
            onPointerUp={() => (drag.current = null)}
            onPointerLeave={() => (drag.current = null)}
          >
            <defs>
              <pattern id="map-grid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M5 0 L0 0 0 5" fill="none" stroke="rgb(var(--c-line) / 0.08)" strokeWidth="0.15" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100" height="70" fill="rgb(var(--c-void))" />
            <rect x="0" y="0" width="100" height="70" fill="url(#map-grid)" />
            <path d={path} fill="none" stroke="rgb(var(--c-gold) / 0.35)" strokeWidth="0.5" strokeDasharray="1 0.8" />
            {visible.map((m) => (
              <g
                key={m.id}
                transform={`translate(${m.x} ${m.y})`}
                className="cursor-pointer"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setSel(m.id)}
                role="button"
                tabIndex={0}
                aria-label={`${MARKER_META[m.kind].label} — étape ${m.index} : ${m.label}`}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(m.id)}
              >
                {m.missable && <circle r={r * 2} fill="none" stroke="rgb(var(--c-ember-hi))" strokeWidth={0.25} strokeDasharray="0.6 0.4" />}
                <Shape kind={m.kind} r={r * (sel === m.id ? 1.5 : 1)} active={sel === m.id} />
              </g>
            ))}
          </svg>
          <div className="absolute right-2 top-2 flex flex-col gap-1">
            <button type="button" className="btn btn-sm h-9 w-9 bg-night/90 p-0" onClick={() => zoom(0.75)} aria-label="Zoomer"><Plus size={16} /></button>
            <button type="button" className="btn btn-sm h-9 w-9 bg-night/90 p-0" onClick={() => zoom(1.33)} aria-label="Dézoomer"><Minus size={16} /></button>
            <button type="button" className="btn btn-sm h-9 w-9 bg-night/90 p-0" onClick={() => setView({ x: 0, y: 0, w: 100, h: 70 })} aria-label="Réinitialiser la vue"><RotateCcw size={14} /></button>
          </div>
          <p className="absolute bottom-2 left-3 text-[0.65rem] text-ash">Schéma du parcours — non géographique · molette/pincement pour zoomer, glisser pour déplacer</p>
        </div>
      </div>
      <aside className="panel p-5 lg:sticky lg:top-6 lg:self-start" aria-live="polite">
        {selected ? (
          <>
            <div className="flex items-start justify-between gap-2">
              <p className="eyebrow" style={{ color: MARKER_META[selected.kind].color }}>{MARKER_META[selected.kind].label}</p>
              <button type="button" onClick={() => setSel(null)} className="text-ash hover:text-text" aria-label="Fermer le panneau"><X size={16} /></button>
            </div>
            <p className="mt-1 font-mono text-xs text-ash">Étape {selected.index}</p>
            <div className="mt-3 text-[0.95rem] leading-relaxed">{selected.content}</div>
            <Link href={`/guide/${zoneSlug}#${selected.id}`} className="btn btn-sm mt-5 w-full">Voir dans le guide</Link>
          </>
        ) : (
          <>
            <p className="eyebrow">Mode d&apos;emploi</p>
            <p className="mt-2 text-sm text-dim">
              Chaque marqueur correspond à une étape du parcours sourcé, placée dans l&apos;ordre de progression le long du tracé. Le cercle rouge pointillé signale une étape manquable.
            </p>
            <p className="mt-3 text-sm text-dim">Les consommables sont masqués par défaut pour la lisibilité.</p>
          </>
        )}
      </aside>
    </div>
  );
}

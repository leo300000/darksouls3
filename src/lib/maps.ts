import "server-only";
import type { CatalogStep } from "@/data/catalog-types";
import type { MarkerKind } from "@/components/maps/SchematicMap";
import { stepsForZone } from "./data";

const GEAR_TAGS = ["ring", "weap", "arm", "estus", "bone", "coal", "tome", "sorc", "pyro", "mirac", "ash", "gest", "cov"];

export function markerKind(step: CatalogStep, zone: string): MarkerKind {
  const txt = step.en.map((s) => s.t ?? "").join("");
  if (step.tags.includes("boss")) return "boss";
  if (/bonfire/i.test(txt) && /(light|rest|activate|find the|to the .* bonfire|reach)/i.test(txt)) return "feu";
  if (step.tags.includes("npc")) return "pnj";
  if (/illusory|illusionary|hidden|secret/i.test(txt)) return "secret";
  if (/shortcut/i.test(txt)) return "raccourci";
  if (step.en.some((s) => s.k?.startsWith("zone:") && s.k !== `zone:${zone}`)) return "sortie";
  if (step.tags.some((t) => GEAR_TAGS.includes(t))) return "objet";
  return "consommable";
}

/** Place les étapes le long d'un tracé sinueux (coordonnées 0–100 × 0–70). */
export function layoutSteps(zone: string) {
  const steps = stepsForZone(zone);
  const n = steps.length;
  const perRow = n > 60 ? 14 : n > 30 ? 11 : 8;
  const rows = Math.max(1, Math.ceil(n / perRow));
  const pts = steps.map((s, i) => {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const t = col / (perRow - 1);
    const dir = row % 2 === 0 ? t : 1 - t;
    const x = 8 + dir * 84;
    const y = rows === 1 ? 35 : 9 + (row * 52) / Math.max(rows - 1, 1) + Math.sin(i * 1.3) * 2.2;
    return { step: s, x, y };
  });
  let path = "";
  pts.forEach((p, i) => {
    if (i === 0) path = `M${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    else {
      const prev = pts[i - 1];
      const mx = (prev.x + p.x) / 2;
      path += ` Q${mx.toFixed(2)} ${(prev.y - 2).toFixed(2)} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    }
  });
  return { pts, path };
}

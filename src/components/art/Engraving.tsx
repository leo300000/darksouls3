import type { ArtSpec } from "@/data/types";
import { seeded, type Rng } from "@/lib/random";

/**
 * Gravure procédurale : illustration originale générée à partir d'un motif et d'une palette.
 * Elle remplace les visuels officiels (non intégrés faute de droits vérifiés) et reste
 * explicitement identifiée comme illustration générée. Une vraie image peut être fournie
 * via le champ `image` des données : le composant <ArtImage> la privilégie alors.
 */

const PALETTES: Record<ArtSpec["palette"], { sky: [string, string]; far: string; mid: string; near: string; glow: string; line: string }> = {
  ash: { sky: ["#202127", "#0c0c0f"], far: "#2b2c33", mid: "#17181d", near: "#0a0a0c", glow: "#b9b2a3", line: "#d6cbb7" },
  ember: { sky: ["#3a1d14", "#0d0907"], far: "#3b2219", mid: "#1d100c", near: "#0b0705", glow: "#e0814f", line: "#e9c79a" },
  frost: { sky: ["#25334a", "#0b0f16"], far: "#2a3850", mid: "#141c29", near: "#080b11", glow: "#b8cde0", line: "#d7e2ea" },
  abyss: { sky: ["#1d1730", "#07060b"], far: "#231c35", mid: "#120e1c", near: "#060509", glow: "#8f7fb8", line: "#c9bfe0" },
  gold: { sky: ["#3a2f1a", "#0e0b07"], far: "#3b301c", mid: "#1d170d", near: "#0b0906", glow: "#e3c27e", line: "#efdcae" },
  moss: { sky: ["#25301f", "#0a0c08"], far: "#2b3624", mid: "#151b12", near: "#080a07", glow: "#a9bc84", line: "#d5dcbf" },
  blood: { sky: ["#3a1515", "#0d0606"], far: "#3a1a1a", mid: "#1d0d0d", near: "#0b0505", glow: "#d0604c", line: "#e7bfb2" },
  storm: { sky: ["#2a323f", "#0b0d11"], far: "#303a48", mid: "#171c24", near: "#090b0e", glow: "#d6e0ea", line: "#e4e9ee" },
};

const W = 800;
const H = 500;

function ridge(r: Rng, base: number, amp: number, steps: number): string {
  let d = `M0 ${H} L0 ${base}`;
  for (let i = 1; i <= steps; i++) {
    const x = (W / steps) * i;
    const y = base - r.range(0, amp) + r.range(-amp * 0.2, amp * 0.2);
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + ` L${W} ${H} Z`;
}

function spire(x: number, w: number, h: number, ground: number, roof = 0.35): string {
  const top = ground - h;
  const roofH = h * roof;
  return `M${x} ${ground} L${x} ${top + roofH} L${x + w / 2} ${top} L${x + w} ${top + roofH} L${x + w} ${ground} Z`;
}

function rect(x: number, y: number, w: number, h: number): string {
  return `M${x} ${y} h${w} v${h} h${-w} Z`;
}

function tree(r: Rng, x: number, ground: number, h: number): string {
  // tronc tordu + branches nues
  let d = `M${x - 4} ${ground} Q${x + r.range(-10, 10)} ${ground - h / 2} ${x + r.range(-6, 6)} ${ground - h} L${x + 3} ${ground - h + 4} Q${x + r.range(-8, 8)} ${ground - h / 2} ${x + 5} ${ground} Z`;
  for (let i = 0; i < 4; i++) {
    const by = ground - h * r.range(0.45, 0.95);
    const dir = r.next() > 0.5 ? 1 : -1;
    const len = r.range(16, 46);
    d += ` M${x} ${by} q${dir * len * 0.5} ${-len * 0.4} ${dir * len} ${-len * 0.9} l${dir * -2} 2 q${dir * -len * 0.45} ${len * 0.35} ${dir * -len + dir * 2} ${len * 0.85} Z`;
  }
  return d;
}

function motifPath(spec: ArtSpec, r: Rng): { mid: string; detail: string; moon: boolean; lights: { x: number; y: number }[] } {
  const ground = 380;
  let mid = "";
  let detail = "";
  const lights: { x: number; y: number }[] = [];
  let moon = false;
  switch (spec.motif) {
    case "castle":
    case "archive": {
      const n = r.int(5, 8);
      let x = r.range(60, 140);
      for (let i = 0; i < n; i++) {
        const w = r.range(26, 60);
        const h = r.range(120, spec.motif === "archive" ? 300 : 260);
        mid += spire(x, w, h, ground, r.range(0.25, 0.45));
        if (r.next() > 0.4) lights.push({ x: x + w / 2, y: ground - h * r.range(0.3, 0.6) });
        if (spec.motif === "archive") for (let k = 0; k < 4; k++) detail += rect(x + w * 0.3, ground - h * 0.25 - k * 28, w * 0.4, 14);
        x += w + r.range(12, 46);
        if (x > W - 80) break;
      }
      mid += rect(40, ground - 70, W - 80, 70);
      for (let i = 0; i < 30; i++) mid += rect(40 + i * ((W - 80) / 30), ground - 82, (W - 80) / 60, 12);
      break;
    }
    case "cathedral": {
      const cx = W / 2 + r.range(-60, 60);
      mid += spire(cx - 90, 180, 300, ground, 0.3);
      mid += spire(cx - 170, 60, 220, ground, 0.5) + spire(cx + 110, 60, 220, ground, 0.5);
      mid += spire(cx - 240, 40, 150, ground, 0.6) + spire(cx + 200, 40, 150, ground, 0.6);
      detail += `M${cx} ${ground - 190} m-34 0 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0 Z`;
      lights.push({ x: cx, y: ground - 190 });
      detail += rect(cx - 18, ground - 90, 36, 90);
      break;
    }
    case "village": {
      let x = 40;
      while (x < W - 60) {
        const w = r.range(50, 110);
        const h = r.range(50, 120);
        mid += `M${x} ${ground} L${x} ${ground - h} L${x + w / 2} ${ground - h - r.range(25, 55)} L${x + w} ${ground - h} L${x + w} ${ground} Z`;
        if (r.next() > 0.5) lights.push({ x: x + w * 0.3, y: ground - h * 0.5 });
        x += w + r.range(-8, 20);
      }
      mid += tree(r, W * r.range(0.35, 0.65), ground, 200);
      lights.push({ x: W / 2, y: ground - 120 });
      break;
    }
    case "forest":
    case "swamp":
    case "garden": {
      for (let i = 0; i < 9; i++) mid += tree(r, r.range(20, W - 20), ground, r.range(120, 260));
      if (spec.motif !== "forest") for (let i = 0; i < 14; i++) detail += rect(r.range(0, W), ground + r.range(10, 90), r.range(40, 160), 1.4);
      if (spec.motif === "garden") for (let i = 0; i < 4; i++) { const x = 100 + i * 170; mid += `M${x} ${ground} v-130 a50 50 0 0 1 100 0 v130 h-12 v-126 a38 38 0 0 0 -76 0 v126 Z`; }
      moon = spec.motif === "swamp";
      break;
    }
    case "cemetery": {
      for (let i = 0; i < 16; i++) {
        const x = r.range(20, W - 20);
        const h = r.range(30, 80);
        const w = r.range(18, 34);
        if (r.next() > 0.5) mid += `M${x} ${ground} v${-h} a${w / 2} ${w / 2} 0 0 1 ${w} 0 v${h} Z`;
        else mid += `M${x + w / 2 - 3} ${ground} v${-h} h-12 v-8 h12 v-14 h6 v14 h12 v8 h-12 v${h + 22 - 22} Z`;
      }
      mid += tree(r, W * 0.78, ground, 230);
      moon = true;
      break;
    }
    case "shrine": {
      const cx = W / 2;
      mid += `M${cx - 160} ${ground} v-120 q160 -150 320 0 v120 Z`;
      mid += rect(cx - 200, ground - 40, 400, 40);
      for (let i = -2; i <= 2; i++) mid += rect(cx + i * 70 - 8, ground - 120, 16, 80);
      lights.push({ x: cx, y: ground - 60 });
      break;
    }
    case "catacomb":
    case "dungeon": {
      for (let i = 0; i < 6; i++) {
        const x = 30 + i * 128;
        mid += `M${x} ${ground} v-200 a60 60 0 0 1 120 0 v200 h-16 v-196 a44 44 0 0 0 -88 0 v196 Z`;
        if (spec.motif === "dungeon") for (let b = 1; b < 5; b++) detail += rect(x + 16 + b * 17, ground - 200, 3, 200);
      }
      for (let i = 0; i < 18; i++) detail += `M${r.range(0, W)} ${ground + r.range(20, 100)} m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 Z`;
      lights.push({ x: r.range(100, W - 100), y: ground - 140 });
      break;
    }
    case "lava":
    case "kiln": {
      mid += ridge(r, 250, 120, 14);
      for (let i = 0; i < 5; i++) mid += spire(r.range(40, W - 100), r.range(30, 70), r.range(80, 200), ground + 20, r.range(0.2, 0.5));
      lights.push({ x: W / 2, y: ground + 40 }, { x: W * 0.3, y: ground + 60 }, { x: W * 0.7, y: ground + 50 });
      break;
    }
    case "city": {
      for (let i = 0; i < 14; i++) {
        const w = r.range(12, 34);
        mid += spire(r.range(20, W - 40), w, r.range(140, 330), ground, r.range(0.4, 0.7));
      }
      mid += `M0 ${ground} Q${W / 2} ${ground - 60} ${W} ${ground} Z`;
      moon = true;
      break;
    }
    case "ruin":
    case "dreg": {
      for (let i = 0; i < 11; i++) {
        const x = r.range(20, W - 60);
        const w = r.range(20, 70);
        const h = r.range(60, 260);
        const tilt = spec.motif === "dreg" ? r.range(-22, 22) : 0;
        mid += `M${x} ${ground} L${x + tilt} ${ground - h} L${x + w + tilt * 0.6} ${ground - h + r.range(-20, 30)} L${x + w} ${ground} Z`;
      }
      break;
    }
    case "peak": {
      mid += ridge(r, 200, 170, 9);
      const bx = W * r.range(0.4, 0.6);
      mid += spire(bx, 40, 150, 230, 0.4) + rect(bx - 30, 230, 100, 30);
      lights.push({ x: bx + 20, y: 140 });
      break;
    }
    case "snow": {
      for (let i = 0; i < 20; i++) {
        const x = r.range(0, W);
        const h = r.range(80, 220);
        mid += `M${x} ${ground} l${-h * 0.22} 0 l${h * 0.22} ${-h} l${h * 0.22} ${h} Z`;
      }
      moon = true;
      break;
    }
  }
  return { mid, detail, moon, lights };
}

export function Engraving({
  spec,
  seed,
  className,
  title,
  caption = true,
  variant = "landscape",
}: {
  spec: ArtSpec;
  seed: string;
  className?: string;
  title?: string;
  caption?: boolean;
  variant?: "landscape" | "sigil";
}) {
  const p = PALETTES[spec.palette];
  const r = seeded(seed);
  const id = `g-${seed.replace(/[^a-z0-9]/gi, "")}-${variant}`;
  const m = motifPath(spec, r);
  const sunX = r.range(W * 0.15, W * 0.85);
  const sunY = r.range(70, 150);
  const embers = Array.from({ length: 26 }, () => ({ x: r.range(0, W), y: r.range(120, H), s: r.range(0.6, 2.2), o: r.range(0.25, 0.9) }));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={title ? `${title} — gravure générée (illustration temporaire)` : "Gravure générée (illustration temporaire)"}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={p.glow} stopOpacity="0.9" />
          <stop offset="0.4" stopColor={p.glow} stopOpacity="0.25" />
          <stop offset="1" stopColor={p.glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-vig`} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.75" />
        </radialGradient>
        <pattern id={`${id}-hatch`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={p.line} strokeWidth="0.6" strokeOpacity="0.09" />
        </pattern>
        <linearGradient id={`${id}-fog`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.glow} stopOpacity="0" />
          <stop offset="1" stopColor={p.glow} stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      {variant === "sigil" ? (
        <Sigil id={id} r={r} color={p.line} glow={p.glow} />
      ) : (
        <>
          <circle cx={sunX} cy={sunY} r={m.moon ? 46 : 120} fill={`url(#${id}-glow)`} />
          {m.moon && <circle cx={sunX} cy={sunY} r={30} fill={p.glow} opacity="0.55" />}
          <path d={ridge(r, 300, 90, 18)} fill={p.far} opacity="0.85" />
          <rect y="260" width={W} height="140" fill={`url(#${id}-fog)`} />
          <path d={m.mid} fill={p.mid} />
          <path d={m.detail} fill={p.near} opacity="0.75" />
          {m.lights.map((l, i) => (
            <circle key={i} cx={l.x} cy={l.y} r={i === 0 ? 70 : 40} fill={`url(#${id}-glow)`} />
          ))}
          <path d={ridge(r, 410, 40, 24)} fill={p.near} />
        </>
      )}
      {embers.map((e, i) => (
        <circle key={i} cx={e.x} cy={e.y} r={e.s} fill={p.glow} opacity={e.o * 0.6} />
      ))}
      <rect width={W} height={H} fill={`url(#${id}-hatch)`} />
      <rect width={W} height={H} fill={`url(#${id}-vig)`} />
      {caption && (
        <text x={W - 14} y={H - 14} textAnchor="end" fontSize="13" letterSpacing="2.5" fill={p.line} opacity="0.45" style={{ fontFamily: "var(--font-engrave)" }}>
          GRAVURE GÉNÉRÉE
        </text>
      )}
    </svg>
  );
}

function Sigil({ id, r, color, glow }: { id: string; r: Rng; color: string; glow: string }) {
  const cx = W / 2;
  const cy = H / 2;
  const rays = r.int(8, 16);
  const inner = r.int(3, 7);
  const rot = r.range(0, 360);
  const pts = Array.from({ length: inner }, (_, i) => {
    const a = (Math.PI * 2 * i) / inner + (rot * Math.PI) / 180;
    return `${(cx + Math.cos(a) * 74).toFixed(1)},${(cy + Math.sin(a) * 74).toFixed(1)}`;
  }).join(" ");
  return (
    <g>
      <circle cx={cx} cy={cy} r={220} fill={`url(#${id}-glow)`} opacity="0.55" />
      {Array.from({ length: rays }, (_, i) => {
        const a = (Math.PI * 2 * i) / rays;
        const len = r.range(150, 230);
        return <line key={i} x1={cx + Math.cos(a) * 118} y1={cy + Math.sin(a) * 118} x2={cx + Math.cos(a) * len} y2={cy + Math.sin(a) * len} stroke={color} strokeOpacity="0.35" strokeWidth={r.range(0.6, 1.6)} />;
      })}
      <circle cx={cx} cy={cy} r={140} fill="none" stroke={color} strokeOpacity="0.5" strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r={124} fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="0.8" strokeDasharray="2 6" />
      <circle cx={cx} cy={cy} r={100} fill="#000" fillOpacity="0.35" stroke={color} strokeOpacity="0.6" />
      <polygon points={pts} fill="none" stroke={glow} strokeOpacity="0.8" strokeWidth="1.4" />
      <circle cx={cx} cy={cy} r={18} fill={glow} opacity="0.85" />
      <circle cx={cx} cy={cy} r={42} fill="none" stroke={glow} strokeOpacity="0.5" />
    </g>
  );
}

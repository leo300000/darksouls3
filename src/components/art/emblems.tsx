/**
 * Emblèmes héraldiques originaux (SVG dessinés pour le site) placés au cœur du sceau
 * des gravures générées. Chaque emblème évoque l'arme ou le symbole d'un boss ou d'une fin,
 * sans reproduire aucun visuel officiel. Coordonnées centrées sur (0, 0), rayon utile ≈ 80.
 */

export type EmblemKey =
  | "halberd" | "mace" | "tree" | "crystal" | "candles" | "crossedSwords" | "skullCrown"
  | "flame" | "twinBlades" | "cleaver" | "eye" | "crescent" | "axeShield" | "wing"
  | "crownBolt" | "twinCrowns" | "coiledSword" | "claws" | "scythe" | "twinFlames"
  | "spear" | "brokenSword" | "eclipse" | "eyes" | "darksign" | "crownedWing" | "darkWing";

type Ink = { line: string; glow: string };

const S = { fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Sword({ ink, len = 150, glow = false }: { ink: Ink; len?: number; glow?: boolean }) {
  const h = len / 2;
  const c = glow ? ink.glow : ink.line;
  return (
    <g>
      <path d={`M0 ${-h} L5 ${-h + 14} L5 ${h - 34} L-5 ${h - 34} L-5 ${-h + 14} Z`} fill={c} fillOpacity="0.18" stroke={c} strokeWidth="2" {...{ strokeLinejoin: "round" }} />
      <line x1="0" y1={-h + 16} x2="0" y2={h - 36} stroke={c} strokeOpacity="0.6" strokeWidth="1" />
      <path d={`M-20 ${h - 34} L20 ${h - 34}`} stroke={ink.line} strokeWidth="3.2" {...S} />
      <path d={`M0 ${h - 34} L0 ${h - 10}`} stroke={ink.line} strokeWidth="4" {...S} />
      <circle cx="0" cy={h - 6} r="4.5" fill={ink.line} />
    </g>
  );
}

function Crown({ ink, w = 70, y = 0 }: { ink: Ink; w?: number; y?: number }) {
  const x = w / 2;
  return (
    <g transform={`translate(0 ${y})`}>
      <path d={`M${-x} 14 L${-x} -10 L${-x / 2} 4 L0 -18 L${x / 2} 4 L${x} -10 L${x} 14 Z`} fill={ink.line} fillOpacity="0.14" stroke={ink.line} strokeWidth="2.2" {...{ strokeLinejoin: "round" }} />
      <line x1={-x} y1="20" x2={x} y2="20" stroke={ink.line} strokeWidth="2.2" />
      {[-x, 0, x].map((cx) => <circle key={cx} cx={cx} cy={cx === 0 ? -22 : -14} r="3" fill={ink.glow} />)}
    </g>
  );
}

function Flame({ ink, s = 1, x = 0, y = 0 }: { ink: Ink; s?: number; x?: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -70 C18 -40 40 -22 34 8 C30 34 14 46 0 46 C-14 46 -30 34 -34 8 C-38 -18 -14 -30 0 -70 Z" fill={ink.glow} fillOpacity="0.22" stroke={ink.glow} strokeWidth="2.2" />
      <path d="M0 -26 C10 -10 18 0 15 16 C13 28 6 34 0 34 C-6 34 -14 28 -15 16 C-17 2 -6 -8 0 -26 Z" fill={ink.glow} fillOpacity="0.55" />
    </g>
  );
}

export function Emblem({ kind, ink }: { kind: EmblemKey; ink: Ink }) {
  const { line, glow } = ink;
  switch (kind) {
    case "halberd":
      return (
        <g>
          <line x1="0" y1="-82" x2="0" y2="82" stroke={line} strokeWidth="4" {...S} />
          <path d="M3 -62 C40 -70 54 -34 48 -4 C36 -22 20 -26 3 -24 Z" fill={line} fillOpacity="0.18" stroke={line} strokeWidth="2.4" {...{ strokeLinejoin: "round" }} />
          <path d="M-3 -54 L-26 -46 L-3 -36" stroke={line} strokeWidth="2.4" {...S} />
          <path d="M-5 -82 L0 -98 L5 -82" fill={glow} stroke={glow} strokeWidth="1.5" />
          <circle cx="0" cy="82" r="5" fill={line} />
        </g>
      );
    case "mace":
      return (
        <g>
          <line x1="0" y1="-8" x2="0" y2="84" stroke={line} strokeWidth="5" {...S} />
          <circle cx="0" cy="-36" r="26" fill={line} fillOpacity="0.16" stroke={line} strokeWidth="2.4" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (Math.PI * 2 * i) / 8;
            return <line key={i} x1={Math.cos(a) * 26} y1={-36 + Math.sin(a) * 26} x2={Math.cos(a) * 42} y2={-36 + Math.sin(a) * 42} stroke={line} strokeWidth="3" {...S} />;
          })}
          {[[-48, 30], [46, 12], [38, 56]].map(([x, y]) => <path key={`${x}`} d={`M${x} ${y - 9} L${x + 5} ${y} L${x} ${y + 9} L${x - 5} ${y} Z`} fill={glow} fillOpacity="0.7" />)}
        </g>
      );
    case "tree":
      return (
        <g stroke={line} strokeWidth="3" {...S}>
          <path d="M-8 80 C-4 40 -12 10 0 -20 C10 10 6 40 10 80" fill={line} fillOpacity="0.15" />
          <path d="M-2 -10 C-30 -30 -40 -50 -62 -56 M-20 -32 C-26 -58 -14 -70 -18 -86 M4 -14 C30 -30 44 -36 64 -60 M30 -32 C36 -50 30 -66 40 -80 M0 -20 L2 -78" />
          {[[-30, 20], [26, 30], [-14, 52]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="7" fill={glow} fillOpacity="0.45" stroke={glow} strokeWidth="1.5" />)}
        </g>
      );
    case "crystal":
      return (
        <g stroke={glow} strokeWidth="2.2" {...{ strokeLinejoin: "round" }}>
          <path d="M0 -76 L34 -12 L0 76 L-34 -12 Z" fill={glow} fillOpacity="0.16" />
          <path d="M0 -76 L0 76 M-34 -12 L34 -12 M0 -76 L-12 -12 L0 76 M0 -76 L12 -12 L0 76" fill="none" strokeOpacity="0.6" strokeWidth="1.2" />
          {[[-62, -36, 0.6], [58, 30, 0.7], [-50, 50, 0.45]].map(([x, y, s]) => (
            <path key={x} transform={`translate(${x} ${y}) scale(${s})`} d="M0 -22 L10 0 L0 22 L-10 0 Z" fill={glow} fillOpacity="0.35" />
          ))}
        </g>
      );
    case "candles":
      return (
        <g>
          <path d="M-70 40 C-60 -50 60 -50 70 40" fill="none" stroke={line} strokeWidth="2" strokeOpacity="0.55" />
          {[-34, 0, 34].map((x, i) => (
            <g key={x}>
              <rect x={x - 7} y={i === 1 ? -10 : 6} width="14" height={i === 1 ? 80 : 64} fill={line} fillOpacity="0.15" stroke={line} strokeWidth="2" />
              <path d={`M${x} ${i === 1 ? -40 : -24} C${x + 7} ${i === 1 ? -28 : -12} ${x + 6} ${i === 1 ? -16 : -4} ${x} ${i === 1 ? -14 : -2} C${x - 6} ${i === 1 ? -16 : -4} ${x - 7} ${i === 1 ? -28 : -12} ${x} ${i === 1 ? -40 : -24} Z`} fill={glow} />
            </g>
          ))}
        </g>
      );
    case "crossedSwords":
      return (
        <g>
          <g transform="rotate(35)"><Sword ink={ink} /></g>
          <g transform="rotate(-35)"><Sword ink={ink} /></g>
          <circle cx="0" cy="0" r="9" fill={glow} fillOpacity="0.8" />
        </g>
      );
    case "twinBlades":
      return (
        <g>
          <g transform="rotate(32)"><Sword ink={ink} glow /></g>
          <g transform="rotate(-32)"><Sword ink={ink} /></g>
        </g>
      );
    case "skullCrown":
      return (
        <g>
          <Crown ink={ink} w={64} y={-58} />
          <path d="M-34 0 C-34 -40 34 -40 34 0 C34 18 24 24 22 34 L-22 34 C-24 24 -34 18 -34 0 Z" fill={line} fillOpacity="0.14" stroke={line} strokeWidth="2.4" />
          <ellipse cx="-13" cy="2" rx="8" ry="9" fill={glow} fillOpacity="0.8" />
          <ellipse cx="13" cy="2" rx="8" ry="9" fill={glow} fillOpacity="0.8" />
          <path d="M-14 34 L-14 48 M-5 34 L-5 50 M5 34 L5 50 M14 34 L14 48 M-18 48 L18 48" stroke={line} strokeWidth="2" {...S} />
        </g>
      );
    case "flame":
      return <Flame ink={ink} s={1.1} y={8} />;
    case "twinFlames":
      return (
        <g>
          <Flame ink={ink} s={0.8} x={-26} y={10} />
          <Flame ink={{ line, glow: line }} s={0.8} x={26} y={10} />
        </g>
      );
    case "cleaver":
      return (
        <g transform="rotate(-20)">
          <path d="M-10 -84 L30 -78 C40 -40 34 10 22 40 L-10 40 Z" fill={line} fillOpacity="0.16" stroke={line} strokeWidth="2.4" {...{ strokeLinejoin: "round" }} />
          <line x1="-2" y1="40" x2="-2" y2="88" stroke={line} strokeWidth="6" {...S} />
          <path d="M-22 40 L22 40" stroke={line} strokeWidth="3" {...S} />
          <path d="M-46 -40 L-30 -20 L-40 -14 L-24 8" stroke={glow} strokeWidth="2.4" {...S} />
        </g>
      );
    case "eye":
      return (
        <g>
          <path d="M-74 0 C-40 -46 40 -46 74 0 C40 46 -40 46 -74 0 Z" fill={line} fillOpacity="0.1" stroke={line} strokeWidth="2.4" />
          <circle cx="0" cy="0" r="24" fill="none" stroke={glow} strokeWidth="2.4" />
          <circle cx="0" cy="0" r="11" fill={glow} />
          {[-30, -6, 20, 40].map((x, i) => <path key={x} d={`M${x} 30 C${x - 2} ${46 + i * 6} ${x + 2} ${56 + i * 4} ${x} ${66 + i * 5}`} stroke={glow} strokeOpacity="0.6" strokeWidth="2" {...S} />)}
        </g>
      );
    case "crescent":
      return (
        <g>
          <path d="M18 -70 A72 72 0 1 0 18 70 A56 56 0 1 1 18 -70 Z" fill={glow} fillOpacity="0.18" stroke={glow} strokeWidth="2.2" />
          <path d="M-10 60 C30 30 46 -10 30 -66" stroke={line} strokeWidth="3" {...S} />
          <path d="M-18 70 L-2 50" stroke={line} strokeWidth="5" {...S} />
        </g>
      );
    case "axeShield":
      return (
        <g>
          <path d="M-10 -40 L50 -40 L50 10 C50 46 20 66 20 66 C20 66 -10 46 -10 10 Z" fill={line} fillOpacity="0.12" stroke={line} strokeWidth="2.2" transform="translate(-40 10)" />
          <line x1="28" y1="-86" x2="28" y2="86" stroke={line} strokeWidth="4" {...S} />
          <path d="M31 -70 C62 -70 72 -36 64 -10 C54 -30 44 -34 31 -34 Z" fill={glow} fillOpacity="0.3" stroke={glow} strokeWidth="2" />
          <path d="M-62 -20 L-50 -6 L-58 0 L-46 16" stroke={glow} strokeWidth="2.4" {...S} />
        </g>
      );
    case "wing":
      return (
        <g stroke={line} strokeWidth="2.4" {...S}>
          <path d="M-70 40 L-10 -70 L70 -30" />
          <path d="M-10 -70 L-30 40 M-10 -70 L10 30 M-10 -70 L44 14" strokeOpacity="0.7" />
          <path d="M-70 40 C-56 30 -40 34 -30 40 C-16 26 0 28 10 30 C22 14 34 12 44 14 C52 -6 62 -18 70 -30" fill={line} fillOpacity="0.14" />
          <circle cx="-10" cy="-70" r="5" fill={glow} stroke="none" />
        </g>
      );
    case "crownedWing":
      return (
        <g>
          <g transform="translate(0 18) scale(0.82)"><Emblem kind="wing" ink={ink} /></g>
          <Crown ink={ink} w={40} y={-64} />
        </g>
      );
    case "darkWing":
      return (
        <g>
          <g transform="scale(-0.9 0.9)"><Emblem kind="wing" ink={ink} /></g>
          <circle cx="-6" cy="22" r="20" fill="#000" fillOpacity="0.7" stroke={glow} strokeWidth="2.4" />
          <circle cx="-6" cy="22" r="7" fill={glow} />
        </g>
      );
    case "crownBolt":
      return (
        <g>
          <Crown ink={ink} w={80} y={-46} />
          <path d="M8 -14 L-20 26 L0 26 L-12 78 L26 14 L6 14 L18 -14 Z" fill={glow} fillOpacity="0.7" stroke={glow} strokeWidth="1.6" {...{ strokeLinejoin: "round" }} />
        </g>
      );
    case "twinCrowns":
      return (
        <g>
          <Crown ink={ink} w={52} y={-34} />
          <g transform="translate(0 40) scale(1 -1)"><Crown ink={{ line, glow: line }} w={52} /></g>
          <line x1="-60" y1="2" x2="60" y2="2" stroke={glow} strokeOpacity="0.6" strokeWidth="1.4" strokeDasharray="3 5" />
        </g>
      );
    case "coiledSword":
      return (
        <g>
          <Flame ink={ink} s={0.8} y={44} />
          <g transform="translate(0 -20)"><Sword ink={ink} len={130} /></g>
          <path d="M-16 -40 C16 -34 16 -26 -16 -20 C16 -14 16 -6 -16 0 C16 6 16 14 -16 20" stroke={line} strokeWidth="2" strokeOpacity="0.8" {...S} />
        </g>
      );
    case "claws":
      return (
        <g stroke={glow} strokeWidth="5" {...S}>
          {[-30, 0, 30].map((x) => <path key={x} d={`M${x - 20} -66 C${x - 4} -24 ${x + 6} 20 ${x + 22} 66`} strokeOpacity="0.85" />)}
        </g>
      );
    case "scythe":
      return (
        <g>
          <line x1="-30" y1="86" x2="20" y2="-80" stroke={line} strokeWidth="4" {...S} />
          <path d="M20 -80 C-30 -86 -66 -60 -74 -24 C-50 -48 -20 -60 14 -60 Z" fill={glow} fillOpacity="0.3" stroke={glow} strokeWidth="2.2" {...{ strokeLinejoin: "round" }} />
          {[[40, -10], [54, 30], [30, 50]].map(([x, y]) => <path key={x} d={`M${x} ${y - 7} L${x} ${y + 7} M${x - 7} ${y} L${x + 7} ${y}`} stroke={glow} strokeWidth="1.6" {...S} />)}
        </g>
      );
    case "spear":
      return (
        <g>
          <line x1="0" y1="-50" x2="0" y2="88" stroke={line} strokeWidth="4" {...S} />
          <path d="M0 -94 L12 -56 L0 -46 L-12 -56 Z" fill={glow} fillOpacity="0.4" stroke={glow} strokeWidth="2" />
          <path d="M-24 -40 C-14 -50 14 -50 24 -40 C14 -34 -14 -34 -24 -40 Z" fill={line} fillOpacity="0.2" stroke={line} strokeWidth="2" />
          <path d="M-6 -30 C-30 -10 -34 20 -20 44" stroke={line} strokeOpacity="0.55" strokeWidth="2" {...S} />
        </g>
      );
    case "brokenSword":
      return (
        <g>
          <path d="M-5 -70 L5 -64 L5 34 L-5 34 Z" fill={line} fillOpacity="0.18" stroke={line} strokeWidth="2" {...{ strokeLinejoin: "round" }} />
          <path d="M-10 -82 L4 -92 L-2 -78 Z" fill={line} fillOpacity="0.5" />
          <path d="M-20 34 L20 34 M0 34 L0 60" stroke={line} strokeWidth="3.4" {...S} />
          <circle cx="0" cy="66" r="5" fill={line} />
          <path d="M28 -10 C40 10 40 26 28 30 C16 26 16 10 28 -10 Z" fill={glow} fillOpacity="0.85" />
          <path d="M-62 -30 C-40 0 -50 40 -30 70 M-46 -40 C-30 -10 -36 30 -18 56" stroke={glow} strokeOpacity="0.45" strokeWidth="2" {...S} />
        </g>
      );
    case "eclipse":
      return (
        <g>
          <circle cx="0" cy="0" r="62" fill="#000" fillOpacity="0.6" stroke={glow} strokeWidth="3" />
          <circle cx="0" cy="0" r="72" fill="none" stroke={glow} strokeOpacity="0.35" strokeWidth="8" />
        </g>
      );
    case "eyes":
      return (
        <g>
          {[-30, 30].map((x) => (
            <g key={x}>
              <path d={`M${x - 26} 0 C${x - 12} -18 ${x + 12} -18 ${x + 26} 0 C${x + 12} 18 ${x - 12} 18 ${x - 26} 0 Z`} fill="none" stroke={line} strokeWidth="2.2" />
              <circle cx={x} cy="0" r="8" fill={glow} />
            </g>
          ))}
          <path d="M-56 40 C-20 60 20 60 56 40" stroke={line} strokeOpacity="0.5" strokeWidth="1.6" {...S} />
        </g>
      );
    case "darksign":
      return (
        <g>
          <circle cx="0" cy="0" r="56" fill="none" stroke={glow} strokeWidth="9" strokeOpacity="0.85" />
          <circle cx="0" cy="0" r="40" fill="#000" fillOpacity="0.7" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (Math.PI * 2 * i) / 12;
            return <line key={i} x1={Math.cos(a) * 62} y1={Math.sin(a) * 62} x2={Math.cos(a) * (76 + (i % 3) * 6)} y2={Math.sin(a) * (76 + (i % 3) * 6)} stroke={glow} strokeOpacity="0.7" strokeWidth="2" />;
          })}
        </g>
      );
  }
}

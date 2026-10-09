import { seeded } from "@/lib/random";

/**
 * Scène d'ouverture illustrée (création originale, SVG) : un feu de camp où repose
 * une épée enroulée, au pied d'un château aux flèches innombrables, sous une éclipse.
 * Aucune ressource officielle n'est utilisée.
 */
export function HeroScene({ className = "" }: { className?: string }) {
  const r = seeded("hero-lothric");
  const W = 1600;
  const H = 900;

  const spires = Array.from({ length: 22 }, (_, i) => {
    const x = 980 + i * 26 + r.range(-6, 6);
    const h = r.range(120, 360) * (1 - Math.abs(i - 11) / 22);
    const w = r.range(10, 22);
    return { x, h, w };
  });

  const ridge = (base: number, amp: number, n: number, seed: string) => {
    const rr = seeded(seed);
    let d = `M0 ${H} L0 ${base}`;
    for (let i = 1; i <= n; i++) d += ` L${((W / n) * i).toFixed(0)} ${(base - rr.range(0, amp)).toFixed(0)}`;
    return d + ` L${W} ${H} Z`;
  };

  const stones = Array.from({ length: 14 }, () => ({ x: r.range(40, 1560), h: r.range(26, 70), w: r.range(16, 30), y: r.range(780, 850) }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="Illustration originale : un feu de camp et une épée enroulée devant un château en ruine, sous une éclipse.">
      <defs>
        <linearGradient id="h-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07080b" />
          <stop offset="0.55" stopColor="#151821" />
          <stop offset="0.82" stopColor="#3a1f17" />
          <stop offset="1" stopColor="#120b09" />
        </linearGradient>
        <radialGradient id="h-eclipse" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.62" stopColor="#000" stopOpacity="1" />
          <stop offset="0.7" stopColor="#c9a870" stopOpacity="0.85" />
          <stop offset="0.78" stopColor="#8e382f" stopOpacity="0.4" />
          <stop offset="1" stopColor="#8e382f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="h-fire" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="1" />
          <stop offset="0.25" stopColor="#e07a3e" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#8e382f" stopOpacity="0.35" />
          <stop offset="1" stopColor="#8e382f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="h-fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6cbb7" stopOpacity="0" />
          <stop offset="0.5" stopColor="#d6cbb7" stopOpacity="0.07" />
          <stop offset="1" stopColor="#d6cbb7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="h-blade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a3330" />
          <stop offset="0.5" stopColor="#c9a870" />
          <stop offset="1" stopColor="#3a3330" />
        </linearGradient>
        <pattern id="h-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#d6cbb7" strokeWidth="0.5" strokeOpacity="0.06" />
        </pattern>
        <filter id="h-blur"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>

      <rect width={W} height={H} fill="url(#h-sky)" />
      {/* étoiles discrètes */}
      {Array.from({ length: 70 }, (_, i) => (
        <circle key={i} cx={r.range(0, W)} cy={r.range(0, 420)} r={r.range(0.4, 1.3)} fill="#d6cbb7" opacity={r.range(0.1, 0.5)} />
      ))}
      {/* éclipse */}
      <circle cx="1180" cy="230" r="230" fill="url(#h-eclipse)" opacity="0.9" />
      <circle cx="1180" cy="230" r="142" fill="#050506" />
      <circle cx="1180" cy="230" r="146" fill="none" stroke="#e3c27e" strokeOpacity="0.55" strokeWidth="2" />

      {/* montagnes lointaines */}
      <path d={ridge(560, 160, 26, "far")} fill="#1b1d25" />
      {/* château aux mille flèches */}
      <g fill="#0f1016">
        <path d="M900 640 L900 520 L1560 520 L1560 640 Z" />
        {spires.map((s, i) => (
          <path key={i} d={`M${s.x} 560 L${s.x} ${560 - s.h} L${s.x + s.w / 2} ${560 - s.h - s.h * 0.35} L${s.x + s.w} ${560 - s.h} L${s.x + s.w} 560 Z`} />
        ))}
        {Array.from({ length: 40 }, (_, i) => (
          <rect key={i} x={900 + i * 16.5} y={508} width={8} height={14} />
        ))}
      </g>
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={1010 + r.range(0, 460)} y={r.range(300, 520)} width="3" height="6" fill="#e0814f" opacity={r.range(0.4, 0.9)} />
      ))}
      <rect y="470" width={W} height="220" fill="url(#h-fog)" className="motion-safe:animate-[drift-smoke_26s_ease-in-out_infinite_alternate]" />
      {/* falaises intermédiaires */}
      <path d={ridge(700, 120, 18, "mid")} fill="#0c0d11" />
      {/* arbres morts */}
      {[180, 420, 1380].map((x, i) => (
        <g key={i} stroke="#08090c" strokeWidth={i === 2 ? 9 : 7} strokeLinecap="round" fill="none">
          <path d={`M${x} 800 C ${x + 10} 700, ${x - 20} 640, ${x + 6} 540`} />
          <path d={`M${x + 2} 650 C ${x + 40} 620, ${x + 70} 610, ${x + 96} 570`} strokeWidth="4" />
          <path d={`M${x - 4} 610 C ${x - 40} 590, ${x - 60} 560, ${x - 70} 520`} strokeWidth="3.5" />
          <path d={`M${x + 4} 580 C ${x + 20} 560, ${x + 26} 540, ${x + 22} 500`} strokeWidth="3" />
        </g>
      ))}
      {/* sol */}
      <path d={ridge(800, 40, 30, "ground")} fill="#070708" />
      {stones.map((s, i) => (
        <path key={i} d={`M${s.x} ${s.y} v${-s.h} a${s.w / 2} ${s.w / 2} 0 0 1 ${s.w} 0 v${s.h} Z`} fill="#0b0b0e" stroke="#2a2a30" strokeOpacity="0.5" />
      ))}

      {/* feu de camp et épée enroulée */}
      <g transform="translate(560 790)">
        <circle cx="0" cy="-40" r="260" fill="url(#h-fire)" opacity="0.55" className="motion-safe:animate-flicker" />
        <circle cx="0" cy="-30" r="120" fill="url(#h-fire)" className="motion-safe:animate-flicker" />
        <ellipse cx="0" cy="6" rx="86" ry="16" fill="#1a1210" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${-70 + i * 17} 6 L${-60 + i * 17} -14 L${-48 + i * 17} 6 Z`} fill="#241915" />
        ))}
        {/* flammes */}
        <path d="M-34 -2 C -40 -50, -10 -70, -4 -120 C 10 -80, 30 -60, 26 -2 Z" fill="#e0814f" opacity="0.85" className="motion-safe:animate-flicker" />
        <path d="M-16 -2 C -18 -40, 2 -60, 6 -96 C 16 -60, 20 -40, 14 -2 Z" fill="#ffd9a0" opacity="0.9" className="motion-safe:animate-flicker" />
        {/* épée */}
        <rect x="-5" y="-210" width="10" height="200" fill="url(#h-blade)" />
        <rect x="-26" y="-214" width="52" height="7" fill="#8a7350" />
        <rect x="-4" y="-246" width="8" height="34" fill="#4a3a2a" />
        <circle cx="0" cy="-250" r="7" fill="#8a7350" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M-9 ${-196 + i * 20} C 0 ${-206 + i * 20}, 12 ${-196 + i * 20}, 9 ${-186 + i * 20}`} stroke="#c9a870" strokeOpacity="0.8" strokeWidth="2" fill="none" />
        ))}
      </g>

      <rect width={W} height={H} fill="url(#h-hatch)" />
    </svg>
  );
}

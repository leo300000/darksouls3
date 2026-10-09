import { seeded } from "@/lib/random";

/** Couche de braises animées en CSS pur (désactivée si prefers-reduced-motion ou préférence utilisateur). */
export function Embers({ count = 22, seed = "embers", className = "" }: { count?: number; seed?: string; className?: string }) {
  const r = seeded(seed);
  const embers = Array.from({ length: count }, () => ({
    left: r.range(0, 100),
    size: r.range(1.5, 3.8),
    dur: r.range(9, 22),
    delay: -r.range(0, 22),
    drift: r.range(-80, 80),
    hue: r.next() > 0.7 ? "var(--c-gold-hi)" : "var(--c-ember-hi)",
  }));
  return (
    <div className={`embers-layer pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {embers.map((e, i) => (
        <span
          key={i}
          className="absolute bottom-[-10px] rounded-full animate-ember"
          style={
            {
              left: `${e.left}%`,
              width: e.size,
              height: e.size,
              background: `rgb(${e.hue})`,
              boxShadow: `0 0 ${e.size * 4}px rgb(${e.hue} / 0.9)`,
              animationDelay: `${e.delay}s`,
              "--ember-dur": `${e.dur}s`,
              "--ember-drift": `${e.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

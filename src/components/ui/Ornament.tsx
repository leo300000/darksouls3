/** Séparateur gravé inspiré des enluminures. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/40" />
      <svg width="64" height="14" viewBox="0 0 64 14" className="text-gold/70">
        <path d="M2 7h20M42 7h20" stroke="currentColor" strokeWidth="0.8" />
        <path d="M32 1 L38 7 L32 13 L26 7 Z" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="32" cy="7" r="1.6" fill="rgb(var(--c-ember-hi))" />
        <circle cx="23" cy="7" r="1" fill="currentColor" />
        <circle cx="41" cy="7" r="1" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  );
}

export function SectionTitle({ overline, title, children, id }: { overline?: string; title: string; children?: React.ReactNode; id?: string }) {
  return (
    <div className="mb-6" id={id}>
      {overline && <p className="eyebrow mb-2">{overline}</p>}
      <h2 className="h-section scroll-mt-24">{title}</h2>
      {children && <div className="mt-3 max-w-2xl text-dim">{children}</div>}
    </div>
  );
}

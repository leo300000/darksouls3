const LABELS = ["", "Accessible", "Modérée", "Exigeante", "Difficile", "Redoutable"];

/** Difficulté indicative : estimation éditoriale, jamais une donnée du jeu. */
export function Difficulty({ level, note, compact = false }: { level: 1 | 2 | 3 | 4 | 5; note?: string; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2" title="Estimation éditoriale, non issue du jeu">
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`inline-block h-2 w-2 rotate-45 ${i <= level ? "bg-ember-hi" : "border border-line/30"}`} />
        ))}
      </span>
      <span className={compact ? "text-[0.7rem] text-dim" : "text-sm text-text"}>
        {LABELS[level]}
        <span className="sr-only"> (difficulté estimée {level} sur 5)</span>
      </span>
      {note && !compact && <span className="text-sm text-dim">— {note}</span>}
    </span>
  );
}

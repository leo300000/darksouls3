import type { Confidence, Dlc } from "@/data/types";

const DLC_LABEL: Record<Dlc, string> = { base: "Jeu de base", "ashes-of-ariandel": "Ashes of Ariandel", "ringed-city": "The Ringed City" };

export function dlcLabel(d: Dlc) {
  return DLC_LABEL[d];
}

export function DlcBadge({ dlc, hideBase = false }: { dlc: Dlc; hideBase?: boolean }) {
  if (dlc === "base" && hideBase) return null;
  const tone = dlc === "base" ? "border-line/30 text-dim" : dlc === "ashes-of-ariandel" ? "border-frost/50 text-frost" : "border-ember-hi/50 text-ember-hi";
  return (
    <span className={`inline-flex items-center gap-1 border px-2 py-0.5 font-engrave text-[0.6rem] uppercase tracking-[0.16em] ${tone}`}>
      {dlc !== "base" && <span aria-hidden>◆</span>}
      {DLC_LABEL[dlc]}
    </span>
  );
}

const CONF: Record<Confidence, { label: string; cls: string; help: string }> = {
  game: { label: "Établi par le jeu", cls: "border-gold/50 text-gold-hi", help: "Directement établi par le jeu (texte, dialogue, événement observable)." },
  reference: { label: "Référence documentée", cls: "border-moss/60 text-moss", help: "Issu d'une référence communautaire documentée (voir Sources)." },
  deduction: { label: "Déduction étayée", cls: "border-frost/50 text-frost", help: "Déduction fortement étayée par plusieurs éléments du jeu." },
  theory: { label: "Théorie", cls: "border-ember-hi/50 text-ember-hi", help: "Théorie communautaire discutable." },
  unverified: { label: "À vérifier", cls: "border-ash/60 text-ash", help: "Connaissance de rédaction non recoupée pendant la session." },
};

export function ConfidenceBadge({ level, className = "" }: { level: Confidence; className?: string }) {
  const c = CONF[level];
  return (
    <span title={c.help} className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[0.68rem] tracking-wide ${c.cls} ${className}`}>
      <span aria-hidden className="inline-block h-1.5 w-1.5 rotate-45 border border-current" />
      {c.label}
    </span>
  );
}

export function confidenceHelp(level: Confidence) {
  return CONF[level].help;
}

export function Tag({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "ember" | "gold" | "frost" }) {
  const cls = {
    default: "border-line/25 text-dim",
    ember: "border-ember-hi/50 text-ember-hi",
    gold: "border-gold/50 text-gold-hi",
    frost: "border-frost/50 text-frost",
  }[tone];
  return <span className={`inline-flex items-center border px-2 py-0.5 text-[0.72rem] ${cls}`}>{children}</span>;
}

/** Donnée absente : affichée honnêtement plutôt qu'inventée. */
export function Missing({ children = "Donnée non renseignée — à compléter", compact = false }: { children?: React.ReactNode; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 italic text-ash ${compact ? "text-xs" : "text-sm"}`}>
      <span aria-hidden className="inline-block h-px w-3 bg-ash/60" />
      {children}
    </span>
  );
}

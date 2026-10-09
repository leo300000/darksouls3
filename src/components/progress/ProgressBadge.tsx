"use client";

import Link from "next/link";
import { activeProfile, useHydrated, useStore } from "@/lib/store";
import { globalProgress, useManifest } from "@/lib/progress";

export function ProgressBadge() {
  const store = useStore();
  const hydrated = useHydrated();
  const manifest = useManifest();
  const profile = activeProfile(store);
  const g = manifest && hydrated ? globalProgress(manifest, profile) : null;
  const pct = g ? Math.floor(g.pct * 1000) / 10 : null;
  return (
    <Link href="/completion" className="group block" aria-label="Voir le centre de progression">
      <div className="flex items-baseline justify-between">
        <span className="font-engrave text-[0.6rem] text-gold/80">{hydrated ? profile.name : "Progression"}</span>
        <span className="font-mono text-xs text-text">{pct === null ? "…" : `${pct.toLocaleString("fr-FR")} %`}</span>
      </div>
      <div className="mt-2 h-1 w-full bg-stone/60" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct ?? 0}>
        <div className="h-full bg-gradient-to-r from-ember to-gold-hi transition-all" style={{ width: `${pct ?? 0}%` }} />
      </div>
      {hydrated && profile.ngCycle > 0 && <span className="mt-1 block font-mono text-[0.65rem] text-ash">NG+{profile.ngCycle > 1 ? profile.ngCycle : ""}</span>}
    </Link>
  );
}

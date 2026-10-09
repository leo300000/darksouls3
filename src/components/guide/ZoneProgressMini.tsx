"use client";

import { activeProfile, useHydrated, useStore } from "@/lib/store";

export function ZoneProgressMini({ ids }: { ids: string[] }) {
  const store = useStore();
  const hydrated = useHydrated();
  const p = activeProfile(store);
  const done = hydrated ? ids.filter((id) => p.checked[id]).length : 0;
  const pct = ids.length ? (done / ids.length) * 100 : 0;
  return (
    <div className="mt-3">
      <div className="h-1 bg-stone/50">
        <div className="h-full bg-gradient-to-r from-ember to-gold" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 font-mono text-[0.65rem] text-ash">
        {hydrated ? `${done}/${ids.length} étapes` : `${ids.length} étapes`}
      </p>
    </div>
  );
}

"use client";

import { Search } from "lucide-react";

export const OPEN_SEARCH_EVENT = "ashen-archive:open-search";

export function openSearch(initial?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT, { detail: initial ?? "" }));
}

export function SearchTrigger({ variant = "bar" }: { variant?: "bar" | "sidebar" | "icon" }) {
  if (variant === "icon") {
    return (
      <button type="button" onClick={() => openSearch()} className="btn btn-ghost btn-sm px-2.5" aria-label="Ouvrir la recherche (Ctrl+K)">
        <Search size={18} strokeWidth={1.5} />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => openSearch()}
      className={`group flex w-full items-center gap-3 border border-line/25 bg-void/60 px-3 text-left text-dim transition hover:border-gold/50 hover:text-text ${
        variant === "sidebar" ? "min-h-[40px] text-sm" : "min-h-[48px]"
      }`}
      aria-label="Ouvrir la recherche globale (raccourci Ctrl+K ou /)"
    >
      <Search size={16} strokeWidth={1.5} className="text-gold" />
      <span className="flex-1 truncate">{variant === "sidebar" ? "Rechercher…" : "Rechercher dans les archives…"}</span>
      <kbd className="hidden rounded-sm border border-line/30 px-1.5 py-0.5 font-mono text-[0.65rem] text-ash sm:inline">Ctrl K</kbd>
    </button>
  );
}

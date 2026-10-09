"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useStore } from "@/lib/store";

/** Bloc à spoilers, masqué par défaut (sauf si l'utilisateur a choisi de tout afficher). */
export function Spoiler({ children, label = "Contient des révélations", className = "" }: { children: React.ReactNode; label?: string; className?: string }) {
  const { prefs } = useStore();
  const [revealed, setRevealed] = useState<boolean | null>(null);
  const shown = revealed ?? prefs.spoilers === "show";
  return (
    <div className={`relative ${className}`}>
      <div className={shown ? "" : "spoiler-veil"} aria-hidden={!shown}>
        {children}
      </div>
      {!shown && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button type="button" className="btn btn-sm bg-night/90" onClick={() => setRevealed(true)}>
            <Eye size={14} /> {label} — révéler
          </button>
        </div>
      )}
      {shown && revealed && (
        <button type="button" className="mt-2 inline-flex items-center gap-1 text-xs text-ash hover:text-text" onClick={() => setRevealed(false)}>
          <EyeOff size={12} /> Masquer à nouveau
        </button>
      )}
    </div>
  );
}

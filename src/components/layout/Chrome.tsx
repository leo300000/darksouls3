"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useStore } from "@/lib/store";

/** Applique les préférences (thème, mouvements réduits) sur <html>. */
export function PrefsApplier() {
  const { prefs } = useStore();
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = prefs.theme;
    if (prefs.motion === "reduced") root.dataset.motion = "reduced";
    else delete root.dataset.motion;
    root.dataset.embers = prefs.embers ? "on" : "off";
    root.dataset.spoilers = prefs.spoilers;
  }, [prefs]);
  return null;
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="btn fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full p-0 shadow-lg"
      aria-label="Retour en haut de page"
    >
      <ArrowUp size={18} />
    </button>
  );
}

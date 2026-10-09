"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NavLinks } from "./Sidebar";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { ProgressBadge } from "@/components/progress/ProgressBadge";

export function MobileTopBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // ferme le tiroir à chaque navigation
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b border-line/15 bg-night/90 px-3 backdrop-blur lg:hidden">
        <button type="button" className="btn btn-ghost btn-sm px-2.5" onClick={() => setOpen(true)} aria-label="Ouvrir le menu" aria-expanded={open} aria-controls="mobile-drawer">
          <Menu size={20} strokeWidth={1.5} />
        </button>
        <Link href="/" className="flex-1 truncate text-center font-display text-xl font-semibold text-parch">
          The Ashen Archive
        </Link>
        <SearchTrigger variant="icon" />
      </header>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-black/70" aria-label="Fermer le menu" onClick={() => setOpen(false)} />
          <div id="mobile-drawer" className="anim-page absolute inset-y-0 left-0 flex w-[86vw] max-w-[320px] flex-col border-r border-line/20 bg-night">
            <div className="flex items-center justify-between px-5 pb-3 pt-5">
              <span className="font-display text-2xl font-semibold text-parch">The Ashen Archive</span>
              <button type="button" className="btn btn-ghost btn-sm px-2" onClick={() => setOpen(false)} aria-label="Fermer le menu">
                <X size={20} />
              </button>
            </div>
            <div className="px-4 pb-3">
              <SearchTrigger variant="sidebar" />
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-6">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <div className="border-t border-line/15 px-5 py-4">
              <ProgressBadge />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

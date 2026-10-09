"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, History, Loader2, Search, X } from "lucide-react";
import { groupHits, loadIndex, search, type SearchDoc, type SearchHit } from "@/lib/search";
import { recordSearch, useStore } from "@/lib/store";
import { OPEN_SEARCH_EVENT } from "./SearchTrigger";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchDoc[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const store = useStore();

  const ensureIndex = useCallback(() => {
    if (index) return;
    loadIndex()
      .then((x) => {
        setError(null);
        setIndex(x);
      })
      .catch(() => setError("L'index de recherche n'a pas pu être chargé. Vérifiez votre connexion puis réessayez."));
  }, [index]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      setQuery((e as CustomEvent<string>).detail ?? "");
      setActive(0);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    ensureIndex();
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open, ensureIndex]);

  const hits: SearchHit[] = useMemo(() => (index ? search(index, query, 40) : []), [index, query]);
  const groups = useMemo(() => groupHits(hits), [hits]);
  const flat = useMemo(() => groups.flatMap((g) => g.hits), [groups]);

  const go = useCallback(
    (h: SearchDoc) => {
      recordSearch(query || h.t);
      setOpen(false);
      router.push(h.h);
    },
    [query, router],
  );

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(flat.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      if (flat[active]) go(flat[active]);
      else if (query.trim()) {
        recordSearch(query);
        setOpen(false);
        router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  let idx = -1;
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 px-3 pt-[8vh] backdrop-blur-sm" onMouseDown={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Recherche globale"
        className="panel-raised frame-corners anim-page w-full max-w-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line/20 px-4">
          <Search size={18} className="text-gold" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Boss, arme, quête, zone, sort…"
            className="min-h-[56px] flex-1 bg-transparent text-lg text-parch outline-none placeholder:text-ash"
            aria-label="Terme recherché"
            aria-controls="search-results"
            aria-activedescendant={flat[active] ? `sr-${active}` : undefined}
            role="combobox"
            aria-expanded="true"
          />
          <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost btn-sm px-2" aria-label="Fermer la recherche">
            <X size={18} />
          </button>
        </div>
        <div ref={listRef} id="search-results" role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
          {error && <p className="p-4 text-sm text-ember-hi">{error}</p>}
          {!index && !error && (
            <p className="flex items-center gap-2 p-4 text-sm text-dim">
              <Loader2 size={16} className="animate-spin" /> Ouverture des archives…
            </p>
          )}
          {index && !query.trim() && (
            <div className="p-3">
              {store.recentSearches.length > 0 ? (
                <>
                  <p className="eyebrow mb-2">Recherches récentes</p>
                  <div className="flex flex-wrap gap-2">
                    {store.recentSearches.map((r) => (
                      <button key={r} type="button" className="chip" onClick={() => setQuery(r)}>
                        <History size={13} /> {r}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-dim">
                  Tapez un nom : « Gundyr », « Anri », « épée lune », « Storm Ruler »… La recherche ignore les accents et les majuscules.
                </p>
              )}
            </div>
          )}
          {index && query.trim() && flat.length === 0 && (
            <div className="p-5 text-sm text-dim">
              <p className="text-text">Aucune archive ne correspond à « {query} ».</p>
              <p className="mt-2">Essayez un nom anglais d&apos;objet (les objets sont listés sous leur nom officiel anglais), un mot plus court, ou parcourez les catalogues.</p>
            </div>
          )}
          {groups.map((g) => (
            <div key={g.category} className="mb-2">
              <p className="eyebrow px-3 pb-1 pt-2 text-[0.6rem]">{g.category}</p>
              {g.hits.map((h) => {
                idx++;
                const i = idx;
                const selected = i === active;
                return (
                  <button
                    key={h.h + h.t}
                    id={`sr-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={selected}
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(h)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${selected ? "bg-gold/12 text-parch" : "text-text hover:bg-stone/30"}`}
                  >
                    <span className="flex-1 truncate">
                      <span className="font-medium">{h.t}</span>
                      {h.s && <span className="ml-2 text-sm text-dim">{h.s}</span>}
                    </span>
                    {selected && <CornerDownLeft size={14} className="text-gold" aria-hidden />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/20 px-4 py-2 text-[0.72rem] text-ash">
          <span>↑ ↓ pour naviguer · Entrée pour ouvrir · Échap pour fermer</span>
          {query.trim() && (
            <button
              type="button"
              className="link-archive"
              onClick={() => {
                recordSearch(query);
                setOpen(false);
                router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
              }}
            >
              Tous les résultats
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

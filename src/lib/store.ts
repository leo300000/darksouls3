"use client";

/**
 * Sauvegarde locale (localStorage) : profils de progression, favoris, historique, préférences.
 * Une seule clé versionnée. Toute lecture/écriture est protégée (navigation privée, quota…).
 * L'architecture permet de remplacer plus tard ce stockage par une synchronisation serveur :
 * seules les fonctions `readStore` / `writeStore` seraient à adapter.
 */
import { useSyncExternalStore, useCallback } from "react";

export const STORE_KEY = "ashen-archive:v1";
const EVENT = "ashen-archive:change";

export type QuestStatus = "non-commencee" | "en-cours" | "attente" | "terminee" | "bloquee" | "manquee";

export interface Profile {
  id: string;
  name: string;
  ngCycle: number; // 0 = NG, 1 = NG+, …
  checked: Record<string, true>;
  questStatus: Record<string, QuestStatus>;
  endingTarget: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  href: string;
  title: string;
  kind: string;
  at: string;
}

export interface Prefs {
  theme: "dark" | "light";
  spoilers: "hide" | "show";
  motion: "auto" | "reduced";
  embers: boolean;
}

export interface StoreData {
  version: 1;
  activeProfile: string;
  profiles: Record<string, Profile>;
  favorites: { href: string; title: string; kind: string }[];
  history: HistoryEntry[];
  recentSearches: string[];
  prefs: Prefs;
}

function newProfile(name: string): Profile {
  const now = new Date().toISOString();
  return {
    id: `p-${Math.random().toString(36).slice(2, 9)}`,
    name,
    ngCycle: 0,
    checked: {},
    questStatus: {},
    endingTarget: null,
    createdAt: now,
    updatedAt: now,
  };
}

function defaults(): StoreData {
  const p = newProfile("Partie principale");
  return {
    version: 1,
    activeProfile: p.id,
    profiles: { [p.id]: p },
    favorites: [],
    history: [],
    recentSearches: [],
    prefs: { theme: "dark", spoilers: "hide", motion: "auto", embers: true },
  };
}

const SERVER_SNAPSHOT = defaults();
let cache: StoreData | null = null;

/** Valide grossièrement une structure importée ou lue (protection contre les données corrompues). */
export function sanitize(input: unknown): StoreData | null {
  if (!input || typeof input !== "object") return null;
  const d = input as Partial<StoreData>;
  if (d.version !== 1 || typeof d.profiles !== "object" || !d.profiles) return null;
  const base = defaults();
  const profiles: Record<string, Profile> = {};
  for (const [id, p] of Object.entries(d.profiles)) {
    if (!p || typeof p !== "object") continue;
    const pp = p as Partial<Profile>;
    profiles[id] = {
      id,
      name: typeof pp.name === "string" ? pp.name.slice(0, 60) : "Partie",
      ngCycle: Number.isInteger(pp.ngCycle) ? Math.max(0, Math.min(9, pp.ngCycle as number)) : 0,
      checked: pp.checked && typeof pp.checked === "object" ? Object.fromEntries(Object.keys(pp.checked).filter((k) => k.length < 200).map((k) => [k, true as const])) : {},
      questStatus: pp.questStatus && typeof pp.questStatus === "object" ? (pp.questStatus as Record<string, QuestStatus>) : {},
      endingTarget: typeof pp.endingTarget === "string" ? pp.endingTarget : null,
      createdAt: typeof pp.createdAt === "string" ? pp.createdAt : new Date().toISOString(),
      updatedAt: typeof pp.updatedAt === "string" ? pp.updatedAt : new Date().toISOString(),
    };
  }
  const ids = Object.keys(profiles);
  if (ids.length === 0) return null;
  return {
    version: 1,
    activeProfile: d.activeProfile && profiles[d.activeProfile] ? d.activeProfile : ids[0],
    profiles,
    favorites: Array.isArray(d.favorites) ? d.favorites.filter((f) => f && typeof f.href === "string" && f.href.startsWith("/")).slice(0, 300) : [],
    history: Array.isArray(d.history) ? d.history.filter((h) => h && typeof h.href === "string" && h.href.startsWith("/")).slice(0, 60) : [],
    recentSearches: Array.isArray(d.recentSearches) ? d.recentSearches.filter((s) => typeof s === "string").slice(0, 8) : [],
    prefs: { ...base.prefs, ...(d.prefs ?? {}) },
  };
}

function readStore(): StoreData {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    cache = (raw && sanitize(JSON.parse(raw))) || defaults();
  } catch {
    cache = defaults();
  }
  return cache;
}

function writeStore(next: StoreData) {
  cache = next;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
  } catch {
    /* stockage indisponible : l'état reste en mémoire pour la session */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORE_KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStore(): StoreData {
  return useSyncExternalStore(subscribe, readStore, () => SERVER_SNAPSHOT);
}

/** Vrai une fois l'état local chargé (évite d'afficher des pourcentages trompeurs côté serveur). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function update(fn: (draft: StoreData) => StoreData) {
  writeStore(fn(structuredClone(readStore())));
}

export function activeProfile(s: StoreData): Profile {
  return s.profiles[s.activeProfile] ?? Object.values(s.profiles)[0];
}

function touch(p: Profile) {
  p.updatedAt = new Date().toISOString();
}

export function setChecked(id: string, value: boolean) {
  update((s) => {
    const p = activeProfile(s);
    if (value) p.checked[id] = true;
    else delete p.checked[id];
    touch(p);
    return s;
  });
}

export function setManyChecked(ids: string[], value: boolean) {
  update((s) => {
    const p = activeProfile(s);
    for (const id of ids) {
      if (value) p.checked[id] = true;
      else delete p.checked[id];
    }
    touch(p);
    return s;
  });
}

export function useChecked(id: string): [boolean, (v: boolean) => void] {
  const s = useStore();
  const checked = !!activeProfile(s).checked[id];
  const set = useCallback((v: boolean) => setChecked(id, v), [id]);
  return [checked, set];
}

export function setQuestStatus(npc: string, status: QuestStatus) {
  update((s) => {
    const p = activeProfile(s);
    p.questStatus[npc] = status;
    touch(p);
    return s;
  });
}

export function setEndingTarget(slug: string | null) {
  update((s) => {
    activeProfile(s).endingTarget = slug;
    return s;
  });
}

export function toggleFavorite(entry: { href: string; title: string; kind: string }) {
  update((s) => {
    const i = s.favorites.findIndex((f) => f.href === entry.href);
    if (i >= 0) s.favorites.splice(i, 1);
    else s.favorites.unshift(entry);
    return s;
  });
}

export function recordVisit(entry: Omit<HistoryEntry, "at">) {
  update((s) => {
    s.history = [{ ...entry, at: new Date().toISOString() }, ...s.history.filter((h) => h.href !== entry.href)].slice(0, 40);
    return s;
  });
}

export function recordSearch(q: string) {
  const query = q.trim();
  if (query.length < 2) return;
  update((s) => {
    s.recentSearches = [query, ...s.recentSearches.filter((x) => x !== query)].slice(0, 8);
    return s;
  });
}

export function setPrefs(patch: Partial<Prefs>) {
  update((s) => {
    s.prefs = { ...s.prefs, ...patch };
    return s;
  });
}

export function createProfile(name: string) {
  update((s) => {
    const p = newProfile(name.trim().slice(0, 60) || "Nouvelle partie");
    s.profiles[p.id] = p;
    s.activeProfile = p.id;
    return s;
  });
}

export function switchProfile(id: string) {
  update((s) => {
    if (s.profiles[id]) s.activeProfile = id;
    return s;
  });
}

export function renameProfile(id: string, name: string) {
  update((s) => {
    if (s.profiles[id]) s.profiles[id].name = name.trim().slice(0, 60) || s.profiles[id].name;
    return s;
  });
}

export function setNgCycle(n: number) {
  update((s) => {
    activeProfile(s).ngCycle = Math.max(0, Math.min(9, n));
    return s;
  });
}

export function deleteProfile(id: string) {
  update((s) => {
    if (Object.keys(s.profiles).length <= 1) return s;
    delete s.profiles[id];
    if (s.activeProfile === id) s.activeProfile = Object.keys(s.profiles)[0];
    return s;
  });
}

/** Remet à zéro la progression du profil actif (favoris et préférences conservés). */
export function resetActiveProfile() {
  update((s) => {
    const p = activeProfile(s);
    p.checked = {};
    p.questStatus = {};
    p.endingTarget = null;
    touch(p);
    return s;
  });
}

export function exportData(): string {
  return JSON.stringify({ ...readStore(), exportedAt: new Date().toISOString(), app: "the-ashen-archive" }, null, 2);
}

export function importData(json: string): { ok: true } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "Le fichier n'est pas un JSON valide." };
  }
  const clean = sanitize(parsed);
  if (!clean) return { ok: false, error: "Ce fichier ne correspond pas au format de sauvegarde de The Ashen Archive (version 1)." };
  writeStore(clean);
  return { ok: true };
}

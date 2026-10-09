"use client";

import { useEffect, useState } from "react";
import type { Profile } from "./store";

export interface ManifestCategory {
  id: string;
  label: string;
  mode: "check" | "quest";
  ids: string[];
}

let manifestPromise: Promise<ManifestCategory[]> | null = null;

export function loadManifest(): Promise<ManifestCategory[]> {
  if (!manifestPromise) {
    manifestPromise = fetch("/completion-manifest.json")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .catch((e) => {
        manifestPromise = null;
        throw e;
      });
  }
  return manifestPromise;
}

export function useManifest(): ManifestCategory[] | null {
  const [m, setM] = useState<ManifestCategory[] | null>(null);
  useEffect(() => {
    let alive = true;
    loadManifest()
      .then((x) => alive && setM(x))
      .catch(() => alive && setM([]));
    return () => {
      alive = false;
    };
  }, []);
  return m;
}

export function categoryProgress(cat: ManifestCategory, profile: Profile) {
  const done = cat.mode === "quest"
    ? cat.ids.filter((id) => profile.questStatus[id.replace(/^quete:/, "")] === "terminee").length
    : cat.ids.filter((id) => profile.checked[id]).length;
  return { done, total: cat.ids.length, pct: cat.ids.length ? done / cat.ids.length : 0 };
}

/** Progression globale : moyenne pondérée par le nombre d'éléments. Jamais « 100 % » si une catégorie est vide. */
export function globalProgress(manifest: ManifestCategory[], profile: Profile) {
  let done = 0;
  let total = 0;
  for (const c of manifest) {
    const p = categoryProgress(c, profile);
    done += p.done;
    total += p.total;
  }
  return { done, total, pct: total ? done / total : 0 };
}

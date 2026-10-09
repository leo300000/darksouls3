"use client";

import Link from "next/link";
import { activeProfile, useHydrated, useStore } from "@/lib/store";
import { categoryProgress, globalProgress, useManifest } from "@/lib/progress";

export function ContinueJourney({ questTitles }: { questTitles: Record<string, string> }) {
  const store = useStore();
  const hydrated = useHydrated();
  const manifest = useManifest();
  const profile = activeProfile(store);
  const lastZone = store.history.find((h) => h.kind === "Zone");
  const lastBoss = store.history.find((h) => h.kind === "Boss");
  const inProgress = Object.entries(profile.questStatus).filter(([, s]) => s === "en-cours" || s === "attente");
  const g = manifest && hydrated ? globalProgress(manifest, profile) : null;
  const missables = manifest?.find((c) => c.id === "manquables");
  const missableLeft = missables && hydrated ? missables.ids.length - categoryProgress(missables, profile).done : null;
  const empty = hydrated && !lastZone && !lastBoss && inProgress.length === 0 && (g?.done ?? 0) === 0;

  return (
    <div className="grid gap-4 md:grid-cols-[1.3fr_1fr_1fr]">
      <div className="panel-raised frame-corners p-6">
        <p className="eyebrow">Votre progression</p>
        <p className="mt-3 font-display text-5xl font-semibold text-parch">
          {g ? `${(Math.floor(g.pct * 1000) / 10).toLocaleString("fr-FR")} %` : "…"}
        </p>
        <p className="mt-1 text-sm text-dim">
          {g ? `${g.done.toLocaleString("fr-FR")} éléments sur ${g.total.toLocaleString("fr-FR")} · profil « ${profile.name} »` : "Chargement de votre sauvegarde locale…"}
        </p>
        <div className="mt-4 h-1.5 bg-stone/50">
          <div className="h-full bg-gradient-to-r from-ember to-gold-hi" style={{ width: `${(g?.pct ?? 0) * 100}%` }} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/completion" className="btn btn-sm">Centre de progression</Link>
          {missableLeft !== null && missableLeft > 0 && (
            <Link href="/completion#manquables" className="btn btn-sm btn-ghost">{missableLeft} éléments manquables restants</Link>
          )}
        </div>
      </div>
      <div className="panel p-6">
        <p className="eyebrow">Dernière zone consultée</p>
        {lastZone ? (
          <Link href={lastZone.href} className="mt-3 block font-display text-2xl text-parch hover:text-gold-hi">{lastZone.title}</Link>
        ) : (
          <p className="mt-3 text-sm text-dim">{empty ? "Votre voyage n'a pas encore commencé." : "Aucune zone consultée."}</p>
        )}
        <p className="eyebrow mt-6">Dernier boss étudié</p>
        {lastBoss ? (
          <Link href={lastBoss.href} className="mt-3 block font-display text-2xl text-parch hover:text-gold-hi">{lastBoss.title}</Link>
        ) : (
          <p className="mt-3 text-sm text-dim">Aucun boss consulté.</p>
        )}
      </div>
      <div className="panel p-6">
        <p className="eyebrow">Quêtes en cours</p>
        {inProgress.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm">
            {inProgress.slice(0, 5).map(([slug, s]) => (
              <li key={slug} className="flex items-center justify-between gap-2">
                <Link className="link-archive" href={`/pnj/${slug}#quete`}>{questTitles[slug] ?? slug}</Link>
                <span className="text-xs text-ash">{s === "attente" ? "en attente" : "en cours"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-dim">
            Marquez une quête « en cours » depuis la page d&apos;un personnage ou le <Link href="/quetes" className="link-archive">tableau des quêtes</Link>.
          </p>
        )}
        {empty && (
          <Link href="/guide/cimetiere-des-cendres" className="btn btn-ember btn-sm mt-5">Commencer au Cimetière des Cendres</Link>
        )}
      </div>
    </div>
  );
}

export function RecentlyViewed() {
  const store = useStore();
  const hydrated = useHydrated();
  if (!hydrated) return <p className="text-sm text-dim">Chargement de l&apos;historique…</p>;
  if (store.history.length === 0)
    return <p className="text-sm text-dim">Les fiches que vous consultez apparaîtront ici (historique conservé uniquement dans ce navigateur).</p>;
  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {store.history.slice(0, 8).map((h) => (
        <li key={h.href}>
          <Link href={h.href} className="panel card-link block p-4">
            <span className="eyebrow text-[0.58rem]">{h.kind}</span>
            <span className="mt-1 block truncate font-display text-lg text-parch">{h.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

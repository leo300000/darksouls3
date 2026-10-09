"use client";

import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-8">
      <p className="eyebrow">Erreur</p>
      <h1 className="title-monument mt-3 text-5xl">La flamme vacille.</h1>
      <p className="mt-4 text-dim">Une erreur inattendue a empêché l&apos;affichage de cette page. Vous pouvez réessayer ; votre progression locale n&apos;est pas affectée.</p>
      {error.digest && <p className="mt-2 font-mono text-xs text-ash">Référence : {error.digest}</p>}
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={reset} className="btn btn-ember">Réessayer</button>
        <Link href="/" className="btn">Accueil</Link>
      </div>
    </div>
  );
}

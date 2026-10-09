import type { Metadata } from "next";
import Link from "next/link";
import { Engraving } from "@/components/art/Engraving";
import { SearchTrigger } from "@/components/search/SearchTrigger";

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-[80vh] items-center overflow-hidden">
      <Engraving spec={{ palette: "abyss", motif: "cemetery" }} seed="404" className="absolute inset-0 -z-10 h-full w-full opacity-50" caption={false} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-void via-void/80 to-transparent" />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="title-monument mt-3 text-[clamp(3rem,2rem+5vw,6rem)]">Vous êtes mort.</h1>
        <p className="mt-4 max-w-lg text-lg text-dim">Cette page s&apos;est consumée — ou n&apos;a jamais existé dans les archives. Aucune âme perdue : il suffit de revenir au dernier feu.</p>
        <div className="mt-8 max-w-md"><SearchTrigger /></div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-ember">Retour au feu</Link>
          <Link href="/guide" className="btn">Guide de l&apos;aventure</Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line/15 bg-night/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-semibold text-parch">The Ashen Archive</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-dim">
            Encyclopédie de fan, non officielle et sans affiliation avec FromSoftware ou Bandai Namco. Dark Souls est une marque de ses détenteurs respectifs.
            Les illustrations du site sont des gravures générées ; aucune ressource officielle n&apos;est redistribuée.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Archives</p>
          <ul className="space-y-2 text-sm">
            <li><Link className="link-archive" href="/a-propos">Sources et fiabilité</Link></li>
            <li><Link className="link-archive" href="/parametres">Sauvegarde, import et export</Link></li>
            <li><Link className="link-archive" href="/completion">Centre de progression</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Crédits</p>
          <p className="text-sm leading-relaxed text-dim">
            Parcours détaillé et listes de complétion adaptés de{" "}
            <a className="link-archive" href="https://github.com/ZKjellberg/dark-souls-3-cheat-sheet" rel="noopener noreferrer" target="_blank">
              Dark Souls 3 Cheat Sheet
            </a>{" "}
            (Zachary Kjellberg &amp; contributeurs, licence MIT), traduits en français.
          </p>
        </div>
      </div>
    </footer>
  );
}

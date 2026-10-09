import { Engraving } from "./Engraving";
import { bossEmblems } from "@/data/emblems";
import { displayableBossImage } from "@/data/boss-images";
import type { ArtSpec } from "@/data/types";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Portrait d'un boss : image locale intégrée (statut « integre ») si elle existe,
 * sinon emblème généré, explicitement signalé comme provisoire.
 * Format réservé dans tous les cas (3:4, ou 16:10 pour les cartes) : aucun saut de mise en page.
 */
export function BossPortrait({
  slug,
  name,
  art,
  size,
  className = "",
  imgClassName = "",
  eager = false,
}: {
  slug: string;
  name: string;
  art: ArtSpec;
  size: "full" | "thumb" | "card";
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const img = displayableBossImage(slug);
  const ratio = size === "card" ? "aspect-[16/10]" : "aspect-[3/4]";
  if (img) {
    const src = size === "full" ? img.file : size === "card" ? img.card : img.thumb;
    const dims = size === "full" ? [img.width, img.height] : size === "card" ? [800, 500] : [img.width / 2, img.height / 2];
    return (
      <div className={`relative ${ratio} overflow-hidden bg-night ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- export statique : images déjà optimisées (WebP, deux tailles) */}
        <img
          src={`${BASE}/${src}`}
          srcSet={size === "full" ? `${BASE}/${img.thumb} ${img.width / 2}w, ${BASE}/${img.file} ${img.width}w` : undefined}
          sizes={size === "full" ? "(min-width: 768px) 320px, 100vw" : undefined}
          width={dims[0]}
          height={dims[1]}
          alt={img.alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      </div>
    );
  }
  return (
    <div className={`relative ${ratio} overflow-hidden ${className}`}>
      <Engraving spec={art} seed={slug} variant="sigil" emblem={bossEmblems[slug]} caption={false} title={name} className={`h-full w-full ${imgClassName}`} />
      <span className="absolute bottom-2 left-2 border border-line/30 bg-void/75 px-1.5 py-0.5 text-[0.6rem] tracking-wide text-ash">
        {size === "full" ? "Emblème provisoire — illustration à produire" : "Emblème provisoire"}
      </span>
    </div>
  );
}

/** Légende de la fiche : crédit et licence de l'image, ou statut provisoire. */
export function bossPortraitCaption(slug: string): string {
  const img = displayableBossImage(slug);
  if (!img) return "Aucune image réutilisable légalement n'est encore disponible pour ce boss : l'emblème généré est provisoire. Aucune image officielle n'est intégrée.";
  return [img.source, img.author && `Auteur : ${img.author}`, img.license && `Licence : ${img.license}`].filter(Boolean).join(" · ");
}

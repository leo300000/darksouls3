import { illustrationFor } from "@/data/illustrations";
import { Engraving } from "./Engraving";
import type { EmblemKey } from "./emblems";
import type { ArtSpec } from "@/data/types";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Illustration d'une entité : fichier local déclaré dans le registre s'il existe,
 * sinon gravure générée (identifiée comme telle).
 */
export function Illustration({
  imageKey,
  spec,
  seed,
  className,
  title,
  caption,
  variant,
  emblem,
}: {
  imageKey: string;
  spec: ArtSpec;
  seed: string;
  className?: string;
  title?: string;
  caption?: boolean;
  variant?: "landscape" | "sigil";
  emblem?: EmblemKey;
}) {
  const img = illustrationFor(imageKey);
  if (img) {
    // eslint-disable-next-line @next/next/no-img-element -- export statique : pas d'optimisation d'image côté serveur
    return <img src={`${BASE}/${img.src}`} alt={img.alt} title={`${img.credit} — ${img.license}`} loading="lazy" decoding="async" className={`object-cover ${className ?? ""}`} />;
  }
  return <Engraving spec={spec} seed={seed} className={className} title={title} caption={caption} variant={variant} emblem={emblem} />;
}

export function hasIllustration(imageKey: string): boolean {
  return illustrationFor(imageKey) !== null;
}

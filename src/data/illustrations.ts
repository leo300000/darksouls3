import type { ImageRef } from "./types";

/**
 * Registre des illustrations réelles, fichiers locaux placés dans `public/illustrations/`.
 *
 * Clé : identifiant d'entité (`zone:<slug>`, `pnj:<slug>`, `fin:<slug>`, `lore:<slug>`).
 * Les boss ont leur propre bibliothèque : `src/data/boss-images.ts` (public/images/boss/).
 * `src` : chemin relatif à `public/`, sans préfixe (ex. "illustrations/boss/iudex-gundyr.webp") ;
 * le préfixe GitHub Pages (`/darksouls3`) est ajouté automatiquement.
 *
 * N'ajouter que des images originales ou dont la licence autorise la réutilisation, avec crédit
 * et licence renseignés. Tant qu'une entité n'a pas d'entrée, la gravure générée s'affiche.
 * `npm run data:validate` vérifie que chaque fichier déclaré existe.
 */
export const illustrations: Record<string, ImageRef> = {};

export function illustrationFor(key: string): ImageRef | null {
  return illustrations[key] ?? null;
}

/** Utilitaires de texte partagés (application et scripts). */

/** Supprime les accents et normalise pour la recherche. */
export function fold(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’`]/g, "'")
    .toLowerCase()
    .trim();
}

/** Identifiant d'URL stable à partir d'un nom. */
export function slugify(input: string): string {
  return fold(input)
    .replace(/'/g, "")
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Retire la quantité d'un libellé (« Firebomb x5 » → « Firebomb »). */
export function stripQuantity(label: string): string {
  return label.replace(/\s*x\s?\d+$/i, "").trim();
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

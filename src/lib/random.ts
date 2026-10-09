/** Générateur pseudo-aléatoire déterministe (mulberry32) initialisé par une chaîne. */
export function seeded(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    // Arrondi au centième : invisible à l'écran, mais évite d'écrire 16 décimales dans chaque SVG (poids des pages).
    range: (min: number, max: number) => Math.round((min + (max - min) * next()) * 100) / 100,
    int: (min: number, max: number) => Math.floor(min + (max - min + 1) * next()),
    pick: <T,>(arr: readonly T[]) => arr[Math.floor(next() * arr.length)],
  };
}

export type Rng = ReturnType<typeof seeded>;

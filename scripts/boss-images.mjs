/**
 * Produit les images de boss optimisées à partir des sources placées dans assets/boss-src/.
 *   assets/boss-src/<slug>.(png|jpg|jpeg|webp)  →  public/images/boss/<slug>.webp        (900 × 1200, 3:4)
 *                                                  public/images/boss/<slug>-thumb.webp  (450 × 600, 3:4)
 *                                                  public/images/boss/<slug>-card.webp   (800 × 500, 16:10)
 * Recadrage centré sur le sujet (stratégie « attention » de sharp). Usage : npm run images:boss
 * Ne traite que des sources dont la provenance et la licence sont consignées dans src/data/boss-images.ts.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("✗ Le module « sharp » est introuvable (il est normalement installé avec Next.js). Lancez npm install.");
  process.exit(1);
}

const SRC = "assets/boss-src";
const OUT = "public/images/boss";
const sizes = [
  { suffix: "", w: 900, h: 1200, q: 80 },
  { suffix: "-thumb", w: 450, h: 600, q: 76 },
  { suffix: "-card", w: 800, h: 500, q: 76 },
];

const files = existsSync(SRC) ? readdirSync(SRC).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)) : [];
if (!files.length) {
  console.log(`Aucune source dans ${SRC}/ : rien à produire.`);
  process.exit(0);
}
for (const f of files) {
  const slug = f.replace(/\.(png|jpe?g|webp)$/i, "");
  for (const s of sizes) {
    const out = join(OUT, `${slug}${s.suffix}.webp`);
    await sharp(join(SRC, f)).resize(s.w, s.h, { fit: "cover", position: sharp.strategy.attention }).webp({ quality: s.q, effort: 6 }).toFile(out);
    console.log(`✓ ${out} (${Math.round(statSync(out).size / 1024)} Ko)`);
  }
}

/**
 * Produit les images de boss à partir des dossiers assets/boss-src/<slug>/ :
 *   une image (png, jpg, webp) + credits.json { source, author, license, alt }
 *   →  public/images/boss/<slug>.webp        (900 × 1200, 3:4, fiche)
 *      public/images/boss/<slug>-thumb.webp  (450 × 600, 3:4, accueil et guide)
 *      public/images/boss/<slug>-card.webp   (800 × 500, 16:10, liste des boss)
 *   et src/data/generated/boss-images.json (statut et crédits, lu par src/data/boss-images.ts).
 *
 * Statut : « integre » si l'image et les trois champs de crédits sont présents,
 * « a-verifier » si l'image est là mais les crédits incomplets (rien n'est publié), « a-produire » sinon.
 * Usage : npm run images:boss (lancé aussi par le déploiement GitHub Pages).
 */
import { existsSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = "assets/boss-src";
const OUT = "public/images/boss";
const MANIFEST = "src/data/generated/boss-images.json";
const sizes = [
  { suffix: "", w: 900, h: 1200, q: 80 },
  { suffix: "-thumb", w: 450, h: 600, q: 76 },
  { suffix: "-card", w: 800, h: 500, q: 76 },
];

const slugs = existsSync(SRC) ? readdirSync(SRC).filter((d) => statSync(join(SRC, d)).isDirectory()).sort() : [];
const pending = slugs.map((slug) => {
  const files = readdirSync(join(SRC, slug)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
  return { slug, files };
});

let sharp = null;
if (pending.some((p) => p.files.length)) {
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("✗ Le module « sharp » est introuvable (il est normalement installé avec Next.js). Lancez npm install.");
    process.exit(1);
  }
}

mkdirSync(OUT, { recursive: true });
const manifest = {};
let count = 0;
for (const { slug, files } of pending) {
  const outputs = sizes.map((s) => join(OUT, `${slug}${s.suffix}.webp`));
  if (!files.length) {
    for (const o of outputs) if (existsSync(o)) unlinkSync(o); // image retirée : on supprime les dérivés
    continue;
  }
  if (files.length > 1) console.warn(`⚠ ${slug} : ${files.length} images, seule « ${files[0]} » est utilisée`);
  let credits = {};
  try {
    credits = JSON.parse(readFileSync(join(SRC, slug, "credits.json"), "utf8"));
  } catch {
    console.warn(`⚠ ${slug} : credits.json absent ou invalide`);
  }
  const clean = (v) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 300) : null);
  const entry = { source: clean(credits.source), author: clean(credits.author), license: clean(credits.license), alt: clean(credits.alt) };
  entry.status = entry.source && entry.author && entry.license ? "integre" : "a-verifier";
  manifest[slug] = entry;
  if (entry.status === "a-verifier") {
    // Crédits incomplets : aucune version publiée tant que la provenance n'est pas renseignée.
    for (const o of outputs) if (existsSync(o)) unlinkSync(o);
    console.warn(`⚠ ${slug} : crédits incomplets (source, author, license) — image non publiée`);
    continue;
  }
  for (const [i, s] of sizes.entries()) {
    await sharp(join(SRC, slug, files[0]))
      .rotate()
      .resize(s.w, s.h, { fit: "cover", position: sharp.strategy.attention })
      .webp({ quality: s.q, effort: 6 })
      .toFile(outputs[i]);
  }
  count++;
  console.log(`✓ ${slug} (${entry.status}) — ${outputs.map((o) => `${Math.round(statSync(o).size / 1024)} Ko`).join(" / ")}`);
}
mkdirSync("src/data/generated", { recursive: true });
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`${count} image(s) de boss traitée(s) sur ${slugs.length} dossiers. Manifeste : ${MANIFEST}`);

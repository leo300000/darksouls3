import type { MetadataRoute } from "next";
import { catalog, zones, bosses, npcs, endings, loreArticles } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const statics = ["", "/guide", "/boss", "/pnj", "/quetes", "/fins", "/lore", "/lore/graphe", "/lore/chronologie", "/serments", "/armes", "/armes/comparateur", "/armures", "/sorts", "/anneaux", "/objets", "/cartes", "/completion", "/a-propos"];
  const paths = [
    ...statics,
    ...zones.flatMap((z) => [`/guide/${z.slug}`, `/cartes/${z.slug}`]),
    ...bosses.map((b) => `/boss/${b.slug}`),
    ...npcs.map((n) => `/pnj/${n.slug}`),
    ...endings.map((e) => `/fins/${e.slug}`),
    ...loreArticles.map((a) => `/lore/${a.slug}`),
    ...Object.values(catalog.entities).filter((e) => e.href && ["arme", "bouclier", "armure", "ensemble", "anneau", "sort", "objet"].includes(e.kind)).map((e) => e.href!),
  ];
  const slash = process.env.STATIC_EXPORT ? "/" : ""; // export statique : URL canoniques en « dossier/ »
  return paths.map((p) => ({ url: `${base}${p}${slash}` }));
}

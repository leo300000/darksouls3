import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 produit un site 100 % statique dans `out/` (GitHub Pages).
 * NEXT_PUBLIC_BASE_PATH préfixe toutes les URL quand le site est servi dans un sous-dossier
 * (ex. « /darksouls3 » pour https://<utilisateur>.github.io/darksouls3/).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  ...(process.env.STATIC_EXPORT ? { output: "export", trailingSlash: true } : {}),
  basePath,
};

export default nextConfig;

import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/recherche", "/favoris", "/parametres"].map((p) => prefix + p) }], sitemap: `${base}/sitemap.xml` };
}

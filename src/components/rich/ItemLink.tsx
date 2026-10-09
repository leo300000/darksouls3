import Link from "next/link";
import { itemByName } from "@/lib/data";

/** Lien vers la fiche d'un objet à partir de son nom anglais (texte simple si aucune fiche). */
export function ItemLink({ name, className = "link-archive" }: { name: string; className?: string }) {
  const e = itemByName(name);
  if (e?.href) return <Link href={e.href} className={className}>{name}</Link>;
  return <span className="text-parch">{name}</span>;
}

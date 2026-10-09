import Link from "next/link";
import { covenants, itemByName } from "@/lib/data";
import { fold } from "@/lib/text";

/** Lien vers la fiche d'un objet (ou d'un serment) à partir de son nom anglais (texte simple si aucune fiche). */
export function ItemLink({ name, className = "link-archive" }: { name: string; className?: string }) {
  const e = itemByName(name);
  if (e?.href) return <Link href={e.href} className={className}>{name}</Link>;
  const n = fold(name);
  const cov = covenants.find((c) => [c.nameEn, ...c.aliases].some((x) => fold(x) === n));
  if (cov) return <Link href={`/serments#${cov.slug}`} className={className}>{name}</Link>;
  return <span className="text-parch">{name}</span>;
}

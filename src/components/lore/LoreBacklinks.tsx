import Link from "next/link";
import { loreMentioning } from "@/lib/data";

/** Section « Dans les archives du lore » : articles qui citent l'entité courante. */
export function LoreBacklinks({ kind, slug, title = "Dans les archives du lore", id = "lore-lie" }: { kind: "boss" | "pnj" | "zone" | "lore"; slug: string; title?: string; id?: string }) {
  const list = loreMentioning(kind, slug);
  if (!list.length) return null;
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="h-section">{title}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {list.map((a) => (
          <li key={a.slug} className="min-w-0">
            <Link href={`/lore/${a.slug}`} className="panel card-link block h-full p-4">
              <span className="block font-display text-lg text-parch">{a.title}</span>
              <span className="mt-1 block text-sm text-dim">{a.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function hasLoreBacklinks(kind: "boss" | "pnj" | "zone" | "lore", slug: string): boolean {
  return loreMentioning(kind, slug).length > 0;
}

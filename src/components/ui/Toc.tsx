"use client";

import { useEffect, useState } from "react";

/** Table des matières avec suivi de la section visible. */
export function Toc({ items, title = "Sommaire" }: { items: { id: string; label: string }[]; title?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    for (const it of items) {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [items]);
  return (
    <nav aria-label={title} className="text-sm">
      <p className="eyebrow mb-3">{title}</p>
      <ul className="space-y-1 border-l border-line/20">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={`-ml-px block border-l py-1 pl-3 transition ${active === it.id ? "border-ember-hi text-parch" : "border-transparent text-dim hover:text-text"}`}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

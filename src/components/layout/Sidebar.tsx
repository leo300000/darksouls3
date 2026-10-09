"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { Icon } from "@/components/ui/Icon";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { ProgressBadge } from "@/components/progress/ProgressBadge";

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/lore") return pathname === "/lore" || (pathname.startsWith("/lore/") && !pathname.startsWith("/lore/graphe") && !pathname.startsWith("/lore/chronologie"));
  if (href === "/armes") return pathname === "/armes" || (pathname.startsWith("/armes/") && !pathname.startsWith("/armes/comparateur"));
  return pathname === href || pathname.startsWith(href + "/");
}

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigation principale" className="space-y-7">
      {NAV.map((group) => (
        <div key={group.title}>
          <p className="eyebrow mb-2 px-3 text-[0.62rem]">{group.title}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex min-h-[40px] items-center gap-3 px-3 py-2 text-[0.92rem] transition-colors ${
                      active ? "text-parch" : "text-dim hover:text-text"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 transition-all ${
                        active ? "bg-ember-hi shadow-[0_0_10px_rgb(var(--c-ember-hi))]" : "bg-transparent group-hover:bg-gold/40"
                      }`}
                    />
                    <Icon name={item.icon} className={active ? "text-gold-hi" : "text-ash group-hover:text-gold"} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col border-r border-line/15 bg-night/95 backdrop-blur lg:flex">
      <Link href="/" className="group block px-6 pb-5 pt-7" aria-label="The Ashen Archive — accueil">
        <span className="block font-engrave text-[0.6rem] text-gold/80">Archives interdites de Lothric</span>
        <span className="mt-1 block font-display text-[1.75rem] font-semibold leading-none text-parch transition-colors group-hover:text-gold-hi">
          The Ashen Archive
        </span>
        <span className="mt-3 block hairline" />
      </Link>
      <div className="px-4 pb-4">
        <SearchTrigger variant="sidebar" />
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto px-3 pb-6">
        <NavLinks />
      </div>
      <div className="border-t border-line/15 px-5 py-4">
        <ProgressBadge />
      </div>
    </aside>
  );
}

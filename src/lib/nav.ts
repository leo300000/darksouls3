export interface NavItem {
  href: string;
  label: string;
  icon: string; // nom d'icône lucide (résolu côté composant)
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    title: "Le voyage",
    items: [
      { href: "/guide", label: "Guide de l'aventure", icon: "Map" },
      { href: "/cartes", label: "Cartes", icon: "Compass" },
      { href: "/fins", label: "Fins du jeu", icon: "Flame" },
    ],
  },
  {
    title: "Âmes & destins",
    items: [
      { href: "/boss", label: "Boss", icon: "Skull" },
      { href: "/pnj", label: "Personnages", icon: "Users" },
      { href: "/quetes", label: "Quêtes", icon: "ScrollText" },
    ],
  },
  {
    title: "Arsenal",
    items: [
      { href: "/armes", label: "Armes & boucliers", icon: "Sword" },
      { href: "/armures", label: "Armures", icon: "Shield" },
      { href: "/sorts", label: "Sorts", icon: "Sparkles" },
      { href: "/anneaux", label: "Anneaux", icon: "CircleDot" },
      { href: "/objets", label: "Objets", icon: "Gem" },
    ],
  },
  {
    title: "Archives",
    items: [
      { href: "/lore", label: "Lore", icon: "BookOpen" },
      { href: "/lore/graphe", label: "Graphe narratif", icon: "Network" },
      { href: "/lore/chronologie", label: "Chronologie", icon: "Hourglass" },
      { href: "/serments", label: "Serments", icon: "Handshake" },
    ],
  },
  {
    title: "Progression",
    items: [
      { href: "/completion", label: "Complétion 100 %", icon: "Trophy" },
      { href: "/favoris", label: "Favoris & historique", icon: "Bookmark" },
      { href: "/parametres", label: "Paramètres", icon: "Settings" },
      { href: "/a-propos", label: "Sources & fiabilité", icon: "Info" },
    ],
  },
];

export const SITE = {
  name: "The Ashen Archive",
  tagline: "Toutes les cendres ont une histoire.",
  description:
    "Encyclopédie non officielle de Dark Souls III et de ses DLC : guide intégral, boss, quêtes, fins, lore, équipements et suivi de progression.",
};

/** Image de partage (Open Graph), URL absolue préfixée par le chemin de déploiement. */
export const OG_IMAGE = { url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/og.jpg`, width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` };

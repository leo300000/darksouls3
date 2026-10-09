import {
  Map, Compass, Flame, Skull, Users, ScrollText, Sword, Shield, Sparkles, CircleDot, Gem, BookOpen,
  Network, Hourglass, Handshake, Trophy, Bookmark, Settings, Info, Home, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Map, Compass, Flame, Skull, Users, ScrollText, Sword, Shield, Sparkles, CircleDot, Gem, BookOpen,
  Network, Hourglass, Handshake, Trophy, Bookmark, Settings, Info, Home,
};

export function Icon({ name, className, size = 18 }: { name: string; className?: string; size?: number }) {
  const C = ICONS[name] ?? Info;
  return <C className={className} size={size} strokeWidth={1.5} aria-hidden />;
}

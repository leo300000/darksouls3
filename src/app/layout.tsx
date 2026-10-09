import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/600.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileTopBar } from "@/components/layout/MobileNav";
import { SearchDialog } from "@/components/search/SearchDialog";
import { BackToTop, PrefsApplier } from "@/components/layout/Chrome";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/nav";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: `${SITE.name} — Encyclopédie de Dark Souls III`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "fr_FR",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0D",
  width: "device-width",
  initialScale: 1,
};

/** Script minimal exécuté avant le rendu pour éviter un flash de thème. */
const THEME_INIT = `try{var s=JSON.parse(localStorage.getItem("ashen-archive:v1")||"null");var p=s&&s.prefs;if(p){document.documentElement.dataset.theme=p.theme==="light"?"light":"dark";if(p.motion==="reduced")document.documentElement.dataset.motion="reduced";}}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-screen antialiased">
        <a href="#contenu" className="sr-only z-[80] bg-ember px-4 py-2 text-parch focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
          Aller au contenu
        </a>
        <PrefsApplier />
        <Sidebar />
        <MobileTopBar />
        <div className="lg:pl-[272px]">
          <main id="contenu" className="min-h-[70vh]">
            {children}
          </main>
          <Footer />
        </div>
        <SearchDialog />
        <BackToTop />
      </body>
    </html>
  );
}

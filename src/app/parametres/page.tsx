import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrefsForm } from "@/components/progress/PrefsForm";
import { DataTools } from "@/components/progress/DataTools";

export const metadata: Metadata = { title: "Paramètres", robots: { index: false } };

export default function SettingsPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Paramètres" }]} overline="Préférences" title="Paramètres" lede="Préférences d'affichage et gestion de la sauvegarde locale." compact />
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-8">
        <PrefsForm />
        <DataTools />
        <section className="panel p-5 text-sm text-dim">
          <p className="eyebrow mb-2">Raccourcis clavier</p>
          <ul className="space-y-1">
            <li><kbd className="font-mono text-text">Ctrl</kbd> + <kbd className="font-mono text-text">K</kbd> ou <kbd className="font-mono text-text">/</kbd> : ouvrir la recherche</li>
            <li><kbd className="font-mono text-text">↑ ↓</kbd> puis <kbd className="font-mono text-text">Entrée</kbd> : naviguer dans les résultats</li>
            <li><kbd className="font-mono text-text">Échap</kbd> : fermer la recherche ou le menu</li>
          </ul>
        </section>
      </div>
    </>
  );
}

"use client";

import { setPrefs, useStore, type Prefs } from "@/lib/store";

function Choice<K extends keyof Prefs>({ k, label, options, help }: { k: K; label: string; options: { v: Prefs[K]; l: string }[]; help: string }) {
  const { prefs } = useStore();
  return (
    <fieldset className="panel p-5">
      <legend className="eyebrow px-1">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={String(o.v)} type="button" className="chip" aria-pressed={prefs[k] === o.v} onClick={() => setPrefs({ [k]: o.v } as Partial<Prefs>)}>
            {o.l}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-dim">{help}</p>
    </fieldset>
  );
}

export function PrefsForm() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Choice k="theme" label="Thème" options={[{ v: "dark", l: "Sombre (cendres)" }, { v: "light", l: "Parchemin (clair)" }]} help="Le thème parchemin reprend l'idée d'un manuscrit ancien." />
      <Choice k="spoilers" label="Spoilers" options={[{ v: "hide", l: "Masqués par défaut" }, { v: "show", l: "Toujours visibles" }]} help="Les résumés narratifs, issues de quêtes et fins sont floutés tant que vous ne les révélez pas." />
      <Choice k="motion" label="Animations" options={[{ v: "auto", l: "Selon le système" }, { v: "reduced", l: "Réduites" }]} help="« Selon le système » respecte prefers-reduced-motion ; « Réduites » désactive braises et transitions." />
      <Choice k="embers" label="Braises décoratives" options={[{ v: true, l: "Activées" }, { v: false, l: "Désactivées" }]} help="Particules de cendres flottant dans les en-têtes." />
    </div>
  );
}

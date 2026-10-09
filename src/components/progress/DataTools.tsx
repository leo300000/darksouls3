"use client";

import { useRef, useState } from "react";
import { Download, Upload, RotateCcw } from "lucide-react";
import { exportData, importData, resetActiveProfile, activeProfile, useStore } from "@/lib/store";

/** Export / import JSON et remise à zéro avec confirmation. */
export function DataTools() {
  const store = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const doExport = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ashen-archive-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg({ ok: true, text: "Sauvegarde exportée." });
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 5_000_000) return setMsg({ ok: false, text: "Fichier trop volumineux (5 Mo maximum)." });
    const res = importData(await f.text());
    setMsg(res.ok ? { ok: true, text: "Sauvegarde importée : vos profils, favoris et préférences ont été restaurés." } : { ok: false, text: res.error });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="panel p-5">
      <p className="eyebrow mb-3">Sauvegarde locale</p>
      <p className="mb-4 text-sm text-dim">
        Toute la progression est stockée dans ce navigateur. Exportez-la en JSON pour la conserver ou la transférer sur un autre appareil.
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-sm" onClick={doExport}><Download size={14} /> Exporter (JSON)</button>
        <button type="button" className="btn btn-sm" onClick={() => fileRef.current?.click()}><Upload size={14} /> Importer</button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} aria-label="Fichier de sauvegarde à importer" />
        {!confirmReset ? (
          <button type="button" className="btn btn-sm btn-ghost text-ember-hi" onClick={() => setConfirmReset(true)}><RotateCcw size={14} /> Remettre à zéro</button>
        ) : (
          <span className="flex flex-wrap items-center gap-2 border border-ember-hi/60 bg-ember/10 px-3 py-1 text-sm">
            Effacer la progression de « {activeProfile(store).name} » ?
            <button type="button" className="btn btn-sm btn-ember" onClick={() => { resetActiveProfile(); setConfirmReset(false); setMsg({ ok: true, text: "Progression du profil remise à zéro." }); }}>Confirmer</button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setConfirmReset(false)}>Annuler</button>
          </span>
        )}
      </div>
      {msg && <p role="status" className={`mt-3 text-sm ${msg.ok ? "text-moss" : "text-ember-hi"}`}>{msg.text}</p>}
    </div>
  );
}

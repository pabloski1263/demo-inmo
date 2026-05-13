"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import toast from "react-hot-toast";
import type { SiteContent } from "@/lib/content";
import { LANG_FLAGS, LANG_LABELS, type Lang } from "@/lib/utils";

export default function AdminTranslationsPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>("en");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await adminFetch("/api/content");
      const data = await res.json();
      setContent(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = (key: string, value: string) => {
    if (!content) return;
    setContent({
      ...content,
      translations: {
        ...content.translations,
        [lang]: { ...content.translations[lang], [key]: value },
      },
    });
  };

  const addKey = () => {
    if (!content) return;
    const key = prompt("Nombre de la clave (ej: nav.new_link):");
    if (!key) return;
    const allLangs = { ...content.translations };
    for (const l of ["en", "es", "fr", "de", "it", "pt"] as Lang[]) {
      allLangs[l] = { ...allLangs[l], [key]: "" };
    }
    setContent({ ...content, translations: allLangs });
  };

  const removeKey = (key: string) => {
    if (!confirm(`Eliminar "${key}"?`)) return;
    if (!content) return;
    const allLangs = { ...content.translations };
    for (const l of ["en", "es", "fr", "de", "it", "pt"] as Lang[]) {
      const copy = { ...allLangs[l] };
      delete copy[key];
      allLangs[l] = copy;
    }
    setContent({ ...content, translations: allLangs });
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await adminFetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error();
      toast.success("Traducciones guardadas");
    } catch {
      toast.error("Error al guardar");
    }
    setSaving(false);
  };

  if (loading) return <div className="text-sm text-gray-400">Cargando...</div>;
  if (!content) return <div className="text-sm text-gray-400">Error al cargar</div>;

  const keys = Object.keys(content.translations.en).sort();
  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Traducciones</h1>
          <p className="text-sm text-gray-500">{keys.length} claves</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={addKey} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            + Agregar clave
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* Language toggle */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["en", "es", "fr", "de", "it", "pt"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              lang === l ? "bg-teal-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {LANG_FLAGS[l]} {LANG_LABELS[l]}
          </button>
        ))}
      </div>

      {keys.length === 0 ? (
        <div className="text-center py-10 text-sm text-gray-400">No hay traducciones</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500 w-64">Clave</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Valor ({lang === "en" ? "EN" : "ES"})</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-2">
                    <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{key}</code>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      className={inputClass}
                      value={content.translations[lang][key] || ""}
                      onChange={(e) => update(key, e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => removeKey(key)} className="text-red-400 hover:text-red-600 text-xs">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

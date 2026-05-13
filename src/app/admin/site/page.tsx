"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";
import type { SiteContent } from "@/lib/content";

export default function AdminSitePage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const load = async () => {
    try {
      const res = await adminFetch("/api/content");
      const data = await res.json();
      setContent(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = (path: string, value: string | number) => {
    if (!content) return;
    const keys = path.split(".");
    const updated = { ...content };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let obj: Record<string, any> = updated;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = value;
    setContent(updated);
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const toSave = { ...content };
      if (newPassword) {
        toSave.admin.password = newPassword;
      }

      const res = await adminFetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });
      if (!res.ok) throw new Error();
      toast.success("Configuración guardada");
      setNewPassword("");
    } catch {
      toast.error("Error al guardar");
    }
    setSaving(false);
  };

  if (loading) return <div className="text-sm text-gray-400">Cargando...</div>;
  if (!content) return <div className="text-sm text-gray-400">Error al cargar</div>;

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración del Sitio</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      {/* Branding */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-900">Marca</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Nombre del sitio</label>
            <input className={inputClass} value={content.site.name} onChange={(e) => update("site.name", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Subtítulo / Tagline</label>
            <input className={inputClass} value={content.site.subtitle} onChange={(e) => update("site.subtitle", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Nombre Legal</label>
            <input className={inputClass} value={content.site.legal_name} onChange={(e) => update("site.legal_name", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Logo</label>
            <ImageUploader
              currentImage={content.site.logo}
              onUpload={(url) => update("site.logo", url)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Favicon</label>
            <ImageUploader
              currentImage={content.site.favicon}
              onUpload={(url) => update("site.favicon", url)}
            />
          </div>
        </div>
      </div>

      {/* Admin Credentials */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Credenciales de Administrador</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Email</label>
            <input className={inputClass} value={content.admin.email} onChange={(e) => update("admin.email", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Nueva Contraseña</label>
            <input
              type="text"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Dejar vacío para mantener actual"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400">La contraseña actual se mantendrá si no se especifica una nueva.</p>
      </div>
    </div>
  );
}

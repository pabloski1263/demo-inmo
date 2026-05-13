"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";
import type { SiteContent } from "@/lib/content";

const sections = [
  { key: "hero", label: "Hero" },
  { key: "featured", label: "Propiedades Destacadas" },
  { key: "about", label: "Nosotros" },
  { key: "services", label: "Servicios" },
  { key: "contact", label: "Contacto" },
  { key: "footer", label: "Footer" },
] as const;

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("hero");
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

  const updateServiceItem = (index: number, field: string, value: string) => {
    if (!content) return;
    const items = [...content.services.items];
    items[index] = { ...items[index], [field]: value };
    setContent({ ...content, services: { ...content.services, items } });
  };

  const addServiceItem = () => {
    if (!content) return;
    const items = [...content.services.items, { id: `s${Date.now()}`, title_en: "", title_es: "", description_en: "", description_es: "", icon: "search" }];
    setContent({ ...content, services: { ...content.services, items } });
  };

  const removeServiceItem = (index: number) => {
    if (!content) return;
    const items = content.services.items.filter((_, i) => i !== index);
    setContent({ ...content, services: { ...content.services, items } });
  };

  const updateLegalLink = (index: number, field: string, value: string) => {
    if (!content) return;
    const links = [...content.footer.legal_links];
    links[index] = { ...links[index], [field]: value };
    setContent({ ...content, footer: { ...content.footer, legal_links: links } });
  };

  const addLegalLink = () => {
    if (!content) return;
    const links = [...content.footer.legal_links, { label_en: "", label_es: "", url: "" }];
    setContent({ ...content, footer: { ...content.footer, legal_links: links } });
  };

  const removeLegalLink = (index: number) => {
    if (!content) return;
    const links = content.footer.legal_links.filter((_, i) => i !== index);
    setContent({ ...content, footer: { ...content.footer, legal_links: links } });
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
      toast.success("Contenido guardado");
    } catch {
      toast.error("Error al guardar");
    }
    setSaving(false);
  };

  if (loading) return <div className="text-sm text-gray-400">Cargando...</div>;
  if (!content) return <div className="text-sm text-gray-400">Error al cargar contenido</div>;

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";
  const labelClass = "text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1";
  const textAreaClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contenido del Sitio</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeSection === s.key
                ? "bg-teal-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Hero */}
      {activeSection === "hero" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Hero Section</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Título (EN)</label>
              <input className={inputClass} value={content.hero.title_en} onChange={(e) => update("hero.title_en", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Título (ES)</label>
              <input className={inputClass} value={content.hero.title_es} onChange={(e) => update("hero.title_es", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Subtítulo (EN)</label>
              <input className={inputClass} value={content.hero.subtitle_en} onChange={(e) => update("hero.subtitle_en", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Subtítulo (ES)</label>
              <input className={inputClass} value={content.hero.subtitle_es} onChange={(e) => update("hero.subtitle_es", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Placeholder de búsqueda</label>
              <input className={inputClass} value={content.hero.search_placeholder} onChange={(e) => update("hero.search_placeholder", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Imagen de fondo</label>
              <ImageUploader
                currentImage={content.hero.background_image}
                onUpload={(url) => update("hero.background_image", url)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Featured */}
      {activeSection === "featured" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Propiedades Destacadas</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Título (EN)</label>
              <input className={inputClass} value={content.featured.title_en} onChange={(e) => update("featured.title_en", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Título (ES)</label>
              <input className={inputClass} value={content.featured.title_es} onChange={(e) => update("featured.title_es", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Subtítulo (EN)</label>
              <input className={inputClass} value={content.featured.subtitle_en} onChange={(e) => update("featured.subtitle_en", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Subtítulo (ES)</label>
              <input className={inputClass} value={content.featured.subtitle_es} onChange={(e) => update("featured.subtitle_es", e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* About */}
      {activeSection === "about" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Nosotros</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Título (EN)</label>
              <input className={inputClass} value={content.about.title_en} onChange={(e) => update("about.title_en", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Título (ES)</label>
              <input className={inputClass} value={content.about.title_es} onChange={(e) => update("about.title_es", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Descripción (EN)</label>
              <textarea rows={4} className={textAreaClass} value={content.about.description_en} onChange={(e) => update("about.description_en", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Descripción (ES)</label>
              <textarea rows={4} className={textAreaClass} value={content.about.description_es} onChange={(e) => update("about.description_es", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Imagen</label>
              <ImageUploader
                currentImage={content.about.image}
                onUpload={(url) => update("about.image", url)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Services */}
      {activeSection === "services" && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Servicios - Títulos</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Título (EN)</label>
                <input className={inputClass} value={content.services.title_en} onChange={(e) => update("services.title_en", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Título (ES)</label>
                <input className={inputClass} value={content.services.title_es} onChange={(e) => update("services.title_es", e.target.value)} />
              </div>
            </div>
          </div>

          {content.services.items.map((item, i) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Servicio {i + 1}</h3>
                <button onClick={() => removeServiceItem(i)} className="text-xs text-red-400 hover:text-red-600">Eliminar</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Título (EN)</label>
                  <input className={inputClass} value={item.title_en} onChange={(e) => updateServiceItem(i, "title_en", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Título (ES)</label>
                  <input className={inputClass} value={item.title_es} onChange={(e) => updateServiceItem(i, "title_es", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Descripción (EN)</label>
                  <textarea rows={3} className={textAreaClass} value={item.description_en} onChange={(e) => updateServiceItem(i, "description_en", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Descripción (ES)</label>
                  <textarea rows={3} className={textAreaClass} value={item.description_es} onChange={(e) => updateServiceItem(i, "description_es", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Icono</label>
                  <select className={inputClass} value={item.icon} onChange={(e) => updateServiceItem(i, "icon", e.target.value)}>
                    <option value="search">Búsqueda</option>
                    <option value="tag">Etiqueta</option>
                    <option value="key">Llave</option>
                    <option value="chart">Gráfico</option>
                    <option value="home">Casa</option>
                    <option value="shield">Escudo</option>
                    <option value="star">Estrella</option>
                    <option value="heart">Corazón</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addServiceItem} className="text-sm text-teal-600 hover:text-teal-700">+ Agregar servicio</button>
        </div>
      )}

      {/* Contact */}
      {activeSection === "contact" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Contacto</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Título (EN)</label>
              <input className={inputClass} value={content.contact.title_en} onChange={(e) => update("contact.title_en", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Título (ES)</label>
              <input className={inputClass} value={content.contact.title_es} onChange={(e) => update("contact.title_es", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Dirección</label>
              <input className={inputClass} value={content.contact.address} onChange={(e) => update("contact.address", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Teléfono</label>
              <input className={inputClass} value={content.contact.phone} onChange={(e) => update("contact.phone", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" className={inputClass} value={content.contact.email} onChange={(e) => update("contact.email", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Horario (EN)</label>
              <input className={inputClass} value={content.contact.hours_en} onChange={(e) => update("contact.hours_en", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Horario (ES)</label>
              <input className={inputClass} value={content.contact.hours_es} onChange={(e) => update("contact.hours_es", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Latitud (mapa)</label>
              <input type="number" step="any" className={inputClass} value={content.contact.map_lat} onChange={(e) => update("contact.map_lat", Number(e.target.value))} />
            </div>
            <div>
              <label className={labelClass}>Longitud (mapa)</label>
              <input type="number" step="any" className={inputClass} value={content.contact.map_lng} onChange={(e) => update("contact.map_lng", Number(e.target.value))} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {activeSection === "footer" && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Footer</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Descripción (EN)</label>
                <textarea rows={3} className={textAreaClass} value={content.footer.description_en} onChange={(e) => update("footer.description_en", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Descripción (ES)</label>
                <textarea rows={3} className={textAreaClass} value={content.footer.description_es} onChange={(e) => update("footer.description_es", e.target.value)} />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Instagram URL</label>
                <input className={inputClass} value={content.footer.social.instagram} onChange={(e) => update("footer.social.instagram", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Facebook URL</label>
                <input className={inputClass} value={content.footer.social.facebook} onChange={(e) => update("footer.social.facebook", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>LinkedIn URL</label>
                <input className={inputClass} value={content.footer.social.linkedin} onChange={(e) => update("footer.social.linkedin", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Links Legales</h3>
            {content.footer.legal_links.map((link, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 grid sm:grid-cols-3 gap-2">
                  <input className={inputClass} value={link.label_en} onChange={(e) => updateLegalLink(i, "label_en", e.target.value)} placeholder="Label (EN)" />
                  <input className={inputClass} value={link.label_es} onChange={(e) => updateLegalLink(i, "label_es", e.target.value)} placeholder="Label (ES)" />
                  <input className={inputClass} value={link.url} onChange={(e) => updateLegalLink(i, "url", e.target.value)} placeholder="URL" />
                </div>
                <button onClick={() => removeLegalLink(i)} className="text-red-400 hover:text-red-600 text-sm px-2 mt-2">×</button>
              </div>
            ))}
            <button onClick={addLegalLink} className="text-xs text-teal-600 hover:text-teal-700">+ Agregar link legal</button>
          </div>
        </div>
      )}
    </div>
  );
}

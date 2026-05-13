"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";
import type { SiteContent } from "@/lib/content";

const sections = [
  { key: "perfil", label: "Perfil" },
  { key: "hero", label: "Hero" },
  { key: "featured", label: "Propiedades Destacadas" },
  { key: "about", label: "Nosotros" },
  { key: "services", label: "Servicios" },
  { key: "contact", label: "Contacto" },
  { key: "chat", label: "Chat" },
  { key: "footer", label: "Footer" },
] as const;

const iconOptions = [
  { value: "search", label: "Búsqueda" },
  { value: "tag", label: "Etiqueta" },
  { value: "key", label: "Llave" },
  { value: "chart", label: "Gráfico" },
  { value: "home", label: "Casa" },
  { value: "shield", label: "Escudo" },
  { value: "star", label: "Estrella" },
  { value: "heart", label: "Corazón" },
];

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("perfil");
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

  // ---- Agent helpers ----
  const updateCredential = (index: number, value: string) => {
    if (!content) return;
    const credentials = [...content.agent.credentials];
    credentials[index] = value;
    setContent({ ...content, agent: { ...content.agent, credentials } });
  };

  const addCredential = () => {
    if (!content) return;
    const credentials = [...content.agent.credentials, ""];
    setContent({ ...content, agent: { ...content.agent, credentials } });
  };

  const removeCredential = (index: number) => {
    if (!content) return;
    const credentials = content.agent.credentials.filter((_, i) => i !== index);
    setContent({ ...content, agent: { ...content.agent, credentials } });
  };

  const updateLanguage = (index: number, value: string) => {
    if (!content) return;
    const languages = [...content.agent.languages];
    languages[index] = value;
    setContent({ ...content, agent: { ...content.agent, languages } });
  };

  const addLanguage = () => {
    if (!content) return;
    const languages = [...content.agent.languages, ""];
    setContent({ ...content, agent: { ...content.agent, languages } });
  };

  const removeLanguage = (index: number) => {
    if (!content) return;
    const languages = content.agent.languages.filter((_, i) => i !== index);
    setContent({ ...content, agent: { ...content.agent, languages } });
  };

  const updateExpertiseArea = (index: number, field: string, value: string) => {
    if (!content) return;
    const areas = [...content.agent.expertise_areas];
    areas[index] = { ...areas[index], [field]: value };
    setContent({ ...content, agent: { ...content.agent, expertise_areas: areas } });
  };

  const addExpertiseArea = () => {
    if (!content) return;
    const areas = [...content.agent.expertise_areas, { id: `e${Date.now()}`, title_en: "", title_es: "", description_en: "", description_es: "", icon: "search" }];
    setContent({ ...content, agent: { ...content.agent, expertise_areas: areas } });
  };

  const removeExpertiseArea = (index: number) => {
    if (!content) return;
    const areas = content.agent.expertise_areas.filter((_, i) => i !== index);
    setContent({ ...content, agent: { ...content.agent, expertise_areas: areas } });
  };

  const updateStat = (index: number, field: string, value: string) => {
    if (!content) return;
    const stats = [...content.agent.stats];
    stats[index] = { ...stats[index], [field]: value };
    setContent({ ...content, agent: { ...content.agent, stats } });
  };

  const addStat = () => {
    if (!content) return;
    const stats = [...content.agent.stats, { label_en: "", label_es: "", value: "" }];
    setContent({ ...content, agent: { ...content.agent, stats } });
  };

  const removeStat = (index: number) => {
    if (!content) return;
    const stats = content.agent.stats.filter((_, i) => i !== index);
    setContent({ ...content, agent: { ...content.agent, stats } });
  };

  // ---- Service item helpers ----
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

  // ---- Legal link helpers ----
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

  const agent = content.agent;

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

      {/* === Perfil === */}
      {activeSection === "perfil" && (
        <div className="space-y-4">
          {/* Basic info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Información del Agente</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombre</label>
                <input className={inputClass} value={agent.first_name} onChange={(e) => update("agent.first_name", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Apellido</label>
                <input className={inputClass} value={agent.last_name} onChange={(e) => update("agent.last_name", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Título Profesional (EN)</label>
                <input className={inputClass} value={agent.title_en} onChange={(e) => update("agent.title_en", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Título Profesional (ES)</label>
                <input className={inputClass} value={agent.title_es} onChange={(e) => update("agent.title_es", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Foto</label>
                <ImageUploader
                  currentImage={agent.photo}
                  onUpload={(url) => update("agent.photo", url)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Bio (EN)</label>
                <textarea rows={4} className={textAreaClass} value={agent.bio_en} onChange={(e) => update("agent.bio_en", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Bio (ES)</label>
                <textarea rows={4} className={textAreaClass} value={agent.bio_es} onChange={(e) => update("agent.bio_es", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Credenciales</h3>
            {agent.credentials.map((cred, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input className={`${inputClass} flex-1`} value={cred} onChange={(e) => updateCredential(i, e.target.value)} placeholder="Ej: Top Producer — ONE Sotheby's" />
                <button onClick={() => removeCredential(i)} className="text-red-400 hover:text-red-600 text-sm px-2 mt-2">×</button>
              </div>
            ))}
            <button onClick={addCredential} className="text-xs text-teal-600 hover:text-teal-700">+ Agregar credencial</button>
          </div>

          {/* Languages */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Idiomas</h3>
            {agent.languages.map((lang, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input className={`${inputClass} flex-1`} value={lang} onChange={(e) => updateLanguage(i, e.target.value)} placeholder="Ej: English" />
                <button onClick={() => removeLanguage(i)} className="text-red-400 hover:text-red-600 text-sm px-2 mt-2">×</button>
              </div>
            ))}
            <button onClick={addLanguage} className="text-xs text-teal-600 hover:text-teal-700">+ Agregar idioma</button>
          </div>

          {/* Expertise areas */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Áreas de Especialización</h3>
            {agent.expertise_areas.map((area, i) => (
              <div key={area.id} className="border border-gray-100 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Área {i + 1}</span>
                  <button onClick={() => removeExpertiseArea(i)} className="text-xs text-red-400 hover:text-red-600">Eliminar</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Título (EN)</label>
                    <input className={inputClass} value={area.title_en} onChange={(e) => updateExpertiseArea(i, "title_en", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Título (ES)</label>
                    <input className={inputClass} value={area.title_es} onChange={(e) => updateExpertiseArea(i, "title_es", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Descripción (EN)</label>
                    <textarea rows={2} className={textAreaClass} value={area.description_en} onChange={(e) => updateExpertiseArea(i, "description_en", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Descripción (ES)</label>
                    <textarea rows={2} className={textAreaClass} value={area.description_es} onChange={(e) => updateExpertiseArea(i, "description_es", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Icono</label>
                    <select className={inputClass} value={area.icon} onChange={(e) => updateExpertiseArea(i, "icon", e.target.value)}>
                      {iconOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addExpertiseArea} className="text-xs text-teal-600 hover:text-teal-700">+ Agregar área</button>
          </div>

          {/* Stats */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Estadísticas</h3>
            {agent.stats.map((stat, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input className={inputClass} value={stat.value} onChange={(e) => updateStat(i, "value", e.target.value)} placeholder="Valor (15+, 500+, etc.)" />
                <input className={inputClass} value={stat.label_en} onChange={(e) => updateStat(i, "label_en", e.target.value)} placeholder="Label (EN)" />
                <input className={inputClass} value={stat.label_es} onChange={(e) => updateStat(i, "label_es", e.target.value)} placeholder="Label (ES)" />
                <button onClick={() => removeStat(i)} className="text-red-400 hover:text-red-600 text-sm px-2 mt-2">×</button>
              </div>
            ))}
            <button onClick={addStat} className="text-xs text-teal-600 hover:text-teal-700">+ Agregar estadística</button>
          </div>

          {/* Social */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Redes Sociales</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Instagram URL</label>
                <input className={inputClass} value={agent.social.instagram} onChange={(e) => update("agent.social.instagram", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Facebook URL</label>
                <input className={inputClass} value={agent.social.facebook} onChange={(e) => update("agent.social.facebook", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>LinkedIn URL</label>
                <input className={inputClass} value={agent.social.linkedin} onChange={(e) => update("agent.social.linkedin", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>YouTube URL</label>
                <input className={inputClass} value={agent.social.youtube} onChange={(e) => update("agent.social.youtube", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>WhatsApp (número completo con código país)</label>
                <input className={inputClass} value={agent.social.whatsapp} onChange={(e) => update("agent.social.whatsapp", e.target.value)} placeholder="+1 (305) 555-0147" />
              </div>
            </div>
          </div>

          {/* Brokerage */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Brokerage / Afiliación</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombre de la Inmobiliaria</label>
                <input className={inputClass} value={agent.brokerage.name} onChange={(e) => update("agent.brokerage.name", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Website</label>
                <input className={inputClass} value={agent.brokerage.website} onChange={(e) => update("agent.brokerage.website", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Logo de la Inmobiliaria</label>
                <ImageUploader
                  currentImage={agent.brokerage.logo}
                  onUpload={(url) => update("agent.brokerage.logo", url)}
                />
              </div>
            </div>
          </div>

          {/* Zillow / Review */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Reseñas</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>MLS Badge (texto)</label>
                <input className={inputClass} value={agent.mls_badge} onChange={(e) => update("agent.mls_badge", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Review Link URL</label>
                <input className={inputClass} value={agent.review_link} onChange={(e) => update("agent.review_link", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Review Text (EN)</label>
                <input className={inputClass} value={agent.review_text_en} onChange={(e) => update("agent.review_text_en", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Review Text (ES)</label>
                <input className={inputClass} value={agent.review_text_es} onChange={(e) => update("agent.review_text_es", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      )}

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
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
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

      {/* Chat */}
      {activeSection === "chat" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Chat Inteligente</h3>
          <div className="flex items-center gap-3 mb-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Habilitado</label>
            <button
              onClick={() => setContent({ ...content, chat: { ...content.chat, enabled: !content.chat.enabled } })}
              className={`relative w-10 h-5 rounded-full transition-colors ${content.chat.enabled ? "bg-teal-600" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${content.chat.enabled ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Modelo Gemini</label>
              <input className={inputClass} value={content.chat.model} onChange={(e) => update("chat.model", e.target.value)} placeholder="gemini-2.5-flash-lite" />
            </div>
            <div>
              <label className={labelClass}>API Key</label>
              <input className={inputClass} value={content.chat.api_key} onChange={(e) => update("chat.api_key", e.target.value)} placeholder="AIza..." type="password" />
              <p className="text-[10px] text-gray-400 mt-1">Usa GEMINI_API_KEY en .env.local como respaldo</p>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Saludo (EN)</label>
              <textarea rows={2} className={textAreaClass} value={content.chat.greeting_en} onChange={(e) => update("chat.greeting_en", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Saludo (ES)</label>
              <textarea rows={2} className={textAreaClass} value={content.chat.greeting_es} onChange={(e) => update("chat.greeting_es", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Saludo (FR)</label>
              <textarea rows={2} className={textAreaClass} value={content.chat.greeting_fr} onChange={(e) => update("chat.greeting_fr", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Saludo (DE)</label>
              <textarea rows={2} className={textAreaClass} value={content.chat.greeting_de} onChange={(e) => update("chat.greeting_de", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Saludo (IT)</label>
              <textarea rows={2} className={textAreaClass} value={content.chat.greeting_it} onChange={(e) => update("chat.greeting_it", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Saludo (PT)</label>
              <textarea rows={2} className={textAreaClass} value={content.chat.greeting_pt} onChange={(e) => update("chat.greeting_pt", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>System Prompt</label>
              <textarea rows={6} className={textAreaClass} value={content.chat.system_prompt} onChange={(e) => update("chat.system_prompt", e.target.value)} />
              <p className="text-[10px] text-gray-400 mt-1">Define cómo se comporta el asistente. Recibirá contexto automático de las propiedades y la información del sitio.</p>
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

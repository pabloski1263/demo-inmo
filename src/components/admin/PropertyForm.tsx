"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import toast from "react-hot-toast";
import type { Property } from "@/lib/properties";

interface PropertyFormProps {
  initial?: Partial<Property>;
  onSave: () => void;
}

export default function PropertyForm({ initial, onSave }: PropertyFormProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title_en: initial?.title_en || "",
    title_es: initial?.title_es || "",
    status: initial?.status || "for-sale",
    property_type: initial?.property_type || "house",
    price: initial?.price || 0,
    currency: initial?.currency || "CLP",
    beds: initial?.beds || 0,
    baths: initial?.baths || 0,
    sqft: initial?.sqft || 0,
    lot_size: initial?.lot_size || 0,
    year_built: initial?.year_built || 0,
    parking: initial?.parking || 0,
    stories: initial?.stories || 0,
    bedrooms: initial?.bedrooms || 0,
    bathrooms: initial?.bathrooms || 0,
    description_en: initial?.description_en || "",
    description_es: initial?.description_es || "",
    address: initial?.address || "",
    city: initial?.city || "",
    neighborhood: initial?.neighborhood || "",
    region: initial?.region || "",
    lat: initial?.lat || 0,
    lng: initial?.lng || 0,
    images: initial?.images || [""],
    features_en: initial?.features_en || [""],
    features_es: initial?.features_es || [""],
    agent_name: initial?.agent_name || "",
    agent_email: initial?.agent_email || "",
    agent_phone: initial?.agent_phone || "",
    agent_image: initial?.agent_image || "",
    mls_number: initial?.mls_number || "",
    taxes: initial?.taxes || 0,
    hoa_fees: initial?.hoa_fees || 0,
  });

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayField = (field: string, index: number, value: string) => {
    setForm((prev) => {
      const arr = [...(prev as unknown as Record<string, string[]>)[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayField = (field: string) => {
    setForm((prev) => ({ ...prev, [field]: [...(prev as unknown as Record<string, string[]>)[field], ""] }));
  };

  const removeArrayField = (field: string, index: number) => {
    setForm((prev) => {
      const arr = [...(prev as unknown as Record<string, string[]>)[field]];
      arr.splice(index, 1);
      return { ...prev, [field]: arr.length ? arr : [""] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleaned = {
        ...form,
        images: form.images.filter(Boolean),
        features_en: form.features_en.filter(Boolean),
        features_es: form.features_es.filter(Boolean),
      };

      const method = initial?.id ? "PUT" : "POST";
      const url = initial?.id ? `/api/properties/${initial.slug}` : "/api/properties";

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleaned),
      });

      if (!res.ok) throw new Error();
      toast.success(initial?.id ? "Propiedad actualizada" : "Propiedad creada");
      onSave();
    } catch {
      toast.error("Error al guardar");
    }
    setSaving(false);
  };

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";
  const labelClass = "text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Información Básica</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Título (EN)</label>
            <input className={inputClass} value={form.title_en} onChange={(e) => update("title_en", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Título (ES)</label>
            <input className={inputClass} value={form.title_es} onChange={(e) => update("title_es", e.target.value)} required />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Estado</label>
            <select className={inputClass} value={form.status} onChange={(e) => update("status", e.target.value)}>
              <option value="for-sale">En Venta</option>
              <option value="for-rent">En Arriendo</option>
              <option value="sold">Vendido</option>
              <option value="pending">Pendiente</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Tipo</label>
            <select className={inputClass} value={form.property_type} onChange={(e) => update("property_type", e.target.value)}>
              <option value="house">Casa</option>
              <option value="apartment">Departamento</option>
              <option value="land">Terreno</option>
              <option value="commercial">Comercial</option>
              <option value="other">Otro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Precio</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Precio</label>
            <input type="number" className={inputClass} value={form.price} onChange={(e) => update("price", Number(e.target.value))} required />
          </div>
          <div>
            <label className={labelClass}>Moneda</label>
            <select className={inputClass} value={form.currency} onChange={(e) => update("currency", e.target.value)}>
              <option value="CLP">CLP</option>
              <option value="UF">UF</option>
            </select>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Detalles</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {["beds", "baths", "sqft", "lot_size", "year_built", "parking", "stories", "bedrooms", "bathrooms"].map((f) => (
            <div key={f}>
              <label className={labelClass}>{f}</label>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <input type="number" className={inputClass} value={(form as any)[f]} onChange={(e) => update(f, Number(e.target.value))} />
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Descripción</h3>
        <div>
          <label className={labelClass}>Descripción (EN)</label>
          <textarea rows={4} className={inputClass} value={form.description_en} onChange={(e) => update("description_en", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Descripción (ES)</label>
          <textarea rows={4} className={inputClass} value={form.description_es} onChange={(e) => update("description_es", e.target.value)} />
        </div>
      </div>

      {/* Features */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Características</h3>
        <div>
          <label className={labelClass}>Características (EN)</label>
          {form.features_en.map((f, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className={inputClass} value={f} onChange={(e) => handleArrayField("features_en", i, e.target.value)} />
              <button type="button" onClick={() => removeArrayField("features_en", i)} className="text-red-400 hover:text-red-600 text-sm px-2">×</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayField("features_en")} className="text-xs text-teal-600 hover:text-teal-700">+ Agregar</button>
        </div>
        <div>
          <label className={labelClass}>Características (ES)</label>
          {form.features_es.map((f, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className={inputClass} value={f} onChange={(e) => handleArrayField("features_es", i, e.target.value)} />
              <button type="button" onClick={() => removeArrayField("features_es", i)} className="text-red-400 hover:text-red-600 text-sm px-2">×</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayField("features_es")} className="text-xs text-teal-600 hover:text-teal-700">+ Agregar</button>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Ubicación</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Dirección</label>
            <input className={inputClass} value={form.address} onChange={(e) => update("address", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Ciudad</label>
            <input className={inputClass} value={form.city} onChange={(e) => update("city", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Barrio</label>
            <input className={inputClass} value={form.neighborhood} onChange={(e) => update("neighborhood", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Región</label>
            <input className={inputClass} value={form.region} onChange={(e) => update("region", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Latitud</label>
            <input type="number" step="any" className={inputClass} value={form.lat} onChange={(e) => update("lat", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>Longitud</label>
            <input type="number" step="any" className={inputClass} value={form.lng} onChange={(e) => update("lng", Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Imágenes</h3>
        {form.images.map((img, i) => (
          <div key={i} className="flex gap-2">
            <input className={inputClass} value={img} onChange={(e) => handleArrayField("images", i, e.target.value)} placeholder="/api/images/..." />
            <button type="button" onClick={() => removeArrayField("images", i)} className="text-red-400 hover:text-red-600 text-sm px-2">×</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("images")} className="text-xs text-teal-600 hover:text-teal-700">+ Agregar imagen</button>
      </div>

      {/* Agent */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Agente</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input className={inputClass} value={form.agent_name} onChange={(e) => update("agent_name", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} value={form.agent_email} onChange={(e) => update("agent_email", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Teléfono</label>
            <input className={inputClass} value={form.agent_phone} onChange={(e) => update("agent_phone", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Foto URL</label>
            <input className={inputClass} value={form.agent_image} onChange={(e) => update("agent_image", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Additional */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Información Adicional</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>MLS#</label>
            <input className={inputClass} value={form.mls_number} onChange={(e) => update("mls_number", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Impuestos</label>
            <input type="number" className={inputClass} value={form.taxes} onChange={(e) => update("taxes", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>Gastos Comunes</label>
            <input type="number" className={inputClass} value={form.hoa_fees} onChange={(e) => update("hoa_fees", Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Guardando..." : initial?.id ? "Actualizar Propiedad" : "Crear Propiedad"}
        </button>
        <a href="/admin/properties" className="px-6 py-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          Cancelar
        </a>
      </div>
    </form>
  );
}

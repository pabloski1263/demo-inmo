"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Property } from "@/lib/properties";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/properties?limit=50");
      const data = await res.json();
      setProperties(data.items || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    try {
      const res = await adminFetch(`/api/properties/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Propiedad eliminada");
      load();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const filtered = properties.filter((p) =>
    !search || p.title_es.toLowerCase().includes(search.toLowerCase()) || p.title_en.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
          <p className="text-sm text-gray-500">{properties.length} propiedades</p>
        </div>
        <a
          href="/admin/properties/new"
          className="px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
        >
          Nueva Propiedad
        </a>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar propiedades..."
        className="w-full max-w-md px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-6"
      />

      {loading ? (
        <div className="text-center py-10 text-sm text-gray-400">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-sm text-gray-400">No hay propiedades</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Título</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Precio</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Dorm/baños</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{p.title_es}</p>
                    <p className="text-xs text-gray-400">{p.city} · {p.neighborhood}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{formatPrice(p.price, p.currency)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase ${
                      p.status === "for-sale" ? "bg-teal-50 text-teal-700" :
                      p.status === "for-rent" ? "bg-blue-50 text-blue-700" :
                      p.status === "sold" ? "bg-gray-100 text-gray-500" : "bg-amber-50 text-amber-700"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.beds}/{p.baths}</td>
                  <td className="px-4 py-3 text-right">
                    <a href={`/admin/properties/${p.id}/edit`} className="text-teal-600 hover:text-teal-700 text-xs font-medium mr-3">Editar</a>
                    <button onClick={() => handleDelete(p.slug, p.title_es)} className="text-red-400 hover:text-red-600 text-xs font-medium">Eliminar</button>
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

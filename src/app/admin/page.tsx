"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import type { SiteContent } from "@/lib/content";

const cards = [
  { href: "/admin/properties", label: "Propiedades", desc: "Administrar propiedades", icon: "🏠", color: "bg-teal-50 border-teal-100" },
  { href: "/admin/content", label: "Contenido", desc: "Editar secciones del sitio", icon: "📝", color: "bg-blue-50 border-blue-100" },
  { href: "/admin/translations", label: "Traducciones", desc: "Gestionar idiomas EN/ES", icon: "🌐", color: "bg-amber-50 border-amber-100" },
  { href: "/admin/site", label: "Sitio", desc: "Configuración del sitio", icon: "⚙️", color: "bg-purple-50 border-purple-100" },
];

export default function AdminDashboard() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    adminFetch("/api/content")
      .then((r) => r.json())
      .then(setContent);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Panel de administración de INMO Inmobiliaria</p>

      {/* Quick cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <a
            key={card.href}
            href={card.href}
            className={`${card.color} border rounded-xl p-5 hover:shadow-sm transition-shadow`}
          >
            <span className="text-2xl mb-3 block">{card.icon}</span>
            <h3 className="font-semibold text-gray-900 text-sm">{card.label}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{card.desc}</p>
          </a>
        ))}
      </div>

      {/* Admin credentials */}
      {content?.admin && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Credenciales de Administrador</h3>
          <p className="text-xs text-yellow-700">
            Email: <code className="bg-yellow-100 px-1.5 py-0.5 rounded">{content.admin.email}</code>
            &nbsp;— Contraseña: <code className="bg-yellow-100 px-1.5 py-0.5 rounded">{content.admin.password}</code>
          </p>
        </div>
      )}
    </div>
  );
}

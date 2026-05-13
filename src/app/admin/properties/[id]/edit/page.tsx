"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";
import type { Property } from "@/lib/properties";

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      try {
        const res = await fetch("/api/properties?limit=50");
        const data = await res.json();
        const p = (data.items || []).find((prop: Property) => prop.id === id);
        setProperty(p || null);
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, [params]);

  if (loading) return <div className="text-sm text-gray-400">Cargando...</div>;
  if (!property) return <div className="text-sm text-gray-400">Propiedad no encontrada</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar: {property.title_es}</h1>
      <PropertyForm initial={property} onSave={() => router.push("/admin/properties")} />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { formatPrice, formatArea, useReactiveLang, lt, getStatusLabel } from "@/lib/utils";
import type { Property } from "@/lib/properties";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg text-sm text-gray-400">Cargando mapa...</div>,
});

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const lang = useReactiveLang();

  useEffect(() => {
    const load = async () => {
      const { slug } = await params;
      try {
        const res = await fetch(`/api/properties/${slug}`);
        if (!res.ok) { setLoading(false); return; }
        const data = await res.json();
        setProperty(data);

        // Load similar properties
        const similarRes = await fetch(`/api/properties?type=${data.property_type}&limit=4`);
        const similarData = await similarRes.json();
        setSimilar((similarData.items || []).filter((p: Property) => p.slug !== slug).slice(0, 3));
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, [params]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen flex items-center justify-center text-gray-400 text-sm">Cargando...</div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen flex items-center justify-center text-gray-400 text-sm">
          Propiedad no encontrada
        </div>
      </>
    );
  }

  const l = (en: string, es: string, fr?: string, de?: string, it?: string, pt?: string) =>
    lt(lang, { en, es, fr: fr || en, de: de || en, it: it || en, pt: pt || es });
  const title = lt(lang, { en: property.title_en, es: property.title_es, fr: property.title_en, de: property.title_en, it: property.title_en, pt: property.title_es });
  const description = lt(lang, { en: property.description_en, es: property.description_es, fr: property.description_en, de: property.description_en, it: property.description_en, pt: property.description_es });
  const features = lang === "es" ? property.features_es : property.features_en;
  const allImages = property.images?.length ? property.images : [];

  const statusLabel = getStatusLabel(lang, property.status);

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-16 sm:pt-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <a href="/" className="hover:text-teal-600">{l("Home", "Inicio")}</a>
            <span>/</span>
            <a href="/properties" className="hover:text-teal-600">{l("Properties", "Propiedades")}</a>
            <span>/</span>
            <span className="text-gray-900">{title}</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Status badge */}
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-teal-50 text-teal-700 mb-4">
            {statusLabel}
          </span>

          <div className="grid lg:grid-cols-4 gap-2">
            {allImages.length > 0 ? (
              <>
                <div className="lg:col-span-2 lg:row-span-2">
                  <img src={allImages[0]} alt={title} className="w-full h-64 sm:h-96 object-cover rounded-xl" />
                </div>
                {allImages.slice(1, 5).map((img, i) => (
                  <div key={i} className="hidden sm:block">
                    <img src={img} alt={`${title} ${i + 2}`} className="w-full h-44 sm:h-46 object-cover rounded-xl" />
                  </div>
                ))}
              </>
            ) : (
              <div className="lg:col-span-4">
                <div className="w-full h-80 bg-gradient-to-br from-teal-50 to-gray-100 rounded-xl flex items-center justify-center">
                  <svg className="w-16 h-16 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main content: 2/3 + 1/3 sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left 2/3 */}
          <div className="lg:col-span-2 space-y-10">
            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-xl p-6"
            >
              <p className="text-3xl font-bold text-gray-900 mb-4">
                {formatPrice(property.price, property.currency)}
                {property.status === "for-rent" && <span className="text-base font-normal text-gray-500">/mes</span>}
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{property.beds}</p>
                  <p className="text-xs text-gray-500">{l("beds", "dorm.")}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{property.baths}</p>
                  <p className="text-xs text-gray-500">{l("baths", "baños")}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{formatArea(property.sqft, property.currency)}</p>
                  <p className="text-xs text-gray-500">{l("Sq. Ft.", "m² const.")}</p>
                </div>
                {property.lot_size > 0 && (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{formatArea(property.lot_size, property.currency)}</p>
                    <p className="text-xs text-gray-500">{l("Lot", "Terreno")}</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{property.year_built}</p>
                  <p className="text-xs text-gray-500">{l("Year", "Año")}</p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">{l("Description", "Descripción")}</h2>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </motion.div>

            {/* Features */}
            {features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">{l("Features", "Características")}</h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-teal-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Details table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">{l("Details", "Detalles")}</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">{l("Property Type", "Tipo")}</span>
                    <span className="text-gray-900 font-medium capitalize">{property.property_type}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">{l("Year Built", "Año Const.")}</span>
                    <span className="text-gray-900 font-medium">{property.year_built}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">{l("Parking", "Estacionamiento")}</span>
                    <span className="text-gray-900 font-medium">{property.parking}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">{l("Stories", "Pisos")}</span>
                    <span className="text-gray-900 font-medium">{property.stories}</span>
                  </div>
                  {property.taxes > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">{l("Taxes/year", "Impuestos/año")}</span>
                      <span className="text-gray-900 font-medium">{formatPrice(property.taxes)}</span>
                    </div>
                  )}
                  {property.hoa_fees > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">{l("HOA Fees", "Gastos Com.")}</span>
                      <span className="text-gray-900 font-medium">{formatPrice(property.hoa_fees)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">MLS#</span>
                    <span className="text-gray-900 font-medium">{property.mls_number}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">{l("Bedrooms", "Dormitorios")}</span>
                    <span className="text-gray-900 font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">{l("Bathrooms", "Baños")}</span>
                    <span className="text-gray-900 font-medium">{property.bathrooms}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Schools */}
            {property.schools?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">{l("Nearby Schools", "Colegios Cercanos")}</h2>
                <div className="space-y-3">
                  {property.schools.map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{s.type} · {s.distance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Location map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">{l("Location", "Ubicación")}</h2>
              <p className="text-sm text-gray-500 mb-3">{property.address}</p>
              <div className="h-72 rounded-xl overflow-hidden border border-gray-200">
                <PropertyMap
                  properties={[property]}
                  height="100%"
                />
              </div>
            </motion.div>
          </div>

          {/* Right 1/3 - Agent card */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Agent card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  {property.agent_image ? (
                    <img src={property.agent_image} alt={property.agent_name} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-teal-700 font-bold text-lg">
                        {property.agent_name?.charAt(0) || "A"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{property.agent_name}</p>
                    <p className="text-xs text-gray-500">{l("Listing Agent", "Agente")}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={`tel:${property.agent_phone}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    {l("Call", "Llamar")}
                  </a>
                  <a
                    href={`mailto:${property.agent_email}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {l("Email", "Correo")}
                  </a>
                </div>
              </div>

              {/* Price history */}
              {property.price_history?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">{l("Price History", "Historial")}</h3>
                  <div className="space-y-3">
                    {property.price_history.map((h, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <div>
                          <p className="text-gray-900 font-medium">{formatPrice(h.price, property.currency)}</p>
                          <p className="text-xs text-gray-500">{new Date(h.date).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs text-gray-500">{h.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <section className="mt-16 mb-10">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">{l("Similar Properties", "Propiedades Similares")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

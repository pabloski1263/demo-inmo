"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { getLang } from "@/lib/utils";
import type { Property } from "@/lib/properties";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg text-sm text-gray-400">Cargando mapa...</div>,
});

const SORT_OPTIONS = [
  { key: "newest", en: "Newest", es: "Más Recientes" },
  { key: "price_asc", en: "Price: Low to High", es: "Precio: Menor a Mayor" },
  { key: "price_desc", en: "Price: High to Low", es: "Precio: Mayor a Menor" },
  { key: "largest", en: "Largest", es: "Más Grandes" },
];

export default function PropertiesPage() {
  const lang = getLang();
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (beds) params.set("beds", beds);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "12");

    try {
      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      setProperties(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setProperties([]);
    }
    setLoading(false);
  }, [status, type, minPrice, maxPrice, beds, sort, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const t = (key: string) => {
    const tr: Record<string, Record<string, string>> = {
      en: {
        title: "Properties",
        filters: "Filters",
        apply: "Apply",
        clear: "Clear",
        all_types: "All Types",
        house: "House",
        apartment: "Apartment",
        land: "Land",
        commercial: "Commercial",
        all_status: "All Status",
        for_sale: "For Sale",
        for_rent: "For Rent",
        min_price: "Min Price (CLP)",
        max_price: "Max Price (CLP)",
        min_beds: "Min Beds",
        sort: "Sort by",
        map: "Map",
        list: "List",
        results: `results`,
        no_results: "No properties found",
        loading: "Loading...",
      },
      es: {
        title: "Propiedades",
        filters: "Filtros",
        apply: "Aplicar",
        clear: "Limpiar",
        all_types: "Todos los Tipos",
        house: "Casa",
        apartment: "Departamento",
        land: "Terreno",
        commercial: "Comercial",
        all_status: "Todos los Estados",
        for_sale: "En Venta",
        for_rent: "En Arriendo",
        min_price: "Precio Mín.",
        max_price: "Precio Máx.",
        min_beds: "Dorm. Mín.",
        sort: "Ordenar por",
        map: "Mapa",
        list: "Lista",
        results: `resultados`,
        no_results: "No se encontraron propiedades",
        loading: "Cargando...",
      },
    };
    return tr[lang]?.[key] || key;
  };

  return (
    <>
      <Navbar />
      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <h1 className="text-3xl font-serif font-bold text-gray-900">{t("title")}</h1>
            <p className="text-sm text-gray-500 mt-1">{total} {t("results")}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Mobile controls */}
          <div className="flex lg:hidden gap-2 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
            >
              {t("filters")}
            </button>
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
            >
              {showMap ? t("list") : t("map")}
            </button>
          </div>

          <div className="flex gap-6">
            {/* Filters sidebar */}
            <motion.aside
              initial={false}
              className={`lg:w-64 shrink-0 ${showFilters ? "block" : "hidden"} lg:block`}
            >
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5 sticky top-24">
                {/* Status */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t("all_status")}</label>
                  <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-full mt-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">{t("all_status")}</option>
                    <option value="for-sale">{t("for_sale")}</option>
                    <option value="for-rent">{t("for_rent")}</option>
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t("all_types")}</label>
                  <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="w-full mt-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">{t("all_types")}</option>
                    <option value="house">{t("house")}</option>
                    <option value="apartment">{t("apartment")}</option>
                    <option value="land">{t("land")}</option>
                    <option value="commercial">{t("commercial")}</option>
                  </select>
                </div>

                {/* Price range */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">{t("min_price")} / {t("max_price")}</label>
                  <div className="flex gap-2">
                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="∞" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                </div>

                {/* Beds */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t("min_beds")}</label>
                  <select value={beds} onChange={(e) => { setBeds(e.target.value); setPage(1); }} className="w-full mt-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">{t("min_beds")}</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}+</option>
                    ))}
                  </select>
                </div>

                <button onClick={() => { setStatus(""); setType(""); setMinPrice(""); setMaxPrice(""); setBeds(""); setPage(1); }} className="w-full py-2 text-sm text-teal-600 hover:text-teal-700 font-medium">
                  {t("clear")}
                </button>
              </div>
            </motion.aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Sort bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 hidden sm:inline">{t("sort")}:</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>{lang === "en" ? opt.en : opt.es}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Map toggle on desktop */}
              <button
                onClick={() => setShowMap(!showMap)}
                className="hidden lg:flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 mb-4 font-medium"
              >
                {showMap ? (
                  <>« {t("list")}</>
                ) : (
                  <>{t("map")} »</>
                )}
              </button>

              {/* Map */}
              {showMap && (
                <div className="h-[400px] mb-6 rounded-xl overflow-hidden border border-gray-200">
                  <PropertyMap properties={properties} onMarkerClick={(slug) => { window.location.href = `/properties/${slug}`; }} />
                </div>
              )}

              {/* Grid */}
              {loading ? (
                <div className="text-center py-20 text-gray-400 text-sm">{t("loading")}</div>
              ) : properties.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-sm">{t("no_results")}</div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {properties.map((p, i) => (
                      <PropertyCard key={p.id} property={p} index={i} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50"
                      >
                        «
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 text-sm rounded-lg ${
                            p === page
                              ? "bg-teal-600 text-white"
                              : "border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50"
                      >
                        »
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { getLang, formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/properties";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center bg-gray-100 text-sm text-gray-400">Cargando mapa...</div>,
});

const SORT_OPTIONS = [
  { key: "newest", en: "Newest", es: "Más Recientes" },
  { key: "price_asc", en: "Price: Low to High", es: "Precio: Menor a Mayor" },
  { key: "price_desc", en: "Price: High to Low", es: "Precio: Mayor a Menor" },
  { key: "largest", en: "Largest", es: "Más Grandes" },
];

export default function PropertiesPage() {
  const lang = getLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listRef = useRef<HTMLDivElement>(null);

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [showMobileList, setShowMobileList] = useState(true);

  // Filters from URL
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const beds = searchParams.get("beds") || "";
  const sort = searchParams.get("sort") || "newest";
  const q = searchParams.get("q") || "";

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (beds) params.set("beds", beds);
    if (sort) params.set("sort", sort);
    if (q) params.set("q", q);
    params.set("page", String(page));
    params.set("limit", "20");

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
  }, [status, type, minPrice, maxPrice, beds, sort, page, q]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/properties");
  };

  const handleMarkerClick = useCallback((slug: string) => {
    setActiveSlug(slug);
    const prop = properties.find((p) => p.slug === slug);
    setActiveProperty(prop || null);
    // Scroll to card in list
    if (listRef.current) {
      const el = listRef.current.querySelector(`[data-slug="${slug}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // On mobile, switch to map
    setShowMobileList(false);
  }, [properties]);

  const handleCardHover = useCallback((slug: string | null) => {
    setActiveSlug(slug);
  }, []);

  const handleCardClick = useCallback((slug: string) => {
    setActiveSlug(slug);
    const prop = properties.find((p) => p.slug === slug);
    setActiveProperty(prop || null);
    setShowMobileList(false);
  }, [properties]);

  const t = (key: string) => {
    const tr: Record<string, Record<string, string>> = {
      en: {
        title: "Properties", filters: "Filters", apply: "Apply", clear: "Clear",
        all_types: "All Types", house: "House", apartment: "Apartment", land: "Land", commercial: "Commercial",
        all_status: "All Status", for_sale: "For Sale", for_rent: "For Rent",
        min_price: "Min Price", max_price: "Max Price", min_beds: "Min Beds",
        sort: "Sort by", map: "Map", list: "List", results: "results",
        no_results: "No properties found", loading: "Loading...",
        search: "Search", view_details: "View Details",
      },
      es: {
        title: "Propiedades", filters: "Filtros", apply: "Aplicar", clear: "Limpiar",
        all_types: "Todos los Tipos", house: "Casa", apartment: "Departamento", land: "Terreno", commercial: "Comercial",
        all_status: "Todos los Estados", for_sale: "En Venta", for_rent: "En Arriendo",
        min_price: "Precio Mín.", max_price: "Precio Máx.", min_beds: "Dorm. Mín.",
        sort: "Ordenar por", map: "Mapa", list: "Lista", results: "resultados",
        no_results: "No se encontraron propiedades", loading: "Cargando...",
        search: "Buscar", view_details: "Ver Detalle",
      },
    };
    return tr[lang]?.[key] || key;
  };

  const inputClass = "px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white";

  return (
    <>
      <Navbar />
      <div className="pt-16 sm:pt-20 h-screen flex flex-col bg-white">
        {/* Top bar with filters */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
          <div className="max-w-full mx-auto">
            {/* Title + results */}
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-bold text-gray-900">{t("title")}</h1>
              <span className="text-xs text-gray-500">
                {loading ? "..." : `${total} ${t("results")}`}
              </span>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-2">
              <select value={status} onChange={(e) => updateFilter("status", e.target.value)} className={inputClass}>
                <option value="">{t("all_status")}</option>
                <option value="for-sale">{t("for_sale")}</option>
                <option value="for-rent">{t("for_rent")}</option>
              </select>
              <select value={type} onChange={(e) => updateFilter("type", e.target.value)} className={inputClass}>
                <option value="">{t("all_types")}</option>
                <option value="house">{t("house")}</option>
                <option value="apartment">{t("apartment")}</option>
                <option value="land">{t("land")}</option>
                <option value="commercial">{t("commercial")}</option>
              </select>
              <input
                type="number" value={minPrice} onChange={(e) => updateFilter("minPrice", e.target.value)}
                placeholder={t("min_price")} className={`${inputClass} w-28`}
              />
              <input
                type="number" value={maxPrice} onChange={(e) => updateFilter("maxPrice", e.target.value)}
                placeholder={t("max_price")} className={`${inputClass} w-28`}
              />
              <select value={beds} onChange={(e) => updateFilter("beds", e.target.value)} className={inputClass}>
                <option value="">{t("min_beds")}</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
              <select value={sort} onChange={(e) => updateFilter("sort", e.target.value)} className={inputClass}>
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>{lang === "en" ? opt.en : opt.es}</option>
                ))}
              </select>
              <button onClick={clearFilters} className="px-3 py-2 text-xs text-teal-600 hover:text-teal-700 font-medium">
                {t("clear")}
              </button>
            </div>
          </div>
        </div>

        {/* Main area: split screen */}
        <div className="flex-1 flex overflow-hidden">
          {/* Property list - left panel */}
          <div
            className={`w-full lg:w-[420px] xl:w-[480px] border-r border-gray-200 flex flex-col bg-white ${
              showMobileList ? "block" : "hidden lg:flex"
            }`}
          >
            {/* Results count bar */}
            <div className="shrink-0 px-4 py-2 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {loading ? t("loading") : `${properties.length} ${t("results")}`}
                </span>
              </div>
            </div>

            {/* Scrollable list */}
            <div ref={listRef} className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-20 text-gray-400 text-sm">{t("loading")}</div>
              ) : properties.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-sm">{t("no_results")}</div>
              ) : (
                <>
                  {properties.map((p) => (
                    <div key={p.id} data-slug={p.slug}>
                      <PropertyCard
                        property={p}
                        compact
                        isActive={activeSlug === p.slug}
                        onHover={handleCardHover}
                        onClick={handleCardClick}
                      />
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 px-4 py-4 border-t border-gray-100">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50"
                      >
                        «
                      </button>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                          const p = totalPages <= 7 ? i + 1 : (() => {
                            const half = 3;
                            let start = Math.max(1, page - half);
                            const end = Math.min(totalPages, start + 6);
                            if (end - start < 6) start = Math.max(1, end - 6);
                            return start + i;
                          })();
                          return (
                            <button
                              key={p}
                              onClick={() => setPage(p)}
                              className={`w-7 h-7 text-xs rounded-lg ${
                                p === page
                                  ? "bg-teal-600 text-white"
                                  : "border border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50"
                      >
                        »
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Map - right panel */}
          <div
            className={`flex-1 relative ${showMobileList ? "hidden lg:block" : "block"}`}
          >
            <PropertyMap
              properties={properties}
              onMarkerClick={handleMarkerClick}
              activeSlug={activeSlug}
              height="100%"
            />

            {/* Active property popup overlay (desktop) */}
            {activeProperty && (
              <div className="hidden lg:block absolute bottom-6 left-6 z-[1000] bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80 animate-in">
                <div className="flex gap-3">
                  <div className="w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {activeProperty.images?.[0] ? (
                      <img src={activeProperty.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-50 to-gray-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-900">
                      {formatPrice(activeProperty.price, activeProperty.currency)}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">
                      {lang === "en" ? activeProperty.title_en : activeProperty.title_es}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {activeProperty.beds} bd &middot; {activeProperty.baths} ba &middot; {activeProperty.sqft} m²
                    </p>
                    <a
                      href={`/properties/${activeProperty.slug}`}
                      className="inline-block mt-2 text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      {t("view_details")} →
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setActiveProperty(null)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  ×
                </button>
              </div>
            )}

            {/* Mobile toggle */}
            <div className="lg:hidden absolute top-4 left-4 z-[1000]">
              <button
                onClick={() => setShowMobileList(!showMobileList)}
                className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-gray-700"
              >
                {showMobileList ? t("map") : t("list")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

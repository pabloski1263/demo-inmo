"use client";

import { useCallback } from "react";
import { formatPrice, formatArea, getLang } from "@/lib/utils";
import type { Property } from "@/lib/properties";

interface PropertyCardProps {
  property: Property;
  index?: number;
  isActive?: boolean;
  onHover?: (slug: string | null) => void;
  onClick?: (slug: string) => void;
  compact?: boolean;
}

export default function PropertyCard({ property, isActive, onHover, onClick, compact = false }: PropertyCardProps) {
  const lang = getLang();
  const title = lang === "en" ? property.title_en : property.title_es;

  const statusColors: Record<string, string> = {
    "for-sale": "bg-teal-500",
    "for-rent": "bg-blue-500",
    sold: "bg-gray-500",
    pending: "bg-amber-500",
  };

  const statusLabel: Record<string, Record<string, string>> = {
    en: { "for-sale": "For Sale", "for-rent": "For Rent", sold: "Sold", pending: "Pending" },
    es: { "for-sale": "En Venta", "for-rent": "En Arriendo", sold: "Vendido", pending: "Pendiente" },
  };

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(property.slug);
    }
  }, [onClick, property.slug]);

  const handleMouseEnter = useCallback(() => onHover?.(property.slug), [onHover, property.slug]);
  const handleMouseLeave = useCallback(() => onHover?.(null), [onHover]);

  if (compact) {
    return (
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`flex gap-3 p-3 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${
          isActive ? "bg-teal-50 border-l-2 border-l-teal-500" : "hover:bg-gray-50 border-l-2 border-l-transparent"
        }`}
      >
        {/* Thumbnail */}
        <div className="w-24 h-18 shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {property.images?.[0] ? (
            <img src={property.images[0]} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100">
              <svg className="w-6 h-6 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-gray-900">
            {formatPrice(property.price, property.currency)}
          </p>
          <p className="text-xs text-gray-600 mt-0.5 truncate">{title}</p>
          <p className="text-xs text-gray-400 truncate mt-0.5">{property.address}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span>{property.beds} {lang === "en" ? "bd" : "dorm"}</span>
            <span>&middot;</span>
            <span>{property.baths} {lang === "en" ? "ba" : "ba"}</span>
            <span>&middot;</span>
            <span>{formatArea(property.sqft)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <a
      href={`/properties/${property.slug}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group block bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100">
            <svg className="w-10 h-10 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}
        <div className={`absolute top-3 left-3 ${statusColors[property.status] || "bg-gray-500"} text-white text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider`}>
          {statusLabel[lang]?.[property.status] || property.status}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5">
        <p className="text-xl font-bold text-gray-900 mb-1">
          {formatPrice(property.price, property.currency)}
        </p>
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-1">
          <svg className="w-3.5 h-3.5 inline mr-1 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {property.address}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-600 pt-3 border-t border-gray-50">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {property.beds} {lang === "en" ? "beds" : "dorm."}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 15v3h20v-3M4 15V9a2 2 0 012-2h12a2 2 0 012 2v6M2 18h20" />
            </svg>
            {property.baths} {lang === "en" ? "baths" : "baños"}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            {formatArea(property.sqft)}
          </span>
        </div>
      </div>
    </a>
  );
}

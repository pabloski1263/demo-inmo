"use client";

import { useEffect, useRef } from "react";
import { LngLatBounds } from "maplibre-gl";
import { Map, useMap, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map";
import { formatPrice, getLang, getStatusLabel, lt, type Lang } from "@/lib/utils";
import type { Property } from "@/lib/properties";

interface PropertyMapProps {
  properties: Property[];
  onMarkerClick?: (slug: string) => void;
  height?: string;
  activeSlug?: string | null;
}

/* ─── Map bounds: auto-fit on property change ─── */
function MapBoundsUpdater({ properties }: { properties: Property[] }) {
  const { map, isLoaded } = useMap();
  const prevKey = useRef("");

  useEffect(() => {
    if (!isLoaded || !map || properties.length === 0) return;

    const key = properties.map((p) => p.id).join(",");
    if (key === prevKey.current) return;
    prevKey.current = key;

    if (properties.length === 1) {
      map.flyTo({ center: [properties[0].lng, properties[0].lat], zoom: 14, duration: 1500 });
    } else {
      const bounds = new LngLatBounds();
      properties.forEach((p) => bounds.extend([p.lng, p.lat]));
      map.fitBounds(bounds, { padding: 50, duration: 1000 });
    }
  }, [map, isLoaded, properties]);

  return null;
}

/* ─── Fly to active property when selected ─── */
function MapFlyToUpdater({ activeSlug, properties }: { activeSlug: string | null; properties: Property[] }) {
  const { map, isLoaded } = useMap();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !map || !activeSlug || activeSlug === prev.current) return;
    prev.current = activeSlug;

    const prop = properties.find((p) => p.slug === activeSlug);
    if (prop) {
      map.flyTo({ center: [prop.lng, prop.lat], zoom: 15, duration: 1200 });
    }
  }, [map, isLoaded, activeSlug, properties]);

  return null;
}

/* ─── Price marker with glassmorphism + arrow ─── */
function PriceMarker({
  price,
  currency,
  isActive,
  index = 0,
}: {
  price: number;
  currency: string;
  isActive: boolean;
  index?: number;
}) {
  return (
    <div
      className="relative"
      style={{ animation: `marker-in 0.35s ease-out ${index * 0.025}s both` }}
    >
      {/* Badge */}
      <div
        className={`
          px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap
          transition-all duration-300 ease-out relative z-10 cursor-pointer
          ${isActive
            ? "bg-teal-600 text-white scale-110 shadow-lg shadow-teal-600/30"
            : "bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-200/80 shadow-md hover:shadow-lg hover:border-teal-300 hover:scale-105"
          }
        `}
      >
        {formatPrice(price, currency)}
      </div>
      {/* Arrow pointer */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 z-0
          transition-all duration-300
          ${isActive
            ? "bg-teal-600"
            : "bg-white border-r border-b border-gray-200/80"
          }
        `}
      />
    </div>
  );
}

/* ─── Rich popup card ─── */
function RichPopup({ property }: { property: Property }) {
  const lang = getLang() as Lang;
  const title = lt(lang, { en: property.title_en, es: property.title_es, fr: property.title_en, de: property.title_en, it: property.title_en, pt: property.title_es });

  return (
    <div className="w-64 overflow-hidden rounded-xl shadow-xl border border-gray-100 bg-white">
      {/* Image */}
      <div className="relative h-36 bg-gray-100">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100">
            <svg className="w-8 h-8 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-semibold px-2 py-0.5 rounded-full text-gray-700 uppercase tracking-wider shadow-sm">
          {getStatusLabel(lang, property.status)}
        </span>
      </div>

      {/* Details */}
      <div className="p-3.5">
        <p className="text-lg font-bold text-gray-900 leading-tight">
          {formatPrice(property.price, property.currency)}
        </p>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{title}</p>

        <div className="flex items-center gap-3 text-xs text-gray-600 mt-2">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {property.beds}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 15v3h20v-3M4 15V9a2 2 0 012-2h12a2 2 0 012 2v6M2 18h20" />
            </svg>
            {property.baths}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            {property.sqft} sq. ft.
          </span>
        </div>

        <a
          href={`/properties/${property.slug}`}
          className="mt-3 block w-full text-center text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg py-2 transition-colors"
        >
          {lt(lang, { en: "View Details →", es: "Ver Detalle →", fr: "Voir Détails →", de: "Details →", it: "Vedi Dettagli →", pt: "Ver Detalhes →" })}
        </a>
      </div>
    </div>
  );
}

/* ─── Main export ─── */
export default function PropertyMap({
  properties,
  onMarkerClick,
  height = "100%",
  activeSlug = null,
}: PropertyMapProps) {
  const mapCenter: [number, number] =
    properties.length > 0
      ? [properties[0].lat, properties[0].lng]
      : [-33.4489, -70.6693];

  return (
    <div style={{ height, width: "100%" }}>
      {/* Marker entrance keyframes */}
      <style jsx global>{`
        @keyframes marker-in {
          from { opacity: 0; transform: translateY(8px) scale(0.7); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <Map
        center={mapCenter}
        zoom={12}
        scrollZoom={true}
        attributionControl={false}
        dragRotate={false}
        touchZoomRotate={false}
      >
        <MapBoundsUpdater properties={properties} />
        <MapFlyToUpdater activeSlug={activeSlug} properties={properties} />
        <MapControls showZoom showLocate position="top-right" />

        {properties.map((p, i) => (
          <MapMarker
            key={p.id}
            longitude={p.lng}
            latitude={p.lat}
            onClick={() => onMarkerClick?.(p.slug)}
          >
            <MarkerContent>
              <PriceMarker
                price={p.price}
                currency={p.currency}
                isActive={activeSlug === p.slug}
                index={i}
              />
            </MarkerContent>
            <MarkerPopup>
              <RichPopup property={p} />
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}

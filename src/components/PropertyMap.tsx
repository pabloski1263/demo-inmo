"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/properties";

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createPriceIcon(price: string, isActive: boolean) {
  return L.divIcon({
    className: "bg-transparent",
    html: `<div style="
      background:${isActive ? "#0d9488" : "white"};
      color:${isActive ? "white" : "#1a1a1a"};
      padding:5px 10px;
      border-radius:8px;
      font-size:12px;
      font-weight:600;
      white-space:nowrap;
      box-shadow:0 2px 8px rgba(0,0,0,0.15);
      border:2px solid ${isActive ? "#0d9488" : "#e5e7eb"};
      transition:all 0.2s;
      font-family:system-ui,-apple-system,sans-serif;
    ">${price}</div>`,
    iconSize: [0, 0],
    iconAnchor: [40, 20],
  });
}

interface PropertyMapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (slug: string) => void;
  height?: string;
  activeSlug?: string | null;
}

function MapBoundsUpdater({ properties }: { properties: Property[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (properties.length > 1 && !fitted.current) {
      const bounds = L.latLngBounds(properties.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
      fitted.current = true;
    }
  }, [properties, map]);

  return null;
}

export default function PropertyMap({ properties, onMarkerClick, height = "100%", activeSlug = null }: PropertyMapProps) {
  const mapCenter: [number, number] =
    properties.length > 0
      ? [properties[0].lat, properties[0].lng]
      : [-33.4489, -70.6693];

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={mapCenter}
        zoom={12}
        className="h-full w-full"
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBoundsUpdater properties={properties} />
        {properties.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={createPriceIcon(formatPrice(p.price, p.currency), activeSlug === p.slug)}
            eventHandlers={{
              click: () => onMarkerClick?.(p.slug),
            }}
          >
            <Popup>
              <div style={{ maxWidth: 220, fontFamily: "system-ui,sans-serif" }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                  {formatPrice(p.price, p.currency)}
                </div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>
                  {p.beds} beds &bull; {p.baths} baths &bull; {p.sqft} m²
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {p.address}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

const houseIcon = new L.DivIcon({
  className: "bg-transparent",
  html: `<div style="background:#0d9488;color:white;padding:4px 8px;border-radius:8px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2)">🏠</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

interface PropertyMapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (slug: string) => void;
  height?: string;
}

export default function PropertyMap({ properties, center, zoom = 12, onMarkerClick, height = "100%" }: PropertyMapProps) {
  useEffect(() => {
    // Force re-render of leaflet on mount
  }, []);

  const mapCenter: [number, number] = center || (
    properties.length > 0
      ? [properties[0].lat, properties[0].lng]
      : [-33.4489, -70.6693]
  );

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full rounded-lg"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={houseIcon}
            eventHandlers={{
              click: () => onMarkerClick?.(p.slug),
            }}
          >
            <Popup>
              <div style={{ maxWidth: 200 }}>
                <strong>{p.title_es || p.title_en}</strong>
                <br />
                <span>{formatPrice(p.price, p.currency)}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

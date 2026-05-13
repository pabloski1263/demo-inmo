import path from "path";
import fs from "fs";

const DATA_FILE = path.join(process.cwd(), "data", "properties.json");

export type PropertyStatus = "for-sale" | "for-rent" | "sold" | "pending";
export type PropertyType = "house" | "apartment" | "land" | "commercial" | "other";

export interface School {
  name: string;
  type: string;
  distance: string;
}

export interface PriceHistory {
  date: string;
  price: number;
  event: string;
}

export interface Property {
  id: string;
  slug: string;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
  price: number;
  currency: string;
  beds: number;
  baths: number;
  sqft: number;
  lot_size: number;
  year_built: number;
  property_type: PropertyType;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  features_en: string[];
  features_es: string[];
  address: string;
  city: string;
  neighborhood: string;
  region: string;
  lat: number;
  lng: number;
  images: string[];
  agent_name: string;
  agent_email: string;
  agent_phone: string;
  agent_image: string;
  mls_number: string;
  taxes: number;
  hoa_fees: number;
  parking: number;
  stories: number;
  bedrooms: number;
  bathrooms: number;
  schools: School[];
  price_history: PriceHistory[];
}

export function getProperties(): Property[] {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return getProperties().find((p) => p.slug === slug);
}

export function getPropertyById(id: string): Property | undefined {
  return getProperties().find((p) => p.id === id);
}

export function saveProperties(properties: Property[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(properties, null, 2), "utf-8");
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

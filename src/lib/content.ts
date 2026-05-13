import path from "path";
import fs from "fs";

const DATA_FILE = path.join(process.cwd(), "data", "content.json");

export interface SiteContent {
  site: {
    name: string;
    subtitle: string;
    logo: string;
    favicon: string;
    legal_name: string;
  };
  hero: {
    title_en: string;
    title_es: string;
    subtitle_en: string;
    subtitle_es: string;
    background_image: string;
    search_placeholder: string;
  };
  featured: {
    title_en: string;
    title_es: string;
    subtitle_en: string;
    subtitle_es: string;
  };
  about: {
    title_en: string;
    title_es: string;
    description_en: string;
    description_es: string;
    image: string;
  };
  services: {
    title_en: string;
    title_es: string;
    items: ServiceItem[];
  };
  contact: {
    title_en: string;
    title_es: string;
    address: string;
    phone: string;
    email: string;
    hours_en: string;
    hours_es: string;
    map_lat: number;
    map_lng: number;
  };
  footer: {
    description_en: string;
    description_es: string;
    social: { instagram: string; facebook: string; linkedin: string };
    legal_links: { label_en: string; label_es: string; url: string }[];
  };
  admin: {
    email: string;
    password: string;
    token?: string;
  };
  translations: {
    en: Record<string, string>;
    es: Record<string, string>;
  };
}

export interface ServiceItem {
  id: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  icon: string;
}

export function getContent(): SiteContent {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export function saveContent(data: SiteContent): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

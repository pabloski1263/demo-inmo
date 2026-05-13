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
  agent: AgentProfile;
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
  chat: {
    enabled: boolean;
    api_key: string;
    model: string;
    system_prompt: string;
    greeting: string;
  };
  admin: {
    email: string;
    password: string;
    token?: string;
  };
  translations: {
    en: Record<string, string>;
    es: Record<string, string>;
    fr: Record<string, string>;
    de: Record<string, string>;
    it: Record<string, string>;
    pt: Record<string, string>;
  };
}

export interface AgentProfile {
  first_name: string;
  last_name: string;
  title_en: string;
  title_es: string;
  photo: string;
  bio_en: string;
  bio_es: string;
  credentials: string[];
  languages: string[];
  expertise_areas: ExpertiseArea[];
  stats: AgentStat[];
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
    youtube: string;
    whatsapp: string;
  };
  brokerage: {
    name: string;
    logo: string;
    website: string;
  };
  mls_badge: string;
  review_link: string;
  review_text_en: string;
  review_text_es: string;
}

export interface ExpertiseArea {
  id: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  icon: string;
}

export interface AgentStat {
  label_en: string;
  label_es: string;
  value: string;
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

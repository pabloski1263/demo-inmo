export type Lang = "en" | "es" | "fr" | "de" | "it" | "pt";

export function cn(...classes: Array<string | undefined | null | false | 0 | "">): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number, currency: string = "USD"): string {
  if (currency === "UF") {
    return `${price.toLocaleString("es-CL")} UF`;
  }
  if (currency === "USD") {
    return `$${price.toLocaleString("en-US")}`;
  }
  return `$${price.toLocaleString("es-CL")}`;
}

export function formatArea(sqft: number, currency: string = "USD"): string {
  return currency === "USD"
    ? `${sqft.toLocaleString("en-US")} sq. ft.`
    : `${sqft.toLocaleString("es-CL")} m²`;
}

const LANG_COOKIE = "lang";
const SUPPORTED_LANGS: Lang[] = ["en", "es", "fr", "de", "it", "pt"];

export function getLang(): Lang {
  if (typeof window === "undefined") return "es";

  const params = new URLSearchParams(window.location.search);
  const fromParam = params.get("lang");
  if (SUPPORTED_LANGS.includes(fromParam as Lang)) return fromParam as Lang;

  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=(\\w+)`));
  if (match) {
    const val = match[1] as Lang;
    if (SUPPORTED_LANGS.includes(val)) return val;
  }

  const browserLang = navigator.language?.slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGS.includes(browserLang as Lang)) return browserLang as Lang;

  return "es";
}

export function useLangTranslations(translations: { en: Record<string, string>; es: Record<string, string>; fr?: Record<string, string>; de?: Record<string, string>; it?: Record<string, string>; pt?: Record<string, string> }): { lang: Lang; t: (key: string) => string } {
  const lang = getLang();
  return {
    lang,
    t: (key: string) => translations[lang]?.[key] ?? translations.en?.[key] ?? key,
  };
}

export function switchLang(to: Lang): void {
  document.cookie = `${LANG_COOKIE}=${to};path=/;max-age=${60 * 60 * 24 * 365}`;
}

/** Helper for inline translations — pass a record of lang → text */
export function lt(lang: Lang, texts: Record<Lang, string>): string {
  return texts[lang] || texts.en || "";
}

export function getStatusLabel(lang: Lang, status: string): string {
  const labels: Record<string, Record<Lang, string>> = {
    "for-sale": { en: "For Sale", es: "En Venta", fr: "À Vendre", de: "Zu Verkaufen", it: "In Vendita", pt: "À Venda" },
    "for-rent": { en: "For Rent", es: "En Arriendo", fr: "À Louer", de: "Zu Vermieten", it: "In Affitto", pt: "Para Alugar" },
    sold: { en: "Sold", es: "Vendido", fr: "Vendu", de: "Verkauft", it: "Venduto", pt: "Vendido" },
    pending: { en: "Pending", es: "Pendiente", fr: "En Attente", de: "Ausstehend", it: "In Attesa", pt: "Pendente" },
  };
  return labels[status]?.[lang] || labels[status]?.en || status;
}

export const LANG_FLAGS: Record<Lang, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  it: "🇮🇹",
  pt: "🇵🇹",
};

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
};

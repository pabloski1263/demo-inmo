export function cn(...classes: Array<string | undefined | null | false | 0 | "">): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number, currency: string = "CLP"): string {
  if (currency === "UF") {
    return `${price.toLocaleString("es-CL")} UF`;
  }
  return `$${price.toLocaleString("es-CL")}`;
}

export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString("es-CL")} m²`;
}

interface LangResult {
  lang: "en" | "es";
  t: (key: string) => string;
}

export function getLang(): "en" | "es" {
  if (typeof window === "undefined") return "es";

  const params = new URLSearchParams(window.location.search);
  const fromParam = params.get("lang");
  if (fromParam === "en" || fromParam === "es") return fromParam;

  const match = document.cookie.match(/(?:^|;\s*)lang=(\w+)/);
  if (match) {
    const val = match[1];
    if (val === "en" || val === "es") return val;
  }

  return "es";
}

export function useLangTranslations(translations: { en: Record<string, string>; es: Record<string, string> }): LangResult {
  const lang = getLang();
  return {
    lang,
    t: (key: string) => translations[lang]?.[key] ?? translations.en?.[key] ?? key,
  };
}

export function switchLang(to: "en" | "es"): void {
  document.cookie = `lang=${to};path=/;max-age=${60 * 60 * 24 * 365}`;
}

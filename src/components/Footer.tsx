"use client";

import { useLangTranslations } from "@/lib/utils";
import type { SiteContent } from "@/lib/content";

interface FooterProps {
  content: SiteContent;
}

export default function Footer({ content }: FooterProps) {
  const { lang, t } = useLangTranslations(content.translations);
  const description = lang === "en" ? content.footer.description_en : content.footer.description_es;

  const initials = content.site.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {content.site.logo ? (
                <img src={content.site.logo} alt={content.site.name} className="w-8 h-8 object-contain" />
              ) : (
                <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{initials}</span>
                </div>
              )}
              <span className="text-white font-semibold text-sm">{content.site.name}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{lang === "en" ? "Quick Links" : "Enlaces Rápidos"}</h4>
            <ul className="space-y-2.5">
              <li><a href="/properties" className="text-sm text-gray-400 hover:text-white transition-colors">{t("nav.properties")}</a></li>
              <li><a href="/properties?status=for-sale" className="text-sm text-gray-400 hover:text-white transition-colors">{t("nav.buy")}</a></li>
              <li><a href="/properties?status=for-rent" className="text-sm text-gray-400 hover:text-white transition-colors">{t("nav.rent")}</a></li>
              <li><a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">{t("nav.about")}</a></li>
              <li><a href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors">{t("nav.contact")}</a></li>
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{lang === "en" ? "Properties" : "Propiedades"}</h4>
            <ul className="space-y-2.5">
              <li><a href="/properties?status=for-sale&type=house" className="text-sm text-gray-400 hover:text-white transition-colors">{t("filter.house")}</a></li>
              <li><a href="/properties?status=for-sale&type=apartment" className="text-sm text-gray-400 hover:text-white transition-colors">{t("filter.apartment")}</a></li>
              <li><a href="/properties?status=for-rent" className="text-sm text-gray-400 hover:text-white transition-colors">{t("property.for_rent")}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{t("nav.contact")}</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>{content.contact.address}</li>
              <li>{content.contact.phone}</li>
              <li>{content.contact.email}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {content.site.legal_name || content.site.name}. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4">
            {content.footer.legal_links.map((link) => (
              <a key={link.url} href={link.url} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                {lang === "en" ? link.label_en : link.label_es}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

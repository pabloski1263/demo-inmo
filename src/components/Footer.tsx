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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:pr-8">
            <div className="flex items-center gap-3 mb-4">
              {content.site.logo ? (
                <img src={content.site.logo} alt={content.site.name} className="w-8 h-8 object-contain" />
              ) : (
                <div className="w-9 h-9 bg-teal-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs tracking-wider">{initials}</span>
                </div>
              )}
              <span className="text-white font-serif text-base font-semibold tracking-wide">{content.site.name}</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {content.footer.social.instagram && (
                <a href={content.footer.social.instagram} className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 transition-all" aria-label="Instagram">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
              )}
              {content.footer.social.facebook && (
                <a href={content.footer.social.facebook} className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 transition-all" aria-label="Facebook">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </a>
              )}
              {content.footer.social.linkedin && (
                <a href={content.footer.social.linkedin} className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 transition-all" aria-label="LinkedIn">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-5">{lang === "en" ? "Quick Links" : "Enlaces Rápidos"}</h4>
            <ul className="space-y-3">
              <li><a href="/properties" className="text-sm text-gray-500 hover:text-white transition-colors">{t("nav.properties")}</a></li>
              <li><a href="/properties?status=for-sale" className="text-sm text-gray-500 hover:text-white transition-colors">{t("nav.buy")}</a></li>
              <li><a href="/properties?status=for-rent" className="text-sm text-gray-500 hover:text-white transition-colors">{t("nav.rent")}</a></li>
              <li><a href="#about" className="text-sm text-gray-500 hover:text-white transition-colors">{t("nav.about")}</a></li>
              <li><a href="#contact" className="text-sm text-gray-500 hover:text-white transition-colors">{t("nav.contact")}</a></li>
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-5">{lang === "en" ? "Properties" : "Propiedades"}</h4>
            <ul className="space-y-3">
              <li><a href="/properties?status=for-sale&type=house" className="text-sm text-gray-500 hover:text-white transition-colors">{t("filter.house")}</a></li>
              <li><a href="/properties?status=for-sale&type=apartment" className="text-sm text-gray-500 hover:text-white transition-colors">{t("filter.apartment")}</a></li>
              <li><a href="/properties?status=for-rent" className="text-sm text-gray-500 hover:text-white transition-colors">{t("property.for_rent")}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-5">{t("nav.contact")}</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="leading-relaxed">{content.contact.address}</li>
              <li><a href={`tel:${content.contact.phone}`} className="hover:text-white transition-colors">{content.contact.phone}</a></li>
              <li><a href={`mailto:${content.contact.email}`} className="hover:text-white transition-colors">{content.contact.email}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/60 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} {content.site.legal_name || content.site.name}. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-5">
            {content.footer.legal_links.map((link) => (
              <a key={link.url} href={link.url} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                {lang === "en" ? link.label_en : link.label_es}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { getLang, switchLang, LANG_FLAGS, LANG_LABELS, type Lang } from "@/lib/utils";
import type { SiteContent } from "@/lib/content";

const navItems = [
  { key: "nav.properties", href: "/properties" },
  { key: "nav.buy", href: "/properties?status=for-sale" },
  { key: "nav.rent", href: "/properties?status=for-rent" },
  { key: "nav.about", href: "#about" },
  { key: "nav.contact", href: "#contact" },
];

const LANG_OPTIONS: Lang[] = ["en", "es", "fr", "de", "it", "pt"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [lang, setLang] = useState<Lang>("es");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLang(getLang());
    fetch("/api/content")
      .then((r) => r.json())
      .then(setContent);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const t = (key: string) =>
    content?.translations?.[lang]?.[key] ?? content?.translations?.en?.[key] ?? key;

  const handleLangSelect = (next: Lang) => {
    switchLang(next);
    setLang(next);
    setLangDropdown(false);
  };

  const isSolid = isHome ? scrolled : true;

  const agent = content?.agent;
  const fullName = agent ? `${agent.first_name} ${agent.last_name}` : "";
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isSolid
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100/80"
          : "bg-white/5 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo + Agent name */}
        <a href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <img
            src="/logo-sebastian.png"
            alt={fullName || "Sebastián Acosta"}
            className="h-7 sm:h-9 w-auto object-contain"
          />
          <div className="hidden sm:block">
            <p
              className={`font-serif text-lg font-semibold leading-tight tracking-wide transition-colors ${
                isSolid ? "text-teal-700" : "text-white"
              }`}
            >
              {fullName || content?.site?.name || "INMO"}
            </p>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7 lg:gap-9">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`relative text-sm tracking-wider font-medium transition-colors duration-300 group ${
                isSolid ? "text-gray-700 hover:text-teal-700" : "text-white/85 hover:text-white"
              }`}
            >
              {t(item.key)}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          {/* Language dropdown */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangDropdown(!langDropdown)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                isSolid
                  ? "border-gray-300 text-gray-600 hover:border-teal-600 hover:text-teal-700"
                  : "border-white/40 text-white/80 hover:border-white hover:text-white"
              }`}
            >
              <span>{LANG_FLAGS[lang]}</span>
              <span>{LANG_LABELS[lang]}</span>
              <svg className={`w-3 h-3 transition-transform ${langDropdown ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <AnimatePresence>
              {langDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-xl shadow-lg overflow-hidden"
                >
                  {LANG_OPTIONS.map((l) => (
                    <button
                      key={l}
                      onClick={() => handleLangSelect(l)}
                      className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-medium transition-colors ${
                        lang === l
                          ? "bg-teal-50 text-teal-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-sm">{LANG_FLAGS[l]}</span>
                      <span>{LANG_LABELS[l]}</span>
                      {lang === l && (
                        <svg className="w-3.5 h-3.5 ml-auto text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* WhatsApp */}
          {content?.agent?.social?.whatsapp && (
            <a
              href={`https://wa.me/${content.agent.social.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                isSolid
                  ? "border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600"
                  : "border-white/40 text-white/80 hover:border-green-400 hover:text-green-300"
              }`}
              aria-label="WhatsApp"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          )}

          <a
            href="#contact"
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
              isSolid
                ? "bg-teal-700 text-white hover:bg-teal-600 shadow-sm"
                : "bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm"
            }`}
          >
            {t("common.contact_agent")}
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-3">
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangDropdown(!langDropdown)}
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${
                isSolid ? "border-gray-300 text-gray-600" : "border-white/50 text-white/80"
              }`}
            >
              <span>{LANG_FLAGS[lang]}</span>
              <svg className={`w-3 h-3 transition-transform ${langDropdown ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <AnimatePresence>
              {langDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-xl shadow-lg overflow-hidden"
                >
                  {LANG_OPTIONS.map((l) => (
                    <button
                      key={l}
                      onClick={() => handleLangSelect(l)}
                      className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-medium transition-colors ${
                        lang === l
                          ? "bg-teal-50 text-teal-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-sm">{LANG_FLAGS[l]}</span>
                      <span>{LANG_LABELS[l]}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 transition-colors ${isSolid ? "text-gray-800" : "text-white"}`}
            aria-label="Menú"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-100"
          >
            <div className="px-4 py-5 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm tracking-wider text-gray-700 hover:text-teal-700 transition-colors py-3 px-3 rounded-lg hover:bg-teal-50/50"
                >
                  {t(item.key)}
                </a>
              ))}
              {content?.agent?.social?.whatsapp && (
                <a
                  href={`https://wa.me/${content.agent.social.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-5 py-3 border border-green-200 text-green-700 text-sm font-medium rounded-lg mt-2 hover:bg-green-50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              )}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-5 py-3 bg-teal-700 text-white text-sm font-medium rounded-lg mt-2 hover:bg-teal-600 transition-colors"
              >
                {t("common.contact_agent")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

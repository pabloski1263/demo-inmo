"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLang, switchLang } from "@/lib/utils";
import type { SiteContent } from "@/lib/content";

const navItems = [
  { key: "nav.properties", href: "/properties" },
  { key: "nav.buy", href: "/properties?status=for-sale" },
  { key: "nav.rent", href: "/properties?status=for-rent" },
  { key: "nav.about", href: "#about" },
  { key: "nav.contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [lang, setLang] = useState<"en" | "es">("es");

  useEffect(() => {
    setLang(getLang());
    fetch("/api/content")
      .then((r) => r.json())
      .then(setContent);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const t = (key: string) =>
    content?.translations?.[lang]?.[key] ?? content?.translations?.en?.[key] ?? key;

  const handleLangToggle = () => {
    const next = lang === "es" ? "en" : "es";
    switchLang(next);
    setLang(next);
  };

  const initials = content?.site?.name
    ? content.site.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "IN";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          {content?.site?.logo ? (
            <img src={content.site.logo} alt={content.site.name} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">{initials}</span>
            </div>
          )}
          <div className="hidden sm:block">
            <p className={`text-sm font-semibold leading-tight ${scrolled ? "text-gray-900" : "text-white"}`}>
              {content?.site?.name || "INMO"}
            </p>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`text-sm transition-colors duration-300 ${
                scrolled ? "text-gray-600 hover:text-teal-600" : "text-white/80 hover:text-white"
              }`}
            >
              {t(item.key)}
            </a>
          ))}

          {/* Language switcher */}
          <button
            onClick={handleLangToggle}
            className={`text-xs font-medium px-2.5 py-1.5 rounded border transition-all ${
              scrolled
                ? "text-teal-600 border-teal-600 hover:bg-teal-50"
                : "text-white border-white/40 hover:border-white"
            }`}
          >
            {lang === "es" ? "EN" : "ES"}
          </button>

          <a
            href="#contact"
            className="px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-sm"
          >
            {t("common.contact_agent")}
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={handleLangToggle}
            className={`text-xs font-medium px-2 py-1 rounded border ${
              scrolled ? "text-teal-600 border-teal-600" : "text-white border-white/50"
            }`}
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 ${scrolled ? "text-gray-900" : "text-white"}`}
            aria-label="Menú"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-gray-700 hover:text-teal-600 transition-colors py-2.5 px-3 rounded-lg hover:bg-teal-50"
                >
                  {t(item.key)}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-5 py-3 bg-teal-600 text-white text-sm font-medium rounded-lg mt-3"
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

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isHome = pathname === "/";

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

  const t = (key: string) =>
    content?.translations?.[lang]?.[key] ?? content?.translations?.en?.[key] ?? key;

  const handleLangToggle = () => {
    const next = lang === "es" ? "en" : "es";
    switchLang(next);
    setLang(next);
  };

  const isSolid = isHome ? scrolled : true;

  const agent = content?.agent;
  const fullName = agent ? `${agent.first_name} ${agent.last_name}` : "";
  const initials = agent
    ? `${agent.first_name[0]}${agent.last_name[0]}`
    : "IN";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isSolid
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100/80"
          : "bg-white/5 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo — Agent photo + name */}
        <a href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          {agent?.photo ? (
            <img src={agent.photo} alt={fullName} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-teal-700/20" />
          ) : (
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-teal-700 to-teal-800 rounded-full flex items-center justify-center group-hover:from-teal-600 transition-all">
              <span className="text-white font-bold text-xs sm:text-sm tracking-wider">{initials}</span>
            </div>
          )}
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

          {/* Language switcher */}
          <button
            onClick={handleLangToggle}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              isSolid
                ? "border-gray-300 text-gray-600 hover:border-teal-600 hover:text-teal-700"
                : "border-white/40 text-white/80 hover:border-white hover:text-white"
            }`}
          >
            {lang === "es" ? "EN" : "ES"}
          </button>

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
          <button
            onClick={handleLangToggle}
            className={`text-xs font-medium px-2 py-1 rounded-full border ${
              isSolid ? "border-gray-300 text-gray-600" : "border-white/50 text-white/80"
            }`}
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
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
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-5 py-3 bg-teal-700 text-white text-sm font-medium rounded-lg mt-4 hover:bg-teal-600 transition-colors"
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

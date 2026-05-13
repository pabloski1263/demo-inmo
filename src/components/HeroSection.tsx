"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getLang } from "@/lib/utils";

interface HeroSectionProps {
  title_en: string;
  title_es: string;
  subtitle_en: string;
  subtitle_es: string;
  background_image: string;
}

export default function HeroSection({ title_en, title_es, subtitle_en, subtitle_es, background_image }: HeroSectionProps) {
  const [lang, setLang] = useState<"en" | "es">("es");
  const [searchTab, setSearchTab] = useState<"buy" | "rent">("buy");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLang(getLang());
  }, []);

  const t = (key: string) => {
    const translations = {
      en: { buy: "Buy", rent: "Rent", search: "Search", placeholder: "City, neighborhood or address..." },
      es: { buy: "Comprar", rent: "Arrendar", search: "Buscar", placeholder: "Ciudad, barrio o dirección..." },
    };
    const tr = translations[lang];
    return (tr as Record<string, string>)[key] || key;
  };

  const title = lang === "en" ? title_en : title_es;
  const subtitle = lang === "en" ? subtitle_en : subtitle_es;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    params.set("status", searchTab === "buy" ? "for-sale" : "for-rent");
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      {background_image ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${background_image})` }}
        />
      ) : (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900" />
          <div className="absolute inset-0 bg-subtle-grid opacity-10" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-4"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          {/* Tabs */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {(["buy", "rent"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSearchTab(tab)}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${
                  searchTab === tab
                    ? "bg-white text-gray-900 shadow-md"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl shadow-xl overflow-hidden">
            <svg className="w-5 h-5 text-gray-400 ml-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 px-3 py-4 sm:py-5 text-gray-900 placeholder-gray-400 focus:outline-none text-sm sm:text-base"
            />
            <button
              type="submit"
              className="px-6 sm:px-8 py-4 sm:py-5 bg-teal-600 text-white font-medium text-sm hover:bg-teal-700 transition-colors shrink-0"
            >
              {t("search")}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
      >
        <span className="text-[9px] text-white/40 tracking-[3px] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-5 bg-white/30"
        />
      </motion.div>
    </section>
  );
}

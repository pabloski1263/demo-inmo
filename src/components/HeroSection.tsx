"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLang(getLang());
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);

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
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {background_image ? (
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${background_image})` }}
          />
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-teal-950 to-gray-900" />
            <div className="absolute inset-0 bg-noise opacity-[0.04]" />
            <div className="absolute inset-0 bg-subtle-grid opacity-[0.06]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </motion.div>

      {/* Decorative gradient mesh */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl" />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center"
        style={{ y: textY, opacity }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.05] mb-6 tracking-wide"
        >
          {title}
        </motion.h1>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-16 h-px bg-gold-500/60 mx-auto mb-6 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-base sm:text-lg md:text-xl text-white/70 mb-12 max-w-xl mx-auto font-light tracking-wide"
        >
          {subtitle}
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-lg mx-auto"
        >
          {/* Tabs */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {(["buy", "rent"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSearchTab(tab)}
                className={`px-6 py-2 text-xs font-medium rounded-full tracking-wider uppercase transition-all ${
                  searchTab === tab
                    ? "bg-white/15 text-white border border-white/20 backdrop-blur-md"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden transition-all focus-within:border-white/20 focus-within:bg-white/15"
          >
            <svg className="w-5 h-5 text-white/40 ml-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 px-3 py-4 sm:py-4 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="px-6 sm:px-7 py-4 sm:py-4 bg-white/15 text-white text-sm font-medium hover:bg-white/25 transition-colors shrink-0 backdrop-blur-sm"
            >
              {t("search")}
            </button>
          </form>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] text-white/30 tracking-[4px] uppercase">Scroll</span>
        <svg className="w-4 h-4 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  );
}

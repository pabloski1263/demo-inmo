"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getLang, lt, type Lang } from "@/lib/utils";
import { staggerContainer, springUp } from "@/lib/animations";
import type { AgentProfile } from "@/lib/content";

interface HeroSectionProps {
  agent: AgentProfile;
  phone: string;
  email: string;
}

export default function HeroSection({ agent, phone, email }: HeroSectionProps) {
  const [lang, setLang] = useState<Lang>("es");
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

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);

  const fullName = `${agent.first_name} ${agent.last_name}`;
  const title = lt(lang, { en: agent.title_en, es: agent.title_es, fr: agent.title_en, de: agent.title_en, it: agent.title_en, pt: agent.title_es });
  const initials = `${agent.first_name[0]}${agent.last_name[0]}`;

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: { buy: "Buy", rent: "Rent", search: "Search", placeholder: "City, neighborhood or address..." },
      es: { buy: "Comprar", rent: "Arrendar", search: "Buscar", placeholder: "Ciudad, barrio o dirección..." },
      fr: { buy: "Acheter", rent: "Louer", search: "Rechercher", placeholder: "Ville, quartier ou adresse..." },
      de: { buy: "Kaufen", rent: "Mieten", search: "Suchen", placeholder: "Stadt, Stadtteil oder Adresse..." },
      it: { buy: "Acquista", rent: "Affitta", search: "Cerca", placeholder: "Città, quartiere o indirizzo..." },
      pt: { buy: "Comprar", rent: "Alugar", search: "Pesquisar", placeholder: "Cidade, bairro ou endereço..." },
    };
    return translations[lang]?.[key] || translations.en?.[key] || key;
  };

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
      {/* Background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-teal-950 to-gray-900" />
        <div className="absolute inset-0 bg-noise opacity-[0.04]" />
        <div className="absolute inset-0 bg-subtle-grid opacity-[0.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6"
        style={{ y: textY, opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[70vh]">
          {/* Left — Photo + Name + Title */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-6 sm:mb-8"
            >
              {agent.photo ? (
                <img
                  src={agent.photo}
                  alt={fullName}
                  className="w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full object-cover border-2 border-gold-500/30 shadow-2xl shadow-gold-500/10"
                />
              ) : (
                <div className="w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-br from-teal-800 to-gray-900 border-2 border-gold-500/30 shadow-2xl shadow-gold-500/10 flex items-center justify-center">
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-gold-400/80">
                    {initials}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.05] mb-3 tracking-wide">
              {fullName}
            </h1>

            {/* Gold accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-16 h-px bg-gold-500/60 mb-4 origin-left hidden lg:block"
            />

            {/* Title */}
            <p className="text-base sm:text-lg text-white/60 font-light tracking-wide max-w-lg mb-5">
              {title}
            </p>

            {/* Brokerage */}
            {agent.brokerage.name && (
              <p className="text-xs text-white/30 tracking-[2px] uppercase mb-6">
                {agent.brokerage.name}
              </p>
            )}

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-lg"
            >
              {agent.stats.map((stat) => (
                <motion.div
                  key={stat.label_en}
                  variants={springUp}
                  className="text-center"
                >
                  <p className="text-xl sm:text-2xl font-bold text-gold-400">{stat.value}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-[1px] mt-0.5">
                    {lt(lang, { en: stat.label_en, es: stat.label_es, fr: stat.label_en, de: stat.label_en, it: stat.label_en, pt: stat.label_es })}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Contact + Search */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center lg:items-start"
          >
            {/* Contact buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8 w-full max-w-md">
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-700 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                {lt(lang, { en: "Call Now", es: "Llamar", fr: "Appeler", de: "Anrufen", it: "Chiama", pt: "Ligar" })}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center justify-center gap-2 px-6 py-3.5 border border-white/20 hover:border-white/40 text-white text-sm font-medium rounded-lg transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {lt(lang, { en: "Email Me", es: "Enviar Correo", fr: "Envoyer un E-mail", de: "E-Mail Senden", it: "Invia Email", pt: "Enviar E-mail" })}
              </a>
              {agent.social.whatsapp && (
                <a
                  href={`https://wa.me/${agent.social.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 border border-white/20 hover:border-white/40 text-white text-sm font-medium rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              )}
            </div>

            {/* Search */}
            <div className="w-full max-w-md">
              {/* Search tabs */}
              <div className="flex items-center gap-1 mb-3">
                {(["buy", "rent"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSearchTab(tab)}
                    className={`px-5 py-1.5 text-xs font-medium rounded-full tracking-wider uppercase transition-all ${
                      searchTab === tab
                        ? "bg-white/15 text-white border border-white/20 backdrop-blur-md"
                        : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {t(tab)}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <form onSubmit={handleSearch} className="flex items-center bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden transition-all focus-within:border-white/20 focus-within:bg-white/15">
                <svg className="w-5 h-5 text-white/40 ml-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("placeholder")}
                  className="flex-1 px-3 py-4 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-4 bg-white/15 text-white text-sm font-medium hover:bg-white/25 transition-colors shrink-0 backdrop-blur-sm"
                >
                  {t("search")}
                </button>
              </form>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {agent.social.instagram && (
                <a href={agent.social.instagram} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all" aria-label="Instagram">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
              )}
              {agent.social.facebook && (
                <a href={agent.social.facebook} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all" aria-label="Facebook">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </a>
              )}
              {agent.social.linkedin && (
                <a href={agent.social.linkedin} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all" aria-label="LinkedIn">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
              )}
              {agent.social.youtube && (
                <a href={agent.social.youtube} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all" aria-label="YouTube">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                </a>
              )}
            </div>
          </motion.div>
        </div>
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

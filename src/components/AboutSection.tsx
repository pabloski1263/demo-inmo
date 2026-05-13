"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getLang, lt, type Lang } from "@/lib/utils";
import { slideLeft, slideRight } from "@/lib/animations";
import type { SiteContent } from "@/lib/content";

interface AboutSectionProps {
  content: SiteContent;
}

export default function AboutSection({ content }: AboutSectionProps) {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    setLang(getLang());
  }, []);

  const translations = content.translations;
  const t = (key: string) => translations[lang]?.[key] ?? translations.en?.[key] ?? key;

  const agent = content.agent;
  const title = lt(lang, { en: content.about.title_en, es: content.about.title_es, fr: content.about.title_en, de: content.about.title_en, it: content.about.title_en, pt: content.about.title_es });
  const bio = lt(lang, { en: agent.bio_en, es: agent.bio_es, fr: agent.bio_en, de: agent.bio_en, it: agent.bio_en, pt: agent.bio_es });
  const credentials = agent.credentials;
  const languages = agent.languages;
  const photo = agent.photo;
  const initials = `${agent.first_name[0]}${agent.last_name[0]}`;

  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-14 sm:gap-20 items-start">
          {/* Image */}
          <motion.div
            variants={slideRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-gray-100 rounded-xl -z-10" />
            {photo ? (
              <img
                src={photo}
                alt={title}
                className="w-full h-[28rem] object-cover rounded-xl shadow-sm"
              />
            ) : (
              <div className="w-full h-[28rem] bg-gradient-to-br from-teal-50 via-white to-gold-50 rounded-xl flex items-center justify-center border border-gray-100">
                <span className="text-7xl font-serif font-bold text-teal-300">{initials}</span>
              </div>
            )}
          </motion.div>

          {/* Text */}
          <motion.div
            variants={slideLeft}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="w-12 h-px bg-gold-500/60 mb-5" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-wide">
              {title}
            </h2>

            {bio && (
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-8">
                {bio}
              </p>
            )}

            {/* Credentials */}
            {credentials.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                  {t("common.credentials")}
                </h3>
                <ul className="space-y-2">
                  {credentials.map((cred, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {cred}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                  {t("common.languages")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <span
                      key={language}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-700"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-10 pt-10 border-t border-gray-100">
              {agent.stats.map((stat) => (
                <motion.div
                  key={stat.label_en}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-xl sm:text-2xl font-bold text-teal-700">{stat.value}</p>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[1px]">
                    {lt(lang, { en: stat.label_en, es: stat.label_es, fr: stat.label_en, de: stat.label_en, it: stat.label_en, pt: stat.label_es })}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

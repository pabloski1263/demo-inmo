"use client";

import { motion } from "framer-motion";
import { useLangTranslations } from "@/lib/utils";
import { slideLeft, slideRight } from "@/lib/animations";
import type { SiteContent } from "@/lib/content";

interface AboutSectionProps {
  content: SiteContent;
}

export default function AboutSection({ content }: AboutSectionProps) {
  const { lang } = useLangTranslations(content.translations);

  const title = lang === "en" ? content.about.title_en : content.about.title_es;
  const description = lang === "en" ? content.about.description_en : content.about.description_es;

  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-14 sm:gap-20 items-center">
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
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-gray-100">
              {[
                { number: "15+", label_en: "Years Experience", label_es: "Años de Experiencia" },
                { number: "500+", label_en: "Properties Sold", label_es: "Propiedades Vendidas" },
                { number: "98%", label_en: "Client Satisfaction", label_es: "Satisfacción del Cliente" },
              ].map((stat) => (
                <motion.div
                  key={stat.number}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-2xl sm:text-3xl font-bold text-teal-700">{stat.number}</p>
                  <p className="text-xs text-gray-500 mt-1">{lang === "en" ? stat.label_en : stat.label_es}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            variants={slideRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-gray-100 rounded-xl -z-10" />
            {content.about.image ? (
              <img
                src={content.about.image}
                alt={title}
                className="w-full h-[28rem] object-cover rounded-xl shadow-sm"
              />
            ) : (
              <div className="w-full h-[28rem] bg-gradient-to-br from-teal-50 via-white to-gold-50 rounded-xl flex items-center justify-center border border-gray-100">
                <svg className="w-20 h-20 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

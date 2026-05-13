"use client";

import { motion } from "framer-motion";
import { useLangTranslations } from "@/lib/utils";
import type { SiteContent } from "@/lib/content";

interface AboutSectionProps {
  content: SiteContent;
}

export default function AboutSection({ content }: AboutSectionProps) {
  const { lang } = useLangTranslations(content.translations);

  const title = lang === "en" ? content.about.title_en : content.about.title_es;
  const description = lang === "en" ? content.about.description_en : content.about.description_es;

  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-6">{title}</h2>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {content.about.image ? (
              <img src={content.about.image} alt={title} className="w-full h-80 object-cover rounded-xl" />
            ) : (
              <div className="w-full h-80 bg-gradient-to-br from-teal-100 to-teal-50 rounded-xl flex items-center justify-center">
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

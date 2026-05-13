"use client";

import { motion } from "framer-motion";
import { getLang } from "@/lib/utils";
import { staggerContainer, springUp } from "@/lib/animations";
import type { ServiceItem } from "@/lib/content";

interface ServicesSectionProps {
  title_en: string;
  title_es: string;
  items: ServiceItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  search: (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
  tag: (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  key: (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  chart: (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
};

export default function ServicesSection({ title_en, title_es, items }: ServicesSectionProps) {
  const lang = getLang();
  const title = lang === "en" ? title_en : title_es;

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-14"
        >
          <div className="w-12 h-px bg-gold-500/60 mx-auto mb-5" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-wide">
            {title}
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {items.map((item) => {
            const serviceTitle = lang === "en" ? item.title_en : item.title_es;
            const description = lang === "en" ? item.description_en : item.description_es;

            return (
              <motion.div
                key={item.id}
                variants={springUp}
                className="group text-center p-8 rounded-xl bg-white border border-gray-100/60 shadow-sm hover:shadow-lg hover:border-transparent transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-gold-50 text-gold-500 flex items-center justify-center mx-auto mb-5 group-hover:bg-teal-700 group-hover:text-white transition-all duration-500">
                  {iconMap[item.icon] || iconMap.search}
                </div>
                <h3 className="text-lg font-serif font-semibold text-gray-900 mb-2.5 tracking-wide">{serviceTitle}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

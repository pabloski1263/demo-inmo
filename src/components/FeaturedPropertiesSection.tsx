"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import { getLang } from "@/lib/utils";
import type { Property } from "@/lib/properties";

interface FeaturedProps {
  title_en: string;
  title_es: string;
  subtitle_en: string;
  subtitle_es: string;
}

export default function FeaturedPropertiesSection({ title_en, title_es, subtitle_en, subtitle_es }: FeaturedProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const lang = getLang();

  useEffect(() => {
    fetch("/api/properties?limit=6&sort=newest")
      .then((r) => r.json())
      .then((data) => setProperties(data.items || []));
  }, []);

  const title = lang === "en" ? title_en : title_es;
  const subtitle = lang === "en" ? subtitle_en : subtitle_es;

  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
          {properties.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="/properties"
            className="inline-flex items-center gap-2 text-teal-600 font-medium text-sm hover:text-teal-700 transition-colors"
          >
            {lang === "en" ? "View All Properties" : "Ver Todas las Propiedades"}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

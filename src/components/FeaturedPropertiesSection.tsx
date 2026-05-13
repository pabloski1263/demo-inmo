"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import { useReactiveLang, lt } from "@/lib/utils";
import { staggerContainer, springUp } from "@/lib/animations";
import type { Property } from "@/lib/properties";

interface FeaturedProps {
  title_en: string;
  title_es: string;
  subtitle_en: string;
  subtitle_es: string;
}

export default function FeaturedPropertiesSection({ title_en, title_es, subtitle_en, subtitle_es }: FeaturedProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const lang = useReactiveLang();

  useEffect(() => {
    fetch("/api/properties?limit=6&sort=newest")
      .then((r) => r.json())
      .then((data) => setProperties(data.items || []));
  }, []);

  const title = lt(lang, { en: title_en, es: title_es, fr: title_en, de: title_en, it: title_en, pt: title_es });
  const subtitle = lt(lang, { en: subtitle_en, es: subtitle_es, fr: subtitle_en, de: subtitle_en, it: subtitle_en, pt: subtitle_es });

  const [first, ...rest] = properties;

  return (
    <section className="py-20 sm:py-28 bg-[hsl(42,20%,96%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
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
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">{subtitle}</p>
        </motion.div>

        {/* Featured grid — asymmetric */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mb-12"
        >
          {/* First property — featured, larger */}
          {first && (
            <motion.div variants={springUp} className="mb-6 sm:mb-8 lg:col-span-2">
              <div className="max-w-2xl mx-auto lg:mx-0">
                <PropertyCard property={first} />
              </div>
            </motion.div>
          )}

          {/* Rest in regular grid */}
          {rest.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {rest.map((p) => (
                <motion.div key={p.id} variants={springUp}>
                  <PropertyCard property={p} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <a
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-teal-700 transition-colors group"
          >
            <span className="tracking-wider uppercase text-xs">{lt(lang, { en: "View All Properties", es: "Ver Todas las Propiedades", fr: "Voir Toutes les Propriétés", de: "Alle Immobilien Anzeigen", it: "Vedi Tutte le Proprietà", pt: "Ver Todas as Propriedades" })}</span>
            <span className="w-8 h-px bg-gray-300 group-hover:bg-teal-700 transition-colors" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

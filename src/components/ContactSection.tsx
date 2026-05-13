"use client";

import { motion } from "framer-motion";
import { getLang } from "@/lib/utils";
import { fadeUp, slideLeft, slideRight } from "@/lib/animations";

interface ContactSectionProps {
  title_en: string;
  title_es: string;
  address: string;
  phone: string;
  email: string;
  hours_en: string;
  hours_es: string;
}

export default function ContactSection({ title_en, title_es, address, phone, email, hours_en, hours_es }: ContactSectionProps) {
  const lang = getLang();
  const title = lang === "en" ? title_en : title_es;
  const hours = lang === "en" ? hours_en : hours_es;

  const contactItems = [
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: lang === "en" ? "Address" : "Dirección",
      value: address,
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
      label: lang === "en" ? "Phone" : "Teléfono",
      value: phone,
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: "Email",
      value: email,
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: lang === "en" ? "Hours" : "Horarios",
      value: hours,
    },
  ];

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[hsl(42,20%,96%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="w-12 h-px bg-gold-500/60 mx-auto mb-5" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-wide">
            {title}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-14">
          {/* Contact info */}
          <motion.div
            variants={slideLeft}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-7"
          >
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-white text-gold-500 flex items-center justify-center shrink-0 shadow-sm border border-gray-100 group-hover:bg-teal-700 group-hover:text-white group-hover:border-transparent transition-all duration-500">
                  {item.icon}
                </div>
                <div className="pt-0.5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-[2px] font-medium">{item.label}</p>
                  <p className="text-sm text-gray-800 mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            variants={slideRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <form
              action={`mailto:${email}`}
              method="get"
              encType="text/plain"
              className="space-y-5"
            >
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder={lang === "en" ? "Your Name" : "Tu Nombre"}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 transition-all"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="from"
                  placeholder="Email"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 transition-all"
                  required
                />
              </div>
              <div>
                <textarea
                  name="body"
                  rows={5}
                  placeholder={lang === "en" ? "Your Message" : "Tu Mensaje"}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 transition-all resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3.5 bg-teal-700 text-white font-medium rounded-lg hover:bg-teal-600 transition-all text-sm tracking-wide"
              >
                {lang === "en" ? "Send Message" : "Enviar Mensaje"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

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
  whatsapp?: string;
  review_link?: string;
  review_text_en?: string;
  review_text_es?: string;
}

export default function ContactSection({ title_en, title_es, address, phone, email, hours_en, hours_es, whatsapp, review_link, review_text_en, review_text_es }: ContactSectionProps) {
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

            {/* WhatsApp */}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 shadow-sm border border-green-100 group-hover:bg-green-600 group-hover:text-white group-hover:border-transparent transition-all duration-500">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="pt-0.5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-[2px] font-medium">WhatsApp</p>
                  <p className="text-sm text-gray-800 mt-0.5">{lang === "en" ? "Send a Message" : "Enviar Mensaje"}</p>
                </div>
              </a>
            )}

            {/* Review link */}
            {review_link && (
              <a
                href={review_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-gold-50 text-gold-500 flex items-center justify-center shrink-0 shadow-sm border border-gold-100 group-hover:bg-teal-700 group-hover:text-white group-hover:border-transparent transition-all duration-500">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className="pt-0.5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-[2px] font-medium">{lang === "en" ? "Reviews" : "Reseñas"}</p>
                  <p className="text-sm text-gray-800 mt-0.5">{lang === "en" ? review_text_en : review_text_es}</p>
                </div>
              </a>
            )}
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

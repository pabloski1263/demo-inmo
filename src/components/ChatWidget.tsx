"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReactiveLang, lt } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatConfig {
  enabled: boolean;
  greeting_en: string;
  greeting_es: string;
  greeting_fr: string;
  greeting_de: string;
  greeting_it: string;
  greeting_pt: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lang = useReactiveLang();

  useEffect(() => {
    fetch("/api/chat/config")
      .then((r) => r.json())
      .then((data) => {
        setConfig(data);
        if (data.enabled) {
          const greeting = lt(lang, {
            en: data.greeting_en || "",
            es: data.greeting_es || "",
            fr: data.greeting_fr || "",
            de: data.greeting_de || "",
            it: data.greeting_it || "",
            pt: data.greeting_pt || "",
          });
          if (greeting) {
            setMessages([{ role: "assistant", content: greeting }]);
          }
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update greeting when language changes
  useEffect(() => {
    if (!config?.enabled || messages.length === 0) return;
    const firstMsg = messages[0];
    if (firstMsg?.role !== "assistant") return;

    const greeting = lt(lang, {
      en: config.greeting_en || "",
      es: config.greeting_es || "",
      fr: config.greeting_fr || "",
      de: config.greeting_de || "",
      it: config.greeting_it || "",
      pt: config.greeting_pt || "",
    });
    if (greeting && firstMsg.content !== greeting) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[0] = { ...updated[0], content: greeting };
        return updated;
      });
    }
  }, [lang, config, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg], lang }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: lt(lang, {
          en: "Sorry, an error occurred. Please try again.",
          es: "Lo siento, ocurrió un error. Intenta de nuevo.",
          fr: "Désolé, une erreur s'est produite. Veuillez réessayer.",
          de: "Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
          it: "Spiacente, si è verificato un errore. Riprova.",
          pt: "Desculpe, ocorreu um erro. Tente novamente.",
        })},
      ]);
    }
    setLoading(false);
  };

  if (!config?.enabled) return null;

  const headerTitle = lt(lang, {
    en: "Sebastián Acosta Assistant",
    es: "Asistente Sebastián Acosta",
    fr: "Assistant Sebastián Acosta",
    de: "Assistent Sebastián Acosta",
    it: "Assistente Sebastián Acosta",
    pt: "Assistente Sebastián Acosta",
  });

  const headerSubtitle = lt(lang, {
    en: "Ask about properties",
    es: "Consulta sobre propiedades",
    fr: "Renseignez-vous sur les propriétés",
    de: "Fragen zu Immobilien",
    it: "Informazioni sulle proprietà",
    pt: "Consulte sobre propriedades",
  });

  const inputPlaceholder = lt(lang, {
    en: "Write your message...",
    es: "Escribe tu mensaje...",
    fr: "Écrivez votre message...",
    de: "Schreiben Sie Ihre Nachricht...",
    it: "Scrivi il tuo messaggio...",
    pt: "Escreva sua mensagem...",
  });

  return (
    <>
      {/* Bubble button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-teal-600 text-white shadow-lg hover:bg-teal-700 transition-all flex items-center justify-center"
        aria-label="Chat"
      >
        {open ? (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-teal-600 text-white px-4 py-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold">{headerTitle}</p>
                <p className="text-[10px] text-white/70">{headerSubtitle}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-teal-600 text-white rounded-br-md"
                        : "bg-gray-50 text-gray-700 rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 text-gray-500 px-3.5 py-2.5 rounded-xl rounded-bl-md text-sm">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={inputPlaceholder}
                  disabled={loading}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

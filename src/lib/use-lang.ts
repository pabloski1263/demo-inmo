"use client";

import { useState, useEffect } from "react";
import { getLang, switchLang } from "@/lib/utils";

export function useLang() {
  const [lang, setLang] = useState<"en" | "es">("es");

  useEffect(() => {
    setLang(getLang());
  }, []);

  const toggle = () => {
    const next = lang === "es" ? "en" : "es";
    switchLang(next);
    setLang(next);
  };

  return { lang, toggle };
}

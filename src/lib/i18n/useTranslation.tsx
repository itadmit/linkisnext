"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { translations, Language, rtlLanguages } from "./translations";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("he");
  const [isRTL, setIsRTL] = useState(true);

  useEffect(() => {
    // Check localStorage for saved language
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
      const isRtl = rtlLanguages.includes(savedLang);
      setIsRTL(isRtl);
      document.documentElement.dir = isRtl ? "rtl" : "ltr";
      document.documentElement.lang = savedLang;
    } else {
      // Default to Hebrew
      setLanguageState("he");
      setIsRTL(true);
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "he";
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setIsRTL(rtlLanguages.includes(lang));
    localStorage.setItem("language", lang);
    // Update HTML dir attribute
    document.documentElement.dir = rtlLanguages.includes(lang) ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
}


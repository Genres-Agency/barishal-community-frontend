"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Locale, TranslationDictionary } from "./types";
import { bn } from "./dictionaries/bn";
import { en } from "./dictionaries/en";

const dictionaries: Record<Locale, TranslationDictionary> = { bn, en };

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationDictionary;
  toBnDigits: (value: number | string) => string;
  formatCurrency: (amount: number) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliDigits(val: number | string): string {
  const str = String(val);
  return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)]);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("bn");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("barishal_locale") as Locale;
      if (stored === "en" || stored === "bn") {
        setLocaleState(stored);
        document.documentElement.lang = stored;
      } else {
        document.documentElement.lang = "bn";
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("barishal_locale", newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // ignore
    }
  };

  const toBnDigits = (value: number | string): string => {
    if (locale === "bn") {
      return toBengaliDigits(value);
    }
    return String(value);
  };

  const formatCurrency = (amount: number): string => {
    const formatted = locale === "bn" ? toBengaliDigits(amount) : amount.toLocaleString();
    return `৳${formatted}`;
  };

  const value: LocaleContextType = {
    locale: mounted ? locale : "bn",
    setLocale,
    t: dictionaries[locale] || bn,
    toBnDigits,
    formatCurrency,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

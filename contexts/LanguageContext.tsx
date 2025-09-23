import React, { createContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../data/locales';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  // Fix: Allow `t` function to return non-string types (like arrays) for translation keys that have array values.
  t: (key: string, replacements?: { [key: string]: string | number }) => any;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

const supportedLanguages = ['en', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'nl', 'ru', 'ar', 'zh', 'hi', 'ko', 'tr', 'id'];
const defaultLanguage = 'en';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang && supportedLanguages.includes(savedLang) ? savedLang : defaultLanguage;
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      setLanguageState(lang);
    }
  };

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    const langTranslations = translations[language as keyof typeof translations] || translations.en;
    
    const keys = key.split('.');
    let result: any = langTranslations;
    for (const k of keys) {
      if (result === undefined) {
        result = undefined;
        break;
      }
      result = result[k];
    }
    
    const translation = result === undefined ? key : result;

    if (typeof translation === 'string' && replacements) {
        let replaced = translation;
        Object.keys(replacements).forEach(rKey => {
            replaced = replaced.replace(`{${rKey}}`, String(replacements[rKey]));
        });
        return replaced;
    }

    return translation;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../data/locales';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => any;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

const supportedLanguages = ['en', 'de', 'ja', 'ru', 'es', 'fr'];
const rtlLanguages: string[] = [];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (supportedLanguages.includes(browserLang)) {
        setLanguageState(browserLang);
      }
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    const langTranslations: any = translations[language as keyof typeof translations] || translations.en;
    
    const keys = key.split('.');
    let result: any = langTranslations;
    for (const k of keys) {
      if (result === undefined) {
        result = undefined;
        break;
      }
      result = result[k];
    }
    
    // Fallback to English if translation is missing
    if (result === undefined && language !== 'en') {
        let englishResult: any = translations.en;
        for (const k of keys) {
            if (englishResult === undefined) {
                englishResult = undefined;
                break;
            }
            englishResult = englishResult[k];
        }
        result = englishResult;
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
import React, { createContext, useEffect, useCallback } from 'react';
import { translations } from '../data/locales';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => any;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const language = 'en';

  const setLanguage = (lang: string) => {
    // This function is now a no-op as the language is fixed to English.
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';
  }, []);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    const langTranslations: any = translations.en;
    
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
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

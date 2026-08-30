import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, getTranslations, defaultLanguage } from '../lib/i18n';
import { en } from '../lib/i18n/en';
import { offlineStorage } from '../lib/storage';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: typeof en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(offlineStorage.KEYS.LANGUAGE) as LanguageCode;
    return saved && ['en', 'hi', 'mr'].includes(saved) ? saved : defaultLanguage;
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(offlineStorage.KEYS.LANGUAGE, lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = getTranslations(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

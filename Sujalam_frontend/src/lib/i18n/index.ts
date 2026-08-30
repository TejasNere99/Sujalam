import { en } from './en';
import { hi } from './hi';
import { mr } from './mr';

export type LanguageCode = 'en' | 'hi' | 'mr';

export const translations = {
  en,
  hi,
  mr,
};

export const languages: Array<{ code: LanguageCode; label: string; nativeLabel: string }> = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
];

export const defaultLanguage: LanguageCode = 'en';

export function getTranslations(lang: LanguageCode) {
  return translations[lang] || translations.en;
}

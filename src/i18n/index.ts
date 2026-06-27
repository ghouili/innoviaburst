import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import fr from './fr.json';
import { DEFAULT_LOCALE } from '@/lib/i18n-routing';

const isBrowser = typeof window !== 'undefined';

// The browser language detector reads localStorage/navigator, which don't
// exist during server rendering — only register it in the browser. On the
// server the language is set explicitly per request via `changeLanguage`.
const instance = i18n.use(initReactI18next);
if (isBrowser) {
  instance.use(LanguageDetector);
}

if (!i18n.isInitialized) {
  instance.init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    lng: isBrowser ? undefined : DEFAULT_LOCALE,
    supportedLngs: ['en', 'fr'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });
}

export default i18n;

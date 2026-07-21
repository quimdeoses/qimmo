import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import es from './locales/es'
import ca from './locales/ca'
import en from './locales/en'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      ca: { translation: ca },
      en: { translation: en },
    },
    fallbackLng: 'es',
    supportedLngs: ['es', 'ca', 'en'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'qimmo_lang',
    },
    interpolation: { escapeValue: false },
  })

export default i18n
export const LANGS = [
  { code: 'es', label: 'ES', full: 'Español' },
  { code: 'ca', label: 'CA', full: 'Català' },
  { code: 'en', label: 'EN', full: 'English' },
] as const

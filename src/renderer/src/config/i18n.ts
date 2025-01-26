import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import pt from './locales/pt.json'
i18n
  .use(LanguageDetector) // Detecta idioma do navegador
  .use(initReactI18next) // Integra com React
  .init({
    fallbackLng: 'en', // Idioma padrão (caso o idioma detectado não esteja disponível)
    resources: {
      en: {
        translation: en
      },
      pt: {
        translation: pt
      }
    },
    interpolation: {
      escapeValue: false // React já lida com segurança contra XSS
    }
  })

export default i18n

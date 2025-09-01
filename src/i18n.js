import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./localization/en.json";
import translationAR from "./localization/ar.json";

i18n
  .use(LanguageDetector) // ADD THIS LINE
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      ar: { translation: translationAR },
    },
  });

export default i18n;

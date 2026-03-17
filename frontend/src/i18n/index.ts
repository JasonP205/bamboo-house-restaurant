import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enAuth from "./locales/en/auth.json";
import viAuth from "./locales/vi/auth.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",

    ns: ["auth", "home", "common"],

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    resources: {
      en: {
        auth: enAuth,
      },
      vi: {
        auth: viAuth,
      },
    },
  });

export default i18n;
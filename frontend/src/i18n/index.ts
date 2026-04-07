import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",

    ns: ["auth", "branch", "common", "dishes"],

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;